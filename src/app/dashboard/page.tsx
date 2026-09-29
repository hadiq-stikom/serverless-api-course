"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Award,
  Flame,
  Sparkles,
  Zap,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  LogOut,
  Layers,
  ChevronRight,
  Target,
  Rocket,
  Lock,
  Compass,
  BookOpen,
  Filter,
  Check,
  AlertCircle,
  HelpCircle,
  Star,
  RefreshCw,
  ExternalLink,
  Trophy,
  ThumbsUp,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";

const GRADE_TIERS = [
  { grade: "A", range: "90..100", dot: "bg-amber-400", border: "border-amber-400/40", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
  { grade: "AB", range: "80..89", dot: "bg-blue-400", border: "border-blue-400/40", text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
  { grade: "B", range: "70..79", dot: "bg-emerald-400", border: "border-emerald-400/40", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  { grade: "BC", range: "65..69", dot: "bg-cyan-400", border: "border-cyan-400/40", text: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-500/10" },
  { grade: "C", range: "55..64", dot: "bg-yellow-400", border: "border-yellow-400/40", text: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-500/10" },
  { grade: "CD", range: "50..54", dot: "bg-orange-400", border: "border-orange-400/40", text: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10" },
  { grade: "D", range: "40..49", dot: "bg-rose-400", border: "border-rose-400/40", text: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10" },
  { grade: "DE", range: "30..39", dot: "bg-red-400", border: "border-red-400/40", text: "text-red-600 dark:text-red-400", bg: "bg-red-500/10" },
  { grade: "E", range: "0..29", dot: "bg-zinc-400", border: "border-zinc-400/40", text: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-500/10" },
];
import {
  getStudentDashboardDataAction,
  logoutStudentAction,
  changeStudentPasswordAction,
  StudentDashboardData,
  ModuleSubmissionSummary,
} from "@/actions/student-auth";
import { restartQuizForImprovementAction } from "@/actions/quiz-evaluator";
import { LoginDialog } from "@/components/auth/login-dialog";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "needs_improvement" | "not_started">("all");
  
  // Modal Ganti Password
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Modal Login jika belum login
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Load Data Dashboard
  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await getStudentDashboardDataAction();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setData(null);
      }
    } catch (err) {
      console.error("Gagal memuat data dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleLogout = async () => {
    await logoutStudentAction();
    router.push("/");
    router.refresh();
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    setIsChangingPass(true);

    try {
      const res = await changeStudentPasswordAction(oldPassword, newPassword);
      if (res.success) {
        setPasswordMsg({ text: res.message, isError: false });
        setOldPassword("");
        setNewPassword("");
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordMsg(null);
        }, 1800);
      } else {
        setPasswordMsg({ text: res.message, isError: true });
      }
    } catch {
      setPasswordMsg({ text: "Gagal memperbarui kata sandi.", isError: true });
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleRetakeModule = async (moduleId: number) => {
    if (!data) return;
    startTransition(async () => {
      await restartQuizForImprovementAction(data.student.nim, moduleId);
      router.push(`/modules/${moduleId}?tab=quiz&retake=true`);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Menyiapkan portal capaian mahasiswa...
          </p>
        </div>
      </div>
    );
  }

  // Jika Belum Login
  if (!data) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white flex flex-col justify-center items-center p-6">
        <Card className="max-w-md w-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black">Portal Mahasiswa</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Silakan masuk dengan NIM Anda untuk melihat akumulasi nilai, laporan progres mingguan, dan fitur perbaikan nilai.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-left text-xs space-y-2">
            <p className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
              Petunjuk Masuk Akun:
            </p>
            <ul className="list-disc list-inside text-zinc-500 dark:text-zinc-400 space-y-1 text-[11px]">
              <li>Gunakan NIM terdaftar (contoh: <code>1124102161</code>).</li>
              <li>Kata sandi awal adalah NIM masing-masing.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => setShowLoginModal(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl shadow-md gap-2"
            >
              <span>Masuk Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Link href="/">
              <Button variant="ghost" className="w-full text-xs text-zinc-500">
                Kembali ke Halaman Depan
              </Button>
            </Link>
          </div>
        </Card>

        <LoginDialog
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={loadDashboard}
        />
      </div>
    );
  }

  const { student, modules, stats } = data;

  // Filter Modul
  const filteredModules = modules.filter((m) => {
    if (filterStatus === "completed") return m.status === "completed";
    if (filterStatus === "needs_improvement") return m.status === "completed" && m.totalScore < 90;
    if (filterStatus === "not_started") return m.status !== "completed";
    return true;
  });

  const activeModule = modules.find((m) => m.status === "in_progress") 
    || modules.find((m) => m.status !== "completed") 
    || modules[0];
  const activeModuleNum = activeModule ? activeModule.moduleId : 1;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 md:p-10 lg:p-12 space-y-10 transition-colors duration-300 selection:bg-indigo-500 selection:text-white">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-600/15 rounded-full blur-3xl" />
      </div>

      {/* Top Navbar */}
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0 shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                Halo, {student.fullName} 👋
              </h1>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono flex flex-wrap items-center gap-2">
              <span>NIM: {student.nim}</span>
              <span>•</span>
              <span className="font-sans font-semibold text-indigo-600 dark:text-indigo-400">Kelas {student.classGroup}</span>
              <span>•</span>
              <span className="font-sans text-zinc-500">The Serverless Odyssey</span>
            </p>
          </div>
        </div>

        {/* Right Section: Trophy Badge & Action Controls */}
        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
          {/* Juara Arsitektur Box (from image) */}
          <div className="flex items-center gap-2.5 p-2 px-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 shadow-xs">
            <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {stats.completedCount === 16 ? "Juara Arsitektur Serverless" : "Calon Juara Arsitektur"}
              </p>
              <p className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                {stats.completedCount > 0 ? `${stats.totalXp} XP • Grade ${stats.gradeLetter}` : "Segera raih lencana pertamamu"}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPasswordModal(true)}
            className="text-xs gap-1.5 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-zinc-500" />
            <span>Ganti Sandi</span>
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
              <span>RPS</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-xs gap-1.5 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </Button>

          <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-1" />
          <ThemeToggle />
        </div>
      </header>

      {/* Motivational Hero Banner with 3 Action Pillars (Sintesis Dashboard) */}
      <section className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/5 border border-indigo-500/20 dark:border-indigo-500/30 relative overflow-hidden space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide uppercase">
              <KeyRound className="w-3.5 h-3.5" />
              Kunci Sukses Arsitektur Serverless
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              Kuasai Serverless Lewat{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 dark:from-indigo-400 dark:via-purple-300 dark:to-cyan-400 bg-clip-text text-transparent">
                Konsistensi &amp; Perbaikan Diri 🚀
              </span>
            </h2>
            <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
              Pengembangan aplikasi skala industri bukan tentang siapa yang paling cepat menyalin kode, melainkan <strong className="text-zinc-900 dark:text-white font-semibold">ketekunan melatih logika berpikir secara konsisten</strong>. Jika capaian kuis atau esaimu belum maksimal, jangan berkecil hati. Evaluasi kekurangannya, manfaatkan ruang perbaikan mandiri, dan lakukan retake hingga kamu meraih <strong className="text-amber-600 dark:text-amber-400 font-bold">Lencana Emas (Grade A)</strong>!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <Link href={`/modules/${activeModuleNum}?tab=quiz`} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-10 px-5 rounded-xl shadow-md gap-2 cursor-pointer">
                <Rocket className="w-4 h-4" />
                <span>
                  {activeModule?.status === "in_progress"
                    ? `Lanjutkan Pertemuan 0${activeModuleNum} ➔`
                    : `Mulai Pertemuan 0${activeModuleNum} ➔`}
                </span>
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto text-xs h-10 px-5 rounded-xl border-zinc-300 dark:border-zinc-700 font-semibold gap-2 bg-white/80 dark:bg-zinc-900/80 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>Peta Modul (RPS)</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* 3 Action Pillars (Adopsi Desain Gambar) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-indigo-500/10 dark:border-indigo-500/20">
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <ThumbsUp className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                1. Latihan Konsisten Tiap Pekan
              </h4>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Luangkan materi teratur untuk melihat alur logika di setiap lab. Belajar konsisten jauh lebih efektif daripada sistem kebut semalam.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <RotateCcw className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                2. Perbaikan Berkelanjutan (Remedial)
              </h4>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Nilai belum 100? Pelajari umpan balik Socratic AI, temukan letak kesalahan logika, dan lakukan retake dengan proteksi nilai tertinggi aman.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Award className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                3. Targetkan Lencana Emas (A)
              </h4>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Setiap mahasiswa memiliki potensi meraih Capaian Sempurna (Skor &ge; 90). Jadikan lencana emas sebagai tolak ukur penguasaan logika sejatimu.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Stat Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {/* Card 1: Materi Selesai */}
        <Card className="border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Materi Selesai</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-zinc-900 dark:text-white font-mono">
              {stats.completedCount}
            </span>
            <span className="text-xs font-semibold text-zinc-500">/ {stats.totalModules} Modul</span>
          </div>
          <div className="mt-2.5">
            <Progress
              value={(stats.completedCount / stats.totalModules) * 100}
              className="h-1.5 bg-zinc-100 dark:bg-zinc-800"
            />
          </div>
        </Card>

        {/* Card 2: Lencana Diraih / Rata-rata */}
        <Card className="border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Rata-rata Nilai</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {stats.averageScore > 0 ? stats.averageScore : "—"}
            </span>
            <span className="text-xs font-semibold text-zinc-500">/ 100</span>
            {stats.averageScore > 0 && (
              <Badge className="ml-auto bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-xs font-bold font-mono">
                Grade {stats.gradeLetter}
              </Badge>
            )}
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
            {stats.completedCount > 0
              ? `${stats.completedCount} modul tuntas dievaluasi.`
              : "Menunggu kuis pertama diselesaikan."}
          </p>
        </Card>

        {/* Card 3: Dedikasi & XP */}
        <Card className="border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Poin Pengalaman (XP)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {stats.totalXp}
            </span>
            <span className="text-xs font-semibold text-zinc-500">XP</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
            Titel: <span className="text-zinc-800 dark:text-zinc-200 font-bold">{stats.masteryLevel}</span>
          </p>
        </Card>

        {/* Card 4: Catatan Integritas */}
        <Card className="border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Integritas Ujian</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-zinc-900 dark:text-white font-mono">
              {stats.totalResets}
            </span>
            <span className="text-xs font-semibold text-zinc-500">Reset Layar</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
            {stats.totalResets === 0
              ? "✨ Sempurna! Tanpa pelanggaran fokus."
              : "Tetap pertahankan fokus di jendela ujian."}
          </p>
        </Card>
      </section>

      {/* Peta 9 Tingkat Capaian & Lencana Resmi (Adopsi Penuh dari Gambar) */}
      <section className="p-5 md:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Award className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Peta 9 Tingkat Capaian &amp; Lencana Resmi
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Setiap peningkatan nilai mencerminkan kematangan arsitektur sistemmu. Lakukan perbaikan secara konsisten untuk melangkah ke tingkat berikutnya!
            </p>
          </div>
          <Badge variant="outline" className="text-[11px] font-semibold bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 self-start sm:self-auto">
            Target Standar: Lencana B / AB / A
          </Badge>
        </div>

        {/* 9 Grade Boxes */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {GRADE_TIERS.map((tier) => {
            const isCurrentGrade = stats.completedCount > 0 && stats.gradeLetter === tier.grade;
            return (
              <div
                key={tier.grade}
                className={`p-3 rounded-2xl border text-center transition-all relative ${
                  isCurrentGrade
                    ? "ring-2 ring-indigo-500 shadow-md " + tier.bg + " " + tier.border
                    : "bg-zinc-50/70 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/60"
                }`}
              >
                {isCurrentGrade && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                    📍 Posisi Anda
                  </div>
                )}
                <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-1.5 ${tier.dot}`} />
                <p className={`text-base font-black tracking-tight ${tier.text}`}>
                  {tier.grade}
                </p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">
                  {tier.range}
                </p>
              </div>
            );
          })}
        </div>

        {/* 4 Category Summary Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          <div className="p-2.5 px-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between">
            <span className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1.5 text-[11px]">
              👑 Sempurna (Skor 90–100)
            </span>
            <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] font-bold">
              A
            </Badge>
          </div>

          <div className="p-2.5 px-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs flex items-center justify-between">
            <span className="font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1.5 text-[11px]">
              💎 Baik (Skor 70–89)
            </span>
            <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30 text-[10px] font-bold">
              B • AB
            </Badge>
          </div>

          <div className="p-2.5 px-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs flex items-center justify-between">
            <span className="font-semibold text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5 text-[11px]">
              📘 Cukup (Skor 55–69)
            </span>
            <Badge className="bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30 text-[10px] font-bold">
              C • BC
            </Badge>
          </div>

          <div className="p-2.5 px-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs flex items-center justify-between">
            <span className="font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-1.5 text-[11px]">
              ⚠️ Area Perbaikan (Skor 0–54)
            </span>
            <Badge className="bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30 text-[10px] font-bold">
              E s.d CD
            </Badge>
          </div>
        </div>
      </section>

      {/* The Consistency Pillar Manifesto */}
      <section className="p-4 md:p-5 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <p className="leading-relaxed">
            <strong className="text-zinc-900 dark:text-white">Prinsip Retensi Nilai Terbaik (Highest Score Retention):</strong> Saat Anda menguji ulang modul untuk menaikkan nilai ke 90–100, nilai tertinggi sebelumnya dijamin aman dan tidak akan pernah berkurang.
          </p>
        </div>
        <div className="shrink-0">
          <Badge variant="outline" className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-[11px] font-semibold">
            Non-Destructive Retake
          </Badge>
        </div>
      </section>

      {/* Transkrip Capaian & Rekapitulasi Nilai (KHS Mini) */}
      <section className="space-y-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Transkrip Capaian &amp; Rekapitulasi Nilai (16 Pertemuan)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Pantau seluruh capaian perkuliahan dalam satu layar, raih skor maksimal 100, dan gunakan tombol perbaikan nilai kapan saja.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 self-start sm:self-auto">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filterStatus === "all"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Semua ({modules.length})
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filterStatus === "completed"
                  ? "bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Tuntas ({stats.completedCount})
            </button>
            <button
              onClick={() => setFilterStatus("needs_improvement")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                filterStatus === "needs_improvement"
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <span>Peluang Naik Nilai ({stats.improvementOpportunitiesCount})</span>
              {stats.improvementOpportunitiesCount > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setFilterStatus("not_started")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filterStatus === "not_started"
                  ? "bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Belum Tuntas ({stats.totalModules - stats.completedCount})
            </button>
          </div>
        </div>

        {/* Dynamic Opportunity Banner */}
        {stats.improvementOpportunitiesCount > 0 && (
          <div className="p-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-zinc-800 dark:text-zinc-200">
                Tersedia <strong>{stats.improvementOpportunitiesCount} modul</strong> dengan nilai 80-an yang dapat Anda tingkatkan menuju <strong>100 (Grade A+)</strong>. Percobaan ulang dijamin aman tanpa risiko penurunan nilai!
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setFilterStatus("needs_improvement")}
              className="text-xs h-7 px-3 border-indigo-500/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/10 rounded-lg shrink-0 gap-1 font-semibold cursor-pointer"
            >
              <span>Fokus Perbaikan</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* Tabel Transkrip Rapor Mahasiswa */}
        <Card className="border border-zinc-200 dark:border-zinc-800 shadow-md overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-100/80 dark:bg-zinc-800/70 border-b border-zinc-200 dark:border-zinc-700/80 text-zinc-500 dark:text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-36">Pertemuan</th>
                  <th className="py-3.5 px-4">Materi &amp; Topik Perkuliahan</th>
                  <th className="py-3.5 px-4 w-48">Status Pemahaman</th>
                  <th className="py-3.5 px-4 w-40 text-center">Skor Tertinggi</th>
                  <th className="py-3.5 px-4 w-52 text-right">Aksi Mandiri</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-800/60">
                {filteredModules.map((mod) => {
                  const isCompleted = mod.status === "completed";
                  const isInProgress = mod.status === "in_progress";
                  const isPerfect = isCompleted && mod.totalScore >= 95;
                  const canImprove = isCompleted && mod.totalScore < 95;
                  const isBoss1 = mod.weekNumber === 8;
                  const isBoss2 = mod.weekNumber === 16;

                  return (
                    <tr
                      key={mod.moduleId}
                      className={`transition-colors group ${
                        isBoss1
                          ? "bg-amber-500/[0.04] dark:bg-amber-500/[0.06] hover:bg-amber-500/[0.08]"
                          : isBoss2
                          ? "bg-purple-500/[0.04] dark:bg-purple-500/[0.06] hover:bg-purple-500/[0.08]"
                          : canImprove
                          ? "bg-indigo-500/[0.02] hover:bg-indigo-500/[0.05]"
                          : "even:bg-zinc-50/50 dark:even:bg-zinc-800/20 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                      }`}
                    >
                      {/* Pertemuan */}
                      <td className="py-3.5 px-4 align-middle">
                        {isBoss1 ? (
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center font-mono font-black text-xs shrink-0 shadow-2xs">
                              08
                            </div>
                            <div>
                              <span className="font-bold text-xs text-zinc-900 dark:text-white flex items-center gap-1">
                                UTS <Trophy className="w-3 h-3 text-amber-500" />
                              </span>
                              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold tracking-tight">
                                Boss Fight 1
                              </span>
                            </div>
                          </div>
                        ) : isBoss2 ? (
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 flex items-center justify-center font-mono font-black text-xs shrink-0 shadow-2xs">
                              16
                            </div>
                            <div>
                              <span className="font-bold text-xs text-zinc-900 dark:text-white flex items-center gap-1">
                                UAS <Crown className="w-3 h-3 text-purple-500" />
                              </span>
                              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold tracking-tight">
                                Final Boss
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2.5">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 border ${
                              mod.weekNumber <= 7
                                ? "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20"
                                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                            }`}>
                              {String(mod.weekNumber).padStart(2, "0")}
                            </div>
                            <div>
                              <span className="font-bold text-xs text-zinc-900 dark:text-white block">
                                Minggu {mod.weekNumber}
                              </span>
                              <span className={`inline-block text-[10px] font-semibold ${
                                mod.weekNumber <= 7
                                  ? "text-cyan-600 dark:text-cyan-400"
                                  : "text-emerald-600 dark:text-emerald-400"
                              }`}>
                                {mod.weekNumber <= 7 ? "Dunia 1" : "Dunia 2"}
                              </span>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Topik Modul & Link Materi */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              href={`/modules/${mod.moduleId}?tab=theory`}
                              className="font-bold text-xs text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1"
                            >
                              {mod.moduleTitle}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 flex-wrap">
                            <Link
                              href={`/modules/${mod.moduleId}?tab=theory`}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700 text-[10px] font-medium transition-colors cursor-pointer"
                            >
                              <BookOpen className="w-3 h-3 text-indigo-500" />
                              <span>Baca Modul</span>
                            </Link>
                            <Link
                              href={`/modules/${mod.moduleId}?tab=lab`}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700 text-[10px] font-medium transition-colors cursor-pointer"
                            >
                              <Zap className="w-3 h-3 text-emerald-500" />
                              <span>Lab &amp; Prompt AI</span>
                            </Link>
                            <span className="text-[10px] text-zinc-300 dark:text-zinc-600 hidden md:inline">•</span>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate hidden md:inline">
                              {mod.worldTitle}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 align-middle">
                        {isPerfect ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-2xs">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>Sempurna (100)</span>
                          </div>
                        ) : isCompleted ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Lulus Tuntas</span>
                          </div>
                        ) : mod.resetCount > 0 ? (
                          <div
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                            title="Sesi sebelumnya ter-reset ke Soal 1 karena jendela peramban kehilangan fokus atau berpindah tab."
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            <span>Belum Tuntas ({mod.resetCount}x Reset)</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                            <span>Belum Dikerjakan</span>
                          </div>
                        )}
                      </td>

                      {/* Skor Tertinggi */}
                      <td className="py-3.5 px-4 align-middle text-center">
                        {isCompleted ? (
                          <div className="inline-flex flex-col items-center gap-1 min-w-[90px]">
                            <div className="flex items-center justify-center gap-1.5">
                              <span
                                className={`font-mono font-black text-sm ${
                                  isPerfect
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : mod.totalScore >= 80
                                    ? "text-indigo-600 dark:text-indigo-400"
                                    : "text-amber-600 dark:text-amber-400"
                                }`}
                              >
                                {mod.totalScore}
                              </span>
                              <span className="text-[10px] text-zinc-400 font-mono">/100</span>
                              <Badge
                                className={`text-[9px] px-1.5 py-0 font-mono font-bold leading-tight ${
                                  mod.totalScore >= 90
                                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30"
                                    : mod.totalScore >= 80
                                    ? "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30"
                                    : "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                                }`}
                              >
                                {mod.totalScore >= 90 ? "A" : mod.totalScore >= 80 ? "AB" : "B"}
                              </Badge>
                            </div>
                            <div className="w-20 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700/60">
                              <div
                                className={`h-full rounded-full ${
                                  isPerfect
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                                    : "bg-gradient-to-r from-indigo-500 to-purple-500"
                                }`}
                                style={{ width: `${mod.totalScore}%` }}
                              />
                            </div>
                            {canImprove && (
                              <p className="text-[9px] text-indigo-600 dark:text-indigo-400 font-semibold tracking-tight">
                                Target: 100 🎯
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center font-mono text-xs text-zinc-400 px-3 py-1 rounded-md bg-zinc-100/60 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/40">
                            —
                          </div>
                        )}
                      </td>

                      {/* Aksi Mahasiswa */}
                      <td className="py-3.5 px-4 align-middle text-right">
                        {canImprove ? (
                          <Button
                            size="sm"
                            disabled={isPending}
                            onClick={() => handleRetakeModule(mod.moduleId)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-8 px-3 rounded-xl gap-1.5 shadow-sm transition-all hover:scale-102 cursor-pointer"
                            title="Tingkatkan nilai ke 100. Nilai tertinggi sebelumnya dijamin aman!"
                          >
                            <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
                            <span>Tingkatkan Nilai</span>
                          </Button>
                        ) : isPerfect ? (
                          <Link href={`/modules/${mod.moduleId}?tab=quiz`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-8 px-3 rounded-xl border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 gap-1.5 font-semibold cursor-pointer"
                            >
                              <Star className="w-3.5 h-3.5 fill-emerald-500" />
                              <span>Review Soal</span>
                            </Button>
                          </Link>
                        ) : mod.resetCount > 0 ? (
                          <Link href={`/modules/${mod.moduleId}?tab=quiz`}>
                            <Button
                              size="sm"
                              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs h-8 px-3 rounded-xl gap-1.5 shadow-sm cursor-pointer"
                              title="Sesi sebelumnya ter-reset. Ujian dimulai kembali dari Soal 1 dalam satu sesi penuh tanpa berpindah tab."
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Mulai Kuis (Soal 1)</span>
                            </Button>
                          </Link>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <Link href={`/modules/${mod.moduleId}?tab=quiz`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-8 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 gap-1.5 font-semibold cursor-pointer hover:bg-indigo-500/5 transition-all"
                              >
                                <span>Mulai Kuis</span>
                                <ArrowRight className="w-3 h-3 text-zinc-400" />
                              </Button>
                            </Link>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Summary Footer */}
          <div className="p-3.5 px-4 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
            <div className="flex items-center gap-4">
              <span>
                Total Tuntas: <strong className="text-zinc-900 dark:text-white font-mono">{stats.completedCount} / 16</strong>
              </span>
              <span>•</span>
              <span>
                Rata-rata: <strong className="text-zinc-900 dark:text-white font-mono">{stats.averageScore > 0 ? stats.averageScore : "—"}</strong> ({stats.gradeLetter})
              </span>
            </div>
            <Link
              href="/"
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium text-xs"
            >
              <span>Lihat Roadmap Lengkap di Beranda</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>
      </section>

      {/* Modal Ubah Kata Sandi */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">Ganti Kata Sandi</h3>
                </div>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm"
                >
                  ✕
                </button>
              </div>

              {passwordMsg && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    passwordMsg.isError
                      ? "bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400"
                      : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {passwordMsg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Kata Sandi Lama
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Masukkan sandi saat ini..."
                    className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Kata Sandi Baru (Min. 4 karakter)
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan sandi baru..."
                    className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isChangingPass}
                  className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 rounded-xl"
                >
                  {isChangingPass ? "Memperbarui..." : "Simpan Kata Sandi"}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
