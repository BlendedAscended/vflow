'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import ComplianceModal from './ComplianceModal';

// Initialize Stripe outside component to avoid recreation
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

interface AddPaymentMethodProps {
    userId?: string;
    onSuccess: () => void;
}

const PaymentForm = ({ userId, onSuccess }: AddPaymentMethodProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCompliance, setShowCompliance] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        // Trigger compliance modal first
        setShowCompliance(true);
    };

    const handleComplianceAccept = async () => {
        setShowCompliance(false);
        setIsProcessing(true);
        setError(null);

        if (!stripe || !elements) return;

        try {
            // 1. Create SetupIntent on server (we need a server action for this, or use client-side tokenization if just attaching)
            // For "Vaulting" flow without immediate charge, we typically use SetupIntent.
            // However, the prompt asked to "Tokenize the card via Stripe" and "Send paymentMethodId to Server Action".
            // So we will use createPaymentMethod.

            const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
                elements,
            });

            if (stripeError) {
                setError(stripeError.message || 'An error occurred');
                setIsProcessing(false);
                return;
            }

            // 2. Send paymentMethodId to server
            if (userId) {
                const response = await fetch('/api/payment/attach', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, paymentMethodId: paymentMethod.id }),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to attach payment method');
                }
            } else {
                console.log('Frontend mode: PaymentMethod created', paymentMethod.id);
                // Simulate delay
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            onSuccess();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
            setError(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
                <div className="bg-[var(--card-background)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
                    <PaymentElement />
                </div>

                {error && (
                    <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="w-full bg-[var(--accent)] text-[var(--accent-foreground)] font-bold py-4 rounded-xl hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? 'Processing...' : 'Save Payment Method'}
                </button>
            </form>

            <ComplianceModal
                isOpen={showCompliance}
                onAccept={handleComplianceAccept}
                onCancel={() => {
                    setShowCompliance(false);
                    setIsProcessing(false);
                }}
            />
        </>
    );
};

export default function AddPaymentMethod({ userId, onSuccess }: AddPaymentMethodProps) {
    // In a real app, you might fetch a SetupIntent clientSecret here if using SetupIntents
    // For simple PaymentMethod attachment (Tokenization), we don't strictly need options mode 'payment' or 'setup' 
    // if we are just using createPaymentMethod, but Elements provider needs mode/currency or clientSecret.
    // We'll use mode: 'setup' and currency 'usd' for visual consistency.

    const options = {
        mode: 'setup' as const,
        currency: 'usd',
        appearance: {
            theme: 'night' as const, // Matching the dark theme vibe
            variables: {
                colorPrimary: '#00ff94', // Assuming this is close to var(--accent)
                colorBackground: '#1a1a1a',
                colorText: '#ffffff',
            }
        },
    };

    if (!stripePromise) {
        return (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl text-center">
                <p className="font-bold">Stripe Configuration Error</p>
                <p className="text-sm">Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment variables.</p>
            </div>
        );
    }

    return (
        <Elements stripe={stripePromise} options={options}>
            <PaymentForm userId={userId} onSuccess={onSuccess} />
        </Elements>
    );
}
