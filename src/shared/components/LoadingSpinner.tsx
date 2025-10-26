import { Spinner } from './ui';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({
  message = 'Loading Page...',
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <Spinner className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
