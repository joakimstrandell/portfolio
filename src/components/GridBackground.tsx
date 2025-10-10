'use client';

import { useEffect, useRef } from 'react';
import { getCssVariable, getRGB } from '@/lib/utils';

interface GridBackgroundProps {
  cellSize?: number;
  fadeRate?: number;
  maxCells?: number;
  enableGame?: boolean;
  dotColor?: string;
  onScoreChange?: (score: number) => void;
}

interface CellState {
  x: number; // Grid x coordinate
  y: number; // Grid y coordinate
  intensity: number; // 0.0 to 1.0
  timestamp: number; // When added
}

interface DotState {
  x: number;
  y: number;
  cellKey: string;
  pulseAnimation: number; // 0 to 1 for pulse animation
}

export default function GridBackground({
  cellSize = 24,
  fadeRate = 0.015,
  maxCells = 200,
  enableGame = false,
  dotColor,
  onScoreChange,
}: GridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetMousePosRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);
  const activeCellsRef = useRef<Map<string, CellState>>(new Map());

  // Game state refs
  const dotPositionRef = useRef<DotState | null>(null);
  const scoreRef = useRef<number>(0);
  const gameActiveRef = useRef<boolean>(enableGame);
  const scoreDisplayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game helper functions
    const getRandomCellPosition = () => {
      const gridCols = Math.floor(window.innerWidth / cellSize);
      const gridRows = Math.floor(window.innerHeight / cellSize);

      const col = Math.floor(Math.random() * gridCols);
      const row = Math.floor(Math.random() * gridRows);

      const x = col * cellSize;
      const y = row * cellSize;

      return { x, y, cellKey: `${col},${row}` };
    };

    const spawnNewDot = () => {
      const newPos = getRandomCellPosition();
      dotPositionRef.current = {
        ...newPos,
        pulseAnimation: 0,
      };
      return newPos;
    };

    const checkDotCollection = (mouseX: number, mouseY: number) => {
      if (!dotPositionRef.current || !gameActiveRef.current) return false;

      const dot = dotPositionRef.current;
      const mouseCol = Math.floor(mouseX / cellSize);
      const mouseRow = Math.floor(mouseY / cellSize);
      const mouseCellKey = `${mouseCol},${mouseRow}`;

      return mouseCellKey === dot.cellKey;
    };

    // Initialize game if enabled
    if (enableGame && !dotPositionRef.current) {
      gameActiveRef.current = true;
      spawnNewDot();
    }

    // Set canvas size to viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Helper functions for cell management
    const getCellKey = (x: number, y: number): string => `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`;

    const getCellPosition = (x: number, y: number): { x: number; y: number } => ({
      x: Math.floor(x / cellSize) * cellSize,
      y: Math.floor(y / cellSize) * cellSize,
    });

    const addCell = (x: number, y: number) => {
      const cellKey = getCellKey(x, y);
      const cellPos = getCellPosition(x, y);

      // Always update existing cells to refresh their intensity
      if (activeCellsRef.current.has(cellKey)) {
        const existingCell = activeCellsRef.current.get(cellKey)!;
        // Only refresh if it's been a while since last update
        if (Date.now() - existingCell.timestamp > 50) {
          // 50ms cooldown
          existingCell.intensity = Math.max(existingCell.intensity, 0.8); // Boost intensity
          existingCell.timestamp = Date.now();
        }
        return;
      }

      // Don't add if at max capacity
      if (activeCellsRef.current.size >= maxCells) {
        return;
      }

      activeCellsRef.current.set(cellKey, {
        x: cellPos.x,
        y: cellPos.y,
        intensity: 1.0,
        timestamp: Date.now(),
      });
    };

    const updateCells = () => {
      const cellsToRemove: string[] = [];

      activeCellsRef.current.forEach((cell, key) => {
        cell.intensity -= fadeRate;
        if (cell.intensity <= 0) {
          cellsToRemove.push(key);
        }
      });

      // Remove dead cells
      cellsToRemove.forEach((key) => activeCellsRef.current.delete(key));
    };

    // Draw the grid
    const drawGrid = () => {
      const { width, height } = canvas;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Set grid line style
      ctx.strokeStyle = getRGB(getCssVariable('--foreground')) || '';
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.15;

      // Draw vertical lines
      for (let x = 0; x <= width; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = 0; y <= height; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw active cells
      drawCells();

      // Draw collectible dot if game is active
      if (gameActiveRef.current && dotPositionRef.current) {
        drawCollectibleDot();
      }
    };

    // Draw the collectible dot
    const drawCollectibleDot = () => {
      if (!dotPositionRef.current) return;

      const dot = dotPositionRef.current;
      const dotColorValue = dotColor || getRGB(getCssVariable('--accent')) || 'rgba(255, 0, 0, 1)';

      // Update pulse animation
      dot.pulseAnimation = (dot.pulseAnimation + 0.02) % 1;
      const pulseScale = 0.7 + Math.sin(dot.pulseAnimation * Math.PI * 2) * 0.15;

      // Draw dot with pulse effect
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = dotColorValue;

      const centerX = dot.x + cellSize / 2;
      const centerY = dot.y + cellSize / 2;
      const radius = (cellSize / 3) * pulseScale;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw glow effect
      const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 2);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.globalAlpha = 0.3;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Reset global alpha
      ctx.globalAlpha = 1;
    };

    // Draw active cells
    const drawCells = () => {
      // Draw each active cell
      activeCellsRef.current.forEach((cell) => {
        ctx.fillStyle = getRGB(getCssVariable('--foreground'), cell.intensity * 0.2) || '';
        ctx.globalAlpha = 1;

        // Draw cell with slight padding for better visual effect
        const padding = 1;
        ctx.fillRect(cell.x + padding, cell.y + padding, cellSize - padding * 2, cellSize - padding * 2);
      });
    };

    // Animation loop
    const animate = () => {
      // Update cell intensities and remove dead cells
      updateCells();

      drawGrid();
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      const prevPos = targetMousePosRef.current;

      // Add cells along the path from previous to new position
      const distance = Math.sqrt(Math.pow(newPos.x - prevPos.x, 2) + Math.pow(newPos.y - prevPos.y, 2));

      if (distance > 0) {
        // Calculate how many cells to add based on distance
        const steps = Math.max(1, Math.ceil(distance / (cellSize / 2)));

        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const x = prevPos.x + (newPos.x - prevPos.x) * t;
          const y = prevPos.y + (newPos.y - prevPos.y) * t;
          addCell(x, y);

          // Check for dot collection along the path
          if (gameActiveRef.current && checkDotCollection(x, y)) {
            collectDot();
          }
        }
      }

      targetMousePosRef.current = newPos;
    };

    // Handle dot collection
    const collectDot = () => {
      // Increment score
      scoreRef.current += 1;

      // Notify score change if callback provided
      if (onScoreChange) {
        onScoreChange(scoreRef.current);
      }

      // Update score display
      if (scoreDisplayRef.current) {
        scoreDisplayRef.current.textContent = `Score: ${scoreRef.current}`;
      }

      // Create collection effect (flash the cell)
      if (dotPositionRef.current) {
        const { x, y } = dotPositionRef.current;
        const cellKey = getCellKey(x, y);

        // Add intense flash at collection point
        activeCellsRef.current.set(cellKey, {
          x: Math.floor(x / cellSize) * cellSize,
          y: Math.floor(y / cellSize) * cellSize,
          intensity: 2.0, // Extra bright for flash effect
          timestamp: Date.now(),
        });
      }

      // Spawn a new dot
      spawnNewDot();
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [cellSize, fadeRate, maxCells, enableGame, dotColor, onScoreChange]);

  useEffect(() => {
    // Create score display if game is enabled
    if (enableGame) {
      // Create score display element
      const scoreElement = document.createElement('div');
      scoreElement.className =
        'fixed bottom-4 right-4 bg-background/80 text-foreground px-3 py-2 rounded-md font-mono text-sm z-10';
      scoreElement.textContent = `Score: ${scoreRef.current}`;
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
    <canvas ref={canvasRef} className={`fixed inset-0 z-0 opacity-60 ${enableGame ? '' : 'pointer-events-none'}`} />
  );
}
