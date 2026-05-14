"use client";

import { useRef, useEffect, useState } from "react";

/* ════════════════════════════════════════════════════════════════════
   useCounter — animates a number from 0 → target when in viewport.
   Extracted from the 13G Motion Analysis counter primitive.
   ════════════════════════════════════════════════════════════════════ */

interface UseCounterOptions {
  target: number;
  duration?: number;  // ms, default 1600
  prefix?: string;    // default ""
  suffix?: string;    // default ""
  decimals?: number;  // default 0
  threshold?: number; // IntersectionObserver threshold, default 0.3
}

export function useCounter({
  target,
  duration = 1600,
  prefix = "",
  suffix = "",
  decimals = 0,
  threshold = 0.3,
}: UseCounterOptions) {
  const ref = useRef<HTMLSpanElement>(null);
  const [animated, setAnimated] = useState(false);
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);
          io.unobserve(el);

          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = now - start;
            const p = Math.min(elapsed / duration, 1);
            // Cubic ease-out
            const eased = 1 - Math.pow(1 - p, 3);
            const current = eased * target;

            if (decimals > 0) {
              setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`);
            } else {
              setDisplay(`${prefix}${Math.round(current).toLocaleString()}${suffix}`);
            }

            if (p < 1) {
              requestAnimationFrame(tick);
            } else {
              // Ensure final value is exact
              if (decimals > 0) {
                setDisplay(`${prefix}${target.toFixed(decimals)}${suffix}`);
              } else {
                setDisplay(`${prefix}${target.toLocaleString()}${suffix}`);
              }
            }
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [target, duration, prefix, suffix, decimals, threshold, animated]);

  return { ref, display };
}
