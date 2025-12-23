import React from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import ContactSection from '../../components/ContactSection';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <Navigation />
            <main className="max-w-4xl mx-auto px-6 py-24">
                <h1 className="text-4xl font-bold mb-8 text-[var(--text-primary)]">About Us</h1>
                <div className="space-y-6 text-lg text-[var(--text-secondary)] leading-relaxed">
                    <p>
                        Your technical partner for the AI era. With a foundation in Solution Architecture, Software Engineering, and Data Consulting, we bring enterprise-grade expertise to growing businesses.
                    </p>
                    <p>
                        We specialize in unifying the technical and the creative, delivering secure Cloud Infrastructure, custom Software Development, and next-gen AI Solutions under one roof. We don't just build software; we architect the solutions that power your company's next phase of growth.
                    </p>
                </div>
            </main>
            <ContactSection />
            <Footer />
        </div >
    );
}
