import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { getFirestoreDB } from '@/lib/firebaseAdmin';
import { z } from 'zod';

const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  customerId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, customerId } = checkoutSchema.parse(body);

    const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
    
    const session = await createCheckoutSession({
      email,
      customerId,
      successUrl: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/deals`,
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Checkout session error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid email address',
        details: error.errors[0].message
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Failed to create checkout session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
