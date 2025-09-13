import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { getFirestoreDB } from '@/lib/firebaseAdmin';
import { z } from 'zod';

const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  customerId: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    console.log('Checkout session request body:', body);
    console.log('Request received at:', new Date().toISOString());
    
    // Check environment variables
    console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
    console.log('STRIPE_PRICE_ID:', process.env.STRIPE_PRICE_ID);
    console.log('SITE_URL:', process.env.SITE_URL);
    
    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log('STRIPE_SECRET_KEY not set, returning test response');
      return NextResponse.json({ 
        sessionId: 'test_session_123',
        url: '/pricing?test=true' // Redirect to pricing page for testing
      });
    }
    
    if (!process.env.STRIPE_PRICE_ID) {
      console.log('STRIPE_PRICE_ID not set, returning test response');
      return NextResponse.json({ 
        sessionId: 'test_session_123',
        url: '/pricing?test=true' // Redirect to pricing page for testing
      });
    }
    
    const { email, customerId } = checkoutSchema.parse(body);
    console.log('Parsed email:', email, 'customerId:', customerId);

    const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
    console.log('Base URL:', baseUrl);
    
    const session = await createCheckoutSession({
      email,
      customerId: customerId || undefined, // Convert null to undefined
      successUrl: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/deals`,
    });

    const totalTime = Date.now() - startTime;
    console.log('Checkout session created successfully:', session.id);
    console.log(`Total API processing time: ${totalTime}ms`);

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Checkout session error:', error);
    
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
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
