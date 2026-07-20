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
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ENDPOINT = "/api/graphql";

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
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <div className="rounded-lg border border-white/[0.07] bg-navy-deep/60 px-4 py-3 text-sm text-slate-100">
        {value && value.trim() ? value : <span className="text-slate-700">—</span>}
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
      <div className="hero-bg flex min-h-screen items-center justify-center">
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
    <div className="hero-bg relative flex min-h-screen flex-col">
      <div className="starfield" aria-hidden="true" />

      {/* Topbar */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/[0.06] bg-navy-deep/70 px-5 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="relative h-9 w-9 overflow-hidden rounded-xl shadow-[0_0_16px_rgba(34,197,94,0.35)]">
            <Image src="/logo.jpg" alt="ins.monre" fill sizes="36px" className="object-cover" />
          </span>
          <span className="hidden text-sm font-extrabold tracking-tight text-white sm:block">
            ins<span className="text-sky">.monre</span>
          </span>
          <span className="ml-2 hidden items-center gap-1.5 rounded-full border border-sky/25 bg-sky/10 px-3 py-1 text-[11px] font-bold text-sky md:flex">
            <LayoutDashboard className="h-3 w-3" />
            Даатгалын систем
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky to-brand text-sm font-extrabold text-white">
              {initial}
            </span>
            <div className="hidden text-right sm:block">
              <p className="flex items-center gap-1 text-xs font-bold text-white">
                {displayName}
                {user.isVerified && <BadgeCheck className="h-3.5 w-3.5 text-sky" />}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-slate-500">
                {user.type === "company" ? "Байгууллага" : "Хувь хүн"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="Гарах"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all hover:border-red-400/50 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 border-b border-white/[0.06] bg-navy-deep/40 p-4 backdrop-blur-xl md:w-60 md:border-b-0 md:border-r">
          <p className="mb-3 hidden px-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 md:block">
            Миний хуудас
          </p>
          <nav className="flex gap-1 overflow-x-auto md:flex-col">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[13px] font-semibold transition-all duration-200",
                  tab === t.id
                    ? "bg-gradient-to-r from-brand to-brand-dark text-white shadow-[0_4px_16px_rgba(37,99,235,0.35)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-5 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="mx-auto max-w-3xl"
            >
              {tab === "personal" && (
                <section>
                  <h1 className="text-xl font-extrabold tracking-tight text-white">Хувийн мэдээлэл</h1>
                  <p className="mt-1 text-sm text-slate-500">Таны бүртгэлийн үндсэн мэдээлэл</p>
                  <div className="mt-6 grid gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 sm:grid-cols-2 sm:p-6">
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
                  <div className="mt-5 flex flex-wrap gap-2">
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
                </section>
              )}

              {tab === "company" && (
                <section>
                  <h1 className="text-xl font-extrabold tracking-tight text-white">
                    {user.companyName ?? "Байгууллагын мэдээлэл"}
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">Байгууллагын бүртгэлийн мэдээлэл</p>
                  <div className="mt-6 grid gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 sm:grid-cols-2 sm:p-6">
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
                    <p className="mt-5 rounded-xl border border-sky/30 bg-sky/10 px-4 py-3 text-xs leading-relaxed text-sky">
                      Байгууллагын мэдээлэл хараахан бүртгэгдээгүй байна. +976 7777-9000 дугаарт холбогдож мэдээллээ бүртгүүлнэ үү.
                    </p>
                  )}
                </section>
              )}

              {tab === "qr" && (
                <section className="flex flex-col items-center py-8">
                  <h1 className="mb-8 text-xl font-extrabold tracking-tight text-white">Миний QR</h1>
                  <div className="relative grid h-52 w-52 grid-cols-9 gap-[3px] rounded-2xl bg-white p-3 shadow-[0_0_44px_rgba(56,189,248,0.3)]">
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
                  <p className="mt-5 text-sm font-bold text-white">{displayName}</p>
                  <p className="mt-1 font-mono text-xs text-slate-500">{user._id}</p>
                </section>
              )}

              {tab === "sign" && (
                <section>
                  <h1 className="text-xl font-extrabold tracking-tight text-white">Гарын үсэг</h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Тоон гарын үсгийн төлөв болон баталгаажуулалтын түүх
                  </p>
                  <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 text-sm text-slate-500">
                    Одоогоор гарын үсгийн хүсэлт байхгүй байна.
                  </div>
                </section>
              )}

              {tab === "docs" && (
                <section>
                  <h1 className="text-xl font-extrabold tracking-tight text-white">Бичиг баримт</h1>
                  <p className="mt-1 text-sm text-slate-500">Таны гэрээ, баримт бичгууд</p>
                  <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 py-14 text-center">
                    <FileText className="h-10 w-10 text-slate-700" />
                    <p className="text-sm text-slate-500">Бичиг баримт байхгүй байна</p>
                  </div>
                </section>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
