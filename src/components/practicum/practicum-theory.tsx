"use client";

import React, { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Lightbulb,
  CheckCircle2,
  TableProperties,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Terminal,
  FileCode,
  Layers,
  HelpCircle,
  Flame,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PracticumModule, getPracticumTheme } from "@/data/practicum";
import { getPracticumTheoryData } from "@/data/practicum-theories";
import { VsCodeSnippet } from "@/components/vscode-snippet";

function FormattedConceptExplanation({ text }: { text: string }) {
  if (!text) return null;

  // Split into paragraphs / points by double newline
  const paragraphs = text.split(/\n\n+/).filter(Boolean);

  // Helper to format inline markdown like `code`, **bold**, and *italic*
  const formatInline = (str: string) => {
    // Regex for matching `code`, **bold**, or *italic*
    const parts = str.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        const code = part.slice(1, -1);
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-teal-500/10 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-500/25 dark:border-teal-500/30 mx-0.5 inline-block align-baseline"
          >
            {code}
          </code>
        );
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        const bold = part.slice(2, -2);
        return (
          <strong key={idx} className="font-bold text-slate-900 dark:text-zinc-100">
            {bold}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        const italic = part.slice(1, -1);
        return (
          <em key={idx} className="italic text-slate-800 dark:text-zinc-200 font-medium">
            {italic}
          </em>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const isNumbered = paragraphs.some((p) => p.match(/^\d+\.\s+/));

  if (isNumbered || paragraphs.length > 1) {
    return (
      <div className="space-y-2 pt-1">
        {paragraphs.map((p, idx) => {
          const match = p.match(/^(\d+)\.\s+(.*)/);
          const bulletMatch = p.match(/^-\s+(.*)/);

          if (match) {
            const num = match[1];
            const content = match[2];
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-950/40 border border-slate-200/60 dark:border-zinc-800/60 hover:border-teal-500/35 transition-colors shadow-2xs"
              >
                <span className="w-5 h-5 rounded-md bg-teal-500/10 border border-teal-500/25 text-teal-700 dark:text-teal-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {num}
                </span>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed flex-1">
                  {formatInline(content)}
                </p>
              </div>
            );
          }

          if (bulletMatch) {
            const content = bulletMatch[1];
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-950/40 border border-slate-200/60 dark:border-zinc-800/60 hover:border-teal-500/35 transition-colors shadow-2xs"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-2" />
                <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed flex-1">
                  {formatInline(content)}
                </p>
              </div>
            );
          }

          return (
            <p
              key={idx}
              className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed"
            >
              {formatInline(p)}
            </p>
          );
        })}
      </div>
    );
  }

  // Single paragraph
  return (
    <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
      {formatInline(paragraphs[0] || text)}
    </p>
  );
}

interface PracticumTheoryProps {
  practicum: PracticumModule;
}

