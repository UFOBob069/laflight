import { NextRequest, NextResponse } from 'next/server';
import { cleanupOldDeals, getStorageStats, ensureIndexes } from '@/lib/cleanup';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret');
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    console.log('🧹 Starting cleanup process...');
    
    // Get current stats
    const stats = await getStorageStats();
    console.log('📊 Current storage stats:', stats);
    
    // Clean up old deals (keep 14 days)
    const cleanupResult = await cleanupOldDeals(14);
    
    // Check index status
    const indexStatus = await ensureIndexes();
    
    // Get updated stats
    const updatedStats = await getStorageStats();
    
    return NextResponse.json({
      success: true,
      cleanup: cleanupResult,
      stats: {
        before: stats,
        after: updatedStats
      },
      indexStatus,
      message: `Cleanup completed. Deleted ${cleanupResult.deletedCount} old deals.`
    });
    
  } catch (error) {
    console.error('❌ Cleanup error:', error);
    return NextResponse.json({
      error: 'Cleanup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const stats = await getStorageStats();
    const indexStatus = await ensureIndexes();
    
    return NextResponse.json({
      stats,
      indexStatus,
      recommendations: {
        shouldCleanup: stats.cleanupCandidates > 100,
        cleanupCandidates: stats.cleanupCandidates,
        indexNeeded: indexStatus.needsIndex
      }
    });
    
  } catch (error) {
    console.error('❌ Stats error:', error);
    return NextResponse.json({
      error: 'Failed to get stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
