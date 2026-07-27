"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, QrCode, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Contract } from "./ContractList";
import QRCode from "qrcode";

function formatMNT(n: number) {
  return "₮" + n.toLocaleString("mn-MN");
}

type PaymentViewProps = {
  contract: Contract;
  onBack?: () => void;
  onPay?: (contract: Contract) => void;
};

export function PaymentView({ contract, onBack, onPay }: PaymentViewProps) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  const generateQr = async () => {
    setGenerating(true);
    const data = `ins.monre|${contract.number}|${contract.premium}|${contract.insuredName}|${contract.licensePlate || ""}`;
    try {
      const url = await QRCode.toDataURL(data, {
        width: 280,
        margin: 2,
        color: {
          dark: "#ffffff",
          light: "#0b0f19",
        },
      });
      setQrUrl(url);
    } catch {
      setQrUrl(null);
    } finally {
      setGenerating(false);
    }
  };

  const handleConfirmPaid = () => {
    setSuccess(true);
    setTimeout(() => {
      onPay?.({ ...contract, status: "paid" });
    }, 1200);
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
    <div className="mx-auto max-w-md p-4 lg:p-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Буцах
      </button>

      <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/40 shadow-xl backdrop-blur-sm">
        <div className="border-b border-slate-700/50 bg-[#0f1321]/80 px-6 py-5 text-center">
          <h1 className="text-lg font-bold text-white">Төлбөр төлөх</h1>
          <p className="mt-1 text-xs text-slate-400">QPay апп-аар QR кодыг уншуулна уу</p>
        </div>

        <div className="space-y-6 p-6">
          {/* Amount */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-5 text-center">
            <p className="text-xs font-medium text-indigo-300">Төлөх дүн</p>
            <p className="mt-1 text-3xl font-extrabold text-white">{formatMNT(contract.premium)}</p>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-700/50 bg-slate-900/40 p-5">
            {qrUrl ? (
              <>
                <img src={qrUrl} alt="Төлбөрийн QR код" className="h-56 w-56 rounded-lg" />
                <p className="mt-3 text-center text-xs text-slate-400">
                  {contract.number} · {contract.companyName}
                </p>
              </>
            ) : (
              <div className="flex h-56 w-56 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-700/60 text-slate-500">
                <QrCode className="h-12 w-12" />
                <p className="px-4 text-center text-xs">QR код үүсгэхийн тулд доорх товчийг дарна уу</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            {qrUrl ? (
              <>
                <button
                  type="button"
                  onClick={handleConfirmPaid}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-600"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Төлсөн
                </button>
                <button
                  type="button"
                  onClick={generateQr}
                  disabled={generating}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/60 px-5 py-3 text-xs font-bold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white disabled:opacity-50"
                >
                  <RefreshCw className={cn("h-4 w-4", generating && "animate-spin")} />
                  QR код шинэчлэх
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={generating}
                onClick={generateQr}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {generating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    QR код үүсгэж байна...
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4" />
                    QR код үүсгэх
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-5 py-3 text-xs font-bold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
            >
              Цуцлах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
