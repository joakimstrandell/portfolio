'use client';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import React from 'react';

export type TilesProps = {
  children?: React.ReactNode;
  rows?: number; // default 3
  cols?: number; // default 6
  gap?: number; // px
  colorClass?: string; // Tailwind bg color for tiles, e.g. "bg-sky-500"
  from?: 'start' | 'center' | 'edges' | 'random'; // gsap stagger origin
  fromCursor?: boolean; // animate from cursor entry position
  each?: number; // seconds between tiles
  tileRadiusClass?: string;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLSpanElement>;

function calculateGridDimensions(containerWidth: number, containerHeight: number, cellSize: number, gap: number) {
  const cols = Math.max(1, Math.floor(containerWidth / (cellSize + gap)));
  const rows = Math.max(1, Math.floor(containerHeight / (cellSize + gap)));
  const total = rows * cols;
  return { rows, cols, total };
}

export function Tiles({
  children = 'Hover me',
  rows = 3,
  cols = 6,
  gap = 1,
  colorClass = 'bg-accent',
  from = 'center',
  fromCursor = false,
  each = 0.02,
  tileRadiusClass = 'none',
  className = '',
  ...rest
}: TilesProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const tilesRef = React.useRef<HTMLSpanElement>(null);

  const [gridDimensions, setGridDimensions] = React.useState({ rows, cols, total: rows * cols });

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { rows, cols } = calculateGridDimensions(el.clientWidth, el.clientHeight, 12, gap);
    setGridDimensions({ rows, cols, total: rows * cols });
  }, [gap]);

  React.useLayoutEffect(() => {
    const el = ref.current;
    const grid = tilesRef.current;
    if (!el || !grid) return;

    // set layout styles that depend on props
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${gridDimensions.cols}, minmax(0, 1fr))`;
    grid.style.gridTemplateRows = `repeat(${gridDimensions.rows}, minmax(0, 1fr))`;
    grid.style.gap = `${gap}px`;

    const q = gsap.utils.selector(grid);
    const $tiles = q('[data-tile="1"]');

    // Initial state
    gsap.set($tiles, { opacity: 0, scale: 0.95 });

    // Function to calculate tile index from cursor position
    const getTileIndexFromCursor = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const relativeY = clientY - rect.top;

      // Calculate which grid cell the cursor is in
      const cellWidth = rect.width / gridDimensions.cols;
      const cellHeight = rect.height / gridDimensions.rows;

      const col = Math.floor(relativeX / cellWidth);
      const row = Math.floor(relativeY / cellHeight);

      // Clamp to valid grid bounds
      const clampedCol = Math.max(0, Math.min(gridDimensions.cols - 1, col));
      const clampedRow = Math.max(0, Math.min(gridDimensions.rows - 1, row));

      // Convert to tile index
      return clampedRow * gridDimensions.cols + clampedCol;
    };

    // Function to create timeline with specific from position
    const createTimeline = (fromPosition: number | 'start' | 'center' | 'edges' | 'random' | 'end') => {
      const tl = gsap.timeline({ paused: true, defaults: { duration: 0.22, ease: 'power1.out' } });
      tl.to($tiles, {
        opacity: 0.5,
        scale: 1,
        stagger: { grid: [gridDimensions.rows, gridDimensions.cols], from: fromPosition, each },
      });
      return tl;
    };

    let currentTimeline: gsap.core.Timeline | null = null;

    const onEnter = (event?: PointerEvent | FocusEvent) => {
      // Kill previous timeline
      if (currentTimeline) {
        currentTimeline.clear();
      }

      let fromPosition: number | 'start' | 'center' | 'edges' | 'random' | 'end' = from;

      // If fromCursor is enabled and this is a pointer event, calculate cursor position
      if (fromCursor && event && 'clientX' in event) {
        const tileIndex = getTileIndexFromCursor(event.clientX, event.clientY);
        fromPosition = tileIndex;
      }

      // Create new timeline with calculated from position
      currentTimeline = createTimeline(fromPosition);
      currentTimeline.play(0);
    };

    const onLeave = () => {
      if (currentTimeline) {
        currentTimeline.reverse();
      }
    };

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('focus', onEnter);
    el.addEventListener('blur', onLeave);

    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('focus', onEnter);
      el.removeEventListener('blur', onLeave);

      if (currentTimeline) {
        currentTimeline.kill();
      }
    };
  }, [gridDimensions.rows, gridDimensions.cols, gap, from, fromCursor, each]);

  return (
    <span
      ref={ref}
      className={cn(
        'group relative inline-grid place-items-center select-none',
        'isolate overflow-hidden',
        'focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:outline-none',
        className,
      )}
      {...rest}
    >
      <span className="group-hover:text-accent-foreground relative z-10 tracking-[-0.01em] transition-colors duration-300">
        {children}
      </span>
      <span ref={tilesRef} aria-hidden className="pointer-events-none absolute inset-0">
        {Array.from({ length: gridDimensions.total }, (_, i) => (
          <i
            key={i}
            data-tile="1"
            className={[
              'm-0 block h-full w-full p-0',
              colorClass,
              tileRadiusClass,
              'scale-95 opacity-0', // initial
            ].join(' ')}
          />
        ))}
      </span>
    </span>
  );
}
