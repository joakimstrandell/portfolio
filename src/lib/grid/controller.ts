import type { GridController } from './types';
import { createCellManager } from '../grid-background/cellManager';
import { drawGrid, drawCells, clearCanvas } from '../grid-background/gridRenderer';
import { getCssVariable, getRGB } from '../utils';

/**
 * Configuration for the grid controller
 */
export interface GridControllerConfig {
  cellSize?: number;
  fadeRate?: number;
  maxCells?: number;
}

/**
 * Creates the main controller for the grid animation
 * Handles mouse events, animation loop, and coordinates between managers
 *
 * @param canvas HTML canvas element to render on
 * @param config Configuration options for the grid
 * @returns GridController interface
 */
export const createGridController = (canvas: HTMLCanvasElement, config: GridControllerConfig): GridController => {
  const { cellSize = 24, fadeRate = 0.015, maxCells = 200 } = config;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas 2D context');
  }

  // Create cell manager
  const cellManager = createCellManager(maxCells, cellSize);

  // Animation state
  let animationFrameId: number | null = null;
  let isRunning = false;
  let previousMousePos = { x: 0, y: 0 };
  let canvasWidth = canvas.width;
  let canvasHeight = canvas.height;
  let isFirstMouseMove = true; // Prevents initial path animation from top-left
  let currentFadeRate = fadeRate; // Current fade rate (can be temporarily increased)
  const fastFadeRate = 0.15; // Fast fade rate when entering interactive elements

  /**
   * Main animation loop that runs at 60fps
   * Updates cell states and redraws the canvas
   */
  const animate = () => {
    if (!isRunning) return;

    // Update cell intensities (fade out over time)
    // Use current fade rate (may be temporarily increased for fast fade)
    cellManager.updateCells(currentFadeRate);

    // Gradually return to normal fade rate after fast fade
    if (currentFadeRate > fadeRate) {
      currentFadeRate = Math.max(fadeRate, currentFadeRate * 0.95);
    }

    const foregroundColor = getRGB(getCssVariable('--foreground')) || 'rgb(0, 0, 0)';
    const accentColor = getRGB(getCssVariable('--accent')) || 'rgb(0, 0, 0)';

    // Clear canvas for fresh frame
    clearCanvas(ctx, canvasWidth, canvasHeight);

    // Draw static grid lines
    drawGrid(ctx, canvasWidth, canvasHeight, cellSize, foregroundColor);

    // Draw active cells with their current intensities
    drawCells(ctx, cellManager.getCells(), cellSize, accentColor);

    // Schedule next frame
    animationFrameId = requestAnimationFrame(animate);
  };

  /**
   * Starts the animation and sets up event listeners
   */
  const start = (): void => {
    if (isRunning) return;

    isRunning = true;

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
   * Uses canvas-relative coordinates
   *
   * @param x Canvas-relative x coordinate
   * @param y Canvas-relative y coordinate
   * @param isOverInteractive Optional flag indicating if cursor is over an interactive element
   */
  const handleMouseMove = (x: number, y: number, isOverInteractive = false): void => {
    // Ensure coordinates are within canvas bounds
    if (x < 0 || x > canvasWidth || y < 0 || y > canvasHeight) {
      return;
    }

    // Skip cell updates if cursor is over an interactive element
    if (isOverInteractive) {
      cellManager.clearHoverCell();
      return;
    }

    const newPos = { x, y };
    const prevPos = previousMousePos;

    // Update hover cell
    cellManager.setHoverCell(x, y);

    // Skip path animation on first mouse move (prevents line from top-left on page load)
    if (isFirstMouseMove) {
      cellManager.addCell(x, y);
      isFirstMouseMove = false;
    } else {
      // Add cells along the path from previous to current position
      // This prevents skipping cells during fast cursor movement
      cellManager.addCellsAlongPath(prevPos.x, prevPos.y, x, y);
    }

    previousMousePos = newPos;
  };

  /**
   * Handles mouse leaving the canvas
   * Clears all cells and resets state for clean re-entry
   */
  const handleMouseLeave = (): void => {
    // Clear all cells when cursor leaves the canvas
    cellManager.clear();
    cellManager.clearHoverCell();
    // Reset first mouse move flag so no path animation occurs on re-enter
    isFirstMouseMove = true;
    // Reset fade rate to normal
    currentFadeRate = fadeRate;
  };

  /**
   * Triggers fast fade out of all cells
   * Useful when cursor enters an interactive element
   * Clears all cells and resets trace state so grid starts fresh when cursor returns
   */
  const triggerFastFade = (): void => {
    // Clear all cells immediately
    cellManager.clear();
    cellManager.clearHoverCell();
    // Reset first mouse move flag so trace doesn't animate when cursor returns
    isFirstMouseMove = true;
    // Set fast fade rate (cells will fade out quickly if any remain)
    currentFadeRate = fastFadeRate;
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
    triggerFastFade,
    resize,
    destroy,
  };
};
