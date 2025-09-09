import { Suspense } from 'react';
import SortableTable from './SortableTable';
import { loadAirportCodes } from '@/lib/airports';

async function getDeals() {
  try {
    // Use direct import instead of fetch for server-side rendering
    const { getTopDeals } = await import('@/lib/store');
    const deals = await getTopDeals({ limit: 50, days: 7 });
    return { deals };
  } catch (error) {
    console.error('Error fetching deals:', error);
    return { deals: [] };
  }
}

export default async function DealsPage() {
  const { deals } = await getDeals();
  const airportCodes = loadAirportCodes();
  
  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Top Flight Deals</h1>
        <p className="text-gray-600">Best deals from the last 7 days, sorted by price</p>
      </div>
      
      <Suspense fallback={
        <div className="text-center py-12">
          <p className="text-gray-500">Loading deals...</p>
        </div>
      }>
        <SortableTable deals={deals} airportCodes={airportCodes} />
      </Suspense>
    </main>
  );
}
