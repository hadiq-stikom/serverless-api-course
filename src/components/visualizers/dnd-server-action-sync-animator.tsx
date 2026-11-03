"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Layers, ShieldCheck, CheckCircle2, Play, RotateCcw, AlertCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DndServerActionSyncAnimator() {
  const [pipelineStep, setPipelineStep] = useState<number>(0); // 0: Idle, 1: Zod, 2: Auth, 3: RPC, 4: Revalidate
  const [isValidPayload, setIsValidPayload] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const handleStartPipeline = () => {
    setIsProcessing(true);
    setPipelineStep(1); // Step 1: Zod Validation
    setResultMessage(null);

    setTimeout(() => {
      if (!isValidPayload) {
        setIsProcessing(false);
        setPipelineStep(1);
        setResultMessage("❌ ZodError: ID Tugas wajib berformat UUID v4 valid. Mutasi ditolak!");
        return;
      }

      setPipelineStep(2); // Step 2: Auth Check
      setTimeout(() => {
        setPipelineStep(3); // Step 3: Supabase RPC
        setTimeout(() => {
          setPipelineStep(4); // Step 4: revalidatePath
          setIsProcessing(false);
          setResultMessage("✅ Server Action Tuntas: { success: true }. Cache /tasks berhasil direvalidasi!");
        }, 500);
      }, 500);
    }, 500);
  };

  const handleReset = () => {
    setPipelineStep(0);
    setIsProcessing(false);
    setResultMessage(null);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-xs font-semibold">
              Pilar 4.3: Next.js 16 Server Action
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Zod ➔ Supabase RPC ➔ revalidatePath
            </span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Pipeline Server Action: Validasi Skema Zod hingga Revalidasi Cache
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            disabled={isProcessing}
            className="text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
          </Button>
          <Button
            size="sm"
            onClick={handleStartPipeline}
            disabled={isProcessing}
            className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Jalankan Server Action
          </Button>
        </div>
      </div>

      {/* Payload Switcher */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={isValidPayload ? "default" : "outline"}
          onClick={() => { setIsValidPayload(true); handleReset(); }}
          className={`text-xs ${isValidPayload ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Payload Sah (Valid UUID v4 & Enum)
        </Button>
        <Button
          size="sm"
          variant={!isValidPayload ? "destructive" : "outline"}
          onClick={() => { setIsValidPayload(false); handleReset(); }}
          className="text-xs"
        >
          <AlertCircle className="w-3.5 h-3.5 mr-1" /> Payload Korup (Invalid UUID String)
        </Button>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Stage: 4-Step Visual Flow */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/50 space-y-3">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
              Alur Eksekusi reorderTasksAction(payload):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Step 1: Zod */}
              <div className={`p-3 rounded-lg border transition-all ${
                pipelineStep >= 1
                  ? !isValidPayload
                    ? "border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200"
                    : "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 opacity-60"
              }`}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>1. Zod SafeParse</span>
                  {pipelineStep >= 1 && (isValidPayload ? <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> : <AlertCircle className="w-3.5 h-3.5 text-red-500" />)}
                </div>
                <p className="text-[10px] mt-1 text-zinc-500">
                  {isValidPayload ? "Array schema tervalidasi" : "Ditolak: format UUID invalid"}
                </p>
              </div>

              {/* Step 2: Auth */}
              <div className={`p-3 rounded-lg border transition-all ${
                pipelineStep >= 2
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 opacity-60"
              }`}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>2. Supabase Auth</span>
                  {pipelineStep >= 2 && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />}
                </div>
                <p className="text-[10px] mt-1 text-zinc-500">
                  Verifikasi cookies session user
                </p>
              </div>

              {/* Step 3: RPC */}
              <div className={`p-3 rounded-lg border transition-all ${
                pipelineStep >= 3
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 opacity-60"
              }`}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>3. Supabase RPC</span>
                  {pipelineStep >= 3 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
                <p className="text-[10px] mt-1 text-zinc-500">
                  Panggil reorder_kanban_tasks
                </p>
              </div>

              {/* Step 4: revalidatePath */}
              <div className={`p-3 rounded-lg border transition-all ${
                pipelineStep >= 4
                  ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-200"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 opacity-60"
              }`}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>4. revalidatePath</span>
                  {pipelineStep >= 4 && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />}
                </div>
                <p className="text-[10px] mt-1 text-zinc-500">
                  Refresh RSC cache /tasks
                </p>
              </div>
            </div>
          </div>

          {/* Feedback Result Banner */}
          {resultMessage && (
            <div className={`p-3 rounded-xl border text-xs font-semibold ${
              resultMessage.startsWith("✅")
                ? "border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200"
                : "border-red-500/40 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200"
            }`}>
              {resultMessage}
            </div>
          )}
        </div>

        {/* Right Stage: JSON Payload Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 space-y-3">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-500" /> Payload JSON Inspector
            </span>

            <div className="p-3 rounded-lg bg-zinc-950 text-indigo-300 font-mono text-[11px] border border-zinc-800">
              {isValidPayload ? (
                <pre>{`[
  {
    "id": "a8098c1a-f86e-11da-bd1a-00112444be1e",
    "status": "in_progress",
    "position": 1
  }
]`}</pre>
              ) : (
                <pre className="text-red-400">{`[
  {
    "id": "123-bukan-uuid", // ❌ Zod Reject!
    "status": "in_progress",
    "position": 1
  }
]`}</pre>
              )}
            </div>

            <div className="text-[11px] text-zinc-500">
              Validasi Zod runtime di sisi server mencegah payload berbahaya (SQL Injection / Type Confusion) mencapai database PostgreSQL.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

