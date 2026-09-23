"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Layers, 
  Loader2 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function UseActionStateAnimator() {
  const [phase, setPhase] = useState<"idle" | "pending" | "resolved">("idle");
  const [mockMessage, setMockMessage] = useState<string | null>(null);

  const triggerAction = () => {
    setPhase("pending");
    setMockMessage(null);

    setTimeout(() => {
      setPhase("resolved");
      setMockMessage("Tugas berhasil disimpan ke cloud database Supabase!");
    }, 1500);
  };

  const reset = () => {
    setPhase("idle");
    setMockMessage(null);
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Cpu className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator Siklus React 19 useActionState Hook
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Uji transisi state [state, formAction, isPending] yang disediakan secara native oleh React 19.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {phase !== "idle" && (
            <Button
              size="sm"
              variant="outline"
              onClick={reset}
              className="text-xs h-8 gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
          )}
          <Button
            size="sm"
            onClick={triggerAction}
            disabled={phase === "pending"}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 gap-1.5 shadow-sm"
          >
            {phase === "pending" ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>isPending: true...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Kirim Form (Picu Action)</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Lifecycle Phase Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {[
          { key: "idle", title: "1. Idle (Siap)", desc: "isPending: false, state: null" },
          { key: "pending", title: "2. Submitting (Pending)", desc: "isPending: true, tombol disable" },
          { key: "resolved", title: "3. Action Selesai", desc: "isPending: false, state: feedback" },
        ].map((item) => {
          const isActive = phase === item.key;
          return (
            <div
              key={item.key}
              className={`p-3 rounded-xl border transition-all ${
                isActive
                  ? "bg-indigo-500/15 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 font-bold shadow-sm"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs">{item.title}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />}
              </div>
              <p className="text-[11px] font-normal text-zinc-500 dark:text-zinc-400">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Live State Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Code Structure */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
            <span>Sintaks Hook React 19 (&apos;use client&apos;)</span>
            <Badge className="bg-indigo-500/20 text-indigo-300">React 19 Native</Badge>
          </div>

          <pre className="text-[11px] leading-relaxed">
{`"use client";
import { useActionState } from "react";
import { createTaskAction } from "@/actions/tasks";

export function TaskForm() {
  // 3 nilai kunci dikembalikan dalam 1 hook:
  const [state, formAction, isPending] = useActionState(
    createTaskAction, 
    null // Initial state
  );

  return (
    <form action={formAction}>
      <button disabled={isPending}>
        {isPending ? "Menyimpan..." : "Simpan Tugas"}
      </button>
      {state?.message && <p>{state.message}</p>}
    </form>
  );
}`}
          </pre>
        </div>

        {/* Right: Runtime State Inspector */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span>Live Hook State Inspector</span>
            <span className="text-[10px] text-zinc-400 font-mono">React Memory</span>
          </div>

          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">isPending:</span>
              <span className={`font-bold ${phase === "pending" ? "text-amber-500 animate-pulse" : "text-emerald-500"}`}>
                {phase === "pending" ? "true" : "false"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">state:</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                {phase === "resolved" ? "{ success: true, message: '...' }" : "null (Initial)"}
              </span>
            </div>
          </div>

          {/* User Feedback Alert */}
          <div className="min-h-[60px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {phase === "resolved" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full p-3 rounded-lg border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{mockMessage}</span>
                </motion.div>
              )}
              {phase === "pending" && (
                <div className="text-xs text-zinc-400 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                  <span>Server Action sedang memproses mutasi di cloud...</span>
                </div>
              )}
              {phase === "idle" && (
                <span className="text-xs text-zinc-400">Tekan tombol di kanan atas untuk memicu Server Action.</span>
              )}
            </AnimatePresence>
          </div>

          <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <span>Catatan: Jangan gunakan <code>useFormState</code> lagi; telah digantikan oleh <code>useActionState</code> di React 19.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
