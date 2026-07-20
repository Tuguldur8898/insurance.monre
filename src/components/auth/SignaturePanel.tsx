"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, PenLine, Eraser, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "upload" | "draw";

export function SignaturePanel({ userId }: { userId: string }) {
  const [mode, setMode] = useState<Mode>("draw");
  const [saved, setSaved] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasInk, setHasInk] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const storageKey = `signature_${userId}`;

  useEffect(() => {
    setSaved(localStorage.getItem(storageKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || mode !== "draw") return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#38bdf8";
    }
  }, [mode]);

  const getPos = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    return { x: e.clientX - (rect?.left ?? 0), y: e.clientY - (rect?.top ?? 0) };
  };

  const startDraw = (e: React.PointerEvent) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    setDrawing(true);
    setHasInk(true);
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const moveDraw = (e: React.PointerEvent) => {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => setDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
  };

  const saveCanvas = () => {
    const data = canvasRef.current?.toDataURL("image/png");
    if (!data || !hasInk) return;
    localStorage.setItem(storageKey, data);
    setSaved(data);
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const saveUpload = () => {
    if (!preview) return;
    localStorage.setItem(storageKey, preview);
    setSaved(preview);
  };

  const removeSaved = () => {
    localStorage.removeItem(storageKey);
    setSaved(null);
    setPreview(null);
    clearCanvas();
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Saved signature */}
      {saved && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.05] p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Хадгалагдсан гарын үсэг
            </p>
            <button
              type="button"
              onClick={removeSaved}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-300 transition-colors hover:text-red-200"
            >
              <Trash2 className="h-3.5 w-3.5" /> Устгах
            </button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={saved} alt="Гарын үсэг" className="h-28 rounded-xl bg-white object-contain px-4 py-2" />
        </div>
      )}

      {/* Mode switch */}
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-navy-deep/60 p-1">
        <button
          type="button"
          onClick={() => setMode("draw")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-all",
            mode === "draw" ? "bg-brand text-white" : "text-slate-400 hover:text-white"
          )}
        >
          <PenLine className="h-4 w-4" /> Гараар зурах
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-all",
            mode === "upload" ? "bg-brand text-white" : "text-slate-400 hover:text-white"
          )}
        >
          <Upload className="h-4 w-4" /> Зураг оруулах
        </button>
      </div>

      {mode === "draw" && (
        <div className="flex flex-col gap-3">
          <canvas
            ref={canvasRef}
            onPointerDown={startDraw}
            onPointerMove={moveDraw}
            onPointerUp={endDraw}
            onPointerLeave={endDraw}
            className="h-48 w-full cursor-crosshair rounded-2xl border border-dashed border-sky/30 bg-white/[0.04] touch-none"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={clearCanvas}
              className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs font-bold text-slate-300 transition-all hover:border-sky/50 hover:text-sky"
            >
              <Eraser className="h-4 w-4" /> Цэвэрлэх
            </button>
            <button
              type="button"
              onClick={saveCanvas}
              disabled={!hasInk}
              className="btn-glow flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white transition-all hover:scale-[1.02] hover:bg-brand-dark disabled:opacity-50"
            >
              <Check className="h-4 w-4" /> Хадгалах
            </button>
          </div>
        </div>
      )}

      {mode === "upload" && (
        <div className="flex flex-col gap-3">
          <label className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-sky/30 bg-white/[0.04] text-slate-400 transition-all hover:border-sky/60 hover:text-sky">
            <Upload className="h-8 w-8" />
            <span className="text-xs font-semibold">PNG, JPG зураг сонгох</span>
            <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
          </label>
          {preview && (
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="h-24 rounded-xl bg-white object-contain px-3 py-2" />
              <button
                type="button"
                onClick={saveUpload}
                className="btn-glow flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white transition-all hover:scale-[1.02] hover:bg-brand-dark"
              >
                <Check className="h-4 w-4" /> Хадгалах
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
