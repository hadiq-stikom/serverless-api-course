"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Server, Laptop, ShieldCheck, AlertTriangle, Layers, ArrowDown, Database, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function RscAnimationBoundaryAnimator() {
  const [architectureMode, setArchitectureMode] = useState<"best-practice" | "anti-pattern">("best-practice");

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
              Pilar 1.3: Arsitektur Next.js 16
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Pushing 'use client' to the Leaves</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Boundary RSC vs Client Component untuk Animasi
          </h4>
        </div>

        {/* Toggle Switcher */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={architectureMode === "best-practice" ? "default" : "outline"}
            onClick={() => setArchitectureMode("best-practice")}
            className="text-xs font-bold gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ✅ Best Practice (Leaf Wrapper)
          </Button>
          <Button
            size="sm"
            variant={architectureMode === "anti-pattern" ? "destructive" : "outline"}
            onClick={() => setArchitectureMode("anti-pattern")}
            className="text-xs font-bold gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            ❌ Anti-Pattern (Root 'use client')
          </Button>
        </div>
      </div>

      {/* Architecture Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Box: Sisi Server (Next.js 16 Engine) */}
        <div className={`p-5 rounded-2xl border transition-all ${
          architectureMode === "best-practice"
            ? "border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10"
            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40"
        } space-y-4`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
              <Server className="w-4 h-4 text-indigo-500" /> Server Node.js (Vercel)
            </span>
            <Badge variant="outline" className="text-[10px]">
              {architectureMode === "best-practice" ? "0 kB Client Bundle" : "Dekomposisi Rusak"}
            </Badge>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* page.tsx node */}
            <div className={`p-3 rounded-xl border ${
              architectureMode === "best-practice"
                ? "border-emerald-500/40 bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-300"
                : "border-red-500/40 bg-red-50/30 dark:bg-red-950/20 text-red-600 dark:text-red-400"
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold">src/app/tasks/page.tsx</span>
                <span className="text-[10px] uppercase font-bold">
                  {architectureMode === "best-practice" ? "RSC (Server Component)" : "'use client' Terkontaminasi"}
                </span>
              </div>
              <p className="font-sans text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                {architectureMode === "best-practice"
                  ? "Kueri PostgreSQL langsung ke Supabase di server. Token rahasia aman 100%."
                  : "Server Component musnah! Kueri terpaksa jalan di browser pengguna."}
              </p>
            </div>

            {/* Supabase connection */}
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-900 text-zinc-300 text-[11px]">
              <Database className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>createClient() Supabase Server Session</span>
            </div>
          </div>
        </div>

        {/* Right Box: Sisi Peramban (Browser Client) */}
        <div className={`p-5 rounded-2xl border transition-all ${
          architectureMode === "best-practice"
            ? "border-indigo-500/30 bg-indigo-50/20 dark:bg-indigo-950/10"
            : "border-red-500/40 bg-red-50/30 dark:bg-red-950/20"
        } space-y-4`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
              <Laptop className="w-4 h-4 text-cyan-500" /> Peramban Klien (Browser)
            </span>
            <Badge className={architectureMode === "best-practice" ? "bg-emerald-500" : "bg-red-500"}>
              {architectureMode === "best-practice" ? "Bundle: ~32 kB (Optimal)" : "Bundle: ~145 kB (Bengkak)"}
            </Badge>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Animated component */}
            <div className="p-3 rounded-xl border border-indigo-400/40 bg-white dark:bg-zinc-900 text-indigo-700 dark:text-indigo-300">
              <div className="flex items-center justify-between">
                <span className="font-bold">src/components/tasks/animated-grid.tsx</span>
                <span className="text-[10px] uppercase font-bold text-indigo-500">'use client' (Leaf)</span>
              </div>
              <p className="font-sans text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                Membungkus animasi motion.div, variants, stagger, dan gestur GPU 60 FPS secara terisolasi.
              </p>
            </div>

            {/* Metric Status */}
            <div className="p-3 rounded-lg bg-zinc-950 text-[11px] font-sans text-zinc-300 space-y-1">
              <div className="flex justify-between">
                <span>Hydration Overhead:</span>
                <span className={architectureMode === "best-practice" ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                  {architectureMode === "best-practice" ? "Hanya komponen grid daun" : "Seluruh halaman dari root"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Performa First Contentful Paint:</span>
                <span className={architectureMode === "best-practice" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                  {architectureMode === "best-practice" ? "Instan (Streaming HTML RSC)" : "Tertunda (JS Waterfall)"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Banner */}
      <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
        architectureMode === "best-practice"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
          : "border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-300"
      }`}>
        {architectureMode === "best-practice" ? (
          <>
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong>Aturan Emas Terpenuhi:</strong> Halaman utama <code>page.tsx</code> tetap Server Component (RSC). Data tugas diambil langsung di server dan dioper ke komponen daun <code>&lt;AnimatedTaskGrid /&gt;</code>. Bundle JavaScript klien tetap minimal dan aman.
            </div>
          </>
        ) : (
          <>
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <strong>Pelanggaran Fatal:</strong> Menaruh <code>'use client'</code> pada <code>page.tsx</code> mencabut seluruh kemampuan Server Components. Data fetching pindah ke browser, secret database terancam bocor, dan ukuran bundle membengkak drastis.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
