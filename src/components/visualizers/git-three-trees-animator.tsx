"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GitBranch, 
  FileCode, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  Cloud, 
  Database, 
  Folder, 
  Play, 
  Layers
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type FileLocation = "working" | "staging" | "local" | "remote";

export function GitThreeTreesAnimator() {
  const [fileLocation, setFileLocation] = useState<FileLocation>("working");
  const [lastCommand, setLastCommand] = useState<string>("Mulai dengan mengedit berkas...");

  const handleGitAdd = () => {
    setFileLocation("staging");
    setLastCommand("git add src/app/page.tsx");
  };

  const handleGitCommit = () => {
    setFileLocation("local");
    setLastCommand('git commit -m "feat: inisialisasi landing page"');
  };

  const handleGitPush = () => {
    setFileLocation("remote");
    setLastCommand("git push origin main");
  };

  const handleReset = () => {
    setFileLocation("working");
    setLastCommand("Mulai dengan mengedit berkas di Working Tree...");
  };

  const stages = [
    {
      id: "working",
      name: "1. Working Tree",
      desc: "Berkas nyata di editor VS Code Anda.",
      color: "amber",
      icon: Folder,
      statusLabel: "Modified / Untracked",
    },
    {
      id: "staging",
      name: "2. Staging Area (Index)",
      desc: "Keranjang seleksi berkas yang siap dicatat.",
      color: "blue",
      icon: Layers,
      statusLabel: "Changes to be committed",
    },
    {
      id: "local",
      name: "3. Local Repo (.git/)",
      desc: "Snapshot permanen tersimpan di database Git lokal.",
      color: "indigo",
      icon: Database,
      statusLabel: "Committed (HEAD)",
    },
    {
      id: "remote",
      name: "4. Remote GitHub",
      desc: "Penyimpanan cloud terdistribusi untuk kolaborasi & Vercel.",
      color: "emerald",
      icon: Cloud,
      statusLabel: "Pushed to Cloud",
    },
  ];

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-xs font-semibold">
              Pilar 2.1: Mental Model Git
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Working ➔ Staging ➔ Commit ➔ Push</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi 3 Wilayah Kerja Git & Transmisi ke Remote GitHub
          </h4>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleReset}
          className="text-xs self-start sm:self-auto gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Posisi File
        </Button>
      </div>

      {/* Terminal Command Bar */}
      <div className="p-3 rounded-xl bg-[#1e1e1e] text-zinc-100 font-mono text-xs flex items-center justify-between border border-zinc-800 shadow-inner">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-emerald-400">$</span>
          <span className="text-zinc-300 font-semibold">{lastCommand}</span>
        </div>
        <span className="text-[10px] text-zinc-500 hidden sm:inline uppercase tracking-wider">Bash CLI</span>
      </div>

      {/* 4 Stages Visual Track */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isFileHere = fileLocation === stage.id;
          const isPassed = 
            (stage.id === "working" && fileLocation !== "working") ||
            (stage.id === "staging" && (fileLocation === "local" || fileLocation === "remote")) ||
            (stage.id === "local" && fileLocation === "remote");

          return (
            <div
              key={stage.id}
              className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between space-y-3 min-h-[160px] ${
                isFileHere
                  ? "bg-white dark:bg-zinc-800 border-indigo-500 shadow-md ring-2 ring-indigo-500/20"
                  : isPassed
                  ? "bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 opacity-60"
                  : "bg-zinc-100/50 dark:bg-zinc-800/20 border-zinc-200 dark:border-zinc-800/80"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-lg ${
                    isFileHere ? "bg-indigo-600 text-white" : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 font-bold">Langkah {idx + 1}</span>
                </div>
                <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{stage.name}</h5>
                <p className="text-[11px] text-zinc-500 leading-tight">{stage.desc}</p>
              </div>

              {/* Dynamic File Item Card */}
              <div className="pt-2">
                <AnimatePresence>
                  {isFileHere && (
                    <motion.div
                      layoutId="trackedGitFile"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-700/80 text-xs font-mono space-y-1 shadow-xs"
                    >
                      <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-bold">
                        <FileCode className="w-3.5 h-3.5 text-indigo-500" />
                        <span>page.tsx</span>
                      </div>
                      <div className="text-[10px] text-indigo-600/80 dark:text-indigo-400">
                        ● {stage.statusLabel}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons to Move the File */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button
          size="sm"
          onClick={handleGitAdd}
          disabled={fileLocation !== "working"}
          className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold gap-1.5"
        >
          <Play className="w-3.5 h-3.5" />
          1. Jalankan &apos;git add .&apos;
        </Button>

        <ArrowRight className="w-4 h-4 text-zinc-400 hidden sm:block" />

        <Button
          size="sm"
          onClick={handleGitCommit}
          disabled={fileLocation !== "staging"}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5"
        >
          <Play className="w-3.5 h-3.5" />
          2. Jalankan &apos;git commit -m &quot;...&quot;&apos;
        </Button>

        <ArrowRight className="w-4 h-4 text-zinc-400 hidden sm:block" />

        <Button
          size="sm"
          onClick={handleGitPush}
          disabled={fileLocation !== "local"}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5"
        >
          <Play className="w-3.5 h-3.5" />
          3. Jalankan &apos;git push origin main&apos;
        </Button>
      </div>

      {/* Explanatory Footer */}
      <div className="text-[11px] p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 leading-relaxed border border-zinc-200 dark:border-zinc-700">
        💡 <strong>Prinsip Penting:</strong> Perubahan kode tidak langsung tersimpan ke riwayat. Anda harus memasukkannya ke keranjang seleksi (<em>Staging Area</em>), memotretnya menjadi snapshot permanen di database lokal (<em>Commit</em>), lalu mengirimkannya ke server cloud (<em>Push</em>).
      </div>
    </div>
  );
}
