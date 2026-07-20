"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Building2,
  Fingerprint,
  FileText,
  LogOut,
  Loader2,
  ShieldCheck,
  BadgeCheck,
  LayoutDashboard,
  UserCog,
  KeyRound,
  ImageIcon,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";
import { SignaturePanel } from "./SignaturePanel";
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

type TabId = "personal" | "company" | "sign" | "docs";
type ModalId = "name" | "username" | "password" | null;

const TABS: { id: TabId; label: string; icon: typeof User }[] = [
  { id: "personal", label: "Хувийн мэдээлэл", icon: User },
  { id: "company", label: "Байгууллага", icon: Building2 },
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

function VerifyCard({ label, ok, note }: { label: string; ok: boolean | null; note?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-3.5",
        ok === true
          ? "border-emerald-500/50 bg-emerald-500/[0.07]"
          : "border-white/[0.08] bg-white/[0.02]"
      )}
    >
      {ok === true ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
      ) : (
        <XCircle className="h-5 w-5 shrink-0 text-slate-600" />
      )}
      <div>
        <p className="text-xs font-semibold leading-snug text-slate-200">{label}</p>
        <p className={cn("mt-0.5 text-[11px]", ok === true ? "text-emerald-400" : "text-slate-500")}>
          {note ?? (ok === true ? "Баталгаажсан" : "Баталгаажаагүй")}
        </p>
      </div>
    </div>
  );
}

