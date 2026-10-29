"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Award,
  Sparkles,
  ExternalLink,
  Globe,
  BookOpen,
  Layers,
  Terminal,
  Zap,
  Palette,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Loader2,
  FileText,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UtsEvaluationRow,
  UtsEvaluationInput,
  saveUtsEvaluationAction,
} from "@/actions/uts-evaluation";
import { calculateUtsFinalScore } from "@/lib/uts-calculator";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

interface UtsScoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: UtsEvaluationRow | null;
  onSuccess: (updatedRow: any) => void;
}

export function UtsScoringModal({
  isOpen,
  onClose,
  student,
  onSuccess,
}: UtsScoringModalProps) {
  // Form State
  const [projectTitle, setProjectTitle] = useState(student?.project_title || "");
  const [githubUrl, setGithubUrl] = useState(student?.github_url || "");
  const [demoUrl, setDemoUrl] = useState(student?.demo_url || "");

  // 5 Scores (0 - 100)
  const [scoreConcept, setScoreConcept] = useState<number>(student?.score_concept || 80);
  const [scoreArchitecture, setScoreArchitecture] = useState<number>(student?.score_architecture || 80);
  const [scorePrompt, setScorePrompt] = useState<number>(student?.score_prompt || 80);
  const [scoreFeatures, setScoreFeatures] = useState<number>(student?.score_features || 80);
  const [scoreUiUx, setScoreUiUx] = useState<number>(student?.score_ui_ux || 80);

  const [feedbackNotes, setFeedbackNotes] = useState(student?.feedback_notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state if student changes
  useEffect(() => {
    if (student) {
      setProjectTitle(student.project_title || "");
      setGithubUrl(student.github_url || "");
      setDemoUrl(student.demo_url || "");
      setScoreConcept(student.score_concept || 80);
      setScoreArchitecture(student.score_architecture || 80);
      setScorePrompt(student.score_prompt || 80);
      setScoreFeatures(student.score_features || 80);
      setScoreUiUx(student.score_ui_ux || 80);
      setFeedbackNotes(student.feedback_notes || "");
      setErrorMessage(null);
    }
  }, [student]);

  // Live Calculation
  const liveFinalScore = useMemo(() => {
    return calculateUtsFinalScore({
      concept: scoreConcept,
      architecture: scoreArchitecture,
      prompt: scorePrompt,
      features: scoreFeatures,
      ui_ux: scoreUiUx,
    });
  }, [scoreConcept, scoreArchitecture, scorePrompt, scoreFeatures, scoreUiUx]);

  // Predikat
  const gradePredicate = useMemo(() => {
    if (liveFinalScore >= 85) return { label: "A (Sangat Memuaskan)", color: "emerald", border: "border-emerald-500/40", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" };
    if (liveFinalScore >= 75) return { label: "B (Baik & Lulus)", color: "indigo", border: "border-indigo-500/40", bg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" };
    if (liveFinalScore >= 60) return { label: "C (Cukup / Lulus)", color: "amber", border: "border-amber-500/40", bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400" };
    return { label: "Perlu Revisi (< 60)", color: "rose", border: "border-rose-500/40", bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400" };
  }, [liveFinalScore]);

  // Quick preset helper
  const handleApplyPreset = (val: number) => {
    setScoreConcept(val);
    setScoreArchitecture(val);
    setScorePrompt(val);
    setScoreFeatures(val);
    setScoreUiUx(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload: UtsEvaluationInput = {
        student_nim: student.student_nim,
        project_title: projectTitle || "Proyek Aplikasi Serverless",
        github_url: githubUrl,
        demo_url: demoUrl,
        score_concept: scoreConcept,
        score_architecture: scoreArchitecture,
        score_prompt: scorePrompt,
        score_features: scoreFeatures,
        score_ui_ux: scoreUiUx,
        feedback_notes: feedbackNotes,
        status: liveFinalScore >= 60 ? "graded" : "revision_required",
      };

      const res = await saveUtsEvaluationAction(payload);
      if (res.success && res.data) {
        onSuccess(res.data);
        onClose();
      } else {
        setErrorMessage(res.error || "Gagal menyimpan nilai evaluasi.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan internal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  Form Penilaian Presentasi UTS (Milestone 1)
                </h3>
                <Badge variant="outline" className="text-[11px] font-mono border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
                  {student.class_group}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-foreground">{student.student_name}</span>
                <span>•</span>
                <span className="font-mono">{student.student_nim}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Bagian 1: Informasi Proyek */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                Data & Tautan Proyek Mahasiswa
              </h4>
              <span className="text-[11px] text-muted-foreground italic">
                (Diisi langsung saat mahasiswa mempresentasikan)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-foreground">
                  Judul Proyek / Aplikasi
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Odyssey Task Manager: Serverless Agile Board"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <GithubIcon className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                    URL Repositori GitHub
                  </span>
                  {githubUrl && (
                    <a
                      href={githubUrl.startsWith("http") ? githubUrl : `https://${githubUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-normal"
                    >
                      Buka GitHub <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="https://github.com/username/project-repo"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    URL Live Demo Vercel (Opsional)
                  </span>
                  {demoUrl && (
                    <a
                      href={demoUrl.startsWith("http") ? demoUrl : `https://${demoUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-normal"
                    >
                      Buka Live Demo <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="https://my-app.vercel.app"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span className="font-medium">Preset Nilai Cepat ke Seluruh Kriteria:</span>
            <div className="flex items-center gap-1.5">
              {[70, 75, 80, 85, 90, 95].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2 py-0.5 rounded-md text-[11px] font-mono border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Bagian 2: 5 Kriteria Penilaian Berbobot */}
          <div className="space-y-4">
            {/* Kriteria 1: Pemahaman Konsep (25%) */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">Pemahaman Konsep</span>
                      <Badge className="bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30 text-[10px]">
                        Bobot 25%
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Penguasaan arsitektur serverless, RSC vs Client, data-flow Server Actions, dan alasan teknis pemilihan stack.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-cyan-600 dark:text-cyan-400">
                    {scoreConcept}
                  </span>
                  <span className="text-[10px] text-muted-foreground block font-mono">
                    Kontribusi: {(scoreConcept * 0.25).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={scoreConcept}
                  onChange={(e) => setScoreConcept(Number(e.target.value))}
                  className="flex-1 accent-cyan-500 cursor-pointer h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={scoreConcept}
                  onChange={(e) => setScoreConcept(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                  className="w-16 px-2 py-1 text-xs text-center font-mono rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                />
              </div>
            </div>

            {/* Kriteria 2: Kesesuaian Arsitektur Aplikasi (25%) */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">Kesesuaian Arsitektur Aplikasi dengan Konsep Project</span>
                      <Badge className="bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 text-[10px]">
                        Bobot 25%
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Kesesuaian skema PostgreSQL di Supabase (relasi tabel, foreign keys, pemisahan layer server/client).
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {scoreArchitecture}
                  </span>
                  <span className="text-[10px] text-muted-foreground block font-mono">
                    Kontribusi: {(scoreArchitecture * 0.25).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={scoreArchitecture}
                  onChange={(e) => setScoreArchitecture(Number(e.target.value))}
                  className="flex-1 accent-indigo-500 cursor-pointer h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={scoreArchitecture}
                  onChange={(e) => setScoreArchitecture(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                  className="w-16 px-2 py-1 text-xs text-center font-mono rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                />
              </div>
            </div>

            {/* Kriteria 3: Konstruksi Prompt (20%) */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">Konstruksi Prompt (AI-Assisted Workflow)</span>
                      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px]">
                        Bobot 20%
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Penerapan framework C-R-E-T, kejelasan persona/role, batasan teknis eksplisit, dan alur kerja AI di IDE.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-amber-600 dark:text-amber-400">
                    {scorePrompt}
                  </span>
                  <span className="text-[10px] text-muted-foreground block font-mono">
                    Kontribusi: {(scorePrompt * 0.20).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={scorePrompt}
                  onChange={(e) => setScorePrompt(Number(e.target.value))}
                  className="flex-1 accent-amber-500 cursor-pointer h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={scorePrompt}
                  onChange={(e) => setScorePrompt(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                  className="w-16 px-2 py-1 text-xs text-center font-mono rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                />
              </div>
            </div>

            {/* Kriteria 4: Kesesuaian Alur & Fitur yang Sudah Berjalan (20%) */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">Kesesuaian Alur dan Fitur yang Sudah Berjalan</span>
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px]">
                        Bobot 20%
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Alur login/auth berjalan, form validasi Zod bekerja, CRUD data tersimpan tanpa crash fatal saat live demo.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {scoreFeatures}
                  </span>
                  <span className="text-[10px] text-muted-foreground block font-mono">
                    Kontribusi: {(scoreFeatures * 0.20).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={scoreFeatures}
                  onChange={(e) => setScoreFeatures(Number(e.target.value))}
                  className="flex-1 accent-emerald-500 cursor-pointer h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={scoreFeatures}
                  onChange={(e) => setScoreFeatures(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                  className="w-16 px-2 py-1 text-xs text-center font-mono rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                />
              </div>
            </div>

            {/* Kriteria 5: Estetika UI/UX (10%) */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs">
                    5
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">Estetika UI / UX</span>
                      <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 text-[10px]">
                        Bobot 10%
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Kerapian desain Shadcn/Tailwind, konsistensi tema, feedback loading, dan responsivitas pada berbagai layar.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-rose-600 dark:text-rose-400">
                    {scoreUiUx}
                  </span>
                  <span className="text-[10px] text-muted-foreground block font-mono">
                    Kontribusi: {(scoreUiUx * 0.10).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={scoreUiUx}
                  onChange={(e) => setScoreUiUx(Number(e.target.value))}
                  className="flex-1 accent-rose-500 cursor-pointer h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={scoreUiUx}
                  onChange={(e) => setScoreUiUx(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                  className="w-16 px-2 py-1 text-xs text-center font-mono rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                />
              </div>
            </div>
          </div>

          {/* Visual Hero: Perhitungan Skor Akhir */}
          <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-950/80 border border-zinc-300 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Nilai Akhir Terhitung (UTS Milestone 1)
              </span>
              <p className="text-[11px] font-mono text-muted-foreground">
                ({scoreConcept}×25%) + ({scoreArchitecture}×25%) + ({scorePrompt}×20%) + ({scoreFeatures}×20%) + ({scoreUiUx}×10%)
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-black font-mono text-foreground tracking-tight">
                  {liveFinalScore.toFixed(2)}
                  <span className="text-sm font-normal text-muted-foreground font-sans"> / 100</span>
                </div>
              </div>
              <Badge className={`px-3 py-1.5 text-xs font-bold border ${gradePredicate.bg} ${gradePredicate.border}`}>
                {gradePredicate.label}
              </Badge>
            </div>
          </div>

          {/* Bagian 3: Feedback & Catatan Evaluasi Dosen */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                Catatan Masukan Dosen & Action Items Menuju UAS
              </span>
              <span className="text-[11px] text-muted-foreground font-normal">
                (Sangat bermanfaat sebagai panduan perbaikan mahasiswa)
              </span>
            </label>
            <textarea
              rows={3}
              placeholder="Contoh: Alur CRUD tasks dan validasi Zod sudah rapi. Perhatikan normalisasi foreign key pada tabel categories, serta lengkapi penanganan error boundary sebelum memasuki materi Realtime WebSocket di Minggu 11."
              value={feedbackNotes}
              onChange={(e) => setFeedbackNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Footer Action */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan Nilai...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Simpan Nilai UTS ({liveFinalScore.toFixed(2)})
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
