import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email || 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setLoading(false);
      }
    }).catch(err => {
      console.error('Session fetch error:', err);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('Auth state changed:', _event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (authUser: User) => {
    try {
      console.log('Fetching profile for:', authUser.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.warn('Profile fetch failed (RLS?):', error.message);
        // Create fallback profile from user metadata
        const fallbackProfile = {
          id: authUser.id,
          first_name: authUser.user_metadata?.first_name || 'User',
          last_name: authUser.user_metadata?.last_name || '',
          email: authUser.email || null,
          role: 'technician' as const,
          department: authUser.user_metadata?.department || null,
          phone: authUser.user_metadata?.phone || null,
          avatar_url: null,
          created_at: authUser.created_at || new Date().toISOString(),
          updated_at: authUser.created_at || new Date().toISOString(),
        };
        console.log('Using fallback profile:', fallbackProfile.email);
        setProfile(fallbackProfile as Profile);
      } else {
        console.log('Profile loaded from DB:', data?.email);
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      // Still set a minimal profile to allow app to work
      setProfile({
        id: authUser.id,
        first_name: 'User',
        last_name: '',
        email: authUser.email || null,
        role: 'technician',
        department: null,
        phone: null,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Profile);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
