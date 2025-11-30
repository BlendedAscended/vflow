'use client';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import GrowthPlanWizard from '../../components/GrowthPlanWizard';

export default function GrowthPlanPage() {
    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navigation />

            <main className="pt-32 pb-20 px-6 lg:px-12">
                <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in-up">
                    <h1 className="text-4xl lg:text-6xl font-extrabold text-[var(--text-primary)] mb-6">
                        Your Custom <span className="gradient-text">Growth Strategy</span>
                    </h1>
                    <p className="text-xl text-[var(--muted-foreground)]">
                        Answer a few questions about your business, and our AI will generate a personalized execution plan to help you scale.
                    </p>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <GrowthPlanWizard />
                </div>
            </main>

            <Footer />
        </div>
    );
}
