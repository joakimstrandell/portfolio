'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current!;
    const state = pos.current;

    // Initialize position to center of screen as fallback
    state.x = window.innerWidth / 2;
    state.y = window.innerHeight / 2;

    // Hide cursor initially
    gsap.set(el, { opacity: 0 });

    // Track if this is the first mouse move
    let isFirstMove = true;

    const move = (e: MouseEvent) => {
      if (isFirstMove) {
        // First mouse move - show cursor at actual position
        state.x = e.clientX;
        state.y = e.clientY;
        gsap.set(el, {
          x: state.x - 2,
          y: state.y - 2,
          opacity: 1,
        });
        isFirstMove = false;
      } else {
        // Subsequent moves - instant follow
        gsap.to(state, {
          x: e.clientX,
          y: e.clientY,
          duration: 0,
          ease: 'power3.out',
          onUpdate: () => {
            gsap.set(el, { x: state.x - 2, y: state.y - 2 });
          },
        });
      }
    };

    window.addEventListener('pointermove', move);

    // Morph shape on interactive hover
    const activate = () => {
      gsap.to(el, {
        scale: 10,
        backgroundColor: 'var(--accent)',
        duration: 0.25,
        ease: 'power3.out',
      });
    };

    const deactivate = () => {
      gsap.to(el, {
        scale: 1,
        backgroundColor: 'var(--accent)',
        duration: 0.3,
        ease: 'power3.out',
      });
    };

    // Observe all links/buttons/[data-cursor='active']
    const targets = document.querySelectorAll("a, button, [data-cursor='active']");

    targets.forEach((t) => {
      t.addEventListener('mouseenter', activate);
      t.addEventListener('mouseleave', deactivate);
      t.addEventListener('focus', activate);
      t.addEventListener('blur', deactivate);
    });

    return () => {
      window.removeEventListener('pointermove', move);

      targets.forEach((t) => {
        t.removeEventListener('mouseenter', activate);
        t.removeEventListener('mouseleave', deactivate);
        t.removeEventListener('focus', activate);
        t.removeEventListener('blur', deactivate);
      });
    };
  }, []);

  return (
    <div
      ref={ref}
      className="bg-accent pointer-events-none fixed top-0 left-0 z-[9999] h-1 w-1 rounded-full mix-blend-difference"
    />
  );
}
