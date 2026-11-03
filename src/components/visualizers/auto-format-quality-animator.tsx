"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sliders, Sparkles, CheckCircle2, FileImage, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AutoFormatQualityAnimator() {
  const [selectedFormat, setSelectedFormat] = useState<"jpeg" | "webp" | "avif">("webp");
  const [qualityMode, setQualityMode] = useState<"eco" | "good" | "best">("good");

  // Matriks ukuran & kualitas perseptual
  const formatData = {
    jpeg: { name: "Original JPEG", ext: "jpg", sizeKB: 1850, ssim: 1.0, color: "text-zinc-500", bar: "bg-zinc-400" },
    webp: { name: "Modern WebP", ext: "webp", sizeKB: qualityMode === "eco" ? 220 : qualityMode === "good" ? 310 : 440, ssim: 0.98, color: "text-indigo-500", bar: "bg-indigo-500" },
    avif: { name: "Next-Gen AVIF", ext: "avif", sizeKB: qualityMode === "eco" ? 140 : qualityMode === "good" ? 195 : 280, ssim: 0.99, color: "text-emerald-500", bar: "bg-emerald-500" },
  };

  const current = formatData[selectedFormat];
  const originalSize = 1850;
  const savingsPct = Math.round(((originalSize - current.sizeKB) / originalSize) * 100);

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">🪄</span>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
              Simulasi AI Optimization: f_auto (Format) &amp; q_auto (Kualitas)
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Menganalisis negosiasi format otomatis dan reduksi bobot byte tanpa degradasi mata manusia.
          </p>
        </div>

        {/* Quality Level Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl self-start sm:self-center border border-zinc-200/60 dark:border-zinc-700/60 text-xs">
          <span className="px-2 font-medium text-zinc-500 text-[11px]">Kualitas:</span>
          {(["eco", "good", "best"] as const).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQualityMode(q)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all capitalize cursor-pointer ${
                qualityMode === q
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              q_auto:{q}
            </button>
          ))}
        </div>
      </div>

      {/* Format Selector Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(["jpeg", "webp", "avif"] as const).map((fmt) => {
          const item = formatData[fmt];
          const isSelected = selectedFormat === fmt;
          return (
            <div
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/50 hover:border-zinc-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <FileImage className={`w-4 h-4 ${item.color}`} />
                  {item.name}
                </span>
                <Badge variant={isSelected ? "default" : "outline"} className="text-[10px] uppercase font-mono">
                  .{item.ext}
                </Badge>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-base font-black font-mono text-zinc-900 dark:text-white">
                  {item.sizeKB} KB
                </span>
                <span className={`text-[11px] font-bold ${fmt === "jpeg" ? "text-zinc-500" : "text-emerald-500"}`}>
                  {fmt === "jpeg" ? "Original Base" : `Hemat -${Math.round(((originalSize - item.sizeKB) / originalSize) * 100)}%`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visualisasi Bar Ukuran File */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-700 dark:text-zinc-300">
            Perbandingan Bobot Byte pada Jaringan Pengguna (LCP Speed):
          </span>
          <span className="font-mono text-zinc-500 text-[11px]">
            Skor SSIM Mata: <strong className="text-emerald-500 font-bold">{current.ssim * 100}% Identik</strong>
          </span>
        </div>

        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-4 rounded-full overflow-hidden flex">
          <motion.div
            initial={false}
            animate={{ width: `${(current.sizeKB / originalSize) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`h-full ${current.bar} flex items-center justify-end pr-2 text-[10px] font-mono font-bold text-white`}
          >
            {current.sizeKB} KB
          </motion.div>
        </div>

        {/* Dynamic URL Generator Preview */}
        <div className="pt-1">
          <div className="text-[11px] text-zinc-500 mb-1 flex items-center justify-between">
            <span>Sintaks URL Transformasi Cloudinary Tergenerate:</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">Bebas kompresi manual di Photoshop!</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto">
            <code>
              https://res.cloudinary.com/demo/image/upload/
              <span className="text-amber-400 font-bold">f_auto</span>,
              <span className="text-emerald-400 font-bold">q_auto:{qualityMode}</span>
              /sample.jpg
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

