"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Server, 
  Laptop, 
  Search, 
  Database, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Filter 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MockTask {
  id: number;
  title: string;
  category: "Backend" | "Frontend" | "DevOps";
  status: "Selesai" | "Proses";
}

const INITIAL_TASKS: MockTask[] = [
  { id: 1, title: "Inisialisasi Skema Database Supabase", category: "Backend", status: "Selesai" },
  { id: 2, title: "Rancang Navigasi App Router & Shadcn UI", category: "Frontend", status: "Proses" },
  { id: 3, title: "Konfigurasi Row Level Security (RLS) PostgreSQL", category: "Backend", status: "Selesai" },
  { id: 4, title: "Setup Pipeline Deployment Vercel Edge", category: "DevOps", status: "Proses" },
];

export function ContainerWidgetAnimator() {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("Semua");

  const filteredTasks = INITIAL_TASKS.filter((t) => {
    const matchCat = filterCategory === "Semua" || t.category === filterCategory;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator Server Container (RSC) vs Client Interactive Widget
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Lihat bagaimana pemisahan tugas menjaga performa aplikasi tetap cepat dan struktur kode modular.
          </p>
        </div>

        <Badge variant="outline" className="text-xs">
          Clean Separation of Concerns
        </Badge>
      </div>

      {/* Visual Workflow Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Server Container Representation */}
        <div className="lg:col-span-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
            <span className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              1. Server Container (page.tsx)
            </span>
            <Badge className="bg-emerald-500/20 text-emerald-300">
              0 kB JS Bundle
            </Badge>
          </div>

          <pre className="text-[11px] leading-relaxed">
{`// src/app/(dashboard)/tasks/page.tsx
export default async function TasksPage() {
  // 🔒 100% di Server: Mengambil data awal
  const tasks = await supabase
    .from("tasks")
    .select("*");

  // Alirkan ke Client Widget via props:
  return <TaskFilterWidget initialData={tasks} />;
}`}
          </pre>

          <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
            <div className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Database Fetch: Selesai 1x di Server
            </div>
            <p>Data dikirim sebagai JSON props ringan ke peramban tanpa me-load library database PostgreSQL ke client.</p>
          </div>
        </div>

        {/* Right: Client Filter Widget Interactive Demo */}
        <div className="lg:col-span-7 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-indigo-500" />
              2. Client Widget (&apos;use client&apos; - Filter Instan)
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">0ms latency search</span>
          </div>

          {/* Interactive Filter Tools */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari tugas di browser memory..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Category tabs */}
              <div className="flex items-center gap-1">
                {["Semua", "Backend", "Frontend", "DevOps"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilterCategory(cat)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-all font-medium ${
                      filterCategory === cat
                        ? "bg-indigo-600 text-white font-bold"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtered Results List */}
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              <AnimatePresence>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px]">
                          {task.category}
                        </Badge>
                        <Badge className={`text-[10px] ${
                          task.status === "Selesai" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                        }`}>
                          {task.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-4 text-xs text-zinc-400">
                    Tidak ada tugas yang cocok dengan filter.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <span>Filtering dilakukan langsung di memori browser pengguna (Zero Server Roundtrip)!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
