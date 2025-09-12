import { NextRequest, NextResponse } from 'next/server';
import { createCustomerPortalSession } from '@/lib/stripe';
import { z } from 'zod';

const portalSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  returnUrl: z.string().url('Valid return URL is required'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerId, returnUrl } = portalSchema.parse(body);

    const session = await createCustomerPortalSession({
      customerId,
      returnUrl,
    });

    return NextResponse.json({ 
      url: session.url
    });

  } catch (error) {
    console.error('Portal session error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid request data',
        details: error.errors[0].message
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Failed to create portal session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
