"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertOctagon, CheckCircle2, Play, RotateCcw, Hand, Move } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SpeculativeCacheHarmonyAnimator() {
  const [useTransitionWrapper, setUseTransitionWrapper] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<number>(0); // 0: Idle, 1: Optimistic, 2: Server Sync, 3: Revalidate, 4: Done
  const [cardCol, setCardCol] = useState<"todo" | "done">("todo");
  const [hoverCol, setHoverCol] = useState<"todo" | "done" | null>(null);
  const [glitchNotice, setGlitchNotice] = useState<string | null>(null);

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

      if (cardCol === "todo" && inDoneArea) {
        triggerSimulateSync("done");
      } else if (cardCol === "done" && inTodoArea) {
        setCardCol("todo");
        setCurrentStage(0);
        setGlitchNotice(null);
      }
    }

    setHoverCol(null);
  };

  const triggerSimulateSync = (targetCol: "done") => {
    if (isPlaying) return;
    setIsPlaying(true);
    setCurrentStage(1);
    setCardCol(targetCol); // Optimistic immediate move
    setGlitchNotice(null);

    // Stage 2: Server Processing
    setTimeout(() => {
      setCurrentStage(2);

      if (!useTransitionWrapper) {
        // Without startTransition: state clears early ➔ GLITCH! Card snaps back to 'todo'
        setTimeout(() => {
          setCardCol("todo"); // Glitch snap back!
          setGlitchNotice("⚠️ FLICKER DETECTED! State optimistik hilang sebelum revalidatePath tiba (Snap 150ms)");

          // Then snaps forward when cache arrives
          setTimeout(() => {
            setCardCol("done");
            setCurrentStage(4);
            setIsPlaying(false);
          }, 450);
        }, 300);
      } else {
        // With startTransition: smooth seamless transition
        setTimeout(() => {
          setCurrentStage(3);
          setTimeout(() => {
            setCurrentStage(4);
            setIsPlaying(false);
            setGlitchNotice("✅ ZERO FLICKER! React mempertahankan state optimistik hingga cache server siap.");
          }, 400);
        }, 500);
      }
    }, 600);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStage(0);
    setCardCol("todo");
    setHoverCol(null);
    setGlitchNotice(null);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-xs font-semibold">
              Pilar 3.2: Cache Harmonisasi
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Direct Drag & Drop • startTransition vs Visual Flicker
            </span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Harmonisasi Cache: Drag Kartu & Amati Glitch Flickering Pascamutasi
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
            disabled={isPlaying}
            className="text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Posisi
          </Button>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={useTransitionWrapper ? "default" : "outline"}
            onClick={() => { setUseTransitionWrapper(true); handleReset(); }}
            className={`text-xs ${useTransitionWrapper ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> ✅ Dengan startTransition (Harmoni Mulus)
          </Button>
          <Button
            size="sm"
            variant={!useTransitionWrapper ? "destructive" : "outline"}
            onClick={() => { setUseTransitionWrapper(false); handleReset(); }}
            className="text-xs"
          >
            <AlertOctagon className="w-3.5 h-3.5 mr-1" /> ❌ Tanpa startTransition (Rawan Visual Glitch)
          </Button>
        </div>

        <Button
          size="sm"
          disabled={isPlaying || cardCol === "done"}
          onClick={() => triggerSimulateSync("done")}
          className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Play className="w-3 h-3 mr-1" /> Jalankan Simulasi
        </Button>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Stage: 2-Column Viewport with Direct Drag & Drop */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/50 min-h-[170px]">
            {/* Column Todo */}
            <div
              ref={todoRef}
              onClick={() => cardCol === "done" && !isPlaying && setCardCol("todo")}
              className={`p-3 rounded-xl border transition-all duration-200 min-h-[120px] flex flex-col justify-between ${
                hoverCol === "todo"
                  ? "border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-400/40 shadow-md"
                  : "border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80"
              }`}
            >
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 block pb-2 border-b border-zinc-200 dark:border-zinc-800">
                Kolom: Todo
              </span>
              <div className="pt-2 min-h-[75px] flex items-center justify-center">
                {cardCol === "todo" ? (
                  <motion.div
                    layout
                    drag
                    dragSnapToOrigin
                    whileHover={{ scale: 1.02, cursor: "grab" }}
                    whileDrag={{ scale: 1.06, rotate: 2, zIndex: 50, cursor: "grabbing" }}
                    onDrag={handleDrag}
                    onDragEnd={handleDragEndCard}
                    className="p-3.5 rounded-lg bg-zinc-900 dark:bg-zinc-800 text-white text-xs font-semibold w-full shadow-md flex items-center justify-between select-none cursor-grab active:cursor-grabbing border border-zinc-700"
                  >
                    <div>
                      <span>Task #301: Sync Cache</span>
                      <div className="text-[10px] text-zinc-400 mt-1 font-mono">
                        🖐️ Tarik ke kolom Done ➔
                      </div>
                    </div>
                    <Move className="w-3.5 h-3.5 opacity-60" />
                  </motion.div>
                ) : (
                  <div className="text-[11px] text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-2.5 w-full text-center">
                    Origin (Todo)
                  </div>
                )}
              </div>
            </div>

            {/* Column Done */}
            <div
              ref={doneRef}
              onClick={() => cardCol === "todo" && !isPlaying && triggerSimulateSync("done")}
              className={`p-3 rounded-xl border transition-all duration-200 min-h-[120px] flex flex-col justify-between ${
                hoverCol === "done"
                  ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 ring-2 ring-emerald-400/40 shadow-md"
                  : "border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80"
              }`}
            >
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 block pb-2 border-b border-zinc-200 dark:border-zinc-800">
                Kolom: Done
              </span>
              <div className="pt-2 min-h-[75px] flex items-center justify-center">
                {cardCol === "done" ? (
                  <motion.div
                    layout
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="p-3.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold w-full shadow-md flex items-center justify-between"
                  >
                    <div>
                      <span>Task #301: Sync Cache</span>
                      <div className="text-[10px] text-emerald-100 mt-1 font-mono">
                        {isPlaying ? "⏳ Sinkronisasi Cache..." : "Tersinkronisasi ✅"}
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  </motion.div>
                ) : (
                  <div className="text-[11px] text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-2.5 w-full text-center hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors cursor-pointer">
                    Drop kartu ke sini (atau klik)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Glitch Feedback Box */}
          {glitchNotice && (
            <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              glitchNotice.startsWith("✅")
                ? "border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200"
                : "border-red-500/40 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200 ring-2 ring-red-400/20 animate-bounce"
            }`}>
              {glitchNotice}
            </div>
          )}
        </div>

        {/* Right Stage: 4-Step Pipeline Stepper */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 space-y-3">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" /> Pipeline Harmonisasi State:
            </span>

            <div className="space-y-2 text-xs">
              <div className={`p-2.5 rounded-lg border transition-all ${
                currentStage >= 1 ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 font-bold" : "opacity-50"
              }`}>
                1. Spekulatif 0ms (setOptimistic)
              </div>
              <div className={`p-2.5 rounded-lg border transition-all ${
                currentStage >= 2 ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 font-bold" : "opacity-50"
              }`}>
                2. Server Action Supabase RPC Update
              </div>
              <div className={`p-2.5 rounded-lg border transition-all ${
                currentStage >= 3 ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 font-bold" : "opacity-50"
              }`}>
                3. revalidatePath(&apos;/tasks&apos;) Cache Refresh
              </div>
              <div className={`p-2.5 rounded-lg border transition-all ${
                currentStage === 4 ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 font-bold" : "opacity-50"
              }`}>
                4. Sinkronisasi Selesai (Final State Locked)
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 pt-1">
              Dengan membungkus mutasi di dalam <code>startTransition</code>, React 19 secara cerdas mempertahankan state optimistik hingga data server terbaru selesai direvalidasi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
