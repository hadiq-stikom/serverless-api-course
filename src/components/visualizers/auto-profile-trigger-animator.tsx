"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  Play, 
  UserPlus, 
  FileCode, 
  Sparkles,
  Layers,
  Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AutoProfileTriggerAnimator() {
  const [currentStage, setCurrentStage] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const startSimulation = () => {
    setIsSimulating(true);
    setCurrentStage(1);

    setTimeout(() => setCurrentStage(2), 700);
    setTimeout(() => setCurrentStage(3), 1500);
    setTimeout(() => {
      setCurrentStage(4);
      setIsSimulating(false);
    }, 2300);
  };

  const resetSimulation = () => {
    setCurrentStage(0);
    setIsSimulating(false);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-semibold">
              Pilar 4.2: Otomasi Event-Driven
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">handle_new_user() Trigger</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Trigger PostgreSQL: Otomasi Pembuatan Profil Pengguna
          </h4>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            size="sm"
            onClick={startSimulation}
            disabled={isSimulating}
            className="text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Play className="w-3.5 h-3.5 mr-1" />
            Jalankan Simulasi Pendaftaran
          </Button>
          {currentStage > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetSimulation}
              disabled={isSimulating}
              className="text-xs font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
        Mengapa kita tidak membuat profil di Server Action aplikasi? Karena jika user mendaftar via OAuth GitHub atau konfirmasi email di tab lain, kode aplikasi bisa terlewati. Dengan <strong>PostgreSQL Database Trigger</strong>, baris profil terjamin 100% terbuat langsung di level kernel basis data.
      </p>

      {/* Stepper Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
        <div className={`p-3 rounded-xl border transition-all ${
          currentStage >= 1
            ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500"
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono">LANGKAH 1</span>
            {currentStage >= 1 && <Check className="w-3.5 h-3.5 text-blue-500" />}
          </div>
          <div className="text-xs">User Baru Sign Up</div>
          <p className="text-[10px] font-normal text-zinc-500 mt-0.5">Email / GitHub OAuth</p>
        </div>

        <div className={`p-3 rounded-xl border transition-all ${
          currentStage >= 2
            ? "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500"
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono">LANGKAH 2</span>
            {currentStage >= 2 && <Check className="w-3.5 h-3.5 text-purple-500" />}
          </div>
          <div className="text-xs">INSERT ke auth.users</div>
          <p className="text-[10px] font-normal text-zinc-500 mt-0.5">Entitas inti tersimpan</p>
        </div>

        <div className={`p-3 rounded-xl border transition-all ${
          currentStage >= 3
            ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500"
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono">LANGKAH 3</span>
            {currentStage >= 3 && <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />}
          </div>
          <div className="text-xs">Trigger Function Fired</div>
          <p className="text-[10px] font-normal text-zinc-500 mt-0.5">handle_new_user()</p>
        </div>

        <div className={`p-3 rounded-xl border transition-all ${
          currentStage >= 4
            ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500"
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono">LANGKAH 4</span>
            {currentStage >= 4 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
          </div>
          <div className="text-xs">Profil Otomatis Terbuat!</div>
          <p className="text-[10px] font-normal text-zinc-500 mt-0.5">public.profiles sync</p>
        </div>
      </div>

      {/* SQL Trigger Definition Code */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-amber-500" />
            <span>Fungsi &amp; Trigger PostgreSQL Resmi (Supabase Migration):</span>
          </div>
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px]">
            SECURITY DEFINER
          </Badge>
        </div>

        <pre className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
{`-- 1. Buat fungsi otomasi penyalinan metadata ke public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Explorer'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Pasang Trigger AFTER INSERT pada tabel auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`}
        </pre>

        {currentStage === 4 && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Simulasi Selesai: Baris baru di public.profiles terbuat seketika dengan id UUID yang identik!</span>
          </div>
        )}
      </div>
    </div>
  );
}
