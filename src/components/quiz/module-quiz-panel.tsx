"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Send,
  Lock,
  User,
  KeyRound,
  LogOut,
  HelpCircle,
  Lightbulb,
  Award,
  ChevronRight,
  Flame,
  Clock,
  Terminal,
  Cpu,
  Maximize2,
  Minimize2,
  TrendingUp,
  Layout,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  loginStudentAction,
  logoutStudentAction,
  getStudentSessionAction,
  changeStudentPasswordAction,
  StudentSession,
} from "@/actions/student-auth";
import {
  evaluateEssayAction,
  recordTabViolationAction,
  getQuizProgressAction,
  markQuizCompletedAction,
  restartQuizForImprovementAction,
  EvaluationResult,
  QuizProgress,
} from "@/actions/quiz-evaluator";

interface QuizQuestion {
  id: number;
  question: string;
  rubric: string;
  keyConcepts: string[];
  weight: number;
  socraticHint: string;
}

interface ModuleQuizPanelProps {
  moduleId: number;
  moduleTitle: string;
  questions: QuizQuestion[];
  passingScore?: number;
  onTimeUpdate?: (secondsLeft: number, isRunning: boolean) => void;
}

// Helper: Menghitung Alokasi Waktu Dasar per Bobot Soal
function getBaseTimeForQuestion(q?: QuizQuestion): number {
  if (!q) return 240;
  const w = q.weight || 15;
  if (w <= 15) return 240; // 4 Menit (240 detik)
  if (w <= 20) return 300; // 5 Menit (300 detik)
  return 420; // 7 Menit (420 detik)
}

