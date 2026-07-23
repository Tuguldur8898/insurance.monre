"use client";

import { useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Users, ArrowLeft } from "lucide-react";

const STATS = [
  { label: "Нийт борлуулалт", value: "₮0" },
  { label: "Гэрээний тоо", value: "0" },
  { label: "Харилцагч", value: "0" },
];

export function BrokerDashboard() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200">
      <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0f172a] px-6">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-5 w-5 text-sky" />
          <span className="text-lg font-bold text-white">Брокерын систем</span>
        </div>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" /> Буцах
        </button>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-white/10 bg-[#0f172a] p-5">
              <p className="text-xs font-semibold uppercase text-slate-500">{s.label}</p>
              <p className="mt-2 text-2xl font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-[#0f172a] p-5">
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-sky" />
              <h2 className="font-bold text-white">Гэрээний удирдлага</h2>
            </div>
            <p className="text-sm text-slate-400">Гэрээ байгуулах, жагсаалт харах, статус хянах.</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0f172a] p-5">
            <div className="mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-sky" />
              <h2 className="font-bold text-white">Харилцагчийн бүртгэл</h2>
            </div>
            <p className="text-sm text-slate-400">Шинэ харилцагч бүртгэх, мэдээлэл засах.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
