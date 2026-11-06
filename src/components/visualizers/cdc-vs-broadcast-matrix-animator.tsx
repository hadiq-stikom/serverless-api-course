"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  Database,
  Radio,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Scale
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CdcVsBroadcastMatrixAnimator() {
  const [selectedFeature, setSelectedFeature] = useState<"postgres_changes" | "broadcast" | "presence">("postgres_changes");

  const featureDetails = {
    postgres_changes: {
      title: "1. Postgres Changes (CDC)",
      mechanism: "PostgreSQL WAL Replication -> Phoenix Channels -> WebSocket",
      persisted: "Ya (Tersimpan permanen di Disk SSD PostgreSQL)",
      latency: "Sedang (~40 - 100ms karena menunggu transaksi commit)",
      dbLoad: "Ada (Memproses log replikasi dan mengevaluasi RLS)",
      useCases: [
        "Status penyelesaian tugas Kanban (Todo -> Done)",
        "Notifikasi penugasan baru dari admin",
        "Komentar atau lampiran yang wajib tidak boleh hilang"
      ],
      recommendation: "Gunakan untuk data bisnis kritis yang wajib bertahan meski browser di-refresh."
    },
    broadcast: {
      title: "2. Ephemeral Broadcast",
      mechanism: "Client A -> Phoenix In-Memory PubSub -> Client B",
      persisted: "Tidak (Hilang seketika dari RAM setelah di-broadcast)",
      latency: "Sangat Rendah (~10 - 25ms, Zero Disk I/O)",
      dbLoad: "Nol (Database PostgreSQL tidak tersentuh sama sekali)",
      useCases: [
        "Indikator mengetik (User A is typing...)",
        "Live mouse cursor / live position sharing",
        "Sinyal UI sementara seperti getar kartu atau laser pointer"
      ],
      recommendation: "Gunakan untuk data interaktif temporal berfrekuensi tinggi (10-60x per detik) agar database tidak kolaps."
    },
    presence: {
      title: "3. Presence (CRDT State)",
      mechanism: "In-Memory Cluster State Sync berbasis Conflict-free Replicated Data Types",
      persisted: "Tidak (State otomatis hilang ketika koneksi TCP terputus)",
      latency: "Rendah (~30ms heartbeat sync)",
      dbLoad: "Nol (Dikelola oleh kluster Elixir BEAM)",
      useCases: [
        "Daftar anggota tim yang sedang membuka halaman ini",
        "Status 'Online', 'Idle', atau 'Away'",
        "Siapa yang sedang mengunci/mengedit dokumen tugas"
      ],
      recommendation: "Gunakan untuk pelacakan siapa yang aktif tanpa perlu repot mencatat timestamp 'last_seen' ke database."
    }
  };

  const current = featureDetails[selectedFeature];

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 space-y-5 text-zinc-900 dark:text-zinc-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
              <Scale className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
              Matriks Pengambilan Keputusan: Postgres Changes vs Broadcast vs Presence
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Panduan arsitektur menentukan kapan harus menyimpan ke database vs kapan cukup komunikasi in-memory
          </p>
        </div>

        {/* Feature Buttons */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <button
            type="button"
            onClick={() => setSelectedFeature("postgres_changes")}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              selectedFeature === "postgres_changes"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Postgres Changes
          </button>

          <button
            type="button"
            onClick={() => setSelectedFeature("broadcast")}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              selectedFeature === "broadcast"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Broadcast
          </button>

          <button
            type="button"
            onClick={() => setSelectedFeature("presence")}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              selectedFeature === "presence"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Presence
          </button>
        </div>
      </div>

      {/* Comparison Grid Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="md:col-span-6 space-y-3">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 space-y-3">
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 block">
              {current.title}
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-700">
                <span className="text-zinc-500">Persistensi Data:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{current.persisted}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-700">
                <span className="text-zinc-500">Estimasi Latensi:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{current.latency}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Beban ke PostgreSQL:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{current.dbLoad}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 text-xs space-y-1">
            <span className="font-bold text-indigo-900 dark:text-indigo-200 block">
              Rekomendasi Arsitektur:
            </span>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {current.recommendation}
            </p>
          </div>
        </div>

        {/* Right: Use Cases Checklist */}
        <div className="md:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
            Contoh Kasus Penggunaan Ideal:
          </span>

          <div className="space-y-2">
            {current.useCases.map((uc, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex items-start gap-2.5 text-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">{uc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

