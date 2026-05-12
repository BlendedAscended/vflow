'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedHeadline from './ui/AnimatedHeadline';
import { useReveal } from '../hooks/useReveal';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Service {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  price?: string;
  features?: string[];
  ctaText?: string;
  ctaLink?: string;
  featured?: boolean;
  active?: boolean;
  slug?: string;
}
interface ServicesSectionProps { services?: Service[] }

// ─── Pricing data ─────────────────────────────────────────────────────────────
const BASE_PRICE: Record<string, [number, number]> = {
  'AI & Automation':     [295, 500],
  'Marketing Campaigns': [395, 800],
  'Website / App Dev':   [195, 400],
  'Cloud & IT':          [495, 900],
  'Multiple Services':   [800, 1800],
};
const SCALE_MULT: Record<string, number> = {
  'Solo / Freelancer':   1,
  'Small Team (2–10)':   1.7,
  'Growing Co. (10–50)': 2.8,
  'Enterprise (50+)':    5,
};
const TIME_MULT: Record<string, number> = {
  'This week': 1.3, 'Within a month': 1, 'Next quarter': 0.9, 'Just exploring': 1,
};
const SLUG_TO_SVC: Record<string, string> = {
  'website-development': 'Website / App Dev',
  'digital-marketing':   'Marketing Campaigns',
  'ai-automation':       'AI & Automation',
  'cloud-solutions':     'Cloud & IT',
};
const ACCENT_HX = '#A5D6A7';

function calcPrice(svc: string, scale: string, timeline: string): [number, number] {
  const base = BASE_PRICE[svc] ?? [300, 600];
  const sm = SCALE_MULT[scale] ?? 1;
  const tm = TIME_MULT[timeline] ?? 1;
  return [Math.round(base[0] * sm * tm), Math.round(base[1] * sm * tm)];
}

const QUIZ_STEPS = [
  { label: 'SERVICE',  question: 'Which service do you need?',      options: ['AI & Automation', 'Marketing Campaigns', 'Website / App Dev', 'Cloud & IT', 'Multiple Services'] },
  { label: 'SCALE',    question: 'What scale are you operating at?', options: ['Solo / Freelancer', 'Small Team (2–10)', 'Growing Co. (10–50)', 'Enterprise (50+)'] },
  { label: 'TIMELINE', question: 'When do you want to kick off?',    options: ['This week', 'Within a month', 'Next quarter', 'Just exploring'] },
];

// ─── 3-pillar data ────────────────────────────────────────────────────────────
const pillars = [
  { title: "Attract",  desc: "AI-qualified inbound from the channels your buyers already use.", bg: "linear-gradient(135deg,#1d4d3a,#0d2a21)" },
  { title: "Convert",  desc: "Voice + chat workflows that respond in under 60 seconds.",        bg: "linear-gradient(135deg,#2d2d4b,#16162a)" },
  { title: "Automate", desc: "Back-office tasks run themselves — scheduling, follow-up, CRM.", bg: "linear-gradient(135deg,#4b321d,#2a1a0d)" },
];

// ─── Quiz body ────────────────────────────────────────────────────────────────
interface QuizBodyProps {
  step: number; answers: string[]; showResult: boolean;
  onSelect: (opt: string) => void; onAdvance: () => void;
  onReset: () => void; onClose?: () => void;
}

