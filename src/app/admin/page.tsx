'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ status: '', progress: 0, total: 0, completed: false });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const { user, loading: authLoading } = useAuth();

  // List of admin email addresses
  const adminEmails = [
    'david.eagan@gmail.com', // Admin email
    'admin@bestlaxdeals.com', // Add any other admin emails
  ];

  useEffect(() => {
    if (user && adminEmails.includes(user.email || '')) {
      setIsAuthenticated(true);
      setAuthError('');
    } else if (user && !adminEmails.includes(user.email || '')) {
      setAuthError('Access denied. This email is not authorized for admin access.');
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Access Required</h1>
          
          {!user ? (
            <div className="space-y-4">
              <p className="text-gray-600 text-center mb-6">
                Please sign in with an authorized admin account to access the admin dashboard.
              </p>
              <div className="space-y-3">
                <a
                  href="/auth?signup=true"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center block"
                >
                  Sign Up
                </a>
                <a
                  href="/auth"
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-center block"
                >
                  Sign In
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 text-center mb-6">
                Signed in as: <strong>{user.email}</strong>
              </p>
              {authError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm text-center">{authError}</p>
                </div>
              )}
              <div className="text-center">
                <a
                  href="/deals"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Go to Deals Page
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const call = async (action: string) => {
    setIsLoading(true);
    setProgress({ status: 'Starting...', progress: 0, total: 0, completed: false });

    try {
      if (action === 'ingest') {
        const response = await fetch('/api/ingest-stream', {
          method: 'POST',
          headers: {
            'x-cron-secret': process.env.NEXT_PUBLIC_CRON_SECRET || '',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  setProgress(data);
                  if (data.completed) {
                    setIsLoading(false);
                    return;
                  }
                } catch (e) {
                  console.error('Error parsing SSE data:', e);
                }
              }
            }
          }
        }
      } else if (action === 'digest') {
        const response = await fetch('/api/digest', {
          method: 'POST',
          headers: {
            'x-cron-secret': process.env.NEXT_PUBLIC_CRON_SECRET || '',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setProgress({ 
          status: result.message || 'Digest sent successfully!', 
          progress: 1, 
          total: 1, 
          completed: true 
        });
      }
    } catch (error) {
      setProgress({ 
        status: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        progress: 0, 
        total: 0, 
        completed: true 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Signed in as: {user?.email}</p>
        </div>
        <a
          href="/deals"
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back to Deals
        </a>
      </div>
      <div className="mb-8">
        <p className="text-gray-600">Manage your flight deals system</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Manual Controls</h2>
          
          <div className="space-y-4">
            <div>
              <button
                onClick={() => call('ingest')}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Running...' : 'Run Ingest Now'}
              </button>
              <p className="text-sm text-gray-500 mt-1">
                Fetch and parse new flight deals from Gmail
              </p>
            </div>

            <div>
              <button
                onClick={() => call('digest')}
                disabled={isLoading}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Digest Now'}
              </button>
              <p className="text-sm text-gray-500 mt-1">
                Send weekly digest email with top deals
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          
          <div className="space-y-3">
            <a
              href="/deals"
              className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-center"
            >
              View All Deals
            </a>
            <a
              href="/"
              className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-center"
            >
              Homepage
            </a>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>{progress.status}</span>
              <span>{progress.progress}/{progress.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.total > 0 ? (progress.progress / progress.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {progress.completed && !isLoading && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">{progress.status}</p>
        </div>
      )}
    </main>
  );
}
