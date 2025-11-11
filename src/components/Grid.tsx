'use client';

import { useEffect, useRef } from 'react';
import { createGridController } from '@/lib/grid/controller';
import type { GridController } from '@/lib/grid/types';
import { cn } from '@/lib/utils';

interface GridProps {
  cellSize?: number;
  fadeRate?: number;
  maxCells?: number;
  className?: string;
  children?: React.ReactNode;
}

export function Grid({ cellSize = 24, fadeRate = 0.045, maxCells = 200, className = '', children }: GridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<GridController | null>(null);
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);

  // Update grid based on current mouse position relative to canvas
  const updateGridFromMousePosition = (clientX: number, clientY: number) => {
    if (!controllerRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();

    // Check if mouse is over the canvas
    if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
      // Calculate canvas-relative coordinates
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      controllerRef.current.handleMouseMove(x, y);
      lastMousePosRef.current = { x: clientX, y: clientY };
    }
  };

  // Initialize controller and handle canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Get initial container dimensions
    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width > 0 && height > 0) {
        // Set canvas size explicitly (not just CSS)
        canvas.width = width;
        canvas.height = height;

        // Create or update controller
        if (!controllerRef.current) {
          const controller = createGridController(canvas, {
            cellSize,
            fadeRate,
            maxCells,
          });
          controllerRef.current = controller;
          controller.start();
        } else {
          controllerRef.current.resize(width, height);
        }
      }
    };

    // Initial size setup
    updateCanvasSize();

    // Use ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    resizeObserver.observe(container);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      if (controllerRef.current) {
        controllerRef.current.destroy();
        controllerRef.current = null;
      }
    };
  }, [cellSize, fadeRate, maxCells]);

  // Track mouse position globally and handle scroll events
  useEffect(() => {
    // Handle mouse move anywhere on the document
    const handleDocumentMouseMove = (e: MouseEvent) => {
      updateGridFromMousePosition(e.clientX, e.clientY);
    };

    // Handle scroll - update grid if cursor is over canvas
    const handleScroll = () => {
      if (lastMousePosRef.current) {
        updateGridFromMousePosition(lastMousePosRef.current.x, lastMousePosRef.current.y);
      }
    };

    // Handle mouse leave document
    const handleMouseLeave = () => {
      if (controllerRef.current) {
        controllerRef.current.handleMouseLeave();
      }
      lastMousePosRef.current = null;
    };

    document.addEventListener('mousemove', handleDocumentMouseMove);
    window.addEventListener('scroll', handleScroll, true); // Use capture phase to catch all scrolls
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      window.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Handle mouse move on canvas - use canvas-relative coordinates
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    updateGridFromMousePosition(e.clientX, e.clientY);
  };

  // Handle mouse leave canvas
  const handleMouseLeave = () => {
    if (controllerRef.current) {
      controllerRef.current.handleMouseLeave();
    }
    lastMousePosRef.current = null;
  };

  return (
    <div ref={containerRef} className={cn('relative h-full w-full', className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {children}
    </div>
  );
}
