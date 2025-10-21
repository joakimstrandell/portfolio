import type { GridBackgroundConfig, GridBackgroundController, CellState } from './types';
import { createCellManager } from './cellManager';
import { createGameManager } from './gameManager';
import { drawGrid, drawCells, drawDot, clearCanvas } from './gridRenderer';
import { getCssVariable, getRGB } from '@/lib/utils';

export const createGridBackgroundController = (
  canvas: HTMLCanvasElement,
  config: GridBackgroundConfig,
): GridBackgroundController => {
  const { cellSize = 24, fadeRate = 0.015, maxCells = 200, enableGame = false, dotColor, onScoreChange } = config;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas 2D context');
  }

  // Create managers
  const cellManager = createCellManager(maxCells, cellSize);
  const gameManager = createGameManager(cellSize, enableGame, onScoreChange);

  // State
  let animationFrameId: number | null = null;
  let isRunning = false;
  let previousMousePos = { x: 0, y: 0 };
  let canvasWidth = canvas.width;
  let canvasHeight = canvas.height;
  let isOverInteractiveElement = false;
  let isFirstMouseMove = true;

  // Helper to get cell key from position
  const getCellKey = (x: number, y: number): string => `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`;

  // Animation loop
  const animate = () => {
    if (!isRunning) return;

    // Update cell intensities
    cellManager.updateCells(fadeRate);

    // Update game animation
    if (gameManager.isEnabled()) {
      gameManager.updateAnimation();
    }

    // Clear and redraw
    clearCanvas(ctx, canvasWidth, canvasHeight);

    // Get foreground color from CSS variable
    const foregroundRGB = getRGB(getCssVariable('--accent')) || 'rgb(0, 0, 0)';

    // Draw grid
    drawGrid(ctx, canvasWidth, canvasHeight, cellSize, foregroundRGB);

    // Draw active cells
    drawCells(ctx, cellManager.getCells(), cellSize, foregroundRGB);

    // Draw collectible dot if game is active
    const dot = gameManager.getDot();
    if (gameManager.isEnabled() && dot) {
      const resolvedDotColor = dotColor || getRGB(getCssVariable('--accent')) || 'rgba(255, 0, 0, 1)';
      drawDot(ctx, dot, cellSize, resolvedDotColor);
    }

    animationFrameId = requestAnimationFrame(animate);
  };

  const start = (): void => {
    if (isRunning) return;

    isRunning = true;

    // Spawn initial dot if game is enabled
    if (gameManager.isEnabled() && !gameManager.getDot()) {
      gameManager.spawnDot(canvasWidth, canvasHeight);
    }

    // Set up mouse enter/leave listeners for interactive elements
    const handleMouseEnter = (e: Event) => {
      const target = e.target as Element;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA' ||
          getComputedStyle(target).cursor === 'pointer' ||
          target.closest('button') ||
          target.closest('a') ||
          target.closest('input') ||
          target.closest('select') ||
          target.closest('textarea') ||
          (target.hasAttribute('role') && target.getAttribute('role') === 'button'))
      ) {
        isOverInteractiveElement = true;
        cellManager.clearHoverCell();
      }
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.target as Element;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA' ||
          getComputedStyle(target).cursor === 'pointer' ||
          target.closest('button') ||
          target.closest('a') ||
          target.closest('input') ||
          target.closest('select') ||
          target.closest('textarea') ||
          (target.hasAttribute('role') && target.getAttribute('role') === 'button'))
      ) {
        isOverInteractiveElement = false;
      }
    };

    // Add listeners to all interactive elements
    const interactiveElements = document.querySelectorAll(
      'button, a, input, select, textarea, [role="button"], [style*="cursor: pointer"]',
    );
    interactiveElements.forEach((element) => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    // Store references for cleanup
    (
      window as unknown as {
        __gridInteractiveListeners?: {
          handleMouseEnter: (e: Event) => void;
          handleMouseLeave: (e: Event) => void;
          interactiveElements: NodeListOf<Element>;
        };
      }
    ).__gridInteractiveListeners = { handleMouseEnter, handleMouseLeave, interactiveElements };

    animate();
  };

  const stop = (): void => {
    isRunning = false;
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  const handleMouseMove = (x: number, y: number): void => {
    const newPos = { x, y };
    const prevPos = previousMousePos;

    // Only update hover cell if not over an interactive element
    if (!isOverInteractiveElement) {
      cellManager.setHoverCell(x, y);
    } else {
      cellManager.clearHoverCell();
    }

    // Only add cells if not over an interactive element
    if (!isOverInteractiveElement) {
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

  const handleMouseLeave = (): void => {
    // Clear all cells when cursor leaves the document
    cellManager.clear();
    cellManager.clearHoverCell();
    // Reset first mouse move flag so no path animation occurs on re-enter
    isFirstMouseMove = true;
  };

  const resize = (width: number, height: number): void => {
    canvas.width = width;
    canvas.height = height;
    canvasWidth = width;
    canvasHeight = height;
  };

  const destroy = (): void => {
    stop();
    cellManager.clear();

    // Clean up interactive element listeners
    const listeners = (
      window as unknown as {
        __gridInteractiveListeners?: {
          handleMouseEnter: (e: Event) => void;
          handleMouseLeave: (e: Event) => void;
          interactiveElements: NodeListOf<Element>;
        };
      }
    ).__gridInteractiveListeners;
    if (listeners) {
      listeners.interactiveElements.forEach((element: Element) => {
        element.removeEventListener('mouseenter', listeners.handleMouseEnter);
        element.removeEventListener('mouseleave', listeners.handleMouseLeave);
      });
      delete (
        window as unknown as {
          __gridInteractiveListeners?: {
            handleMouseEnter: (e: Event) => void;
            handleMouseLeave: (e: Event) => void;
            interactiveElements: NodeListOf<Element>;
          };
        }
      ).__gridInteractiveListeners;
    }
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
