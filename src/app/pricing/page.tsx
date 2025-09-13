'use client';

import { useState } from 'react';

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async (email: string) => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    // Redirect to auth page to create account first, then upgrade
    window.location.href = '/auth?email=' + encodeURIComponent(email) + '&signup=true&upgrade=true';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get the best flight deals for less than a cup of coffee per month. 
            Our competitors charge $70-199/year - we're 75% cheaper.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">$0</div>
              <p className="text-gray-600">Perfect for trying us out</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Top 3 deals per week
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Basic route information
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Sample pricing (no links)
              </li>
              <li className="flex items-center text-gray-400">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                No booking links
              </li>
              <li className="flex items-center text-gray-400">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                No sorting/filtering
              </li>
            </ul>
            
            <div className="text-center">
              <a 
                href="/" 
                className="w-full bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold inline-block hover:bg-gray-200 transition-colors"
              >
                Get Started Free
              </a>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-8 border-2 border-blue-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </span>
            </div>
            
            <div className="text-center mb-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="text-4xl font-bold mb-2">$20<span className="text-xl">/year</span></div>
              <p className="text-blue-100">Less than $2/month - pays for itself in one booking!</p>
            </div>
            
            <ul className="space-y-4 mb-8 text-white">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <strong>ALL deals (50+ per week)</strong>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <strong>🌍 International destinations included</strong>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Direct booking links
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Sortable deal table
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Custom route filters
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Price alerts
              </li>
            </ul>
            
            <div className="text-center">
              <UpgradeForm onUpgrade={handleUpgrade} isLoading={isLoading} />
            </div>
          </div>
        </div>

        {/* Competitor Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            How We Compare to Competitors
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Service</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Price/Year</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Deals/Week</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">International</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Booking Links</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-blue-50">
                  <td className="py-4 px-4 font-semibold text-blue-900">Best LAX Deals (US)</td>
                  <td className="py-4 px-4 text-center font-bold text-green-600">$20</td>
                  <td className="py-4 px-4 text-center">All deals found globally</td>
                  <td className="py-4 px-4 text-center">✅ <strong>Yes</strong></td>
                  <td className="py-4 px-4 text-center">✅ Yes</td>
                </tr>
                <tr>
                  <td className="py-4 px-4">Going.com</td>
                  <td className="py-4 px-4 text-center text-red-600 font-semibold">$70</td>
                  <td className="py-4 px-4 text-center">~20</td>
                  <td className="py-4 px-4 text-center">❌ Limited</td>
                  <td className="py-4 px-4 text-center">✅ Yes</td>
                </tr>
                <tr>
                  <td className="py-4 px-4">Thrifty Traveler</td>
                  <td className="py-4 px-4 text-center text-red-600 font-semibold">$199</td>
                  <td className="py-4 px-4 text-center">~15</td>
                  <td className="py-4 px-4 text-center">❌ US Only</td>
                  <td className="py-4 px-4 text-center">✅ Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-700 mb-4">
              <strong>You save $30-179 per year</strong> compared to competitors, 
              get <strong>more deals</strong> than most of them, and <strong>international destinations</strong> that others don't include!
            </p>
            <p className="text-sm text-gray-500">
              *Prices as of 2024. Competitor features based on public information.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h3>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow">
              <h4 className="font-semibold text-gray-900 mb-2">How do I cancel my subscription?</h4>
              <p className="text-gray-600">You can cancel anytime from your account dashboard. No questions asked, no hidden fees.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow">
              <h4 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h4>
              <p className="text-gray-600">Yes! If you're not satisfied within 30 days, we'll refund your entire subscription.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow">
              <h4 className="font-semibold text-gray-900 mb-2">How often do you send deals?</h4>
              <p className="text-gray-600">We send a weekly digest every Sunday with all the best deals we found that week.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow">
              <h4 className="font-semibold text-gray-900 mb-2">Are the deals real and bookable?</h4>
              <p className="text-gray-600">Absolutely! All deals are verified and include direct booking links. We only share deals we'd book ourselves.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow">
              <h4 className="font-semibold text-gray-900 mb-2">Do you include international destinations?</h4>
              <p className="text-gray-600">Yes! Unlike many competitors who focus only on US domestic flights, we find deals to destinations worldwide including Europe, Asia, South America, and more.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UpgradeForm({ onUpgrade, isLoading }: { onUpgrade: (email: string) => void; isLoading: boolean }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpgrade(email);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-blue-100 text-sm mb-4">
          Create your account first, then upgrade to Premium
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-yellow-400 text-yellow-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Processing...' : 'Create Account & Upgrade - $20/year'}
        </button>
      </form>
    </div>
  );
}
