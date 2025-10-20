import type { DotState, GameManager } from './types';

export const createGameManager = (
  cellSize: number,
  enabled: boolean,
  onScoreChange?: (score: number) => void,
): GameManager => {
  let dot: DotState | null = null;
  let score = 0;

  const getRandomCellPosition = (width: number, height: number) => {
    const gridCols = Math.floor(width / cellSize);
    const gridRows = Math.floor(height / cellSize);

    const col = Math.floor(Math.random() * gridCols);
    const row = Math.floor(Math.random() * gridRows);

    const x = col * cellSize;
    const y = row * cellSize;

    return { x, y, cellKey: `${col},${row}` };
  };

  const spawnDot = (width: number, height: number): void => {
    if (!enabled) return;

    const position = getRandomCellPosition(width, height);
    dot = {
      ...position,
      pulseAnimation: 0,
    };
  };

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

  const getScore = (): number => score;

  const getDot = (): DotState | null => dot;

  const updateAnimation = (): void => {
    if (!dot) return;
    dot.pulseAnimation = (dot.pulseAnimation + 0.02) % 1;
  };

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
