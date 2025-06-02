import { ReactNode } from 'react';
import { AuthProvider } from 'altan-auth';
import { supabase } from '@/lib/supabase';

interface AuthProviderWrapperProps {
  children: ReactNode;
}

export function AuthProviderWrapper({ children }: AuthProviderWrapperProps) {
  return (
    <AuthProvider supabase={supabase}>
      {children}
    </AuthProvider>
  );
}