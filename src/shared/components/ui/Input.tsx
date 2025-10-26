import * as React from 'react';
import { EyeIcon, EyeClosedIcon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface InputProps extends React.ComponentProps<'input'> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function Input({ className, type, leftIcon, rightIcon, ...props }: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const hasLeftIcon = !!leftIcon;
  const hasRightIcon = !!rightIcon || isPassword;

  return (
    <div className="relative">
      {/* Left Icon */}
      {hasLeftIcon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          {leftIcon}
        </div>
      )}

      {/* Input */}
      <input
        type={inputType}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          {
            'pl-10': hasLeftIcon,
            'pr-10': hasRightIcon,
          },
          className
        )}
        {...props}
      />

      {/* Right Icon or Password Toggle */}
      {hasRightIcon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center z-10">
          {isPassword ? (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              disabled={props.disabled}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeClosedIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="pointer-events-none">{rightIcon}</div>
          )}
        </div>
      )}
    </div>
  );
}

export { Input };
