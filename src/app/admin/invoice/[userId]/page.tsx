'use client';

import { useState } from 'react';
import { chargeCustomer } from '@/app/actions/payment';

import { use } from 'react';

export default function AdminInvoicePage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = use(params);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCharge = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setStatus({ type: null, message: '' });

        try {
            const result = await chargeCustomer(userId, parseFloat(amount), description);

            if (result.success) {
                setStatus({ type: 'success', message: `Successfully charged $${amount}. PaymentIntent ID: ${result.paymentIntentId}` });
                setAmount('');
                setDescription('');
            } else {
                setStatus({ type: 'error', message: result.error || 'Failed to charge customer' });
            }
        } catch {
            setStatus({ type: 'error', message: 'An unexpected error occurred' });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] p-8 flex items-center justify-center">
            <div className="max-w-md w-full bg-[var(--card-background)] p-8 rounded-3xl border border-[var(--border)] shadow-2xl">
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Admin Invoice</h1>
                <p className="text-[var(--muted-foreground)] mb-8">Charge Client: <span className="font-mono text-[var(--accent)]">{userId}</span></p>

                <form onSubmit={handleCharge} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Amount (USD)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">$</span>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-8 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--section-bg-1)] focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Description</label>
                        <input
                            type="text"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--section-bg-1)] focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all"
                            placeholder="e.g. September Milestone"
                        />
                    </div>

                    {status.message && (
                        <div className={`p-4 rounded-xl text-sm font-medium ${status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                            }`}>
                            {status.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-[var(--accent)] text-[var(--accent-foreground)] font-bold py-4 rounded-xl hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Processing Charge...' : 'Charge Client'}
                    </button>
                </form>
            </div>
        </div>
    );
}
