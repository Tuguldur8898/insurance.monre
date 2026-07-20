import type { Metadata } from "next";
import { LoginCard } from "@/components/auth/LoginCard";

export const metadata: Metadata = {
  title: "Нэвтрэх — ins.monre",
  description: "ins.monre даатгалын платформд нэвтрэх",
};

export default function LoginPage() {
  return (
    <section className="hero-bg relative flex min-h-screen items-center justify-center px-4 pt-28 pb-16">
      <div className="starfield" aria-hidden="true" />
      <LoginCard />
    </section>
  );
}
