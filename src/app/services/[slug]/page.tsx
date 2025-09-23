import { notFound } from 'next/navigation';
import { PortableTextBlock } from '@portabletext/react';
import Image from 'next/image';
import { client } from '../../../sanity/lib/client';
import { urlFor } from '../../../sanity/lib/image';
import { PortableText } from '@portabletext/react';



type PricingTier = { name: string; price: string; description: string; features?: string[] };
type Benefit = { title: string; description: string };
type ProcessStep = { step: number; title: string; description: string };
type Props = {
  params: { slug: string };
};

interface Service {
  _id: string;
  title: string;
  slug?: { current: string };
  shortDescription?: string;
  fullDescription?: PortableTextBlock[];
  heroImage?: unknown[];
  gallery?: unknown[];
  price?: string;
  pricingTiers?: PricingTier[];
  features?: string[];
  benefits?: Benefit[];
  process?: ProcessStep[];
  faq?: { question: string; answer: string }[];
  ctaText?: string;
  ctaLink?: string;
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string[] };
}

// Fetch service data
async function getService(slug: string): Promise<Service | null> {
  try {
    const service = await client.fetch(`
      *[_type == "service" && slug.current == $slug && active == true][0] {
        _id,
        title,
        slug,
        shortDescription,
        fullDescription,
        heroImage,
        gallery,
        price,
        pricingTiers,
        features,
        benefits,
        process,
        faq,
        ctaText,
        ctaLink,
        seo
      }
    `, { slug });
    
    return service;
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props) {

  const service = await getService(params.slug);
  
  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.'
    };
  }

  return {
    title: service.seo?.metaTitle || `${service.title} - Verbaflow LLC`,
    description: service.seo?.metaDescription || service.shortDescription,
    keywords: service.seo?.keywords?.join(', ') || service.title,
  };
}

// Main component
export default async function ServicePage({ params }: Props) {
  
  const service = await getService(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 gradient-secondary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10"></div>
        
        <div className="max-w-8xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl lg:text-6xl font-extrabold text-black mb-6 leading-tight">
                  {service.title ?? ''}
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed mb-8">
                  {service.shortDescription}
                </p>
                {service.price && (
                  <div className="inline-block bg-green-100 text-green-800 px-6 py-3 rounded-full font-semibold text-lg">
                    {service.price}
                  </div>
                )}
              </div>
              
              {service.ctaText && (
                <a
                  href={service.ctaLink || '#contact'}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {service.ctaText}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </div>

            {/* Hero Image */}
            {service.heroImage && (
              <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={urlFor(service.heroImage).width(800).height(600).url()}
                  alt={service.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Full Description */}
      {service.fullDescription && service.fullDescription.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <div className="prose prose-lg max-w-none">
             <PortableText value={(service.fullDescription ?? []) as PortableTextBlock[]} />
            </div>
          </div>
        </section>
      )}

      {/* Key Features */}
      {service.features && service.features.length > 0 && (
        <section className="py-24 gradient-secondary">
          <div className="max-w-8xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-black mb-6">
              What&rsquo;s Included
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.features.map((feature, index) => (
                <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-hover">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-medium">{feature}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {service.benefits && service.benefits.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-8xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-black mb-6">
                Why Choose This Service
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-black mb-4">{benefit.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      {service.process && service.process.length > 0 && (
        <section className="py-24 gradient-dark">
          <div className="max-w-8xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
                Our Process
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {service.process
                .sort((a, b) => a.step - b.step)
                .map((step, index) => (
                <div key={index} className="text-center space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-white">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Tiers */}
      {service.pricingTiers && service.pricingTiers.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-8xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-black mb-6">
                Pricing Options
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.pricingTiers.map((tier, index) => (
                <div key={index} className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-hover hover:border-green-300 transition-all duration-300">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-black mb-4">{tier.name}</h3>
                    <div className="text-4xl font-extrabold text-green-600 mb-2">{tier.price}</div>
                    <p className="text-gray-600">{tier.description}</p>
                  </div>
                  
                  {tier.features && tier.features.length > 0 && (
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <a
                    href={service.ctaLink || '#contact'}
                    className="block w-full text-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300"
                  >
                    Get Started
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {service.faq && service.faq.length > 0 && (
        <section className="py-24 gradient-secondary">
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-black mb-6">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-6">
              {service.faq.map((item, index) => (
                <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-hover">
                  <h3 className="text-xl font-bold text-black mb-4">{item.question}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-24 gradient-dark text-center">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-8">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
          Let&apos;s discuss how {service.title.toLowerCase()} can help grow your business.
          </p>
          <a
            href={service.ctaLink || '#contact'}
            className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-green-400 to-blue-400 text-white font-semibold rounded-xl hover:from-green-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
          >
            {service.ctaText || 'Contact Us Today'}
            <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
