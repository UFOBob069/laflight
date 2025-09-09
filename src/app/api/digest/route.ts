import { NextRequest, NextResponse } from 'next/server';
import { getTopDeals } from '@/lib/store';
import { sendDigestEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret');
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const { to } = await req.json().catch(() => ({}));
    const deals = await getTopDeals({ limit: 50, days: 7 });

    if (deals.length === 0) {
      return NextResponse.json({ 
        message: 'No deals found to send in digest',
        count: 0
      });
    }

    const result = await sendDigestEmail({
      to: to || process.env.EMAIL_TO!,
      deals
    });

    return NextResponse.json({ 
      sent: true, 
      count: deals.length,
      emailId: result.data?.id
    });
  } catch (error) {
    console.error('Digest error:', error);
    return NextResponse.json({ 
      error: 'Failed to send digest',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
