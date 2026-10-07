"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Sparkles,
  FlaskConical,
  KeyRound,
  User,
  Award,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PracticumModule, THEME_COLORS } from "@/data/practicum";
import { loginStudentAction } from "@/actions/student-auth";

interface PracticumLoginGateProps {
  practicum: PracticumModule;
  isLecturer?: boolean;
  lecturerName?: string;
}

export function PracticumLoginGate({
  practicum,
  isLecturer = false,
  lecturerName,
}: PracticumLoginGateProps) {
  const router = useRouter();
  const theme = THEME_COLORS[practicum.theme.color];

  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (targetNim?: string, targetPass?: string) => {
    const finalNim = (targetNim ?? nim).trim();
    const finalPass = (targetPass ?? password).trim();

    if (!finalNim || !finalPass) {
      setErrorMessage("Harap masukkan NIM dan Kata Sandi.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await loginStudentAction(finalNim, finalPass);
      if (res.success) {
        // Refresh page so server component reads student_session cookie
        router.refresh();
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage("Terjadi kendala jaringan saat proses login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantDemoLogin = async () => {
    setNim("202401001");
    setPassword("202401001");
    await handleLogin("202401001", "202401001");
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 py-6">
      {/* Back navigation */}
      <div className="flex items-center justify-between">
        <Link href="/practicum">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Semua Praktikum</span>
          </Button>
        </Link>
        <Badge variant="outline" className={`${theme.badge} text-xs font-mono`}>
          Praktikum P-0{practicum.id}
        </Badge>
      </div>

      {/* Login Card */}
      <Card className="border border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="p-6 md:p-8 border-b border-zinc-100 dark:border-zinc-800/60 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <FlaskConical className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Identitas Mahasiswa Diperlukan
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Untuk membuka lembar pengamatan <strong>{practicum.title}</strong>, mengisi analisis AI, dan menandatangani laporan, silakan masuk dengan akun mahasiswa Anda.
            </CardDescription>
          </div>

          {/* Banner jika terdeteksi login dosen */}
          {isLecturer && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
              <Award className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-semibold">Halo, Dosen Pengampu ({lecturerName ?? "Dosen"})!</span>
                <p className="mt-0.5 text-[11px] leading-relaxed">
                  Anda sedang dalam sesi Dosen. Untuk menguji coba lembar praktikum mahasiswa, Anda dapat masuk instan menggunakan akun uji coba di bawah ini.
                </p>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                <span>Nomor Induk Mahasiswa (NIM)</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: 202401001"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
                <span>Kata Sandi (Default = NIM)</span>
              </label>
              <input
                type="password"
                required
                placeholder="Masukkan kata sandi..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Identitas...</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-4 h-4" />
                  <span>Masuk & Buka Lembar Praktikum</span>
                </>
              )}
            </Button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-2">
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-zinc-200 dark:border-zinc-800 w-full" />
              <span className="bg-white dark:bg-zinc-900 px-3 text-[11px] text-zinc-400 uppercase tracking-wider shrink-0">
                Atau Mode Uji Coba Cepat
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleInstantDemoLogin}
              disabled={isLoading}
              className="w-full h-10 border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold rounded-xl text-xs gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Masuk Instan: Budi Santoso (NIM: 202401001)</span>
            </Button>
          </div>
        </CardContent>

        <CardFooter className="px-6 md:px-8 py-4 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
          <span>Sistem Praktikum Serverless API</span>
          <span>Bimbingan & Koreksi AI Aktif</span>
        </CardFooter>
      </Card>
    </div>
  );
}
