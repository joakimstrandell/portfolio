import { cn } from '@/lib/utils';

export function Page({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('relative flex min-h-screen flex-col gap-7 pt-32', className)}>{children}</div>;
}

export function PageContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-4xl px-6', className)}>{children}</div>;
}
