'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';

export function Navigation() {
  return (
    <nav>
      <ul className="flex gap-0 text-sm leading-none">
        <Navigation.Item href="/work">Work</Navigation.Item>
        {/* <Navigation.Item href="/services">Services</Navigation.Item> */}
        <Navigation.Item href="/about">About</Navigation.Item>
        <Navigation.Item href="/contact">Contact</Navigation.Item>
      </ul>
    </nav>
  );
}

Navigation.Item = function NavigationItem({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li
      className={cn('hover:underline hover:underline-offset-4', {
        'text-foreground': isActive,
        'text-muted-foreground': !isActive,
      })}
    >
      <Link href={href}>
        <Button variant="ghost">{children}</Button>
      </Link>
    </li>
  );
};
