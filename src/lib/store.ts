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

export async function getTopDeals({ limit = 50, days = 7 } = {}) {
  try {
    const db = getFirestoreDB();
    const since = dayjs().subtract(days, 'day').toISOString();
    console.log('Fetching deals since:', since);
    
    // First try the compound query (requires index) - use receivedAt for email date
    try {
      const snap = await db.collection('deals')
        .where('receivedAt', '>=', since)
        .orderBy('price', 'asc')
        .limit(limit)
        .get();
      
      const deals = snap.docs.map((d: any) => d.data());
      console.log('Found deals with compound query:', deals.length);
      return deals;
    } catch (indexError) {
      console.log('Compound query failed (missing index), trying simple query...');
      
      // Fallback: get all deals and filter in memory
      const snap = await db.collection('deals')
        .orderBy('receivedAt', 'desc')
        .limit(limit * 3) // Get more to account for filtering
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
      
      // Sort by price and limit
      const sortedDeals = recentDeals
        .filter(deal => deal.price) // Only deals with prices
        .sort((a, b) => (a.price || 0) - (b.price || 0))
        .slice(0, limit);
      
      console.log('Final deals returned:', sortedDeals.length);
      return sortedDeals;
    }
  } catch (error) {
    console.error('Error in getTopDeals:', error);
    return [];
  }
}
