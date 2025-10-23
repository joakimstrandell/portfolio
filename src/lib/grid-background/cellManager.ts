import type { CellState, CellManager } from './types';

/**
 * Creates a cell manager that handles the lifecycle of grid cells
 * Uses Bresenham's line algorithm for smooth path interpolation
 *
 * @param maxCells Maximum number of cells that can be active simultaneously
 * @param cellSize Size of each grid cell in pixels
 * @returns CellManager interface with methods to manage cells
 */
export const createCellManager = (maxCells: number, cellSize: number): CellManager => {
  // Internal state: Map of cell keys to their state
  const cells = new Map<string, CellState>();
  // Track which cell is currently being hovered (stays at full intensity)
  let currentHoverCellKey: string | null = null;

  /**
   * Converts screen coordinates to a unique cell key
   * @param x Screen x coordinate
   * @param y Screen y coordinate
   * @returns String key in format "col,row"
   */
  const getCellKey = (x: number, y: number): string => `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`;

  /**
   * Converts screen coordinates to grid-aligned cell position
   * @param x Screen x coordinate
   * @param y Screen y coordinate
   * @returns Object with grid-aligned x, y coordinates
   */
  const getCellPosition = (x: number, y: number) => ({
    x: Math.floor(x / cellSize) * cellSize,
    y: Math.floor(y / cellSize) * cellSize,
  });

  /**
   * Adds or updates a cell at the specified position
   * If cell exists, refreshes its intensity for smoother animation
   * Respects maxCells limit to prevent memory issues
   *
   * @param x Screen x coordinate
   * @param y Screen y coordinate
   */
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

  /**
   * Bresenham's line algorithm implementation
   * Calculates all grid cells that lie on the line between two points
   * This prevents cell skipping during fast cursor movement
   *
   * @param x0 Start x coordinate
   * @param y0 Start y coordinate
   * @param x1 End x coordinate
   * @param y1 End y coordinate
   * @returns Array of cell positions along the path
   */
  const getCellsAlongPath = (x0: number, y0: number, x1: number, y1: number): Array<{ x: number; y: number }> => {
    const cells: Array<{ x: number; y: number }> = [];

    // Convert to grid coordinates
    const gridX0 = Math.floor(x0 / cellSize);
    const gridY0 = Math.floor(y0 / cellSize);
    const gridX1 = Math.floor(x1 / cellSize);
    const gridY1 = Math.floor(y1 / cellSize);

    // Bresenham's algorithm variables
    const dx = Math.abs(gridX1 - gridX0);
    const dy = Math.abs(gridY1 - gridY0);
    const sx = gridX0 < gridX1 ? 1 : -1; // Step direction for x
    const sy = gridY0 < gridY1 ? 1 : -1; // Step direction for y
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

  /**
   * Adds cells along a path between two points
   * Uses Bresenham's algorithm to ensure no cells are skipped
   *
   * @param x0 Start x coordinate
   * @param y0 Start y coordinate
   * @param x1 End x coordinate
   * @param y1 End y coordinate
   */
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

  /**
   * Updates all cells by reducing their intensity over time
   * Hovered cell maintains full intensity
   * Removes cells that have faded completely
   *
   * @param fadeRate Amount to reduce intensity per frame (0.0 to 1.0)
   */
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

  /**
   * Returns a readonly view of all active cells
   * @returns ReadonlyMap of cell keys to cell states
   */
  const getCells = (): ReadonlyMap<string, CellState> => cells;

  /**
   * Clears all cells from the grid
   */
  const clear = (): void => {
    cells.clear();
  };

  /**
   * Sets the currently hovered cell
   * This cell will maintain full intensity during updates
   * @param x Screen x coordinate
   * @param y Screen y coordinate
   */
  const setHoverCell = (x: number, y: number): void => {
    currentHoverCellKey = getCellKey(x, y);
  };

  /**
   * Clears the currently hovered cell
   * All cells will now fade normally
   */
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
