'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { useGameState } from './GameStateProvider';

interface GameContentWrapperProps {
  children: ReactNode;
  duration?: number;
  ease?: string;
}

export default function GameContentWrapper({
  children,
  duration = 0.6,
  ease = 'power2.inOut',
}: GameContentWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { gameEnabled } = useGameState();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (gameEnabled) {
      // Animate out when game starts
      gsap.to(container, {
        opacity: 0,
        scale: 0.95,
        y: -20,
        duration,
        ease,
      });
    } else {
      // Animate back in when game ends
      gsap.to(container, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration,
        ease,
      });
    }
  }, [gameEnabled, duration, ease]);

  return (
    <div ref={containerRef} style={{ willChange: 'transform, opacity' }}>
      {children}
    </div>
  );
}
