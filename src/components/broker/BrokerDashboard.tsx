"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  Plus,
  List,
  Briefcase,
  Users,
  ClipboardList,
  Wallet,
  RotateCcw,
  CheckCircle,
  Upload,
  Settings,
  DollarSign,
  Calculator,
  Send,
  ClipboardCheck,
  ChevronDown,
  LogOut,
  Bell,
  Calendar,
  TrendingUp,
  TrendingDown,
  Building2,
  ChevronLeft,
  BarChart3,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MenuItem = { id: string; label: string; icon: typeof FileText };
type MenuGroup = { id: string; label: string; icon: typeof LayoutDashboard; items: MenuItem[] };

const MENU: MenuGroup[] = [
  {
    id: "contracts",
    label: "Гэрээ",
    icon: FileText,
    items: [
      { id: "dashboard", label: "Хяналтын самбар", icon: LayoutDashboard },
      { id: "new-contract", label: "Гэрээ байгуулах", icon: Plus },
      { id: "contract-list", label: "Гэрээний жагсаалт", icon: List },
      { id: "new-ajd", label: "Гэрээ байгуулах АЖД", icon: FileText },
      { id: "ajd-list", label: "Гэрээний жагсаалт АЖД", icon: ClipboardList },
    ],
  },
  {
    id: "services",
    label: "Терийн үйлчилгээ",
    icon: Briefcase,
    items: [{ id: "service-list", label: "Үйлчилгээ", icon: Briefcase }],
  },
  {
    id: "company",
    label: "Байгууллагын даатгал",
    icon: Building2,
    items: [
      { id: "customers", label: "Харилцагчийн бүртгэл", icon: Users },
      { id: "company-contracts", label: "Гэрээний бүртгэл", icon: FileText },
      { id: "claims", label: "Нөхөн төлбөрийн бүртгэл", icon: Wallet },
    ],
  },
  {
    id: "refund",
    label: "Буцалт",
    icon: RotateCcw,
    items: [
      { id: "refund-list", label: "Буцалт", icon: RotateCcw },
      { id: "refund-approve", label: "Буцалт зөвшөөрөх", icon: CheckCircle },
      { id: "import", label: "Гэрээ импортлох", icon: Upload },
      { id: "settings", label: "Тохиргоо", icon: Settings },
      { id: "platform-fee", label: "Platform fee", icon: DollarSign },
    ],
  },
  {
    id: "valuation",
    label: "Үнэлгээ хийх",
    icon: Calculator,
    items: [
      { id: "send-valuation", label: "Үнэлгээний хүсэлт илгээх", icon: Send },
      { id: "valuation-list", label: "Үнэлгээний жагсаалт", icon: ClipboardCheck },
    ],
  },
];

const STATS = [
  { label: "Нийт борлуулалт", value: "₮0", change: "0.0%", up: true, note: "Өмнөх сартай харьцуулахад" },
  { label: "Гэрээний тоо", value: "0", change: "0.0%", up: true, note: "гэрээ" },
  { label: "Идэвхтэй даатгалын компани", value: "0", change: "0.0%", up: true, note: "даатгагч" },
];

function StatCard({ stat }: { stat: (typeof STATS)[number] }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-navy-deep/60 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.label}</p>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-3xl font-extrabold tracking-tight text-white">{stat.value}</p>
        <span
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold",
            stat.up ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
          )}
        >
          {stat.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {stat.change}
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-600">{stat.note}</p>
    </div>
  );
}

function Widget({ title, subtitle, children, className }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-white/[0.08] bg-navy-deep/60 p-5", className)}>
      <h3 className="text-sm font-extrabold text-white">{title}</h3>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 text-center">
      <Activity className="h-8 w-8 text-slate-700" />
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

export function BrokerDashboard() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(["contracts"]);
  const [active, setActive] = useState("dashboard");

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.dispatchEvent(new Event("auth-changed"));
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-navy">
      {/* Topbar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] bg-navy-deep px-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
          </button>
          <div className="flex items-center gap-2.5">
            <span className="relative h-9 w-9 overflow-hidden rounded-xl">
              <Image src="/logo.jpg" alt="ins.monre" fill sizes="36px" className="object-cover" />
            </span>
            <span className="text-sm font-extrabold tracking-tight text-white">
              ins<span className="text-sky">.monre</span>
            </span>
          </div>
          <span className="ml-3 hidden items-center gap-1.5 rounded-full border border-sky/25 bg-sky/10 px-3 py-1 text-[11px] font-bold text-sky md:flex">
            <BarChart3 className="h-3 w-3" />
            Брокерын систем
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 md:flex">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <span>2026-07-01</span>
            <span className="text-slate-600">→</span>
            <span>2026-07-20</span>
          </div>
          <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:text-white">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
          </button>
          <div className="flex items-center gap-2.5 pl-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky text-sm font-extrabold text-white">
              АА
            </span>
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold text-white">Алтансан Админ</p>
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Админ</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "shrink-0 flex-col overflow-y-auto border-r border-white/[0.08] bg-navy-deep py-3 transition-[width] duration-200",
            collapsed ? "hidden w-0 md:flex md:w-16" : "flex w-64"
          )}
        >
          {MENU.map((group) => {
            const isOpen = openGroups.includes(group.id);
            return (
              <div key={group.id} className="flex flex-col px-3">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13px] font-semibold transition-colors",
                    isOpen ? "bg-white/5 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <group.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{group.label}</span>}
                  </span>
                  {!collapsed && (
                    <ChevronDown
                      className={cn("h-3.5 w-3.5 text-slate-500 transition-transform duration-200", !isOpen && "-rotate-90")}
                    />
                  )}
                </button>
                {!collapsed && (
                  <div
                    className={cn(
                      "flex flex-col gap-0.5 overflow-hidden py-1 pl-4 transition-all duration-200",
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActive(item.id)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors",
                          active === item.id ? "bg-brand/15 text-sky" : "text-slate-400 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <item.icon className="h-3.5 w-3.5 shrink-0" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto bg-navy p-5 sm:p-7">
          <div className="mx-auto max-w-7xl">
            {/* Greeting */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">Өдрийн мэнд, Алтансан Админ</h1>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-sky">Алтансан актив ББСБ</span>
                  <span>·</span>
                  <span>Сүүлд шинэчилсэн: {new Date().toLocaleTimeString("mn-MN", { hour: "2-digit", minute: "2-digit" })}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Хувийн хуудас руу буцах
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-brand px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-dark"
                >
                  + Гэрээ байгуулах
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {STATS.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </div>

            {/* Charts row 1 */}
            <div className="mb-6 grid gap-5 lg:grid-cols-3">
              <Widget title="Борлуулалтын сар бүрийн чиг хандлага" subtitle="Таны сарын орлогын тойм" className="lg:col-span-2">
                <EmptyChart label="Мэдээлэл байхгүй" />
              </Widget>
              <Widget title="Шилдэг ажилтнууд" subtitle="Багийн гишүүдийн борлуулалт">
                <EmptyChart label="Мэдээлэл байхгүй" />
              </Widget>
            </div>

            {/* Charts row 2 */}
            <div className="grid gap-5 lg:grid-cols-2">
              <Widget title="Гүйцэтгэл улираар" subtitle="Энэ жилийн өмнөх жилтэй харьцуулсан">
                <EmptyChart label="Мэдээлэл байхгүй" />
              </Widget>
              <Widget title="Даатгалын түншүүд" subtitle="Даатгалын компанийн хураамж">
                <EmptyChart label="Мэдээлэл байхгүй" />
              </Widget>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
