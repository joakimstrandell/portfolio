import { cn } from '@/lib/utils';

export function Page({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <main className={cn('flex min-h-screen flex-col', className)} id={id}>
      {children}
    </main>
  );
}

export function PageContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn('mx-auto w-full max-w-4xl space-y-6 px-6 py-32', className)}>{children}</section>;
}
