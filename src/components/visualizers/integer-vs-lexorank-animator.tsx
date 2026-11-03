"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Database, Binary, Plus, RotateCcw, AlertTriangle, CheckCircle2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TaskItem {
  id: string;
  title: string;
  intPos: number;
  fracPos: number;
}

const INITIAL_DATA: TaskItem[] = [
  { id: "T1", title: "Setup Database Migration", intPos: 1, fracPos: 10.0 },
  { id: "T2", title: "Zod Schema SafeParse", intPos: 2, fracPos: 20.0 },
  { id: "T3", title: "Implementasi DndContext", intPos: 3, fracPos: 30.0 },
];

export function IntegerVsLexorankAnimator() {
  const [data, setData] = useState<TaskItem[]>(INITIAL_DATA);
  const [strategy, setStrategy] = useState<"integer" | "lexorank">("integer");
  const [lastInsertedId, setLastInsertedId] = useState<string | null>(null);
  const [dbUpdateCount, setDbUpdateCount] = useState<number>(0);
  const [insertCount, setInsertCount] = useState<number>(0);

  const handleInsertBetween1and2 = () => {
    const newId = `T_NEW_${insertCount + 1}`;
    setInsertCount((prev) => prev + 1);

    if (strategy === "integer") {
      // Integer: Insert at pos 2, all subsequent shifted +1 (Batch O(N))
      const updated = data.map((item) => (item.intPos >= 2 ? { ...item, intPos: item.intPos + 1 } : item));
      const newItem: TaskItem = {
        id: newId,
        title: `Tugas Baru #${insertCount + 1}`,
        intPos: 2,
        fracPos: (data[0].fracPos + data[1].fracPos) / 2,
      };
      const finalData = [updated[0], newItem, ...updated.slice(1)];
      setData(finalData);
      setDbUpdateCount(finalData.length - 1); // Updated rows
      setLastInsertedId(newId);
    } else {
      // Fractional / Lexorank: Calculate midpoint between item 0 and item 1
      const p1 = data[0].fracPos;
      const p2 = data[1].fracPos;
      const midpoint = (p1 + p2) / 2;
      const newItem: TaskItem = {
        id: newId,
        title: `Tugas Baru #${insertCount + 1}`,
        intPos: 2,
        fracPos: midpoint,
      };
      const finalData = [data[0], newItem, ...data.slice(1)];
      setData(finalData);
      setDbUpdateCount(1); // Only 1 row updated!
      setLastInsertedId(newId);
    }
  };

  const handleReset = () => {
    setData(INITIAL_DATA);
    setLastInsertedId(null);
    setDbUpdateCount(0);
    setInsertCount(0);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-xs font-semibold">
              Pilar 4.1: Skema Database
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Integer O(N) vs Lexorank O(1)
            </span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Komparasi Skema Urutan: Integer Sequence vs Fractional Indexing
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Data
          </Button>
          <Button
            size="sm"
            onClick={handleInsertBetween1and2}
            className="text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Sisipkan Kartu di Antara Baris 1 & 2
          </Button>
        </div>
      </div>

      {/* Strategy Switcher */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={strategy === "integer" ? "default" : "outline"}
          onClick={() => { setStrategy("integer"); handleReset(); }}
          className={`text-xs ${strategy === "integer" ? "bg-cyan-600 hover:bg-cyan-700 text-white" : ""}`}
        >
          <Database className="w-3.5 h-3.5 mr-1" /> Integer Sequence (Batch RPC via jsonb_to_recordset)
        </Button>
        <Button
          size="sm"
          variant={strategy === "lexorank" ? "default" : "outline"}
          onClick={() => { setStrategy("lexorank"); handleReset(); }}
          className={`text-xs ${strategy === "lexorank" ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}`}
        >
          <Binary className="w-3.5 h-3.5 mr-1" /> Fractional Indexing / Lexorank (Midpoint O(1))
        </Button>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Stage: Database Table Inspector */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>Tabel public.tasks (PostgreSQL)</span>
            <Badge variant="outline" className="text-[10px]">
              Mutasi Database: {dbUpdateCount} Baris Terpengaruh
            </Badge>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono text-[11px] border-b border-zinc-200 dark:border-zinc-700">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Judul Tugas</th>
                  <th className="p-3">
                    {strategy === "integer" ? "position (INT)" : "lexorank (FLOAT)"}
                  </th>
                  <th className="p-3 text-right">Status Kueri</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {data.map((item, idx) => {
                  const isNew = item.id === lastInsertedId;
                  const isShifted = strategy === "integer" && !isNew && idx > 1;

                  return (
                    <motion.tr
                      key={item.id}
                      layout
                      className={`transition-colors ${isNew
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-bold"
                        : isShifted
                          ? "bg-amber-50/60 dark:bg-amber-950/20 text-zinc-700 dark:text-zinc-300"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        }`}
                    >
                      <td className="p-3 font-mono text-[11px]">{item.id}</td>
                      <td className="p-3">{item.title}</td>
                      <td className="p-3 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                        {strategy === "integer" ? item.intPos : item.fracPos.toFixed(4)}
                      </td>
                      <td className="p-3 text-right">
                        {isNew ? (
                          <Badge className="bg-emerald-600 text-white text-[10px]">INSERT</Badge>
                        ) : isShifted ? (
                          <Badge variant="outline" className="text-amber-600 border-amber-300 text-[10px]">
                            UPDATE +1
                          </Badge>
                        ) : (
                          <span className="text-zinc-400 text-[10px]">UNCHANGED</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Stage: Analysis & Trade-offs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 space-y-3">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-500" /> Analisis Trade-off Arsitektural
            </span>

            {strategy === "integer" ? (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-zinc-800 dark:text-zinc-200">
                  Integer Indexing (Pilihan Pragmatis):
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Setiap penyisipan memperbarui baris-baris setelahnya (+1). Dengan menggunakan <strong>Stored Procedure Supabase RPC</strong>, seluruh baris di-update dalam 1 transaksi atomik mikrodetik.
                </p>
                <div className="p-2.5 rounded-lg bg-zinc-950 text-cyan-400 font-mono text-[10px] border border-zinc-800">
                  UPDATE tasks SET position = v.position FROM jsonb_to_recordset(...)
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-zinc-800 dark:text-zinc-200">
                  Fractional Indexing (Lexorank):
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Hanya <strong>1 baris</strong> yang di-update dengan menghitung titik tengah (midpoint). Sangat hemat kueri untuk jutaan baris, namun membutuhkan algoritma rebalancing saat batas pecahan mendekati limit IEEE-754.
                </p>
                <div className="p-2.5 rounded-lg bg-zinc-950 text-purple-400 font-mono text-[10px] border border-zinc-800">
                  midpoint = (posPrev + posNext) / 2.0; /* O(1) Single Row Update */
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500">
              <strong>Keputusan Rekayasa Proyek:</strong> Untuk aplikasi tugas dan papan tim hingga ribuan kartu, Integer Indexing dengan Supabase RPC adalah arsitektur paling stabil, mudah di-query (<code>ORDER BY position ASC</code>), dan bebas bug floating-point.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

