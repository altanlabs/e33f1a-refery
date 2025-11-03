import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthWrapper } from '../components/auth/AuthWrapper';
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
    <div className="flex h-screen w-full items-center justify-center px-4">
      {/* 
        Wrap the Card in a div that enforces max height = screen height.
        This way, the Card never grows taller than the viewport. 
      */}
      <div className="w-full max-w-lg h-full max-h-screen">
        {/* 
          Make the Card a flex container (flex-col). 
          This allows us to have a header that sizes to its content, and a content area that flex‐grows.
        */}
        <Card className="h-full flex flex-col">
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

          {/* 
            Make CardContent flex-1 so it fills the remaining vertical space, 
            then add overflow-y-scroll so its inner content can scroll when needed. 
          */}
          <CardContent className="flex-1 overflow-y-scroll">
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
    </div>
  );
}