import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex relative group cursor-pointer items-center justify-center gap-2 hover:text-gray-700 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'border-accent/80 hover:border-accent text-foreground hover:bg-accent/10 bg-accent/5',
        destructive:
          'bg-destructive border-destructive text-white bg-destructive/20 focus-visible:ring-destructive/20 hover:bg-destructive/40',
        outline: 'border-foreground/50 hover:border-gray-500 ',
        secondary: 'bg-secondary/40 border-foreground/40 text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-12 px-6 has-[>svg]:px-4 text-md',
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

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
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
      <ButtonContent>{child.props.children}</ButtonContent>,
    );
  }

  return (
    <button data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props}>
      <ButtonContent>{children}</ButtonContent>
    </button>
  );
}

function ButtonContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span className="absolute inset-y-0 left-0 flex w-2 flex-col justify-between border-l border-inherit opacity-50 transition-all duration-300 ease-in-out group-hover:w-full group-hover:opacity-100">
        <span className="block w-full border-t-1 border-inherit" />
        <span className="block w-full border-b-1 border-inherit" />
      </span>
      <span className="relative z-10 flex items-center gap-3">{children}</span>
      <span className="absolute inset-y-0 right-0 flex w-2 flex-col justify-between border-r border-inherit opacity-50 transition-all duration-300 ease-in-out group-hover:w-full group-hover:opacity-100">
        <span className="block w-full border-t-1 border-inherit" />
        <span className="block w-full border-b-1 border-inherit" />
      </span>
      <span className="absolute inset-0 block border border-inherit opacity-10" />
    </>
  );
}

export { Button, buttonVariants };
