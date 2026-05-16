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
import VolumetricBeam from '../components/VolumetricBeam';
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
      <div className="min-h-screen relative">
        <ThemeToggle />
        <Navigation />

        {/* Hero */}
        <HeroSection />

        {/* Waterfall beam — wrapped in a CSS-mask div so the canvas alpha
            is forced to zero past the hero boundary (guaranteed seam kill,
            independent of canvas internals). mix-blend-mode makes the beam
            additive over the Services bg instead of replacing it. */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 w-full pointer-events-none"
          style={{
            zIndex: 12,
            height: '155vh',
            WebkitMaskImage:
              'linear-gradient(to bottom, #000 0%, #000 64%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, #000 0%, #000 64%, transparent 100%)',
          }}
        >
          <VolumetricBeam
            hue="mint"
            intensity={1.4}
            bottomSpread={1.4}
            lavaOverlap={0.55}
            className="absolute inset-0"
            style={{ mixBlendMode: 'screen' }}
          />
        </div>

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

        {/* FAQ — hidden for now */}
        <div className="hidden">
          <FAQSection faqs={faqs} />
        </div>

        {/* Contact */}
        <ContactSection />

        <Footer />
      </div>
    </LocationProvider>
  );
}
