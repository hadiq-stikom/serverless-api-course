"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Network, 
  Tag, 
  CheckSquare, 
  Layers, 
  Database, 
  CheckCircle2, 
  ArrowRight,
  Plus,
  Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ManyToManyRelAnimator() {
  const [selectedTask, setSelectedTask] = useState<"t1" | "t2">("t1");

  // State of junction table mappings: { task_id, tag_id }
  const [junctionRows, setJunctionRows] = useState<Array<{ taskId: string; tagId: string; tagName: string }>>([
    { taskId: "t1", tagId: "tag_nextjs", tagName: "Next.js 16" },
    { taskId: "t1", tagId: "tag_auth", tagName: "Authentication" },
    { taskId: "t2", tagId: "tag_db", tagName: "PostgreSQL" },
  ]);

  const allTags = [
    { id: "tag_nextjs", name: "Next.js 16", color: "blue" },
    { id: "tag_auth", name: "Authentication", color: "purple" },
    { id: "tag_db", name: "PostgreSQL", color: "emerald" },
    { id: "tag_urgent", name: "High Priority", color: "red" },
  ];

  const tasks = [
    { id: "t1", title: "Setup GitHub OAuth Login" },
    { id: "t2", title: "Design 3-Table Relational Schema" },
  ];

  const isTagAssigned = (tagId: string) => {
    return junctionRows.some((r) => r.taskId === selectedTask && r.tagId === tagId);
  };

  const toggleTag = (tag: typeof allTags[0]) => {
    if (isTagAssigned(tag.id)) {
      setJunctionRows((prev) => prev.filter((r) => !(r.taskId === selectedTask && r.tagId === tag.id)));
    } else {
      setJunctionRows((prev) => [...prev, { taskId: selectedTask, tagId: tag.id, tagName: tag.name }]);
    }
  };

  const activeTaskObj = tasks.find((t) => t.id === selectedTask)!;
  const currentTaskTags = junctionRows.filter((r) => r.taskId === selectedTask);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
              Pilar 1.3: Relasi M:N & Junction Table
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Pivot Table & Composite Key</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Relasi M:N (Banyak-ke-Banyak) Menggunakan Tabel Perantara (Junction Table)
          </h4>
        </div>

        {/* Task Selector Tabs */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          {tasks.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTask(t.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedTask === t.id
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Tugas {t.id === "t1" ? "#1" : "#2"}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Relational Architecture Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Col 1: Task Details & Available Tags */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
            <span>Tabel tasks (Kiri):</span>
            <Badge variant="outline" className="text-[10px] font-mono">{activeTaskObj.id}</Badge>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 text-xs font-mono">
            <div className="text-[10px] text-zinc-500">task_id: {activeTaskObj.id}</div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100 pt-0.5">{activeTaskObj.title}</div>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] text-zinc-500 font-semibold block">Klik Tag untuk Menghubungkan:</span>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => {
                const assigned = isTagAssigned(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                      assigned
                        ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                    }`}
                  >
                    <Tag className="w-3 h-3" />
                    <span>{tag.name}</span>
                    {assigned && <span className="text-[10px]">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Col 2: The Junction Table (task_tags) */}
        <div className="p-4 rounded-xl border border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <span className="flex items-center gap-1.5">
              <Network className="w-4 h-4 text-emerald-500" />
              Tabel Perantara: task_tags (Junction)
            </span>
            <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px]">
              {junctionRows.length} Baris
            </Badge>
          </div>

          <div className="space-y-1.5 text-xs font-mono max-h-48 overflow-y-auto">
            {junctionRows.map((row, idx) => (
              <motion.div
                key={`${row.taskId}-${row.tagId}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-2 rounded border flex items-center justify-between ${
                  row.taskId === selectedTask
                    ? "bg-white dark:bg-zinc-800 border-emerald-400 dark:border-emerald-600 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "bg-zinc-100/50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/60 text-zinc-400 opacity-60"
                }`}
              >
                <div>
                  <span className="font-bold">{row.taskId}</span> ↔ <span>{row.tagId}</span>
                  <div className="text-[10px] text-zinc-500">({row.tagName})</div>
                </div>
                <Badge variant="outline" className="text-[9px]">PK Composite</Badge>
              </motion.div>
            ))}
          </div>

          <p className="text-[11px] text-zinc-500 leading-tight">
            Kombinasi <code>PRIMARY KEY (task_id, tag_id)</code> menjamin 1 tag tidak bisa diduplikasi pada task yang sama.
          </p>
        </div>

        {/* Col 3: Master Table: tags */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
            <span>Tabel tags (Kanan):</span>
            <span className="font-mono text-zinc-400 text-[11px]">Master Kategori</span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            {allTags.map((tag) => (
              <div
                key={tag.id}
                className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between"
              >
                <span className="text-zinc-800 dark:text-zinc-200 font-bold">{tag.id}</span>
                <span className="text-zinc-500">{tag.name}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Data nama tag hanya disimpan 1 kali di tabel tags. Jika nama kategori diedit, seluruh task otomatis merujuk ke nama baru.
          </p>
        </div>
      </div>

      {/* SQL DDL Definition Snippet */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#1e1e1e] text-zinc-200 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-zinc-800 text-[11px]">
          <span>SQL DDL Junction Table dengan Composite Primary Key:</span>
          <span className="text-emerald-400">PostgreSQL Standar</span>
        </div>
        <pre className="text-emerald-400 leading-relaxed overflow-x-auto">
          <code>{`CREATE TABLE task_tags (
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  -- 🔒 Composite Primary Key: Menjamin keunikan pasangan dan mengindeks otomatis
  PRIMARY KEY (task_id, tag_id)
);`}</code>
        </pre>
      </div>
    </div>
  );
}
