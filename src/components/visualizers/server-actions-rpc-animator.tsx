"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Server, 
  Laptop, 
  Database, 
  Zap, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Lock, 
  FileCode, 
  ArrowRight, 
  ShieldCheck 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ServerActionsRpcAnimator() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const startSimulation = () => {
    setIsSimulating(true);
    setStep(1); // Client Form Dispatch

    setTimeout(() => {
      setStep(2); // Network RPC POST Request with Action ID Hash
    }, 1200);

    setTimeout(() => {
      setStep(3); // Server Execution & Database Mutation
      setIsSimulating(false);
    }, 2400);
  };

  const reset = () => {
    setStep(0);
    setIsSimulating(false);
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
              Simulator Alur RPC Server Actions (&apos;use server&apos;)
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Lihat bagaimana Next.js mengeksekusi mutasi data di server tanpa perlu membuat file API endpoint manual di /api/*.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {step > 0 && (
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
            onClick={startSimulation}
            disabled={isSimulating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 gap-1.5 shadow-sm"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isSimulating ? "Mengirim RPC..." : "Simulasi Eksekusi RPC"}</span>
          </Button>
        </div>
      </div>

      {/* Stepper Progress Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {[
          { num: 1, title: "1. Form Submit", desc: "Form memanggil Server Action" },
          { num: 2, title: "2. Automatic RPC POST", desc: "Next.js mengirim request terenkripsi" },
          { num: 3, title: "3. Server Execution", desc: "Mutasi DB & Revalidasi di Server" },
        ].map((item) => {
          const isActive = step === item.num;
          const isDone = step > item.num;
          return (
            <div
              key={item.num}
              className={`p-3 rounded-xl border transition-all ${
                isActive
                  ? "bg-indigo-500/10 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 shadow-sm"
                  : isDone
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                  : "bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-400 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">{item.title}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : isActive ? (
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                ) : null}
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Interactive Architecture Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left: Client Browser Screen */}
        <div className="lg:col-span-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-indigo-500" />
              Browser Pengguna (Client)
            </span>
            <Badge variant="outline" className="text-[9px]">0 kB API Boilerplate</Badge>
          </div>

          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 space-y-2 text-xs">
            <div className="font-semibold text-zinc-800 dark:text-zinc-200">
              Form Entri Tugas:
            </div>
            <div className="h-6 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-2 flex items-center text-[10px] text-zinc-500 font-mono">
              &quot;Implementasi RLS Supabase&quot;
            </div>
            <div className={`p-2 rounded text-center text-xs font-bold transition-all ${
              step >= 1 ? "bg-indigo-600 text-white shadow-xs" : "bg-zinc-200 dark:bg-zinc-700 text-zinc-400"
            }`}>
              {step === 0 ? "Form Siap Kirim" : step === 1 ? "Dispatching Action..." : "Menunggu Feedback..."}
            </div>
          </div>
        </div>

        {/* Center: Network Wire & Action ID Hash */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-3 text-center space-y-2">
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Otomatis Disalurkan oleh Next.js
          </div>

          <div className="w-full relative flex items-center justify-center py-2">
            <div className="w-full h-0.5 bg-zinc-200 dark:bg-zinc-800" />
            <AnimatePresence>
              {step === 2 && (
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 100, opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  className="absolute px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-mono shadow-md flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>POST __rsc/a8f9c1</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-[11px] text-zinc-600 dark:text-zinc-400">
            {step === 2 ? (
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                🚀 Mengirim payload POST terenkripsi dengan Action ID Hash unik.
              </span>
            ) : (
              <span>Tanpa endpoint manual seperti <code>fetch(&apos;/api/create-task&apos;)</code>!</span>
            )}
          </div>
        </div>

        {/* Right: Cloud Server Execution */}
        <div className="lg:col-span-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 space-y-3 shadow-xs font-mono text-xs">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-300 border-b border-zinc-800 pb-2">
            <span className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              Node.js / Edge Server
            </span>
            <Badge className="bg-emerald-500/20 text-emerald-300 text-[9px]">&apos;use server&apos;</Badge>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] space-y-1.5">
            <div className="text-zinc-400 flex items-center justify-between">
              <span>// Database Mutation</span>
              <span className={step === 3 ? "text-emerald-400 font-bold" : "text-zinc-500"}>
                {step === 3 ? "✅ INSERT Sukses" : "Menunggu"}
              </span>
            </div>
            <div className="text-zinc-400 flex items-center justify-between">
              <span>// Cache Invalidation</span>
              <span className={step === 3 ? "text-cyan-400 font-bold" : "text-zinc-500"}>
                {step === 3 ? "revalidatePath(&apos;/tasks&apos;)" : "Belum"}
              </span>
            </div>
          </div>

          <p className="text-[10px] text-zinc-400 font-sans">
            Kredensial database (<code>SUPABASE_SERVICE_KEY</code>) 100% aman karena dieksekusi di server tanpa menyentuh bundle peramban.
          </p>
        </div>
      </div>
    </div>
  );
}
