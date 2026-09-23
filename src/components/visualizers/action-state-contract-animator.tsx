"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Code, 
  Layers 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Scenario = "success" | "validation_error" | "server_error";

export function ActionStateContractAnimator() {
  const [scenario, setScenario] = useState<Scenario>("success");

  const contracts = {
    success: {
      success: true,
      message: "Tugas berhasil dibuat dan disimpan!",
      data: { id: "task_9812", title: "Setup RLS Supabase", createdAt: "2026-09-23T22:00:00Z" }
    },
    validation_error: {
      success: false,
      message: "Data input tidak memenuhi validasi skema Zod.",
      errors: {
        title: ["Judul minimal harus berisi 3 karakter."],
        priority: ["Pilihan prioritas tidak valid."]
      }
    },
    server_error: {
      success: false,
      message: "Koneksi ke database Supabase gagal. Silakan coba lagi nanti."
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <FileCheck className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator Standar Kontrak Tipe ActionState&lt;T&gt;
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Pelajari struktur kontrak respons standar industri yang konsisten untuk seluruh Server Actions aplikasi.
          </p>
        </div>

        {/* Scenario Switcher */}
        <div className="flex flex-wrap items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setScenario("success")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              scenario === "success" ? "bg-emerald-600 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            ✅ Sukses (200)
          </button>
          <button
            type="button"
            onClick={() => setScenario("validation_error")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              scenario === "validation_error" ? "bg-amber-600 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            ⚠️ Validasi Gagal (422)
          </button>
          <button
            type="button"
            onClick={() => setScenario("server_error")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              scenario === "server_error" ? "bg-rose-600 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            ❌ Server Error (500)
          </button>
        </div>
      </div>

      {/* Grid Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: TypeScript Generic Contract Interface */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
            <span>src/types/actions.ts</span>
            <Badge className="bg-indigo-500/20 text-indigo-300">Generic Type Interface</Badge>
          </div>

          <pre className="text-[11px] leading-relaxed">
{`// 🌟 Kontrak Bersama Skala Produksi:
export type ActionState<T = unknown> = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: T;
};`}
          </pre>

          <p className="text-[10px] text-zinc-400 font-sans">
            Dengan mendefinisikan tipe generik <code>ActionState&lt;T&gt;</code>, Client Component dapat dengan mudah memverifikasi <code>if (state.success)</code> dengan type-safety tanpa rasa cemas terhadap tipe <code>any</code>.
          </p>
        </div>

        {/* Right: Runtime Return JSON Representation */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
            <span>Runtime Payload: {scenario.toUpperCase()}</span>
            <span className={`text-[10px] font-bold ${
              scenario === "success" ? "text-emerald-400" : scenario === "validation_error" ? "text-amber-400" : "text-rose-400"
            }`}>
              ActionState&lt;Task&gt;
            </span>
          </div>

          <pre className={`text-[11px] leading-relaxed p-3 rounded-lg border ${
            scenario === "success" ? "bg-emerald-950/20 border-emerald-900/60 text-emerald-300" :
            scenario === "validation_error" ? "bg-amber-950/20 border-amber-900/60 text-amber-300" : "bg-rose-950/20 border-rose-900/60 text-rose-300"
          }`}>
            {JSON.stringify(contracts[scenario], null, 2)}
          </pre>

          <div className="text-[11px] text-zinc-400 font-sans">
            Konsistensi properti <code>success</code> dan <code>message</code> menjamin UI selalu memiliki pesan feedback yang dapat disajikan kepada pengguna.
          </div>
        </div>
      </div>
    </div>
  );
}
