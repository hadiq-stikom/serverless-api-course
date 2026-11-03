"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Crosshair, RotateCcw, Activity, CheckCircle2, Hand, Move } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DndContextLifecycleAnimator() {
  const [algorithm, setAlgorithm] = useState<"closestCorners" | "rectIntersection">("closestCorners");
  const [currentColumn, setCurrentColumn] = useState<"A" | "B">("A");
  const [isDragging, setIsDragging] = useState(false);
  const [hoverColumn, setHoverColumn] = useState<"A" | "B" | null>(null);
  const [euclideanDistA, setEuclideanDistA] = useState<number>(0);
  const [euclideanDistB, setEuclideanDistB] = useState<number>(180);
  const [logs, setLogs] = useState<string[]>([
    "DndContext: Siap menerima event interaksi",
    "🖐️ Tarik (drag) kartu di bawah langsung dengan mouse/touch melintasi Kolom A dan B!",
  ]);

  const colARef = useRef<HTMLDivElement>(null);
  const colBRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs((prev) => [msg, ...prev.slice(0, 4)]);
  };

  const getClientCoords = (event: any, info: { point: { x: number; y: number } }) => {
    const scrollX = typeof window !== "undefined" ? window.scrollX || window.pageXOffset || 0 : 0;
    const scrollY = typeof window !== "undefined" ? window.scrollY || window.pageYOffset || 0 : 0;
    const clientX = event?.clientX ?? (info.point.x - scrollX);
    const clientY = event?.clientY ?? (info.point.y - scrollY);
    return { clientX, clientY };
  };

  const calculateEuclidean = (clientX: number, clientY: number, rect: DOMRect) => {
    // 4 corners of target column in viewport coordinates
    const corners = [
      { x: rect.left, y: rect.top },
      { x: rect.right, y: rect.top },
      { x: rect.left, y: rect.bottom },
      { x: rect.right, y: rect.bottom },
    ];
    // Closest Euclidean distance
    const dists = corners.map((c) => Math.hypot(clientX - c.x, clientY - c.y));
    return Math.min(...dists);
  };

  const handleDragStart = () => {
    setIsDragging(true);
    addLog(`[1] onDragStart: activeId = "task-alpha", origin = "col-${currentColumn.toLowerCase()}"`);
  };

  const handleDrag = (event: any, info: { point: { x: number; y: number }; offset: { x: number; y: number } }) => {
    const { clientX, clientY } = getClientCoords(event, info);

    if (colARef.current && colBRef.current) {
      const rectA = colARef.current.getBoundingClientRect();
      const rectB = colBRef.current.getBoundingClientRect();

      const distA = calculateEuclidean(clientX, clientY, rectA);
      const distB = calculateEuclidean(clientX, clientY, rectB);
      setEuclideanDistA(Math.round(distA));
      setEuclideanDistB(Math.round(distB));

      let target: "A" | "B" | null = null;
      if (algorithm === "closestCorners") {
        target = distA < distB ? "A" : "B";
        setHoverColumn(target);
        addLog(`[2] onDragOver: overId = "col-${target.toLowerCase()}" (Euclidean dist: ${Math.round(Math.min(distA, distB))}px)`);
      } else {
        // rectIntersection with generous tolerance
        const inA = clientX >= rectA.left - 20 && clientX <= rectA.right + 20 && clientY >= rectA.top - 40 && clientY <= rectA.bottom + 40;
        const inB = clientX >= rectB.left - 20 && clientX <= rectB.right + 20 && clientY >= rectB.top - 40 && clientY <= rectB.bottom + 40;
        target = inA ? "A" : inB ? "B" : null;
        setHoverColumn(target);
        if (target) {
          addLog(`[2] onDragOver: overId = "col-${target.toLowerCase()}" (Kotak pembatas berpotongan)`);
        }
      }
    }
  };

  const handleDragEnd = (event: any, info: { point: { x: number; y: number }; offset: { x: number; y: number } }) => {
    setIsDragging(false);
    const { clientX, clientY } = getClientCoords(event, info);

    if (colARef.current && colBRef.current) {
      const rectA = colARef.current.getBoundingClientRect();
      const rectB = colBRef.current.getBoundingClientRect();

      const inB =
        info.offset.x > 50 ||
        (clientX >= rectB.left - 25 &&
          clientX <= rectB.right + 25 &&
          clientY >= rectB.top - 40 &&
          clientY <= rectB.bottom + 40);

      const inA =
        info.offset.x < -50 ||
        (clientX >= rectA.left - 25 &&
          clientX <= rectA.right + 25 &&
          clientY >= rectA.top - 40 &&
          clientY <= rectA.bottom + 40);

      if (inB && currentColumn !== "B") {
        setCurrentColumn("B");
        addLog(`[3] onDragEnd: Sukses dijatuhkan ke "col-b" (Target dikomit)`);
      } else if (inA && currentColumn !== "A") {
        setCurrentColumn("A");
        addLog(`[3] onDragEnd: Sukses dijatuhkan ke "col-a" (Target dikomit)`);
      } else {
        addLog(`[4] onDragEnd: Kartu dilepas ➔ kembali ke posisi "col-${currentColumn.toLowerCase()}"`);
      }
    }
    setHoverColumn(null);
  };

  const handleReset = () => {
    setCurrentColumn("A");
    setIsDragging(false);
    setHoverColumn(null);
    addLog("Simulator di-reset ke Kolom A.");
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-xs font-semibold">
              Pilar 1.1: DndContext & Collisions
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Direct Drag & Drop • closestCorners vs rectIntersection
            </span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi DndContext Lifecycle: Drag Kartu Langsung Antar-Kolom
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
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Posisi
          </Button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Stage: 2-Column Kanban Viewport */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/50 relative min-h-[240px]">
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Column A (To Do) */}
              <div
                ref={colARef}
                onClick={() => currentColumn === "B" && setCurrentColumn("A")}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  hoverColumn === "A"
                    ? "border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/60 ring-2 ring-indigo-400/40 shadow-md"
                    : "border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  <span>Kolom A: Todo</span>
                  <Badge variant="outline" className="text-[10px] font-mono">id: col-a</Badge>
                </div>
                <div className="pt-3 min-h-[130px] flex flex-col justify-center">
                  {currentColumn === "A" ? (
                    <motion.div
                      layout
                      drag
                      dragSnapToOrigin
                      whileHover={{ scale: 1.02, cursor: "grab" }}
                      whileDrag={{ scale: 1.06, rotate: 2, zIndex: 50, cursor: "grabbing" }}
                      onDragStart={handleDragStart}
                      onDrag={handleDrag}
                      onDragEnd={handleDragEnd}
                      className="w-full p-3.5 rounded-lg bg-indigo-600 text-white shadow-xl text-xs font-semibold select-none cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-center justify-between">
                        <span>Task #101: Integrasi DndContext</span>
                        <Move className="w-3.5 h-3.5 opacity-80" />
                      </div>
                      <span className="text-[10px] opacity-80 block mt-1.5 font-mono">
                        🖐️ Tarik kartu ini ke Kolom B ➔
                      </span>
                    </motion.div>
                  ) : (
                    <div className="text-[11px] text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-3 text-center cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                      Drop kartu ke sini (atau klik)
                    </div>
                  )}
                </div>
                {isDragging && (
                  <div className="text-[10px] text-zinc-500 font-mono text-center pt-2">
                    Jarak Euclidean: <strong className="text-indigo-600 dark:text-indigo-400">{euclideanDistA}px</strong>
                  </div>
                )}
              </div>

              {/* Column B (In Progress) */}
              <div
                ref={colBRef}
                onClick={() => currentColumn === "A" && setCurrentColumn("B")}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  hoverColumn === "B"
                    ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/60 ring-2 ring-emerald-400/40 shadow-md"
                    : "border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  <span>Kolom B: In Progress</span>
                  <Badge variant="outline" className="text-[10px] font-mono">id: col-b</Badge>
                </div>
                <div className="pt-3 min-h-[130px] flex flex-col justify-center">
                  {currentColumn === "B" ? (
                    <motion.div
                      layout
                      drag
                      dragSnapToOrigin
                      whileHover={{ scale: 1.02, cursor: "grab" }}
                      whileDrag={{ scale: 1.06, rotate: -2, zIndex: 50, cursor: "grabbing" }}
                      onDragStart={handleDragStart}
                      onDrag={handleDrag}
                      onDragEnd={handleDragEnd}
                      className="w-full p-3.5 rounded-lg bg-emerald-600 text-white shadow-xl text-xs font-semibold select-none cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-center justify-between">
                        <span>Task #101: Integrasi DndContext</span>
                        <CheckCircle2 className="w-3.5 h-3.5 opacity-80" />
                      </div>
                      <span className="text-[10px] opacity-80 block mt-1.5 font-mono">
                        🖐️ Tarik kembali ke Kolom A ➔
                      </span>
                    </motion.div>
                  ) : (
                    <div className="text-[11px] text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-3 text-center cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                      Drop kartu ke sini (atau klik)
                    </div>
                  )}
                </div>
                {isDragging && (
                  <div className="text-[10px] text-zinc-500 font-mono text-center pt-2">
                    Jarak Euclidean: <strong className="text-emerald-600 dark:text-emerald-400">{euclideanDistB}px</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Algorithm Switcher */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Algoritma:</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={algorithm === "closestCorners" ? "default" : "outline"}
                onClick={() => setAlgorithm("closestCorners")}
                className="text-xs h-8"
              >
                closestCorners (Rekomendasi Euclidean)
              </Button>
              <Button
                size="sm"
                variant={algorithm === "rectIntersection" ? "default" : "outline"}
                onClick={() => setAlgorithm("rectIntersection")}
                className="text-xs h-8"
              >
                rectIntersection
              </Button>
            </div>
          </div>
        </div>

        {/* Right Stage: Live Lifecycle Event Tracer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 space-y-3">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-500" /> DndContext Event Lifecycle Trace
            </span>

            <div className="space-y-1.5 font-mono text-[11px] bg-zinc-950 text-zinc-300 p-3 rounded-lg border border-zinc-800 min-h-[140px] overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className={i === 0 ? "text-indigo-400 font-bold" : "text-zinc-400 text-[10px]"}>
                  &gt; {log}
                </div>
              ))}
            </div>

            <div className="text-[11px] text-zinc-500 space-y-1 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                <span><strong>closestCorners:</strong> Mendeteksi target berdasarkan jarak terkecil ke 4 sudut.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                <span><strong>rectIntersection:</strong> Mengharuskan bounding box kartu menembus kontainer.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
