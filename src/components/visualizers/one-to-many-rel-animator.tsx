"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GitFork, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  User, 
  FolderGit2,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function OneToManyRelAnimator() {
  const [cascadeMode, setCascadeMode] = useState<"cascade" | "restrict">("cascade");
  const [userDeleted, setUserDeleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialProjects = [
    { id: "p1", title: "Serverless LMS Platform", status: "Active" },
    { id: "p2", title: "Supabase Realtime Chat", status: "In Progress" },
    { id: "p3", title: "AI Media Generator", status: "Active" },
  ];

  const [projects, setProjects] = useState(initialProjects);

  const handleDeleteUser = () => {
    if (cascadeMode === "restrict") {
      setErrorMessage('ERROR: update or delete on table "profiles" violates foreign key constraint "projects_user_id_fkey" on table "projects". Key (id)=(usr_01) is still referenced.');
      return;
    }

    setErrorMessage(null);
    setUserDeleted(true);
    // ON DELETE CASCADE automatically clears child projects
    setProjects([]);
  };

  const handleReset = () => {
    setUserDeleted(false);
    setProjects(initialProjects);
    setErrorMessage(null);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
              Pilar 1.2: Relasi 1:N & Foreign Key
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">ON DELETE CASCADE</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Relasi 1:N & Integritas Referensial ON DELETE CASCADE
          </h4>
        </div>

        {/* Toggle Cascade Mode */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => { setCascadeMode("cascade"); setErrorMessage(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              cascadeMode === "cascade"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            CASCADE (Pembersihan Otomatis)
          </button>
          <button
            type="button"
            onClick={() => { setCascadeMode("restrict"); setErrorMessage(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              cascadeMode === "restrict"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            RESTRICT (Tolak Penghapusan)
          </button>
        </div>
      </div>

      {/* Interactive Relational Visualizer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        {/* Parent Table: profiles */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-500" />
              Tabel Induk: profiles (Parent 1)
            </span>
            <Badge variant="outline" className="text-[10px] font-mono">1 Record</Badge>
          </div>

          <AnimatePresence mode="wait">
            {!userDeleted ? (
              <motion.div
                key="parent-active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 space-y-2 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">id: usr_01</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">PRIMARY KEY</Badge>
                </div>
                <div className="text-zinc-600 dark:text-zinc-300">
                  name: <strong className="text-zinc-900 dark:text-white">&quot;Sarah Connor&quot;</strong>
                </div>
                <div className="text-zinc-400 text-[11px]">email: sarah@resistance.org</div>
              </motion.div>
            ) : (
              <motion.div
                key="parent-deleted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-dashed border-red-300 dark:border-red-800 text-center space-y-1 text-xs"
              >
                <span className="font-bold text-red-600 dark:text-red-400">Record User Dihapus</span>
                <p className="text-[11px] text-zinc-500">Baris id: usr_01 telah dihapus dari tabel profiles.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Trigger */}
          <div className="pt-2 flex items-center justify-between">
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={userDeleted}
              className="text-xs font-semibold gap-1.5 shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus User Sarah (DELETE)
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="text-xs gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Data
            </Button>
          </div>
        </div>

        {/* Child Table: projects */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <FolderGit2 className="w-4 h-4 text-blue-500" />
              Tabel Anak: projects (Child N)
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              user_id REFERENCES profiles(id)
            </span>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {projects.length > 0 ? (
                projects.map((proj) => (
                  <motion.div
                    key={proj.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <div className="font-bold text-zinc-800 dark:text-zinc-200">{proj.title}</div>
                      <div className="text-[10px] text-zinc-400">user_id: usr_01 (FK)</div>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono">{proj.status}</Badge>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-dashed border-zinc-300 dark:border-zinc-800 text-center space-y-1 text-xs text-zinc-400"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                  <div className="font-bold text-zinc-700 dark:text-zinc-300">
                    Seluruh 3 Proyek Terhapus Otomatis (Zero Orphaned Data)
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Klausa ON DELETE CASCADE membersihkan seluruh proyek anak yang terikat ke usr_01.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Error Callout if Restrict Mode triggered */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-red-950/80 text-red-200 border border-red-500/60 font-mono text-xs space-y-1"
        >
          <div className="flex items-center gap-2 font-bold text-red-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>PostgreSQL Integrity Error (RESTRICT Mode)</span>
          </div>
          <p className="text-[11px] leading-relaxed">{errorMessage}</p>
        </motion.div>
      )}

      {/* SQL DDL Definition Snippet */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#1e1e1e] text-zinc-200 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-zinc-800 text-[11px]">
          <span>Definisi Foreign Key SQL:</span>
          <span className="text-emerald-400">PostgreSQL DDL</span>
        </div>
        <pre className="text-emerald-400 leading-relaxed overflow-x-auto">
          <code>{`CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  -- 🔗 Relasi 1:N ke tabel profiles dengan pembersihan otomatis
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);`}</code>
        </pre>
      </div>
    </div>
  );
}
