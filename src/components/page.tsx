import { cn } from '@/lib/utils';

export function Page({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <div className={cn('relative flex flex-col justify-center gap-7 py-32', className)} id={id}>
      {children}
    </div>
  );
}

export function PageContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-4xl space-y-6 px-6', className)}>{children}</div>;
}
