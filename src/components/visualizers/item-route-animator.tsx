"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileCode, 
  Trash2, 
  Edit3, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ItemRouteAnimator() {
  const [selectedMethod, setSelectedMethod] = useState<"GET" | "PUT" | "DELETE">("DELETE");
  const [taskId, setTaskId] = useState("a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d");
  const [editTitle, setEditTitle] = useState("Revisi Judul via Mobile PUT");
  const [executionOutput, setExecutionOutput] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const runItemRequest = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (selectedMethod === "GET") {
        setExecutionOutput({
          status: "success",
          data: {
            id: taskId,
            title: "Pengembangan Endpoint REST API Mobile",
            status: "in_progress",
            priority: "high",
            created_at: "2026-10-01T07:30:00Z"
          }
        });
      } else if (selectedMethod === "PUT") {
        setExecutionOutput({
          status: "success",
          message: "Data tugas berhasil diperbarui",
          data: {
            id: taskId,
            title: editTitle,
            updated_at: new Date().toISOString()
          }
        });
      } else {
        setExecutionOutput({
          status: "success",
          message: `Data tugas dengan ID '${taskId}' berhasil dihapus secara permanen`
        });
      }
    }, 600);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-xs font-semibold">
              Pilar 3.2: Dynamic Route Handlers
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">src/app/api/v1/tasks/[id]/route.ts</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Operasi Item Spesifik: GET by ID, PUT &amp; DELETE (Async Params Next.js 16)
          </h4>
        </div>

        {/* Method Switcher */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => { setSelectedMethod("GET"); setExecutionOutput(null); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              selectedMethod === "GET" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <Search className="w-3.5 h-3.5" /> GET
          </button>
          <button
            type="button"
            onClick={() => { setSelectedMethod("PUT"); setExecutionOutput(null); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              selectedMethod === "PUT" ? "bg-amber-600 text-white shadow-sm" : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> PUT
          </button>
          <button
            type="button"
            onClick={() => { setSelectedMethod("DELETE"); setExecutionOutput(null); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              selectedMethod === "DELETE" ? "bg-rose-600 text-white shadow-sm" : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" /> DELETE
          </button>
        </div>
      </div>

      {/* Code Inspection of Next.js 16 Async Params */}
      <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono text-xs space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-1 border-b border-zinc-800">
          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5" /> Next.js 16 Breaking Change: Async Route Params
          </span>
          <span className="text-amber-400 text-[10px]">Wajib di-await!</span>
        </div>
        <pre className="text-zinc-300 leading-relaxed overflow-x-auto text-[11px]">
{`export async function ${selectedMethod}(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // ⚠️ Next.js 16: Params adalah Promise!
) {
  const { id } = await params; // Wajib di-await sebelum membaca id
  // Verifikasi Bearer Token & Eksekusi Query Supabase...
}`}
        </pre>
      </div>

      {/* Interactive Testing Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
              Parameter URL ID (:id):
            </label>
            <input
              type="text"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
            />
          </div>

          {selectedMethod === "PUT" && (
            <div>
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                Data Perubahan (JSON Payload):
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
              />
            </div>
          )}

          <Button
            onClick={runItemRequest}
            disabled={isProcessing}
            className={`w-full font-bold text-xs text-white ${
              selectedMethod === "DELETE" ? "bg-rose-600 hover:bg-rose-700" : "bg-cyan-600 hover:bg-cyan-700"
            }`}
          >
            {isProcessing ? "Mengeksekusi..." : `Eksekusi ${selectedMethod} /api/v1/tasks/:id ➔`}
          </Button>
        </div>

        {/* Output Panel */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-2 border-b border-zinc-800">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <FileCode className="w-3.5 h-3.5" /> Output JSON REST
            </span>
            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/40">
              {executionOutput ? "200 OK" : "Waiting Trigger"}
            </Badge>
          </div>

          <pre className="text-zinc-300 leading-relaxed overflow-x-auto text-[11px] max-h-[160px]">
            {executionOutput ? JSON.stringify(executionOutput, null, 2) : "// Jalankan eksekusi untuk melihat respons endpoint..."}
          </pre>
        </div>
      </div>
    </div>
  );
}
