'use client';

import { useState, useEffect } from 'react';
import { client } from '../../sanity/lib/client';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import ContactSection from '../../components/ContactSection';
import ServicesSection from '../../components/ServicesSection';

// TypeScript interface for service data
interface Service {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  price?: string;
  features?: string[];
  ctaText?: string;
  ctaLink?: string;
  featured?: boolean;
  active?: boolean;
  slug?: string;
  category?: string;
  shortLabel?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const query = `
          *[_type == "service" && active == true] | order(order asc) {
            _id,
            title,
            "description": shortDescription,
            icon,
            price,
            features,
            ctaText,
            ctaLink,
            featured,
            active,
            category,
            shortLabel,
            "slug": slug.current
          }
        `;
        const data = await client.fetch(query);
        setServices(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-[var(--text-primary)] text-xl">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-[var(--section-bg-1)]">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            À-la-carte Services · From $195
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-[var(--text-primary)] mb-6 animate-fade-in-up leading-tight">
            Pick a <span className="gradient-text">Service.</span>
          </h1>
          <p className="text-lg lg:text-xl text-[var(--muted-foreground)] mb-6 max-w-3xl mx-auto animate-fade-in-up">
            Single-project work — agents, software, mobile, compliance, marketing, cloud.
            For a bundled transformation roadmap, try the{' '}
            <a href="/growth-plan" className="text-[var(--accent)] underline-offset-4 hover:underline">$19 Growth Plan</a>.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <ServicesSection services={services} />

      {/* Contact Section */}
      <ContactSection />

      <Footer />
    </div>
  );
}
