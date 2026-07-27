"use client";

import { useMemo, useRef, useState } from "react";
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
  Pencil,
  Image as ImageIcon,
  FileText,
  X,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, isValidLicensePlate, formatLicensePlateInput } from "@/lib/utils";
import { downloadContractDocx } from "@/lib/contract-docx";

function formatMNT(n: number) {
  return "₮" + n.toLocaleString("mn-MN");
}

export type Contract = {
  id: string;
  number: string;
  companyId: string;
  companyName: string;
  companyRate: number;
  branchId?: string;
  branchName?: string;
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
  status: "draft" | "active" | "paid" | "expired" | "canceled";
  createdAt: string;
  // Insured
  insuredName?: string;
  insuredRegister?: string;
  insuredAddress?: string;
  insuredPhone?: string;
  // Insurer / broker
  insurerName?: string;
  insurerRegister?: string;
  insurerLicense?: string;
  insurerAddress?: string;
  insurerPhone?: string;
  // Vehicle
  ownerName?: string;
  licensePlate?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehicleColor?: string;
  vinNumber?: string;
  vehiclePurpose?: string;
  vehicleFuel?: string;
  vehicleImportYear?: string;
  vehicleEngineCapacity?: string;
  isAjd: boolean;
  coDrivers?: { name: string; reg: string }[];
  isLimitedCoverage?: boolean;
  hasTrailer?: boolean;
  images?: string[];
  customerType?: "individual" | "legal";
  source?: string;
  channel?: string;
};

const PAGE_SIZES = [10, 25, 50, 100];

