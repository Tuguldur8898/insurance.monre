"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Building2,
  Search,
  Plus,
  Eye,
  Calendar,
  Calculator,
  CreditCard,
  ChevronDown,
  User,
  Car,
  FileDigit,
  AlertCircle,
  CheckCircle2,
  Hash,
  Award,
  Clock,
  X,
} from "lucide-react";
import { cn, isValidLicensePlate, formatLicensePlateInput } from "@/lib/utils";
import type { Contract } from "./ContractList";
import { PackageCompare, PACKAGES } from "./PackageCompare";

export const COMPANIES = [
  {
    id: "monre",
    name: "Монре даатгал",
    rate: 9.5,
    branches: [
      { id: "monre-hq", name: "Төв оффис" },
      { id: "monre-1", name: "1-р салбар" },
      { id: "monre-2", name: "2-р салбар" },
      { id: "monre-3", name: "3-р салбар" },
    ],
  },
  {
    id: "mig",
    name: "МИГ даатгал",
    rate: 12,
    branches: [
      { id: "mig-hq", name: "Төв оффис" },
      { id: "mig-1", name: "Сүхбаатар салбар" },
      { id: "mig-2", name: "Баянзүрх салбар" },
    ],
  },
  {
    id: "ard",
    name: "Ард даатгал",
    rate: 10,
    branches: [
      { id: "ard-hq", name: "Төв оффис" },
      { id: "ard-1", name: "Хан-Уул салбар" },
      { id: "ard-2", name: "Чингэлтэй салбар" },
    ],
  },
  {
    id: "boldog",
    name: "Болдог даатгал",
    rate: 11,
    branches: [
      { id: "boldog-hq", name: "Төв оффис" },
      { id: "boldog-1", name: "Сонгинохайрхан салбар" },
    ],
  },
  {
    id: "mongol",
    name: "Монгол даатгал",
    rate: 9,
    branches: [
      { id: "mongol-hq", name: "Төв оффис" },
      { id: "mongol-1", name: "Баянгол салбар" },
      { id: "mongol-2", name: "Сүхбаатар салбар" },
    ],
  },
];

export const CATEGORIES = [
  { id: "auto", name: "Авто тээврийн хэрэгслийн даатгал", sub: ["Машин механизмын даатгал", "Мотоциклийн даатгал", "Авто тээврийн хэрэгслийн даатгал", "Хүнд даацын тээврийн хэрэгслийн даатгал"] },
  { id: "official", name: "Албан журмын даатгал", sub: ["Албан журмын хариуцлагын даатгал", "Албан журмын эмнэлгийн даатгал"] },
  { id: "cargo", name: "Ачааны даатгал", sub: ["Олон улсын ачааны даатгал", "Дотоодын ачааны даатгал", "Тээврийн хэрэгслийн даатгал"] },
  { id: "agriculture", name: "Газар тариалангийн даатгал", sub: ["Ургацын даатгал", "Малын даатгал", "Тариалангийн хөрөнгийн даатгал"] },
  { id: "accident", name: "Гэнэтийн осол, эмчилгээний зардал", sub: ["Гэнэтийн ослын даатгал", "Эмчилгээний зардалын даатгал", "Амь насыны даатгал"] },
  { id: "liability", name: "Хариуцлагын даатгал", sub: ["Гэрээслэлийн хариуцлага", "Мэргэжлийн хариуцлага", "Байгууллагын хариуцлага"] },
  { id: "property", name: "Хөрөнгийн даатгал", sub: ["Барилгын даатгал", "Тоног төхөөрөмжийн даатгал", "Агуулахын даатгал"] },
];

const PRODUCTS = ["Basic", "Standard", "Premium"];
const DURATIONS = ["1 Жил", "2 Жил", "3 Жил"];
const ADDITIONAL_OPTIONS = ["Нэмэлт үнийн мэдээлэл", "Чиргүүл үйлчилгээ", "Түрээсийн тэрэг", "Хуулийн туслалцаа"];

// Mock DAN/HUR registry data (replace with real API integration later)
type VehicleInfo = {
  brand: string;
  model: string;
  year: string;
  plate: string;
  vin: string;
  engine: string;
  type: string;
  typeLabel: string;
  seats: string;
  color?: string;
  category?: string;
  ownerSurname?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerReg?: string;
};

type CustomerInfo = {
  reg: string;
  surname: string;
  name: string;
  phone: string;
};

const VEHICLE_TYPE_LABELS: Record<string, string> = {
  sedan: "Седан",
  suv: "Джип/SUV",
  minivan: "Микроавтобус",
  bus: "Автобус",
  truck: "Ачааны тэрэг",
  heavy_truck: "Хүнд даацын машин",
  pickup: "Пикап",
  motorcycle: "Мотоцикл",
};

