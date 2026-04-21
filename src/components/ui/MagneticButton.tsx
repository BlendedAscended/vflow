"use client";
import { useRef } from "react";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function MagneticButton({ children, className = "", ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const b = ref.current;
    if (!b) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const r = b.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    b.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <button
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`vf-btn-magnetic ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
