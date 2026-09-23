"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Check, 
  X, 
  Sparkles, 
  AlertTriangle, 
  Sliders, 
  Code2,
  FileCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CretConstraintsAnimator() {
  const [constraints, setConstraints] = useState({
    next16: true,
    serverActions: true,
    noAny: true,
    noClientPage: true,
  });

  const toggle = (key: keyof typeof constraints) => {
    setConstraints((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeCount = Object.values(constraints).filter(Boolean).length;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-xs font-semibold">
              Pilar 4.2: Explicit Constraints
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Anti-Hallucination Guardrails</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Penguncian Batasan Teknis (Explicit Constraints) Menangkal Kode Usang
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={`text-xs font-mono font-bold ${
            activeCount === 4 
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              : activeCount >= 2
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
              : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30"
          }`}>
            {activeCount} dari 4 Batasan Aktif
          </Badge>
        </div>
      </div>

      {/* Constraints Switcher Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Rule 1 */}
        <button
          type="button"
          onClick={() => toggle("next16")}
          className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between space-y-2 cursor-pointer ${
            constraints.next16
              ? "bg-white dark:bg-zinc-800 border-purple-500 shadow-sm ring-1 ring-purple-500/30"
              : "bg-zinc-100/60 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-700/60 opacity-60"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-zinc-500">Batasan 1</span>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
              constraints.next16 ? "bg-purple-600 text-white" : "bg-zinc-300 dark:bg-zinc-700 text-zinc-500"
            }`}>
              {constraints.next16 ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            </div>
          </div>
          <div>
            <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Next.js 16 & React 19</h5>
            <p className="text-[11px] text-zinc-500">Async params & useActionState</p>
          </div>
        </button>

        {/* Rule 2 */}
        <button
          type="button"
          onClick={() => toggle("serverActions")}
          className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between space-y-2 cursor-pointer ${
            constraints.serverActions
              ? "bg-white dark:bg-zinc-800 border-purple-500 shadow-sm ring-1 ring-purple-500/30"
              : "bg-zinc-100/60 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-700/60 opacity-60"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-zinc-500">Batasan 2</span>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
              constraints.serverActions ? "bg-purple-600 text-white" : "bg-zinc-300 dark:bg-zinc-700 text-zinc-500"
            }`}>
              {constraints.serverActions ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            </div>
          </div>
          <div>
            <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Server Actions</h5>
            <p className="text-[11px] text-zinc-500">Dilarang membuat /api/* manual</p>
          </div>
        </button>

        {/* Rule 3 */}
        <button
          type="button"
          onClick={() => toggle("noAny")}
          className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between space-y-2 cursor-pointer ${
            constraints.noAny
              ? "bg-white dark:bg-zinc-800 border-purple-500 shadow-sm ring-1 ring-purple-500/30"
              : "bg-zinc-100/60 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-700/60 opacity-60"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-zinc-500">Batasan 3</span>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
              constraints.noAny ? "bg-purple-600 text-white" : "bg-zinc-300 dark:bg-zinc-700 text-zinc-500"
            }`}>
              {constraints.noAny ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            </div>
          </div>
          <div>
            <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Strict TypeScript</h5>
            <p className="text-[11px] text-zinc-500">Dilarang menggunakan tipe &apos;any&apos;</p>
          </div>
        </button>

        {/* Rule 4 */}
        <button
          type="button"
          onClick={() => toggle("noClientPage")}
          className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between space-y-2 cursor-pointer ${
            constraints.noClientPage
              ? "bg-white dark:bg-zinc-800 border-purple-500 shadow-sm ring-1 ring-purple-500/30"
              : "bg-zinc-100/60 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-700/60 opacity-60"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-zinc-500">Batasan 4</span>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
              constraints.noClientPage ? "bg-purple-600 text-white" : "bg-zinc-300 dark:bg-zinc-700 text-zinc-500"
            }`}>
              {constraints.noClientPage ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            </div>
          </div>
          <div>
            <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">RSC di page.tsx</h5>
            <p className="text-[11px] text-zinc-500">Dilarang &apos;use client&apos; di page utama</p>
          </div>
        </button>
      </div>

      {/* Code Inspector Based on Constraints */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#1e1e1e] text-zinc-200 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-zinc-800 text-[11px]">
          <span>Inspeksi Hasil Kode Berdasarkan Batasan:</span>
          <span className={activeCount === 4 ? "text-emerald-400" : "text-amber-400"}>
            {activeCount === 4 ? "✅ Siap Produksi (Enterprise-Ready)" : "⚠️ Rentan Error Deprecated"}
          </span>
        </div>

        <pre className="text-xs leading-relaxed overflow-x-auto text-zinc-300 p-1">
          <code>
            {constraints.noClientPage ? "// src/app/tasks/[id]/page.tsx (Server Component)" : "// ❌ Anti-pattern: 'use client' di root page\n\"use client\";"}
            {"\n"}
            {constraints.next16 
              ? `export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {\n  // ✅ Next.js 16: params wajib di-await!\n  const { id } = await params;\n  return <TaskDetail taskId={id} />;\n}`
              : `export default function TaskPage({ params }: any) {\n  // ❌ Rusak di Next.js 16: params dianggap objek biasa sinkron!\n  const id = params.id;\n  return <div>{id}</div>;\n}`}
          </code>
        </pre>

        <div className={`p-2.5 rounded-lg text-[11px] font-sans ${
          activeCount === 4 
            ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
            : "bg-amber-950/60 text-amber-200 border border-amber-500/30"
        }`}>
          {activeCount === 4 ? (
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Semua batasan aktif! Menghilangkan 100% risiko halusinasi kode React 18 dan Next.js Pages Router.</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Beberapa batasan nonaktif. Model AI berpotensi menggunakan tipe &apos;any&apos; atau melewatkan breaking changes Next.js 16.</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
