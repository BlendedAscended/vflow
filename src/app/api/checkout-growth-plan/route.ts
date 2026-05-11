import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.cashmere" as any,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan_id, email, name } = body;

    if (!plan_id || !email) {
      return NextResponse.json(
        { error: "plan_id and email are required" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: process.env.STRIPE_GROWTH_PLAN_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/growth-plan/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/growth-plan`,
      customer_email: email,
      metadata: {
        plan_id,
      },
    });

    await prisma.growthPlan.update({
      where: { id: plan_id },
      data: {
        stripeSessionId: session.id,
      },
    });

    return NextResponse.json({ checkout_url: session.url });
  } catch (error) {
    console.error("checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
