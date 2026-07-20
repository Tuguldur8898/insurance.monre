import { ShieldCheck, Zap, Users } from "lucide-react";
import { StaggerGroup } from "@/components/motion/FadeIn";
import { StatsCard } from "./StatsCard";

const STATS = [
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    value: "100%",
    label: "Найдвартай хамгаалалт",
    text: "Таны өгөгдөл, хөрөнгө бүрэн хамгаалагдсан.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    value: "24/7",
    label: "Тасралтгүй үйлчилгээ",
    text: "Хэдийд ч, хаанаас ч хандан үйлчлүүлэх боломж.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    value: "1000+",
    label: "Итгэл үнэмшилтэй харилцагч",
    text: "Монголын хэрэглэгчдийн итгэдэг платформ.",
  },
];

export function StatsStrip() {
  return (
    <section className="relative -mt-10 pb-8">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <StaggerGroup className="grid gap-6 md:grid-cols-3">
          {STATS.map((s) => (
            <StatsCard key={s.label} {...s} />
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
