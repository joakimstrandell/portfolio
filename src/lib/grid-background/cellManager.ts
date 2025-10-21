import type { CellState, CellManager } from './types';

export const createCellManager = (maxCells: number, cellSize: number): CellManager => {
  const cells = new Map<string, CellState>();
  let currentHoverCellKey: string | null = null;

  const getCellKey = (x: number, y: number): string => `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`;

  const getCellPosition = (x: number, y: number) => ({
    x: Math.floor(x / cellSize) * cellSize,
    y: Math.floor(y / cellSize) * cellSize,
  });

  const addCell = (x: number, y: number): void => {
    const cellKey = getCellKey(x, y);
    const cellPos = getCellPosition(x, y);

    // Update existing cell intensity if it exists
    if (cells.has(cellKey)) {
      const cell = cells.get(cellKey)!;
      // Refresh intensity without cooldown for smoother animation
      cell.intensity = Math.max(cell.intensity, 0.8);
      cell.timestamp = Date.now();
      return;
    }

    // Don't add if at max capacity
    if (cells.size >= maxCells) {
      return;
    }

    // Add new cell
    cells.set(cellKey, {
      x: cellPos.x,
      y: cellPos.y,
      intensity: 1.0,
      timestamp: Date.now(),
    });
  };

  // Bresenham's line algorithm to get all cells along a path
  const getCellsAlongPath = (x0: number, y0: number, x1: number, y1: number): Array<{ x: number; y: number }> => {
    const cells: Array<{ x: number; y: number }> = [];

    // Convert to grid coordinates
    const gridX0 = Math.floor(x0 / cellSize);
    const gridY0 = Math.floor(y0 / cellSize);
    const gridX1 = Math.floor(x1 / cellSize);
    const gridY1 = Math.floor(y1 / cellSize);

    const dx = Math.abs(gridX1 - gridX0);
    const dy = Math.abs(gridY1 - gridY0);
    const sx = gridX0 < gridX1 ? 1 : -1;
    const sy = gridY0 < gridY1 ? 1 : -1;
    let err = dx - dy;

    let x = gridX0;
    let y = gridY0;

    while (true) {
      cells.push({ x: x * cellSize, y: y * cellSize });

      if (x === gridX1 && y === gridY1) break;

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }

    return cells;
  };

  const addCellsAlongPath = (x0: number, y0: number, x1: number, y1: number): void => {
    // If positions are the same, just add the single cell
    if (Math.abs(x1 - x0) < 1 && Math.abs(y1 - y0) < 1) {
      addCell(x1, y1);
      return;
    }

    // Get all cells along the path
    const pathCells = getCellsAlongPath(x0, y0, x1, y1);

    // Add each cell along the path
    pathCells.forEach((cell) => {
      addCell(cell.x, cell.y);
    });
  };

  const updateCells = (fadeRate: number): void => {
    const cellsToRemove: string[] = [];

    cells.forEach((cell, key) => {
      // Keep hovered cell at full intensity
      if (key === currentHoverCellKey) {
        cell.intensity = 1.0;
      } else {
        cell.intensity -= fadeRate;
        if (cell.intensity <= 0) {
          cellsToRemove.push(key);
        }
      }
    });

    // Remove dead cells
    cellsToRemove.forEach((key) => cells.delete(key));
  };

  const getCells = (): ReadonlyMap<string, CellState> => cells;

  const clear = (): void => {
    cells.clear();
  };

  const setHoverCell = (x: number, y: number): void => {
    currentHoverCellKey = getCellKey(x, y);
  };

  const clearHoverCell = (): void => {
    currentHoverCellKey = null;
  };

  return {
    addCell,
    addCellsAlongPath,
    updateCells,
    getCells,
    clear,
    setHoverCell,
    clearHoverCell,
  };
};
