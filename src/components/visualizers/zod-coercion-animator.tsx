"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sliders, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Database 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ZodCoercionAnimator() {
  const [rawEstimateHours, setRawEstimateHours] = useState("8");
  const [rawDeadlineDate, setRawDeadlineDate] = useState("2026-10-01");

  // Coercion simulation
  const numericValue = Number(rawEstimateHours);
  const isNumberValid = !isNaN(numericValue) && numericValue > 0;

  const parsedDate = new Date(rawDeadlineDate);
  const isDateValid = !isNaN(parsedDate.getTime()) && parsedDate > new Date("2026-09-23");

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sliders className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator Zod Type Coercion (z.coerce) &amp; Refinement
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Lihat bagaimana Zod mengonversi string mentah dari FormData HTML menjadi tipe data JavaScript asli.
          </p>
        </div>

        <Badge variant="outline" className="text-xs">
          String ➔ Typed Value
        </Badge>
      </div>

      {/* Input Stage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-zinc-700 dark:text-zinc-300">
            Nilai Mentah FormData (selalu bertipe string!):
          </label>
          <input
            type="text"
            value={rawEstimateHours}
            onChange={(e) => setRawEstimateHours(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs focus:ring-1 focus:ring-indigo-500"
            placeholder="Ketik angka jam..."
          />
          <span className="text-[10px] text-zinc-400 font-mono">
            formData.get(&quot;estimateHours&quot;) ➔ &quot;{rawEstimateHours}&quot; (typeof string)
          </span>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-zinc-700 dark:text-zinc-300">
            Tanggal Deadline:
          </label>
          <input
            type="date"
            value={rawDeadlineDate}
            onChange={(e) => setRawDeadlineDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs focus:ring-1 focus:ring-indigo-500"
          />
          <span className="text-[10px] text-zinc-400 font-mono">
            formData.get(&quot;deadline&quot;) ➔ &quot;{rawDeadlineDate}&quot; (typeof string)
          </span>
        </div>
      </div>

      {/* Conversion Pipeline View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left: Raw String */}
        <div className="lg:col-span-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs space-y-2">
          <div className="text-[11px] text-zinc-400 border-b border-zinc-800 pb-1">
            Input FormData Mentah
          </div>
          <div className="space-y-1 text-amber-300">
            <div>estimateHours: &quot;{rawEstimateHours}&quot; <span className="text-zinc-500">// string</span></div>
            <div>deadline: &quot;{rawDeadlineDate}&quot; <span className="text-zinc-500">// string</span></div>
          </div>
          <p className="text-[10px] text-zinc-500 pt-1 font-sans">
            ⚠️ Browser HTML Form tidak dapat mengirim tipe number atau Date murni; semuanya dikirim sebagai text string.
          </p>
        </div>

        {/* Center: Transform Arrow */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center text-indigo-500 py-1">
          <ArrowRight className="w-5 h-5 rotate-90 lg:rotate-0" />
          <span className="text-[10px] font-mono font-bold mt-1 text-center">z.coerce.*</span>
        </div>

        {/* Right: Coerced Result */}
        <div className="lg:col-span-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs space-y-2">
          <div className="text-[11px] text-zinc-400 border-b border-zinc-800 pb-1 flex items-center justify-between">
            <span>Hasil Output Zod (Tipe Asli)</span>
            <span className={isNumberValid && isDateValid ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
              {isNumberValid && isDateValid ? "Coerced OK" : "Invalid Data"}
            </span>
          </div>

          <div className="space-y-1 text-emerald-300">
            <div>estimateHours: {isNumberValid ? numericValue : "NaN"} <span className="text-zinc-500">// number asli</span></div>
            <div>deadline: {isDateValid ? `Date(${parsedDate.toLocaleDateString()})` : "Invalid Date"} <span className="text-zinc-500">// Date object</span></div>
          </div>

          <p className="text-[10px] text-zinc-400 pt-1 font-sans">
            Dengan <code>z.coerce.number()</code>, data langsung siap disimpan ke kolom integer PostgreSQL Supabase tanpa perlu manual <code>parseInt()</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
