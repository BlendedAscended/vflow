"use client";

import { useRef, useEffect } from "react";

/* ════════════════════════════════════════════════════════════════════
   <VolumetricBeam />
   ─────────────────
   Canvas-based volumetric light shaft. Renders to a low-res offscreen
   buffer to fake light-scattering through fog (browser bilinear upscale
   = free volumetric blur), then composites a sharp core, origin halo,
   and landing pool with additive ("lighter") blending.
   ════════════════════════════════════════════════════════════════════ */

interface VolumetricBeamProps {
  hue?: "mint" | "cyan" | "violet" | "amber";
  intensity?: number;    // 0..1.5
  bottomSpread?: number; // fraction of viewport width at the base
  className?: string;
}

export default function VolumetricBeam({
  hue = "mint",
  intensity = 1,
  bottomSpread = 0.95,
  className = "",
}: VolumetricBeamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const PALETTES: Record<string, { core: number[]; glow: number[]; deep: number[]; haze: number[] }> = {
    mint:   { core: [255, 255, 255], glow: [165, 214, 167], deep: [60, 140, 80],  haze: [28, 70, 40]  },
    cyan:   { core: [255, 255, 255], glow: [111, 201, 255], deep: [28, 96, 160],  haze: [14, 48, 88]  },
    violet: { core: [255, 255, 255], glow: [167, 139, 250], deep: [80, 50, 170],  haze: [40, 28, 90]  },
    amber:  { core: [255, 255, 255], glow: [251, 191, 36],  deep: [180, 110, 20], haze: [60, 38, 8]   },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Offscreen buffer for the volumetric cone
    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d", { alpha: true });
    if (!offCtx) return;

    let W = 0, H = 0, DPR = 1;
    const SCALE = 4; // offscreen is 1/SCALE the resolution

    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
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

    const render = (now: number) => {
      const time = (now - t0) / 1000;
      const palette = PALETTES[hue] || PALETTES.mint;
      const { core, glow, deep, haze } = palette;

      // Breathing waves
      const pulseSlow = 0.5 + 0.5 * Math.sin(time * 1.2);
      const pulseFast = 0.5 + 0.5 * Math.sin(time * 2.3 + 0.7);
      const drift = Math.sin(time * 0.6) * 0.7 + Math.sin(time * 1.7) * 0.4;

      // PASS 1 — Render fog cone to the low-res offscreen
      const ow = off.width, oh = off.height;
      offCtx.clearRect(0, 0, ow, oh);
      offCtx.globalCompositeOperation = "lighter";

      const cx = ow / 2;
      const STRIDE = 1;
      for (let y = 0; y < oh; y += STRIDE) {
        const t = y / (oh - 1);
        const widthFrac = Math.pow(t, 0.85);
        const halfW = (ow * bottomSpread * widthFrac) / 2 + 1.2;
        const longProfile = Math.pow(t, 0.45) * (1 - 0.30 * Math.pow(t, 3));
        const n1 = Math.sin(t * 14.0 + time * 0.55 + drift);
        const n2 = Math.sin(t * 27.0 - time * 0.85);
        const n3 = Math.sin(t * 6.3 + time * 0.30 + drift * 0.5);
        const noise = 0.55 + 0.25 * n1 * 0.6 + 0.12 * n2 + 0.18 * n3 * 0.7;
        const alpha = Math.max(0, longProfile * noise) * intensity;

        const grad = offCtx.createLinearGradient(cx - halfW, 0, cx + halfW, 0);
        const aEdge = alpha * 0.0;
        const aMid = alpha * 0.65;
        const aHot = alpha * 1.0;
        grad.addColorStop(0.00, `rgba(${haze[0]},${haze[1]},${haze[2]},${aEdge})`);
        grad.addColorStop(0.22, `rgba(${deep[0]},${deep[1]},${deep[2]},${aMid * 0.7})`);
        grad.addColorStop(0.50, `rgba(${glow[0]},${glow[1]},${glow[2]},${aHot})`);
        grad.addColorStop(0.78, `rgba(${deep[0]},${deep[1]},${deep[2]},${aMid * 0.7})`);
        grad.addColorStop(1.00, `rgba(${haze[0]},${haze[1]},${haze[2]},${aEdge})`);
        offCtx.fillStyle = grad;
        offCtx.fillRect(cx - halfW, y, halfW * 2, STRIDE);
      }

      // PASS 2 — Composite to main canvas
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      // (a) Atmospheric haze
      const hazeR = Math.max(W, H) * 0.75;
      const hazeG = ctx.createRadialGradient(W / 2, -hazeR * 0.15, 0, W / 2, -hazeR * 0.15, hazeR);
      hazeG.addColorStop(0.00, `rgba(${glow[0]},${glow[1]},${glow[2]},${0.18 * intensity})`);
      hazeG.addColorStop(0.35, `rgba(${deep[0]},${deep[1]},${deep[2]},${0.12 * intensity})`);
      hazeG.addColorStop(0.65, `rgba(${haze[0]},${haze[1]},${haze[2]},${0.08 * intensity})`);
      hazeG.addColorStop(1.00, "rgba(0,0,0,0)");
      ctx.fillStyle = hazeG;
      ctx.fillRect(0, 0, W, H);

      // (b) Blit the volumetric fog buffer
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(off, 0, 0, W, H);

      // (c) Soft inner glow column
      const innerW = 70 + pulseSlow * 18;
      const innerG = ctx.createLinearGradient(W / 2 - innerW, 0, W / 2 + innerW, 0);
      innerG.addColorStop(0.00, "rgba(0,0,0,0)");
      innerG.addColorStop(0.50, `rgba(${glow[0]},${glow[1]},${glow[2]},${0.35 * intensity})`);
      innerG.addColorStop(1.00, "rgba(0,0,0,0)");
      ctx.fillStyle = innerG;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(W / 2 - innerW, 0, innerW * 2, H);
      ctx.globalAlpha = 1;

      // (d) Sharp bright core
      const coreW = 1.6 + pulseSlow * 1.0 + pulseFast * 0.5;
      const coreOp = (0.85 + pulseFast * 0.15) * intensity;
      const coreG = ctx.createLinearGradient(0, 0, 0, H);
      coreG.addColorStop(0.00, "rgba(255,255,255,0)");
      coreG.addColorStop(0.04, `rgba(255,255,255,${coreOp})`);
      coreG.addColorStop(0.40, `rgba(${core[0]},${core[1]},${core[2]},${coreOp})`);
      coreG.addColorStop(0.80, `rgba(${core[0]},${core[1]},${core[2]},${coreOp * 0.85})`);
      coreG.addColorStop(1.00, `rgba(${glow[0]},${glow[1]},${glow[2]},${coreOp * 0.35})`);
      ctx.fillStyle = coreG;
      ctx.fillRect(W / 2 - coreW / 2, 0, coreW, H);

      // (e) Origin halo
      const origR = 180 + pulseSlow * 35;
      const origG = ctx.createRadialGradient(W / 2, -10, 0, W / 2, -10, origR);
      origG.addColorStop(0.00, `rgba(255,255,255,${0.90 * intensity})`);
      origG.addColorStop(0.08, `rgba(${core[0]},${core[1]},${core[2]},${0.75 * intensity})`);
      origG.addColorStop(0.22, `rgba(${glow[0]},${glow[1]},${glow[2]},${0.55 * intensity})`);
      origG.addColorStop(0.55, `rgba(${deep[0]},${deep[1]},${deep[2]},${0.18 * intensity})`);
      origG.addColorStop(1.00, "rgba(0,0,0,0)");
      ctx.fillStyle = origG;
      ctx.fillRect(0, 0, W, H);

      // (f) Landing pool
      const poolR = W * 0.55;
      const poolG = ctx.createRadialGradient(W / 2, H * 1.02, 0, W / 2, H * 1.02, poolR);
      poolG.addColorStop(0.00, `rgba(${glow[0]},${glow[1]},${glow[2]},${0.40 * intensity})`);
      poolG.addColorStop(0.30, `rgba(${deep[0]},${deep[1]},${deep[2]},${0.20 * intensity})`);
      poolG.addColorStop(0.70, `rgba(${haze[0]},${haze[1]},${haze[2]},${0.10 * intensity})`);
      poolG.addColorStop(1.00, "rgba(0,0,0,0)");
      ctx.fillStyle = poolG;
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [hue, intensity, bottomSpread]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
}
