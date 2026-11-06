"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Layers,
  Radio,
  Laptop,
  ArrowRight,
  Play,
  RotateCcw,
  CheckCircle2,
  Cpu,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function WalCdcPipelineAnimator() {
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const steps = [
    {
      title: "1. Mutasi SQL di PostgreSQL (INSERT / UPDATE / DELETE)",
      desc: "Sebuah Server Action atau query mengeksekusi mutasi SQL pada tabel 'tasks'. Data ditulis secara atomik ke storage engine.",
      icon: Database,
      badge: "PostgreSQL Storage"
    },
    {
      title: "2. Penulisan ke WAL (Write-Ahead Logging)",
      desc: "PostgreSQL mencatat mutasi ke file biner Write-Ahead Log (WAL) sebelum transaksi di-commit. Ini adalah sumber kebenaran CDC (Change Data Capture).",
      icon: FileText,
      badge: "Postgres WAL"
    },
    {
      title: "3. Logical Replication & Publication Decoder",
      desc: "Fitur logical decoding PostgreSQL membaca stream WAL dari publikasi 'supabase_realtime' dan mengubahnya menjadi format event JSON terstruktur.",
      icon: Cpu,
      badge: "wal2json / pgoutput"
    },
    {
      title: "4. Realtime Server (Elixir Phoenix Channels)",
      desc: "Realtime Engine Supabase berbasis bahasa Elixir/Erlang (BEAM) menerima event, memfilter berdasarkan RLS pengguna, dan mem-broadcast ke jutaan koneksi WebSocket aktif.",
      icon: Radio,
      badge: "Elixir Phoenix Engine"
    },
    {
      title: "5. Penerimaan Event di Browser Klien (Next.js 16)",
      desc: "Klien React menangkap payload 'postgres_changes' melalui channel subscription dan memperbarui state antarmuka secara instan tanpa reload.",
      icon: Laptop,
      badge: "WebSocket Client (React)"
    }
  ];

  const handleRunPipeline = () => {
    setIsProcessing(true);
    setPipelineStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setPipelineStep(step);
      if (step >= steps.length - 1) {
        clearInterval(interval);
        setIsProcessing(false);
      }
    }, 1100);
  };

  const handleReset = () => {
    setPipelineStep(0);
    setIsProcessing(false);
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 space-y-5 text-zinc-900 dark:text-zinc-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
              <Layers className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
              Anatomi Pipeline CDC: Dari Postgres WAL ke Phoenix Channels
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Mekanisme Change Data Capture (CDC) yang memungkinkan sinkronisasi real-time tanpa membebani query database
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleRunPipeline}
            disabled={isProcessing}
            className="text-xs font-bold h-8 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Play className="w-3.5 h-3.5 mr-1" />
            <span>{isProcessing ? "Menjalankan Pipeline..." : "Picu Event SQL"}</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            disabled={isProcessing}
            className="text-xs h-8 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Stepper Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
        {steps.map((st, idx) => {
          const IconComponent = st.icon;
          const isActive = pipelineStep === idx;
          const isPassed = pipelineStep > idx;

          return (
            <div
              key={st.title}
              className={`p-3 rounded-xl border transition-all duration-300 relative ${
                isActive
                  ? "border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/50 shadow-md ring-2 ring-indigo-500/20"
                  : isPassed
                  ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`p-1.5 rounded-lg ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : isPassed
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-zinc-400">
                  Step {idx + 1}
                </span>
              </div>

              <div className="mt-2 space-y-1">
                <Badge
                  variant="outline"
                  className={`text-[9px] px-1.5 py-0 font-mono ${
                    isActive
                      ? "border-indigo-400 text-indigo-700 dark:text-indigo-300 bg-white dark:bg-zinc-900"
                      : isPassed
                      ? "border-emerald-400 text-emerald-700 dark:text-emerald-300"
                      : "text-zinc-500"
                  }`}
                >
                  {st.badge}
                </Badge>
                <div className="text-xs font-bold leading-tight line-clamp-2">
                  {st.title.split(":")[0]}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Step Deep Dive Box */}
      <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
            {steps[pipelineStep].title}
          </span>
          <Badge className="bg-indigo-600 text-white text-[10px]">
            {steps[pipelineStep].badge}
          </Badge>
        </div>
        <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {steps[pipelineStep].desc}
        </p>

        {/* Live Payload Preview */}
        <div className="pt-2">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
            Representasi Format Data di Tahap Ini:
          </span>
          <div className="p-2.5 rounded-lg bg-zinc-950 text-zinc-200 font-mono text-[11px] leading-relaxed border border-zinc-800">
            {pipelineStep === 0 && (
              <code>INSERT INTO public.tasks (id, title, status) VALUES (101, &apos;Setup Realtime&apos;, &apos;todo&apos;);</code>
            )}
            {pipelineStep === 1 && (
              <code className="text-amber-400">WAL Record #94821: LSN=0/16B2D80 [COMMIT TX #5401, RELID=16384 (tasks)]</code>
            )}
            {pipelineStep === 2 && (
              <code className="text-blue-400">{`{ "action": "I", "schema": "public", "table": "tasks", "columns": [{ "name": "id", "value": 101 }] }`}</code>
            )}
            {pipelineStep === 3 && (
              <code className="text-purple-400">
                {`Phoenix.PubSub.broadcast("realtime:public:tasks", %{event: "INSERT", new: ...})`}
              </code>
            )}
            {pipelineStep === 4 && (
              <code className="text-emerald-400">{`supabase.channel('tasks').on('postgres_changes', { event: 'INSERT' }, (payload) => ...)`}</code>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
