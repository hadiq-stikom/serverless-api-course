"use client";

import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Brain,
  Cpu,
  Loader2,
  RefreshCw,
  Award,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  EssayState,
  ObservationRow,
  PracticumEvaluationResult,
  evaluatePracticumEssayAction,
} from "@/actions/practicum";
import { PracticumModule } from "@/data/practicum";

interface EssaySectionProps {
  submissionId: string;
  practicum: PracticumModule;
  essayType: "analysis" | "conclusion";
  initialEssay: EssayState | null;
  observations?: ObservationRow[];
  isLocked: boolean;
  onEssayEvaluated?: (essayType: "analysis" | "conclusion", essay: EssayState) => void;
}

export function EssaySection({
  submissionId,
  practicum,
  essayType,
  initialEssay,
  observations = [],
  isLocked,
  onEssayEvaluated,
}: EssaySectionProps) {
  const isAnalysis = essayType === "analysis";
  const title = isAnalysis ? "Seksi 3: Analisis Hasil Pengujian" : "Seksi 4: Kesimpulan Praktikum";
  const subtitle = isAnalysis
    ? "Bandingkan temuan empiris pada tabel pengamatan dengan teori dasar, arsitektur sistem, dan potensi kendala teknis."
    : "Rangkum capaian esensial, pemenuhan CPMK, dan pelajaran utama dari praktikum yang telah dilaksanakan.";
  const placeholder = isAnalysis
    ? "Tuliskan analisis komprehensif Anda di sini... Jelaskan korelasi antara langkah uji coba, perilaku sistem yang terjadi, mengapa output tersebut muncul, serta implikasi keamanannya..."
    : "Tuliskan kesimpulan komprehensif Anda di sini... Jelaskan apa yang telah berhasil dibuktikan, ketercapaian capaian praktikum, serta rekomendasi best-practice...";

  const [text, setText] = useState(initialEssay?.studentText ?? "");
  const [score, setScore] = useState<number | null>(initialEssay?.aiScore ?? null);
  const [feedback, setFeedback] = useState<string | null>(initialEssay?.aiFeedback ?? null);
  const [provider, setProvider] = useState<string | null>(initialEssay?.aiProvider ?? null);
  const [attemptCount, setAttemptCount] = useState<number>(initialEssay?.attemptCount ?? 0);
  const [isPassed, setIsPassed] = useState<boolean>(initialEssay?.isPassed ?? false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Parsed strengths & missing points from feedback if available
  const [detailedResult, setDetailedResult] = useState<PracticumEvaluationResult | null>(null);

  const handleEvaluate = async () => {
    if (isLocked) return;
    if (text.trim().length < 50) {
      setErrorMsg("Esai terlalu singkat. Minimal tuliskan 50 karakter untuk evaluasi AI.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await evaluatePracticumEssayAction({
        submissionId,
        practicumId: practicum.id,
        essayType,
        studentText: text,
        observations,
      });

      if (!res.success || !res.result) {
        setErrorMsg(res.error ?? "Gagal memproses evaluasi AI. Silakan coba kembali.");
        return;
      }

      const r = res.result;
      setScore(r.score);
      setFeedback(r.feedback);
      setProvider(r.providerUsed);
      setIsPassed(r.isPassed);
      setAttemptCount((prev) => prev + 1);
      setDetailedResult(r);

      if (onEssayEvaluated) {
        onEssayEvaluated(essayType, {
          essayType,
          studentText: text,
          aiScore: r.score,
          aiFeedback: r.feedback,
          aiProvider: r.providerUsed,
          attemptCount: attemptCount + 1,
          isPassed: r.isPassed,
        });
      }
    } catch {
      setErrorMsg("Terjadi kegagalan jaringan saat menghubungi evaluator AI.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (sc: number) => {
    if (sc >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (sc >= 70) return "text-teal-600 dark:text-teal-400";
    if (sc >= 50) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  };

  return (
    <Card className="border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-xs overflow-hidden">
      <CardHeader className="py-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isAnalysis
                ? "bg-violet-500/10 border border-violet-500/30 text-violet-600 dark:text-violet-400"
                : "bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400"
            }`}
          >
            {isAnalysis ? <Brain className="w-4 h-4" /> : <Award className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {title}
              </CardTitle>
              {isPassed ? (
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-mono gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Lulus (≥ 70)
                </Badge>
              ) : score !== null ? (
                <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 text-[10px] font-mono gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Belum Lulus (&lt; 70)
                </Badge>
              ) : (
                <Badge variant="outline" className="text-zinc-400 text-[10px] font-mono">
                  Belum Diperiksa
                </Badge>
              )}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>
          </div>
        </div>

        {score !== null && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 shrink-0">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Skor AI:</span>
            <span className={`text-base font-extrabold font-mono ${getScoreColor(score)}`}>
              {score}/100
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Textarea Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              Uraian Pemikiran Anda:
            </span>
            <span className="text-zinc-400 font-mono text-[11px]">
              {text.trim().split(/\s+/).filter(Boolean).length} kata • {text.length} karakter
            </span>
          </div>
          <textarea
            rows={6}
            disabled={isLocked || loading}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            className="w-full text-xs sm:text-sm p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed leading-relaxed font-sans"
          />
        </div>

        {/* Action Button & Evaluation Trigger */}
        {!isLocked && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>
                Threshold kelulusan: <strong className="text-zinc-700 dark:text-zinc-300">Skor ≥ 70</strong>. AI mengevaluasi kedalaman, akurasi konsep & objektivitas empiris.
              </span>
            </div>

            <Button
              onClick={handleEvaluate}
              disabled={loading || text.trim().length < 50}
              className={`text-xs font-semibold gap-2 shadow-xs ${
                isPassed
                  ? "bg-zinc-800 hover:bg-zinc-700 text-white dark:bg-zinc-200 dark:hover:bg-zinc-300 dark:text-zinc-900"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menganalisis Jawaban...</span>
                </>
              ) : isPassed ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Uji Ulang / Revisi AI</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Periksa dengan AI Evaluator</span>
                </>
              )}
            </Button>
          </div>
        )}

        {/* AI Evaluation Results Panel */}
        {score !== null && (
          <div className="p-4 md:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/60 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                <Brain className="w-4 h-4 text-indigo-500" />
                <span>Hasil Penilaian AI Evaluator</span>
                {provider && (
                  <Badge variant="outline" className="text-[10px] font-mono text-zinc-500">
                    Engine: {provider}
                  </Badge>
                )}
              </div>
              <div className="text-xs text-zinc-500 font-mono">
                Percobaan ke-{attemptCount}
              </div>
            </div>

            {/* Score Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-600 dark:text-zinc-400">Skor Capaian:</span>
                <span className={`font-bold font-mono ${getScoreColor(score)}`}>
                  {score} / 100 {score >= 70 ? "(Memenuhi Syarat)" : "(Di Bawah Ambang 70)"}
                </span>
              </div>
              <Progress
                value={score}
                className={`h-2 ${score >= 70 ? "[&>div]:bg-emerald-500" : "[&>div]:bg-rose-500"}`}
              />
            </div>

            {/* AI Feedback Socratic / Guidance */}
            {feedback && (
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Umpan Balik Socratic AI:</span>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/70 text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans whitespace-pre-line">
                  {feedback}
                </div>
              </div>
            )}

            {/* Strengths & Missing Points (if present in detailed result) */}
            {detailedResult?.strengths && detailedResult.strengths.length > 0 && (
              <div className="space-y-1.5 text-xs">
                <div className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Poin-Poin yang Sudah Kuat:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                  {detailedResult.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {detailedResult?.missingPoints && detailedResult.missingPoints.length > 0 && !isPassed && (
              <div className="space-y-1.5 text-xs">
                <div className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Poin yang Perlu Anda Perdalam untuk Lulus:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                  {detailedResult.missingPoints.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
