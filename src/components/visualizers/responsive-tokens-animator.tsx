"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  Eye 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function ResponsiveTokensAnimator() {
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [highlightToken, setHighlightToken] = useState<string | null>(null);

  const viewWidths = {
    mobile: "max-w-[320px]",
    tablet: "max-w-[500px]",
    desktop: "max-w-full",
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator Antarmuka Responsif &amp; Semantic Token Hierarchy
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Uji responsivitas komponen kartu Shadcn pada berbagai ukuran layar dengan token semantik adaptif.
          </p>
        </div>

        {/* Viewport Width Switcher */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewport("mobile")}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              viewport === "mobile" ? "bg-indigo-600 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile (320px)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport("tablet")}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              viewport === "tablet" ? "bg-indigo-600 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet (500px)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport("desktop")}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              viewport === "desktop" ? "bg-indigo-600 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop (Full)</span>
          </button>
        </div>
      </div>

      {/* Semantic Token Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-zinc-500">Sorot Token Semantik:</span>
        {[
          { key: "bg-card", label: "bg-card (Latar Kartu)" },
          { key: "border-border", label: "border-border (Garis Tepi)" },
          { key: "text-card-foreground", label: "text-card-foreground (Judul)" },
          { key: "text-muted-foreground", label: "text-muted-foreground (Deskripsi)" },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onMouseEnter={() => setHighlightToken(t.key)}
            onMouseLeave={() => setHighlightToken(null)}
            className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-all border ${
              highlightToken === t.key
                ? "bg-indigo-500 text-white border-indigo-600 font-bold"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Responsive Stage */}
      <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/40 flex justify-center transition-all duration-300 overflow-hidden">
        <div className={`w-full ${viewWidths[viewport]} transition-all duration-300`}>
          <div className={`rounded-xl p-5 border transition-all duration-200 shadow-md space-y-4 ${
            highlightToken === "bg-card" ? "ring-2 ring-indigo-500 bg-indigo-50/20" : "bg-card"
          } ${
            highlightToken === "border-border" ? "border-indigo-500 ring-2 ring-indigo-500/30" : "border-border"
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h5 className={`font-bold text-sm md:text-base transition-colors ${
                  highlightToken === "text-card-foreground" ? "text-indigo-600 dark:text-indigo-400 font-black" : "text-card-foreground"
                }`}>
                  Modul #02: Next.js 16 &amp; Shadcn UI
                </h5>
                <p className={`text-xs mt-1 leading-relaxed transition-colors ${
                  highlightToken === "text-muted-foreground" ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-muted-foreground"
                }`}>
                  Fondasi komputasi modern dengan React Server Components dan arsitektur komponen terbuka.
                </p>
              </div>
              <Badge className="bg-primary text-primary-foreground shrink-0 text-[10px]">
                Minggu 02
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-xs">
              <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <span className="text-[10px] text-muted-foreground block">Tipe Komponen:</span>
                <span className="font-bold text-card-foreground">App Router (RSC)</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <span className="text-[10px] text-muted-foreground block">Desain Token:</span>
                <span className="font-bold text-card-foreground">Semantic HSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
