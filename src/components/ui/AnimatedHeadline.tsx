"use client";
import { useEffect, useRef, ElementType } from "react";

export default function AnimatedHeadline({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: string;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.unobserve(el);
        el.querySelectorAll<HTMLElement>(".vf-char").forEach((c, i) => {
          c.style.animation = `vf-char-rise .9s cubic-bezier(0.19,1,0.22,1) ${i * 30}ms forwards`;
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // @ts-expect-error – dynamic tag with forwarded ref is safe here
    <Tag ref={ref} className={className}>
      <span className="vf-char-mask">
        {[...children].map((ch, i) => (
          <span key={i} className="vf-char">
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </Tag>
  );
}
