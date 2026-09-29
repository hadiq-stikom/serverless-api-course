"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Lock,
  User,
  KeyRound,
  X,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginStudentAction } from "@/actions/student-auth";

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LoginDialog({
  isOpen,
  onClose,
  onSuccess,
}: LoginDialogProps) {
  const router = useRouter();
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!nim.trim() || !password.trim()) {
      setErrorMessage("Harap masukkan NIM dan Kata Sandi.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginStudentAction(nim, password);
      if (res.success) {
        onClose();
        if (onSuccess) onSuccess();
        router.push("/dashboard");
        router.refresh();
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kendala jaringan";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            {/* Ambient Top Glow */}
            <div className="h-2.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Header Title */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center shadow-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Masuk Portal Mahasiswa
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Akses modul, kuis pemahaman, dan riwayat perbaikan nilai.
                </p>
              </div>

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Banner */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                {/* NIM Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                    <span>Nomor Induk Mahasiswa (NIM)</span>
                    <span className="text-[10px] text-zinc-400 font-normal">Wajib</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={nim}
                      onChange={(e) => setNim(e.target.value)}
                      placeholder="Masukkan NIM (contoh: 1124102161)"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-mono"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                    <span>Kata Sandi</span>
                    <span className="text-[10px] text-zinc-400 font-normal">
                      Default: NIM Anda
                    </span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi..."
                      className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Helpful Note */}
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed flex items-start gap-2">
                  <KeyRound className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>
                    Jika belum pernah diubah, kata sandi awal adalah{" "}
                    <strong className="text-zinc-800 dark:text-zinc-200">
                      NIM masing-masing
                    </strong>
                    . Anda dapat menggantinya di profil setelah masuk.
                  </span>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 font-semibold text-xs rounded-xl shadow-md gap-2 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Memverifikasi...
                    </>
                  ) : (
                    <>
                      <span>Masuk ke Dashboard Mahasiswa</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
