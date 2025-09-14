import { NextRequest, NextResponse } from 'next/server';
import { getTopDeals } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const days = parseInt(searchParams.get('days') || '7');
    const sortBy = searchParams.get('sortBy') || 'discount';
    const isPaid = searchParams.get('isPaid') === 'true';
    
    // Adjust limit based on subscription status
    const adjustedLimit = isPaid ? Math.min(limit, 200) : Math.min(limit, 5);
    
    const deals = await getTopDeals({ 
      limit: adjustedLimit,
      days: Math.min(days, 30),    // Cap at 30 days
      sortBy,
      isPaid
    });
    
    return NextResponse.json({ 
      deals,
      count: deals.length,
      sortBy,
      limit: adjustedLimit,
      days,
      isPaid
    });
  } catch (error) {
    console.error('Deals fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch deals',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}