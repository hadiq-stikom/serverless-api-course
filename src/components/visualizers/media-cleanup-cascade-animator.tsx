"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Database, Cloud, AlertTriangle, CheckCircle2, Play, RotateCcw, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function MediaCleanupCascadeAnimator() {
  const [approach, setApproach] = useState<"two_phase_cleanup" | "naive_delete">("two_phase_cleanup");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([
    "Sistem Siap: Klik 'Simulasikan Hapus Tugas' untuk melihat siklus hidup pembersihan aset.",
  ]);

  const handleSimulate = () => {
    setIsDeleting(true);
    setCurrentStep(1);

    if (approach === "two_phase_cleanup") {
      setLogs(["[1] Pengguna menekan Hapus Tugas di UI ➔ Server Action deleteTaskAction(taskId) dipanggil"]);

      setTimeout(() => {
        setCurrentStep(2);
        setLogs((prev) => [
          "[2] Server Action mengambil image_public_id ('tasks/card_attachment_99') dari Supabase",
          "[3] Serverless Backend memanggil: await cloudinary.uploader.destroy('tasks/card_attachment_99')",
          ...prev,
        ]);

        setTimeout(() => {
          setCurrentStep(3);
          setLogs((prev) => [
            "[4] Cloudinary API: { result: 'ok' } ➔ File biner dihapus dari cloud storage & Edge CDN cache di-purge",
            "[5] Supabase: DELETE FROM public.tasks WHERE id = taskId (Row dihapus bersih)",
            "[6] ✅ Sukses! Nol file zombie (orphan assets), tagihan storage Cloudinary tetap hemat.",
            ...prev,
          ]);
          setCurrentStep(4);
          setIsDeleting(false);
        }, 700);
      }, 600);
    } else {
      // Naive Delete
      setLogs(["[1] Pengguna menekan Hapus Tugas di UI ➔ DELETE FROM public.tasks WHERE id = taskId"]);

      setTimeout(() => {
        setCurrentStep(2);
        setLogs((prev) => [
          "[2] Supabase: Baris data tugas berhasil dihapus seketika dari database",
          "[3] ⚠️ TAPI TUNGGU: image_public_id di Cloudinary TIDAK pernah dipanggil!",
          "[4] 🧟 ZOMBIE ASSET CREATED: File 4.2 MB tetap tertinggal di Cloudinary selamanya!",
          "[5] 💸 Tagihan storage bulanan membengkak karena ribuan file sampah tanpa referensi database.",
          ...prev,
        ]);
        setCurrentStep(4);
        setIsDeleting(false);
      }, 700);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsDeleting(false);
    setLogs(["Sistem di-reset: Baris tugas 'Audit Desain' kembali aktif."]);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">🧹</span>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
              Siklus Hidup Aset: Pencegahan File Zombie (*Orphan Assets*) saat Hapus Data
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Menghapus baris data di PostgreSQL wajib diiringi pembersihan aset fisik di Cloudinary CDN.
          </p>
        </div>

        {/* Approach Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl self-start sm:self-center border border-zinc-200/60 dark:border-zinc-700/60 text-xs">
          <button
            type="button"
            onClick={() => { setApproach("two_phase_cleanup"); handleReset(); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              approach === "two_phase_cleanup"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Two-Phase Cleanup (Best Practice)
          </button>
          <button
            type="button"
            onClick={() => { setApproach("naive_delete"); handleReset(); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              approach === "naive_delete"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Hapus Baris Saja (File Zombie)
          </button>
        </div>
      </div>

      {/* Kontrol Aksi Simulasi */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/60 dark:border-zinc-800 text-xs">
        <span className="text-zinc-600 dark:text-zinc-300 font-medium">
          Target Aset: <code>tasks/card_attachment_99.png</code> (Ukuran: 4.2 MB)
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            disabled={isDeleting}
            className="text-xs h-8"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleSimulate}
            disabled={isDeleting}
            className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold gap-1.5 h-8 shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Simulasikan Hapus Tugas
          </Button>
        </div>
      </div>

      {/* Diagram Alur Penghapusan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Node 1: Cloudinary API Storage */}
        <div className={`p-4 rounded-xl border space-y-2 transition-all ${
          currentStep === 2 && approach === "two_phase_cleanup"
            ? "border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20"
            : currentStep === 4 && approach === "naive_delete"
            ? "border-rose-500 bg-rose-50/40 dark:bg-rose-950/30"
            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-cyan-500" />
              1. Cloudinary Asset Engine
            </span>
            <Badge variant={currentStep === 4 && approach === "naive_delete" ? "destructive" : "outline"} className="text-[10px]">
              {approach === "two_phase_cleanup" ? "cloudinary.uploader.destroy()" : "Diabaikan"}
            </Badge>
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {approach === "two_phase_cleanup"
              ? "Aset dihapus permanen dari bucket penyimpanan dan Edge CDN cache di-purge seketika."
              : "Aset tidak pernah dihapus! Menjadi file zombie yang terus menyedot kuota storage bulanan."}
          </p>
        </div>

        {/* Node 2: Supabase Database Row */}
        <div className={`p-4 rounded-xl border space-y-2 transition-all ${
          currentStep === 3
            ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-500" />
              2. PostgreSQL Database Row
            </span>
            <Badge variant="outline" className="text-[10px]">Supabase</Badge>
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Baris data tugas dihapus melalui <code>DELETE FROM tasks WHERE id = taskId</code> setelah aset fisik di cloud aman terhapus.
          </p>
        </div>
      </div>

      {/* Terminal Log Console */}
      <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 text-zinc-100 p-3 space-y-1 font-mono text-[11px]">
        <div className="flex items-center justify-between text-[10px] text-zinc-500 pb-1 border-b border-zinc-800 mb-1">
          <span>🧹 Execution Log: Server Action Cleanup</span>
          <span>Node.js Runtime</span>
        </div>
        <div className="space-y-1 max-h-28 overflow-y-auto">
          {logs.map((log, idx) => (
            <div key={idx} className="leading-relaxed text-zinc-300">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

