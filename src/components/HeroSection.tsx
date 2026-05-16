"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLocationValue } from "./LocationContext";
import QuoteOverlay from "./QuoteOverlay";
import MagneticButton from "./ui/MagneticButton";

const HeroSection = () => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const { location } = useLocationValue();
  const sectionRef = useRef<HTMLElement>(null);
  const handTopRef = useRef<HTMLDivElement>(null);
  const handBotRef = useRef<HTMLDivElement>(null);
  const meetLightRef = useRef<HTMLDivElement>(null);
  const particleHostRef = useRef<HTMLDivElement>(null);

  // ── Particles ──────────────────────────────────────────
  useEffect(() => {
    const host = particleHostRef.current;
    if (!host) return;

    const n = 80;
    host.innerHTML = "";
    for (let i = 0; i < n; i++) {
      const p = document.createElement("div");
      p.className = "vf-particle";
      const x = 35 + Math.random() * 30;
      const startY = 100 + Math.random() * 20;
      const dur = 8 + Math.random() * 14;
      const delay = -Math.random() * dur;
      const driftX = (Math.random() - 0.5) * 80;
      const size = 1 + Math.random() * 2;
      p.style.left = x + "%";
      p.style.top = startY + "vh";
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.animationDuration = dur + "s";
      p.style.animationDelay = delay + "s";
      (p.style as CSSStyleDeclaration).setProperty("--drift-x", driftX + "px");
      host.appendChild(p);
    }
  }, []);

  // ── Hand scroll animation ─────────────────────────────
  useEffect(() => {
    const sceneEl = sectionRef.current;
    const handTop = handTopRef.current;
    const handBot = handBotRef.current;
    const meetLight = meetLightRef.current;
    if (!sceneEl || !handTop || !handBot) return;

    let inView = true;
    const io = new IntersectionObserver(
      ([e]) => { inView = e.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(sceneEl);

    const clamp = (x: number, a: number, b: number) =>
      Math.max(a, Math.min(b, x));
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const PEAK_P = 0.55;
    const TOUCH_GAP_PX = 12;
    const TOP_NATURAL_VH = -0.28;
    const BOT_NATURAL_ROTATION = -6;

    let ticking = false;

    function update() {
      ticking = false;
      if (!inView) return;

      const rect = sceneEl!.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp(-rect.top / Math.max(1, rect.height), 0, 1);

      const botRect = handBot!.getBoundingClientRect();
      const topRect = handTop!.getBoundingClientRect();

      const humanTipX = botRect.left + botRect.width * 0.12;
      const humanTipY = botRect.top + botRect.height * 0.04;
      const roboTipOffsetY = topRect.height * 0.92;
      const roboTipOffsetX = topRect.width * 0.16;

      const sceneTopAbs = rect.top;
      const naturalTop = TOP_NATURAL_VH * vh;
      const handTopTopWanted = humanTipY - TOUCH_GAP_PX - roboTipOffsetY;
      const dyPeak = handTopTopWanted - sceneTopAbs - naturalTop;

      const dyStart = 0;
      const dyExit = dyStart - 0.3 * vh;
      const dxBotStart = 0;
      const dxBotPeak = -50;
      const dxTopStart = 0;
      const dxTopPeak = -30;

      let dy: number, dxBot: number, dxTop: number, opacity: number, proximity: number;
      if (p < PEAK_P) {
        const t = easeOutCubic(p / PEAK_P);
        dy = dyStart + (dyPeak - dyStart) * t;
        dxBot = dxBotStart + (dxBotPeak - dxBotStart) * t;
        dxTop = dxTopStart + (dxTopPeak - dxTopStart) * t;
        opacity = 1;
        proximity = t;
      } else {
        const t = (p - PEAK_P) / (1 - PEAK_P);
        dy = dyPeak + (dyExit - dyPeak) * easeInOutCubic(t);
        dxBot = dxBotPeak;
        dxTop = dxTopPeak;
        opacity = clamp(1 - easeOutCubic(t * 1.25), 0, 1);
        proximity = 1 - t * 0.4;
      }

      // Top robotic hand — scroll-driven descent with subtle left drift
      handTop!.style.transform = `translate3d(${dxTop.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      handTop!.style.opacity = opacity.toFixed(3);

      // Human hand: scroll-mirrored vertical + progressive left drift
      const dyBot = -dy;
      handBot!.style.transform = `rotate(${BOT_NATURAL_ROTATION}deg) translate3d(${dxBot.toFixed(1)}px, ${dyBot.toFixed(1)}px, 0)`;

      if (meetLight) {
        // Account for bottom hand movement in meeting point calculation
        const liveHumanTipY = humanTipY + dyBot;
        const newTopY = sceneTopAbs + naturalTop + dy;
        const liveRoboTipY = newTopY + roboTipOffsetY;
        const liveRoboTipX = topRect.left + roboTipOffsetX;
        // Shift meeting light 4vw to the left
        const vw = window.innerWidth;
        const midX = (liveRoboTipX + humanTipX) / 2 - vw * 0.04;
        const midY = (liveRoboTipY + liveHumanTipY) / 2;
        meetLight.style.left = midX - rect.left + "px";
        meetLight.style.top = midY - rect.top + "px";
        const lightIntensity = clamp(Math.pow(proximity, 1.6), 0, 1) * 0.85;
        meetLight.style.opacity = lightIntensity.toFixed(3);
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("load", update);
    requestAnimationFrame(update);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", update);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="vf-hero-scene"
      id="vf-hero-scene"
    >
      {/* ═══ LAYER 0 — WebGL beam canvas (bottom) ═══ */}
      {/* Beam moved to page level for waterfall extension into Services */}

      {/* ═══ LAYER 1 — Starfield ═══ */}
      <div className="vf-stars" />

      {/* ═══ LAYER 2 — Floating particles ═══ */}
      <div className="vf-particles" ref={particleHostRef} />

      {/* ═══ LAYER 3 — Hands (above canvas, below UI) ═══ */}
      <div className="vf-hands" id="vf-hands">
        {/* Bottom human hand — static, bottom-right, reaching up */}
        <div className="vf-hand vf-hand--bottom" ref={handBotRef}>
          <Image
            src="/human-hand.png"
            alt=""
            width={460}
            height={612}
            draggable={false}
            className="vf-hand-img vf-hand-img--human"
            priority
          />
          <div className="vf-hand__fingertip" />
        </div>

        {/* Top robotic hand — scroll-driven descent */}
        <div className="vf-hand vf-hand--top" ref={handTopRef}>
          <Image
            src="/robotic-hand.png"
            alt=""
            width={620}
            height={724}
            draggable={false}
            className="vf-hand-img vf-hand-img--robot"
            priority
          />
          <div className="vf-hand__fingertip vf-hand__fingertip--robo" />
        </div>
      </div>

      {/* ═══ LAYER 4 — Meeting light glow ═══ */}
      <div className="vf-meeting-light" ref={meetLightRef} />

      {/* ═══ LAYER 5 — Existing UI (topmost, interactive) ═══ */}
      {/* Hidden: overlay card covering robot hand — revisit later */}
      <div className="vf-hero-overlay hidden">
        {/* Background decoration orbs from original hero */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-[var(--accent)]/20 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[var(--accent)]/15 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

        <div className="max-w-8xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-4 animate-slide-in-left">
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-5xl xl:text-6xl font-extrabold text-[var(--text-primary)] leading-tight">
                Autonomous Systems That Run Your Operations.{' '}
                <span className="animate-pulse-medium waterfall-gradient">
                  Without Scaling Your Team.
                </span>
              </h1>

              <div className="space-y-4">
                <div className="flex justify-start pt-4">
                  <div
                    className="text-[var(--accent)] font-bold text-sm uppercase tracking-wider bg-[var(--accent)]/10 pl-10 pr-6 py-3 rounded-r-2xl w-fit"
                    style={{
                      clipPath: 'polygon(1.2rem 50%, 0 0, 100% 0, 100% 100%, 0 100%)'
                    }}
                  >
                    Deploying for mid-scale companies in {location}
                  </div>
                </div>
                <p className="text-[var(--muted-foreground)] text-xl lg:text-2xl leading-relaxed max-w-3xl font-medium">
                  We design and ship multi-agent AI systems for mid-scale companies. Healthcare, finance, and cloud-native teams — autonomous workflows in weeks, not quarters.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-1">
              <MagneticButton
                as="a"
                href="/growth-plan"
                className="bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-10 py-4 rounded-full shadow-hover hover:shadow-glow transition-all duration-300 text-lg text-center cursor-pointer"
              >
                Get my growth plan
              </MagneticButton>
              <MagneticButton
                onClick={() => setIsQuoteOpen(true)}
                className="bg-[var(--card-background)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-primary)] font-semibold px-10 py-4 rounded-full transition-all duration-300 hover:bg-[var(--card-background)]/20 backdrop-blur-sm text-lg text-center cursor-pointer"
              >
                Start a project
              </MagneticButton>
            </div>
          </div>

          {/* Right Column - Spatial Bento */}
          <div className="bento-grid animate-slide-in-right parallax-layer" data-depth="1">
            <div className="bento-tile bento-tile--raised mouse-light bento-span-12 live-tile">
              <div className="live-tile__status">
                <span className="live-tile__dot" />
                Plans in flight
              </div>
              <div className="live-tile__metric">4,820</div>
              <div className="live-tile__delta">+12% this week</div>
              <div className="hairline-spark" aria-hidden="true" />
            </div>

            <div className="bento-tile bento-span-6 live-tile">
              <div className="live-tile__status">
                <span className="live-tile__dot" />
                Active agents
              </div>
              <div className="live-tile__metric">6</div>
              <div className="live-tile__list" aria-label="Active agent list">
                {['Architect', 'Designer', 'Backend', 'Validator', 'Marketing', 'Booking'].map((agent) => (
                  <span key={agent} className="live-tile__chip">{agent}</span>
                ))}
              </div>
            </div>

            <div className="bento-tile bento-tile--floating mouse-light bento-span-6 live-tile">
              <div className="live-tile__status">
                <span className="live-tile__dot" />
                Latest wireframe
              </div>
              <div className="rounded-2xl border border-[var(--ghost-border)] bg-[var(--surface-container-lowest)]/70 p-3">
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-3 h-16 rounded-xl bg-[var(--accent-mint)]/15" />
                  <div className="col-span-2 space-y-2">
                    <div className="h-3 rounded-full bg-[var(--text-primary)]/18" />
                    <div className="h-3 rounded-full bg-[var(--text-primary)]/10" />
                    <div className="h-8 rounded-xl bg-[var(--accent-teal)]/18" />
                  </div>
                </div>
              </div>
              <div className="live-tile__delta">Shipped 18 minutes ago</div>
            </div>
          </div>
          </div>
        </div>
      </div>

      <QuoteOverlay isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </section>
  );
};

export default HeroSection;
