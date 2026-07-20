"use client";

import { motion } from "framer-motion";
import { scaleIn } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const DOTS: { cx: number; cy: number; r: number; o: number }[] = [];
const R = 130;
for (let lat = -75; lat <= 75; lat += 15) {
  const latRad = (lat * Math.PI) / 180;
  const ringR = R * Math.cos(latRad);
  const y = R * Math.sin(latRad);
  const count = Math.max(6, Math.round(26 * Math.cos(latRad)));
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    DOTS.push({
      cx: 150 + ringR * Math.cos(a),
      cy: 150 + y + ringR * 0.28 * Math.sin(a),
      r: 1.1 + Math.random() * 1.1,
      o: 0.25 + Math.random() * 0.6,
    });
  }
}

export function GlobeScene() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="relative mx-auto aspect-square w-full max-w-[480px]"
      initial={reduced ? "visible" : "hidden"}
      animate="visible"
      variants={scaleIn}
      aria-hidden="true"
    >
      {/* Core glow */}
      <div className="anim-glow-pulse absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.5),rgba(56,189,248,0.15)_55%,transparent_75%)] blur-2xl" />

      {/* Particle globe */}
      <svg viewBox="0 0 300 300" className="relative h-full w-full">
        <defs>
          <radialGradient id="dotGrad" cx="0.35" cy="0.35" r="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#2563eb" />
          </radialGradient>
          <linearGradient id="swooshGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        {DOTS.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="url(#dotGrad)" opacity={d.o} />
        ))}
        {/* Swoosh arc */}
        <ellipse
          cx="150"
          cy="155"
          rx="128"
          ry="44"
          fill="none"
          stroke="url(#swooshGrad)"
          strokeWidth="2.5"
          strokeDasharray="340 460"
          strokeLinecap="round"
          transform="rotate(-18 150 155)"
        />
        <ellipse
          cx="150"
          cy="150"
          rx="138"
          ry="52"
          fill="none"
          stroke="#38bdf8"
          strokeOpacity="0.18"
          strokeWidth="1"
          transform="rotate(-18 150 150)"
        />
      </svg>

      {/* Orbiting bright nodes */}
      <div className="anim-float absolute left-[12%] top-[24%] h-2.5 w-2.5 rounded-full bg-sky shadow-[0_0_16px_rgba(56,189,248,0.9)]" />
      <div className="anim-float-slow absolute right-[10%] top-[58%] h-3 w-3 rounded-full bg-brand shadow-[0_0_18px_rgba(59,130,246,0.9)]" />
      <div className="anim-float absolute bottom-[16%] left-[30%] h-2 w-2 rounded-full bg-sky/80 shadow-[0_0_12px_rgba(56,189,248,0.8)] [animation-delay:1.2s]" />
      <div className="anim-float-slow absolute right-[26%] top-[10%] h-1.5 w-1.5 rounded-full bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.8)] [animation-delay:0.6s]" />
    </motion.div>
  );
}
