'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FullstackAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const panesContainerRef = useRef<HTMLDivElement>(null);
  const ideWindowRef = useRef<HTMLDivElement>(null);
  const codeLinesRef = useRef<HTMLDivElement[]>([]);
  const panesRef = useRef<HTMLDivElement[]>([]);

  // Interleaved panes: L0, R0, L1, R1, L2, R2, L3, R3, L4, R4
  // This ensures proper z-ordering when merged
  const panes = [
    { side: 'left', index: 0, isPrimary: true },
    { side: 'right', index: 0, isPrimary: false },
    { side: 'left', index: 1, isPrimary: false },
    { side: 'right', index: 1, isPrimary: false },
    { side: 'left', index: 2, isPrimary: false },
    { side: 'right', index: 2, isPrimary: true },
    { side: 'left', index: 3, isPrimary: false },
    { side: 'right', index: 3, isPrimary: false },
    { side: 'left', index: 4, isPrimary: false },
    { side: 'right', index: 4, isPrimary: false },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!panesContainerRef.current || !ideWindowRef.current || !containerRef.current) return;

      const codeLines = codeLinesRef.current;
      const allPanes = panesRef.current.filter(Boolean);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'restart none restart reset',
        },
      });

      // Initial state
      gsap.set(ideWindowRef.current, { opacity: 0, scale: 0.9 });
      gsap.set(codeLines, { scaleX: 0, transformOrigin: 'left center' });

      // Set initial positions for each pane
      // Left panes start at x=-100, right panes at x=+100 (within canvas)
      // Y positions interleave: left at i*-25, right at -12.5 + i*-25
      allPanes.forEach((pane, domIndex) => {
        const paneData = panes[domIndex];
        const xOffset = paneData.side === 'left' ? -100 : 100;
        const yOffset = paneData.side === 'left' ? paneData.index * -25 : -12.5 + paneData.index * -25;

        gsap.set(pane, {
          x: xOffset,
          y: yOffset,
        });
      });

      // Animation sequence
      tl.to({}, { duration: 0.3 })
        // Move all panes to center (x=0)
        .to(allPanes, {
          x: 0,
          duration: 0.6,
          ease: 'power2.inOut',
        })
        // Collapse all panes to Y=0 simultaneously
        .to(allPanes, {
          y: 0,
          duration: 0.4,
          ease: 'power2.inOut',
        })
        // Hide panes, show IDE window
        .to(allPanes, { opacity: 0, duration: 0.2 })
        .to(
          ideWindowRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'back.out(1.7)',
          },
          '-=0.1',
        )
        // Type out code lines
        .to(codeLines, {
          scaleX: 1,
          duration: 0.15,
          ease: 'power1.out',
          stagger: 0.08,
        });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const paneStyle =
    'absolute w-36 h-24 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 shadow-sm shadow-black/20 opacity-80';
  const paneStylePrimary = 'absolute w-36 h-24 rounded-xl bg-primary-500 shadow-sm shadow-black/20 opacity-90';

  return (
    <div ref={containerRef} className="relative flex aspect-square h-96 items-center justify-center">
      <div className="absolute inset-0 bg-linear-to-br from-gray-200/30 via-transparent to-gray-100/20" />

      {/* All panes in a single container, interleaved for proper z-ordering */}
      <div ref={panesContainerRef} className="absolute top-1/2 left-1/2" style={{ perspective: '500px' }}>
        {panes.map((pane, i) => (
          <div
            key={`${pane.side}-${pane.index}`}
            ref={(el) => {
              if (el) panesRef.current[i] = el;
            }}
            className={pane.isPrimary ? paneStylePrimary : paneStyle}
            style={{
              transform: `translate(-72px, 0px) rotateX(74deg)`,
            }}
          />
        ))}
      </div>

      {/* IDE Window */}
      <div
        ref={ideWindowRef}
        className="absolute flex h-36 w-52 flex-col overflow-hidden rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 shadow-md shadow-black/20"
      >
        {/* IDE title bar */}
        <div className="bg-foreground/20 flex h-6 items-center gap-1.5 px-2">
          <div className="bg-background/40 h-2 w-2 rounded-full" />
          <div className="bg-background/40 h-2 w-2 rounded-full" />
          <div className="bg-background/40 h-2 w-2 rounded-full" />
          <div className="bg-background/20 ml-2 h-2 w-16 rounded" />
        </div>
        {/* Code area */}
        <div className="flex flex-1 flex-col gap-2 p-3">
          {[
            { width: 'w-20', indent: 0, highlight: true },
            { width: 'w-28', indent: 8, highlight: false },
            { width: 'w-24', indent: 8, highlight: false },
            { width: 'w-16', indent: 16, highlight: true },
            { width: 'w-32', indent: 8, highlight: false },
            { width: 'w-12', indent: 0, highlight: false },
          ].map((line, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) codeLinesRef.current[i] = el;
              }}
              className={`h-2 rounded ${line.highlight ? 'bg-primary-400' : 'bg-gray-300'} ${line.width}`}
              style={{ marginLeft: line.indent }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullstackAnimation;
