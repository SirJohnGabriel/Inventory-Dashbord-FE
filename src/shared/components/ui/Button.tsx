import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ButtonVariants } from './ButtonVariants';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ComponentProps<'button'> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  variant?: VariantProps<typeof ButtonVariants>['variant'];
  size?: VariantProps<typeof ButtonVariants>['size'];
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  loadingText,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(ButtonVariants({ variant, size, isLoading, className }))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner className="mr-2" />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button };
