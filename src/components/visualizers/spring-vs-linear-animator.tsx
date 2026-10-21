"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Play, AlertCircle, RefreshCw, Sparkles, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SpringVsLinearAnimator() {
  const [targetPos, setTargetPos] = useState<"left" | "right">("left");
  const [stiffness, setStiffness] = useState(350);
  const [damping, setDamping] = useState(25);
  const [mass, setMass] = useState(1);
  const [interruptionCount, setInterruptionCount] = useState(0);

  const toggleTarget = () => {
    setTargetPos((prev) => (prev === "left" ? "right" : "left"));
  };

  const handleInterrupt = () => {
    setInterruptionCount((prev) => prev + 1);
    setTargetPos((prev) => (prev === "left" ? "right" : "left"));
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-xs font-semibold">
              Pilar 1.2: Matematika Fisika
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Fisika Pegas vs Durasi CSS</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Komparasi: Spring Physics vs Durasi Linier Kaku CSS
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={toggleTarget}
            className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Pindahkan Posisi
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleInterrupt}
            className="text-xs font-bold gap-1.5 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" /> Interupsi Cepat! ({interruptionCount})
          </Button>
        </div>
      </div>

      {/* Arena Perbandingan Dua Jalur */}
      <div className="space-y-5">
        {/* Jalur 1: Framer Motion Spring */}
        <div className="p-4 rounded-xl border border-indigo-200/80 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-900 dark:text-indigo-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              1. Framer Motion (Fisika Pegas Alami)
            </span>
            <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
              stiffness: {stiffness} • damping: {damping} • mass: {mass}
            </span>
          </div>

          <div className="h-16 w-full rounded-lg bg-white dark:bg-zinc-900 border border-indigo-100 dark:border-indigo-900/30 p-2 relative flex items-center overflow-hidden">
            <motion.div
              animate={{
                x: targetPos === "left" ? 0 : 280,
              }}
              transition={{
                type: "spring",
                stiffness,
                damping,
                mass,
              }}
              className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md flex items-center justify-center text-white font-bold text-xs cursor-pointer select-none"
            >
              Spring
            </motion.div>
          </div>
          <p className="text-[11px] text-zinc-500">
            Saat diinterupsi cepat, pegas tidak patah; energi kinetik dan vektor kecepatan saat ini diintegrasikan ke posisi baru.
          </p>
        </div>

        {/* Jalur 2: CSS Transition Biasa */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-zinc-400" />
              2. CSS Tradisional (Durasi Waktu Linier Kaku)
            </span>
            <span className="font-mono text-[11px] text-zinc-500">
              transition: all 400ms ease-in-out
            </span>
          </div>

          <div className="h-16 w-full rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 relative flex items-center overflow-hidden">
            <div
              style={{
                transform: `translateX(${targetPos === "left" ? 0 : 280}px)`,
                transition: "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              className="w-12 h-12 rounded-xl bg-zinc-600 dark:bg-zinc-700 shadow flex items-center justify-center text-white font-bold text-xs select-none"
            >
              CSS
            </div>
          </div>
          <p className="text-[11px] text-zinc-500">
            Kelemahan CSS: Jika diinterupsi di tengah jalan, kurva waktu ter-reset secara kaku (*jarring snap / visual stutter*).
          </p>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Stiffness (Kekakuan)</span>
            <span className="font-mono font-bold text-indigo-500">{stiffness}</span>
          </div>
          <input
            type="range"
            min="100"
            max="700"
            step="25"
            value={stiffness}
            onChange={(e) => setStiffness(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <span className="text-[10px] text-zinc-400">Tinggi = Lebih agresif &amp; responsif</span>
        </div>

        <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Damping (Redaman)</span>
            <span className="font-mono font-bold text-indigo-500">{damping}</span>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            step="5"
            value={damping}
            onChange={(e) => setDamping(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <span className="text-[10px] text-zinc-400">Rendah = Membal (Bouncy); Tinggi = Redam Cepat</span>
        </div>

        <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Mass (Bobot Massa)</span>
            <span className="font-mono font-bold text-indigo-500">{mass}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={mass}
            onChange={(e) => setMass(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <span className="text-[10px] text-zinc-400">Tinggi = Gerakan lebih lambat &amp; mantap</span>
        </div>
      </div>
    </div>
  );
}
