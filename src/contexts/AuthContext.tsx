'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  subscription: {
    isPaid: boolean;
    status: string;
    stripeCustomerId?: string;
  } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [subscription, setSubscription] = useState<{ isPaid: boolean; status: string; stripeCustomerId?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Get subscription status from our API
        try {
          const response = await fetch(`/api/user-subscription?email=${encodeURIComponent(firebaseUser.email!)}`);
          const data = await response.json();
          
          if (data.success && data.subscription) {
            setSubscription(data.subscription);
          } else {
            setSubscription(null);
          }
        } catch (error) {
          console.error('Error fetching user subscription:', error);
          setSubscription(null);
        }
      } else {
        setSubscription(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      throw new Error('Firebase Auth is not configured. Please contact support or check your environment variables.');
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    if (!auth) {
      throw new Error('Firebase Auth is not configured. Please contact support or check your environment variables.');
    }
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!auth) {
      return;
    }
    await signOut(auth);
  };

  const value = {
    user,
    subscription,
    loading,
    signIn,
    signUp,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
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
