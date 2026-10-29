"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldAlert,
  Award,
  Users,
  CheckCircle2,
  Clock,
  RotateCcw,
  Search,
  Filter,
  ArrowLeft,
  KeyRound,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  UserPlus,
  Upload,
  LogOut,
  Lock,
  UserCheck,
  ShieldCheck,
  FlaskConical,
  Activity,
  AlertTriangle,
  User,
  MessageSquare,
  Bot,
  Fingerprint,
  Eye,
  EyeOff,
  Maximize2
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getLecturerMonitoringDataAction } from "@/actions/quiz-evaluator";
import { resetStudentPasswordByLecturerAction } from "@/actions/student-auth";
import {
  getLecturerSessionAction,
  loginLecturerAction,
  logoutLecturerAction,
  changeLecturerPasswordAction,
  bulkImportStudentsAction,
  LecturerSession
} from "@/actions/lecturer-auth";
import { MODULES } from "@/data/curriculum";
import { LecturerPracticumTab } from "@/components/practicum/lecturer-practicum-tab";
import { StudentManagementTab } from "@/components/dosen/student-management-tab";

interface StudentRow {
  nim: string;
  fullName: string;
  classGroup: string;
}

interface SubmissionRow {
  id?: string;
  student_nim: string;
  module_id: number;
  current_question_index: number;
  reset_count: number;
  total_score: number;
  status: string;
  started_at?: string;
  completed_at?: string;
  updated_at?: string;
  activity_logs?: { timestamp: string; type: string; message: string }[];
}

