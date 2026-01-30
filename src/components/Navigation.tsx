'use client';

import { Link, useLocation } from '@tanstack/react-router';
import { cn } from '@josui/core-web/src';
import { Button } from './ui/button';

export function Navigation() {
  return (
    <nav>
      <ul className="flex gap-0 text-sm leading-none">
        <Navigation.Item href="/work">Work</Navigation.Item>
        <Navigation.Item href="/about">About</Navigation.Item>
        <Navigation.Item href="/contact">Contact</Navigation.Item>
      </ul>
    </nav>
  );
}

Navigation.Item = function NavigationItem({ href, children }: { href: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <li
      className={cn('hover:underline hover:underline-offset-4', {
        'text-foreground': isActive,
        'text-muted-foreground': !isActive,
      })}
    >
      <Link to={href}>
        <Button variant="ghost">{children}</Button>
      </Link>
    </li>
  );
};
