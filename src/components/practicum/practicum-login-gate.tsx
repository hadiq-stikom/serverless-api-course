"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Sparkles,
  FlaskConical,
  KeyRound,
  User,
  Award,
  ShieldCheck,
  ArrowRight,
  Laptop,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PracticumModule, getPracticumTheme } from "@/data/practicum";
import { loginStudentAction, loginAsLecturerGuideAction } from "@/actions/student-auth";
import { loginLecturerAction } from "@/actions/lecturer-auth";

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
  const theme = getPracticumTheme(practicum?.theme?.color);

  // Tab mode: jika sudah login dosen, default ke "lecturer", sebaliknya "student"
  const [activeTab, setActiveTab] = useState<"student" | "lecturer">(
    isLecturer ? "lecturer" : "student"
  );

  // Student form state
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [showStudentPassword, setShowStudentPassword] = useState(false);

  // Lecturer form state
  const [nidn, setNidn] = useState("0012345678");
  const [lecturerPassword, setLecturerPassword] = useState("0012345678");
  const [showLecturerPassword, setShowLecturerPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handler: Login Mahasiswa biasa
  const handleStudentLogin = async (targetNim?: string, targetPass?: string) => {
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
        router.refresh();
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage("Terjadi kendala jaringan saat proses login mahasiswa.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Demo Login Mahasiswa
  const handleInstantDemoLogin = async () => {
    setNim("202401001");
    setPassword("202401001");
    await handleStudentLogin("202401001", "202401001");
  };

  // Handler: Masuk Mode Panduan Dosen (Bagi yang sudah memiliki sesi Dosen)
  const handleLecturerGuideLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await loginAsLecturerGuideAction();
      if (res.success) {
        router.refresh();
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage("Gagal mengaktifkan mode panduan dosen.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Login Dosen dari Form (Jika belum punya sesi dosen)
  const handleLecturerFormLogin = async (targetNidn?: string, targetPass?: string) => {
    const finalNidn = (targetNidn ?? nidn).trim();
    const finalPass = (targetPass ?? lecturerPassword).trim();

    if (!finalNidn || !finalPass) {
      setErrorMessage("Harap masukkan NIDN dan Kata Sandi Dosen.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // 1. Login sesi Dosen
      const lecRes = await loginLecturerAction(finalNidn, finalPass);
      if (!lecRes.success) {
        setErrorMessage(lecRes.message);
        setIsLoading(false);
        return;
      }

      // 2. Otomatis aktifkan mode instruktur praktikum
      const guideRes = await loginAsLecturerGuideAction();
      if (guideRes.success) {
        router.refresh();
      } else {
        setErrorMessage(guideRes.message);
      }
    } catch {
      setErrorMessage("Terjadi kendala jaringan saat login sesi dosen.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 py-6">
      {/* Back navigation & Badges */}
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
        <Badge variant="outline" className={`${theme?.badge ?? "border-teal-500/25 text-teal-800 dark:text-teal-300"} text-xs font-mono`}>
          Praktikum P-0{practicum?.id ?? 1}
        </Badge>
      </div>

      {/* Login Card */}
      <Card className="border border-slate-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-zinc-900/80 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden">
        {/* Role Tab Selector Header */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100/80 dark:bg-zinc-950/60 border-b border-slate-200/80 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={() => {
              setActiveTab("student");
              setErrorMessage("");
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "student"
                ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs border border-slate-200/60 dark:border-zinc-800/60"
                : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Akun Mahasiswa</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("lecturer");
              setErrorMessage("");
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "lecturer"
                ? "bg-white dark:bg-zinc-900 text-amber-700 dark:text-amber-400 shadow-xs border border-amber-500/30 dark:border-amber-500/30"
                : "text-slate-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400"
            }`}
          >
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Mode Panduan Dosen</span>
            {isLecturer && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>
        </div>

        <CardHeader className="p-6 md:p-8 border-b border-slate-100 dark:border-zinc-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
              activeTab === "lecturer"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                : "bg-teal-500/10 border-teal-500/25 text-teal-700 dark:text-teal-300"
            }`}>
              {activeTab === "lecturer" ? (
                <ShieldCheck className="w-6 h-6" />
              ) : (
                <FlaskConical className="w-6 h-6" />
              )}
            </div>

            <Badge variant="outline" className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
              {activeTab === "lecturer" ? "Instruktur Kelas" : "Praktikan Mahasiswa"}
            </Badge>
          </div>

          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-zinc-100">
              {activeTab === "lecturer"
                ? "Panduan Praktikum Dosen Pengampu"
                : "Identitas Mahasiswa Diperlukan"}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
              {activeTab === "lecturer"
                ? `Buka lembar ${practicum.title} dalam mode instruktur untuk memandu jalannya eksperimen di proyektor kelas.`
                : `Untuk membuka lembar pengamatan ${practicum.title}, mengisi analisis AI, dan menandatangani laporan, silakan masuk dengan akun mahasiswa Anda.`}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ================= TAB 1: DOSEN / INSTRUKTUR ================= */}
          {activeTab === "lecturer" && (
            <div className="space-y-5">
              {/* Jika sesi Dosen sudah aktif di browser */}
              {isLecturer ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-900 dark:text-amber-200 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Sesi Dosen Terverifikasi</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600 dark:text-zinc-300">
                      Anda terdeteksi sebagai <strong>{lecturerName ?? "Dosen Pengampu"}</strong>. Klik tombol di bawah untuk langsung membuka lembar praktikum ini dengan identitas instruktur kelas.
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={handleLecturerGuideLogin}
                    disabled={isLoading}
                    className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs gap-2 shadow-xs transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Membuka Lembar Panduan...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Masuk Mode Panduan ({lecturerName?.split(" ")[0] ?? "Dosen"}) ➔</span>
                      </>
                    )}
                  </Button>

                  <div className="pt-2 text-center">
                    <Link
                      href="/dosen"
                      className="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 inline-flex items-center gap-1 font-medium"
                    >
                      <span>Buka Portal Monitoring Dosen</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                /* Jika belum login sesi Dosen */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLecturerFormLogin();
                  }}
                  className="space-y-4"
                >
                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-slate-600 dark:text-zinc-300 flex items-start gap-2">
                    <Laptop className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <span>
                      Masukkan NIDN untuk login sebagai Dosen Pengampu. Setelah masuk, lembar praktikum akan otomatis menampilkan identitas instruktur.
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Nomor Induk Dosen Nasional (NIDN)</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 0012345678"
                      value={nidn}
                      onChange={(e) => setNidn(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 font-mono transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Kata Sandi Dosen</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showLecturerPassword ? "text" : "password"}
                        required
                        placeholder="Masukkan kata sandi..."
                        value={lecturerPassword}
                        onChange={(e) => setLecturerPassword(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-3.5 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowLecturerPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-0.5 transition-colors"
                        title={showLecturerPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                      >
                        {showLecturerPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs gap-2 shadow-xs transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memverifikasi Dosen...</span>
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4" />
                        <span>Masuk & Buka Panduan Instruktur</span>
                      </>
                    )}
                  </Button>

                  {/* Quick One-Click Default Lecturer Login */}
                  <div className="pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleLecturerFormLogin("0012345678", "0012345678")}
                      disabled={isLoading}
                      className="w-full h-10 border-amber-500/30 hover:bg-amber-500/10 text-amber-800 dark:text-amber-300 font-medium rounded-xl text-xs gap-2 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Masuk Instan: Dosen Pengampu Default (NIDN: 0012345678)</span>
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ================= TAB 2: MAHASISWA ================= */}
          {activeTab === "student" && (
            <div className="space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleStudentLogin();
                }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Nomor Induk Mahasiswa (NIM)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 202401001"
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 font-mono transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Kata Sandi (Default = NIM)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showStudentPassword ? "text" : "password"}
                      required
                      placeholder="Masukkan kata sandi..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-3.5 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition-all"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowStudentPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-0.5 transition-colors"
                      title={showStudentPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    >
                      {showStudentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-slate-900 hover:bg-teal-700 text-white dark:bg-slate-800 dark:hover:bg-teal-600 font-semibold rounded-xl text-xs gap-2 shadow-xs transition-all"
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
                  <div className="border-t border-slate-200 dark:border-zinc-800 w-full" />
                  <span className="bg-white dark:bg-zinc-900 px-3 text-[11px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider shrink-0 font-medium">
                    Atau Mode Uji Coba Cepat
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleInstantDemoLogin}
                  disabled={isLoading}
                  className="w-full h-10 border-slate-200 dark:border-zinc-800 hover:border-teal-500/40 hover:bg-teal-500/5 text-slate-700 dark:text-zinc-300 font-medium rounded-xl text-xs gap-2 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Masuk Instan: Budi Santoso (NIM: 202401001)</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-6 md:px-8 py-4 bg-slate-50/70 dark:bg-zinc-950/50 border-t border-slate-100 dark:border-zinc-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-500">
          <span>Studio Praktikum Serverless API</span>
          <span>Bimbingan & Koreksi AI Aktif</span>
        </CardFooter>
      </Card>
    </div>
  );
}
