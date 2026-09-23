"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Loader2, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  FileCode 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function UseFormStatusAnimator() {
  const [isParentPending, setIsParentPending] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<string | null>(null);

  const simulateSubmit = () => {
    setIsParentPending(true);

    setTimeout(() => {
      setIsParentPending(false);
      setLastSubmitTime(new Date().toLocaleTimeString());
    }, 1500);
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Send className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator useFormStatus (Tombol Daun Sadar Status Form)
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Lihat bagaimana komponen anak &lt;SubmitButton&gt; mengetahui status submit form induk tanpa prop drilling.
          </p>
        </div>

        <Badge variant="outline" className="text-xs">
          Zero Prop Drilling
        </Badge>
      </div>

      {/* Simulator Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Code Architecture */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
            <span>src/components/submit-button.tsx</span>
            <Badge className="bg-indigo-500/20 text-indigo-300">&apos;use client&apos; Leaf</Badge>
          </div>

          <pre className="text-[11px] leading-relaxed">
{`"use client";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function SubmitButton() {
  // ⚡ Otomatis mendeteksi status <form> induk:
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Menyimpan..." : "Kirim Data"}
    </Button>
  );
}`}
          </pre>

          <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400">
            ⚠️ <strong>Aturan Wajib:</strong> <code>useFormStatus()</code> HARUS dipanggil di dalam komponen anak (*child component*) yang dirender di dalam tag <code>&lt;form&gt;</code>, bukan di file yang sama dengan tag form itu sendiri.
          </div>
        </div>

        {/* Right: Interactive Sandbox */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span>Uji Coba Form Induk &amp; Tombol Anak</span>
            <span className="text-[10px] text-zinc-400 font-mono">Live Demo</span>
          </div>

          {/* Simulated Outer Form */}
          <div className="p-4 rounded-xl border-2 border-dashed border-indigo-300 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <span>&lt;form action=&quot;...&quot;&gt; (Komponen Induk)</span>
              <span className="text-[10px] font-mono">
                Status: {isParentPending ? "PENDING..." : "IDLE"}
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                disabled={isParentPending}
                defaultValue="Judul Tugas Minggu 3"
                className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono disabled:opacity-60"
              />

              {/* The Leaf Submit Button */}
              <div className="flex items-center justify-between pt-1">
                <Button
                  onClick={simulateSubmit}
                  disabled={isParentPending}
                  className={`text-xs font-bold transition-all shadow-sm ${
                    isParentPending
                      ? "bg-zinc-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                  }`}
                >
                  {isParentPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      <span>pending: true (Menyimpan...)</span>
                    </>
                  ) : (
                    <span>&lt;SubmitButton /&gt; (Kirim)</span>
                  )}
                </Button>

                {lastSubmitTime && !isParentPending && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Sukses @ {lastSubmitTime}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <span>Tidak perlu mengoper prop <code>isLoading=&#123;loading&#125;</code> secara manual!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
