"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, FileCheck, Award, GraduationCap, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PracticumModule, THEME_COLORS } from "@/data/practicum";
import { PracticumSubmissionState } from "@/actions/practicum";

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
}

export function PracticumHeader({
  practicum,
  submission,
  student,
  onDownloadPdf,
  pdfLoading = false,
}: PracticumHeaderProps) {
  const theme = THEME_COLORS[practicum.theme.color];
  const status = submission?.status ?? "draft";

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
            Draft Pengerjaan
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
              className="gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Semua Praktikum
            </Button>
          </Link>
          <Link href={`/modules/${practicum.lectureModule}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 gap-1"
            >
              <span>Materi Kuliah (Modul {practicum.lectureModule})</span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge()}
          {status === "approved" && onDownloadPdf && (
            <Button
              size="sm"
              onClick={onDownloadPdf}
              disabled={pdfLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 shadow-sm"
            >
              <FileCheck className="w-3.5 h-3.5" />
              {pdfLoading ? "Menyiapkan PDF..." : "Download Laporan PDF Resmi"}
            </Button>
          )}
        </div>
      </div>

      {/* Main Header Hero Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-md shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="outline" className={`${theme.badge} font-mono text-xs px-2.5 py-0.5`}>
                Praktikum {practicum.id} of 7
              </Badge>
              <Badge variant="outline" className="text-zinc-500 text-xs font-mono">
                Ref: Modul {practicum.lectureModule} Kuliah
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              {practicum.title}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Laporan Pengujian, Pengamatan Eksperimental, Analisis & Kesimpulan Berbantuan AI
            </p>
          </div>

          {/* Student Profile Card */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800/80 text-xs">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                {student.fullName}
              </div>
              <div className="text-zinc-500 dark:text-zinc-400 font-mono">
                {student.nim} • {student.classGroup}
              </div>
            </div>
          </div>
        </div>

        {/* Status timeline / approval banner if submitted/approved */}
        {submission?.submittedAt && (
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              Dikirim pada: {new Date(submission.submittedAt).toLocaleString("id-ID")}
            </span>
            {submission.approvedAt && (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
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
