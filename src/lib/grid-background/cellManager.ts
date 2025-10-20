import type { CellState, CellManager } from './types';

export const createCellManager = (maxCells: number, cellSize: number): CellManager => {
  const cells = new Map<string, CellState>();

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
      // Only refresh if it's been a while since last update (50ms cooldown)
      if (Date.now() - cell.timestamp > 50) {
        cell.intensity = Math.max(cell.intensity, 0.8);
        cell.timestamp = Date.now();
      }
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

  const updateCells = (fadeRate: number): void => {
    const cellsToRemove: string[] = [];

    cells.forEach((cell, key) => {
      cell.intensity -= fadeRate;
      if (cell.intensity <= 0) {
        cellsToRemove.push(key);
      }
    });

    // Remove dead cells
    cellsToRemove.forEach((key) => cells.delete(key));
  };

  const getCells = (): ReadonlyMap<string, CellState> => cells;

  const clear = (): void => {
    cells.clear();
  };

  return {
    addCell,
    updateCells,
    getCells,
    clear,
  };
};
