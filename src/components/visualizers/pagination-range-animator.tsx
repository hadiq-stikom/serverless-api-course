"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Database, 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  Calculator, 
  ArrowRight,
  FileCode
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PaginationRangeAnimator() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalItems = 32;

  const totalPages = Math.ceil(totalItems / pageSize);
  const from = (page - 1) * pageSize;
  const to = Math.min(from + pageSize - 1, totalItems - 1);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-xs font-semibold">
              Pilar 4.2: Efisiensi Database
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Supabase .range(from, to)</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Rumus Matematika Pagination: Supabase Range Query vs Offset/Limit
          </h4>
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-semibold">Ukuran Per Halaman:</span>
          <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl">
            {[5, 10, 20].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => { setPageSize(size); setPage(1); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  pageSize === size ? "bg-cyan-600 text-white shadow-sm" : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {size} Item
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mathematical Breakdown Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-1">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold block">1. Indeks Awal (From):</span>
          <p className="text-zinc-600 dark:text-zinc-300">from = (page - 1) * pageSize</p>
          <div className="text-indigo-700 dark:text-indigo-300 font-bold text-sm pt-1">
            = ({page} - 1) * {pageSize} = <strong>{from}</strong>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-1">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold block">2. Indeks Akhir (To):</span>
          <p className="text-zinc-600 dark:text-zinc-300">to = from + pageSize - 1</p>
          <div className="text-emerald-700 dark:text-emerald-300 font-bold text-sm pt-1">
            = {from} + {pageSize} - 1 = <strong>{to}</strong>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-cyan-200 dark:border-cyan-900/60 bg-cyan-50/40 dark:bg-cyan-950/20 space-y-1">
          <span className="text-cyan-600 dark:text-cyan-400 font-bold block">3. Kueri Supabase JS:</span>
          <p className="text-zinc-600 dark:text-zinc-300">.range(from, to)</p>
          <div className="text-cyan-700 dark:text-cyan-300 font-bold text-sm pt-1">
            .range({from}, {to})
          </div>
        </div>
      </div>

      {/* Visual Records Timeline */}
      <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
        <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-100 dark:border-zinc-800">
          <span className="font-bold text-zinc-800 dark:text-zinc-200">
            Total Database: {totalItems} Baris (Menampilkan Baris ke-{from + 1} s.d. {to + 1})
          </span>
          <span className="text-zinc-500 font-mono">Halaman {page} dari {totalPages}</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-16 gap-1 pt-1">
          {Array.from({ length: totalItems }).map((_, idx) => {
            const isSelected = idx >= from && idx <= to;
            return (
              <div
                key={idx}
                className={`h-8 rounded text-[10px] font-mono flex items-center justify-center font-bold transition-all ${
                  isSelected
                    ? "bg-cyan-600 text-white shadow-xs scale-105"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 opacity-40"
                }`}
              >
                #{idx + 1}
              </div>
            );
          })}
        </div>

        {/* Stepper Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 font-bold text-zinc-700 dark:text-zinc-300 disabled:opacity-30 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            ← Halaman Sebelumnya
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i + 1)}
                className={`w-7 h-7 rounded-md text-xs font-bold font-mono ${
                  page === i + 1 
                    ? "bg-cyan-600 text-white" 
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 font-bold text-zinc-700 dark:text-zinc-300 disabled:opacity-30 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Halaman Berikutnya →
          </button>
        </div>
      </div>
    </div>
  );
}
