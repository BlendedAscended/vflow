import Navigation from '../components/Navigation';
import ThemeToggle from '../components/ThemeToggle';
import { LocationProvider } from '../components/LocationContext';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import BusinessInfoSection from '../components/BusinessInfoSection';
import AIToolsSection from '../components/AIToolsSection';
import PricingSection from '../components/PricingSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';
import ContactSection from '../components/ContactSection';
import QuoteRequestSection from '../components/QuoteRequestSection';
import Footer from '../components/Footer';
import { client } from '../sanity/lib/client';

// Fetch testimonials from Sanity
async function getTestimonials() {
  try {
    const testimonials = await client.fetch(`
      *[_type == "testimonial"] | order(order asc, _createdAt desc) {
        _id,
        name,
        title,
        company,
        testimonial,
        rating,
        image,
        featured
      }
    `);
    return testimonials;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

// Fetch services from Sanity
async function getServices() {
  try {
    const services = await client.fetch(`
      *[_type == "service" && active == true] | order(order asc, _createdAt desc) {
        _id,
        title,
        description,
        icon,
        price,
        features,
        ctaText,
        ctaLink,
        featured,
        active
      }
    `);
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}


// Fetch FAQs from Sanity
async function getFAQs() {
  try {
    const faqs = await client.fetch(`
      *[_type == "faq" && active == true] | order(order asc, _createdAt desc) {
        _id,
        question,
        answer,
        category,
        featured,
        active,
        order
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
    getFAQs()
  ]);

  return (
    <LocationProvider>
      <div className="min-h-screen">
        {/* Sticky theme toggle on large screens */}
        <ThemeToggle />
        {/* Navigation */}
        <Navigation />

        {/* Hero Section */}
        <HeroSection />

        {/* Services Section */}
        <ServicesSection services={services} />

        {/* Business Info Section */}
        <BusinessInfoSection />

        {/* AI Tools Section */}
        <AIToolsSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* Testimonials Section */}
        <TestimonialsSection testimonials={testimonials} />

        {/* FAQ Section */}
        <FAQSection faqs={faqs} />

        {/* Quote Request Section */}
        <QuoteRequestSection />

        {/* Contact Section */}
        <ContactSection />

        {/* Footer */}
        <Footer />
      </div>
    </LocationProvider>
  );
}
