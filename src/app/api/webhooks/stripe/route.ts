import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.cashmere" as any,
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sigHeader = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sigHeader,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const planId = session.metadata?.plan_id;

    if (planId) {
      await prisma.growthPlan.update({
        where: { id: planId },
        data: {
          paidAt: new Date(),
          status: "paid",
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
