"use client";

import { useRef, useCallback, forwardRef } from "react";

/* ════════════════════════════════════════════════════════════════════
   <MagneticButton />
   Wraps any button/link. On hover the element translates toward the
   cursor position with an ease-out-expo cadence (0.3x pull strength).
   On leave it snaps back with a spring.
   ════════════════════════════════════════════════════════════════════ */

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  pullStrength?: number;  // 0..1, default 0.3
  transitionDuration?: string; // default "500ms"
  as?: "button" | "a" | "div";
  href?: string;
  onClick?: () => void;
}

const MagneticButtonInner = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  MagneticButtonProps
>(function MagneticButtonInner(
  {
    children,
    className = "",
    pullStrength = 0.3,
    transitionDuration = "500ms",
    as: Tag = "button",
    href,
    onClick,
  },
  forwardedRef
) {
  const internalRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  // Merge forwarded ref with internal ref
  const setRef = useCallback(
    (el: HTMLButtonElement | HTMLAnchorElement | null) => {
      internalRef.current = el;
      if (typeof forwardedRef === "function") {
        forwardedRef(el);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<typeof el | null>).current = el;
      }
    },
    [forwardedRef]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const el = internalRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * pullStrength}px, ${y * pullStrength}px)`;
    },
    [pullStrength]
  );

  const onPointerLeave = useCallback(() => {
    const el = internalRef.current;
    if (!el) return;
    el.style.transition = `transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
    el.style.transform = "";
    requestAnimationFrame(() => {
      el.style.transition = `transform ${transitionDuration} cubic-bezier(0.16, 1, 0.3, 1)`;
    });
  }, [transitionDuration]);

  const sharedProps = {
    ref: setRef,
    className,
    onPointerMove,
    onPointerLeave,
    style: {
      transition: `transform ${transitionDuration} cubic-bezier(0.16, 1, 0.3, 1)`,
      willChange: "transform",
    } as React.CSSProperties,
  };

  if (Tag === "a") {
    return (
      <a {...sharedProps} href={href} onClick={onClick ? onClick : undefined}>
        {children}
      </a>
    );
  }

  return (
    <button {...sharedProps} type="button" onClick={onClick}>
      {children}
    </button>
  );
});

export default MagneticButtonInner;
