"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLocationValue } from './LocationContext';
import QuoteOverlay from './QuoteOverlay';
import Marquee from './ui/Marquee';

const rotatingWords = ["best customers.", "high-intent leads.", "loyal advocates."];
const sectors = ['Healthcare', 'Finance', 'Real Estate', 'E-Commerce', 'SaaS'];

function useMagneticRef<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  return { ref, onPointerMove: onMove, onPointerLeave: onLeave };
}

const HeroSection = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const { location } = useLocationValue();
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroCTA = useMagneticRef<HTMLAnchorElement>();

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

        {/* Soft radial glow behind content */}
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

            {/* Kinetic headline */}
            <h1 className="vf-hero__headline">
              Connect with more of your<br />
              <span className="vf-word-mask">
                {rotatingWords.map((w, i) => (
                  <span key={i} className={`vf-word vf-word--${i + 1}`}>{w}</span>
                ))}
              </span>
            </h1>

            <p className="vf-hero__sub">
              One intelligent platform for your entire customer journey—engineered
              to make you the premier choice in your market.
            </p>

            <div className="vf-hero__ctas">
              <Link
                ref={heroCTA.ref}
                onPointerMove={heroCTA.onPointerMove}
                onPointerLeave={heroCTA.onPointerLeave}
                href="/growth-plan"
                className="vf-btn vf-btn--primary vf-btn-magnetic"
              >
                Get my growth plan <span className="vf-arrow">→</span>
              </Link>
            </div>

            {false && <span className="vf-hero__micro">No credit card required.</span>}
          </div>

          {/* ── RIGHT: Glass product card (hidden) ── */}
          {false && <div className="vf-hero__visual animate-slide-in-right" />}
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

      {/* ── TRUST BAR — Marquee ────────────────────────── */}
      <div className="vf-trust-bar">
        <p className="vf-trust-bar__label">Trusted by growth-minded businesses</p>
        <Marquee variant="logo" speed={28}>
          {sectors.map((sector) => (
            <span key={sector} className="vf-trust-bar__pill">{sector}</span>
          ))}
        </Marquee>
      </div>

      <QuoteOverlay isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </>
  );
};

export default HeroSection;
