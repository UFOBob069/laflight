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

export default function SortableTable({ deals, airportCodes }: { deals: Deal[]; airportCodes: Map<string, AirportCode> }) {
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

  const SortButton = ({ columnKey, children }: { columnKey: keyof Deal; children: React.ReactNode }) => (
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

  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No deals found. Try running the ingest process first.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border">
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
                  <a 
                    className="text-blue-600 hover:text-blue-800 underline" 
                    href={d.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View Deal
                  </a>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
