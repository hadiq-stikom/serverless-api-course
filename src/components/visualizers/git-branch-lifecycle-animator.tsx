"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GitBranch, 
  GitMerge, 
  GitCommit, 
  Trash2, 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function GitBranchLifecycleAnimator() {
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);

  const nextStep = () => {
    if (step < 4) setStep((s) => (s + 1) as any);
  };

  const reset = () => {
    setStep(0);
  };

  const stepsInfo = [
    {
      step: 0,
      title: "Kondisi Awal: Branch 'main' Stabil",
      cmd: "# Posisi di branch main yang siap rilis\ngit status",
      desc: "Branch main adalah cabang produksi utama. Dilarang ngoding fitur eksperimen langsung di sini.",
    },
    {
      step: 1,
      title: "Langkah 1: Buat & Berpindah ke Branch Fitur",
      cmd: "git checkout -b feature/sandbox-init",
      desc: "Membuat percabangan terisolasi. Kode main tetap aman jika terjadi error saat eksperimen.",
    },
    {
      step: 2,
      title: "Langkah 2: Kerjakan Misi & Simpan Commit",
      cmd: 'git add . && git commit -m "feat: setup initial sandbox"',
      desc: "Setiap milestone tugas dicatat dalam commit terpisah di dalam branch fitur.",
    },
    {
      step: 3,
      title: "Langkah 3: Gabungkan Kembali ke Branch 'main'",
      cmd: "git checkout main\ngit merge feature/sandbox-init",
      desc: "Setelah seluruh pengujian selesai, gabungkan fitur baru ke dalam lini utama.",
    },
    {
      step: 4,
      title: "Langkah 4: Hapus Branch Fitur yang Sudah Digabung",
      cmd: "git branch -d feature/sandbox-init",
      desc: "Menghapus ranting fitur lokal agar riwayat cabang tetap bersih dan rapi.",
    },
  ];

  const currentInfo = stepsInfo[step];

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-xs font-semibold">
              Pilar 2.3: Branching Strategy
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">The 4-Step Git Cycle</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Siklus 4 Langkah Git: Branching, Commit, Merge & Cleanup
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={nextStep}
            disabled={step === 4}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold gap-1.5 shadow-xs"
          >
            <Play className="w-3.5 h-3.5" />
            {step === 0 ? "Mulai Langkah 1" : step === 4 ? "Siklus Selesai" : `Lanjut: Langkah ${step + 1}`}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={reset}
            className="text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Visual Git Branching Graph */}
      <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 relative overflow-hidden">
        <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 pb-4">
          Diagram Ranting Git Interaktif:
        </div>

        <div className="h-44 flex flex-col justify-center relative px-4">
          {/* Main Track Line */}
          <div className="absolute left-10 right-10 top-14 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />

          {/* Feature Track Line (Appears on step 1-3) */}
          <AnimatePresence>
            {step >= 1 && step <= 3 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0 }}
                className="absolute left-28 right-24 top-28 h-1 bg-indigo-500 rounded-full"
              />
            )}
          </AnimatePresence>

          {/* Main Branch Nodes */}
          <div className="flex items-center justify-between relative z-10">
            {/* Main Label */}
            <div className="w-20">
              <span className="px-2 py-1 rounded-md bg-zinc-800 text-zinc-200 font-mono text-[10px] font-bold">
                main
              </span>
            </div>

            {/* Commit C1 */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-zinc-800 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                C1
              </div>
              <span className="text-[10px] font-mono text-zinc-500 mt-1">init</span>
            </div>

            {/* Commit C2 (Branch point) */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-zinc-800 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                C2
              </div>
              <span className="text-[10px] font-mono text-zinc-500 mt-1">setup</span>
            </div>

            {/* Commit C4 (Merge Commit - appears on step 3 & 4) */}
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  scale: step >= 3 ? 1 : 0.8,
                  opacity: step >= 3 ? 1 : 0.2,
                }}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                  step >= 3 ? "bg-emerald-600 text-white ring-2 ring-emerald-500/30" : "bg-zinc-400 text-white"
                }`}
              >
                C4
              </motion.div>
              <span className="text-[10px] font-mono text-zinc-500 mt-1">
                {step >= 3 ? "merge" : "pending"}
              </span>
            </div>
          </div>

          {/* Feature Branch Nodes */}
          <div className="flex items-center justify-between relative z-10 pt-10">
            <div className="w-24">
              {step >= 1 && step <= 3 && (
                <span className="px-2 py-1 rounded-md bg-indigo-600 text-white font-mono text-[10px] font-bold">
                  feature/...
                </span>
              )}
            </div>

            <div className="w-7" />

            {/* Commit C3 (Feature Commit) */}
            <div className="flex flex-col items-center">
              {step >= 2 ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm ring-2 ring-indigo-500/30"
                >
                  C3
                </motion.div>
              ) : step === 1 ? (
                <div className="w-7 h-7 rounded-full border-2 border-dashed border-indigo-400 flex items-center justify-center text-[10px] text-indigo-500">
                  ...
                </div>
              ) : (
                <div className="w-7 h-7" />
              )}
              {step >= 2 && <span className="text-[10px] font-mono text-indigo-500 mt-1">work</span>}
            </div>

            <div className="w-7" />
          </div>
        </div>
      </div>

      {/* Terminal Command & Explanation Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#1e1e1e] text-zinc-200 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-zinc-800 text-[11px]">
            <span>Terminal CLI Action</span>
            <span className="text-indigo-400">Step {step} of 4</span>
          </div>
          <pre className="text-emerald-400 leading-relaxed overflow-x-auto">
            <code>{currentInfo.cmd}</code>
          </pre>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex flex-col justify-between space-y-2">
          <div>
            <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" />
              {currentInfo.title}
            </h5>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mt-1">
              {currentInfo.desc}
            </p>
          </div>

          <div className="text-[11px] font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800/80 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700">
            {step === 4 
              ? "🎉 Siklus selesai! Repositori Anda kini kembali bersih dan siap untuk tugas minggu berikutnya." 
              : "Gunakan siklus 4 langkah ini untuk seluruh tugas mingguan perkuliahan."}
          </div>
        </div>
      </div>
    </div>
  );
}
