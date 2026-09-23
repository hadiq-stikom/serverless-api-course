"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  RotateCcw, 
  Laptop, 
  Server 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function UseOptimisticAnimator() {
  const [mode, setMode] = useState<"optimistic" | "standard">("optimistic");
  const [tasks, setTasks] = useState<{ id: string; text: string; isPending?: boolean }[]>([
    { id: "1", text: "Integrasi Supabase SSR" },
    { id: "2", text: "Setup Middleware Auth" }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddTask = () => {
    const newId = String(Date.now());
    const newText = `Tugas Baru #${tasks.length + 1}`;

    if (mode === "optimistic") {
      // ⚡ Optimistic: Tampilkan langsung di layar (0ms)!
      setTasks((prev) => [...prev, { id: newId, text: newText, isPending: true }]);
      setIsProcessing(true);

      setTimeout(() => {
        // Server confirms after 1500ms
        setTasks((prev) =>
          prev.map((t) => (t.id === newId ? { ...t, isPending: false } : t))
        );
        setIsProcessing(false);
      }, 1500);
    } else {
      // Standard: Tunggu server selesai dulu (1500ms delay)
      setIsProcessing(true);
      setTimeout(() => {
        setTasks((prev) => [...prev, { id: newId, text: newText, isPending: false }]);
        setIsProcessing(false);
      }, 1500);
    }
  };

  const handleReset = () => {
    setTasks([
      { id: "1", text: "Integrasi Supabase SSR" },
      { id: "2", text: "Setup Middleware Auth" }
    ]);
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Zap className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator UI Optimistik: useOptimistic Hook (React 19)
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Bandingkan kepuasan pengguna saat UI merespons instan (0ms) vs menunggu latensi jaringan server (~1500ms).
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode("optimistic")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === "optimistic" ? "bg-emerald-600 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Optimistic (0ms)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("standard")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === "standard" ? "bg-amber-600 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Standard (1500ms)</span>
          </button>
        </div>
      </div>

      {/* Simulator Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Action Control */}
        <div className="lg:col-span-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
            <span>Kontrol Simulasi Mutasi</span>
            <Badge className={mode === "optimistic" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}>
              {mode === "optimistic" ? "Persepsi Instan" : "Menunggu Server"}
            </Badge>
          </div>

          <div className="space-y-2 pt-1 font-sans">
            <Button
              onClick={handleAddTask}
              disabled={isProcessing}
              className={`w-full text-xs font-bold gap-2 ${
                mode === "optimistic"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{isProcessing ? "Menyimpan ke Server..." : "Tambah Tugas Baru"}</span>
            </Button>

            {tasks.length > 2 && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full text-xs h-7 text-zinc-400 hover:text-white"
              >
                <RotateCcw className="w-3 h-3 mr-1" /> Reset Daftar
              </Button>
            )}
          </div>

          <p className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-800 font-sans">
            {mode === "optimistic"
              ? "⚡ Pada mode optimistik, item langsung muncul di daftar dalam 0 milidetik dengan badge 'Menyimpan...'. Saat server selesai merespons, badge otomatis hilang!"
              : "⏳ Pada mode standar, pengguna tidak melihat perubahan apa pun di layar selama 1,5 detik hingga server selesai memproses query."}
          </p>
        </div>

        {/* Right: Live List Preview */}
        <div className="lg:col-span-7 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span>Daftar Tugas Pengguna (Rendered View)</span>
            <span className="text-[10px] text-zinc-400 font-mono">Total: {tasks.length} item</span>
          </div>

          <div className="space-y-1.5">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-all ${
                    task.isPending
                      ? "bg-amber-50/70 dark:bg-amber-950/30 border-dashed border-amber-400 dark:border-amber-700 text-amber-900 dark:text-amber-200"
                      : "bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/60 text-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${task.isPending ? "bg-amber-500 animate-ping" : "bg-emerald-500"}`} />
                    <span className="font-medium">{task.text}</span>
                  </div>

                  <Badge variant="outline" className={`text-[9px] ${
                    task.isPending ? "border-amber-400 text-amber-600 dark:text-amber-400" : "border-emerald-400 text-emerald-600 dark:text-emerald-400"
                  }`}>
                    {task.isPending ? "⏳ Menyimpan..." : "✅ Tersimpan di DB"}
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <span>Kenyamanan UX meningkat drastis dengan hook <code>useOptimistic</code>.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
