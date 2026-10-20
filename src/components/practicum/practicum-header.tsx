"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Award,
  GraduationCap,
  Calendar,
  LogOut,
  Presentation,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PracticumModule, getPracticumTheme } from "@/data/practicum";
import { PracticumSubmissionState } from "@/actions/practicum";
import { logoutStudentAction } from "@/actions/student-auth";

interface PracticumHeaderProps {
  practicum: PracticumModule;
  submission: PracticumSubmissionState | null;
  student: {
    nim: string;
    fullName: string;
    classGroup: string;
  };
  onDownloadPdf?: () => void;
  pdfLoading?: boolean;
  isLecturer?: boolean;
  lecturerName?: string;
}

export function PracticumHeader({
  practicum,
  submission,
  student,
  onDownloadPdf,
  pdfLoading = false,
  isLecturer = false,
  lecturerName,
}: PracticumHeaderProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const theme = getPracticumTheme(practicum?.theme?.color);
  const status = submission?.status ?? "draft";

  const isInstructor = student.classGroup === "Dosen Pengampu" || isLecturer;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutStudentAction();
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1.5 px-3 py-1 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Laporan Disetujui
          </Badge>
        );
      case "submitted":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1.5 px-3 py-1 text-xs">
            <Clock className="w-3.5 h-3.5" />
            Menunggu Persetujuan Dosen
          </Badge>
        );
      case "revision":
        return (
          <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 gap-1.5 px-3 py-1 text-xs">
            <AlertCircle className="w-3.5 h-3.5" />
            Perlu Revisi
          </Badge>
        );
      default:
        return (
          <Badge className="bg-zinc-500/15 text-zinc-700 dark:text-zinc-400 border-zinc-500/30 gap-1.5 px-3 py-1 text-xs">
            <Clock className="w-3.5 h-3.5" />
            {isInstructor ? "Mode Praktikum Aktif" : "Draft Pengerjaan"}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top breadcrumb & navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link href="/practicum">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100 rounded-lg"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Semua Praktikum
            </Button>
          </Link>
          <Link href={`/modules/${practicum.lectureModule}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-slate-500 hover:text-teal-700 dark:hover:text-teal-300 gap-1 rounded-lg"
            >
              <span>Materi Kuliah (Modul {practicum.lectureModule})</span>
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {getStatusBadge()}

          {/* Instructor Mode Indicator Badge */}
          {isInstructor && (
            <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 gap-1.5 px-2.5 py-1 text-xs font-medium">
              <Presentation className="w-3.5 h-3.5 text-amber-600" />
              <span>Mode Panduan Kelas</span>
            </Badge>
          )}

          {/* Quick link to Lecturer Portal */}
          {(isLecturer || isInstructor) && (
            <Link href="/dosen">
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs gap-1.5 shadow-xs rounded-xl h-8 px-3 transition-all"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Portal Dosen ({lecturerName?.split(" ")[0] ?? "Dosen"})</span>
              </Button>
            </Link>
          )}

          {/* Switch Account / Logout button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 gap-1.5 h-8 px-2.5 rounded-lg transition-colors"
            title="Keluar dari sesi untuk ganti akun mahasiswa"
          >
            {loggingOut ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LogOut className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Ganti Akun</span>
          </Button>

          {status === "approved" && onDownloadPdf && (
            <Button
              size="sm"
              onClick={onDownloadPdf}
              disabled={pdfLoading}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs gap-1.5 shadow-xs rounded-xl"
            >
              <FileCheck className="w-3.5 h-3.5" />
              {pdfLoading ? "Menyiapkan PDF..." : "Download Laporan PDF Resmi"}
            </Button>
          )}
        </div>
      </div>

      {/* Main Header Hero Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-white/80 dark:bg-zinc-900/70 border border-slate-200/80 dark:border-zinc-800/80 backdrop-blur-md shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="outline" className={`${theme?.badge ?? "border-teal-500/25 text-teal-800 dark:text-teal-300"} font-mono text-xs px-2.5 py-0.5`}>
                Praktikum {practicum?.id ?? 1} of 7
              </Badge>
              <Badge variant="outline" className="border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold">
                Kode Praktikum: KK112113
              </Badge>
              <Badge variant="outline" className="border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-mono font-semibold">
                Kode MK: KK112112
              </Badge>
              <Badge variant="outline" className="text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 text-xs font-mono">
                Ref: Modul {practicum.lectureModule} Kuliah
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
              {practicum.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 font-normal">
              {isInstructor
                ? "Panduan Demonstrasi Kelas: Pengujian Eksperimental, Analisis Berbantuan AI, dan Tanda Tangan Digital"
                : "Laporan Pengujian, Pengamatan Eksperimental, Analisis & Kesimpulan Berbantuan AI"}
            </p>
          </div>

          {/* User / Instructor Profile Card */}
          <div
            className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs transition-all ${
              isInstructor
                ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
                : "bg-slate-50/80 dark:bg-zinc-950/70 border-slate-200/80 dark:border-zinc-800/80"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border ${
                isInstructor
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-700 dark:text-amber-300"
                  : "bg-teal-500/10 border-teal-500/20 text-teal-700 dark:text-teal-300"
              }`}
            >
              {isInstructor ? (
                <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <GraduationCap className="w-5 h-5" />
              )}
            </div>
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                <span>{isInstructor ? (lecturerName ?? "Hadiq, ST, M.Kom") : student.fullName}</span>
                {isInstructor && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-md bg-amber-600 text-white font-mono">
                    Dosen
                  </span>
                )}
              </div>
              <div className="text-slate-500 dark:text-zinc-400 font-mono text-[11px]">
                {isInstructor
                  ? `NIDN: ${student.nim} • Instruktur Praktikum (KK112113)`
                  : `${student.nim} • ${student.classGroup}`}
              </div>
            </div>
          </div>
        </div>

        {/* Instructor guidance banner */}
        {isInstructor && (
          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Presentation className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Mode Panduan Instruktur Aktif:</strong> Anda dapat menginput nilai pengujian dan men-generate analisis AI langsung di depan kelas untuk percontohan mahasiswa.
              </span>
            </span>
            <Link href="/dosen">
              <Button
                variant="outline"
                size="sm"
                className="text-[11px] h-7 px-2.5 border-amber-500/30 text-amber-800 dark:text-amber-300 hover:bg-amber-500/10 shrink-0"
              >
                Lihat Laporan Mahasiswa ➔
              </Button>
            </Link>
          </div>
        )}

        {/* Status timeline / approval banner if submitted/approved */}
        {submission?.submittedAt && (
          <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/60 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
              Dikirim pada: {new Date(submission.submittedAt).toLocaleString("id-ID")}
            </span>
            {submission.approvedAt && (
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Disetujui oleh {submission.approvedByName ?? "Dosen"} ({new Date(submission.approvedAt).toLocaleDateString("id-ID")})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
