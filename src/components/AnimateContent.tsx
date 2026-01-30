'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

interface AnimateContentProps {
  children: ReactNode;
  className?: string;
  animationType?: 'fadeUp' | 'fadeIn' | 'fadeLeft' | 'fadeRight' | 'slideUp' | 'slideLeft' | 'slideRight';
  delay?: number;
  duration?: number;
  start?: string;
  end?: string;
  scrub?: boolean;
  sequenceDelay?: number; // Delay for sequential animation when multiple sections are in viewport
}

export default function AnimateContent({
  children,
  className = '',
  animationType = 'fadeUp',
  delay = 0,
  duration = 1,
  start = 'top bottom',
  end = 'top center',
  scrub = true,
  sequenceDelay = 0.1,
}: AnimateContentProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register the ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    const element = sectionRef.current;
    if (!element) return;

    // Initial state is now set via CSS to prevent flicker

    // Check if element is already in viewport on mount
    const rect = element.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

    // Initial state is now set via CSS to prevent flicker

    // If element is already visible, animate it with sequence delay
    if (isInViewport) {
      // Find all AnimateContent elements in viewport and sort by position
      const allElements = document.querySelectorAll('[data-animate-content]');
      const visibleElements = Array.from(allElements)
        .filter((el) => {
          const elRect = el.getBoundingClientRect();
          return elRect.top < window.innerHeight && elRect.bottom > 0;
        })
        .sort((a, b) => {
          const aRect = a.getBoundingClientRect();
          const bRect = b.getBoundingClientRect();
          return aRect.top - bRect.top;
        });

      const elementIndex = visibleElements.indexOf(element);
      const calculatedSequenceDelay = elementIndex * sequenceDelay;

      gsap.to(element, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.5,
        delay: delay + calculatedSequenceDelay,
      });
    } else {
      // Create scroll-triggered animation
      const animation = gsap.to(element, {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        scrollTrigger: {
          trigger: element,
          start,
          end,
          scrub,
          // markers: true, // Uncomment for debugging
        },
      });

      // Refresh ScrollTrigger after a short delay to ensure proper initialization
      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      // Cleanup
      return () => {
        clearTimeout(refreshTimer);
        animation.kill();
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === element) {
            trigger.kill();
          }
        });
      };
    }
  }, [animationType, delay, duration, start, end, scrub, sequenceDelay]);

  // Define initial CSS classes based on animation type
  const getInitialClass = () => {
    switch (animationType) {
      case 'fadeUp':
        return 'opacity-0 translate-y-[40px]';
      case 'fadeIn':
        return 'opacity-0';
      case 'fadeLeft':
        return 'opacity-0 translate-x-[40px]';
      case 'fadeRight':
        return 'opacity-0 -translate-x-[40px]';
      case 'slideUp':
        return 'translate-y-[100px]';
      case 'slideLeft':
        return 'translate-x-[100px]';
      case 'slideRight':
        return '-translate-x-[100px]';
      default:
        return 'opacity-0 translate-y-[50px]';
    }
  };

  return (
    <div ref={sectionRef} className={cn('block', className, getInitialClass())} data-animate-content>
      {children}
    </div>
  );
}