export function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<CPUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabId>("personal");
  const [modal, setModal] = useState<ModalId>(null);
  const [modalError, setModalError] = useState("");
  const [modalNotice, setModalNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const getToken = () => localStorage.getItem("token") ?? "";

  const gql = async <T,>(query: string, variables: Record<string, unknown>): Promise<T> => {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-auth-token": getToken(),
      },
      body: JSON.stringify({ query, variables }),
    });
    const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
    if (json.errors?.length) throw new Error(json.errors[0]?.message ?? "Алдаа гарлаа");
    return json.data as T;
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    (async () => {
      try {
        const data = await gql<{ clientPortalCurrentUser: CPUser | null }>(
          `query {
            clientPortalCurrentUser {
              _id type email phone username firstName lastName avatar
              companyName companyRegistrationNumber
              isVerified isPhoneVerified isEmailVerified
              customFieldsData createdAt
            }
          }`,
          {}
        );
        const u = data.clientPortalCurrentUser;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.dispatchEvent(new Event("auth-changed"));
    router.push("/");
  };

  const openModal = (m: ModalId) => {
    if (!user) return;
    setModalError("");
    setModalNotice("");
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setUsername(user.username ?? "");
    setCurrentPassword("");
    setNewPassword("");
    setModal(m);
  };

  const saveName = async () => {
    setSaving(true);
    setModalError("");
    try {
      const data = await gql<{ clientPortalUserEdit: CPUser }>(
        `mutation($firstName: String, $lastName: String) {
          clientPortalUserEdit(firstName: $firstName, lastName: $lastName) {
            _id firstName lastName
          }
        }`,
        { firstName, lastName }
      );
      setUser((u) =>
        u ? { ...u, firstName: data.clientPortalUserEdit.firstName, lastName: data.clientPortalUserEdit.lastName } : u
      );
      setModal(null);
    } catch (e) {
      setModalError(e instanceof Error ? e.message : "Алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  const saveUsername = async () => {
    setSaving(true);
    setModalError("");
    try {
      const data = await gql<{ clientPortalUserEdit: CPUser }>(
        `mutation($username: String) {
          clientPortalUserEdit(username: $username) { _id username }
        }`,
        { username }
      );
      setUser((u) => (u ? { ...u, username: data.clientPortalUserEdit.username } : u));
      setModal(null);
    } catch (e) {
      setModalError(e instanceof Error ? e.message : "Алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    if (newPassword.length < 8 || !/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setModalError("Нууц үг 8+ тэмдэгт, том/жижиг үсэг болон тоо агуулсан байх ёстой");
      return;
    }
    setSaving(true);
    setModalError("");
    try {
      await gql(
        `mutation($currentPassword: String!, $newPassword: String!) {
          clientPortalUserChangePassword(currentPassword: $currentPassword, newPassword: $newPassword)
        }`,
        { currentPassword, newPassword }
      );
      setModalNotice("Нууц үг амжилттай солигдлоо");
      setTimeout(() => setModal(null), 1200);
    } catch (e) {
      setModalError(e instanceof Error ? e.message : "Алдаа гарлаа");
    } finally {
      setSaving(false);
    }
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
  const initials =
    ((user.lastName?.slice(0, 1) ?? "") + (user.firstName?.slice(0, 1) ?? "")).toUpperCase() ||
    displayName.slice(0, 1).toUpperCase();
  const cf = user.customFieldsData ?? {};
  const cfStr = (k: string) => (typeof cf[k] === "string" ? (cf[k] as string) : "");

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-sky/60 focus:ring-2 focus:ring-sky/20";

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
              {initials}
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
              className="mx-auto max-w-4xl"
            >
              {tab === "personal" && (
                <section className="flex flex-col gap-6">
                  {/* Profile header */}
                  <div className="flex flex-col gap-6 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-5">
                      <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-sky/30 bg-gradient-to-br from-frost to-navy text-2xl font-extrabold text-sky shadow-[0_0_28px_rgba(56,189,248,0.25)]">
                        {initials}
                      </span>
                      <div>
                        <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-white">
                          {displayName}
                          {user.isVerified && <BadgeCheck className="h-5 w-5 text-sky" />}
                        </h1>
                        <p className="mt-1 text-sm text-sky">{user.email ?? user.phone}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2.5 sm:w-56">
                      <button
                        type="button"
                        onClick={() => openModal("username")}
                        className="flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-xs font-bold text-white transition-all hover:scale-[1.02] hover:bg-brand-dark"
                      >
                        <UserCog className="h-4 w-4" />
                        Нэвтрэх нэр өөрчлөх
                      </button>
                      <button
                        type="button"
                        onClick={() => openModal("password")}
                        className="flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-xs font-bold text-white transition-all hover:scale-[1.02] hover:bg-brand-dark"
                      >
                        <KeyRound className="h-4 w-4" />
                        Нууц үг өөрчлөх
                      </button>
                      <button
                        type="button"
                        className="flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-bold text-slate-300 transition-all hover:border-sky/50 hover:text-sky"
                      >
                        <ImageIcon className="h-4 w-4" />
                        Гарын үсгийн зураг солих
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Info */}
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
                      <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
                          Мэдээлэл
                        </h2>
                        <button
                          type="button"
                          onClick={() => openModal("name")}
                          className="text-xs font-bold text-sky transition-colors hover:text-sky/70"
                        >
                          Засах
                        </button>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Овог" value={user.lastName} />
                        <Field label="Нэр" value={user.firstName} />
                        <Field label="Хүйс" value={cfStr("gender")} />
                        <Field label="Хаяг" value={cfStr("address")} />
                        <Field label="Утас" value={user.phone} />
                        <Field label="Имэйл" value={user.email} />
                      </div>
                    </div>

                    {/* Verification */}
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
                      <h2 className="mb-5 text-sm font-extrabold uppercase tracking-wider text-slate-300">
                        Баталгаажуулалт
                      </h2>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <VerifyCard label="Регистрээр" ok={!!user.isVerified} />
                        <VerifyCard label="Утасны дугаараар" ok={!!user.isPhoneVerified} />
                        <VerifyCard label="Имэйлээр" ok={!!user.isEmailVerified} />
                        <VerifyCard label="Дан системээр" ok={null} note="Холбогдоогүй" />
                        <VerifyCard label="Иргэний үнэмлэхээр (Хур)" ok={null} note="Холбогдоогүй" />
                        <VerifyCard label="Тоон гарын үсгээр" ok={null} note="Холбогдоогүй" />
                      </div>
                    </div>
                  </div>

                  {/* Access */}
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
                    <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wider text-slate-300">
                      Нэвтрэх эрхүүд
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-sky/30 bg-sky/10 px-4 py-1.5 text-xs font-bold text-sky">
                        {user.type === "company" ? "Байгууллагын админ" : "Хувь хүн"}
                      </span>
                      {user.companyName && (
                        <span className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold text-slate-300">
                          {user.companyName}
                        </span>
                      )}
                    </div>
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

              {tab === "sign" && (
                <section>
                  <h1 className="text-xl font-extrabold tracking-tight text-white">Гарын үсэг</h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Гарын үсгээ гараар зурах эсвэл зураг оруулж хадгална уу
                  </p>
                  <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 sm:p-6">
                    <SignaturePanel userId={user._id} />
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

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/80 p-4 backdrop-blur-sm"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-deep w-full max-w-md rounded-3xl p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-base font-extrabold text-white">
                  {modal === "name" && "Нэр өөрчлөх"}
                  {modal === "username" && "Нэвтрэх нэр өөрчлөх"}
                  {modal === "password" && "Нууц үг өөрчлөх"}
                </h3>
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  aria-label="Хаах"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3.5">
                {modal === "name" && (
                  <>
                    <input className={inputCls} placeholder="Овог" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <input className={inputCls} placeholder="Нэр" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <ModalButton saving={saving} onClick={saveName} label="Хадгалах" />
                  </>
                )}
                {modal === "username" && (
                  <>
                    <input className={inputCls} placeholder="Нэвтрэх нэр" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <ModalButton saving={saving} onClick={saveUsername} label="Хадгалах" />
                  </>
                )}
                {modal === "password" && (
                  <>
                    <input className={inputCls} type="password" placeholder="Одоогийн нууц үг" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" />
                    <input className={inputCls} type="password" placeholder="Шинэ нууц үг" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
                    <ModalButton saving={saving} onClick={savePassword} label="Солих" />
                  </>
                )}
                {modalError && (
                  <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-300">
                    {modalError}
                  </p>
                )}
                {modalNotice && (
                  <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300">
                    {modalNotice}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalButton({ saving, onClick, label }: { saving: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      disabled={saving}
      onClick={onClick}
      className="btn-glow mt-1 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-brand-dark disabled:opacity-60"
    >
      {saving ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : label}
    </button>
  );
}
