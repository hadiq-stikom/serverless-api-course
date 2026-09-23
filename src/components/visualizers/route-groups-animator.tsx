"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Folder, 
  FolderLock, 
  FileCode, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  EyeOff, 
  Sparkles, 
  ShieldAlert 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FolderItem {
  id: string;
  name: string;
  path: string;
  publicUrl: string;
  type: "group" | "private" | "standard";
  explanation: string;
}

const ITEMS: FolderItem[] = [
  {
    id: "login",
    name: "src/app/(auth)/login/page.tsx",
    path: "(auth)/login",
    publicUrl: "/login",
    type: "group",
    explanation: "Folder '(auth)' berada dalam tanda kurung, sehingga otomatis DIHILANGKAN dari path URL publik browser."
  },
  {
    id: "register",
    name: "src/app/(auth)/register/page.tsx",
    path: "(auth)/register",
    publicUrl: "/register",
    type: "group",
    explanation: "Memungkinkan pembagian layout khusus otentikasi tanpa mengotori URL pengguna menjadi /auth/register."
  },
  {
    id: "tasks",
    name: "src/app/(dashboard)/tasks/page.tsx",
    path: "(dashboard)/tasks",
    publicUrl: "/tasks",
    type: "group",
    explanation: "Layout dashboard diterapkan ke halaman ini, namun path URL tetap bersih dan ringkas di /tasks."
  },
  {
    id: "private-card",
    name: "src/app/_components/task-card.tsx",
    path: "_components/task-card.tsx",
    publicUrl: "❌ TIDAK BISA DIAKSES (HTTP 404)",
    type: "private",
    explanation: "Awalan underscore '_' menandakan private folder. Next.js mengabaikannya secara total dari sistem routing peramban."
  }
];

export function RouteGroupsAnimator() {
  const [selectedId, setSelectedId] = useState<string>("login");
  const activeItem = ITEMS.find((it) => it.id === selectedId) || ITEMS[0];

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Folder className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator Route Groups &apos;(namaFolder)&apos; &amp; Private Folders &apos;_namaFolder&apos;
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Lihat bagaimana Next.js memisahkan organisasi arsitektur folder kode dari path URL publik pengguna.
          </p>
        </div>

        <Badge variant="outline" className="text-xs">
          Clean File Architecture
        </Badge>
      </div>

      {/* Interactive Exploration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Project File Tree Explorer */}
        <div className="lg:col-span-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
            <span>Struktur Berkas Proyek</span>
            <span className="text-[10px] text-zinc-400">Klik berkas</span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            {ITEMS.map((item) => {
              const isSelected = selectedId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-indigo-500/15 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs"
                      : "bg-white dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {item.type === "private" ? (
                      <FolderLock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    ) : (
                      <FileCode className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    )}
                    <span className="truncate">{item.path}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] shrink-0">
                    {item.type === "group" ? "Route Group" : "Private"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Path Resolver Visualizer */}
        <div className="lg:col-span-7 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span>Hasil Resolusi URL Publik di Browser</span>
            <span className="text-[10px] text-zinc-400 font-mono">Routing Output</span>
          </div>

          <div className="space-y-4">
            {/* Visual Transformation */}
            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 space-y-2 text-xs">
              <div className="text-zinc-500 text-[11px] font-mono">Lokasi Berkas di IDE:</div>
              <div className="font-mono font-bold text-zinc-800 dark:text-zinc-200 text-xs">
                {activeItem.name}
              </div>

              <div className="flex items-center justify-center my-2 text-indigo-500">
                <ArrowRight className="w-4 h-4 rotate-90 sm:rotate-0" />
              </div>

              <div className="text-zinc-500 text-[11px] font-mono">URL yang Dibuka Pengguna:</div>
              <div className={`p-2.5 rounded-lg border font-mono font-bold text-sm flex items-center gap-2 ${
                activeItem.type === "private"
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              }`}>
                {activeItem.type === "private" ? (
                  <EyeOff className="w-4 h-4 shrink-0" />
                ) : (
                  <Globe className="w-4 h-4 shrink-0" />
                )}
                <span>https://serverless-academy.id{activeItem.publicUrl}</span>
              </div>
            </div>

            {/* Explanation Note */}
            <div className="p-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
              💡 <strong>Mengapa ini penting?</strong> {activeItem.explanation}
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <span>Sintaks: <code>(folder)</code> untuk Grouping • <code>_folder</code> untuk Private</span>
          </div>
        </div>
      </div>
    </div>
  );
}
