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
  const [airportCodes, setAirportCodes] = useState<Map<string, any>>(new Map());
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        // Fetch deals based on subscription status
        const isPaid = subscription?.isPaid || false;
        const limit = isPaid ? 100 : 5;
        const sortBy = isPaid ? 'discount' : 'price';
        
        const response = await fetch(`/api/deals?limit=${limit}&sortBy=${sortBy}&isPaid=${isPaid}`);
        const data = await response.json();
        setDeals(data.deals || []);
        console.log(`📊 Fetched ${data.deals?.length || 0} deals for ${isPaid ? 'paid' : 'free'} user, sorted by ${data.sortBy || sortBy}`);
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [subscription]);

  useEffect(() => {
    const loadCodes = async () => {
      const codes = await loadAirportCodes();
      setAirportCodes(codes);
    };
    loadCodes();
  }, []);

  const handleUpgrade = async () => {
    console.log('Auth loading:', authLoading);
    console.log('User object:', user);
    console.log('User email:', user?.email);
    console.log('Subscription:', subscription);
    
    if (authLoading) {
      alert('Please wait while we load your account information...');
      return;
    }
    
    // Get email from user object or fallback to localStorage
    let emailToUse = user?.email;
    if (!emailToUse) {
      // Try to get email from localStorage as fallback
      emailToUse = localStorage.getItem('userEmail');
      console.log('Using fallback email from localStorage:', emailToUse);
    }
    
    // Temporary hardcoded fallback for testing
    if (!emailToUse) {
      emailToUse = 'david.eagan@gmail.com';
      console.log('Using hardcoded fallback email:', emailToUse);
    }
    
    if (!emailToUse) {
      alert('Please sign in to upgrade');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToUse)) {
      alert('Invalid email address. Please sign out and sign in again.');
      return;
    }

    console.log('Upgrading with email:', emailToUse, 'customerId:', subscription?.stripeCustomerId);
    setIsUpgrading(true);
    
    try {
      const startTime = Date.now();
      console.log('Starting checkout session creation...');
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: emailToUse,
          customerId: subscription?.stripeCustomerId // Use existing customer ID if available
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const { url } = await response.json();
      const apiTime = Date.now() - startTime;
      console.log(`API response time: ${apiTime}ms`);
      
      if (url) {
        console.log('Redirecting to Stripe checkout...');
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session - no URL returned');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to start upgrade process: ${errorMessage}. Please try again.`);
    } finally {
      setIsUpgrading(false);
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
          {isPaid ? 'Best Flight Deals' : 'Biggest Discounts (Free Preview)'}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {isPaid 
            ? 'All deals from the last 7 days, ranked by biggest discounts' 
            : 'Showing only the biggest discount deals - upgrade to see ALL deals including the best savings!'
          }
        </p>
      </div>

      {!user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">Sign In Required</h3>
          <p className="text-sm sm:text-base text-blue-700 mb-4">
            Create a free account to see the lowest priced deals and access booking links. Upgrade to Premium to see ALL deals including the biggest discounts!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/auth?signup=true"
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium text-center"
            >
              Create Free Account
            </a>
            <a
              href="/auth"
              className="bg-gray-100 text-gray-700 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base font-medium text-center"
            >
              Sign In
            </a>
          </div>
        </div>
      )}

      {user && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Account Management</h3>
              <p className="text-sm text-gray-600">
                Signed in as <strong>{user.email}</strong>
                {isPaid ? ' • Premium Member' : ' • Free Account'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {!isPaid && (
                <button
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors text-sm font-medium text-center"
                >
                  {isUpgrading ? 'Processing...' : 'Upgrade to Premium - $20/year'}
                </button>
              )}
              <a
                href="/account"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium text-center"
              >
                Manage Account
              </a>
            </div>
          </div>
          {!isPaid && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                You're seeing only the lowest priced deals. {deals.length > 5 ? `You're missing out on ${deals.length - 5} more deals with bigger discounts! ` : 'Upgrade to see all deals with sorting and filtering! '}
                <a href="/pricing" className="underline hover:no-underline ml-1">Upgrade to see ALL {deals.length} deals and sort them.</a>
              </p>
            </div>
          )}
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
          totalDeals={deals.length}
          onUpgrade={user ? handleUpgrade : undefined}
        />
      </Suspense>
    </main>
  );
}

export default function DealsPage() {
  return <DealsContent />;
}
