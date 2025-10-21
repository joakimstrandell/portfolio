'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const el = ref.current!;
    const state = pos.current;

    // Smooth follow
    const move = (e: MouseEvent) => {
      gsap.to(state, {
        x: e.clientX,
        y: e.clientY,
        duration: 0,
        ease: 'power3.out',
        onUpdate: () => {
          gsap.set(el, { x: state.x - 2, y: state.y - 2 });
        },
      });
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
      className="bg-accent pointer-events-none fixed top-0 left-0 z-[9999] h-1 w-1 rounded-full mix-blend-difference transition-transform duration-200 ease-out"
    />
  );
}
