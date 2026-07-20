"use client";

import { motion } from "framer-motion";
import { ArrowRight, LogIn } from "lucide-react";
import { Link } from "@/i18n/navigation";
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
    <section className="hero-bg relative flex min-h-screen items-center overflow-hidden pt-24">
      {/* Ambient glass shapes */}
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-[3rem] bg-white/50 blur-2xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-16 bottom-32 h-80 w-80 rounded-full bg-sky/20 blur-3xl" aria-hidden="true" />
      <div className="wave-layer" aria-hidden="true" />

      <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-12 px-6 pb-24 md:grid-cols-2">
        <motion.div
          initial={reduced ? "visible" : "hidden"}
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand"
          >
            Monre Insurance
          </motion.p>
          <motion.h1
            variants={slideRight}
            className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-navy"
          >
            {heading}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-md text-lg leading-relaxed text-navy/70"
          >
            {tagline}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href={LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-base font-bold text-white transition-all duration-200 hover:scale-[1.03] hover:bg-brand-dark"
            >
              <LogIn className="h-5 w-5" />
              Нэвтрэх
            </a>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-white/60 px-8 py-3.5 text-base font-bold text-navy backdrop-blur transition-all duration-200 hover:border-brand hover:text-brand"
            >
              Дэлгэрэнгүй
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>

        <ShieldScene />
      </div>
    </section>
  );
}
