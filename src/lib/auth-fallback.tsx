import React from 'react';

// Enhanced auth context to match altan-auth interface
const AuthContext = React.createContext<any>(null);

export const AuthProvider = ({ children, supabase }: { children: React.ReactNode; supabase: any }) => {
  const [session, setSession] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const service = {
    supabase,
    signOut: () => supabase.auth.signOut(),
    signIn: (email: string, password: string) => supabase.auth.signInWithPassword({ email, password }),
    signUp: (email: string, password: string, name: string, surname: string) => 
      supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
            surname,
            full_name: `${name} ${surname}`
          }
        }
      }),
    signInWithGoogle: () => supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    }),
    getSession: () => supabase.auth.getSession(),
    getUser: () => supabase.auth.getUser(),
    onAuthStateChange: (callback: any) => supabase.auth.onAuthStateChange(callback),
  };

  const value = {
    session,
    loading,
    service,
    // Legacy compatibility
    signOut: service.signOut,
    signIn: service.signIn,
    signUp: service.signUp,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};