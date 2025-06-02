import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Auth() {
  const navigate = useNavigate();
  const [useAuth, setUseAuth] = useState<any>(null);
  const [AuthWrapper, setAuthWrapper] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Dynamically import altan-auth hooks
    const loadAltanAuth = async () => {
      try {
        const altanAuth = await import('altan-auth');
        setUseAuth(() => altanAuth.useAuth);
        setAuthWrapper(() => altanAuth.AuthWrapper);
      } catch (error) {
        console.error('Failed to load altan-auth:', error);
      }
    };

    loadAltanAuth();
  }, []);

  useEffect(() => {
    if (useAuth) {
      try {
        const auth = useAuth();
        setSession(auth.session);
        
        if (auth.session?.user) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Auth hook error:', error);
      }
    }
  }, [useAuth, navigate]);

  const handleSignInSuccess = () => {
    navigate('/dashboard');
  };

  const handleSignUpSuccess = () => {
    navigate('/dashboard');
  };

  const handleError = (error: any) => {
    console.error('Auth error:', error);
  };

  if (!AuthWrapper) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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