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
  const [openItems, setOpenItems] = useState<{ [category: string]: number[] }>({});

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
      question: "What kinds of companies do you build agentic systems for?",
      answer:
        "Mid-scale companies — typically $10M to $500M in revenue — in healthcare, finance, nursing operations, and trade services (HVAC, construction, field dispatch). Too complex for off-the-shelf tools, too fast-moving for big-vendor timelines. We're built for that gap.",
      category: "services"
    },
    {
      _id: "fallback-2",
      question: "What does a typical engagement look like?",
      answer:
        "We start with a 30-minute scoping call to map your operations and identify the highest-ROI automation path. From there: architecture review, proof-of-concept in 2 weeks, production deployment in 4–6 weeks. We don't do discovery phases that stretch into quarters.",
      category: "services"
    },
    {
      _id: "fallback-3",
      question: "Can your systems integrate with our existing EHR, ERP, or CRM?",
      answer:
        "Yes. We integrate with Epic, Salesforce, NetSuite, QuickBooks, and most major platforms via API or FHIR/HL7 where applicable. If a native integration doesn't exist, we build one. No rip-and-replace required.",
      category: "technical"
    },
    {
      _id: "fallback-4",
      question: "Is HIPAA and SOC 2 compliance built in?",
      answer:
        "Every system we ship for healthcare includes a HIPAA-compliant data layer. Finance and platform systems include SOC 2 controls as standard. We don't bolt compliance on at the end — it's in the architecture from day one.",
      category: "technical"
    },
    {
      _id: "fallback-5",
      question: "How is your pricing structured?",
      answer:
        "Project-based, not retainer-first. We scope a system, agree on deliverables, and price from there. Ranges are listed on the site. If your needs don't fit a tier, we'll scope a custom engagement. We're transparent about cost before you commit.",
      category: "pricing"
    },
    {
      _id: "fallback-6",
      question: "How long does a full deployment take?",
      answer:
        "Proof-of-concept in 2 weeks. Production system in 4–8 weeks depending on integration complexity. We work in sprints, ship incrementally, and hand off running systems — not documentation packages.",
      category: "general"
    },
    {
      _id: "fallback-7",
      question: "What happens after the system goes live?",
      answer:
        "Every deployment includes 30–90 days of post-launch monitoring. For clients who want ongoing infrastructure management, our Operate tier provides a dedicated engineering pod, continuous model optimization, and 24/7 incident response.",
      category: "support"
    },
    {
      _id: "fallback-8",
      question: "What makes Verbaflow different from other AI agencies?",
      answer:
        "We don't sell strategies — we ship systems. Every engagement ends with production code running in your environment, not a report. We specialize in the domains where agents have measurable ROI: revenue cycle, compliance automation, workforce scheduling, and field operations.",
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
  }, {} as { [key: string]: FAQ[] }) : {};

  // Show all categories when we have more than 4 total FAQs
  const categoriesToShow = shouldShowCategories ? Object.entries(groupedFaqs)
    .slice(0, 4) : []; // Limit to 4 sections max

  const categoryTitles: { [key: string]: string } = {
    'general': 'General Questions',
    'services': 'Our Services',
    'pricing': 'Pricing & Plans',
    'technical': 'Technical Support',
    'support': 'Customer Support'
  };

  return (
    <section id="support" className="faq-section w-full bg-[var(--section-bg-2)] text-[var(--text-secondary)] py-24 lg:py-40 relative overflow-hidden">
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
            Straight answers <span className="gradient-text">on how we work.</span>
          </h2>
          <div className="text-[var(--text-accent)] text-xl max-w-3xl mx-auto leading-relaxed text-center">
            No marketing speak. How we scope, build, and ship agentic systems for mid-scale companies.
          </div>
        </div>

        {shouldShowCategories ? (
          <div className="space-y-20">
            {categoriesToShow.map(([category, categoryFaqs]) => (
              <div key={category} className="max-w-6xl mx-auto">
                <h3 className="faq-category-heading text-3xl font-bold text-[var(--text-secondary)] text-center">
                  {categoryTitles[category] || category}
                </h3>
                <div className="faq-cards-container grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-start">
                  {categoryFaqs.map((faq, index) => (
                    <div
                      key={faq._id ?? index}
                      className={`group rounded-3xl p-6 lg:p-8 relative border-2 transition-all duration-500 will-change-transform ${index % 2 === 0
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
                              className={`w-8 h-8 text-[var(--accent)] ${openItems[category]?.includes(index) ? 'rotate-180' : ''
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
                              className={`w-6 h-6 text-[var(--accent)] flex-shrink-0 ${openItems[category]?.includes(index) ? 'rotate-180' : ''
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
                className={`group rounded-3xl p-6 lg:p-8 relative border-2 transition-all duration-500 will-change-transform ${index % 2 === 0
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
                        className={`w-8 h-8 text-[var(--accent)] ${openItems['general']?.includes(index) ? 'rotate-180' : ''
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
                        className={`w-6 h-6 text-[var(--accent)] flex-shrink-0 ${openItems['general']?.includes(index) ? 'rotate-180' : ''
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
