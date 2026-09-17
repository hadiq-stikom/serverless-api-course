"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MODULES, ModuleData } from "@/data/curriculum";
import { ThemeToggle } from "@/components/theme-toggle";
import { CopyButton } from "@/components/copy-button";
import { InteractiveTerm, FaasVsBaasVisualizer } from "@/components/interactive-term";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Terminal, Target,
  ExternalLink, Sparkles, AlertTriangle, CheckCircle2, ShieldCheck,
  Rocket, Layers, Award, Clock, Zap, Map, GitBranch, GitMerge, GitPullRequest, Trash2,
  Info, Lightbulb, ShieldAlert
} from "lucide-react";

export default function ModuleDetailPage() {
  const params = useParams();
  const moduleId = Number(params.id) || 1;
  const currentModule = MODULES.find((m) => m.id === moduleId);

  const [activeTab, setActiveTab] = useState<"concept" | "lab" | "mission">("concept");
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [mergeStrategy, setMergeStrategy] = useState<"terminal" | "pr">("terminal");

  if (!currentModule) {
    return notFound();
  }

  const prevModule = MODULES.find((m) => m.id === moduleId - 1);
  const nextModule = MODULES.find((m) => m.id === moduleId + 1);

  const toggleTask = (taskIndex: number) => {
    const key = `${currentModule.id}-${taskIndex}`;
    setCompletedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Group modules by world for the sidebar
  const worldGroups = [
    { id: "world-1", title: "Dunia 1: Fondasi & Backend", badge: "M1 – M7", modules: MODULES.filter((m) => m.worldId === "world-1") },
    { id: "boss-1", title: "Boss Fight 1: UTS Pitching", badge: "M8", modules: MODULES.filter((m) => m.worldId === "boss-1") },
    { id: "world-2", title: "Dunia 2: Rich UI & Media", badge: "M9 – M15", modules: MODULES.filter((m) => m.worldId === "world-2") },
    { id: "boss-2", title: "Final Boss: UAS Live Demo", badge: "M16", modules: MODULES.filter((m) => m.worldId === "boss-2") },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors duration-300">
      {/* Top sticky navbar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Quest Map</span>
            </Button>
          </Link>
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Minggu {currentModule.weekNumber.toString().padStart(2, "0")}
            </span>
            <span className="text-zinc-400 dark:text-zinc-600 hidden md:inline">•</span>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate max-w-xs md:max-w-md hidden md:inline">
              {currentModule.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/5 font-semibold text-xs py-0.5">
            +{currentModule.xp} XP
          </Badge>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Workspace: 2 Columns (Sidebar + Content) */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto">
        {/* Left Sidebar: 16 Weeks Navigator */}
        <aside className="w-full lg:w-80 lg:shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800/80 p-4 lg:p-6 bg-zinc-100/40 dark:bg-zinc-900/20 lg:h-[calc(100vh-57px)] lg:sticky lg:top-[57px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Map className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Daftar Pertemuan (RPS)
            </h2>
          </div>

          <div className="space-y-6">
            {worldGroups.map((group) => (
              <div key={group.id} className="space-y-1.5">
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                    {group.title}
                  </span>
                  <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
                    {group.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  {group.modules.map((m) => {
                    const isCurrent = m.id === currentModule.id;
                    return (
                      <Link key={m.id} href={`/modules/${m.id}`}>
                        <div
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            isCurrent
                              ? "bg-indigo-600 text-white shadow-sm font-semibold"
                              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
                          }`}
                        >
                          <span className="truncate pr-2">
                            {m.weekNumber}. {m.title.split(":")[0]}
                          </span>
                          {m.worldId.startsWith("boss") && (
                            <Badge
                              className={`text-[9px] px-1 py-0 h-4 uppercase ${
                                isCurrent
                                  ? "bg-white/20 text-white"
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                              }`}
                            >
                              Exam
                            </Badge>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Content Area: Hero + 3 Pillars */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 space-y-8 max-w-5xl">
          {/* Module Hero Banner */}
          <div className="space-y-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-xs font-semibold">
                {currentModule.worldTitle}
              </Badge>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {currentModule.duration}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
              {currentModule.title}
            </h1>

            <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
              {currentModule.subtitle}
            </p>

            {/* Target CPMK Box */}
            <div className="bg-indigo-500/5 dark:bg-indigo-950/30 border border-indigo-500/20 rounded-2xl p-4 flex items-start gap-3">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-0.5">
                  Target Capaian Pembelajaran (CPMK):
                </p>
                <p className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                  {currentModule.cpmk}
                </p>
              </div>
            </div>
          </div>

          {/* 3 Pillars Tabs Navigation */}
          <div className="flex items-center gap-2 p-1.5 bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-300/80 dark:border-zinc-800 rounded-2xl">
            <button
              onClick={() => setActiveTab("concept")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold transition-all ${
                activeTab === "concept"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <BookOpen className="w-4 h-4 text-cyan-500" />
              1. Konsep & Teori
            </button>

            <button
              onClick={() => setActiveTab("lab")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold transition-all ${
                activeTab === "lab"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Terminal className="w-4 h-4 text-indigo-500" />
              2. Lab & Prompt AI
            </button>

            <button
              onClick={() => setActiveTab("mission")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold transition-all ${
                activeTab === "mission"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Target className="w-4 h-4 text-emerald-500" />
              3. Misi Proyek
            </button>
          </div>

          {/* TAB 1: KONSEP & TEORI */}
          {activeTab === "concept" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-500" />
                  Intisari Arsitektur
                </h3>
                {currentModule.id === 1 ? (
                  <div className="space-y-2">
                    <div className="text-zinc-600 dark:text-zinc-300 text-base leading-relaxed">
                      Serverless membebaskan developer dari manajemen infrastruktur server manual. Kita berfokus pada dua pilar utama:{" "}
                      <InteractiveTerm term="faas">FaaS (Vercel Serverless Functions)</InteractiveTerm>{" "}
                      dan{" "}
                      <InteractiveTerm term="baas">BaaS (Supabase)</InteractiveTerm>.
                    </div>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                      <span>💡</span>
                      <span>Arahkan kursor (hover) atau klik badge FaaS / BaaS untuk melihat definisi & simulasi alur kerjanya.</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-zinc-600 dark:text-zinc-300 text-base leading-relaxed">
                    {currentModule.concepts.summary}
                  </p>
                )}
              </div>

              {/* Interactive FaaS vs BaaS Visualizer on Module 1 */}
              {currentModule.id === 1 && (
                <FaasVsBaasVisualizer />
              )}

              {/* Point-by-point breakdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentModule.concepts.points.map((pt, i) => (
                  <Card key={i} className="border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 shadow-none">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-black">
                          {i + 1}
                        </span>
                        {pt.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-1 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {pt.desc}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Deep Dive Conceptual Sections */}
              {currentModule.concepts.deepDiveSections && currentModule.concepts.deepDiveSections.length > 0 && (
                <div className="space-y-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-indigo-500" />
                      Landasan Teori & Arsitektur Mendalam
                    </h3>
                    <span className="text-xs text-zinc-500 hidden sm:inline">Pemahaman Konsep Komprehensif</span>
                  </div>

                  <div className="space-y-6">
                    {currentModule.concepts.deepDiveSections.map((section, sIdx) => (
                      <div
                        key={sIdx}
                        className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/70 p-5 md:p-6 space-y-4 shadow-sm"
                      >
                        {/* Header & Badge */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                          <h4 className="text-base md:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                            {section.title}
                          </h4>
                          {section.badge && (
                            <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-xs font-semibold">
                              {section.badge}
                            </Badge>
                          )}
                        </div>

                        {/* Main Content Paragraph */}
                        <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                          {section.content}
                        </p>

                        {/* Subpoints */}
                        {section.subpoints && section.subpoints.length > 0 && (
                          <div className="space-y-2.5 pt-1">
                            {section.subpoints.map((sub, subIdx) => (
                              <div
                                key={subIdx}
                                className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/50 text-xs md:text-sm"
                              >
                                <span className="flex items-center justify-center w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold shrink-0 mt-0.5 text-xs">
                                  {subIdx + 1}
                                </span>
                                <div className="space-y-0.5">
                                  <span className="font-bold text-zinc-900 dark:text-zinc-100 mr-1.5">
                                    {sub.label}:
                                  </span>
                                  <span className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                    {sub.text}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Comparison Table */}
                        {section.comparisonTable && (
                          <div className="space-y-2 pt-2">
                            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                              <table className="w-full text-left text-xs md:text-sm border-collapse">
                                <thead>
                                  <tr className="bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold">
                                    {section.comparisonTable.headers.map((h, hIdx) => (
                                      <th key={hIdx} className="py-3 px-4 first:rounded-tl-xl last:rounded-tr-xl whitespace-nowrap">
                                        {h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                                  {section.comparisonTable.rows.map((row, rIdx) => (
                                    <tr
                                      key={rIdx}
                                      className={rIdx % 2 === 0 ? "bg-white dark:bg-zinc-900/40" : "bg-zinc-50/70 dark:bg-zinc-900/80"}
                                    >
                                      {row.map((cell, cIdx) => (
                                        <td
                                          key={cIdx}
                                          className={`py-3 px-4 ${cIdx === 0 ? "font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap" : ""}`}
                                        >
                                          {cell}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Callout Box */}
                        {section.callout && (
                          <div
                            className={`rounded-xl p-4 flex items-start gap-3 border ${
                              section.callout.type === "warning"
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
                                : section.callout.type === "tip"
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                                : "bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-200"
                            }`}
                          >
                            {section.callout.type === "warning" && (
                              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            )}
                            {section.callout.type === "tip" && (
                              <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            )}
                            {section.callout.type === "info" && (
                              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            )}
                            <div className="space-y-1">
                              <h5 className="text-sm font-bold">{section.callout.title}</h5>
                              <p className="text-xs md:text-sm opacity-90 leading-relaxed">
                                {section.callout.text}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Official References Section (Primary Sources) */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    Dokumentasi Resmi (Primary Sources)
                  </h4>
                  <span className="text-[11px] text-zinc-500">Wajib dijadikan acuan sintaks</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {currentModule.references.map((ref, idx) => (
                    <a
                      key={idx}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 transition-all shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-semibold text-indigo-600 dark:text-indigo-400 border-indigo-500/30">
                          {ref.source}
                        </Badge>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2">
                        {ref.title}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: LAB PRAKTIKUM & PROMPT AI */}
          {activeTab === "lab" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Warning Alert if exists */}
              {currentModule.lab.warningZone && (
                <div className="bg-rose-500/10 border-2 border-rose-500/30 rounded-2xl p-4 flex items-start gap-3.5 text-rose-900 dark:text-rose-200">
                  <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold mb-1">{currentModule.lab.warningZone.title}</h4>
                    <p className="text-xs md:text-sm text-rose-800 dark:text-rose-300 leading-relaxed">
                      {currentModule.lab.warningZone.desc}
                    </p>
                  </div>
                </div>
              )}

              {/* Lab Steps */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-500" />
                  Langkah-Langkah Praktikum
                </h3>

                <div className="space-y-4">
                  {currentModule.lab.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 bg-white dark:bg-zinc-900/90 space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold shrink-0">
                          {step.stepNumber}
                        </span>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5">
                          {step.instruction}
                        </p>
                      </div>

                      {step.code && (
                        <div className="relative bg-zinc-950 text-zinc-100 rounded-xl p-3.5 font-mono text-xs overflow-x-auto border border-zinc-800">
                          <pre className="pr-8">{step.code}</pre>
                          <div className="absolute top-2 right-2">
                            <CopyButton text={step.code} />
                          </div>
                        </div>
                      )}

                      {step.explanation && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 italic pl-9">
                          💡 Catatan: {step.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Prompt Formula Box */}
              <div className="border-2 border-indigo-500/40 bg-indigo-500/5 dark:bg-indigo-950/20 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                      Formula Prompt AI Teruji (Copilot / Cursor)
                    </h4>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
                    Role: {currentModule.lab.aiPromptTemplate.role}
                  </Badge>
                </div>

                <div className="relative bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans">
                  <p className="pr-8 italic">"{currentModule.lab.aiPromptTemplate.prompt}"</p>
                  <div className="absolute top-2 right-2">
                    <CopyButton text={currentModule.lab.aiPromptTemplate.prompt} />
                  </div>
                </div>

                <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                  🎯 Tips Prompting: {currentModule.lab.aiPromptTemplate.tip}
                </p>
              </div>
            </motion.div>
          )}

          {/* TAB 3: MISI PROYEK AKHIR (BOLA SALJU) */}
          {activeTab === "mission" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-zinc-900/90 space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    {currentModule.mission.taskTitle}
                  </h3>
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {currentModule.mission.taskDesc}
                </p>
              </div>

              {/* Git Branch & Merge Workflow Guide */}
              {(() => {
                const branchName = currentModule.mission.gitBranchTask.replace("git checkout -b ", "").trim();
                return (
                  <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-indigo-500" />
                          Alur Siklus Branch & Cara Penggabungan (Merge ke Main)
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          Pola standar industri untuk mengerjakan misi tanpa merusak cabang <code>main</code>
                        </p>
                      </div>

                      {/* Merge Mode Toggle */}
                      <div className="flex items-center gap-1 bg-zinc-200/80 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
                        <button
                          type="button"
                          onClick={() => setMergeStrategy("terminal")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            mergeStrategy === "terminal"
                              ? "bg-indigo-600 text-white shadow-xs"
                              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                          }`}
                        >
                          <GitMerge className="w-3.5 h-3.5" />
                          Opsi 1: Terminal Merge
                        </button>
                        <button
                          type="button"
                          onClick={() => setMergeStrategy("pr")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            mergeStrategy === "pr"
                              ? "bg-indigo-600 text-white shadow-xs"
                              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                          }`}
                        >
                          <GitPullRequest className="w-3.5 h-3.5" />
                          Opsi 2: GitHub PR
                        </button>
                      </div>
                    </div>

                    {/* 4 Step Pipeline in 2 Columns (2 Rows) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Step 1 */}
                      <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                            <span className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-[10px]">1</span>
                            <span>Buat & Masuk Branch</span>
                          </div>
                          <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                            Buka cabang baru khusus untuk tugas minggu ini agar <code>main</code> tetap aman.
                          </p>
                        </div>
                        <div className="relative bg-zinc-950 text-zinc-100 rounded-lg p-2.5 font-mono text-[11px] border border-zinc-800">
                          <code>{currentModule.mission.gitBranchTask}</code>
                          <div className="absolute top-1.5 right-1.5">
                            <CopyButton text={currentModule.mission.gitBranchTask} />
                          </div>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                            <span className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-[10px]">2</span>
                            <span>Kerjakan & Simpan</span>
                          </div>
                          <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                            Setelah fitur selesai dan dicek, simpan seluruh perubahan ke riwayat branch.
                          </p>
                        </div>
                        <div className="relative bg-zinc-950 text-zinc-100 rounded-lg p-2.5 font-mono text-[11px] border border-zinc-800">
                          <pre className="pr-6">{`git add .\ngit commit -m "feat: complete week ${currentModule.weekNumber} mission"`}</pre>
                          <div className="absolute top-1.5 right-1.5">
                            <CopyButton text={`git add .\ngit commit -m "feat: complete week ${currentModule.weekNumber} mission"`} />
                          </div>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-[10px]">3</span>
                            <span>{mergeStrategy === "terminal" ? "Merge ke Main" : "Merge via PR"}</span>
                          </div>
                          <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                            {mergeStrategy === "terminal"
                              ? "Pindah ke main, gabungkan branch fitur, lalu push ke GitHub."
                              : "Push branch ke GitHub, buka web, lalu merge Pull Request."}
                          </p>
                        </div>

                        {mergeStrategy === "terminal" ? (
                          <div className="relative bg-zinc-950 text-zinc-100 rounded-lg p-2.5 font-mono text-[11px] border border-zinc-800">
                            <pre className="pr-6">{`git checkout main\ngit merge ${branchName}\ngit push origin main`}</pre>
                            <div className="absolute top-1.5 right-1.5">
                              <CopyButton text={`git checkout main\ngit merge ${branchName}\ngit push origin main`} />
                            </div>
                          </div>
                        ) : (
                          <div className="relative bg-zinc-950 text-zinc-100 rounded-lg p-2.5 font-mono text-[11px] border border-zinc-800">
                            <pre className="pr-6">{`git push -u origin ${branchName}\n# Merge PR di web GitHub\ngit checkout main && git pull`}</pre>
                            <div className="absolute top-1.5 right-1.5">
                              <CopyButton text={`git push -u origin ${branchName}`} />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Step 4: Cleanup */}
                      <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                            <span className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center text-[10px]">4</span>
                            <span className="flex items-center gap-1">
                              <Trash2 className="w-3.5 h-3.5" />
                              Bersihkan Branch
                            </span>
                          </div>
                          <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                            Hapus branch fitur yang sudah di-merge agar repositori tetap bersih dan rapi.
                          </p>
                        </div>

                        {mergeStrategy === "terminal" ? (
                          <div className="relative bg-zinc-950 text-zinc-100 rounded-lg p-2.5 font-mono text-[11px] border border-zinc-800">
                            <pre className="pr-6">{`git branch -d ${branchName}`}</pre>
                            <div className="absolute top-1.5 right-1.5">
                              <CopyButton text={`git branch -d ${branchName}`} />
                            </div>
                          </div>
                        ) : (
                          <div className="relative bg-zinc-950 text-zinc-100 rounded-lg p-2.5 font-mono text-[11px] border border-zinc-800">
                            <pre className="pr-6">{`git branch -d ${branchName}\ngit push origin --delete ${branchName}`}</pre>
                            <div className="absolute top-1.5 right-1.5">
                              <CopyButton text={`git branch -d ${branchName}\ngit push origin --delete ${branchName}`} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Definition of Done (Checklist Mandiri) */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Checklist Kriteria Selesai (Definition of Done)
                </h4>

                <div className="space-y-2">
                  {currentModule.mission.definitionOfDone.map((dod, idx) => {
                    const isChecked = !!completedTasks[`${currentModule.id}-${idx}`];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleTask(idx)}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? "bg-emerald-500/10 border-emerald-500/30 text-zinc-900 dark:text-white"
                            : "bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center mt-0.5 transition-colors ${
                            isChecked
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "border-zinc-300 dark:border-zinc-700"
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <span className={`text-xs md:text-sm font-medium ${isChecked ? "line-through opacity-80" : ""}`}>
                          {dod}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer Navigation (Previous / Next Week) */}
          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
            {prevModule ? (
              <Link href={`/modules/${prevModule.id}`}>
                <Button variant="outline" className="gap-2 border-zinc-200 dark:border-zinc-800">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Minggu {prevModule.weekNumber}:</span> {prevModule.title.split(":")[0]}
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {nextModule ? (
              <Link href={`/modules/${nextModule.id}`}>
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                  <span className="hidden sm:inline">Minggu {nextModule.weekNumber}:</span> {nextModule.title.split(":")[0]}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/">
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                  Selesai & Kembali ke Quest Map
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
