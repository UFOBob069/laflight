import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/user';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ 
      success: false, 
      error: 'No email provided' 
    }, { status: 400 });
  }

  try {
    const userData = await getUserByEmail(email);
    
    if (!userData) {
      return NextResponse.json({ 
        success: true,
        subscription: null
      });
    }

    return NextResponse.json({ 
      success: true,
      subscription: {
        isPaid: userData.isPaid,
        status: userData.status,
        stripeCustomerId: userData.stripeCustomerId
      }
    });
  } catch (error) {
    console.error('User subscription check error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check subscription status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
