import type { GridController, CellState } from './types';
import { createCellManager } from '../grid-background/cellManager';
import { drawGrid, drawCells, clearCanvas } from '../grid-background/gridRenderer';
import { getCssVariable, getRGB } from '@/lib/utils';

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
export const createGridController = (
  canvas: HTMLCanvasElement,
  config: GridControllerConfig,
): GridController => {
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

  /**
   * Converts screen coordinates to a unique cell key
   * @param x Canvas x coordinate
   * @param y Canvas y coordinate
   * @returns String key in format "col,row"
   */
  const getCellKey = (x: number, y: number): string => `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`;

  /**
   * Main animation loop that runs at 60fps
   * Updates cell states and redraws the canvas
   */
  const animate = () => {
    if (!isRunning) return;

    // Update cell intensities (fade out over time)
    cellManager.updateCells(fadeRate);

    // Clear canvas for fresh frame
    clearCanvas(ctx, canvasWidth, canvasHeight);

    // Get foreground color from CSS custom property
    const foregroundRGB = getRGB(getCssVariable('--foreground')) || 'rgb(0, 0, 0)';
    const accentRGB = getRGB(getCssVariable('--accent')) || 'rgba(255, 0, 0, 1)';

    // Draw static grid lines
    drawGrid(ctx, canvasWidth, canvasHeight, cellSize, foregroundRGB);

    // Draw active cells with their current intensities
    drawCells(ctx, cellManager.getCells(), cellSize, accentRGB);

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
   */
  const handleMouseMove = (x: number, y: number): void => {
    // Ensure coordinates are within canvas bounds
    if (x < 0 || x > canvasWidth || y < 0 || y > canvasHeight) {
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

