/**
 * Represents the state of a single grid cell
 */
export interface CellState {
  /** Grid-aligned x coordinate in pixels */
  x: number;
  /** Grid-aligned y coordinate in pixels */
  y: number;
  /** Intensity/opacity of the cell (0.0 = invisible, 1.0 = fully visible) */
  intensity: number;
  /** Timestamp when the cell was created (used for refresh logic) */
  timestamp: number;
}

/**
 * Main configuration interface for the grid component
 * All properties are optional with sensible defaults
 */
export interface GridControllerConfig {
  /** Size of each grid cell in pixels (default: 24) */
  cellSize?: number;
  /** Rate at which cells fade out per frame (default: 0.015) */
  fadeRate?: number;
  /** Maximum number of cells that can be active simultaneously (default: 200) */
  maxCells?: number;
}

/**
 * Interface for managing grid cells
 * Handles cell creation, path interpolation, fading, and hover states
 */
export interface CellManager {
  /** Adds a single cell at the specified coordinates */
  addCell: (x: number, y: number) => void;
  /** Adds cells along a path between two points using Bresenham's algorithm */
  addCellsAlongPath: (x0: number, y0: number, x1: number, y1: number) => void;
  /** Updates all cells by reducing their intensity over time */
  updateCells: (fadeRate: number) => void;
  /** Returns a readonly view of all active cells */
  getCells: () => ReadonlyMap<string, CellState>;
  /** Clears all cells from the grid */
  clear: () => void;
  /** Sets the currently hovered cell (maintains full intensity) */
  setHoverCell: (x: number, y: number) => void;
  /** Clears the currently hovered cell */
  clearHoverCell: () => void;
}

/**
 * Main controller interface for the grid
 * Coordinates between managers and handles user interactions
 */
export interface GridController {
  /** Starts the animation and sets up event listeners */
  start: () => void;
  /** Stops the animation loop */
  stop: () => void;
  /** Handles mouse movement events */
  handleMouseMove: (x: number, y: number) => void;
  /** Handles mouse leaving the canvas */
  handleMouseLeave: () => void;
  /** Resizes the canvas and updates internal dimensions */
  resize: (width: number, height: number) => void;
  /** Destroys the controller and cleans up all resources */
  destroy: () => void;
}

