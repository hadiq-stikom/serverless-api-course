"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  KeyRound, 
  ShieldCheck, 
  ShieldAlert, 
  Smartphone, 
  Server, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  Lock,
  Unlock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function BearerAuthFlowAnimator() {
  const [tokenScenario, setTokenScenario] = useState<"valid" | "expired" | "missing">("valid");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<"idle" | "granted" | "rejected">("idle");

  const runVerification = () => {
    setIsVerifying(true);
    setVerificationResult("idle");
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationResult(tokenScenario === "valid" ? "granted" : "rejected");
    }, 900);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-xs font-semibold">
              Pilar 2.1: Keamanan API
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">RFC 6750 Bearer JWT</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Otentikasi Stateless Bearer Token: Mobile Client ➔ Route Handler
          </h4>
        </div>

        {/* Scenario Buttons */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => { setTokenScenario("valid"); setVerificationResult("idle"); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              tokenScenario === "valid" ? "bg-emerald-600 text-white shadow-sm" : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            Token Valid
          </button>
          <button
            type="button"
            onClick={() => { setTokenScenario("expired"); setVerificationResult("idle"); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              tokenScenario === "expired" ? "bg-amber-600 text-white shadow-sm" : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            Token Kedaluwarsa
          </button>
          <button
            type="button"
            onClick={() => { setTokenScenario("missing"); setVerificationResult("idle"); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              tokenScenario === "missing" ? "bg-rose-600 text-white shadow-sm" : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            Tanpa Token
          </button>
        </div>
      </div>

      {/* Pipeline Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Step 1: Mobile Client */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
              <Smartphone className="w-4 h-4 text-emerald-500" /> 1. Klien Mobile (Flutter)
            </span>
            <Badge variant="outline" className="text-[10px]">HTTP Request</Badge>
          </div>
          <p className="text-[11px] text-zinc-500">Menyisipkan token JWT hasil login ke HTTP Header.</p>
          <div className="p-2 rounded bg-zinc-950 text-zinc-300 font-mono text-[10px] space-y-1 overflow-x-auto">
            <div className="text-zinc-500">// Request Header:</div>
            {tokenScenario === "missing" ? (
              <div className="text-rose-400 font-semibold">[Header Authorization Tidak Ada]</div>
            ) : tokenScenario === "expired" ? (
              <div className="text-amber-400">Authorization: Bearer eyJhbGciOi...[EXPIRED]</div>
            ) : (
              <div className="text-emerald-400">Authorization: Bearer eyJhbGciOi...[VALID_JWT]</div>
            )}
          </div>
        </div>

        {/* Step 2: Next.js API Route Handler */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
              <Server className="w-4 h-4 text-amber-500" /> 2. API Route Handler
            </span>
            <Badge variant="outline" className="text-[10px]">Edge Verifier</Badge>
          </div>
          <p className="text-[11px] text-zinc-500">Mengekstrak token &amp; memvalidasi ke Supabase Auth.</p>
          <div className="p-2 rounded bg-zinc-950 text-cyan-300 font-mono text-[10px] space-y-1 overflow-x-auto">
            <div className="text-zinc-500">// src/lib/api-auth.ts</div>
            <div>const token = authHeader.split(&quot; &quot;)[1]</div>
            <div>const &#123; user, error &#125; = await supabase.auth.getUser(token)</div>
          </div>
        </div>

        {/* Step 3: Result Verdict */}
        <div className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
          verificationResult === "granted"
            ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20"
            : verificationResult === "rejected"
            ? "border-rose-500/50 bg-rose-50/50 dark:bg-rose-950/20"
            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40"
        }`}>
          <div className="flex items-center justify-between pb-1 border-b border-zinc-200/50 dark:border-zinc-800">
            <span className="text-xs font-bold flex items-center gap-1.5">
              {verificationResult === "granted" ? (
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              ) : verificationResult === "rejected" ? (
                <ShieldAlert className="w-4 h-4 text-rose-500" />
              ) : (
                <Lock className="w-4 h-4 text-zinc-400" />
              )}
              3. Respon Keamanan
            </span>
            <Badge variant="outline" className="text-[10px]">
              {verificationResult === "granted" ? "200 OK" : verificationResult === "rejected" ? "401 UNAUTHORIZED" : "Waiting"}
            </Badge>
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
            {verificationResult === "granted" && "✅ Akses diterima! User ID diekstrak untuk query RLS PostgreSQL."}
            {verificationResult === "rejected" && "❌ Akses ditolak! Serverless function langsung menghentikan request."}
            {verificationResult === "idle" && "Jalankan simulasi untuk melihat respon keamanan."}
          </p>
        </div>
      </div>

      {/* Simulator Action Button */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800">
        <span className="text-xs text-zinc-600 dark:text-zinc-400">
          Uji verifikasi skenario: <strong>{tokenScenario.toUpperCase()}</strong>
        </span>
        <Button
          onClick={runVerification}
          disabled={isVerifying}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs"
        >
          {isVerifying ? "Memverifikasi Token..." : "Verifikasi Token Bearer ➔"}
        </Button>
      </div>
    </div>
  );
}
