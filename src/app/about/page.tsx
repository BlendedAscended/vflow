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
                <p className="text-lg text-[var(--text-secondary)]">
                    This is the About page. Content coming soon.
                </p>
            </main>
            <ContactSection />
            <Footer />
        </div >
    );
}
