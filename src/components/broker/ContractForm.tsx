"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Save,
  Eye,
  Calendar,
  FileText,
  Shield,
  Package,
  Tag,
  Calculator,
  CheckCircle2,
  CreditCard,
  Clock,
  Percent,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const COMPANIES = [
  { id: "mig", name: "МИГ даатгал", rate: 12 },
  { id: "ard", name: "Ард даатгал", rate: 10 },
  { id: "boldog", name: "Болдог даатгал", rate: 11 },
  { id: "mongol", name: "Монгол даатгал", rate: 9 },
];

const CATEGORIES = [
  { id: "auto", name: "Автомашин", sub: ["Авто даатгал", "Авто ослын даатгал"] },
  { id: "health", name: "Эрүүл мэнд", sub: ["ЭМД", "Албан байгууллагын ЭМД"] },
  { id: "travel", name: "Аялал", sub: ["Аяллын даатгал", "Олон улс аялал"] },
  { id: "liability", name: "Хариуцлага", sub: ["Гэрээслэлийн хариуцлага", "Мэргэжлийн хариуцлага"] },
];

const PRODUCTS = [
  { id: "basic", name: "Basic", features: ["Үндсэн хамгаалалт", "24/7 тусламж"] },
  { id: "standard", name: "Standard", features: ["Бүрэн хамгаалалт", "Нэмэлт үйлчилгээ"] },
  { id: "premium", name: "Premium", features: ["VIP хамгаалалт", "Дэлхий даяар тусламж"] },
];

const PACKAGES = [
  { id: "eco", name: "Эко багц", discount: 0 },
  { id: "family", name: "Гэр бүлийн багц", discount: 5 },
  { id: "business", name: "Бизнес багц", discount: 8 },
];

const DURATIONS = [
  { value: 1, label: "1 Жил" },
  { value: 2, label: "2 Жил" },
  { value: 3, label: "3 Жил" },
];

const ADDITIONAL_OPTIONS = [
  { id: "none", name: "Нэмэлт үнийн мэдээлэл", price: 0 },
  { id: "tow", name: "Чиргүүл үйлчилгээ", price: 50000 },
  { id: "rent", name: "Түрээсийн тэрэгний зардал", price: 120000 },
  { id: "legal", name: "Хуулийн туслалцаа", price: 80000 },
];

function formatMNT(n: number) {
  return "₮" + n.toLocaleString("mn-MN");
}

