"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLocationValue } from './LocationContext';
import QuoteOverlay from './QuoteOverlay';

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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.65;
    }
  }, []);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="vf-hero">

        {/* Full-bleed background video */}
        <video
          ref={videoRef}
          className="vf-hero__video"
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
        <div className="vf-hero__overlay" />

        {/* Soft radial glow behind content (brand accent) */}
        <div className="vf-hero__glow" />

        {/* Content grid */}
        <div className="vf-hero__inner">

          {/* ── LEFT: Messaging ─────────────────── */}
          <div className="vf-hero__text animate-slide-in-left">

            {/* Location badge */}
            <div className="vf-hero__badge">
              <span className="vf-hero__badge-dot" />
              Serving clients in {location}
            </div>

            <h1 className="vf-hero__headline">
              Connect with more<br />
              of your <span className="vf-hero__headline-accent">best customers.</span>
            </h1>

            <p className="vf-hero__sub">
              We unify your entire customer journey on one intelligent platform.
              Every stage—from marketing to operations—engineered to make you
              the premier choice.
            </p>

            <div className="vf-hero__ctas">
              <Link href="/growth-plan" className="vf-btn vf-btn--primary">
                Get my growth plan →
              </Link>
              {false && (
                <button
                  onClick={() => setIsQuoteOpen(true)}
                  className="vf-btn vf-btn--ghost"
                >
                  Request Quote
                </button>
              )}
            </div>

            {false && <span className="vf-hero__micro">No credit card required.</span>}
          </div>

          {/* ── RIGHT: Glass product card ────────── */}
          {false && <div className="vf-hero__visual animate-slide-in-right">
            {/* Main glass card */}
            <div className="vf-glass-card">
              <div className="vf-glass-card__header">
                <span className="vf-glass-card__status">● Live</span>
                <span className="vf-glass-card__tag">Growth Dashboard</span>
              </div>

              <div className="vf-glass-card__metric">
                <span className="vf-glass-card__metric-label">Leads this month</span>
                <span className="vf-glass-card__metric-value">+247</span>
                <span className="vf-glass-card__metric-delta">↑ 34% vs last month</span>
              </div>

              <div className="vf-glass-card__divider" />

              <div className="vf-glass-card__row">
                <span className="vf-glass-card__row-label">Campaigns active</span>
                <span className="vf-glass-card__row-val">8</span>
              </div>
              <div className="vf-glass-card__row">
                <span className="vf-glass-card__row-label">Avg. response rate</span>
                <span className="vf-glass-card__row-val vf-glass-card__row-val--green">68%</span>
              </div>
              <div className="vf-glass-card__row">
                <span className="vf-glass-card__row-label">Tasks automated</span>
                <span className="vf-glass-card__row-val">1,204</span>
              </div>
            </div>

            {/* Floating mini badge */}
            <div className="vf-glass-badge">
              <span>✓ AI brief sent to Sarah K.</span>
              <span className="vf-glass-badge__time">Just now</span>
            </div>
          </div>}
        </div>

        {/* Sound toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="vf-hero__sound-btn"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </section>

      {/* ── TRUST BAR ────────────────────────────────── */}
      <div className="vf-trust-bar">
        <p className="vf-trust-bar__label">Trusted by growth-minded businesses</p>
        <div className="vf-trust-bar__logos">
          {['Healthcare', 'Finance', 'Real Estate', 'E-Commerce', 'SaaS'].map((sector) => (
            <span key={sector} className="vf-trust-bar__pill">{sector}</span>
          ))}
        </div>
      </div>

      <QuoteOverlay isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </>
  );
};

export default HeroSection;