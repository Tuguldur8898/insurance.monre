"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { fadeUp, cardHover } from "@/lib/motion";
import { GlassCard } from "@/components/effects/GlassCard";

type StatsCardProps = {
  icon: LucideIcon;
  value: string;
  label: string;
  text: string;
};

export function StatsCard({ icon: Icon, value, label, text }: StatsCardProps) {
  return (
    <motion.div variants={fadeUp} initial="rest" whileHover="hover" animate="rest">
      <motion.div variants={cardHover}>
        <GlassCard deep className="flex h-full flex-col gap-3 p-7">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky to-brand text-white shadow-[0_8px_24px_rgba(37,99,235,0.35)]">
            <Icon className="h-6 w-6" />
          </span>
          <span className="text-3xl font-extrabold tracking-tight text-navy">{value}</span>
          <span className="text-sm font-bold text-brand">{label}</span>
          <p className="text-sm leading-relaxed text-navy/65">{text}</p>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
