import Navigation from '../components/Navigation';
import ThemeToggle from '../components/ThemeToggle';
import { LocationProvider } from '../components/LocationContext';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import CommandCentre from '../components/CommandCentre/CommandCentre';
import BusinessInfoSection from '../components/BusinessInfoSection';
import AIToolsSection from '../components/AIToolsSection';
import Marquee from '../components/ui/Marquee';
import PricingSection from '../components/PricingSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';
import ContactSection from '../components/ContactSection';

import Footer from '../components/Footer';
import { client } from '../sanity/lib/client';

async function getTestimonials() {
  try {
    const testimonials = await client.fetch(`
      *[_type == "testimonial"] | order(order asc, _createdAt desc) {
        _id, name, title, company, testimonial, rating, image, featured
      }
    `);
    return testimonials;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

async function getServices() {
  try {
    const services = await client.fetch(`
      *[_type == "service" && active == true] | order(order asc, _createdAt desc) {
        _id, title, description, icon, price, features, ctaText, ctaLink, featured, active
      }
    `);
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

async function getFAQs() {
  try {
    const faqs = await client.fetch(`
      *[_type == "faq" && active == true] | order(order asc, _createdAt desc) {
        _id, question, answer, category, featured, active, order
      }
    `);
    return faqs;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

export default async function Home() {
  const [testimonials, services, faqs] = await Promise.all([
    getTestimonials(),
    getServices(),
    getFAQs(),
  ]);

  return (
    <LocationProvider>
      <div className="min-h-screen">
        <ThemeToggle />
        <Navigation />

        {/* Hero */}
        <HeroSection />

        {/* Services — 3-pillar layout */}
        <ServicesSection services={services} />

        {/* Command Centre */}
        <CommandCentre />

        {/* Business Info */}
        <BusinessInfoSection />

        {/* AI Tools */}
        <AIToolsSection />

        {/* Big-text marquee divider between Services area and Pricing */}
        <div style={{ background: 'var(--section-bg-2)', padding: '48px 0', overflow: 'hidden' }}>
          <Marquee variant="big" speed={30}>
            <span className="vf-marquee-item">AI Automation</span>
            <span className="vf-marquee-star">✦</span>
            <span className="vf-marquee-item">Lead Response</span>
            <span className="vf-marquee-star">✦</span>
            <span className="vf-marquee-item">Voice Workflow</span>
            <span className="vf-marquee-star">✦</span>
            <span className="vf-marquee-item">Growth Strategy</span>
            <span className="vf-marquee-star">✦</span>
          </Marquee>
        </div>

        {/* Pricing */}
        <PricingSection />

        {/* Testimonials */}
        <TestimonialsSection testimonials={testimonials} />

        {/* FAQ */}
        <FAQSection faqs={faqs} />

        {/* Contact */}
        <ContactSection />

        <Footer />
      </div>
    </LocationProvider>
  );
}
