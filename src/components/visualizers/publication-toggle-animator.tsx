"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ToggleLeft,
  ToggleRight,
  Database,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Copy,
  Check,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PublicationToggleAnimator() {
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const [copied, setCopied] = useState(false);

  const sqlCommand = realtimeEnabled
    ? `ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;`
    : `ALTER PUBLICATION supabase_realtime DROP TABLE public.tasks;`;

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(sqlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 space-y-5 text-zinc-900 dark:text-zinc-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
              <Radio className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
              Aktivasi Publikasi: ALTER PUBLICATION supabase_realtime
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Secara default, PostgreSQL menonaktifkan streaming CDC demi efisiensi resource. Mahasiswa wajib mendaftarkan tabel ke publikasi.
          </p>
        </div>

        <Badge
          variant="outline"
          className={`font-mono text-xs ${
            realtimeEnabled
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
              : "border-zinc-300 dark:border-zinc-700 text-zinc-500"
          }`}
        >
          {realtimeEnabled ? "Replication: ENABLED" : "Replication: DISABLED"}
        </Badge>
      </div>

      {/* Interactive Toggle Card */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Tabel public.tasks (Replication Status)
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Replika tombol &quot;Enable Realtime&quot; di Supabase Studio ➔ Database ➔ Publications
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setRealtimeEnabled(!realtimeEnabled)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              realtimeEnabled
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300"
            }`}
          >
            {realtimeEnabled ? <ToggleRight className="w-5 h-5 text-white" /> : <ToggleLeft className="w-5 h-5 text-zinc-400" />}
            <span>{realtimeEnabled ? "Realtime Aktif" : "Realtime Nonaktif"}</span>
          </button>
        </div>

        {/* Dynamic SQL Equivalent */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-600 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Perintah SQL DDL yang Dijalankan di PostgreSQL:</span>
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Salin SQL</span>
            </button>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950 text-zinc-200 font-mono text-[11px] border border-zinc-800">
            <code>{sqlCommand}</code>
          </div>
        </div>

        {/* Status Callout */}
        {realtimeEnabled ? (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Tabel Terdaftar di Publikasi!</span>
              <p className="leading-relaxed">
                PostgreSQL kini mengirimkan setiap baris perubahan pada tabel <code>tasks</code> ke slot replikasi logikal. WebSocket klien yang me-subscribe ke tabel ini akan langsung menerima event mutasi.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Penyebab Utama Kegagalan Real-time Mahasiswa!</span>
              <p className="leading-relaxed">
                Jika tabel belum didaftarkan ke publikasi <code>supabase_realtime</code>, kode klien <code>supabase.channel(&apos;tasks&apos;).on(...)</code> tidak akan pernah menerima event apa pun meskipun sintaks JavaScript 100% benar.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

