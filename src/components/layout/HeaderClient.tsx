"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Menu, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CmsMenuItem } from "@/lib/cms";

const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL ?? "https://insure.gerege.mn";

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
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky to-brand text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)]">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-navy">
            MONRE <span className="text-brand">INSURANCE</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <Link
              key={item._id}
              href={item.url ?? "/"}
              className="text-sm font-semibold text-navy/80 transition-colors hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={LOGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.03] hover:bg-brand-dark"
          >
            Нэвтрэх
          </a>
        </nav>

        <button
          type="button"
          aria-label="Цэс нээх"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-navy md:hidden"
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
                  className="rounded-xl px-4 py-3 text-base font-semibold text-navy transition-colors hover:bg-ice"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={LOGIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 rounded-full bg-brand px-4 py-3 text-center text-base font-bold text-white"
              >
                Нэвтрэх
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
