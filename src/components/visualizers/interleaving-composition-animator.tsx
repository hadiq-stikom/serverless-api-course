"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  FileCode, 
  Server, 
  Laptop, 
  Sparkles, 
  Box, 
  Lock 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function InterleavingCompositionAnimator() {
  const [pattern, setPattern] = useState<"recommended" | "antipattern">("recommended");
  const [isModalOpen, setIsModalOpen] = useState(true);

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
              Simulator Pola Komposisi (Interleaving Pattern)
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Pelajari aturan emas merakit Server Component ke dalam Client Component tanpa membocorkan bundle JS.
          </p>
        </div>

        {/* Pattern Switcher */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl self-start sm:self-auto border border-zinc-200 dark:border-zinc-700/60">
          <button
            type="button"
            onClick={() => setPattern("recommended")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              pattern === "recommended"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            ✅ Pola Benar (Props Children)
          </button>
          <button
            type="button"
            onClick={() => setPattern("antipattern")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              pattern === "antipattern"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            ❌ Anti-Pattern (Direct Import)
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Code Structure & Diagnostics */}
        <div className="lg:col-span-6 space-y-3">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs overflow-x-auto shadow-inner space-y-2">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
              <span className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                {pattern === "recommended" ? "src/app/page.tsx (Server Component)" : "src/components/client-modal.tsx ('use client')"}
              </span>
              <Badge className={pattern === "recommended" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-rose-500/20 text-rose-300 border-rose-500/30"}>
                {pattern === "recommended" ? "Best Practice" : "Anti-Pattern"}
              </Badge>
            </div>

            <pre className="text-[11px] leading-relaxed pt-1">
              {pattern === "recommended" ? (
`// 🌟 Komposisi via Children Props:
import { ClientModal } from "@/components/client-modal";
import { ServerTaskList } from "@/components/server-task-list";

export default function Page() {
  return (
    <ClientModal>
      {/* ServerTaskList dieksekusi di SERVER! */}
      <ServerTaskList />
    </ClientModal>
  );
}`
              ) : (
`// ⚠️ SALAH: Mengimpor Server Component ke Client
"use client";
import { useState } from "react";
// ❌ ServerTaskList akan TERPAKSA di-bundle ke Client JS!
import { ServerTaskList } from "@/components/server-task-list";

export function ClientModal() {
  const [open, setOpen] = useState(true);
  return open ? <div><ServerTaskList /></div> : null;
}`
              )}
            </pre>
          </div>

          {/* Diagnostic Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 space-y-1">
              <span className="text-[11px] text-zinc-500 font-medium">Beban Bundle JS Klien:</span>
              <div className="text-base font-bold flex items-center gap-1.5">
                {pattern === "recommended" ? (
                  <span className="text-emerald-600 dark:text-emerald-400">~2.1 kB (Hanya Modal)</span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400">~68.4 kB (Bocor ke Client!)</span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 space-y-1">
              <span className="text-[11px] text-zinc-500 font-medium">Isolasi Database & Secrets:</span>
              <div className="text-base font-bold flex items-center gap-1.5">
                {pattern === "recommended" ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> 100% Aman di Server
                  </span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Berisiko Bocor ke Browser
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Visual Component Hierarchy & Interactive Simulation */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span>Visualisasi Hierarki Komponen</span>
            <span className="text-[10px] text-zinc-400">Live Mock Preview</span>
          </div>

          {/* Interactive Shell Demo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Simulasi State Client:</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsModalOpen(!isModalOpen)}
                className="text-xs h-7 gap-1"
              >
                {isModalOpen ? "Tutup Container (Client)" : "Buka Container (Client)"}
              </Button>
            </div>

            {/* Simulated Modal Box */}
            <AnimatePresence>
              {isModalOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-xl border-2 border-dashed border-indigo-400 dark:border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    <span className="flex items-center gap-1.5">
                      <Laptop className="w-3.5 h-3.5" />
                      &lt;ClientModal&gt; Pembungkus Interaktif
                    </span>
                    <Badge variant="outline" className="bg-white/80 dark:bg-zinc-900 text-[10px]">
                      &apos;use client&apos;
                    </Badge>
                  </div>

                  {/* Children Slot */}
                  <div className={`p-3.5 rounded-lg border transition-all ${
                    pattern === "recommended"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-100"
                      : "bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-600 text-rose-900 dark:text-rose-100"
                  }`}>
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5" />
                        &lt;ServerTaskList /&gt; (Konten Data)
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">
                        {pattern === "recommended" ? "Passed via {children} (0 kB JS)" : "Direct Imported (Overhead JS!)"}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-80 leading-relaxed">
                      {pattern === "recommended"
                        ? "✅ Server Component dieksekusi di server terlebih dahulu. HTML-nya disalurkan ke dalam slot {children} ClientModal tanpa menambah bundle JavaScript!"
                        : "❌ Komponen ini dipaksa menjadi Client Component karena diimpor di dalam file yang memiliki deklarasi 'use client'."}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug">
            💡 <strong>Prinsip Inti:</strong> Jadikan Client Component sebagai pembungkus (*wrapper*) fleksibel yang menerima <code>children: React.ReactNode</code> agar komponen di dalamnya tetap murni berstatus Server Component.
          </div>
        </div>
      </div>
    </div>
  );
}
