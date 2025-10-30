import type { CellState, DotState } from './types';

/**
 * Draws the static grid lines on the canvas
 * Creates a subtle grid pattern using the foreground color
 *
 * @param ctx Canvas 2D rendering context
 * @param width Canvas width
 * @param height Canvas height
 * @param cellSize Size of each grid cell in pixels
 * @param foregroundColor Color for the grid lines (usually from CSS custom property)
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
  ctx.globalAlpha = 0.1;

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
 * Draws all active cells with their current intensity values
 * Each cell's opacity is determined by its intensity (0.0 to 1.0)
 * Cells are drawn with slight padding for better visual effect
 *
 * @param ctx Canvas 2D rendering context
 * @param cells Map of cell keys to their state objects
 * @param cellSize Size of each grid cell in pixels
 * @param foregroundColor Base color for the cells (usually from CSS custom property)
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
    const alpha = cell.intensity * 0.3;
    const colorWithAlpha = foregroundColor.replace(/rgb\(([^)]+)\)/, `rgba($1, ${alpha})`);

    ctx.fillStyle = colorWithAlpha;
    ctx.globalAlpha = 1;

    // Draw cell with slight padding for better visual effect
    ctx.fillRect(cell.x + padding, cell.y + padding, cellSize - padding * 2, cellSize - padding * 2);
  });
};

/**
 * Draws the collectible dot with pulse animation and glow effect
 * The dot pulses in size and has a radial gradient glow
 * Used in game mode for visual feedback
 *
 * @param ctx Canvas 2D rendering context
 * @param dot Dot state object containing position and animation data
 * @param cellSize Size of each grid cell in pixels
 * @param dotColor Color for the dot (can be customized)
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
 * Clears the entire canvas to prepare for the next frame
 * Should be called at the beginning of each animation frame
 *
 * @param ctx Canvas 2D rendering context
 * @param width Canvas width
 * @param height Canvas height
 */
export const clearCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  ctx.clearRect(0, 0, width, height);
};
