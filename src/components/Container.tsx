import { cn } from '@josui/core-web/src';
import { cva } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';

export type ContainerPadding = 'top' | 'bottom' | 'top-bottom' | 'none';
export type ContainerPaddingSize = 'sm' | 'md' | 'lg';
export type ContainerWidth = 'narrowest' | 'narrower' | 'narrow' | 'wide' | 'wider' | 'widest' | 'full';

export const containerVariants = cva('px-6', {
  variants: {
    padding: {
      top: 'pb-0',
      bottom: 'pt-0',
      'top-bottom': '',
      none: 'py-0',
    },
    paddingSize: {
      sm: 'py-12',
      md: 'py-24',
      lg: 'py-32',
    },
    width: {
      narrowest: 'max-w-md',
      narrower: 'max-w-xl',
      narrow: 'max-w-3xl',
      wide: 'max-w-6xl',
      wider: 'max-w-7xl',
      widest: 'max-w-8xl',
      full: 'max-w-full',
    },
  },
  defaultVariants: {
    padding: 'none',
    paddingSize: 'lg',
  },
});

type ContainerProps = {
  children: React.ReactNode;
  padding?: ContainerPadding;
  paddingSize?: ContainerPaddingSize;
  width?: ContainerWidth;
  asChild?: boolean;
  className?: string;
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ asChild = false, className, padding, paddingSize, width, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        className={cn(
          'mx-auto w-full max-w-5xl space-y-6 px-6',
          containerVariants({ paddingSize, padding, width }),
          className,
        )}
        {...props}
      />
    );
  },
);

Container.displayName = 'Container';
