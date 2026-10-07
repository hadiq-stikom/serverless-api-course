"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Code, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  FileCode, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SharedZodSchemaAnimator() {
  const [title, setTitle] = useState("Selesaikan Laporan Proyek");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("high");
  const [activeConsumer, setActiveConsumer] = useState<"both" | "web" | "api">("both");

  // Mock validation logic
  const isTitleValid = title.trim().length >= 3 && title.trim().length <= 100;
  const isPriorityValid = ["low", "medium", "high"].includes(priority);
  const isValid = isTitleValid && isPriorityValid;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-xs font-semibold">
              Pilar 1.2: DRY Validation
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Shared Zod Contract</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Skema Validasi Terbagi (Shared Schema) Web &amp; REST API
          </h4>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => { setTitle("OK"); setPriority("high"); }}
            className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400"
          >
            Uji Coba Input Invalid
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => { setTitle("Integrasi Endpoint REST API"); setPriority("high"); }}
            className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          >
            Uji Coba Input Valid
          </Button>
        </div>
      </div>

      {/* Interactive Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
            Judul Tugas (Min 3 karakter, Max 100):
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
          />
          {!isTitleValid && (
            <p className="text-[11px] text-rose-500 flex items-center gap-1 font-semibold">
              <XCircle className="w-3.5 h-3.5" /> Judul minimal 3 karakter (Saat ini: {title.length})
            </p>
          )}
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
            Prioritas Tugas:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["low", "medium", "high"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`py-2 text-xs rounded-lg font-bold capitalize transition-all border ${
                  priority === p 
                    ? "bg-cyan-600 text-white border-cyan-600 shadow-xs" 
                    : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Central Single Source of Truth Zod Definition */}
      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-2 border-b border-zinc-800">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <FileCode className="w-3.5 h-3.5" /> src/lib/schemas.ts (Single Source of Truth)
          </span>
          <Badge variant="outline" className="text-[10px] text-zinc-400">Reusable Contract</Badge>
        </div>
        <pre className="text-cyan-300 leading-relaxed overflow-x-auto text-[11px]">
{`export const taskSchema = z.object({
  title: z.string().min(3, "Minimal 3 karakter").max(100),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});`}
        </pre>
      </div>

      {/* Dual Consumption Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Web Action Consumer */}
        <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
          <div className="flex items-center justify-between pb-1">
            <span className="font-bold text-indigo-700 dark:text-indigo-300 text-xs">
              1. Konsumen Web: Server Action
            </span>
            <Badge className={isValid ? "bg-emerald-500/20 text-emerald-600" : "bg-rose-500/20 text-rose-600"}>
              {isValid ? "200 Success" : "Validation Error"}
            </Badge>
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
            Mengembalikan format <code className="font-mono text-indigo-600">ActionState</code> untuk hook React 19 (<code className="font-mono">useActionState</code>).
          </p>
          <div className="p-2.5 rounded-lg bg-zinc-900 text-zinc-300 font-mono text-[10px] overflow-x-auto">
            {isValid ? (
              <span className="text-emerald-400">{`{ success: true, message: "Tugas berhasil dibuat!" }`}</span>
            ) : (
              <span className="text-rose-400">{`{ success: false, errors: { title: ["Minimal 3 karakter"] } }`}</span>
            )}
          </div>
        </div>

        {/* REST API Consumer */}
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
          <div className="flex items-center justify-between pb-1">
            <span className="font-bold text-emerald-700 dark:text-emerald-300 text-xs">
              2. Konsumen Mobile: REST Route Handler
            </span>
            <Badge className={isValid ? "bg-emerald-500/20 text-emerald-600" : "bg-rose-500/20 text-rose-600"}>
              {isValid ? "HTTP 201 Created" : "HTTP 422 Unprocessable"}
            </Badge>
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
            Mengembalikan standar RFC 7807 JSON Response untuk aplikasi Flutter/React Native.
          </p>
          <div className="p-2.5 rounded-lg bg-zinc-900 text-zinc-300 font-mono text-[10px] overflow-x-auto">
            {isValid ? (
              <span className="text-emerald-400">{`{ "status": "success", "data": { "id": "...", "title": "${title}" } }`}</span>
            ) : (
              <span className="text-rose-400">{`{ "status": "error", "code": "VALIDATION_ERROR", "details": [...] }`}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
