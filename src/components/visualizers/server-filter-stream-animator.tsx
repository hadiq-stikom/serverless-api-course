"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  CheckCircle2,
  XCircle,
  Database,
  Radio,
  Laptop,
  ArrowRight,
  ShieldCheck,
  Play
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ServerFilterStreamAnimator() {
  const [filterMode, setFilterMode] = useState<"no_filter" | "user_filter">("user_filter");
  const [simulatedEvent, setSimulatedEvent] = useState<{
    id: number;
    title: string;
    userId: string;
    targetMatch: boolean;
  } | null>(null);

  const myUserId = "user-101";

  const handleSimulateInsert = (targetUser: "user-101" | "user-999") => {
    const isMine = targetUser === myUserId;
    setSimulatedEvent({
      id: Math.floor(Math.random() * 800) + 100,
      title: isMine ? "Tugas Saya: Rapikan Kode" : "Tugas Orang Lain: Beli Hosting",
      userId: targetUser,
      targetMatch: isMine
    });
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 space-y-5 text-zinc-900 dark:text-zinc-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
              <Filter className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
              Server-Side Filtering: filter: &apos;column=eq.value&apos;
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Mencegah polusi bandwidth klien dengan menyaring event langsung di Realtime Server Supabase
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <button
            type="button"
            onClick={() => setFilterMode("user_filter")}
            className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              filterMode === "user_filter"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            filter: &apos;user_id=eq.{myUserId}&apos;
          </button>

          <button
            type="button"
            onClick={() => setFilterMode("no_filter")}
            className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              filterMode === "no_filter"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Tanpa Filter (Mendengar Semua Baris)
          </button>
        </div>
      </div>

      {/* Trigger Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
          Simulasikan Event INSERT di Database:
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => handleSimulateInsert("user-101")}
            className="text-xs font-bold h-8 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Play className="w-3.5 h-3.5 mr-1" />
            <span>Insert Tugas Milik Saya ({myUserId})</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSimulateInsert("user-999")}
            className="text-xs font-bold h-8 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 mr-1 text-amber-500" />
            <span>Insert Tugas User Lain (user-999)</span>
          </Button>
        </div>
      </div>

      {/* Visual Filter Flow Animation */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Step 1: PostgreSQL WAL */}
          <div className="p-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 space-y-2 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <Database className="w-4 h-4 text-blue-500" />
              <span>PostgreSQL Database</span>
            </div>
            <div className="p-2 rounded bg-zinc-100 dark:bg-zinc-900 font-mono text-[11px] truncate">
              {simulatedEvent ? `INSERT (user_id=${simulatedEvent.userId})` : "Menunggu Mutasi..."}
            </div>
            <Badge variant="outline" className="text-[10px]">
              Emit ke Replication Slot
            </Badge>
          </div>

          {/* Step 2: Realtime Server Filter */}
          <div className="p-3.5 rounded-xl border border-indigo-300 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/40 space-y-2 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
              <Radio className="w-4 h-4 text-indigo-600" />
              <span>Realtime Server Evaluator</span>
            </div>
            <div className="p-2 rounded bg-white dark:bg-zinc-900 font-mono text-[11px]">
              {filterMode === "user_filter" ? `filter: user_id=eq.${myUserId}` : "No Server Filter"}
            </div>
            {simulatedEvent && (
              <Badge
                className={`text-[10px] font-bold ${
                  filterMode === "no_filter" || simulatedEvent.targetMatch
                    ? "bg-emerald-600 text-white"
                    : "bg-red-600 text-white"
                }`}
              >
                {filterMode === "no_filter"
                  ? "PASS: Dikirim ke semua klien"
                  : simulatedEvent.targetMatch
                  ? "MATCH: Teruskan ke WebSocket"
                  : "DROP: Dibuang di Server (Hemat Bandwidth)"}
              </Badge>
            )}
          </div>

          {/* Step 3: Client WebSocket */}
          <div className="p-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 space-y-2 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <Laptop className="w-4 h-4 text-emerald-500" />
              <span>Browser Klien ({myUserId})</span>
            </div>
            <div className="p-2 rounded bg-zinc-100 dark:bg-zinc-900 font-mono text-[11px] truncate">
              {simulatedEvent ? (
                filterMode === "no_filter" || simulatedEvent.targetMatch ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    ✅ Event Diterima: {simulatedEvent.title}
                  </span>
                ) : (
                  <span className="text-zinc-400">🛡️ Tidak Ada Paket Masuk</span>
                )
              ) : (
                "Koneksi WS Terbuka"
              )}
            </div>
            <Badge variant="outline" className="text-[10px]">
              React UI State
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

