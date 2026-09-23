"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Laptop, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Zap, 
  MousePointerClick, 
  Cpu 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ClientHydrationAnimator() {
  const [hydrationPhase, setHydrationPhase] = useState<1 | 2 | 3 | 4>(4); // Default to interactive
  const [isSimulating, setIsSimulating] = useState(false);
  const [count, setCount] = useState(0);

  const runSimulation = () => {
    setIsSimulating(true);
    setHydrationPhase(1); // Step 1: Raw HTML
    setCount(0);

    setTimeout(() => {
      setHydrationPhase(2); // Step 2: Download JS Bundle
    }, 1000);

    setTimeout(() => {
      setHydrationPhase(3); // Step 3: Hydration / Event Binding
    }, 2000);

    setTimeout(() => {
      setHydrationPhase(4); // Step 4: Fully Hydrated & Interactive
      setIsSimulating(false);
    }, 3000);
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Zap className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator Siklus Rehidrasi Client Component (&apos;use client&apos;)
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Lihat bagaimana browser mengubah HTML statis menjadi antarmuka interaktif yang responsif terhadap state.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={runSimulation}
            disabled={isSimulating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 gap-1.5 shadow-sm"
          >
            {isSimulating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </motion.div>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Simulasi Alur Rehidrasi</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          { step: 1, title: "1. HTML Statis", desc: "FCP cepat (tanpa JS)" },
          { step: 2, title: "2. Unduh Bundle JS", desc: "Bundle (~45 kB) tiba" },
          { step: 3, title: "3. Hydration Process", desc: "Binding event listener" },
          { step: 4, title: "4. Full Interaktif", desc: "useState & onClick aktif" },
        ].map((item) => {
          const isActive = hydrationPhase === item.step;
          const isDone = hydrationPhase > item.step;
          return (
            <div
              key={item.step}
              onClick={() => !isSimulating && setHydrationPhase(item.step as 1 | 2 | 3 | 4)}
              className={`cursor-pointer p-3 rounded-xl border transition-all ${
                isActive
                  ? "bg-indigo-500/10 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 shadow-sm"
                  : isDone
                  ? "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                  : "bg-white/50 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800 text-zinc-400 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold">
                  {item.title}
                </span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                {isActive && <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />}
              </div>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Live Simulation Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Component State & Memory Inspector */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-200/80 dark:border-zinc-800 pb-2">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              Runtime Memory & DOM State
            </span>
            <Badge variant="outline" className="text-[10px]">
              Fase: {hydrationPhase === 1 ? "Raw HTML" : hydrationPhase === 2 ? "Script Loaded" : hydrationPhase === 3 ? "Hydrating" : "Ready"}
            </Badge>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-zinc-900 text-zinc-100 dark:bg-zinc-950 dark:border dark:border-zinc-800 text-[11px] space-y-1.5">
              <div className="text-zinc-400 flex items-center justify-between">
                <span>// DOM Event Listeners</span>
                <span className={hydrationPhase >= 3 ? "text-emerald-400 font-bold" : "text-amber-400"}>
                  {hydrationPhase >= 3 ? "✅ Bound to onClick" : "❌ Belum Terpasang"}
                </span>
              </div>
              <div className="text-zinc-400 flex items-center justify-between">
                <span>// React State (useState)</span>
                <span className={hydrationPhase === 4 ? "text-cyan-400 font-bold" : "text-zinc-500"}>
                  {hydrationPhase === 4 ? `count: ${count}` : "state: Uninitialized"}
                </span>
              </div>
              <div className="text-zinc-400 flex items-center justify-between">
                <span>// Client Bundle</span>
                <span className={hydrationPhase >= 2 ? "text-indigo-400" : "text-zinc-500"}>
                  {hydrationPhase >= 2 ? "45.2 kB (Downloaded)" : "0 kB (Pending)"}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed p-2 rounded-lg bg-white dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60">
              {hydrationPhase === 1 && (
                <p>⚠️ <strong>Fase 1:</strong> Pengguna sudah dapat melihat tombol (FCP instan), namun jika tombol diklik saat ini, <em>tidak akan ada respon</em> karena JavaScript belum selesai dimuat.</p>
              )}
              {hydrationPhase === 2 && (
                <p>📥 <strong>Fase 2:</strong> File JavaScript bundle komponen berhasil diunduh dari CDN/Server. React runtime mulai membaca tree virtual.</p>
              )}
              {hydrationPhase === 3 && (
                <p>⚙️ <strong>Fase 3:</strong> React melakukan <em>hydration</em>: mencocokkan Virtual DOM dengan DOM HTML asli, menyuntikkan memori state, dan mengikat handler event.</p>
              )}
              {hydrationPhase === 4 && (
                <p>✨ <strong>Fase 4:</strong> Komponen 100% interaktif! Setiap klik akan memperbarui state reaktif secara instan di peramban tanpa me-refresh halaman.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Component Sandbox */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-indigo-500" />
              Preview Peramban Pengguna
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">browser viewport</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center space-y-3">
            <div className="relative">
              <Button
                size="lg"
                onClick={() => {
                  if (hydrationPhase === 4) {
                    setCount((prev) => prev + 1);
                  }
                }}
                disabled={hydrationPhase < 4}
                className={`transition-all duration-200 relative px-6 py-5 text-sm font-bold shadow-md ${
                  hydrationPhase === 4
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white cursor-pointer hover:scale-105 active:scale-95"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed border border-dashed border-zinc-400 dark:border-zinc-700"
                }`}
              >
                <MousePointerClick className="w-4 h-4 mr-2" />
                {hydrationPhase < 3 ? "Tombol Belum Siap (Loading JS...)" : hydrationPhase === 3 ? "Sedang Mengikat Event..." : `Klik Saya! (Diklik: ${count}x)`}
              </Button>

              {hydrationPhase === 4 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm"
                >
                  Aktif
                </motion.div>
              )}
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
              {hydrationPhase === 4
                ? "Klik tombol di atas untuk menguji mutasi state lokal `useState`. Interaktivitas berjalan 100% di browser tanpa request jaringan tambahan!"
                : "Pada fase ini, tombol belum responsif terhadap klik karena proses rehidrasi belum selesai."}
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] flex items-center justify-between text-zinc-500">
            <span>Karakteristik &apos;use client&apos;</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">Client Hydration Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
}
