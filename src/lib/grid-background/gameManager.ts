import type { DotState, GameManager } from './types';

/**
 * Creates a game manager for the collectible dot game mode
 * Handles dot spawning, collection detection, scoring, and animation
 *
 * @param cellSize Size of each grid cell in pixels
 * @param enabled Whether the game mode is active
 * @param onScoreChange Optional callback when score changes
 * @returns GameManager interface
 */
export const createGameManager = (
  cellSize: number,
  enabled: boolean,
  onScoreChange?: (score: number) => void,
): GameManager => {
  let dot: DotState | null = null;
  let score = 0;

  /**
   * Generates a random position for a new dot within the grid bounds
   * @param width Canvas width
   * @param height Canvas height
   * @returns Object with x, y coordinates and cell key
   */
  const getRandomCellPosition = (width: number, height: number) => {
    const gridCols = Math.floor(width / cellSize);
    const gridRows = Math.floor(height / cellSize);

    const col = Math.floor(Math.random() * gridCols);
    const row = Math.floor(Math.random() * gridRows);

    const x = col * cellSize;
    const y = row * cellSize;

    return { x, y, cellKey: `${col},${row}` };
  };

  /**
   * Spawns a new collectible dot at a random grid position
   * @param width Canvas width
   * @param height Canvas height
   */
  const spawnDot = (width: number, height: number): void => {
    if (!enabled) return;

    const position = getRandomCellPosition(width, height);
    dot = {
      ...position,
      pulseAnimation: 0, // Start pulse animation at 0
    };
  };

  /**
   * Checks if the mouse position overlaps with the current dot
   * If collected, increments score and triggers callback
   *
   * @param mouseX Mouse x coordinate
   * @param mouseY Mouse y coordinate
   * @returns True if dot was collected, false otherwise
   */
  const checkCollection = (mouseX: number, mouseY: number): boolean => {
    if (!dot || !enabled) return false;

    const mouseCol = Math.floor(mouseX / cellSize);
    const mouseRow = Math.floor(mouseY / cellSize);
    const mouseCellKey = `${mouseCol},${mouseRow}`;

    if (mouseCellKey === dot.cellKey) {
      // Increment score
      score += 1;

      // Notify score change if callback provided
      if (onScoreChange) {
        onScoreChange(score);
      }

      return true;
    }

    return false;
  };

  /**
   * Gets the current score
   * @returns Current score value
   */
  const getScore = (): number => score;

  /**
   * Gets the current dot state
   * @returns DotState object or null if no dot exists
   */
  const getDot = (): DotState | null => dot;

  /**
   * Updates the dot's pulse animation
   * Should be called every frame for smooth animation
   */
  const updateAnimation = (): void => {
    if (!dot) return;
    // Increment pulse animation (0 to 1, then wraps back to 0)
    dot.pulseAnimation = (dot.pulseAnimation + 0.02) % 1;
  };

  /**
   * Checks if the game mode is enabled
   * @returns True if game mode is active
   */
  const isEnabled = (): boolean => enabled;

  return {
    spawnDot,
    checkCollection,
    getScore,
    getDot,
    updateAnimation,
    isEnabled,
  };
};
