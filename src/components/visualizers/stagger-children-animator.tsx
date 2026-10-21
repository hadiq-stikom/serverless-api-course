"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Workflow, Play, Sliders, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function StaggerChildrenAnimator() {
  const [triggerKey, setTriggerKey] = useState(0);
  const [staggerInterval, setStaggerInterval] = useState(0.08);
  const [delayChildren, setDelayChildren] = useState(0.1);
  const [direction, setDirection] = useState<1 | -1>(1);

  const replay = () => {
    setTriggerKey((prev) => prev + 1);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren,
        staggerChildren: staggerInterval,
        staggerDirection: direction,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 350, damping: 25 },
    },
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30 text-xs font-semibold">
              Pilar 2.2: Efek Sekuensial
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">staggerChildren &amp; delayChildren</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Efek Air Terjun (Stagger Cascade Grid)
          </h4>
        </div>

        <Button
          size="sm"
          onClick={replay}
          className="text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white gap-1.5 shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current" /> Picu Animasi Stagger
        </Button>
      </div>

      {/* Grid Display */}
      <motion.div
        key={triggerKey}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 gap-3.5 p-4 rounded-2xl bg-zinc-100/60 dark:bg-zinc-900/40 border border-dashed border-zinc-300 dark:border-zinc-800"
      >
        {[
          { id: 1, title: "Setup Database Supabase", status: "Selesai", tag: "DB" },
          { id: 2, title: "Validasi Form dengan Zod", status: "Selesai", tag: "ZOD" },
          { id: 3, title: "GitHub OAuth 2.0 Auth", status: "Selesai", tag: "AUTH" },
          { id: 4, title: "Next.js 16 Proxy Session", status: "Berjalan", tag: "PROXY" },
          { id: 5, title: "Universal REST Route Handler", status: "Berjalan", tag: "REST" },
          { id: 6, title: "Polish Framer Motion UI", status: "Aktif", tag: "UI" },
        ].map((item, idx) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between space-y-2 hover:border-teal-500/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[10px] font-mono">
                {item.tag}
              </Badge>
              <span className="text-[10px] font-mono text-zinc-400">
                +{((idx * staggerInterval) + delayChildren).toFixed(2)}s
              </span>
            </div>
            <h5 className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">
              {item.title}
            </h5>
            <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-500">
              <span>{item.status}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">staggerChildren</span>
            <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{staggerInterval}s</span>
          </div>
          <input
            type="range"
            min="0.02"
            max="0.25"
            step="0.02"
            value={staggerInterval}
            onChange={(e) => setStaggerInterval(Number(e.target.value))}
            className="w-full accent-teal-600"
          />
          <span className="text-[10px] text-zinc-400">Jeda waktu antar kemunculan kartu</span>
        </div>

        <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">delayChildren</span>
            <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{delayChildren}s</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.05"
            value={delayChildren}
            onChange={(e) => setDelayChildren(Number(e.target.value))}
            className="w-full accent-teal-600"
          />
          <span className="text-[10px] text-zinc-400">Jeda awal sebelum anak pertama muncul</span>
        </div>

        <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">
            staggerDirection
          </span>
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              variant={direction === 1 ? "default" : "outline"}
              onClick={() => setDirection(1)}
              className="text-xs flex-1 h-7"
            >
              Maju (1 ➔ 6)
            </Button>
            <Button
              size="sm"
              variant={direction === -1 ? "default" : "outline"}
              onClick={() => setDirection(-1)}
              className="text-xs flex-1 h-7"
            >
              Mundur (6 ➔ 1)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
