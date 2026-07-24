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

// Mock vehicle registry data (replace with DAN/HUR API integration later)
type VehicleInfo = { brand: string; model: string; year: string; plate: string; vin: string; engine: string; type: string; seats: string };
const MOCK_VEHICLE_REGISTRY: Record<string, VehicleInfo[]> = {
  УУ00000000: [
    { brand: "Toyota", model: "Land Cruiser 200", year: "2019", plate: "УБА-1234", vin: "JT3DB03E0B0000001", engine: "1VD-000000", type: "suv", seats: "7" },
    { brand: "Lexus", model: "LX570", year: "2020", plate: "УББ-5678", vin: "JTJHY00B0B4000001", engine: "3UR-000000", type: "suv", seats: "8" },
  ],
  УУ88888888: [
    { brand: "Hyundai", model: "Santa Fe", year: "2018", plate: "УХА-9999", vin: "KMHSH81DDBU000001", engine: "D4HB-000000", type: "suv", seats: "5" },
  ],
  АА11111111: [
    { brand: "Mercedes-Benz", model: "Actros 1845", year: "2021", plate: "АА-1111", vin: "WDB9634231L000001", engine: "OM471-000000", type: "truck", seats: "2" },
  ],
};

const DEFAULT_VEHICLE = { brand: "", model: "", year: "", plate: "", vin: "", engine: "", type: "", seats: "" };

function formatMNT(n: number) {
  return "₮" + n.toLocaleString("mn-MN");
}

