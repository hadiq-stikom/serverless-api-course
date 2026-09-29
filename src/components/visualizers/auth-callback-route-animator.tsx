"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileCode, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  KeyRound, 
  Globe, 
  Server,
  Lock,
  CornerDownRight,
  ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AuthCallbackRouteAnimator() {
  const [testScenario, setTestScenario] = useState<"valid" | "missing-code" | "expired">("valid");

  const scenarios = {
    valid: {
      title: "Skenario 1: Kode Otorisasi Sah",
      url: "https://my-app.vercel.app/auth/callback?code=gh_oauth_code_8192a&next=/dashboard",
      codeParam: "gh_oauth_code_8192a",
      nextParam: "/dashboard",
      exchangeSuccess: true,
      statusCode: 307,
      redirectTarget: "/dashboard",
      statusText: "SUCCESS (307 REDIRECT)",
      color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
    },
    "missing-code": {
      title: "Skenario 2: Parameter Kode Kosong",
      url: "https://my-app.vercel.app/auth/callback?error=access_denied",
      codeParam: null,
      nextParam: "/dashboard",
      exchangeSuccess: false,
      statusCode: 307,
      redirectTarget: "/auth/auth-code-error",
      statusText: "REDIRECT ERROR (307)",
      color: "border-red-500/40 bg-red-500/10 text-red-800 dark:text-red-300"
    },
    expired: {
      title: "Skenario 3: Kode Kedaluwarsa (Expired/Reused)",
      url: "https://my-app.vercel.app/auth/callback?code=expired_code_001&next=/dashboard",
      codeParam: "expired_code_001",
      nextParam: "/dashboard",
      exchangeSuccess: false,
      statusCode: 307,
      redirectTarget: "/auth/auth-code-error",
      statusText: "EXCHANGE REJECTED (307)",
      color: "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300"
    }
  };

  const current = scenarios[testScenario];

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-xs font-semibold">
              Pilar 3.3: Route Handler
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">src/app/auth/callback/route.ts</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Route Handler OAuth Callback: Pertukaran Kode ke Sesi Kuki
          </h4>
        </div>

        {/* Scenario Switcher */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setTestScenario("valid")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              testScenario === "valid"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Kode Valid
          </button>
          <button
            type="button"
            onClick={() => setTestScenario("missing-code")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              testScenario === "missing-code"
                ? "bg-red-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Parameter Kosong
          </button>
          <button
            type="button"
            onClick={() => setTestScenario("expired")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              testScenario === "expired"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Kode Hangus
          </button>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
        Saat provider pihak ketiga (seperti GitHub) menyelesaikan login, ia mengembalikan browser ke URL Callback aplikasi. Route Handler Next.js bertugas menerima parameter <code className="font-mono text-xs text-purple-600 dark:text-purple-400">?code=...</code>, menukarkannya dengan token sesi resmi via <code className="font-mono text-xs">exchangeCodeForSession</code>, dan mengalihkan user ke rute akhir.
      </p>

      {/* Simulated Incoming URL */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-purple-500" />
          <span>Incoming HTTP GET Request ke Route Handler:</span>
        </div>
        <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-purple-300 break-all">
          GET {current.url}
        </div>
      </div>

      {/* Step by Step Execution Trace */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Step 1 */}
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1.5">
          <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-purple-500" />
            <span>1. Parsing SearchParams</span>
          </div>
          <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-[11px] space-y-1">
            <div>code = <span className="text-purple-500 font-bold">{current.codeParam ? `"${current.codeParam}"` : "null"}</span></div>
            <div>next = <span className="text-cyan-500 font-bold">&quot;{current.nextParam}&quot;</span></div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1.5">
          <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-indigo-500" />
            <span>2. exchangeCodeForSession</span>
          </div>
          <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-[11px] space-y-1">
            <div className={current.exchangeSuccess ? "text-emerald-500 font-bold" : "text-red-500 font-bold"}>
              {current.exchangeSuccess ? "✅ Sesi Terbit & Cookies Set" : "❌ Gagal: Invalid/Expired Code"}
            </div>
            <div className="text-zinc-400 text-[10px]">
              {current.exchangeSuccess ? "supabase.auth.exchangeCodeForSession(code)" : "Penukaran ditolak auth server"}
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1.5">
          <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <CornerDownRight className="w-4 h-4 text-cyan-500" />
            <span>3. Final Redirect</span>
          </div>
          <div className="p-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-[11px] space-y-1">
            <div>Status: <span className="font-bold">{current.statusCode}</span></div>
            <div className="text-cyan-500 font-bold break-all">➔ {current.redirectTarget}</div>
          </div>
        </div>
      </div>

      {/* Outcome Banner */}
      <div className={`p-4 rounded-xl border ${current.color} flex items-center justify-between gap-3 text-xs`}>
        <div className="flex items-center gap-2.5 font-bold text-sm">
          {current.exchangeSuccess ? (
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          )}
          <span>{current.statusText}: {current.redirectTarget}</span>
        </div>
        <span className="text-[11px] font-mono opacity-80">
          {`NextResponse.redirect(\`\${origin}\${next}\`)`}
        </span>
      </div>
    </div>
  );
}
