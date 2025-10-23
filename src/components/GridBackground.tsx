'use client';

import { useEffect, useRef } from 'react';
import { createGridBackgroundController } from '@/lib/grid-background/controller';
import type { GridBackgroundController } from '@/lib/grid-background/types';

interface GridBackgroundProps {
  cellSize?: number;
  fadeRate?: number;
  maxCells?: number;
  enableGame?: boolean;
  dotColor?: string;
  onScoreChange?: (score: number) => void;
}

export default function GridBackground({
  cellSize = 24,
  fadeRate = 0.045,
  maxCells = 200,
  enableGame = false,
  dotColor,
  onScoreChange,
}: GridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<GridBackgroundController | null>(null);
  const scoreDisplayRef = useRef<HTMLDivElement | null>(null);

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

  // Create score display if game is enabled
  useEffect(() => {
    if (enableGame) {
      // Create score display element
      const scoreElement = document.createElement('div');
      scoreElement.className =
        'fixed bottom-4 right-4 bg-background/80 text-foreground px-3 py-2 rounded-md font-mono text-sm z-10';
      scoreElement.textContent = 'Score: 0';
      document.body.appendChild(scoreElement);

      // Store reference
      scoreDisplayRef.current = scoreElement;

      // Cleanup
      return () => {
        if (scoreElement && document.body.contains(scoreElement)) {
          document.body.removeChild(scoreElement);
        }
      };
    }
  }, [enableGame]);

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef} className={`fixed inset-0 z-0 opacity-60 ${enableGame ? '' : 'pointer-events-none'}`} />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.3)_80%,rgba(0,0,0,0.5)_100%)]" />
    </div>
  );
}
