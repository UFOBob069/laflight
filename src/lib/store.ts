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
    
    const snap = await db.collection('deals')
      .where('createdAt', '>=', since)
      .orderBy('price', 'asc')
      .limit(limit)
      .get();
    
    const deals = snap.docs.map((d: any) => d.data());
    console.log('Found deals:', deals.length);
    return deals;
  } catch (error) {
    console.error('Error in getTopDeals:', error);
    // Fallback: get all deals without date filter if the query fails
    try {
      const db = getFirestoreDB();
      const snap = await db.collection('deals')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();
      return snap.docs.map((d: any) => d.data());
    } catch (fallbackError) {
      console.error('Fallback query also failed:', fallbackError);
      return [];
    }
  }
}
