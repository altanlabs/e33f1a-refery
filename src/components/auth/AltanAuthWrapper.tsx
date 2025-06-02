import { ReactNode, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Create a wrapper that delays altan-auth loading
export function AltanAuthWrapper({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [AuthProvider, setAuthProvider] = useState<any>(null);

  useEffect(() => {
    // Dynamically import altan-auth after React is fully initialized
    const loadAltanAuth = async () => {
      try {
        // Wait a bit to ensure React is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const altanAuth = await import('altan-auth');
        setAuthProvider(() => altanAuth.AuthProvider);
        setIsReady(true);
      } catch (error) {
        console.error('Failed to load altan-auth:', error);
        // Fallback to a simple div if altan-auth fails
        setIsReady(true);
      }
    };

    loadAltanAuth();
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Refery...</p>
        </div>
      </div>
    );
  }

  if (!AuthProvider) {
    // Fallback if altan-auth fails to load
    return <div className="min-h-screen">{children}</div>;
  }

  try {
    return (
      <AuthProvider supabase={supabase}>
        {children}
      </AuthProvider>
    );
  } catch (error) {
    console.error('AuthProvider error:', error);
    return <div className="min-h-screen">{children}</div>;
  }
}