'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AccountPage() {
  const { user, subscription, loading: authLoading, logout } = useAuth();
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleManageSubscription = async () => {
    if (!subscription?.isPaid || !user?.email) {
      alert('No active subscription found');
      return;
    }

    setIsLoadingPortal(true);
    
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          customerId: subscription.stripeCustomerId || user.email,
          returnUrl: window.location.href
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Failed to create portal session');
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert('Failed to open subscription management. Please try again.');
    } finally {
      setIsLoadingPortal(false);
    }
  };

  const handleUpgrade = async () => {
    console.log('Auth loading:', authLoading);
    console.log('User object:', user);
    console.log('User email:', user?.email);
    console.log('Subscription:', subscription);
    
    if (authLoading) {
      alert('Please wait while we load your account information...');
      return;
    }
    
    if (!user?.email) {
      alert('Please sign in to upgrade');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      alert('Invalid email address. Please sign out and sign in again.');
      return;
    }

    console.log('Upgrading with email:', user.email, 'customerId:', subscription?.stripeCustomerId);
    setIsUpgrading(true);
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: user.email,
          customerId: subscription?.stripeCustomerId // Use existing customer ID if available
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const { url } = await response.json();
      
      if (url) {
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Not Found</h1>
          <p className="text-gray-600 mb-6">
            Please subscribe first to access your account.
          </p>
          <a 
            href="/" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
            <button
              onClick={logout}
              className="text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>

          <div className="space-y-6">
            {/* Account Info */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <span className="ml-2 text-gray-900">{user.email}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    subscription?.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {subscription?.status || 'inactive'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Plan:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    subscription?.isPaid 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {subscription?.isPaid ? 'Premium' : 'Free'}
                  </span>
                </div>
              </div>
            </div>

            {/* Subscription Management */}
            {subscription?.isPaid && (
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Management</h2>
                <p className="text-gray-600 mb-4">
                  Manage your subscription, update payment method, or cancel your plan.
                </p>
                <button
                  onClick={handleManageSubscription}
                  disabled={isLoadingPortal}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isLoadingPortal ? 'Loading...' : 'Manage Subscription'}
                </button>
              </div>
            )}

            {/* Upgrade Section */}
            {!subscription?.isPaid && (
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Upgrade to Premium</h2>
                <p className="text-gray-600 mb-4">
                  Get access to all deals, sorting features, and direct booking links.
                </p>
                <button
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
                >
                  {isUpgrading ? 'Processing...' : 'Upgrade Now - $20/year'}
                </button>
              </div>
            )}

            {/* Account Actions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h2>
              <div className="space-y-3">
                <a
                  href="/deals"
                  className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center"
                >
                  View Deals
                </a>
                <a
                  href="/unsubscribe"
                  className="block w-full bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-center"
                >
                  Unsubscribe
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
