import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Current Flight Deals from Los Angeles - LAX to Anywhere',
  description: 'Browse the latest flight deals from Los Angeles (LAX) to destinations worldwide. Sort by price, date, or destination. Free users see lowest priced deals, premium users get all deals with direct booking links.',
  keywords: [
    'current flight deals LAX',
    'Los Angeles flight deals today',
    'LAX flight deals this week',
    'cheap flights from LAX now',
    'flight deals Los Angeles current',
    'LAX to anywhere deals',
    'flight deals from Los Angeles today',
    'cheap flights LAX current',
    'flight deals LAX this month',
    'Los Angeles cheap flights now'
  ],
  openGraph: {
    title: 'Current Flight Deals from Los Angeles - LAX to Anywhere',
    description: 'Browse the latest flight deals from Los Angeles (LAX) to destinations worldwide. Sort by price, date, or destination.',
    url: '/deals',
    images: [
      {
        url: '/deals-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Current Flight Deals from Los Angeles',
      },
    ],
  },
  twitter: {
    title: 'Current Flight Deals from Los Angeles - LAX to Anywhere',
    description: 'Browse the latest flight deals from Los Angeles (LAX) to destinations worldwide. Sort by price, date, or destination.',
    images: ['/deals-twitter-image.jpg'],
  },
  alternates: {
    canonical: '/deals',
  },
};

export default function DealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
