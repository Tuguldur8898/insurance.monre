"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Building2,
  QrCode,
  Fingerprint,
  FileText,
  LogOut,
  Loader2,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "";

type CPUser = {
  _id: string;
  type?: string;
  email?: string;
  phone?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  companyName?: string;
  companyRegistrationNumber?: string;
  isVerified?: boolean;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  customFieldsData?: Record<string, unknown>;
  createdAt?: string;
};

type TabId = "personal" | "company" | "qr" | "sign" | "docs";

const TABS: { id: TabId; label: string; icon: typeof User }[] = [
  { id: "personal", label: "Хувийн мэдээлэл", icon: User },
  { id: "company", label: "Байгууллага", icon: Building2 },
  { id: "qr", label: "Миний QR", icon: QrCode },
  { id: "sign", label: "Гарын үсэг", icon: Fingerprint },
  { id: "docs", label: "Бичиг баримт", icon: FileText },
];

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
        {value && value.trim() ? value : <span className="text-slate-600">—</span>}
      </div>
    </div>
  );
}

export function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<CPUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabId>("personal");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    (async () => {
      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-app-token": process.env.NEXT_PUBLIC_ERXES_APP_TOKEN ?? "",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `query {
              clientPortalCurrentUser {
                _id type email phone username firstName lastName avatar
                companyName companyRegistrationNumber
                isVerified isPhoneVerified isEmailVerified
                customFieldsData createdAt
              }
            }`,
          }),
        });
        const json = (await res.json()) as {
          data?: { clientPortalCurrentUser: CPUser | null };
        };
        const u = json.data?.clientPortalCurrentUser ?? null;
        if (!u) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        setUser(u);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.dispatchEvent(new Event("auth-changed"));
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky" />
      </div>
    );
  }

  if (!user) return null;

  const displayName =
    [user.lastName, user.firstName].filter(Boolean).join(" ") ||
    user.username ||
    user.phone ||
    "Хэрэглэгч";
  const initial = displayName.slice(0, 1).toUpperCase();
  const cf = user.customFieldsData ?? {};
  const cfStr = (k: string) => (typeof cf[k] === "string" ? (cf[k] as string) : "");

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="mx-auto w-full max-w-[1200px] px-4 sm:px-6"
    >
      {/* Top bar */}
      <div className="glass-deep flex items-center justify-between rounded-3xl px-6 py-4">
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <span className="relative h-11 w-11 overflow-hidden rounded-2xl">
              <Image src={user.avatar} alt={displayName} fill sizes="44px" className="object-cover" />
            </span>
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky to-brand text-lg font-extrabold text-white">
              {initial}
            </span>
          )}
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-white">
              {displayName}
              {user.isVerified && <BadgeCheck className="h-4 w-4 text-sky" />}
            </p>
            <p className="text-xs text-slate-400">
              {user.type === "company" ? "Байгууллага" : "Хувь хүн"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-slate-300 transition-all hover:border-red-400/50 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          Гарах
        </button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <nav className="glass-deep flex gap-1 overflow-x-auto rounded-3xl p-3 md:flex-col md:p-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-all duration-200",
                tab === t.id
                  ? "bg-brand text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)]"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="glass-deep rounded-3xl p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tab === "personal" && (
                <div>
                  <h2 className="mb-6 text-lg font-extrabold text-white">Хувийн мэдээлэл</h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Овог" value={user.lastName} />
                    <Field label="Нэр" value={user.firstName} />
                    <Field label="Нэвтрэх нэр" value={user.username} />
                    <Field label="Утас" value={user.phone} />
                    <Field label="Имэйл" value={user.email} />
                    <Field
                      label="Бүртгүүлсэн"
                      value={user.createdAt ? new Date(user.createdAt).toLocaleDateString("mn-MN") : ""}
                    />
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {user.isPhoneVerified && (
                      <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                        <ShieldCheck className="h-3.5 w-3.5" /> Утас баталгаажсан
                      </span>
                    )}
                    {user.isEmailVerified && (
                      <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                        <ShieldCheck className="h-3.5 w-3.5" /> Имэйл баталгаажсан
                      </span>
                    )}
                  </div>
                </div>
              )}

              {tab === "company" && (
                <div>
                  <h2 className="mb-6 text-lg font-extrabold text-white">Байгууллагын мэдээлэл</h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Нэр" value={user.companyName} />
                    <Field label="Товч нэр" value={cfStr("companyShortName")} />
                    <Field label="Регистрийн дугаар" value={user.companyRegistrationNumber} />
                    <Field label="Улс" value={cfStr("country")} />
                    <Field label="Имэйл" value={user.email} />
                    <Field label="Утас" value={user.phone} />
                    <Field label="Аймаг / Нийслэл" value={cfStr("aimag")} />
                    <Field label="Сум / Дүүрэг" value={cfStr("sum")} />
                    <Field label="Баг / Хороо" value={cfStr("bag")} />
                    <Field label="Хаяг" value={cfStr("address")} />
                  </div>
                  {!user.companyName && (
                    <p className="mt-6 rounded-xl border border-sky/30 bg-sky/10 px-4 py-3 text-xs leading-relaxed text-sky">
                      Байгууллагын мэдээлэл хараахан бүртгэгдээгүй байна. +976 7777-9000 дугаарт холбогдож мэдээллээ бүртгүүлнэ үү.
                    </p>
                  )}
                </div>
              )}

              {tab === "qr" && (
                <div className="flex flex-col items-center py-6">
                  <div className="relative grid h-48 w-48 grid-cols-9 gap-[3px] rounded-2xl bg-white p-3 shadow-[0_0_36px_rgba(56,189,248,0.25)]">
                    {Array.from({ length: 81 }).map((_, i) => {
                      const on = (i * 11 + ((i / 9) | 0) * 7 + user._id.length) % 3 !== 0;
                      const corner =
                        (i < 27 && i % 9 < 3) || (i < 27 && i % 9 > 5) || (i > 53 && i % 9 < 3);
                      return (
                        <span
                          key={i}
                          className={cn(
                            "rounded-[2px]",
                            corner ? "bg-navy-deep" : on ? "bg-navy" : "bg-white"
                          )}
                        />
                      );
                    })}
                  </div>
                  <p className="mt-4 text-sm font-semibold text-white">{displayName}</p>
                  <p className="mt-1 font-mono text-xs text-slate-400">{user._id}</p>
                </div>
              )}

              {tab === "sign" && (
                <div className="flex flex-col items-start gap-4">
                  <h2 className="text-lg font-extrabold text-white">Гарын үсэг</h2>
                  <p className="text-sm leading-relaxed text-slate-300">
                    Тоон гарын үсгийн төлөв болон баталгаажуулалтын түүх энд харагдана.
                  </p>
                  <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-400">
                    Одоогоор гарын үсгийн хүсэлт байхгүй байна.
                  </div>
                </div>
              )}

              {tab === "docs" && (
                <div className="flex flex-col items-start gap-4">
                  <h2 className="text-lg font-extrabold text-white">Бичиг баримт</h2>
                  <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-dashed border-white/15 py-12 text-center">
                    <FileText className="h-10 w-10 text-slate-600" />
                    <p className="text-sm text-slate-400">Бичиг баримт байхгүй байна</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
