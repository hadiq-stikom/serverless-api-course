"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Server, 
  Laptop, 
  Database, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Play, 
  RotateCcw, 
  Lock, 
  Layers, 
  CheckCircle2, 
  Cpu, 
  FileCode, 
  ArrowRight 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ServerClientAnimator() {
  const [mode, setMode] = useState<"server" | "client" | "composition">("server");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);

  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(1);

    setTimeout(() => {
      setSimulationStep(2);
    }, 1200);

    setTimeout(() => {
      setSimulationStep(3);
      setIsSimulating(false);
    }, 2400);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimulationStep(0);
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Cpu className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator Aliran Komputasi Server vs Client
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Amati bagaimana paket data, rahasia database, dan ukuran bundle JavaScript diproses.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl self-start sm:self-auto border border-zinc-200 dark:border-zinc-700/60">
          <button
            type="button"
            onClick={() => { setMode("server"); resetSimulation(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === "server"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Server (RSC)
          </button>
          <button
            type="button"
            onClick={() => { setMode("client"); resetSimulation(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === "client"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Client (&apos;use client&apos;)
          </button>
          <button
            type="button"
            onClick={() => { setMode("composition"); resetSimulation(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === "composition"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Interleaving
          </button>
        </div>
      </div>

      {/* Main Visual Arena: Server ➔ Network Wire ➔ Browser */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        {/* Sisi Kiri: Cloud Server */}
        <div className={`md:col-span-4 rounded-xl border p-4 transition-all duration-300 ${
          simulationStep === 1
            ? "border-indigo-500 bg-indigo-500/10 shadow-md ring-2 ring-indigo-500/20"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white">
              <Server className="w-4 h-4 text-blue-500" />
              Cloud Server (Node/Vercel)
            </span>
            <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-600 dark:text-blue-400">
              {mode === "server" ? "Eksekusi 100%" : mode === "client" ? "Scaffolding" : "Hybrid"}
            </Badge>
          </div>

          <div className="space-y-2 text-xs">
            <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
              mode === "server" || mode === "composition"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                : "bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50 text-zinc-500"
            }`}>
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                Query Database Supabase
              </span>
              <span className="font-mono text-[10px] font-bold">
                {mode === "server" || mode === "composition" ? "Direct Access" : "Via API Client"}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                Rahasia (.env.local)
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                🔒 100% Terkunci di Server
              </span>
            </div>
          </div>
        </div>

        {/* Tengah: Animasi Kabel Jaringan & Paket Data */}
        <div className="md:col-span-3 flex flex-col items-center justify-center py-2 relative">
          <div className="text-[10px] font-mono text-zinc-400 mb-1 flex items-center gap-1">
            <span>Kabel Jaringan</span>
            <ArrowRight className="w-3 h-3 text-indigo-500" />
          </div>

          {/* Wire Bar */}
          <div className="w-full h-3 rounded-full bg-zinc-200 dark:bg-zinc-800 relative overflow-hidden flex items-center">
            {simulationStep === 2 && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1, ease: "easeInOut", repeat: Infinity }}
                className={`w-1/2 h-full rounded-full ${
                  mode === "server"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-400 shadow-sm shadow-blue-500"
                    : mode === "client"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-sm shadow-purple-500"
                    : "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500"
                }`}
              />
            )}
          </div>

          {/* Wire Payload Label */}
          <div className="mt-2 text-center">
            {mode === "server" ? (
              <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                HTML + RSC Payload (0 kB JS)
              </span>
            ) : mode === "client" ? (
              <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                JavaScript Bundle (~45 kB)
              </span>
            ) : (
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                0 kB JS Child + Light Modal Wrapper
              </span>
            )}
          </div>
        </div>

        {/* Sisi Kanan: Browser Pengguna */}
        <div className={`md:col-span-4 rounded-xl border p-4 transition-all duration-300 ${
          simulationStep === 3
            ? "border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/20"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70"
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white">
              <Laptop className="w-4 h-4 text-purple-500" />
              Browser Mahasiswa (Klien)
            </span>
            <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-600 dark:text-purple-400">
              {mode === "server" ? "Instant Paint" : "Hydration Diperlukan"}
            </Badge>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 flex items-center justify-between">
              <span className="text-zinc-700 dark:text-zinc-300">Beban Hydration:</span>
              <span className={`font-mono font-bold ${
                mode === "server" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
              }`}>
                {mode === "server" ? "0 ms (Tanpa Hydrate)" : "~85 ms CPU Parsing"}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 flex items-center justify-between">
              <span className="text-zinc-700 dark:text-zinc-300">Interaktivitas (onClick):</span>
              <span className="font-mono text-[10px] font-bold text-zinc-800 dark:text-zinc-200">
                {mode === "server" ? "Dilarang ('use client' required)" : "Aktif (useState / Event)"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <span className="text-[11px] text-zinc-500 font-medium">Ukuran Bundle JS Klien:</span>
          <div className="text-sm md:text-base font-black text-zinc-900 dark:text-white flex items-center gap-1.5">
            {mode === "server" ? (
              <span className="text-emerald-600 dark:text-emerald-400">0 kB (Nol Bundle)</span>
            ) : mode === "client" ? (
              <span className="text-amber-600 dark:text-amber-400">~45 kB (Tergantung Library)</span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400">Tetap 0 kB untuk Anak</span>
            )}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <span className="text-[11px] text-zinc-500 font-medium">Keamanan Database Secrets:</span>
          <div className="text-sm md:text-base font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            100% Terisolasi Aman
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <span className="text-[11px] text-zinc-500 font-medium">Use Case Ideal:</span>
          <div className="text-xs font-bold text-zinc-900 dark:text-zinc-200">
            {mode === "server" && "Data Fetching, Layout Utama, SEO Page"}
            {mode === "client" && "Form Input, Modal Toggle, Filter State"}
            {mode === "composition" && "Membungkus Server List ke Modal Client"}
          </div>
        </div>
      </div>

      {/* Simulation Controls & Explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={startSimulation}
            disabled={isSimulating}
            className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-8"
          >
            {isSimulating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </motion.div>
                <span>Mensimulasikan...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Jalankan Aliran Simulasi</span>
              </>
            )}
          </Button>

          {simulationStep > 0 && !isSimulating && (
            <Button
              size="sm"
              variant="outline"
              onClick={resetSimulation}
              className="text-xs h-8"
            >
              Reset
            </Button>
          )}
        </div>

        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic">
          💡 Tips: Klik tombol mode di atas, lalu tekan &quot;Jalankan Aliran Simulasi&quot; untuk melihat prosesnya.
        </p>
      </div>
    </div>
  );
}
