"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Server, 
  Smartphone, 
  Globe, 
  ArrowRight, 
  Zap, 
  Database, 
  FileCode, 
  ShieldCheck, 
  Laptop,
  Layers,
  Cpu
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DualArchAnimator() {
  const [activeClient, setActiveClient] = useState<"web" | "mobile">("web");
  const [isProcessing, setIsProcessing] = useState(false);
  const [executionStep, setExecutionStep] = useState<number>(0);

  const runSimulation = () => {
    setIsProcessing(true);
    setExecutionStep(1);
    setTimeout(() => setExecutionStep(2), 700);
    setTimeout(() => setExecutionStep(3), 1400);
    setTimeout(() => {
      setExecutionStep(4);
      setIsProcessing(false);
    }, 2100);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-xs font-semibold">
              Pilar 1.1: Paradigma Komputasi
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">BFF vs Decoupled REST</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Arsitektur Ganda: Server Actions (Web) vs Route Handlers (Mobile)
          </h4>
        </div>

        {/* Client Switcher */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => { setActiveClient("web"); setExecutionStep(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeClient === "web"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Laptop className="w-3.5 h-3.5" /> Web (Server Actions)
          </button>
          <button
            type="button"
            onClick={() => { setActiveClient("mobile"); setExecutionStep(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeClient === "mobile"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile (REST API)
          </button>
        </div>
      </div>

      {/* Architecture Topology Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {/* Step 1: Client Node */}
        <motion.div 
          animate={{ scale: executionStep === 1 ? 1.02 : 1 }}
          className={`p-4 rounded-xl border-2 transition-all ${
            activeClient === "web" 
              ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/60" 
              : "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60"
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
            <span className="text-xs font-bold flex items-center gap-1.5">
              {activeClient === "web" ? <Globe className="w-4 h-4 text-indigo-500" /> : <Smartphone className="w-4 h-4 text-emerald-500" />}
              {activeClient === "web" ? "Next.js Web Client" : "Flutter / React Native"}
            </span>
            <Badge variant="outline" className="text-[10px]">
              {activeClient === "web" ? "Browser Cookies" : "Bearer Token"}
            </Badge>
          </div>
          <div className="pt-3 space-y-2 text-xs">
            <p className="text-zinc-600 dark:text-zinc-400">
              {activeClient === "web" 
                ? "Memanggil action langsung via Form submit / hook React 19."
                : "Melakukan standard HTTP fetch ke endpoint JSON REST."}
            </p>
            <div className="p-2 rounded bg-zinc-900 text-zinc-200 font-mono text-[11px] overflow-x-auto">
              {activeClient === "web" 
                ? "createTaskAction(formData)"
                : "POST /api/v1/tasks"}
            </div>
          </div>
        </motion.div>

        {/* Step 2: Next.js Serverless Gateway */}
        <motion.div 
          animate={{ scale: executionStep === 2 ? 1.02 : 1 }}
          className="p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-xs"
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
            <span className="text-xs font-bold flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
              <Server className="w-4 h-4 text-amber-500" />
              Next.js 16 Serverless Layer
            </span>
            <Badge variant="outline" className="text-[10px]">Edge / Node.js</Badge>
          </div>
          <div className="pt-3 space-y-2 text-xs">
            <p className="text-zinc-600 dark:text-zinc-400">
              {activeClient === "web"
                ? "RPC Dispatcher: Mengekstrak cookies & menjalankan useActionState."
                : "Route Handler: Validasi Bearer Token JWT & parse JSON payload."}
            </p>
            <div className="p-2 rounded bg-zinc-900 text-zinc-200 font-mono text-[11px] overflow-x-auto">
              {activeClient === "web"
                ? "src/actions/tasks.ts ('use server')"
                : "src/app/api/v1/tasks/route.ts"}
            </div>
          </div>
        </motion.div>

        {/* Step 3: Shared Core & Supabase */}
        <motion.div 
          animate={{ scale: executionStep === 3 ? 1.02 : 1 }}
          className="p-4 rounded-xl border-2 border-cyan-200 dark:border-cyan-900/60 bg-cyan-50/30 dark:bg-cyan-950/20"
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
            <span className="text-xs font-bold flex items-center gap-1.5 text-cyan-800 dark:text-cyan-300">
              <Database className="w-4 h-4 text-cyan-500" />
              Shared Schema &amp; PostgreSQL
            </span>
            <Badge variant="outline" className="text-[10px] text-cyan-600 dark:text-cyan-400 border-cyan-500/30">
              RLS Protected
            </Badge>
          </div>
          <div className="pt-3 space-y-2 text-xs">
            <p className="text-zinc-600 dark:text-zinc-400">
              Skema Zod yang sama memvalidasi data sebelum dikirim ke PostgreSQL Supabase.
            </p>
            <div className="p-2 rounded bg-zinc-900 text-cyan-300 font-mono text-[11px] overflow-x-auto">
              taskSchema.safeParse(...)
            </div>
          </div>
        </motion.div>
      </div>

      {/* Simulator Controller & Status */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Status Eksekusi Alur:
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {executionStep === 0 && "Klik tombol 'Kirim Request' untuk melihat transmisi payload"}
            {executionStep === 1 && (activeClient === "web" ? "🚀 Web: Mengirim form data via Next.js internal Action RPC..." : "📱 Mobile: Mengirim HTTP POST request dengan Bearer Token...")}
            {executionStep === 2 && (activeClient === "web" ? "⚙️ Server: Mengeksekusi 'use server' & verifikasi cookie sesi..." : "⚙️ Server: Route Handler mengecek Authorization Header & memvalidasi Zod...")}
            {executionStep === 3 && "💾 Database: Supabase mengeksekusi INSERT query dengan kepatuhan RLS..."}
            {executionStep === 4 && (activeClient === "web" ? "✅ Selesai: Mengembalikan state & revalidatePath() ke UI Web" : "✅ Selesai: Mengembalikan 201 Created dengan format JSON standar ke Mobile")}
          </p>
        </div>

        <Button
          onClick={runSimulation}
          disabled={isProcessing}
          className={`${
            activeClient === "web" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-emerald-600 hover:bg-emerald-700"
          } text-white font-bold text-xs shrink-0`}
        >
          {isProcessing ? "Memproses Alur..." : "Kirim Request ➔"}
        </Button>
      </div>

      {/* Comparison Detail Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-1.5">
          <div className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
            <Laptop className="w-4 h-4" /> Kapan Memilih Server Actions?
          </div>
          <ul className="text-zinc-600 dark:text-zinc-400 space-y-1 list-disc list-inside">
            <li>Interaksi internal Web Next.js (Dashboard pengguna, Form setting).</li>
            <li>Membutuhkan zero-bundle JavaScript di klien via Progressive Enhancement.</li>
            <li>Integrasi langsung dengan <code className="font-mono text-indigo-600">revalidatePath()</code> dan Optimistic UI.</li>
          </ul>
        </div>

        <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-1.5">
          <div className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4" /> Kapan Memilih REST Route Handlers?
          </div>
          <ul className="text-zinc-600 dark:text-zinc-400 space-y-1 list-disc list-inside">
            <li>Konsumsi multi-platform: <strong>Aplikasi Mobile (Flutter, Kotlin, Swift)</strong>.</li>
            <li>Penerimaan Webhook dari payment gateway (Midtrans, Stripe, Xendit).</li>
            <li>Membuka Public API / Microservice dengan format JSON baku RFC 7807.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
