"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ScanFace, UserCheck, AlertTriangle, CheckCircle2, Ratio, Sliders } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SmartCropFaceAnimator() {
  const [gravityMode, setGravityMode] = useState<"face" | "center" | "auto">("face");
  const [aspectRatio, setAspectRatio] = useState<"square" | "landscape" | "portrait">("square");

  // Koordinat crop simulasi
  const cropStyles = {
    square: "w-40 h-40",
    landscape: "w-56 h-32",
    portrait: "w-32 h-44",
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">👤</span>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
              Simulasi AI Smart Cropping &amp; Gravity Detection (g_face vs g_center)
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Mencegah tragedi kepala terpotong (*headless avatar*) pada foto profil dan thumbnail dinamis.
          </p>
        </div>

        {/* Gravity Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl self-start sm:self-center border border-zinc-200/60 dark:border-zinc-700/60 text-xs">
          <button
            type="button"
            onClick={() => setGravityMode("face")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              gravityMode === "face"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <ScanFace className="w-3.5 h-3.5" />
            g_face (AI Face)
          </button>
          <button
            type="button"
            onClick={() => setGravityMode("auto")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              gravityMode === "auto"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            g_auto (AI Salience)
          </button>
          <button
            type="button"
            onClick={() => setGravityMode("center")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              gravityMode === "center"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            g_center (Kaku)
          </button>
        </div>
      </div>

      {/* Kontrol Aspek Rasio */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-zinc-500 font-medium">Aspek Rasio Target:</span>
        {(["square", "landscape", "portrait"] as const).map((ratio) => (
          <button
            key={ratio}
            type="button"
            onClick={() => setAspectRatio(ratio)}
            className={`px-3 py-1 rounded-lg border text-xs font-semibold capitalize transition-all cursor-pointer ${
              aspectRatio === ratio
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            {ratio === "square" ? "1:1 Avatar" : ratio === "landscape" ? "16:9 Banner" : "3:4 Kartu"}
          </button>
        ))}
      </div>

      {/* Area Preview Simulasi Komparasi Crop */}
      <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 flex flex-col md:flex-row items-center justify-around gap-6">
        {/* Mock Foto Asli dengan Bounding Box Wajah */}
        <div className="space-y-1.5 text-center">
          <span className="text-[11px] font-mono text-zinc-400">1. Foto Asli (Full Shot)</span>
          <div className="relative w-48 h-64 rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden flex flex-col items-center justify-between p-3">
            {/* Langit */}
            <div className="w-full h-8 bg-zinc-800/60 rounded" />

            {/* Area Wajah AI Bounding Box */}
            <div className="relative w-20 h-20 rounded-full border-2 border-dashed border-indigo-400/80 bg-indigo-500/20 flex flex-col items-center justify-center">
              <span className="text-2xl">👩‍💼</span>
              <div className="absolute -bottom-4 bg-indigo-600 text-white text-[9px] font-mono px-1 rounded shadow">
                Face Detection
              </div>
            </div>

            {/* Badan & Latar */}
            <div className="w-32 h-16 bg-zinc-800 rounded-t-2xl flex items-center justify-center text-[10px] text-zinc-500">
              Pakaian / Badan
            </div>
          </div>
        </div>

        {/* Hasil Potongan Terpilih */}
        <div className="space-y-1.5 text-center flex flex-col items-center">
          <span className="text-[11px] font-mono text-zinc-400">
            2. Hasil Potongan Cloudinary ({gravityMode === "face" ? "c_fill, g_face" : gravityMode === "auto" ? "c_fill, g_auto" : "c_fill, g_center"})
          </span>
          <div className={`relative ${cropStyles[aspectRatio]} rounded-2xl border-2 overflow-hidden flex items-center justify-center transition-all ${
            gravityMode === "face" || gravityMode === "auto"
              ? "border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-500/10"
              : "border-rose-500 bg-rose-950/20 shadow-lg shadow-rose-500/10"
          }`}>
            {gravityMode === "face" ? (
              <div className="flex flex-col items-center justify-center animate-in zoom-in-95 duration-200">
                <span className="text-5xl">👩‍💼</span>
                <span className="text-[10px] font-bold text-emerald-400 mt-1">Wajah Terpusat Presisi!</span>
              </div>
            ) : gravityMode === "auto" ? (
              <div className="flex flex-col items-center justify-center animate-in zoom-in-95 duration-200">
                <span className="text-4xl">👩‍💼</span>
                <span className="text-[9px] font-mono text-purple-400 mt-1">Subjek Utama &amp; Bahu</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-2 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-10 bg-zinc-700 rounded-t-lg mb-1" />
                <span className="text-[10px] font-bold text-rose-400 leading-tight">
                  ❌ Kepala Terpotong! (Pusat Foto Hanya Menampilkan Pakaian)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* URL Generator Helper */}
      <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/60 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300">
        <span className="text-zinc-500 block text-[10px] mb-1">Sintaks &lt;CldImage&gt; Next.js:</span>
        <code>{`<CldImage src="avatars/user_102" width={200} height={200} crop="fill" gravity="${gravityMode}" />`}</code>
      </div>
    </div>
  );
}

