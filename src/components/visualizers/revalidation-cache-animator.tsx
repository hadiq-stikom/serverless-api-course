"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RefreshCw, 
  Database, 
  Server, 
  Laptop, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Trash2 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function RevalidationCacheAnimator() {
  const [tasks, setTasks] = useState(["Tugas #1: Setup Supabase", "Tugas #2: Integrasi Shadcn"]);
  const [cacheStatus, setCacheStatus] = useState<"cached" | "purging" | "revalidated">("cached");
  const [isMutating, setIsMutating] = useState(false);

  const handleMutateAndRevalidate = () => {
    setIsMutating(true);
    setCacheStatus("purging");

    setTimeout(() => {
      // Step 2: Add task and revalidate
      const newTask = `Tugas #${tasks.length + 1}: Fitur Baru Server Action`;
      setTasks((prev) => [...prev, newTask]);
      setCacheStatus("revalidated");
      setIsMutating(false);
    }, 1200);
  };

  const handleReset = () => {
    setTasks(["Tugas #1: Setup Supabase", "Tugas #2: Integrasi Shadcn"]);
    setCacheStatus("cached");
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <RefreshCw className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator Revalidasi Cache Server (revalidatePath &amp; revalidateTag)
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Uji bagaimana Server Action memicu penghapusan cache server seketika untuk pembaruan data real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tasks.length > 2 && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="text-xs h-8"
            >
              Reset Data
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleMutateAndRevalidate}
            disabled={isMutating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isMutating ? "Memproses Revalidasi..." : "Mutasi & revalidatePath()"}</span>
          </Button>
        </div>
      </div>

      {/* Cache Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Server Cache Layer */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
            <span className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              Server Data Cache Layer
            </span>
            <Badge className={
              cacheStatus === "cached" ? "bg-emerald-500/20 text-emerald-300" :
              cacheStatus === "purging" ? "bg-amber-500/20 text-amber-300 animate-pulse" : "bg-cyan-500/20 text-cyan-300"
            }>
              {cacheStatus === "cached" ? "HIT: Cached /tasks" : cacheStatus === "purging" ? "PURGING CACHE..." : "REVALIDATED: Fresh"}
            </Badge>
          </div>

          <pre className="text-[11px] leading-relaxed">
{`// src/actions/tasks.ts
import { revalidatePath } from "next/navigation";

export async function addTask(formData: FormData) {
  "use server";
  await db.tasks.create({ ... });

  // ⚡ Hapus cache halaman '/tasks' secara on-demand:
  revalidatePath("/tasks"); 
}`}
          </pre>

          <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
            <div className="flex items-center justify-between text-zinc-300">
              <span>Status Cache Server:</span>
              <span className="font-bold text-indigo-400">
                {cacheStatus === "cached" ? "Statis di Server (0 ms DB query)" : cacheStatus === "purging" ? "Membersihkan Stale HTML..." : "Membuat HTML Segar"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Client UI Sync */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-indigo-500" />
              Tampilan UI Pengguna (Soft Navigation)
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">Live Sync</span>
          </div>

          {/* Real-time Task List */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Daftar Tugas Ter-render di Browser:
            </div>
            <div className="space-y-1.5">
              <AnimatePresence>
                {tasks.map((t, idx) => (
                  <motion.div
                    key={t}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">{t}</span>
                    <Badge variant="outline" className="text-[9px] text-emerald-600 dark:text-emerald-400">
                      Sync OK
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <span>Tidak perlu <code>window.location.reload()</code>! Next.js memperbarui UI secara mulus.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