function AddOnList({
  title,
  items,
  setItems,
  labelName,
  labelValue,
  placeholderName,
  placeholderValue,
}: {
  title: string;
  items: { name: string; value: string }[];
  setItems: (items: { name: string; value: string }[]) => void;
  labelName: string;
  labelValue: string;
  placeholderName: string;
  placeholderValue: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300">{title}</label>
        <button
          type="button"
          onClick={() => setItems([...items, { name: "", value: "" }])}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500 text-white transition-all hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-[1fr_100px_28px] gap-2">
            <input
              type="text"
              value={item.name}
              onChange={(e) => {
                const next = [...items];
                next[idx].name = e.target.value;
                setItems(next);
              }}
              placeholder={placeholderName}
              className="w-full rounded-lg border border-slate-700/60 bg-slate-800/60 px-2.5 py-2 text-xs text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            />
            <input
              type="number"
              value={item.value}
              onChange={(e) => {
                const next = [...items];
                next[idx].value = e.target.value;
                setItems(next);
              }}
              placeholder={placeholderValue}
              className="w-full rounded-lg border border-slate-700/60 bg-slate-800/60 px-2.5 py-2 text-right text-xs text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            />
            <button
              type="button"
              onClick={() => setItems(items.filter((_, i) => i !== idx))}
              className="flex items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              ×
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-[10px] text-slate-600">{labelName} нэмэхдээ + товч дээр дарна уу</p>
        )}
      </div>
    </div>
  );
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
  const [showAddOns, setShowAddOns] = useState(false);
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
  const [vehicleSearchLoading, setVehicleSearchLoading] = useState(false);
  const [vehicleSearchResults, setVehicleSearchResults] = useState(MOCK_VEHICLE_REGISTRY["УУ00000000"]);
  const [vehicleSearchOpen, setVehicleSearchOpen] = useState(false);

  // Auto transport subcategory add-ons
  const [discountPercent, setDiscountPercent] = useState("");
  const [equipmentList, setEquipmentList] = useState<{ name: string; value: string }[]>([]);
  const [godList, setGodList] = useState<{ name: string; value: string }[]>([]);
  const [ajdList, setAjdList] = useState<{ name: string; value: string }[]>([]);
  const [customFieldsList, setCustomFieldsList] = useState<{ name: string; value: string }[]>([]);

  const selectedCompany = COMPANIES.find((c) => c.id === company);
  const selectedCategory = CATEGORIES.find((c) => c.id === category);
  const isAuto = category === "auto";
  const isAutoTransport = subCategory === "Авто тээврийн хэрэгслийн даатгал";
  const valuationNum = valuation === "" ? 0 : Number(valuation);
  const discountNum = discountPercent === "" ? 0 : Number(discountPercent);
  const additionalTotal = useMemo(() => {
    const sum = (list: { value: string }[]) => list.reduce((acc, item) => acc + (item.value === "" ? 0 : Number(item.value)), 0);
    return sum(equipmentList) + sum(godList) + sum(ajdList) + sum(customFieldsList);
  }, [equipmentList, godList, ajdList, customFieldsList]);

  const basePremium = useMemo(() => {
    if (!selectedCompany || !valuationNum) return 0;
    return Math.round((valuationNum * selectedCompany.rate) / 100);
  }, [valuationNum, selectedCompany]);

  const discountAmount = Math.round((basePremium * discountNum) / 100);
  const totalPremium = basePremium - discountAmount + additionalTotal;

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
                          onChange={(e) => {
                            setRegNumber(e.target.value);
                            setVehicleSearchOpen(false);
                          }}
                          placeholder="УУ00000000"
                          className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 pl-9 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        />
                        <FileDigit className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      </div>
                      <button
                        type="button"
                        disabled={vehicleSearchLoading}
                        onClick={() => {
                          if (!regNumber) return;
                          setVehicleSearchLoading(true);
                          setVehicleSearchOpen(false);
                          setTimeout(() => {
                            setVehicleSearchResults(MOCK_VEHICLE_REGISTRY[regNumber] ?? []);
                            setVehicleSearchLoading(false);
                            setVehicleSearchOpen(true);
                          }, 800);
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white transition-all hover:bg-indigo-600 disabled:opacity-50"
                      >
                        {vehicleSearchLoading ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600 bg-slate-700/50 text-white transition-all hover:bg-slate-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Vehicle search results dropdown */}
                    {vehicleSearchOpen && (
                      <div className="relative z-20 mt-2">
                        <div className="rounded-xl border border-slate-700/50 bg-[#0f1321] shadow-xl">
                          <div className="border-b border-slate-700/50 px-3 py-2">
                            <p className="text-xs font-bold text-white">
                              {vehicleSearchResults.length > 0
                                ? `${regNumber} -д бүртгэлийн дээрх автомашинууд`
                                : "Мэдээлэл олдсонгүй"}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {vehicleSearchResults.length > 0
                                ? "Сонгох машинаа сонгоно уу (DAN/HUR mock)"
                                : "Регистрийн дугаар шалгана уу"}
                            </p>
                          </div>
                          <div className="max-h-60 overflow-auto p-1.5">
                            {vehicleSearchResults.map((v, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setVehicleBrand(v.brand);
                                  setVehicleModel(v.model);
                                  setVehicleYear(v.year);
                                  setVinNumber(v.vin);
                                  setEngineNumber(v.engine);
                                  setLicensePlate(v.plate);
                                  setVehicleType(v.type);
                                  setPassengerCount(v.seats);
                                  setVehicleSearchOpen(false);
                                }}
                                className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-800"
                              >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                                  <Car className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="truncate text-xs font-bold text-white">
                                      {v.brand} {v.model}
                                    </span>
                                    <span className="shrink-0 text-[10px] text-slate-500">{v.year}</span>
                                  </div>
                                  <p className="mt-0.5 text-[10px] text-slate-500">
                                    Дугаар: {v.plate} · VIN: {v.vin}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => setVehicleSearchOpen(false)}
                            className="w-full border-t border-slate-700/50 px-3 py-2 text-center text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800"
                          >
                            Хаах
                          </button>
                        </div>
                      </div>
                    )}
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
                  <label className="text-xs font-semibold text-slate-300">Хөнгөлөлт</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      placeholder="0"
                      className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 pr-10 text-right text-sm font-bold text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">Хувь</span>
                  </div>
                </div>

            {isAutoTransport && showAddOns && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setShowAddOns((v) => !v)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-all",
                        showAddOns
                          ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                          : "border-slate-700/60 bg-slate-800/60 text-slate-300 hover:border-slate-500 hover:text-white"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Нэмэлт үнийн мэдээлэл
                      </span>
                      <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", showAddOns && "rotate-180")} />
                    </button>
                  </div>
                )}

                {!isAutoTransport && (
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
                )}

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

            {/* Auto transport add-ons */}
            {isAutoTransport && (
              <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-5 shadow-xl backdrop-blur-sm">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400">
                    <Calculator className="h-4.5 w-4.5" />
                  </div>
                  <h2 className="text-sm font-bold text-white">Нэмэлт үнийн мэдээлэл</h2>
                </div>
                <div className="space-y-5">
                  <AddOnList
                    title="Тоног нэмэх"
                    items={equipmentList}
                    setItems={setEquipmentList}
                    labelName="Тоног"
                    labelValue="Үнэ"
                    placeholderName="Тоногийн нэр"
                    placeholderValue="0"
                  />
                  <AddOnList
                    title="ГОД"
                    items={godList}
                    setItems={setGodList}
                    labelName="Улс"
                    labelValue="Үнэ"
                    placeholderName="Улс"
                    placeholderValue="0"
                  />
                  <AddOnList
                    title="АЖД"
                    items={ajdList}
                    setItems={setAjdList}
                    labelName="АЖД"
                    labelValue="Үнэ"
                    placeholderName="Албан журмын нэр"
                    placeholderValue="0"
                  />
                  <AddOnList
                    title="Custom fields"
                    items={customFieldsList}
                    setItems={setCustomFieldsList}
                    labelName="Талбар"
                    labelValue="Үнэ"
                    placeholderName="Талбарын нэр"
                    placeholderValue="0"
                  />
                </div>
              </div>
            )}

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
                {discountNum > 0 && (
                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="text-xs">Хөнгөлөлт ({discountNum}%)</span>
                    <span className="text-sm font-bold">-{formatMNT(discountAmount)}</span>
                  </div>
                )}
                {additionalTotal > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Нэмэлт үнийн мэдээлэл:</span>
                    <span className="text-sm font-bold text-white">+{formatMNT(additionalTotal)}</span>
                  </div>
                )}

                <div className="h-px bg-slate-700/50" />

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Нийт даатгалын хураамж:</span>
                  <span className="text-2xl font-extrabold text-white">{formatMNT(totalPremium)}</span>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs font-bold text-indigo-300">Таны хураамж (15%)</span>
                  </div>
                  <span className="text-xl font-extrabold text-indigo-300">{formatMNT(Math.round(totalPremium * 0.15))}</span>
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
