"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * useMouseLight — attaches a passive mousemove listener to `containerRef`
 * and updates CSS custom properties `--mouse-x` and `--mouse-y` on the
 * container so `.mouse-light::after` pseudo-elements can render a radial
 * glow that follows the cursor.
 *
 * Usage:
 *   const containerRef = useRef<HTMLDivElement>(null);
 *   useMouseLight(containerRef);
 *   return <div ref={containerRef} className="mouse-light">...</div>
 */
export function useMouseLight<T extends HTMLElement>(containerRef: React.RefObject<T | null>) {
  const rafRef = useRef<number | null>(null);
  const posRef = useRef({ x: 50, y: 50 });

  const update = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty("--mouse-x", `${posRef.current.x}%`);
    el.style.setProperty("--mouse-y", `${posRef.current.y}%`);
    rafRef.current = null;
  }, [containerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      posRef.current = { x, y };
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(update);
      }
    };

    el.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      el.removeEventListener("mousemove", handleMove);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [containerRef, update]);
}
