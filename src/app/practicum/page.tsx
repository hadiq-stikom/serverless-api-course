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
  ArrowUpRight,
  Presentation,
  ShieldCheck,
  Database,
  KeyRound,
  Globe,
  Zap,
  Lock,
  Target,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { PRACTICUM_MODULES, getPracticumTheme } from "@/data/practicum";
import { createClient } from "@/utils/supabase/server";
import { loginAsLecturerGuideAction } from "@/actions/student-auth";

export const metadata = {
  title: "Modul Praktikum | The Serverless Odyssey",
  description: "Daftar 7 Modul Praktikum Terpadu Pengujian, Analisis, dan Laporan Resmi Berbantuan AI",
};

interface StudentSession {
  nim: string;
  fullName: string;
  classGroup: string;
}

interface LecturerSession {
  nidn: string;
  fullName: string;
}

const getModuleIcon = (id: number) => {
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
      return <Lock className="w-4 h-4" />;
    default:
      return <FlaskConical className="w-4 h-4" />;
  }
};

export default async function PracticumCatalogPage() {
  const cookieStore = await cookies();
  const studentCookie = cookieStore.get("student_session")?.value;
  const lecturerCookie = cookieStore.get("lecturer_session")?.value;
  let student: StudentSession | null = null;
  let lecturer: LecturerSession | null = null;

  if (studentCookie) {
    try {
      student = JSON.parse(studentCookie);
    } catch {
      student = null;
    }
  }

  if (lecturerCookie) {
    try {
      lecturer = JSON.parse(lecturerCookie);
    } catch {
      lecturer = null;
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
    <div className="min-h-screen bg-slate-50/60 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 p-6 md:p-10 lg:p-12 space-y-10 transition-colors duration-300 selection:bg-teal-500 selection:text-white">
      {/* Zen Ambient Soft Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-slate-400/5 dark:bg-teal-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-600/5 rounded-full blur-3xl" />
      </div>

      {/* Top Header & Breadcrumb */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pb-6 border-b border-slate-200/80 dark:border-zinc-800/80">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke Beranda
              </Button>
            </Link>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-700 dark:text-teal-300 text-xs font-semibold tracking-wide uppercase">
              <FlaskConical className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Studio Praktikum Terpadu</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
            Laboratorium & Laporan Praktikum
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
            7 modul pengujian empiris, analisis berbantuan AI, dan pembuatan laporan digital resmi dengan pengesahan tanda tangan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
          <ThemeToggle />

          {/* Lecturer Quick Access Shortcut */}
          {lecturer ? (
            <div className="flex items-center gap-2">
              <Link href="/dosen">
                <Button
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs gap-1.5 rounded-xl shadow-xs h-9 px-3.5 transition-all"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Portal Dosen ({lecturer.fullName.split(" ")[0]})</span>
                </Button>
              </Link>

              {/* One-click activate guide mode if not yet active */}
              {student?.classGroup !== "Dosen Pengampu" && (
                <form
                  action={async () => {
                    "use server";
                    await loginAsLecturerGuideAction();
                  }}
                >
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs gap-1.5 rounded-xl shadow-xs h-9 px-3.5 transition-all"
                  >
                    <Presentation className="w-3.5 h-3.5" />
                    <span>Mode Panduan Dosen</span>
                  </Button>
                </form>
              )}
            </div>
          ) : (
            <Link href="/dosen">
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10 font-medium rounded-xl h-9 px-3 gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Masuk Dosen</span>
              </Button>
            </Link>
          )}

          {/* Student Status or Login */}
          {student ? (
            <div
              className={`flex items-center gap-2.5 p-1.5 pl-3 border rounded-xl shadow-xs text-xs backdrop-blur-sm ${
                student.classGroup === "Dosen Pengampu"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
                  : "bg-white/90 dark:bg-zinc-900/90 border-teal-500/25"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                  student.classGroup === "Dosen Pengampu"
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-700 dark:text-amber-300"
                    : "bg-teal-500/10 border-teal-500/20 text-teal-600 dark:text-teal-400"
                }`}
              >
                {student.classGroup === "Dosen Pengampu" ? (
                  <Award className="w-4 h-4" />
                ) : (
                  <GraduationCap className="w-4 h-4" />
                )}
              </div>
              <div className="flex flex-col pr-2">
                <span className="font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                  {student.fullName}
                  {student.classGroup === "Dosen Pengampu" && (
                    <span className="px-1 py-0.2 bg-amber-600 text-white text-[9px] rounded font-semibold font-mono">
                      Dosen
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono">
                  {student.classGroup === "Dosen Pengampu"
                    ? `NIDN: ${student.nim} • Panduan Kelas`
                    : `${student.nim} • ${student.classGroup}`}
                </span>
              </div>
            </div>
          ) : (
            <Link href="/practicum/1">
              <Button size="sm" className="bg-slate-900 hover:bg-teal-700 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-teal-400 font-medium text-xs gap-1.5 shadow-xs rounded-xl h-9">
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Mahasiswa</span>
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Progress & Stat Cards (Zen Clean Design) */}
      {student && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-xs">
            <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Total Modul</div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-zinc-100 mt-1">7</div>
            <div className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">Modul Praktikum</div>
          </Card>

          <Card className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-950/20 backdrop-blur-md shadow-xs">
            <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Disetujui</span>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-1">
              {approvedCount}
            </div>
            <div className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">Laporan Selesai & Sah</div>
          </Card>

          <Card className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5 dark:bg-amber-950/20 backdrop-blur-md shadow-xs">
            <div className="text-xs text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Menunggu Dosen</span>
            </div>
            <div className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-400 mt-1">
              {submittedCount}
            </div>
            <div className="text-[11px] text-amber-600/70 dark:text-amber-400/70 mt-0.5">Dalam Antrean Review</div>
          </Card>

          <Card className="p-4 rounded-xl border border-teal-500/25 bg-teal-500/5 dark:bg-teal-950/20 backdrop-blur-md shadow-xs">
            <div className="text-xs text-teal-700 dark:text-teal-400 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dalam Proses</span>
            </div>
            <div className="text-2xl font-bold font-mono text-teal-700 dark:text-teal-400 mt-1">
              {draftCount}
            </div>
            <div className="text-[11px] text-teal-600/70 dark:text-teal-400/70 mt-0.5">Draft / Perlu Revisi</div>
          </Card>
        </div>
      )}

      {/* Ambient Guidance Card when not logged in */}
      {!student && (
        <div className="p-5 md:p-6 rounded-2xl bg-slate-900/[0.03] dark:bg-slate-900/40 border border-slate-200/90 dark:border-zinc-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-5 backdrop-blur-sm">
          <div className="space-y-1.5 max-w-2xl">
            <div className="font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>Mode Penjelajah Publik</span>
            </div>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-xs sm:text-sm">
              Pilih salah satu modul praktikum di bawah untuk membuka lembar kerja, mengisi catatan pengamatan, atau menggunakan akun uji coba mahasiswa.
            </p>
          </div>
          <Link href="/practicum/1" className="shrink-0">
            <Button size="sm" className="w-full sm:w-auto bg-slate-900 hover:bg-teal-700 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-teal-400 text-xs font-semibold gap-1.5 shadow-xs rounded-xl h-9 px-4">
              <GraduationCap className="w-4 h-4" />
              <span>Buka Praktikum 1</span>
            </Button>
          </Link>
        </div>
      )}

      {/* 7 Practicum Modules Grid */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-700 dark:text-teal-300">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-zinc-100">
                Katalog Modul Praktikum
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Dapat dikerjakan secara bertahap dan paralel sesuai kesiapan sistem
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs font-mono text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hidden sm:inline-flex">
            7 Modul Terpadu
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {PRACTICUM_MODULES.map((pm) => {
            const theme = getPracticumTheme(pm?.theme?.color);
            const currentStatus = statusMap[pm.id]?.status ?? null;

            return (
              <Card
                key={pm.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 dark:border-zinc-800/80 bg-white/85 dark:bg-zinc-900/80 backdrop-blur-md shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300"
              >
                {/* Subtle Ambient Hover Glow */}
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

                {/* Subtle Typographic Background Watermark */}
                <div className="absolute right-3.5 top-2.5 text-slate-900/[0.04] dark:text-white/[0.04] text-6xl font-black font-mono select-none pointer-events-none group-hover:text-teal-500/[0.08] transition-colors">
                  0{pm.id}
                </div>

                <CardHeader className="p-5 pb-3 space-y-3 relative z-10">
                  {/* Top Bar: Module Icon + ID + Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs transition-colors ${theme.bg} ${theme.border} ${theme.text}`}>
                        {getModuleIcon(pm.id)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                          Praktikum
                        </span>
                        <span className="font-mono font-extrabold text-xs text-slate-800 dark:text-zinc-200">
                          P-0{pm.id}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {currentStatus === "approved" ? (
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[11px] gap-1 px-2.5 py-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        Disetujui
                      </Badge>
                    ) : currentStatus === "submitted" ? (
                      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[11px] gap-1 px-2.5 py-0.5">
                        <Clock className="w-3 h-3" />
                        Review Dosen
                      </Badge>
                    ) : currentStatus === "revision" ? (
                      <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 text-[11px] gap-1 px-2.5 py-0.5">
                        <AlertCircle className="w-3 h-3" />
                        Revisi
                      </Badge>
                    ) : currentStatus === "draft" ? (
                      <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/5 text-[11px] px-2 py-0.5">
                        Draft
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-slate-400 dark:text-zinc-500 border-slate-200 dark:border-zinc-800 text-[11px] px-2 py-0.5">
                        Belum Dikerjakan
                      </Badge>
                    )}
                  </div>

                  {/* Pillar Category & Title */}
                  <div className="space-y-1.5 pt-0.5">
                    <Badge variant="outline" className={`${theme.badge} text-[10px] font-mono px-2 py-0.5 font-medium`}>
                      {pm.theme.badge}
                    </Badge>
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-zinc-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors leading-snug line-clamp-2">
                      {pm.title}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="px-5 pb-5 pt-0 space-y-3.5 relative z-10 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* 1. Tech Stack Pills (Pemicu Semangat) */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {pm.techPills.map((pill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-100/90 dark:bg-zinc-800/90 text-slate-700 dark:text-zinc-300 border border-slate-200/70 dark:border-zinc-700/60"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>

                    {/* 2. Kalimat Aksi Ringkas (Mission Hook Pemicu Semangat) */}
                    <div className="p-2.5 rounded-xl bg-slate-50/90 dark:bg-zinc-950/60 border border-slate-200/60 dark:border-zinc-800/60 text-xs text-slate-700 dark:text-zinc-300 flex items-start gap-2">
                      <Target className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                      <span className="leading-relaxed font-normal">
                        {pm.actionHook}
                      </span>
                    </div>

                    {/* 3. Target Capaian RPS Resmi (Nuansa Akademik Terjaga) */}
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-mono font-semibold tracking-wider text-slate-400 dark:text-zinc-500 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-slate-400" />
                        <span>Capaian RPS (Modul {pm.lectureModule} Kuliah)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                        {pm.capaian}
                      </p>
                    </div>
                  </div>

                  {/* 4. Meta Bar & Action Button */}
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-zinc-800/60">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
                      <span className="font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>~{pm.durationMinutes} mnt</span>
                      </span>
                      <span className="font-mono text-slate-600 dark:text-zinc-300">
                        {pm.steps.length} Langkah Uji
                      </span>
                      <Badge variant="outline" className="text-[9px] font-mono border-slate-200 dark:border-zinc-800">
                        {pm.level}
                      </Badge>
                    </div>

                    {/* Sleek Action Button */}
                    <Link href={`/practicum/${pm.id}`} className="block">
                      <Button
                        className={`w-full h-10 text-xs font-semibold justify-between rounded-xl transition-all duration-200 shadow-xs group/btn ${
                          currentStatus === "approved"
                            ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                            : currentStatus === "submitted"
                            ? "bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
                            : currentStatus === "draft"
                            ? "bg-slate-900 hover:bg-teal-700 text-white dark:bg-slate-800 dark:hover:bg-teal-600"
                            : student?.classGroup === "Dosen Pengampu"
                            ? "bg-amber-600 hover:bg-amber-700 text-white"
                            : "bg-slate-900 hover:bg-teal-700 text-white dark:bg-slate-800 dark:hover:bg-teal-600"
                        }`}
                      >
                        <span className="font-medium tracking-wide">
                          {currentStatus === "approved"
                            ? "Lihat Laporan & PDF"
                            : currentStatus === "submitted"
                            ? "Lihat Pengiriman"
                            : currentStatus === "draft"
                            ? "Lanjutkan Pengerjaan"
                            : student?.classGroup === "Dosen Pengampu"
                            ? "Pandu Praktikum (Dosen)"
                            : "Buka Lembar Praktikum"}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
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

