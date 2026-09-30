"use client";

import React, { useState } from "react";
import { BookOpen, Sparkles, ChevronDown, Target, Lightbulb } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PracticumModule, THEME_COLORS } from "@/data/practicum";

interface PracticumTheoryProps {
  practicum: PracticumModule;
}

export function PracticumTheory({ practicum }: PracticumTheoryProps) {
  const [isOpen, setIsOpen] = useState(true);
  const theme = THEME_COLORS[practicum.theme.color];

  return (
    <Card className="border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-xs overflow-hidden">
      <CardHeader
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer select-none py-4 px-6 flex flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Seksi 1: Capaian & Dasar Teori Praktikum
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-mono text-zinc-400">
                Read-only
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Landasan teori dan target kompetensi yang diuji dalam praktikum ini
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="hidden sm:inline">{isOpen ? "Sembunyikan" : "Tampilkan"}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-zinc-600 dark:text-zinc-300" : ""
            }`}
          />
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="p-6 space-y-6">
          {/* Capaian Praktikum */}
          <div className="space-y-2 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold text-xs tracking-wide uppercase">
              <Target className="w-3.5 h-3.5" />
              Capaian Pembelajaran Praktikum (CPMK)
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
              {practicum.capaian}
            </p>
          </div>

          {/* Dasar Teori */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold text-xs tracking-wide uppercase">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Dasar Teori Singkat
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/80 dark:border-zinc-800/80 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed text-justify">
              {practicum.dasarTeori}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
