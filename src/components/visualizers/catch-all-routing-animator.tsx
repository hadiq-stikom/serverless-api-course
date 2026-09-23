"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Compass, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode, 
  Layers, 
  Sparkles 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CatchAllRoutingAnimator() {
  const [routeType, setRouteType] = useState<"catchAll" | "optionalCatchAll">("catchAll");
  const [selectedPath, setSelectedPath] = useState<string>("/docs/nextjs/routing/catch-all");

  const presetsCatchAll = [
    "/docs/quickstart",
    "/docs/nextjs/routing/catch-all",
    "/docs/database/supabase/rls/policies",
    "/docs", // 404 for [...slug]
  ];

  const presetsOptional = [
    "/shop", // OK for [[...slug]]
    "/shop/shoes",
    "/shop/shoes/nike/air-jordan",
    "/shop/electronics/laptops/apple",
  ];

  // Compute segments
  const basePrefix = routeType === "catchAll" ? "/docs" : "/shop";
  const cleanPath = selectedPath.startsWith(basePrefix) ? selectedPath.slice(basePrefix.length) : selectedPath;
  const rawSegments = cleanPath.split("/").filter(Boolean);

  const isCatchAllRootError = routeType === "catchAll" && rawSegments.length === 0;

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Compass className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator Segmen Rute Catch-All &amp; Optional Catch-All
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Uji bagaimana Next.js menangkap segmen URL bersarang tak terbatas menjadi sebuah array parameter.
          </p>
        </div>

        {/* Route Type Switcher */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setRouteType("catchAll");
              setSelectedPath("/docs/nextjs/routing/catch-all");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              routeType === "catchAll"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            [...slug] Catch-all
          </button>
          <button
            type="button"
            onClick={() => {
              setRouteType("optionalCatchAll");
              setSelectedPath("/shop/shoes/nike/air-jordan");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              routeType === "optionalCatchAll"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            [[...slug]] Optional
          </button>
        </div>
      </div>

      {/* Preset URL Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Pilih Contoh URL:</span>
        {(routeType === "catchAll" ? presetsCatchAll : presetsOptional).map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setSelectedPath(preset)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
              selectedPath === preset
                ? "bg-indigo-500/15 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-indigo-400"
            }`}
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Interactive URL Bar */}
      <div className="flex items-center gap-2 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-inner">
        <Globe className="w-4 h-4 text-indigo-500 shrink-0 ml-1" />
        <span className="text-xs font-mono text-zinc-400 select-none">https://serverless-academy.id</span>
        <input
          type="text"
          value={selectedPath}
          onChange={(e) => setSelectedPath(e.target.value)}
          className="flex-1 bg-transparent text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold focus:outline-hidden"
          placeholder="/docs/..."
        />
        <Badge variant="outline" className="text-[10px] hidden sm:inline-flex">
          {routeType === "catchAll" ? "src/app/docs/[...slug]/page.tsx" : "src/app/shop/[[...slug]]/page.tsx"}
        </Badge>
      </div>

      {/* Visual Resolution Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Next.js Params Extraction */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
            <span>Ekstraksi Asinkron Next.js 16 (Server Component)</span>
            <Badge className={isCatchAllRootError ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300"}>
              {isCatchAllRootError ? "404 Not Found" : "Matched Route"}
            </Badge>
          </div>

          <pre className="text-[11px] leading-relaxed">
            {isCatchAllRootError ? (
`// ❌ HTTP 404 - Segmen Kosong!
// [...slug] mewajibkan minimal 1 segmen di URL.
// Kunjungan ke "${selectedPath}" tidak cocok.`
            ) : (
`// const { slug } = await params;
params = {
  slug: ${rawSegments.length === 0 ? "undefined // (Optional Root)" : JSON.stringify(rawSegments, null, 2)}
}

// Panjang segmen kedalaman: ${rawSegments.length} level`
            )}
          </pre>
        </div>

        {/* Right: Breadcrumb & Page Simulation */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span>Representasi Breadcrumb UI Dinamis</span>
            <span className="text-[10px] text-zinc-400 font-mono">Render Viewport</span>
          </div>

          {isCatchAllRootError ? (
            <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 space-y-1 text-xs">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Rute Tidak Ditemukan!</span>
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed">
                Catch-all standar <code>[...slug]</code> membutuhkan setidaknya 1 sub-path. Jika Anda ingin URL root <code>{basePrefix}</code> juga dapat dibuka tanpa segmen, gunakan kurung siku ganda <code>[[...slug]]</code> (Optional Catch-all).
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Dynamic Breadcrumbs */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-700 dark:text-zinc-300">
                  {basePrefix.replace("/", "")}
                </span>
                {rawSegments.map((seg, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-zinc-400" />
                    <span className="px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/80 font-mono text-indigo-700 dark:text-indigo-300 font-semibold text-[11px]">
                      {seg}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                <div className="font-bold text-zinc-900 dark:text-zinc-100">
                  Halaman Aktif: {rawSegments.length > 0 ? rawSegments[rawSegments.length - 1].toUpperCase() : "ROOT BERANDA"}
                </div>
                <p className="text-[11px]">
                  Next.js meneruskan seluruh segmen path sebagai array string sehingga Anda dapat memetakan hierarki dokumen atau kategori produk sedalam apa pun tanpa membuat folder baru secara manual!
                </p>
              </div>
            </div>
          )}

          <div className="text-[11px] text-zinc-500 flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <span>Perbedaan: <code>[...slug]</code> (Wajib 1+) vs <code>[[...slug]]</code> (Bisa 0)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
