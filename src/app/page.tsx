'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getOrganizationSchema, getWebSiteSchema, getServiceSchema, getFAQSchema } from '@/lib/structured-data';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, subscription, loading: authLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          source: 'homepage'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Redirect to auth page to create account
        window.location.href = '/auth?email=' + encodeURIComponent(email) + '&signup=true';
      } else {
        throw new Error(result.error || 'Subscription failed');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Structured Data for SEO and AI Search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getOrganizationSchema())
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getWebSiteSchema())
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getServiceSchema())
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFAQSchema())
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Secret Deals Headline */}
            <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              🔒 Secret Flight Deals from Los Angeles
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              The Hidden Deals Airlines
              <span className="block text-blue-600">Don't Want You to See</span>
            </h1>
            
            {/* Above-Fold Value Proposition */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Our AI monitors 50+ hidden sources 24/7 to find secret flight deals that save you $30-179 per year. 
              These aren't just "cheap flights" - these are hand-picked deals airlines bury in their systems.
            </p>

            {/* CTA First-Person Psychology */}
            <div className="max-w-md mx-auto mb-12">
              {user ? (
                // Logged in user - show deals button
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <p className="text-lg text-gray-600 mb-2">
                      Welcome back, <strong>{user.email}</strong>!
                    </p>
                    <p className="text-sm text-gray-500">
                      {subscription?.isPaid ? 'Premium Member' : 'Free Account'}
                    </p>
                  </div>
                  <a
                    href="/deals"
                    className="w-full bg-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center block"
                  >
                    View Latest Flight Deals
                  </a>
                  {!subscription?.isPaid && (
                    <a
                      href="/pricing"
                      className="w-full bg-yellow-600 text-white px-8 py-3 text-lg font-semibold rounded-lg hover:bg-yellow-700 transition-colors text-center block"
                    >
                      Upgrade to Premium - $20/year
                    </a>
                  )}
                </div>
              ) : (
                // Not logged in - show email form
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter my email for free deals"
                    className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? 'Getting My Deals...' : 'Get My Free Flight Deals'}
                  </button>
                </form>
              )}
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white"></div>
                </div>
                <span>Join 12,847 travelers finding secret deals</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">⭐</span>
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-1">💰</span>
                <span>Average $500+ saved per trip</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Secret Deals Advantage */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why You're Missing the Best Deals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Airlines hide their cheapest fares in places most travelers never look. 
              While you're searching Google Flights, we're finding the deals they don't want you to see.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Limited Search</h3>
              <p className="text-gray-600">Most people only check 2-3 websites, missing 80% of available deals hidden in airline partner networks and error fares.</p>
            </div>
            
            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Timing Issues</h3>
              <p className="text-gray-600">The best deals appear and disappear within hours. By the time you check, they're gone forever.</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Wrong Sources</h3>
              <p className="text-gray-600">Airlines bury their cheapest fares in partner booking systems and error fare databases that require special access.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Secret Deals Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            The Secret Deals Our Members Found
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            These aren't just "cheap flights" - these are hidden deals that airlines don't advertise publicly.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  S
                </div>
                <div>
                  <h4 className="font-semibold">Sarah M.</h4>
                  <p className="text-sm text-gray-500">Los Angeles → Barcelona</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">"Found an error fare that airlines tried to hide. $1,200 flight for $353!"</p>
              <div className="flex justify-between items-center">
                <div className="text-green-600 font-semibold">Saved $847</div>
                <div className="text-xs text-gray-500">Error Fare</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  M
                </div>
                <div>
                  <h4 className="font-semibold">Mike R.</h4>
                  <p className="text-sm text-gray-500">Los Angeles → Tokyo</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">"Partner network deal that wasn't on airline websites. $1,200 → $480!"</p>
              <div className="flex justify-between items-center">
                <div className="text-green-600 font-semibold">Saved $720</div>
                <div className="text-xs text-gray-500">Partner Deal</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  J
                </div>
                <div>
                  <h4 className="font-semibold">Jessica L.</h4>
                  <p className="text-sm text-gray-500">Business Traveler</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">"Flash sales and hidden international routes. $3,000+ saved this year!"</p>
              <div className="flex justify-between items-center">
                <div className="text-green-600 font-semibold">Saved $3,000+</div>
                <div className="text-xs text-gray-500">Flash Sales</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secret Deals Value */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Access to Secret Deals</h2>
          <p className="text-xl mb-8">Get the hidden deals airlines don't want you to see - for less than $2/month</p>
          
          <div className="bg-white text-gray-900 p-8 rounded-lg max-w-md mx-auto">
            <div className="text-4xl font-bold text-blue-600 mb-2">$20</div>
            <div className="text-lg mb-4">per year</div>
            <div className="text-sm text-gray-500 mb-6">Less than $2/month</div>
            
            {user ? (
              <div className="space-y-4">
                <a
                  href="/deals"
                  className="w-full bg-blue-600 text-white px-6 py-3 font-semibold rounded-lg hover:bg-blue-700 text-center block"
                >
                  View Latest Deals
                </a>
                {!subscription?.isPaid && (
                  <a
                    href="/pricing"
                    className="w-full bg-yellow-600 text-white px-6 py-3 font-semibold rounded-lg hover:bg-yellow-700 text-center block"
                  >
                    Upgrade to Premium - $20/year
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter my email to get started"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white px-6 py-3 font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Getting Started...' : 'Get Started - $20/year'}
                </button>
              </form>
            )}
            
            <p className="text-xs text-gray-500 mt-4">Cancel anytime. No hidden fees.</p>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🔒</span>
              <span>Bank-level security</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">📧</span>
              <span>No spam, ever</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">💰</span>
              <span>Pays for itself in one trip</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">🚫</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">How do you find these secret deals?</h3>
              <p className="text-gray-600">Our AI monitors 50+ hidden sources 24/7, including airline partner networks, error fare databases, and exclusive deal feeds. We catch deals the moment they appear, before airlines can hide them.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">What makes these deals "secret"?</h3>
              <p className="text-gray-600">These aren't just cheap flights - they're error fares, partner network deals, and flash sales that airlines don't advertise publicly. Most travelers never see them because they're buried in hidden booking systems.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">How much can I really save?</h3>
              <p className="text-gray-600">Our members save an average of $500+ per trip. Some find deals that save $1,000+ on international flights. The service pays for itself in one booking.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Why is it only $20/year?</h3>
              <p className="text-gray-600">We believe everyone deserves to travel affordably. Our automated system keeps costs low, so we can offer this service for less than $2/month - less than a coffee.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Can I cancel anytime?</h3>
              <p className="text-gray-600">Absolutely. Cancel with one click, no questions asked. We want you to stay only if you're finding value in our secret deals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Access Secret Flight Deals?</h2>
          <p className="text-xl mb-8">Join thousands of smart travelers finding hidden deals that save $500+ per trip</p>
          
          {user ? (
            <div className="max-w-md mx-auto space-y-3">
              <a
                href="/deals"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold text-center block"
              >
                View Latest Deals
              </a>
              {!subscription?.isPaid && (
                <a
                  href="/pricing"
                  className="w-full bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 font-semibold text-center block"
                >
                  Upgrade to Premium - $20/year
                </a>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter my email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
                >
                  {isSubmitting ? 'Starting...' : 'Get Started'}
                </button>
              </div>
            </form>
          )}
          
          <p className="text-sm text-gray-400 mt-4">$20/year • Cancel anytime • No spam</p>
        </div>
      </section>
    </div>
    </>
  );
}