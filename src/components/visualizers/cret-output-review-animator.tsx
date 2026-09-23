"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  CheckSquare, 
  Square, 
  FileCode, 
  ShieldCheck, 
  AlertCircle, 
  Award, 
  CheckCircle2, 
  FolderTree,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CretOutputReviewAnimator() {
  const [checklist, setChecklist] = useState({
    modular: true,
    noSecrets: true,
    semanticTokens: true,
    typeSafe: false,
  });

  const toggle = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const isAllApproved = completedCount === 4;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-xs font-semibold">
              Pilar 4.3: Target Output & Code Review
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">T — Output Structure</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Target Output Modular & Checklist Review Mandiri Kode AI
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={`text-xs font-mono font-bold ${
            isAllApproved 
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
          }`}>
            {completedCount} dari 4 Kriteria Terverifikasi
          </Badge>
        </div>
      </div>

      {/* Target Output Modular File Structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Expected Modular Files */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
            <span className="flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-purple-500" />
              Target Output Terstruktur (3 Berkas Terpisah):
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
              <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <FileCode className="w-3.5 h-3.5" />
                src/app/tasks/page.tsx
              </span>
              <Badge variant="outline" className="text-[10px]">Server Component</Badge>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
              <span className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <FileCode className="w-3.5 h-3.5" />
                src/components/task-filter.tsx
              </span>
              <Badge variant="outline" className="text-[10px]">&apos;use client&apos; Leaf</Badge>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
              <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <FileCode className="w-3.5 h-3.5" />
                src/actions/tasks.ts
              </span>
              <Badge variant="outline" className="text-[10px]">&apos;use server&apos; Action</Badge>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Menghindari berkas monolitik 500 baris yang mencampurkan data fetching, interaksi UI, dan mutasi database ke dalam satu tempat.
          </p>
        </div>

        {/* Right: Interactive Code Review Checklist */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <span>Checklist Review Mandiri Sebelum Commit:</span>
              <span className="font-mono text-zinc-500 text-[11px]">Human in the loop</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => toggle("modular")}
                className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2.5 text-xs text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                {checklist.modular ? (
                  <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-400 shrink-0" />
                )}
                <span>1. Kode modular (komponen terpisah, bukan monolitik)</span>
              </button>

              <button
                type="button"
                onClick={() => toggle("noSecrets")}
                className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2.5 text-xs text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                {checklist.noSecrets ? (
                  <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-400 shrink-0" />
                )}
                <span>2. Tidak ada kunci API rahasia yang di-hardcode</span>
              </button>

              <button
                type="button"
                onClick={() => toggle("semanticTokens")}
                className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2.5 text-xs text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                {checklist.semanticTokens ? (
                  <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-400 shrink-0" />
                )}
                <span>3. Menggunakan semantic tokens Shadcn (bg-card, border-border)</span>
              </button>

              <button
                type="button"
                onClick={() => toggle("typeSafe")}
                className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2.5 text-xs text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                {checklist.typeSafe ? (
                  <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-400 shrink-0" />
                )}
                <span>4. Type-safe (bebas dari tipe &apos;any&apos; dan lulus tsc)</span>
              </button>
            </div>
          </div>

          {/* Approval Banner */}
          <div className={`p-2.5 rounded-lg text-xs ${
            isAllApproved
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700"
          }`}>
            {isAllApproved ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Kode AI Lolos Review! Siap digabungkan ke branch fitur.</span>
              </span>
            ) : (
              <span>Lengkapi seluruh centang checklist sebelum melakukan git commit.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
