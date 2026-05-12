'use client';

import { useState } from 'react';
import QuoteOverlay from './QuoteOverlay';

const PricingSection = () => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | undefined>(undefined);
  const pricingPlans = [
    {
      name: "Scope",
      description: "System scoping, architecture, and a working proof-of-concept. Know exactly what to build before you commit.",
      price: "$895",
      period: " – $2,495",
      features: [
        "Agentic system scoping & architecture map",
        "Use-case prioritization for your domain",
        "Proof-of-concept deployment",
        "Integration assessment (EHR, ERP, CRM)",
        "30-day monitoring & documented handoff"
      ],
      buttonText: "Start scoping",
      isPopular: false
    },
    {
      name: "Deploy",
      description: "Full production-grade agentic system. Built, tested, and handed off running in your environment.",
      price: "$2,495",
      period: " – $5,995",
      features: [
        "Production multi-agent system build",
        "Custom LLM fine-tuning or RAG pipeline",
        "HIPAA / SOC 2 compliance layer",
        "Live observability dashboard",
        "90-day post-deploy support"
      ],
      buttonText: "Get deployed",
      isPopular: false,
      badge: "Plus:"
    },
    {
      name: "Operate",
      description: "Ongoing agentic infrastructure management, multi-system orchestration, and engineering pod access.",
      price: "$5,995",
      period: " – $14,995",
      features: [
        "Multi-agent infrastructure management",
        "Cross-domain agentic orchestration",
        "Continuous model optimization",
        "Dedicated engineering pod access",
        "Compliance audit support (SOC 2, HIPAA, PCI DSS)",
        "Infrastructure scaling & cost optimization",
        "24/7 incident response SLA"
      ],
      buttonText: "Scale operations",
      isPopular: false,
      badge: "Plus:"
    }
  ];



  return (
    <section className="w-full bg-[var(--section-bg-2)] text-[var(--text-secondary)] py-16 lg:py-24 relative overflow-hidden">
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
          <h2 className="text-4xl lg:text-6xl font-extrabold text-[var(--text-secondary)] mb-8 leading-tight">
            Every engagement ships something real.
          </h2>
          <div className="text-[var(--text-accent)] text-lg sm:text-lg max-w-6xl mx-auto leading-relaxed text-center px-4 sm:px-8">
            Every tier starts with a 30-minute scoping call. We map your operations, identify the highest-ROI automation paths, and build production systems — not slide decks. If we can&apos;t justify the build, we tell you before you pay for it.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4 max-w-6xl mx-auto items-start">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`group rounded-3xl p-6 lg:p-8 relative border-2 transition-all duration-500 animate-fade-in-up will-change-transform ${index % 2 === 0
                ? 'bg-[var(--section-bg-3)] text-[var(--text-secondary)] border-[var(--border)]'
                : 'bg-[var(--section-bg-2)] text-[var(--text-secondary)] border-[var(--border)]'
                } ${index === 1 ? 'ring-2 ring-[var(--accent)]/70 shadow-glow scale-[1.02] hover:scale-[1.05]' : 'hover:scale-[1.02] hover:-rotate-[0.25deg]'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6">
                <h3 className="text-3xl font-bold text-[var(--text-secondary)] mb-4">{plan.name}</h3>
                <p className="text-[var(--text-accent)] text-lg mb-6 leading-relaxed">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline mb-2">
                    <span className="text-5xl font-extrabold text-[var(--text-secondary)]">{plan.price}</span>
                    <span className="text-[var(--text-accent)] ml-3 text-xl">{plan.period}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedTier(plan.name);
                    setIsQuoteOpen(true);
                  }}
                  className={`relative w-full font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform mb-6 text-lg overflow-hidden ${index === 1
                    ? 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-glow hover:scale-[1.03]'
                    : index === 0
                      ? 'border-2 border-[var(--accent)] text-[var(--text-accent)] bg-transparent hover:bg-[var(--accent)]/10 hover:scale-[1.03]'
                      : 'bg-[var(--muted-foreground)] text-[var(--section-bg-1)] hover:scale-[1.03]'
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
                    <span className="text-[var(--text-accent)] text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              {index > 0 && (
                <div className="mt-4 pt-3 border-t border-[var(--border)] text-[var(--text-accent)] text-xs tracking-wide">
                  Includes everything in <strong>{pricingPlans[index - 1].name}</strong>, plus these additional capabilities.
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