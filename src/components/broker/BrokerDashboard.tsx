"use client";

import { useState, useMemo } from "react";
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
  BarChart3 as BarChartIcon,
  Activity,
  Table as TableIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Hexagon as HexagonIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { ContractForm, COMPANIES, CATEGORIES } from "./ContractForm";
import { ContractList, type Contract } from "./ContractList";

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
  { label: "Нийт борлуулалт", value: "₮59.1M", change: "+18.4%", up: true, sub: "Өмнөх сартай харьцуулахад" },
  { label: "Гэрээний тоо", value: "142", change: "+12.7%", up: true, sub: "гэрээ" },
  { label: "Идэвхтэй даатгалын компани", value: "5", change: "+1", up: true, sub: "даатгагч" },
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

// Mock data for broker dashboard testing
const MOCK_SALES = [
  { label: "1-р сар", value: 2450000, prev: 1800000 },
  { label: "2-р сар", value: 3100000, prev: 2100000 },
  { label: "3-р сар", value: 2800000, prev: 2600000 },
  { label: "4-р сар", value: 4200000, prev: 3100000 },
  { label: "5-р сар", value: 3900000, prev: 3500000 },
  { label: "6-р сар", value: 5100000, prev: 4100000 },
  { label: "7-р сар", value: 4700000, prev: 4400000 },
  { label: "8-р сар", value: 5600000, prev: 4800000 },
  { label: "9-р сар", value: 6100000, prev: 5200000 },
  { label: "10-р сар", value: 5800000, prev: 5500000 },
  { label: "11-р сар", value: 7200000, prev: 6000000 },
  { label: "12-р сар", value: 8100000, prev: 7000000 },
];

const MOCK_EMPLOYEES = [
  { label: "Л. Энхуянга", value: 18500000, contracts: 42 },
  { label: "Б. Бат-Эрдэнэ", value: 14200000, contracts: 35 },
  { label: "Г. Оюунчимэг", value: 12600000, contracts: 31 },
  { label: "Д. Мөнхбат", value: 9800000, contracts: 24 },
  { label: "Н. Анударь", value: 7600000, contracts: 18 },
];

const MOCK_PRODUCTS = [
  { label: "Автомашины даатгал", value: 42 },
  { label: "Аяллын даатгал", value: 18 },
  { label: "Эрүүл мэндийн даатгал", value: 22 },
  { label: "Гэрээслэлийн хариуцлагын даатгал", value: 10 },
  { label: "Бусад", value: 8 },
];

const MOCK_BRANCHES = [
  { label: "Улаанбаатар", value: 38500000 },
  { label: "Эрдэнэт", value: 9200000 },
  { label: "Дархан", value: 7400000 },
  { label: "Баянхонгор", value: 3100000 },
  { label: "Сэлэнгэ", value: 2800000 },
];

const MOCK_QUARTERS = [
  { label: "1-р улирал", current: 8350000, prev: 6500000 },
  { label: "2-р улирал", current: 13200000, prev: 10700000 },
  { label: "3-р улирал", current: 16400000, prev: 14400000 },
  { label: "4-р улирал", current: 21100000, prev: 18500000 },
];

const MOCK_PARTNERS = [
  { label: "МИГ даатгал", value: 35 },
  { label: "Ард даатгал", value: 25 },
  { label: "Болдог даатгал", value: 20 },
  { label: "Монгол даатгал", value: 15 },
  { label: "Бусад", value: 5 },
];

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];

function formatMNT(n: number) {
  return "₮" + (n / 1000000).toFixed(1) + "M";
}

type ChartType = "Table" | "Bar" | "Line" | "Pie" | "Radar";

const CHART_OPTIONS: { type: ChartType; label: string; icon: typeof TableIcon }[] = [
  { type: "Table", label: "Table", icon: TableIcon },
  { type: "Bar", label: "Bar", icon: BarChartIcon },
  { type: "Line", label: "Line", icon: LineChartIcon },
  { type: "Pie", label: "Pie", icon: PieChartIcon },
  { type: "Radar", label: "Radar", icon: HexagonIcon },
];

