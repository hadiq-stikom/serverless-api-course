"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Sliders, Play, Code, Sparkles, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type FormulaPreset = "alternating" | "wave" | "exponential";

export function DynamicVariantsAnimator() {
  const [triggerKey, setTriggerKey] = useState(0);
  const [preset, setPreset] = useState<FormulaPreset>("alternating");
  const [itemCount, setItemCount] = useState(5);

  const dynamicVariants: Variants = {
    hidden: (i: number) => {
      if (preset === "alternating") {
        return { opacity: 0, x: i % 2 === 0 ? -40 : 40, rotate: i % 2 === 0 ? -3 : 3 };
      } else if (preset === "wave") {
        return { opacity: 0, y: Math.sin(i) * 30 + 20 };
      } else {
        return { opacity: 0, scale: 0.7, y: 30 };
      }
    },
    visible: (i: number) => {
      let delay = i * 0.08;
      if (preset === "exponential") {
        delay = Math.pow(i, 1.3) * 0.05;
      }
      return {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 22,
          delay,
        },
      };
    },
  };

  const replay = () => setTriggerKey((prev) => prev + 1);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-xs font-semibold">
              Pilar 2.3: Injeksi Dinamis
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">custom=&#123;index&#125; Props</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Dynamic Custom Variants Berbasis Kalkulasi Indeks
          </h4>
        </div>

        <Button
          size="sm"
          onClick={replay}
          className="text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white gap-1.5 shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current" /> Jalankan Kalkulasi Formula
        </Button>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={preset === "alternating" ? "default" : "outline"}
          onClick={() => { setPreset("alternating"); replay(); }}
          className="text-xs"
        >
          {preset === "alternating" && <Check className="w-3 h-3 mr-1" />}
          1. Alternating Tilt (Genap Kiri / Ganjil Kanan)
        </Button>
        <Button
          size="sm"
          variant={preset === "wave" ? "default" : "outline"}
          onClick={() => { setPreset("wave"); replay(); }}
          className="text-xs"
        >
          {preset === "wave" && <Check className="w-3 h-3 mr-1" />}
          2. Trigonometric Wave (Math.sin)
        </Button>
        <Button
          size="sm"
          variant={preset === "exponential" ? "default" : "outline"}
          onClick={() => { setPreset("exponential"); replay(); }}
          className="text-xs"
        >
          {preset === "exponential" && <Check className="w-3 h-3 mr-1" />}
          3. Exponential Delay (Math.pow)
        </Button>
      </div>

      {/* Dynamic Item Stage */}
      <div className="space-y-2 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
        <div key={triggerKey} className="space-y-2.5">
          {Array.from({ length: itemCount }).map((_, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={dynamicVariants}
              initial="hidden"
              animate="visible"
              className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-800 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">
                  Index: {i}
                </span>
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Item #{i + 1} — Formula terhitung via argumen custom={i}
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                {preset === "alternating"
                  ? i % 2 === 0 ? "x: -40px (rotate -3°)" : "x: +40px (rotate +3°)"
                  : preset === "wave"
                  ? `sin(${i}) = ${(Math.sin(i) * 30).toFixed(0)}px`
                  : `delay: ${(Math.pow(i, 1.3) * 0.05).toFixed(2)}s`}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="p-3 rounded-lg bg-zinc-950 font-mono text-[11px] text-zinc-300 space-y-1">
        <span className="text-zinc-500">// Pola Deklarasi Fungsi Dynamic Variant:</span>
        <div className="text-cyan-400">const variants = &#123;</div>
        <div className="pl-4 text-emerald-400">hidden: (index: number) =&gt; (&#123;</div>
        <div className="pl-8 text-zinc-400">x: index % 2 === 0 ? -40 : 40,</div>
        <div className="pl-8 text-zinc-400">opacity: 0,</div>
        <div className="pl-4 text-emerald-400">&#125;),</div>
        <div className="pl-4 text-emerald-400">visible: (index: number) =&gt; (&#123;</div>
        <div className="pl-8 text-zinc-400">transition: &#123; delay: index * 0.08 &#125;,</div>
        <div className="pl-4 text-emerald-400">&#125;)</div>
        <div className="text-cyan-400">&#125;;</div>
      </div>
    </div>
  );
}
