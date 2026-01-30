'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Content types for blocks
type BlockContent = 'lines' | 'button' | 'toggle' | 'circle' | 'checkbox' | 'card' | 'dots' | 'bars' | 'empty';

const ArchitectureAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<(SVGGElement | null)[]>([]);

  // 3x3 matrix final positions
  const gridSize = 3;
  const blockSize = 36;
  const gap = 12;
  const startX = 160 - ((gridSize - 1) * (blockSize + gap)) / 2;
  const startY = 100 - ((gridSize - 1) * (blockSize + gap)) / 2;

  const contentTypes: BlockContent[] = ['lines', 'button', 'toggle', 'lines', 'circle', 'checkbox', 'bars', 'dots', 'lines'];

  const blocks = Array.from({ length: 9 }, (_, i) => ({
    id: i,
    finalX: startX + (i % gridSize) * (blockSize + gap) - blockSize / 2,
    finalY: startY + Math.floor(i / gridSize) * (blockSize + gap) - blockSize / 2,
    content: contentTypes[i],
  }));

  // Scattered starting positions (balanced within canvas bounds)
  const scatteredPositions = [
    { x: 70, y: 35 },
    { x: 250, y: 45 },
    { x: 160, y: 140 },
    { x: 240, y: 130 },
    { x: 80, y: 100 },
    { x: 200, y: 30 },
    { x: 100, y: 145 },
    { x: 230, y: 95 },
    { x: 90, y: 55 },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      const blockElements = blocksRef.current.filter(Boolean) as SVGGElement[];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'restart none restart reset',
        },
      });

      // Initial state - blocks at scattered positions with random rotation
      blockElements.forEach((block, i) => {
        gsap.set(block, {
          x: scatteredPositions[i].x - blocks[i].finalX - blockSize / 2,
          y: scatteredPositions[i].y - blocks[i].finalY - blockSize / 2,
          rotation: (Math.random() - 0.5) * 30,
          opacity: 0.7,
        });
      });

      // Animation sequence
      tl.to({}, { duration: 0.3 })
        // Blocks snap into grid
        .to(blockElements, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.4)',
          stagger: {
            amount: 0.4,
            from: 'random',
          },
        })
        .to(blockElements, {
          scale: 1,
          duration: 0.12,
          ease: 'power2.in',
          stagger: 0.02,
        });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Render content inside a block
  const renderContent = (content: BlockContent, x: number, y: number) => {
    const cx = x + blockSize / 2;
    const cy = y + blockSize / 2;

    switch (content) {
      case 'lines':
        return (
          <>
            <rect x={x + 6} y={y + 10} width={16} height={2} rx={1} fill="white" fillOpacity={0.8} />
            <rect x={x + 6} y={y + 16} width={24} height={2} rx={1} fill="white" fillOpacity={0.5} />
            <rect x={x + 6} y={y + 22} width={20} height={2} rx={1} fill="white" fillOpacity={0.5} />
          </>
        );
      case 'button':
        return <rect x={x + 8} y={y + 13} width={20} height={10} rx={5} fill="white" fillOpacity={0.8} />;
      case 'toggle':
        return (
          <>
            <rect x={x + 8} y={y + 14} width={20} height={8} rx={4} fill="white" fillOpacity={0.5} />
            <circle cx={x + 23} cy={y + 18} r={3} fill="white" fillOpacity={0.9} />
          </>
        );
      case 'circle':
        return <circle cx={cx} cy={cy} r={8} fill="white" fillOpacity={0.7} />;
      case 'checkbox':
        return (
          <>
            <rect x={x + 12} y={y + 12} width={12} height={12} rx={2} fill="white" fillOpacity={0.7} />
            <path d={`M ${x + 15} ${y + 18} l 2 2 l 4 -4`} stroke="#525252" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );
      case 'bars':
        return (
          <>
            <rect x={x + 8} y={y + 20} width={4} height={8} rx={1} fill="white" fillOpacity={0.6} />
            <rect x={x + 14} y={y + 14} width={4} height={14} rx={1} fill="white" fillOpacity={0.7} />
            <rect x={x + 20} y={y + 10} width={4} height={18} rx={1} fill="white" fillOpacity={0.8} />
          </>
        );
      case 'dots':
        return (
          <>
            <circle cx={x + 12} cy={y + 12} r={2.5} fill="white" fillOpacity={0.7} />
            <circle cx={x + 24} cy={y + 12} r={2.5} fill="white" fillOpacity={0.7} />
            <circle cx={x + 12} cy={y + 24} r={2.5} fill="white" fillOpacity={0.7} />
            <circle cx={x + 24} cy={y + 24} r={2.5} fill="white" fillOpacity={0.7} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="relative flex aspect-square h-96 items-center justify-center">
      {/* Glass background layers */}
      <div className="absolute inset-0 bg-linear-to-br from-gray-200/30 via-transparent to-gray-100/20" />

      {/* SVG container */}
      <svg viewBox="0 0 320 200" className="relative z-10 h-full w-full" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="blockShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.25" />
          </filter>
          <linearGradient id="blockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#525252" />
            <stop offset="100%" stopColor="#3f3f3f" />
          </linearGradient>
        </defs>

        {/* Blocks */}
        {blocks.map((block, i) => {
          // Primary highlights: center (4), top-right (2), and bottom-left (6)
          const isPrimary = i === 4 || i === 2 || i === 6;
          return (
            <g
              key={block.id}
              ref={(el) => {
                blocksRef.current[i] = el;
              }}
              filter="url(#blockShadow)"
            >
              <rect
                x={block.finalX}
                y={block.finalY}
                width={blockSize}
                height={blockSize}
                rx={6}
                fill={isPrimary ? 'var(--color-primary-500)' : 'url(#blockGradient)'}
              />
              {renderContent(block.content, block.finalX, block.finalY)}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ArchitectureAnimation;
