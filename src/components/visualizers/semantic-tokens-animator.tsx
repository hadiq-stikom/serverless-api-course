"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Palette, 
  Sun, 
  Moon, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  Code 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SemanticTokensAnimator() {
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");

  const tokens = [
    { token: "--background", light: "0 0% 100% (#ffffff)", dark: "240 10% 3.9% (#09090b)", role: "Latar Belakang Halaman" },
    { token: "--foreground", light: "240 10% 3.9% (#09090b)", dark: "0 0% 98% (#fafafa)", role: "Teks Utama" },
    { token: "--primary", light: "240 5.9% 10% (#18181b)", dark: "0 0% 98% (#fafafa)", role: "Tombol & Aksen Utama" },
    { token: "--muted-foreground", light: "240 3.8% 46.1%", dark: "240 5% 64.9%", role: "Teks Sekunder / Subjudul" },
    { token: "--border", light: "240 5.9% 90%", dark: "240 3.7% 15.9%", role: "Garis Batas Kartu & Input" },
  ];

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Palette className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator Semantic CSS Variables &amp; Tailwind Tokens
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Lihat bagaimana token HSL Shadcn secara otomatis menyesuaikan tampilan kartu tanpa penulisan CSS berulang.
          </p>
        </div>

        {/* Theme Mode Toggle Button */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setThemeMode("light")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              themeMode === "light"
                ? "bg-amber-500 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light Mode</span>
          </button>
          <button
            type="button"
            onClick={() => setThemeMode("dark")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              themeMode === "dark"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark Mode</span>
          </button>
        </div>
      </div>

      {/* Grid Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Live CSS Tokens Inspector */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
            <span>Variabel CSS HSL Aktif (:root vs .dark)</span>
            <Badge className="bg-indigo-500/20 text-indigo-300">
              {themeMode === "dark" ? ".dark class" : ":root class"}
            </Badge>
          </div>

          <div className="space-y-2 text-[11px]">
            {tokens.map((tok) => (
              <div key={tok.token} className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-bold text-indigo-400">{tok.token}</div>
                  <div className="text-[10px] text-zinc-500">{tok.role}</div>
                </div>
                <span className="text-zinc-200 font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-800">
                  {themeMode === "dark" ? tok.dark : tok.light}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Adaptive UI Preview */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span>Preview Komponen dengan Semantic Class</span>
            <span className="text-[10px] text-zinc-400 font-mono">Live Sandbox</span>
          </div>

          {/* Simulated Component with Semantic Classes */}
          <div className="p-4 rounded-xl flex items-center justify-center">
            <div className={`w-full max-w-sm p-4 rounded-xl border transition-all duration-300 shadow-md space-y-3 ${
              themeMode === "dark"
                ? "bg-zinc-950 text-zinc-100 border-zinc-800"
                : "bg-white text-zinc-900 border-zinc-200 shadow-sm"
            }`}>
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Card Semantic Tokens</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                  themeMode === "dark" ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-700"
                }`}>
                  bg-card
                </span>
              </div>

              <p className={`text-xs leading-relaxed ${
                themeMode === "dark" ? "text-zinc-400" : "text-zinc-600"
              }`}>
                Teks ini menggunakan class <code>text-muted-foreground</code> sehingga warnanya otomatis redup dan enak dibaca di kedua mode tanpa style terpisah!
              </p>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                    themeMode === "dark"
                      ? "bg-white text-zinc-950 hover:bg-zinc-200"
                      : "bg-zinc-900 text-white hover:bg-zinc-800"
                  }`}
                >
                  bg-primary (Aksi)
                </button>
                <span className="text-[10px] text-zinc-400 font-mono">border-border</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <span>Hindari <code>bg-white</code> / <code>text-black</code> absolut. Selalu gunakan Semantic Tokens!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
