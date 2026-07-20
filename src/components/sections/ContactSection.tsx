import { Phone, Globe, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { FadeIn } from "@/components/motion/FadeIn";
import { GlassCard } from "@/components/effects/GlassCard";

const CONTACTS = [
  { icon: Phone, label: "Утас", value: "976-7011-6240", href: "tel:97670116240" },
  { icon: Globe, label: "Вэб", value: "insure.gerege.mn", href: "https://insure.gerege.mn" },
];

export function ContactSection() {
  return (
    <section className="relative py-24">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <FadeIn>
          <GlassCard deep className="relative overflow-hidden p-10 md:p-14">
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky/20 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-lg">
                <p className="text-xs font-bold uppercase tracking-widest text-brand">Холбоо барих</p>
                <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold tracking-tight text-navy">
                  Бидэнтэй холбогдоорой
                </h2>
                <p className="mt-3 text-base leading-relaxed text-navy/70">
                  Асуулт, санал, хүсэлтээ бидэнд ирүүлээрэй. Манай баг танд туслахдаа үргэлж бэлэн.
                </p>
              </div>
              <div className="flex w-full flex-col gap-4 sm:w-auto sm:min-w-[280px]">
                {CONTACTS.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 rounded-2xl glass px-5 py-4 transition-all duration-200 hover:scale-[1.02]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky to-brand text-white">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-navy/50">
                        {c.label}
                      </span>
                      <span className="block text-base font-bold text-navy group-hover:text-brand">
                        {c.value}
                      </span>
                    </span>
                  </a>
                ))}
                <Link
                  href="/contact"
                  className="btn-glow inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.03] hover:bg-brand-dark"
                >
                  Мессеж илгээх
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </GlassCard>
        </FadeIn>
      </div>
    </section>
  );
}
