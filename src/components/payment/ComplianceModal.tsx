'use client';

import { useState, useRef, useEffect } from 'react';

interface ComplianceModalProps {
    isOpen: boolean;
    onAccept: () => void;
    onCancel: () => void;
}

export default function ComplianceModal({ isOpen, onAccept, onCancel }: ComplianceModalProps) {
    const [canAccept, setCanAccept] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (contentRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
            // Allow acceptance if scrolled to bottom (within a small threshold)
            if (scrollHeight - scrollTop - clientHeight < 50) {
                setCanAccept(true);
            }
        }
    };

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setCanAccept(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[var(--card-background)] w-full max-w-2xl rounded-2xl shadow-2xl border border-[var(--border)] flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-[var(--border)]">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Terms & Compliance</h2>
                    <p className="text-[var(--muted-foreground)] text-sm mt-1">
                        Please read and accept the following terms to proceed with payment setup.
                    </p>
                </div>

                <div
                    ref={contentRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-6 space-y-6 text-[var(--text-secondary)]"
                >
                    <section>
                        <h3 className="font-bold text-[var(--text-primary)] mb-2">1. PCI DSS Compliance</h3>
                        <p className="text-sm leading-relaxed">
                            We are committed to the security of your payment data. All card information is handled directly by Stripe, a PCI DSS Level 1 certified payment provider. We do not store your full card number or CVC code on our servers. By proceeding, you acknowledge that your payment credentials will be tokenized and securely stored by Stripe for future transactions.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-[var(--text-primary)] mb-2">2. AML & KYC Regulations</h3>
                        <p className="text-sm leading-relaxed">
                            To comply with Anti-Money Laundering (AML) and Know Your Customer (KYC) regulations, we may be required to verify your identity and the source of funds. You agree to provide accurate and up-to-date information. Any transaction suspected of being related to illicit activities will be reported to the relevant authorities.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-[var(--text-primary)] mb-2">3. FACTA Compliance</h3>
                        <p className="text-sm leading-relaxed">
                            In accordance with the Fair and Accurate Credit Transactions Act (FACTA), all electronically printed receipts provided to you will mask your credit card number, displaying no more than the last 5 digits, and will not display the expiration date.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-[var(--text-primary)] mb-2">4. Recurring Payments</h3>
                        <p className="text-sm leading-relaxed">
                            By adding a payment method, you authorize Verbaflow LLC to charge your card for agreed-upon services. You will receive an invoice via email for every transaction. You may cancel or update your payment method at any time through your account settings or by contacting support.
                        </p>
                    </section>

                    <div className="h-8"></div> {/* Spacer to ensure scroll to bottom is clear */}
                </div>

                <div className="p-6 border-t border-[var(--border)] flex justify-end gap-4 bg-[var(--section-bg-1)] rounded-b-2xl">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--section-bg-2)] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onAccept}
                        disabled={!canAccept}
                        className={`px-6 py-2 rounded-xl font-bold transition-all ${canAccept
                                ? 'bg-[var(--accent)] text-[var(--accent-foreground)] hover:shadow-glow transform hover:scale-105'
                                : 'bg-[var(--muted-foreground)]/20 text-[var(--muted-foreground)] cursor-not-allowed'
                            }`}
                    >
                        {canAccept ? 'I Agree' : 'Read to Accept'}
                    </button>
                </div>
            </div>
        </div>
    );
}
