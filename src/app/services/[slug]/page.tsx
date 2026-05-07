import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '../../../sanity/lib/client';
import { urlFor } from '../../../sanity/lib/image';
import { PortableText } from '@portabletext/react';
import { PortableTextBlock } from 'sanity';
import ContactSection from '../../../components/ContactSection';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import { getServiceBySlug, type ServiceDef } from '../../../data/services';

interface ServicePageProps {
  params: Promise<{ slug: string; }>
}

interface SanityService {
  _id: string;
  title: string;
  slug: { current: string };
  shortDescription: string;
  fullDescription: unknown[];
  heroImage?: unknown;
  gallery?: unknown[];
  price?: string;
  category?: string;
  pricingTiers?: Array<{
    name: string;
    price: string;
    description: string;
    features: string[];
  }>;
  features?: string[];
  benefits?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  process?: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  ctaText?: string;
  ctaLink?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

interface RenderService {
  source: 'sanity' | 'static';
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  fullDescription?: unknown[];
  heroImage?: unknown;
  price?: string;
  category?: string;
  features: string[];
  benefits: { title: string; description: string }[];
  process: { step: number; title: string; description: string }[];
  faq: { question: string; answer: string }[];
  pricingTiers?: SanityService['pricingTiers'];
  ctaLink?: string;
  seo?: SanityService['seo'];
}

async function getSanityService(slug: string): Promise<SanityService | null> {
  try {
    return await client.fetch(
      `
      *[_type == "service" && slug.current == $slug && active == true][0] {
        _id, title, slug, shortDescription, fullDescription, heroImage, gallery,
        price, category, pricingTiers, features, benefits, process, faq, ctaText, ctaLink, seo
      }
    `,
      { slug }
    );
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

function staticToRender(s: ServiceDef): RenderService {
  return {
    source: 'static',
    _id: s._id,
    title: s.title,
    slug: s.slug,
    shortDescription: s.description,
    longDescription: s.longDescription,
    price: s.price,
    category: s.category,
    features: s.features,
    benefits: s.benefits,
    process: s.process,
    faq: s.faq,
    ctaLink: '/growth-plan',
  };
}

function sanityToRender(s: SanityService): RenderService {
  return {
    source: 'sanity',
    _id: s._id,
    title: s.title,
    slug: s.slug.current,
    shortDescription: s.shortDescription,
    longDescription: '',
    fullDescription: s.fullDescription,
    heroImage: s.heroImage,
    price: s.price,
    category: s.category,
    features: s.features ?? [],
    benefits: (s.benefits ?? []).map(b => ({ title: b.title, description: b.description })),
    process: s.process ?? [],
    faq: s.faq ?? [],
    pricingTiers: s.pricingTiers,
    ctaLink: s.ctaLink,
    seo: s.seo,
  };
}

async function getService(slug: string): Promise<RenderService | null> {
  const sanity = await getSanityService(slug);
  if (sanity) return sanityToRender(sanity);
  const fallback = getServiceBySlug(slug);
  return fallback ? staticToRender(fallback) : null;
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.',
    };
  }

  return {
    title: service.seo?.metaTitle || `${service.title} - Verbaflow LLC`,
    description: service.seo?.metaDescription || service.shortDescription,
    keywords: service.seo?.keywords?.join(', ') || service.title,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--accent)]/5 pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {service.category && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
                    {service.category}
                  </span>
                </div>
              )}
              <h1 className="text-4xl lg:text-6xl font-extrabold text-[var(--text-primary)] leading-tight">
                {service.title}
              </h1>
              <p className="text-xl text-[var(--muted-foreground)] leading-relaxed">
                {service.shortDescription}
              </p>
              {service.price && (
                <div
                  className="text-[var(--accent)] font-bold text-sm uppercase tracking-wider bg-[var(--accent)]/10 pl-10 pr-6 py-3 rounded-r-2xl w-fit"
                  style={{ clipPath: 'polygon(1.2rem 50%, 0 0, 100% 0, 100% 100%, 0 100%)' }}
                >
                  {service.price.toLowerCase().startsWith('from') || service.price.toLowerCase().startsWith('starting')
                    ? service.price
                    : `Starting at ${service.price}`}
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/growth-plan"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold rounded-full hover:shadow-glow transition-all"
                >
                  Get a Tailored Plan ($19)
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[var(--border)] text-[var(--text-primary)] font-semibold rounded-full hover:border-[var(--accent)] transition-all"
                >
                  All Services
                </Link>
              </div>
            </div>

            {service.heroImage ? (
              <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden border border-[var(--border)] shadow-elegant">
                <Image
                  src={urlFor(service.heroImage).width(800).height(600).url()}
                  alt={service.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="relative h-80 lg:h-[460px] rounded-3xl border border-[var(--border)] bg-[var(--card-background)] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/15 to-transparent" />
                <div className="text-7xl lg:text-9xl opacity-25">{service.category === 'AI Agents' ? '🤖' : service.category === 'Mobile' ? '📱' : service.category === 'Marketing' ? '📣' : service.category === 'Compliance' ? '🛡️' : service.category === 'Cloud' ? '☁️' : service.category === 'E-commerce' ? '🛍️' : '⚙️'}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Long description (static) */}
      {service.source === 'static' && service.longDescription && (
        <section className="py-16 lg:py-20 bg-[var(--section-bg-1)]">
          <div className="max-w-3xl mx-auto px-6 lg:px-12">
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              {service.longDescription}
            </p>
          </div>
        </section>
      )}

      {/* Full description (sanity portable text) */}
      {service.source === 'sanity' && service.fullDescription && Array.isArray(service.fullDescription) && service.fullDescription.length > 0 && (
        <section className="py-16 lg:py-20 bg-[var(--section-bg-1)]">
          <div className="max-w-3xl mx-auto px-6 lg:px-12 prose prose-lg max-w-none prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)]">
            <PortableText value={service.fullDescription as PortableTextBlock[]} />
          </div>
        </section>
      )}

      {/* Features */}
      {service.features.length > 0 && (
        <section className="py-16 lg:py-24 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] mb-4">What&rsquo;s Included</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.features.map((feature, index) => (
                <div key={index} className="bg-[var(--card-background)] border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--accent)]/60 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-[var(--accent)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-[var(--accent-foreground)]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-[var(--text-secondary)] font-medium">{feature}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {service.benefits.length > 0 && (
        <section className="py-16 lg:py-24 bg-[var(--section-bg-1)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] mb-4">Why Choose This Service</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="w-16 h-16 bg-[var(--accent)]/15 border border-[var(--accent)]/40 rounded-2xl flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">{benefit.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      {service.process.length > 0 && (
        <section className="py-16 lg:py-24 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] mb-4">Our Process</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...service.process].sort((a, b) => a.step - b.step).map((step, index) => (
                <div key={index} className="bg-[var(--card-background)] border border-[var(--border)] rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-[var(--accent-foreground)]">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{step.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing tiers (sanity) */}
      {service.pricingTiers && service.pricingTiers.length > 0 && (
        <section className="py-16 lg:py-24 bg-[var(--section-bg-1)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] mb-4">Pricing Options</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.pricingTiers.map((tier, index) => (
                <div key={index} className="bg-[var(--card-background)] border-2 border-[var(--border)] rounded-3xl p-8 hover:border-[var(--accent)]/60 transition-all">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{tier.name}</h3>
                    <div className="text-4xl font-extrabold text-[var(--accent)] mb-2">{tier.price}</div>
                    <p className="text-[var(--muted-foreground)]">{tier.description}</p>
                  </div>
                  {tier.features?.length > 0 && (
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2 text-[var(--text-secondary)]">
                          <svg className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    href={service.ctaLink || '/growth-plan'}
                    className="block w-full text-center px-6 py-3 bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold rounded-xl hover:shadow-glow transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {service.faq.length > 0 && (
        <section className="py-16 lg:py-24 bg-[var(--background)]">
          <div className="max-w-3xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] mb-4">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {service.faq.map((item, index) => (
                <div key={index} className="bg-[var(--card-background)] border border-[var(--border)] rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{item.question}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cross-sell to growth plan */}
      <section className="py-16 bg-[var(--section-bg-1)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-3">
            Need transformation, not a single project?
          </h3>
          <p className="text-[var(--muted-foreground)] mb-6">
            Our $19 Growth Plan generates a wireframe and tech-stack tailored to your business — and bundles services across categories.
          </p>
          <Link
            href="/growth-plan"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--accent)] text-[var(--accent-foreground)] font-bold rounded-full hover:shadow-glow transition-all"
          >
            Build My Growth Plan →
          </Link>
        </div>
      </section>

      <ContactSection />
      <Footer />
    </div>
  );
}
