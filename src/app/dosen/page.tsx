"use client";

import React, { useState, useEffect } from "react";
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
  FlaskConical
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
  const [authError, setAuthError] = useState("");

  // State Monitoring Data
  const [activePortalTab, setActivePortalTab] = useState<"quiz" | "practicum">("quiz");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedModule, setSelectedModule] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [detailModalStudent, setDetailModalStudent] = useState<StudentRow | null>(null);
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
  const [passwordMsg, setPasswordMsg] = useState("");

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
  }, [selectedClass]);

  const fetchData = async () => {
    setLoading(true);
    const data = await getLecturerMonitoringDataAction(selectedClass);
    setStudents(data.students);
    setSubmissions(data.submissions);
    setAnswers(data.answers);
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

    const res = await bulkImportStudentsAction(rawImportText);
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
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda Utama</span>
            </Link>
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-foreground">
              Portal Dosen Pengampu
            </h1>
            <p className="text-xs text-muted-foreground">
              Masuk menggunakan Username dan Password Anda untuk mengakses Pusat Kendali &amp; Monitoring.
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
                  <input
                    type="password"
                    required
                    placeholder="Masukkan password..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background/80 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                  />
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

  // Daftar kelas unik dari database
  const availableClasses = Array.from(new Set(students.map((s) => s.classGroup))).filter(Boolean);

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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground">
                  Dashboard Monitoring Dosen
                </h1>
                <p className="text-[11px] text-muted-foreground">
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
        </div>

        {activePortalTab === "practicum" ? (
          <LecturerPracticumTab selectedClass={selectedClass} />
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
                <option value="all">Semua Kelas</option>
                {availableClasses.map((cls) => (
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
                  <th className="py-3.5 px-4 uppercase tracking-wider text-[11px]">Kemajuan Soal</th>
                  <th className="py-3.5 px-4 text-center uppercase tracking-wider text-[11px]">Skor Akhir</th>
                  <th className="py-3.5 px-4 text-center uppercase tracking-wider text-[11px]">Integritas / Reset</th>
                  <th className="py-3.5 px-4 text-right uppercase tracking-wider text-[11px]">Aksi Dosen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
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
                          {score > 0 ? (
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
                            <span className="text-muted-foreground/60 text-xs font-mono">-</span>
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

      {/* Modal Detail Jawaban Mahasiswa */}
      {detailModalStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[85vh] flex flex-col border border-border shadow-2xl bg-card">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm text-foreground">
                  Detail Rekam Jejak Jawaban: {detailModalStudent.fullName} ({detailModalStudent.nim})
                </h3>
              </div>
              <button
                onClick={() => setDetailModalStudent(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground">Modul {selectedModule}: </span>
                  <span className="text-muted-foreground">{targetModule.title}</span>
                </div>
                <Badge variant="outline" className="font-mono text-[10px]">
                  Kelas {detailModalStudent.classGroup}
                </Badge>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-foreground uppercase tracking-wide text-[11px]">
                  Soal &amp; Jawaban Esai:
                </h4>
                {targetModule.quiz?.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl border border-border/80 bg-background/50 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-foreground">
                        Soal #{idx + 1}: {q.question}
                      </span>
                      <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px]">
                        Bobot: {q.weight} Poin
                      </Badge>
                    </div>

                    <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-muted-foreground text-[11px]">
                      <p className="font-semibold text-foreground/80 mb-0.5">Rubrik Penilaian:</p>
                      <p>{q.rubric}</p>
                    </div>

                    <div className="pt-1 flex flex-wrap gap-1">
                      {q.keyConcepts.map((c, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-border flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDetailModalStudent(null)}
                className="text-xs cursor-pointer"
              >
                Tutup
              </Button>
            </div>
          </Card>
        </div>
      )}

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
                  <input
                    type="password"
                    required
                    placeholder="Masukkan password saat ini..."
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Masukkan password baru..."
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