const STATUSES: Record<Contract["status"], { label: string; className: string }> = {
  draft: { label: "Ноорог", className: "border-slate-700/60 bg-slate-800/60 text-slate-400" },
  active: { label: "Идэвхитэй", className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
  paid: { label: "Төлсөн", className: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400" },
  expired: { label: "Дууссан", className: "border-amber-500/30 bg-amber-500/10 text-amber-400" },
  canceled: { label: "Цуцлагдсан", className: "border-red-500/30 bg-red-500/10 text-red-400" },
};

type ContractListProps = {
  contracts: Contract[];
  companies: { id: string; name: string; rate: number; branches: { id: string; name: string }[] }[];
  categories: { id: string; name: string; sub: string[] }[];
  title?: string;
  isAjd?: boolean;
  onCreate?: () => void;
  onEdit?: (contract: Contract) => void;
  onPay?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRefresh?: () => void;
  onUpdate?: (contract: Contract) => void;
};

export function ContractList({
  contracts,
  companies,
  categories,
  title = "Гэрээний жагсаалт",
  isAjd,
  onCreate,
  onEdit,
  onPay,
  onDelete,
  onRefresh,
  onUpdate,
}: ContractListProps) {
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [plateModalOpen, setPlateModalOpen] = useState(false);
  const [plateContract, setPlateContract] = useState<Contract | null>(null);
  const [plateInput, setPlateInput] = useState("");

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageContract, setImageContract] = useState<Contract | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

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
            <option value="canceled">Цуцлагдсан</option>
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
            onClick={() => {
              const latest = filtered[0];
              if (latest) downloadContractDocx(latest);
            }}
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
                  <th className="px-4 py-3 font-semibold">Ангилал</th>
                  <th className="px-4 py-3 font-semibold">Гэрээний дугаар</th>
                  <th className="px-4 py-3 font-semibold">Регистрийн дугаар</th>
                  <th className="px-4 py-3 font-semibold">Улсын дугаар</th>
                  <th className="px-4 py-3 font-semibold">Статус</th>
                  <th className="px-4 py-3 font-semibold">Даатгалын компани</th>
                  <th className="px-4 py-3 font-semibold">Салбарын нэр</th>
                  <th className="px-4 py-3 font-semibold text-right">Нийт төлбөр</th>
                  <th className="px-4 py-3 font-semibold">Эх үүсвэр</th>
                  <th className="px-4 py-3 font-semibold">channel</th>
                  <th className="px-4 py-3 font-semibold">Бүртгэгдсэн огноо</th>
                  <th className="px-4 py-3 font-semibold text-center">Үйлдэл</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {pageItems.map((c, idx) => (
                  <tr key={c.id} className="transition-colors hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-slate-300">{c.categoryName}</td>
                    <td className="px-4 py-3 font-semibold text-white">{c.number}</td>
                    <td className="px-4 py-3 text-slate-300">{c.insuredRegister || "-"}</td>
                    <td className="px-4 py-3 text-slate-300">{c.licensePlate || "-"}</td>
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
                    <td className="px-4 py-3 text-slate-300">{c.companyName}</td>
                    <td className="px-4 py-3 text-slate-300">{c.branchName || "-"}</td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-400">{formatMNT(c.premium)}</td>
                    <td className="px-4 py-3 text-slate-300">{c.source || "Веб"}</td>
                    <td className="px-4 py-3 text-slate-300">{c.channel || "Insure веб"}</td>
                    <td className="px-4 py-3 text-slate-300">{c.createdAt.replace("T", " ").slice(0, 19)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => downloadContractDocx(c)}
                          className="group relative flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400 transition-all hover:bg-blue-500 hover:text-white"
                          title="Гэрээ татах"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit?.(c)}
                          className="group relative flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 transition-all hover:bg-amber-500 hover:text-white"
                          title="Гэрээ шинэчлэх"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPlateContract(c);
                            setPlateInput(c.licensePlate || "");
                            setPlateModalOpen(true);
                          }}
                          className="group relative flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400 transition-all hover:bg-sky-500 hover:text-white"
                          title="Улсын дугаар засах"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setImageContract(c);
                            setImagePreviews(c.images || []);
                            setImageModalOpen(true);
                          }}
                          className="group relative flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 transition-all hover:bg-emerald-500 hover:text-white"
                          title="Зураг"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="group relative flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/15 text-teal-400 transition-all hover:bg-teal-500 hover:text-white"
                          title="Буцаан олголт"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(c.id)}
                            className="group relative flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/15 text-red-400 transition-all hover:bg-red-500 hover:text-white"
                            title="Гэрээ цуцлах"
                          >
                            <X className="h-4 w-4" />
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

      <AnimatePresence>
        {plateModalOpen && plateContract && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setPlateModalOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/60 shadow-2xl backdrop-blur-md"
            >
              <div className="border-b border-slate-700/50 bg-[#0f1321]/80 px-5 py-4">
                <h3 className="text-base font-bold text-white">Улсын дугаар засах</h3>
                <p className="mt-1 text-xs text-slate-400">Тээврийн хэрэгслийн улсын дугаарыг засах</p>
              </div>

              <div className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">ГЭРЭЭНИЙ ДУГААР</label>
                    <input
                      type="text"
                      readOnly
                      value={plateContract.number}
                      className="w-full rounded-xl border border-slate-700/60 bg-slate-900/40 px-3 py-2.5 text-sm font-semibold text-white outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">ОДООГИЙН ДУГААР</label>
                    <input
                      type="text"
                      readOnly
                      value={plateContract.licensePlate || ""}
                      className="w-full rounded-xl border border-slate-700/60 bg-slate-900/40 px-3 py-2.5 text-sm font-semibold text-white outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Улсын дугаар <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={plateInput}
                    onChange={(e) => setPlateInput(formatLicensePlateInput(e.target.value))}
                    placeholder="1234UBA"
                    className={cn(
                      "w-full rounded-xl border bg-slate-800/60 px-3 py-2.5 text-sm font-bold uppercase text-white placeholder-slate-600 outline-none transition-all focus:ring-2",
                      plateInput && !isValidLicensePlate(plateInput)
                        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-700/60 focus:border-indigo-500 focus:ring-indigo-500/10"
                    )}
                  />
                  {plateInput && !isValidLicensePlate(plateInput) && (
                    <p className="text-xs text-red-400">Формат: 4 тоо + 3 үсэг (жишээ: 1234UBA)</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-700/50 bg-[#0f1321]/80 px-5 py-4">
                <button
                  type="button"
                  onClick={() => setPlateModalOpen(false)}
                  className="rounded-lg border border-slate-700/60 bg-slate-800/60 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                >
                  Цуцлах
                </button>
                <button
                  type="button"
                  disabled={!isValidLicensePlate(plateInput)}
                  onClick={() => {
                    onUpdate?.({ ...plateContract, licensePlate: plateInput });
                    setPlateModalOpen(false);
                  }}
                  className="rounded-lg bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Хадгалах
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {imageModalOpen && imageContract && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setImageModalOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/60 shadow-2xl backdrop-blur-md"
            >
              <div className="flex items-center justify-between border-b border-slate-700/50 bg-[#0f1321]/80 px-5 py-4">
                <div>
                  <h3 className="text-base font-bold text-white">Гэрээний зураг</h3>
                  <p className="mt-1 text-xs text-slate-400">Зөвхөн PNG, JPG зургуудыг оруулна уу</p>
                </div>
                <button
                  type="button"
                  onClick={() => setImageModalOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="min-h-0 flex-1 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    Нийт: {imagePreviews.length}/8
                  </span>
                  <label className="cursor-pointer rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-600">
                    Зураг нэмэх
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const remaining = 8 - imagePreviews.length;
                        const toProcess = files.slice(0, remaining);
                        if (toProcess.length === 0) return;
                        const readers = toProcess.map((file) => {
                          return new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result as string);
                            reader.readAsDataURL(file);
                          });
                        });
                        Promise.all(readers).then((results) => {
                          setImagePreviews((prev) => [...prev, ...results].slice(0, 8));
                        });
                        if (imageInputRef.current) imageInputRef.current.value = "";
                      }}
                    />
                  </label>
                </div>

                {imagePreviews.length === 0 ? (
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700/60 bg-slate-900/40 text-center transition-colors hover:border-slate-500 hover:bg-slate-800/40"
                  >
                    <ImageIcon className="h-8 w-8 text-slate-600" />
                    <p className="text-xs font-medium text-slate-500">Зураг оруулахын тулд дарна уу</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {imagePreviews.map((src, idx) => (
                      <div key={idx} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/40">
                        <img src={src} alt={`Зураг ${idx + 1}`} className="h-full w-full object-cover" />
                        <a
                          href={src}
                          download={`contract-image-${idx + 1}.png`}
                          className="absolute bottom-1.5 left-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/80 text-white opacity-0 transition-opacity hover:bg-indigo-500 group-hover:opacity-100"
                          title="Татах"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => setImagePreviews((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/80 text-white opacity-0 transition-opacity hover:bg-red-500 group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-700/50 bg-[#0f1321]/80 px-5 py-4">
                <button
                  type="button"
                  onClick={() => setImageModalOpen(false)}
                  className="rounded-lg border border-slate-700/60 bg-slate-800/60 px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                >
                  Хаах
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdate?.({ ...imageContract, images: imagePreviews });
                    setImageModalOpen(false);
                  }}
                  className="rounded-lg bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-600"
                >
                  Хадгалах
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
