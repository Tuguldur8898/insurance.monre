"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Phone, Globe } from "lucide-react";
import { staggerContainer, fadeUp, slideRight } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const ThreeBackground = dynamic(() => import("@/components/effects/ThreeBackground"), {
  ssr: false,
  loading: () => null,
});

type HeroProps = {
  heading?: string;
  tagline?: string;
};

export function HeroSection({
  heading = "INS.MONRE",
  tagline = "Таны дижитал ирээдүйг хамгаална",
}: HeroProps) {
  const reduced = useReducedMotion();

  return (
    <section className="hero-bg relative flex h-[calc(100dvh-64px)] flex-col overflow-hidden pt-24">
      <div className="starfield" aria-hidden="true" />
      {!reduced && <ThreeBackground />}

      <div className="relative mx-auto grid w-full max-w-[1200px] flex-1 items-center gap-12 px-6 md:grid-cols-2">
        <motion.div
          initial={reduced ? "visible" : "hidden"}
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky"
          >
            Digital Insurance Platform
          </motion.p>
          <motion.h1
            variants={slideRight}
            className="text-[clamp(2.75rem,6.5vw,5rem)] font-black leading-[1.02] tracking-tight text-white"
          >
            {heading}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-md text-xl leading-relaxed text-slate-300/80"
          >
            {tagline}
          </motion.p>
        </motion.div>

        <div className="hidden md:block" aria-hidden="true" />
      </div>

      {/* Contact chips at hero bottom */}
      <motion.div
        initial={reduced ? "visible" : "hidden"}
        animate="visible"
        variants={fadeUp}
        className="relative mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-8 px-6 pb-6"
      >
        <a
          href="tel:+97677779000"
          className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky text-navy-deep shadow-[0_0_20px_rgba(56,189,248,0.55)]">
            <Phone className="h-4 w-4" />
          </span>
          <span className="text-base font-semibold text-slate-200/85 group-hover:text-sky">
            +976 7777-9000
          </span>
        </a>
        <a
          href="https://ins.monre"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky text-navy-deep shadow-[0_0_20px_rgba(56,189,248,0.55)]">
            <Globe className="h-4 w-4" />
          </span>
          <span className="text-base font-semibold text-slate-200/85 group-hover:text-sky">
            ins.monre
          </span>
        </a>
      </motion.div>
    </section>
  );
}
