"use client";

import { useState } from "react";
import { Car, Home, Flame, CloudLightning, Shield, ChevronDown, Phone, FileText, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

export const PACKAGES = ["Багц 1", "Багц 2"];

type RiskItem = {
  id: string;
  icon: React.ReactNode;
  title: string;
  coverage: Record<string, string>;
  details: string;
};

type ServiceItem = {
  id: string;
  icon: React.ReactNode;
  title: string;
  values: Record<string, boolean | string>;
};

const RISKS: RiskItem[] = [
  {
    id: "road",
    icon: <Car className="h-5 w-5 text-blue-500" />,
    title: "Замын хөдөлгөөнд оролцох үеийн эрсдэл",
    coverage: { "Багц 1": "100%", "Багц 2": "100%" },
    details:
      "Замын хөдөлгөөнд оролцох үед учирч болзошгүй осол, хохиролд багцын хүрээнд нөхөн төлбөр олгоно.",
  },
  {
    id: "parking",
    icon: <Home className="h-5 w-5 text-indigo-500" />,
    title: "Зорчилтын зогсоолд байх үеийн эрсдэл",
    coverage: { "Багц 1": "100%", "Багц 2": "100%" },
    details: "Зогсоолд байх үед гадны этгээдээс учирсан хохирлыг нөхөн төлнө.",
  },
  {
    id: "fire",
    icon: <Flame className="h-5 w-5 text-red-500" />,
    title: "Галын эрсдэл",
    coverage: { "Багц 1": "100%", "Багц 2": "100%" },
    details: "Галын аюул, дэлбэрэлт, шатахуун дутмагшуулалтаас үүдсэн хохирлыг хамарна.",
  },
  {
    id: "nature",
    icon: <CloudLightning className="h-5 w-5 text-sky-500" />,
    title: "Байгалийн эрсдэл",
    coverage: { "Багц 1": "100%", "Багц 2": "100%" },
    details: "Үер, гanzар, мөндөр, цасан шуурга зэрэг байгалийн гамшгийн хохирлыг хамарна.",
  },
  {
    id: "theft",
    icon: <Shield className="h-5 w-5 text-emerald-500" />,
    title: "Хулгайн эрсдэл",
    coverage: { "Багц 1": "100%", "Багц 2": "100%" },
    details: "Тээврийн хэрэгслийг хулгайлах, эвдэх үед нөхөн төлбөр олгоно.",
  },
];

const OWN_DAMAGE: RiskItem = {
  id: "own-damage",
  icon: <Wrench className="h-5 w-5 text-amber-500" />,
  title: "Өөрийн хариуцах хэсэг",
  coverage: { "Багц 1": "0%", "Багц 2": "0%" },
  details: "Даатгуулагч өөрөө хариуцах эхний хэсгийн хэмжээ.",
};

const SERVICES: ServiceItem[] = [
  {
    id: "docs",
    icon: <FileText className="h-5 w-5 text-slate-500" />,
    title: "Нөхөн төлбөрийн материал бүрдүүлэлт",
    values: { "Багц 1": true, "Багц 2": true },
  },
  {
    id: "call",
    icon: <Phone className="h-5 w-5 text-slate-500" />,
    title: "24 цагийн дуудлагын үйлчилгээ",
    values: { "Багц 1": true, "Багц 2": true },
  },
  {
    id: "rental",
    icon: <Car className="h-5 w-5 text-slate-500" />,
    title: "Хохирлын үнэлгээний зардал",
    values: { "Багц 1": "300,000₮", "Багц 2": "300,000₮" },
  },
];

export function PackageCompare({ selected, onSelect }: { selected?: string; onSelect?: (pkg: string) => void }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  const renderBadge = (value: boolean | string, pkg: string) => {
    const active = typeof value === "boolean" ? value : true;
    return (
      <span
        key={pkg}
        className={cn(
          "rounded-md px-2 py-1 text-[10px] font-semibold",
          pkg === "Багц 1"
            ? active
              ? "bg-blue-100 text-blue-700"
              : "bg-slate-100 text-slate-500"
            : active
              ? "bg-amber-100 text-amber-700"
              : "bg-slate-100 text-slate-500"
        )}
      >
        {pkg} {typeof value === "boolean" ? (value ? "✓" : "—") : value}
      </span>
    );
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-700/50 bg-[#0f1321] p-4">
      {/* Header comparison */}
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800 p-3">
          <span className="text-xs font-semibold text-slate-300">Даатгалын эрсдэл / Insurance Risk</span>
          <div className="flex gap-2">
            {PACKAGES.map((pkg) => (
              <button
                key={pkg}
                type="button"
                onClick={() => onSelect?.(pkg)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[10px] font-bold transition-colors",
                  selected === pkg
                    ? pkg === "Багц 1"
                      ? "bg-blue-500 text-white"
                      : "bg-amber-500 text-white"
                    : pkg === "Багц 1"
                      ? "bg-blue-100/10 text-blue-400 hover:bg-blue-500/20"
                      : "bg-amber-100/10 text-amber-400 hover:bg-amber-500/20"
                )}
              >
                {pkg}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">Хураамжийн хувь:</span>
            {PACKAGES.map((pkg) => (
              <span
                key={pkg}
                className={cn(
                  "rounded-md px-2 py-1 text-[10px] font-bold",
                  pkg === "Багц 1" ? "bg-blue-100/10 text-blue-400" : "bg-amber-100/10 text-amber-400"
                )}
              >
                {pkg} — {pkg === "Багц 1" ? "1%" : "0.8%"}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Risks */}
      <div>
        <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Даатгалын эрсдэлүүд</h3>
        <div className="space-y-2">
          {RISKS.map((risk) => (
            <div key={risk.id} className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800">
              <button
                type="button"
                onClick={() => toggle(risk.id)}
                className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/50">{risk.icon}</div>
                  <span className="text-xs font-semibold text-white">{risk.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {PACKAGES.map((pkg) => renderBadge(risk.coverage[pkg], pkg))}
                  <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform", open[risk.id] && "rotate-180")} />
                </div>
              </button>
              <div
                className={cn(
                  "overflow-hidden border-t border-slate-700/50 bg-slate-900 px-3 text-xs text-slate-400 transition-all",
                  open[risk.id] ? "max-h-40 py-3 opacity-100" : "max-h-0 py-0 opacity-0"
                )}
              >
                {risk.details}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Own damage */}
      <div className="overflow-hidden rounded-xl border border-amber-500/20 bg-amber-500/10">
        <button
          type="button"
          onClick={() => toggle(OWN_DAMAGE.id)}
          className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-amber-500/15"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">{OWN_DAMAGE.icon}</div>
            <span className="text-xs font-semibold text-amber-200">{OWN_DAMAGE.title}</span>
          </div>
          <div className="flex items-center gap-2">
            {PACKAGES.map((pkg) => renderBadge(OWN_DAMAGE.coverage[pkg], pkg))}
            <ChevronDown className={cn("h-4 w-4 text-amber-400 transition-transform", open[OWN_DAMAGE.id] && "rotate-180")} />
          </div>
        </button>
        <div
          className={cn(
            "overflow-hidden border-t border-amber-500/10 bg-slate-900 px-3 text-xs text-amber-200/70 transition-all",
            open[OWN_DAMAGE.id] ? "max-h-40 py-3 opacity-100" : "max-h-0 py-0 opacity-0"
          )}
        >
          {OWN_DAMAGE.details}
        </div>
      </div>

      {/* Additional services */}
      <div>
        <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Нэмэлт үйлчилгээ / Additional Service
        </h3>
        <div className="space-y-2">
          {SERVICES.map((service) => (
            <div key={service.id} className="rounded-xl border border-slate-700/50 bg-slate-800 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/50">{service.icon}</div>
                  <span className="text-xs font-semibold text-white">{service.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {PACKAGES.map((pkg) => renderBadge(service.values[pkg], pkg))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
