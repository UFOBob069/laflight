import { NextRequest, NextResponse } from 'next/server';
import { getTopDeals } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    console.log('🧪 Testing deal sorting...');
    
    // Test both free and paid sorting
    const freeDeals = await getTopDeals({ limit: 10, days: 7, sortBy: 'price', isPaid: false });
    const paidDeals = await getTopDeals({ limit: 10, days: 7, sortBy: 'discount', isPaid: true });
    
    return NextResponse.json({
      free: {
        count: freeDeals.length,
        deals: freeDeals.slice(0, 3).map(d => ({
          origin: d.origin,
          destination: d.destination,
          price: d.price,
          discount: d.discount,
          discountPercentage: d.discountPercentage || 0
        }))
      },
      paid: {
        count: paidDeals.length,
        deals: paidDeals.slice(0, 3).map(d => ({
          origin: d.origin,
          destination: d.destination,
          price: d.price,
          discount: d.discount,
          discountPercentage: d.discountPercentage || 0
        }))
      }
    });
    
  } catch (error) {
    console.error('Test sorting error:', error);
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
