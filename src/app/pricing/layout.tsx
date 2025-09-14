import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing - Best LAX Deals Premium Subscription | $20/Year',
  description: 'Upgrade to Best LAX Deals Premium for just $20/year. Get all flight deals with direct booking links, international destinations, sorting features, and price alerts. Save $30-179 per year compared to competitors.',
  keywords: [
    'flight deals subscription',
    'cheap flights subscription',
    'flight deals premium',
    'LAX flight deals subscription',
    'flight deals membership',
    'cheap flights membership',
    'flight deals pricing',
    'flight deals cost',
    'flight deals plan',
    'flight deals service'
  ],
  openGraph: {
    title: 'Pricing - Best LAX Deals Premium Subscription | $20/Year',
    description: 'Upgrade to Best LAX Deals Premium for just $20/year. Get all flight deals with direct booking links, international destinations, and sorting features.',
    url: '/pricing',
    images: [
      {
        url: '/pricing-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Best LAX Deals Pricing - $20/Year Premium Subscription',
      },
    ],
  },
  twitter: {
    title: 'Pricing - Best LAX Deals Premium Subscription | $20/Year',
    description: 'Upgrade to Best LAX Deals Premium for just $20/year. Get all flight deals with direct booking links and premium features.',
    images: ['/pricing-twitter-image.jpg'],
  },
  alternates: {
    canonical: '/pricing',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
