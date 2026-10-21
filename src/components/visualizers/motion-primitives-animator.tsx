"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Play, RotateCcw, Sliders, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function MotionPrimitivesAnimator() {
  const [key, setKey] = useState(0);
  const [targetY, setTargetY] = useState(0);
  const [targetScale, setTargetScale] = useState(1);
  const [targetRotate, setTargetRotate] = useState(0);
  const [targetOpacity, setTargetOpacity] = useState(1);

  const resetPlay = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-xs font-semibold">
              Pilar 1.1: Motion Primitives
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">initial ➔ animate ➔ transition</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Komputasi Animasi Deklaratif: Motion Primitives
          </h4>
        </div>
        <Button
          size="sm"
          onClick={resetPlay}
          className="text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white gap-1.5 shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current" /> Putar Ulang Animasi
        </Button>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Stage: Visual Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/50 min-h-[260px] relative overflow-hidden">
          <div className="absolute top-3 left-3 text-[11px] font-mono text-zinc-400">
            Viewport Kanvas Virtual
          </div>

          <motion.div
            key={key}
            initial={{ opacity: 0, y: 40, scale: 0.8, rotate: -10 }}
            animate={{
              opacity: targetOpacity,
              y: targetY,
              scale: targetScale,
              rotate: targetRotate,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 22,
            }}
            className="w-40 h-40 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer select-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-8 h-8 text-yellow-300 mb-2 drop-shadow" />
            <span className="font-bold text-sm tracking-wide">motion.div</span>
            <span className="text-[10px] text-purple-100/80 font-mono mt-1">
              Spring 60 FPS
            </span>
          </motion.div>

          <div className="absolute bottom-3 text-center text-[11px] text-zinc-500 font-mono">
            initial: &#123; opacity: 0, y: 40, scale: 0.8 &#125; ➔ animate: &#123; y: {targetY}, scale: {targetScale}, rotate: {targetRotate}° &#125;
          </div>
        </div>

        {/* Right Stage: Controls & Code Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 space-y-3">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-purple-500" /> Pengatur Parameter Target
            </span>

            {/* Slider Y */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
                <span>Posisi Y (Translasi)</span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{targetY}px</span>
              </div>
              <input
                type="range"
                min="-40"
                max="40"
                value={targetY}
                onChange={(e) => setTargetY(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>

            {/* Slider Scale */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
                <span>Skala (Scale)</span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{targetScale}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.3"
                step="0.05"
                value={targetScale}
                onChange={(e) => setTargetScale(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>

            {/* Slider Rotate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
                <span>Rotasi (Rotate)</span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{targetRotate}°</span>
              </div>
              <input
                type="range"
                min="-45"
                max="45"
                step="5"
                value={targetRotate}
                onChange={(e) => setTargetRotate(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950 font-mono text-[11px] text-zinc-300 space-y-1">
            <span className="text-zinc-500">// JSX Deklaratif yang Dihasilkan:</span>
            <div className="text-purple-400">&lt;motion.div</div>
            <div className="pl-3 text-zinc-400">initial=&#123;&#123; opacity: 0, y: 40 &#125;&#125;</div>
            <div className="pl-3 text-emerald-400">animate=&#123;&#123; y: {targetY}, scale: {targetScale}, rotate: {targetRotate} &#125;&#125;</div>
            <div className="pl-3 text-cyan-400">transition=&#123;&#123; type: 'spring', stiffness: 300 &#125;&#125;</div>
            <div className="text-purple-400">/&gt;</div>
          </div>
        </div>
      </div>
    </div>
  );
}