function detectNumericKeys(data: Record<string, unknown>[]) {
  const first = data[0] ?? {};
  return Object.keys(first).filter((k) => k !== "label" && typeof first[k] === "number");
}

function ChartWidget({
  title,
  subtitle,
  className,
  selectable = false,
  data,
  defaultType = "Line",
  valueFormatter = (v: number) => v.toLocaleString("mn-MN"),
  keys,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  selectable?: boolean;
  data: Record<string, string | number>[];
  defaultType?: ChartType;
  valueFormatter?: (v: number) => string;
  keys?: string[];
}) {
  const [open, setOpen] = useState(false);
  const [chartType, setChartType] = useState<ChartType>(defaultType);

  const selected = CHART_OPTIONS.find((c) => c.type === chartType) ?? CHART_OPTIONS[2];
  const SelectedIcon = selected.icon;
  const detectedKeys = detectNumericKeys(data);
  const numericKeys = keys && keys.length ? keys.filter((k) => detectedKeys.includes(k)) : detectedKeys;

  return (
    <div className={cn("rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5", className)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className="relative">
          {selectable ? (
            <>
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
            </>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500">
              <Activity className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 h-60">
        <ChartRenderer data={data} type={chartType} numericKeys={numericKeys} valueFormatter={valueFormatter} />
      </div>
    </div>
  );
}

function ChartRenderer({
  data,
  type,
  numericKeys,
  valueFormatter,
}: {
  data: Record<string, string | number>[];
  type: ChartType;
  numericKeys: string[];
  valueFormatter: (v: number) => string;
}) {
  if (!data.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-700/60 bg-slate-900/30 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
          <Activity className="h-6 w-6 text-slate-600" />
        </div>
        <p className="text-sm font-medium text-slate-500">Мэдээлэл байхгүй</p>
      </div>
    );
  }

  const chartColors = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

  if (type === "Table") {
    return (
      <div className="h-full overflow-auto rounded-xl border border-slate-700/50 bg-slate-900/30">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-400">
            <tr>
              <th className="px-3 py-2 font-semibold">Нэр</th>
              {numericKeys.map((k) => (
                <th key={k} className="px-3 py-2 font-semibold text-right">{k === "value" ? "Утга" : k === "prev" ? "Өмнөх" : k === "current" ? "Одоо" : k}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {data.map((row, i) => (
              <tr key={i} className="text-slate-300">
                <td className="px-3 py-2">{row.label}</td>
                {numericKeys.map((k) => (
                  <td key={k} className="px-3 py-2 text-right font-medium text-white">
                    {valueFormatter(Number(row[k]))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const tooltipStyle = {
    backgroundColor: "#0f1321",
    border: "1px solid rgba(51,65,85,0.5)",
    borderRadius: "0.5rem",
    color: "#e2e8f0",
    fontSize: "12px",
  };

  if (type === "Pie") {
    const pieKey = numericKeys[0] ?? "value";
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            contentStyle={tooltipStyle}
            itemStyle={{ color: "#e2e8f0" }}
            formatter={((value: number) => [valueFormatter(value), ""]) as any}
          />
          <Legend
            verticalAlign="bottom"
            height={24}
            iconType="circle"
            wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }}
          />
          <Pie
            data={data}
            dataKey={pieKey}
            nameKey="label"
            cx="50%"
            cy="45%"
            innerRadius={45}
            outerRadius={70}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === "Radar") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} />
          <PolarRadiusAxis tick={{ fill: "#64748b", fontSize: 9 }} stroke="#334155" />
          <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#e2e8f0" }} />
          <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
          {numericKeys.map((k, i) => (
            <Radar
              key={k}
              name={k === "value" ? "Утга" : k === "prev" ? "Өмнөх" : k === "current" ? "Одоо" : k}
              dataKey={k}
              stroke={chartColors[i % chartColors.length]}
              fill={chartColors[i % chartColors.length]}
              fillOpacity={0.25}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    );
  }

  const isBar = type === "Bar";
  const Chart = isBar ? BarChart : LineChart;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Chart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 10 }} stroke="#334155" />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 10 }}
          stroke="#334155"
          tickFormatter={(v: number) => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v))}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          itemStyle={{ color: "#e2e8f0" }}
          formatter={((value: number, name: string) => [valueFormatter(value), name === "value" ? "Утга" : name === "prev" ? "Өмнөх" : name === "current" ? "Одоо" : name]) as any}
        />
        <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
        {numericKeys.map((k, i) =>
          isBar ? (
            <Bar
              key={k}
              type="monotone"
              dataKey={k}
              name={k === "value" ? "Утга" : k === "prev" ? "Өмнөх" : k === "current" ? "Одоо" : k}
              fill={chartColors[i % chartColors.length]}
              radius={[4, 4, 0, 0]}
            />
          ) : (
            <Line
              key={k}
              type="monotone"
              dataKey={k}
              name={k === "value" ? "Утга" : k === "prev" ? "Өмнөх" : k === "current" ? "Одоо" : k}
              stroke={chartColors[i % chartColors.length]}
              strokeWidth={2}
              dot={{ r: 3, fill: chartColors[i % chartColors.length] }}
              activeDot={{ r: 5 }}
            />
          )
        )}
      </Chart>
    </ResponsiveContainer>
  );
}

function LeaderboardWidget({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  const sorted = [...MOCK_EMPLOYEES].sort((a, b) => b.contracts - a.contracts);
  const maxSales = Math.max(...MOCK_EMPLOYEES.map((e) => e.value));

  return (
    <div className={cn("rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5", className)}>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className="space-y-3">
        {sorted.map((emp, idx) => (
          <div key={emp.label} className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                idx === 0 ? "bg-amber-500/20 text-amber-300" : "bg-slate-700 text-slate-400"
              )}
            >
              {idx + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="truncate font-medium text-slate-200">{emp.label}</span>
                <span className="font-bold text-white">{formatMNT(emp.value)}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className={cn("h-full rounded-full", idx === 0 ? "bg-amber-500" : "bg-indigo-500")}
                    style={{ width: `${(emp.value / maxSales) * 100}%` }}
                  />
                </div>
                <span className="shrink-0 text-[11px] text-slate-400">{emp.contracts} гэрээ</span>
              </div>
            </div>
          </div>
        ))}
      </div>
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

  // Persisted contracts from the contract form
  const [contracts, setContracts] = useState<Contract[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("ins-monre-contracts");
      return raw ? (JSON.parse(raw) as Contract[]) : [];
    } catch {
      return [];
    }
  });

  const persistContracts = (next: Contract[]) => {
    setContracts(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("ins-monre-contracts", JSON.stringify(next));
    }
  };

  const addContract = (payload: Omit<Contract, "id" | "number" | "createdAt" | "status">) => {
    const nextId = contracts.length + 1;
    const number = `Г-${new Date().getFullYear()}-${String(nextId).padStart(4, "0")}`;
    const contract: Contract = {
      ...payload,
      id: crypto.randomUUID?.() || `${Date.now()}-${nextId}`,
      number,
      createdAt: new Date().toISOString(),
      status: "draft",
    };
    const next = [contract, ...contracts];
    persistContracts(next);
    return contract;
  };

  const payContract = (id: string) => {
    const next = contracts.map((c) => (c.id === id ? { ...c, status: "paid" as const } : c));
    persistContracts(next);
  };

  const deleteContract = (id: string) => {
    const next = contracts.filter((c) => c.id !== id);
    persistContracts(next);
  };

  // Demo filter: limit monthly sales view based on selected period
  const salesByPeriod = useMemo(() => {
    if (activeFilter === "Өдөр") return MOCK_SALES.slice(6, 7);
    if (activeFilter === "Сар") return MOCK_SALES.slice(-1);
    if (activeFilter === "Улирал") return MOCK_SALES.slice(-3);
    if (activeFilter === "Хагас жил") return MOCK_SALES.slice(-6);
    if (activeFilter === "Жил") return MOCK_SALES;
    return MOCK_SALES;
  }, [activeFilter]);

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
    <div className="flex h-full flex-col bg-[#0b0f19] text-slate-200">
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
            <BarChartIcon className="h-3.5 w-3.5" />
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
          {(active === "new-contract" || active === "new-ajd") ? (
            <ContractForm
              isAjd={active === "new-ajd"}
              onBack={() => setActive("dashboard")}
              onSave={(payload) => {
                addContract(payload);
                setActive(active === "new-ajd" ? "ajd-list" : "contract-list");
              }}
            />
          ) : active === "contract-list" || active === "ajd-list" ? (
            <ContractList
              contracts={contracts}
              companies={COMPANIES}
              categories={CATEGORIES}
              title={active === "ajd-list" ? "Гэрээний жагсаалт АЖД" : "Гэрээний жагсаалт"}
              isAjd={active === "ajd-list"}
              onCreate={() => setActive(active === "ajd-list" ? "new-ajd" : "new-contract")}
              onPay={payContract}
              onDelete={deleteContract}
              onRefresh={() => {}}
            />
          ) : (
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
                      onClick={() => setActive("new-contract")}
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
                <ChartWidget
                  title="Борлуулалтын сар бүрийн чиг хандлага"
                  subtitle="Таны сарын орлогын тойм"
                  className="lg:col-span-2"
                  selectable
                  data={salesByPeriod}
                  valueFormatter={formatMNT}
                />
                <LeaderboardWidget
                  title="Ажилтны гүйцэтгэл"
                  subtitle="Хамгийн олон гэрээ &amp; борлуулалт"
                />
              </div>

              {/* Charts row 2 */}
              <div className="mb-6 grid gap-5 lg:grid-cols-2">
                <ChartWidget
                  title="Бүтээгдэхүүний задаргаа"
                  subtitle="Борлуулалт бүтээгдэхүүнээр"
                  defaultType="Pie"
                  data={MOCK_PRODUCTS}
                  valueFormatter={(v) => `${v}%`}
                />
                <ChartWidget
                  title="Салбарын гүйцэтгэл"
                  subtitle="Борлуулалт салбар бүрээр"
                  defaultType="Bar"
                  data={MOCK_BRANCHES}
                  valueFormatter={formatMNT}
                />
              </div>

              {/* Charts row 3 */}
              <div className="mb-6 grid gap-5 lg:grid-cols-2">
                <ChartWidget
                  title="Гүйцэтгэл улираар"
                  subtitle="Энэ жилийн өмнөх жилтэй харьцуулсан"
                  defaultType="Bar"
                  data={MOCK_QUARTERS}
                  valueFormatter={formatMNT}
                />
                <ChartWidget
                  title="Даатгалын түншүүд"
                  subtitle="Даатгалын компанийн хураамж"
                  defaultType="Pie"
                  data={MOCK_PARTNERS}
                  valueFormatter={(v) => `${v}%`}
                />
              </div>

              {/* Charts row 4: top employee charts */}
              <div className="grid gap-5 lg:grid-cols-2">
                <ChartWidget
                  title="Шилдэг борлуулалттай ажилтнууд"
                  subtitle="Багийн гишүүдийн борлуулалт"
                  defaultType="Bar"
                  data={MOCK_EMPLOYEES}
                  keys={["value"]}
                  valueFormatter={formatMNT}
                />
                <ChartWidget
                  title="Хамгийн олон гэрээ хийсэн ажилтнууд"
                  subtitle="Ажилтны гэрээний тоо"
                  defaultType="Bar"
                  data={MOCK_EMPLOYEES.map((e) => ({ label: e.label, value: e.contracts }))}
                  valueFormatter={(v) => `${v} гэрээ`}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
