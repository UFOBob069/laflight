import { NextRequest, NextResponse } from 'next/server';
import { getTopDeals } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const deals = await getTopDeals({ limit: 50, days: 7 });
    
    return NextResponse.json({ 
      deals,
      count: deals.length
    });
  } catch (error) {
    console.error('Deals fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch deals',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}