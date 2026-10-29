"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FlaskConical,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Download,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  Database,
  KeyRound,
  Globe,
  Zap,
  Lock,
  BookOpen,
  FileCheck,
  RefreshCw,
  Info,
  Calendar,
  UserCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StudentPracticumItem, StudentPracticumStats, StudentSession } from "@/actions/student-auth";
import { getStudentPracticumPdfUrlAction } from "@/actions/practicum";
import { getPracticumTheme } from "@/data/practicum";

interface StudentPracticumSectionProps {
  practicums: StudentPracticumItem[];
  practicumStats: StudentPracticumStats;
  student: StudentSession;
  onRefresh?: () => void;
}

const getPracticumIcon = (id: number) => {
  switch (id) {
    case 1:
      return <Layers className="w-4 h-4" />;
    case 2:
      return <ShieldCheck className="w-4 h-4" />;
    case 3:
      return <Database className="w-4 h-4" />;
    case 4:
      return <KeyRound className="w-4 h-4" />;
    case 5:
      return <Globe className="w-4 h-4" />;
    case 6:
      return <Zap className="w-4 h-4" />;
    case 7:
      return <Sparkles className="w-4 h-4" />;
    default:
      return <FlaskConical className="w-4 h-4" />;
  }
};

export function StudentPracticumSection({
  practicums,
  practicumStats,
  student,
  onRefresh,
}: StudentPracticumSectionProps) {
  const [filter, setFilter] = useState<"all" | "approved" | "submitted" | "draft" | "not_started">("all");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredPracticums = practicums.filter((p) => {
    if (filter === "approved") return p.status === "approved";
    if (filter === "submitted") return p.status === "submitted";
    if (filter === "draft") return p.status === "draft" || p.status === "revision";
    if (filter === "not_started") return p.status === "not_started";
    return true;
  });

  const handleDownloadPdf = async (submissionId?: string) => {
    if (!submissionId) return;
    setDownloadingId(submissionId);
    try {
      const res = await getStudentPracticumPdfUrlAction(submissionId);
      if (res.success && res.url) {
        window.open(res.url, "_blank", "noopener,noreferrer");
      } else {
        alert(res.error || "Gagal mendapatkan tautan berkas PDF.");
      }
    } catch {
      alert("Terjadi kendala jaringan saat mengunduh berkas laporan.");
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (isoStr?: string | null) => {
    if (!isoStr) return "—";
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className="space-y-8 relative z-10">
      {/* Practicum Hero Banner */}
      <section className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-cyan-500/5 border border-teal-500/20 dark:border-teal-500/30 relative overflow-hidden space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-semibold tracking-wide uppercase">
              <FlaskConical className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Studio Praktikum Terpadu (Kode MK: KK112113)</span>
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              Eksperimen Laboratorium &amp;{" "}
              <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 dark:from-teal-400 dark:via-emerald-300 dark:to-cyan-400 bg-clip-text text-transparent">
                Laporan Digital Resmi Berstempel 🧪
              </span>
            </h2>
            <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
              Selamat datang di laboratorium terpadu 7 Modul Pengujian Empiris arsitektur serverless. Setiap modul dilengkapi formulir observasi terarah, evaluasi esai refleksi ilmiah oleh AI, tanda tangan digital mahasiswa &amp; dosen, serta penerbitan <strong className="text-teal-700 dark:text-teal-300 font-semibold">Berita Acara Kelulusan Praktikum (PDF)</strong> resmi yang disahkan oleh <strong className="text-zinc-900 dark:text-white font-semibold">Hadiq, ST, M.Kom</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <Link href="/practicum" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs h-10 px-5 rounded-xl shadow-md gap-2 cursor-pointer transition-all">
                <FlaskConical className="w-4 h-4" />
                <span>Masuk ke Studio Laboratorium ➔</span>
              </Button>
            </Link>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="w-full sm:w-auto text-xs h-10 px-4 rounded-xl border-zinc-300 dark:border-zinc-700 font-semibold gap-2 bg-white/80 dark:bg-zinc-900/80 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
                <span>Segarkan Status</span>
              </Button>
            )}
          </div>
        </div>

        {/* 3 Pedoman Praktikum Resmi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-teal-500/10 dark:border-teal-500/20">
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <FileCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                1. Observasi Empiris Terpadu
              </h4>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Catat setiap perilaku runtime, kode status HTTP, atau selisih ukuran bundle DevTools secara teliti pada tabel pengamatan.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Award className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                2. Ambang Lulus Esai AI (≥ 70)
              </h4>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Esai Analisis &amp; Kesimpulan dinilai oleh AI bertingkat dengan threshold 70. Jika belum lulus, gunakan arahan Socratic untuk merevisi.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                3. Tanda Tangan &amp; Berita Acara PDF
              </h4>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Bubuhkan tanda tangan digital Anda saat mengajukan. Setelah disetujui dosen, unduh dokumen PDF resmi berstempel digital.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Stat Cards Praktikum */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Laporan Disetujui */}
        <Card className="border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Laporan Disetujui</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {practicumStats.approvedCount}
            </span>
            <span className="text-xs font-semibold text-zinc-500">/ {practicumStats.totalPracticums} Modul</span>
          </div>
          <div className="mt-2.5">
            <Progress
              value={(practicumStats.approvedCount / practicumStats.totalPracticums) * 100}
              className="h-1.5 bg-zinc-100 dark:bg-zinc-800"
            />
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
            {practicumStats.approvedCount > 0
              ? `${practicumStats.approvedCount} berita acara resmi siap diunduh.`
              : "Belum ada laporan yang disahkan dosen."}
          </p>
        </Card>

        {/* Card 2: Menunggu Review Dosen */}
        <Card className="border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Menunggu Review Dosen</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
              {practicumStats.submittedCount}
            </span>
            <span className="text-xs font-semibold text-zinc-500">Modul Diajukan</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
            {practicumStats.submittedCount > 0
              ? "Telah disubmit & menunggu pengesahan dosen."
              : "Tidak ada antrean pengajuan tertunda."}
          </p>
        </Card>

        {/* Card 3: Sedang Dikerjakan (Draft / Revisi) */}
        <Card className="border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Sedang Dikerjakan</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {practicumStats.draftCount}
            </span>
            <span className="text-xs font-semibold text-zinc-500">Draft / Revisi</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
            {practicumStats.draftCount > 0
              ? "Lanjutkan pengamatan atau perbaiki esai."
              : "Semua modul yang dimulai telah disubmit."}
          </p>
        </Card>

        {/* Card 4: Rata-rata Skor Praktikum */}
        <Card className="border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Rata-rata Nilai Esai</span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-600 dark:text-teal-400 font-mono">
              {practicumStats.averageScore > 0 ? practicumStats.averageScore : "—"}
            </span>
            <span className="text-xs font-semibold text-zinc-500">/ 100</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
            Threshold kelulusan esai praktikum: <strong className="text-zinc-700 dark:text-zinc-300">≥ 70</strong>.
          </p>
        </Card>
      </section>

      {/* Roster & Tabel 7 Modul Praktikum */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Daftar 7 Modul Praktikum Terpadu</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Pantau status observasi empiris, evaluasi esai berbantuan AI, dan unduh laporan kelulusan PDF resmi berstempel dosen.
            </p>
          </div>

          {/* Filter Status */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 self-start sm:self-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Semua ({practicums.length})
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filter === "approved"
                  ? "bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Disetujui ({practicumStats.approvedCount})
            </button>
            <button
              onClick={() => setFilter("submitted")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filter === "submitted"
                  ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Menunggu Review ({practicumStats.submittedCount})
            </button>
            <button
              onClick={() => setFilter("draft")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filter === "draft"
                  ? "bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Draft ({practicumStats.draftCount})
            </button>
            <button
              onClick={() => setFilter("not_started")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filter === "not_started"
                  ? "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Belum Mulai ({practicumStats.notStartedCount})
            </button>
          </div>
        </div>

        {/* Tabel Desktop & Card List */}
        <Card className="border border-zinc-200 dark:border-zinc-800 shadow-md overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-100/80 dark:bg-zinc-800/70 border-b border-zinc-200 dark:border-zinc-700/80 text-zinc-500 dark:text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-28">Modul</th>
                  <th className="py-3.5 px-4">Topik Pengujian &amp; Capaian Lab</th>
                  <th className="py-3.5 px-4 w-36">Observasi</th>
                  <th className="py-3.5 px-4 w-44 text-center">Nilai Esai AI</th>
                  <th className="py-3.5 px-4 w-48 text-center">Status Pengesahan</th>
                  <th className="py-3.5 px-4 w-52 text-right">Aksi Studio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-800/60">
                {filteredPracticums.map((p) => {
                  const theme = getPracticumTheme(p.themeColor);
                  const isApproved = p.status === "approved";
                  const isSubmitted = p.status === "submitted";
                  const isDraft = p.status === "draft";
                  const isRevision = p.status === "revision";
                  const isNotStarted = p.status === "not_started";

                  return (
                    <tr
                      key={p.id}
                      className={`transition-colors ${
                        isApproved
                          ? "bg-emerald-500/[0.02] hover:bg-emerald-500/[0.05]"
                          : isSubmitted
                          ? "bg-blue-500/[0.02] hover:bg-blue-500/[0.05]"
                          : isRevision
                          ? "bg-rose-500/[0.02] hover:bg-rose-500/[0.05]"
                          : "even:bg-zinc-50/50 dark:even:bg-zinc-800/20 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                      }`}
                    >
                      {/* Nomor Modul */}
                      <td className="py-4 px-4 align-middle">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/25 flex items-center justify-center font-mono font-black text-xs shrink-0 shadow-2xs">
                            {p.id < 10 ? `0${p.id}` : p.id}
                          </div>
                          <div>
                            <span className="font-bold text-xs text-zinc-900 dark:text-white block">
                              Lab {p.id}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              {p.durationMinutes} mnt
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Topik & Capaian */}
                      <td className="py-4 px-4 align-middle">
                        <div className="space-y-1.5 max-w-md">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-zinc-900 dark:text-white text-xs">
                              {p.title}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 border-teal-500/30 text-teal-700 dark:text-teal-300 bg-teal-500/10"
                            >
                              {p.themeBadge}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                            {p.capaian}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 px-1.5 py-0.5 rounded">
                              Terkait Modul Kuliah #{p.lectureModule}
                            </span>
                            {p.techPills.slice(0, 3).map((pill) => (
                              <span
                                key={pill}
                                className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded"
                              >
                                {pill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Observasi Steps */}
                      <td className="py-4 px-4 align-middle">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-zinc-500">Langkah:</span>
                            <span className="font-mono font-bold text-zinc-900 dark:text-white">
                              {p.observationsCount} / {p.totalSteps}
                            </span>
                          </div>
                          <Progress
                            value={(p.observationsCount / p.totalSteps) * 100}
                            className="h-1.5 bg-zinc-100 dark:bg-zinc-800"
                          />
                          <span className="text-[10px] text-zinc-400 block">
                            {p.observationsCount === p.totalSteps
                              ? "✓ Lengkap diamati"
                              : `${p.totalSteps - p.observationsCount} langkah tersisa`}
                          </span>
                        </div>
                      </td>

                      {/* Nilai Esai AI */}
                      <td className="py-4 px-4 align-middle text-center">
                        <div className="inline-flex flex-col gap-1 items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-500 font-mono">Analisis:</span>
                            {p.analysisScore !== null ? (
                              <Badge
                                className={`text-[10px] font-mono font-bold px-1.5 py-0 ${
                                  p.analysisScore >= 70
                                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                                    : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                                }`}
                              >
                                {p.analysisScore}
                              </Badge>
                            ) : (
                              <span className="text-[10px] text-zinc-400">—</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-500 font-mono">Kesimpulan:</span>
                            {p.conclusionScore !== null ? (
                              <Badge
                                className={`text-[10px] font-mono font-bold px-1.5 py-0 ${
                                  p.conclusionScore >= 70
                                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                                    : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                                }`}
                              >
                                {p.conclusionScore}
                              </Badge>
                            ) : (
                              <span className="text-[10px] text-zinc-400">—</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status Pengesahan */}
                      <td className="py-4 px-4 align-middle text-center">
                        {isApproved && (
                          <div className="space-y-1 inline-flex flex-col items-center">
                            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 gap-1 text-[11px] font-bold">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>Disetujui Dosen</span>
                            </Badge>
                            <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                              <UserCheck className="w-3 h-3 text-emerald-500" />
                              {p.approvedByName || "Hadiq, ST, M.Kom"}
                            </span>
                            <span className="text-[9px] text-zinc-400">
                              {formatDate(p.approvedAt)}
                            </span>
                          </div>
                        )}

                        {isSubmitted && (
                          <div className="space-y-1 inline-flex flex-col items-center">
                            <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 gap-1 text-[11px] font-bold">
                              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <span>Menunggu Review</span>
                            </Badge>
                            <span className="text-[9px] text-zinc-400">
                              Diajukan: {formatDate(p.submittedAt)}
                            </span>
                          </div>
                        )}

                        {isRevision && (
                          <div className="space-y-1 inline-flex flex-col items-center">
                            <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 gap-1 text-[11px] font-bold">
                              <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                              <span>Perlu Revisi</span>
                            </Badge>
                            <span className="text-[9px] text-zinc-400">
                              Perbaiki observasi/esai
                            </span>
                          </div>
                        )}

                        {isDraft && (
                          <div className="space-y-1 inline-flex flex-col items-center">
                            <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 gap-1 text-[11px] font-semibold">
                              <FlaskConical className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                              <span>Draft Eksperimen</span>
                            </Badge>
                            <span className="text-[9px] text-zinc-400">
                              Belum diajukan
                            </span>
                          </div>
                        )}

                        {isNotStarted && (
                          <span className="text-zinc-400 text-[11px] font-medium">
                            Belum Dimulai
                          </span>
                        )}
                      </td>

                      {/* Aksi Studio */}
                      <td className="py-4 px-4 align-middle text-right">
                        <div className="flex flex-col items-end gap-1.5">
                          {/* Tombol Unduh PDF jika approved */}
                          {isApproved && p.submissionId && (
                            <Button
                              size="sm"
                              onClick={() => handleDownloadPdf(p.submissionId)}
                              disabled={downloadingId === p.submissionId}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 px-3 rounded-lg gap-1 font-semibold shadow-xs cursor-pointer"
                            >
                              <Download className="w-3 h-3" />
                              <span>
                                {downloadingId === p.submissionId ? "Mengunduh..." : "Unduh PDF"}
                              </span>
                            </Button>
                          )}

                          {/* Link ke Lembar Kerja Praktikum */}
                          <Link href={`/practicum/${p.id}`}>
                            <Button
                              size="sm"
                              variant={isApproved ? "outline" : "default"}
                              className={`text-xs h-7 px-3 rounded-lg gap-1 font-semibold cursor-pointer ${
                                isApproved
                                  ? "border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                  : isSubmitted
                                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                                  : isRevision
                                  ? "bg-rose-600 hover:bg-rose-700 text-white"
                                  : isDraft
                                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                                  : "bg-zinc-800 hover:bg-zinc-900 text-white dark:bg-zinc-700 dark:hover:bg-zinc-600"
                              }`}
                            >
                              <span>
                                {isApproved
                                  ? "Lihat Detail"
                                  : isSubmitted
                                  ? "Pantau Status"
                                  : isRevision
                                  ? "Revisi Laporan"
                                  : isDraft
                                  ? "Lanjut Lab"
                                  : "Mulai Lab"}
                              </span>
                              <ArrowRight className="w-3 h-3" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-3.5 px-4 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
            <div className="flex items-center gap-4">
              <span>
                Total Disetujui: <strong className="text-zinc-900 dark:text-white font-mono">{practicumStats.approvedCount} / {practicumStats.totalPracticums}</strong>
              </span>
              <span>•</span>
              <span>
                Rata-rata Nilai: <strong className="text-zinc-900 dark:text-white font-mono">{practicumStats.averageScore > 0 ? practicumStats.averageScore : "—"}</strong>
              </span>
            </div>
            <Link
              href="/practicum"
              className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-semibold text-xs"
            >
              <span>Buka Studio Laboratorium Terpadu Lengkap</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
