"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Code 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ZodErrorFormatterAnimator() {
  const [activeTab, setActiveTab] = useState<"flatten" | "raw">("flatten");

  const rawZodIssues = [
    {
      code: "too_small",
      minimum: 3,
      type: "string",
      inclusive: true,
      exact: false,
      message: "Judul minimal 3 karakter",
      path: ["title"]
    },
    {
      code: "invalid_enum_value",
      options: ["low", "medium", "high"],
      defaultValue: "urgent",
      message: "Prioritas tidak valid",
      path: ["priority"]
    }
  ];

  const flattenedFieldErrors = {
    title: ["Judul minimal 3 karakter"],
    priority: ["Prioritas tidak valid"]
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator Pemformatan ZodError (error.flatten().fieldErrors)
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Pelajari cara meratakan struktur error Zod agar mudah ditampilkan di bawah masing-masing input form Shadcn.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700/60">
          <button
            type="button"
            onClick={() => setActiveTab("flatten")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "flatten" ? "bg-indigo-600 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            ✅ error.flatten() (Format UI)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("raw")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "raw" ? "bg-indigo-600 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            Raw ZodError Object
          </button>
        </div>
      </div>

      {/* Visual Pipeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Code Transformation */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
            <span>Server Action: Ekstraksi Error</span>
            <Badge className="bg-indigo-500/20 text-indigo-300">Format Ramah UI</Badge>
          </div>

          <pre className="text-[11px] leading-relaxed">
{`const validation = TaskSchema.safeParse(data);

if (!validation.success) {
  // 💡 error.flatten() mengubah array rumit 
  // menjadi dictionary namaField -> string[]:
  const { fieldErrors } = validation.error.flatten();

  return {
    success: false,
    errors: fieldErrors,
  };
}`}
          </pre>

          <p className="text-[10px] text-zinc-400 font-sans">
            Dengan format dictionary, komponen form di browser cukup memanggil <code>state.errors?.title?.[0]</code> untuk menampilkan pesan error di bawah input yang salah.
          </p>
        </div>

        {/* Right: Output Payload Representation */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
            <span>{activeTab === "flatten" ? "fieldErrors (Siap Pakai di UI)" : "Raw ZodError issues[]"}</span>
            <span className="text-[10px] text-indigo-400">JSON Output</span>
          </div>

          <pre className="text-[11px] leading-relaxed p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-amber-300">
            {activeTab === "flatten"
              ? JSON.stringify(flattenedFieldErrors, null, 2)
              : JSON.stringify(rawZodIssues, null, 2)}
          </pre>

          <div className="p-2.5 rounded-lg bg-zinc-800/40 border border-zinc-700/60 text-[11px] text-zinc-300 font-sans flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Format dictionary mempermudah integrasi dengan komponen <code>&lt;Input /&gt;</code> Shadcn UI.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
