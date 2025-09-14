import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: {
    default: "LAFareDrop - Find Cheap Flights from Los Angeles | Save $30-179 per Year",
    template: "%s | LAFareDrop"
  },
  description: "LAFareDrop monitors 50+ flight deal sources 24/7 to find the lowest prices from Los Angeles. Get weekly flight deals, direct booking links, and save $30-179 per year compared to competitors. Premium features include international destinations, sorting, and price alerts.",
  keywords: [
    "cheap flights from LAX",
    "Los Angeles flight deals",
    "LAX to anywhere flights",
    "flight deals from Los Angeles",
    "cheap flights Los Angeles",
    "flight deals LAX",
    "best flight deals",
    "flight deals monitor",
    "cheap flights weekly",
    "flight deals subscription",
    "LAX flight deals",
    "Los Angeles cheap flights",
    "flight deals from LAX",
    "weekly flight deals",
    "flight deals email"
  ],
  authors: [{ name: "LAFareDrop" }],
  creator: "LAFareDrop",
  publisher: "LAFareDrop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.SITE_URL || 'https://www.lafaredrop.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'LAFareDrop',
    title: 'LAFareDrop - Find Cheap Flights from Los Angeles',
    description: 'Monitor 50+ flight deal sources 24/7 to find the lowest prices from Los Angeles. Save $30-179 per year with our weekly flight deals and premium features.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LAFareDrop - Cheap Flights from Los Angeles',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LAFareDrop - Find Cheap Flights from Los Angeles',
    description: 'Monitor 50+ flight deal sources 24/7 to find the lowest prices from Los Angeles. Save $30-179 per year with our weekly flight deals.',
    images: ['/twitter-image.jpg'],
    creator: '@lafaredrop',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  category: 'Travel',
  classification: 'Travel and Tourism',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'LAFareDrop',
    'mobile-web-app-capable': 'yes',
    'theme-color': '#3b82f6',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
