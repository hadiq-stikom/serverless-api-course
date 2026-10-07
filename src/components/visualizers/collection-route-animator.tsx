"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileCode, 
  Send, 
  Database, 
  Filter, 
  PlusCircle, 
  CheckCircle2, 
  Search,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CollectionRouteAnimator() {
  const [activeMethod, setActiveMethod] = useState<"GET" | "POST">("GET");
  const [searchQuery, setSearchQuery] = useState("proyek");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newTitle, setNewTitle] = useState("Integrasi Endpoint Mobile");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("high");
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const executeRequest = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (activeMethod === "GET") {
        setResponseOutput({
          status: "success",
          data: [
            { id: "uuid-1", title: `Rapat ${searchQuery || "Proyek"}`, status: "in_progress", priority: "high" },
            { id: "uuid-2", title: `Review ${searchQuery || "Proyek"} UTS`, status: "completed", priority: "medium" }
          ],
          meta: {
            page: 1,
            limit: 10,
            search: searchQuery || null,
            status: statusFilter !== "all" ? statusFilter : null,
            total: 2
          }
        });
      } else {
        setResponseOutput({
          status: "success",
          message: "Data tugas berhasil dibuat via Mobile API",
          data: {
            id: "uuid-new-9876",
            title: newTitle,
            priority: newPriority,
            status: "pending",
            created_at: new Date().toISOString()
          }
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
              Pilar 3.1: Route Handler Koleksi
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">src/app/api/v1/tasks/route.ts</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Route Handler Koleksi: GET (Filter/Pagination) &amp; POST (Mutasi)
          </h4>
        </div>

        {/* Method Switcher */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => { setActiveMethod("GET"); setResponseOutput(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMethod === "GET"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Search className="w-3.5 h-3.5" /> GET Koleksi
          </button>
          <button
            type="button"
            onClick={() => { setActiveMethod("POST"); setResponseOutput(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMethod === "POST"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" /> POST Buat Data
          </button>
        </div>
      </div>

      {/* Interactive Request Builder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Request Parameter Panel */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
              <Send className="w-3.5 h-3.5 text-cyan-500" /> Parameter Permintaan (HTTP Client)
            </span>
            <Badge variant="outline" className="text-[10px] font-mono">
              {activeMethod === "GET" ? "Query String" : "JSON Body"}
            </Badge>
          </div>

          {activeMethod === "GET" ? (
            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                  Query Pencarian (?search=...):
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                  placeholder="Ketik kata kunci..."
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                  Filter Status (?status=...):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["all", "in_progress", "completed"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`py-1.5 text-[11px] font-bold rounded-md border capitalize ${
                        statusFilter === st 
                          ? "bg-blue-600 text-white border-blue-600" 
                          : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                  Judul Tugas (Payload JSON):
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block mb-1">
                  Prioritas:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["low", "medium", "high"] as const).map((pr) => (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => setNewPriority(pr)}
                      className={`py-1.5 text-[11px] font-bold rounded-md border capitalize ${
                        newPriority === pr 
                          ? "bg-emerald-600 text-white border-emerald-600" 
                          : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {pr}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={executeRequest}
            disabled={isLoading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs"
          >
            {isLoading ? "Mengirim Request..." : `Kirim ${activeMethod} Request ➔`}
          </Button>
        </div>

        {/* JSON Response Preview */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-2 border-b border-zinc-800">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <FileCode className="w-3.5 h-3.5" /> Output JSON Response
            </span>
            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/40">
              {responseOutput ? (activeMethod === "GET" ? "200 OK" : "201 Created") : "Waiting Trigger"}
            </Badge>
          </div>

          <pre className="text-zinc-300 leading-relaxed overflow-x-auto text-[11px] max-h-[190px]">
            {responseOutput ? JSON.stringify(responseOutput, null, 2) : "// Klik 'Kirim Request' untuk melihat respons server..."}
          </pre>
        </div>
      </div>
    </div>
  );
}
