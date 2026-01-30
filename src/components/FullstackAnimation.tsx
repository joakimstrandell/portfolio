'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FullstackAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftStackRef = useRef<HTMLDivElement>(null);
  const rightStackRef = useRef<HTMLDivElement>(null);
  const ideWindowRef = useRef<HTMLDivElement>(null);
  const codeLinesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!leftStackRef.current || !rightStackRef.current || !ideWindowRef.current || !containerRef.current) return;

      const codeLines = codeLinesRef.current;
      const leftPanes = Array.from(leftStackRef.current.children) as HTMLElement[];
      const rightPanes = Array.from(rightStackRef.current.children) as HTMLElement[];
      const allPanes = [...leftPanes, ...rightPanes];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'restart none restart reset',
        },
      });

      // Initial state - stacks at their respective halves
      gsap.set(leftStackRef.current, { left: '25%', opacity: 1 });
      gsap.set(rightStackRef.current, { left: '75%', opacity: 1 });
      gsap.set(ideWindowRef.current, { opacity: 0, scale: 0.9 });
      gsap.set(codeLines, { scaleX: 0, transformOrigin: 'left center' });

      // Set initial Y positions for panes (GSAP will animate these)
      // Right stack offset by half spacing (12.5px) to interleave with left
      leftPanes.forEach((pane, i) => {
        gsap.set(pane, { y: i * -25 });
      });
      rightPanes.forEach((pane, i) => {
        gsap.set(pane, { y: -12.5 + i * -25 });
      });

      // Animation sequence
      tl.to({}, { duration: 0.3 })
        // Move stacks toward center
        .to(leftStackRef.current, { left: '50%', duration: 0.6, ease: 'power2.inOut' })
        .to(rightStackRef.current, { left: '50%', duration: 0.6, ease: 'power2.inOut' }, '<')
        // Collapse all panes to Y=0 simultaneously
        .to(allPanes, {
          y: 0,
          duration: 0.4,
          ease: 'power2.inOut',
        })
        // Hide stacks, show IDE window
        .to([leftStackRef.current, rightStackRef.current], { opacity: 0, duration: 0.2 })
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
    'absolute w-36 h-24 rounded-xl bg-secondary-500 shadow-md shadow-secondary-500/30 opacity-80 drop-shadow-sm';

  return (
    <div ref={containerRef} className="relative flex aspect-square h-96 items-center justify-center">
      <div className="from-secondary-500/5 to-secondary-500/10 absolute inset-0 bg-linear-to-br via-transparent" />

      {/* Left stack (Frontend) - 5 panes - centered on left half */}
      <div ref={leftStackRef} className="absolute top-1/2" style={{ left: '25%', perspective: '500px' }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={`left-${i}`}
            className={paneStyle}
            style={{
              transform: `translate(-72px, 0px) rotateX(74deg)`,
              zIndex: 5 - i,
            }}
          />
        ))}
      </div>

      {/* Right stack (Backend) - 5 panes */}
      <div ref={rightStackRef} className="absolute top-1/2" style={{ left: '75%', perspective: '500px' }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={`right-${i}`}
            className={paneStyle}
            style={{
              transform: `translate(-72px, 0px) rotateX(75deg)`,
              zIndex: 5 - i,
            }}
          />
        ))}
      </div>

      {/* IDE Window */}
      <div
        ref={ideWindowRef}
        className="bg-secondary-500 shadow-secondary-500/30 absolute flex h-36 w-52 flex-col overflow-hidden rounded-lg shadow-lg"
      >
        {/* IDE title bar */}
        <div className="flex h-6 items-center gap-1.5 bg-black/20 px-2">
          <div className="h-2 w-2 rounded-full bg-white/40" />
          <div className="h-2 w-2 rounded-full bg-white/40" />
          <div className="h-2 w-2 rounded-full bg-white/40" />
          <div className="ml-2 h-2 w-16 rounded bg-white/20" />
        </div>
        {/* Code area */}
        <div className="flex flex-1 flex-col gap-2 p-3">
          {[
            { width: 'w-20', indent: 0 },
            { width: 'w-28', indent: 8 },
            { width: 'w-24', indent: 8 },
            { width: 'w-16', indent: 16 },
            { width: 'w-32', indent: 8 },
            { width: 'w-12', indent: 0 },
          ].map((line, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) codeLinesRef.current[i] = el;
              }}
              className={`h-2 rounded bg-white/60 ${line.width}`}
              style={{ marginLeft: line.indent }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullstackAnimation;
