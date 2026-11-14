import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

const DEMO_USER = {
  id: 'demo-user-1',
  email: 'alex.johnson@demo.mentorskill.ai',
  user_metadata: { full_name: 'Alex Johnson' }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if demo user was logged in
    const isDemo = localStorage.getItem('mentorskill_demo_user');
    if (isDemo) {
      setUser(DEMO_USER);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    }).catch((err) => {
      console.error('Error fetching session:', err);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!localStorage.getItem('mentorskill_demo_user')) {
        setUser(session?.user || null);
      }
    });
    return () => subscription?.unsubscribe();
  }, []);

  const loginDemoUser = () => {
    localStorage.setItem('mentorskill_demo_user', 'true');
    setUser(DEMO_USER);
  };

  const signUp = (email, password, options = {}) => supabase.auth.signUp({ email, password, options });
  const signIn = (email, password) => {
    localStorage.removeItem('mentorskill_demo_user');
    return supabase.auth.signInWithPassword({ email, password });
  };
  const signOut = () => {
    localStorage.removeItem('mentorskill_demo_user');
    setUser(null);
    return supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, loginDemoUser, isDemo: !!localStorage.getItem('mentorskill_demo_user') }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
