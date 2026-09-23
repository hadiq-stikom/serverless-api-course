"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Folder, 
  FileText, 
  Settings, 
  CheckCircle2, 
  GitCommit, 
  Terminal,
  ShieldAlert
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function GitIdentityAnimator() {
  const [activeDirectory, setActiveDirectory] = useState<"global-project" | "campus-project">("campus-project");

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-xs font-semibold">
              Pilar 2.2: Git Identity Hygiene
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">git config --global vs local</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Multi-Akun: Resolusi Identitas Author (Global vs Folder Lokal)
          </h4>
        </div>

        {/* Directory Selector Buttons */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveDirectory("campus-project")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeDirectory === "campus-project"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            Folder Proyek Kuliah (Lokal Override)
          </button>
          <button
            type="button"
            onClick={() => setActiveDirectory("global-project")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeDirectory === "global-project"
                ? "bg-zinc-700 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            Folder Proyek Lain (Default Global)
          </button>
        </div>
      </div>

      {/* Configuration Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Global Config Card */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-zinc-500" />
              1. Konfigurasi Global (~/.gitconfig)
            </span>
            <Badge variant="outline" className="text-[10px] font-mono">Seluruh Laptop</Badge>
          </div>

          <pre className="p-3 rounded-lg bg-[#1e1e1e] text-zinc-200 text-xs font-mono overflow-x-auto leading-relaxed border border-zinc-800">
            <code>{`# git config --global user.name "Budi Santoso"
# git config --global user.email "budi.personal@gmail.com"

[user]
  name = Budi Santoso
  email = budi.personal@gmail.com`}</code>
          </pre>

          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Berlaku otomatis untuk semua repositori baru di laptop Anda jika tidak di-override secara lokal.
          </p>
        </div>

        {/* Local Folder Config Card */}
        <div className={`p-4 rounded-xl border transition-all duration-200 space-y-3 ${
          activeDirectory === "campus-project"
            ? "bg-white dark:bg-zinc-900/80 border-indigo-500/80 shadow-md ring-2 ring-indigo-500/20"
            : "bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 opacity-60"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-indigo-500" />
              2. Konfigurasi Lokal Folder (.git/config)
            </span>
            <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-[10px] font-mono">
              Folder ini saja
            </Badge>
          </div>

          <pre className="p-3 rounded-lg bg-[#1e1e1e] text-zinc-200 text-xs font-mono overflow-x-auto leading-relaxed border border-zinc-800">
            <code>{activeDirectory === "campus-project" ? `# git config user.name "Budi (NIM 23001001)"
# git config user.email "23001001@stikom.ac.id"

[user]
  name = Budi (NIM 23001001)
  email = 23001001@stikom.ac.id` : `# (Tidak ada override lokal di folder ini)
# Git akan otomatis mundur menggunakan konfigurasi Global`}</code>
          </pre>

          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {activeDirectory === "campus-project"
              ? "✅ Berhasil meng-override identitas global tanpa merusak setting proyek kerja/pribadi lainnya."
              : "Menggunakan default ~/.gitconfig karena file .git/config lokal belum diatur."}
          </p>
        </div>
      </div>

      {/* Simulated Git Log Commit Inspector */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <GitCommit className="w-4 h-4 text-emerald-500" />
            Inspeksi Author Commit yang Dihasilkan (git log -1):
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            Folder Aktif: {activeDirectory === "campus-project" ? "~/kuliah/serverless-project" : "~/personal/side-hustle"}
          </span>
        </div>

        <motion.div
          key={activeDirectory}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-lg bg-zinc-950 font-mono text-xs text-zinc-200 border border-zinc-800 space-y-1.5"
        >
          <div className="text-amber-400">commit 7f3a8b29c1d0e4f5a6b7c8d9e0f1a2b3c4d5e6f7 (HEAD -&gt; main)</div>
          <div className="text-zinc-300">
            Author: <strong className="text-white">
              {activeDirectory === "campus-project" ? "Budi (NIM 23001001)" : "Budi Santoso"}
            </strong> &lt;
            <span className="text-emerald-400">
              {activeDirectory === "campus-project" ? "23001001@stikom.ac.id" : "budi.personal@gmail.com"}
            </span>&gt;
          </div>
          <div className="text-zinc-500">Date:   Wed Sep 23 20:15:30 2026 +0700</div>
          <div className="text-zinc-400 pt-1">    feat: setup initial next.js project and gitignore</div>
        </motion.div>

        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 pt-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>
            Dengan menyetel email yang tepat, histori GitHub Anda akan otomatis terhubung dengan akun yang bersangkutan untuk penilaian dosen dan portofolio profesional.
          </span>
        </div>
      </div>
    </div>
  );
}
