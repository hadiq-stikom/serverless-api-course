"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Server, 
  DollarSign, 
  Cpu, 
  Play, 
  RotateCcw, 
  Activity, 
  ArrowRight,
  TrendingDown,
  Layers
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function FaasComputeAnimator() {
  const [mode, setMode] = useState<"faas" | "vps">("faas");
  const [trafficState, setTrafficState] = useState<"idle" | "incoming" | "executing" | "scaledown">("idle");
  const [requestCount, setRequestCount] = useState(0);

  const simulateTraffic = () => {
    if (trafficState !== "idle") return;
    setTrafficState("incoming");
    setRequestCount(4);

    setTimeout(() => {
      setTrafficState("executing");
    }, 800);

    setTimeout(() => {
      setTrafficState("scaledown");
    }, 2400);

    setTimeout(() => {
      setTrafficState("idle");
      setRequestCount(0);
    }, 3600);
  };

  const resetSimulation = () => {
    setTrafficState("idle");
    setRequestCount(0);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-semibold">
              Pilar 1.1: Event-Driven Compute
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">scale-to-zero vs 24/7 idle</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Siklus Eksekusi FaaS vs VPS Monolith
          </h4>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setMode("faas")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === "faas"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            FaaS Serverless (Vercel)
          </button>
          <button
            type="button"
            onClick={() => setMode("vps")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === "vps"
                ? "bg-zinc-700 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            Monolith VPS (Tradisional)
          </button>
        </div>
      </div>

      {/* Control Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-100/80 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-700/60">
        <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>Status Sistem:</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100 capitalize">
            {trafficState === "idle" && "Idle (Menunggu Request)"}
            {trafficState === "incoming" && "Lonjakan Request HTTP Masuk (4 Event)"}
            {trafficState === "executing" && "Menjalankan Logika Fungsi (15ms)"}
            {trafficState === "scaledown" && "Scale-to-Zero (Membersihkan Container)"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={simulateTraffic}
            disabled={trafficState !== "idle"}
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold gap-1.5 shadow-xs"
          >
            <Play className="w-3.5 h-3.5" />
            Kirim 4 Request HTTP
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={resetSimulation}
            className="text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Visual Simulation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Visual Container Stage */}
        <div className="md:col-span-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
            <span>Komputasi CPU & Alokasi Instance:</span>
            <span className="font-mono text-zinc-500">
              {mode === "faas" ? "FaaS Model: Ephemeral Instance" : "VPS Model: Persistent Linux VM"}
            </span>
          </div>

          {/* Active Instances Display */}
          <div className="h-44 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/40 p-4 flex items-center justify-center relative overflow-hidden">
            {mode === "faas" ? (
              <div className="w-full">
                {trafficState === "idle" && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-2"
                  >
                    <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <TrendingDown className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                      0 Instance Aktif (Scale-to-Zero)
                    </div>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                      Tidak ada request yang diproses. Serverless mati otomatis dan biaya komputasi adalah <span className="text-emerald-600 font-bold">Rp 0</span>.
                    </p>
                  </motion.div>
                )}

                {(trafficState === "incoming" || trafficState === "executing" || trafficState === "scaledown") && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0.8, opacity: 0, y: 10 }}
                        animate={{ 
                          scale: 1, 
                          opacity: trafficState === "scaledown" ? 0.3 : 1, 
                          y: 0 
                        }}
                        transition={{ duration: 0.3, delay: idx * 0.08 }}
                        className={`p-3 rounded-xl border text-center space-y-1.5 transition-all ${
                          trafficState === "executing"
                            ? "bg-amber-500/10 border-amber-500/50 text-amber-700 dark:text-amber-300 shadow-sm ring-1 ring-amber-500/30"
                            : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        <Zap className="w-4 h-4 mx-auto text-amber-500" />
                        <div className="text-[11px] font-mono font-bold">Worker #{idx + 1}</div>
                        <div className="text-[10px] text-zinc-500">
                          {trafficState === "incoming" && "Spawning..."}
                          {trafficState === "executing" && "15ms Active"}
                          {trafficState === "scaledown" && "Terminating"}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* VPS Model Display */
              <div className="w-full text-center space-y-2">
                <div className="inline-flex p-3 rounded-full bg-zinc-700 text-zinc-100 shadow-md">
                  <Server className="w-6 h-6 animate-pulse" />
                </div>
                <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  1 VPS Server (Ubuntu 22.04 LTS) Berjalan 24/7
                </div>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  {trafficState === "idle" 
                    ? "Server terus menyala dan memakan daya CPU/RAM meskipun tidak ada satupun request pengunjung."
                    : "Server melayani request dengan resource CPU yang sama tanpa isolasi mikro."}
                </p>
              </div>
            )}
          </div>

          {/* Metric Comparison Footer */}
          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
              <span className="text-zinc-500 block text-[11px]">Cold Start / Waktu Bangun:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                {mode === "faas" ? "~15 - 50 ms (Vercel Edge)" : "0 ms (Selalu Menyala)"}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
              <span className="text-zinc-500 block text-[11px]">Batas Skalabilitas Otomatis:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                {mode === "faas" ? "10,000+ Concurrency Instan" : "Maks 500 req/sec (Perlu Upgrade VPS)"}
              </span>
            </div>
          </div>
        </div>

        {/* Cost & Operational Impact Card */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>Model Tagihan Finansial:</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold block">
                Estimasi Biaya Saat Tidak Ada Pengunjung (Idle):
              </span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {mode === "faas" ? "Rp 0 / Bulan" : "$15 - $30 / Bulan"}
              </div>
              <span className="text-[10px] text-zinc-500 block">
                {mode === "faas" ? "100% Pay-Per-Execution" : "Sewa Server Tetap 24/7"}
              </span>
            </div>

            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 pt-1">
              <div className="flex items-center justify-between pb-1 border-b border-zinc-100 dark:border-zinc-800">
                <span>Maintenance OS:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {mode === "faas" ? "0 Jam (Dikelola Cloud)" : "Wajib Patch Kernel & Nginx"}
                </span>
              </div>
              <div className="flex items-center justify-between pb-1 border-b border-zinc-100 dark:border-zinc-800">
                <span>Memory Crash Risk:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {mode === "faas" ? "Terisolasi per Request" : "Bisa Crash Satu Server"}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 leading-relaxed border border-zinc-200 dark:border-zinc-700">
            💡 <strong>Rangkuman:</strong> FaaS mentransformasikan kode backend menjadi unit terisolasi yang dihidupkan saat event HTTP tiba dan dihancurkan segera setelah respons terkirim.
          </div>
        </div>
      </div>
    </div>
  );
}