const MOCK_VEHICLE_REGISTRY: Record<string, VehicleInfo[]> = {
  УУ00000000: [
    { brand: "Toyota", model: "Land Cruiser 200", year: "2019", plate: "1234УБА", vin: "JT3DB03E0B0000001", engine: "1VD-000000", type: "suv", typeLabel: "Джип/SUV", seats: "7", color: "Хар", category: "A", ownerSurname: "Лхагваочир", ownerName: "Энхуянга", ownerPhone: "94660906", ownerReg: "УШ02290621" },
    { brand: "Lexus", model: "LX570", year: "2020", plate: "5678УББ", vin: "JTJHY00B0B4000001", engine: "3UR-000000", type: "suv", typeLabel: "Джип/SUV", seats: "8", color: "Цагаан", category: "A", ownerSurname: "Бат", ownerName: "Эрдэнэ", ownerPhone: "99119911", ownerReg: "УУ11223344" },
    { brand: "Hyundai", model: "Sonata", year: "2017", plate: "9012УБС", vin: "KMHEC41DDBA000001", engine: "G4KJ-000000", type: "sedan", typeLabel: "Седан", seats: "5", color: "Мөнгөлөг", category: "B", ownerSurname: "Ганбат", ownerName: "Оюун", ownerPhone: "88112233", ownerReg: "УУ99887766" },
  ],
  УУ88888888: [
    { brand: "Hyundai", model: "Santa Fe", year: "2018", plate: "9999УХА", vin: "KMHSH81DDBU000001", engine: "D4HB-000000", type: "suv", typeLabel: "Джип/SUV", seats: "5", color: "Улаан", category: "A", ownerSurname: "Дорж", ownerName: "Баяр", ownerPhone: "99001122", ownerReg: "УУ55443322" },
  ],
  АА11111111: [
    { brand: "Mercedes-Benz", model: "Actros 1845", year: "2021", plate: "1111ААА", vin: "WDB9634231L000001", engine: "OM471-000000", type: "truck", typeLabel: "Ачааны тэрэг", seats: "2", color: "Цэнхэр", category: "C", ownerSurname: "Болд", ownerName: "Эрдэнэ", ownerPhone: "95556677", ownerReg: "АА99887766" },
  ],
  ББ22222222: [
    { brand: "Toyota", model: "Hiace", year: "2019", plate: "2222БББ", vin: "JTFLA11H0KB000001", engine: "2TR-000000", type: "minivan", typeLabel: "Микроавтобус", seats: "14", color: "Саарал", category: "B", ownerSurname: "Баатар", ownerName: "Сүх", ownerPhone: "99113344", ownerReg: "ББ11223344" },
  ],
  ХХ00000000: [
    { brand: "MAN", model: "TGS 33.440", year: "2020", plate: "ХҮ-0000", vin: "WMA06SZZ5GP000001", engine: "D2676-000000", type: "heavy_truck", typeLabel: "Хүнд даацын машин", seats: "2", color: "Улаан", category: "E", ownerSurname: "Сүх", ownerName: "Мөнх", ownerPhone: "99887766", ownerReg: "ХХ11223344" },
  ],
  ХХ11111111: [
    { brand: "Volvo", model: "FH 540", year: "2022", plate: "ХҮ-1111", vin: "YV2E4CBA8PB000001", engine: "D13K-000000", type: "heavy_truck", typeLabel: "Хүнд даацын машин", seats: "2", color: "Цагаан", category: "E", ownerSurname: "Цог", ownerName: "Ганхуяг", ownerPhone: "99776655", ownerReg: "ХХ55667788" },
  ],
};

// Test templates for fallback / random test lookups
const MOCK_BRAND_TEMPLATES = [
  { brand: "Toyota", models: ["Land Cruiser 200", "Hilux", "Hiace", "Corolla", "Camry"], types: ["suv", "truck", "minivan", "sedan", "sedan"] },
  { brand: "Lexus", models: ["LX570", "RX350", "NX300", "ES300h"], types: ["suv", "suv", "suv", "sedan"] },
  { brand: "Hyundai", models: ["Sonata", "Santa Fe", "Tucson", "H350", "Staria"], types: ["sedan", "suv", "suv", "minivan", "minivan"] },
  { brand: "Kia", models: ["Sorento", "Sportage", "K5", "Bongo"], types: ["suv", "suv", "sedan", "truck"] },
  { brand: "Mercedes-Benz", models: ["Actros 1845", "Sprinter", "G-Class", "E-Class"], types: ["truck", "minivan", "suv", "sedan"] },
  { brand: "MAN", models: ["TGS 33.440", "TGX 18.500"], types: ["heavy_truck", "heavy_truck"] },
  { brand: "Volvo", models: ["FH 540", "FM 420", "XC90"], types: ["heavy_truck", "heavy_truck", "suv"] },
  { brand: "Ford", models: ["F-150", "Transit", "Explorer", "Ranger"], types: ["pickup", "minivan", "suv", "pickup"] },
  { brand: "Isuzu", models: ["Elf", "Giga", "D-Max"], types: ["truck", "truck", "pickup"] },
  { brand: "Mitsubishi", models: ["Lancer", "Pajero", "Canter", "Outlander"], types: ["sedan", "suv", "truck", "suv"] },
];

const MOCK_COLORS = ["Хар", "Цагаан", "Мөнгөлөг", "Улаан", "Цэнхэр", "Саарал", "Ногоон", "Шаргал", "Хөх"];

function generateMockVehicles(reg: string): VehicleInfo[] {
  const seed = reg.padEnd(8, "0");
  const count = 1 + (seed.charCodeAt(2) + seed.charCodeAt(3)) % 3; // 1-3 vehicles
  const vehicles: VehicleInfo[] = [];
  for (let i = 0; i < count; i++) {
    const brandIdx = (seed.charCodeAt(i) + seed.charCodeAt(i + 2) + i * 13) % MOCK_BRAND_TEMPLATES.length;
    const brand = MOCK_BRAND_TEMPLATES[brandIdx];
    const modelIdx = (seed.charCodeAt(i + 4) + i * 7) % brand.models.length;
    const model = brand.models[modelIdx];
    const type = brand.types[modelIdx];
    const year = (2010 + (seed.charCodeAt(i + 5) + i * 11) % 16).toString();
    const serial = 1000 + (seed.charCodeAt(i) + i * 53) % 9000;
    const plate = `${seed.slice(0, 2)}-${serial}`;
    const vin = `${seed.slice(0, 2)}${year}${String(i + 1).padStart(6, "0")}MOCK`;
    const engine = `${seed.slice(0, 2)}-${(100000 + (seed.charCodeAt(i + 3) + i * 11) % 900000)}`;
    const seats = type === "sedan" ? "5" : type === "suv" ? "5" : type === "minivan" ? (12 + (i % 4) * 2).toString() : type === "bus" ? "40" : type === "pickup" ? "5" : "2";
    const color = MOCK_COLORS[(seed.charCodeAt(i + 6) + i * 3) % MOCK_COLORS.length];
    const categories = ["A", "B", "C", "D", "E"];
    const category = categories[(seed.charCodeAt(i) + i) % categories.length];
    const surnames = ["Лхагваочир", "Бат", "Ганбат", "Дорж", "Болд", "Баатар", "Сүх", "Цог"];
    const names = ["Энхуянга", "Эрдэнэ", "Оюун", "Баяр", "Эрдэнэ", "Сүх", "Мөнх", "Ганхуяг"];
    const ownerSurname = surnames[(seed.charCodeAt(i) + i * 3) % surnames.length];
    const ownerName = names[(seed.charCodeAt(i + 1) + i * 5) % names.length];
    const ownerPhone = `99${(100000 + (seed.charCodeAt(i + 2) + i * 7) % 900000).toString().slice(0, 6)}`;
    const ownerReg = `${seed.slice(0, 2)}${(10000000 + (seed.charCodeAt(i + 3) + i * 13) % 90000000)}`;
    vehicles.push({
      brand: brand.brand,
      model,
      year,
      plate,
      vin,
      engine,
      type,
      typeLabel: VEHICLE_TYPE_LABELS[type] || type,
      seats,
      color,
      category,
      ownerSurname,
      ownerName,
      ownerPhone,
      ownerReg,
    });
  }
  return vehicles;
}

