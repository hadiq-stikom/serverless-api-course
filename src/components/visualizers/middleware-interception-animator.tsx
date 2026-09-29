"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Workflow, 
  ShieldCheck, 
  ArrowRight, 
  FileCode, 
  Filter, 
  Globe, 
  Server, 
  Ban, 
  CheckCircle2, 
  Clock,
  Zap,
  Code
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function MiddlewareInterceptionAnimator() {
  const [selectedPath, setSelectedPath] = useState<string>("/dashboard/projects");
  const [customPath, setCustomPath] = useState<string>("");

  const presetPaths = [
    { path: "/dashboard/projects", label: "Rute Privat (/dashboard)", isStatic: false, willIntercept: true },
    { path: "/login", label: "Rute Auth (/login)", isStatic: false, willIntercept: true },
    { path: "/_next/static/chunks/app.js", label: "Bundle JS Statis", isStatic: true, willIntercept: false },
    { path: "/favicon.ico", label: "Icon Browser", isStatic: true, willIntercept: false },
    { path: "/images/hero-logo.svg", label: "Asset Gambar SVG", isStatic: true, willIntercept: false },
    { path: "/api/health", label: "API Endpoint", isStatic: false, willIntercept: true }
  ];

  const activePath = customPath.trim() !== "" ? customPath.trim() : selectedPath;

  // Test against matcher regex
  // Matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
  const isExcluded = 
    activePath.startsWith("/_next/static") ||
    activePath.startsWith("/_next/image") ||
    activePath === "/favicon.ico" ||
    /\.(svg|png|jpg|jpeg|gif|webp)$/i.test(activePath);

  const willIntercept = !isExcluded;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-xs font-semibold">
              Pilar 2.1: Edge Interception
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">src/middleware.ts</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Next.js 16 Middleware: Intersepsi Edge &amp; Matcher Filtering
          </h4>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
        Next.js Middleware dieksekusi di <strong>Vercel Edge Network</strong> tepat sebelum request mencapai Server Component atau Route Handler. Konfigurasi <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400">matcher</code> mutlak diperlukan agar aset statis (gambar, JS bundle, font) tidak memicu eksekusi kode middleware yang membuang kuota komputasi.
      </p>

      {/* Preset Route Selectors */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-indigo-500" />
          <span>Pilih Jalur Request URL untuk Diuji:</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {presetPaths.map((p) => (
            <button
              key={p.path}
              type="button"
              onClick={() => {
                setSelectedPath(p.path);
                setCustomPath("");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                activePath === p.path
                  ? "bg-indigo-600 text-white font-bold shadow-sm"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-indigo-400"
              }`}
            >
              <span>{p.path}</span>
              <span className={`text-[10px] px-1 rounded ${
                p.willIntercept ? "bg-indigo-500/20 text-indigo-300" : "bg-zinc-500/20 text-zinc-400"
              }`}>
                {p.isStatic ? "Aset Statis" : "Rute Aplikasi"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline Visual Simulation */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <span>Alur Pipeline Intersepsi Edge:</span>
          <span className="font-mono text-xs text-indigo-500">{activePath}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Box 1: Browser Request */}
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
              <Globe className="w-4 h-4" />
              <span>1. Client Request Masuk</span>
            </div>
            <div className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 break-all">
              GET {activePath}
            </div>
            <p className="text-[10px] text-zinc-400">
              Browser mengirim HTTP GET request menuju domain server Next.js.
            </p>
          </div>

          {/* Box 2: Middleware Matcher */}
          <div className={`p-3.5 rounded-xl border transition-all space-y-1.5 ${
            willIntercept
              ? "border-indigo-500/50 bg-indigo-500/10 ring-2 ring-indigo-500/20"
              : "border-zinc-300 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/40 opacity-70"
          }`}>
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <Workflow className="w-4 h-4" />
                <span>2. Matcher Filter</span>
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                willIntercept
                  ? "bg-indigo-600 text-white font-bold"
                  : "bg-zinc-400 text-white"
              }`}>
                {willIntercept ? "MATCHED (INTERCEPT)" : "SKIPPED (BYPASS)"}
              </span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-normal">
              {willIntercept
                ? "URL lolos filter regex matcher! Middleware Next.js dijalankan di Vercel Edge untuk refresh sesi."
                : "Aset statis terdeteksi oleh regex negative lookahead. Middleware di-bypass demi zero latency."}
            </p>
          </div>

          {/* Box 3: Execution Result */}
          <div className={`p-3.5 rounded-xl border transition-all space-y-1.5 ${
            willIntercept
              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300"
              : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400"
          }`}>
            <div className="flex items-center gap-2 font-bold">
              {willIntercept ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <Zap className="w-4 h-4 text-amber-500" />
              )}
              <span>3. Target Akhir</span>
            </div>
            <p className="text-[11px] leading-normal">
              {willIntercept ? (
                <span>
                  <strong>updateSession()</strong> memvalidasi token sesi di cookies, me-refresh token jika perlu, dan mengizinkan atau me-redirect pengguna.
                </span>
              ) : (
                <span>
                  Aset langsung disajikan dari <strong>Vercel Edge Global CDN Cache</strong> tanpa beban komputasi server.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Code Matcher Snippet */}
        <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300 space-y-1">
          <div className="text-zinc-500 text-[10px]">Pola Regex Baku Standar Next.js (Negative Lookahead):</div>
          <div className="text-indigo-400 font-bold">
            matcher: [&apos;/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)&apos;]
          </div>
        </div>
      </div>
    </div>
  );
}
