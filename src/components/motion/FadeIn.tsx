"use client";

import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type FadeInProps = {
  children: React.ReactNode;
  variant?: Variants;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "span";
};

export function FadeIn({ children, variant = fadeUp, className, delay = 0 }: FadeInProps) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={reduced ? "visible" : "hidden"}
      animate={inView || reduced ? "visible" : "hidden"}
      variants={variant}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={reduced ? "visible" : "hidden"}
      animate={inView || reduced ? "visible" : "hidden"}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}
