import { getFirestoreDB } from './firebaseAdmin';

export interface User {
  email: string;
  isPaid: boolean;
  subscriptionId?: string;
  stripeCustomerId?: string;
  status: 'active' | 'cancelled' | 'inactive';
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const db = getFirestoreDB();
    const subscribers = await db.collection('subscribers')
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (subscribers.empty) {
      return null;
    }

    const data = subscribers.docs[0].data();
    return {
      email: data.email,
      isPaid: data.isPaid || false,
      subscriptionId: data.subscriptionId,
      stripeCustomerId: data.stripeCustomerId,
      status: data.status || 'inactive'
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function checkSubscriptionStatus(email: string): Promise<{
  isSubscribed: boolean;
  isPaid: boolean;
  user?: User;
}> {
  const user = await getUserByEmail(email);
  
  if (!user) {
    return { isSubscribed: false, isPaid: false };
  }

  return {
    isSubscribed: user.status === 'active',
    isPaid: user.isPaid && user.status === 'active',
    user
  };
}
