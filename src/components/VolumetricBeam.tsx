"use client";

import { useRef, useEffect } from "react";

/* ════════════════════════════════════════════════════════════════════
   <VolumetricBeam />
   ─────────────────
   Canvas-based volumetric light shaft with waterfall geometry,
   lava-lamp turbulence, dual-mode surge pulse, and Lava Fade
   extension into the next section.
   ════════════════════════════════════════════════════════════════════ */

interface VolumetricBeamProps {
  hue?: "mint" | "cyan" | "violet" | "amber";
  intensity?: number; // 0..1.5
  bottomSpread?: number; // fraction of viewport width at the base
  lavaOverlap?: number; // fraction of hero height extending into next section (0.25)
  style?: React.CSSProperties;
  className?: string;
}

export default function VolumetricBeam({
  hue = "mint",
  intensity = 1,
  bottomSpread = 0.95,
  lavaOverlap = 0.55,
  style,
  className = "",
}: VolumetricBeamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const PALETTES: Record<string, { core: number[]; glow: number[]; deep: number[]; haze: number[] }> = {
    mint: { core: [255, 255, 255], glow: [165, 214, 167], deep: [60, 140, 80], haze: [28, 70, 40] },
    cyan: { core: [255, 255, 255], glow: [111, 201, 255], deep: [28, 96, 160], haze: [14, 48, 88] },
    violet: { core: [255, 255, 255], glow: [167, 139, 250], deep: [80, 50, 170], haze: [40, 28, 90] },
    amber: { core: [255, 255, 255], glow: [251, 191, 36], deep: [180, 110, 20], haze: [60, 38, 8] },
  };

  const MUTED: Record<string, { glow: number[]; deep: number[] }> = {
    mint: { glow: [200, 235, 205], deep: [100, 170, 120] },
    cyan: { glow: [160, 220, 255], deep: [60, 130, 180] },
    violet: { glow: [200, 180, 255], deep: [110, 80, 190] },
    amber: { glow: [255, 220, 130], deep: [200, 140, 60] },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d", { alpha: true });
    if (!offCtx) return;

    let W = 0,
      H = 0,
      DPR = 1;
    const SCALE = 4;

    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      const heroH = window.innerHeight;
      H = Math.floor(heroH * (1 + lavaOverlap));
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      off.width = Math.max(120, Math.floor(W / SCALE));
      off.height = Math.max(180, Math.floor(H / SCALE));
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const t0 = performance.now();

    // ── Geometry constants ──
    const SHAFT_END = 0.42;
    const PLUME_END = 0.72;

    const render = (now: number) => {
      const time = (now - t0) / 1000;
      const palette = PALETTES[hue] || PALETTES.mint;
      const muted = MUTED[hue] || MUTED.mint;
      const { core, glow, deep, haze } = palette;
      const { glow: mGlow, deep: mDeep } = muted;

      const heroH = window.innerHeight;
      const totalH = heroH * (1 + lavaOverlap);
      const heroRatio = heroH / totalH;

      // ── Lava-lamp drift (very slow, organic) ──
      const drift = Math.sin(time * 0.15) * 0.8 + Math.sin(time * 0.07) * 1.2;
      const blobMod = Math.sin(time * 0.08) * 0.3;

      // ── Breathing waves ──
      const pulseSlow = 0.5 + 0.5 * Math.sin(time * 1.2);
      const pulseFast = 0.5 + 0.5 * Math.sin(time * 2.3 + 0.7);

      // ── Surge Pulse: dual mode (loop + bounce, blended randomly) ──
      const loopPos = (time * 0.08) % 1.0;
      const bouncePhase = (time * 0.08) % 2.0;
      const bouncePos = bouncePhase < 1.0 ? bouncePhase : 2.0 - bouncePhase;
      const modeBlend = Math.sin(time * 0.03 + Math.sin(time * 0.017) * 3.0) * 0.5 + 0.5;
      const pulsePos = loopPos * (1 - modeBlend) + bouncePos * modeBlend;
      const pulseFastBoost = pulsePos > 0.5 ? Math.pow((pulsePos - 0.5) / 0.5, 2) : 0;

      // PASS 1 — Render fog cone to the low-res offscreen
      const ow = off.width,
        oh = off.height;
      offCtx.clearRect(0, 0, ow, oh);
      offCtx.globalCompositeOperation = "lighter";

      const cx = ow / 2;
      const STRIDE = 1;

      for (let y = 0; y < oh; y += STRIDE) {
        // Normalized vertical position (0 = top, 1 = hero bottom)
        const t = Math.min((y / (oh - 1)) * (totalH / heroH), 1.0);

        // Lava Fade: 1.0 at hero bottom → 0.0 at end of overlap
        let lavaFade = 1.0;
        let fadeT = 0;
        if (y > oh * heroRatio) {
          fadeT = (y - oh * heroRatio) / (oh * (1 - heroRatio));
          lavaFade = 1.0 - Math.pow(fadeT, 1.8);
        }
        if (lavaFade < 0.005) continue;

        // ── Piecewise Cascade → Plume → Mega Cone ──
        let widthFrac: number;
        if (t < SHAFT_END) {
          widthFrac = 0.08 + (t / SHAFT_END) * 0.12; // 0.08 → 0.20
        } else if (t < PLUME_END) {
          const plumeT = (t - SHAFT_END) / (PLUME_END - SHAFT_END);
          widthFrac = 0.20 + Math.pow(plumeT, 2) * 0.12; // 0.20 → 0.32
        } else {
          const megaT = (t - PLUME_END) / (1.0 - PLUME_END);
          widthFrac = 0.32 + Math.pow(megaT, 1.4) * 0.08; // 0.32 → 0.40
        }

        const halfW = (ow * bottomSpread * widthFrac) / 2 + 1.2;
        const longProfile = Math.pow(t, 0.45) * (1 - 0.3 * Math.pow(t, 3));

        // ── Lava-lamp turbulence ──
        const n1 = Math.sin(t * 6.0 + time * 0.18 + drift);
        const n2 = Math.sin(t * 11.0 - time * 0.25);
        const n3 = Math.sin(t * 3.5 + time * 0.12 + drift * 1.5);
        const turbulenceBoost = 1.0 + t * 0.6;
        const noise = 0.4 + (0.28 * n1 + 0.18 * n2 + 0.22 * n3) * (1.0 + blobMod) * turbulenceBoost;

        // ── Surge pulse glow ──
        const pulseDist = t - pulsePos;
        const pulseGlow = Math.exp(-(pulseDist * pulseDist) / 0.006) * (1.0 + pulseFastBoost * 1.2);

        const alpha = Math.max(0, longProfile * noise) * intensity * (1.0 + pulseGlow * 0.7) * lavaFade;

        // ── Color shift to muted glow in overlap ──
        const f = Math.min(fadeT, 1.0);
        const r = glow[0] + (mGlow[0] - glow[0]) * f;
        const g = glow[1] + (mGlow[1] - glow[1]) * f;
        const b = glow[2] + (mGlow[2] - glow[2]) * f;
        const dr = deep[0] + (mDeep[0] - deep[0]) * f * 0.5;
        const dg = deep[1] + (mDeep[1] - deep[1]) * f * 0.5;
        const db = deep[2] + (mDeep[2] - deep[2]) * f * 0.5;

        const grad = offCtx.createLinearGradient(cx - halfW, 0, cx + halfW, 0);
        grad.addColorStop(0.0, `rgba(${haze[0]},${haze[1]},${haze[2]},${alpha * 0.0})`);
        grad.addColorStop(0.22, `rgba(${dr | 0},${dg | 0},${db | 0},${alpha * 0.49})`);
        grad.addColorStop(0.5, `rgba(${r | 0},${g | 0},${b | 0},${alpha * 1.0})`);
        grad.addColorStop(0.78, `rgba(${dr | 0},${dg | 0},${db | 0},${alpha * 0.49})`);
        grad.addColorStop(1.0, `rgba(${haze[0]},${haze[1]},${haze[2]},${alpha * 0.0})`);
        offCtx.fillStyle = grad;
        offCtx.fillRect(cx - halfW, y, halfW * 2, STRIDE);
      }

      // ── Pulse glow at beam center for core width in PASS 2 ──
      const midPulseDist = 0.3 - pulsePos;
      const pulseGlow = Math.exp(-(midPulseDist * midPulseDist) / 0.006) * (1.0 + pulseFastBoost * 1.2);

      // PASS 2 — Composite to main canvas
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      // (a) Atmospheric haze (extends full height, fades naturally)
      const hazeR = Math.max(W, heroH) * 0.75;
      const hazeG = ctx.createRadialGradient(
        W / 2,
        -hazeR * 0.15,
        0,
        W / 2,
        -hazeR * 0.15,
        hazeR
      );
      hazeG.addColorStop(0.0, `rgba(${glow[0]},${glow[1]},${glow[2]},${0.18 * intensity})`);
      hazeG.addColorStop(0.35, `rgba(${deep[0]},${deep[1]},${deep[2]},${0.12 * intensity})`);
      hazeG.addColorStop(0.65, `rgba(${haze[0]},${haze[1]},${haze[2]},${0.08 * intensity})`);
      hazeG.addColorStop(1.0, "rgba(0,0,0,0)");
      ctx.fillStyle = hazeG;
      ctx.fillRect(0, 0, W, H);

      // (b) Blit the volumetric fog buffer
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(off, 0, 0, W, H);

      // (c) Soft inner glow column (full height, fades in overlap zone)
      const innerW = 70 + pulseSlow * 18;
      const innerG = ctx.createLinearGradient(W / 2 - innerW, 0, W / 2 + innerW, 0);
      innerG.addColorStop(0.0, "rgba(0,0,0,0)");
      innerG.addColorStop(0.5, `rgba(${glow[0]},${glow[1]},${glow[2]},${0.35 * intensity})`);
      innerG.addColorStop(1.0, "rgba(0,0,0,0)");
      ctx.fillStyle = innerG;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(W / 2 - innerW, 0, innerW * 2, H);
      ctx.globalAlpha = 1.0;

      // (d) Sharp bright core (diffuses naturally into overlap)
      const coreW = 1.6 + pulseSlow * 1.0 + pulseFast * 0.5 + pulseGlow * 2.5;
      const coreOp = (0.85 + pulseFast * 0.15) * intensity;
      const coreG = ctx.createLinearGradient(0, 0, 0, H);
      coreG.addColorStop(0.0, "rgba(255,255,255,0)");
      coreG.addColorStop(Math.min(0.04, heroRatio * 0.5), `rgba(255,255,255,${coreOp})`);
      coreG.addColorStop(heroRatio * 0.4, `rgba(${core[0]},${core[1]},${core[2]},${coreOp})`);
      coreG.addColorStop(heroRatio * 0.8, `rgba(${core[0]},${core[1]},${core[2]},${coreOp * 0.85})`);
      coreG.addColorStop(heroRatio, `rgba(${glow[0]},${glow[1]},${glow[2]},${coreOp * 0.35})`);
      coreG.addColorStop(Math.min(heroRatio + 0.15, 0.98), `rgba(${glow[0]},${glow[1]},${glow[2]},${coreOp * 0.05})`);
      coreG.addColorStop(1.0, "rgba(0,0,0,0)");
      ctx.fillStyle = coreG;
      ctx.fillRect(W / 2 - coreW / 2, 0, coreW, H);

      // (e) Origin halo (launch flare synced to pulse, fades naturally)
      const launchBoost = pulsePos < 0.15 ? 1.0 - pulsePos / 0.15 : 0;
      const origR = 180 + pulseSlow * 35 + launchBoost * 60;
      const origG = ctx.createRadialGradient(W / 2, -10, 0, W / 2, -10, origR);
      origG.addColorStop(0.0, `rgba(255,255,255,${0.9 * intensity})`);
      origG.addColorStop(0.08, `rgba(${core[0]},${core[1]},${core[2]},${0.75 * intensity})`);
      origG.addColorStop(0.22, `rgba(${glow[0]},${glow[1]},${glow[2]},${0.55 * intensity})`);
      origG.addColorStop(0.55, `rgba(${deep[0]},${deep[1]},${deep[2]},${0.18 * intensity})`);
      origG.addColorStop(1.0, "rgba(0,0,0,0)");
      ctx.fillStyle = origG;
      ctx.fillRect(0, 0, W, H);

      // (f) Landing pool at hero bottom (intensifies on pulse landing)
      const landingBoost = pulsePos > 0.85 ? (pulsePos - 0.85) / 0.15 : 0;
      const poolIntensity = (0.4 + landingBoost * 0.35) * intensity;
      const poolR = W * 0.55;
      const poolY = H * heroRatio * 1.02;
      const poolG = ctx.createRadialGradient(W / 2, poolY, 0, W / 2, poolY, poolR);
      poolG.addColorStop(0.0, `rgba(${glow[0]},${glow[1]},${glow[2]},${poolIntensity})`);
      poolG.addColorStop(0.3, `rgba(${deep[0]},${deep[1]},${deep[2]},${poolIntensity * 0.5})`);
      poolG.addColorStop(0.7, `rgba(${haze[0]},${haze[1]},${haze[2]},${poolIntensity * 0.25})`);
      poolG.addColorStop(1.0, "rgba(0,0,0,0)");
      ctx.fillStyle = poolG;
      ctx.fillRect(0, H * heroRatio * 0.7, W, H * (1 - heroRatio) + H * heroRatio * 0.3);

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [hue, intensity, bottomSpread, lavaOverlap]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={style}
    />
  );
}
