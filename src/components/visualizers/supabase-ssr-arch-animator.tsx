"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Layers, 
  ShieldCheck, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Server, 
  Globe, 
  Cpu, 
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SupabaseSsrArchAnimator() {
  const [activeArch, setActiveArch] = useState<"ssr" | "legacy">("ssr");

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-xs font-semibold">
              Pilar 3.1: SDK Evolution
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">@supabase/ssr vs auth-helpers</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Arsitektur @supabase/ssr: Pola Adapter vs Pustaka Monolitik Usang
          </h4>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveArch("ssr")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeArch === "ssr"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            @supabase/ssr (Standar Resmi 2026)
          </button>
          <button
            type="button"
            onClick={() => setActiveArch("legacy")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeArch === "legacy"
                ? "bg-zinc-700 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            auth-helpers (Deprecated)
          </button>
        </div>
      </div>

      {/* Architecture Visual Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Architecture Diagram */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
            <span>Model Komunikasi &amp; Abstraksi Cookie:</span>
            <span className="font-mono text-zinc-400">
              {activeArch === "ssr" ? "Adapter Pattern" : "Hardcoded Framework Coupling"}
            </span>
          </div>

          <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 font-mono font-bold">
              <span>Next.js 16 App Router (RSC &amp; Server Actions)</span>
            </div>

            <div className="flex items-center justify-center text-zinc-400">
              <span className="text-[11px] font-mono">↕️ {activeArch === "ssr" ? "getAll() & setAll() Adapters" : "Manipulasi req / res langsung"}</span>
            </div>

            <div className={`p-2.5 rounded border text-center font-mono font-bold ${
              activeArch === "ssr"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
            }`}>
              {activeArch === "ssr" ? "@supabase/ssr Engine" : "@supabase/auth-helpers-nextjs (Tutup & Kaku)"}
            </div>

            <div className="flex items-center justify-center text-zinc-400">
              <span className="text-[11px] font-mono">↕️ Supabase Auth Gateway</span>
            </div>

            <div className="p-2 rounded bg-zinc-200/60 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-center font-mono text-zinc-700 dark:text-zinc-300">
              Supabase Cloud (PostgreSQL Auth &amp; GoTrue)
            </div>
          </div>
        </div>

        {/* Right: Technical Merits Card */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-500" />
              <span>Karakteristik &amp; Ketahanan Arsitektur:</span>
            </div>

            <div className="space-y-2 text-xs leading-relaxed">
              <div className="flex items-start gap-2">
                {activeArch === "ssr" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100">
                    {activeArch === "ssr" ? "Dukungan Chunking Cookie Otomatis" : "Risiko Cookie Overflow 4 kB"}
                  </strong>
                  <p className="text-zinc-500 text-[11px]">
                    {activeArch === "ssr" 
                      ? "Token sesi yang panjang otomatis dipecah menjadi beberapa chunk aman (sb-token.0, sb-token.1)."
                      : "Sering memicu error header 431 jika ukuran JWT payload melebihi batas 4096 byte browser."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                {activeArch === "ssr" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100">
                    {activeArch === "ssr" ? "Kompatibel 100% dengan Async Cookies" : "Rusak di Next.js 16 (Broke on Async Cookies)"}
                  </strong>
                  <p className="text-zinc-500 text-[11px]">
                    {activeArch === "ssr"
                      ? "Dirancang sejak awal untuk menangani Promise cookies() di Next.js 16 tanpa race conditions."
                      : "Pustaka auth-helpers mengasumsikan cookies() sinkron dan memicu unhandled runtime exceptions."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#1e1e1e] font-mono text-[11px] text-zinc-300 border border-zinc-800">
            <code>npm install @supabase/supabase-js @supabase/ssr</code>
          </div>
        </div>
      </div>
    </div>
  );
}
