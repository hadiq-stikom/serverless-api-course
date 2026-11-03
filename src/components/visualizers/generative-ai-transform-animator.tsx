"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Sparkles, Image as ImageIcon, Eraser, Layers, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function GenerativeAiTransformAnimator() {
  const [aiEffect, setAiEffect] = useState<"gen_fill" | "bg_removal" | "gen_replace">("gen_fill");
  const [isAiApplied, setIsAiApplied] = useState<boolean>(true);

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">✨</span>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
              Cloudinary Generative AI Playground: Generative Fill &amp; Background Removal
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Eksplorasi kemampuan Generative AI langsung melalui parameter URL tanpa software pengolah grafis eksternal.
          </p>
        </div>

        {/* AI Effect Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl self-start sm:self-center border border-zinc-200/60 dark:border-zinc-700/60 text-xs">
          <button
            type="button"
            onClick={() => setAiEffect("gen_fill")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              aiEffect === "gen_fill"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generative Fill (b_gen_fill)
          </button>
          <button
            type="button"
            onClick={() => setAiEffect("bg_removal")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              aiEffect === "bg_removal"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
            Background Removal
          </button>
        </div>
      </div>

      {/* Switcher Before vs After */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-500 font-medium">Bandingkan Transformasi AI:</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAiApplied(false)}
            className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              !isAiApplied
                ? "border-zinc-400 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
            }`}
          >
            Original (Before)
          </button>
          <button
            type="button"
            onClick={() => setIsAiApplied(true)}
            className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              isAiApplied
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
            }`}
          >
            ✨ AI Processed (After)
          </button>
        </div>
      </div>

      {/* Canvas Perbandingan */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center min-h-[220px]">
        {aiEffect === "gen_fill" ? (
          <div className="relative w-full max-w-md h-40 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
            {isAiApplied ? (
              // Generative Fill: Latar samping di-expand oleh AI
              <div className="w-full h-full bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-indigo-950/60 flex items-center justify-center relative p-3">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />
                <div className="w-32 h-32 rounded-xl bg-zinc-800 border-2 border-indigo-400 flex flex-col items-center justify-center shadow-2xl relative z-10">
                  <span className="text-4xl">👟</span>
                  <span className="text-[10px] text-zinc-300 mt-1">Foto Asli 1:1</span>
                </div>
                <div className="absolute bottom-2 right-2 bg-emerald-600 text-white text-[9px] font-mono px-2 py-0.5 rounded-full shadow">
                  ✨ AI Outpainting (16:9 Banner)
                </div>
              </div>
            ) : (
              // Original: Gambar 1:1 dengan black bars di kiri kanan
              <div className="w-full h-full bg-black flex items-center justify-center relative">
                <div className="w-32 h-32 rounded-xl bg-zinc-800 border border-zinc-700 flex flex-col items-center justify-center">
                  <span className="text-4xl">👟</span>
                  <span className="text-[10px] text-zinc-400 mt-1">Foto Asli 1:1</span>
                </div>
                <div className="absolute bottom-2 right-2 bg-zinc-800 text-zinc-400 text-[9px] font-mono px-2 py-0.5 rounded">
                  Pillarbox (Black Bars)
                </div>
              </div>
            )}
          </div>
        ) : (
          // Background Removal
          <div className="relative w-full max-w-xs h-40 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
            {isAiApplied ? (
              // Transparan checkered background
              <div className="w-full h-full bg-[linear-gradient(45deg,#27272a_25%,transparent_25%),linear-gradient(-45deg,#27272a_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#27272a_75%),linear-gradient(-45deg,transparent_75%,#27272a_75%)] bg-[size:16px_16px] [background-position:0_0,0_8px,8px_-8px,-8px_0px] flex flex-col items-center justify-center">
                <span className="text-5xl filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]">🎧</span>
                <span className="text-[10px] font-bold text-emerald-400 mt-2 bg-zinc-950/80 px-2 py-0.5 rounded">
                  Transparent PNG (Subjek Terisolasi Sempurna)
                </span>
              </div>
            ) : (
              // Original with messy background
              <div className="w-full h-full bg-amber-950/40 border border-amber-900/60 flex flex-col items-center justify-center p-3">
                <span className="text-5xl">🎧</span>
                <span className="text-[10px] text-amber-300 mt-2 bg-zinc-900/80 px-2 py-0.5 rounded">
                  Latar Belakang Berantakan / Meja Kerja
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Syntax Helper */}
      <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/60 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300">
        <span className="text-zinc-500 block text-[10px] mb-1">Parameter URL Cloudinary:</span>
        <code>
          {aiEffect === "gen_fill"
            ? `c_pad,b_gen_fill,ar_16:9,w_1200 /products/sneaker_shot.jpg`
            : `e_background_removal /products/headphone.png`}
        </code>
      </div>
    </div>
  );
}

