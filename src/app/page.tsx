'use client';

import { useState } from 'react';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        // Redirect to deals page after successful subscription
        window.location.href = '/deals';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* 4-U Formula Headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Stop Overpaying for Flights
              <span className="block text-blue-600">Save $500+ Every Trip</span>
            </h1>
            
            {/* Above-Fold Value Proposition */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get the exact same flights for 40-60% less. Our AI finds hidden deals airlines don't want you to see.
            </p>

            {/* CTA First-Person Psychology */}
            <div className="max-w-md mx-auto mb-12">
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
              
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white"></div>
                </div>
                <span>Join 12,847 travelers saving money</span>
              </div>
              <div>⭐ 4.9/5 rating</div>
              <div>🔒 100% free, no spam</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Agitation Solution */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">😤</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tired of Overpaying?</h3>
              <p className="text-gray-600">Most people pay 40-60% more than they need to for flights. Airlines hide the best deals from you.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Deals Disappear Fast</h3>
              <p className="text-gray-600">The best flight deals last only 2-4 hours. By the time you find them, they're gone forever.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">We Find Them First</h3>
              <p className="text-gray-600">Our AI monitors 50+ sources 24/7 and sends you deals the moment they appear.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Real People, Real Savings</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  S
                </div>
                <div>
                  <h4 className="font-semibold">Sarah M.</h4>
                  <p className="text-sm text-gray-500">Los Angeles</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">"Saved $847 on my trip to Barcelona. Found a deal I never would have seen on my own!"</p>
              <div className="text-green-600 font-semibold">Saved $847</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  M
                </div>
                <div>
                  <h4 className="font-semibold">Mike R.</h4>
                  <p className="text-sm text-gray-500">New York</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">"Got a $1,200 flight to Tokyo for $480. This service pays for itself in one trip!"</p>
              <div className="text-green-600 font-semibold">Saved $720</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  J
                </div>
                <div>
                  <h4 className="font-semibold">Jessica L.</h4>
                  <p className="text-sm text-gray-500">Chicago</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">"I travel for work monthly. This has saved me over $3,000 this year alone."</p>
              <div className="text-green-600 font-semibold">Saved $3,000+</div>
            </div>
          </div>
        </div>
      </section>

      {/* Price Anchoring & Urgency */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Limited Time: Free Access</h2>
          <p className="text-xl mb-8">Normally $47/month, but you can try it free for 30 days</p>
          
          <div className="bg-white text-gray-900 p-8 rounded-lg max-w-md mx-auto">
            <div className="text-4xl font-bold text-blue-600 mb-2">$0</div>
            <div className="text-lg mb-4">First 30 days free</div>
            <div className="text-sm text-gray-500 line-through mb-6">Then $47/month</div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter my email for free access"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white px-6 py-3 font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Starting My Free Trial...' : 'Start My Free Trial'}
              </button>
            </form>
            
            <p className="text-xs text-gray-500 mt-4">Cancel anytime. No credit card required.</p>
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
              <span className="text-2xl mr-2">✅</span>
              <span>30-day guarantee</span>
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
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">How do you find these deals?</h3>
              <p className="text-gray-600">We monitor 50+ flight deal sources 24/7 using AI. When a great deal appears, we send it to you immediately.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Is this really free?</h3>
              <p className="text-gray-600">Yes! Your first 30 days are completely free. No credit card required to start.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">How much can I save?</h3>
              <p className="text-gray-600">Our users save an average of $500+ per trip. Some save over $1,000 on international flights.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Absolutely. Cancel with one click, no questions asked. We want you to stay only if you're getting value.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Stop Overpaying?</h2>
          <p className="text-xl mb-8">Join thousands of smart travelers saving money on every trip</p>
          
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
          
          <p className="text-sm text-gray-400 mt-4">Free for 30 days • Cancel anytime • No spam</p>
        </div>
      </section>
    </div>
  );
}