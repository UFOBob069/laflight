import { NextRequest, NextResponse } from 'next/server';
import { checkSubscriptionStatus } from '@/lib/user';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ 
      success: false, 
      error: 'No email provided' 
    }, { status: 400 });
  }

  try {
    const status = await checkSubscriptionStatus(email);
    
    return NextResponse.json({ 
      success: true,
      ...status
    });
  } catch (error) {
    console.error('User status check error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check user status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
