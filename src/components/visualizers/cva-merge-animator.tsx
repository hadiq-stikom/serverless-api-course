"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Code, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Sliders 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CvaMergeAnimator() {
  const [variant, setVariant] = useState<"default" | "secondary" | "destructive">("default");
  const [size, setSize] = useState<"sm" | "default" | "lg">("default");
  const [hasCustomPadding, setHasCustomPadding] = useState(true);

  // Demonstrate cn() conflict resolution
  const basePadding = size === "sm" ? "px-3 py-1 text-xs" : size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2 text-sm";
  const customOverride = hasCustomPadding ? "px-8" : ""; // Conflicting with base px

  const rawClasses = `${basePadding} ${variant === "destructive" ? "bg-red-500" : variant === "secondary" ? "bg-zinc-700" : "bg-indigo-600"} ${customOverride}`;
  
  // Simulated twMerge result
  const resolvedClasses = `${hasCustomPadding ? basePadding.replace(/px-\d+/, "px-8") : basePadding} ${
    variant === "destructive" ? "bg-red-500" : variant === "secondary" ? "bg-zinc-700" : "bg-indigo-600"
  }`;

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sliders className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator CVA (Class Variance Authority) &amp; Utilitas cn()
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Uji bagaimana fungsi cn() menyelesaikan konflik class Tailwind dan menghasilkan varian komponen type-safe.
          </p>
        </div>

        <Badge variant="outline" className="text-xs">
          tailwind-merge + clsx
        </Badge>
      </div>

      {/* Interactive Controls */}
      <div className="flex flex-wrap items-center gap-4 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-xs">
        {/* Variant Picker */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-zinc-500">Variant:</span>
          {(["default", "secondary", "destructive"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVariant(v)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono capitalize transition-all ${
                variant === v
                  ? "bg-indigo-600 text-white font-bold"
                  : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Size Picker */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-zinc-500">Size:</span>
          {(["sm", "default", "lg"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono capitalize transition-all ${
                size === s
                  ? "bg-indigo-600 text-white font-bold"
                  : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Conflict Trigger */}
        <div className="flex items-center gap-2 ml-auto">
          <label className="flex items-center gap-1.5 cursor-pointer text-zinc-700 dark:text-zinc-300 font-medium">
            <input
              type="checkbox"
              checked={hasCustomPadding}
              onChange={(e) => setHasCustomPadding(e.target.checked)}
              className="rounded text-indigo-600"
            />
            <span>Suntikkan Custom Override: <code>className=&quot;px-8&quot;</code></span>
          </label>
        </div>
      </div>

      {/* Conflict Resolution Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Without twMerge vs With cn() */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
            <span>Resolusi Konflik Class CSS Tailwind</span>
            <span className="text-[10px] text-zinc-400">twMerge Logic</span>
          </div>

          <div className="space-y-3 text-[11px]">
            {/* Without twMerge */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-rose-900/60 space-y-1">
              <div className="flex items-center justify-between text-rose-400 font-bold">
                <span>❌ String Template Biasa (Tanpa twMerge)</span>
                <span className="text-[10px] text-rose-500 font-mono">Konflik CSS!</span>
              </div>
              <p className="text-zinc-400 break-all font-mono">
                class=&quot;{rawClasses}&quot;
              </p>
              {hasCustomPadding && (
                <p className="text-[10px] text-amber-400 pt-1">
                  ⚠️ Peringatan: Terdapat dua class padding horizontal sekaligus (<code>px-4</code> dan <code>px-8</code>). Browser tidak dapat menjamin class mana yang menang!
                </p>
              )}
            </div>

            {/* With cn() */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-emerald-900/60 space-y-1">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span>✅ Dengan Utilitas cn() (Otomatis Bersih)</span>
                <span className="text-[10px] text-emerald-500 font-mono">Resolved</span>
              </div>
              <p className="text-emerald-300 break-all font-mono font-bold">
                class=&quot;{resolvedClasses}&quot;
              </p>
              <p className="text-[10px] text-zinc-400 pt-1">
                Fungsi <code>cn()</code> mendeteksi bahwa <code>px-8</code> menimpa padding bawaan, sehingga class lama otomatis dibuang tanpa meninggalkan residu di DOM.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Button */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span>Hasil Render Komponen Tombol</span>
            <span className="text-[10px] text-zinc-400 font-mono">Visual Target</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-6 space-y-3">
            <button
              type="button"
              className={`rounded-lg font-bold text-white transition-all shadow-md hover:scale-105 active:scale-95 ${resolvedClasses}`}
            >
              Tombol Varian: {variant} ({size})
            </button>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center max-w-xs">
              Ubah opsi variant dan size di panel atas untuk melihat tombol bermutasi secara dinamis dan type-safe.
            </p>
          </div>

          <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <span>Utilitas <code>cn()</code> terletak di berkas <code>src/lib/utils.ts</code> proyek Anda.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
