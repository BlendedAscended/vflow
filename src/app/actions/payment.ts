'use server';

import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_fallback_key', {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: '2025-11-17.clover' as any,
});

export async function attachPaymentMethod(userId: string, paymentMethodId: string) {
    try {
        // 1. Get User and Customer
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { customer: true },
        });

        if (!user) {
            throw new Error('User not found');
        }

        let stripeCustomerId = user.customer?.stripeCustomerId;

        // 2. Create Stripe Customer if not exists
        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name || undefined,
            });
            stripeCustomerId = customer.id;

            // Create Customer record in DB
            await prisma.customer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id,
                },
            });
        }

        // 3. Attach Payment Method to Customer
        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: stripeCustomerId,
        });

        // 4. Set as Default Payment Method (optional but good for "Vaulting")
        await stripe.customers.update(stripeCustomerId, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        // 5. Retrieve Payment Method details for DB (Last 4)
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
        const last4 = paymentMethod.card?.last4;

        // 6. Update DB
        await prisma.customer.update({
            where: { userId: user.id },
            data: {
                last4: last4,
                paymentReady: true,
            },
        });

        return { success: true };
    } catch (error: unknown) {
        console.error('Error attaching payment method:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: errorMessage };
    }
}

export async function chargeCustomer(userId: string, amount: number, description: string) {
    try {
        const customer = await prisma.customer.findUnique({
            where: { userId },
        });

        if (!customer || !customer.stripeCustomerId || !customer.paymentReady) {
            throw new Error('Customer not ready for charging');
        }

        // Create PaymentIntent (Off-session)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            customer: customer.stripeCustomerId,
            description: description,
            off_session: true,
            confirm: true, // Charge immediately
            payment_method: await getCustomerDefaultPaymentMethod(customer.stripeCustomerId),
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never' // Fail if authentication is required (since it's off-session)
            }
        });

        return { success: true, paymentIntentId: paymentIntent.id };

    } catch (error: unknown) {
        console.error('Error charging customer:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: errorMessage };
    }
}

async function getCustomerDefaultPaymentMethod(stripeCustomerId: string): Promise<string | undefined> {
    const customer = await stripe.customers.retrieve(stripeCustomerId) as Stripe.Customer;
    return customer.invoice_settings.default_payment_method as string | undefined;
}
