'use client';
import React, { useEffect, useRef } from 'react';
import { createCustomCursor } from '@/lib/custom-cursor';
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useIsTouchDevice();

  useEffect(() => {
    if (isTouchDevice) return;
    const cursorElement = cursorRef.current;
    if (!cursorElement) return;
    const customCursor = createCustomCursor(cursorElement);
    return () => customCursor.destroy();
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      className="border-primary-500 pointer-events-none fixed top-0 left-0 z-9999 size-4 border-2 opacity-5 mix-blend-multiply"
    />
  );
}
