import { NextRequest, NextResponse } from 'next/server';
import { getTopDeals } from '@/lib/store';
import { sendDigestEmail } from '@/lib/email';
import { getFirestoreDB } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret');
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const { to } = await req.json().catch(() => ({}));
    
    // If specific email provided, send to that email
    if (to) {
      // Get deals sorted by discount for manual sends (assume paid user)
      const deals = await getTopDeals({ limit: 50, days: 7, sortBy: 'discount', isPaid: true });
      
      if (deals.length === 0) {
        return NextResponse.json({ 
          message: 'No deals found to send in digest',
          count: 0
        });
      }

      const result = await sendDigestEmail({
        to,
        deals,
        isPaid: true // Manual sends get full discount-sorted deals
      });

      return NextResponse.json({ 
        sent: true, 
        count: deals.length,
        emailId: result.data?.id
      });
    }

    // Send to all subscribers
    const db = getFirestoreDB();
    const subscribers = await db.collection('subscribers')
      .where('status', '==', 'active')
      .get();

    if (subscribers.empty) {
      return NextResponse.json({ 
        message: 'No active subscribers found',
        count: 0
      });
    }

    // Get deals sorted by discount for all subscribers
    const deals = await getTopDeals({ limit: 50, days: 7, sortBy: 'discount', isPaid: true });

    if (deals.length === 0) {
      return NextResponse.json({ 
        message: 'No deals found to send in digest',
        count: 0
      });
    }

    const results = [];
    for (const doc of subscribers.docs) {
      const subscriber = doc.data();
      try {
        const result = await sendDigestEmail({
          to: subscriber.email,
          deals,
          isPaid: subscriber.isPaid || false
        });

        // Update last digest sent timestamp
        await doc.ref.update({
          lastDigestSent: new Date().toISOString()
        });

        results.push({
          email: subscriber.email,
          isPaid: subscriber.isPaid || false,
          emailId: result.data?.id
        });
      } catch (error) {
        console.error(`Failed to send digest to ${subscriber.email}:`, error);
        results.push({
          email: subscriber.email,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({ 
      sent: true, 
      count: deals.length,
      subscribers: results.length,
      results
    });
  } catch (error) {
    console.error('Digest error:', error);
    return NextResponse.json({ 
      error: 'Failed to send digest',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