// Helper: Format Detik ke MM:SS
function formatSeconds(totalSec: number): string {
  const m = Math.floor(Math.max(0, totalSec) / 60);
  const s = Math.max(0, totalSec) % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function ModuleQuizPanel({
  moduleId,
  moduleTitle,
  questions,
  passingScore = 80,
  onTimeUpdate,
}: ModuleQuizPanelProps) {
  // State Autentikasi
  const [session, setSession] = useState<StudentSession | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [nimInput, setNimInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  // State Ubah Password
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  // State Kuis
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [quizProgress, setQuizProgress] = useState<QuizProgress | null>(null);
  const [resetAlert, setResetAlert] = useState<string | null>(null);
  const [pasteWarning, setPasteWarning] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);

  // State Timer & Bank Waktu Akumulatif (Fischer Clock + AI Latency Freeze)
  const [timeLeft, setTimeLeft] = useState<number>(() =>
    getBaseTimeForQuestion(questions[0])
  );
  const [accumulatedBank, setAccumulatedBank] = useState<number>(0);
  const [lastRollover, setLastRollover] = useState<number>(0);
  const [showRolloverToast, setShowRolloverToast] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle Mode Layar Penuh (Zen Focus Mode)
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      if (typeof document !== "undefined" && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      setIsFullscreen(false);
      if (typeof document !== "undefined" && document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Load session saat pertama kali dipasang
  useEffect(() => {
    async function initAuth() {
      const res = await getStudentSessionAction();
      if (res.isAuthenticated && res.student) {
        setSession(res.student);
        await loadProgress(res.student.nim);
      }
      setAuthLoading(false);
    }
    initAuth();
  }, [moduleId]);

  // Load progres kuis dari database / state
  const loadProgress = async (nim: string) => {
    let prog = await getQuizProgressAction(nim, moduleId);

    // Jika datang dengan mode perbaikan nilai (?retake=true), aktifkan sesi perbaikan
    if (typeof window !== "undefined" && window.location.search.includes("retake=true") && prog.isCompleted) {
      await restartQuizForImprovementAction(nim, moduleId);
      prog = { ...prog, isCompleted: false, currentQuestionIndex: 0 };
    }

    setQuizProgress(prog);
    if (!prog.isCompleted) {
      const qIdx = Math.min(prog.currentQuestionIndex, questions.length - 1);
      setCurrentIndex(qIdx);
      setTimeLeft(getBaseTimeForQuestion(questions[qIdx]));
      setAccumulatedBank(0);
      setLastRollover(0);
    }
  };

  // Anti-Cheat: Handler pelanggaran fokus layar (window.blur atau tab switch)
  const handleViolation = useCallback(async () => {
    // Abaikan jika kuis telah selesai, belum login, atau saat AI sedang proses evaluasi
    if (!session || quizProgress?.isCompleted || isEvaluating) return;

    // Reset instan kuis
    setCurrentIndex(0);
    setStudentAnswer("");
    setEvaluation(null);
    setAccumulatedBank(0);
    setLastRollover(0);
    setTimeLeft(getBaseTimeForQuestion(questions[0]));
    setResetAlert(
      "Pelanggaran Integritas Ujian Terdeteksi! Layar peramban kehilangan fokus atau berpindah tab/aplikasi. Sesi Anda di-reset kembali ke Soal 1, dan kejadian ini telah dicatat ke database dosen."
    );

    const res = await recordTabViolationAction(session.nim, moduleId);
    setQuizProgress((prev) =>
      prev
        ? {
            ...prev,
            resetCount: res.newResetCount,
            currentQuestionIndex: 0,
            answers: {},
          }
        : null
    );
  }, [session, moduleId, quizProgress?.isCompleted, questions]);

  // Handler Waktu Habis (Hard Reset ke Soal 1 sesuai standar Mastery Learning)
  const handleTimeout = useCallback(async () => {
    if (!session || quizProgress?.isCompleted) return;

    setCurrentIndex(0);
    setStudentAnswer("");
    setEvaluation(null);
    setAccumulatedBank(0);
    setLastRollover(0);
    setTimeLeft(getBaseTimeForQuestion(questions[0]));
    setResetAlert(
      "⏱️ WAKTU PENGERJAAN HABIS! Anda belum menyelesaikan seluruh pertanyaan sebelum batas waktu berakhir. Sesuai standar Mastery Learning, sesi kuis di-reset kembali ke Soal 1. Manfaatkan kesempatan ini untuk menjawab lebih tangkas dan tepat!"
    );

    const res = await recordTabViolationAction(session.nim, moduleId);
    setQuizProgress((prev) =>
      prev
        ? {
            ...prev,
            resetCount: res.newResetCount,
            currentQuestionIndex: 0,
            answers: {},
          }
        : null
    );
  }, [session, moduleId, quizProgress?.isCompleted, questions]);

  // Timer Effect: Countdown 1 detik per interval dengan kompensasi AI Latency Freeze
  useEffect(() => {
    if (
      !session ||
      quizProgress?.isCompleted ||
      isEvaluating ||
      evaluation?.isPassed
    ) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session, quizProgress?.isCompleted, isEvaluating, evaluation?.isPassed, handleTimeout]);

  // Sinkronisasi status timer kuis ke komponen induk (agar floating timer di Tab Teori/Lab aktif)
  useEffect(() => {
    if (onTimeUpdate) {
      const isRunning =
        !!session &&
        !quizProgress?.isCompleted &&
        !isEvaluating &&
        !evaluation?.isPassed &&
        timeLeft > 0;
      onTimeUpdate(timeLeft, isRunning);
    }
  }, [timeLeft, session, quizProgress?.isCompleted, isEvaluating, evaluation?.isPassed, onTimeUpdate]);

  // Pasang listener Anti-Cheat di browser
  useEffect(() => {
    if (!session || quizProgress?.isCompleted) return;

    const onBlur = () => {
      handleViolation();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        handleViolation();
      }
    };

    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [session, quizProgress?.isCompleted, handleViolation]);

  // Handler Login Mahasiswa
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    const res = await loginStudentAction(nimInput, passwordInput);
    if (res.success && res.student) {
      setSession(res.student);
      await loadProgress(res.student.nim);
    } else {
      setAuthError(res.message);
    }
    setAuthLoading(false);
  };

  // Handler Logout
  const handleLogout = async () => {
    await logoutStudentAction();
    setSession(null);
    setQuizProgress(null);
    setStudentAnswer("");
    setEvaluation(null);
    setCurrentIndex(0);
    setAccumulatedBank(0);
    setLastRollover(0);
    setTimeLeft(getBaseTimeForQuestion(questions[0]));
  };

  // Handler Ubah Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg("");
    const res = await changeStudentPasswordAction(oldPassword, newPassword);
    setPasswordMsg(res.message);
    if (res.success) {
      setTimeout(() => setShowPasswordModal(false), 2000);
    }
  };

  // Handler Anti-Copy & Anti-Paste
  const handlePastePrevent = (e: React.ClipboardEvent | React.DragEvent) => {
    e.preventDefault();
    setPasteWarning(true);
    setTimeout(() => setPasteWarning(false), 4000);
  };

  const handleCopyCutPrevent = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setPasteWarning(true);
    setTimeout(() => setPasteWarning(false), 4000);
  };

  // Handler Kirim Jawaban ke AI Evaluator
  const handleSubmitAnswer = async () => {
    if (!session || !studentAnswer.trim()) return;

    const currentQ = questions[currentIndex];
    setIsEvaluating(true);
    setEvaluation(null);
    setNetworkError(null);

    try {
      const result = await evaluateEssayAction({
        moduleId,
        questionNumber: currentIndex + 1,
        questionText: currentQ.question,
        studentAnswer,
        rubric: currentQ.rubric,
        keyConcepts: currentQ.keyConcepts,
        socraticHint: currentQ.socraticHint,
        studentNim: session.nim,
      });

      setEvaluation(result);

      if (result.isPassed) {
        // Update state lokal
        const nextIdx = currentIndex + 1;
        setQuizProgress((prev) => {
          if (!prev) return null;
          const updatedAnswers = {
            ...prev.answers,
            [currentIndex + 1]: {
              score: result.score,
              isPassed: true,
              studentAnswer,
              feedback: result.feedback,
            },
          };
          return {
            ...prev,
            currentQuestionIndex: Math.max(prev.currentQuestionIndex, nextIdx),
            answers: updatedAnswers,
          };
        });

        // Jika soal terakhir selesai, tandai tuntas
        if (currentIndex === questions.length - 1) {
          await markQuizCompletedAction(session.nim, moduleId);
          setQuizProgress((prev) => (prev ? { ...prev, isCompleted: true } : null));
        }
      }
    } catch (err) {
      console.warn("AI evaluation connection issue:", err);
      setNetworkError(
        "Koneksi ke server AI terganggu atau token API sedang sibuk. Jawaban Anda tetap tersimpan aman di kolom teks. Silakan klik 'Kirim Jawaban Evaluasi' lagi untuk mencoba ulang."
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  // Navigasi ke Soal Berikutnya (Hanya jika lolos 80)
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      const nextBase = getBaseTimeForQuestion(questions[nextIdx]);
      const rollover = Math.max(0, timeLeft);
      const newTotal = nextBase + rollover;

      setCurrentIndex(nextIdx);
      setStudentAnswer("");
      setEvaluation(null);
      setTimeLeft(newTotal);
      setAccumulatedBank((prev) => prev + rollover);
      setLastRollover(rollover);
      if (rollover > 0) {
        setShowRolloverToast(true);
        setTimeout(() => setShowRolloverToast(false), 4500);
      }
    }
  };

  // Coba ulang / revisi jawaban
  const handleRevise = () => {
    setEvaluation(null);
  };

  // 1. Tampilan Loading Awal
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Menyiapkan Lingkungan Uji Pemahaman...
        </p>
      </div>
    );
  }

  // 2. Tampilan Form Login Mahasiswa (Jika Belum Login)
  if (!session) {
    return (
      <div className="max-w-md mx-auto my-8 space-y-6">
        <Card className="border border-border/80 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <Brain className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Uji Pemahaman
              </h2>
              <p className="text-xs text-muted-foreground">
                Masuk menggunakan NIM Anda untuk mengakses evaluasi pemahaman materi Modul {moduleId}.
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  NIM Mahasiswa
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 202401001"
                  value={nimInput}
                  onChange={(e) => setNimInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background/80 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                    Kata Sandi
                  </label>
                  <span className="text-[10px] text-muted-foreground">
                    Default = NIM
                  </span>
                </div>
                <input
                  type="password"
                  required
                  placeholder="Masukkan kata sandi..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background/80 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                />
              </div>

              <Button
                type="submit"
                disabled={authLoading}
                className="w-full h-10 font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 rounded-xl gap-2 text-xs"
              >
                <Lock className="w-4 h-4" />
                <span>Masuk ke Sesi Ujian</span>
              </Button>
            </form>

            <div className="pt-4 border-t border-border/60">
              <p className="text-[11px] text-muted-foreground text-center mb-2 font-medium">
                Akun Uji Coba Cepat (Klik untuk isi otomatis):
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { nim: "202401001", name: "Budi" },
                  { nim: "202401002", name: "Siti" },
                  { nim: "202401004", name: "Dewi" },
                ].map((s) => (
                  <button
                    key={s.nim}
                    type="button"
                    onClick={() => {
                      setNimInput(s.nim);
                      setPasswordInput(s.nim);
                    }}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-muted/80 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 border border-border transition-colors font-mono"
                  >
                    {s.nim} ({s.name})
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 3. Tampilan Kuis Selesai 100% (Completed Celebration)
  if (quizProgress?.isCompleted) {
    return (
      <div className="max-w-3xl mx-auto my-6 space-y-6">
        <Card className="border-2 border-emerald-500/40 bg-card/90 shadow-xl overflow-hidden backdrop-blur-md">
          <div className="h-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <Award className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 px-3 py-1 font-bold text-xs uppercase tracking-wide">
                🎉 Pemahaman Konsep Tuntas 100%
              </Badge>
              <h2 className="text-2xl font-extrabold text-foreground">
                Selamat, {session.fullName}!
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                Anda telah menyelesaikan seluruh {questions.length} soal esai arsitektur untuk{" "}
                <span className="font-semibold text-foreground">{moduleTitle}</span> dengan nilai kelulusan di atas ambang batas 80.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto py-2">
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/80">
                <p className="text-xs text-muted-foreground">NIM Mahasiswa</p>
                <p className="text-lg font-bold font-mono text-foreground">{session.nim}</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Skor Rata-rata</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {quizProgress.totalScore} / 100
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/80">
                <p className="text-xs text-muted-foreground">Pelanggaran Reset</p>
                <p className="text-lg font-bold font-mono text-foreground">
                  {quizProgress.resetCount} kali
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3 justify-center">
              <Button
                size="sm"
                onClick={async () => {
                  if (session) {
                    await restartQuizForImprovementAction(session.nim, moduleId);
                    await loadProgress(session.nim);
                  }
                }}
                className="gap-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs rounded-xl"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Perbaiki Nilai (Uji Ulang untuk Skor 100)
              </Button>
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="gap-2 text-xs rounded-xl border-zinc-300 dark:border-zinc-700 font-semibold">
                  <Layout className="w-3.5 h-3.5" />
                  Ke Dashboard Saya
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuizProgress((prev) => (prev ? { ...prev, isCompleted: false } : null));
                  setCurrentIndex(0);
                }}
                className="gap-2 text-xs rounded-xl"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Lihat / Kaji Ulang Soal
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2 text-xs text-muted-foreground hover:text-destructive rounded-xl"
              >
                <LogOut className="w-3.5 h-3.5" />
                Keluar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 4. Tampilan Kuis Aktif (Mastery Learning Runner)
  const currentQ = questions[currentIndex] || questions[0];
  const progressPercent = Math.round(((currentIndex) / questions.length) * 100);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className={`select-none ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-background/95 backdrop-blur-xl p-3 md:p-6 overflow-y-auto flex flex-col justify-start"
          : "max-w-4xl mx-auto my-3 space-y-3"
      }`}
    >
      {/* Baris Status Mahasiswa & Kontrol Sesi */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-card border border-border/80 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
            {session.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-foreground">{session.fullName}</span>
              <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
                {session.nim}
              </Badge>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 hidden sm:inline-flex">
                {session.classGroup}
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
              <span>Sesi Kuis Modul {moduleId}</span>
              {quizProgress && quizProgress.resetCount > 0 && (
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  • Reset: {quizProgress.resetCount}x
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant={isFullscreen ? "default" : "outline"}
            size="sm"
            onClick={toggleFullscreen}
            className={`text-xs h-7 px-2.5 gap-1.5 transition-all ${
              isFullscreen
                ? "bg-amber-600 hover:bg-amber-700 text-white font-bold"
                : "border-border text-foreground hover:bg-muted"
            }`}
            title={isFullscreen ? "Keluar Mode Layar Penuh (Esc)" : "Buka Mode Layar Penuh (Fokus Ujian)"}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Keluar Penuh</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Layar Penuh</span>
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPasswordModal(true)}
            className="text-xs h-7 px-2 gap-1 text-muted-foreground hover:text-foreground hidden sm:flex"
          >
            <KeyRound className="w-3 h-3" />
            <span>Sandi</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-xs h-7 px-2 gap-1 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-3 h-3" />
            <span>Keluar</span>
          </Button>
        </div>
      </div>

      {/* Banner Mode Open-Book & Waktu Berjalan */}
      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
        <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400 animate-pulse" />
        <div className="space-y-0.5">
          <p className="font-bold">Mode Open-Book Aktif: Waktu Terus Berjalan</p>
          <p className="text-[11px] leading-relaxed text-amber-700/90 dark:text-amber-300/90">
            Anda diperbolehkan membuka Tab 1 (Teori) &amp; Tab 2 (Lab) untuk memverifikasi konsep. 
            Namun, <strong>waktu pengerjaan tidak akan berhenti dan terus berkurang</strong> di latar belakang. Fitur blok dan salin-tempel dinonaktifkan sehingga seluruh jawaban wajib diketik secara mandiri.
          </p>
        </div>
      </div>

      {/* Banner Peringatan Pelanggaran Reset (Jika Terjadi) */}
      <AnimatePresence>
        {resetAlert && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive shadow-sm space-y-1.5"
          >
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs">Peringatan Protokol Integritas Akademik!</h4>
                <p className="text-[11px] leading-relaxed">{resetAlert}</p>
              </div>
            </div>
            <div className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResetAlert(null)}
                className="text-[10px] h-6 px-2.5 border-destructive/30 text-destructive hover:bg-destructive/20"
              >
                Saya Mengerti & Lanjutkan Kuis
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banner Peringatan Anti-Paste & Anti-Copy */}
      <AnimatePresence>
        {pasteWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 shadow-sm"
          >
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
            <span>
              <strong>Fitur Blok &amp; Salin-Tempel Dinonaktifkan:</strong> Teks soal tidak dapat disalin dan jawaban esai wajib diketikkan secara mandiri demi integritas ujian.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifikasi Tabungan Waktu Ditambahkan */}
      <AnimatePresence>
        {showRolloverToast && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>
                <strong>Akumulasi Waktu Berhasil!</strong> Sisa waktu{" "}
                <span className="font-mono underline font-bold">
                  +{formatSeconds(lastRollover)}
                </span>{" "}
                dari soal sebelumnya telah ditambahkan ke soal ini.
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRolloverToast(false)}
              className="h-5 px-1.5 text-[10px] text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
            >
              Tutup
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kartu Soal & Textarea Jawaban */}
      <Card className="border border-border/80 shadow-md bg-card overflow-hidden">
        {/* Progress Bar Indikator & Kontrol Timer Ringkas (1 Baris Ramping) */}
        <div className="bg-muted/40 border-b border-border/60 px-4 py-2.5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Kiri: Nomor Soal & Bobot */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Soal {currentIndex + 1}/{questions.length}
              </span>
              <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 font-mono text-[10px] px-1.5 py-0">
                Bobot: {currentQ.weight} Poin
              </Badge>
            </div>

            {/* Tengah: Timer Badge yang Jelas */}
            <div className="flex items-center gap-1.5">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold transition-all shadow-sm ${
                  isEvaluating
                    ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-700 dark:text-indigo-300 animate-pulse"
                    : evaluation?.isPassed
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                    : timeLeft <= 60
                    ? "bg-rose-500/20 border-rose-500/40 text-rose-600 dark:text-rose-400 animate-pulse"
                    : "bg-background border-border text-foreground"
                }`}
              >
                <Clock
                  className={`w-3.5 h-3.5 ${
                    isEvaluating
                      ? "text-indigo-500 animate-spin"
                      : timeLeft <= 60
                      ? "text-rose-500"
                      : "text-amber-500"
                  }`}
                />
                <span className="text-xs tracking-wider">
                  {formatSeconds(timeLeft)}
                </span>
                {isEvaluating && (
                  <span className="text-[10px] font-sans font-medium opacity-90 hidden sm:inline">
                    ⏸️ Dijeda (AI)
                  </span>
                )}
                {evaluation?.isPassed && !isEvaluating && (
                  <span className="text-[10px] font-sans font-medium text-emerald-600 dark:text-emerald-400 hidden sm:inline">
                    ⏸️ Lulus
                  </span>
                )}
                {!isEvaluating && !evaluation?.isPassed && timeLeft <= 60 && (
                  <span className="text-[10px] font-sans font-bold text-rose-600 dark:text-rose-400 hidden sm:inline">
                    ⚠️ Kritis
                  </span>
                )}
              </div>

              {lastRollover > 0 && (
                <div className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-medium font-mono">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span>+{formatSeconds(lastRollover)}</span>
                </div>
              )}
            </div>

            {/* Kanan: Ambang Kelulusan & Alokasi */}
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="hidden sm:inline">
                Ambang: <strong className="text-foreground">{passingScore}</strong>
              </span>
              <span className="hidden md:inline">
                • Basis: <strong className="text-foreground font-mono">{Math.round(getBaseTimeForQuestion(currentQ) / 60)}m</strong>
              </span>
            </div>
          </div>

          {/* Progress Bar Ramping */}
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <CardContent className="p-4 md:p-5 space-y-3">
          {/* Teks Pertanyaan & Fokus Konsep */}
          <div className="space-y-1.5">
            <h3 className="text-sm md:text-base font-bold text-foreground leading-snug">
              {currentQ.question}
            </h3>

            {/* Kata Kunci Relevan */}
            <div className="flex flex-wrap items-center gap-1 pt-0.5">
              <span className="text-[10px] text-muted-foreground mr-1">Konsep Kunci:</span>
              {currentQ.keyConcepts.map((concept, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground border border-border/80"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Area Pengetikan Esai Mahasiswa */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-foreground flex items-center gap-1 text-[11px]">
                <Terminal className="w-3 h-3 text-amber-500" />
                Uraian Jawaban Anda:
              </label>
              <span className="text-[10px] text-muted-foreground font-mono">
                {studentAnswer.trim().length} karakter (disarankan minimal 40 kata)
              </span>
            </div>

            <textarea
              rows={4}
              disabled={isEvaluating || evaluation?.isPassed}
              value={studentAnswer}
              onChange={(e) => {
                setStudentAnswer(e.target.value);
                if (networkError) setNetworkError(null);
              }}
              onPaste={handlePastePrevent}
              onCopy={handleCopyCutPrevent}
              onCut={handleCopyCutPrevent}
              onDrop={handlePastePrevent}
              onContextMenu={(e) => e.preventDefault()}
              onKeyDown={(e) => {
                if (
                  (e.ctrlKey || e.metaKey) &&
                  (e.key === "v" || e.key === "V" || e.key === "c" || e.key === "C" || e.key === "x" || e.key === "X")
                ) {
                  e.preventDefault();
                  setPasteWarning(true);
                  setTimeout(() => setPasteWarning(false), 4000);
                }
              }}
              placeholder="Ketikkan uraian pemikiran arsitektur Anda di sini... Jelaskan mekanisme, implikasi teknis, dan alasan arsitekturnya. (Fitur blok dan salin-tempel dinonaktifkan demi integritas ujian)"
              className="w-full p-3 rounded-xl border border-input bg-background text-xs md:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all resize-y font-sans disabled:opacity-75 disabled:bg-muted/40 min-h-[95px] max-h-[160px]"
            />
          </div>

          {/* Banner Notifikasi Kendala Jaringan / AI Inline (Bukan Native Alert) */}
          <AnimatePresence>
            {networkError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs font-medium flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{networkError}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNetworkError(null)}
                  className="h-5 px-1.5 text-[10px] text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
                >
                  Tutup
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tombol Aksi */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-amber-500 shrink-0" />
              <span>Dilarang berpindah tab atau meminimalkan jendela selama pengerjaan.</span>
            </div>

            <div className="flex items-center gap-2">
              {!evaluation?.isPassed ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={isEvaluating || studentAnswer.trim().length < 10}
                  className="h-8 md:h-9 px-4 font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md shadow-amber-600/20 gap-1.5 text-xs"
                >
                  {isEvaluating ? (
                    <>
                      <Cpu className="w-3.5 h-3.5 animate-spin" />
                      <span>Sedang Mengevaluasi...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      <span>Kirim Jawaban Evaluasi</span>
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="h-8 md:h-9 px-4 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-600/20 gap-1.5 text-xs"
                >
                  <span>
                    {currentIndex === questions.length - 1
                      ? "Selesaikan Kuis & Buka Sertifikat"
                      : "Lanjut ke Soal Berikutnya"}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Feedback Hasil Evaluasi AI */}
          <AnimatePresence>
            {evaluation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`p-4 rounded-xl border shadow-md space-y-2.5 ${
                  evaluation.isPassed
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-100"
                    : "bg-amber-500/10 border-amber-500/40 text-amber-950 dark:text-amber-100"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2">
                  <div className="flex items-center gap-2">
                    {evaluation.isPassed ? (
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-xs md:text-sm">
                        {evaluation.isPassed
                          ? "Kriteria Tercapai: Jawaban Memenuhi Standar Arsitektur!"
                          : "Perlu Pendalaman: Nilai Belum Mencapai Ambang 80"}
                      </h4>
                      <p className="text-[10px] opacity-80">
                        Evaluasi otomatis oleh AI Engine ({evaluation.providerUsed})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Badge
                      className={`text-xs font-bold font-mono px-2.5 py-0.5 ${
                        evaluation.isPassed
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-600 text-white"
                      }`}
                    >
                      Skor: {evaluation.score} / 100
                    </Badge>
                  </div>
                </div>

                {/* Uraian Feedback Pedagogis */}
                <div className="space-y-1.5">
                  <p className="text-xs leading-relaxed font-medium">
                    {evaluation.feedback}
                  </p>

                  {/* Poin Kekuatan */}
                  {evaluation.strengths.length > 0 && (
                    <div className="pt-1 space-y-0.5">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                        ✓ Aspek Pemahaman yang Baik:
                      </span>
                      <ul className="list-disc list-inside text-[11px] space-y-0.5 opacity-90 pl-1">
                        {evaluation.strengths.map((str, i) => (
                          <li key={i}>{str}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Poin yang Kurang / Perlu Ditambahkan */}
                  {!evaluation.isPassed && evaluation.missingPoints.length > 0 && (
                    <div className="pt-1 space-y-0.5">
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                        🔍 Dimensi Konsep yang Perlu Ditambahkan:
                      </span>
                      <ul className="list-disc list-inside text-[11px] space-y-0.5 opacity-90 pl-1">
                        {evaluation.missingPoints.map((mis, i) => (
                          <li key={i}>{mis}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Tombol Aksi Revisi */}
                {!evaluation.isPassed && (
                  <div className="pt-1 text-right">
                    <Button
                      onClick={handleRevise}
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold gap-1.5 rounded-xl h-8 px-3"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Revisi & Perbaiki Jawaban Ini</span>
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Modal Ganti Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-sm border border-border shadow-2xl bg-card">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-500" />
                  Ubah Kata Sandi Mandiri
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  ✕
                </button>
              </div>

              {passwordMsg && (
                <p className="text-xs p-2 rounded-lg bg-muted border border-border">
                  {passwordMsg}
                </p>
              )}

              <form onSubmit={handleChangePassword} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Kata Sandi Lama (Default: NIM)
                  </label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPasswordModal(false)}
                    className="text-xs"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                  >
                    Simpan Sandi Baru
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
