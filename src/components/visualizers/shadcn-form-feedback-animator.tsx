"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Send, 
  RotateCcw 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ShadcnFormFeedbackAnimator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessBanner(null);

    setTimeout(() => {
      const newErrors: Record<string, string[]> = {};
      if (title.trim().length < 3) {
        newErrors.title = ["Judul tugas minimal harus 3 karakter."];
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      } else {
        setErrors({});
        setSuccessBanner(`Tugas "${title}" berhasil disimpan via Server Action!`);
        setTitle("");
        setDescription("");
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator Integrasi Form Shadcn UI &amp; Error Feedback
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Uji interaksi komponen Input, Label, validasi error inline, dan status loading Shadcn secara langsung.
          </p>
        </div>

        <Badge variant="outline" className="text-xs">
          Production Ready UI
        </Badge>
      </div>

      {/* Simulator Form Sandbox */}
      <div className="max-w-xl mx-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-5 shadow-sm space-y-4">
        {/* Success Banner */}
        <AnimatePresence>
          {successBanner && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3 rounded-lg border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-medium">{successBanner}</span>
              </div>
              <button
                type="button"
                onClick={() => setSuccessBanner(null)}
                className="text-[10px] underline font-bold"
              >
                Tutup
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title Field with Validation */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-zinc-800 dark:text-zinc-200">
                Judul Tugas <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-zinc-400">Minimal 3 karakter</span>
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({});
              }}
              disabled={isSubmitting}
              placeholder="Contoh: Implementasi Row Level Security"
              className={`w-full px-3 py-2 rounded-lg border text-xs transition-all ${
                errors.title
                  ? "border-rose-500 bg-rose-50/30 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 focus:ring-1 focus:ring-rose-500"
                  : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-indigo-500"
              }`}
            />

            {errors.title && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.title[0]}</span>
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-800 dark:text-zinc-200">
              Keterangan Tambahan (Opsional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              placeholder="Catatan pengerjaan atau referensi issue GitHub..."
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 text-xs focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-between">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 px-4 gap-1.5 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Memvalidasi Server Action...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Simpan Tugas (Server Action)</span>
                </>
              )}
            </Button>

            <span className="text-[10px] text-zinc-400">
              Coba submit dengan judul kosong untuk melihat error!
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
