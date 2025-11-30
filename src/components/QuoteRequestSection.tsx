'use client';

import { useState } from 'react';

const QuoteRequestSection = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/request-quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setStatus({ success: true, message: 'Quote request sent successfully! We will get back to you shortly.' });
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus({ success: false, message: result.message || 'Something went wrong.' });
            }
        } catch {
            setStatus({ success: false, message: 'Failed to send request. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="quote" className="w-full bg-[var(--section-bg-2)] text-[var(--text-primary)] py-16 lg:py-24 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-5xl font-extrabold text-[var(--text-primary)] mb-6">
                        Request a <span className="gradient-text">Free Quote</span>
                    </h2>
                    <p className="text-[var(--muted-foreground)] text-lg">
                        Tell us about your project and we&apos;ll provide a custom strategy and pricing.
                    </p>
                </div>

                <div className="bg-[var(--card-background)] rounded-3xl p-8 lg:p-12 shadow-elegant border border-[var(--border)]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--accent)] bg-[var(--background)]"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--accent)] bg-[var(--background)]"
                                    placeholder="email@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">Service Needed</label>
                            <select
                                name="service"
                                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--accent)] bg-[var(--background)]"
                            >
                                <option value="Web Design">Web Design</option>
                                <option value="SEO & Marketing">SEO & Marketing</option>
                                <option value="AI Automation">AI Automation</option>
                                <option value="Consulting">Consulting</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">Project Details</label>
                            <textarea
                                name="details"
                                rows={4}
                                required
                                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--accent)] bg-[var(--background)]"
                                placeholder="Describe your project goals..."
                            />
                        </div>

                        {status && (
                            <div className={`p-4 rounded-lg ${status.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {status.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[var(--accent)] text-[var(--accent-foreground)] font-bold py-4 rounded-xl hover:shadow-glow transition-all duration-300 transform hover:scale-[1.02]"
                        >
                            {isSubmitting ? 'Sending...' : 'Get My Free Quote'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default QuoteRequestSection;
