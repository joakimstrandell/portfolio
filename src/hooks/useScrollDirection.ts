'use client';

import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [scrolledDown, setScrolledDown] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if at top
      setIsAtTop(currentScrollY < 10);

      // Determine scroll direction
      if (currentScrollY > prevScrollY && currentScrollY > 50) {
        setScrolledDown(true);
      } else if (currentScrollY < prevScrollY) {
        setScrolledDown(false);
      }

      setPrevScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [prevScrollY]);

  return { scrolledDown, isAtTop, scrollY: prevScrollY };
}
