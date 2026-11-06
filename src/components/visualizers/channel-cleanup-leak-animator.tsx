"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Trash2,
  Radio,
  Layers,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ChannelCleanupLeakAnimator() {
  const [hasCleanup, setHasCleanup] = useState<boolean>(true);
  const [activeChannels, setActiveChannels] = useState<number[]>([1]);
  const [remountCount, setRemountCount] = useState<number>(1);

  const handleSimulateRemount = () => {
    const nextCount = remountCount + 1;
    setRemountCount(nextCount);

    if (hasCleanup) {
      // With cleanup: Old channel unsubscribed, only 1 channel active
      setActiveChannels([nextCount]);
    } else {
      // Without cleanup: Old channels leak in memory, multiple channels accumulate!
      setActiveChannels((prev) => [...prev, nextCount]);
    }
  };

  const handleReset = () => {
    setActiveChannels([1]);
    setRemountCount(1);
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 space-y-5 text-zinc-900 dark:text-zinc-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
              <Cpu className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
              Siklus Hidup React: channel.unsubscribe() &amp; Pencegahan Memory Leak
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Dampak fatal lupa membersihkan subscription saat komponen unmount atau saat re-render
          </p>
        </div>

        {/* Cleanup Strategy Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setHasCleanup(true);
              handleReset();
            }}
            className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              hasCleanup
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Dengan Cleanup (Best Practice)
          </button>

          <button
            type="button"
            onClick={() => {
              setHasCleanup(false);
              handleReset();
            }}
            className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              !hasCleanup
                ? "bg-red-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Tanpa Cleanup (Memory Leak)
          </button>
        </div>
      </div>

      {/* Control Action */}
      <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
            Simulasikan Navigasi Halaman / Komponen Remount:
          </span>
          <span className="text-[11px] text-zinc-500">
            Komponen berpindah halaman atau di-render ulang {remountCount} kali.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleSimulateRemount}
            className="text-xs font-bold h-8 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Simulasikan Re-Mount (Navigasi)
          </Button>
          <Button size="sm" variant="outline" onClick={handleReset} className="text-xs h-8 cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Active WebSockets Memory Visualizer */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-zinc-700 dark:text-zinc-300">
            Koneksi Channel WebSocket di Browser RAM:
          </span>
          <Badge
            className={`font-mono text-xs ${
              activeChannels.length === 1
                ? "bg-emerald-600 text-white"
                : "bg-red-600 text-white animate-pulse"
            }`}
          >
            {activeChannels.length} Channel Aktif
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
          <AnimatePresence>
            {activeChannels.map((cId) => (
              <motion.div
                key={cId}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`p-2.5 rounded-lg border text-center text-xs font-mono font-bold ${
                  hasCleanup
                    ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                    : "border-red-400 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300"
                }`}
              >
                <Radio className="w-4 h-4 mx-auto mb-1 animate-pulse" />
                <span>ch-tasks-{cId}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Warning or Success Message */}
        {activeChannels.length > 1 ? (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-900 dark:text-red-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">
                Memory Leak Terdeteksi! Duplicate Listeners ({activeChannels.length}x)
              </span>
              <p className="leading-relaxed">
                Setiap event baru dari server akan dieksekusi sebanyak {activeChannels.length} kali! Ini menyebabkan lonjakan penggunaan RAM browser, peringatan React <em>&quot;Can&apos;t perform a React state update on an unmounted component&quot;</em>, dan bug antarmuka berkedip ganda.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Koneksi Bersih: 1 Subscription Saja</span>
              <p className="leading-relaxed">
                Fungsi cleanup <code>return () =&gt; &#123; supabase.removeChannel(channel) &#125;</code> di dalam <code>useEffect</code> memutus koneksi lama sebelum komponen baru dipasang.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Code Snippet Solution */}
      <div className="p-3.5 rounded-xl bg-zinc-950 text-zinc-200 font-mono text-[11px] leading-relaxed border border-zinc-800">
        <code>{`useEffect(() => {\n  const channel = supabase.channel('tasks').on('postgres_changes', ...).subscribe()\n  return () => {\n    supabase.removeChannel(channel) // WAJIB: Mencegah kebocoran koneksi!\n  }\n}, [])`}</code>
      </div>
    </div>
  );
}

