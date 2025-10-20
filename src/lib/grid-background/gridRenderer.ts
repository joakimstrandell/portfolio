import type { CellState, DotState } from './types';

/**
 * Draw the grid lines on the canvas
 */
export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cellSize: number,
  foregroundColor: string,
): void => {
  ctx.strokeStyle = foregroundColor;
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.15;

  // Draw vertical lines
  for (let x = 0; x <= width; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Draw horizontal lines
  for (let y = 0; y <= height; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};

/**
 * Draw all active cells with their current intensity
 */
export const drawCells = (
  ctx: CanvasRenderingContext2D,
  cells: ReadonlyMap<string, CellState>,
  cellSize: number,
  foregroundColor: string,
): void => {
  const padding = 1;

  cells.forEach((cell) => {
    // Parse RGB from color string and apply intensity-based alpha
    const alpha = cell.intensity * 0.2;
    const colorWithAlpha = foregroundColor.replace(/rgb\(([^)]+)\)/, `rgba($1, ${alpha})`);

    ctx.fillStyle = colorWithAlpha;
    ctx.globalAlpha = 1;

    // Draw cell with slight padding for better visual effect
    ctx.fillRect(cell.x + padding, cell.y + padding, cellSize - padding * 2, cellSize - padding * 2);
  });
};

/**
 * Draw the collectible dot with pulse animation
 */
export const drawDot = (ctx: CanvasRenderingContext2D, dot: DotState, cellSize: number, dotColor: string): void => {
  // Calculate pulse scale
  const pulseScale = 0.7 + Math.sin(dot.pulseAnimation * Math.PI * 2) * 0.15;

  const centerX = dot.x + cellSize / 2;
  const centerY = dot.y + cellSize / 2;
  const radius = (cellSize / 3) * pulseScale;

  // Draw main dot
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = dotColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw glow effect
  const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 2);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.globalAlpha = 0.3;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 2, 0, Math.PI * 2);
  ctx.fill();

  // Reset global alpha
  ctx.globalAlpha = 1;
};

/**
 * Clear the entire canvas
 */
export const clearCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  ctx.clearRect(0, 0, width, height);
};
