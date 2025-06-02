import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, AuthWrapper } from 'altan-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Auth() {
  const { session } = useAuth();
  const navigate = useNavigate();

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
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center px-4">
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
        </CardContent>
      </Card>
    </div>
  );
}