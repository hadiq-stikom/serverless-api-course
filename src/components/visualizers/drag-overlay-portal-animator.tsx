"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Layers, AlertOctagon, CheckCircle2, ShieldCheck, Hand, Move, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DragOverlayPortalAnimator() {
  const [useOverlay, setUseOverlay] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleReset = () => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-xs font-semibold">
              Pilar 1.3: DragOverlay & React Portal
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Direct Drag • Z-Index & Overflow Clipping
            </span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi DragOverlay: Drag Kartu Keluar Batas Kontainer (Overflow: Hidden)
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800 flex items-center gap-1.5 py-1">
            <Hand className="w-3.5 h-3.5" /> Drag Kartu Langsung
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
          </Button>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={useOverlay ? "default" : "outline"}
          onClick={() => { setUseOverlay(true); handleReset(); }}
          className={`text-xs ${useOverlay ? "bg-cyan-600 hover:bg-cyan-700 text-white" : ""}`}
        >
          <ShieldCheck className="w-3.5 h-3.5 mr-1" /> ✅ Dengan DragOverlay (Portal document.body)
        </Button>
        <Button
          size="sm"
          variant={!useOverlay ? "destructive" : "outline"}
          onClick={() => { setUseOverlay(false); handleReset(); }}
          className="text-xs"
        >
          <AlertOctagon className="w-3.5 h-3.5 mr-1" /> ❌ Tanpa DragOverlay (Terpotong Overflow)
        </Button>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Stage: Container with overflow:hidden */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="text-xs font-mono text-zinc-500 flex items-center justify-between">
            <span>Kontainer Induk: <code>overflow: hidden; max-height: 220px</code></span>
            <Badge variant="outline" className="text-[10px]">
              {useOverlay ? "Portal Active: document.body" : "Nested DOM Child"}
            </Badge>
          </div>

          <div className="relative p-6 rounded-2xl border-2 border-dashed border-cyan-400/40 bg-cyan-50/20 dark:bg-cyan-950/20 min-h-[260px] overflow-hidden">
            <div className="absolute top-2 left-3 text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
              KOLOM KANBAN (OVERFLOW: HIDDEN)
            </div>

            {/* Item 1 (Static) */}
            <div className="p-3 mb-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Task #101: Rancang Skema Basis Data
            </div>

            {/* Draggable Card Target */}
            <div className="relative mb-2">
              {/* Ghost Placeholder when DragOverlay is ON */}
              {isDragging && useOverlay && (
                <div className="p-3 rounded-lg border-2 border-dashed border-cyan-400 bg-cyan-100/40 dark:bg-cyan-900/30 text-xs font-semibold text-cyan-600 dark:text-cyan-400 opacity-60">
                  [Ghost Placeholder] Menjaga Dimensi Layout (Zero Layout Shift)
                </div>
              )}

              {/* Direct Draggable Card */}
              <motion.div
                layout
                drag
                dragSnapToOrigin
                whileHover={{ scale: 1.02, cursor: "grab" }}
                whileDrag={{ scale: 1.05, cursor: "grabbing" }}
                onDragStart={() => setIsDragging(true)}
                onDrag={(_, info) => setDragOffset({ x: info.offset.x, y: info.offset.y })}
                onDragEnd={() => {
                  setIsDragging(false);
                  setDragOffset({ x: 0, y: 0 });
                }}
                className={`p-3 rounded-lg text-xs font-semibold select-none shadow-md ${
                  !useOverlay
                    ? "bg-red-600 text-white relative z-10"
                    : isDragging
                    ? "bg-cyan-600 text-white shadow-2xl ring-4 ring-cyan-400/30 z-50"
                    : "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200"
                }`}
                style={
                  useOverlay && isDragging
                    ? {
                        position: "fixed",
                        left: "50%",
                        top: "50%",
                        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                        pointerEvents: "none",
                        width: "280px",
                        zIndex: 9999,
                      }
                    : {}
                }
              >
                <div className="flex items-center justify-between">
                  <span>
                    {!useOverlay
                      ? "Task #102: Kartu Tanpa Overlay"
                      : "Task #102: Kartu dengan DragOverlay"}
                  </span>
                  <Move className="w-3.5 h-3.5 opacity-60" />
                </div>
                <div className="text-[10px] opacity-80 mt-1 font-mono">
                  {!useOverlay
                    ? "⚠️ Coba drag kartu ini keluar kotak: kartu akan tergunting batas!"
                    : "✨ Coba drag kartu ini bebas melayang melintasi batas kontainer!"}
                </div>
              </motion.div>
            </div>

            {/* Item 3 (Static) */}
            <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Task #103: Validasi Token Bearer JWT
            </div>
          </div>
        </div>

        {/* Right Stage: Technical Comparison Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 space-y-3">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-500" /> Anatomi DragOverlay vs DOM Biasa
            </span>

            <div className="space-y-2 text-xs">
              <div className={`p-3 rounded-lg border transition-all ${
                useOverlay
                  ? "border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 opacity-60"
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Dengan DragOverlay & Portal:
                </div>
                <p className="text-[11px] mt-1 text-zinc-600 dark:text-zinc-400">
                  Saat di-drag, kartu di-teleportasi langsung ke <code>document.body</code> via React Portal. Bebas dari batasan <code>overflow: hidden</code> kontainer induk dan layout tidak meloncat berantakan.
                </p>
              </div>

              <div className={`p-3 rounded-lg border transition-all ${
                !useOverlay
                  ? "border-red-500/40 bg-red-50/40 dark:bg-red-950/20 text-red-900 dark:text-red-300"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 opacity-60"
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5 text-red-500" /> Tanpa DragOverlay:
                </div>
                <p className="text-[11px] mt-1 text-zinc-600 dark:text-zinc-400">
                  Kartu yang ditarik tetap tertawan di dalam hirarki DOM kontainer. Saat digeser melintasi tepi kontainer, kartu langsung terpotong (*clipped*).
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-950 text-cyan-400 font-mono text-[11px] border border-zinc-800">
              createPortal(&lt;DragOverlay&gt;...&lt;/DragOverlay&gt;, document.body)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
