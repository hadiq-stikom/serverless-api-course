"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  ArrowRight, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  FileCode, 
  Compass, 
  ExternalLink, 
  Clock, 
  ShieldAlert 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TaskDetail {
  id: string;
  title: string;
  desc: string;
  status: "Selesai" | "Sedang Berjalan";
  xp: number;
  author: string;
}

const MOCK_TASKS: Record<string, TaskDetail> = {
  "1": {
    id: "1",
    title: "Setup Database PostgreSQL & Supabase Auth",
    desc: "Mengonfigurasi schema relasional, tabel users, dan row level security (RLS) di cloud database Supabase.",
    status: "Selesai",
    xp: 150,
    author: "Mahasiswa #1"
  },
  "2": {
    id: "2",
    title: "Rancang Layout Dashboard & Shell UI Shadcn",
    desc: "Membangun wireframe responsif dengan Route Groups (dashboard), layout bersama, dan token semantic Tailwind.",
    status: "Sedang Berjalan",
    xp: 200,
    author: "Mahasiswa #2"
  }
};

export function DynamicRoutingAnimator() {
  const [selectedId, setSelectedId] = useState<string>("1");
  const isNotFound = selectedId === "99";
  const task = MOCK_TASKS[selectedId];

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Compass className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator Rute Dinamis [id] & Async Params
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Uji bagaimana perubahan parameter URL mengeksekusi <code>await params</code> di Next.js 16 dan mengubah data halaman.
          </p>
        </div>

        <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] font-semibold self-start sm:self-auto">
          ⚠️ Breaking Change: Params adalah Promise!
        </Badge>
      </div>

      {/* Interactive Browser Address Bar */}
      <div className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 p-2.5 flex items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          <Globe className="w-4 h-4 text-zinc-400 shrink-0" />
          <div className="flex items-center font-mono text-xs text-zinc-600 dark:text-zinc-300 truncate">
            <span className="opacity-60 hidden sm:inline">http://localhost:3000</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">/tasks/</span>
            <motion.span
              key={selectedId}
              initial={{ scale: 1.3, color: "#6366f1" }}
              animate={{ scale: 1, color: isNotFound ? "#ef4444" : "#10b981" }}
              className="font-bold underline decoration-2 underline-offset-2 px-1 rounded bg-indigo-500/10"
            >
              {selectedId}
            </motion.span>
          </div>
        </div>

        {/* Route Selector Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-zinc-400 hidden sm:inline">Simulasikan Klik:</span>
          <button
            type="button"
            onClick={() => setSelectedId("1")}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              selectedId === "1"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 border border-zinc-200 dark:border-zinc-700"
            }`}
          >
            ID: 1
          </button>
          <button
            type="button"
            onClick={() => setSelectedId("2")}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              selectedId === "2"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 border border-zinc-200 dark:border-zinc-700"
            }`}
          >
            ID: 2
          </button>
          <button
            type="button"
            onClick={() => setSelectedId("99")}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              selectedId === "99"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-white dark:bg-zinc-800 text-rose-600 dark:text-rose-400 hover:border-rose-400 border border-rose-200 dark:border-rose-900"
            }`}
          >
            ID: 99 (404)
          </button>
        </div>
      </div>

      {/* Next.js 16 Async Engine Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Step 1: Input URL Param */}
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white">
            <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px]">1</span>
            <span>URL Dynamic Segment</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Folder <code>[id]</code> mendeteksi segmen string <code>&quot;{selectedId}&quot;</code> dari URL browser.
          </p>
        </div>

        {/* Step 2: Async Params Promise */}
        <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
            <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px]">2</span>
            <span>Next.js 16 Promise</span>
          </div>
          <div className="font-mono text-[11px] text-indigo-700 dark:text-indigo-300 bg-white dark:bg-zinc-900 p-1.5 rounded border border-indigo-200 dark:border-indigo-900/60">
            const &#123; id &#125; = await params;
          </div>
          <p className="text-[10px] text-indigo-800 dark:text-indigo-300">
            Ekstraksi asinkron sukses: <code>id = &quot;{selectedId}&quot;</code>
          </p>
        </div>

        {/* Step 3: Logic / Database Resolution */}
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-white">
            <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px]">3</span>
            <span>Resolusi Data</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            {isNotFound ? (
              <span className="text-rose-600 dark:text-rose-400 font-semibold">
                ID tidak ditemukan ➔ memanggil notFound()
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Data tugas #{selectedId} ditemukan di PostgreSQL
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Rendered Live Preview Card (UI Morphing) */}
      <div className="space-y-2 pt-1">
        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
          <FileCode className="w-3.5 h-3.5 text-indigo-500" />
          Pratinjau Hasil Render Komponen (src/app/(dashboard)/tasks/[id]/page.tsx):
        </span>

        <AnimatePresence mode="wait">
          {isNotFound ? (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 rounded-xl border-2 border-dashed border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-center space-y-2"
            >
              <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-sm md:text-base text-rose-900 dark:text-rose-200">
                404: Tugas Tidak Ditemukan!
              </h5>
              <p className="text-xs text-rose-700 dark:text-rose-400 max-w-md mx-auto">
                Fungsi <code>notFound()</code> otomatis me-render berkas fallback <code>not-found.tsx</code> karena ID {selectedId} tidak ada di database.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-xs">
                      ID Tugas: #{task.id}
                    </Badge>
                    <Badge className={task.status === "Selesai" ? "bg-emerald-600" : "bg-blue-600"}>
                      {task.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-zinc-900 dark:text-white mt-1">
                    {task.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-1 space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
                  <p className="leading-relaxed">{task.desc}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500">
                    <span>Reward: +{task.xp} XP</span>
                    <span>Author: {task.author}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
