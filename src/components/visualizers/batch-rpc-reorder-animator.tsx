"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Database, Zap, ShieldAlert, CheckCircle2, Play, RotateCcw, Server, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function BatchRpcReorderAnimator() {
  const [approach, setApproach] = useState<"rpc" | "n_plus_one">("rpc");
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [dbLogs, setDbLogs] = useState<string[]>([
    "PostgreSQL Engine: Menunggu perintah mutasi urutan...",
  ]);

  const handleSimulate = () => {
    setIsExecuting(true);
    setCurrentStep(1);

    if (approach === "rpc") {
      setDbLogs([
        "[1] Klien mengirim 1 payload JSON array (3 item) via supabase.rpc('reorder_kanban_tasks')",
      ]);

      setTimeout(() => {
        setCurrentStep(2);
        setDbLogs((prev) => [
          "[2] PostgreSQL RAM: jsonb_to_recordset() mengurai JSON menjadi virtual recordset tabel",
          ...prev,
        ]);

        setTimeout(() => {
          setCurrentStep(3);
          setDbLogs((prev) => [
            "[3] UPDATE public.tasks FROM virtual_recordset WHERE user_id = auth.uid()",
            "[4] ✅ 1 Transaksi Atomik Selesai dalam 0.8ms! Seluruh urutan terjamin konsisten.",
            ...prev,
          ]);
          setIsExecuting(false);
        }, 600);
      }, 500);
    } else {
      // N+1 Client Loop
      setDbLogs([
        "[1] Klien loop item 1 ➔ HTTP POST /rest/v1/tasks?id=eq.1 (120ms)",
      ]);

      setTimeout(() => {
        setCurrentStep(2);
        setDbLogs((prev) => [
          "[2] Klien loop item 2 ➔ HTTP POST /rest/v1/tasks?id=eq.2 (140ms)",
          ...prev,
        ]);

        setTimeout(() => {
          setCurrentStep(3);
          setDbLogs((prev) => [
            "[3] ⚠️ KONEKSI TERPUTUS DI TENGAH LOOP! Item 3 tidak ter-update.",
            "❌ Korup: Database berada dalam kondisi tidak konsisten (split-brain order)!",
            ...prev,
          ]);
          setIsExecuting(false);
        }, 700);
      }, 500);
    }
  };

  const handleReset = () => {
    setIsExecuting(false);
    setCurrentStep(0);
    setDbLogs(["PostgreSQL Engine: Menunggu perintah mutasi urutan..."]);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
              Pilar 4.2: PostgreSQL Stored Procedure
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              jsonb_to_recordset & ACID Isolation
            </span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Supabase RPC: Atomic Batch Reordering vs Bahaya N+1 Client Loop
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            disabled={isExecuting}
            className="text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
          </Button>
          <Button
            size="sm"
            onClick={handleSimulate}
            disabled={isExecuting}
            className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Jalankan Mutasi
          </Button>
        </div>
      </div>

      {/* Approach Switcher */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={approach === "rpc" ? "default" : "outline"}
          onClick={() => { setApproach("rpc"); handleReset(); }}
          className={`text-xs ${approach === "rpc" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> ✅ Stored Procedure RPC (1 Transaksi Atomik)
        </Button>
        <Button
          size="sm"
          variant={approach === "n_plus_one" ? "destructive" : "outline"}
          onClick={() => { setApproach("n_plus_one"); handleReset(); }}
          className="text-xs"
        >
          <ShieldAlert className="w-3.5 h-3.5 mr-1" /> ❌ Loop Client-Side N+1 (Bahaya Inkonsistensi)
        </Button>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Stage: Architecture Visualizer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/50 min-h-[200px] flex flex-col justify-between">
            {/* Visual Flow diagram */}
            <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-500" />
                <span>Next.js Client/Server</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                {approach === "rpc" ? "1 HTTP Payload JSON" : "N Separate Requests"}
              </span>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-500" />
                <span>PostgreSQL DB</span>
              </div>
            </div>

            {/* Middle Execution Tube */}
            <div className="relative py-4">
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${approach === "rpc" ? "bg-emerald-500" : "bg-red-500"}`}
                  animate={{
                    width: currentStep === 0 ? "0%" : currentStep === 1 ? "40%" : currentStep === 2 ? "75%" : "100%",
                  }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {isExecuting && (
                <div className="text-center pt-2 text-xs font-mono text-zinc-500">
                  {approach === "rpc"
                    ? "Transmisi: [{ id: '1', pos: 1 }, { id: '2', pos: 2 }] ➔ RPC"
                    : `Mengirim Request ${currentStep} dari 3...`}
                </div>
              )}
            </div>

            {/* Architecture Card */}
            <div className={`p-3 rounded-lg border text-xs font-mono ${
              approach === "rpc"
                ? "border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300"
                : "border-red-500/40 bg-red-50/50 dark:bg-red-950/20 text-red-800 dark:text-red-300"
            }`}>
              {approach === "rpc" ? (
                <div>
                  <span className="font-bold">CREATE FUNCTION reorder_kanban_tasks(payload JSONB):</span>
                  <div className="text-[10px] text-zinc-500 mt-1">
                    Menggunakan jsonb_to_recordset() untuk update massal dalam memori engine SQL.
                  </div>
                </div>
              ) : (
                <div>
                  <span className="font-bold">for (const item of items) await supabase.update():</span>
                  <div className="text-[10px] text-zinc-500 mt-1">
                    Memicu N roundtrips jaringan. Jika koneksi putus di tengah, urutan data korup permanen.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Stage: Database Engine Console Trace */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 space-y-3">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-emerald-500" /> PostgreSQL Engine Log
            </span>

            <div className="p-3 rounded-lg bg-zinc-950 text-emerald-400 font-mono text-[11px] border border-zinc-800 min-h-[140px] space-y-1.5">
              {dbLogs.map((log, i) => (
                <div key={i} className={i === 0 ? "text-emerald-400 font-bold" : "text-zinc-400 text-[10px]"}>
                  &gt; {log}
                </div>
              ))}
            </div>

            <div className="pt-1 text-[11px] text-zinc-500">
              Klausul <code>WHERE t.user_id = auth.uid()</code> di dalam stored procedure memastikan pengguna hanya dapat mengubah urutan kartu miliknya sendiri (RLS Security).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

