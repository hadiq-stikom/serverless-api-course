"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  ShieldAlert, 
  FileText, 
  Key, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Unlock,
  Terminal,
  FileCode
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function GitignoreProtectionAnimator() {
  const [hasGitignore, setHasGitignore] = useState(true);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 text-xs font-semibold">
              Pilar 3.1: Secrets Hygiene
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">.gitignore firewall</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Mekanisme Proteksi .gitignore Terhadap File .env.local
          </h4>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setHasGitignore(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              hasGitignore
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            .gitignore Aktif (Aman)
          </button>
          <button
            type="button"
            onClick={() => setHasGitignore(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              !hasGitignore
                ? "bg-red-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Tanpa .gitignore (Bahaya!)
          </button>
        </div>
      </div>

      {/* Visual File Tracking Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Project Files in Directory */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
            <span>Daftar Berkas di Folder Proyek:</span>
            <span className="font-mono text-zinc-500">my-serverless-app/</span>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                <FileCode className="w-4 h-4 text-blue-500" />
                src/app/page.tsx
              </span>
              <Badge variant="outline" className="text-[10px]">Kode Publik</Badge>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                <FileText className="w-4 h-4 text-emerald-500" />
                package.json
              </span>
              <Badge variant="outline" className="text-[10px]">Dependensi</Badge>
            </div>

            {/* Secret File: .env.local */}
            <motion.div
              animate={{
                scale: !hasGitignore ? 1.02 : 1,
                borderColor: !hasGitignore ? "#ef4444" : "#e4e4e7",
              }}
              className={`p-2.5 rounded-lg border flex items-center justify-between text-xs font-mono transition-all ${
                hasGitignore
                  ? "bg-zinc-100/60 dark:bg-zinc-800/30 text-zinc-400 dark:text-zinc-500 opacity-60 border-dashed"
                  : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-400 dark:border-red-600 shadow-sm"
              }`}
            >
              <span className="flex items-center gap-2">
                <Key className={`w-4 h-4 ${hasGitignore ? "text-zinc-400" : "text-red-500 animate-bounce"}`} />
                <span className="font-bold">.env.local</span>
                <span className="text-[10px] text-zinc-400 hidden sm:inline">(Database Secret Keys)</span>
              </span>
              <Badge className={hasGitignore ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 text-[10px]" : "bg-red-500 text-white text-[10px]"}>
                {hasGitignore ? "Ignored 🔒" : "Exposed ⚠️"}
              </Badge>
            </motion.div>
          </div>

          <div className="text-[11px] text-zinc-500 leading-relaxed pt-1">
            File <code>.env.local</code> memuat <code>SUPABASE_SERVICE_ROLE_KEY</code> yang memiliki kuasa bypass seluruh proteksi database.
          </div>
        </div>

        {/* Right: Simulated Git Status Output */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#1e1e1e] text-zinc-100 font-mono text-xs space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-zinc-800 text-[11px]">
              <span>Terminal: git status</span>
              <span className={hasGitignore ? "text-emerald-400" : "text-red-400"}>
                {hasGitignore ? "● STATUS: SAFE" : "● STATUS: CRITICAL RISK"}
              </span>
            </div>

            <div className="space-y-1.5 leading-relaxed text-[11px]">
              <div className="text-zinc-400">On branch main</div>
              <div className="text-zinc-400">Untracked files:</div>
              <div className="text-zinc-500 pl-2">  (use &quot;git add &lt;file&gt;...&quot; to include in what will be committed)</div>
              
              <div className="text-red-400 pl-4">src/app/page.tsx</div>
              <div className="text-red-400 pl-4">package.json</div>
              
              {/* .env.local appearance based on gitignore state */}
              <AnimatePresence>
                {!hasGitignore && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-500 font-bold pl-4 bg-red-950/60 p-1 rounded border border-red-500/50"
                  >
                    .env.local  &lt;--- BAHAYA! TERDETEKSI OLEH GIT!
                  </motion.div>
                )}
              </AnimatePresence>

              {hasGitignore && (
                <div className="text-zinc-500 text-[10px] pl-4 italic">
                  # .env.local diabaikan otomatis oleh aturan .gitignore (.env*.local)
                </div>
              )}
            </div>
          </div>

          <div className={`p-2.5 rounded-lg text-[11px] font-sans ${
            hasGitignore
              ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
              : "bg-red-950/80 text-red-200 border border-red-500/60 font-bold"
          }`}>
            {hasGitignore ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Kunci rahasia aman. Perintah <code>git add .</code> tidak akan pernah menyertakan .env.local.</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>PERINGATAN: Menjalankan <code>git add .</code> sekarang akan mengirim secret key Anda ke GitHub publik!</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
