'use client';

import { useState, useEffect } from 'react';

export interface User {
  email: string;
  isPaid: boolean;
  subscriptionId?: string;
  status: 'active' | 'cancelled' | 'inactive';
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in via localStorage or cookies
    const checkUser = async () => {
      try {
        // For now, we'll use a simple approach with localStorage
        // In a real app, you'd want to use secure cookies or JWT tokens
        const savedEmail = localStorage.getItem('userEmail');
        
        if (savedEmail) {
          const response = await fetch(`/api/user-status?email=${encodeURIComponent(savedEmail)}`);
          const data = await response.json();
          
          if (data.success) {
            setUser(data.user);
          } else {
            localStorage.removeItem('userEmail');
          }
        }
      } catch (error) {
        console.error('Error checking user status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = (email: string) => {
    localStorage.setItem('userEmail', email);
    // Re-check user status after login
    window.location.reload();
  };

  const logout = () => {
    localStorage.removeItem('userEmail');
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isPaid: user?.isPaid || false,
    isSubscribed: user?.status === 'active'
  };
}
