"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Server, 
  Globe, 
  ShieldCheck, 
  Cpu, 
  Database, 
  ArrowRight, 
  Layers, 
  Lock, 
  FileCode,
  PackageCheck,
  CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ServerSessionReaderAnimator() {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  const steps = [
    {
      step: 1,
      title: "Inisiasi Klien Server di RSC",
      code: "const supabase = await createClient()",
      desc: "Komponen Server Component di server Next.js 16 memanggil helper createClient() yang membaca cookie sesi secara asinkron (await cookies()).",
      location: "Next.js Node/Edge Server"
    },
    {
      step: 2,
      title: "Verifikasi User ke Supabase",
      code: "const { data: { user } } = await supabase.auth.getUser()",
      desc: "Serverless function memverifikasi token ke engine Supabase Auth. Tidak ada rahasia atau database password yang dikirim ke browser.",
      location: "Supabase Cloud GoTrue"
    },
    {
      step: 3,
      title: "Query Data Terisolasi via auth.uid()",
      code: "await supabase.from('projects').select('*').eq('user_id', user.id)",
      desc: "Data spesifik pengguna diambil langsung di server. Keamanan Row Level Security (RLS) menjamin hanya baris milik user.id tersebut yang dibaca.",
      location: "PostgreSQL Database Engine"
    },
    {
      step: 4,
      title: "Streaming HTML Murni ke Browser",
      code: "return <Dashboard user={user} projects={projects} />",
      desc: "Server merender HTML statis dan mengirimkannya ke browser. 0 kB token JWT, 0 kB Supabase SDK, dan 0 kB query logic terkirim ke JavaScript bundle client!",
      location: "Browser Pengguna"
    }
  ];

  const current = steps[activeStep - 1];

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-xs font-semibold">
              Pilar 3.1: Zero Client Leak
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">React Server Component (RSC)</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Pembacaan Sesi di Server Component: Zero Bundle &amp; Secrets Isolation
          </h4>
        </div>

        {/* Stepper Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setActiveStep((prev) => (prev > 1 ? (prev - 1) as any : 4))}
            className="text-xs h-8"
          >
            Prev
          </Button>
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg">
            {activeStep} / 4
          </span>
          <Button
            type="button"
            size="sm"
            onClick={() => setActiveStep((prev) => (prev < 4 ? (prev + 1) as any : 1))}
            className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
        Berbeda dengan aplikasi React Single Page Application (SPA) lama yang menyimpan token JWT di <code className="font-mono text-xs">localStorage</code> dan mengeksekusi query Supabase di browser, Server Component Next.js 16 membaca sesi sepenuhnya di sisi server.
      </p>

      {/* Interactive 4-step Diagram */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        {steps.map((s) => (
          <button
            key={s.step}
            type="button"
            onClick={() => setActiveStep(s.step as any)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              activeStep === s.step
                ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20 font-bold"
                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:border-zinc-300"
            }`}
          >
            <div className="text-[10px] text-zinc-400 mb-1">Tahap {s.step}</div>
            <div className="text-xs text-zinc-900 dark:text-zinc-100">{s.title}</div>
            <div className="text-[10px] text-blue-500 mt-1 truncate">{s.location}</div>
          </button>
        ))}
      </div>

      {/* Step Detail Focus */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold">
              {current.step}
            </span>
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{current.title}</span>
          </div>
          <span className="text-xs font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
            Lokasi: {current.location}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-blue-300 overflow-x-auto">
          {current.code}
        </div>

        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          {current.desc}
        </p>

        {activeStep === 4 && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium">
            <PackageCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Hasil Bundle Client: 0 kB Kode Supabase SDK! Performa Lighthouse 100 dan bebas kebocoran kredensial.</span>
          </div>
        )}
      </div>
    </div>
  );
}
