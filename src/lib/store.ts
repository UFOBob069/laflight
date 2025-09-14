import { getFirestoreDB } from './firebaseAdmin';
import crypto from 'crypto';
import dayjs from 'dayjs';

export async function saveDeals(items: Array<any>) {
  console.log('🔥 saveDeals called with', items.length, 'items');
  
  try {
    const db = getFirestoreDB();
    console.log('🔥 Firestore DB obtained');
    
    const batch = db.batch();
    console.log('🔥 Batch created');
    
    for (const it of items) {
      const id = it.messageId || crypto.createHash('sha1')
        .update([it.origin, it.destination, it.price ?? '', it.dates ?? '', it.link ?? ''].join('|'))
        .digest('hex');

      const ref = db.collection('deals').doc(id);
      
      // Filter out undefined values (Firebase doesn't allow them)
      const cleanData = Object.fromEntries(
        Object.entries({
          id,
          ...it,
          currency: it.currency || 'USD',
          createdAt: new Date().toISOString(),
        }).filter(([_, value]) => value !== undefined)
      );
      
      console.log('🔥 Adding deal to batch:', id);
      batch.set(ref, cleanData, { merge: true });
    }
    
    console.log('🔥 Committing batch with', items.length, 'operations...');
    const result = await batch.commit();
    console.log('🔥 Batch committed successfully!', result);
    
  } catch (error) {
    console.error('🔥 Error in saveDeals:', error);
    console.error('🔥 Error details:', {
      name: (error as any).name,
      message: (error as any).message,
      code: (error as any).code,
      stack: (error as any).stack
    });
    throw error;
  }
}

export async function getTopDeals({ limit = 100, days = 7, sortBy = 'discount', isPaid = false } = {}) {
  try {
    const db = getFirestoreDB();
    const since = dayjs().subtract(days, 'day').toISOString();
    console.log('Fetching deals since:', since, 'sortBy:', sortBy, 'isPaid:', isPaid);
    
    // Get more deals to ensure we have enough for proper sorting
    const fetchLimit = Math.max(limit * 3, 200); // Fetch more to account for filtering and sorting
    
    // First try the compound query (requires index) - use receivedAt for email date
    try {
      const snap = await db.collection('deals')
        .where('receivedAt', '>=', since)
        .orderBy('receivedAt', 'desc') // Get most recent first
        .limit(fetchLimit)
        .get();
      
      const deals = snap.docs.map((d: any) => d.data());
      console.log('Found deals with compound query:', deals.length);
      
      // Sort based on user type and preference
      const sortedDeals = isPaid 
        ? sortDealsByDiscount(deals, limit)  // Paid: biggest discounts first
        : sortDealsByPrice(deals, limit);    // Free: lowest price first
      
      console.log(`Final deals returned (${isPaid ? 'discount' : 'price'} sorted):`, sortedDeals.length);
      return sortedDeals;
      
    } catch (indexError) {
      console.log('Compound query failed (missing index), trying simple query...');
      
      // Fallback: get recent deals and filter in memory
      const snap = await db.collection('deals')
        .orderBy('receivedAt', 'desc')
        .limit(fetchLimit)
        .get();
      
      const allDeals = snap.docs.map((d: any) => d.data());
      console.log('Total deals fetched:', allDeals.length);
      
      // Filter by date in memory (use receivedAt if available, fallback to createdAt)
      const recentDeals = allDeals.filter((deal: any) => {
        const dealDate = new Date(deal.receivedAt || deal.createdAt);
        const cutoffDate = new Date(since);
        return dealDate >= cutoffDate;
      });
      
      console.log('Deals after date filtering:', recentDeals.length);
      
      // Sort based on user type and preference
      const sortedDeals = isPaid 
        ? sortDealsByDiscount(recentDeals, limit)  // Paid: biggest discounts first
        : sortDealsByPrice(recentDeals, limit);    // Free: lowest price first
      
      console.log(`Final deals returned (${isPaid ? 'discount' : 'price'} sorted):`, sortedDeals.length);
      return sortedDeals;
    }
  } catch (error) {
    console.error('Error in getTopDeals:', error);
    return [];
  }
}

/**
 * Sort deals by discount percentage (biggest discounts first)
 * Falls back to price (lowest first) for deals without discount info
 */
