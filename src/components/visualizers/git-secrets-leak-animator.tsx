"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  ShieldAlert, 
  GitCommit, 
  RotateCcw, 
  Play, 
  AlertOctagon, 
  CheckCircle2, 
  RefreshCw,
  Search,
  Key
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function GitSecretsLeakAnimator() {
  const [timelineStep, setTimelineStep] = useState<0 | 1 | 2 | 3>(0);

  const nextStep = () => {
    if (timelineStep < 3) setTimelineStep((s) => (s + 1) as any);
  };

  const reset = () => {
    setTimelineStep(0);
  };

  const steps = [
    {
      step: 0,
      title: "1. Kelemahan Fatal: Secret Ter-push ke GitHub Publik",
      badge: "Detik 0.0",
      desc: "Mahasiswa tidak sengaja menjalankan git add .env.local dan mendorongnya ke repositori GitHub publik.",
      actionIcon: GitCommit,
      status: "Kunci API Supabase Service Role terekspos di internet.",
    },
    {
      step: 1,
      title: "2. Bot Scraper Otomatis Mendeteksi Secret dalam 2 Detik",
      badge: "Detik 1.8",
      desc: "Bot peretas global memantau GitHub Events API publik secara realtime 24/7 dan mengekstrak kunci API sebelum mahasiswa menyadarinya.",
      actionIcon: Bot,
      status: "Bot mulai mengirim request manipulasi ke endpoint database Supabase Anda!",
    },
    {
      step: 2,
      title: "3. Salah Kaprah: Menghapus File di Commit Berikutnya",
      badge: "Mitos Solusi",
      desc: "Mahasiswa menghapus .env.local lalu membuat commit baru 'fix: hapus secret'. Namun Git menyimpan riwayat permanen: kunci MASIH ADA di commit sebelumnya!",
      actionIcon: AlertOctagon,
      status: "Siapapun dapat membuka commit lama di GitHub dan tetap membaca kuncinya.",
    },
    {
      step: 3,
      title: "4. Prosedur Pemulihan yang Benar di Industri",
      badge: "SOP Standar",
      desc: "1) Segera lakukan 'Revoke / Roll API Key' di Dashboard Supabase (agar kunci lama mati). 2) Bersihkan riwayat Git via git-filter-repo atau buat repo baru.",
      actionIcon: CheckCircle2,
      status: "Kunci lama dimatikan seketika, database kembali aman dari penyusupan.",
    },
  ];

  const current = steps[timelineStep];

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 text-xs font-semibold">
              Pilar 3.2: Ancaman Bot Scraper
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Git History Permanence</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Kebocoran Secrets & Mengapa Commit Baru Tidak Menyelesaikan Masalah
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={nextStep}
            disabled={timelineStep === 3}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold gap-1.5 shadow-xs"
          >
            <Play className="w-3.5 h-3.5" />
            {timelineStep === 0 ? "Mulai Simulasi Kebocoran" : timelineStep === 3 ? "Simulasi Tuntas" : "Langkah Berikutnya"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={reset}
            className="text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Interactive Timeline Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((st) => {
          const Icon = st.actionIcon;
          const isCurrent = timelineStep === st.step;
          const isDone = timelineStep > st.step;

          return (
            <div
              key={st.step}
              className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between space-y-2.5 ${
                isCurrent
                  ? "bg-white dark:bg-zinc-800 border-red-500 shadow-md ring-2 ring-red-500/20"
                  : isDone
                  ? "bg-zinc-50 dark:bg-zinc-900/40 border-zinc-300 dark:border-zinc-700"
                  : "bg-zinc-100/50 dark:bg-zinc-800/20 border-zinc-200 dark:border-zinc-800/80 opacity-60"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-lg ${
                    isCurrent
                      ? "bg-red-600 text-white"
                      : isDone
                      ? "bg-zinc-700 text-white"
                      : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {st.badge}
                  </Badge>
                </div>
                <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{st.title}</h5>
              </div>

              <div className="text-[10px] font-mono p-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {isCurrent && "Sedang Berlangsung"}
                {isDone && "Terjadi"}
                {!isCurrent && !isDone && "Menunggu"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Git History Blob Viewer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Commit Tree in GitHub */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
            <span>Riwayat Commit GitHub Publik:</span>
            <span className="font-mono text-zinc-400">Branch: main</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {timelineStep >= 2 && (
              <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                <span>commit e4f12b (&quot;fix: hapus secret&quot;)</span>
                <span className="text-[10px] text-zinc-500">HEAD</span>
              </div>
            )}

            <div className={`p-2.5 rounded-lg border transition-all ${
              timelineStep >= 0 
                ? "bg-red-50 dark:bg-red-950/40 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300"
                : "bg-zinc-50 dark:bg-zinc-800"
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span>commit a89c10 (&quot;init: tambah file&quot;)</span>
                <span className="text-[10px] text-red-500">MEMUAT SECRET!</span>
              </div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 pt-1">
                ➔ File .env.local masih tersimpan utuh di snapshot commit ini!
              </div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Menghapus file di commit berikutnya hanya mencatat event <em>deletion</em>, tetapi riwayat di commit sebelumnya tidak pernah terhapus dari server Git.
          </p>
        </div>

        {/* Right: Security Incident Status */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-200 space-y-3 font-mono text-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-zinc-800 text-[11px]">
              <span>Status Telemetri Keamanan</span>
              <span className={timelineStep === 3 ? "text-emerald-400" : "text-red-400"}>
                {timelineStep === 3 ? "● RECOVERED" : "● THREAT ACTIVE"}
              </span>
            </div>

            <div className="text-xs text-zinc-300 leading-relaxed font-sans pt-1">
              <strong>{current.title}</strong>
              <p className="text-zinc-400 text-xs mt-1">{current.desc}</p>
            </div>

            <div className={`p-2 rounded font-mono text-[11px] ${
              timelineStep === 3 
                ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                : "bg-red-950 text-red-300 border border-red-500/40"
            }`}>
              {current.status}
            </div>
          </div>

          <div className="text-[11px] font-sans text-zinc-400 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
            🛡️ <strong>Aturan Baku:</strong> Jika secret sempat ter-push ke GitHub publik, anggap kunci tersebut <strong>SUDAH DIKETAHUI PERETAS</strong>. Segera ganti (rotate) secret key di dashboard penyedia layanan!
          </div>
        </div>
      </div>
    </div>
  );
}
