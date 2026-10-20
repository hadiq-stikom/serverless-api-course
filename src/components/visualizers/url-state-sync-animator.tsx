"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Compass, 
  Search, 
  Globe, 
  Clock, 
  ArrowRight, 
  Database, 
  CheckCircle2,
  RefreshCw,
  Share2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function UrlStateSyncAnimator() {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchCounter, setFetchCounter] = useState(0);

  // Debounce logic simulation
  useEffect(() => {
    setIsDebouncing(true);
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
      setIsDebouncing(false);
      setFetchCounter((prev) => prev + 1);
    }, 300);

    return () => clearTimeout(handler);
  }, [inputValue, currentPage]);

  const currentUrl = `/tasks?search=${encodeURIComponent(debouncedValue)}&page=${currentPage}`;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-xs font-semibold">
              Pilar 4.1: URL as State
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">useSearchParams + Debounce</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi URL as State: Debounced Input ➔ URL Synchronization ➔ Server Refetch
          </h4>
        </div>

        <Badge variant="outline" className="text-xs font-mono text-cyan-600 dark:text-cyan-400 border-cyan-500/30">
          Shareable &amp; Bookmarkable
        </Badge>
      </div>

      {/* Simulated Browser Address Bar */}
      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-2 text-xs font-mono text-zinc-200 shadow-inner">
        <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
        <span className="text-zinc-500 select-none">https://serverless-tasks.app</span>
        <span className="text-emerald-400 font-bold truncate">{currentUrl}</span>
        <div className="ml-auto flex items-center gap-1.5 shrink-0">
          <Badge className="bg-cyan-500/20 text-cyan-300 text-[10px] border-cyan-500/40">
            Single Source of Truth
          </Badge>
        </div>
      </div>

      {/* Interactive Search & Pagination Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-cyan-500" /> Kotak Pencarian Klien (Debounce 300ms):
            </label>
            {isDebouncing && (
              <span className="text-[10px] text-amber-500 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 animate-spin" /> Menunggu selesai mengetik...
              </span>
            )}
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Coba ketik 'laporan' atau 'proyek'..."
            className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
          />

          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Navigasi Halaman:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 text-xs rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                Halaman {currentPage}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-2.5 py-1 text-xs rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Server Reaction Visualizer */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
              <Database className="w-4 h-4 text-amber-500" /> Eksekusi Query di Server Component
            </span>
            <Badge variant="outline" className="text-[10px] font-mono">
              Refetch #{fetchCounter}
            </Badge>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-950 font-mono text-[10px] text-zinc-300 space-y-1 overflow-x-auto">
            <div className="text-zinc-500">// Next.js 16 Server Component:</div>
            <div className="text-purple-400">const &#123; search, page &#125; = await searchParams;</div>
            <div className="text-cyan-300 pt-1">
              supabase.from(&apos;tasks&apos;).select(&apos;*&apos;)
              {debouncedValue && <span className="text-emerald-400">{`.ilike('title', '%${debouncedValue}%')`}</span>}
              <span className="text-amber-400">{`.range(${(currentPage - 1) * 10}, ${currentPage * 10 - 1})`}</span>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Keuntungan URL as State: Saat pengguna me-refresh browser atau membagikan link ke rekan tim, hasil pencarian dan halaman tetap persis sama!
          </p>
        </div>
      </div>
    </div>
  );
}
