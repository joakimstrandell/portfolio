'use client';

import { useEffect, useRef } from 'react';
import { getCssVariable, getRGB } from '@/lib/utils';

interface GridBackgroundProps {
  cellSize?: number;
  fadeRate?: number;
  maxCells?: number;
}

interface CellState {
  x: number; // Grid x coordinate
  y: number; // Grid y coordinate
  intensity: number; // 0.0 to 1.0
  timestamp: number; // When added
}

export default function GridBackground({ cellSize = 24, fadeRate = 0.015, maxCells = 200 }: GridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetMousePosRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);
  const activeCellsRef = useRef<Map<string, CellState>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
        }
      }

      targetMousePosRef.current = newPos;
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
  }, [cellSize, fadeRate, maxCells]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 opacity-60" />;
}
