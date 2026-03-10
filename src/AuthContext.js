import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Load profile from DB given an auth user
  async function loadProfile(authUser) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
    if (profile) {
      setUser({
        id:         authUser.id,
        firstName:  profile.first_name,
        lastName:   profile.last_name,
        email:      authUser.email,
        role:       profile.role,
        schoolSlug: profile.school_slug,
      });
    } else {
      setUser(null);
    }
  }

  useEffect(() => {
    // Restore existing session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await loadProfile(session.user);
      }
      setLoading(false);
    });

    // Keep in sync with Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        await loadProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Called right after register/login so UI updates immediately
  const login = useCallback(session => setUser(session), []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
