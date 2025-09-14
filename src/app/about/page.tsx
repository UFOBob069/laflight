import type { Metadata } from 'next';
import { getOrganizationSchema, getServiceSchema } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'About Best LAX Deals - How We Find Secret Flight Deals from Los Angeles',
  description: 'Discover how Best LAX Deals finds hidden flight deals from Los Angeles that airlines don\'t want you to see. Our AI monitors 50+ sources 24/7 to uncover secret savings of $30-179 per year.',
  keywords: [
    'about best LAX deals',
    'how we find flight deals',
    'secret flight deals Los Angeles',
    'hidden flight deals LAX',
    'flight deals methodology',
    'cheap flights Los Angeles how',
    'flight deals sources',
    'LAX flight deals secret',
    'flight deals AI monitoring',
    'best flight deals Los Angeles'
  ],
  openGraph: {
    title: 'About Best LAX Deals - How We Find Secret Flight Deals from Los Angeles',
    description: 'Discover how Best LAX Deals finds hidden flight deals from Los Angeles that airlines don\'t want you to see. Our AI monitors 50+ sources 24/7 to uncover secret savings.',
    url: '/about',
    images: [
      {
        url: '/about-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'About Best LAX Deals - Secret Flight Deals from Los Angeles',
      },
    ],
  },
  twitter: {
    title: 'About Best LAX Deals - How We Find Secret Flight Deals from Los Angeles',
    description: 'Discover how Best LAX Deals finds hidden flight deals from Los Angeles that airlines don\'t want you to see.',
    images: ['/about-twitter-image.jpg'],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
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
          __html: JSON.stringify(getServiceSchema())
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                The Secret to Finding
                <span className="text-blue-600 block">Hidden Flight Deals</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
                How we uncover the deals airlines don't want you to see, 
                saving Los Angeles travelers $30-179 per year
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/deals" 
                  className="bg-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  See Current Secret Deals →
                </a>
                <a 
                  href="/pricing" 
                  className="bg-yellow-600 text-white px-8 py-4 text-lg font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Get All Hidden Deals - $20/year
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why You're Overpaying for Flights
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Airlines hide their best deals in places most travelers never look. 
                While you're searching Google Flights and airline websites, 
                we're finding the deals they don't want you to see.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-red-50 rounded-lg">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Limited Search</h3>
                <p className="text-gray-600">
                  Most people only check 2-3 websites, missing 80% of available deals 
                  hidden in airline partner networks and error fares.
                </p>
              </div>
              
              <div className="text-center p-6 bg-red-50 rounded-lg">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Timing Issues</h3>
                <p className="text-gray-600">
                  The best deals appear and disappear within hours. 
                  By the time you check, they're gone forever.
                </p>
              </div>
              
              <div className="text-center p-6 bg-red-50 rounded-lg">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Wrong Sources</h3>
                <p className="text-gray-600">
                  Airlines bury their cheapest fares in partner booking systems 
                  and error fare databases that require special access.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Secret Method Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Secret Method
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                While others rely on basic search engines, we use advanced AI 
                to monitor 50+ hidden sources 24/7, finding deals that save 
                you hundreds of dollars per trip.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">AI Monitoring</h3>
                <p className="text-blue-100">
                  Our AI never sleeps, scanning 50+ deal sources every minute 
                  to catch deals the moment they appear.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Hidden Sources</h3>
                <p className="text-blue-100">
                  We monitor airline partner networks, error fare databases, 
                  and exclusive deal feeds that most travelers never see.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Instant Alerts</h3>
                <p className="text-blue-100">
                  When we find a deal, you get notified immediately via email 
                  with direct booking links before it disappears.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✈️</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">LAX Focus</h3>
                <p className="text-blue-100">
                  We specialize in Los Angeles departures, knowing the best 
                  routes, airlines, and timing for maximum savings.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Our Deals Special Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What Makes Our Deals Special
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These aren't just "cheap flights" - these are hand-picked, 
                secret deals that airlines don't advertise publicly.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  The Deals Airlines Hide
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-green-100 rounded-full p-2 mr-4 mt-1">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Error Fares</h4>
                      <p className="text-gray-600">
                        When airlines make pricing mistakes, we catch them before they fix them. 
                        These can save you 60-80% off normal prices.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-100 rounded-full p-2 mr-4 mt-1">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Partner Network Deals</h4>
                      <p className="text-gray-600">
                        Airlines often offer better prices through their partner booking systems 
                        than their own websites. We monitor these hidden channels.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-100 rounded-full p-2 mr-4 mt-1">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Flash Sales</h4>
                      <p className="text-gray-600">
                        Airlines run secret flash sales that last only hours. 
                        Our AI catches these the moment they go live.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-100 rounded-full p-2 mr-4 mt-1">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">International Routes</h4>
                      <p className="text-gray-600">
                        Premium users get access to international deals that can save 
                        $200-500+ per trip compared to booking directly with airlines.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Real Savings Examples</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <div>
                      <div className="font-semibold">LAX → Tokyo</div>
                      <div className="text-sm text-gray-600">Normal price: $1,200</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-bold">$480</div>
                      <div className="text-sm text-gray-600">60% off</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <div>
                      <div className="font-semibold">LAX → London</div>
                      <div className="text-sm text-gray-600">Normal price: $800</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-bold">$320</div>
                      <div className="text-sm text-gray-600">60% off</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <div>
                      <div className="font-semibold">LAX → New York</div>
                      <div className="text-sm text-gray-600">Normal price: $400</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-bold">$120</div>
                      <div className="text-sm text-gray-600">70% off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why We Do This Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why We Do This
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We believe everyone deserves to travel, not just those who can afford 
                full-price airline tickets. Our mission is to democratize travel 
                by making these secret deals accessible to everyone.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Democratize Travel</h3>
                <p className="text-gray-600">
                  Everyone should be able to explore the world, not just those 
                  with unlimited travel budgets.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Save Money</h3>
                <p className="text-gray-600">
                  Our members save an average of $30-179 per year compared to 
                  booking flights the traditional way.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Save Time</h3>
                <p className="text-gray-600">
                  Instead of spending hours searching for deals, we do the work 
                  for you and deliver the best options directly to your inbox.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Access Secret Flight Deals?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of Los Angeles travelers who are already saving 
              hundreds of dollars on flights with our secret deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/deals" 
                className="bg-white text-blue-600 px-8 py-4 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                See Current Secret Deals →
              </a>
              <a 
                href="/pricing" 
                className="bg-yellow-600 text-white px-8 py-4 text-lg font-semibold rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Get All Hidden Deals - $20/year
              </a>
            </div>
            <p className="text-blue-200 mt-4 text-sm">
              Free users get top 5 deals • Premium users get all deals with booking links
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
