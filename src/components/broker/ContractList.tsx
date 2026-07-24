"use client";

import { useMemo, useState } from "react";
import {
  Search,
  RotateCcw,
  FileDown,
  Receipt,
  Landmark,
  FileBarChart,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  Calendar,
  Filter,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";

function formatMNT(n: number) {
  return "₮" + n.toLocaleString("mn-MN");
}

export type Contract = {
  id: string;
  number: string;
  companyId: string;
  companyName: string;
  categoryId: string;
  categoryName: string;
  subCategory: string;
  product: string;
  packageName?: string;
  valuation: number;
  premium: number;
  brokerFee: number;
  discountPercent: number;
  discountAmount: number;
  additionalTotal: number;
  startDate: string;
  duration: string;
  status: "draft" | "active" | "paid" | "expired";
  createdAt: string;
  ownerName?: string;
  licensePlate?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  isAjd: boolean;
};

const PAGE_SIZES = [10, 25, 50, 100];

const STATUSES: Record<Contract["status"], { label: string; className: string }> = {
  draft: { label: "Ноорог", className: "border-slate-700/60 bg-slate-800/60 text-slate-400" },
  active: { label: "Идэвхитэй", className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
  paid: { label: "Төлсөн", className: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400" },
  expired: { label: "Дууссан", className: "border-amber-500/30 bg-amber-500/10 text-amber-400" },
};

type ContractListProps = {
  contracts: Contract[];
  companies: { id: string; name: string; rate: number }[];
  categories: { id: string; name: string; sub: string[] }[];
  title?: string;
  isAjd?: boolean;
  onCreate?: () => void;
  onPay?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
};

export function ContractList({
  contracts,
  companies,
  categories,
  title = "Гэрээний жагсаалт",
  isAjd,
  onCreate,
  onPay,
  onDelete,
  onRefresh,
}: ContractListProps) {
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const filtered = useMemo(() => {
    let list = contracts.filter((c) => (isAjd === undefined ? true : c.isAjd === isAjd));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.number.toLowerCase().includes(q) ||
          c.companyName.toLowerCase().includes(q) ||
          c.categoryName.toLowerCase().includes(q) ||
          c.subCategory.toLowerCase().includes(q) ||
          (c.ownerName || "").toLowerCase().includes(q) ||
          (c.licensePlate || "").toLowerCase().includes(q)
      );
    }
    if (companyFilter) list = list.filter((c) => c.companyId === companyFilter);
    if (categoryFilter) list = list.filter((c) => c.categoryId === categoryFilter);
    if (statusFilter) list = list.filter((c) => c.status === statusFilter);
    if (startDate) list = list.filter((c) => c.startDate >= startDate);
    if (endDate) list = list.filter((c) => c.startDate <= endDate);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [contracts, search, companyFilter, categoryFilter, statusFilter, startDate, endDate, isAjd]);

  const totalValue = useMemo(() => filtered.reduce((sum, c) => sum + c.valuation, 0), [filtered]);
  const totalPremium = useMemo(() => filtered.reduce((sum, c) => sum + c.premium, 0), [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const resetFilters = () => {
    setSearch("");
    setCompanyFilter("");
    setCategoryFilter("");
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white lg:text-2xl">{title}</h1>
          <p className="mt-1 text-xs text-slate-500">Бүртгэгдсэн гэрээний жагсаалт</p>
        </div>
        {onCreate && (
          <button
            type="button"
            onClick={onCreate}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-600"
          >
            <Receipt className="h-4 w-4" />
            Гэрээ байгуулах
          </button>
        )}
      </div>

      {/* Stats + filters card */}
      <div className="mb-5 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-4 shadow-xl backdrop-blur-sm">
        {/* Stats row */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-900/40 px-3 py-2">
            <span className="text-xs text-slate-400">Нийт:</span>
            <span className="text-sm font-bold text-white">{filtered.length}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-900/40 px-3 py-2">
            <span className="text-xs text-slate-400">Нийт үнэ:</span>
            <span className="text-sm font-bold text-indigo-300">{formatMNT(totalValue)}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-900/40 px-3 py-2">
            <span className="text-xs text-slate-400">Хураамж:</span>
            <span className="text-sm font-bold text-emerald-400">{formatMNT(totalPremium)}</span>
          </div>
        </div>

        {/* Filter toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-900/40 px-2.5 py-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-xs font-medium text-white outline-none"
            />
            <span className="text-slate-500">→</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-xs font-medium text-white outline-none"
            />
          </div>

          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Хайх..."
              className="h-9 w-48 rounded-lg border border-slate-700/60 bg-slate-900/40 py-2 pl-8 pr-3 text-xs text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 lg:w-64"
            />
          </div>

          <select
            value={companyFilter}
            onChange={(e) => {
              setCompanyFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-slate-700/60 bg-slate-900/40 px-3 text-xs text-white outline-none transition-all focus:border-indigo-500"
          >
            <option value="">Даатгалын компани</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-slate-700/60 bg-slate-900/40 px-3 text-xs text-white outline-none transition-all focus:border-indigo-500"
          >
            <option value="">Категори сонгох</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-slate-700/60 bg-slate-900/40 px-3 text-xs text-white outline-none transition-all focus:border-indigo-500"
          >
            <option value="">Төлөв</option>
            <option value="draft">Ноорог</option>
            <option value="active">Идэвхитэй</option>
            <option value="paid">Төлсөн</option>
            <option value="expired">Дууссан</option>
          </select>

          <button
            type="button"
            onClick={() => {
              resetFilters();
              onRefresh?.();
            }}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-900/40 px-3 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Хайлт цэвэрлэх
          </button>
        </div>

        {/* Action buttons */}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-700/50 pt-3">
          <button
            type="button"
            onClick={() => onPay?.("")}
            className="flex items-center gap-1.5 rounded-lg bg-violet-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-600"
          >
            <Receipt className="h-3.5 w-3.5" />
            Төлөх
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-600"
          >
            <FileDown className="h-3.5 w-3.5" />
            Тайлан татах
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-600"
          >
            <Landmark className="h-3.5 w-3.5" />
            Санхүүгийн тайлан
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-600"
          >
            <FileBarChart className="h-3.5 w-3.5" />
            СЗХ тайлан
          </button>
        </div>
      </div>

      {/* Table / empty state */}
      <div className="flex-1 overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/40 shadow-xl backdrop-blur-sm">
        {pageItems.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-900/40 text-slate-500">
              <Inbox className="h-8 w-8" />
            </div>
            <p className="text-sm font-semibold text-slate-400">Мэдээлэл байхгүй байна</p>
            <p className="max-w-xs text-xs text-slate-600">Гэрээ байгуулсны дараа энд жагсаалтаар харагдана</p>
            {onCreate && (
              <button
                type="button"
                onClick={onCreate}
                className="mt-2 rounded-lg bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-600"
              >
                Гэрээ байгуулах
              </button>
            )}
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-[#0f1321]">
                <tr className="border-b border-slate-700/50 text-slate-400">
                  <th className="px-4 py-3 font-semibold">№</th>
                  <th className="px-4 py-3 font-semibold">Гэрээний дугаар</th>
                  <th className="px-4 py-3 font-semibold">Даатгалын компани</th>
                  <th className="px-4 py-3 font-semibold">Ангилал</th>
                  <th className="px-4 py-3 font-semibold">Дэд ангилал</th>
                  <th className="px-4 py-3 font-semibold">Бүтээгдэхүүн</th>
                  <th className="px-4 py-3 font-semibold text-right">Үнэлгээ</th>
                  <th className="px-4 py-3 font-semibold text-right">Хураамж</th>
                  <th className="px-4 py-3 font-semibold">Эхлэх огноо</th>
                  <th className="px-4 py-3 font-semibold">Төлөв</th>
                  <th className="px-4 py-3 font-semibold text-center">Үйлдэл</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {pageItems.map((c, idx) => (
                  <tr key={c.id} className="transition-colors hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-slate-500">{(page - 1) * pageSize + idx + 1}</td>
                    <td className="px-4 py-3 font-semibold text-white">{c.number}</td>
                    <td className="px-4 py-3 text-slate-300">{c.companyName}</td>
                    <td className="px-4 py-3 text-slate-300">{c.categoryName}</td>
                    <td className="px-4 py-3 text-slate-300">{c.subCategory}</td>
                    <td className="px-4 py-3 text-slate-300">{c.product}</td>
                    <td className="px-4 py-3 text-right font-semibold text-white">{formatMNT(c.valuation)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-400">{formatMNT(c.premium)}</td>
                    <td className="px-4 py-3 text-slate-300">{c.startDate}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-md border px-2 py-1 text-[10px] font-semibold",
                          STATUSES[c.status].className
                        )}
                      >
                        {STATUSES[c.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                          title="Харах"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {c.status !== "paid" && onPay && (
                          <button
                            type="button"
                            onClick={() => onPay(c.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-violet-400 transition-colors hover:bg-violet-500/10"
                            title="Төлөх"
                          >
                            <Receipt className="h-4 w-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(c.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-500/10"
                            title="Устгах"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-700/50 bg-slate-800/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Мөрөөч тоо:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="h-8 rounded-lg border border-slate-700/60 bg-slate-900/40 px-2 text-xs text-white outline-none"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>
            {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} / {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-900/40 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-900/40 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
