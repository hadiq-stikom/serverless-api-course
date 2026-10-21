"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, ShieldCheck, Heart, Sparkles, Check, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ReducedMotionAnimator() {
  const [simulateReducedMotion, setSimulateReducedMotion] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const replay = () => setAnimKey((k) => k + 1);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-xs font-semibold">
              Pilar 4.3: Aksesibilitas Universal
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">useReducedMotion() • WCAG 2.1 AAA</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Kepatuhan Aksesibilitas: Menghormati Reduced Motion
          </h4>
        </div>

        {/* Toggle Switcher */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => { setSimulateReducedMotion(!simulateReducedMotion); replay(); }}
            className={`text-xs font-bold ${
              simulateReducedMotion
                ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
                : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
            }`}
          >
            {simulateReducedMotion
              ? "🛡️ Reduced Motion: AKTIF (OS Preference)"
              : "🌐 Mode Normal: Gerakan Penuh"}
          </Button>
          <Button size="sm" onClick={replay} variant="secondary" className="text-xs gap-1">
            <RefreshCw className="w-3.5 h-3.5" /> Putar Animasi
          </Button>
        </div>
      </div>

      {/* Visual Comparison Stage */}
      <div className="p-8 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/40 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
        <motion.div
          key={animKey}
          initial={
            simulateReducedMotion
              ? { opacity: 0 } // Hanya fade tanpa perpindahan posisi!
              : { opacity: 0, y: 50, scale: 0.85, rotate: -4 } // Gerakan penuh
          }
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
          }}
          transition={
            simulateReducedMotion
              ? { duration: 0.25, ease: "easeOut" } // Transisi tenang
              : { type: "spring", stiffness: 350, damping: 20 } // Fisika pegas bouncy
          }
          className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl max-w-sm text-center space-y-3"
        >
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h5 className="font-bold text-sm text-zinc-900 dark:text-white">
              {simulateReducedMotion ? "Mode Tenang (Aksesibel)" : "Mode Dinamis Penuh"}
            </h5>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {simulateReducedMotion
                ? "Animasi pergerakan translasi ditiadakan. Transisi lembut via opacity murni."
                : "Menggunakan lonjakan koordinat Y + 50px, scale, dan rotasi elastis."}
            </p>
          </div>
          <Badge className={simulateReducedMotion ? "bg-cyan-500" : "bg-indigo-500"}>
            {simulateReducedMotion ? "WCAG 2.1 AAA Compliant" : "Default Rich Experience"}
          </Badge>
        </motion.div>
      </div>

      {/* Code Hook Helper */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-300 space-y-1.5">
        <span className="text-zinc-500">// Implementasi hook useReducedMotion() di React:</span>
        <div className="text-purple-400">const shouldReduceMotion = useReducedMotion();</div>
        <div className="text-cyan-400">&lt;motion.div</div>
        <div className="pl-4 text-emerald-400">
          initial=&#123;shouldReduceMotion ? &#123; opacity: 0 &#125; : &#123; opacity: 0, y: 50 &#125;&#125;
        </div>
        <div className="pl-4 text-emerald-400">
          animate=&#123;shouldReduceMotion ? &#123; opacity: 1 &#125; : &#123; opacity: 1, y: 0 &#125;&#125;
        </div>
        <div className="text-cyan-400">/&gt;</div>
      </div>
    </div>
  );
}
