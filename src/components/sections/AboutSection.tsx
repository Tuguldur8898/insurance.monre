import { ArrowRight, Target, Eye, HeartHandshake } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { FadeIn, StaggerGroup } from "@/components/motion/FadeIn";
import { GlassCard } from "@/components/effects/GlassCard";

type AboutProps = {
  title?: string;
  body?: string;
};

const VALUES = [
  {
    icon: Target,
    title: "Эрхэм зорилго",
    text: "Даатгалыг хүн бүрд хялбар, ил тод, дижитал болгох.",
  },
  {
    icon: Eye,
    title: "Алсын хараа",
    text: "Монголын тэргүүлэх дижитал даатгалын платформ болох.",
  },
  {
    icon: HeartHandshake,
    title: "Үнэт зүйлс",
    text: "Итгэлцэл, ил тод байдал, харилцагч төвт үйлчилгээ.",
  },
];

export function AboutSection({ title, body }: AboutProps) {
  return (
    <section className="relative py-24">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand">Бидний тухай</p>
          <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold tracking-tight text-navy">
            {title ?? "Даатгалын шинэ стандарт"}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-navy/70">
            {body ??
              "Monre Insurance нь технологийн хүчээр даатгалын үйлчилгээг илүү хялбар, илүү найдвартай болгодог дижитал платформ юм. Бид таны ирээдүйг хамгаалахыг эрмэлздэг."}
          </p>
        </FadeIn>

        <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3">
          {VALUES.map((v) => (
            <FadeIn key={v.title}>
              <GlassCard className="h-full p-7 transition-shadow duration-300 hover:shadow-[0_16px_48px_rgba(37,99,235,0.16)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ice text-brand">
                  <v.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-navy">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/65">{v.text}</p>
              </GlassCard>
            </FadeIn>
          ))}
        </StaggerGroup>

        <FadeIn className="mt-10 text-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand transition-colors hover:text-brand-dark"
          >
            Дэлгэрэнгүй унших
            <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
