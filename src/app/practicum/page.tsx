import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  FlaskConical,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  ChevronRight,
  BookOpen,
  Sparkles,
  Award,
  Layers,
  GraduationCap,
  LogIn,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { PRACTICUM_MODULES, THEME_COLORS } from "@/data/practicum";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Modul Praktikum | The Serverless Odyssey",
  description: "Daftar 7 Modul Praktikum Terpadu Pengujian, Analisis, dan Laporan Resmi Berbantuan AI",
};

interface StudentSession {
  nim: string;
  fullName: string;
  classGroup: string;
}

export default async function PracticumCatalogPage() {
  const cookieStore = await cookies();
  const studentCookie = cookieStore.get("student_session")?.value;
  let student: StudentSession | null = null;

  if (studentCookie) {
    try {
      student = JSON.parse(studentCookie);
    } catch {
      student = null;
    }
  }

  // Fetch status if student is logged in
  const statusMap: Record<number, { status: string; approvedAt: string | null; submittedAt: string | null }> = {};

  if (student) {
    try {
      const supabase = await createClient();
      const { data: subs } = await supabase
        .from("practicum_submissions")
        .select("practicum_id, status, submitted_at, approved_at")
        .eq("student_nim", student.nim);

      (subs ?? []).forEach((s) => {
        statusMap[s.practicum_id] = {
          status: s.status,
          submittedAt: s.submitted_at,
          approvedAt: s.approved_at,
        };
      });
    } catch (e) {
      console.warn("Gagal membaca data status praktikum:", e);
    }
  }

  const approvedCount = Object.values(statusMap).filter((s) => s.status === "approved").length;
  const submittedCount = Object.values(statusMap).filter((s) => s.status === "submitted").length;
  const draftCount = Object.values(statusMap).filter((s) => s.status === "draft" || s.status === "revision").length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 md:p-10 lg:p-12 space-y-10 transition-colors duration-300 selection:bg-indigo-500 selection:text-white">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-600/15 rounded-full blur-3xl" />
      </div>

      {/* Top Header & Breadcrumb */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke Beranda
              </Button>
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide uppercase">
              <FlaskConical className="w-3.5 h-3.5" />
              Laboratorium Praktikum
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Modul Praktikum Terpadu
          </h1>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            7 modul pengujian empiris, observasi sistem, analisis berbantuan AI, dan pembuatan laporan digital bertanda tangan resmi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {student ? (
            <div className="flex items-center gap-2 p-1.5 pl-3 bg-white dark:bg-zinc-900 border border-indigo-500/30 rounded-xl shadow-xs text-xs">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              <div className="flex flex-col">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{student.fullName}</span>
                <span className="text-[10px] text-zinc-500 font-mono">{student.nim} • {student.classGroup}</span>
              </div>
            </div>
          ) : (
            <Link href="/">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs gap-1.5">
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Akun Mahasiswa</span>
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Progress & Stat Cards */}
      {student && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-xs">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Total Modul</div>
            <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">7</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Modul Praktikum</div>
          </Card>

          <Card className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 backdrop-blur-md shadow-xs">
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Disetujui</span>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-1">
              {approvedCount}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Laporan Selesai & Sah</div>
          </Card>

          <Card className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 backdrop-blur-md shadow-xs">
            <div className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Menunggu Dosen</span>
            </div>
            <div className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-400 mt-1">
              {submittedCount}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Dalam Antrean Review</div>
          </Card>

          <Card className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-950/20 backdrop-blur-md shadow-xs">
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dalam Proses</span>
            </div>
            <div className="text-2xl font-bold font-mono text-indigo-700 dark:text-indigo-400 mt-1">
              {draftCount}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Draft / Perlu Revisi</div>
          </Card>
        </div>
      )}

      {/* 7 Practicum Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Daftar Modul Praktikum (Bebas Dikerjakan Kapan Saja)
            </h2>
          </div>
          <Badge variant="outline" className="text-xs font-mono text-zinc-500">
            Mandiri & Paralel
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRACTICUM_MODULES.map((pm) => {
            const theme = THEME_COLORS[pm.theme.color];
            const currentStatus = statusMap[pm.id]?.status ?? null;

            return (
              <Card
                key={pm.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-xs hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
              >
                <CardHeader className="p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-xs flex items-center justify-center">
                        P-0{pm.id}
                      </span>
                      <Badge variant="outline" className={`${theme.badge} text-[11px] font-mono`}>
                        {pm.theme.badge}
                      </Badge>
                    </div>

                    {/* Status Badge */}
                    {currentStatus === "approved" ? (
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Disetujui
                      </Badge>
                    ) : currentStatus === "submitted" ? (
                      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Menunggu Dosen
                      </Badge>
                    ) : currentStatus === "revision" ? (
                      <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 text-xs gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Perlu Revisi
                      </Badge>
                    ) : currentStatus === "draft" ? (
                      <Badge variant="outline" className="text-zinc-500 text-xs">
                        Draft Pengerjaan
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-zinc-400 text-xs">
                        Belum Dikerjakan
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {pm.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                      {pm.capaian}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="px-6 pb-6 pt-0 space-y-4">
                  {/* Info Steps & Lecture Module */}
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                      Materi: Modul {pm.lectureModule} Kuliah
                    </span>
                    <span className="font-mono">{pm.steps.length} Langkah Pengamatan</span>
                  </div>

                  {/* Action Link */}
                  <div className="pt-2">
                    <Link href={`/practicum/${pm.id}`} className="block">
                      <Button
                        className={`w-full text-xs font-semibold justify-between shadow-xs ${
                          currentStatus === "approved"
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                      >
                        <span>
                          {currentStatus === "approved"
                            ? "Lihat Laporan & Unduh PDF"
                            : currentStatus === "submitted"
                            ? "Lihat Pengiriman Laporan"
                            : currentStatus === "draft"
                            ? "Lanjutkan Pengerjaan Laporan"
                            : "Mulai Praktikum Ini"}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
