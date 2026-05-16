"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

/* ════════════════════════════════════════════════════════════════════
   <ServicesHoverReveal />
   WebGL circuit-board hover background + Pac-Man wanderer.

   The shader renders a cursor-following circuit glow. After 1 s of
   hover a Pac-Man character spawns and wanders the 56 px grid. It is
   only visible inside the glow radius, chomps as it moves, and
   "eats" the circuit lines (temporarily clears them). It naturally
   occludes behind service cards (z-index below content) and re-appears
   when it emerges from the other side.
   ════════════════════════════════════════════════════════════════════ */

interface ServicesHoverRevealProps {
  className?: string;
  accentColor?: string;
}

export default function ServicesHoverReveal({
  className = "",
  accentColor = "#A5D6A7",
}: ServicesHoverRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pacManRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) {
      console.warn("[ServicesHoverReveal] missing canvas or wrap ref");
      return;
    }

    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.OrthographicCamera;
    let mat: THREE.ShaderMaterial;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const wrapRect = wrap.getBoundingClientRect();
    console.log("[ServicesHoverReveal] init — wrap size:", wrapRect.width, "x", wrapRect.height);

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x000000, 0);
      console.log("[ServicesHoverReveal] Three.js renderer created");
    } catch (err) {
      console.error("[ServicesHoverReveal] WebGL init failed:", err);
      return;
    }

    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const vertShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `;

    const accentR = parseInt(accentColor.slice(1, 3), 16) / 255;
    const accentG = parseInt(accentColor.slice(3, 5), 16) / 255;
    const accentB = parseInt(accentColor.slice(5, 7), 16) / 255;

    const fragShader = `
      precision highp float;
      varying vec2 vUv;
      uniform vec2  uResolution;
      uniform vec2  uMouse;
      uniform float uTime;
      uniform float uHover;
      uniform float uRadiusPx;
      uniform vec3  uAccent;
      uniform vec2  uPacManPos;
      uniform float uPacManActive;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float gridLayer(vec2 uv, float cell, float thickness) {
        vec2 g = abs(fract(uv / cell - 0.5) - 0.5) / fwidth(uv / cell);
        float line = min(g.x, g.y);
        return 1.0 - smoothstep(0.0, thickness, line);
      }

      float dots(vec2 uv, float cell, float radius) {
        vec2 id = floor(uv / cell);
        vec2 c  = (id + 0.5) * cell;
        float d = length(uv - c);
        float keep = step(0.4, hash(id));
        return keep * smoothstep(radius, radius * 0.4, d);
      }

      float traces(vec2 uv, float cell) {
        vec2 id = floor(uv / cell);
        vec2 f  = fract(uv / cell) - 0.5;
        float r = hash(id);
        float seg;
        if (r < 0.5) {
          seg = (1.0 - smoothstep(0.0, 0.04, abs(f.y))) * step(abs(f.x), 0.5);
        } else {
          seg = (1.0 - smoothstep(0.0, 0.04, abs(f.x))) * step(abs(f.y), 0.5);
        }
        return seg * step(0.55, hash(id + 17.0));
      }

      void main() {
        vec2 fragPx = vUv * uResolution;
        vec2 mousePx = uMouse * uResolution;

        // Circuit pattern
        float gA = gridLayer(fragPx, 56.0, 1.4);
        float gB = gridLayer(fragPx, 14.0, 1.0) * 0.45;
        float pts = dots(fragPx, 56.0, 3.0);
        float trc = traces(fragPx, 56.0) * 0.55;

        float scan = 0.5 + 0.5 * sin(uTime * 0.8 + fragPx.y * 0.01);
        float revealField = gA + gB + pts * 1.4 + trc;
        revealField *= mix(0.85, 1.15, scan);

        // Pac-Man eat effect — temporarily clears circuit
        if (uPacManActive > 0.5) {
          float dPac = distance(fragPx, uPacManPos);
          float eatMask = 1.0 - smoothstep(0.0, 18.0, dPac);
          revealField *= (1.0 - eatMask * 0.92);
        }

        // Radial mask with pulse
        float pulseR = 1.0 + 0.06 * sin(uTime * 1.6);
        float pulseI = 0.85 + 0.15 * sin(uTime * 2.2);
        float r = uRadiusPx * pulseR;
        float dPx = distance(fragPx, mousePx);

        float mask = 1.0 - smoothstep(r * 0.15, r, dPx);
        mask = pow(mask, 1.35) * pulseI * uHover;

        // Outer halo
        float halo = 1.0 - smoothstep(r * 0.4, r * 1.9, dPx);
        halo = pow(halo, 2.5) * 0.25 * uHover;

        // Only output color where mask/halo is active. Base is transparent.
        vec3 col = uAccent * revealField * mask + uAccent * halo * 0.35;
        float alpha = max(mask * 0.85, halo * 0.25);

        // Film grain
        float n = (hash(fragPx + uTime) - 0.5) * 0.015;
        col += n * alpha;

        gl_FragColor = vec4(col, alpha);
      }
    `;

    mat = new THREE.ShaderMaterial({
      vertexShader: vertShader,
      fragmentShader: fragShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uResolution: { value: new THREE.Vector2(1, 1) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0 },
        uHover: { value: 0 },
        uRadiusPx: { value: 240 },
        uAccent: { value: new THREE.Vector3(accentR, accentG, accentB) },
        uPacManPos: { value: new THREE.Vector2(-1000, -1000) },
        uPacManActive: { value: 0 },
      },
    });

    const geom = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geom, mat));

    let raf = 0;
    let targetMouse = new THREE.Vector2(0.5, 0.5);
    let smoothMouse = new THREE.Vector2(0.5, 0.5);
    let targetHover = 0;
    let smoothHover = 0;

    // ── Pac-Man state ──────────────────────────────────────────────
    const GRID = 56;
    const PAC_SIZE = 24;
    const PAC_HALF = PAC_SIZE / 2;

    interface PacManState {
      active: boolean;
      px: number; // CSS px from left
      py: number; // CSS px from top (downward)
      dir: number; // 0: right, 1: down, 2: left, 3: up
      speed: number; // CSS px / sec
      mouthPhase: number;
    }

    const pac: PacManState = {
      active: false,
      px: 0,
      py: 0,
      dir: 0,
      speed: 84,
      mouthPhase: 0,
    };

    const spawnPacMan = () => {
      const r = wrap.getBoundingClientRect();
      // Start at a random grid intersection near the center
      pac.px = Math.max(GRID, Math.min(r.width - GRID, Math.round((r.width / 2) / GRID) * GRID));
      pac.py = Math.max(GRID, Math.min(r.height - GRID, Math.round((r.height / 2) / GRID) * GRID));
      pac.dir = [0, 1, 2, 3][Math.floor(Math.random() * 4)];
      pac.active = true;
      mat.uniforms.uPacManActive.value = 1;
      if (pacManRef.current) {
        pacManRef.current.style.opacity = "1";
      }
    };

    const updatePacMan = (dt: number) => {
      if (!pac.active) return;

      const r = wrap.getBoundingClientRect();
      const step = pac.speed * dt;

      // Move along current direction
      if (pac.dir === 0) pac.px += step;
      else if (pac.dir === 1) pac.py += step;
      else if (pac.dir === 2) pac.px -= step;
      else if (pac.dir === 3) pac.py -= step;

      // Bounce off walls / seam edges
      if (pac.px < PAC_HALF) {
        pac.px = PAC_HALF;
        pac.dir = 0;
      } else if (pac.px > r.width - PAC_HALF) {
        pac.px = r.width - PAC_HALF;
        pac.dir = 2;
      }

      if (pac.py < PAC_HALF) {
        pac.py = PAC_HALF;
        pac.dir = 1;
      } else if (pac.py > r.height - PAC_HALF) {
        pac.py = r.height - PAC_HALF;
        pac.dir = 3;
      }

      // Snap to nearest grid intersection
      const nearestX = Math.round(pac.px / GRID) * GRID;
      const nearestY = Math.round(pac.py / GRID) * GRID;
      const distToGrid = Math.hypot(pac.px - nearestX, pac.py - nearestY);

      if (distToGrid < step * 0.6) {
        pac.px = nearestX;
        pac.py = nearestY;

        // Pick a new direction (exclude 180 reversal)
        const opposite = (pac.dir + 2) % 4;
        let choices = [0, 1, 2, 3].filter((d) => d !== opposite);
        pac.dir = choices[Math.floor(Math.random() * choices.length)];
      }

      // Update shader eat position (physical pixels, shader Y flipped)
      const shaderX = pac.px * dpr;
      const shaderY = (r.height - pac.py) * dpr;
      mat.uniforms.uPacManPos.value.set(shaderX, shaderY);

      // Update DOM position + rotation
      if (pacManRef.current) {
        pacManRef.current.style.transform = `translate(${pac.px - PAC_HALF}px, ${pac.py - PAC_HALF}px) rotate(${pac.dir * 90}deg)`;
      }
    };

    // ── Event handlers ─────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = 1.0 - (e.clientY - r.top) / r.height;
      targetMouse.set(x, y);
      targetHover = 1;
    };

    const onLeave = () => {
      targetHover = 0;
    };

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      mat.uniforms.uResolution.value.set(r.width * dpr, r.height * dpr);
      const radius = Math.max(180, Math.min(360, Math.min(r.width, r.height) * 0.28));
      mat.uniforms.uRadiusPx.value = radius * dpr;
    };

    let lastTime = performance.now();

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap delta
      lastTime = now;

      smoothMouse.lerp(targetMouse, 0.08);
      smoothHover += (targetHover - smoothHover) * 0.06;

      mat.uniforms.uMouse.value.copy(smoothMouse);
      mat.uniforms.uHover.value = smoothHover;
      mat.uniforms.uTime.value = now / 1000;

      updatePacMan(dt);

      renderer.render(scene, camera);
    };

    resize();
    spawnPacMan();
    const host = wrap.parentElement ?? wrap;
    host.addEventListener("mousemove", onMove);
    host.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("mousemove", onMove);
      host.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
      renderer.dispose();
    };
  }, [accentColor]);

  return (
    <div ref={wrapRef} className={className}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />
      <div
        ref={pacManRef}
        aria-hidden="true"
        className="pointer-events-none"
        style={{
          position: "absolute",
          width: 24,
          height: 24,
          zIndex: 5,
          opacity: 0,
          transition: "opacity 0.15s ease",
          willChange: "transform, opacity",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "#FFEB3B",
            boxShadow: "0 0 6px rgba(255,235,59,0.6)",
            animation: "pacChomp 0.25s infinite alternate",
          }}
        />
      </div>
      <style>{`
        @keyframes pacChomp {
          0% {
            clip-path: polygon(
              50% 50%,
              100% 35%,
              100% 0%,
              0% 0%,
              0% 100%,
              100% 100%,
              100% 65%
            );
          }
          100% {
            clip-path: polygon(
              50% 50%,
              100% 50%,
              100% 0%,
              0% 0%,
              0% 100%,
              100% 100%,
              100% 50%
            );
          }
        }
      `}</style>
    </div>
  );
}
