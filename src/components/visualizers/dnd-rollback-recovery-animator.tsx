"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, WifiOff, Wifi, Bell, Move, Hand, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DndRollbackRecoveryAnimator() {
  const [networkHealthy, setNetworkHealthy] = useState<boolean>(false); // default error to showcase rollback!
  const [cardColumn, setCardColumn] = useState<"in_progress" | "done">("in_progress");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [hoverCol, setHoverCol] = useState<"in_progress" | "done" | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const inProgRef = useRef<HTMLDivElement>(null);
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

    if (doneRef.current && inProgRef.current) {
      const doneRect = doneRef.current.getBoundingClientRect();
      const inProgRect = inProgRef.current.getBoundingClientRect();

      if (clientX >= doneRect.left - 20 || info.offset.x > 40) {
        setHoverCol("done");
      } else if (clientX <= inProgRect.right + 20 || info.offset.x < -40) {
        setHoverCol("in_progress");
      } else {
        setHoverCol(null);
      }
    }
  };

  const handleDragEndCard = (event: any, info: { point: { x: number; y: number }; offset: { x: number; y: number } }) => {
    const { clientX, clientY } = getClientCoords(event, info);

    if (doneRef.current && inProgRef.current) {
      const doneRect = doneRef.current.getBoundingClientRect();
      const inProgRect = inProgRef.current.getBoundingClientRect();

      const inDone =
        info.offset.x > 50 ||
        (clientX >= doneRect.left - 30 &&
          clientX <= doneRect.right + 30 &&
          clientY >= doneRect.top - 50 &&
          clientY <= doneRect.bottom + 50);

      const inProg =
        info.offset.x < -50 ||
        (clientX >= inProgRect.left - 30 &&
          clientX <= inProgRect.right + 30 &&
          clientY >= inProgRect.top - 50 &&
          clientY <= inProgRect.bottom + 50);

      if (inDone && cardColumn !== "done") {
        triggerMoveToDone();
      } else if (inProg && cardColumn !== "in_progress") {
        setCardColumn("in_progress");
      }
    }
    setHoverCol(null);
  };

  const triggerMoveToDone = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setToastMessage(null);

    // 1. Spekulatif optimistik langsung pindah ke 'done'
    setCardColumn("done");

    // 2. Simulasi server network response
    setTimeout(() => {
      if (networkHealthy) {
        setIsSyncing(false);
        setToastMessage({
          type: "success",
          text: "✅ Urutan kartu berhasil disinkronkan ke Supabase (200 OK).",
        });
      } else {
        // Rollback on error!
        setCardColumn("in_progress");
        setIsSyncing(false);
        setToastMessage({
          type: "error",
          text: "⚠️ 500 Network Error: Gagal menyimpan ke server! Kartu dipulihkan (rollback) ke kolom asal.",
        });
      }
    }, 1200);
  };

  const handleReset = () => {
    setCardColumn("in_progress");
    setIsSyncing(false);
    setHoverCol(null);
    setToastMessage(null);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 text-xs font-semibold">
              Pilar 3.3: Rollback & Recovery
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Direct Drag • Network Failure & Rollback
            </span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Rollback Otomatis: Drag Kartu & Amati Pemulihan Saat Jaringan Gagal
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 flex items-center gap-1.5 py-1">
            <Hand className="w-3.5 h-3.5" /> Drag Kartu Langsung
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            disabled={isSyncing}
            className="text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Posisi
          </Button>
        </div>
      </div>

      {/* Network Health Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={!networkHealthy ? "destructive" : "outline"}
            onClick={() => { setNetworkHealthy(false); handleReset(); }}
            className="text-xs"
          >
            <WifiOff className="w-3.5 h-3.5 mr-1" /> Kondisi: Jaringan Terputus (Simulasi Error 500)
          </Button>
          <Button
            size="sm"
            variant={networkHealthy ? "default" : "outline"}
            onClick={() => { setNetworkHealthy(true); handleReset(); }}
            className={`text-xs ${networkHealthy ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
          >
            <Wifi className="w-3.5 h-3.5 mr-1" /> Kondisi: Jaringan Normal (200 OK)
          </Button>
        </div>

        <Button
          size="sm"
          disabled={isSyncing || cardColumn === "done"}
          onClick={triggerMoveToDone}
          className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Play className="w-3 h-3 mr-1" /> Coba Pindah ke Done
        </Button>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Stage: 2-Column Kanban Viewport */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/50 min-h-[170px]">
            {/* Column In Progress */}
            <div
              ref={inProgRef}
              onClick={() => cardColumn === "done" && !isSyncing && setCardColumn("in_progress")}
              className={`p-3 rounded-lg border transition-all duration-200 min-h-[120px] flex flex-col justify-between ${
                hoverCol === "in_progress"
                  ? "border-amber-500 bg-amber-50/80 dark:bg-amber-950/50 ring-2 ring-amber-400/40 shadow-md"
                  : "border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80"
              }`}
            >
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 block pb-2 border-b border-zinc-200 dark:border-zinc-800">
                Kolom: In Progress
              </span>
              <div className="pt-2 min-h-[75px] flex items-center justify-center">
                {cardColumn === "in_progress" ? (
                  <motion.div
                    layout
                    drag
                    dragSnapToOrigin
                    whileHover={{ scale: 1.02, cursor: "grab" }}
                    whileDrag={{ scale: 1.06, rotate: 2, zIndex: 50, cursor: "grabbing" }}
                    onDrag={handleDrag}
                    onDragEnd={handleDragEndCard}
                    className="p-3.5 rounded-lg bg-amber-600 text-white text-xs font-semibold w-full shadow-md flex items-center justify-between select-none cursor-grab active:cursor-grabbing"
                  >
                    <div>
                      <span>Task #402: DND Rollback</span>
                      <div className="text-[10px] opacity-80 mt-1 font-mono">
                        🖐️ Tarik ke kolom Done ➔
                      </div>
                    </div>
                    <Move className="w-3.5 h-3.5 opacity-60" />
                  </motion.div>
                ) : (
                  <div className="text-[11px] text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-2.5 w-full text-center">
                    Origin (Akan kembali ke sini jika error)
                  </div>
                )}
              </div>
            </div>

            {/* Column Done */}
            <div
              ref={doneRef}
              onClick={() => cardColumn === "in_progress" && !isSyncing && triggerMoveToDone()}
              className={`p-3 rounded-lg border transition-all duration-200 min-h-[120px] flex flex-col justify-between ${
                hoverCol === "done"
                  ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 ring-2 ring-emerald-400/40 shadow-md"
                  : "border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80"
              }`}
            >
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 block pb-2 border-b border-zinc-200 dark:border-zinc-800">
                Kolom: Done
              </span>
              <div className="pt-2 min-h-[75px] flex items-center justify-center">
                {cardColumn === "done" ? (
                  <motion.div
                    layout
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="p-3.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold w-full shadow-md flex items-center justify-between"
                  >
                    <span>Task #402: DND Rollback</span>
                    {isSyncing ? (
                      <span className="text-[10px] animate-pulse font-mono">Menyimpan...</span>
                    ) : (
                      <span className="text-[10px] font-mono">Tersimpan ✅</span>
                    )}
                  </motion.div>
                ) : (
                  <div className="text-[11px] text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-2.5 w-full text-center hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors cursor-pointer">
                    Drop kartu ke sini (atau klik)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Toast Notification Simulation */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 shadow-lg ${
                  toastMessage.type === "success"
                    ? "border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200"
                    : "border-red-500/50 bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-200 ring-2 ring-red-400/20"
                }`}
              >
                <Bell className="w-4 h-4 shrink-0" />
                <span>{toastMessage.text}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Stage: Rollback Logic Explainer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 space-y-3">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-red-500" /> Logika Pemulihan Rollback
            </span>

            <div className="p-3 rounded-lg bg-zinc-950 text-zinc-300 font-mono text-[11px] border border-zinc-800 space-y-1.5">
              <div className="text-purple-400">try &#123;</div>
              <div className="pl-3 text-zinc-400">setOptimistic(newOrder);</div>
              <div className="pl-3 text-zinc-400">await reorderTasksAction(payload);</div>
              <div className="text-purple-400">&#125; catch (err) &#123;</div>
              <div className="pl-3 text-red-400 font-bold">// ROLLBACK KE PREVIOUS STATE</div>
              <div className="pl-3 text-red-400">setTasks(previousBackup);</div>
              <div className="pl-3 text-amber-300">toast.error(&quot;Gagal simpan...&quot;);</div>
              <div className="text-purple-400">&#125;</div>
            </div>

            <p className="text-[11px] text-zinc-500">
              Saat error 500 terjadi, kartu otomatis meluncur balik ke kolom asalnya menggunakan fisika pegas tanpa me-reload halaman.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
