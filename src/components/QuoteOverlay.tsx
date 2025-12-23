'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AddPaymentMethod from './payment/AddPaymentMethod';


// Define the suggestion logic
const suggestionMap: Record<string, string[]> = {
    root: ['Web Design', 'Digital Marketing', 'AI Automation', 'Consulting', 'App Development'],
    'Web Design': ['E-commerce Store', 'Landing Page', 'Corporate Website', 'SaaS Dashboard', 'Portfolio'],
    'Digital Marketing': ['SEO Optimization', 'Social Media Management', 'PPC Advertising', 'Email Campaigns', 'Content Strategy'],
    'AI Automation': ['Customer Support Chatbot', 'Workflow Automation', 'Data Processing', 'CRM Integration', 'Voice Agents'],
    'Consulting': ['Business Strategy', 'Tech Audit', 'Digital Transformation', 'Market Research'],
    'App Development': ['iOS App', 'Android App', 'Cross-platform', 'Internal Tool']
};

// Simplified pricing mapping for instant quote
const pricingMap: Record<string, number> = {
    'Web Design': 3000,
    'Digital Marketing': 1500,
    'AI Automation': 2000,
    'Consulting': 1000,
    'App Development': 5000,
    'E-commerce Store': 4000,
    'Landing Page': 1500,
    'Corporate Website': 3000,
    'SaaS Dashboard': 5000,
    'SEO Optimization': 1000,
    'Social Media Management': 1500,
    'PPC Advertising': 1000,
    'Customer Support Chatbot': 2500,
    'Workflow Automation': 1500,
    'iOS App': 6000,
    'Android App': 6000,
    'Cross-platform': 8000
};

interface QuoteOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    initialTier?: string;
    initialPrice?: string;
}

