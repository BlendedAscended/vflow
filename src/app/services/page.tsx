import { client } from '../../sanity/lib/client';
import ServicesSection from '../../components/ServicesSection';

// Fetch all services
async function getAllServices() {
  try {
    const services = await client.fetch(`
      *[_type == "service" && active == true] | order(order asc, _createdAt desc) {
        _id,
        title,
        shortDescription,
        icon,
        price,
        features,
        ctaText,
        ctaLink,
        featured,
        active,
        "slug": slug.current
      }
    `);
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export const metadata = {
  title: 'Our Services - Verbaflow LLC',
  description: 'Comprehensive digital solutions for your business growth. Web development, marketing, AI automation, and more.',
};

export default async function ServicesPage() {
  const services = await getAllServices();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 lg:py-32 gradient-secondary">
        <div className="max-w-8xl mx-auto px-6 lg:px-12 text-center">
          <h1 className="text-4xl lg:text-6xl font-extrabold text-black mb-8 leading-tight">
            Our <span className="gradient-text">Services</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Comprehensive digital solutions designed to help your business thrive in the modern marketplace.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection services={services} />
    </div>
  );
}
