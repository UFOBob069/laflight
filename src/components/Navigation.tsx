'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const { user, subscription, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-gray-900">
              FlightDeals
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/deals" className="text-gray-600 hover:text-gray-900">
              Deals
            </a>
            <a href="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </a>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <a href="/account" className="text-gray-600 hover:text-gray-900">
                  Account
                </a>
                {subscription?.isPaid && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    Premium
                  </span>
                )}
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            ) : (
              <a href="/auth" className="text-gray-600 hover:text-gray-900">
                Sign In
              </a>
            )}
            
            <a href="/admin" className="text-gray-600 hover:text-gray-900">
              Admin
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