const QuoteOverlay = ({ isOpen, onClose, initialTier, initialPrice }: QuoteOverlayProps) => {
    const router = useRouter();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [currentSuggestions, setCurrentSuggestions] = useState<string[]>(suggestionMap['root']);
    const [isClosing, setIsClosing] = useState(false);

    // New state for Instant Quote Wizard
    const [view, setView] = useState<'input' | 'processing' | 'result'>('input');
    const [quoteResult, setQuoteResult] = useState<{ total: number; details: string[] } | null>(null);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [newsletter, setNewsletter] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    // Scroll to top when view changes or payment form opens
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [view, showPaymentForm]);

    // Reset state when opened
    useEffect(() => {
        if (isOpen) {
            setInputValue(initialTier ? `Selected Plan: ${initialTier}` : '');
            setSelectedTags([]);
            setCurrentSuggestions(suggestionMap['root']);
            setIsClosing(false);
            setView('input');
            setQuoteResult(null);
            setSendStatus('idle');
            setEmail('');
            setName('');
            setNewsletter(false);
            setShowPaymentForm(false);

            // Lock body scroll
            document.body.style.overflow = 'hidden';
        } else {
            // Restore body scroll
            document.body.style.overflow = 'unset';
            document.body.style.position = '';
            document.body.style.top = '';
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialTier]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300); // Wait for animation
    };

    const handleTagClick = (tag: string) => {
        if (!selectedTags.includes(tag)) {
            const newTags = [...selectedTags, tag];
            setSelectedTags(newTags);

            if (suggestionMap[tag]) {
                setCurrentSuggestions(suggestionMap[tag]);
            } else {
                setCurrentSuggestions([]);
            }

            setInputValue(prev => prev ? `${prev}, ${tag}` : tag);
        }
    };

    const handleContinueToGrowthPlan = () => {
        const partialData = {
            industry: '',
            goals: selectedTags,
            details: inputValue
        };
        localStorage.setItem('vflow_growth_plan_partial', JSON.stringify(partialData));
        router.push('/growth-plan');
    };

    const calculateQuote = () => {
        setView('processing');

        // Simulate calculation delay
        setTimeout(() => {
            let total = 0;
            const details: string[] = [];

            // 1. Check selected tags
            selectedTags.forEach(tag => {
                if (pricingMap[tag]) {
                    total += pricingMap[tag];
                    details.push(`${tag}: $${pricingMap[tag].toLocaleString()}`);
                }
            });

            // 2. Check input text for keywords (simple heuristic)
            Object.keys(pricingMap).forEach(key => {
                if (inputValue.toLowerCase().includes(key.toLowerCase()) && !selectedTags.includes(key)) {
                    total += pricingMap[key];
                    details.push(`${key} (detected): $${pricingMap[key].toLocaleString()}`);
                }
            });

            // Handle initialTier pricing if present and not covered
            if (initialTier && total === 0) {
                // Fallback or specific logic for tiers if they aren't in pricingMap
                // For now, let's assume the user might add more details or we just use base consultation
            }

            // Base fee if nothing matched but input exists
            if (total === 0 && inputValue.length > 0) {
                total = 1000;
                details.push('Consultation & Analysis: $1,000');
            }

            setQuoteResult({ total, details });
            setView('result');
        }, 1500);
    };

    const handleSendEmail = async () => {
        if (!email) return;
        setIsSending(true);

        try {
            const response = await fetch('/api/send-quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    name,
                    quoteDetails: quoteResult?.details || [],
                    totalEstimate: `$${quoteResult?.total.toLocaleString()}`,
                    newsletter // Send this to API if needed
                })
            });

            if (response.ok) {
                setSendStatus('success');
                alert('Quote emailed successfully!');
            } else {
                setSendStatus('error');
            }
        } catch (error) {
            console.error(error);
            setSendStatus('error');
        } finally {
            setIsSending(false);
        }
    };

    const handleDownloadQuote = () => {
        const fileContent = `
VERBAFLOW INSTANT QUOTE
-----------------------
Date: ${new Date().toLocaleDateString()}
Prepared for: ${name || 'Valued Client'}

SELECTED SERVICES:
${quoteResult?.details.map(d => `- ${d}`).join('\n')}

-----------------------
ESTIMATED TOTAL: $${quoteResult?.total.toLocaleString()}
-----------------------

${newsletter ? '[x] Subscribed to Newsletter' : ''}

This is a preliminary estimate. 
For a detailed breakdown and strategy, please visit: https://verbaflow.com/growth-plan
        `;
        const element = document.createElement("a");
        const file = new Blob([fileContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "verbaflow-quote.txt";
        document.body.appendChild(element); // Required for FireFox
        element.click();
        document.body.removeChild(element);
    };

    if (!isOpen && !isClosing) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center overscroll-none">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full h-full md:h-auto md:max-h-[90vh] md:w-[90vw] lg:w-[80vw] xl:w-[70vw] bg-[var(--card-background)] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row overscroll-contain"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-6 right-6 z-20 p-2 rounded-full bg-[var(--section-bg-2)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors duration-300"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Left Side: Dynamic Content */}
                        <div
                            ref={scrollContainerRef}
                            className="flex-1 p-8 lg:p-12 flex flex-col relative overflow-y-auto min-h-[500px] overscroll-contain"
                        >
                            <AnimatePresence mode="wait">
                                {view === 'input' && (
                                    <motion.div
                                        key="input"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="max-w-2xl mx-auto w-full space-y-8"
                                    >
                                        <div>
                                            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4">
                                                What are you looking to <span className="gradient-text">build or grow?</span>
                                            </h2>
                                            <p className="text-[var(--muted-foreground)] text-lg">
                                                Select from the suggestions below or type your own requirements.
                                            </p>
                                        </div>

                                        <div className="relative">
                                            <textarea
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                placeholder="I need a website for my construction business..."
                                                className="w-full p-6 text-lg rounded-2xl border-2 border-[var(--border)] bg-[var(--section-bg-1)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10 transition-all outline-none resize-none min-h-[120px]"
                                            />
                                        </div>

                                        {currentSuggestions.length > 0 && (
                                            <div className="space-y-3">
                                                <p className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Suggestions</p>
                                                <div className="flex flex-wrap gap-3">
                                                    {currentSuggestions.map((suggestion) => (
                                                        <button
                                                            key={suggestion}
                                                            onClick={() => handleTagClick(suggestion)}
                                                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${selectedTags.includes(suggestion)
                                                                ? 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-glow'
                                                                : 'bg-[var(--section-bg-2)] text-[var(--text-secondary)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] border border-[var(--border)]'
                                                                }`}
                                                        >
                                                            + {suggestion}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-4">
                                            <button
                                                onClick={calculateQuote}
                                                className="w-full bg-[var(--text-primary)] text-[var(--background)] font-bold py-4 rounded-xl hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                <span>Get Instant Quote</span>
                                                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Free</span>
                                            </button>
                                            <p className="text-xs text-center text-[var(--muted-foreground)] mt-3">
                                                Based on standard pricing for services within 50 miles.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {view === 'processing' && (
                                    <motion.div
                                        key="processing"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center w-full h-full space-y-6"
                                    >
                                        <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                                        <h3 className="text-2xl font-bold text-[var(--text-primary)]">Analyzing Requirements...</h3>
                                        <p className="text-[var(--muted-foreground)]">Matching with local service pricing</p>
                                    </motion.div>
                                )}

                                {view === 'result' && quoteResult && (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="max-w-2xl mx-auto w-full space-y-8"
                                    >
                                        <div className="text-center">
                                            <div className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold mb-4">
                                                Quote Ready
                                            </div>
                                            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                                                Estimated Investment
                                            </h2>
                                            <div className="text-5xl font-extrabold text-[var(--accent)] gradient-text my-4">
                                                ${quoteResult.total.toLocaleString()}
                                            </div>
                                            <p className="text-[var(--muted-foreground)]">
                                                Estimated monthly or one-time project fee based on selection.
                                            </p>
                                        </div>

                                        <div className="bg-[var(--section-bg-1)] p-6 rounded-2xl border border-[var(--border)]">
                                            <h3 className="font-bold text-[var(--text-primary)] mb-3">Included Services:</h3>
                                            <ul className="space-y-2">
                                                {quoteResult.details.map((detail, idx) => (
                                                    <li key={idx} className="flex items-center gap-2 text-[var(--text-secondary)]">
                                                        <span className="text-green-500">✓</span>
                                                        {detail}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="font-bold text-[var(--text-primary)]">Send & Download Quote</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Your Name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
                                                />
                                                <input
                                                    type="email"
                                                    placeholder="Email Address"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
                                                />
                                            </div>

                                            {sendStatus === 'success' ? (
                                                <div className="space-y-4">
                                                    <div className="p-4 bg-green-100 text-green-700 rounded-xl text-center font-medium">
                                                        <p>Quote sent successfully! Check your inbox.</p>
                                                    </div>

                                                    <button
                                                        onClick={handleDownloadQuote}
                                                        className="w-full bg-[var(--section-bg-3)] border-2 border-[var(--border)] text-[var(--text-primary)] font-bold py-4 rounded-xl hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-all"
                                                    >
                                                        Download PDF
                                                    </button>

                                                    {initialTier && (
                                                        <div className="pt-4 border-t border-[var(--border)]">
                                                            {!showPaymentForm ? (
                                                                <button
                                                                    onClick={() => setShowPaymentForm(true)}
                                                                    className="w-full text-center text-sm font-black text-black dark:text-white hover:underline uppercase tracking-wide py-2"
                                                                >
                                                                    + Add Card Details
                                                                </button>
                                                            ) : (
                                                                <div className="bg-[var(--background)] p-4 rounded-xl border border-[var(--border)] text-left animate-in fade-in slide-in-from-top-4 duration-300">
                                                                    <div className="flex justify-between items-center mb-4">
                                                                        <h4 className="font-bold text-[var(--text-primary)]">Secure Payment</h4>
                                                                        <span className="bg-[var(--accent)]/10 text-[var(--text-primary)] px-3 py-1 rounded-full text-sm font-bold">
                                                                            Plan: {initialTier} {initialPrice && `(${initialPrice})`}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                                                                        You will be charged {initialPrice} for the <span className="font-bold">{initialTier}</span> plan.
                                                                    </p>
                                                                    <AddPaymentMethod
                                                                        onSuccess={() => {
                                                                            alert('Payment method saved successfully!');
                                                                            setShowPaymentForm(false);
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={handleSendEmail}
                                                        disabled={isSending || !email}
                                                        className="flex-1 bg-[var(--accent)] text-[var(--accent-foreground)] font-bold py-4 rounded-xl hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isSending ? 'Sending...' : 'Email Quote'}
                                                    </button>
                                                    <button
                                                        onClick={handleDownloadQuote}
                                                        className="flex-1 bg-[var(--section-bg-3)] border-2 border-[var(--border)] text-[var(--text-primary)] font-bold py-4 rounded-xl hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-all"
                                                    >
                                                        Download PDF
                                                    </button>
                                                </div>
                                            )}

                                            <button
                                                onClick={() => setView('input')}
                                                className="w-full text-[var(--muted-foreground)] hover:text-[var(--text-primary)] text-sm font-medium py-2"
                                            >
                                                Start Over
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Right Side: CTA / Upsell */}
                        <div className="md:w-[400px] bg-[var(--section-bg-2)] p-8 lg:p-12 flex flex-col justify-center border-l border-[var(--border)] relative overflow-hidden">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                            <div className="space-y-6 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-3xl mb-4">
                                    🚀
                                </div>
                                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                                    Want a personalized strategy?
                                </h3>
                                <p className="text-[var(--muted-foreground)] leading-relaxed">
                                    Don&apos;t just guess. Get a comprehensive AI-driven business plan tailored to your specific needs and industry.
                                </p>

                                <div className="pt-4 space-y-4">
                                    <button
                                        onClick={handleContinueToGrowthPlan}
                                        className="w-full bg-[var(--accent)] text-[var(--accent-foreground)] font-bold py-4 rounded-xl shadow-hover hover:shadow-glow transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                                    >
                                        <span>Continue to Growth Plan</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button>
                                    <p className="text-xs text-center text-[var(--muted-foreground)]">
                                        We&apos;ll use your input to pre-fill your strategy session.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default QuoteOverlay;
