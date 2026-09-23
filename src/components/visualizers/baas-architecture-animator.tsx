"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, 
  Key, 
  Radio, 
  HardDrive, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Code,
  Sparkles,
  Server
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type BaasService = "db" | "auth" | "realtime" | "storage";

export function BaasArchitectureAnimator() {
  const [activeService, setActiveService] = useState<BaasService>("db");
  const [serviceActionState, setServiceActionState] = useState<string | null>(null);

  const testService = (service: BaasService) => {
    setActiveService(service);
    setServiceActionState("processing");

    setTimeout(() => {
      setServiceActionState("success");
    }, 700);

    setTimeout(() => {
      setServiceActionState(null);
    }, 2800);
  };

  const services = [
    {
      id: "db" as BaasService,
      title: "Cloud PostgreSQL & RLS",
      icon: Database,
      badge: "Relational Engine",
      color: "emerald",
      desc: "Database PostgreSQL 15 terkelola penuh dengan isolasi keamanan data per-pengguna (Row Level Security).",
      snippet: `const { data, error } = await supabase\n  .from("tasks")\n  .select("*")\n  .eq("user_id", user.id);`,
      result: "✅ Query berhasil! 3 Baris data terenkripsi berhasil ditarik dengan policy auth.uid() = user_id.",
    },
    {
      id: "auth" as BaasService,
      title: "Supabase Auth (JWT & OAuth)",
      icon: Key,
      badge: "Identity Provider",
      color: "blue",
      desc: "Manajemen sesi user, login dengan GitHub/Google, password hashing bcrypt, dan penerbitan JSON Web Token (JWT).",
      snippet: `const { data, error } = await supabase.auth\n  .signInWithOAuth({ provider: "github" });`,
      result: "✅ Handshake OAuth selesai! Access Token JWT aktif: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    },
    {
      id: "realtime" as BaasService,
      title: "Realtime WebSocket Engine",
      icon: Radio,
      badge: "Event Broadcasting",
      color: "purple",
      desc: "Mendengarkan mutasi data tabel PostgreSQL secara real-time via WebSocket tanpa perlu membuat server Socket.io terpisah.",
      snippet: `supabase.channel("tasks-feed")\n  .on("postgres_changes", { event: "INSERT", schema: "public" },\n    payload => console.log(payload)\n  ).subscribe();`,
      result: "✅ WebSocket tersambung (wss://)! Menerima siaran INSERT baru dari pengguna lain dalam 8ms.",
    },
    {
      id: "storage" as BaasService,
      title: "Storage CDN & Asset Buckets",
      icon: HardDrive,
      badge: "Global File Storage",
      color: "amber",
      desc: "Penyimpanan file terdistribusi untuk avatar pengguna dan dokumen dengan proteksi akses bucket kustom.",
      snippet: `const { data, error } = await supabase.storage\n  .from("documents")\n  .upload(\`public/\${file.name}\`, file);`,
      result: "✅ File terunggah ke Cloud Bucket! CDN URL instan: https://project.supabase.co/storage/v1/...",
    },
  ];

  const current = services.find((s) => s.id === activeService)!;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
              Pilar 1.2: Managed Backend
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">BaaS Supabase Ecosystem</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Ekosistem BaaS: 4 Layanan Backend Siap Pakai
          </h4>
        </div>
        <div className="text-xs text-zinc-500 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Zero Server Sysadmin</span>
        </div>
      </div>

      {/* 4 Interactive Service Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {services.map((srv) => {
          const Icon = srv.icon;
          const isSelected = activeService === srv.id;
          return (
            <button
              key={srv.id}
              type="button"
              onClick={() => setActiveService(srv.id)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between space-y-2 cursor-pointer ${
                isSelected
                  ? "bg-white dark:bg-zinc-800 border-emerald-500/60 dark:border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                  : "bg-zinc-100/70 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/80 hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${
                  isSelected ? "bg-emerald-500 text-white" : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-700/80 text-zinc-600 dark:text-zinc-300 font-semibold">
                  {srv.badge}
                </span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{srv.title}</h5>
              </div>
            </button>
          );
        })}
      </div>

      {/* Service Detail & Interactive Test Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Code Snippet & Dispatch */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-emerald-500" />
              Sintaks SDK Konsumsi Klien:
            </span>
            <Button
              size="sm"
              onClick={() => testService(activeService)}
              disabled={serviceActionState === "processing"}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-7 px-3 gap-1 shadow-xs"
            >
              <Sparkles className="w-3 h-3" />
              Uji Request SDK
            </Button>
          </div>

          <pre className="p-3 rounded-lg bg-[#1e1e1e] text-zinc-200 text-xs font-mono overflow-x-auto leading-relaxed border border-zinc-800">
            <code>{current.snippet}</code>
          </pre>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {current.desc}
          </p>
        </div>

        {/* Right: Cloud Response Inspector */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <span>Cloud Micro-Service Feedback:</span>
              <span className="font-mono text-zinc-400 text-[11px]">Region: sin1 (Singapore)</span>
            </div>

            <div className="h-32 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 p-3 flex items-center justify-center text-center">
              {serviceActionState === "processing" ? (
                <div className="space-y-2">
                  <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <span className="text-xs font-mono text-zinc-500">
                    Menghubungi endpoint Supabase Cloud...
                  </span>
                </div>
              ) : serviceActionState === "success" ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-1.5 text-left"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Layanan Beroperasi Normal (HTTP 200 OK)</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 font-mono bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded border border-emerald-500/20">
                    {current.result}
                  </p>
                </motion.div>
              ) : (
                <div className="text-xs text-zinc-400 space-y-1">
                  <div>Siap menerima instruksi dari aplikasi klien.</div>
                  <div className="text-[11px] text-zinc-500">Klik tombol <strong>&quot;Uji Request SDK&quot;</strong> di sisi kiri.</div>
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
            🛡️ <strong>BaaS Advantage:</strong> Anda tidak perlu mengurus instalasi PostgreSQL, patch keamanan OS, SSL certificate, maupun scaling connection poolers (PgBouncer).
          </div>
        </div>
      </div>
    </div>
  );
}