export function ContractForm({ onBack }: { onBack?: () => void }) {
  const [step, setStep] = useState(1);
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [product, setProduct] = useState("");
  const [packageId, setPackageId] = useState("");
  const [valuation, setValuation] = useState<number | "">("");
  const [startDate, setStartDate] = useState("2026-07-24");
  const [duration, setDuration] = useState(1);
  const [additional, setAdditional] = useState("none");
  const [description, setDescription] = useState("");
  const [showPackagePreview, setShowPackagePreview] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const selectedCompany = COMPANIES.find((c) => c.id === company);
  const selectedCategory = CATEGORIES.find((c) => c.id === category);
  const selectedProduct = PRODUCTS.find((p) => p.id === product);
  const selectedPackage = PACKAGES.find((p) => p.id === packageId);
  const selectedAdditional = ADDITIONAL_OPTIONS.find((a) => a.id === additional);

  const basePremium = useMemo(() => {
    const val = typeof valuation === "number" ? valuation : 0;
    if (!val || !selectedCompany) return 0;
    return Math.round((val * selectedCompany.rate) / 100);
  }, [valuation, selectedCompany]);

  const additionalPrice = selectedAdditional?.price ?? 0;
  const packageDiscount = selectedPackage?.discount ?? 0;
  const discountAmount = Math.round((basePremium * packageDiscount) / 100);
  const totalPremium = basePremium - discountAmount + additionalPrice;
  const commissionRate = 15;
  const commission = Math.round(totalPremium * (commissionRate / 100));

  const allSteps = [
    { id: 1, title: "Даатгал сонгох", icon: Shield },
    { id: 2, title: "Багц тохируулах", icon: Package },
    { id: 3, title: "Төлбөр тооцоо", icon: CreditCard },
  ];

  const isStep1Valid = company && category && subCategory && product;
  const isStep2Valid = packageId && valuation && startDate;
  const isStep3Valid = agreed;

  return (
    <div className="min-h-screen bg-[#0b0f19] p-4 text-slate-200 lg:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white lg:text-2xl">
                Шинэ гэрээ байгуулах
              </h1>
              <p className="mt-1 text-xs text-slate-500">Даатгалын мэдээлэл оруулж, хураамж тооцоолно</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            {allSteps.map((s) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isDone = step > s.id;
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                      isActive
                        ? "bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/30"
                        : isDone
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-slate-800 text-slate-500"
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Icon className="h-3.5 w-3.5" />
                    )}
                    <span className="hidden md:inline">{s.title}</span>
                  </div>
                  {s.id !== allSteps.length && (
                    <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Main form */}
          <div className="space-y-6">
            {/* Step 1: Insurance selection */}
            {step === 1 && (
              <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                <div className="mb-5 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Shield className="h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-bold text-white">Даатгалын мэдээлэл</h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="flex items-center gap-1 text-xs font-semibold text-slate-300">
                      Даатгалын компани <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {COMPANIES.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setCompany(c.id)}
                          className={cn(
                            "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-all",
                            company === c.id
                              ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                              : "border-slate-700/60 bg-slate-800/60 text-slate-400 hover:border-slate-600 hover:bg-slate-700/50"
                          )}
                        >
                          <Building2 className="h-3.5 w-3.5" />
                          <span className="truncate">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Ангилал <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setSubCategory("");
                      }}
                      className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-xs text-white outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                    >
                      <option value="">Ангилал сонгох</option>
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Дэд ангилал <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      disabled={!category}
                      className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-xs text-white outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Дэд ангилал сонгох</option>
                      {selectedCategory?.sub.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Бүтээгдэхүүн сонгох <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {PRODUCTS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setProduct(p.id)}
                          className={cn(
                            "rounded-xl border px-2 py-2.5 text-center text-xs font-medium transition-all",
                            product === p.id
                              ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                              : "border-slate-700/60 bg-slate-800/60 text-slate-400 hover:border-slate-600 hover:bg-slate-700/50"
                          )}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedProduct && (
                  <div className="mt-5 rounded-xl border border-slate-700/40 bg-slate-800/60 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold text-white">
                      <Tag className="h-3.5 w-3.5 text-indigo-400" />
                      {selectedProduct.name} бүтээгдэхүүний онцлог
                    </div>
                    <ul className="space-y-1.5">
                      {selectedProduct.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-slate-400">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    disabled={!isStep1Valid}
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Үргэлжлүүлэх
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Package & details */}
            {step === 2 && (
              <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                <div className="mb-5 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Package className="h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-bold text-white">Багц ба хугацаа</h2>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Багц сонгох</label>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {PACKAGES.map((pkg) => (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setPackageId(pkg.id)}
                          className={cn(
                            "relative rounded-xl border p-3 text-left transition-all",
                            packageId === pkg.id
                              ? "border-indigo-500 bg-indigo-500/10"
                              : "border-slate-700/60 bg-slate-800/60 hover:border-slate-600 hover:bg-slate-700/50"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className={cn("text-xs font-bold", packageId === pkg.id ? "text-indigo-300" : "text-white")}>
                              {pkg.name}
                            </span>
                            {pkg.discount > 0 && (
                              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                                -{pkg.discount}%
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-[10px] text-slate-500">
                            {pkg.discount > 0 ? `${pkg.discount}% хөнгөлөлттэй` : "Үндсэн багц"}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Үнэлгээ оруулах</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={valuation}
                          onChange={(e) => setValuation(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="0"
                          className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 pl-9 text-sm font-bold text-white outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                        />
                        <Calculator className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">MNT</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Эхлэх огноо</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 pl-9 text-xs text-white outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                        />
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Даатгалын хугацаа</label>
                    <div className="flex flex-wrap gap-2">
                      {DURATIONS.map((d) => (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => setDuration(d.value)}
                          className={cn(
                            "flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold transition-all",
                            duration === d.value
                              ? "border-indigo-500 bg-indigo-500 text-white"
                              : "border-slate-700/60 bg-slate-800/60 text-slate-400 hover:border-slate-600 hover:bg-slate-700/50"
                          )}
                        >
                          <Clock className="h-3.5 w-3.5" />
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Нэмэлт үнийн мэдээлэл</label>
                    <select
                      value={additional}
                      onChange={(e) => setAdditional(e.target.value)}
                      className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-xs text-white outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                    >
                      {ADDITIONAL_OPTIONS.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} {a.price > 0 ? `(+${formatMNT(a.price)})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Тайлбар</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Нэмэлт тайлбар оруулах..."
                      className="w-full resize-none rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-xs text-white outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-2.5 text-xs font-bold text-slate-300 transition-colors hover:bg-slate-700/50"
                  >
                    Буцах
                  </button>
                  <button
                    type="button"
                    disabled={!isStep2Valid}
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Үргэлжлүүлэх
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & save */}
            {step === 3 && (
              <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                <div className="mb-5 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                    <FileText className="h-4 w-4" />
                  </div>
                  <h2 className="text-sm font-bold text-white">Гэрээний тойм</h2>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Даатгалын компани", value: selectedCompany?.name ?? "—" },
                    { label: "Ангилал", value: selectedCategory?.name ?? "—" },
                    { label: "Дэд ангилал", value: subCategory || "—" },
                    { label: "Бүтээгдэхүүн", value: selectedProduct?.name ?? "—" },
                    { label: "Багц", value: selectedPackage?.name ?? "—" },
                    { label: "Үнэлгээ", value: typeof valuation === "number" ? formatMNT(valuation) : "—" },
                    { label: "Эхлэх огноо", value: startDate },
                    { label: "Хугацаа", value: `${duration} жил` },
                    { label: "Нэмэлт үйлчилгээ", value: selectedAdditional?.name ?? "—" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between border-b border-slate-700/40 pb-2.5 last:border-0 last:pb-0">
                      <span className="text-xs text-slate-500">{row.label}</span>
                      <span className="text-xs font-bold text-white">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-start gap-2">
                  <input
                    id="agree"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500/30"
                  />
                  <label htmlFor="agree" className="text-xs leading-relaxed text-slate-400">
                    Мэдээлэл бүрэн зөв бөгөөд гэрээ байгуулахыг зөвшөөрч байна.
                  </label>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-2.5 text-xs font-bold text-slate-300 transition-colors hover:bg-slate-700/50"
                  >
                    Буцах
                  </button>
                  <button
                    type="button"
                    disabled={!isStep3Valid}
                    onClick={() => alert("Гэрээ амжилттай хадгалагдлаа!")}
                    className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    Хадгалах
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right side: live calculation + package preview */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Calculator className="h-4 w-4" />
                </div>
                <h2 className="text-sm font-bold text-white">Тооцоо</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Хураамжийн хувь</span>
                  <span className="text-xs font-bold text-white">
                    {selectedCompany ? `${selectedCompany.rate}%` : "0%"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Үндсэн хураамж</span>
                  <span className="text-xs font-bold text-white">{formatMNT(basePremium)}</span>
                </div>
                {selectedPackage && selectedPackage.discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="text-xs">{selectedPackage.name} хөнгөлөлт</span>
                    <span className="text-xs font-bold">-{formatMNT(discountAmount)}</span>
                  </div>
                )}
                {selectedAdditional && selectedAdditional.price > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{selectedAdditional.name}</span>
                    <span className="text-xs font-bold text-white">+{formatMNT(selectedAdditional.price)}</span>
                  </div>
                )}
                <div className="my-3 h-px bg-slate-700/50" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Нийт даатгалын хураамж</span>
                  <span className="text-lg font-extrabold text-white">{formatMNT(totalPremium)}</span>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs font-bold text-indigo-300">Таны хураамж ({commissionRate}%)</span>
                  </div>
                  <span className="text-lg font-extrabold text-indigo-300">{formatMNT(commission)}</span>
                </div>
                <p className="mt-2 text-[10px] text-indigo-200/70">
                  Борлуулсан даатгалын хураамжийн {commissionRate}% танд хүртэх орлого.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPackagePreview((v) => !v)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-2.5 text-xs font-bold text-slate-300 transition-colors hover:bg-slate-700/50"
            >
              <Eye className="h-4 w-4" />
              {showPackagePreview ? "Багц хаах" : "Багц харах"}
            </button>

            {showPackagePreview && (
              <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5">
                <h3 className="mb-3 text-xs font-bold text-white">Багцын дэлгэрэнгүй</h3>
                <div className="space-y-2">
                  {PACKAGES.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={cn(
                        "rounded-xl border p-3 text-xs transition-colors",
                        packageId === pkg.id ? "border-indigo-500 bg-indigo-500/10" : "border-slate-700/40 bg-slate-800/40"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{pkg.name}</span>
                        {pkg.discount > 0 && (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            -{pkg.discount}%
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[10px] text-slate-500">
                        {pkg.discount > 0 ? `${pkg.discount}% хөнгөлөлттэй багц` : "Үндсэн хамрах хүрээ"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isStep1Valid && step === 1 && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Даатгалын компани, ангилал, дэд ангилал, бүтээгдэхүүн сонгоно уу.</span>
              </div>
            )}

            {!isStep2Valid && step === 2 && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Багц, үнэлгээ, эхлэх огноо оруулна уу.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
