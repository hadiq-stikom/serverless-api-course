"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Hand, MousePointer, Move, Sparkles, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function GestureMicroInteractionsAnimator() {
  const [gestureState, setGestureState] = useState<string>("Normal (Idle)");
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 text-xs font-semibold">
              Pilar 4.1: Gestur Taktil
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">whileHover &amp; whileTap &amp; drag</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Mikro-Interaksi: Sentuhan Taktil &amp; Gestur Alami
          </h4>
        </div>

        <Badge variant="outline" className="text-xs font-mono">
          Status Sensor: <strong className="text-rose-600 dark:text-rose-400 ml-1">{gestureState}</strong>
        </Badge>
      </div>

      {/* 3 Arena Gestur Interaktif */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gestur 1: Elastic Button */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex flex-col items-center justify-between min-h-[220px] text-center space-y-3">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <MousePointer className="w-4 h-4 text-rose-500" /> 1. Tombol Elastis
          </span>

          <motion.button
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.92 }}
            onHoverStart={() => setGestureState("whileHover (Hovering)")}
            onHoverEnd={() => setGestureState("Normal (Idle)")}
            onTapStart={() => setGestureState("whileTap (Pressed / Clicked)")}
            onTap={() => setClickCount((c) => c + 1)}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-rose-500/25 active:shadow-none select-none cursor-pointer"
          >
            Tekan Saya! ({clickCount})
          </motion.button>

          <p className="text-[11px] text-zinc-400">
            Kombinasi whileHover (scale 1.06) dan whileTap (scale 0.92) memberikan sensasi tombol fisik elastis.
          </p>
        </div>

        {/* Gestur 2: 3D Hover Card */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex flex-col items-center justify-between min-h-[220px] text-center space-y-3">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-500" /> 2. Kartu Elevasi 3D
          </span>

          <motion.div
            whileHover={{
              scale: 1.04,
              rotateX: -4,
              rotateY: 6,
              boxShadow: "0 20px 30px -10px rgba(99, 102, 241, 0.25)",
            }}
            onHoverStart={() => setGestureState("whileHover (3D Card Tilt)")}
            onHoverEnd={() => setGestureState("Normal (Idle)")}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
            className="w-36 h-24 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-gradient-to-tr from-indigo-50 to-white dark:from-indigo-950/40 dark:to-zinc-900 flex flex-col items-center justify-center p-2 cursor-pointer select-none"
          >
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Kartu Tugas 3D</span>
            <span className="text-[10px] text-zinc-400 mt-1">Arahkan Kursor</span>
          </motion.div>

          <p className="text-[11px] text-zinc-400">
            Efek kemiringan rotasi 3D halus saat diarahkan kursor tanpa JavaScript listener manual.
          </p>
        </div>

        {/* Gestur 3: Drag with Elastic Boundary */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex flex-col items-center justify-between min-h-[220px] text-center space-y-3 relative overflow-hidden">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Move className="w-4 h-4 text-emerald-500" /> 3. Drag Elastis
          </span>

          <motion.div
            drag
            dragConstraints={{ left: -30, right: 30, top: -20, bottom: 20 }}
            dragElastic={0.4}
            whileDrag={{ scale: 1.15, cursor: "grabbing" }}
            onDragStart={() => setGestureState("whileDrag (Dragging Box)")}
            onDragEnd={() => setGestureState("Normal (Idle)")}
            className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md flex items-center justify-center text-white font-bold text-xs cursor-grab select-none"
          >
            Drag
          </motion.div>

          <p className="text-[11px] text-zinc-400">
            Geser kotak ini! Kotak akan otomatis ditarik kembali ke posisi awal via spring damping.
          </p>
        </div>
      </div>
    </div>
  );
}
