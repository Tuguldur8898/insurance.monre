"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  Search,
  Plus,
  Eye,
  Calendar,
  Calculator,
  CreditCard,
  Save,
  ChevronDown,
  User,
  Car,
  FileDigit,
  AlertCircle,
  CheckCircle2,
  Hash,
  Award,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const COMPANIES = [
  { id: "monre", name: "Монре даатгал", rate: 9.5 },
  { id: "mig", name: "МИГ даатгал", rate: 12 },
  { id: "ard", name: "Ард даатгал", rate: 10 },
  { id: "boldog", name: "Болдог даатгал", rate: 11 },
  { id: "mongol", name: "Монгол даатгал", rate: 9 },
];

const CATEGORIES = [
  { id: "auto", name: "Авто тээврийн хэрэгслийн даатгал", sub: ["Машин механизмын даатгал", "Мотоциклийн даатгал", "Авто тээврийн хэрэгслийн даатгал", "Хүнд даацын тээврийн хэрэгслийн даатгал"] },
  { id: "official", name: "Албан журмын даатгал", sub: ["Албан журмын хариуцлагын даатгал", "Албан журмын эмнэлгийн даатгал"] },
  { id: "cargo", name: "Ачааны даатгал", sub: ["Олон улсын ачааны даатгал", "Дотоодын ачааны даатгал", "Тээврийн хэрэгслийн даатгал"] },
  { id: "agriculture", name: "Газар тариалангийн даатгал", sub: ["Ургацын даатгал", "Малын даатгал", "Тариалангийн хөрөнгийн даатгал"] },
  { id: "accident", name: "Гэнэтийн осол, эмчилгээний зардал", sub: ["Гэнэтийн ослын даатгал", "Эмчилгээний зардалын даатгал", "Амь насыны даатгал"] },
  { id: "liability", name: "Хариуцлагын даатгал", sub: ["Гэрээслэлийн хариуцлага", "Мэргэжлийн хариуцлага", "Байгууллагын хариуцлага"] },
  { id: "property", name: "Хөрөнгийн даатгал", sub: ["Барилгын даатгал", "Тоног төхөөрөмжийн даатгал", "Агуулахын даатгал"] },
];

const PRODUCTS = ["Basic", "Standard", "Premium"];
const PACKAGES = ["Эко багц", "Гэр бүлийн багц", "Бизнес багц"];
const DURATIONS = ["1 Жил", "2 Жил", "3 Жил"];
const ADDITIONAL_OPTIONS = ["Нэмэлт үнийн мэдээлэл", "Чиргүүл үйлчилгээ", "Түрээсийн тэрэг", "Хуулийн туслалцаа"];

function formatMNT(n: number) {
  return "₮" + n.toLocaleString("mn-MN");
}

