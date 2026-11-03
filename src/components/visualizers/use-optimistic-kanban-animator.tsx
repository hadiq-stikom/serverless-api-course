"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Zap, Clock, CheckCircle2, Globe, RotateCcw, Sliders, Hand, Move, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  status: "todo" | "done";
}

export function UseOptimisticKanbanAnimator() {
  const [serverTasks, setServerTasks] = useState<Task[]>([
    { id: "task-1", title: "Validasi Form dengan Zod", status: "todo" },
    { id: "task-2", title: "Setup Database Supabase", status: "done" },
  ]);

  const [optimisticStatus, setOptimisticStatus] = useState<"todo" | "done">("todo");
  const [isPending, setIsPending] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number>(1200);
  const [hoverCol, setHoverCol] = useState<"todo" | "done" | null>(null);
  const [traceLogs, setTraceLogs] = useState<string[]>([
    "React 19 useOptimistic: Siap.",
    "🖐️ Tarik (drag) kartu ini dan lepaskan di kolom 'Done' untuk merasakan latensi 0ms!",
  ]);

  const todoRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const getClientCoords = (event: any, info: { point: { x: number; y: number } }) => {
    const scrollX = typeof window !== "undefined" ? window.scrollX || window.pageXOffset || 0 : 0;
    const scrollY = typeof window !== "undefined" ? window.scrollY || window.pageYOffset || 0 : 0;
    const clientX = event?.clientX ?? (info.point.x - scrollX);
    const clientY = event?.clientY ?? (info.point.y - scrollY);
    return { clientX, clientY };
  };

  const handleDrag = (event: any, info: { point: { x: number; y: number }; offset: { x: number; y: number } }) => {
    const { clientX } = getClientCoords(event, info);

    if (doneRef.current && todoRef.current) {
      const doneRect = doneRef.current.getBoundingClientRect();
      const todoRect = todoRef.current.getBoundingClientRect();

      if (clientX >= doneRect.left - 20 || info.offset.x > 40) {
        setHoverCol("done");
      } else if (clientX <= todoRect.right + 20 || info.offset.x < -40) {
        setHoverCol("todo");
      } else {
        setHoverCol(null);
      }
    }
  };

  const handleDragEndCard = (event: any, info: { point: { x: number; y: number }; offset: { x: number; y: number } }) => {
    const { clientX, clientY } = getClientCoords(event, info);

    if (doneRef.current && todoRef.current) {
      const doneRect = doneRef.current.getBoundingClientRect();
      const todoRect = todoRef.current.getBoundingClientRect();

      // Toleransi deteksi sangat ramah: offset pergeseran horizontal ATAU koordinat kursor di atas kolom
      const inDoneArea =
        info.offset.x > 50 ||
        (clientX >= doneRect.left - 30 &&
          clientX <= doneRect.right + 30 &&
          clientY >= doneRect.top - 50 &&
          clientY <= doneRect.bottom + 50);

      const inTodoArea =
        info.offset.x < -50 ||
        (clientX >= todoRect.left - 30 &&
          clientX <= todoRect.right + 30 &&
          clientY >= todoRect.top - 50 &&
          clientY <= todoRect.bottom + 50);

      if (optimisticStatus === "todo" && inDoneArea) {
        triggerOptimisticMove("done");
      } else if (optimisticStatus === "done" && inTodoArea) {
        triggerOptimisticMove("todo");
      }
    }

    setHoverCol(null);
  };

  const triggerOptimisticMove = (nextStatus: "todo" | "done") => {
    if (isPending) return;

    // 1. Spekulatif 0ms Update Instan
    setOptimisticStatus(nextStatus);
    setIsPending(true);
    setTraceLogs((prev) => [
      `[0ms] Klien langsung render di "${nextStatus}" via useOptimistic (0ms Latency Feedback)`,
      `[+30ms] Server Action dipicu di background (Latensi server simulasi: ${latencyMs}ms)...`,
      ...prev.slice(0, 3),
    ]);

    // 2. Simulasi server delay
    setTimeout(() => {
      setServerTasks((prev) =>
        prev.map((t) => (t.id === "task-1" ? { ...t, status: nextStatus } : t))
      );
      setIsPending(false);
      setTraceLogs((prev) => [
        `[+${latencyMs}ms] Server Response 200 OK! Database ter-update ke "${nextStatus}". Sesi tuntas.`,
        ...prev.slice(0, 3),
      ]);
    }, latencyMs);
  };

  const handleReset = () => {
    setOptimisticStatus("todo");
    setIsPending(false);
    setHoverCol(null);
    setTraceLogs(["Simulator di-reset. Tarik kartu dari Todo ke Done!"]);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-xs font-semibold">
              Pilar 3.1: React 19 useOptimistic
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Direct Drag • 0ms Latency Feedback
            </span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Optimistic UI: Drag Kartu Langsung untuk Merasakan Latensi 0ms
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 flex items-center gap-1.5 py-1">
            <Hand className="w-3.5 h-3.5" /> Drag Kartu Langsung
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Posisi
          </Button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Stage: 2 Columns Comparison */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Column: Todo */}
            <div
              ref={todoRef}
              onClick={() => optimisticStatus === "done" && !isPending && triggerOptimisticMove("todo")}
              className={`p-4 rounded-xl border transition-all duration-200 min-h-[170px] flex flex-col justify-between ${
                hoverCol === "todo"
                  ? "border-purple-500 bg-purple-50/80 dark:bg-purple-950/60 ring-2 ring-purple-400/40 shadow-md"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/50"
              }`}
            >
              <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 pb-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <span>Kolom: Todo</span>
                {optimisticStatus === "todo" && (
                  <Badge variant="outline" className="text-[10px] font-mono">Active</Badge>
                )}
              </div>
              <div className="pt-3 min-h-[95px] flex items-center justify-center">
                {optimisticStatus === "todo" ? (
                  <motion.div
                    layout
                    drag
                    dragSnapToOrigin
                    whileHover={{ scale: 1.02, cursor: "grab" }}
                    whileDrag={{ scale: 1.06, rotate: 2, zIndex: 50, cursor: "grabbing" }}
                    onDrag={handleDrag}
                    onDragEnd={handleDragEndCard}
                    className={`p-3.5 rounded-lg border w-full text-xs font-semibold shadow-sm select-none transition-all ${
                      isPending
                        ? "border-purple-400 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 ring-2 ring-purple-400/30"
                        : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Task #1: Validasi Zod</span>
                      <Move className="w-3.5 h-3.5 opacity-40 shrink-0" />
                    </div>
                    <div className="mt-2 text-[10px] text-zinc-400 font-mono">
                      🖐️ Tarik kartu ini ke kolom Done ➔
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-[11px] text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-3 w-full text-center hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                    Drop kartu ke sini (atau klik untuk pindah)
                  </div>
                )}
              </div>
            </div>

            {/* Column: Done */}
            <div
              ref={doneRef}
              onClick={() => optimisticStatus === "todo" && !isPending && triggerOptimisticMove("done")}
              className={`p-4 rounded-xl border transition-all duration-200 min-h-[170px] flex flex-col justify-between ${
                hoverCol === "done"
                  ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 ring-2 ring-emerald-400/40 shadow-md"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/50"
              }`}
            >
              <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 pb-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <span>Kolom: Done</span>
                {optimisticStatus === "done" && (
                  <Badge variant="outline" className="text-[10px] font-mono">Active</Badge>
                )}
              </div>
              <div className="pt-3 min-h-[95px] flex items-center justify-center">
                {optimisticStatus === "done" ? (
                  <motion.div
                    layout
                    drag
                    dragSnapToOrigin
                    whileHover={{ scale: 1.02, cursor: "grab" }}
                    whileDrag={{ scale: 1.06, rotate: -2, zIndex: 50, cursor: "grabbing" }}
                    onDrag={handleDrag}
                    onDragEnd={handleDragEndCard}
                    className={`p-3.5 rounded-lg border w-full text-xs font-semibold shadow-sm select-none transition-all ${
                      isPending
                        ? "border-purple-400 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 ring-2 ring-purple-400/30"
                        : "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={!isPending ? "line-through opacity-80" : ""}>
                        Task #1: Validasi Zod
                      </span>
                      {isPending ? (
                        <span className="flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-400 font-mono animate-pulse">
                          <Clock className="w-3 h-3 animate-spin" /> 0ms Spekulatif
                        </span>
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                    <div className="mt-2 text-[10px] text-zinc-400 font-mono">
                      {isPending ? "⏳ Menyimpan ke server..." : "🖐️ Tarik kembali ke Todo ➔"}
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-[11px] text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-3 w-full text-center hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors cursor-pointer">
                    Drop kartu ke sini (atau klik untuk pindah)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Latency Slider & Quick Action Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 shrink-0">
              <Sliders className="w-4 h-4 text-purple-500" />
              <span>Latensi Jaringan:</span>
            </div>
            <input
              type="range"
              min="200"
              max="3000"
              step="200"
              value={latencyMs}
              onChange={(e) => setLatencyMs(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 shrink-0">
              {latencyMs}ms
            </span>
            <Button
              size="sm"
              disabled={isPending}
              onClick={() => triggerOptimisticMove(optimisticStatus === "todo" ? "done" : "todo")}
              className="text-xs h-7 bg-purple-600 hover:bg-purple-700 text-white shrink-0 ml-auto"
            >
              <Zap className="w-3 h-3 mr-1" /> Pindah ke {optimisticStatus === "todo" ? "Done" : "Todo"}
            </Button>
          </div>
        </div>

        {/* Right Stage: Real-Time Lifecycle Trace */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 space-y-3">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-purple-500" /> Alur Data Klien vs Server DB
            </span>

            <div className="p-3 rounded-lg bg-zinc-950 text-purple-300 font-mono text-[11px] border border-zinc-800 min-h-[140px] space-y-1.5">
              {traceLogs.map((log, i) => (
                <div key={i} className={i === 0 ? "text-purple-400 font-bold" : "text-zinc-400 text-[10px]"}>
                  &gt; {log}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 space-y-1">
              <div className="font-semibold text-zinc-700 dark:text-zinc-300">Sensasi 0ms Latensi:</div>
              <p>
                Saat Anda melepaskan kartu di kolom target, kartu tidak pernah &quot;membeku&quot; menunggu respons jaringan {latencyMs}ms. Perubahan status langsung diterapkan secara optimistik!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
