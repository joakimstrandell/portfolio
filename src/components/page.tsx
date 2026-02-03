import { cn } from '@josui/core-web/src';

export function Page({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <main className={cn('relative z-10 flex min-h-screen flex-col', className)} id={id}>
      {children}
    </main>
  );
}

export const PageSection = ({
  children,
  className,
  id,
  width,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  width?: 'full' | 'lg' | 'xl';
}) => {
  return (
    <section
      className={cn(
        'mx-auto w-full max-w-4xl space-y-6 px-6 py-32',
        {
          'max-w-5xl': width === 'lg',
          'max-w-7xl': width === 'xl',
          'max-w-none': width === 'full',
        },
        className,
      )}
      id={id}
    >
      {children}
    </section>
  );
};

export function PageContent({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section className={cn('mx-auto w-full max-w-4xl space-y-6 px-6 py-32', className)} id={id}>
      {children}
    </section>
  );
}
