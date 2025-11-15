import { authService } from '@/shared/services/auth.service';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/Card';
import {
  Alert,
  AlertDescription,
  Button,
  Input,
  Label,
} from '@/shared/components/ui/';
import { LockIcon, UserIcon } from '@phosphor-icons/react';
import { normalizeError } from '@/shared/utils/error.utils';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);

    try {
      await authService.login(username, password);
      navigate('/products');
    } catch (err) {
      const normalizedError = normalizeError(err);
      console.log('Normalized error:', normalizedError);
      console.log(normalizedError.code);
      console.log(normalizedError.message);

      // Check for email validation error
      if (
        normalizedError.code === 'identity/validation-error' &&
        normalizedError.message?.toLowerCase().includes('valid email')
      ) {
        setError('Invalid email address, please input a valid email.');
      } else if (normalizedError.code === 'identity/invalid-credential') {
        setError(
          'Invalid email or password, please try again or reset password'
        );
      } else {
        setError('Login failed, please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your inventory dashboard account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="block text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setUsername(e.target.value)
                  }
                  placeholder="Enter your username"
                  disabled={isLoading}
                  autoComplete="username"
                  leftIcon={<UserIcon className="h-4 w-4 text-gray-400" />}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="block text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoComplete="current-password"
                  leftIcon={<LockIcon className="h-4 w-4 text-gray-400" />}
                />
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
                loadingText="Signing in..."
              >
                Sign in
              </Button>
            </form>

            {/* Additional Links */}
            <div className="mt-6 text-center">
              <p className="text-sm">
                Need help?{' '}
                <button
                  type="button"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  onClick={() => {
                    alert('Contact your administrator for password reset.');
                  }}
                >
                  Contact Administrator
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
