'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const StackedPanes = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const panesRef = useRef<HTMLDivElement[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Gradient configurations for each pane
  const panes = [
    {
      gradient: 'from-engineering-500/40 via-engineering-500/20 to-engineering-500/10',
      delay: 0.2,
    },
    {
      gradient: 'from-design-500/40 via-design-500/20 to-design-500/10',
      delay: 0,
    },
    {
      gradient: 'from-strategy-500/40 via-strategy-500/20 to-strategy-500/10',
      delay: 0.6,
    },
  ];

  useEffect(() => {
    // Continuous floating animation
    panesRef.current.forEach((pane, index) => {
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

        // // Subtle rotation animation
        // gsap.to(pane, {
        //   rotateY: -5 + (index % 2 === 0 ? 2 : -2),
        //   duration: 3 + index * 0.5,
        //   repeat: -1,
        //   yoyo: true,
        //   ease: 'sine.inOut',
        //   delay: panes[index].delay,
        //   force3D: true,
        // });
      }
    });

    return () => {
      gsap.killTweensOf(panesRef.current);
    };
  }, []);

  // Mouse movement tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isMobile) return;

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
    setIsHovered(false);
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
    <div
      className="relative h-[400px] w-[320px] md:h-[500px] md:w-[400px]"
      style={{
        perspective: '1000px',
        perspectiveOrigin: '50% 70%',
      }}
    >
      <div
        ref={containerRef}
        className="relative h-full w-full"
        style={{
          transformStyle: 'preserve-3d',
        }}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {panes.map((pane, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) panesRef.current[index] = el;
            }}
            className={`absolute top-1/2 left-1/2 h-[280px] w-[240px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-gradient-to-br backdrop-blur-sm md:h-[340px] md:w-[280px] ${pane.gradient}`}
            style={{
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default StackedPanes;
