'use client';

import { useState } from 'react';
import QuoteOverlay from './QuoteOverlay';

const PricingSection = () => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | undefined>(undefined);
  const pricingPlans = [
    {
      name: "Coupe",
      description: "Essential website and online presence setup for new businesses.",
      price: "$49",
      period: "/mo",
      features: [
        "Custom Website Development",
        "Landing Page Design & Optimization",
        "Website Maintenance & Support Plans",
        "Google Business Profile",
        "Portfolio Website Development"
      ],
      buttonText: "Start Winning",
      isPopular: false
    },
    {
      name: "Muscle",
      description: "Advanced marketing and automation tools for growing teams.",
      price: "$99",
      period: "/mo",
      features: [
        "Social Media Marketing & Campaigns",
        "Automated Lead Response & Appointment Scheduling",
        "Google Ads & SEO Optimization",
        "Business Analytics & Custom Reporting"
      ],
      buttonText: "Grow Right Now",
      isPopular: false,
      badge: "Plus:"
    },
    {
      name: "Grand Tourer",
      description: "Full-service automation, analytics, and compliance for scaling operations.",
      price: "$199",
      period: "/mo",
      features: [
        "AI Chatbot Development & Integration",
        "Voice Command Workflow Automation",
        "Robotics Process Automation (RPA) Consulting",
        "Predictive Analytics & Large Language Model (LLM) Integration",
        "Blockchain & Crypto Application Development",
        "Data Architecture & Cybersecurity Compliance",
        "Cloud Computing & Infrastructure Optimization"
      ],
      buttonText: "Join the Club",
      isPopular: false,
      badge: "Plus:"
    }
  ];



  return (
    <section className="w-full bg-[var(--section-bg-2)] text-[var(--green-500)] py-16 lg:py-24 relative overflow-hidden">
      {/* Next background pattern with conditional opacity */}
      <div
        className="pointer-events-none absolute inset-0 opacity-65 dark:opacity-35"
        style={{
          backgroundImage: 'url(/bg-section-next.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="absolute top-20 right-20 w-64 h-64 bg-[var(--accent)]/15 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-[var(--accent)]/10 rounded-full blur-3xl animate-pulse-slow"></div>

      <div className="max-w-8xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-6xl font-extrabold text-[var(--green-500)] mb-8 leading-tight">
            We work with winners.
          </h2>
          <div className="text-[var(--text-90)] text-lg sm:text-lg max-w-6xl mx-auto leading-relaxed text-center px-4 sm:px-8">
            This membership acts as your retainer of intent: a low-barrier way to secure our expertise. The cost? It&apos;s pocket change compared to the upside. But it proves you&apos;re serious. Once you&apos;re in, we stop guessing, assess your needs, and plug you into the right network immediately. Stop standing on the sidelines. Pick a tier and let&apos;s get to work.
          </div>
        </div>

        <div className="bento-grid">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`group bento-tile rounded-3xl p-6 lg:p-8 relative border-2 transition-all duration-500 animate-fade-in-up will-change-transform tile-in bg-[var(--surface-80)] text-[var(--green-500)] border-[var(--border-80)] ${index === 1 ? 'depth-lg live-tile ring-2 ring-[var(--accent)]/70 shadow-glow scale-[1.02] hover:scale-[1.05]' : 'depth-md hover:scale-[1.02] hover:-rotate-[0.25deg]'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6">
                <h3 className="text-3xl font-bold text-[var(--green-500)] mb-4">{plan.name}</h3>
                <p className="text-[var(--text-90)] text-lg mb-6 leading-relaxed">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline mb-2">
                    <span className="text-5xl font-extrabold text-[var(--green-500)]">{plan.price}</span>
                    <span className="text-[var(--text-90)] ml-3 text-xl">{plan.period}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedTier(plan.name);
                    setIsQuoteOpen(true);
                  }}
                  className={`relative micro-lift w-full font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform mb-6 text-lg overflow-hidden ${index === 1
                    ? 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-glow hover:scale-[1.03]'
                    : index === 0
                      ? 'border-2 border-[var(--accent)] text-[var(--text-90)] bg-transparent hover:bg-[var(--accent)]/10 hover:scale-[1.03]'
                      : 'bg-[var(--muted-foreground)] text-[var(--surface-100)] hover:scale-[1.03]'
                    }`}>
                  <span className="relative z-10">{plan.buttonText}</span>
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                    background: 'radial-gradient(120% 120% at 0% 0%, rgba(255,255,255,0.25) 0%, transparent 40%)'
                  }} />
                </button>
              </div>

              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[var(--text-90)] text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              {index > 0 && (
                <div className="mt-4 pt-3 border-t border-[var(--border-80)] text-[var(--text-90)] text-xs tracking-wide">
                  ✨ Includes everything in <strong>{pricingPlans[index - 1].name}</strong>, plus these additional capabilities.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <QuoteOverlay
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        initialTier={selectedTier}
        initialPrice={pricingPlans.find(p => p.name === selectedTier)?.price ? `${pricingPlans.find(p => p.name === selectedTier)?.price}${pricingPlans.find(p => p.name === selectedTier)?.period}` : undefined}
      />
    </section >
  );
};

export default PricingSection;