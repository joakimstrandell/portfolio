export interface CellState {
  x: number; // Grid x coordinate
  y: number; // Grid y coordinate
  intensity: number; // 0.0 to 1.0
  timestamp: number; // When added
}

export interface DotState {
  x: number; // Grid x coordinate
  y: number; // Grid y coordinate
  cellKey: string; // Grid cell identifier
  pulseAnimation: number; // 0 to 1 for pulse animation
}

export interface GridConfig {
  cellSize: number;
  fadeRate: number;
  maxCells: number;
  foregroundColor: string;
}

export interface GameConfig {
  enabled: boolean;
  dotColor: string;
  cellSize: number;
  onScoreChange?: (score: number) => void;
}

export interface GridBackgroundConfig {
  cellSize?: number;
  fadeRate?: number;
  maxCells?: number;
  enableGame?: boolean;
  dotColor?: string;
  onScoreChange?: (score: number) => void;
}

export interface CellManager {
  addCell: (x: number, y: number) => void;
  addCellsAlongPath: (x0: number, y0: number, x1: number, y1: number) => void;
  updateCells: (fadeRate: number) => void;
  getCells: () => ReadonlyMap<string, CellState>;
  clear: () => void;
  setHoverCell: (x: number, y: number) => void;
  clearHoverCell: () => void;
}

export interface GameManager {
  spawnDot: (width: number, height: number) => void;
  checkCollection: (mouseX: number, mouseY: number) => boolean;
  getScore: () => number;
  getDot: () => DotState | null;
  updateAnimation: () => void;
  isEnabled: () => boolean;
}

export interface GridBackgroundController {
  start: () => void;
  stop: () => void;
  handleMouseMove: (x: number, y: number) => void;
  handleMouseLeave: () => void;
  resize: (width: number, height: number) => void;
  destroy: () => void;
}
