"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Zap, AlertTriangle, ShieldCheck, Gauge, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function GpuCompositingAnimator() {
  const [mode, setMode] = useState<"gpu" | "cpu">("gpu");

  const fps = mode === "gpu" ? 60 : 18;
  const cpuLoad = mode === "gpu" ? "4%" : "92%";
  const gpuLoad = mode === "gpu" ? "45%" : "12%";

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
              Pilar 4.2: Rekayasa Performa
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">GPU Composite vs CPU Reflow</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Pipeline Rendering Peramban: Mengapa Wajib Hanya Properti GPU?
          </h4>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={mode === "gpu" ? "default" : "outline"}
            onClick={() => setMode("gpu")}
            className="text-xs font-bold gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ✅ GPU Transform (60 FPS)
          </Button>
          <Button
            size="sm"
            variant={mode === "cpu" ? "destructive" : "outline"}
            onClick={() => setMode("cpu")}
            className="text-xs font-bold gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            ❌ CPU Geometri (18 FPS Jank)
          </Button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block font-mono">
            Framerate (FPS)
          </span>
          <span className={`text-xl font-black font-mono ${mode === "gpu" ? "text-emerald-500" : "text-red-500 animate-pulse"}`}>
            {fps} FPS
          </span>
        </div>
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block font-mono">
            Beban CPU Thread
          </span>
          <span className={`text-xl font-black font-mono ${mode === "gpu" ? "text-emerald-500" : "text-red-500"}`}>
            {cpuLoad}
          </span>
        </div>
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block font-mono">
            GPU Compositor
          </span>
          <span className="text-xl font-black font-mono text-cyan-500">
            {gpuLoad}
          </span>
        </div>
      </div>

      {/* 4 Tahapan Browser Pipeline */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Jalur Pipeline Rendering Peramban (Frame Execution):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          {/* Step 1 */}
          <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
            <span className="font-bold text-zinc-700 dark:text-zinc-300 block">1. Style Recalc</span>
            <span className="text-[10px] text-zinc-500">Hitung aturan CSS</span>
          </div>

          {/* Step 2: Layout / Reflow */}
          <div className={`p-3 rounded-xl border transition-all ${
            mode === "cpu"
              ? "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300 shadow-sm"
              : "border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/40 text-zinc-400 opacity-50"
          }`}>
            <span className="font-bold block">2. Layout (Reflow)</span>
            <span className="text-[10px]">
              {mode === "cpu" ? "⚠️ CPU HITUNG GEOMETRI!" : "✨ BYPASSED (Dilewati)"}
            </span>
          </div>

          {/* Step 3: Paint */}
          <div className={`p-3 rounded-xl border transition-all ${
            mode === "cpu"
              ? "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300 shadow-sm"
              : "border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/40 text-zinc-400 opacity-50"
          }`}>
            <span className="font-bold block">3. Paint (Repaint)</span>
            <span className="text-[10px]">
              {mode === "cpu" ? "⚠️ CPU GAMBAR PIKSEL!" : "✨ BYPASSED (Dilewati)"}
            </span>
          </div>

          {/* Step 4: Composite */}
          <div className="p-3 rounded-xl border border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 shadow-sm">
            <span className="font-bold block">4. Composite</span>
            <span className="text-[10px]">
              🚀 GPU Layer Shift (Instan)
            </span>
          </div>
        </div>
      </div>

      {/* Educational Callout */}
      <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
        mode === "gpu"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
          : "border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-300"
      }`}>
        {mode === "gpu" ? (
          <>
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong>Standar Emas Industri:</strong> Menggunakan <code>transform: translateY(...)</code> dan <code>opacity</code>. Tahapan Layout Reflow dan Repaint dilewati secara mutlak! GPU menggeser bitmap layer secara langsung pada monitor, menjamin framerate konsisten 60–120 FPS tanpa boros baterai.
            </div>
          </>
        ) : (
          <>
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <strong>Dosa Fatal Animasi:</strong> Mengubah <code>height</code>, <code>top</code>, atau <code>margin</code>. CPU peramban dipaksa menghitung ulang koordinat dan geometri seluruh halaman 60 kali per detik. Layar mengalami *frame dropping* (tersendat-sendat) dan suhu laptop meningkat.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
