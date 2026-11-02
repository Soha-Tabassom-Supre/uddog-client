"use client";

import React, { useRef } from "react";

interface HeroSpotlightProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroSpotlight({
  children,
  className = "",
}: HeroSpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    container.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
    container.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`hero-spotlight relative isolate ${className}`}
    >
      <div
        aria-hidden="true"
        className="hero-spotlight__glow pointer-events-none absolute inset-0"
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
