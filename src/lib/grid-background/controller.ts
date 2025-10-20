import type { GridBackgroundConfig, GridBackgroundController } from './types';
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
    const foregroundRGB = getRGB(getCssVariable('--foreground')) || 'rgb(0, 0, 0)';

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

    // Calculate distance between previous and new position
    const distance = Math.sqrt(Math.pow(newPos.x - prevPos.x, 2) + Math.pow(newPos.y - prevPos.y, 2));

    if (distance > 0) {
      // Calculate how many cells to add based on distance
      const steps = Math.max(1, Math.ceil(distance / (cellSize / 2)));

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const interpolatedX = prevPos.x + (newPos.x - prevPos.x) * t;
        const interpolatedY = prevPos.y + (newPos.y - prevPos.y) * t;

        cellManager.addCell(interpolatedX, interpolatedY);

        // Check for dot collection along the path
        if (gameManager.isEnabled() && gameManager.checkCollection(interpolatedX, interpolatedY)) {
          // Create collection effect (flash the cell)
          const dot = gameManager.getDot();
          if (dot) {
            const cells = cellManager.getCells() as Map<string, any>;
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
      }
    }

    previousMousePos = newPos;
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
  };

  return {
    start,
    stop,
    handleMouseMove,
    resize,
    destroy,
  };
};
