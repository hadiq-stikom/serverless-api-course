"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Globe, 
  Server, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  AlertTriangle,
  RefreshCw,
  FileCode
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CorsPreflightAnimator() {
  const [corsEnabled, setCorsEnabled] = useState(true);
  const [clientOrigin, setClientOrigin] = useState("http://localhost:3000");
  const [allowedOrigin, setAllowedOrigin] = useState("*");
  const [simStep, setSimStep] = useState<0 | 1 | 2>(0);

  const isOriginAllowed = allowedOrigin === "*" || allowedOrigin === clientOrigin;

  const testPreflight = () => {
    setSimStep(1);
    setTimeout(() => {
      setSimStep(2);
    }, 800);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-xs font-semibold">
              Pilar 2.2: Kebijakan Browser
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">CORS &amp; Preflight OPTIONS</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Mekanisme CORS Preflight: Mengapa Browser Mengirim HTTP OPTIONS?
          </h4>
        </div>

        {/* Toggle Switcher */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => { setCorsEnabled(!corsEnabled); setSimStep(0); }}
            className={`text-xs font-bold ${
              corsEnabled 
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" 
                : "border-rose-500 text-rose-600 dark:text-rose-400"
            }`}
          >
            {corsEnabled ? "✅ CORS Headers: AKTIF" : "❌ CORS Headers: MATI"}
          </Button>
        </div>
      </div>

      {/* Visual Preflight Lifecycle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1: Preflight OPTIONS */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
              <Globe className="w-4 h-4 text-cyan-500" /> 1. Browser: Preflight Request
            </span>
            <Badge variant="outline" className="text-[10px] font-mono">OPTIONS /api/v1/tasks</Badge>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Sebelum mengirim method berbahaya (POST/PUT/DELETE) atau custom header (Authorization), browser mengirim permintaan pendahuluan bertipe <strong>OPTIONS</strong> untuk meminta izin.
          </p>
          <div className="p-2.5 rounded-lg bg-zinc-950 font-mono text-[10px] text-zinc-300 space-y-1">
            <div className="text-zinc-500">// Header yang dikirim browser:</div>
            <div>Origin: {clientOrigin}</div>
            <div>Access-Control-Request-Method: POST</div>
            <div>Access-Control-Request-Headers: authorization, content-type</div>
          </div>
        </div>

        {/* Step 2: Server Response */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
              <Server className="w-4 h-4 text-amber-500" /> 2. Server Response Header
            </span>
            <Badge variant="outline" className="text-[10px]">
              {corsEnabled ? "204 No Content" : "CORS Blocked"}
            </Badge>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Next.js Route Handler wajib merespon dengan header izin akses domain eksternal.
          </p>
          <div className="p-2.5 rounded-lg bg-zinc-950 font-mono text-[10px] space-y-1">
            {corsEnabled ? (
              <>
                <div className="text-emerald-400">Access-Control-Allow-Origin: *</div>
                <div className="text-emerald-400">Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS</div>
                <div className="text-emerald-400">Access-Control-Allow-Headers: Content-Type, Authorization</div>
              </>
            ) : (
              <div className="text-rose-400 font-semibold">[Header CORS Tidak Ditemukan ➔ Browser Memblokir Request!]</div>
            )}
          </div>
        </div>
      </div>

      {/* Simulator Execution Box */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800">
        <div className="space-y-1 text-xs">
          <div className="font-bold flex items-center gap-2">
            {simStep === 0 && <span className="text-zinc-500">Kesiapan Simulasi: Siap diuji coba</span>}
            {simStep === 1 && <span className="text-amber-500 animate-pulse">Sedang mengirim Preflight OPTIONS...</span>}
            {simStep === 2 && corsEnabled && (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Preflight Sukses! Browser diizinkan mengirim request POST utama.
              </span>
            )}
            {simStep === 2 && !corsEnabled && (
              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> CORS Error! Preflight ditolak: No &apos;Access-Control-Allow-Origin&apos; header.
              </span>
            )}
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
            {corsEnabled
              ? "Aplikasi mobile atau SPA client di domain berbeda berhasil mengonsumsi REST API."
              : "Aplikasi mobile web atau frontend terpisah akan mengalami error CORS di Console browser."}
          </p>
        </div>

        <Button
          onClick={testPreflight}
          disabled={simStep === 1}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shrink-0"
        >
          {simStep === 1 ? "Mengecek Izin..." : "Uji Coba Preflight ➔"}
        </Button>
      </div>
    </div>
  );
}