function sortDealsByDiscount(deals: any[], limit: number) {
  console.log('🔍 Sorting deals by discount. Total deals:', deals.length);
  
  const processedDeals = deals
    .filter((deal: any) => deal.price) // Only deals with prices
    .map((deal: any) => {
      const discountPercentage = extractDiscountPercentage(deal.discount);
      const score = calculateDealScore(deal);
      
      // Debug logging for first few deals
      if (deals.indexOf(deal) < 3) {
        console.log(`🔍 Deal ${deals.indexOf(deal) + 1}:`, {
          origin: deal.origin,
          destination: deal.destination,
          price: deal.price,
          discount: deal.discount,
          discountPercentage,
          score
        });
      }
      
      return {
        ...deal,
        discountPercentage,
        score
      };
    });
  
  const dealsWithDiscounts = processedDeals.filter(d => d.discountPercentage > 0);
  console.log('🔍 Deals with discount info:', dealsWithDiscounts.length);
  
  // If no deals have discount info, fall back to price sorting
  if (dealsWithDiscounts.length === 0) {
    console.log('⚠️ No deals with discount info found, falling back to price sorting');
    return processedDeals
      .sort((a: any, b: any) => (a.price || 0) - (b.price || 0))
      .slice(0, limit);
  }
  
  const sortedDeals = processedDeals.sort((a: any, b: any) => {
      // Primary sort: by discount percentage (descending - biggest discounts first)
      if (a.discountPercentage > 0 && b.discountPercentage > 0) {
        return b.discountPercentage - a.discountPercentage;
      }
      
      // Secondary sort: deals with discounts vs without
      if (a.discountPercentage > 0 && b.discountPercentage === 0) return -1;
      if (a.discountPercentage === 0 && b.discountPercentage > 0) return 1;
      
      // Tertiary sort: by composite score (higher is better)
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      
      // Final sort: by price (ascending - cheapest first)
      return (a.price || 0) - (b.price || 0);
    })
    .slice(0, limit);
  
  console.log('🔍 Top 3 sorted deals:', sortedDeals.slice(0, 3).map(d => ({
    origin: d.origin,
    destination: d.destination,
    price: d.price,
    discount: d.discount,
    discountPercentage: d.discountPercentage
  })));
  
  return sortedDeals;
}

/**
 * Sort deals by price (lowest price first) for free users
 * Simple price-based sorting to show the cheapest deals
 */
function sortDealsByPrice(deals: any[], limit: number) {
  return deals
    .filter((deal: any) => deal.price) // Only deals with prices
    .sort((a: any, b: any) => (a.price || 0) - (b.price || 0)) // Sort by price ascending
    .slice(0, limit);
}

/**
 * Extract discount percentage from discount string (e.g., "SAVE 16%" -> 16)
 */
function extractDiscountPercentage(discount: string | undefined): number {
  if (!discount) return 0;
  
  // Try multiple patterns to extract percentage
  const patterns = [
    /(\d+)%/,                    // "16%" or "SAVE 16%"
    /SAVE\s+(\d+)%/i,           // "SAVE 16%"
    /(\d+)\s*%/,                // "16 %"
    /save\s+(\d+)%/i,           // "save 16%"
    /(\d+)%\s*off/i,            // "16% off"
    /(\d+)%\s*discount/i,       // "16% discount"
  ];
  
  for (const pattern of patterns) {
    const match = String(discount).match(pattern);
    if (match) {
      const percentage = parseInt(match[1]);
      if (percentage > 0 && percentage <= 100) {
        return percentage;
      }
    }
  }
  
  return 0;
}

/**
 * Calculate a composite score for deal ranking
 * Higher score = better deal
 */
function calculateDealScore(deal: any): number {
  let score = 0;
  
  // Base score from discount percentage
  const discountPct = extractDiscountPercentage(deal.discount);
  score += discountPct * 10; // Weight discount heavily
  
  // Bonus for very low prices (under $500)
  if (deal.price && deal.price < 500) {
    score += 50;
  }
  
  // Bonus for international destinations (more valuable)
  const isInternational = deal.destination && 
    !['LAX', 'SFO', 'SEA', 'PDX', 'SAN', 'LAS', 'PHX', 'DEN', 'DFW', 'IAH', 'ATL', 'MIA', 'JFK', 'LGA', 'EWR', 'BOS', 'ORD', 'DTW', 'MSP', 'MCO', 'TPA', 'FLL', 'CLT', 'RDU', 'BWI', 'DCA', 'IAD'].includes(deal.destination);
  if (isInternational) {
    score += 20;
  }
  
  // Bonus for direct flights
  if (deal.stops && (deal.stops.includes('Direct') || deal.stops.includes('Nonstop'))) {
    score += 15;
  }
  
  // Penalty for very high prices (over $1000)
  if (deal.price && deal.price > 1000) {
    score -= 20;
  }
  
  return score;
}
