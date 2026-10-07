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
  ArrowLeftRight,
  Plus,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  Key,
  AlertTriangle,
  Terminal,
  HelpCircle,
  XCircle,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TaskItem {
  id: string;
  title: string;
}

interface TagItem {
  id: string;
  name: string;
  color: "blue" | "purple" | "emerald" | "amber";
}

interface JunctionRow {
  taskId: string;
  tagId: string;
}

export function ManyToManyRelAnimator() {
  // Mode Navigasi Utama:
  // 1. "query_two_way": Membuktikan Poin 1 & 3 (Dekomposisi & Pencarian 2-Arah)
  // 2. "composite_pk": Membuktikan Poin 2 (Pencegahan Duplikasi Kunci Komposit)
  // 3. "why_junction": Membuktikan Poin 1 (Mengapa butuh tabel perantara vs Anti-pattern)
  const [activeTab, setActiveTab] = useState<"query_two_way" | "composite_pk" | "why_junction">("query_two_way");

  // State untuk Tab 1: Navigasi Dua Arah
  const [queryPerspective, setQueryPerspective] = useState<"by_task" | "by_tag">("by_task");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("t1");
  const [selectedTagId, setSelectedTagId] = useState<string>("tag_nextjs");

  // State Data Master
  const tasks: TaskItem[] = [
    { id: "t1", title: "Setup GitHub OAuth Login" },
    { id: "t2", title: "Design 3-Table Relational Schema" },
    { id: "t3", title: "Integrate Cloudinary AI Media" },
  ];

  const tags: TagItem[] = [
    { id: "tag_nextjs", name: "Next.js 16", color: "blue" },
    { id: "tag_auth", name: "Authentication", color: "purple" },
    { id: "tag_db", name: "PostgreSQL", color: "emerald" },
    { id: "tag_urgent", name: "High Priority", color: "amber" },
  ];

  // State Junction Table
  const initialJunctionRows: JunctionRow[] = [
    { taskId: "t1", tagId: "tag_nextjs" },
    { taskId: "t1", tagId: "tag_auth" },
    { taskId: "t2", tagId: "tag_nextjs" },
    { taskId: "t2", tagId: "tag_db" },
    { taskId: "t3", tagId: "tag_urgent" },
    { taskId: "t3", tagId: "tag_nextjs" },
  ];

  const [junctionRows, setJunctionRows] = useState<JunctionRow[]>(initialJunctionRows);

  // State Uji Composite PK Feedback
  const [pkTestFeedback, setPkTestFeedback] = useState<{
    status: "idle" | "success" | "error";
    title: string;
    message: string;
    sqlQuery: string;
  }>({
    status: "idle",
    title: "PostgreSQL Ready for Composite PK Test",
    message: 'Tabel task_tags dilindungi oleh PRIMARY KEY (task_id, tag_id). Klik tombol uji di bawah untuk melihat bagaimana kernel PostgreSQL merespons duplikasi.',
    sqlQuery: `-- DDL Pembuktian:\nPRIMARY KEY (task_id, tag_id);`,
  });

  // State perbandingan Anti-Pattern
  const [antiPatternView, setAntiPatternView] = useState<"array_string" | "fk_in_task" | "junction">("junction");

  // Helper Functions
  const isAssigned = (taskId: string, tagId: string) => {
    return junctionRows.some((r) => r.taskId === taskId && r.tagId === tagId);
  };

  const toggleTagAssignment = (taskId: string, tagId: string) => {
    if (isAssigned(taskId, tagId)) {
      setJunctionRows((prev) => prev.filter((r) => !(r.taskId === taskId && r.tagId === tagId)));
    } else {
      setJunctionRows((prev) => [...prev, { taskId, tagId }]);
    }
  };

  // Uji Coba Composite PK: Sukses (Pasangan Baru) vs Gagal (Duplikasi)
  const handleTestCompositePK = (attemptType: "duplicate" | "valid_new") => {
    if (attemptType === "duplicate") {
      // Coba masukkan t1 dan tag_nextjs yang sudah ada
      setPkTestFeedback({
        status: "error",
        title: "❌ ERROR 23505 (unique_violation) — DITOLAK KERAS",
        message: 'PostgreSQL menolak operasi INSERT! Kombinasi pasangan (task_id, tag_id) = (\'t1\', \'tag_nextjs\') sudah tercatat di indeks Composite Primary Key. Integritas database 100% terlindungi dari duplikasi tag ganda pada tugas yang sama.',
        sqlQuery: `INSERT INTO task_tags (task_id, tag_id)\nVALUES ('t1', 'tag_nextjs');\n\n-- ❌ PostgreSQL Kernel Exception:\n-- ERROR: duplicate key value violates unique constraint "task_tags_pkey"\n-- DETAIL: Key (task_id, tag_id)=(t1, tag_nextjs) already exists.`,
      });
    } else {
      // Coba masukkan pasangan baru yang belum ada, misal t1 dengan tag_urgent
      const existingInT1 = junctionRows.filter((r) => r.taskId === "t1").map((r) => r.tagId);
      const availableTag = tags.find((t) => !existingInT1.includes(t.id));

      if (availableTag) {
        setJunctionRows((prev) => [...prev, { taskId: "t1", tagId: availableTag.id }]);
        setPkTestFeedback({
          status: "success",
          title: `✅ 201 CREATED — Pasangan Unik Diterima`,
          message: `Kombinasi pasangan ('t1', '${availableTag.id}') belum pernah ada di tabel task_tags. Primary key komposit meloloskan data karena nilai unik terpenuhi!`,
          sqlQuery: `INSERT INTO task_tags (task_id, tag_id)\nVALUES ('t1', '${availableTag.id}');\n\n-- ✅ STATUS: 201 CREATED\n-- Index B-Tree task_tags_pkey berhasil diperbarui.`,
        });
      } else {
        setPkTestFeedback({
          status: "idle",
          title: "Semua Tag Sudah Terhubung ke Tugas #1",
          message: "Seluruh tag telah dipasangkan ke Tugas #1. Klik Reset Data untuk mencoba kembali.",
          sqlQuery: `-- Semua pasangan (t1, tag_*) sudah aktif di tabel task_tags.`,
        });
      }
    }
  };

  const handleResetData = () => {
    setJunctionRows(initialJunctionRows);
    setPkTestFeedback({
      status: "idle",
      title: "Data Contoh Di-reset ke Awal",
      message: "Tabel task_tags kembali ke 6 relasi awal. Silakan lakukan pengujian kembali.",
      sqlQuery: `-- Status: Reset selesai\nSELECT count(*) FROM task_tags; -- Output: 6`,
    });
  };

  const currentTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];
  const currentTag = tags.find((t) => t.id === selectedTagId) || tags[0];

  // Relasi aktif untuk query 2 arah
  const activeTagsForSelectedTask = junctionRows
    .filter((r) => r.taskId === selectedTaskId)
    .map((r) => tags.find((t) => t.id === r.tagId)!)
    .filter(Boolean);

  const activeTasksForSelectedTag = junctionRows
    .filter((r) => r.tagId === selectedTagId)
    .map((r) => tasks.find((t) => t.id === r.taskId)!)
    .filter(Boolean);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* 1. Header & Badge Navigasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
              Pilar 1.3: Relasi M:N & Junction Table
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              task_tags ↔ PRIMARY KEY (task_id, tag_id)
            </span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Interaktif Relasi Banyak-ke-Banyak (M:N) & Junction Table
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Pelajari dekomposisi relasi M:N, perlindungan kunci komposit dari duplikasi, dan kemampuan query relasional dua arah.
          </p>
        </div>

        {/* Tab Switcher 3 Pilar Teori */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("query_two_way")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "query_two_way"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>1. Query 2-Arah</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("composite_pk")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "composite_pk"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>2. Kunci Komposit</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("why_junction")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "why_junction"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>3. Mengapa Junction?</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: EKSPLORASI QUERY 2-ARAH (PERSPEKTIF TUGAS VS TAG)       */}
      {/* ============================================================== */}
      {activeTab === "query_two_way" && (
        <div className="space-y-6">
          {/* Sub-Header Kontrol Sudut Pandang */}
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Poin Teori 3: Efisiensi Indeks Bawaan & Pencarian Dua Arah
              </span>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                Relasi M:N yang benar memungkinkan kita mencari data dari <strong>dua arah</strong> dengan kecepatan O(log N):
              </p>
            </div>

            <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700 shrink-0">
              <button
                type="button"
                onClick={() => setQueryPerspective("by_task")}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  queryPerspective === "by_task"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                Arah A: Dari Tugas ➔ Tag
              </button>
              <button
                type="button"
                onClick={() => setQueryPerspective("by_tag")}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  queryPerspective === "by_tag"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                Arah B: Dari Tag ➔ Daftar Tugas
              </button>
            </div>
          </div>

          {/* Arsitektur 3 Kolom */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            {/* Kolom 1: Tabel tasks */}
            <div className={`p-4 rounded-xl border transition-all space-y-3 ${
              queryPerspective === "by_task"
                ? "border-blue-500/70 bg-blue-50/20 dark:bg-blue-950/20 shadow-xs"
                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60"
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-blue-500" />
                  1. Tabel tasks (Kiri)
                </span>
                <Badge variant="outline" className="text-[10px] font-mono">3 Tugas</Badge>
              </div>

              <p className="text-[11px] text-zinc-500">
                {queryPerspective === "by_task" 
                  ? "Pilih salah satu tugas untuk melihat tag yang menempel:"
                  : "Tugas yang tersorot memiliki tag yang Anda pilih di kolom kanan:"}
              </p>

              <div className="space-y-2">
                {tasks.map((task) => {
                  const isSelected = selectedTaskId === task.id;
                  const hasCurrentTag = activeTasksForSelectedTag.some((t) => t.id === task.id);
                  const isHighlighted = queryPerspective === "by_task" ? isSelected : hasCurrentTag;

                  return (
                    <div
                      key={task.id}
                      onClick={() => {
                        if (queryPerspective === "by_task") setSelectedTaskId(task.id);
                      }}
                      className={`p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                        isHighlighted
                          ? "bg-blue-500/10 dark:bg-blue-500/20 border-blue-500 text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs"
                          : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono mb-0.5">
                        <span>id: {task.id}</span>
                        {isHighlighted && <Badge className="bg-blue-600 text-white text-[9px] py-0 px-1">Aktif</Badge>}
                      </div>
                      <div>{task.title}</div>
                    </div>
                  );
                })}
              </div>

              {queryPerspective === "by_task" && (
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700/60 space-y-1.5">
                  <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block">
                    Tambah / Cabut Tag untuk {currentTask.id}:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => {
                      const assigned = isAssigned(selectedTaskId, tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTagAssignment(selectedTaskId, tag.id)}
                          className={`px-2 py-0.5 rounded text-[11px] border transition-all flex items-center gap-1 cursor-pointer ${
                            assigned
                              ? "bg-emerald-500 text-white border-emerald-600 font-medium"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                          }`}
                        >
                          <Tag className="w-2.5 h-2.5" />
                          <span>{tag.name}</span>
                          <span>{assigned ? "✓" : "+"}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Kolom 2: Tabel Perantara task_tags (Junction) */}
            <div className="p-4 rounded-xl border border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <Network className="w-4 h-4 text-emerald-500" />
                  2. Junction: task_tags (Tengah)
                </span>
                <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px]">
                  {junctionRows.length} Pasangan
                </Badge>
              </div>

              <p className="text-[11px] text-zinc-500 leading-tight">
                Hanya menyimpan kunci referensi <code>(task_id, tag_id)</code>:
              </p>

              <div className="space-y-1.5 text-xs font-mono max-h-56 overflow-y-auto pr-1">
                {junctionRows.map((row) => {
                  const tagObj = tags.find((t) => t.id === row.tagId);
                  const isMatchTask = row.taskId === selectedTaskId;
                  const isMatchTag = row.tagId === selectedTagId;
                  const isMatch = queryPerspective === "by_task" ? isMatchTask : isMatchTag;

                  return (
                    <motion.div
                      key={`${row.taskId}-${row.tagId}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-2 rounded-lg border flex items-center justify-between transition-all ${
                        isMatch
                          ? "bg-white dark:bg-zinc-800 border-emerald-500 dark:border-emerald-500 text-zinc-900 dark:text-zinc-100 shadow-xs font-medium"
                          : "bg-zinc-100/50 dark:bg-zinc-800/30 border-zinc-200/80 dark:border-zinc-700/40 text-zinc-400 opacity-50"
                      }`}
                    >
                      <div>
                        <span className="font-bold">{row.taskId}</span> ↔ <span>{row.tagId}</span>
                        <div className="text-[10px] text-zinc-500">
                          {tagObj ? tagObj.name : row.tagId}
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-[9px] ${isMatch ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : ""}`}>
                        PK Composite
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>

              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-300">
                💡 <strong>Dekomposisi Berhasil:</strong> 1 tugas bisa punya banyak tag, dan 1 tag bisa menempel di banyak tugas tanpa duplikasi judul!
              </div>
            </div>

            {/* Kolom 3: Tabel tags (Master Tag) */}
            <div className={`p-4 rounded-xl border transition-all space-y-3 ${
              queryPerspective === "by_tag"
                ? "border-purple-500/70 bg-purple-50/20 dark:bg-purple-950/20 shadow-xs"
                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60"
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-purple-500" />
                  3. Tabel tags (Kanan)
                </span>
                <span className="font-mono text-zinc-400 text-[11px]">Master Kategori</span>
              </div>

              <p className="text-[11px] text-zinc-500">
                {queryPerspective === "by_tag"
                  ? "Klik salah satu tag untuk menyaring tugas terkait:"
                  : "Tag yang tersorot adalah milik tugas aktif di kolom kiri:"}
              </p>

              <div className="space-y-2">
                {tags.map((tag) => {
                  const isSelected = selectedTagId === tag.id;
                  const isBelongingToTask = activeTagsForSelectedTask.some((t) => t.id === tag.id);
                  const isHighlighted = queryPerspective === "by_tag" ? isSelected : isBelongingToTask;

                  return (
                    <div
                      key={tag.id}
                      onClick={() => {
                        if (queryPerspective === "by_tag") setSelectedTagId(tag.id);
                      }}
                      className={`p-2.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between ${
                        isHighlighted
                          ? "bg-purple-500/10 dark:bg-purple-500/20 border-purple-500 text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs"
                          : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
                      }`}
                    >
                      <div>
                        <div className="text-[10px] text-zinc-500 font-mono">id: {tag.id}</div>
                        <div className="pt-0.5">{tag.name}</div>
                      </div>
                      {isHighlighted && (
                        <Badge className="bg-purple-600 text-white text-[9px] py-0 px-1">
                          {queryPerspective === "by_tag" ? "Filter Aktif" : "Menempel"}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-zinc-500 leading-relaxed pt-1">
                Data master tag hanya disimpan 1 kali. Jika nama diubah (misal: "Next.js 16" ➔ "Next.js 17"), seluruh tugas otomatis merujuk ke data teranyar.
              </p>
            </div>
          </div>

          {/* Live SQL Query Display yang Menjelaskan Poin 3 */}
          <div className="p-4 rounded-xl border border-zinc-800 bg-[#1e1e1e] text-zinc-200 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-zinc-800 text-[11px]">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Terminal className="w-3.5 h-3.5" />
                Query SQL yang Dijalankan ({queryPerspective === "by_task" ? "Perspektif A: Cari Tag Milik Tugas" : "Perspektif B: Cari Tugas Berdasarkan Tag"}):
              </span>
              <span className="text-zinc-500">PostgreSQL Join Engine</span>
            </div>
            {queryPerspective === "by_task" ? (
              <pre className="text-zinc-300 leading-relaxed overflow-x-auto">
                <code>{`-- 🔍 Cari seluruh label/tag untuk tugas '${currentTask.id}':
SELECT t.id AS task_id, t.title, tg.name AS tag_name
FROM tasks t
JOIN task_tags tt ON t.id = tt.task_id
JOIN tags tg      ON tg.id = tt.tag_id
WHERE t.id = '${selectedTaskId}';

-- 📊 Hasil Query: Ditemukan ${activeTagsForSelectedTask.length} tag (${activeTagsForSelectedTask.map((t) => t.name).join(", ") || "Belum ada tag"})`}</code>
              </pre>
            ) : (
              <pre className="text-zinc-300 leading-relaxed overflow-x-auto">
                <code>{`-- 🔍 Cari seluruh tugas yang diberi label '${currentTag.name}':
SELECT t.id AS task_id, t.title, t.status
FROM tasks t
JOIN task_tags tt ON t.id = tt.task_id
WHERE tt.tag_id = '${selectedTagId}';

-- 📊 Hasil Query: Ditemukan ${activeTasksForSelectedTag.length} tugas (${activeTasksForSelectedTag.map((t) => t.id).join(", ") || "Tidak ada tugas"})`}</code>
              </pre>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: UJI KUNCI KOMPOSIT (SIMULASI DUPLIKASI & ERROR 23505)   */}
      {/* ============================================================== */}
      {activeTab === "composite_pk" && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Poin Teori 2: Kunci Primer Komposit (Composite Primary Key)
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
              Di tabel perantara, kunci primer dibentuk oleh <strong>gabungan 2 kolom</strong>: <code>PRIMARY KEY (task_id, tag_id)</code>.
              Ini menjamin bahwa pasangan ID yang sama tidak akan pernah bisa diduplikasi oleh aplikasi atau pengguna jahat.
            </p>
          </div>

          {/* Simulator Test Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box Kiri: Pengujian Operasi INSERT */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4">
              <div>
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
                  Uji Coba Kernel PostgreSQL:
                </span>
                <span className="text-[11px] text-zinc-500">
                  Target Tugas: <strong>Tugas #1 (Setup GitHub OAuth Login)</strong>
                </span>
              </div>

              {/* Tag Yang Sedang Terpasang di Tugas #1 */}
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-1.5">
                <span className="text-[10px] text-zinc-500 font-mono uppercase font-bold block">
                  Tag yang SUDAH ADA di Tugas #1:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {junctionRows.filter((r) => r.taskId === "t1").map((r) => {
                    const tagObj = tags.find((t) => t.id === r.tagId);
                    return (
                      <Badge key={r.tagId} variant="outline" className="text-xs font-mono bg-white dark:bg-zinc-900">
                        {r.tagId} ({tagObj?.name})
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Tombol Uji Coba */}
              <div className="space-y-2 pt-1">
                <Button
                  type="button"
                  onClick={() => handleTestCompositePK("duplicate")}
                  variant="destructive"
                  className="w-full justify-start text-xs cursor-pointer font-bold"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  1. Uji Pelanggaran Duplikasi: INSERT (t1, tag_nextjs) lagi!
                </Button>

                <Button
                  type="button"
                  onClick={() => handleTestCompositePK("valid_new")}
                  className="w-full justify-start text-xs cursor-pointer font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  2. Uji Pasangan Unik: INSERT Tag Baru yang Belum Ada
                </Button>

                <Button
                  type="button"
                  onClick={handleResetData}
                  variant="outline"
                  className="w-full justify-start text-xs cursor-pointer text-zinc-600 dark:text-zinc-400"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-2" />
                  Reset Tabel task_tags
                </Button>
              </div>
            </div>

            {/* Box Kanan: Terminal Output & Feedback */}
            <div className="space-y-3">
              <div className={`p-4 rounded-xl border transition-all ${
                pkTestFeedback.status === "error"
                  ? "border-red-500/60 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-200"
                  : pkTestFeedback.status === "success"
                  ? "border-emerald-500/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300"
              }`}>
                <div className="flex items-center gap-2 font-bold text-xs">
                  {pkTestFeedback.status === "error" && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                  {pkTestFeedback.status === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                  {pkTestFeedback.status === "idle" && <Terminal className="w-4 h-4 text-zinc-500 shrink-0" />}
                  <span>{pkTestFeedback.title}</span>
                </div>
                <p className="text-xs mt-1.5 leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {pkTestFeedback.message}
                </p>
              </div>

              {/* Console Code */}
              <div className="p-3.5 rounded-xl border border-zinc-800 bg-[#1e1e1e] text-zinc-200 font-mono text-xs">
                <div className="flex items-center justify-between text-zinc-500 pb-1.5 border-b border-zinc-800 text-[11px]">
                  <span>Log Eksekusi SQL:</span>
                  <span className={pkTestFeedback.status === "error" ? "text-red-400" : "text-emerald-400"}>
                    {pkTestFeedback.status === "error" ? "VIOLATION" : "SUCCESS"}
                  </span>
                </div>
                <pre className={`mt-2 leading-relaxed whitespace-pre-wrap ${
                  pkTestFeedback.status === "error" ? "text-red-400" : "text-emerald-400"
                }`}>
                  <code>{pkTestFeedback.sqlQuery}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: MENGAPA BUTUH JUNCTION TABLE? (PROBLEM VS SOLUTION)     */}
      {/* ============================================================== */}
      {activeTab === "why_junction" && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-500" />
              Poin Teori 1: Mengapa Relasi Banyak-ke-Banyak Harus Didekomposisi?
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
              Bandingkan 3 pendekatan berikut untuk memahami mengapa arsitektur <strong>Junction Table</strong> adalah standar industri satu-satunya di basis data relasional:
            </p>
          </div>

          {/* Sub Switcher 3 Pendekatan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setAntiPatternView("fk_in_task")}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                antiPatternView === "fk_in_task"
                  ? "border-red-500 bg-red-500/10 text-red-900 dark:text-red-200 shadow-xs"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400">
                <XCircle className="w-3.5 h-3.5" />
                Anti-Pattern A
              </div>
              <div className="text-xs font-semibold mt-1">Taruh Foreign Key di Tabel Tasks</div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Kolom <code>tasks.tag_id</code> memaksa 1 tugas hanya boleh memiliki 1 label.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setAntiPatternView("array_string")}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                antiPatternView === "array_string"
                  ? "border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200 shadow-xs"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                Anti-Pattern B
              </div>
              <div className="text-xs font-semibold mt-1">Simpan Teks Koma (CSV String)</div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Menyimpan string <code>"Next.js, Auth"</code> di satu kolom teks mentah.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setAntiPatternView("junction")}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                antiPatternView === "junction"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 shadow-xs"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Best Practice (Standar)
              </div>
              <div className="text-xs font-semibold mt-1">Junction Table (task_tags)</div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Dekomposisi menjadi 3 tabel bersih dengan referensial foreign key penuh.
              </p>
            </button>
          </div>

          {/* Tampilan Detail Perbandingan */}
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4">
            {antiPatternView === "fk_in_task" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="destructive" className="text-xs font-bold">
                    ❌ Anti-Pattern: Menaruh tag_id di Tabel tasks
                  </Badge>
                  <span className="text-xs text-red-500 font-mono">Pelanggaran 1st Normal Form</span>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-900 dark:text-red-200 leading-relaxed">
                  <strong>Mengapa Gagal?</strong> Jika Tugas 1 ("Setup GitHub OAuth Login") membutuhkan 2 tag sekaligus ("Next.js 16" dan "Authentication"), Anda terpaksa menduplikasi baris tugas:
                </div>
                <div className="overflow-x-auto text-xs font-mono">
                  <table className="w-full border-collapse border border-zinc-300 dark:border-zinc-700">
                    <thead className="bg-zinc-100 dark:bg-zinc-800">
                      <tr>
                        <th className="border p-2 text-left">id</th>
                        <th className="border p-2 text-left">title</th>
                        <th className="border p-2 text-left text-red-500">tag_id (Duplikasi!)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-red-500/5">
                        <td className="border p-2">t1</td>
                        <td className="border p-2">Setup GitHub OAuth Login</td>
                        <td className="border p-2 text-red-600 font-bold">tag_nextjs</td>
                      </tr>
                      <tr className="bg-red-500/5">
                        <td className="border p-2">t1</td>
                        <td className="border p-2">Setup GitHub OAuth Login (Duplikat!)</td>
                        <td className="border p-2 text-red-600 font-bold">tag_auth</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-zinc-500">
                  ⚠️ <strong>Bahaya Inkonsistensi:</strong> Jika judul tugas diedit di baris 1 tapi lupa diupdate di baris 2, database menjadi korup dan data tidak konsisten!
                </p>
              </div>
            )}

            {antiPatternView === "array_string" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-amber-500 text-white text-xs font-bold">
                    ⚠️ Anti-Pattern: String Teks Koma (CSV)
                  </Badge>
                  <span className="text-xs text-amber-500 font-mono">Kehilangan Integritas Relasional</span>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  <strong>Mengapa Buruk?</strong> Kolom teks <code>tags = &quot;Next.js, Auth, Urgent&quot;</code> membuat database kehilangan seluruh kekuatan relasionalnya:
                </div>
                <ul className="text-xs space-y-1.5 text-zinc-600 dark:text-zinc-300 list-disc list-inside">
                  <li><strong>Tidak Ada Foreign Key:</strong> Pengguna bisa salah ketik <code>&quot;Nextjs&quot;</code> atau <code>&quot;Nxt.js&quot;</code> dan database tidak bisa menolaknya.</li>
                  <li><strong>Query Sangat Lambat:</strong> Untuk mencari tugas berlabel Next.js, Anda harus menjalankan <code>WHERE tags LIKE &apos;%Next.js%&apos;</code> yang melakukan <em>Full Table Scan</em> (O(N)) dan memakan CPU server.</li>
                  <li><strong>Tidak Bisa Menghapus Bersih:</strong> Jika tag &quot;Next.js&quot; dihapus dari master, string di dalam tabel tugas akan tertinggal sebagai data sampah.</li>
                </ul>
              </div>
            )}

            {antiPatternView === "junction" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-emerald-600 text-white text-xs font-bold">
                    ✅ Best Practice: Dekomposisi Junction Table (task_tags)
                  </Badge>
                  <span className="text-xs text-emerald-500 font-mono">Standar PostgreSQL</span>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                  <strong>Keunggulan Absolut:</strong> Membagi data menjadi 3 tabel terpisah:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100">1. Tabel tasks</div>
                    <p className="text-[11px] text-zinc-500 mt-1">1 baris per tugas. Judul tidak pernah terduplikasi.</p>
                  </div>
                  <div className="p-3 rounded-lg border border-emerald-500/40 bg-emerald-500/5">
                    <div className="font-bold text-emerald-700 dark:text-emerald-400">2. Tabel task_tags</div>
                    <p className="text-[11px] text-zinc-500 mt-1">Hanya mencatat relasi (task_id, tag_id). Fleksibel tanpa batas.</p>
                  </div>
                  <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100">3. Tabel tags</div>
                    <p className="text-[11px] text-zinc-500 mt-1">Master kategori resmi. Ubah 1 nama tag, semua tugas terupdate otomatis.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DDL Schema Code Footer */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-[#1e1e1e] text-zinc-200 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-zinc-800 text-[11px]">
          <span>DDL Skema Relasional M:N (3 Tabel Standar PostgreSQL):</span>
          <span className="text-emerald-400 font-semibold">Production Ready</span>
        </div>
        <pre className="text-emerald-400 leading-relaxed overflow-x-auto">
          <code>{`-- 1️⃣ Tabel Induk Tugas
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL
);

-- 2️⃣ Tabel Master Label
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

-- 3️⃣ Tabel Perantara (Junction Table M:N)
CREATE TABLE task_tags (
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  -- 🔒 Composite Primary Key: Menjamin pasangan unik & mengindeks 2 arah otomatis
  PRIMARY KEY (task_id, tag_id)
);`}</code>
        </pre>
      </div>
    </div>
  );
}
