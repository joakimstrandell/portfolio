'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Menu } from 'lucide-react';
import Signature from '@/components/Signature';
import { Navigation } from '@/components/Navigation';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { cn } from '@josui/core-web/src';

const THRESHOLD = 30;

const HOVER_DEBOUNCE_MS = 250;

export function Header() {
  const { isAtTop, scrollY } = useScrollDirection();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const isHoveredRef = useRef(false);
  const isAtTopRef = useRef(isAtTop);
  const scrollYRef = useRef(scrollY);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep refs in sync
  isAtTopRef.current = isAtTop;
  scrollYRef.current = scrollY;

  const updateMenuState = useCallback(() => {
    const shouldShowFullNav = isAtTopRef.current || scrollYRef.current < THRESHOLD || isHoveredRef.current;
    setIsMenuOpen(shouldShowFullNav);
  }, []);

  const handleHover = useCallback(
    (hovered: boolean) => {
      // Clear any pending debounce
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      if (hovered) {
        isHoveredRef.current = true;
        updateMenuState();
      } else {
        // Debounce when leaving hover
        debounceTimerRef.current = setTimeout(() => {
          isHoveredRef.current = false;
          updateMenuState();
        }, HOVER_DEBOUNCE_MS);
      }
    },
    [updateMenuState],
  );

  useLayoutEffect(() => {
    updateMenuState();
  }, [scrollY, updateMenuState]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-20 h-36">
      <div className="relative z-10 flex items-center justify-between gap-6 p-6 pr-0">
        <Link to="/" className="pointer-events-auto">
          <div className="bg-primary-500 flex h-12 w-12 items-end justify-end p-1 mix-blend-difference">
            <Signature className="fill-primary-950 h-6" />
          </div>
        </Link>

        <div
          className="relative flex items-center overflow-hidden"
          onMouseEnter={() => handleHover(true)}
          onMouseLeave={() => handleHover(false)}
          onTouchStart={() => handleHover(true)}
        >
          {/* Menu Icon that slides in */}
          <div
            className={cn('absolute right-0 p-2 transition-all duration-300 ease-in-out', {
              'translate-x-16 opacity-0': isMenuOpen,
              'translate-x-0 opacity-100': !isMenuOpen,
            })}
          >
            <button
              className={cn('text-foreground pointer-events-auto bg-white/90 p-2', isMenuOpen && 'hidden')}
              aria-label="Menu"
            >
              <Menu className="h-8 w-8" />
            </button>
          </div>

          {/* Full Navigation that slides out */}
          <div
            className={cn(
              'pointer-events-auto flex items-center rounded px-4 mix-blend-difference',
              '-mr-2 rounded transition-all duration-300 ease-in-out',
              {
                'translate-x-0 opacity-100': isMenuOpen,
                'translate-x-full opacity-0': !isMenuOpen,
                'bg-white/90': isMenuOpen && !isAtTop,
              },
            )}
          >
            <Navigation />
          </div>
        </div>
      </div>
    </header>
  );
}
