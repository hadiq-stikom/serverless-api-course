"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function OptimisticVsRealtimeSyncAnimator() {
  const [strategy, setStrategy] = useState<"dedup_id" | "naive_append">("dedup_id");
  const [tasks, setTasks] = useState<Array<{ id: string; title: string; source: "server" | "optimistic" | "realtime" }>>([
    { id: "task-1", title: "Setup Database Schema", source: "server" }
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateCreate = () => {
    setIsSimulating(true);
    const newId = "task-opt-99";
    const newTitle = "Integrasi Realtime Collaboration";

    // Step 1: Client adds Optimistic Task locally
    setTasks((prev) => [
      ...prev,
      { id: newId, title: newTitle, source: "optimistic" }
    ]);

    // Step 2: 800ms later, Server Action succeeds and Postgres emits WebSocket INSERT event
    setTimeout(() => {
      if (strategy === "dedup_id") {
        // Smart reconciliation: Check if ID or tempId exists, replace or ignore duplicate
        setTasks((prev) => {
          const filtered = prev.filter((t) => t.id !== newId);
          return [...filtered, { id: "task-real-99", title: newTitle, source: "realtime" }];
        });
      } else {
        // Naive append: Simply push to array, creating duplicate items on screen!
        setTasks((prev) => [
          ...prev,
          { id: "task-real-99", title: newTitle, source: "realtime" }
        ]);
      }
      setIsSimulating(false);
    }, 900);
  };

  const handleReset = () => {
    setTasks([{ id: "task-1", title: "Setup Database Schema", source: "server" }]);
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 space-y-5 text-zinc-900 dark:text-zinc-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
              <Sparkles className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
              Harmonisasi Optimistic UI &amp; Real-time WebSocket: Anti Double-Render
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Mencegah kemunculan item ganda ketika antarmuka lokal melakukan optimistic update lalu menerima event broadcast dari server
          </p>
        </div>

        {/* Strategy Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setStrategy("dedup_id");
              handleReset();
            }}
            className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              strategy === "dedup_id"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Dengan Deduplikasi (Pola Benar)
          </button>

          <button
            type="button"
            onClick={() => {
              setStrategy("naive_append");
              handleReset();
            }}
            className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              strategy === "naive_append"
                ? "bg-red-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Naive Append (Item Ganda)
          </button>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
          Uji Coba Kirim Data: Optimistic Lokal ➔ Disusul Event WebSocket
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSimulateCreate}
            disabled={isSimulating}
            className="text-xs font-bold h-8 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Zap className="w-3.5 h-3.5 mr-1 text-amber-300" />
            <span>{isSimulating ? "Menyelaraskan..." : "Tambah Tugas"}</span>
          </Button>
          <Button size="sm" variant="outline" onClick={handleReset} className="text-xs h-8 cursor-pointer">
            Reset
          </Button>
        </div>
      </div>

      {/* Task List Rendering */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-zinc-700 dark:text-zinc-300">
            Daftar Tugas di Antarmuka Klien ({tasks.length} item):
          </span>
          <span className="text-[11px] font-mono text-zinc-400">
            Strategi: {strategy === "dedup_id" ? "Map / Filter Dedup" : "Array Spread Polos"}
          </span>
        </div>

        <div className="space-y-2">
          {tasks.map((t, idx) => (
            <motion.div
              key={`${t.id}-${idx}`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
                t.source === "optimistic"
                  ? "border-amber-300 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200"
                  : t.source === "realtime"
                  ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200"
                  : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-zinc-400">[{t.id}]</span>
                <span className="font-bold">{t.title}</span>
              </div>

              <Badge
                variant="outline"
                className={`text-[9px] font-mono ${
                  t.source === "optimistic"
                    ? "border-amber-400 text-amber-600 animate-pulse"
                    : t.source === "realtime"
                    ? "border-emerald-400 text-emerald-600"
                    : "text-zinc-500"
                }`}
              >
                {t.source === "optimistic"
                  ? "Optimistic Local"
                  : t.source === "realtime"
                  ? "Confirmed via Realtime"
                  : "Initial Load"}
              </Badge>
            </motion.div>
          ))}
        </div>

        {tasks.length > 2 && strategy === "naive_append" && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-900 dark:text-red-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Bug Item Ganda Terdeteksi!</span>
              <p className="leading-relaxed">
                Pengguna melihat 2 kartu dengan judul yang sama persis: satu dari optimistic state lokal, dan satu lagi dari event real-time server. Solusinya: gunakan Map berindeks ID atau ganti tempId dengan ID asli database.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

