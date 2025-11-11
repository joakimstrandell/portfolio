'use client';

import { useGameState } from './GameStateProvider';

export default function ToggleGameButton() {
  const { gameEnabled, toggleGame } = useGameState();

  return (
    <button
      onClick={toggleGame}
      className="fixed right-32 bottom-4 z-50 rounded-md border border-gray-300 bg-white/10 px-3 py-1 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/10"
    >
      {gameEnabled ? 'Disable' : 'Enable'} Game
    </button>
  );
}
