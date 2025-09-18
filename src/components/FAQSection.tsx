'use client';

import { useState } from 'react';

// TypeScript interface for FAQ data
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
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  // Fallback FAQs if no Sanity data
  const defaultFaqs: FAQ[] = [
    {
      _id: "fallback-1",
      question: "What solutions do you provide?",
      answer: "We offer comprehensive digital solutions including custom website development, AI-powered automation tools, marketing campaigns, SEO optimization, cloud migration services, and IT consulting for local businesses in Montgomery County."
    },
    {
      _id: "fallback-2", 
      question: "How do you boost my leads?",
      answer: "We use a multi-channel approach including SEO optimization, social media marketing, Google Business profile optimization, targeted advertising campaigns, lead generation funnels, and conversion optimization to increase your business leads and customer acquisition."
    },
    {
      _id: "fallback-3",
      question: "Can you handle system migrations?", 
      answer: "Yes, we specialize in secure cloud migrations, data transfers, system integrations, and ensuring compliance with industry standards like HIPAA and SOC. Our team handles the entire migration process with minimal downtime."
    },
    {
      _id: "fallback-4",
      question: "Is ongoing support available?",
      answer: "Absolutely! We provide 24/7 monitoring, regular maintenance, security updates, performance optimization, and dedicated support to ensure your systems run smoothly and your business stays protected."
    },
    {
      _id: "fallback-5",
      question: "What's your pricing model?",
      answer: "We offer flexible pricing options including project-based pricing for one-time implementations, monthly retainers for ongoing services, and custom enterprise packages. Contact us for a free consultation and personalized quote."
    }
  ];

  // Use Sanity FAQs if available, otherwise use fallbacks
  const displayFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <section className="w-full bg-white py-24 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-green-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-block mb-6">
            <p className="text-green-600 font-bold text-sm uppercase tracking-wider bg-green-50 px-6 py-3 rounded-full border border-green-200">
              ❓ FAQ
            </p>
          </div>
          <h2 className="text-4xl lg:text-6xl font-extrabold text-black mb-8 leading-tight">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
          <p className="text-gray-600 text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto">
            Get answers to common questions about our services, pricing, and how we can help grow your business.
          </p>
        </div>

        <div className="space-y-6 animate-fade-in-up">
          {displayFaqs.map((faq, index) => (
            <div key={faq._id} className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-hover hover:shadow-elegant transition-all duration-300">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-8 py-8 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-xl lg:text-2xl font-bold text-black pr-8 leading-relaxed">
                  {faq.question}
                </h3>
                <div className={`flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center transition-transform duration-300 ${openItems.includes(index) ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {openItems.includes(index) && (
                <div className="px-8 pb-8 animate-fade-in-up">
                  <div className="border-t border-gray-100 pt-6">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
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