import { NextRequest, NextResponse } from 'next/server';
import { fetchRecentDealEmails } from '@/lib/gmail';
import { parseDealEmail } from '@/lib/parse';
import { saveDeals } from '@/lib/store';
import { isAuthorizedCronRequest } from '@/lib/cronAuth';

/** Vercel Cron uses GET; admin uses POST. Cron time is controlled in vercel.json (UTC). */
async function runIngest() {
  console.log('Starting email fetch...');
  const raw = await fetchRecentDealEmails({
    label: process.env.GMAIL_LABEL || 'Flight Alerts',
    days: 7,
  });
  console.log(`Found ${raw.length} emails to process`);

  const parsed: any[] = [];
  let processedEmails = 0;

  for (const m of raw) {
    processedEmails++;
    console.log(`Processing email ${processedEmails}/${raw.length}: ${m.subject.substring(0, 50)}...`);

    const deals = parseDealEmail(m.subject, m.html, m.text);
    console.log(`Found ${deals.length} deals in this email`);

    for (const deal of deals) {
      parsed.push({
        ...deal,
        messageId: m.messageId,
        subject: m.subject,
        source: 'gmail',
        receivedAt: m.receivedAt,
      });
    }
  }

  console.log(`Saving ${parsed.length} total deals to Firestore...`);
  await saveDeals(parsed);
  console.log('Ingest completed successfully');

  return NextResponse.json({
    ingestedCount: parsed.length,
    processedEmails: raw.length,
    message: `Successfully processed ${raw.length} emails and ingested ${parsed.length} deals`,
  });
}

export async function GET(req: NextRequest) {
  if (!isAuthorizedCronRequest(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    return await runIngest();
  } catch (error) {
    console.error('Ingest error:', error);
    return NextResponse.json(
      {
        error: 'Failed to ingest deals',
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
    return await runIngest();
  } catch (error) {
    console.error('Ingest error:', error);
    return NextResponse.json(
      {
        error: 'Failed to ingest deals',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
