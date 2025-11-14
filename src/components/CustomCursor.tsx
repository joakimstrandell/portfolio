'use client';
import React, { useEffect, useRef } from 'react';
import { createCustomCursor } from '@/lib/custom-cursor';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursorElement = cursorRef.current;
    if (!cursorElement) return;
    const customCursor = createCustomCursor(cursorElement);
    return () => customCursor.destroy();
  }, []);

  return (
    <div
      ref={cursorRef}
      className="border-accent pointer-events-none fixed top-0 left-0 z-[9999] h-5 w-5 border-1 opacity-5 mix-blend-multiply"
    />
  );
}
