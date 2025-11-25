'use client';

import { useState, useEffect } from 'react';
import { client } from '../../../sanity/lib/client';
import FAQSection from '../../../components/FAQSection';
import { PortableText } from '@portabletext/react';

// TypeScript interfaces for FAQ data
interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQBlog {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  content: any[];
  featuredImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  publishedAt: string;
  readingTime: number;
  author: {
    name: string;
  };
}

const FAQBlogPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [faqBlog, setFaqBlog] = useState<FAQBlog | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch FAQs and FAQ blog content
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch FAQs
        const faqQuery = `
          *[_type == "faq"] | order(category asc, _createdAt asc) {
            _id,
            question,
            answer,
            category
          }
        `;

        const faqData: FAQ[] = await client.fetch(faqQuery);
        setFaqs(faqData);

        // Fetch FAQ blog post (if exists)
        const blogQuery = `
          *[_type == "blog" && slug.current == "faq-blog" && published == true][0] {
            _id,
            title,
            slug,
            excerpt,
            content,
            featuredImage {
              asset-> {
                url
              },
              alt
            },
            publishedAt,
            readingTime,
            author-> {
              name
            }
          }
        `;

        const blogData: FAQBlog = await client.fetch(blogQuery);
        setFaqBlog(blogData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // PortableText components for proper Sanity rich text rendering
  const components = {
    types: {
      image: ({ value }: { value: any }) => {
        if (!value?.asset?.url) {
          return null;
        }
        return (
          <div className="my-8">
            <img
              src={value.asset.url}
              alt={value.alt || 'Blog Image'}
              className="rounded-2xl shadow-elegant w-full h-auto"
            />
            {value.caption && (
              <p className="text-center text-[var(--muted-foreground)] text-sm mt-2 italic">
                {value.caption}
              </p>
            )}
          </div>
        );
      },
    },
    block: {
      h1: ({ children }: any) => (
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-6 mt-8">{children}</h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-5 mt-6">{children}</h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4 mt-5">{children}</h3>
      ),
      h4: ({ children }: any) => (
        <h4 className="text-xl font-bold text-[var(--text-primary)] mb-3 mt-4">{children}</h4>
      ),
      normal: ({ children }: any) => (
        <p className="text-[var(--text-primary)] mb-4 leading-relaxed">{children}</p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-[var(--accent)] pl-6 py-2 my-6 text-[var(--muted-foreground)] italic">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-disc list-inside text-[var(--text-primary)] mb-4 space-y-2">{children}</ul>
      ),
      number: ({ children }: any) => (
        <ol className="list-decimal list-inside text-[var(--text-primary)] mb-4 space-y-2">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => (
        <li className="mb-1">{children}</li>
      ),
      number: ({ children }: any) => (
        <li className="mb-1">{children}</li>
      ),
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-[var(--text-primary)] text-xl">Loading FAQ content...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-[var(--section-bg-1)]">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 text-center">
          <h1 className="text-5xl lg:text-8xl font-extrabold text-[var(--text-primary)] mb-8 animate-fade-in-up">
            <span className="gradient-text">Frequently Asked</span> Questions
          </h1>
          <p className="text-xl lg:text-2xl text-[var(--muted-foreground)] mb-12 max-w-4xl mx-auto animate-fade-in-up">
            Find answers to common questions about our services, processes, and how we can help your business grow.
          </p>
        </div>
      </section>

      {/* FAQ Blog Content (if exists) */}
      {faqBlog && (
        <section className="py-20 bg-[var(--section-bg-2)]">
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <div className="bg-[var(--card-background)] rounded-3xl p-8 lg:p-12 shadow-elegant border border-[var(--border)]">
              <div className="text-center mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-[var(--card-foreground)] mb-4">
                  {faqBlog.title}
                </h2>
                <p className="text-[var(--muted-foreground)] mb-4">
                  {faqBlog.excerpt}
                </p>
                <div className="flex justify-center items-center gap-4 text-sm text-[var(--muted-foreground)]">
                  <span>By {faqBlog.author.name}</span>
                  <span>•</span>
                  <span>{formatDate(faqBlog.publishedAt)}</span>
                  <span>•</span>
                  <span>{faqBlog.readingTime} min read</span>
                </div>
              </div>

              {faqBlog.featuredImage?.asset?.url && (
                <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden mb-8">
                  <img
                    src={faqBlog.featuredImage.asset.url}
                    alt={faqBlog.featuredImage.alt || faqBlog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                <PortableText value={faqBlog.content} components={components} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-20 bg-[var(--section-bg-1)]">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <h2 className="text-4xl lg:text-6xl font-bold text-[var(--text-primary)] text-center mb-16">
            Common <span className="gradient-text">Questions</span>
          </h2>

          {/* Use the existing FAQSection component */}
          <FAQSection />
        </div>
      </section>

      {/* Additional FAQ Content */}
      <section className="py-20 bg-[var(--section-bg-2)]">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Service FAQs */}
            <div className="bg-[var(--card-background)] rounded-3xl p-8 shadow-elegant border border-[var(--border)]">
              <h3 className="text-2xl font-bold text-[var(--card-foreground)] mb-6">
                Service-Related Questions
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-[var(--card-foreground)] mb-2">
                    What services do you offer?
                  </h4>
                  <p className="text-[var(--muted-foreground)]">
                    We provide comprehensive digital solutions including website development,
                    AI Automation, digital marketing, and cloud solutions tailored to your business needs.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[var(--card-foreground)] mb-2">
                    How long does a typical project take?
                  </h4>
                  <p className="text-[var(--muted-foreground)]">
                    Project timelines vary based on complexity. Simple websites take 2-4 weeks,
                    while comprehensive digital transformations can take 2-6 months.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[var(--card-foreground)] mb-2">
                    Do you provide ongoing support?
                  </h4>
                  <p className="text-[var(--muted-foreground)]">
                    Yes, we offer maintenance packages and ongoing support to ensure your
                    digital solutions continue to perform optimally.
                  </p>
                </div>
              </div>
            </div>

            {/* Technical FAQs */}
            <div className="bg-[var(--card-background)] rounded-3xl p-8 shadow-elegant border border-[var(--border)]">
              <h3 className="text-2xl font-bold text-[var(--card-foreground)] mb-6">
                Technical Questions
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-[var(--card-foreground)] mb-2">
                    What technologies do you use?
                  </h4>
                  <p className="text-[var(--muted-foreground)]">
                    We use modern technologies including React, Next.js, Node.js, Python,
                    AI/ML frameworks, and cloud platforms like AWS and Azure.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[var(--card-foreground)] mb-2">
                    Do you work with existing systems?
                  </h4>
                  <p className="text-[var(--muted-foreground)]">
                    Absolutely! We specialize in integrating new solutions with your
                    existing infrastructure and systems.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[var(--card-foreground)] mb-2">
                    How do you ensure data security?
                  </h4>
                  <p className="text-[var(--muted-foreground)]">
                    We implement industry-standard security practices, encryption,
                    and compliance measures to protect your data and systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--section-bg-1)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-8">
            Still have questions?
          </h2>
          <p className="text-xl text-[var(--muted-foreground)] mb-12">
            Can't find what you're looking for? We're here to help.
            Get in touch with our team for personalized assistance.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-hover hover:shadow-glow">
              Contact Us
            </button>
            <button className="border-2 border-[var(--accent)] text-[var(--accent)] font-bold px-10 py-4 rounded-full hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-all duration-300 transform hover:scale-105">
              Schedule a Call
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQBlogPage;