function getMockVehicles(reg: string): VehicleInfo[] {
  return MOCK_VEHICLE_REGISTRY[reg] || generateMockVehicles(reg);
}

function getMockVehiclesByPlate(plate: string): VehicleInfo[] {
  const normalized = plate.trim().toUpperCase();
  if (!normalized) return [];
  for (const vehicles of Object.values(MOCK_VEHICLE_REGISTRY)) {
    const found = vehicles.filter((v) => v.plate.toUpperCase() === normalized);
    if (found.length) return found;
  }
  // Deterministic fallback vehicle from the plate itself
  const seed = normalized.padEnd(8, "0");
  const brandIdx = (seed.charCodeAt(0) + seed.charCodeAt(2)) % MOCK_BRAND_TEMPLATES.length;
  const brand = MOCK_BRAND_TEMPLATES[brandIdx];
  const modelIdx = (seed.charCodeAt(1) + seed.charCodeAt(3)) % brand.models.length;
  const model = brand.models[modelIdx];
  const type = brand.types[modelIdx];
  const year = (2010 + (seed.charCodeAt(4) + seed.charCodeAt(5)) % 16).toString();
  const engine = `${seed.slice(0, 2)}-${(100000 + (seed.charCodeAt(6) + seed.charCodeAt(7)) % 900000)}`;
  const seats =
    type === "sedan"
      ? "5"
      : type === "suv"
        ? "5"
        : type === "minivan"
          ? "12"
          : type === "bus"
            ? "40"
            : type === "pickup"
              ? "5"
              : "2";
  const color = MOCK_COLORS[(seed.charCodeAt(0) + seed.charCodeAt(1)) % MOCK_COLORS.length];
  const categories = ["A", "B", "C", "D", "E"];
  const category = categories[(seed.charCodeAt(2) + seed.charCodeAt(3)) % categories.length];
  const surnames = ["Лхагваочир", "Бат", "Ганбат", "Дорж", "Болд", "Баатар", "Сүх", "Цог"];
  const names = ["Энхуянга", "Эрдэнэ", "Оюун", "Баяр", "Эрдэнэ", "Сүх", "Мөнх", "Ганхуяг"];
  const ownerSurname = surnames[(seed.charCodeAt(4) + seed.charCodeAt(5)) % surnames.length];
  const ownerName = names[(seed.charCodeAt(6) + seed.charCodeAt(7)) % names.length];
  const ownerPhone = `99${(100000 + (seed.charCodeAt(0) + seed.charCodeAt(1)) % 900000).toString().slice(0, 6)}`;
  const ownerReg = `${seed.slice(0, 2)}${(10000000 + (seed.charCodeAt(2) + seed.charCodeAt(3)) % 90000000)}`;
  return [
    {
      brand: brand.brand,
      model,
      year,
      plate: normalized,
      vin: `${seed.slice(0, 2)}${year}000001`,
      engine,
      type,
      typeLabel: VEHICLE_TYPE_LABELS[type] || type,
      seats,
      color,
      category,
      ownerSurname,
      ownerName,
      ownerPhone,
      ownerReg,
    },
  ];
}

const MOCK_CUSTOMER_REGISTRY: Record<string, CustomerInfo> = {
  УШ02290621: { reg: "УШ02290621", surname: "Лхагваочир", name: "Энхуянга", phone: "94660906" },
  УУ11223344: { reg: "УУ11223344", surname: "Бат", name: "Эрдэнэ", phone: "99119911" },
  УУ99887766: { reg: "УУ99887766", surname: "Ганбат", name: "Оюун", phone: "88112233" },
};

function getMockCustomers(reg: string): CustomerInfo[] {
  const normalized = reg.trim().toUpperCase();
  // Exact match in dedicated customer registry
  if (MOCK_CUSTOMER_REGISTRY[normalized]) {
    return [MOCK_CUSTOMER_REGISTRY[normalized]];
  }
  // Exact match in known registry vehicles by ownerReg
  const matches: CustomerInfo[] = [];
  Object.values(MOCK_VEHICLE_REGISTRY).forEach((vehicles) => {
    vehicles.forEach((v) => {
      if (v.ownerReg === reg && !matches.find((c) => c.reg === v.ownerReg)) {
        matches.push({
          reg: v.ownerReg || "",
          surname: v.ownerSurname || "",
          name: v.ownerName || "",
          phone: v.ownerPhone || "",
        });
      }
    });
  });
  if (matches.length) return matches;
  // Fallback deterministic mock customer
  const seed = reg.padEnd(8, "0");
  const surnames = ["Лхагваочир", "Бат", "Ганбат", "Дорж", "Болд", "Баатар", "Сүх", "Цог"];
  const names = ["Энхуянга", "Эрдэнэ", "Оюун", "Баяр", "Эрдэнэ", "Сүх", "Мөнх", "Ганхуяг"];
  const surname = surnames[(seed.charCodeAt(0) + seed.charCodeAt(2)) % surnames.length];
  const name = names[(seed.charCodeAt(1) + seed.charCodeAt(3)) % names.length];
  const phone = `99${(100000 + (seed.charCodeAt(4) + seed.charCodeAt(5)) % 900000).toString().slice(0, 6)}`;
  return [{ reg, surname, name, phone }];
}

const TEST_REGISTRATION_NUMBERS = ["УШ02290621", "УУ11223344", "УУ99887766", "УУ00000000", "УУ88888888", "АА11111111", "ББ22222222", "ХХ00000000", "ХХ11111111", "УБ12345678", "ОР55555555", "ДХ77777777"];
const TEST_PLATE_NUMBERS = ["1234УБА", "5678УББ", "9012УБС", "9999УХА", "1111ААА", "2222БББ", "0000ХҮ", "1111ХҮ"];

const DEFAULT_VEHICLE = { brand: "", model: "", year: "", plate: "", vin: "", engine: "", type: "", typeLabel: "", seats: "", color: "" };

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