export function ContractForm({ onBack }: { onBack?: () => void }) {
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [product, setProduct] = useState("");
  const [packageId, setPackageId] = useState("");
  const [valuation, setValuation] = useState("");
  const [startDate, setStartDate] = useState("2026-07-24");
  const [duration, setDuration] = useState("1 Жил");
  const [additional, setAdditional] = useState("");
  const [description, setDescription] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [engineNumber, setEngineNumber] = useState("");
  const [driverOpen, setDriverOpen] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [experience, setExperience] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseNumber2, setLicenseNumber2] = useState("");
  const [showPackage, setShowPackage] = useState(false);
  const [touched, setTouched] = useState(false);

  // Subcategory-specific vehicle fields
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vinNumber, setVinNumber] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [passengerCount, setPassengerCount] = useState("");
  const [loadCapacity, setLoadCapacity] = useState("");
  const [trailerCount, setTrailerCount] = useState("");
  const [routeInfo, setRouteInfo] = useState("");

  const selectedCompany = COMPANIES.find((c) => c.id === company);
  const selectedCategory = CATEGORIES.find((c) => c.id === category);
  const isAuto = category === "auto";
  const valuationNum = valuation === "" ? 0 : Number(valuation);
  const basePremium = useMemo(() => {
    if (!selectedCompany || !valuationNum) return 0;
    return Math.round((valuationNum * selectedCompany.rate) / 100);
  }, [valuationNum, selectedCompany]);

  const isValid = company && category && subCategory && product && valuationNum > 0;

  return (
    <div className="min-h-screen bg-[#0b0f19] p-4 text-slate-200 lg:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800/40 text-slate-400 transition-all hover:border-slate-500 hover:bg-slate-700/50 hover:text-white"
            >
              <ChevronDown className="h-5 w-5 -rotate-90" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white lg:text-2xl">Шинэ гэрээ байгуулах</h1>
            <p className="mt-1 text-xs text-slate-500">Даатгалын мэдээлэл оруулж, хураамж тооцоолно</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          {/* LEFT COLUMN */}
          <div className="space-y-5">
            {/* Insurance details card */}
            <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-5 shadow-xl backdrop-blur-sm">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
                  <Building2 className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-sm font-bold text-white">Даатгалын мэдээлэл</h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Даатгалын компани <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={company}
                    onChange={(e) => {
                      setCompany(e.target.value);
                      setTouched(true);
                    }}
                    className={cn(
                      "w-full rounded-xl border bg-slate-800/60 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
                      touched && !company ? "border-red-500/50" : "border-slate-700/60"
                    )}
                  >
                    <option value="">Компани сонгох</option>
                    {COMPANIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {touched && !company && <p className="text-xs text-red-400">Шаардлагатай</p>}
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
                      setTouched(true);
                    }}
                    className={cn(
                      "w-full rounded-xl border bg-slate-800/60 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
                      touched && !category ? "border-red-500/50" : "border-slate-700/60"
                    )}
                  >
                    <option value="">Ангилал сонгох</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {touched && !category && <p className="text-xs text-red-400">Шаардлагатай</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Дэд ангилал <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={subCategory}
                    onChange={(e) => {
                      setSubCategory(e.target.value);
                      setTouched(true);
                    }}
                    disabled={!category}
                    className={cn(
                      "w-full rounded-xl border bg-slate-800/60 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
                      !category
                        ? "cursor-not-allowed border-slate-700/30 bg-slate-800/30 text-slate-500"
                        : touched && !subCategory
                          ? "border-red-500/50"
                          : "border-slate-700/60 hover:border-slate-500"
                    )}
                  >
                    <option value="">{category ? "Дэд ангилал сонгох" : "Эхлээд ангилал сонгоно уу"}</option>
                    {selectedCategory?.sub.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {touched && !subCategory && <p className="text-xs text-red-400">Шаардлагатай</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Бүтээгдэхүүн сонгох <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={product}
                    onChange={(e) => {
                      setProduct(e.target.value);
                      setTouched(true);
                    }}
                    className={cn(
                      "w-full rounded-xl border bg-slate-800/60 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
                      touched && !product ? "border-red-500/50" : "border-slate-700/60"
                    )}
                  >
                    <option value="">Бүтээгдэхүүн сонгох</option>
                    {PRODUCTS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  {touched && !product && <p className="text-xs text-red-400">Шаардлагатай</p>}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Багц сонгох <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={packageId}
                      onChange={(e) => setPackageId(e.target.value)}
                      className={cn(
                        "flex-1 rounded-xl border bg-slate-800/60 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
                        touched && !packageId ? "border-red-500/50" : "border-slate-700/60"
                      )}
                    >
                      <option value="">Багц сонгох</option>
                      {PACKAGES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowPackage((v) => !v)}
                      className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-slate-700"
                    >
                      <Eye className="h-4 w-4" />
                      Багц харах
                    </button>
                  </div>
                </div>
              </div>

              {showPackage && (
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {PACKAGES.map((p) => (
                    <div
                      key={p}
                      onClick={() => setPackageId(p)}
                      className={cn(
                        "cursor-pointer rounded-xl border p-3 transition-all hover:border-slate-500",
                        packageId === p
                          ? "border-indigo-500 bg-indigo-500/10"
                          : "border-slate-700/50 bg-slate-800/40"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{p}</span>
                        {packageId === p && <CheckCircle2 className="h-4 w-4 text-indigo-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {isAuto && subCategory !== "Мотоциклийн даатгал" && subCategory !== "" && (
              <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-5 shadow-xl backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                    <Car className="h-4.5 w-4.5" />
                  </div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {subCategory === "Хүнд даацын тээврийн хэрэгслийн даатгал"
                      ? "Хүнд даацын тээврийн хэрэгсэл"
                      : "Тээврийн хэрэгслийн мэдээлэл"}
                  </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Регистрийн дугаар <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={regNumber}
                          onChange={(e) => setRegNumber(e.target.value)}
                          placeholder="УУ00000000"
                          className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 pl-9 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        />
                        <FileDigit className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      </div>
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white transition-all hover:bg-indigo-600"
                      >
                        <Search className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600 bg-slate-700/50 text-white transition-all hover:bg-slate-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Үнсэн дугаар <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={engineNumber}
                        onChange={(e) => setEngineNumber(e.target.value)}
                        placeholder="0000VBA"
                        className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 pl-9 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                      <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                  </div>

                  {(subCategory === "Машин механизмын даатгал" ||
                    subCategory === "Хүнд даацын тээврийн хэрэгслийн даатгал") && (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Марка</label>
                        <input
                          type="text"
                          value={vehicleBrand}
                          onChange={(e) => setVehicleBrand(e.target.value)}
                          placeholder="Toyota"
                          className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Загвар</label>
                        <input
                          type="text"
                          value={vehicleModel}
                          onChange={(e) => setVehicleModel(e.target.value)}
                          placeholder="Land Cruiser"
                          className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        />
                      </div>
                    </>
                  )}

                  {subCategory === "Машин механизмын даатгал" && (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Үйлдвэрлэсэн он</label>
                        <input
                          type="number"
                          value={vehicleYear}
                          onChange={(e) => setVehicleYear(e.target.value)}
                          placeholder="2020"
                          className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Арлын дугаар (VIN)</label>
                        <input
                          type="text"
                          value={vinNumber}
                          onChange={(e) => setVinNumber(e.target.value)}
                          placeholder="JT3DB..."
                          className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        />
                      </div>
                    </>
                  )}

                  {subCategory === "Авто тээврийн хэрэгслийн даатгал" && (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Тээврийн хэрэгслийн төрөл</label>
                        <select
                          value={vehicleType}
                          onChange={(e) => setVehicleType(e.target.value)}
                          className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        >
                          <option value="">Төрөл сонгох</option>
                          <option value="sedan">Седан</option>
                          <option value="suv">Джип/SUV</option>
                          <option value="minivan">Микроавтобус</option>
                          <option value="bus">Автобус</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Дугаарын дугаар</label>
                        <input
                          type="text"
                          value={licensePlate}
                          onChange={(e) => setLicensePlate(e.target.value)}
                          placeholder="УБА-0000"
                          className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Суудлын тоо</label>
                        <input
                          type="number"
                          value={passengerCount}
                          onChange={(e) => setPassengerCount(e.target.value)}
                          placeholder="4"
                          className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        />
                      </div>
                    </>
                  )}

                  {subCategory === "Хүнд даацын тээврийн хэрэгслийн даатгал" && (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Ачилтын даац (тонн)</label>
                        <input
                          type="number"
                          value={loadCapacity}
                          onChange={(e) => setLoadCapacity(e.target.value)}
                          placeholder="10"
                          className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Чиргүүлийн тоо</label>
                        <input
                          type="number"
                          value={trailerCount}
                          onChange={(e) => setTrailerCount(e.target.value)}
                          placeholder="0"
                          className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-300">Чиглэл/зам</label>
                        <input
                          type="text"
                          value={routeInfo}
                          onChange={(e) => setRouteInfo(e.target.value)}
                          placeholder="Улаанбаатар - Эрдэнэт"
                          className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Driver additional info accordion */}
            <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-5 shadow-xl backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setDriverOpen((v) => !v)}
                className="flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                    <Award className="h-4.5 w-4.5" />
                  </div>
                  <h2 className="text-sm font-bold text-white">Жолоочийн нэмэлт мэдээлэл</h2>
                </div>
                <ChevronDown
                  className={cn("h-5 w-5 text-slate-500 transition-transform duration-200", driverOpen && "rotate-180")}
                />
              </button>

              <div
                className={cn(
                  "grid gap-5 overflow-hidden transition-all duration-300",
                  driverOpen ? "mt-5 max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Үндсэн эзэмшигчийн нэр</label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Эзэмшигчийн нэр"
                      className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Даатгуулагчийн жолоочийн туршлага жилээр</label>
                    <input
                      type="number"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="0"
                      className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Жолооны үнэмлэхийн дугаар</label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="Жолооны үнэмлэх"
                      className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Мөргөцсөн жолооны үнэмлэхийн дугаар</label>
                    <input
                      type="text"
                      value={licenseNumber2}
                      onChange={(e) => setLicenseNumber2(e.target.value)}
                      placeholder="Мөргөцсөн жолооч"
                      className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-400 transition-all hover:bg-emerald-500/20"
            >
              <Plus className="h-4 w-4" />
              Нэмэлт даатгуулагч нэмэх
            </button>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-5 shadow-xl backdrop-blur-sm">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  <Calculator className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-sm font-bold text-white">Үнэлгээ &amp; хугацаа</h2>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Үнэлгээ оруулна уу? <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={valuation}
                      onChange={(e) => {
                        setValuation(e.target.value);
                        setTouched(true);
                      }}
                      placeholder="0"
                      className={cn(
                        "w-full rounded-xl border bg-slate-800/60 px-3 py-3 pl-10 text-right text-lg font-bold text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
                        touched && !valuationNum ? "border-red-500/50" : "border-slate-700/60"
                      )}
                    />
                    <Calculator className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <span className="absolute left-10 top-1/2 -translate-y-1/2 text-xs text-slate-500">MNT</span>
                  </div>
                  {touched && !valuationNum && <p className="text-xs text-red-400">Шаардлагатай</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Эхлэх огноо</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 pl-9 text-xs text-white outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Даатгалын хугацаа</label>
                    <div className="flex gap-2">
                      {DURATIONS.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDuration(d)}
                          className={cn(
                            "flex flex-1 items-center justify-center gap-1 rounded-xl border py-2.5 text-xs font-bold transition-all",
                            duration === d
                              ? "border-indigo-500 bg-indigo-500 text-white"
                              : "border-slate-700/60 bg-slate-800/60 text-slate-400 hover:border-slate-500 hover:text-white"
                          )}
                        >
                          <Clock className="h-3.5 w-3.5" />
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Нэмэлт үнийн мэдээлэл</label>
                  <select
                    value={additional}
                    onChange={(e) => setAdditional(e.target.value)}
                    className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-xs text-white outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  >
                    <option value="">Нэмэлт үнийн мэдээлэл</option>
                    {ADDITIONAL_OPTIONS.map((a) => (
                      <option key={a} value={a}>
                        {a}
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
                    className="w-full resize-none rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>
            </div>

            {/* Summary card */}
            <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-indigo-900/20 to-slate-900/40 p-5 shadow-xl backdrop-blur-sm">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
                  <CreditCard className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-sm font-bold text-white">Тооцоо</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Хураамжийн хувь:</span>
                  <span className="text-sm font-bold text-indigo-300">{selectedCompany ? `${selectedCompany.rate}%` : "0%"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Үндсэн хураамж:</span>
                  <span className="text-sm font-bold text-white">{formatMNT(basePremium)}</span>
                </div>

                <div className="h-px bg-slate-700/50" />

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Нийт даатгалын хураамж:</span>
                  <span className="text-2xl font-extrabold text-white">{formatMNT(basePremium)}</span>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs font-bold text-indigo-300">Таны хураамж (15%)</span>
                  </div>
                  <span className="text-xl font-extrabold text-indigo-300">{formatMNT(Math.round(basePremium * 0.15))}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setTouched(true);
                  if (isValid) alert("Гэрээ амжилттай хадгалагдлаа!");
                }}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Хадгалах
              </button>

              {!isValid && touched && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-300">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Бүх шаардлагатай талбарыг бөглөнө үү.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
