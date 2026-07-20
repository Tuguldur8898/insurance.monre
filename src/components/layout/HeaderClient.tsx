"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CmsMenuItem } from "@/lib/cms";

export function HeaderClient({ items }: { items: CmsMenuItem[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass py-3" : "bg-transparent py-5"
      )}
    >
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.45)]">
            <Image src="/logo.jpg" alt="ins.monre logo" fill sizes="40px" className="object-cover" priority />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white">
            INS<span className="text-sky">.MONRE</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <Link
              key={item._id}
              href={item.url ?? "/"}
              className="text-sm font-semibold text-slate-200/80 transition-colors hover:text-sky"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="btn-glow rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.03] hover:bg-brand-dark"
          >
            Нэвтрэх
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Цэс нээх"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="glass mx-4 mt-2 overflow-hidden rounded-2xl md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {items.map((item) => (
                <Link
                  key={item._id}
                  href={item.url ?? "/"}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-semibold text-slate-100 transition-colors hover:bg-white/10"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-brand px-4 py-3 text-center text-base font-bold text-white"
              >
                Нэвтрэх
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
