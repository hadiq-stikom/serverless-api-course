"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftRight, Shuffle, ArrowDownUp, ShieldCheck, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TaskCardData {
  id: number;
  title: string;
  order: number;
  color: string;
}

const DEFAULT_CARDS: TaskCardData[] = [
  { id: 1, title: "1. Skema Database Supabase", order: 1, color: "from-blue-500 to-indigo-600" },
  { id: 2, title: "2. Server Actions Mutasi Form", order: 2, color: "from-emerald-500 to-teal-600" },
  { id: 3, title: "3. Autentikasi GitHub OAuth 2.0", order: 3, color: "from-purple-500 to-indigo-600" },
  { id: 4, title: "4. REST API Endpoint Route", order: 4, color: "from-amber-500 to-orange-600" },
];

export function FlipLayoutAnimator() {
  const [cards, setCards] = useState<TaskCardData[]>(DEFAULT_CARDS);
  const [flipEnabled, setFlipEnabled] = useState(true);
  const [lastAction, setLastAction] = useState<string>("Inisialisasi");

  const shuffleCards = () => {
    setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
    setLastAction("Acak Posisi (Shuffle)");
  };

  const reverseCards = () => {
    setCards((prev) => [...prev].reverse());
    setLastAction("Balik Urutan (Reverse)");
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-semibold">
              Pilar 3.2: Algoritma FLIP
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">First ➔ Last ➔ Invert ➔ Play</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Transisi Layout Otomatis: Teknik FLIP (Prop layout)
          </h4>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setFlipEnabled(!flipEnabled)}
            className={`text-xs font-bold ${
              flipEnabled
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-red-500 text-red-600 dark:text-red-400"
            }`}
          >
            {flipEnabled ? "✅ Prop layout: AKTIF" : "❌ Prop layout: NONAKTIF"}
          </Button>
          <Button size="sm" onClick={shuffleCards} className="text-xs gap-1.5 bg-amber-600 hover:bg-amber-700 text-white">
            <Shuffle className="w-3.5 h-3.5" /> Acak Posisi
          </Button>
          <Button size="sm" onClick={reverseCards} variant="secondary" className="text-xs gap-1.5">
            <ArrowDownUp className="w-3.5 h-3.5" /> Balik Urutan
          </Button>
        </div>
      </div>

      {/* 4 Tahapan FLIP Inspector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
          <span className="font-bold text-amber-600 dark:text-amber-400 block font-mono">1. FIRST</span>
          <span className="text-[10px] text-zinc-500">Rekam koordinat awal</span>
        </div>
        <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
          <span className="font-bold text-indigo-600 dark:text-indigo-400 block font-mono">2. LAST</span>
          <span className="text-[10px] text-zinc-500">Render posisi baru</span>
        </div>
        <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
          <span className="font-bold text-cyan-600 dark:text-cyan-400 block font-mono">3. INVERT</span>
          <span className="text-[10px] text-zinc-500">Hitung delta GPU transform</span>
        </div>
        <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
          <span className="font-bold text-emerald-600 dark:text-emerald-400 block font-mono">4. PLAY</span>
          <span className="text-[10px] text-zinc-500">Spring transisi 60 FPS</span>
        </div>
      </div>

      {/* Grid Canvas */}
      <motion.div
        layout={flipEnabled}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-5 rounded-2xl bg-zinc-100/60 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800"
      >
        {cards.map((card) => (
          <motion.div
            key={card.id}
            layout={flipEnabled}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`p-4 rounded-xl bg-gradient-to-r ${card.color} text-white shadow-md flex items-center justify-between cursor-pointer select-none`}
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 font-mono">
                ID #{card.id}
              </span>
              <h5 className="text-sm font-bold mt-0.5">{card.title}</h5>
            </div>
            <ArrowLeftRight className="w-4 h-4 opacity-70" />
          </motion.div>
        ))}
      </motion.div>

      {/* Status Bar */}
      <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-between text-xs">
        <span className="text-zinc-500">
          Aksi Terakhir: <strong>{lastAction}</strong>
        </span>
        <span className="font-mono text-zinc-500">
          {flipEnabled
            ? "🚀 GPU Compositing Active — Tanpa Layout Reflow!"
            : "⚠️ Kartu melompat seketika (Jarring Jump)!"}
        </span>
      </div>
    </div>
  );
}
