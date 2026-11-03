"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ZoomIn, AlertTriangle, CheckCircle2, Type, Sliders, Hand, Move } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CssTranslateVsTransformAnimator() {
  const [method, setMethod] = useState<"translate" | "transform">("translate");
  const [posX, setPosX] = useState<number>(0);
  const [posY, setPosY] = useState<number>(0);
  const [inspectZoom, setInspectZoom] = useState<boolean>(true);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-semibold">
              Pilar 2.1: Geometri CSS useSortable
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Direct Drag • CSS.Translate vs CSS.Transform
            </span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Matriks Geometri: Drag Kartu & Amati Ketajaman Tipografi Font
          </h4>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 flex items-center gap-1.5 py-1">
            <Hand className="w-3.5 h-3.5" /> Drag Kartu Langsung
          </Badge>
          <Button
            size="sm"
            variant={method === "translate" ? "default" : "outline"}
            onClick={() => setMethod("translate")}
            className={`text-xs ${method === "translate" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> CSS.Translate (Tajam)
          </Button>
          <Button
            size="sm"
            variant={method === "transform" ? "destructive" : "outline"}
            onClick={() => setMethod("transform")}
            className="text-xs"
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> CSS.Transform (Blur)
          </Button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Stage: Visual Inspection Canvas */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="p-8 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/50 min-h-[260px] flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-3 left-3 text-[11px] font-mono text-zinc-400">
              🖐️ Drag kartu ini bebas di dalam area:
            </div>

            {/* Draggable Card with active method */}
            <motion.div
              layout
              drag
              dragSnapToOrigin
              whileHover={{ scale: 1.02, cursor: "grab" }}
              whileDrag={{ scale: 1.05, cursor: "grabbing" }}
              onDrag={(_, info) => {
                setPosX(Math.round(info.offset.x));
                setPosY(Math.round(info.offset.y));
              }}
              onDragEnd={() => {
                setPosX(0);
                setPosY(0);
              }}
              className={`w-72 p-4 rounded-xl border shadow-lg select-none transition-all ${
                method === "transform"
                  ? "border-amber-500 bg-amber-50/90 dark:bg-amber-950/50 text-amber-950 dark:text-amber-100 filter blur-[0.6px]"
                  : "border-emerald-500 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 ring-2 ring-emerald-400/20"
              }`}
            >
              <div className="flex items-center justify-between border-b pb-2 mb-2 border-zinc-200 dark:border-zinc-800">
                <span className="text-xs font-bold font-mono">
                  {method === "translate" ? "CSS.Translate.toString()" : "CSS.Transform.toString()"}
                </span>
                <Badge variant={method === "translate" ? "default" : "destructive"} className="text-[10px]">
                  {method === "translate" ? "CRISP 1:1" : "SUBPIXEL BLUR"}
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                    Sprint #4: Refactor Auth Server Action
                  </p>
                  <Move className="w-3.5 h-3.5 opacity-40 shrink-0" />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                  <Type className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Tipografi 13px Subpixel Rasterizer</span>
                </div>
                <div className="p-2 rounded bg-zinc-100 dark:bg-zinc-800 border text-[10px] font-mono">
                  &lt;input placeholder=&quot;Ketik catatan...&quot; /&gt;
                </div>
              </div>
            </motion.div>

            {/* Loupe / Magnifier Effect */}
            {inspectZoom && (
              <div className="absolute bottom-3 right-3 p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white/95 dark:bg-zinc-900/95 shadow-xl text-center space-y-1 backdrop-blur-md">
                <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                  <ZoomIn className="w-3 h-3 text-indigo-500" /> Inspektur Font 300%
                </div>
                <div className={`text-base font-bold tracking-tight px-3 py-1 rounded border font-mono ${
                  method === "transform"
                    ? "text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/60 blur-[1px]"
                    : "text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/60"
                }`}>
                  Aa Bb Gg 123
                </div>
                <div className="text-[9px] text-zinc-400">
                  {method === "transform" ? "❌ Terdistorsi Transform Matrix" : "✅ Tajam Sempurna Tanpa Scale"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Stage: CSS Matrix Output & Technical Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 space-y-3">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-500" /> Inspektur String CSS Terkalkulasi
            </span>

            <div className="space-y-2">
              <div className="text-xs text-zinc-500">Output Style Objek React Saat di-Drag:</div>
              <div className="p-3 rounded-lg bg-zinc-950 text-amber-300 font-mono text-[11px] border border-zinc-800 break-all">
                {method === "translate"
                  ? `transform: CSS.Translate.toString(transform)\n/* Output: translate3d(${posX}px, ${posY}px, 0) */`
                  : `transform: CSS.Transform.toString(transform)\n/* Output: translate3d(${posX}px, ${posY}px, 0) scaleX(1.08) scaleY(1.08) */`}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-xs">
              <div className="font-bold text-zinc-700 dark:text-zinc-300">Aturan Baku Rekayasa:</div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Selalu gunakan <code>CSS.Translate.toString(transform)</code> untuk kartu daftar dan Kanban board. Penggunaan <code>CSS.Transform</code> memicu distorsi rasio aspek elemen anak (*child distortion*), teks menjadi buram (*font rasterization blur*), dan input form bersarang tampak aneh saat digeser.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
