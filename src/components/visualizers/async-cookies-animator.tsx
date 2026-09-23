"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cookie, 
  Lock, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  ArrowRight,
  Server,
  FileCode,
  ShieldAlert
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AsyncCookiesAnimator() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const startFlow = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setStep(1);

    setTimeout(() => setStep(2), 1200);
    setTimeout(() => setStep(3), 2400);
    setTimeout(() => setIsSimulating(false), 3200);
  };

  const resetFlow = () => {
    setStep(0);
    setIsSimulating(false);
  };

  const steps = [
    {
      num: 0,
      title: "Kondisi Awal: Request Tiba di Server",
      detail: "Browser mengirim HTTP request dengan header 'Cookie: sb-auth-token=...'.",
      code: `// Menunggu inisialisasi async cookieStore...`,
    },
    {
      num: 1,
      title: "1. Resolusi Asinkron: const cookieStore = await cookies()",
      detail: "⚠️ Breaking Change Next.js 16: cookies() adalah Promise asinkron yang wajib di-await.",
      code: `// src/utils/supabase/server.ts
import { cookies } from 'next/headers';

export async function createClient() {
  // ⚡ Wajib await di Next.js 16!
  const cookieStore = await cookies();
  ...`,
    },
    {
      num: 2,
      title: "2. Handler getAll(): Membaca Token Sesi Pengguna",
      detail: "Supabase SSR memanggil getAll() untuk membaca cookie otentikasi tanpa manipulasi manual.",
      code: `cookies: {
  getAll() {
    // Membaca seluruh cookie yang dikirim peramban
    return cookieStore.getAll();
  },
  ...`,
    },
    {
      num: 3,
      title: "3. Handler setAll(): Refresh Token & Penulisan Cookie Baru",
      detail: "Jika token diperbarui di latar belakang, setAll() menulis cookie baru ke response header.",
      code: `  setAll(cookiesToSet) {
    try {
      cookiesToSet.forEach(({ name, value, options }) =>
        cookieStore.set(name, value, options)
      );
    } catch {
      // Server Component: diabaikan jika header sudah terkunci
    }
  }
}`,
    },
  ];

  const current = steps[step];

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-xs font-semibold">
              Pilar 3.2: Next.js 16 Breaking Change
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">await cookies() &amp; getAll/setAll</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Penanganan Cookie Asinkron: Siklus getAll() &amp; setAll() di Next.js 16
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={startFlow}
            disabled={isSimulating}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 shadow-xs"
          >
            <Play className="w-3.5 h-3.5" />
            {isSimulating ? "Memproses..." : "Simulasikan Handshake Cookie"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={resetFlow}
            className="text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Stepper Pipeline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {steps.slice(1).map((st) => {
          const isCurrent = step === st.num;
          const isDone = step > st.num;

          return (
            <div
              key={st.num}
              className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between space-y-2 ${
                isCurrent
                  ? "bg-white dark:bg-zinc-800 border-blue-500 shadow-md ring-2 ring-blue-500/20"
                  : isDone
                  ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/40"
                  : "bg-zinc-100/50 dark:bg-zinc-800/20 border-zinc-200 dark:border-zinc-800 opacity-60"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    Tahap {st.num}
                  </Badge>
                  {isDone && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      <CheckCircle2 className="w-3 h-3" /> OK
                    </span>
                  )}
                </div>
                <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{st.title}</h5>
                <p className="text-[11px] text-zinc-500 leading-tight">{st.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Code Snippet Inspector */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#1e1e1e] text-zinc-200 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-zinc-800 text-[11px]">
          <span>src/utils/supabase/server.ts (Next.js 16 SSR Implementation)</span>
          <span className="text-blue-400">Step {step} of 3</span>
        </div>
        <pre className="text-blue-300 leading-relaxed overflow-x-auto">
          <code>{current.code}</code>
        </pre>
      </div>

      <div className="text-[11px] p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 leading-relaxed border border-zinc-200 dark:border-zinc-700">
        💡 <strong>Mengapa blok try/catch di setAll() wajib?</strong> Server Component di Next.js berjalan streaming dan tidak dapat memodifikasi response header secara langsung. Error penulisan cookie ditangkap secara halus (silent catch) karena pembaruan sesi permanen akan ditangani oleh Middleware.
      </div>
    </div>
  );
}
