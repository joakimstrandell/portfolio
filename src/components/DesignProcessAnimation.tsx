'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DesignProcessAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftDiamondRef = useRef<SVGPathElement>(null);
  const rightDiamondRef = useRef<SVGPathElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const uiElementsRef = useRef<(SVGGElement | null)[]>([]);

  const cardRef = useRef<SVGGElement>(null);

  // Secondary UI elements (animate in after card)
  const uiElements = [
    { id: 'button', x: 70, y: 52 },
    { id: 'input', x: 185, y: 52 },
    { id: 'toggle', x: 55, y: 102 },
    { id: 'checkbox', x: 265, y: 102 },
    { id: 'badge', x: 100, y: 152 },
    { id: 'avatar', x: 220, y: 152 },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (
        !leftDiamondRef.current ||
        !rightDiamondRef.current ||
        !groupRef.current ||
        !cardRef.current ||
        !containerRef.current
      )
        return;

      const secondaryElements = uiElementsRef.current.filter(Boolean) as SVGGElement[];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'restart none restart reset',
        },
      });

      // Initial state - diamonds apart
      gsap.set(leftDiamondRef.current, {
        opacity: 1,
        x: 20,
      });
      gsap.set(rightDiamondRef.current, {
        opacity: 1,
        x: -20,
      });
      gsap.set(groupRef.current, {
        rotation: 0,
        svgOrigin: '160 100',
      });

      // Card starts hidden at center
      gsap.set(cardRef.current, {
        opacity: 0,
        scale: 0,
        svgOrigin: '160 102',
      });

      // Secondary UI elements start hidden, positioned at center
      secondaryElements.forEach((el, i) => {
        const targetX = uiElements[i].x;
        const targetY = uiElements[i].y;
        gsap.set(el, {
          opacity: 0,
          scale: 0,
          x: 160 - targetX,
          y: 102 - targetY,
        });
      });

      // Animation sequence
      tl.to({}, { duration: 0.3 })
        // Slide diamonds together to merge
        .to(leftDiamondRef.current, {
          x: 60,
          duration: 0.5,
          ease: 'power2.inOut',
        })
        .to(
          rightDiamondRef.current,
          {
            x: -60,
            duration: 0.5,
            ease: 'power2.inOut',
          },
          '<',
        )
        // Rotate 45 degrees to become upright square
        .to(groupRef.current, {
          rotation: 45,
          duration: 0.6,
          ease: 'power2.inOut',
        })
        // Hold as square
        .to({}, { duration: 0.2 })
        // Fade out diamonds, fade in card
        .to([leftDiamondRef.current, rightDiamondRef.current], {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: 'power2.in',
        })
        .to(
          cardRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'back.out(1.7)',
          },
          '-=0.15',
        )
        // Secondary elements animate out from center
        .to(
          secondaryElements,
          {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.4,
            ease: 'back.out(1.4)',
            stagger: 0.06,
          },
          '-=0.1',
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative flex aspect-square h-96 items-center justify-center">
      {/* Glass background layers */}
      <div className="from-tertiary-500/5 to-tertiary-500/10 absolute inset-0 bg-linear-to-br via-transparent" />

      {/* SVG container */}
      <svg viewBox="0 0 320 200" className="relative z-10 h-full w-full" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="var(--color-tertiary-600)" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Rotating group for diamonds */}
        <g ref={groupRef}>
          {/* Left diamond */}
          <path ref={leftDiamondRef} d="M 100 60 L 140 100 L 100 140 L 60 100 Z" fill="var(--color-tertiary-500)" filter="url(#shadow)" />

          {/* Right diamond */}
          <path ref={rightDiamondRef} d="M 220 60 L 260 100 L 220 140 L 180 100 Z" fill="var(--color-tertiary-500)" filter="url(#shadow)" />
        </g>

        {/* Card (center, transforms from square) */}
        <g ref={cardRef} filter="url(#shadow)">
          <rect x="120" y="77" width="80" height="50" rx="6" fill="var(--color-tertiary-500)" />
          <rect x="128" y="85" width="24" height="4" rx="2" fill="white" fillOpacity="0.9" />
          <rect x="128" y="94" width="64" height="3" rx="1.5" fill="white" fillOpacity="0.5" />
          <rect x="128" y="101" width="50" height="3" rx="1.5" fill="white" fillOpacity="0.5" />
          <rect x="128" y="113" width="28" height="8" rx="4" fill="white" fillOpacity="0.8" />
        </g>

        {/* Secondary UI Elements (animate in after card) */}

        {/* Button */}
        <g
          ref={(el) => {
            uiElementsRef.current[0] = el;
          }}
          filter="url(#shadow)"
        >
          <rect x="40" y="40" width="60" height="24" rx="12" fill="var(--color-tertiary-500)" />
          <rect x="52" y="50" width="36" height="4" rx="2" fill="white" fillOpacity="0.9" />
        </g>

        {/* Input field */}
        <g
          ref={(el) => {
            uiElementsRef.current[1] = el;
          }}
          filter="url(#shadow)"
        >
          <rect
            x="150"
            y="40"
            width="70"
            height="24"
            rx="4"
            fill="white"
            stroke="var(--color-tertiary-500)"
            strokeWidth="2"
          />
          <rect x="158" y="50" width="30" height="4" rx="2" fill="var(--color-tertiary-300)" />
        </g>

        {/* Toggle */}
        <g
          ref={(el) => {
            uiElementsRef.current[2] = el;
          }}
          filter="url(#shadow)"
        >
          <rect x="30" y="92" width="40" height="20" rx="10" fill="var(--color-tertiary-500)" />
          <circle cx="60" cy="102" r="7" fill="white" />
        </g>

        {/* Checkbox */}
        <g
          ref={(el) => {
            uiElementsRef.current[3] = el;
          }}
          filter="url(#shadow)"
        >
          <rect x="250" y="92" width="20" height="20" rx="4" fill="var(--color-tertiary-500)" />
          <path
            d="M 256 102 L 260 106 L 266 97"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Badge/tag */}
        <g
          ref={(el) => {
            uiElementsRef.current[4] = el;
          }}
          filter="url(#shadow)"
        >
          <rect x="75" y="143" width="50" height="18" rx="9" fill="var(--color-tertiary-500)" />
          <rect x="85" y="150" width="30" height="4" rx="2" fill="white" fillOpacity="0.9" />
        </g>

        {/* Avatar placeholder */}
        <g
          ref={(el) => {
            uiElementsRef.current[5] = el;
          }}
          filter="url(#shadow)"
        >
          <circle cx="220" cy="152" r="14" fill="var(--color-tertiary-500)" />
          <circle cx="220" cy="148" r="5" fill="white" fillOpacity="0.8" />
          <path d="M 211 160 Q 220 154 229 160" fill="white" fillOpacity="0.8" />
        </g>
      </svg>
    </div>
  );
};

export default DesignProcessAnimation;
