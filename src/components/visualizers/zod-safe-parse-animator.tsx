"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  FileCode, 
  Sparkles, 
  Terminal 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ZodSafeParseAnimator() {
  const [title, setTitle] = useState("Buat Skema Database");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "invalid">("high");

  // Client simulated Zod logic
  const isTitleValid = title.trim().length >= 3;
  const isPriorityValid = priority === "low" || priority === "medium" || priority === "high";
  const isSuccess = isTitleValid && isPriorityValid;

  const mockErrors: Record<string, string[]> = {};
  if (!isTitleValid) {
    mockErrors.title = ["String must contain at least 3 character(s)"];
  }
  if (!isPriorityValid) {
    mockErrors.priority = ["Invalid enum value. Expected 'low' | 'medium' | 'high'"];
  }

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator Zod safeParse() &amp; Pertahanan Input
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Uji bagaimana fungsi safeParse() menangani validasi skema tanpa menyebabkan crash server.
          </p>
        </div>

        <Badge className={isSuccess ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}>
          {isSuccess ? "Validation Passed" : "Validation Failed"}
        </Badge>
      </div>

      {/* Interactive Input Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-zinc-700 dark:text-zinc-300">
            Field: <code>title (z.string().min(3))</code>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-xs focus:ring-1 focus:ring-indigo-500"
            placeholder="Ketik judul tugas..."
          />
          <div className="flex gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setTitle("Ab")}
              className="text-[10px] text-zinc-500 hover:text-indigo-600 underline font-mono"
            >
              [Uji Input Pendek (&lt;3 char)]
            </button>
            <button
              type="button"
              onClick={() => setTitle("Integrasi Next.js 16")}
              className="text-[10px] text-zinc-500 hover:text-indigo-600 underline font-mono"
            >
              [Uji Input Valid]
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-zinc-700 dark:text-zinc-300">
            Field: <code>priority (z.enum([&quot;low&quot;, &quot;medium&quot;, &quot;high&quot;]))</code>
          </label>
          <div className="flex items-center gap-1.5 pt-1">
            {(["low", "medium", "high", "invalid"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-2.5 py-1 rounded-md font-mono text-xs capitalize transition-all ${
                  priority === p
                    ? p === "invalid" ? "bg-rose-600 text-white font-bold" : "bg-indigo-600 text-white font-bold"
                    : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Zod safeParse Output Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Code implementation */}
        <div className="lg:col-span-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
            <span>Implementasi Server Action</span>
            <Badge variant="outline" className="text-[9px]">zod.safeParse()</Badge>
          </div>

          <pre className="text-[11px] leading-relaxed">
{`const result = TaskSchema.safeParse({
  title: formData.get("title"),
  priority: formData.get("priority"),
});

if (!result.success) {
  // Tidak melempar error runtime!
  return { 
    success: false, 
    errors: result.error.flatten().fieldErrors 
  };
}

// Data otomatis 100% type-safe:
const validData = result.data;`}
          </pre>
        </div>

        {/* Right: Runtime Return Result Object */}
        <div className="lg:col-span-7 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
            <span>Nilai Runtime result (Safe Discriminator)</span>
            <span className={isSuccess ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
              {isSuccess ? "✅ result.success === true" : "❌ result.success === false"}
            </span>
          </div>

          <pre className={`text-[11px] leading-relaxed p-3 rounded-lg border ${
            isSuccess ? "bg-emerald-950/20 border-emerald-900/60 text-emerald-300" : "bg-rose-950/20 border-rose-900/60 text-rose-300"
          }`}>
            {isSuccess ? (
`{
  success: true,
  data: {
    title: "${title}",
    priority: "${priority}"
  }
}`
            ) : (
`{
  success: false,
  error: {
    fieldErrors: ${JSON.stringify(mockErrors, null, 2)}
  }
}`
            )}
          </pre>

          <p className="text-[11px] text-zinc-400 font-sans">
            Dengan <code>safeParse()</code>, aplikasi Anda aman dari crash runtime tak terduga (*Zero Runtime Crashes*) saat pengguna nakal mengirim payload anomali melalui Postman atau Curl.
          </p>
        </div>
      </div>
    </div>
  );
}
