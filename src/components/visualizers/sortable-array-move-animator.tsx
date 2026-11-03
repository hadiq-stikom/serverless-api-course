"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, ArrowUp, ArrowDown, RotateCcw, Code2, Move, Hand } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TaskItem {
  id: string;
  title: string;
  color: string;
}

const INITIAL_TASKS: TaskItem[] = [
  { id: "task-a", title: "Task A: Setup Zod Validation", color: "from-blue-600 to-indigo-600" },
  { id: "task-b", title: "Task B: Supabase Auth Middleware", color: "from-purple-600 to-pink-600" },
  { id: "task-c", title: "Task C: DndContext Collision", color: "from-emerald-600 to-teal-600" },
  { id: "task-d", title: "Task D: Deploy ke Vercel Edge", color: "from-amber-600 to-orange-600" },
];

export function SortableArrayMoveAnimator() {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [history, setHistory] = useState<string>("🖐️ Coba drag kartu ke atas atau ke bawah secara langsung!");
  const [lastMove, setLastMove] = useState<{ from: number; to: number } | null>(null);

  // Pure arrayMove algorithm from @dnd-kit/sortable
  const arrayMove = <T,>(array: T[], from: number, to: number): T[] => {
    const newArray = array.slice();
    newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);
    return newArray;
  };

  const handleMove = (fromIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= tasks.length) return;

    const item = tasks[fromIndex];
    const newTasks = arrayMove(tasks, fromIndex, toIndex);
    setTasks(newTasks);
    setLastMove({ from: fromIndex, to: toIndex });
    setHistory(`arrayMove(items, ${fromIndex}, ${toIndex}) ➔ "${item.id}" dipindah dari index ${fromIndex} ke ${toIndex}`);
  };

  const handleDragEndItem = (fromIndex: number, _: any, info: { offset: { y: number } }) => {
    const threshold = 40; // px threshold for swap
    let targetIndex = fromIndex;

    if (info.offset.y > threshold && fromIndex < tasks.length - 1) {
      targetIndex = fromIndex + 1;
    } else if (info.offset.y < -threshold && fromIndex > 0) {
      targetIndex = fromIndex - 1;
    }

    if (targetIndex !== fromIndex) {
      const item = tasks[fromIndex];
      const newTasks = arrayMove(tasks, fromIndex, targetIndex);
      setTasks(newTasks);
      setLastMove({ from: fromIndex, to: targetIndex });
      setHistory(
        `[Direct Drag] arrayMove(items, ${fromIndex}, ${targetIndex}) ➔ "${item.id}" dipindahkan ke index ${targetIndex}`
      );
    }
  };

  const handleReset = () => {
    setTasks(INITIAL_TASKS);
    setLastMove(null);
    setHistory("Daftar di-reset ke urutan awal: [A, B, C, D]");
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
              Pilar 2.2: Sortable & arrayMove
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Direct Drag Vertikal • verticalListSortingStrategy
            </span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi SortableContext: Drag Vertikal Langsung & Eksekusi arrayMove
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 py-1">
            <Hand className="w-3.5 h-3.5" /> Drag Vertikal
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Urutan
          </Button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Stage: Sortable List Items */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-mono px-1">
            <span>Sortable List: Tarik kartu langsung ke atas/bawah</span>
            <span>Total: {tasks.length} Elemen</span>
          </div>

          <div className="space-y-2.5 p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/50">
            <AnimatePresence>
              {tasks.map((task, idx) => (
                <motion.div
                  key={task.id}
                  layout
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.25}
                  whileHover={{ scale: 1.015, cursor: "grab" }}
                  whileDrag={{ scale: 1.04, zIndex: 40, cursor: "grabbing", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
                  onDragEnd={(e, info) => handleDragEndItem(idx, e, info)}
                  className={`p-3.5 rounded-xl border shadow-sm flex items-center justify-between select-none transition-colors ${
                    lastMove && (lastMove.to === idx || lastMove.from === idx)
                      ? "border-emerald-500 bg-white dark:bg-zinc-900 ring-2 ring-emerald-400/20"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {idx}
                    </span>
                    <Move className="w-4 h-4 text-zinc-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {task.title}
                      </span>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        id: {task.id} • geser ke atas/bawah untuk menukar
                      </div>
                    </div>
                  </div>

                  {/* Optional Reorder Buttons for accessibility */}
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, "up")}
                      className="h-7 w-7 p-0 text-zinc-500 hover:text-emerald-600"
                      title="Geser ke Atas"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={idx === tasks.length - 1}
                      onClick={() => handleMove(idx, "down")}
                      className="h-7 w-7 p-0 text-zinc-500 hover:text-emerald-600"
                      title="Geser ke Bawah"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Stage: Array Mutator Inspector & Immutability Proof */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 space-y-3">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-emerald-500" /> Trace Eksekusi arrayMove
            </span>

            <div className="p-3 rounded-lg bg-zinc-950 text-emerald-400 font-mono text-[11px] border border-zinc-800 break-words space-y-2">
              <div className="text-zinc-400 text-[10px]">&gt; Status Terakhir:</div>
              <div>{history}</div>
              <div className="text-zinc-500 pt-1 border-t border-zinc-800 text-[10px]">
                Urutan ID: [{tasks.map((t) => `'${t.id}'`).join(", ")}]
              </div>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="font-bold text-zinc-700 dark:text-zinc-300">Mengapa arrayMove Wajib Imutabel?</div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Di React 19, mutasi array langsung (seperti <code>array.splice</code> pada state asli) tidak akan memicu re-render karena referensi memori tidak berubah. <code>arrayMove</code> membuat salinan baru (shallow copy) via <code>array.slice()</code> sehingga reaktivitas DOM terjamin 100%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
