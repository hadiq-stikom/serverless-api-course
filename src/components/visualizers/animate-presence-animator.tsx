"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Trash2, ShieldCheck, XCircle, AlertCircle, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MockTask {
  id: string;
  title: string;
  category: string;
}

const INITIAL_TASKS: MockTask[] = [
  { id: "task-1", title: "Rancang ERD Database PostgreSQL", category: "Database" },
  { id: "task-2", title: "Integrasi Supabase Auth & Proxy Session", category: "Security" },
  { id: "task-3", title: "Bangun REST API Route Handlers", category: "API" },
];

export function AnimatePresenceAnimator() {
  const [tasks, setTasks] = useState<MockTask[]>(INITIAL_TASKS);
  const [presenceMode, setPresenceMode] = useState<"popLayout" | "sync" | "wait">("popLayout");
  const [usePresence, setUsePresence] = useState(true);

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const resetTasks = () => {
    setTasks(INITIAL_TASKS);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 text-xs font-semibold">
              Pilar 3.1: Siklus Unmounting
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">&lt;AnimatePresence exit=&#123;...&#125;&gt;</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Pencegatan Unmount DOM dengan AnimatePresence
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setUsePresence(!usePresence)}
            className={`text-xs font-bold ${
              usePresence
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-red-500 text-red-600 dark:text-red-400"
            }`}
          >
            {usePresence ? "✅ AnimatePresence: AKTIF" : "❌ AnimatePresence: MATI (React Default)"}
          </Button>
          <Button size="sm" onClick={resetTasks} variant="secondary" className="text-xs gap-1">
            <Plus className="w-3.5 h-3.5" /> Reset Daftar
          </Button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-zinc-500">Mode Eksekusi:</span>
        {(["popLayout", "sync", "wait"] as const).map((m) => (
          <button
            key={m}
            disabled={!usePresence}
            onClick={() => setPresenceMode(m)}
            className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-all ${
              presenceMode === m && usePresence
                ? "bg-rose-500 text-white font-bold"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            mode="{m}"
          </button>
        ))}
      </div>

      {/* Task List Arena */}
      <div className="p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/40 min-h-[220px]">
        {tasks.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-center space-y-2">
            <p className="text-sm text-zinc-500">Seluruh tugas telah dihapus dari DOM.</p>
            <Button size="sm" onClick={resetTasks} className="text-xs">
              Kembalikan Tugas Uji Coba
            </Button>
          </div>
        ) : usePresence ? (
          <AnimatePresence mode={presenceMode}>
            <div className="space-y-2.5">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.85,
                    x: -50,
                    transition: { duration: 0.28, ease: "easeInOut" },
                  }}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono text-rose-500 uppercase font-bold tracking-wider">
                      {task.category}
                    </span>
                    <h5 className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5">
                      {task.title}
                    </h5>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Hapus
                  </Button>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        ) : (
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">
                    {task.category}
                  </span>
                  <h5 className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5">
                    {task.title}
                  </h5>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-600 text-xs gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Hapus (Instan 0ms)
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Educational Banner */}
      <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
        usePresence
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
          : "border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-300"
      }`}>
        {usePresence ? (
          <>
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong>Dengan AnimatePresence:</strong> Saat tombol hapus diklik, elemen tidak langsung lenyap dari DOM. <code>AnimatePresence</code> menahannya selama 280 milidetik, memainkan animasi <code>exit</code> (slide ke kiri &amp; fade-out), lalu secara anggun mencabut node DOM. Elemen di bawahnya bergeser mulus via <code>layout</code>.
            </div>
          </>
        ) : (
          <>
            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <strong>Tanpa AnimatePresence (React Bawaan):</strong> React langsung mencabut elemen dari DOM dalam 0 milidetik. Animasi CSS atau Framer Motion exit tidak pernah sempat dieksekusi, menghasilkan lompatan antarmuka yang kasar dan patah (*harsh visual jarring*).
            </div>
          </>
        )}
      </div>
    </div>
  );
}
