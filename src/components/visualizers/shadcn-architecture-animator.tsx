"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Layers, 
  FolderLock, 
  FolderCheck, 
  FileCode, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Code, 
  Palette, 
  Sliders 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ShadcnArchitectureAnimator() {
  const [approach, setApproach] = useState<"shadcn" | "npm">("shadcn");
  const [demoVariant, setDemoVariant] = useState<"default" | "outline" | "destructive">("default");

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator Filosofi Open Architecture Shadcn UI
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Bandingkan kepemilikan kode dan kemudahan kustomisasi antara Shadcn UI vs Library NPM konvensional.
          </p>
        </div>

        {/* Toggle Switcher */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl self-start sm:self-auto border border-zinc-200 dark:border-zinc-700/60">
          <button
            type="button"
            onClick={() => setApproach("shadcn")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              approach === "shadcn"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Shadcn UI (Open Scaffolding)
          </button>
          <button
            type="button"
            onClick={() => setApproach("npm")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              approach === "npm"
                ? "bg-zinc-800 text-white shadow-xs dark:bg-zinc-700"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            NPM Library (Blackbox)
          </button>
        </div>
      </div>

      {/* Architecture Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kolom 1: Lokasi & Kepemilikan Berkas */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              {approach === "shadcn" ? (
                <FolderCheck className="w-4 h-4 text-emerald-500" />
              ) : (
                <FolderLock className="w-4 h-4 text-amber-500" />
              )}
              Lokasi Kode Komponen
            </span>
            <Badge
              variant="outline"
              className={
                approach === "shadcn"
                  ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px]"
                  : "border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px]"
              }
            >
              {approach === "shadcn" ? "100% Milik Anda" : "Terkunci di node_modules"}
            </Badge>
          </div>

          <div className="rounded-lg p-3 bg-zinc-950 text-zinc-200 font-mono text-xs border border-zinc-800 space-y-1">
            {approach === "shadcn" ? (
              <>
                <div className="text-emerald-400 font-bold">src/components/ui/button.tsx</div>
                <div className="text-[11px] text-zinc-400">├── Bebas diedit langsung di editor VS Code</div>
                <div className="text-[11px] text-zinc-400">└── Tanpa ketergantungan pihak ketiga tertutup</div>
              </>
            ) : (
              <>
                <div className="text-amber-400 font-bold">node_modules/@vendor/button/dist/index.js</div>
                <div className="text-[11px] text-zinc-500">├── Berkas binary/bundle terkunci 🔒</div>
                <div className="text-[11px] text-zinc-500">└── Dilarang diedit langsung (tertimpa saat npm install)</div>
              </>
            )}
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {approach === "shadcn"
              ? "Shadcn menyalin source code murni langsung ke repositori Anda. Anda memiliki kendali penuh atas setiap baris kode komponen."
              : "Library NPM konvensional membungkus komponen dalam paket biner di node_modules. Jika ada bug atau ingin menambah fitur, Anda harus menunggu maintainer merilis versi baru."}
          </p>
        </div>

        {/* Kolom 2: Kemudahan Kustomisasi & Tailwind */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-indigo-500" />
              Kemudahan Kustomisasi Desain
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Tailwind + CVA</span>
          </div>

          <div className="rounded-lg p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <span className="text-[11px] font-medium text-zinc-500">Coba Ganti Varian Tombol Shadcn:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setDemoVariant("default")}
                className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                  demoVariant === "default" ? "bg-indigo-600 text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                default
              </button>
              <button
                type="button"
                onClick={() => setDemoVariant("outline")}
                className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                  demoVariant === "outline" ? "bg-indigo-600 text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                outline
              </button>
              <button
                type="button"
                onClick={() => setDemoVariant("destructive")}
                className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                  demoVariant === "destructive" ? "bg-rose-600 text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                destructive
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] text-zinc-400">Preview Komponen:</span>
              <Button size="sm" variant={demoVariant} className="text-xs h-8">
                {demoVariant === "default" && "Tombol Primer"}
                {demoVariant === "outline" && "Tombol Sekunder (Outline)"}
                {demoVariant === "destructive" && "Hapus Data (Destructive)"}
              </Button>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {approach === "shadcn"
              ? "Cukup gunakan utility class Tailwind. Varian tombol diatur secara rapi melalui pustaka class-variance-authority (CVA)."
              : "Membutuhkan override ThemeProvider yang rumit atau CSS specificity hacks (!important) untuk mengubah desain bawaan vendor."}
          </p>
        </div>
      </div>
    </div>
  );
}
