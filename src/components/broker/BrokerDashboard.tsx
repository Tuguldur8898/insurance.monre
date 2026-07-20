"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Plus,
  List,
  Briefcase,
  Users,
  UserPlus,
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
  ChevronRight,
  LogOut,
  Bell,
  Search,
  Calendar,
  TrendingUp,
  TrendingDown,
  Building2,
  ChevronLeft,
  BarChart3,
  PieChart,
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
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent p-5 transition-all hover:border-sky/20">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky/10 blur-3xl" aria-hidden="true" />
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.label}</p>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-3xl font-extrabold tracking-tight text-white">{stat.value}</p>
        <span
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold",
            stat.up
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-red-500/15 text-red-400"
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
    <div className={cn("rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-transparent p-5", className)}>
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
    <div className="hero-bg relative flex min-h-screen flex-col">
      <div className="starfield" aria-hidden="true" />

      {/* Topbar */}
      <header className="relative z-10 flex h-16 items-center justify-between border-b border-white/[0.06] bg-navy-deep/70 px-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2.5">
            <span className="relative h-9 w-9 overflow-hidden rounded-xl shadow-[0_0_16px_rgba(34,197,94,0.35)]">
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
          <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 md:flex">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <span>2026-07-01</span>
            <span className="text-slate-600">→</span>
            <span>2026-07-20</span>
          </div>
          <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-colors hover:text-white">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
          </button>
          <div className="flex items-center gap-2.5 pl-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky to-brand text-sm font-extrabold text-white">
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
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all hover:border-red-400/50 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "flex shrink-0 flex-col border-r border-white/[0.06] bg-navy-deep/50 backdrop-blur-xl transition-all duration-300",
            collapsed ? "w-0 overflow-hidden opacity-0 md:w-16 md:opacity-100" : "w-64 opacity-100"
          )}
        >
          <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
            {MENU.map((group) => (
              <div key={group.id} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition-colors",
                    openGroups.includes(group.id) ? "bg-white/5 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <group.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{group.label}</span>}
                  </span>
                  {!collapsed && (
                    <ChevronDown
                      className={cn("h-3.5 w-3.5 text-slate-500 transition-transform", !openGroups.includes(group.id) && "-rotate-90")}
                    />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {openGroups.includes(group.id) && !collapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-0.5 py-1 pl-4">
                        {group.items.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setActive(item.id)}
                            className={cn(
                              "flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all",
                              active === item.id
                                ? "bg-brand/15 text-sky"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                            )}
                          >
                            <item.icon className="h-3.5 w-3.5 shrink-0" />
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-7">
          <div className="mx-auto max-w-7xl">
            {/* Greeting */}
            <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">Өдрийн мэнд, Алтансан Админ</h1>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-sky">Алтансан актив ББСБ</span>
                  <span>·</span>
                  <span>Сүүлд шинэчилсэн: {new Date().toLocaleTimeString("mn-MN", { hour: "2-digit", minute: "2-digit" })}</span>
                </p>
              </div>
              <div className="mt-3 flex gap-2 sm:mt-0">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-xs font-bold text-slate-300 transition-all hover:border-sky/50 hover:text-sky"
                >
                  Хувийн хуудас руу буцах
                </button>
                <button
                  type="button"
                  className="btn-glow rounded-full bg-brand px-4 py-2 text-xs font-bold text-white transition-all hover:scale-[1.02] hover:bg-brand-dark"
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
