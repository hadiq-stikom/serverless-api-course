"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Award,
  Users,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Download,
  ExternalLink,
  Edit3,
  RotateCcw,
  Loader2,
  Sparkles,
  AlertTriangle,
  Globe,
  FileSpreadsheet,
  Layers,
  Copy,
  Check,
  Zap,
  Trash2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UtsEvaluationRow,
  UtsEvaluationSummary,
  getUtsEvaluationDataAction,
  deleteUtsEvaluationAction,
} from "@/actions/uts-evaluation";
import { UtsScoringModal } from "@/components/dosen/uts-scoring-modal";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

interface UtsEvaluationTabProps {
  selectedClass?: string;
}

export function UtsEvaluationTab({ selectedClass: initialClass }: UtsEvaluationTabProps) {
  const [selectedClass, setSelectedClass] = useState<string>(initialClass || "sp5.1");
  const [data, setData] = useState<UtsEvaluationRow[]>([]);
  const [summary, setSummary] = useState<UtsEvaluationSummary | null>(null);
  const [availableClasses, setAvailableClasses] = useState<string[]>(["sp5.1"]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "graded" | "ungraded">("all");
  const [isTableMissing, setIsTableMissing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Scoring Modal
  const [activeStudent, setActiveStudent] = useState<UtsEvaluationRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Notification Toast
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Load Data
  const fetchData = async () => {
    setLoading(true);
    setIsTableMissing(false);
    try {
      const res = await getUtsEvaluationDataAction(selectedClass);
      if (res.isTableMissing) {
        setIsTableMissing(true);
      } else if (res.success && res.data) {
        setData(res.data);
        if (res.summary) setSummary(res.summary);
        if (res.availableClasses) setAvailableClasses(res.availableClasses);
      } else if (res.error) {
        setActionMessage({ type: "error", text: res.error });
      }
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message || "Gagal memuat data evaluasi UTS." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedClass]);

  // Handle Modal Success
  const handleScoringSuccess = (updatedRow: any) => {
    setData((prev) =>
      prev.map((item) =>
        item.student_nim === updatedRow.student_nim
          ? {
              ...item,
              project_title: updatedRow.project_title,
              github_url: updatedRow.github_url,
              demo_url: updatedRow.demo_url,
              score_concept: Number(updatedRow.score_concept),
              score_architecture: Number(updatedRow.score_architecture),
              score_prompt: Number(updatedRow.score_prompt),
              score_features: Number(updatedRow.score_features),
              score_ui_ux: Number(updatedRow.score_ui_ux),
              final_score: Number(updatedRow.final_score),
              feedback_notes: updatedRow.feedback_notes,
              status: updatedRow.status,
              is_graded: true,
              evaluated_at: updatedRow.evaluated_at,
            }
          : item
      )
    );

    // Refresh summary recalculation
    fetchData();

    setActionMessage({
      type: "success",
      text: `Nilai UTS untuk ${updatedRow.student_nim} berhasil disimpan! Skor: ${updatedRow.final_score}`,
    });
  };

  // Reset/Delete Evaluation
  const handleResetEvaluation = async (student: UtsEvaluationRow) => {
    if (!confirm(`Apakah Anda yakin ingin mereset penilaian UTS untuk ${student.student_name} (${student.student_nim})?`)) {
      return;
    }

    try {
      const res = await deleteUtsEvaluationAction(student.student_nim);
      if (res.success) {
        setData((prev) =>
          prev.map((item) =>
            item.student_nim === student.student_nim
              ? {
                  ...item,
                  project_title: "",
                  github_url: "",
                  demo_url: "",
                  score_concept: 0,
                  score_architecture: 0,
                  score_prompt: 0,
                  score_features: 0,
                  score_ui_ux: 0,
                  final_score: 0,
                  feedback_notes: "",
                  status: "draft",
                  is_graded: false,
                }
              : item
          )
        );
        fetchData();
        setActionMessage({
          type: "success",
          text: `Nilai UTS ${student.student_name} telah di-reset.`,
        });
      } else {
        setActionMessage({ type: "error", text: res.error || "Gagal mereset nilai." });
      }
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message || "Gagal mereset nilai." });
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (data.length === 0) return;

    const headers = [
      "No",
      "NIM",
      "Nama Mahasiswa",
      "Kelas",
      "Judul Proyek",
      "URL GitHub",
      "URL Live Demo",
      "1. Pemahaman Konsep (25%)",
      "2. Kesesuaian Arsitektur (25%)",
      "3. Konstruksi Prompt (20%)",
      "4. Alur & Fitur (20%)",
      "5. Estetika UI/UX (10%)",
      "Nilai Akhir UTS",
      "Status Penilaian",
      "Catatan Masukan Dosen",
    ];

    const rows = filteredData.map((item, idx) => [
      idx + 1,
      `"${item.student_nim}"`,
      `"${item.student_name.replace(/"/g, '""')}"`,
      `"${item.class_group}"`,
      `"${(item.project_title || "-").replace(/"/g, '""')}"`,
      `"${item.github_url || "-"}"`,
      `"${item.demo_url || "-"}"`,
      item.is_graded ? item.score_concept : 0,
      item.is_graded ? item.score_architecture : 0,
      item.is_graded ? item.score_prompt : 0,
      item.is_graded ? item.score_features : 0,
      item.is_graded ? item.score_ui_ux : 0,
      item.is_graded ? item.final_score : 0,
      item.is_graded ? (item.final_score >= 60 ? "Lulus" : "Perlu Revisi") : "Belum Dinilai",
      `"${(item.feedback_notes || "-").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Rekap_Nilai_UTS_Serverless_${selectedClass}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered List
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Status filter
      if (statusFilter === "graded" && !item.is_graded) return false;
      if (statusFilter === "ungraded" && item.is_graded) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNim = item.student_nim.toLowerCase().includes(q);
        const matchName = item.student_name.toLowerCase().includes(q);
        const matchTitle = (item.project_title || "").toLowerCase().includes(q);
        return matchNim || matchName || matchTitle;
      }

      return true;
    });
  }, [data, statusFilter, searchQuery]);

  const copySqlScript = () => {
    const sql = `CREATE TABLE IF NOT EXISTS public.project_uts_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_nim TEXT NOT NULL UNIQUE REFERENCES public.students(nim) ON DELETE CASCADE,
    project_title TEXT DEFAULT '',
    github_url TEXT DEFAULT '',
    demo_url TEXT DEFAULT '',
    score_concept NUMERIC(5,2) DEFAULT 0 CHECK (score_concept >= 0 AND score_concept <= 100),
    score_architecture NUMERIC(5,2) DEFAULT 0 CHECK (score_architecture >= 0 AND score_architecture <= 100),
    score_prompt NUMERIC(5,2) DEFAULT 0 CHECK (score_prompt >= 0 AND score_prompt <= 100),
    score_features NUMERIC(5,2) DEFAULT 0 CHECK (score_features >= 0 AND score_features <= 100),
    score_ui_ux NUMERIC(5,2) DEFAULT 0 CHECK (score_ui_ux >= 0 AND score_ui_ux <= 100),
    final_score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (final_score >= 0 AND final_score <= 100),
    feedback_notes TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'graded' CHECK (status IN ('draft', 'graded', 'revision_required')),
    evaluated_by TEXT,
    evaluated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.project_uts_evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON public.project_uts_evaluations FOR ALL USING (true) WITH CHECK (true);`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {actionMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
            actionMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-muted-foreground hover:text-foreground text-xs ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Warning jika tabel belum dibuat di Supabase */}
      {isTableMissing && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground">
                Tabel Evaluasi UTS (`project_uts_evaluations`) Belum Dibuat di Supabase
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Jalankan skrip DDL SQL di bawah ini di <strong>SQL Editor Supabase Dashboard</strong> Anda untuk mengaktifkan penyimpanan nilai presentasi UTS.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Button
              size="sm"
              onClick={copySqlScript}
              className="text-xs bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSql ? "Skrip SQL Tersalin!" : "Salin Skrip SQL Migrasi"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchData}
              className="text-xs flex items-center gap-1.5 border-amber-500/30"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Cek Ulang Database
            </Button>
          </div>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Mahasiswa */}
        <Card className="border border-border/80 shadow-xs bg-card/60 backdrop-blur-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Total Mahasiswa</p>
              <p className="text-2xl font-bold font-mono text-foreground">
                {summary?.totalStudents ?? data.length}
              </p>
              <p className="text-[10px] text-muted-foreground">Kelas: {selectedClass}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Sudah Dinilai */}
        <Card className="border border-border/80 shadow-xs bg-card/60 backdrop-blur-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Sudah Dinilai</p>
              <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {summary?.gradedCount ?? 0}
                <span className="text-xs font-normal text-muted-foreground font-sans ml-1.5">
                  / {summary?.totalStudents ?? data.length}
                </span>
              </p>
              <div className="w-28 bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      summary?.totalStudents
                        ? Math.round((summary.gradedCount / summary.totalStudents) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Belum Dinilai */}
        <Card className="border border-border/80 shadow-xs bg-card/60 backdrop-blur-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Antrean Presentasi</p>
              <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
                {summary?.ungradedCount ?? data.length}
              </p>
              <p className="text-[10px] text-muted-foreground">Belum Dinilai</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* Rata-Rata Nilai UTS */}
        <Card className="border border-border/80 shadow-xs bg-card/60 backdrop-blur-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Rata-Rata Kelas</p>
              <p className="text-2xl font-bold font-mono text-foreground">
                {summary?.averageScore ? summary.averageScore.toFixed(2) : "0.00"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Tertinggi: {summary?.highScore ? summary.highScore.toFixed(2) : "-"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Bar: Filter Kelas, Search, Status, & Tombol Ekspor */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground font-medium">Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent font-semibold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Kelas</option>
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-zinc-100 dark:bg-zinc-800 text-foreground font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Semua ({data.length})
            </button>
            <button
              onClick={() => setStatusFilter("ungraded")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                statusFilter === "ungraded"
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Belum ({summary?.ungradedCount ?? 0})
            </button>
            <button
              onClick={() => setStatusFilter("graded")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                statusFilter === "graded"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sudah ({summary?.gradedCount ?? 0})
            </button>
          </div>
        </div>

        {/* Search & Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari NIM, Nama, atau Proyek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={fetchData}
            title="Refresh Data"
            className="text-xs p-2 shrink-0 border-zinc-300 dark:border-zinc-700"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <Button
            size="sm"
            onClick={handleExportCsv}
            disabled={filteredData.length === 0}
            className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shrink-0"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ekspor CSV</span>
          </Button>
        </div>
      </div>

      {/* Tabel Mahasiswa & Penilaian UTS */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-900/90 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3 font-semibold text-center w-12">No</th>
                <th className="px-4 py-3 font-semibold">Mahasiswa</th>
                <th className="px-4 py-3 font-semibold">Proyek & Repositori</th>
                <th className="px-4 py-3 font-semibold text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-center">Nilai Akhir UTS</th>
                <th className="px-4 py-3 font-semibold text-right pr-6">Aksi Penilaian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500 mb-2" />
                    <p className="text-xs">Memuat daftar mahasiswa & nilai UTS...</p>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground space-y-1">
                    <Users className="w-8 h-8 mx-auto text-zinc-400 opacity-60 mb-1" />
                    <p className="text-xs font-semibold text-foreground">Tidak Ada Data Mahasiswa</p>
                    <p className="text-[11px]">
                      {searchQuery
                        ? `Tidak ditemukan hasil untuk "${searchQuery}"`
                        : `Belum ada data mahasiswa untuk kelas ${selectedClass}`}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredData.map((student, idx) => {
                  const isGraded = student.is_graded;
                  const finalScore = student.final_score;

                  return (
                    <tr
                      key={student.student_nim}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      {/* No */}
                      <td className="px-4 py-3.5 text-center font-mono text-muted-foreground">
                        {idx + 1}
                      </td>

                      {/* Mahasiswa Info */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-500/20">
                            {student.student_name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground leading-tight">
                              {student.student_name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-[11px] text-muted-foreground">
                                {student.student_nim}
                              </span>
                              <span className="text-zinc-300 dark:text-zinc-700">•</span>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                {student.class_group}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Proyek & Repositori */}
                      <td className="px-4 py-3.5 max-w-xs">
                        {student.project_title ? (
                          <div className="space-y-1">
                            <p className="font-medium text-foreground text-xs truncate" title={student.project_title}>
                              {student.project_title}
                            </p>
                            <div className="flex items-center gap-2 text-[11px]">
                              {student.github_url && (
                                <a
                                  href={student.github_url.startsWith("http") ? student.github_url : `https://${student.github_url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 font-mono"
                                >
                                  <GithubIcon className="w-3 h-3" /> GitHub <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                              {student.demo_url && (
                                <a
                                  href={student.demo_url.startsWith("http") ? student.demo_url : `https://${student.demo_url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 font-mono"
                                >
                                  <Globe className="w-3 h-3" /> Live Demo <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground italic">
                            Belum diisi (diinput saat demo)
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center">
                        {isGraded ? (
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px] font-semibold">
                            ✓ Sudah Dinilai
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-zinc-500 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 text-[10px]">
                            Belum Dinilai
                          </Badge>
                        )}
                      </td>

                      {/* Nilai Akhir UTS */}
                      <td className="px-4 py-3.5 text-center">
                        {isGraded ? (
                          <div className="inline-flex flex-col items-center">
                            <span
                              className={`text-base font-extrabold font-mono px-2.5 py-0.5 rounded-lg border ${
                                finalScore >= 85
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                  : finalScore >= 75
                                  ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
                                  : finalScore >= 60
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                              }`}
                            >
                              {finalScore.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-0.5">
                              {finalScore >= 85 ? "Grade A" : finalScore >= 75 ? "Grade B" : finalScore >= 60 ? "Grade C" : "Revisi"}
                            </span>
                          </div>
                        ) : (
                          <span className="font-mono text-xs text-muted-foreground">-</span>
                        )}
                      </td>

                      {/* Aksi Penilaian */}
                      <td className="px-4 py-3.5 text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          {isGraded ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setActiveStudent(student);
                                  setIsModalOpen(true);
                                }}
                                className="text-xs h-8 px-2.5 border-zinc-300 dark:border-zinc-700 text-foreground flex items-center gap-1"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                                <span>Edit</span>
                              </Button>

                              <button
                                type="button"
                                onClick={() => handleResetEvaluation(student)}
                                title="Reset Nilai Mahasiswa Ini"
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => {
                                setActiveStudent(student);
                                setIsModalOpen(true);
                              }}
                              className="text-xs h-8 px-3 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-xs"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              <span>Beri Nilai</span>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Penilaian UTS */}
      {isModalOpen && activeStudent && (
        <UtsScoringModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setActiveStudent(null);
          }}
          student={activeStudent}
          onSuccess={handleScoringSuccess}
        />
      )}
    </div>
  );
}
