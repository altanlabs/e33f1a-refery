import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, AuthWrapper } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Auth() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (session?.user) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  const handleSignInSuccess = () => {
    navigate('/dashboard');
  };

  const handleSignUpSuccess = () => {
    navigate('/dashboard');
  };

  const handleError = (error: any) => {
    console.error('Auth error:', error);
    setError(error.message || 'An authentication error occurred');
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-8 w-8 rounded bg-primary mr-2" />
            <span className="text-2xl font-bold">Refery</span>
          </div>
          <CardTitle className="text-2xl text-center">Welcome to Refery</CardTitle>
          <CardDescription className="text-center">
            The trusted referral hiring platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <AuthWrapper
            defaultTab="signin"
            onSignInSuccess={handleSignInSuccess}
            onSignUpSuccess={handleSignUpSuccess}
            onError={handleError}
            showSocialAuth={true}
          />
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Demo Mode:</p>
            <p className="text-xs text-muted-foreground">
              Create a new account or sign in to test the app.
              The database is live and functional!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}