"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Database, Cloud, AlertTriangle, CheckCircle2, Server, HardDrive, Zap, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function BlobVsCdnAnimator() {
  const [architecture, setArchitecture] = useState<"database_blob" | "cloudinary_cdn">("cloudinary_cdn");
  const [fileCount, setFileCount] = useState<number>(50);

  // Kalkulasi estimasi metrik
  const dbSizeMB = fileCount * 3.5; // asumsi 3.5MB per gambar mentah
  const dbBackupMinutes = Math.round(dbSizeMB / 15);
  const cdnBandwidthSaved = Math.round(dbSizeMB * 0.78); // reduksi ~78% via WebP/AVIF
  const latencyMs = architecture === "database_blob" ? 850 : 38;

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 space-y-4">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">🗄️</span>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
              Simulasi Arsitektur: Database BLOB vs Dedicated Media CDN
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Menganalisis dampak performa, pembengkakan database, dan latensi FaaS serverless.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl self-start sm:self-center border border-zinc-200/60 dark:border-zinc-700/60">
          <button
            type="button"
            onClick={() => setArchitecture("cloudinary_cdn")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              architecture === "cloudinary_cdn"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            Dedicated CDN (Best Practice)
          </button>
          <button
            type="button"
            onClick={() => setArchitecture("database_blob")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              architecture === "database_blob"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            DB BLOB (Anti-Pattern)
          </button>
        </div>
      </div>

      {/* Slider Jumlah Gambar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/60 dark:border-zinc-800 text-xs">
        <span className="text-zinc-600 dark:text-zinc-300 font-medium">
          Simulasi Volume Aset Pengguna: <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{fileCount} Gambar</strong> (rata-rata 3.5 MB/foto)
        </span>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="10"
            max="300"
            step="10"
            value={fileCount}
            onChange={(e) => setFileCount(Number(e.target.value))}
            className="w-36 accent-indigo-600 cursor-pointer"
          />
          <span className="font-mono font-bold text-zinc-900 dark:text-white w-12 text-right">{fileCount} item</span>
        </div>
      </div>

      {/* Visualisasi Arsitektur Aliran Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {/* Node 1: Browser Klien */}
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-indigo-500" />
              1. Browser Pengguna
            </span>
            <Badge variant="outline" className="text-[10px]">Client</Badge>
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {architecture === "cloudinary_cdn"
              ? "Langsung meminta aset gambar yang sudah terkompresi dari POP Edge CDN terdekat."
              : "Mengunduh payload biner raksasa (Base64 / bytea) melalui response API serverless."}
          </p>
          <div className="pt-1 flex items-center gap-1.5 text-xs font-mono">
            <span className="text-zinc-500">RTT Latency:</span>
            <span className={`font-bold ${architecture === "cloudinary_cdn" ? "text-emerald-500" : "text-rose-500"}`}>
              ~{latencyMs} ms
            </span>
          </div>
        </div>

        {/* Node 2: Serverless Function / Edge Network */}
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              2. Compute Layer (Vercel)
            </span>
            <Badge variant="outline" className="text-[10px]">FaaS Node.js</Badge>
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {architecture === "cloudinary_cdn"
              ? "Bebas dari beban transmisi byte gambar (0 byte bandwidth overhead). Serverless hanya mengolah string public_id."
              : "Beban RAM melonjak! Node.js buffer harus menahan biner gambar dalam memori, memicu OOM (Out-of-Memory)."}
          </p>
          <div className="pt-1 flex items-center gap-1.5 text-xs font-mono">
            <span className="text-zinc-500">RAM Pressure:</span>
            <span className={`font-bold ${architecture === "cloudinary_cdn" ? "text-emerald-500" : "text-rose-500"}`}>
              {architecture === "cloudinary_cdn" ? "0 MB (Offloaded)" : `~${Math.min(fileCount * 4, 1024)} MB`}
            </span>
          </div>
        </div>

        {/* Node 3: Storage Backend */}
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-cyan-500" />
              3. Storage Engine
            </span>
            <Badge variant="outline" className="text-[10px]">
              {architecture === "cloudinary_cdn" ? "Cloudinary CDN" : "Postgres DB"}
            </Badge>
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {architecture === "cloudinary_cdn"
              ? "Supabase hanya menyimpan string URL/ID (~50 byte per row). PostgreSQL tetap ramping dan cepat."
              : `PostgreSQL menyimpan kolom biner BYTEA. Ukuran database membengkak drastis menjadi ${(dbSizeMB / 1024).toFixed(2)} GB!`}
          </p>
          <div className="pt-1 flex items-center gap-1.5 text-xs font-mono">
            <span className="text-zinc-500">Ukuran DB:</span>
            <span className={`font-bold ${architecture === "cloudinary_cdn" ? "text-emerald-500" : "text-rose-500"}`}>
              {architecture === "cloudinary_cdn" ? "~2.5 KB (Metadata)" : `${dbSizeMB.toFixed(0)} MB`}
            </span>
          </div>
        </div>
      </div>

      {/* Metrik Perbandingan & Ringkasan Analitis */}
      <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
        architecture === "cloudinary_cdn"
          ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200"
          : "bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200"
      }`}>
        <div className="flex items-center gap-2 font-bold">
          {architecture === "cloudinary_cdn" ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Arsitektur Rekomendasi Industri (Serverless-Friendly Media Pipeline):</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>Anti-Pattern Kritis (Database Bloat & Serverless Bottleneck):</span>
            </>
          )}
        </div>
        <p>
          {architecture === "cloudinary_cdn"
            ? `Dengan mengalihkan media ke Cloudinary CDN, Anda menghemat ~${cdnBandwidthSaved} MB bandwidth jaringan, memangkas latensi download dari 850ms menjadi ~38ms, dan menjaga backup database PostgreSQL tetap instan (< 1 detik).`
            : `Menyimpan ${fileCount} gambar biner di PostgreSQL membuat backup pg_dump memakan waktu ~${dbBackupMinutes} menit, menghabiskan batas kuota gratis database (500MB), dan membebani serverless compute dengan transfer data lambat.`}
        </p>
      </div>
    </div>
  );
}