function QuizBody({ step, answers, showResult, onSelect, onAdvance, onReset, onClose }: QuizBodyProps) {
  const current = QUIZ_STEPS[step];
  const chosen = answers[step];
  const isRush = answers[2] === 'This week';
  const [pMin, pMax] = showResult ? calcPrice(answers[0], answers[1], answers[2]) : [0, 0];
  const CAL_URL = 'https://cal.com/sandeep-singh/30min';

  return (
    <>
      <div className="px-6 pt-6 pb-4 border-b border-[var(--border)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: ACCENT_HX }}>
              Individual Service Pricing
            </p>
            <h3 className="text-[var(--text-secondary)] text-lg font-bold leading-snug">
              3 Questions → Your Price &amp; Meeting
            </h3>
          </div>
          <div className="flex gap-2 mt-0.5">
            {showResult && (
              <button onClick={onReset} className="text-[var(--text-accent)] opacity-50 hover:opacity-90 transition-opacity">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                </svg>
              </button>
            )}
            {onClose && (
              <button onClick={onClose} className="text-[var(--text-accent)] opacity-50 hover:opacity-90 transition-opacity">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>
        {!showResult && (
          <div className="mt-4 space-y-1.5">
            <div className="flex gap-1.5">
              {QUIZ_STEPS.map((_, i) => (
                <div key={i} className="flex-1 h-0.5 rounded-full transition-all duration-500"
                  style={{ background: i <= step ? ACCENT_HX : 'var(--border)' }} />
              ))}
            </div>
            <div className="flex">
              {QUIZ_STEPS.map((s, i) => (
                <div key={i} className="flex-1 text-[8px] font-bold uppercase tracking-wider transition-colors duration-300"
                  style={{ color: i <= step ? ACCENT_HX : 'var(--text-accent)', opacity: i <= step ? 1 : 0.35 }}>
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-5 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div key={step} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.18 }}>
              <p className="text-sm text-[var(--text-accent)] mb-4">{current.question}</p>
              <div className="space-y-2">
                {current.options.map(opt => {
                  const active = chosen === opt;
                  return (
                    <button key={opt} onClick={() => onSelect(opt)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all duration-200 text-left text-sm font-medium"
                      style={{ borderColor: active ? ACCENT_HX : 'var(--border)', background: active ? `${ACCENT_HX}18` : 'transparent', color: active ? ACCENT_HX : 'var(--text-accent)' }}>
                      {opt}
                      {active && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ACCENT_HX} strokeWidth={2.5}><path d="M20 6L9 17l-5-5"/></svg>}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
              <div className="rounded-2xl p-5 mb-3 text-center border border-[var(--border)]" style={{ background: 'var(--section-bg-2)' }}>
                <p className="text-[9px] uppercase tracking-widest font-bold mb-2 opacity-60" style={{ color: 'var(--text-accent)' }}>Estimated Investment</p>
                <p className="text-4xl font-extrabold leading-none mb-2" style={{ color: ACCENT_HX }}>${pMin.toLocaleString()} – ${pMax.toLocaleString()}</p>
                <p className="text-[11px] opacity-55 mb-3" style={{ color: 'var(--text-accent)' }}>{answers[0]} · {answers[1]}</p>
                {isRush && <span className="inline-flex items-center gap-1 bg-orange-500/20 text-orange-400 text-[10px] font-bold px-3 py-1 rounded-full">🔥 Rush rate applies</span>}
              </div>
              <div className="rounded-2xl px-4 py-3 mb-3 flex items-center gap-3 border border-[var(--border)]" style={{ background: 'var(--section-bg-2)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT_HX}22` }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ACCENT_HX} strokeWidth={2}>
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>30-min Discovery Call</p>
                  <p className="text-[11px] opacity-55" style={{ color: 'var(--text-accent)' }}>Quick overview &amp; fit check</p>
                </div>
              </div>
              <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm transition-opacity hover:opacity-90"
                style={{ background: ACCENT_HX, color: 'var(--accent-foreground)' }}>
                Book on cal.com
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <button onClick={onReset} className="w-full mt-3 text-center text-[11px] opacity-40 hover:opacity-70 transition-opacity" style={{ color: 'var(--text-accent)' }}>↺ Start over</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!showResult && (
        <div className="px-6 pb-6">
          <button onClick={onAdvance} disabled={!chosen}
            className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200"
            style={{ background: chosen ? ACCENT_HX : 'var(--border)', color: chosen ? 'var(--accent-foreground)' : 'var(--text-accent)', opacity: chosen ? 1 : 0.5, cursor: chosen ? 'pointer' : 'not-allowed' }}>
            {step < 2 ? 'Next' : 'Calculate My Price'}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      )}
    </>
  );
}

// ─── Pricing Modal (mobile) ───────────────────────────────────────────────────
function PricingModal({ isOpen, onClose, prefilledSlug }: { isOpen: boolean; onClose: () => void; prefilledSlug?: string }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [showResult, setShowResult] = useState(false);

  const reset = useCallback(() => { setStep(0); setAnswers(['', '', '']); setShowResult(false); }, []);

  useEffect(() => {
    if (isOpen) {
      const mapped = SLUG_TO_SVC[prefilledSlug ?? ''] ?? '';
      if (mapped) { setAnswers([mapped, '', '']); setStep(1); } else { reset(); }
    }
  }, [isOpen, prefilledSlug, reset]);

  function select(opt: string) { const next = [...answers]; next[step] = opt; setAnswers(next); }
  function advance() { if (step < 2) setStep(s => s + 1); else setShowResult(true); }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="fixed top-0 right-0 bottom-0 z-50 flex flex-col pointer-events-auto"
            style={{ width: 'min(420px, 92vw)', background: 'var(--section-bg-3)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}>
            <QuizBody step={step} answers={answers} showResult={showResult} onSelect={select} onAdvance={advance} onReset={reset} onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Inline quiz panel (desktop) ─────────────────────────────────────────────
function InlinePricingPanel(props: { step: number; answers: string[]; showResult: boolean; onSelect: (opt: string) => void; onAdvance: () => void; onReset: () => void }) {
  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] overflow-hidden" style={{ background: 'var(--section-bg-3)', minHeight: 420 }}>
      <QuizBody {...props} />
    </div>
  );
}

// ─── Main ServicesSection ──────────────────────────────────────────────────────
const ServicesSection = ({ services }: ServicesSectionProps) => {
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizSlug, setQuizSlug] = useState<string | undefined>();
  const [panelStep, setPanelStep] = useState(0);
  const [panelAnswers, setPanelAnswers] = useState<string[]>(['', '', '']);
  const [panelResult, setPanelResult] = useState(false);

  const pillarsRef = useReveal(0.15);

  const resetPanel = useCallback(() => { setPanelStep(0); setPanelAnswers(['', '', '']); setPanelResult(false); }, []);
  function panelSelect(opt: string) { const next = [...panelAnswers]; next[panelStep] = opt; setPanelAnswers(next); }
  function panelAdvance() { if (panelStep < 2) setPanelStep(s => s + 1); else setPanelResult(true); }

  void services; // Sanity services retained for future use

  return (
    <section id="services" className="w-full bg-[var(--section-bg-2)] text-[var(--text-secondary)] py-16 lg:py-24 relative overflow-hidden">

      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-30"
        style={{ backgroundImage: 'url(/bg-section-gemini.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
      <div className="absolute top-10 right-16 w-72 h-72 bg-[var(--accent)]/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-10 left-8 w-64 h-64 bg-[var(--accent)]/8 rounded-full blur-3xl animate-float pointer-events-none" />

      <div className="max-w-8xl mx-auto px-6 lg:px-12 relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="vf-section-num">/ 01</span>
          <div className="inline-block mb-5 pt-2">
            <div className="text-[var(--accent)] text-xs font-bold uppercase tracking-wider bg-[var(--accent)]/10 pl-10 pr-6 py-2.5 rounded-r-2xl w-fit mx-auto"
              style={{ clipPath: 'polygon(1.2rem 50%, 0 0, 100% 0, 100% 100%, 0 100%)' }}>
              Where strategy, technology, and automation converge, predictable growth emerges.
            </div>
          </div>
          <AnimatedHeadline className="text-4xl lg:text-6xl font-extrabold text-[var(--text-secondary)] mb-4 leading-tight">
            Build a Smarter, Stronger Brand.
          </AnimatedHeadline>
          <p className="text-[var(--text-accent)] opacity-70 text-lg max-w-xl mx-auto">
            Three pillars. One outcome: more of the right customers, won faster.
          </p>
        </div>

        {/* ── 3-Pillar layout ── */}
        <div ref={pillarsRef} className="vf-reveal vf-pillars mb-10">
          {pillars.map((p) => (
            <article key={p.title} className="vf-pillar">
              <div className="vf-pillar__bg" style={{ background: p.bg }} />
              <div className="vf-pillar__content">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            </article>
          ))}
        </div>

        {/* ── Pricing quiz (desktop right panel + mobile CTA) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-6 lg:gap-10 items-start mt-12">

          {/* Left: intro copy */}
          <div className="flex flex-col justify-center gap-4">
            <p className="text-[var(--text-accent)] text-lg leading-relaxed max-w-lg">
              Not sure where to start? Answer 3 questions and we&apos;ll give you a price estimate and book a call—no sales pressure.
            </p>
            <button
              onClick={() => { setQuizSlug(undefined); setQuizOpen(true); }}
              className="lg:hidden inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-200 hover:opacity-90 w-fit"
              style={{ background: ACCENT_HX, color: 'var(--accent-foreground)' }}>
              Get My Custom Price Estimate
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>

          {/* Right: inline quiz */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50" style={{ color: 'var(--text-accent)' }}>Individual Service Pricing</span>
              </div>
              <InlinePricingPanel step={panelStep} answers={panelAnswers} showResult={panelResult} onSelect={panelSelect} onAdvance={panelAdvance} onReset={resetPanel} />
            </div>
          </div>
        </div>
      </div>

      <PricingModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} prefilledSlug={quizSlug} />
    </section>
  );
};

export default ServicesSection;
