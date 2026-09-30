"use client";

import React, { useState } from "react";
import {
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Download,
  Send,
  Eye,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PracticumModule } from "@/data/practicum";
import {
  PracticumPageData,
  PracticumSubmissionState,
  ObservationRow,
  EssayState,
  submitPracticumReportAction,
  getStudentPracticumPdfUrlAction,
} from "@/actions/practicum";
import { PracticumHeader } from "./practicum-header";
import { PracticumTheory } from "./practicum-theory";
import { ObservationTable } from "./observation-table";
import { EssaySection } from "./essay-section";
import { SignatureModal } from "./signature-modal";

interface PracticumWorkspaceProps {
  practicum: PracticumModule;
  initialData: PracticumPageData;
  student: {
    nim: string;
    fullName: string;
    classGroup: string;
  };
}

export function PracticumWorkspace({
  practicum,
  initialData,
  student,
}: PracticumWorkspaceProps) {
  const [submission, setSubmission] = useState<PracticumSubmissionState | null>(
    initialData.submission
  );
  const [observations, setObservations] = useState<ObservationRow[]>(
    initialData.observations
  );
  const [analysis, setAnalysis] = useState<EssayState | null>(
    initialData.analysis
  );
  const [conclusion, setConclusion] = useState<EssayState | null>(
    initialData.conclusion
  );

  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const status = submission?.status ?? "draft";
  const isLocked = status === "submitted" || status === "approved";

  // Eligibility Checklist:
  const isObservationsFilled =
    practicum.steps.filter((s) => {
      const o = observations.find((row) => row.stepNumber === s.step);
      return o && o.observation.trim().length > 0;
    }).length === practicum.steps.length;

  const isAnalysisPassed = !!analysis?.isPassed;
  const isConclusionPassed = !!conclusion?.isPassed;
  const canSubmit = isObservationsFilled && isAnalysisPassed && isConclusionPassed && !isLocked;

  const handleEssayEvaluated = (
    type: "analysis" | "conclusion",
    updated: EssayState
  ) => {
    if (type === "analysis") {
      setAnalysis(updated);
    } else {
      setConclusion(updated);
    }
  };

  const handleOpenSignatureModal = () => {
    if (!canSubmit) return;
    setActionError(null);
    setIsSignatureModalOpen(true);
  };

  const handleSubmitWithSignature = async (signatureBase64: string) => {
    if (!submission) return;
    setIsSubmitting(true);
    setActionError(null);

    try {
      const res = await submitPracticumReportAction(
        submission.id,
        practicum.id,
        signatureBase64
      );

      if (!res.success) {
        setActionError(res.error ?? "Gagal mengirim laporan praktikum.");
        setIsSubmitting(false);
        return;
      }

      setSubmission((prev) =>
        prev
          ? {
              ...prev,
              status: "submitted",
              studentSignature: signatureBase64,
              submittedAt: new Date().toISOString(),
            }
          : null
      );
      setIsSignatureModalOpen(false);
      setActionSuccess("Laporan praktikum berhasil dikirim! Menunggu persetujuan dosen pengampu.");
    } catch {
      setActionError("Terjadi kesalahan jaringan saat mengirim laporan praktikum.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!submission?.id) return;
    setPdfLoading(true);
    setActionError(null);
    try {
      const res = await getStudentPracticumPdfUrlAction(submission.id);
      if (res.success && res.url) {
        window.open(res.url, "_blank");
      } else {
        setActionError(res.error ?? "File PDF laporan belum tersedia.");
      }
    } catch {
      setActionError("Gagal mengunduh file PDF laporan.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* SEKSI 0: HEADER */}
      <PracticumHeader
        practicum={practicum}
        submission={submission}
        student={student}
        onDownloadPdf={handleDownloadPdf}
        pdfLoading={pdfLoading}
      />

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{actionError}</span>
        </div>
      )}

      {/* SEKSI 1: CAPAIAN & TEORI */}
      <PracticumTheory practicum={practicum} />

      {/* SEKSI 2: PENGAMATAN UJI COBA */}
      {submission && (
        <ObservationTable
          submissionId={submission.id}
          practicum={practicum}
          initialObservations={observations}
          isLocked={isLocked}
          onObservationsChange={setObservations}
        />
      )}

      {/* SEKSI 3: ANALISIS */}
      {submission && (
        <EssaySection
          submissionId={submission.id}
          practicum={practicum}
          essayType="analysis"
          initialEssay={analysis}
          observations={observations}
          isLocked={isLocked}
          onEssayEvaluated={handleEssayEvaluated}
        />
      )}

      {/* SEKSI 4: KESIMPULAN */}
      {submission && (
        <EssaySection
          submissionId={submission.id}
          practicum={practicum}
          essayType="conclusion"
          initialEssay={conclusion}
          observations={observations}
          isLocked={isLocked}
          onEssayEvaluated={handleEssayEvaluated}
        />
      )}

      {/* SEKSI 5: STATUS SUBMISSION & PENGESAHAN LAPORAN */}
      <Card className="border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-xs overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Seksi 5: Pengesahan & Pengiriman Laporan Praktikum
              </CardTitle>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Pastikan seluruh kriteria kelulusan terpenuhi sebelum membubuhkan tanda tangan digital
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Status Banners */}
          {status === "approved" ? (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400 font-bold text-base">
                <CheckCircle2 className="w-5 h-5" />
                <span>Laporan Praktikum Telah Disetujui Dosen!</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Selamat! Laporan hasil praktikum Anda telah diverifikasi dan disahkan oleh{" "}
                <strong>{submission?.approvedByName ?? "Dosen Pengampu"}</strong>. Dokumen laporan resmi ber-stempel digital kini siap diunduh dalam format PDF.
              </p>
              <div className="pt-2">
                <Button
                  onClick={handleDownloadPdf}
                  disabled={pdfLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>{pdfLoading ? "Menyiapkan File..." : "Unduh Laporan PDF Resmi (Disetujui)"}</span>
                </Button>
              </div>
            </div>
          ) : status === "submitted" ? (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400 font-bold text-base">
                <Clock className="w-5 h-5" />
                <span>Laporan Sedang Menunggu Persetujuan Dosen</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Laporan Anda telah berhasil terkirim bersama tanda tangan digital Anda pada{" "}
                <strong>{submission?.submittedAt ? new Date(submission.submittedAt).toLocaleString("id-ID") : "-"}</strong>.
                Dosen pengampu akan mereview hasil pengamatan dan esai Anda di portal monitoring.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPdf}
                  disabled={pdfLoading}
                  className="text-xs text-zinc-700 dark:text-zinc-300 border-amber-500/30 gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-500" />
                  <span>{pdfLoading ? "Mengambil..." : "Lihat Draft PDF Terkirim"}</span>
                </Button>
              </div>
            </div>
          ) : status === "revision" ? (
            <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
              <div className="flex items-center gap-2.5 text-rose-700 dark:text-rose-400 font-bold text-base">
                <RotateCcw className="w-5 h-5" />
                <span>Laporan Memerlukan Revisi dari Dosen</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Dosen pengampu meminta Anda untuk memperbaiki catatan pengamatan atau memperdalam esai analisis/kesimpulan. Silakan perbarui isian Anda dan submit ulang laporan.
              </p>
            </div>
          ) : (
            /* DRAFT: CHECKLIST PERSYARATAN SUBMIT */
            <div className="space-y-4">
              <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Checklist Kelayakan Pengiriman Laporan:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Pengamatan */}
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    isObservationsFilled
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                      : "bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 text-zinc-500"
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>1. Prosedur Uji Coba</span>
                    {isObservationsFilled ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                  <p className="text-[11px] leading-tight">
                    {isObservationsFilled
                      ? "Semua 5 baris pengamatan terisi"
                      : "Lengkapi semua baris pengamatan"}
                  </p>
                </div>

                {/* 2. Analisis */}
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    isAnalysisPassed
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                      : "bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 text-zinc-500"
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>2. Esai Analisis</span>
                    {isAnalysisPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                  <p className="text-[11px] leading-tight">
                    {isAnalysisPassed
                      ? `Lulus skor AI (${analysis?.aiScore}/100)`
                      : "Wajib dievaluasi AI (Skor ≥ 70)"}
                  </p>
                </div>

                {/* 3. Kesimpulan */}
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    isConclusionPassed
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                      : "bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 text-zinc-500"
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>3. Esai Kesimpulan</span>
                    {isConclusionPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                  <p className="text-[11px] leading-tight">
                    {isConclusionPassed
                      ? `Lulus skor AI (${conclusion?.aiScore}/100)`
                      : "Wajib dievaluasi AI (Skor ≥ 70)"}
                  </p>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {canSubmit ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Semua syarat terpenuhi. Anda siap membubuhkan tanda tangan.
                    </span>
                  ) : (
                    <span>
                      Selesaikan tabel pengamatan dan pastikan kedua esai memperoleh nilai AI minimal 70 untuk membuka tombol pengesahan.
                    </span>
                  )}
                </div>

                <Button
                  onClick={handleOpenSignatureModal}
                  disabled={!canSubmit}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs gap-2 px-5 py-2.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Bubuhkan Tanda Tangan & Submit</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL TANDA TANGAN */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSubmit={handleSubmitWithSignature}
        studentName={student.fullName}
        studentNim={student.nim}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
