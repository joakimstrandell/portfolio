'use client';

import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';

const StackedPanes = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const panesRef = useRef<HTMLDivElement[]>([]);

  // Gradient configurations for each pane
  const panes = useMemo(
    () => [
      {
        gradient: 'from-secondary-500/40 via-secondary-500/20 to-secondary-500/10',
        delay: 0.2,
      },
      {
        gradient: 'from-tertiary-500/40 via-tertiary-500/20 to-tertiary-500/10',
        delay: 0,
      },
      {
        gradient: 'from-primary-500/40 via-primary-500/20 to-primary-500/10',
        delay: 0.6,
      },
    ],
    [],
  );

  useEffect(() => {
    const currentPanes = panesRef.current;

    // Continuous floating animation
    currentPanes.forEach((pane, index) => {
      if (pane) {
        // Initial position setup with stagger - stacked bottom to top
        gsap.set(pane, {
          z: 0,
          rotateX: 60,
          rotateY: 30,
          rotateZ: -10,
          y: -120 + index * 70,
          x: index * 3,
          force3D: true,
        });

        //Floating animation with different speeds for each pane
        gsap.to(pane, {
          y: `+=${10 + index}`,
          duration: 2 + index * 0.3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: panes[index].delay,
          force3D: true,
        });
      }
    });

    return () => {
      gsap.killTweensOf(currentPanes);
    };
  }, [panes]);

  // Mouse movement tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation based on mouse position (-10 to 10 degrees from base angle)
    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = ((centerY - y) / centerY) * 10;

    gsap.to(containerRef.current, {
      rotateY,
      rotateX,
      duration: 0.3,
      ease: 'power2.out',
      force3D: true,
    });
  };

  const handleMouseLeave = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'power2.out',
        force3D: true,
      });
    }
  };

  return (
    <div className="relative h-[400px] w-[320px] perspective-[1000px] perspective-origin-[50%_70%] md:h-[500px] md:w-[400px]">
      <div
        ref={containerRef}
        className="relative h-full w-full will-change-transform transform-3d"
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {panes.map((pane, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) panesRef.current[index] = el;
            }}
            className={`absolute top-1/2 left-1/2 h-[280px] w-[240px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-gradient-to-br backdrop-blur-sm will-change-transform transform-3d md:h-[340px] md:w-[280px] ${pane.gradient}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default StackedPanes;
