'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import Signature from '@/components/Signature';
import Navigation from '@/components/Navigation';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { cn } from '@/lib/utils';

export default function HeaderNavigation() {
  const { isAtTop, scrollY } = useScrollDirection();
  const [isHovering, setIsHovering] = useState(false);

  const shouldShowFullNav = isAtTop || isHovering || scrollY < 84;

  return (
    <div
      className="fixed inset-x-0 top-0 z-20 flex items-center justify-between gap-6 p-6 pr-4"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link href="/">
        <div className="bg-accent flex h-12 w-12 items-end justify-end p-1">
          <Signature className="h-6" />
        </div>
      </Link>

      <div className="relative flex h-8 items-center overflow-hidden">
        {/* Menu Icon that slides in */}
        <div
          className={cn('absolute right-0 transition-transform duration-300 ease-in-out', {
            'translate-x-16 opacity-0': shouldShowFullNav,
            'translate-x-0 opacity-100': !shouldShowFullNav,
          })}
        >
          <button className="hover:bg-accent/10 p-2" aria-label="Menu">
            <Menu className="h-8 w-8" />
          </button>
        </div>

        {/* Full Navigation that slides out */}
        <div
          className={cn(
            'bg-background/60 flex h-8 items-center rounded px-4',
            'transition-transform duration-300 ease-in-out',
            {
              'translate-x-0 opacity-100': shouldShowFullNav,
              'translate-x-full opacity-0': !shouldShowFullNav,
            },
          )}
        >
          <Navigation />
        </div>
      </div>
    </div>
  );
}
