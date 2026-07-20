"use client";

import { motion } from "framer-motion";
import { Phone, Globe } from "lucide-react";
import { staggerContainer, fadeUp, slideRight } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { ShieldScene } from "@/components/effects/ShieldScene";

const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL ?? "https://insure.gerege.mn";

type HeroProps = {
  heading?: string;
  tagline?: string;
};

export function HeroSection({
  heading = "INSURE PLATFORM",
  tagline = "Таны дижитал ирээдүйг хамгаална",
}: HeroProps) {
  const reduced = useReducedMotion();

  return (
    <section className="hero-bg relative flex min-h-screen flex-col overflow-hidden pt-24">
      {/* Ambient glass shapes */}
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-[3rem] bg-white/50 blur-2xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-16 bottom-32 h-80 w-80 rounded-full bg-sky/20 blur-3xl" aria-hidden="true" />
      <div className="wave-layer" aria-hidden="true" />

      <div className="relative mx-auto grid w-full max-w-[1200px] flex-1 items-center gap-12 px-6 md:grid-cols-2">
        <motion.div
          initial={reduced ? "visible" : "hidden"}
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            variants={slideRight}
            className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-navy"
          >
            {heading}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-md text-xl leading-relaxed text-navy/60"
          >
            {tagline}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-6 flex gap-1.5" aria-hidden="true">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="h-1 w-1 rounded-full bg-navy/25" />
            ))}
          </motion.div>
        </motion.div>

        <ShieldScene />
      </div>

      {/* Contact chips at hero bottom */}
      <motion.div
        initial={reduced ? "visible" : "hidden"}
        animate="visible"
        variants={fadeUp}
        className="relative mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-8 px-6 pb-10"
      >
        <a
          href="tel:97670116240"
          className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky text-white shadow-[0_4px_16px_rgba(56,189,248,0.5)]">
            <Phone className="h-4.5 w-4.5" />
          </span>
          <span className="text-base font-semibold text-navy/80 group-hover:text-brand">
            976-7011-6240
          </span>
        </a>
        <a
          href={LOGIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky text-white shadow-[0_4px_16px_rgba(56,189,248,0.5)]">
            <Globe className="h-4.5 w-4.5" />
          </span>
          <span className="text-base font-semibold text-navy/80 group-hover:text-brand">
            insure.gerege.mn
          </span>
        </a>
      </motion.div>
    </section>
  );
}
