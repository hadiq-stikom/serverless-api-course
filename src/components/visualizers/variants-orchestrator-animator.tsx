"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Layers, Workflow, CheckCircle2, Sliders, ArrowDown, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delayChildren: 0.1, staggerChildren: 0.1 },
  },
  alert: {
    opacity: 1,
    scale: 1.02,
    transition: { delayChildren: 0.05, staggerChildren: 0.05 },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderColor: "rgba(228, 228, 231, 1)",
    transition: { type: "spring", stiffness: 350, damping: 25 },
  },
  alert: {
    opacity: 1,
    y: 0,
    backgroundColor: "rgba(254, 242, 242, 1)",
    borderColor: "rgba(252, 165, 165, 1)",
    transition: { type: "spring", stiffness: 450, damping: 15 },
  },
};

export function VariantsOrchestratorAnimator() {
  const [activeState, setActiveState] = useState<"hidden" | "visible" | "alert">("visible");

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-xs font-semibold">
              Pilar 2.1: Objek Variants
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Parent-Child State Propagation</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Orkestrasi Variants: Propagasi State Tanpa Prop Drilling
          </h4>
        </div>

        {/* State Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800">
          {(["hidden", "visible", "alert"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setActiveState(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeState === st
                  ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {st.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Flow Column */}
        <div className="lg:col-span-7 space-y-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeState}
            className="p-5 rounded-2xl border-2 border-indigo-500/40 bg-indigo-50/20 dark:bg-indigo-950/20 space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-2 border-b border-indigo-200/50 dark:border-indigo-900/50">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> &lt;motion.div variants=&#123;containerVariants&#125; animate="{activeState}"&gt;
              </span>
              <Badge className="bg-indigo-500 text-white text-[10px]">Kontainer Induk</Badge>
            </div>

            {/* 3 Child Cards */}
            <div className="space-y-2.5">
              {[1, 2, 3].map((num) => (
                <motion.div
                  key={num}
                  variants={childVariants}
                  className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center">
                      {num}
                    </span>
                    <div>
                      <h5 className="text-xs font-semibold text-zinc-900 dark:text-white">
                        Kartu Tugas Anak #{num}
                      </h5>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        Mewarisi state: "{activeState}"
                      </span>
                    </div>
                  </div>
                  <CheckCircle2 className={`w-4 h-4 ${activeState === "alert" ? "text-red-500" : "text-emerald-500"}`} />
                </motion.div>
              ))}
            </div>

            <div className="text-[11px] text-zinc-500 font-mono text-center pt-1">
              ⚡ Anak otomatis berubah tanpa ada props animate="..." pada masing-masing tag anak!
            </div>
          </motion.div>
        </div>

        {/* Code Explanation Column */}
        <div className="lg:col-span-5 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-300 space-y-2">
          <div className="text-zinc-500">// Objek Variants Terpisah (lib/animations.ts):</div>
          <div className="text-indigo-400">const containerVariants = &#123;</div>
          <div className="pl-4 text-zinc-400">hidden: &#123; opacity: 0 &#125;,</div>
          <div className="pl-4 text-emerald-400">visible: &#123;</div>
          <div className="pl-8 text-zinc-400">opacity: 1,</div>
          <div className="pl-8 text-cyan-400">transition: &#123; staggerChildren: 0.1 &#125;</div>
          <div className="pl-4 text-emerald-400">&#125;,</div>
          <div className="text-indigo-400">&#125;;</div>
          <div className="pt-2 text-zinc-500">// Elemen Anak (Otomatis Mewarisi):</div>
          <div className="text-purple-400">&lt;motion.div variants=&#123;childVariants&#125; /&gt;</div>
        </div>
      </div>
    </div>
  );
}
