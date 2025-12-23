
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase'; // Ensure this path is correct

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_fallback_key', {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: '2024-06-20' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
    const body = await request.text();
    const signature = (await headers()).get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown invalid request';
        console.error(`Webhook signature verification failed.`, errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.userId;
                const customerEmail = session.customer_details?.email;
                const subscriptionId = session.subscription as string;

                console.log(`Checkout completed for user: ${userId || customerEmail}`);

                // Update Supabase
                // Note: Assuming you have a 'customers' or 'users' table. 
                // If 'userId' is 'guest', we might match by email or creating a new record.
                if (customerEmail) {
                    const { error } = await supabase
                        .from('leads') // OR 'customers' table if you created one
                        .upsert({
                            email: customerEmail,
                            stripe_customer_id: session.customer,
                            subscription_id: subscriptionId,
                            status: 'active',
                            updated_at: new Date().toISOString()
                        }, { onConflict: 'email' });

                    if (error) console.error('Supabase upsert error:', error);
                }
                break;
            }
            case 'invoice.payment_succeeded': {
                // Handle recurring payment success
                const invoice = event.data.object as Stripe.Invoice;
                console.log(`Invoice paid: ${invoice.id}`);
                break;
            }
            // Add other event handlers
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error: unknown) {
        console.error('Error handling webhook event:', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
