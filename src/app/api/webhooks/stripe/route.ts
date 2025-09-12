import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getFirestoreDB } from '@/lib/firebaseAdmin';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
  }

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const db = getFirestoreDB();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email || session.metadata?.email;
        
        if (!email) {
          console.error('No email found in checkout session');
          break;
        }

        // Update subscriber to paid
        const subscribers = await db.collection('subscribers')
          .where('email', '==', email.toLowerCase())
          .limit(1)
          .get();

        if (!subscribers.empty) {
          const subscriberRef = subscribers.docs[0].ref;
          await subscriberRef.update({
            isPaid: true,
            stripeCustomerId: session.customer as string,
            subscriptionId: session.subscription as string,
            paidAt: new Date().toISOString(),
          });
          
          console.log(`Updated subscriber ${email} to paid status`);
        } else {
          // Create new paid subscriber if not found
          await db.collection('subscribers').add({
            email: email.toLowerCase(),
            isPaid: true,
            stripeCustomerId: session.customer as string,
            subscriptionId: session.subscription as string,
            paidAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            status: 'active',
            source: 'stripe'
          });
          
          console.log(`Created new paid subscriber ${email}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find subscriber by customer ID
        const subscribers = await db.collection('subscribers')
          .where('stripeCustomerId', '==', customerId)
          .limit(1)
          .get();

        if (!subscribers.empty) {
          const subscriberRef = subscribers.docs[0].ref;
          const isActive = subscription.status === 'active';
          
          await subscriberRef.update({
            isPaid: isActive,
            subscriptionId: subscription.id,
            status: isActive ? 'active' : 'cancelled',
            updatedAt: new Date().toISOString(),
          });
          
          console.log(`Updated subscription ${subscription.id} status: ${subscription.status}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find subscriber by customer ID
        const subscribers = await db.collection('subscribers')
          .where('stripeCustomerId', '==', customerId)
          .limit(1)
          .get();

        if (!subscribers.empty) {
          const subscriberRef = subscribers.docs[0].ref;
          
          await subscriberRef.update({
            isPaid: false,
            status: 'cancelled',
            cancelledAt: new Date().toISOString(),
          });
          
          console.log(`Cancelled subscription ${subscription.id}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ 
      error: 'Webhook handler failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
