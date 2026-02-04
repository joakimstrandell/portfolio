import { cn } from '@josui/core-web/src';
import { Container, ContainerPadding, ContainerPaddingSize, ContainerWidth } from './Container';

export function Page({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <main className={cn('relative z-10 flex min-h-screen flex-col', className)} id={id}>
      {children}
    </main>
  );
}

export function PageSection({
  children,
  className,
  id,
  padding = 'top-bottom',
  paddingSize = 'lg',
  width,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  padding?: ContainerPadding;
  paddingSize?: ContainerPaddingSize;
  width?: ContainerWidth;
}) {
  return (
    <Container padding={padding} paddingSize={paddingSize} width={width} asChild>
      <section className={cn('space-y-6', className)} id={id}>
        {children}
      </section>
    </Container>
  );
}
