"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Server, ShieldCheck, AlertTriangle, CheckCircle2, ArrowRight, Zap, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DirectUploadPipelineAnimator() {
  const [pipelineMode, setPipelineMode] = useState<"direct" | "server_proxy">("direct");
  const [fileSizeMB, setFileSizeMB] = useState<number>(8); // 8MB default to test 4.5MB threshold

  const isOverVercelLimit = fileSizeMB > 4.5;
  const isFailed = pipelineMode === "server_proxy" && isOverVercelLimit;

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">🚀</span>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
              Simulasi Direct Client Upload vs Serverless Function Proxy
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Menguji batasan payload 4.5MB Vercel Serverless dan keuntungan &lt;CldUploadWidget&gt;.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl self-start sm:self-center border border-zinc-200/60 dark:border-zinc-700/60">
          <button
            type="button"
            onClick={() => setPipelineMode("direct")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              pipelineMode === "direct"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Direct Browser Upload (Widget)
          </button>
          <button
            type="button"
            onClick={() => setPipelineMode("server_proxy")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              pipelineMode === "server_proxy"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            Server Action Proxy
          </button>
        </div>
      </div>

      {/* Ukuran File Slider */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/60 dark:border-zinc-800 text-xs">
        <span className="text-zinc-600 dark:text-zinc-300 font-medium">
          Ukuran File Foto Mentah Pengguna: <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{fileSizeMB} MB</strong>
        </span>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="2"
            max="16"
            step="1"
            value={fileSizeMB}
            onChange={(e) => setFileSizeMB(Number(e.target.value))}
            className="w-36 accent-indigo-600 cursor-pointer"
          />
          <span className="font-mono font-bold text-zinc-900 dark:text-white w-12 text-right">{fileSizeMB} MB</span>
        </div>
      </div>

      {/* Visualisasi Alur Upload 3 Tahap */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {/* Step 1: Browser */}
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-indigo-500" />
              1. Browser &lt;CldUploadWidget&gt;
            </span>
            <Badge variant="secondary" className="text-[10px]">Client</Badge>
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {pipelineMode === "direct"
              ? "Widget membuka dialog unggah. File multipart/form-data dikirim langsung ke API Cloudinary via HTTPS."
              : "Formulir mengunggah biner file utuh ke Server Action Next.js di serverless backend."}
          </p>
          <div className="pt-1 text-xs font-mono text-zinc-500">
            Payload Keluar: <strong className="text-zinc-900 dark:text-white">{fileSizeMB} MB</strong>
          </div>
        </div>

        {/* Step 2: Next.js Serverless Gateway */}
        <div className={`p-3.5 rounded-xl border space-y-2 transition-all ${
          pipelineMode === "direct"
            ? "border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 opacity-80"
            : isFailed
            ? "border-rose-500 bg-rose-50/40 dark:bg-rose-950/30 ring-2 ring-rose-500/20"
            : "border-amber-500 bg-amber-50/40 dark:bg-amber-950/30"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-amber-500" />
              2. Vercel Serverless Function
            </span>
            <Badge variant={isFailed ? "destructive" : "secondary"} className="text-[10px]">
              Limit: 4.5 MB
            </Badge>
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {pipelineMode === "direct"
              ? "⚡ LEWAT BEBAS (Bypass)! Serverless sama sekali tidak menerima biner gambar, 0 byte CPU/RAM terpakai."
              : isFailed
              ? "💥 CRASH 413 Payload Too Large! Vercel Edge memutus koneksi karena ukuran file melampaui limit 4.5MB!"
              : "Menerima biner gambar dan meneruskannya ulang ke Cloudinary SDK (memakan waktu & kuota execution timeout)."}
          </p>
          <div className="pt-1 text-xs font-mono">
            {pipelineMode === "direct" ? (
              <span className="text-emerald-500 font-bold">Status: Bypass 0 Compute</span>
            ) : isFailed ? (
              <span className="text-rose-500 font-bold">Status: 413 Error Blocked</span>
            ) : (
              <span className="text-amber-500 font-bold">Status: Berhasil (Slow ~1.8s)</span>
            )}
          </div>
        </div>

        {/* Step 3: Cloudinary Storage & Supabase */}
        <div className={`p-3.5 rounded-xl border space-y-2 ${
          isFailed
            ? "border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/30 opacity-40"
            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              3. Cloudinary &amp; Supabase
            </span>
            <Badge variant="outline" className="text-[10px]">Persist</Badge>
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {isFailed
              ? "Gagal mencapai Cloudinary karena request terputus di tengah jalan oleh API gateway Vercel."
              : "Aset tersimpan di CDN. Callback onSuccess mengembalikan public_id & secure_url untuk disimpan ke database Supabase."}
          </p>
          <div className="pt-1 text-xs font-mono text-zinc-500">
            Hasil: <strong className={isFailed ? "text-rose-500" : "text-emerald-500"}>
              {isFailed ? "Upload Batal" : "public_id Tersimpan"}
            </strong>
          </div>
        </div>
      </div>

      {/* Kesimpulan Callout */}
      <div className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
        pipelineMode === "direct"
          ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200"
          : isFailed
          ? "bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200"
          : "bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200"
      }`}>
        {pipelineMode === "direct" ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        )}
        <div>
          <strong className="block mb-0.5">
            {pipelineMode === "direct"
              ? "Prinsip Arsitektur: Direct Upload adalah Kunci Skalabilitas Serverless"
              : isFailed
              ? "Bahaya Nyata Server Proxy di Vercel: Error 413 Payload Too Large"
              : "Catatan: File di Bawah 4.5MB Lolos, Namun Membuang Kuota Compute FaaS"}
          </strong>
          <p>
            {pipelineMode === "direct"
              ? "Dengan membiarkan peramban mengirim langsung ke Cloudinary melalui Upload Widget, aplikasi Anda dapat menerima file hingga 100MB tanpa pernah membebani RAM serverless function atau terkena batasan kuota Vercel 4.5MB."
              : isFailed
              ? `File ${fileSizeMB}MB ditolak langsung oleh Vercel. Pengguna akan melihat pesan gagal upload tanpa kejelasan teknis. Gunakan Direct Client Upload via <CldUploadWidget>!`
              : "Meskipun berhasil, mem-proxy gambar melalui Server Action membuang waktu eksekusi (execution duration) dan kuota bandwidth Vercel secara sia-sia."}
          </p>
        </div>
      </div>
    </div>
  );
}

