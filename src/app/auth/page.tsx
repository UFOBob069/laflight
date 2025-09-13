'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthContent() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    // Pre-fill email if coming from signup flow
    const emailParam = searchParams.get('email');
    const signupParam = searchParams.get('signup');
    const upgradeParam = searchParams.get('upgrade');
    
    if (emailParam) {
      setEmail(emailParam);
    }
    if (signupParam === 'true') {
      setIsLogin(false);
    }
  }, [searchParams]);
  
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signIn(email, password);
        router.push('/deals');
      } else {
        await signUp(email, password);
        // Check if this is an upgrade flow
        const upgradeParam = searchParams.get('upgrade');
        if (upgradeParam === 'true') {
          router.push('/pricing');
        } else {
          router.push('/deals');
        }
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Travel-themed background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating airplane */}
        <div className="absolute top-20 left-10 text-6xl opacity-30 animate-bounce delay-1000">✈️</div>
        <div className="absolute top-32 right-16 text-4xl opacity-25 animate-bounce delay-500">🌍</div>
        <div className="absolute bottom-32 left-20 text-5xl opacity-30 animate-bounce delay-700">✈️</div>
        <div className="absolute bottom-20 right-10 text-3xl opacity-25 animate-bounce delay-300">🗺️</div>
        <div className="absolute top-1/2 left-1/4 text-4xl opacity-20 animate-bounce delay-1000">🌎</div>
        <div className="absolute top-1/3 right-1/4 text-5xl opacity-25 animate-bounce delay-200">✈️</div>
        
        {/* Floating clouds */}
        <div className="absolute top-16 left-1/3 text-4xl opacity-30 animate-pulse delay-400">☁️</div>
        <div className="absolute bottom-40 right-1/3 text-3xl opacity-25 animate-pulse delay-800">☁️</div>
        <div className="absolute top-1/2 right-10 text-2xl opacity-20 animate-pulse delay-600">☁️</div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl animate-pulse">
            <span className="text-4xl">✈️</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back! 🎉' : 'Join the Journey! 🌟'}
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            {isLogin ? 'Sign in to continue finding amazing deals ✈️' : 'Start discovering incredible flight deals 🛫'}
          </p>
          <p className="text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200 underline decoration-2 underline-offset-2"
            >
              {isLogin ? 'Create one now' : 'Sign in here'}
            </button>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            <div className="space-y-6">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Please wait...
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{isLogin ? '✈️' : '🚀'}</span>
                  {isLogin ? 'Sign In & Explore Deals' : 'Create Account & Start Saving'}
                </div>
              )}
            </button>
          </div>

          <div className="text-center">
            <a
              href="/"
              className="font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
