"use client";

import { motion } from "framer-motion";
import { scaleIn } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function ShieldScene() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="relative mx-auto aspect-square w-full max-w-[420px]"
      initial={reduced ? "visible" : "hidden"}
      animate="visible"
      variants={scaleIn}
      aria-hidden="true"
    >
      {/* Pedestal platform */}
      <div className="absolute inset-x-6 bottom-4 h-[26%] rounded-[2rem] glass-deep rotate-x-0" />
      <div className="absolute inset-x-14 bottom-0 h-[16%] rounded-[1.5rem] bg-gradient-to-br from-sky/40 to-brand/30 blur-[2px]" />

      {/* Glass shield */}
      <div className="anim-shield-glow absolute left-1/2 top-[6%] h-[68%] w-[62%] -translate-x-1/2">
        <div className="anim-float h-full w-full">
          <svg viewBox="0 0 200 220" className="h-full w-full">
            <defs>
              <linearGradient id="shieldFace" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="55%" stopColor="#dbeafe" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="shieldEdge" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
            {/* Outer rim */}
            <path
              d="M100 8 L176 36 V110 C176 160 146 194 100 212 C54 194 24 160 24 110 V36 Z"
              fill="url(#shieldEdge)"
              opacity="0.9"
            />
            {/* Glass face */}
            <path
              d="M100 18 L166 43 V108 C166 152 140 183 100 199 C60 183 34 152 34 108 V43 Z"
              fill="url(#shieldFace)"
            />
            {/* Highlight */}
            <path
              d="M100 18 L166 43 V80 C130 66 96 60 60 66 L60 46 Z"
              fill="#ffffff"
              opacity="0.55"
            />
            {/* Chart bars */}
            <rect x="68" y="118" width="16" height="44" rx="4" fill="url(#barGrad)" opacity="0.55" />
            <rect x="92" y="96" width="16" height="66" rx="4" fill="url(#barGrad)" opacity="0.75" />
            <rect x="116" y="72" width="16" height="90" rx="4" fill="url(#barGrad)" />
          </svg>
        </div>
      </div>

      {/* Orbit ring */}
      <div className="absolute left-1/2 top-[38%] h-[78%] w-[96%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky/40 [transform:rotateX(68deg)]" />
      <div className="absolute left-1/2 top-[38%] h-[62%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/25 [transform:rotateX(68deg)]" />

      {/* Floating orbs */}
      <div className="anim-float absolute left-[6%] top-[30%] h-6 w-6 rounded-full bg-gradient-to-br from-sky to-brand shadow-[0_0_20px_rgba(56,189,248,0.6)]" />
      <div className="anim-float-slow absolute right-[4%] top-[52%] h-8 w-8 rounded-full bg-gradient-to-br from-ice to-sky shadow-[0_0_24px_rgba(37,99,235,0.5)]" />
      <div className="anim-float absolute bottom-[18%] left-[22%] h-4 w-4 rounded-full bg-brand/70 [animation-delay:1.2s]" />
      <div className="anim-float-slow absolute right-[20%] top-[12%] h-3 w-3 rounded-full bg-sky/80 [animation-delay:0.6s]" />

      {/* Dot accents */}
      <div className="absolute left-[10%] top-[8%] flex gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="h-1 w-1 rounded-full bg-white/90" />
        ))}
      </div>
    </motion.div>
  );
}
