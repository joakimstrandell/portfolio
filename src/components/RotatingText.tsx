'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface RotatingTextProps {
  words: string[];
  interval?: number;
  className?: string;
}

export function RotatingText({ words, interval = 2.5, className }: RotatingTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const currentIndex = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || words.length === 0) return;

    const wordElements = container.querySelectorAll('.rotating-word');

    // Set initial state - first word visible, others hidden below
    gsap.set(wordElements, { yPercent: 100, opacity: 0 });
    gsap.set(wordElements[0], { yPercent: 0, opacity: 1 });

    const rotateWords = () => {
      const current = wordElements[currentIndex.current];
      const nextIndex = (currentIndex.current + 1) % words.length;
      const next = wordElements[nextIndex];

      // Animate current word out (slide up)
      gsap.to(current, {
        yPercent: -100,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      });

      // Animate next word in (slide up from below)
      gsap.fromTo(
        next,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.inOut',
        },
      );

      currentIndex.current = nextIndex;
    };

    const intervalId = setInterval(rotateWords, interval * 1000);

    return () => clearInterval(intervalId);
  }, [words, interval]);

  // Find the longest word to set container width
  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b), '');

  return (
    <span className={`relative inline-block overflow-hidden align-bottom ${className || ''}`} ref={containerRef}>
      {/* Invisible word for sizing */}
      <span className="invisible">{longestWord}</span>
      {/* Actual rotating words */}
      {words.map((word, index) => (
        <span key={index} className="rotating-word absolute inset-0 flex">
          {word}
        </span>
      ))}
    </span>
  );
}
