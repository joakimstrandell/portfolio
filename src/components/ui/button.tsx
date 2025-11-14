import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  cn(
    'group relative inline-flex shrink-0 items-center justify-center whitespace-nowrap',

    'text-foreground/70 hover:text-accent-foreground text-sm font-medium',

    'border-foreground/50 hover:border-accent-foreground/60',

    'cursor-pointer transition-all outline-none disabled:pointer-events-none disabled:opacity-50',

    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',

    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',

    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ),
  {
    variants: {
      variant: {
        default:
          'border-accent hover:bg-accent/20 text-accent-foreground hover:text-accent-foreground hover:border-accent/80 bg-accent/10',
        outline: '',
        ghost: 'text-inherit',
      },
      size: {
        default: 'h-10 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'text-md h-12 px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<'button'> &
  ButtonVariants & {
    asChild?: boolean;
  }) {
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<{
      className?: string;
      children?: React.ReactNode;
    }>;
    const mergedClassName = cn(buttonVariants({ variant, size, className }), child.props.className);

    return React.cloneElement(
      child,
      {
        ...props,
        className: mergedClassName,
      },
      <ButtonContent variant={variant}>{child.props.children}</ButtonContent>,
    );
  }

  return (
    <button data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props}>
      <ButtonContent variant={variant}>{children}</ButtonContent>
    </button>
  );
}

function ButtonContent({ children, variant }: { children: React.ReactNode; variant: ButtonVariants['variant'] }) {
  return (
    <>
      <span
        className={cn(
          'absolute inset-y-0 left-0 flex flex-col justify-between border-l',
          'border-inherit opacity-50 transition-all duration-200 ease-in-out',
          variant === 'ghost' ? 'w-0 opacity-0' : 'w-2',
          'group-hover:w-1/2 group-hover:opacity-100',
        )}
      >
        <span className="block w-full border-t-1 border-inherit" />
        <span className="block w-full border-b-1 border-inherit" />
      </span>
      <span className="relative z-10 flex items-center gap-3">{children}</span>
      <span
        className={cn(
          'absolute inset-y-0 right-0 flex flex-col justify-between border-r',
          'border-inherit opacity-50 transition-all duration-200 ease-in-out',
          variant === 'ghost' ? 'w-0 opacity-0' : 'w-2',
          'group-hover:w-1/2 group-hover:opacity-100',
        )}
      >
        <span className="block w-full border-t-1 border-inherit" />
        <span className="block w-full border-b-1 border-inherit" />
      </span>
      {variant !== 'ghost' && <span className="absolute inset-0 block border border-inherit opacity-10" />}
    </>
  );
}

export { Button, buttonVariants };
