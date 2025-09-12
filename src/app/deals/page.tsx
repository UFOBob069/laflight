'use client';

import { Suspense, useState, useEffect } from 'react';
import SortableTable from './SortableTable';
import { loadAirportCodes } from '@/lib/airports';
import { useAuth } from '@/contexts/AuthContext';

interface Deal {
  id: string;
  origin: string;
  destination: string;
  price: number;
  dates: string;
  link: string;
  currency: string;
}

function DealsContent() {
  const { user, subscription, loading: authLoading } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [airportCodes, setAirportCodes] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch('/api/deals');
        const data = await response.json();
        setDeals(data.deals || []);
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  useEffect(() => {
    const loadCodes = async () => {
      const codes = await loadAirportCodes();
      setAirportCodes(codes);
    };
    loadCodes();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'deals-page' }),
      });

      const result = await response.json();
      if (result.success) {
        // Store email and reload to check status
        localStorage.setItem('userEmail', email);
        window.location.reload();
      } else {
        alert(result.error || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to subscribe. Please try again.');
    }
  };

  if (loading || authLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading deals...</p>
      </div>
    );
  }

  const freeDeals = deals.slice(0, 5); // Top 5 deals for free users
  const isPaid = subscription?.isPaid || false;
  const displayDeals = isPaid ? deals : freeDeals;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
          {isPaid ? 'All Flight Deals' : 'Lowest Priced Deals (Free Preview)'}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {isPaid 
            ? 'All deals from the last 7 days, sorted by price' 
            : 'Lowest priced deals from the last 7 days - upgrade to see all deals and sort!'
          }
        </p>
      </div>

      {!user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">Get Started Free</h3>
          <p className="text-sm sm:text-base text-blue-700 mb-4">
            Enter your email to see the lowest priced deals and access booking links. Upgrade to Premium for all deals and sorting features.
          </p>
          <form onSubmit={handleLogin} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
            >
              View Deals
            </button>
          </form>
        </div>
      )}

      {user && !isPaid && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-yellow-900 mb-2">Upgrade to Premium</h3>
          <p className="text-sm sm:text-base text-yellow-700 mb-4">
            You're seeing the lowest priced deals with booking links. Upgrade to see all {deals.length} deals, sort by price/route, and get additional features!
          </p>
          <a
            href="/pricing"
            className="bg-yellow-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors inline-block text-sm sm:text-base font-medium"
          >
            Upgrade Now - $20/year
          </a>
        </div>
      )}

      <Suspense fallback={
        <div className="text-center py-12">
          <p className="text-gray-500">Loading deals...</p>
        </div>
      }>
        <SortableTable 
          deals={displayDeals} 
          airportCodes={airportCodes} 
          allowSorting={isPaid}
          showUpgradePrompt={!isPaid}
          isAuthenticated={!!user}
        />
      </Suspense>
    </main>
  );
}

export default function DealsPage() {
  return <DealsContent />;
}
