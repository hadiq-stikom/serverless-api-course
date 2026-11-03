"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { RotateCcw, CheckCircle2, Sparkles, Move, Hand } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface KanbanCard {
  id: string;
  title: string;
  tag: string;
}

type ColumnKey = "todo" | "in_progress" | "done";

const INITIAL_BOARD: Record<ColumnKey, KanbanCard[]> = {
  todo: [
    { id: "task-1", title: "Setup Database Supabase", tag: "DB" },
    { id: "task-2", title: "Validasi Skema Zod SafeParse", tag: "Validation" },
  ],
  in_progress: [
    { id: "task-3", title: "Implementasi DndContext & Sensor", tag: "UI/UX" },
  ],
  done: [
    { id: "task-4", title: "Proteksi Rute Proxy Next.js 16", tag: "Security" },
  ],
};

export function MultiContainerKanbanAnimator() {
  const [board, setBoard] = useState<Record<ColumnKey, KanbanCard[]>>(INITIAL_BOARD);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<ColumnKey | null>(null);
  const [stepLog, setStepLog] = useState<string>(
    "🖐️ Coba drag & drop kartu di bawah ini secara langsung menggunakan mouse atau jari Anda!"
  );

  const colRefs = {
    todo: useRef<HTMLDivElement>(null),
    in_progress: useRef<HTMLDivElement>(null),
    done: useRef<HTMLDivElement>(null),
  };

  const getTargetColumn = (event: any, info: { point: { x: number; y: number } }): ColumnKey | null => {
    const scrollX = typeof window !== "undefined" ? window.scrollX || window.pageXOffset || 0 : 0;
    const scrollY = typeof window !== "undefined" ? window.scrollY || window.pageYOffset || 0 : 0;
    const clientX = event?.clientX ?? (info.point.x - scrollX);
    const clientY = event?.clientY ?? (info.point.y - scrollY);

    for (const [colKey, ref] of Object.entries(colRefs)) {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        // Generous hit-box tolerance (with 25px horizontal and 40px vertical margin)
        if (
          clientX >= rect.left - 25 &&
          clientX <= rect.right + 25 &&
          clientY >= rect.top - 40 &&
          clientY <= rect.bottom + 40
        ) {
          return colKey as ColumnKey;
        }
      }
    }
    return null;
  };

  const handleDragStart = (card: KanbanCard, fromCol: ColumnKey) => {
    setActiveCardId(card.id);
    setDragOverCol(fromCol);
    setStepLog(`[onDragStart] Mengangkat kartu "${card.title}" dari kolom "${fromCol}".`);
  };

  const handleDrag = (event: any, info: { point: { x: number; y: number } }) => {
    const target = getTargetColumn(event, info);
    if (target && target !== dragOverCol) {
      setDragOverCol(target);
      setStepLog(`[onDragOver] Kartu melayang di atas kolom target "${target}". Kontainer sementara di-update.`);
    }
  };

  const handleDragEnd = (
    card: KanbanCard,
    fromCol: ColumnKey,
    event: any,
    info: { point: { x: number; y: number } }
  ) => {
    const targetCol = getTargetColumn(event, info);

    if (targetCol && targetCol !== fromCol) {
      setBoard((prev) => {
        const newFrom = prev[fromCol].filter((c) => c.id !== card.id);
        const newTo = [card, ...prev[targetCol]];
        return { ...prev, [fromCol]: newFrom, [targetCol]: newTo };
      });
      setStepLog(
        `[onDragEnd] Sukses! Kartu "${card.title}" dipindahkan dari "${fromCol}" ke "${targetCol}". Stored Procedure RPC dipicu.`
      );
    } else {
      setStepLog(`[onDragEnd] Kartu dikembalikan ke kolom asal "${fromCol}".`);
    }

    setActiveCardId(null);
    setDragOverCol(null);
  };

  const handleMoveDirect = (card: KanbanCard, fromCol: ColumnKey, toCol: ColumnKey) => {
    setBoard((prev) => {
      const newFrom = prev[fromCol].filter((c) => c.id !== card.id);
      const newTo = [card, ...prev[toCol]];
      return { ...prev, [fromCol]: newFrom, [toCol]: newTo };
    });
    setStepLog(`Kartu "${card.title}" dipindahkan ke "${toCol}".`);
  };

  const handleReset = () => {
    setBoard(INITIAL_BOARD);
    setActiveCardId(null);
    setDragOverCol(null);
    setStepLog("Board di-reset ke kondisi awal.");
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-xs font-semibold">
              Pilar 2.3: Multi-Container Kanban
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Direct Drag & Drop • onDragOver vs onDragEnd
            </span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Multi-Kolom Kanban: Drag & Drop Kartu Antar-Kolom Secara Langsung
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 py-1">
            <Hand className="w-3.5 h-3.5" /> Drag Kartu Langsung
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Board
          </Button>
        </div>
      </div>

      {/* Main Interactive Stage: 3 Drag & Drop Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column: Todo */}
        <div
          ref={colRefs.todo}
          className={`p-4 rounded-xl border transition-all duration-200 min-h-[220px] flex flex-col ${
            dragOverCol === "todo"
              ? "border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/50 ring-2 ring-indigo-400/30 shadow-md"
              : "border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/50"
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Todo</span>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">{board.todo.length} Item</Badge>
          </div>

          <div className="pt-3 space-y-2.5 flex-1">
            {board.todo.map((card) => (
              <motion.div
                key={card.id}
                layout
                drag
                dragSnapToOrigin
                whileHover={{ scale: 1.02, cursor: "grab" }}
                whileDrag={{ scale: 1.05, rotate: 2, zIndex: 50, cursor: "grabbing" }}
                onDragStart={() => handleDragStart(card, "todo")}
                onDrag={handleDrag}
                onDragEnd={(e, info) => handleDragEnd(card, "todo", e, info)}
                className={`p-3 rounded-lg border shadow-sm select-none transition-colors ${
                  activeCardId === card.id
                    ? "border-indigo-500 bg-indigo-600 text-white shadow-xl ring-2 ring-indigo-300"
                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{card.title}</span>
                  <Move className="w-3.5 h-3.5 opacity-40 shrink-0 ml-1.5" />
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400">
                  <Badge variant="outline" className="text-[9px] py-0 px-1.5">{card.tag}</Badge>
                  <span className="font-mono">Tarik ke kanan ➔</span>
                </div>
              </motion.div>
            ))}

            {board.todo.length === 0 && (
              <div className="p-6 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 text-center text-[11px] text-zinc-400 font-mono h-full flex flex-col items-center justify-center">
                <span>useDroppable(&apos;todo&apos;)</span>
                <span className="text-[10px] mt-1 text-zinc-500">Drop kartu ke sini</span>
              </div>
            )}
          </div>
        </div>

        {/* Column: In Progress */}
        <div
          ref={colRefs.in_progress}
          className={`p-4 rounded-xl border transition-all duration-200 min-h-[220px] flex flex-col ${
            dragOverCol === "in_progress"
              ? "border-amber-500 bg-amber-50/70 dark:bg-amber-950/50 ring-2 ring-amber-400/30 shadow-md"
              : "border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/50"
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">In Progress</span>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">{board.in_progress.length} Item</Badge>
          </div>

          <div className="pt-3 space-y-2.5 flex-1">
            {board.in_progress.map((card) => (
              <motion.div
                key={card.id}
                layout
                drag
                dragSnapToOrigin
                whileHover={{ scale: 1.02, cursor: "grab" }}
                whileDrag={{ scale: 1.05, rotate: 2, zIndex: 50, cursor: "grabbing" }}
                onDragStart={() => handleDragStart(card, "in_progress")}
                onDrag={handleDrag}
                onDragEnd={(e, info) => handleDragEnd(card, "in_progress", e, info)}
                className={`p-3 rounded-lg border shadow-sm select-none transition-colors ${
                  activeCardId === card.id
                    ? "border-amber-500 bg-amber-600 text-white shadow-xl ring-2 ring-amber-300"
                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{card.title}</span>
                  <Move className="w-3.5 h-3.5 opacity-40 shrink-0 ml-1.5" />
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400">
                  <Badge variant="outline" className="text-[9px] py-0 px-1.5">{card.tag}</Badge>
                  <span className="font-mono">Tarik antar kolom ➔</span>
                </div>
              </motion.div>
            ))}

            {board.in_progress.length === 0 && (
              <div className="p-6 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 text-center text-[11px] text-zinc-400 font-mono h-full flex flex-col items-center justify-center">
                <span>useDroppable(&apos;in_progress&apos;)</span>
                <span className="text-[10px] mt-1 text-zinc-500">Drop kartu ke sini</span>
              </div>
            )}
          </div>
        </div>

        {/* Column: Done */}
        <div
          ref={colRefs.done}
          className={`p-4 rounded-xl border transition-all duration-200 min-h-[220px] flex flex-col ${
            dragOverCol === "done"
              ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 ring-2 ring-emerald-400/30 shadow-md"
              : "border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/50"
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Done</span>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">{board.done.length} Item</Badge>
          </div>

          <div className="pt-3 space-y-2.5 flex-1">
            {board.done.map((card) => (
              <motion.div
                key={card.id}
                layout
                drag
                dragSnapToOrigin
                whileHover={{ scale: 1.02, cursor: "grab" }}
                whileDrag={{ scale: 1.05, rotate: 2, zIndex: 50, cursor: "grabbing" }}
                onDragStart={() => handleDragStart(card, "done")}
                onDrag={handleDrag}
                onDragEnd={(e, info) => handleDragEnd(card, "done", e, info)}
                className={`p-3 rounded-lg border shadow-sm select-none transition-colors ${
                  activeCardId === card.id
                    ? "border-emerald-500 bg-emerald-600 text-white shadow-xl ring-2 ring-emerald-300"
                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold line-through text-zinc-400 dark:text-zinc-500">
                    {card.title}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1.5" />
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400">
                  <Badge variant="outline" className="text-[9px] py-0 px-1.5">{card.tag}</Badge>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">Selesai ✅</span>
                </div>
              </motion.div>
            ))}

            {board.done.length === 0 && (
              <div className="p-6 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 text-center text-[11px] text-zinc-400 font-mono h-full flex flex-col items-center justify-center">
                <span>useDroppable(&apos;done&apos;)</span>
                <span className="text-[10px] mt-1 text-zinc-500">Drop kartu ke sini</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" /> Log Interaksi Pointer/Touch:
          </div>
          <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
            &gt; {stepLog}
          </div>
        </div>
        <div className="text-[11px] text-zinc-500 sm:text-right">
          Setiap kolom membungkus target <code>useDroppable</code> mandiri sehingga kartu dapat dijatuhkan meskipun kolom sedang kosong.
        </div>
      </div>
    </div>
  );
}
