import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import BusinessInfoSection from '../components/BusinessInfoSection';
import AIToolsSection from '../components/AIToolsSection';
import PricingSection from '../components/PricingSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';
import ContactSection from '../components/ContactSection';
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

export default async function Home() {
  const [testimonials, services] = await Promise.all([
    getTestimonials(),
    getServices()
  ]);
  
  return (
    <div className="min-h-screen">
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
      <FAQSection />
      
      {/* Contact Section */}
      <ContactSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
