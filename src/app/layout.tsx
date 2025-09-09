import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stop Overpaying for Flights - Save $500+ Every Trip | FlightDeals",
  description: "Get the exact same flights for 40-60% less. Our AI finds hidden deals airlines don't want you to see. Join 12,847 travelers saving money.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
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
                <a href="/admin" className="text-gray-600 hover:text-gray-900">
                  Admin
                </a>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
