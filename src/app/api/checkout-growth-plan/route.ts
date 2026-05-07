import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_GROWTH_PLAN_PRICE_ID;

    if (!stripeKey || !priceId) {
        return NextResponse.json(
            { error: 'Stripe is not configured. Set STRIPE_SECRET_KEY and STRIPE_GROWTH_PLAN_PRICE_ID.' },
            { status: 501 }
        );
    }

    return NextResponse.json(
        { error: 'Stripe checkout handler not yet implemented.' },
        { status: 501 }
    );
}
