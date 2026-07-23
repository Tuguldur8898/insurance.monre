"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Table,
  PieChart,
  LineChart,
  Hexagon,
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
  { label: "Нийт борлуулалт", value: "₮0", change: "0.0%", up: true, sub: "Өмнөх сартай харьцуулахад" },
  { label: "Гэрээний тоо", value: "0", change: "0.0%", up: true, sub: "гэрээ" },
  { label: "Идэвхтэй даатгалын компани", value: "0", change: "0.0%", up: true, sub: "даатгагч" },
];

const FILTER_TABS = ["Өдөр", "Сар", "Улирал", "Хагас жил", "Жил", "Тусгай"];

function StatCard({ stat }: { stat: (typeof STATS)[number] }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5 transition-colors hover:border-slate-600">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 transition-opacity group-hover:opacity-100" />
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.label}</p>
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
      <p className="mt-2 text-xs text-slate-500">{stat.sub}</p>
    </div>
  );
}

type ChartType = "Table" | "Bar" | "Line" | "Pie" | "Radar";

const CHART_OPTIONS: { type: ChartType; label: string; icon: typeof Table }[] = [
  { type: "Table", label: "Table", icon: Table },
  { type: "Bar", label: "Bar", icon: BarChart3 },
  { type: "Line", label: "Line", icon: LineChart },
  { type: "Pie", label: "Pie", icon: PieChart },
  { type: "Radar", label: "Radar", icon: Hexagon },
];

function ChartWidget({ title, subtitle, className }: { title: string; subtitle?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [chartType, setChartType] = useState<ChartType>("Line");

  const selected = CHART_OPTIONS.find((c) => c.type === chartType) ?? CHART_OPTIONS[2];
  const SelectedIcon = selected.icon;

  return (
    <div className={cn("rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5", className)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <SelectedIcon className="h-4 w-4" />
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-lg border border-slate-700/60 bg-[#0f1321] py-1 shadow-xl">
                {CHART_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.type}
                      type="button"
                      onClick={() => {
                        setChartType(option.type);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium transition-colors",
                        chartType === option.type ? "bg-indigo-500/15 text-indigo-300" : "text-slate-300 hover:bg-slate-800"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {option.label}
                      {chartType === option.type && <span className="ml-auto">✓</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mt-4">
        <EmptyChart label="Мэдээлэл байхгүй" type={chartType} />
      </div>
    </div>
  );
}

function EmptyChart({ label, type }: { label: string; type: ChartType }) {
  const TypeIcon = CHART_OPTIONS.find((c) => c.type === type)?.icon ?? LineChart;
  return (
    <div className="flex h-52 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-700/60 bg-slate-900/30 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
        <TypeIcon className="h-6 w-6 text-slate-600" />
      </div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-xs text-slate-600">{type} харах</p>
    </div>
  );
}

export function BrokerDashboard() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(["contracts"]);
  const [active, setActive] = useState("dashboard");
  const [activeFilter, setActiveFilter] = useState("Сар");
  const [customStart, setCustomStart] = useState("2026-07-01");
  const [customEnd, setCustomEnd] = useState("2026-07-23");

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
    <div className="flex min-h-screen flex-col bg-[#0b0f19] text-slate-200">
      {/* Topbar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-[#0f1321] px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
          </button>

          <div className="flex items-center gap-2.5">
            <span className="relative h-9 w-9 overflow-hidden rounded-lg">
              <Image src="/logo.jpg" alt="ins.monre" fill sizes="36px" className="object-cover" />
            </span>
            <span className="hidden text-sm font-extrabold tracking-tight text-white sm:block">
              ins<span className="text-indigo-400">.monre</span>
            </span>
          </div>

          <div className="ml-4 hidden h-6 w-px bg-slate-700 md:block" />

          <span className="hidden items-center gap-1.5 rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-400 md:flex">
            <BarChart3 className="h-3.5 w-3.5" />
            Брокерын систем
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
          </button>

          <div className="flex items-center gap-2.5 pl-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-sm font-extrabold text-white">
              АА
            </span>
            <div className="hidden text-right lg:block">
              <p className="text-xs font-bold text-white">Л. Энхуянга</p>
              <p className="text-[10px] uppercase tracking-wide text-slate-500">Админ</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "shrink-0 flex-col overflow-y-auto border-r border-slate-800 bg-[#0f1321] py-4 transition-[width] duration-200",
            collapsed ? "hidden w-0 md:flex md:w-20" : "flex w-64"
          )}
        >
          <div className={cn("mb-4 px-4", collapsed && "md:hidden")}>
            <div className="flex items-center gap-2 rounded-lg bg-indigo-500/10 px-3 py-2">
              <Building2 className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-bold text-indigo-300">Алтансан актив ББСБ</span>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-1 px-3">
            {MENU.map((group) => {
              const isOpen = openGroups.includes(group.id);
              return (
                <div key={group.id} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13px] font-semibold transition-colors",
                      isOpen ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-800 text-indigo-400">
                        <group.icon className="h-4 w-4" />
                      </span>
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
                        "flex flex-col gap-0.5 overflow-hidden py-1 pl-[52px] transition-all duration-200",
                        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActive(item.id)}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors",
                            active === item.id
                              ? "bg-indigo-500/15 text-indigo-300"
                              : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
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
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto bg-[#0b0f19] p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">
            {/* Greeting + filters */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white lg:text-2xl">
                  Өдрийн мэнд, Л. Энхуянга
                </h1>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <span className="text-indigo-400">Алтансан актив ББСБ</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Сүүлд шинэчилсэн: {new Date().toLocaleTimeString("mn-MN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                <div className="flex flex-wrap items-center gap-2">
                  {FILTER_TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveFilter(tab)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                        activeFilter === tab
                          ? "bg-indigo-500 text-white"
                          : "border border-slate-700/60 bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-white"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {activeFilter === "Тусгай" && (
                  <div className="flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-800/40 px-3 py-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="bg-transparent text-xs font-medium text-white outline-none"
                    />
                    <span className="text-slate-500">→</span>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="bg-transparent text-xs font-medium text-white outline-none"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-600"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Гэрээ байгуулах
                  </button>
                </div>
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
              <ChartWidget title="Борлуулалтын сар бүрийн чиг хандлага" subtitle="Таны сарын орлогын тойм" className="lg:col-span-2" />
              <ChartWidget title="Шилдэг ажилтнууд" subtitle="Багийн гишүүдийн борлуулалт" />
            </div>

            {/* Charts row 2 */}
            <div className="grid gap-5 lg:grid-cols-2">
              <ChartWidget title="Гүйцэтгэл улираар" subtitle="Энэ жилийн өмнөх жилтэй харьцуулсан" />
              <ChartWidget title="Даатгалын түншүүд" subtitle="Даатгалын компанийн хураамж" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
