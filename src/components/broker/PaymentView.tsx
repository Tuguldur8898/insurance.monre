"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, ArrowLeft, CheckCircle2, ShieldCheck, Wallet, Building2, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Contract } from "./ContractList";

function formatMNT(n: number) {
  return "₮" + n.toLocaleString("mn-MN");
}

const PAYMENT_METHODS = [
  { id: "qpay", label: "QPay", icon: QrCode, description: "QPay апп-аар төлнө" },
  { id: "card", label: "Банкны карт", icon: CreditCard, description: "Visa / MasterCard / UnionPay" },
  { id: "bank", label: "Банкны шилжүүлэг", icon: Building2, description: "Дансаар шилжүүлэх" },
  { id: "wallet", label: "Цахан хэтэвч", icon: Wallet, description: "MonPay / SocialPay / MostMoney" },
];

type PaymentViewProps = {
  contract: Contract;
  onBack?: () => void;
  onPay?: (contract: Contract) => void;
};

export function PaymentView({ contract, onBack, onPay }: PaymentViewProps) {
  const [method, setMethod] = useState("qpay");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onPay?.({ ...contract, status: "paid" });
      }, 1200);
    }, 1500);
  };

  if (success) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400"
        >
          <CheckCircle2 className="h-10 w-10" />
        </motion.div>
        <h2 className="mt-6 text-xl font-bold text-white">Төлбөр амжилттай хийгдлээ</h2>
        <p className="mt-2 text-sm text-slate-400">
          {contract.number} гэрээний төлбөр {formatMNT(contract.premium)} төлөгдлөө.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-4 lg:p-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Буцах
      </button>

      <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/40 shadow-xl backdrop-blur-sm">
        <div className="border-b border-slate-700/50 bg-[#0f1321]/80 px-6 py-5">
          <h1 className="text-lg font-bold text-white">Төлбөр төлөх</h1>
          <p className="mt-1 text-xs text-slate-400">Гэрээний төлбөрийг баталгаажуулна уу</p>
        </div>

        <div className="space-y-6 p-6">
          {/* Amount */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-5 text-center">
            <p className="text-xs font-medium text-indigo-300">Төлөх дүн</p>
            <p className="mt-1 text-3xl font-extrabold text-white">{formatMNT(contract.premium)}</p>
          </div>

          {/* Contract summary */}
          <div className="space-y-3 rounded-xl border border-slate-700/50 bg-slate-900/40 p-4">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Гэрээний дугаар</span>
              <span className="font-semibold text-white">{contract.number}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Даатгуулагч</span>
              <span className="font-semibold text-white">{contract.insuredName}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Улсын дугаар</span>
              <span className="font-semibold text-white">{contract.licensePlate || "-"}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Даатгалын компани</span>
              <span className="font-semibold text-white">{contract.companyName}</span>
            </div>
          </div>

          {/* Payment methods */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300">Төлбөрийн хэрэгсэл сонгох</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {PAYMENT_METHODS.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-3 text-left transition-all",
                      method === m.id
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-700/60 bg-slate-900/40 hover:border-slate-500"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        method === m.id ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className={cn("text-xs font-bold", method === m.id ? "text-white" : "text-slate-300")}>
                        {m.label}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-500">{m.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Таны төлбөрийн мэдээлэл SSL шифрлэлтээр хамгаалагдана.</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-5 py-3 text-xs font-bold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
            >
              Цуцлах
            </button>
            <button
              type="button"
              disabled={processing}
              onClick={handlePay}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Боловсруулж байна...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  {formatMNT(contract.premium)} төлөх
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
