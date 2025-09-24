"use client";

import { useState } from "react";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  featured?: boolean;
  active?: boolean;
  order?: number;
}

interface FAQSectionProps {
  faqs?: FAQ[];
}

const FAQSection = ({ faqs }: FAQSectionProps) => {
  const [openItems, setOpenItems] = useState<{[category: string]: number[]}>({});

  const toggleItem = (category: string, index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [category]: prev[category]?.includes(index) 
        ? prev[category].filter((item) => item !== index) 
        : [...(prev[category] || []), index]
    }));
  };

  const defaultFaqs: FAQ[] = [
    {
      _id: "fallback-1",
      question: "What solutions do you provide?",
      answer:
        "We offer comprehensive digital solutions including custom website development, AI-powered automation tools, marketing campaigns, SEO optimization, cloud migration services, and IT consulting for local businesses in Montgomery County.",
      category: "services"
    },
    {
      _id: "fallback-2",
      question: "How do you boost my leads?",
      answer:
        "We use a multi-channel approach including SEO optimization, social media marketing, Google Business profile optimization, targeted advertising campaigns, lead generation funnels, and conversion optimization to increase your business leads and customer acquisition.",
      category: "services"
    },
    {
      _id: "fallback-3",
      question: "Can you handle system migrations?",
      answer:
        "Yes, we specialize in secure cloud migrations, data transfers, system integrations, and ensuring compliance with industry standards like HIPAA and SOC. Our team handles the entire migration process with minimal downtime.",
      category: "technical"
    },
    {
      _id: "fallback-4",
      question: "Is ongoing support available?",
      answer:
        "Absolutely! We provide 24/7 technical support, regular system maintenance, performance monitoring, security updates, and ongoing optimization to ensure your digital infrastructure runs smoothly and efficiently.",
      category: "support"
    },
    {
      _id: "fallback-5",
      question: "What's your pricing model?",
      answer:
        "We offer flexible pricing options including project-based pricing, monthly retainers, and custom packages. Contact us for a free consultation and personalized quote.",
      category: "pricing"
    },
    {
      _id: "fallback-6",
      question: "How long does a typical project take?",
      answer:
        "Project timelines vary based on complexity. Simple websites take 2-4 weeks, while comprehensive digital transformations can take 2-6 months. We provide detailed timelines during consultation.",
      category: "general"
    },
    {
      _id: "fallback-7",
      question: "Do you work with small businesses?",
      answer:
        "Yes! We specialize in helping small and medium businesses in Montgomery County grow their digital presence. Our solutions are designed to be scalable and cost-effective.",
      category: "general"
    },
    {
      _id: "fallback-8",
      question: "What makes your approach different?",
      answer:
        "We combine local market knowledge with cutting-edge technology. Our AI-powered tools and personalized strategies are specifically designed for Montgomery County businesses.",
      category: "general"
    }
  ];

  const displayFaqs: FAQ[] = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  // Only show categories if there are more than 4 total FAQs
  const shouldShowCategories = displayFaqs.length > 4;

  // Group FAQs by category only if we should show categories
  const groupedFaqs = shouldShowCategories ? displayFaqs.reduce((acc, faq) => {
    const category = faq.category || 'general';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {} as {[key: string]: FAQ[]}) : {};

  // Show all categories when we have more than 4 total FAQs
  const categoriesToShow = shouldShowCategories ? Object.entries(groupedFaqs)
    .slice(0, 4) : []; // Limit to 4 sections max

  const categoryTitles: {[key: string]: string} = {
    'general': 'General Questions',
    'services': 'Our Services',
    'pricing': 'Pricing & Plans',
    'technical': 'Technical Support',
    'support': 'Customer Support'
  };

  return (
    <section className="faq-section w-full bg-[var(--section-bg-2)] text-[var(--text-secondary)] py-24 lg:py-40 relative overflow-hidden">
      {/* Gemini background pattern with conditional opacity */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-65 dark:opacity-35"
        style={{
          backgroundImage: 'url(/bg-section-gemini.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="absolute top-10 right-16 w-64 h-64 bg-[var(--accent)]/15 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 left-16 w-72 h-72 bg-[var(--accent)]/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="max-w-8xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-6xl font-extrabold text-[var(--text-secondary)] mb-8 leading-tight">
            Your business questions, <span className="gradient-text">answered fast</span>
          </h2>
          <p className="text-[var(--text-accent)] text-xl max-w-3xl mx-auto leading-relaxed">
            Get clear info on our web, marketing, and automation services.
          </p>
        </div>

        {shouldShowCategories ? (
          <div className="space-y-20">
            {categoriesToShow.map(([category, categoryFaqs], categoryIndex) => (
              <div key={category} className="max-w-6xl mx-auto">
                <h3 className="faq-category-heading text-3xl font-bold text-[var(--text-secondary)] text-center">
                  {categoryTitles[category] || category}
                </h3>
                <div className="faq-cards-container grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-start">
                  {categoryFaqs.map((faq, index) => (
                    <div
                      key={faq._id ?? index}
                      className={`group rounded-3xl p-6 lg:p-8 relative border-2 transition-all duration-500 will-change-transform ${
                        index % 2 === 0
                          ? 'bg-[var(--section-bg-3)] text-[var(--text-secondary)] border-[var(--border)]'
                          : 'bg-[var(--section-bg-2)] text-[var(--text-secondary)] border-[var(--border)]'
                      } hover:scale-[1.01]`}
                    >
                      {/* Mobile: Icon at top center, Desktop: Icon on right */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <button
                          onClick={() => toggleItem(category, index)}
                          className="faq-button w-full flex flex-col md:flex-row md:items-center md:justify-between text-left"
                        >
                          {/* Mobile: Icon at top center */}
                          <div className="flex justify-center md:hidden mb-4">
                            <svg
                              className={`w-8 h-8 text-[var(--accent)] ${
                                openItems[category]?.includes(index) ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          
                          {/* Question text - full width on mobile */}
                          <div className="flex-1 text-center md:text-left">
                            <span className="text-[var(--text-secondary)] text-xl font-semibold">{faq.question}</span>
                          </div>
                          
                          {/* Desktop: Icon on right */}
                          <div className="hidden md:flex md:ml-4">
                            <svg
                              className={`w-6 h-6 text-[var(--accent)] flex-shrink-0 ${
                                openItems[category]?.includes(index) ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>
                      </div>

                      {openItems[category]?.includes(index) && (
                        <div className="mt-4 pt-4 border-t border-[var(--border)]">
                          <p className="text-[var(--text-accent)] leading-relaxed text-lg text-justify">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 items-start">
            {displayFaqs.map((faq, index) => (
              <div
                key={faq._id ?? index}
                className={`group rounded-3xl p-6 lg:p-8 relative border-2 transition-all duration-500 will-change-transform ${
                  index % 2 === 0
                    ? 'bg-[var(--section-bg-3)] text-[var(--text-secondary)] border-[var(--border)]'
                    : 'bg-[var(--section-bg-2)] text-[var(--text-secondary)] border-[var(--border)]'
                } hover:scale-[1.01]`}
              >
                {/* Mobile: Icon at top center, Desktop: Icon on right */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <button
                    onClick={() => toggleItem('general', index)}
                    className="faq-button w-full flex flex-col md:flex-row md:items-center md:justify-between text-left"
                  >
                    {/* Mobile: Icon at top center */}
                    <div className="flex justify-center md:hidden mb-4">
                      <svg
                        className={`w-8 h-8 text-[var(--accent)] ${
                          openItems['general']?.includes(index) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {/* Question text - full width on mobile */}
                    <div className="flex-1 text-center md:text-left">
                      <span className="text-[var(--text-secondary)] text-xl font-semibold">{faq.question}</span>
                    </div>
                    
                    {/* Desktop: Icon on right */}
                    <div className="hidden md:flex md:ml-4">
                      <svg
                        className={`w-6 h-6 text-[var(--accent)] flex-shrink-0 ${
                          openItems['general']?.includes(index) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                </div>

                {openItems['general']?.includes(index) && (
                  <div className="mt-4 pt-4 border-t border-[var(--border)]">
                    <p className="text-[var(--text-accent)] leading-relaxed text-lg text-justify">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
