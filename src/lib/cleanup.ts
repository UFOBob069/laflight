import { getFirestoreDB } from './firebaseAdmin';
import dayjs from 'dayjs';

/**
 * Clean up old flight deals to improve performance and reduce costs
 * Deletes deals older than the specified number of days
 */
export async function cleanupOldDeals(daysToKeep: number = 14) {
  try {
    const db = getFirestoreDB();
    const cutoffDate = dayjs().subtract(daysToKeep, 'day').toISOString();
    
    console.log(`🧹 Starting cleanup of deals older than ${daysToKeep} days (before ${cutoffDate})`);
    
    // Query for old deals
    const oldDealsQuery = db.collection('deals')
      .where('receivedAt', '<', cutoffDate)
      .limit(500); // Process in batches to avoid timeout
    
    const snapshot = await oldDealsQuery.get();
    
    if (snapshot.empty) {
      console.log('✅ No old deals found to clean up');
      return { deletedCount: 0 };
    }
    
    console.log(`🗑️  Found ${snapshot.size} old deals to delete`);
    
    // Delete in batches
    const batch = db.batch();
    let deletedCount = 0;
    
    snapshot.docs.forEach((doc: any) => {
      batch.delete(doc.ref);
      deletedCount++;
    });
    
    await batch.commit();
    
    console.log(`✅ Successfully deleted ${deletedCount} old deals`);
    
    return { deletedCount };
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

/**
 * Get storage statistics for monitoring
 */
export async function getStorageStats() {
  try {
    const db = getFirestoreDB();
    
    // Get total count
    const totalSnapshot = await db.collection('deals').count().get();
    const totalDeals = totalSnapshot.data().count;
    
    // Get recent count (last 7 days)
    const recentDate = dayjs().subtract(7, 'day').toISOString();
    const recentSnapshot = await db.collection('deals')
      .where('receivedAt', '>=', recentDate)
      .count()
      .get();
    const recentDeals = recentSnapshot.data().count;
    
    // Get old count (older than 14 days)
    const oldDate = dayjs().subtract(14, 'day').toISOString();
    const oldSnapshot = await db.collection('deals')
      .where('receivedAt', '<', oldDate)
      .count()
      .get();
    const oldDeals = oldSnapshot.data().count;
    
    return {
      totalDeals,
      recentDeals,
      oldDeals,
      cleanupCandidates: oldDeals
    };
    
  } catch (error) {
    console.error('❌ Error getting storage stats:', error);
    throw error;
  }
}

/**
 * Optimize indexes by creating the missing compound index
 */
export async function ensureIndexes() {
  try {
    const db = getFirestoreDB();
    
    // Test the compound query to see if index exists
    const testQuery = db.collection('deals')
      .where('receivedAt', '>=', dayjs().subtract(7, 'day').toISOString())
      .orderBy('price', 'asc')
      .limit(1);
    
    await testQuery.get();
    console.log('✅ Compound index exists and working');
    
    return { indexStatus: 'working' };
    
  } catch (error: any) {
    if (error.code === 'failed-precondition') {
      console.log('⚠️  Compound index missing. Please create this index in Firebase Console:');
      console.log('Collection: deals');
      console.log('Fields: receivedAt (Ascending), price (Ascending)');
      return { indexStatus: 'missing', needsIndex: true };
    }
    
    console.error('❌ Error checking indexes:', error);
    throw error;
  }
}
