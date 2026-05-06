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
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                        Agentic Growth Plan · $19
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-extrabold text-[var(--text-primary)] mb-6 leading-tight">
                        Your Custom{' '}
                        <span
                            className="bg-clip-text text-transparent"
                            style={{
                                backgroundImage:
                                    'linear-gradient(90deg, var(--accent) 0%, #7CC58A 50%, #4FAE6B 100%)',
                            }}
                        >
                            Growth Plan
                        </span>
                    </h1>
                    <p className="text-xl text-[var(--muted-foreground)] mb-4">
                        Autonomous AI architects, a CEO agent, designer and compliance officer
                        will draft your wireframe and tech stack — with a real human reachable
                        on Telegram whenever you want one.
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)]/80">
                        Free preview · $19 unlocks the full wireframe + tech stack · No credit card for the preview
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