export function PracticumTheory({ practicum }: PracticumTheoryProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"concepts" | "matrix" | "rules">("concepts");
  const theme = getPracticumTheme(practicum?.theme?.color);

  const theoryData = getPracticumTheoryData(practicum.id);

  return (
    <Card className="border border-slate-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md shadow-xs overflow-hidden rounded-2xl transition-all">
      {/* Header Panel */}
      <CardHeader
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer select-none py-4 px-6 flex flex-row items-center justify-between border-b border-slate-100 dark:border-zinc-800/60 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
                Seksi 2: Landasan Teori & Panduan Konsep Praktikum
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-mono text-slate-400 border-slate-200 dark:border-zinc-800 hidden sm:inline-flex">
                Acuan Wajib Pengamatan
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Kuasai 5 konsep kunci, batas arsitektur runtime, dan matriks komparasi sebelum memulai eksperimen
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="hidden sm:inline font-medium text-slate-500 dark:text-zinc-400">
            {isOpen ? "Sembunyikan" : "Buka Teori"}
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-300">
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="p-6 space-y-6">
          {/* Jika terdapat data teori terstruktur */}
          {theoryData ? (
            <div className="space-y-6">
              {/* Internal Tab Navigation Bar */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-100/80 dark:bg-zinc-950/70 border border-slate-200/80 dark:border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => setActiveTab("concepts")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "concepts"
                      ? "bg-white dark:bg-zinc-900 text-teal-800 dark:text-teal-300 shadow-xs border border-slate-200/80 dark:border-zinc-800"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>5 Konsep Acuan Eksperimen</span>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-mono">
                    5 Poin
                  </Badge>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("matrix")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "matrix"
                      ? "bg-white dark:bg-zinc-900 text-teal-800 dark:text-teal-300 shadow-xs border border-slate-200/80 dark:border-zinc-800"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                  }`}
                >
                  <TableProperties className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Matriks Komparasi RSC vs Client</span>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-mono">
                    Tabel Uji
                  </Badge>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("rules")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "rules"
                      ? "bg-white dark:bg-zinc-900 text-teal-800 dark:text-teal-300 shadow-xs border border-slate-200/80 dark:border-zinc-800"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Aturan Emas & Anti-Pattern</span>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-mono">
                    Interleaving
                  </Badge>
                </button>
              </div>

              {/* ================= TAB 1: 5 KONSEP KUNCI ================= */}
              {activeTab === "concepts" && (
                <div className="space-y-6">
                  {theoryData.concepts.map((concept) => (
                    <div
                      key={concept.id}
                      className="p-5 md:p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xs space-y-4 shadow-2xs hover:border-teal-500/30 transition-colors"
                    >
                      {/* Concept Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100 dark:border-zinc-800/60">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                            0{concept.id}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                            {concept.title}
                          </h3>
                        </div>
                        <Badge variant="outline" className="text-[11px] font-mono text-teal-800 dark:text-teal-300 border-teal-500/25 bg-teal-500/5 self-start sm:self-auto">
                          {concept.badge}
                        </Badge>
                      </div>

                      {/* Keywords Pill Highlights */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-mono uppercase font-bold text-slate-400 dark:text-zinc-500 mr-1">
                          Kata Kunci:
                        </span>
                        {concept.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700/60"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>

                      {/* Summary Box (Key Takeaway) */}
                      <div className="p-3 rounded-xl bg-teal-500/5 dark:bg-teal-950/20 border border-teal-500/20 text-xs font-medium text-teal-900 dark:text-teal-200 leading-relaxed">
                        💡 <strong>Intisari Konsep:</strong> {concept.summary}
                      </div>

                      {/* Deep Explanation dengan Format Poin & Penekanan Kata Kunci */}
                      <FormattedConceptExplanation text={concept.explanation} />

                      {/* Code Snippet (VS Code Component with enableZoom={false}) */}
                      {concept.codeSnippet && (
                        <div className="pt-1">
                          <VsCodeSnippet
                            code={concept.codeSnippet.code}
                            language={concept.codeSnippet.language}
                            caption={concept.codeSnippet.filename}
                            enableZoom={false}
                          />
                        </div>
                      )}

                      {/* Direct Practical Observation Guide */}
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-semibold text-amber-800 dark:text-amber-300">
                            Penerapan pada Langkah Praktikum:
                          </span>
                          <p className="mt-0.5 leading-relaxed text-[11px] text-slate-700 dark:text-zinc-300 font-normal">
                            {concept.observationGuide}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ================= TAB 2: MATRIKS KOMPARASI ================= */}
              {activeTab === "matrix" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                      {theoryData.comparisonTable.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      {theoryData.comparisonTable.description}
                    </p>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 shadow-xs">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100/90 dark:bg-zinc-950/80 border-b border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">
                          <th className="p-3.5 font-bold uppercase font-mono tracking-wider w-[22%]">
                            Aspek Arsitektur
                          </th>
                          <th className="p-3.5 font-bold uppercase font-mono tracking-wider text-teal-700 dark:text-teal-400 w-[34%]">
                            {theoryData.comparisonTable.colAHeader || "Server Component (RSC)"}
                          </th>
                          <th className="p-3.5 font-bold uppercase font-mono tracking-wider text-cyan-700 dark:text-cyan-400 w-[30%]">
                            {theoryData.comparisonTable.colBHeader || "Client Component ('use client')"}
                          </th>
                          <th className="p-3.5 font-bold uppercase font-mono tracking-wider text-center w-[14%]">
                            Analisis Uji
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                        {theoryData.comparisonTable.rows.map((row, idx) => (
                          <tr
                            key={idx}
                            className={`hover:bg-slate-50/60 dark:hover:bg-zinc-800/30 transition-colors ${
                              idx % 2 === 1 ? "bg-slate-50/30 dark:bg-zinc-950/20" : ""
                            }`}
                          >
                            <td className="p-3.5 font-semibold text-slate-800 dark:text-zinc-200">
                              {row.aspect}
                            </td>
                            <td className="p-3.5 text-slate-700 dark:text-zinc-300 leading-relaxed font-mono text-[11px]">
                              {row.colA || row.serverComponent}
                            </td>
                            <td className="p-3.5 text-slate-700 dark:text-zinc-300 leading-relaxed font-mono text-[11px]">
                              {row.colB || row.clientComponent}
                            </td>
                            <td className="p-3.5 text-center">
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-mono px-2 py-0.5 ${
                                  row.badgeVerdict === "rsc-win"
                                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                                    : row.badgeVerdict === "client-win"
                                    ? "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/30"
                                    : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700"
                                }`}
                              >
                                {row.verdictText}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ================= TAB 3: ATURAN EMAS & ANTI-PATTERN ================= */}
              {activeTab === "rules" && (
                <div className="space-y-6">
                  {theoryData.goldenRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/50 space-y-4"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {rule.id}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                          {rule.title}
                        </h3>
                      </div>

                      <FormattedConceptExplanation text={rule.explanation} />

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
                        {/* Bad Example */}
                        {rule.badExample && (
                          <div className="p-4 rounded-xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/25 space-y-2">
                            <div className="font-semibold text-rose-700 dark:text-rose-400 text-xs flex items-center gap-1.5">
                              <span>{rule.badExample.title}</span>
                            </div>
                            <VsCodeSnippet
                              code={rule.badExample.code}
                              language="tsx"
                              enableZoom={false}
                            />
                            <p className="text-[11px] text-slate-600 dark:text-zinc-400 italic">
                              {rule.badExample.explanation}
                            </p>
                          </div>
                        )}

                        {/* Good Example */}
                        {rule.goodExample && (
                          <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/25 space-y-2">
                            <div className="font-semibold text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-1.5">
                              <span>{rule.goodExample.title}</span>
                            </div>
                            <VsCodeSnippet
                              code={rule.goodExample.code}
                              language="tsx"
                              enableZoom={false}
                            />
                            <p className="text-[11px] text-slate-600 dark:text-zinc-400 italic">
                              {rule.goodExample.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Fallback untuk modul yang belum memiliki structured theories data */
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-zinc-100 font-semibold text-xs tracking-wide uppercase">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Landasan Teori Praktikum</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-zinc-950/50 border border-slate-200/80 dark:border-zinc-800/80 text-sm text-slate-600 dark:text-zinc-300 leading-relaxed text-justify">
                {practicum.dasarTeori}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
