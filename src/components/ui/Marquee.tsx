import React from "react";

export default function Marquee({
  children,
  speed = 22,
  variant = "logo",
}: {
  children: React.ReactNode;
  speed?: number;
  variant?: "logo" | "big";
}) {
  return (
    <div className={`vf-marquee vf-marquee--${variant}`}>
      <div
        className="vf-marquee__track"
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
