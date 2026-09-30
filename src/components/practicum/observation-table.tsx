"use client";

import React, { useState } from "react";
import { Terminal, Save, CheckCircle2, AlertCircle, Info, Sparkles, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PracticumModule, PracticumStep, THEME_COLORS } from "@/data/practicum";
import { ObservationRow, saveObservationAction } from "@/actions/practicum";

interface ObservationTableProps {
  submissionId: string;
  practicum: PracticumModule;
  initialObservations: ObservationRow[];
  isLocked: boolean; // true jika status === 'submitted' atau 'approved'
  onObservationsChange?: (observations: ObservationRow[]) => void;
}

export function ObservationTable({
  submissionId,
  practicum,
  initialObservations,
  isLocked,
  onObservationsChange,
}: ObservationTableProps) {
  const theme = THEME_COLORS[practicum.theme.color];

  // Map initial observations to state
  const [observations, setObservations] = useState<Record<number, string>>(() => {
    const map: Record<number, string> = {};
    practicum.steps.forEach((s) => {
      const existing = initialObservations.find((o) => o.stepNumber === s.step);
      map[s.step] = existing?.observation ?? "";
    });
    return map;
  });

  const [savingStep, setSavingStep] = useState<number | null>(null);
  const [savedSteps, setSavedSteps] = useState<Record<number, boolean>>({});
  const [savingAll, setSavingAll] = useState(false);
  const [globalMessage, setGlobalMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleInputChange = (stepNumber: number, text: string) => {
    setObservations((prev) => {
      const updated = { ...prev, [stepNumber]: text };
      if (onObservationsChange) {
        const rows: ObservationRow[] = Object.entries(updated).map(([k, v]) => ({
          stepNumber: parseInt(k, 10),
          observation: v,
        }));
        onObservationsChange(rows);
      }
      return updated;
    });
    // Reset saved indicator on typing
    setSavedSteps((prev) => ({ ...prev, [stepNumber]: false }));
  };

  const handleSaveStep = async (stepNumber: number) => {
    if (isLocked) return;
    setSavingStep(stepNumber);
    setGlobalMessage(null);
    try {
      const text = observations[stepNumber] ?? "";
      const res = await saveObservationAction(submissionId, stepNumber, text);
      if (res.success) {
        setSavedSteps((prev) => ({ ...prev, [stepNumber]: true }));
      } else {
        setGlobalMessage({ type: "error", text: res.error ?? "Gagal menyimpan pengamatan." });
      }
    } catch {
      setGlobalMessage({ type: "error", text: "Terjadi kesalahan saat menyimpan pengamatan." });
    } finally {
      setSavingStep(null);
    }
  };

  const handleSaveAll = async () => {
    if (isLocked) return;
    setSavingAll(true);
    setGlobalMessage(null);
    let allOk = true;
    try {
      for (const step of practicum.steps) {
        const text = observations[step.step] ?? "";
        const res = await saveObservationAction(submissionId, step.step, text);
        if (res.success) {
          setSavedSteps((prev) => ({ ...prev, [step.step]: true }));
        } else {
          allOk = false;
        }
      }
      if (allOk) {
        setGlobalMessage({ type: "success", text: "Seluruh catatan hasil pengamatan berhasil disimpan!" });
      } else {
        setGlobalMessage({ type: "error", text: "Beberapa baris pengamatan gagal disimpan. Silakan periksa kembali." });
      }
    } catch {
      setGlobalMessage({ type: "error", text: "Terjadi kesalahan koneksi saat menyimpan pengamatan." });
    } finally {
      setSavingAll(false);
    }
  };

  const filledCount = practicum.steps.filter((s) => (observations[s.step] ?? "").trim().length > 0).length;

  return (
    <Card className="border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-xs overflow-hidden">
      <CardHeader className="py-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Seksi 2: Prosedur Uji Coba & Hasil Pengamatan
              </CardTitle>
              <Badge variant="outline" className={`${theme.badge} text-[10px] font-mono`}>
                {filledCount} dari {practicum.steps.length} Terisi
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Jalankan setiap prosedur di lingkungan praktikum dan catat hasil pengamatan empiris Anda
            </p>
          </div>
        </div>

        {!isLocked && (
          <Button
            size="sm"
            onClick={handleSaveAll}
            disabled={savingAll}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
          >
            {savingAll ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{savingAll ? "Menyimpan..." : "Simpan Semua Pengamatan"}</span>
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {globalMessage && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              globalMessage.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
            }`}
          >
            {globalMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{globalMessage.text}</span>
          </div>
        )}

        <div className="space-y-4">
          {practicum.steps.map((step) => {
            const isSavingThis = savingStep === step.step;
            const isSavedThis = savedSteps[step.step];
            const currentText = observations[step.step] ?? "";

            return (
              <div
                key={step.step}
                className="p-4 md:p-5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-4 transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
              >
                {/* Step Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {step.step}
                    </span>
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                        Langkah {step.step} — Instruksi Uji Coba:
                      </div>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-mono text-xs bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60">
                        {step.instruksi}
                      </p>
                    </div>
                  </div>

                  {!isLocked && (
                    <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                      {isSavedThis && (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium mr-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Tersimpan
                        </span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveStep(step.step)}
                        disabled={isSavingThis || isLocked}
                        className="h-7 px-2.5 text-xs text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        {isSavingThis ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Save className="w-3 h-3 mr-1" />
                        )}
                        Simpan
                      </Button>
                    </div>
                  )}
                </div>

                {/* Expected Output Hint */}
                <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60 text-xs text-zinc-500 dark:text-zinc-400">
                  <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Contoh Output yang Diharapkan: </span>
                    <span className="font-mono text-zinc-600 dark:text-zinc-400">{step.contoh_output}</span>
                  </div>
                </div>

                {/* Observation Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                    <span>Hasil Pengamatan Anda:</span>
                    <span className="text-[11px] text-zinc-400 font-normal">
                      {currentText.length} karakter
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    disabled={isLocked}
                    value={currentText}
                    onChange={(e) => handleInputChange(step.step, e.target.value)}
                    placeholder="Tuliskan respon terminal, status log, screenshot teks atau perilaku aplikasi yang Anda amati saat menjalankan langkah ini..."
                    className="w-full text-xs font-mono p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed leading-relaxed"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
