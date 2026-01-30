import { cn } from '@josui/core-web';

export function Page({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <main className={cn('relative z-10 flex min-h-screen flex-col justify-between', className)} id={id}>
      {children}
    </main>
  );
}

export const PageSection = ({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  return (
    <section className={cn('mx-auto w-full max-w-4xl space-y-6 px-6 py-32', className)} id={id}>
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
