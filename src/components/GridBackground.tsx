'use client';

import { useEffect, useRef, useState } from 'react';
import { createGridBackgroundController } from '@/lib/grid-background/controller';
import type { GridBackgroundController } from '@/lib/grid-background/types';
import { useGameState } from './GameStateProvider';

interface GridBackgroundProps {
  cellSize?: number;
  fadeRate?: number;
  maxCells?: number;
  enableGame?: boolean;
  timeLimit?: number; // Time limit in seconds, defaults to 30
  dotColor?: string;
  onScoreChange?: (score: number) => void;
}

export default function GridBackground({
  cellSize = 24,
  fadeRate = 0.045,
  maxCells = 200,
  enableGame,
  timeLimit = 10,
  dotColor,
  onScoreChange,
}: GridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<GridBackgroundController | null>(null);
  const scoreDisplayRef = useRef<HTMLDivElement | null>(null);
  const countdownDisplayRef = useRef<HTMLDivElement | null>(null);
  const currentScoreRef = useRef(0);
  const { gameEnabled, gameOver, disableGame, setGameOver } = useGameState();
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [currentScore, setCurrentScore] = useState(0);

  // Disable game interaction when gameOver is true, but keep it enabled for display
  enableGame = typeof enableGame === 'undefined' ? gameEnabled && !gameOver : enableGame && !gameOver;

  // Initialize controller and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create controller
    const controller = createGridBackgroundController(canvas, {
      cellSize,
      fadeRate,
      maxCells,
      enableGame,
      dotColor,
      onScoreChange: (score) => {
        setCurrentScore(score);
        currentScoreRef.current = score;
        if (onScoreChange) {
          onScoreChange(score);
        }
        if (scoreDisplayRef.current) {
          scoreDisplayRef.current.textContent = `Score: ${score}`;
        }
      },
    });

    controllerRef.current = controller;

    // Handle resize
    const handleResize = () => {
      controller.resize(window.innerWidth, window.innerHeight);
    };

    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      controller.handleMouseMove(e);
    };

    // Handle mouse leave (when cursor leaves the document)
    const handleMouseLeave = () => {
      controller.handleMouseLeave();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Start animation
    controller.start();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      controller.destroy();
    };
  }, [cellSize, fadeRate, maxCells, enableGame, dotColor, onScoreChange]);

  // Create score and countdown display if game is enabled or gameOver
  useEffect(() => {
    if (enableGame || gameOver) {
      // Create container for score and countdown
      const container = document.createElement('div');
      container.className = 'fixed bottom-4 right-4 z-10 flex flex-col gap-2';

      // Create score display element
      const scoreElement = document.createElement('div');
      scoreElement.className = 'bg-background/80 text-foreground px-3 py-2 rounded-md font-mono text-sm';
      scoreElement.textContent = 'Score: 0';
      container.appendChild(scoreElement);
      scoreDisplayRef.current = scoreElement;

      // Create countdown display element
      const countdownElement = document.createElement('div');
      countdownElement.className = 'bg-background/80 text-foreground px-3 py-2 rounded-md font-mono text-sm';
      countdownElement.textContent = gameOver ? 'Time: 0s' : `Time: ${timeLimit}s`;
      container.appendChild(countdownElement);
      countdownDisplayRef.current = countdownElement;

      document.body.appendChild(container);

      // Cleanup
      return () => {
        if (container && document.body.contains(container)) {
          document.body.removeChild(container);
        }
        scoreDisplayRef.current = null;
        countdownDisplayRef.current = null;
      };
    } else if (!gameOver) {
      // Reset time remaining when game is disabled (but not if gameOver)
      setTimeRemaining(null);
    }
  }, [enableGame, gameOver, timeLimit]);

  // Countdown timer effect
  useEffect(() => {
    if (!enableGame) {
      setTimeRemaining(null);
      setCurrentScore(0);
      currentScoreRef.current = 0;
      return;
    }

    // Initialize countdown
    setTimeRemaining(timeLimit);
    setCurrentScore(0);
    currentScoreRef.current = 0;

    // Start countdown interval
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          // Time's up - set game over with current score from ref
          setGameOver(true, currentScoreRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup interval
    return () => {
      clearInterval(interval);
    };
  }, [enableGame, timeLimit, setGameOver]);

  // Update countdown display
  useEffect(() => {
    if (countdownDisplayRef.current) {
      if (gameOver) {
        countdownDisplayRef.current.textContent = 'Time: 0s';
      } else if (timeRemaining !== null) {
        countdownDisplayRef.current.textContent = `Time: ${timeRemaining}s`;
      }
    }
  }, [timeRemaining, gameOver]);

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef} className={`fixed inset-0 z-0 opacity-60 ${enableGame ? '' : 'pointer-events-none'}`} />
      {/* <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.3)_80%,rgba(0,0,0,0.5)_100%)]" /> */}
    </div>
  );
}
