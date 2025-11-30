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
          <h1 className="text-5xl lg:text-8xl font-extrabold text-[var(--text-primary)] mb-8 animate-fade-in-up">
            Our <span className="gradient-text">Services</span>
          </h1>
          <p className="text-xl lg:text-2xl text-[var(--muted-foreground)] mb-12 max-w-4xl mx-auto animate-fade-in-up">
            Comprehensive digital solutions designed to help your business grow, automate, and succeed in the modern era.
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
