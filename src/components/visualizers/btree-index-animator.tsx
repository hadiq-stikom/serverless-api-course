"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Zap, 
  Clock, 
  Database, 
  Play, 
  RotateCcw, 
  TrendingUp, 
  CheckCircle2,
  Layers
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function BtreeIndexAnimator() {
  const [indexMode, setIndexMode] = useState<"btree" | "seqscan">("btree");
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryProgress, setQueryProgress] = useState(0);

  const startBenchmark = () => {
    if (isQuerying) return;
    setIsQuerying(true);
    setQueryProgress(0);

    const duration = indexMode === "btree" ? 400 : 1800;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      setQueryProgress(Math.min(100, Math.round((current / steps) * 100)));
      if (current >= steps) {
        clearInterval(timer);
        setIsQuerying(false);
      }
    }, intervalTime);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
              Pilar 2.2: Query Optimization
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">B-Tree O(log N) vs Seq Scan O(N)</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Kecepatan Query: B-Tree Index vs Sequential Full Table Scan
          </h4>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => { setIndexMode("btree"); setQueryProgress(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              indexMode === "btree"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Dengan B-Tree Index (Cepat)
          </button>
          <button
            type="button"
            onClick={() => { setIndexMode("seqscan"); setQueryProgress(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              indexMode === "seqscan"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Tanpa Index (Seq Scan)
          </button>
        </div>
      </div>

      {/* SQL Query Target */}
      <div className="p-3.5 rounded-xl bg-[#1e1e1e] text-zinc-200 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-zinc-800">
        <div className="overflow-x-auto text-emerald-400">
          <code>SELECT * FROM tasks WHERE user_id = &apos;usr_77a9&apos;;</code>
          <span className="text-zinc-500 block text-[11px] mt-0.5">Tabel memuat 100.000 baris data</span>
        </div>

        <Button
          size="sm"
          onClick={startBenchmark}
          disabled={isQuerying}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5 shrink-0 shadow-xs"
        >
          <Play className="w-3.5 h-3.5" />
          {isQuerying ? "Memindai Data..." : "Uji Coba Eksekusi Query"}
        </Button>
      </div>

      {/* Visual Benchmark Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Visual Progress Arena */}
        <div className="md:col-span-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
            <span>Visualisasi Mekanisme Pencarian Engine:</span>
            <span className="font-mono text-zinc-500">
              {indexMode === "btree" ? "3 Lompatan Node Pohon B-Tree" : "Membaca 100.000 Baris Berurutan"}
            </span>
          </div>

          {/* Graphical Representation */}
          <div className="h-40 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 p-4 flex flex-col justify-center items-center relative overflow-hidden">
            {indexMode === "btree" ? (
              <div className="space-y-3 w-full text-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="p-2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs border border-emerald-500/30">
                    Root Node
                  </div>
                  <span className="text-zinc-400 text-xs">➔</span>
                  <div className="p-2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs border border-emerald-500/30">
                    Branch Node
                  </div>
                  <span className="text-zinc-400 text-xs">➔</span>
                  <div className="p-2 rounded bg-emerald-500 text-white font-mono text-xs font-bold shadow-xs">
                    Leaf (Data Pointer)
                  </div>
                </div>
                <div className="text-xs text-zinc-500 font-mono">
                  Menemukan record dalam 3 operasi pembacaan (Tree Height = 3)
                </div>
              </div>
            ) : (
              <div className="w-full space-y-2 text-center">
                <div className="grid grid-cols-8 gap-1 opacity-70">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-4 rounded-xs transition-colors ${
                        queryProgress > (i / 32) * 100
                          ? "bg-amber-500"
                          : "bg-zinc-200 dark:bg-zinc-800"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-zinc-500 font-mono">
                  Membaca seluruh blok disk satu per satu dari baris 1 s/d 100.000
                </div>
              </div>
            )}

            {/* Progress indicator */}
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full mt-4 overflow-hidden">
              <motion.div
                className={`h-full ${indexMode === "btree" ? "bg-emerald-500" : "bg-amber-500"}`}
                style={{ width: `${queryProgress}%` }}
              />
            </div>
          </div>

          {/* Query Metrics Summary */}
          <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
              <span className="text-zinc-500 block text-[10px]">Waktu Eksekusi</span>
              <span className={`font-mono font-bold text-sm ${indexMode === "btree" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                {indexMode === "btree" ? "0.8 ms" : "240.5 ms"}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
              <span className="text-zinc-500 block text-[10px]">Kompleksitas</span>
              <span className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100">
                {indexMode === "btree" ? "O(log N)" : "O(N)"}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
              <span className="text-zinc-500 block text-[10px]">Disk Blocks Read</span>
              <span className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100">
                {indexMode === "btree" ? "3 Blocks" : "1.840 Blocks"}
              </span>
            </div>
          </div>
        </div>

        {/* Explain Card */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Dampak Performa di Industri:</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold block">
                Peningkatan Kecepatan:
              </span>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                300x Lebih Cepat
              </div>
              <span className="text-[10px] text-zinc-500 block">
                Menghemat CPU Compute Supabase hingga 99%
              </span>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Setiap kolom yang sering dipakai di klausa <code>WHERE</code> (seperti <code>user_id</code> atau <code>created_at</code>) <strong>WAJIB</strong> diberi B-Tree index.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#1e1e1e] font-mono text-[11px] text-emerald-400 border border-zinc-800">
            <code>CREATE INDEX idx_tasks_user_id ON tasks(user_id);</code>
          </div>
        </div>
      </div>
    </div>
  );
}
