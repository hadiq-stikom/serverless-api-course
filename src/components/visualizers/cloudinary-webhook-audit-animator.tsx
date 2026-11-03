"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Webhook, ShieldCheck, ShieldAlert, KeyRound, CheckCircle2, ArrowRight, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CloudinaryWebhookAuditAnimator() {
  const [signatureStatus, setSignatureStatus] = useState<"valid" | "tampered">("valid");
  const [creditsUsed, setCreditsUsed] = useState<number>(14.2);
  const totalCredits = 25.0; // Kuota gratis Cloudinary: 25 kredit / bulan

  const isValid = signatureStatus === "valid";

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">🔔</span>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
              Simulasi Webhook Asinkron &amp; Audit Penggunaan Kuota Kredit
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Menerima notifikasi transformasi asinkron dan memvalidasi keaslian signature webhook.
          </p>
        </div>

        {/* Signature Status Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl self-start sm:self-center border border-zinc-200/60 dark:border-zinc-700/60 text-xs">
          <button
            type="button"
            onClick={() => setSignatureStatus("valid")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              signatureStatus === "valid"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Signature Valid (200 OK)
          </button>
          <button
            type="button"
            onClick={() => setSignatureStatus("tampered")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              signatureStatus === "tampered"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Signature Dipalsukan (401)
          </button>
        </div>
      </div>

      {/* Kuota Kredit Bar */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-indigo-500" />
            Penggunaan Kredit Bulanan (Cloudinary Plan Gratis):
          </span>
          <span className="font-mono text-zinc-500 text-[11px]">
            {creditsUsed.toFixed(1)} / {totalCredits} Kredit ({Math.round((creditsUsed / totalCredits) * 100)}%)
          </span>
        </div>

        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-3 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all"
            style={{ width: `${(creditsUsed / totalCredits) * 100}%` }}
          />
        </div>

        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
          💡 1 Kredit = 1.000 transformasi gambar biasa ATAU 1 GB penyimpanan ATAU 1 GB bandwidth CDN.
        </p>
      </div>

      {/* Webhook Signature Inspector */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-2 border-b border-zinc-800">
          <span>Route Handler: POST /api/webhooks/cloudinary</span>
          <Badge
            variant={isValid ? "default" : "destructive"}
            className={`text-[10px] ${isValid ? "bg-emerald-600" : "bg-rose-600"}`}
          >
            {isValid ? "200 Verified Signature" : "401 Invalid Signature"}
          </Badge>
        </div>

        <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] space-y-1">
          <div>
            <span className="text-zinc-500">Header X-Cld-Timestamp: </span>
            <span className="text-amber-400">1717204800</span>
          </div>
          <div>
            <span className="text-zinc-500">Header X-Cld-Signature: </span>
            <span className={isValid ? "text-emerald-400" : "text-rose-400 font-bold"}>
              {isValid ? "a9f83c18e4726... (Matches Server Hash)" : "fake_hacker_token_xyz"}
            </span>
          </div>
          <div>
            <span className="text-zinc-500">Payload event: </span>
            <span className="text-indigo-300">&quot;upload_success&quot;</span>, public_id: <span className="text-cyan-300">&quot;tasks/cover_202&quot;</span>
          </div>
        </div>

        <p className="text-[11px] text-zinc-400 font-sans leading-relaxed pt-1">
          {isValid
            ? "Verifikasi kriptografis lolos! Database Supabase secara aman memperbarui status task 'asset_ready = true'."
            : "Peringatan Keamanan! Signature tidak cocok dengan secret lokal. Payload diabaikan untuk mencegah data poisoning."}
        </p>
      </div>
    </div>
  );
}

