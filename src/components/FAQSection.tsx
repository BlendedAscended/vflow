"use client";

import { useState } from "react";
import AnimatedHeadline from "./ui/AnimatedHeadline";
import { useReveal } from "../hooks/useReveal";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  featured?: boolean;
  active?: boolean;
  order?: number;
}

interface FAQSectionProps { faqs?: FAQ[] }

const defaultFaqs: FAQ[] = [
  { _id: "fallback-1", question: "What solutions do you provide?", answer: "We offer comprehensive digital solutions including custom website development, AI-powered automation tools, marketing campaigns, SEO optimization, cloud migration services, and IT consulting.", category: "services" },
  { _id: "fallback-2", question: "How do you boost my leads?", answer: "We use a multi-channel approach including SEO, social media marketing, Google Business profile optimization, targeted advertising, lead generation funnels, and conversion optimization.", category: "services" },
  { _id: "fallback-3", question: "Can you handle system migrations?", answer: "Yes, we specialize in secure cloud migrations, data transfers, system integrations, and ensuring compliance with industry standards like HIPAA and SOC.", category: "technical" },
  { _id: "fallback-4", question: "Is ongoing support available?", answer: "Absolutely! We provide 24/7 technical support, regular maintenance, performance monitoring, security updates, and ongoing optimization.", category: "support" },
  { _id: "fallback-5", question: "What's your pricing model?", answer: "We offer flexible pricing including project-based pricing, monthly retainers, and custom packages. Contact us for a free consultation.", category: "pricing" },
  { _id: "fallback-6", question: "How long does a typical project take?", answer: "Timelines vary by complexity. Simple websites take 2-4 weeks, while comprehensive digital transformations can take 2-6 months.", category: "general" },
  { _id: "fallback-7", question: "Do you work with small businesses?", answer: "Yes! We specialize in helping small and medium businesses grow their digital presence with scalable, cost-effective solutions.", category: "general" },
  { _id: "fallback-8", question: "What makes your approach different?", answer: "We combine local market knowledge with cutting-edge technology. Our AI-powered tools and personalized strategies are built for your specific market.", category: "general" },
];

const categoryTitles: Record<string, string> = {
  general: "General Questions",
  services: "Our Services",
  pricing: "Pricing & Plans",
  technical: "Technical Support",
  support: "Customer Support",
};

const FAQSection = ({ faqs }: FAQSectionProps) => {
  const [openItems, setOpenItems] = useState<Record<string, number[]>>({});
  const contentRef = useReveal<HTMLDivElement>(0.1);

  const displayFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs;
  const shouldShowCategories = displayFaqs.length > 4;

  const groupedFaqs = shouldShowCategories
    ? displayFaqs.reduce<Record<string, FAQ[]>>((acc, faq) => {
        const cat = faq.category || "general";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(faq);
        return acc;
      }, {})
    : {};

  const categoriesToShow = shouldShowCategories ? Object.entries(groupedFaqs).slice(0, 4) : [];

  const toggleItem = (category: string, index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [category]: prev[category]?.includes(index)
        ? prev[category].filter((i) => i !== index)
        : [...(prev[category] || []), index],
    }));
  };

  const FaqCard = ({ faq, index, category }: { faq: FAQ; index: number; category: string }) => (
    <div className={`group rounded-3xl p-6 lg:p-8 relative border-2 transition-all duration-500 will-change-transform ${
      index % 2 === 0
        ? "bg-[var(--section-bg-3)] text-[var(--text-secondary)] border-[var(--border)]"
        : "bg-[var(--section-bg-2)] text-[var(--text-secondary)] border-[var(--border)]"
    } hover:scale-[1.01]`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <button onClick={() => toggleItem(category, index)} className="faq-button w-full flex flex-col md:flex-row md:items-center md:justify-between text-left">
          <div className="flex justify-center md:hidden mb-4">
            <svg className={`w-8 h-8 text-[var(--accent)] transition-transform duration-300 ${openItems[category]?.includes(index) ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="flex-1 text-center md:text-left">
            <span className="text-[var(--text-secondary)] text-xl font-semibold">{faq.question}</span>
          </div>
          <div className="hidden md:flex md:ml-4">
            <svg className={`w-6 h-6 text-[var(--accent)] flex-shrink-0 transition-transform duration-300 ${openItems[category]?.includes(index) ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );

  return (
    <section id="support" className="vf-ambient faq-section w-full bg-[var(--section-bg-2)] text-[var(--text-secondary)] py-24 lg:py-40 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-65 dark:opacity-35"
        style={{ backgroundImage: "url(/bg-section-gemini.png)", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />

      <div className="max-w-8xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-20">
          <span className="vf-section-num">/ 04</span>
          <AnimatedHeadline className="text-4xl lg:text-6xl font-extrabold text-[var(--text-secondary)] mb-8 leading-tight">
            Your business questions, answered fast
          </AnimatedHeadline>
          <div className="text-[var(--text-accent)] text-xl max-w-3xl mx-auto leading-relaxed text-center">
            Get clear info on our web, marketing, and automation services.
          </div>
        </div>

        <div ref={contentRef} className="vf-reveal">
          {shouldShowCategories ? (
            <div className="space-y-20">
              {categoriesToShow.map(([category, categoryFaqs]) => (
                <div key={category} className="max-w-6xl mx-auto">
                  <h3 className="faq-category-heading text-3xl font-bold text-[var(--text-secondary)] text-center">
                    {categoryTitles[category] || category}
                  </h3>
                  <div className="faq-cards-container grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-start">
                    {categoryFaqs.map((faq, index) => (
                      <FaqCard key={faq._id ?? index} faq={faq} index={index} category={category} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 items-start">
              {displayFaqs.map((faq, index) => (
                <FaqCard key={faq._id ?? index} faq={faq} index={index} category="general" />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
