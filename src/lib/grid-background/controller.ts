import type { GridBackgroundConfig, GridBackgroundController, CellState } from './types';
import { createCellManager } from './cellManager';
import { createGameManager } from './gameManager';
import { drawGrid, drawCells, drawDot, clearCanvas } from './gridRenderer';
import { getCssVariable, getRGB } from '@/lib/utils';

/**
 * Creates the main controller for the grid background animation
 * Handles mouse events, animation loop, and coordinates between managers
 *
 * @param canvas HTML canvas element to render on
 * @param config Configuration options for the grid background
 * @returns GridBackgroundController interface
 */
export const createGridBackgroundController = (
  canvas: HTMLCanvasElement,
  config: GridBackgroundConfig,
): GridBackgroundController => {
  const { cellSize = 24, fadeRate = 0.015, maxCells = 200, enableGame = false, dotColor, onScoreChange } = config;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas 2D context');
  }

  // Create managers for different aspects of the animation
  const cellManager = createCellManager(maxCells, cellSize);
  const gameManager = createGameManager(cellSize, enableGame, onScoreChange);

  // Animation state
  let animationFrameId: number | null = null;
  let isRunning = false;
  let previousMousePos = { x: 0, y: 0 };
  let canvasWidth = canvas.width;
  let canvasHeight = canvas.height;
  let isFirstMouseMove = true; // Prevents initial path animation from top-left

  /**
   * Converts screen coordinates to a unique cell key
   * @param x Screen x coordinate
   * @param y Screen y coordinate
   * @returns String key in format "col,row"
   */
  const getCellKey = (x: number, y: number): string => `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`;

  /**
   * Main animation loop that runs at 60fps
   * Updates cell states, handles game logic, and redraws the canvas
   */
  const animate = () => {
    if (!isRunning) return;

    // Update cell intensities (fade out over time)
    cellManager.updateCells(fadeRate);

    // Update game animation (dot pulsing, etc.)
    if (gameManager.isEnabled()) {
      gameManager.updateAnimation();
    }

    // Clear canvas for fresh frame
    clearCanvas(ctx, canvasWidth, canvasHeight);

    // Get foreground color from CSS custom property
    const foregroundRGB = getRGB(getCssVariable('--foreground')) || 'rgb(0, 0, 0)';
    const accentRGB = getRGB(getCssVariable('--accent')) || 'rgba(255, 0, 0, 1)';

    // Draw static grid lines
    drawGrid(ctx, canvasWidth, canvasHeight, cellSize, foregroundRGB);

    // Draw active cells with their current intensities
    drawCells(ctx, cellManager.getCells(), cellSize, accentRGB);

    // Draw collectible dot if game mode is enabled
    const dot = gameManager.getDot();
    if (gameManager.isEnabled() && dot) {
      const resolvedDotColor = dotColor || accentRGB;
      drawDot(ctx, dot, cellSize, resolvedDotColor);
    }

    // Schedule next frame
    animationFrameId = requestAnimationFrame(animate);
  };

  /**
   * Starts the animation and sets up event listeners
   * Initializes game mode if enabled and sets up interactive element detection
   */
  const start = (): void => {
    if (isRunning) return;

    isRunning = true;

    // Spawn initial collectible dot if game mode is enabled
    if (gameManager.isEnabled() && !gameManager.getDot()) {
      gameManager.spawnDot(canvasWidth, canvasHeight);
    }

    // Start the animation loop
    animate();
  };

  /**
   * Stops the animation loop
   */
  const stop = (): void => {
    isRunning = false;
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  /**
   * Handles mouse movement events
   * Updates hover cell and adds cells along the cursor path
   * Prevents path animation on first move and when over interactive elements
   *
   * @param e Mouse event containing coordinates and target element
   */
  const handleMouseMove = (e: MouseEvent): void => {
    const x = e.clientX;
    const y = e.clientY;
    const newPos = { x, y };
    const prevPos = previousMousePos;

    // Check if mouse is over an interactive element
    const target = e.target as Element;
    const isOverInteractive =
      target &&
      (target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea') ||
        (target.hasAttribute('role') && target.getAttribute('role') === 'button'));

    // Only update hover cell if not over an interactive element
    if (!isOverInteractive) {
      cellManager.setHoverCell(x, y);
    } else {
      cellManager.clearHoverCell();
    }

    // Only add cells if not over an interactive element
    if (!isOverInteractive) {
      // Skip path animation on first mouse move (prevents line from top-left on page load)
      if (isFirstMouseMove) {
        cellManager.addCell(x, y);
        isFirstMouseMove = false;
      } else {
        // Add cells along the path from previous to current position
        // This prevents skipping cells during fast cursor movement
        cellManager.addCellsAlongPath(prevPos.x, prevPos.y, x, y);
      }
    }

    // Always check for dot collection regardless of interactive elements
    if (gameManager.isEnabled() && gameManager.checkCollection(x, y)) {
      // Create collection effect (flash the cell)
      const dot = gameManager.getDot();
      if (dot) {
        const cells = cellManager.getCells() as Map<string, CellState>;
        const cellKey = getCellKey(dot.x, dot.y);

        // Add intense flash at collection point
        cells.set(cellKey, {
          x: Math.floor(dot.x / cellSize) * cellSize,
          y: Math.floor(dot.y / cellSize) * cellSize,
          intensity: 2.0, // Extra bright for flash effect
          timestamp: Date.now(),
        });
      }

      // Spawn new dot
      gameManager.spawnDot(canvasWidth, canvasHeight);
    }

    previousMousePos = newPos;
  };

  /**
   * Handles mouse leaving the document
   * Clears all cells and resets state for clean re-entry
   */
  const handleMouseLeave = (): void => {
    // Clear all cells when cursor leaves the document
    cellManager.clear();
    cellManager.clearHoverCell();
    // Reset first mouse move flag so no path animation occurs on re-enter
    isFirstMouseMove = true;
  };

  /**
   * Resizes the canvas and updates internal dimensions
   * @param width New canvas width
   * @param height New canvas height
   */
  const resize = (width: number, height: number): void => {
    canvas.width = width;
    canvas.height = height;
    canvasWidth = width;
    canvasHeight = height;
  };

  /**
   * Destroys the controller and cleans up all resources
   * Stops animation, clears cells, and removes event listeners
   */
  const destroy = (): void => {
    stop();
    cellManager.clear();
  };

  return {
    start,
    stop,
    handleMouseMove,
    handleMouseLeave,
    resize,
    destroy,
  };
};
