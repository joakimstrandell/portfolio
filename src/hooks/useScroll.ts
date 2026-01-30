'use client';

import { useState, useEffect, RefObject } from 'react';

/**
 * Returns a 0-1 progress value based on how much of the element is scrolled through.
 * 0 = element top is at viewport bottom
 * 1 = element bottom is at viewport top
 */
export function useScroll(ref: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let ticking = false;

    const updateProgress = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress: 0 when element enters viewport, 1 when it leaves
      const elementTop = rect.top;
      const elementHeight = rect.height;

      // Start tracking when element top hits viewport bottom
      // End when element bottom hits viewport top
      const start = windowHeight;
      const end = -elementHeight;
      const current = elementTop;

      const rawProgress = (start - current) / (start - end);
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));

      setProgress(clampedProgress);
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial calculation
    updateProgress();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateProgress);
    };
  }, [ref]);

  return progress;
}
