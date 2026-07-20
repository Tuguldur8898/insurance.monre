import type { Metadata } from "next";
import { Dashboard } from "@/components/auth/Dashboard";

export const metadata: Metadata = {
  title: "Миний хуудас — ins.monre",
  description: "Хувийн болон байгууллагын мэдээлэл",
};

export default function DashboardPage() {
  return (
    <section className="hero-bg relative min-h-screen px-0 pt-28 pb-16">
      <div className="starfield" aria-hidden="true" />
      <Dashboard />
    </section>
  );
}
