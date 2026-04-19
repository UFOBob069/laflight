import { NextRequest, NextResponse } from 'next/server';
import { getTopDeals } from '@/lib/store';
import { sendDigestEmail } from '@/lib/email';
import { getFirestoreDB } from '@/lib/firebaseAdmin';
import { isAuthorizedCronRequest } from '@/lib/cronAuth';

/** Vercel Cron uses GET; admin uses POST. Cron time is controlled in vercel.json (UTC). */
async function runDigest(req: NextRequest) {
  const { to } = await req.json().catch(() => ({}));

  if (to) {
    const deals = await getTopDeals({ limit: 50, days: 7, sortBy: 'discount', isPaid: true });

    if (deals.length === 0) {
      return NextResponse.json({
        message: 'No deals found to send in digest',
        count: 0,
      });
    }

    const result = await sendDigestEmail({
      to,
      deals,
      isPaid: true,
    });

    return NextResponse.json({
      sent: true,
      count: deals.length,
      emailId: result.data?.id,
    });
  }

  const db = getFirestoreDB();
  const subscribers = await db.collection('subscribers').where('status', '==', 'active').get();

  if (subscribers.empty) {
    return NextResponse.json({
      message: 'No active subscribers found',
      count: 0,
    });
  }

  const deals = await getTopDeals({ limit: 50, days: 7, sortBy: 'discount', isPaid: true });

  if (deals.length === 0) {
    return NextResponse.json({
      message: 'No deals found to send in digest',
      count: 0,
    });
  }

  const results = [];
  for (const doc of subscribers.docs) {
    const subscriber = doc.data();
    try {
      const result = await sendDigestEmail({
        to: subscriber.email,
        deals,
        isPaid: subscriber.isPaid || false,
      });

      await doc.ref.update({
        lastDigestSent: new Date().toISOString(),
      });

      results.push({
        email: subscriber.email,
        isPaid: subscriber.isPaid || false,
        emailId: result.data?.id,
      });
    } catch (error) {
      console.error(`Failed to send digest to ${subscriber.email}:`, error);
      results.push({
        email: subscriber.email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return NextResponse.json({
    sent: true,
    count: deals.length,
    subscribers: results.length,
    results,
  });
}

export async function GET(req: NextRequest) {
  if (!isAuthorizedCronRequest(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    return await runDigest(req);
  } catch (error) {
    console.error('Digest error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send digest',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedCronRequest(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    return await runDigest(req);
  } catch (error) {
    console.error('Digest error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send digest',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
