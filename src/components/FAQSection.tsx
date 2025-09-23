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
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]
    );
  };

  const defaultFaqs: FAQ[] = [
    {
      _id: "fallback-1",
      question: "What solutions do you provide?",
      answer:
        "We offer comprehensive digital solutions including custom website development, AI-powered automation tools, marketing campaigns, SEO optimization, cloud migration services, and IT consulting for local businesses in Montgomery County.",
    },
    {
      _id: "fallback-2",
      question: "How do you boost my leads?",
      answer:
        "We use a multi-channel approach including SEO optimization, social media marketing, Google Business profile optimization, targeted advertising campaigns, lead generation funnels, and conversion optimization to increase your business leads and customer acquisition.",
    },
    {
      _id: "fallback-3",
      question: "Can you handle system migrations?",
      answer:
        "Yes, we specialize in secure cloud migrations, data transfers, system integrations, and ensuring compliance with industry standards like HIPAA and SOC. Our team handles the entire migration process with minimal downtime.",
    },
    {
      _id: "fallback-4",
      question: "Is ongoing support available?",
      answer:
        "Absolutely! We provide 24/7 technical support, regular system maintenance, performance monitoring, security updates, and ongoing optimization to ensure your digital infrastructure runs smoothly and efficiently.",
    },
    {
      _id: "fallback-5",
      question: "What's your pricing model?",
      answer:
        "We offer flexible pricing options including project-based pricing, monthly retainers, and custom packages. Contact us for a free consultation and personalized quote.",
    },
  ];

  const displayFaqs: FAQ[] = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <section className="w-full bg-gray-900 py-24 lg:py-40">
      <div className="max-w-8xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-8 leading-tight">
            Your business questions, <span className="gradient-text">answered fast</span>
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Get clear info on our web, marketing, and automation services.
          </p>
        </div>

        <div className="max-w-xl mx-auto text-center space-y-6">
          {displayFaqs.map((faq, index) => (
            <div key={faq._id ?? index} className="border-b border-gray-700">
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between py-8 text-left hover:text-gray-300 transition-colors"
              >
                <span className="text-white text-xl font-medium pr-8">{faq.question}</span>
                <svg
                  className={`w-6 h-6 text-white transform transition-transform flex-shrink-0 ${
                    openItems.includes(index) ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {openItems.includes(index) && (
                <div className="pb-8">
                  <p className="text-gray-300 leading-relaxed text-lg">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
