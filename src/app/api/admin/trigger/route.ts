import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestoreDB } from '@/lib/firebaseAdmin';
import { isAdminEmail } from '@/config/admin';

async function verifyFirebaseIdToken(idToken: string): Promise<string | null> {
  getFirestoreDB();
  const auth = getAuth();
  try {
    const decoded = await auth.verifyIdToken(idToken);
    return decoded.email ? decoded.email.toLowerCase() : null;
  } catch {
    return null;
  }
}

/**
 * Lets signed-in admins run ingest/digest without exposing CRON_SECRET in the browser
 * (fixes Vercel 401 when NEXT_PUBLIC_CRON_SECRET is missing or not rebuilt).
 */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing Authorization bearer token' }, { status: 401 });
  }

  const idToken = authHeader.slice(7).trim();
  const email = await verifyFirebaseIdToken(idToken);
  if (!email || !isAdminEmail(email)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let body: { action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const action = body.action;
  if (action !== 'ingest' && action !== 'digest') {
    return NextResponse.json({ error: 'action must be ingest or digest' }, { status: 400 });
  }

  const origin = new URL(req.url).origin;
  const cronSecret = process.env.CRON_SECRET ?? '';
  const path = action === 'ingest' ? '/api/ingest' : '/api/digest';

  const upstream = await fetch(`${origin}${path}`, {
    method: 'POST',
    headers: {
      ...(cronSecret ? { 'x-cron-secret': cronSecret } : {}),
      ...(action === 'digest' ? { 'Content-Type': 'application/json' } : {}),
    },
    body: action === 'digest' ? '{}' : undefined,
  });

  const payload = await upstream.json().catch(() => ({ error: 'invalid upstream response' }));
  return NextResponse.json(payload, { status: upstream.status });
}
