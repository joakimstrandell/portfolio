'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createGridController } from '@/lib/grid/controller';
import type { GridController } from '@/lib/grid/types';
import { cn, getCssVariable, getRGB, isTouchDevice } from '@/lib/utils';
import { useInteractiveState } from '@/hooks/useInteractiveState';

interface GridProps {
  cellSize?: number;
  fadeRate?: number;
  maxCells?: number;
  className?: string;
  children?: React.ReactNode;
  variant?: 'dark' | 'light';
}

export function Grid({ cellSize = 24, fadeRate = 0.045, maxCells = 200, className = '', children }: GridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<GridController | null>(null);
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);

  // Subscribe to interactive state changes (stored in ref to avoid re-renders)
  const isOverInteractive = useInteractiveState();
  const isOverInteractiveRef = useRef(isOverInteractive);
  const prevIsOverInteractiveRef = useRef(isOverInteractive);

  // Keep ref in sync with hook value and trigger fast fade when entering interactive element
  useEffect(() => {
    isOverInteractiveRef.current = isOverInteractive;

    // Trigger fast fade when cursor enters an interactive element
    if (isOverInteractive && !prevIsOverInteractiveRef.current && controllerRef.current) {
      controllerRef.current.triggerFastFade();
    }

    prevIsOverInteractiveRef.current = isOverInteractive;
  }, [isOverInteractive]);

  // Update grid based on current mouse position relative to container
  // Memoized to prevent recreation on every render
  const updateGridFromMousePosition = useCallback((clientX: number, clientY: number) => {
    if (!controllerRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    // Check if mouse is over the grid container (which includes child elements)
    if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
      // Calculate container-relative coordinates
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Pass interactive state to controller (using ref to avoid function call overhead)
      controllerRef.current.handleMouseMove(x, y, isOverInteractiveRef.current);
      lastMousePosRef.current = { x: clientX, y: clientY };
    }
  }, []);

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
    // Skip attaching mouse events if on touch device
    if (isTouchDevice()) {
      return;
    }

    // Handle mouse move anywhere on the document
    const handleDocumentMouseMove = (e: MouseEvent) => {
      updateGridFromMousePosition(e.clientX, e.clientY);
    };

    // Handle scroll - update grid if cursor is over container
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

    // Use passive listeners for better performance
    document.addEventListener('mousemove', handleDocumentMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      window.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [updateGridFromMousePosition]);

  // Track when the mouse leaves the entire grid container (including over child elements)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Skip attaching mouse events if on touch device
    if (isTouchDevice()) {
      return;
    }

    const handleContainerMouseLeave = (e: MouseEvent) => {
      // Only handle if it's actually leaving the container, not just moving between children
      if (e.relatedTarget && container.contains(e.relatedTarget as Node)) {
        return;
      }

      if (controllerRef.current) {
        controllerRef.current.handleMouseLeave();
      }
      lastMousePosRef.current = null;
    };

    container.addEventListener('mouseleave', handleContainerMouseLeave);

    return () => {
      container.removeEventListener('mouseleave', handleContainerMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn('relative h-full w-full', className)}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-50"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
