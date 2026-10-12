"use client";

import React, { useState } from "react";
import { Target, ChevronDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PracticumModule } from "@/data/practicum";
import { getPracticumTheoryData, getPracticumSubCpmk } from "@/data/practicum-theories";

interface PracticumCpmkProps {
  practicum: PracticumModule;
}

export function PracticumCpmk({ practicum }: PracticumCpmkProps) {
  const [isOpen, setIsOpen] = useState(true);

  const theoryData = getPracticumTheoryData(practicum.id);
  const subCpmkList = theoryData?.subCpmk || getPracticumSubCpmk(practicum.id);

  return (
    <Card className="border border-slate-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md shadow-xs overflow-hidden rounded-2xl transition-all">
      {/* Header Panel */}
      <CardHeader
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer select-none py-4 px-6 flex flex-row items-center justify-between border-b border-slate-100 dark:border-zinc-800/60 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold shadow-xs">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
                Seksi 1: Target Capaian Pembelajaran Praktikum (CPMK)
              </CardTitle>
              <Badge
                variant="outline"
                className="text-[10px] font-mono text-teal-700 dark:text-teal-300 border-teal-500/25 bg-teal-500/10 hidden sm:inline-flex"
              >
                Ref: Modul {practicum.lectureModule} Kuliah • RPS Standar
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Kuasai target kompetensi akademik dan indikator sub-capaian pembelajaran sebelum memulai eksperimen
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="hidden sm:inline font-medium text-slate-500 dark:text-zinc-400">
            {isOpen ? "Sembunyikan" : "Buka Capaian"}
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
        <CardContent className="p-6 space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 font-medium leading-relaxed">
            Setelah menyelesaikan seluruh tahapan modul praktikum ini, mahasiswa diharapkan mampu:
          </p>

          {subCpmkList && subCpmkList.length > 0 ? (
            <div className="space-y-2.5 pt-0.5">
              {subCpmkList.map((item, idx) => {
                const parts = item.split(":");
                const hasPrefix = parts.length > 1;
                const title = hasPrefix ? parts[0].trim() : `Sub-CPMK ${idx + 1}`;
                const desc = hasPrefix ? parts.slice(1).join(":").trim() : item;

                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 dark:bg-zinc-950/50 border border-slate-200/70 dark:border-zinc-800/70 hover:border-teal-500/35 hover:bg-white dark:hover:bg-zinc-900/60 transition-colors shadow-2xs"
                  >
                    <div className="w-6 h-6 rounded-md bg-teal-500/10 border border-teal-500/25 text-teal-700 dark:text-teal-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed font-normal flex-1">
                      {hasPrefix ? (
                        <>
                          <span className="font-semibold text-slate-900 dark:text-zinc-100">
                            {title}:
                          </span>{" "}
                          <span>{desc}</span>
                        </>
                      ) : (
                        <span>{item}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200/60 dark:border-zinc-800/60">
              <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                {theoryData ? theoryData.cpmkTarget : practicum.capaian}
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
