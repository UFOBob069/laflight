import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreDB } from '@/lib/firebaseAdmin';
import { z } from 'zod';

const unsubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = unsubscribeSchema.parse(body);

    const db = getFirestoreDB();
    
    // Find subscriber by email
    const subscribers = await db.collection('subscribers')
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (subscribers.empty) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email not found in our system'
      }, { status: 404 });
    }

    const subscriberRef = subscribers.docs[0].ref;
    
    // Update subscriber status to inactive
    await subscriberRef.update({
      status: 'inactive',
      unsubscribedAt: new Date().toISOString(),
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully unsubscribed'
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid email address',
        details: error.errors[0].message
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Failed to unsubscribe',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
