import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ 
      success: false, 
      error: 'No session ID provided' 
    }, { status: 400 });
  }

  try {
    if (!stripe) {
      return NextResponse.json({ 
        success: false, 
        error: 'Stripe is not configured' 
      }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      return NextResponse.json({ 
        success: true,
        session: {
          id: session.id,
          customer_email: session.customer_email,
          amount_total: session.amount_total,
          currency: session.currency,
        }
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Payment not completed' 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to verify session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
