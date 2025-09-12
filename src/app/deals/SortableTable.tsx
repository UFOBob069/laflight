'use client';

import { useState } from 'react';

interface AirportCode {
  code: string;
  city: string;
  country: string;
}

interface Deal {
  id: string;
  origin: string;
  destination: string;
  price?: number;
  currency: string;
  dates?: string;
  link?: string;
  airline?: string;
  stops?: string;
  route?: string;
  duration?: string;
  discount?: string;
  receivedAt?: string;
  createdAt?: string;
}

interface SortConfig {
  key: keyof Deal;
  direction: 'asc' | 'desc';
}

export default function SortableTable({ 
  deals, 
  airportCodes, 
  allowSorting = true, 
  showUpgradePrompt = false,
  isAuthenticated = false
}: { 
  deals: Deal[]; 
  airportCodes: Map<string, AirportCode>;
  allowSorting?: boolean;
  showUpgradePrompt?: boolean;
  isAuthenticated?: boolean;
}) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'price', direction: 'asc' });

  const handleSort = (key: keyof Deal) => {
    console.log('Sorting by:', key, 'Current config:', sortConfig);
    setSortConfig(prev => {
      const newConfig: SortConfig = {
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
      };
      console.log('New sort config:', newConfig);
      return newConfig;
    });
  };

  const sortedDeals = [...deals].sort((a, b) => {
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];

    // Handle special cases for date sorting
    if (sortConfig.key === 'receivedAt' || sortConfig.key === 'createdAt') {
      aVal = new Date(aVal || 0).getTime();
      bVal = new Date(bVal || 0).getTime();
    }

    // Handle discount sorting - extract percentage numbers
    if (sortConfig.key === 'discount') {
      const extractPercentage = (val: any) => {
        if (!val) return 0;
        const match = String(val).match(/(\d+)%/);
        return match ? parseInt(match[1]) : 0;
      };
      aVal = extractPercentage(aVal);
      bVal = extractPercentage(bVal);
    }

    if (aVal === undefined && bVal === undefined) return 0;
    if (aVal === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
    if (bVal === undefined) return sortConfig.direction === 'asc' ? -1 : 1;

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      const result = sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      console.log(`Comparing ${aVal} vs ${bVal}, direction: ${sortConfig.direction}, result: ${result}`);
      return result;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    
    if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const SortButton = ({ columnKey, children }: { columnKey: keyof Deal; children: React.ReactNode }) => {
    if (!allowSorting) {
      return (
        <div className="flex items-center space-x-1 text-left font-medium text-gray-700">
          <span>{children}</span>
          <span className="text-xs text-gray-400">🔒</span>
        </div>
      );
    }

    return (
      <button
        onClick={() => handleSort(columnKey)}
        className="flex items-center space-x-1 text-left font-medium text-gray-700 hover:text-gray-900"
      >
        <span>{children}</span>
        <span className="text-xs">
          {sortConfig.key === columnKey ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </button>
    );
  };

  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No deals found. Try running the ingest process first.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3">
                <SortButton columnKey="origin">Route</SortButton>
              </th>
              <th className="px-4 py-3">
                <SortButton columnKey="price">Price</SortButton>
              </th>
              <th className="px-4 py-3">
                <SortButton columnKey="discount">Discount</SortButton>
              </th>
              <th className="px-4 py-3">
                <SortButton columnKey="dates">Dates</SortButton>
              </th>
              <th className="px-4 py-3">
                <SortButton columnKey="airline">Airline</SortButton>
              </th>
              <th className="px-4 py-3">
                <SortButton columnKey="stops">Details</SortButton>
              </th>
              <th className="px-4 py-3">
                <SortButton columnKey="receivedAt">Received</SortButton>
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedDeals.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium">
                    <div className="text-sm">{d.origin} → {d.destination}</div>
                    <div className="text-xs text-gray-500">
                      {airportCodes.get(d.origin) ? `${airportCodes.get(d.origin)!.city}, ${airportCodes.get(d.origin)!.country}` : d.origin} → {airportCodes.get(d.destination) ? `${airportCodes.get(d.destination)!.city}, ${airportCodes.get(d.destination)!.country}` : d.destination}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {d.price ? (
                    <span className="font-semibold text-green-600">
                      ${d.price.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {d.discount ? (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                      {d.discount}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{d.dates || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{d.airline || '—'}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">
                  {d.stops && <div>{d.stops}</div>}
                  {d.duration && <div>{d.duration}</div>}
                  {d.route && <div>{d.route}</div>}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(d.receivedAt || d.createdAt || '').toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  {d.link ? (
                    isAuthenticated ? (
                      <a 
                        className="text-blue-600 hover:text-blue-800 underline" 
                        href={d.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        View Deal
                      </a>
                    ) : (
                      <span className="text-gray-400">Sign in to view</span>
                    )
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {sortedDeals.map((d) => (
          <div key={d.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm">
                  {d.origin} → {d.destination}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {airportCodes.get(d.origin) ? `${airportCodes.get(d.origin)!.city}, ${airportCodes.get(d.origin)!.country}` : d.origin} → {airportCodes.get(d.destination) ? `${airportCodes.get(d.destination)!.city}, ${airportCodes.get(d.destination)!.country}` : d.destination}
                </div>
              </div>
              <div className="text-right">
                {d.price ? (
                  <div className="font-bold text-green-600 text-lg">
                    ${d.price.toLocaleString()}
                  </div>
                ) : (
                  <div className="text-gray-400">—</div>
                )}
                {d.discount && (
                  <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded mt-1">
                    {d.discount}
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mb-3">
              <div>
                <div className="font-medium text-gray-500">Dates</div>
                <div>{d.dates || '—'}</div>
              </div>
              <div>
                <div className="font-medium text-gray-500">Airline</div>
                <div>{d.airline || '—'}</div>
              </div>
              {d.stops && (
                <div>
                  <div className="font-medium text-gray-500">Details</div>
                  <div>{d.stops}</div>
                  {d.duration && <div>{d.duration}</div>}
                </div>
              )}
              <div>
                <div className="font-medium text-gray-500">Received</div>
                <div>{new Date(d.receivedAt || d.createdAt || '').toLocaleDateString()}</div>
              </div>
            </div>
            
            <div className="pt-3 border-t border-gray-100">
              {d.link ? (
                isAuthenticated ? (
                  <a 
                    className="inline-block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium" 
                    href={d.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View Deal
                  </a>
                ) : (
                  <div className="text-center text-gray-400 text-sm py-2">
                    Sign in to view
                  </div>
                )
              ) : (
                <div className="text-center text-gray-400 text-sm py-2">
                  No link available
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {showUpgradePrompt && (
        <div className="mt-4 sm:mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 sm:p-6 text-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            Want to see all {deals.length} deals and sort them?
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Upgrade to Premium for unlimited access, sorting, filtering, and advanced features.
          </p>
          <a
            href="/pricing"
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-block text-sm sm:text-base"
          >
            Upgrade to Premium - $20/year
          </a>
        </div>
      )}
    </div>
  );
}
