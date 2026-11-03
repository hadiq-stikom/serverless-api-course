"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, Lock, Unlock, Clock, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SignedUrlAccessAnimator() {
  const [assetType, setAssetType] = useState<"public" | "authenticated">("authenticated");
  const [elapsedMinutes, setElapsedMinutes] = useState<number>(3); // default 3 menit (valid)
  const ttlMinutes = 10; // kedaluwarsa 10 menit

  const isExpired = assetType === "authenticated" && elapsedMinutes > ttlMinutes;

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">🛡️</span>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
              Access Control: Public Assets vs Authenticated Expiring Signed URLs
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Melindungi dokumen rahasia, bukti transfer, dan slip nilai dengan URL bertanda tangan berbatas waktu.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl self-start sm:self-center border border-zinc-200/60 dark:border-zinc-700/60 text-xs">
          <button
            type="button"
            onClick={() => setAssetType("authenticated")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              assetType === "authenticated"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Authenticated (Expiring Signed URL)
          </button>
          <button
            type="button"
            onClick={() => setAssetType("public")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              assetType === "public"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Unlock className="w-3.5 h-3.5" />
            Public Upload
          </button>
        </div>
      </div>

      {/* Slider Waktu Akses (Hanya jika Authenticated) */}
      {assetType === "authenticated" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/60 dark:border-zinc-800 text-xs">
          <span className="text-zinc-600 dark:text-zinc-300 font-medium flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            Simulasi Waktu Berlalu Sejak Link Diterbitkan:{" "}
            <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{elapsedMinutes} Menit</strong>{" "}
            (Batas TTL: {ttlMinutes} Menit)
          </span>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={elapsedMinutes}
              onChange={(e) => setElapsedMinutes(Number(e.target.value))}
              className="w-36 accent-indigo-600 cursor-pointer"
            />
            <span className="font-mono font-bold text-zinc-900 dark:text-white w-12 text-right">{elapsedMinutes} m</span>
          </div>
        </div>
      )}

      {/* Status Akses & URL Viewer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mock Dokumen Viewer */}
        <div className={`p-4 rounded-xl border flex flex-col items-center justify-center min-h-[170px] space-y-2 transition-all ${
          assetType === "public" || !isExpired
            ? "border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20"
            : "border-rose-500/40 bg-rose-50/20 dark:bg-rose-950/20"
        }`}>
          {assetType === "public" ? (
            <div className="text-center space-y-1">
              <span className="text-4xl">🖼️</span>
              <h5 className="font-bold text-xs text-zinc-900 dark:text-white">Foto Avatar Publik</h5>
              <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/40">
                Akses Terbuka Selamanya (200 OK)
              </Badge>
            </div>
          ) : !isExpired ? (
            <div className="text-center space-y-1">
              <span className="text-4xl">📄</span>
              <h5 className="font-bold text-xs text-zinc-900 dark:text-white">Dokumen Tagihan #INV-2024-001</h5>
              <Badge className="text-[10px] bg-emerald-600 text-white font-mono">
                ✅ Token Sah ({ttlMinutes - elapsedMinutes} menit tersisa)
              </Badge>
            </div>
          ) : (
            <div className="text-center space-y-1">
              <span className="text-4xl">🚫</span>
              <h5 className="font-bold text-xs text-rose-500">401 Unauthorized / Token Expired</h5>
              <p className="text-[11px] text-zinc-500 max-w-xs">
                Link bertanda tangan telah melewati batas kedaluwarsa 10 menit. File otomatis terkunci dari akses publik.
              </p>
            </div>
          )}
        </div>

        {/* Struktur URL Signature Parameter */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-2 border-b border-zinc-800">
            <span>Struktur URL Cloudinary</span>
            <span className={assetType === "authenticated" ? "text-indigo-400" : "text-emerald-400"}>
              {assetType === "authenticated" ? "Authenticated Delivery" : "Public Delivery"}
            </span>
          </div>

          <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-[11px] leading-relaxed break-all">
            {assetType === "authenticated" ? (
              <>
                https://res.cloudinary.com/kampus/image/
                <span className="text-amber-400 font-bold">authenticated</span>
                /s--<span className="text-purple-400 font-bold">q8Z1m...</span>--/
                <span className="text-cyan-400 font-bold">t_1717200600</span>
                /invoices/slip_01.pdf
              </>
            ) : (
              <>
                https://res.cloudinary.com/kampus/image/
                <span className="text-emerald-400 font-bold">upload</span>
                /f_auto,q_auto/avatars/user_102.jpg
              </>
            )}
          </div>

          <p className="text-[11px] text-zinc-400 font-sans leading-relaxed pt-1">
            {assetType === "authenticated"
              ? "URL authenticated memuat parameter signature 's--...--' dan waktu expired 't_...'. Parameter ini diverifikasi oleh Edge POP Cloudinary sebelum menyajikan file."
              : "URL publik langsung disajikan oleh CDN ke siapa pun yang memiliki tautan tanpa validasi tanda tangan."}
          </p>
        </div>
      </div>
    </div>
  );
}

