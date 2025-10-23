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
 * Represents the state of a collectible dot in game mode
 */
export interface DotState {
  /** Grid-aligned x coordinate in pixels */
  x: number;
  /** Grid-aligned y coordinate in pixels */
  y: number;
  /** Unique identifier for the grid cell (format: "col,row") */
  cellKey: string;
  /** Animation progress for pulse effect (0.0 to 1.0) */
  pulseAnimation: number;
}

/**
 * Configuration for grid rendering (internal use)
 */
export interface GridConfig {
  /** Size of each grid cell in pixels */
  cellSize: number;
  /** Rate at which cells fade out per frame */
  fadeRate: number;
  /** Maximum number of cells that can be active simultaneously */
  maxCells: number;
  /** Color for grid lines and cells */
  foregroundColor: string;
}

/**
 * Configuration for game mode (internal use)
 */
export interface GameConfig {
  /** Whether the collectible dot game is enabled */
  enabled: boolean;
  /** Color for the collectible dot */
  dotColor: string;
  /** Size of each grid cell in pixels */
  cellSize: number;
  /** Optional callback when score changes */
  onScoreChange?: (score: number) => void;
}

/**
 * Main configuration interface for the grid background component
 * All properties are optional with sensible defaults
 */
export interface GridBackgroundConfig {
  /** Size of each grid cell in pixels (default: 24) */
  cellSize?: number;
  /** Rate at which cells fade out per frame (default: 0.015) */
  fadeRate?: number;
  /** Maximum number of cells that can be active simultaneously (default: 200) */
  maxCells?: number;
  /** Whether to enable the collectible dot game mode (default: false) */
  enableGame?: boolean;
  /** Color for the collectible dot (default: uses CSS accent color) */
  dotColor?: string;
  /** Optional callback when score changes in game mode */
  onScoreChange?: (score: number) => void;
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
 * Interface for managing the collectible dot game
 * Handles dot spawning, collection detection, scoring, and animation
 */
export interface GameManager {
  /** Spawns a new dot at a random grid position */
  spawnDot: (width: number, height: number) => void;
  /** Checks if the mouse position overlaps with the current dot */
  checkCollection: (mouseX: number, mouseY: number) => boolean;
  /** Gets the current score */
  getScore: () => number;
  /** Gets the current dot state */
  getDot: () => DotState | null;
  /** Updates the dot's pulse animation */
  updateAnimation: () => void;
  /** Checks if game mode is enabled */
  isEnabled: () => boolean;
}

/**
 * Main controller interface for the grid background
 * Coordinates between managers and handles user interactions
 */
export interface GridBackgroundController {
  /** Starts the animation and sets up event listeners */
  start: () => void;
  /** Stops the animation loop */
  stop: () => void;
  /** Handles mouse movement events */
  handleMouseMove: (e: MouseEvent) => void;
  /** Handles mouse leaving the document */
  handleMouseLeave: () => void;
  /** Resizes the canvas and updates internal dimensions */
  resize: (width: number, height: number) => void;
  /** Destroys the controller and cleans up all resources */
  destroy: () => void;
}
