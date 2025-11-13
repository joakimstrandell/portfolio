'use client';

import { useCallback, useLayoutEffect, useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import Signature from '@/components/Signature';
import Navigation from '@/components/Navigation';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { cn } from '@/lib/utils';

const THRESHOLD = 30;

export function Header() {
  const { isAtTop, scrollY } = useScrollDirection();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(
    (open: boolean) => {
      console.log('toggleMenu', open);
      const shouldShowFullNav = isAtTop || scrollY < THRESHOLD || open;
      setIsMenuOpen(shouldShowFullNav);
    },
    [isAtTop, scrollY, setIsMenuOpen],
  );

  useLayoutEffect(() => {
    toggleMenu(false);
  }, [scrollY, toggleMenu]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-20 h-36">
      <div
        className="relative z-10 flex items-center justify-between gap-6 p-6 pr-4"
        onMouseEnter={() => toggleMenu(true)}
        onTouchStart={() => toggleMenu(true)}
        onMouseLeave={() => toggleMenu(false)}
      >
        <Link href="/" className="pointer-events-auto">
          <div className="bg-accent flex h-12 w-12 items-end justify-end p-1">
            <Signature className="h-6" />
          </div>
        </Link>

        <div className="relative flex h-8 items-center overflow-hidden">
          {/* Menu Icon that slides in */}
          <div
            className={cn('absolute right-0 transition-all duration-300 ease-in-out', {
              'translate-x-16 opacity-0': isMenuOpen,
              'translate-x-0 opacity-100': !isMenuOpen,
            })}
          >
            <button className="hover:bg-accent/10 pointer-events-auto p-2" aria-label="Menu">
              <Menu className="h-8 w-8" />
            </button>
          </div>

          {/* Full Navigation that slides out */}
          <div
            className={cn(
              'pointer-events-auto flex h-8 items-center rounded px-4',
              'transition-all duration-300 ease-in-out',
              {
                'translate-x-0 opacity-100': isMenuOpen,
                'translate-x-full opacity-0': !isMenuOpen,
              },
            )}
          >
            <Navigation />
          </div>
        </div>
      </div>
      <div
        className={cn(
          'from-background absolute top-0 left-0 z-0 h-full w-full bg-gradient-to-b to-transparent transition-opacity duration-200 ease-in-out',
          scrollY > THRESHOLD ? 'opacity-100' : 'opacity-0',
        )}
      />
    </header>
  );
}
