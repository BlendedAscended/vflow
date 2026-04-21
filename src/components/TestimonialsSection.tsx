'use client';

import Image from 'next/image';
import { urlFor } from '../sanity/lib/image';
import AnimatedHeadline from './ui/AnimatedHeadline';
import { useReveal } from '../hooks/useReveal';

interface Testimonial {
  _id: string;
  name: string;
  title: string;
  company?: string;
  testimonial: string;
  rating?: number;
  image?: { asset: { _ref: string; _type: 'reference' }; _type: 'image' };
  featured?: boolean;
}

interface TestimonialsSectionProps { testimonials?: Testimonial[] }

const defaultTestimonials: Testimonial[] = [
  { _id: 'fallback-1', name: 'Alex Morgan', title: 'Business Owner', testimonial: 'Verbaflow LLC made launching our online presence seamless. Their team handled everything from our website to social media and local listings.' },
  { _id: 'fallback-2', name: 'Taylor Kim', title: 'Operations Manager', testimonial: 'The AI-powered scheduling and customer support tools have saved us hours every week. Highly recommend their services.' },
  { _id: 'fallback-3', name: 'Jordan Patel', title: 'Marketing Director', testimonial: 'We saw a noticeable increase in leads within the first month. Their marketing strategies are data-driven and effective.' },
  { _id: 'fallback-4', name: 'Morgan Lee', title: 'Small Business Owner', testimonial: 'The website redesign and SEO optimization brought us 3x more customers. Professional team with excellent results.' },
];

const TestimonialsSection = ({ testimonials }: TestimonialsSectionProps) => {
  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;
  const gridRef = useReveal<HTMLDivElement>(0.1);

  return (
    <section className="w-full bg-[var(--section-bg-1)] text-[var(--text-primary)] py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute top-20 right-20 w-72 h-72 bg-[var(--accent)]/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-[var(--accent)]/15 rounded-full blur-3xl animate-pulse-slow" />

      <div className="max-w-8xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="mb-16">
          <span className="vf-section-num">/ 03</span>
          <AnimatedHeadline className="text-4xl lg:text-6xl font-extrabold text-[var(--text-primary)] mb-8 leading-tight">
            What our clients are saying
          </AnimatedHeadline>
          <p className="text-[var(--muted-foreground)] text-xl max-w-3xl leading-relaxed">
            Real feedback from businesses we&apos;ve helped with web, marketing, and automation solutions.
          </p>
        </div>

        <div ref={gridRef} className="vf-reveal grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {displayTestimonials.map((testimonial, index) => (
            <div
              key={testimonial._id}
              className={`vf-reveal-d${Math.min(index + 1, 4)} bg-[var(--card-background)] rounded-3xl p-10 lg:p-12 shadow-hover hover:shadow-glow border border-[var(--border)] transition-all duration-500 transform hover:scale-105`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                {/* Mobile: image top */}
                <div className="flex justify-center md:hidden mb-6">
                  <div className="w-24 h-24 bg-[var(--muted-background)] rounded-full overflow-hidden shadow-lg">
                    {testimonial.image ? (
                      <Image src={urlFor(testimonial.image).width(96).height(96).fit('crop').crop('center').url()} alt={testimonial.name} width={96} height={96} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--muted-background)] to-[var(--border)] flex items-center justify-center">
                        <svg className="w-12 h-12 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop: image left */}
                <div className="hidden md:flex md:flex-shrink-0">
                  <div className="w-20 h-20 bg-[var(--muted-background)] rounded-full overflow-hidden">
                    {testimonial.image ? (
                      <Image src={urlFor(testimonial.image).width(80).height(80).fit('crop').crop('center').url()} alt={testimonial.name} width={80} height={80} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--muted-background)] to-[var(--border)] flex items-center justify-center">
                        <svg className="w-10 h-10 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="text-center md:text-left">
                    <h4 className="font-semibold text-[var(--card-foreground)] text-xl mb-2">{testimonial.name}</h4>
                    <p className="text-[var(--muted-foreground)] text-lg">
                      {testimonial.title}{testimonial.company && ` at ${testimonial.company}`}
                    </p>
                  </div>
                  <p className="text-[var(--muted-foreground)] leading-relaxed text-lg text-center md:text-left">
                    {testimonial.testimonial}
                  </p>
                  {testimonial.rating && (
                    <div className="flex items-center justify-center md:justify-start space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
