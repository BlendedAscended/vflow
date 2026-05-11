"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLocationValue } from './LocationContext';
import QuoteOverlay from './QuoteOverlay';
import { useMouseLight } from '../hooks/useMouseLight';

/* ─────────────────────────────────────────────
   Healthie-style hero:
   • Full-viewport video background (existing /hero-video-v2.mp4)
   • Dark tint overlay for legibility
   • Left column: location badge → headline → sub → dual pill CTAs
   • Right column: glassmorphism product snippet card
   • Trust bar immediately below
   ───────────────────────────────────────────── */

const HeroSection = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const { location } = useLocationValue();
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  useMouseLight(heroRef);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.65;
    }
  }, []);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <div ref={heroRef} className="mouse-light relative">
        <section className="bento-tile depth-lg tile-in min-h-screen w-full flex items-center justify-center overflow-hidden bg-[var(--surface-100)]">

          {/* Full-bleed background video */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src="/hero-video-v2.mp4"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onLoadedData={() => {
              if (videoRef.current) videoRef.current.playbackRate = 0.65;
            }}
          />

          {/* Dark tint + subtle vignette */}
          <div className="absolute inset-0 bg-black/50 z-[1] [box-shadow:inset_0_0_150px_rgba(0,0,0,0.6)]" />

          {/* Soft radial glow behind content (brand accent) */}
          <div className="absolute inset-0 z-[2] pointer-events-none bg-[radial-gradient(circle_at_center,var(--green-500)/10%,transparent_70%)]" />

          {/* Content grid */}
          <div className="relative z-[3] w-full max-w-7xl mx-auto px-6 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* ── LEFT: Messaging ─────────────────── */}
            <div className="flex flex-col gap-6 max-w-2xl animate-slide-in-left tile-in">

              {/* Location badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bento-tile depth-sm text-sm font-medium text-[var(--green-500)]">
                <span className="w-2 h-2 rounded-full bg-[var(--green-500)] animate-pulse" />
                Serving clients in {location}
              </div>

              <h1 className="text-reveal font-bold text-[2.5rem] md:text-[3.5rem] uppercase tracking-tight leading-[1.1] text-[var(--text-100)]">
                An agentic agency,<br />
                built for your <span className="text-[var(--text-90)]">2027 business.</span>
              </h1>

              <p className="text-lg md:text-xl leading-relaxed text-[var(--green-500)] max-w-xl">
                AI architects, a CEO agent, designers and compliance officers — orchestrated
                on OpenClaw with humans on call via Telegram. From TMS and government portals
                to claims, hiring and AI blueprints. Pick a service, or get a $19 plan tailored
                to your business.
              </p>

              <div className="flex flex-wrap gap-4 mt-2">
                <Link href="/growth-plan" className="micro-lift inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--green-500)] text-[var(--ink-100)] font-semibold text-sm transition-all hover:bg-[var(--green-400)]">
                  Build my $19 plan →
                </Link>
                <Link href="/virtual-office" className="micro-lift inline-flex items-center justify-center px-6 py-3 rounded-full border border-[var(--border-80)] text-[var(--text-100)] font-semibold text-sm transition-all hover:bg-[var(--surface-80)] hover:border-[var(--border-100)]">
                  Visit the Virtual Office
                </Link>
                {false && (
                  <button
                    onClick={() => setIsQuoteOpen(true)}
                    className="micro-lift inline-flex items-center justify-center px-6 py-3 rounded-full border border-[var(--border-80)] text-[var(--text-100)] font-semibold text-sm transition-all hover:bg-[var(--surface-80)] hover:border-[var(--border-100)]"
                  >
                    Request Quote
                  </button>
                )}
              </div>

              {false && <span className="text-xs text-[var(--text-60)] mt-1">No credit card required.</span>}
            </div>

            {/* ── RIGHT: Glass product card ────────── */}
            {false && <div className="hidden lg:flex flex-col items-center justify-center relative animate-slide-in-right tile-in">
              {/* Main glass card */}
              <div className="bento-tile depth-md p-6 w-full max-w-sm bg-[var(--surface-80)]/70 backdrop-blur-xl border border-[var(--border-80)] rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-semibold text-[var(--green-500)]">● Live</span>
                  <span className="text-xs font-medium text-[var(--text-60)] px-2 py-1 rounded-full bg-[var(--surface-70)]">Growth Dashboard</span>
                </div>

                <div className="mb-4">
                  <span className="block text-sm text-[var(--text-60)] mb-1">Leads this month</span>
                  <span className="block text-3xl font-bold text-[var(--text-100)]">+247</span>
                  <span className="block text-sm text-[var(--green-500)] mt-1">↑ 34% vs last month</span>
                </div>

                <div className="h-px w-full bg-[var(--border-80)] my-4" />

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[var(--text-70)]">Campaigns active</span>
                  <span className="text-sm font-semibold text-[var(--text-100)]">8</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[var(--text-70)]">Avg. response rate</span>
                  <span className="text-sm font-semibold text-[var(--green-500)]">68%</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[var(--text-70)]">Tasks automated</span>
                  <span className="text-sm font-semibold text-[var(--text-100)]">1,204</span>
                </div>
              </div>

              {/* Floating mini badge */}
              <div className="absolute -bottom-4 -right-4 bento-tile depth-sm p-3 bg-[var(--surface-80)] border border-[var(--border-80)] rounded-xl shadow-lg">
                <span className="text-xs text-[var(--text-100)]">✓ AI brief sent to Sarah K.</span>
                <span className="block text-[10px] text-[var(--text-60)] mt-1">Just now</span>
              </div>
            </div>}
          </div>

          {/* Sound toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-6 right-6 z-[4] p-2 rounded-full bg-[var(--surface-80)]/80 backdrop-blur-sm border border-[var(--border-80)] text-[var(--text-100)] transition-all hover:bg-[var(--surface-70)]"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? (
              <svg className="w-4 h-4 text-[var(--text-100)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-[var(--text-100)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </section>
      </div>

      {/* ── TRUST BAR ────────────────────────────────── */}
      <div className="bento-tile depth-sm tile-in w-full py-8 px-6 bg-[var(--surface-90)] border-t border-[var(--border-80)]">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-[var(--text-60)] mb-4">Verticals we already serve</p>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {['Healthcare', 'Finance', 'Trucking', 'Insurance', 'Government', 'AEC', 'E-Commerce', 'SaaS'].map((sector) => (
            <span key={sector} className="px-4 py-1.5 rounded-full bg-[var(--surface-80)] border border-[var(--border-80)] text-[var(--text-90)] text-sm font-medium">{sector}</span>
          ))}
        </div>
      </div>

      <QuoteOverlay isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </>
  );
};

export default HeroSection;