interface WarmupRow {
  student_nim?: string;
  studentNim?: string;
  module_id?: number;
  moduleId?: number;
  messages: { role: string; text: string; timestamp?: string }[];
  writing_metrics?: {
    avgSentenceLength?: number;
    conjunctionVariety?: number;
    reflectiveTone?: number;
    totalSampleWords?: number;
  };
  completed_at?: string;
  completedAt?: string;
}

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarColor = (name: string) => {
  const colors = [
    "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
    "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
};

const getClassBadgeColor = (classGroup: string) => {
  const lower = classGroup.toLowerCase();
  if (lower.includes("a")) return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25";
  if (lower.includes("b")) return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/25";
  if (lower.includes("sp")) return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25";
  return "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-500/25";
};

export default function DosenPortalPage() {
  // State Sesi Dosen
  const [lecturerSession, setLecturerSession] = useState<LecturerSession | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  // State Monitoring Data
  const [activePortalTab, setActivePortalTab] = useState<"quiz" | "practicum" | "students">("quiz");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [warmups, setWarmups] = useState<WarmupRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("sp5.1");
  const [selectedModule, setSelectedModule] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [detailModalStudent, setDetailModalStudent] = useState<StudentRow | null>(null);
  const [detailModalTab, setDetailModalTab] = useState<"answers" | "warmup" | "logs">("answers");
  const [expandedRubrics, setExpandedRubrics] = useState<Record<number, boolean>>({});
  const [expandedAttempts, setExpandedAttempts] = useState<Record<number, boolean>>({});
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // State Modal Import Mahasiswa
  const [showImportModal, setShowImportModal] = useState(false);
  const [rawImportText, setRawImportText] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState("");

  // State Modal Konfirmasi Reset Password Mahasiswa
  const [studentToReset, setStudentToReset] = useState<StudentRow | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  // State Modal Ubah Password Dosen
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");

  // Fullscreen State
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (typeof document !== "undefined") {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Cek Sesi Dosen saat mount
  useEffect(() => {
    async function checkAuth() {
      const res = await getLecturerSessionAction();
      if (res.isAuthenticated && res.lecturer) {
        setLecturerSession(res.lecturer);
        await fetchData();
      }
      setAuthLoading(false);
    }
    checkAuth();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const data = await getLecturerMonitoringDataAction("all");
    setStudents(data.students);
    setSubmissions(data.submissions);
    setAnswers(data.answers);
    setWarmups((data as any).warmups || []);
    setLoading(false);
  };

  const handleLecturerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    const res = await loginLecturerAction(usernameInput, passwordInput);
    if (res.success && res.lecturer) {
      setLecturerSession(res.lecturer);
      await fetchData();
    } else {
      setAuthError(res.message);
    }
    setAuthLoading(false);
  };

  const handleLecturerLogout = async () => {
    await logoutLecturerAction();
    setLecturerSession(null);
  };

  const confirmResetPassword = async () => {
    if (!studentToReset) return;
    setResetLoading(true);
    const res = await resetStudentPasswordByLecturerAction(studentToReset.nim);
    setActionMessage(res.message);
    setResetLoading(false);
    setStudentToReset(null);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleBulkImport = async () => {
    if (!rawImportText.trim()) return;
    setImportLoading(true);
    setImportError("");

    const res = await bulkImportStudentsAction(rawImportText, selectedClass);
    if (res.success) {
      setActionMessage(res.message);
      setShowImportModal(false);
      setRawImportText("");
      await fetchData();
    } else {
      setImportError(res.message);
    }
    setImportLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg("");
    const res = await changeLecturerPasswordAction(oldPassword, newPassword);
    setPasswordMsg(res.message);
    if (res.success) {
      setTimeout(() => setShowPasswordModal(false), 2000);
    }
  };

  // 1. Tampilan Loading Awal Sesi Dosen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Memeriksa Hak Akses Dosen Pengampu...
        </p>
      </div>
    );
  }

  // 2. Tampilan Form Login Dosen (Username & Password)
  if (!lecturerSession) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 selection:bg-amber-500/20">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-between mb-2">
              <Link
                href="/"
                onClick={() => {
                  if (typeof document !== "undefined" && document.fullscreenElement) {
                    document.exitFullscreen().catch(() => {});
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda Utama</span>
              </Link>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300 hover:text-amber-800 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30 transition-all cursor-pointer shadow-xs"
                title={isFullscreen ? "Keluar Layar Penuh" : "Aktifkan Layar Penuh (Sembunyikan URL)"}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{isFullscreen ? "Layar Penuh" : "Mode Layar Penuh"}</span>
              </button>
            </div>
            <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-xl mx-auto bg-amber-50 dark:bg-amber-950/40">
              <Image
                src="/dosen.png"
                alt="Foto Profil Dosen Pengampu"
                fill
                className="object-cover object-top"
                sizes="96px"
                priority
              />
              <span
                className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900 shadow-xs"
                title="Dosen Pengampu Aktif"
              />
            </div>
            <h1 className="text-2xl font-black text-foreground">
              Portal Dosen Pengampu
            </h1>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
              Hadiq, ST, M.Kom
            </p>
            <p className="text-xs text-muted-foreground">
              STIKOM PGRI Banyuwangi • Matakuliah: <span className="font-mono font-semibold">KK112112</span> | Praktikum: <span className="font-mono font-semibold">KK112113</span>
            </p>
          </div>

          <Card className="border border-border shadow-2xl bg-card">
            <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
            <CardContent className="p-6 md:p-8 space-y-5">
              {authError && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLecturerLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan username..."
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background/80 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all font-mono"
                    autoFocus
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      required
                      placeholder="Masukkan password..."
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full px-3.5 pr-10 py-2.5 rounded-xl border border-input bg-background/80 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowLoginPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                      title={showLoginPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={authLoading}
                  className="w-full h-10 font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 rounded-xl gap-2 text-xs cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Masuk ke Dashboard</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 3. Tampilan Dashboard Monitoring Dosen (Telah Terautentikasi)
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === "all" || s.classGroup === selectedClass;
    return matchesSearch && matchesClass;
  });

  const targetModule = MODULES.find((m) => m.id === selectedModule) || MODULES[0];
  const totalQuestions = targetModule.quiz?.questions.length || 5;

  const moduleSubmissions = submissions.filter((s) => s.module_id === selectedModule);
  const completedCount = moduleSubmissions.filter((s) => s.status === "completed").length;
  const inProgressCount = moduleSubmissions.filter(
    (s) => s.status === "in_progress" && s.current_question_index > 0
  ).length;
  const totalResets = moduleSubmissions.reduce((acc, curr) => acc + (curr.reset_count || 0), 0);

  // Daftar kelas unik dari database (selalu menyertakan sp5.1 terdepan)
  const availableClasses: string[] = Array.from(
    new Set(["sp5.1", ...students.map((s) => s.classGroup).filter(Boolean)])
  ).sort((a, b) => (a === "sp5.1" ? -1 : b === "sp5.1" ? 1 : a.localeCompare(b)));

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-amber-500/20">
      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 text-xs">
                <ArrowLeft className="w-4 h-4" />
                <span>Beranda</span>
              </Button>
            </Link>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-amber-500/50 shadow-sm shrink-0 bg-amber-500/10">
                <Image
                  src="/dosen.png"
                  alt="Foto Resmi Dosen Pengampu"
                  fill
                  className="object-cover object-top"
                  sizes="36px"
                  priority
                />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground leading-tight">
                  Dashboard Monitoring Dosen
                </h1>
                <p className="text-[11px] text-muted-foreground font-medium">
                  {lecturerSession.fullName}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImportModal(true)}
              className="gap-1.5 text-xs h-8 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 font-semibold"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Import Mahasiswa</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              className="gap-1.5 text-xs h-8"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Segarkan</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPasswordModal(true)}
              className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ubah Password</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLecturerLogout}
              className="text-xs h-8 gap-1.5 text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner Pesan Aksi */}
        {actionMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionMessage}</span>
            </div>
            <button
              onClick={() => setActionMessage(null)}
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Portal Sub-Header Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 w-fit">
          <button
            type="button"
            onClick={() => setActivePortalTab("quiz")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activePortalTab === "quiz"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs border border-zinc-200/80 dark:border-zinc-700"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>Monitoring Kuis Teori</span>
          </button>
          <button
            type="button"
            onClick={() => setActivePortalTab("practicum")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activePortalTab === "practicum"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs border border-zinc-200/80 dark:border-zinc-700"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <FlaskConical className="w-4 h-4 text-indigo-500" />
            <span>Monitoring Laporan Praktikum (7 Modul)</span>
          </button>
          <button
            type="button"
            onClick={() => setActivePortalTab("students")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activePortalTab === "students"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs border border-zinc-200/80 dark:border-zinc-700"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Users className="w-4 h-4 text-emerald-500" />
            <span>Manajemen Data Mahasiswa</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
              {students.length}
            </span>
          </button>
        </div>

        {activePortalTab === "practicum" ? (
          <LecturerPracticumTab selectedClass={selectedClass} />
        ) : activePortalTab === "students" ? (
          <StudentManagementTab
            onOpenImportModal={() => setShowImportModal(true)}
            onRefreshParent={fetchData}
          />
        ) : (
          <>
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border border-border/80 shadow-sm bg-card/60 backdrop-blur-xs">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Total Mahasiswa</p>
                <p className="text-2xl font-bold font-mono text-foreground">{students.length}</p>
                <p className="text-[10px] text-muted-foreground">Roster Kelas Aktif</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/80 shadow-sm bg-card/60 backdrop-blur-xs">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Kuis Tuntas 100%</p>
                <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {completedCount}
                </p>
                <p className="text-[10px] text-muted-foreground">Ambang Batas Nilai &ge; 80</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/80 shadow-sm bg-card/60 backdrop-blur-xs">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Sedang Mengerjakan</p>
                <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
                  {inProgressCount}
                </p>
                <p className="text-[10px] text-muted-foreground">Dalam Proses Revisi</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/80 shadow-sm bg-card/60 backdrop-blur-xs">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Pelanggaran Reset Layar</p>
                <p className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
                  {totalResets}x
                </p>
                <p className="text-[10px] text-muted-foreground">Deteksi Blur/Tab Switch</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Modul */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Pilih Modul:</span>
              <div className="flex gap-1.5 flex-wrap">
                {[1, 2, 3, 4, 5].map((mId) => (
                  <button
                    key={mId}
                    onClick={() => setSelectedModule(mId)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      selectedModule === mId
                        ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                        : "bg-muted/60 text-muted-foreground hover:text-foreground border-border"
                    }`}
                  >
                    Modul {mId}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-6 w-px bg-border hidden sm:block" />

            {/* Filter Kelas */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Kelas:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-input bg-background text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="sp5.1">sp5.1</option>
                <option value="all">Semua Kelas</option>
                {availableClasses
                  .filter((cls: string) => cls !== "sp5.1")
                  .map((cls: string) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari NIM atau Nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Tabel Rekapitulasi Mahasiswa */}
        <Card className="border border-border/80 shadow-md overflow-hidden bg-card/90 backdrop-blur-xs rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-muted/70 border-b border-border/80 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3.5 px-4 font-mono uppercase tracking-wider text-[11px]">NIM</th>
                  <th className="py-3.5 px-4 uppercase tracking-wider text-[11px]">Mahasiswa</th>
                  <th className="py-3.5 px-4 uppercase tracking-wider text-[11px]">Kelas</th>
                  <th className="py-3.5 px-4 uppercase tracking-wider text-[11px]">Status Modul {selectedModule}</th>
                  <th className="py-3.5 px-4 uppercase tracking-wider text-[11px]" title="Sesi obrolan santai pemanasan & rata-rata skor otentisitas gaya bahasa">Pemanasan &amp; Orisinalitas</th>
                  <th className="py-3.5 px-4 uppercase tracking-wider text-[11px]">Kemajuan Soal</th>
                  <th className="py-3.5 px-4 text-center uppercase tracking-wider text-[11px]" title="Rata-rata dari nilai tertinggi semua soal pertemuan ini">Nilai Modul (Rata-rata)</th>
                  <th className="py-3.5 px-4 text-center uppercase tracking-wider text-[11px]">Integritas / Reset</th>
                  <th className="py-3.5 px-4 text-right uppercase tracking-wider text-[11px]">Aksi Dosen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-muted-foreground">
                      <div className="max-w-sm mx-auto space-y-2">
                        <Users className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                        <p className="font-semibold text-foreground text-sm">Tidak ada mahasiswa yang cocok</p>
                        <p className="text-xs">
                          Coba sesuaikan kata kunci pencarian atau klik tombol <strong>"Import Mahasiswa"</strong> di atas.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => {
                    const sub = submissions.find(
                      (sub) => sub.student_nim === s.nim && sub.module_id === selectedModule
                    );
                    const isCompleted = sub?.status === "completed";
                    const currentQ = sub?.current_question_index || 0;
                    const score = Number(sub?.total_score) || 0;
                    const resets = sub?.reset_count || 0;

                    const studentWarmup = warmups.find(
                      (w) =>
                        (w.student_nim === s.nim || w.studentNim === s.nim) &&
                        Number(w.module_id || w.moduleId) === Number(selectedModule)
                    );
                    const hasWarmup = Boolean(studentWarmup && studentWarmup.messages && studentWarmup.messages.length > 0);

                    const studentAnsList = answers.filter(
                      (a) =>
                        a.student_nim === s.nim &&
                        Number(a.module_id) === Number(selectedModule) &&
                        a.authenticity_score !== undefined &&
                        a.authenticity_score !== null
                    );
                    const avgAuthenticity =
                      studentAnsList.length > 0
                        ? Math.round(
                            studentAnsList.reduce((acc, a) => acc + Number(a.authenticity_score || 0), 0) /
                              studentAnsList.length
                          )
                        : null;

                    return (
                      <tr
                        key={s.nim}
                        className="hover:bg-muted/40 transition-colors group"
                      >
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-xs font-semibold text-foreground bg-muted/70 px-2 py-1 rounded-md border border-border/60">
                            {s.nim}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold border shrink-0 shadow-2xs ${getAvatarColor(s.fullName)}`}>
                              {getInitials(s.fullName)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground text-xs leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                {s.fullName}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                Mahasiswa Aktif
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getClassBadgeColor(s.classGroup)}`}>
                            {s.classGroup}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Tuntas 100%</span>
                            </span>
                          ) : resets > 0 && currentQ === 0 ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30" title="Mahasiswa ter-reset akibat pelanggaran fokus layar/waktu dan harus mengulang dari Soal 1">
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Ter-reset (Ulang Soal 1)</span>
                            </span>
                          ) : currentQ > 0 ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                              <span>Soal {currentQ} dari {totalQuestions}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-muted/60 text-muted-foreground border border-border/60">
                              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                              <span>Belum Memulai</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            {hasWarmup ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/25">
                                <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                                <span>Pemanasan Selesai</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-muted/60 text-muted-foreground border border-border/60">
                                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                                <span>Belum Pemanasan</span>
                              </span>
                            )}
                            {avgAuthenticity !== null && (
                              <div className="text-[10px] font-mono flex items-center gap-1">
                                <span className="text-muted-foreground">Otentisitas:</span>
                                <span
                                  className={`font-bold ${
                                    avgAuthenticity >= 85
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : avgAuthenticity >= 70
                                      ? "text-amber-600 dark:text-amber-400"
                                      : "text-rose-600 dark:text-rose-400"
                                  }`}
                                >
                                  {avgAuthenticity}%
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-1.5 max-w-[140px]">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-semibold text-foreground">
                                {isCompleted ? totalQuestions : currentQ} / {totalQuestions} Soal
                              </span>
                              <span className={`font-mono font-bold ${
                                isCompleted
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : currentQ > 0
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-muted-foreground"
                              }`}>
                                {Math.round(
                                  ((isCompleted ? totalQuestions : currentQ) / totalQuestions) * 100
                                )}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-muted/80 rounded-full overflow-hidden border border-border/30">
                              <div
                                className={`h-full transition-all duration-300 rounded-full ${
                                  isCompleted
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                                    : currentQ > 0
                                    ? "bg-gradient-to-r from-amber-500 to-orange-400"
                                    : "bg-transparent"
                                }`}
                                style={{
                                  width: `${
                                    ((isCompleted ? totalQuestions : currentQ) / totalQuestions) * 100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {isCompleted && score > 0 ? (
                            <span
                              className={`inline-block font-mono font-bold text-xs px-2.5 py-0.5 rounded-md border ${
                                score >= 80
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25"
                              }`}
                            >
                              {score}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/60 text-xs font-mono" title={score > 0 ? `Nilai sementara: ${score} (Belum tuntas seluruh soal)` : "Belum ada nilai resmi"}>
                              -
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {resets > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 text-[10px] font-bold animate-pulse">
                              <ShieldAlert className="w-3 h-3" />
                              <span>{resets}x Reset</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/70" />
                              <span>0 (Aman)</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setDetailModalStudent(s)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all cursor-pointer shadow-2xs"
                              title="Lihat detail pengerjaan mahasiswa"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Detail</span>
                            </button>
                            <button
                              onClick={() => setStudentToReset(s)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all cursor-pointer shadow-2xs"
                              title="Reset kata sandi mahasiswa kembali ke nilai NIM default"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                              <span>Reset Sandi</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
          </>
        )}
      </main>

      {/* Modal Import Mahasiswa */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-xl border border-border shadow-2xl bg-card">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-amber-500" />
                  Import Daftar Mahasiswa ke Database
                </CardTitle>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-muted-foreground hover:text-foreground text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {importError && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                  {importError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Tempelkan Teks Daftar Mahasiswa:
                </label>
                <p className="text-[11px] text-muted-foreground">
                  Format per baris: <code className="font-mono text-foreground font-semibold">NIM, Nama Mahasiswa, Kelas</code> (Bisa langsung copy-paste kolom dari Excel atau CSV).
                </p>
                <textarea
                  rows={8}
                  placeholder={`Contoh:\n202401001, Budi Santoso, Kelas A\n202401002, Siti Rahmawati, Kelas A\n1124102161, IZZA AULIA MAGHFIROH, sp5.1`}
                  value={rawImportText}
                  onChange={(e) => setRawImportText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-input bg-background text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImportModal(false)}
                  className="text-xs"
                >
                  Batal
                </Button>
                <Button
                  size="sm"
                  disabled={importLoading || !rawImportText.trim()}
                  onClick={handleBulkImport}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold gap-1.5"
                >
                  {importLoading ? (
                    <>
                      <Cpu className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan ke Database...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Simpan ke Database</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Detail Jawaban & Log Aktivitas Mahasiswa */}
      {detailModalStudent && (() => {
        const currentSub = submissions.find(
          (sub) => sub.student_nim === detailModalStudent.nim && Number(sub.module_id) === Number(selectedModule)
        );

        const studentAnswers: any[] = answers.filter((a) => {
          if (currentSub?.id && a.submission_id === currentSub.id) return true;
          return a.student_nim === detailModalStudent.nim && Number(a.module_id) === Number(selectedModule);
        });

        // Cari sesi obrolan pemanasan santai mahasiswa untuk modul ini
        const currentWarmup = warmups.find(
          (w) =>
            (w.student_nim === detailModalStudent.nim || w.studentNim === detailModalStudent.nim) &&
            Number(w.module_id || w.moduleId) === Number(selectedModule)
        );
        const hasWarmup = Boolean(currentWarmup && currentWarmup.messages && currentWarmup.messages.length > 0);

        // Hitung rata-rata otentisitas jika ada penilaian otentisitas
        const studentAnsWithAuth = studentAnswers.filter(
          (a) => a.authenticity_score !== undefined && a.authenticity_score !== null
        );
        const avgAuthenticity =
          studentAnsWithAuth.length > 0
            ? Math.round(
                studentAnsWithAuth.reduce((acc, a) => acc + Number(a.authenticity_score || 0), 0) /
                  studentAnsWithAuth.length
              )
            : null;

        // Kelompokkan jawaban berdasarkan nomor soal (1-based index)
        const answersByQuestion = new Map<number, any[]>();
        studentAnswers.forEach((a) => {
          const qNum = Number(a.question_number);
          const list = answersByQuestion.get(qNum) || [];
          list.push(a);
          answersByQuestion.set(qNum, list);
        });

        const totalQuestions = targetModule.quiz?.questions.length || 0;
        const answeredQuestionsCount = answersByQuestion.size;

        // Hitung nilai terbaik per soal dan nilai rata-rata modul
        const bestScoresPerQ: number[] = [];
        answersByQuestion.forEach((attempts) => {
          const maxQ = Math.max(...attempts.map((a) => Number(a.score) || 0), 0);
          bestScoresPerQ.push(maxQ);
        });
        const isCompleted = currentSub?.status === "completed" || (totalQuestions > 0 && answeredQuestionsCount >= totalQuestions);
        const divisor = isCompleted && totalQuestions > 0 ? totalQuestions : (bestScoresPerQ.length || 1);
        const calculatedModuleAvg =
          bestScoresPerQ.length > 0
            ? Math.round((bestScoresPerQ.reduce((acc, sc) => acc + sc, 0) / divisor) * 10) / 10
            : Number(currentSub?.total_score) || 0;
        const totalScore = calculatedModuleAvg;
        const resetCount = currentSub?.reset_count || 0;

        // Susun Linimasa Kronologis Aktivitas Mahasiswa
        const timelineEvents: {
          id: string;
          timestamp: string;
          type: "start" | "answer_passed" | "answer_failed" | "violation" | "completed";
          title: string;
          description: string;
          badgeText?: string;
          badgeColor?: string;
        }[] = [];

        // 1. Sesi Dimulai
        if (currentSub?.started_at) {
          timelineEvents.push({
            id: "event-start",
            timestamp: currentSub.started_at,
            type: "start",
            title: "Sesi Pengerjaan Kuis Dimulai",
            description: `Mahasiswa membuka lembar kuis evaluasi Modul ${selectedModule}: ${targetModule.title}.`,
            badgeText: "Mulai Sesi",
            badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
          });
        }

        // 1.1 Sesi Pemanasan Santai Selesai
        if (currentWarmup?.completed_at) {
          timelineEvents.push({
            id: "event-warmup",
            timestamp: currentWarmup.completed_at,
            type: "start",
            title: "Sesi Pemanasan Santai (Warm-up Check-in) Selesai",
            description: `Mahasiswa menyelesaikan dialog santai ${currentWarmup.messages.length} pesan dengan AI Companion dan membentuk baseline profil gaya bahasa.`,
            badgeText: "Pemanasan Tuntas",
            badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30",
          });
        }

        // 2. Event Jawaban yang Dikirim Mahasiswa
        studentAnswers.forEach((ans, aIdx) => {
          const isPassed = ans.is_passed || Number(ans.score) >= 80;
          timelineEvents.push({
            id: `event-ans-${ans.id || aIdx}`,
            timestamp: ans.created_at || currentSub?.updated_at || new Date().toISOString(),
            type: isPassed ? "answer_passed" : "answer_failed",
            title: `Mengirim Jawaban Soal #${ans.question_number}`,
            description: `Skor Evaluasi: ${ans.score}/100 • Evaluator: ${ans.ai_provider || "Groq (Primary)"} • Status: ${isPassed ? "Tuntas (Lolos >= 80)" : "Belum Lolos (< 80, Perlu Revisi)"}${ans.authenticity_score ? ` • Otentisitas: ${ans.authenticity_score}%` : ""}`,
            badgeText: `${ans.score} Poin`,
            badgeColor: isPassed
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
          });
        });

        // 3. Event Pelanggaran Integritas Ujian (Jika ada insiden reset)
        if (resetCount > 0) {
          timelineEvents.push({
            id: "event-violation",
            timestamp: currentSub?.updated_at || currentSub?.started_at || new Date().toISOString(),
            type: "violation",
            title: `Audit Integritas: ${resetCount}x Hard Reset Terdeteksi`,
            description: `Sistem anti-cheat mencatat ${resetCount} kali insiden pelanggaran (layar peramban kehilangan fokus, berpindah tab/jendela, atau batas waktu habis). Sesi otomatis di-reset kembali ke Soal 1.`,
            badgeText: `${resetCount}x Reset`,
            badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
          });
        }

        // 4. Event Selesai Kuis
        if (currentSub?.completed_at || currentSub?.status === "completed") {
          timelineEvents.push({
            id: "event-completed",
            timestamp: currentSub?.completed_at || currentSub?.updated_at || new Date().toISOString(),
            type: "completed",
            title: "Kuis Selesai & Lulus 100%",
            description: `Mahasiswa berhasil menuntaskan seluruh ${totalQuestions} soal esai dengan nilai akhir ${totalScore}/100.`,
            badgeText: "100% Tuntas",
            badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          });
        }

        // Urutkan event terbaru di atas
        timelineEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
            <Card className="w-full max-w-4xl max-h-[92vh] flex flex-col border border-border shadow-2xl bg-card rounded-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="p-4 md:p-5 border-b border-border flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-foreground leading-snug">
                      Detail Rekam Jejak Jawaban: {detailModalStudent.fullName}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 flex-wrap">
                      <span>NIM: <strong className="font-mono text-foreground">{detailModalStudent.nim}</strong></span>
                      <span>•</span>
                      <Badge variant="outline" className="font-mono text-[10px] py-0 px-1.5">
                        Kelas {detailModalStudent.classGroup}
                      </Badge>
                      <span>•</span>
                      <span>Modul {selectedModule}: {targetModule.title}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setDetailModalStudent(null);
                    setDetailModalTab("answers");
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted text-sm font-bold cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body Container */}
              <div className="p-4 md:p-6 overflow-y-auto space-y-5 text-xs flex-1">
                {/* 5 Overview Metric Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {/* Metric 1: Status Sesi */}
                  <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                      <span>Status Kuis</span>
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <div>
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Selesai &amp; Lolos
                        </span>
                      ) : answeredQuestionsCount > 0 ? (
                        <span className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          Soal {answeredQuestionsCount} / {totalQuestions}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-muted-foreground text-xs">
                          Belum Dimulai
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {isCompleted ? "Seluruh soal tuntas" : `${totalQuestions - answeredQuestionsCount} soal tersisa`}
                    </p>
                  </div>

                  {/* Metric 2: Skor Rata-rata Modul */}
                  <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                      <span>Nilai Modul</span>
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-base font-black ${
                        totalScore >= 80 ? "text-emerald-600 dark:text-emerald-400" : totalScore > 0 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                      }`}>
                        {totalScore}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">/ 100</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {totalScore >= 80 ? "Rata-rata Lulus (>= 80)" : totalScore > 0 ? "Rata-rata < 80" : "Belum Ada Nilai"}
                    </p>
                  </div>

                  {/* Metric 3: Audit Integritas Anti-Cheat */}
                  <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                      <span>Integritas Layar</span>
                      {resetCount > 0 ? (
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                    </div>
                    <div>
                      {resetCount > 0 ? (
                        <span className="inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400 text-xs">
                          ⚠️ {resetCount}x Hard Reset
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                          0x Reset (Disiplin)
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {resetCount > 0 ? "Pelanggaran fokus layar" : "Sesi pengerjaan disiplin"}
                    </p>
                  </div>

                  {/* Metric 4: Pemanasan Santai (Warm-up) */}
                  <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                      <span>Pemanasan Santai</span>
                      <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                    </div>
                    <div>
                      {currentWarmup && hasWarmup ? (
                        <span className="inline-flex items-center gap-1 font-bold text-teal-600 dark:text-teal-400 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Tuntas ({currentWarmup.messages?.length || 0} Pesan)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-muted-foreground text-xs">
                          Belum Pemanasan
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {hasWarmup ? "Baseline gaya bahasa siap" : "Prasyarat kuis belum selesai"}
                    </p>
                  </div>

                  {/* Metric 5: Rata-rata Otentisitas AI */}
                  <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                      <span>Rata-rata Otentisitas</span>
                      <Fingerprint className="w-3.5 h-3.5 text-indigo-500" />
                    </div>
                    <div className="flex items-baseline gap-1">
                      {avgAuthenticity !== null ? (
                        <span className={`text-base font-black ${
                          avgAuthenticity >= 85
                            ? "text-emerald-600 dark:text-emerald-400"
                            : avgAuthenticity >= 70
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}>
                          {avgAuthenticity}%
                        </span>
                      ) : (
                        <span className="text-base font-bold text-muted-foreground">-</span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {avgAuthenticity !== null
                        ? avgAuthenticity >= 85
                          ? "Gaya bahasa selaras"
                          : "Variasi gaya wajar"
                        : "Belum ada evaluasi"}
                    </p>
                  </div>
                </div>

                {/* Sub-Header Tabs */}
                <div className="flex items-center gap-2 border-b border-border pb-2 pt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setDetailModalTab("answers")}
                    className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                      detailModalTab === "answers"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Jawaban &amp; Evaluasi Esai</span>
                    <Badge variant="outline" className={`ml-1 text-[10px] py-0 px-1 font-mono ${
                      detailModalTab === "answers" ? "border-white/30 text-white" : ""
                    }`}>
                      {answeredQuestionsCount} / {totalQuestions}
                    </Badge>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDetailModalTab("warmup")}
                    className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                      detailModalTab === "warmup"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Pemanasan Santai &amp; Baseline Gaya Bahasa</span>
                    {hasWarmup ? (
                      <Badge className="ml-1 text-[10px] py-0 px-1.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/30">
                        ✓ Tuntas
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="ml-1 text-[10px] py-0 px-1 font-mono text-muted-foreground">
                        Belum
                      </Badge>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDetailModalTab("logs")}
                    className={`px-3.5 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                      detailModalTab === "logs"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Log Aktivitas &amp; Audit Integritas</span>
                    <Badge variant="outline" className={`ml-1 text-[10px] py-0 px-1 font-mono ${
                      detailModalTab === "logs" ? "border-white/30 text-white" : ""
                    }`}>
                      {timelineEvents.length} Event
                    </Badge>
                  </button>
                </div>

                {/* TAB 1: JAWABAN ESAI & EVALUASI AI */}
                {detailModalTab === "answers" && (
                  <div className="space-y-4">
                    {/* Pedoman Perhitungan Nilai */}
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>
                          <strong>Standar Penilaian:</strong> Nilai tiap butir soal diambil dari <strong>skor tertinggi</strong> seluruh percobaan mahasiswa pada soal tersebut. Nilai modul adalah <strong>rata-rata dari nilai terbaik seluruh soal</strong>.
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-background/80 shrink-0 font-mono">
                        Rata-rata: {totalScore}/100
                      </Badge>
                    </div>

                    {targetModule.quiz?.questions.map((q, idx) => {
                      const qAttempts = answersByQuestion.get(idx + 1) || [];
                      const bestScore = qAttempts.length > 0 ? Math.max(...qAttempts.map((a) => Number(a.score) || 0)) : 0;
                      const latestAns = qAttempts[qAttempts.length - 1];
                      const isPassed = bestScore >= 80;
                      const isExpandedRubric = !!expandedRubrics[q.id];
                      const isExpandedAttempts = !!expandedAttempts[q.id];

                      return (
                        <div
                          key={q.id}
                          className="p-4 md:p-5 rounded-2xl border border-border bg-card/70 space-y-3 shadow-2xs"
                        >
                          {/* Header Soal & Status */}
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 pb-2 border-b border-border/70">
                            <div className="space-y-1">
                              <span className="font-bold text-foreground text-xs md:text-sm leading-snug block">
                                Soal #{idx + 1}: {q.question}
                              </span>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="text-[10px] text-muted-foreground font-mono">
                                  Bobot: {q.weight} Poin
                                </Badge>
                                {qAttempts.length > 1 && (
                                  <Badge variant="outline" className="text-[10px] text-indigo-600 dark:text-indigo-400 border-indigo-500/30 font-mono">
                                    {qAttempts.length}x Percobaan
                                  </Badge>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setExpandedRubrics(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                                  className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  {isExpandedRubric ? "Sembunyikan Rubrik ▲" : "Lihat Rubrik & Kata Kunci ▼"}
                                </button>
                              </div>
                            </div>

                            <div className="shrink-0">
                              {latestAns ? (
                                isPassed ? (
                                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px] font-bold py-1 px-2.5">
                                    ✓ Lolos (Skor Terbaik: {bestScore}/100)
                                  </Badge>
                                ) : (
                                  <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[11px] font-bold py-1 px-2.5">
                                    ✕ Perlu Revisi (Skor Terbaik: {bestScore}/100)
                                  </Badge>
                                )
                              ) : (
                                <Badge variant="outline" className="text-muted-foreground text-[10px]">
                                  Belum Dijawab
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Collapsible Rubric */}
                          {isExpandedRubric && (
                            <div className="p-3 rounded-xl bg-muted/40 border border-border/70 space-y-2 animate-in fade-in duration-150">
                              <div className="text-[11px] text-muted-foreground leading-relaxed">
                                <span className="font-bold text-foreground block mb-0.5">Rubrik Penilaian Standar:</span>
                                {q.rubric}
                              </div>
                              <div className="pt-1 flex flex-wrap gap-1 items-center">
                                <span className="text-[10px] text-muted-foreground font-semibold mr-1">Konsep Kunci:</span>
                                {q.keyConcepts.map((c, i) => (
                                  <span
                                    key={i}
                                    className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground border border-border/50"
                                  >
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Kotak Teks Jawaban Mahasiswa */}
                          {latestAns ? (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] font-semibold text-foreground">
                                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                                  <User className="w-3.5 h-3.5" />
                                  Teks Jawaban Mahasiswa:
                                </span>
                                {latestAns.created_at && (
                                  <span className="text-[10px] text-muted-foreground font-mono">
                                    Disubmit: {new Date(latestAns.created_at).toLocaleString("id-ID")}
                                  </span>
                                )}
                              </div>
                              <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs leading-relaxed whitespace-pre-wrap font-sans text-zinc-900 dark:text-zinc-100 shadow-2xs select-text">
                                {latestAns.student_answer}
                              </div>
                            </div>
                          ) : (
                            <div className="p-3.5 rounded-xl bg-muted/30 border border-dashed border-border text-center text-muted-foreground text-xs italic">
                              Mahasiswa belum mengirimkan jawaban untuk soal ini.
                            </div>
                          )}

                          {/* Kotak Hasil Evaluasi AI */}
                          {latestAns && (
                            <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/50 space-y-2">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                  <span className="font-bold text-xs text-indigo-950 dark:text-indigo-200">
                                    Skor Evaluasi AI: {latestAns.score} / 100
                                  </span>
                                  <Badge className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 text-[10px] font-mono">
                                    Model: {latestAns.ai_provider || "Groq (Qwen 3.8 27B)"}
                                  </Badge>
                                </div>
                                {qAttempts.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => setExpandedAttempts(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                                    className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    {isExpandedAttempts ? "Tutup Riwayat Percobaan ▲" : `Lihat ${qAttempts.length} Percobaan ▼`}
                                  </button>
                                )}
                              </div>
                              <p className="text-xs text-indigo-950/90 dark:text-indigo-200/90 leading-relaxed font-sans">
                                {latestAns.ai_feedback}
                              </p>

                              {/* Indikator Otentisitas AI */}
                              {(latestAns.authenticity_score !== undefined && latestAns.authenticity_score !== null) && (
                                <div className="mt-2.5 p-3 rounded-xl bg-teal-500/10 border border-teal-500/25 space-y-1.5">
                                  <div className="flex items-center justify-between flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                      <Fingerprint className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                      <span className="font-bold text-xs text-teal-950 dark:text-teal-200">
                                        Skor Otentisitas: {latestAns.authenticity_score}%
                                      </span>
                                      <Badge className={`text-[10px] font-semibold ${
                                        latestAns.authenticity_score >= 85
                                          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                                          : latestAns.authenticity_score >= 70
                                          ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30"
                                          : "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30"
                                      }`}>
                                        {latestAns.authenticity_score >= 85
                                          ? "Gaya Bahasa Selaras dengan Baseline"
                                          : latestAns.authenticity_score >= 70
                                          ? "Variasi Wajar"
                                          : "Indikasi Anomali / Kemungkinan AI"}
                                      </Badge>
                                    </div>
                                  </div>
                                  {latestAns.authenticity_notes && (
                                    <p className="text-[11px] text-teal-900/90 dark:text-teal-200/90 leading-relaxed font-sans italic">
                                      Catatan Otentisitas: &ldquo;{latestAns.authenticity_notes}&rdquo;
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Riwayat Percobaan Sebelumnya */}
                              {isExpandedAttempts && qAttempts.length > 1 && (
                                <div className="mt-3 pt-3 border-t border-indigo-200/60 dark:border-indigo-800/40 space-y-2">
                                  <span className="font-bold text-[11px] text-indigo-950 dark:text-indigo-200 block">
                                    Riwayat Seluruh Percobaan:
                                  </span>
                                  {qAttempts.map((attempt, attIdx) => (
                                    <div
                                      key={attIdx}
                                      className="p-2.5 rounded-lg bg-background/60 border border-border text-[11px] space-y-1"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-semibold text-foreground">
                                          Percobaan #{attIdx + 1}
                                        </span>
                                        <Badge className={`text-[10px] ${
                                          attempt.score >= 80
                                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                            : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                        }`}>
                                          Skor: {attempt.score}/100
                                        </Badge>
                                      </div>
                                      <p className="text-muted-foreground font-mono text-[10px] truncate">
                                        &quot;{attempt.student_answer}&quot;
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* TAB 2: PEMANASAN SANTAI & BASELINE GAYA BAHASA */}
                {detailModalTab === "warmup" && (
                  <div className="space-y-4">
                    {!currentWarmup || !hasWarmup ? (
                      <div className="p-8 rounded-2xl border border-dashed border-border text-center space-y-3 bg-muted/10">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-500">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-foreground text-sm">Belum Ada Sesi Pemanasan</h5>
                          <p className="text-muted-foreground text-xs max-w-md mx-auto">
                            Mahasiswa ini belum menyelesaikan sesi obrolan santai bersama AI Companion untuk Modul {selectedModule}.
                            Sesi pemanasan bersifat wajib sebagai prasyarat pengerjaan kuis dan dasar baseline gaya bahasa mahasiswa.
                          </p>
                        </div>
                      </div>
                    ) : (() => {
                      const warmup = currentWarmup!;
                      return (
                        <div className="space-y-4">
                          {/* Header Info Pemanasan & Profil Stilistika */}
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-teal-500/5 to-transparent border border-border space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/60">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                  <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-xs md:text-sm text-foreground">
                                    Profil Gaya Bahasa &amp; Baseline Pemanasan
                                  </h4>
                                  <p className="text-[11px] text-muted-foreground">
                                    Direkam otomatis saat obrolan santai 1–2 menit sebelum kuis dibuka.
                                  </p>
                                </div>
                              </div>
                              {warmup.completed_at && (
                                <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground self-start sm:self-auto">
                                  Selesai: {new Date(warmup.completed_at).toLocaleString("id-ID")}
                                </Badge>
                              )}
                            </div>

                            {/* Stylometric Metrics Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                              <div className="p-2.5 rounded-xl bg-background/80 border border-border space-y-1">
                                <span className="text-[10px] text-muted-foreground block">Panjang Rata-rata Kalimat</span>
                                <span className="font-mono font-bold text-xs text-foreground">
                                  {warmup.writing_metrics?.avgSentenceLength
                                    ? `${warmup.writing_metrics.avgSentenceLength} kata/kalimat`
                                    : "-"}
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-background/80 border border-border space-y-1">
                                <span className="text-[10px] text-muted-foreground block">Keragaman Kata Sambung</span>
                                <span className="font-mono font-bold text-xs text-foreground">
                                  {warmup.writing_metrics?.conjunctionVariety
                                    ? `${warmup.writing_metrics.conjunctionVariety} jenis`
                                    : "-"}
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-background/80 border border-border space-y-1">
                                <span className="text-[10px] text-muted-foreground block">Indeks Nada Reflektif</span>
                                <span className="font-mono font-bold text-xs text-foreground">
                                  {warmup.writing_metrics?.reflectiveTone
                                    ? `${warmup.writing_metrics.reflectiveTone}/100`
                                    : "-"}
                                </span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-background/80 border border-border space-y-1">
                                <span className="text-[10px] text-muted-foreground block">Sampel Kata Baseline</span>
                                <span className="font-mono font-bold text-xs text-foreground">
                                  {warmup.writing_metrics?.totalSampleWords
                                    ? `${warmup.writing_metrics.totalSampleWords} kata`
                                    : `${(warmup.messages || []).filter((m: any) => m.role === "student").reduce((sum: number, m: any) => sum + (m.text?.split(/\s+/).filter(Boolean).length || 0), 0)} kata`}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Transkrip Obrolan Hangat */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                                Transkrip Obrolan Mahasiswa dengan AI Companion ({warmup.messages?.length || 0} Pesan)
                              </span>
                              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                                Open-Book &amp; Relaxed Check-in
                              </Badge>
                            </div>

                            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                              {(warmup.messages || []).map((msg: any, mIdx: number) => {
                                const isStudent = msg.role === "student";
                                return (
                                  <div
                                    key={mIdx}
                                    className={`flex flex-col ${isStudent ? "items-end" : "items-start"}`}
                                  >
                                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-muted-foreground">
                                      {isStudent ? (
                                        <>
                                          <span className="font-semibold text-foreground">{detailModalStudent.fullName}</span>
                                          <span>(Mahasiswa)</span>
                                          <User className="w-3 h-3 text-indigo-500" />
                                        </>
                                      ) : (
                                        <>
                                          <Bot className="w-3 h-3 text-teal-500" />
                                          <span className="font-semibold text-foreground">AI Companion</span>
                                          <span>(Pendamping Santai)</span>
                                        </>
                                      )}
                                    </div>
                                    <div
                                      className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed select-text shadow-2xs ${
                                        isStudent
                                          ? "bg-indigo-600 text-white rounded-tr-xs"
                                          : "bg-muted/70 text-foreground border border-border/80 rounded-tl-xs"
                                      }`}
                                    >
                                      <p className="whitespace-pre-wrap font-sans">{msg.text}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* TAB 3: LOG AKTIVITAS & AUDIT INTEGRITAS */}
                {detailModalTab === "logs" && (
                  <div className="space-y-4">
                    {timelineEvents.length === 0 ? (
                      <div className="p-8 rounded-2xl border border-dashed border-border text-center space-y-2">
                        <Activity className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                        <h5 className="font-bold text-foreground text-sm">Belum Ada Aktivitas</h5>
                        <p className="text-muted-foreground text-xs">
                          Mahasiswa ini belum memulai atau mengirimkan jawaban kuis untuk Modul {selectedModule}.
                        </p>
                      </div>
                    ) : (
                      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                        {timelineEvents.map((evt) => {
                          const dateObj = new Date(evt.timestamp);
                          const formattedTime = !isNaN(dateObj.getTime())
                            ? dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " WIB"
                            : "-";
                          const formattedDate = !isNaN(dateObj.getTime())
                            ? dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                            : "";

                          return (
                            <div key={evt.id} className="relative group">
                              {/* Bullet node */}
                              <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-card ${
                                evt.type === "completed"
                                  ? "bg-emerald-500 text-white"
                                  : evt.type === "answer_passed"
                                  ? "bg-emerald-500 text-white"
                                  : evt.type === "answer_failed"
                                  ? "bg-amber-500 text-white"
                                  : evt.type === "violation"
                                  ? "bg-rose-500 text-white"
                                  : "bg-blue-500 text-white"
                              }`}>
                                {evt.type === "completed" ? (
                                  <Award className="w-2.5 h-2.5" />
                                ) : evt.type === "answer_passed" ? (
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                ) : evt.type === "answer_failed" ? (
                                  <AlertTriangle className="w-2.5 h-2.5" />
                                ) : evt.type === "violation" ? (
                                  <ShieldAlert className="w-2.5 h-2.5" />
                                ) : (
                                  <Clock className="w-2.5 h-2.5" />
                                )}
                              </div>

                              {/* Card detail event */}
                              <div className="p-3.5 rounded-xl border border-border bg-card space-y-1 hover:border-foreground/20 transition-all">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <span className="font-bold text-foreground text-xs">
                                    {evt.title}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {evt.badgeText && (
                                      <Badge className={`text-[10px] font-bold ${evt.badgeColor}`}>
                                        {evt.badgeText}
                                      </Badge>
                                    )}
                                    <span className="text-[10px] text-muted-foreground font-mono">
                                      {formattedTime} • {formattedDate}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {evt.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10">
                <div className="text-[11px] text-muted-foreground">
                  <span>Modul {selectedModule} • </span>
                  <span>{answeredQuestionsCount} dari {totalQuestions} Soal Terjawab</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setDetailModalStudent(null);
                    setDetailModalTab("answers");
                  }}
                  className="text-xs cursor-pointer"
                >
                  Tutup
                </Button>
              </div>
            </Card>
          </div>
        );
      })()}

      {/* Modal Ganti Password Dosen */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-sm border border-border shadow-2xl bg-card">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-500" />
                  Ubah Password Dosen
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
                    Password Lama
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      required
                      placeholder="Masukkan password saat ini..."
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-3 pr-8 py-2 text-xs rounded-lg border border-input bg-background"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowOldPassword((prev) => !prev)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 transition-colors"
                      title={showOldPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {showOldPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      placeholder="Masukkan password baru..."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 pr-8 py-2 text-xs rounded-lg border border-input bg-background"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 transition-colors"
                      title={showNewPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
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
                    Simpan Password Baru
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Konfirmasi Reset Password Mahasiswa */}
      {studentToReset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-md border border-border shadow-2xl bg-card overflow-hidden rounded-2xl animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-foreground">
                      Reset Kata Sandi Mahasiswa
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Konfirmasi pemulihan akun mahasiswa ke setelan awal
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setStudentToReset(null)}
                  className="text-muted-foreground hover:text-foreground text-sm font-bold p-1 rounded-lg hover:bg-muted"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Info Mahasiswa Target */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Nama Mahasiswa:</span>
                  <span className="font-bold text-foreground">{studentToReset.fullName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">NIM:</span>
                  <span className="font-mono font-bold text-foreground px-2 py-0.5 rounded bg-background border border-border">
                    {studentToReset.nim}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Kelas:</span>
                  <Badge variant="outline" className="text-[10px]">
                    {studentToReset.classGroup}
                  </Badge>
                </div>
              </div>

              {/* Penjelasan Reset */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 leading-relaxed flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <span>
                  Kata sandi akan dikembalikan ke nilai default yaitu <strong>NIM mahasiswa ({studentToReset.nim})</strong>. Mahasiswa dapat login kembali dan mengganti sandi baru di dashboard profilnya.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={resetLoading}
                  onClick={() => setStudentToReset(null)}
                  className="text-xs rounded-xl cursor-pointer"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={resetLoading}
                  onClick={confirmResetPassword}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl gap-1.5 shadow-sm cursor-pointer"
                >
                  {resetLoading ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      <span>Mereset Sandi...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Ya, Reset Kata Sandi</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