export function ContractForm({
  onBack,
  onProceedToPayment,
  isAjd = false,
  initialContract,
}: {
  onBack?: () => void;
  onProceedToPayment?: (contract: Contract) => void;
  isAjd?: boolean;
  initialContract?: Contract | null;
}) {
  const [company, setCompany] = useState("");
  const [branch, setBranch] = useState("");
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
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehicleCategory, setVehicleCategory] = useState("");
  const [loadCapacity, setLoadCapacity] = useState("");
  const [trailerCount, setTrailerCount] = useState("");
  const [routeInfo, setRouteInfo] = useState("");
  const [vehicleSearchLoading, setVehicleSearchLoading] = useState(false);
  const [vehicleSearchResults, setVehicleSearchResults] = useState(getMockVehicles("УУ00000000"));
  const [vehicleSearchOpen, setVehicleSearchOpen] = useState(false);
  const [vehicleSearchError, setVehicleSearchError] = useState(false);

  // Customer / insured person lookup
  const [customerReg, setCustomerReg] = useState("");
  const [customerSearchLoading, setCustomerSearchLoading] = useState(false);
  const [customerSearchResults, setCustomerSearchResults] = useState<CustomerInfo[]>([]);
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
  const [customerSurname, setCustomerSurname] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerType, setCustomerType] = useState<"individual" | "legal">("individual");
  const [legalEntityName, setLegalEntityName] = useState("");
  const [legalEntityReg, setLegalEntityReg] = useState("");
  const [legalEntityAddress, setLegalEntityAddress] = useState("");
  const [legalEntityPhone, setLegalEntityPhone] = useState("");

  // Driver / coverage options
  const [coDrivers, setCoDrivers] = useState<{ name: string; reg: string }[]>([]);
  const [isLimitedCoverage, setIsLimitedCoverage] = useState(false);
  const [hasTrailer, setHasTrailer] = useState(false);

  // Auto transport subcategory add-ons
  const [discountPercent, setDiscountPercent] = useState("");
  const [equipmentList, setEquipmentList] = useState<{ name: string; value: string }[]>([]);
  const [godList, setGodList] = useState<{ name: string; value: string }[]>([]);
  const [ajdList, setAjdList] = useState<{ name: string; value: string }[]>([]);
  const [customFieldsList, setCustomFieldsList] = useState<{ name: string; value: string }[]>([]);

  // Auto-select AJD defaults
  useEffect(() => {
    if (isAjd && !initialContract) {
      setCategory("auto");
      setSubCategory("Авто тээврийн хэрэгслийн даатгал");
      setProduct("Basic");
      setPackageId("Багц 1");
      setValuation("15000000");
    }
  }, [isAjd, initialContract]);

  // Populate form when editing an existing contract
  useEffect(() => {
    if (!initialContract) return;

    const c = initialContract;
    setCompany(c.companyId);
    setBranch(c.branchId || "");
    setCategory(c.categoryId);
    setSubCategory(c.subCategory);
    setProduct(c.product);
    setPackageId(c.packageName || "");
    setValuation(String(c.valuation));
    setStartDate(c.startDate);
    setDuration(c.duration);
    setDiscountPercent(String(c.discountPercent));
    setOwnerName(c.ownerName || "");
    setLicensePlate(c.licensePlate || "");
    setVehicleBrand(c.vehicleBrand || "");
    setVehicleModel(c.vehicleModel || "");
    setVehicleYear(c.vehicleYear || "");
    setVehicleColor(c.vehicleColor || "");
    setVinNumber(c.vinNumber || "");
    setVehicleType(c.vehicleFuel === "Дизель" ? "truck" : c.vehicleFuel === "Бензин" ? "sedan" : "");
    setPassengerCount("");
    setVehicleCategory("");
    setCustomerReg(c.insuredRegister || "");
    setCustomerPhone(c.insuredPhone || "");
    setCoDrivers(c.coDrivers || []);
    setIsLimitedCoverage(c.isLimitedCoverage ?? false);
    setHasTrailer(c.hasTrailer ?? false);

    const nameParts = (c.insuredName || "").trim().split(/\s+/);
    if (c.customerType === "legal" || (nameParts.length === 1 && /\d/.test(c.insuredRegister || ""))) {
      setCustomerType("legal");
      setLegalEntityName(c.insuredName || "");
      setLegalEntityReg(c.insuredRegister || "");
      setLegalEntityAddress(c.insuredAddress || "");
      setLegalEntityPhone(c.insuredPhone || "");
      setCustomerSurname("");
      setCustomerName("");
    } else {
      setCustomerType("individual");
      setCustomerSurname(nameParts[0] || "");
      setCustomerName(nameParts.slice(1).join(" ") || "");
      setLegalEntityName("");
      setLegalEntityReg("");
      setLegalEntityAddress("");
      setLegalEntityPhone("");
    }
  }, [initialContract]);

  const selectedCompany = COMPANIES.find((c) => c.id === company);
  const selectedCategory = CATEGORIES.find((c) => c.id === category);
  const isAuto = category === "auto";
  const isAutoTransport = subCategory === "Авто тээврийн хэрэгслийн даатгал";
  const isHeavyVehicle = subCategory === "Хүнд даацын тээврийн хэрэгслийн даатгал";
  const isAutoLike = isAutoTransport || isHeavyVehicle;
  const valuationNum = valuation === "" ? 0 : Number(valuation);
  const discountNum = discountPercent === "" ? 0 : Number(discountPercent);
  const additionalTotal = useMemo(() => {
    const sum = (list: { value: string }[]) => list.reduce((acc, item) => acc + (item.value === "" ? 0 : Number(item.value)), 0);
    return sum(equipmentList) + sum(godList) + sum(ajdList) + sum(customFieldsList);
  }, [equipmentList, godList, ajdList, customFieldsList]);

  const packageRate = packageId === "Багц 1" ? 1 : packageId === "Багц 2" ? 0.8 : 0;
  const years = duration === "1 Жил" ? 1 : duration === "2 Жил" ? 2 : duration === "3 Жил" ? 3 : 1;
  const premiumRate = packageRate;

  const basePremium = useMemo(() => {
    if (!selectedCompany || !valuationNum || !packageId) return 0;
    return Math.round((valuationNum * premiumRate * years) / 100);
  }, [valuationNum, premiumRate, years, packageId, selectedCompany]);

  const discountAmount = Math.round((basePremium * discountNum) / 100);
  const totalPremium = basePremium - discountAmount + additionalTotal;

  const isValid =
    company &&
    branch &&
    category &&
    subCategory &&
    product &&
    packageId &&
    valuationNum > 0 &&
    (!isAuto ||
      (customerType === "individual"
        ? customerReg && isValidLicensePlate(licensePlate)
        : legalEntityReg && legalEntityName && legalEntityAddress && legalEntityPhone && isValidLicensePlate(licensePlate)));

  const generateContractNumber = () => {
    const now = new Date();
    const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const existingRaw = typeof window !== "undefined" ? localStorage.getItem("ins-monre-contracts") : null;
    const existingNumbers: string[] = existingRaw ? (JSON.parse(existingRaw) as Contract[]).map((c) => c.number) : [];
    let suffix = Math.floor(Math.random() * 9000) + 1000;
    let attempts = 0;
    while (existingNumbers.includes(`${datePart}${suffix}`) && attempts < 100) {
      suffix = Math.floor(Math.random() * 9000) + 1000;
      attempts++;
    }
    return `${datePart}${suffix}`;
  };

  const handleSave = () => {
    setTouched(true);
    if (!isValid || !selectedCompany || !selectedCategory) return;
    const selectedBranch = selectedCompany.branches.find((b) => b.id === branch);
    const contract: Contract = {
      id: initialContract?.id || crypto.randomUUID?.() || `${Date.now()}`,
      number: initialContract?.number || generateContractNumber(),
      companyId: company,
      companyName: selectedCompany.name,
      companyRate: premiumRate,
      branchId: branch,
      branchName: selectedBranch?.name,
      categoryId: category,
      categoryName: selectedCategory.name,
      subCategory,
      product,
      packageName: packageId || undefined,
      valuation: valuationNum,
      premium: totalPremium,
      brokerFee: Math.round(totalPremium * 0.15),
      discountPercent: discountNum,
      discountAmount,
      additionalTotal,
      startDate,
      duration,
      status: initialContract?.status || (isAjd ? "paid" : "draft"),
      createdAt: initialContract?.createdAt || new Date().toISOString(),
      source: initialContract?.source || "Веб",
      channel: initialContract?.channel || "Insure веб",
      insuredName:
        customerType === "legal"
          ? legalEntityName || "ХХК"
          : customerName
            ? `${customerSurname} ${customerName}`.trim()
            : ownerName || "Бат-Эрдэнэ",
      insuredRegister: customerType === "legal" ? legalEntityReg || "1234567" : customerReg || "УУ99112233",
      insuredAddress: customerType === "legal" ? legalEntityAddress || "Улаанбаатар" : "Улаанбаатар",
      insuredPhone: customerType === "legal" ? legalEntityPhone || "99119911" : customerPhone || "99119911",
      insurerName: "Л. Энхуянга",
      insurerRegister: "АА89160234",
      insurerLicense: licenseNumber || "AB123456",
      insurerAddress: "Улаанбаатар",
      insurerPhone: "+976 7777-9000",
      ownerName: ownerName || undefined,
      licensePlate: licensePlate || undefined,
      vehicleBrand: vehicleBrand || undefined,
      vehicleModel: vehicleModel || undefined,
      vehicleYear: vehicleYear || undefined,
      vehicleColor: vehicleColor || undefined,
      vinNumber: vinNumber || undefined,
      vehiclePurpose: subCategory || "Авто тээврийн хэрэгсэл",
      vehicleFuel: vehicleType === "truck" || vehicleType === "heavy_truck" ? "Дизель" : "Бензин",
      vehicleImportYear: vehicleYear || "2020",
      vehicleEngineCapacity: engineNumber || "2.0 л",
      coDrivers: coDrivers.length ? coDrivers : undefined,
      isLimitedCoverage,
      hasTrailer,
      isAjd,
      customerType,
      images: initialContract?.images,
    };
    onProceedToPayment?.(contract);
  };

  return (
    <div className="h-full bg-[#0b0f19] p-4 text-slate-200 lg:p-6">
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

        <div className={cn("grid gap-6", isAjd ? "" : "lg:grid-cols-[1fr_420px]")}>
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
                      setBranch("");
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
                    Салбарын нэр <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => {
                      setBranch(e.target.value);
                      setTouched(true);
                    }}
                    disabled={!company}
                    className={cn(
                      "w-full rounded-xl border bg-slate-800/60 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
                      !company
                        ? "cursor-not-allowed border-slate-700/30 bg-slate-800/30 text-slate-500"
                        : touched && !branch
                          ? "border-red-500/50"
                          : "border-slate-700/60 hover:border-slate-500"
                    )}
                  >
                    <option value="">{company ? "Салбар сонгох" : "Эхлээд компани сонгоно уу"}</option>
                    {selectedCompany?.branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  {touched && !branch && company && <p className="text-xs text-red-400">Шаардлагатай</p>}
                </div>

                {!isAjd && (
                  <>
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
                  </>
                )}

                {isAjd && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Ангилал <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={customerType}
                      onChange={(e) => setCustomerType(e.target.value as "individual" | "legal")}
                      className={cn(
                        "w-full rounded-xl border bg-slate-800/60 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
                        touched && !customerType ? "border-red-500/50" : "border-slate-700/60"
                      )}
                    >
                      <option value="individual">Хувь хүн</option>
                      <option value="legal">Хуулийн этгээд</option>
                    </select>
                  </div>
                )}

                {!isAjd && (
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
                        {PACKAGES.map((p) => {
                          const rate = p === "Багц 1" ? "1%" : "0.8%";
                          return (
                            <option key={p} value={p}>
                              {p} ({rate})
                            </option>
                          );
                        })}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowPackage(true)}
                        className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-slate-700"
                      >
                        <Eye className="h-4 w-4" />
                        Багц харах
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {showPackage &&
                createPortal(
                  <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
                    onClick={(e) => {
                      if (e.target === e.currentTarget) setShowPackage(false);
                    }}
                  >
                    <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-600/50 bg-[#0b0f19] shadow-2xl">
                      <div className="flex shrink-0 items-center justify-between border-b border-slate-700/50 bg-[#0f1321] px-5 py-4">
                        <h3 className="text-sm font-bold text-white">Багц харьцуулалт</h3>
                        <button
                          type="button"
                          onClick={() => setShowPackage(false)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="min-h-0 flex-1 overflow-y-auto bg-[#0b0f19] p-5">
                        <PackageCompare selected={packageId} onSelect={(pkg) => setPackageId(pkg)} />
                      </div>
                      <div className="flex shrink-0 justify-end border-t border-slate-700/50 bg-[#0f1321] px-5 py-4">
                        <button
                          type="button"
                          onClick={() => setShowPackage(false)}
                          className="rounded-lg bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-600"
                        >
                          Хаах
                        </button>
                      </div>
                    </div>
                  </div>,
                  document.body
                 )}
            </div>

            {isAuto && isAjd && subCategory !== "Мотоциклийн даатгал" && subCategory !== "" && (
              <div className="rounded-2xl border border-slate-700/50 bg-[#0f1321]/70 p-5 shadow-xl">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Car className="h-4.5 w-4.5" />
                    </div>
                    <h2 className="text-sm font-bold text-white">Даатгуулагч ба тээврийн хэрэгсэл</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCoDrivers([...coDrivers, { name: "", reg: "" }])}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Хамтран жолооч нэмэх
                  </button>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="space-y-4 rounded-xl border border-slate-700/30 bg-slate-800/30 p-4">
                    <div className="flex items-center gap-2 border-b border-slate-700/30 pb-3">
                      <User className="h-4 w-4 text-slate-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {customerType === "legal" ? "Хуулийн этгээд" : "Харилцагч"}
                      </h3>
                    </div>

                    {customerType === "individual" ? (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-300">
                            Регистрийн дугаар <span className="text-red-400">*</span>
                          </label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                value={customerReg}
                                onChange={(e) => {
                                  setCustomerReg(e.target.value);
                                  setCustomerSearchOpen(false);
                                }}
                                placeholder="УУ00000000"
                                className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 pl-9 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                              />
                              <FileDigit className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            </div>
                            <button
                              type="button"
                              disabled={customerSearchLoading}
                              onClick={() => {
                                if (!customerReg) return;
                                setCustomerSearchLoading(true);
                                setCustomerSearchOpen(false);
                                setTimeout(() => {
                                  setCustomerSearchResults(getMockCustomers(customerReg));
                                  setCustomerSearchOpen(true);
                                  setCustomerSearchLoading(false);
                                }, 400);
                              }}
                              className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white transition-all hover:bg-indigo-600 disabled:opacity-50"
                            >
                              {customerSearchLoading ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              ) : (
                                <Search className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-500">
                            Тестийн РД: {TEST_REGISTRATION_NUMBERS.slice(0, 4).join(", ")}
                          </p>

                          {customerSearchOpen && (
                            <div className="relative z-20 mt-2">
                              <div className="rounded-xl border border-slate-700/50 bg-[#0b0f19] shadow-xl">
                                <div className="border-b border-slate-700/50 px-3 py-2">
                                  <p className="text-xs font-bold text-white">
                                    {customerSearchResults.length > 0 ? `${customerReg} - харилцагчид` : "Мэдээлэл олдсонгүй"}
                                  </p>
                                </div>
                                <div className="max-h-60 overflow-auto p-1.5">
                                  {customerSearchResults.map((c, idx) => (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => {
                                        setCustomerSurname(c.surname);
                                        setCustomerName(c.name);
                                        setCustomerPhone(c.phone);
                                        setCustomerSearchOpen(false);
                                      }}
                                      className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-800"
                                    >
                                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                                        <User className="h-4 w-4" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <span className="text-xs font-bold text-white">{c.surname} {c.name}</span>
                                        <p className="text-[10px] text-slate-500">{c.phone} · {c.reg}</p>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setCustomerSearchOpen(false)}
                                  className="w-full border-t border-slate-700/50 px-3 py-2 text-center text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800"
                                >
                                  Хаах
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300">Овог</label>
                            <input
                              type="text"
                              value={customerSurname}
                              onChange={(e) => setCustomerSurname(e.target.value)}
                              placeholder="Овог"
                              className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-300">Нэр</label>
                            <input
                              type="text"
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              placeholder="Нэр"
                              className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-300">Утасны дугаар</label>
                          <input
                            type="text"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="99119911"
                            className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-300">
                            Байгууллагын регистр <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={legalEntityReg}
                            onChange={(e) => setLegalEntityReg(e.target.value)}
                            placeholder="1234567"
                            className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-300">
                            Байгууллагын нэр <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={legalEntityName}
                            onChange={(e) => setLegalEntityName(e.target.value)}
                            placeholder="ХХК-ийн нэр"
                            className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-300">
                            Хаягийн мэдээлэл <span className="text-red-400">*</span>
                          </label>
                          <textarea
                            value={legalEntityAddress}
                            onChange={(e) => setLegalEntityAddress(e.target.value)}
                            rows={3}
                            placeholder="Дүүрэг, хороо, гудамж, байрын дугаар"
                            className="w-full resize-none rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-300">
                            Утасны дугаар <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={legalEntityPhone}
                            onChange={(e) => setLegalEntityPhone(e.target.value)}
                            placeholder="99119911"
                            className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-4 rounded-xl border border-slate-700/30 bg-slate-800/30 p-4">
                    <div className="flex items-center gap-2 border-b border-slate-700/30 pb-3">
                      <Car className="h-4 w-4 text-slate-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {subCategory === "Хүнд даацын тээврийн хэрэгслийн даатгал" ? "Хүнд даацын тэрэг" : "Автомашин"}
                      </h3>
                    </div>

                    <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Улсын дугаар <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={licensePlate}
                          onChange={(e) => {
                            setLicensePlate(formatLicensePlateInput(e.target.value));
                            setVehicleSearchOpen(false);
                            setVehicleSearchError(false);
                          }}
                          placeholder="1234UBA"
                            className={cn(
                              "w-full rounded-xl border bg-slate-800/60 px-3 py-2.5 pl-9 text-sm font-bold uppercase text-white placeholder-slate-600 outline-none transition-all focus:ring-4",
                              touched && licensePlate && !isValidLicensePlate(licensePlate)
                                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10"
                                : "border-slate-700/60 focus:border-indigo-500 focus:ring-indigo-500/10"
                            )}
                          />
                          <FileDigit className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        </div>
                        <button
                          type="button"
                          disabled={vehicleSearchLoading || !isValidLicensePlate(licensePlate)}
                          onClick={() => {
                            if (!licensePlate) return;
                            setVehicleSearchLoading(true);
                            setVehicleSearchOpen(false);
                            setVehicleSearchError(false);
                            setTimeout(() => {
                              const results = getMockVehiclesByPlate(licensePlate);
                              setVehicleSearchResults(results);
                              setVehicleSearchLoading(false);
                              setVehicleSearchOpen(true);
                              setVehicleSearchError(results.length === 0);
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
                      </div>
                      {touched && licensePlate && !isValidLicensePlate(licensePlate) && (
                        <p className="text-xs text-red-400">Формат: 4 тоо + 3 үсэг (жишээ: 1234UBA)</p>
                      )}
                      <p className="text-[10px] text-slate-500">
                        Тестийн: {TEST_PLATE_NUMBERS.slice(0, 4).join(", ")}
                      </p>

                      {vehicleSearchOpen && (
                        <div className="relative z-20 mt-2">
                          <div className="rounded-xl border border-slate-700/50 bg-[#0b0f19] shadow-xl">
                            <div className="border-b border-slate-700/50 px-3 py-2">
                              <p className="text-xs font-bold text-white">
                                {vehicleSearchResults.length > 0 ? `${licensePlate} - автомашин` : "Мэдээлэл олдсонгүй"}
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
                                    setVehicleColor(v.color || "");
                                    setPassengerCount(v.seats);
                                    setVehicleSearchOpen(false);
                                  }}
                                  className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-800"
                                >
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                                    <Car className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <span className="text-xs font-bold text-white">{v.plate}</span>
                                    <p className="text-[10px] text-slate-500">{v.brand} {v.model} · {v.typeLabel}</p>
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

                      {vehicleSearchError && (
                        <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>Улсын дугаар бүртгэлгүй байна. Зөв дугаар оруулна уу.</span>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
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
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Үйлдвэрлэсэн он</label>
                        <input
                          type="text"
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
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Өнгө</label>
                        <input
                          type="text"
                          value={vehicleColor}
                          onChange={(e) => setVehicleColor(e.target.value)}
                          placeholder="Хар"
                          className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300">Суудлын тоо</label>
                        <input
                          type="text"
                          value={passengerCount}
                          onChange={(e) => setPassengerCount(e.target.value)}
                          placeholder="5"
                          className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {coDrivers.length > 0 && (
                  <div className="mt-5 space-y-3 rounded-xl border border-slate-700/30 bg-slate-800/30 p-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Хамтран жолооч</h3>
                    <div className="space-y-3">
                      {coDrivers.map((d, idx) => (
                        <div key={idx} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                          <input
                            type="text"
                            value={d.name}
                            onChange={(e) => {
                              const next = [...coDrivers];
                              next[idx].name = e.target.value;
                              setCoDrivers(next);
                            }}
                            placeholder="Нэр"
                            className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                          />
                          <input
                            type="text"
                            value={d.reg}
                            onChange={(e) => {
                              const next = [...coDrivers];
                              next[idx].reg = e.target.value;
                              setCoDrivers(next);
                            }}
                            placeholder="Регистрийн дугаар"
                            className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                          />
                          <button
                            type="button"
                            onClick={() => setCoDrivers(coDrivers.filter((_, i) => i !== idx))}
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Хязгаартай эсэх</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setIsLimitedCoverage(true)}
                        className={cn(
                          "rounded-xl px-3 py-2.5 text-xs font-semibold transition-all",
                          isLimitedCoverage
                            ? "bg-indigo-500 text-white"
                            : "border border-slate-700/60 bg-slate-800/60 text-slate-400 hover:border-slate-500"
                        )}
                      >
                        Хязгаартай
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsLimitedCoverage(false)}
                        className={cn(
                          "rounded-xl px-3 py-2.5 text-xs font-semibold transition-all",
                          !isLimitedCoverage
                            ? "bg-indigo-500 text-white"
                            : "border border-slate-700/60 bg-slate-800/60 text-slate-400 hover:border-slate-500"
                        )}
                      >
                        Хязгааргүй
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Чиргүүлтэй эсэх</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setHasTrailer(true)}
                        className={cn(
                          "rounded-xl px-3 py-2.5 text-xs font-semibold transition-all",
                          hasTrailer
                            ? "bg-indigo-500 text-white"
                            : "border border-slate-700/60 bg-slate-800/60 text-slate-400 hover:border-slate-500"
                        )}
                      >
                        Тийм
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasTrailer(false)}
                        className={cn(
                          "rounded-xl px-3 py-2.5 text-xs font-semibold transition-all",
                          !hasTrailer
                            ? "bg-indigo-500 text-white"
                            : "border border-slate-700/60 bg-slate-800/60 text-slate-400 hover:border-slate-500"
                        )}
                      >
                        Үгүй
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

{isAuto && !isAjd && subCategory !== "Мотоциклийн даатгал" && subCategory !== "" && (
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-5 shadow-xl backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Харилцагч</h2>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">
                        Регистрийн дугаар <span className="text-red-400">*</span>
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={customerReg}
                            onChange={(e) => {
                              setCustomerReg(e.target.value);
                              setCustomerSearchOpen(false);
                            }}
                            placeholder="УУ00000000"
                            className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 pl-9 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                          />
                          <FileDigit className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        </div>
                        <button
                          type="button"
                          disabled={customerSearchLoading}
                          onClick={() => {
                            if (!customerReg) return;
                            setCustomerSearchLoading(true);
                            setCustomerSearchOpen(false);
                            setTimeout(() => {
                              setCustomerSearchResults(getMockCustomers(customerReg));
                              setCustomerSearchOpen(true);
                              setCustomerSearchLoading(false);
                            }, 400);
                          }}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white transition-all hover:bg-indigo-600 disabled:opacity-50"
                        >
                          {customerSearchLoading ? (
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
                      <p className="text-[10px] text-slate-500">
                        Тестийн РД: {TEST_REGISTRATION_NUMBERS.slice(0, 6).join(", ")}...
                      </p>

                      {customerSearchOpen && (
                        <div className="relative z-20 mt-2">
                          <div className="rounded-xl border border-slate-700/50 bg-[#0f1321] shadow-xl">
                            <div className="border-b border-slate-700/50 px-3 py-2">
                              <p className="text-xs font-bold text-white">
                                {customerSearchResults.length > 0 ? `${customerReg} - харилцагчид` : "Мэдээлэл олдсонгүй"}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {customerSearchResults.length > 0
                                  ? "Даатгуулагч харилцагчаа сонгоно уу (DAN/HUR mock)"
                                  : "Регистрийн дугаар шалгана уу"}
                              </p>
                            </div>
                            <div className="max-h-60 overflow-auto p-1.5">
                              {customerSearchResults.map((c, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setCustomerSurname(c.surname);
                                    setCustomerName(c.name);
                                    setCustomerPhone(c.phone);
                                    setCustomerSearchOpen(false);
                                  }}
                                  className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-800"
                                >
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                                    <User className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                      <span className="truncate text-xs font-bold text-white">
                                        {c.surname} {c.name}
                                      </span>
                                    </div>
                                    <p className="mt-0.5 text-[10px] text-slate-500">{c.phone}</p>
                                    <p className="text-[10px] text-slate-600">РД: {c.reg}</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => setCustomerSearchOpen(false)}
                              className="w-full border-t border-slate-700/50 px-3 py-2 text-center text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800"
                            >
                              Хаах
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Овог</label>
                      <input
                        type="text"
                        value={customerSurname}
                        onChange={(e) => setCustomerSurname(e.target.value)}
                        placeholder="Овог"
                        className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Нэр</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Нэр"
                        className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">Утасны дугаар</label>
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="99119911"
                        className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-5 shadow-xl backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                      <Car className="h-4.5 w-4.5" />
                    </div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {subCategory === "Хүнд даацын тээврийн хэрэгслийн даатгал"
                        ? "Хүнд даацын тээврийн хэрэгсэл"
                        : "Автомашин"}
                    </h2>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">
                        Улсын дугаар <span className="text-red-400">*</span>
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={licensePlate}
                            onChange={(e) => {
                              setLicensePlate(formatLicensePlateInput(e.target.value));
                              setVehicleSearchOpen(false);
                            }}
                            placeholder="1234UBA"
                            className={cn(
                              "w-full rounded-xl border bg-slate-800/60 px-3 py-2.5 pl-9 text-sm font-bold uppercase text-white placeholder-slate-600 outline-none transition-all focus:ring-4",
                              touched && licensePlate && !isValidLicensePlate(licensePlate)
                                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10"
                                : "border-slate-700/60 focus:border-indigo-500 focus:ring-indigo-500/10"
                            )}
                          />
                          <FileDigit className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        </div>
                        <button
                          type="button"
                          disabled={vehicleSearchLoading || !isValidLicensePlate(licensePlate)}
                          onClick={() => {
                            if (!licensePlate) return;
                            setVehicleSearchLoading(true);
                            setVehicleSearchOpen(false);
                            setTimeout(() => {
                              setVehicleSearchResults(getMockVehiclesByPlate(licensePlate));
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
                      </div>
                      {touched && licensePlate && !isValidLicensePlate(licensePlate) && (
                        <p className="text-xs text-red-400">Формат: 4 тоо + 3 үсэг (жишээ: 1234UBA)</p>
                      )}

                      {vehicleSearchOpen && (
                        <div className="relative z-20 mt-2">
                          <div className="rounded-xl border border-slate-700/50 bg-[#0f1321] shadow-xl">
                            <div className="border-b border-slate-700/50 px-3 py-2">
                              <p className="text-xs font-bold text-white">
                                {vehicleSearchResults.length > 0 ? `${licensePlate} - автомашин` : "Мэдээлэл олдсонгүй"}
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
                                    setLicensePlate(v.plate);
                                    setVehicleType(v.type);
                                    setVehicleCategory(v.category || "");
                                    setVehicleColor(v.color || "");
                                    setPassengerCount(v.seats);
                                    setOwnerName([v.ownerSurname, v.ownerName].filter(Boolean).join(" "));
                                    setVehicleSearchOpen(false);
                                  }}
                                  className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-800"
                                >
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                                    <Car className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <span className="text-xs font-bold text-white">{v.plate}</span>
                                    <p className="text-[10px] text-slate-500">{v.brand} {v.model}</p>
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
                      <label className="text-xs font-semibold text-slate-300">Марка</label>
                      <input
                        type="text"
                        value={vehicleBrand}
                        onChange={(e) => setVehicleBrand(e.target.value)}
                        placeholder="Honda"
                        className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Модел</label>
                      <input
                        type="text"
                        value={vehicleModel}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        placeholder="Acty"
                        className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Ангилал</label>
                      <input
                        type="text"
                        value={vehicleCategory}
                        onChange={(e) => setVehicleCategory(e.target.value)}
                        placeholder="B"
                        className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Арлын дугаар</label>
                      <input
                        type="text"
                        value={vinNumber}
                        onChange={(e) => setVinNumber(e.target.value)}
                        placeholder="HA71517932"
                        className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">Зээмшигчийн нэр</label>
                      <input
                        type="text"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="Болд-Эрдэнэ"
                        className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isAjd && (
              <>
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
              </>
            )}

            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-400 transition-all hover:bg-emerald-500/20"
            >
              <Plus className="h-4 w-4" />
              Нэмэлт даатгуулагч нэмэх
            </button>
          </div>

          {!isAjd && (
            <div className="space-y-5">
              {/* RIGHT COLUMN */}
            <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-5 shadow-xl backdrop-blur-sm">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  <Calculator className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-sm font-bold text-white">{isAjd ? "Төлбөр төлөх" : "Үнэлгээ & хугацаа"}</h2>
              </div>

              <div className="space-y-5">
                {!isAjd && (
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
                )}

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

            {isAutoLike && (
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

                {!isAutoLike && (
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

            {/* Auto transport / heavy vehicle add-ons */}
            {isAutoLike && showAddOns && (
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
                <h2 className="text-sm font-bold text-white">{isAjd ? "Төлбөр төлөх" : "Тооцоо"}</h2>
              </div>

              <div className="space-y-4">
                {!isAjd && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Хураамжийн хувь:</span>
                    <span className="text-sm font-bold text-indigo-300">{packageId ? `${premiumRate}%` : "0%"}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Нийт даатгалын хураамж:</span>
                  <span className="text-2xl font-extrabold text-white">{formatMNT(totalPremium)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CreditCard className="h-4 w-4" />
                Төлбөр төлөх
              </button>

              {!isValid && touched && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-300">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Бүх шаардлагатай талбарыг бөглөнө үү.</span>
                </div>
              )}
            </div>
          </div>
          )}

          {isAjd && (
            <div className="sticky bottom-0 z-30 rounded-2xl border border-slate-700/50 bg-[#0f1321]/90 p-4 shadow-xl backdrop-blur-md">
              <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                <div>
                  <p className="text-xs text-slate-400">Нийт төлбөр</p>
                  <p className="text-xl font-extrabold text-white">{formatMNT(totalPremium)}</p>
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  <CreditCard className="h-4 w-4" />
                  Төлбөр төлөх
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
