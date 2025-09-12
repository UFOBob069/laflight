import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreDB } from '@/lib/firebaseAdmin';
import { sendWelcomeEmail } from '@/lib/email';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  source: z.string().optional().default('homepage')
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source } = subscribeSchema.parse(body);

    const db = getFirestoreDB();
    
    // Check if email already exists
    const existingSub = await db.collection('subscribers')
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (!existingSub.empty) {
      const sub = existingSub.docs[0].data();
      return NextResponse.json({ 
        success: true, 
        message: 'Email already subscribed',
        isPaid: sub.isPaid || false,
        subscriptionId: sub.subscriptionId || null
      });
    }

    // Create new subscription
    const subscriberData = {
      email: email.toLowerCase(),
      source,
      isPaid: false,
      subscriptionId: null,
      stripeCustomerId: null,
      createdAt: new Date().toISOString(),
      lastDigestSent: null,
      status: 'active'
    };

    const docRef = await db.collection('subscribers').add(subscriberData);

    // Send welcome email
    try {
      await sendWelcomeEmail(email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed! Check your email for confirmation.',
      subscriberId: docRef.id,
      isPaid: false
    });

  } catch (error) {
    console.error('Subscription error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid email address',
        details: error.errors[0].message
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Failed to subscribe',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
