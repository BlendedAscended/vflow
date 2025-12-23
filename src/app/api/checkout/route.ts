
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_fallback_key', {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: '2024-06-20' as any, // Use latest or matching version
});

export async function POST(request: Request) {
    try {
        const { priceId, mode, userId, email, successUrl, cancelUrl } = await request.json();

        if (!priceId) {
            return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });
        }

        const sessionConfig: Stripe.Checkout.SessionCreateParams = {
            mode: mode || 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?success=true`,
            cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?canceled=true`,
            metadata: {
                userId: userId || 'guest',
            },
            customer_email: email,
        };

        const session = await stripe.checkout.sessions.create(sessionConfig);

        return NextResponse.json({ url: session.url });
    } catch (error: unknown) {
        console.error('Stripe Checkout Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
