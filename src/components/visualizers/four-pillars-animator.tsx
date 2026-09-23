"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  Database, 
  Image as ImageIcon, 
  Rocket, 
  Laptop, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  RotateCcw,
  Sparkles,
  Layers
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function FourPillarsAnimator() {
  const [activeStep, setActiveStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const startPipeline = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveStep(1);

    setTimeout(() => setActiveStep(2), 1000);
    setTimeout(() => setActiveStep(3), 2200);
    setTimeout(() => setActiveStep(4), 3400);
    setTimeout(() => setIsSimulating(false), 4400);
  };

  const resetPipeline = () => {
    setActiveStep(0);
    setIsSimulating(false);
  };

  const pillars = [
    {
      id: 1,
      title: "1. Next.js 16 (App Router)",
      badge: "Core Framework",
      role: "Frontend UI + Server Actions",
      icon: Globe,
      color: "blue",
      desc: "Menyediakan rendering komponen server (RSC 0 kB JS) dan penanganan form mutasi data langsung via 'use server'.",
      action: "Memvalidasi input pengguna & memproses form submission di server",
    },
    {
      id: 2,
      title: "2. Vercel Cloud Network",
      badge: "Edge & Serverless Infra",
      role: "CI/CD & Global Deployment",
      icon: Rocket,
      color: "zinc",
      desc: "Mendeploy otomatis saat push ke GitHub dan menjalankan Serverless Function di edge node terdekat.",
      action: "Mengalokasikan runtime ephemeral dalam 15ms untuk eksekusi server actions",
    },
    {
      id: 3,
      title: "3. Supabase Cloud BaaS",
      badge: "Managed PostgreSQL",
      role: "Database, Auth & RLS",
      icon: Database,
      color: "emerald",
      desc: "Menyimpan data relasional PostgreSQL dengan proteksi Row Level Security dan enkripsi kata sandi.",
      action: "Menyimpan record data proyek dan memverifikasi token pengguna",
    },
    {
      id: 4,
      title: "4. Cloudinary AI Media",
      badge: "Asset Optimization",
      role: "Image & Video CDN",
      icon: ImageIcon,
      color: "sky",
      desc: "Mengompresi otomatis ke WebP/AVIF modern dan mentransformasi ukuran gambar on-the-fly via URL CDN.",
      action: "Mengompresi gambar dari 5 MB menjadi 80 kB dalam sekejap",
    },
  ];

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-xs font-semibold">
              Pilar 1.3: Arsitektur Ekosistem
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">The 4 Core Pillars</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Alur Transaksi Data Melintasi 4 Pilar Komputasi
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={startPipeline}
            disabled={isSimulating}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 shadow-xs"
          >
            <Play className="w-3.5 h-3.5" />
            {isSimulating ? "Menjalankan Alur..." : "Simulasikan Alur Data"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={resetPipeline}
            className="text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Stepper Pipeline Visualization */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
        {pillars.map((p) => {
          const Icon = p.icon;
          const isCurrent = activeStep === p.id;
          const isDone = activeStep > p.id;

          return (
            <motion.div
              key={p.id}
              animate={{
                scale: isCurrent ? 1.03 : 1,
                y: isCurrent ? -4 : 0,
              }}
              transition={{ duration: 0.2 }}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between space-y-3 relative overflow-hidden ${
                isCurrent
                  ? "bg-white dark:bg-zinc-800 border-blue-500 dark:border-blue-400 shadow-md ring-2 ring-blue-500/20"
                  : isDone
                  ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/40"
                  : "bg-zinc-100/60 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/70"
              }`}
            >
              {/* Active Indicator Top Bar */}
              {isCurrent && (
                <motion.div 
                  layoutId="activePillarBar"
                  className="absolute top-0 left-0 right-0 h-1 bg-blue-500" 
                />
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${
                    isCurrent
                      ? "bg-blue-600 text-white"
                      : isDone
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isDone ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Selesai
                    </span>
                  ) : (
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {p.badge}
                    </Badge>
                  )}
                </div>

                <div>
                  <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{p.title}</h5>
                  <p className="text-[11px] text-zinc-500 font-medium">{p.role}</p>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1">
                  {p.desc}
                </p>
              </div>

              {/* Status Action Banner */}
              <div className={`p-2 rounded-lg text-[11px] font-mono ${
                isCurrent 
                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-500/30"
                  : isDone
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                  : "bg-zinc-200/50 dark:bg-zinc-700/40 text-zinc-500"
              }`}>
                {isCurrent && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping inline-block" />
                    {p.action}
                  </span>
                )}
                {isDone && "Transaksi Terverifikasi"}
                {!isCurrent && !isDone && "Menunggu Transmisi..."}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Real-world Analogy & Output Footer */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Kekuatan Kolaborasi Serverless:</span>
          </div>
          <p className="text-zinc-500 text-[11px]">
            Anda tidak perlu menyewa devops engineer. Keempat pilar saling melengkapi untuk menghasilkan aplikasi web kelas dunia dengan biaya operasional mendekati nol di fase awal.
          </p>
        </div>

        <div className="shrink-0 font-mono text-[11px] px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
          Status: {activeStep === 4 ? "✅ Pipeline 100% Sukses" : activeStep > 0 ? `Langkah ${activeStep} dari 4` : "Standby"}
        </div>
      </div>
    </div>
  );
}
