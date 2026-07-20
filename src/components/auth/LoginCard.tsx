"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Phone, Fingerprint, Loader2, ScanLine } from "lucide-react";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "";

type TabId = "credentials" | "esign";

const TABS: { id: TabId; label: string }[] = [
  { id: "credentials", label: "Нэр, нууц үг" },
  { id: "esign", label: "Тоон гарын үсэг" },
];

async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-app-token": process.env.NEXT_PUBLIC_ERXES_APP_TOKEN ?? "",
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors[0]?.message ?? "Алдаа гарлаа");
  return json.data as T;
}

function saveSession(payload: unknown) {
  try {
    const data = typeof payload === "string" ? JSON.parse(payload) : payload;
    const obj = data as { token?: string; refreshToken?: string };
    if (obj?.token) localStorage.setItem("token", obj.token);
    if (obj?.refreshToken) localStorage.setItem("refreshToken", obj.refreshToken);
  } catch {
    if (typeof payload === "string") localStorage.setItem("token", payload);
  }
}

function QrBox() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative grid h-44 w-44 grid-cols-9 gap-[3px] rounded-2xl bg-white p-3 shadow-[0_0_36px_rgba(56,189,248,0.25)]">
        {Array.from({ length: 81 }).map((_, i) => {
          const on = (i * 7 + ((i / 9) | 0) * 13) % 3 !== 0;
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
        <span className="absolute inset-0 m-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white">
          <ScanLine className="h-6 w-6 text-brand" />
        </span>
      </div>
      <p className="max-w-[180px] text-center text-xs leading-relaxed text-slate-400">
        ins.monre апп-аар QR кодыг уншуулж нэвтэрнэ үү
      </p>
    </div>
  );
}

export function LoginCard() {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("credentials");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const isEmail = (v: string) => v.includes("@");

  const reset = () => {
    setError("");
    setNotice("");
  };

  const loginCredentials = async () => {
    if (!identifier || !password) {
      setError("Нэвтрэх нэр болон нууц үгээ оруулна уу");
      return;
    }
    setLoading(true);
    reset();
    try {
      const data = await gql<{ clientPortalUserLoginWithCredentials: unknown }>(
        `mutation($email: String, $phone: String, $password: String) {
          clientPortalUserLoginWithCredentials(email: $email, phone: $phone, password: $password)
        }`,
        {
          email: isEmail(identifier) ? identifier : undefined,
          phone: isEmail(identifier) ? undefined : identifier,
          password,
        }
      );
      saveSession(data.clientPortalUserLoginWithCredentials);
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Нэвтрэхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 pl-11 text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-sky/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-sky/20";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="w-full max-w-3xl"
    >
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <span className="relative h-20 w-20 overflow-hidden rounded-3xl shadow-[0_0_40px_rgba(34,197,94,0.35)]">
          <Image src="/logo.jpg" alt="ins.monre" fill sizes="80px" className="object-cover" priority />
        </span>
        <h1 className="text-xl font-extrabold tracking-tight text-white">
          ins<span className="text-sky">.monre</span>
        </h1>
      </div>

      {/* Card */}
      <div className="glass-deep flex flex-col gap-8 rounded-3xl p-6 sm:p-8 md:flex-row md:items-stretch">
        <div className="hidden items-center justify-center md:flex">
          <QrBox />
        </div>

        <div className="flex flex-1 flex-col">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-navy-deep/60 p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTab(t.id);
                  reset();
                }}
                className={cn(
                  "rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-200",
                  tab === t.id
                    ? "bg-brand text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)]"
                    : "text-slate-400 hover:text-white"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Panels */}
          <div className="mt-6 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {tab === "credentials" && (
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void loginCredentials();
                    }}
                  >
                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        className={inputCls}
                        placeholder="Нэвтрэх нэр (имэйл эсвэл утас)"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        autoComplete="username"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        className={inputCls}
                        type="password"
                        placeholder="Нууц үг"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                    </div>
                    <div className="text-right">
                      <button type="button" className="text-xs font-semibold text-sky transition-colors hover:text-sky/70">
                        нууц үг мартсан?
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-glow rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-brand-dark disabled:opacity-60"
                    >
                      {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Нэвтрэх"}
                    </button>
                  </form>
                )}

                {tab === "esign" && (
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <Fingerprint className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        className={inputCls}
                        placeholder="Утасны дугаар"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        inputMode="tel"
                      />
                    </div>
                    <p className="text-xs leading-relaxed text-slate-500">
                      Дан систем эсвэл e-Mongolia апп-ын тоон гарын үсгээр нэвтэрнэ.
                    </p>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        if (!phone) {
                          setError("Утасны дугаараа оруулна уу");
                          return;
                        }
                        reset();
                        setNotice("Таны утас руу гарын үсгийн хүсэлт илгээлээ. Апп-аасаа баталгаажуулна уу.");
                      }}
                      className="btn-glow rounded-full bg-brand px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-brand-dark disabled:opacity-60"
                    >
                      Гарын үсэг зурах
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Messages */}
          {error && (
            <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-300">
              {error}
            </p>
          )}
          {notice && (
            <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300">
              {notice}
            </p>
          )}
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        Бүртгэлгүй юу? <span className="font-semibold text-sky">+976 7777-9000</span> дугаарт холбогдоно уу
      </p>
    </motion.div>
  );
}
