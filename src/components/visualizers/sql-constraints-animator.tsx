"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertOctagon, 
  Database, 
  Play, 
  RotateCcw,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SqlConstraintsAnimator() {
  const [title, setTitle] = useState("Sistem Manajemen Toko");
  const [email, setEmail] = useState("budi@gmail.com");
  const [budget, setBudget] = useState("5000000");

  const [dbStatus, setDbStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorDetail, setErrorDetail] = useState<{ constraint: string; message: string } | null>(null);

  const existingEmails = ["sarah@resistance.org", "admin@supabase.io"];

  const handleTestInsert = () => {
    // 1. Check NOT NULL constraint
    if (!title.trim()) {
      setDbStatus("error");
      setErrorDetail({
        constraint: "NOT NULL Violation",
        message: 'ERROR 23502: null value in column "title" of relation "projects" violates not-null constraint. Failing row contains (null, ...).',
      });
      return;
    }

    // 2. Check UNIQUE constraint
    if (existingEmails.includes(email.trim().toLowerCase())) {
      setDbStatus("error");
      setErrorDetail({
        constraint: "UNIQUE Violation",
        message: `ERROR 23505: duplicate key value violates unique constraint "profiles_email_key". Key (email)=(${email}) already exists.`,
      });
      return;
    }

    // 3. Check CHECK constraint
    const parsedBudget = Number(budget);
    if (isNaN(parsedBudget) || parsedBudget <= 0) {
      setDbStatus("error");
      setErrorDetail({
        constraint: "CHECK (budget > 0) Violation",
        message: `ERROR 23514: new row for relation "projects" violates check constraint "projects_budget_check". Failing value is (${budget}).`,
      });
      return;
    }

    // Success
    setDbStatus("success");
    setErrorDetail(null);
  };

  const handlePresetAttack = (type: "null" | "duplicate" | "negative") => {
    if (type === "null") {
      setTitle("");
      setEmail("user@example.com");
      setBudget("1000000");
    } else if (type === "duplicate") {
      setTitle("Proyek Baru");
      setEmail("sarah@resistance.org"); // Existing email
      setBudget("2000000");
    } else {
      setTitle("Proyek Defisit");
      setEmail("user@example.com");
      setBudget("-250000"); // Negative budget
    }
    setDbStatus("idle");
    setErrorDetail(null);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
              Pilar 2.1: Database-Level Defense
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">NOT NULL, UNIQUE &amp; CHECK</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Penegakan Integritas Data SQL: Uji Coba Pelanggaran Constraint
          </h4>
        </div>

        {/* Quick Attack Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-zinc-500 font-medium">Uji Coba Anomali:</span>
          <button
            type="button"
            onClick={() => handlePresetAttack("null")}
            className="px-2 py-1 rounded bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300 text-[11px] font-mono font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            Title Kosong
          </button>
          <button
            type="button"
            onClick={() => handlePresetAttack("duplicate")}
            className="px-2 py-1 rounded bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300 text-[11px] font-mono font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            Email Duplikat
          </button>
          <button
            type="button"
            onClick={() => handlePresetAttack("negative")}
            className="px-2 py-1 rounded bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300 text-[11px] font-mono font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            Budget Minus
          </button>
        </div>
      </div>

      {/* Interactive Form & Result Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Input Payload */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
          <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            Simulasi Payload Data Input:
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="text-[11px] font-mono text-zinc-500 block mb-1">
                title (NOT NULL):
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul tidak boleh kosong..."
                className="w-full text-xs font-mono p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-500 block mb-1">
                email (UNIQUE):
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email unik pengguna..."
                className="w-full text-xs font-mono p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-emerald-500"
              />
              <span className="text-[10px] text-zinc-400">Email terdaftar di DB: sarah@resistance.org</span>
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-500 block mb-1">
                budget (CHECK &gt; 0):
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Nominal budget..."
                className="w-full text-xs font-mono p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-emerald-500"
              />
            </div>

            <Button
              size="sm"
              onClick={handleTestInsert}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5 shadow-xs mt-2"
            >
              <Play className="w-3.5 h-3.5" />
              Kirim Query INSERT ke PostgreSQL
            </Button>
          </div>
        </div>

        {/* Right: Database Engine Response */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#1e1e1e] text-zinc-200 font-mono text-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-zinc-800 text-[11px]">
              <span>PostgreSQL SQL Engine Output</span>
              <span className={dbStatus === "success" ? "text-emerald-400" : dbStatus === "error" ? "text-red-400" : "text-zinc-400"}>
                {dbStatus === "success" ? "COMMIT (SUCCESS)" : dbStatus === "error" ? "ROLLBACK (VIOLATION)" : "WAITING FOR QUERY"}
              </span>
            </div>

            <div className="min-h-[140px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {dbStatus === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 w-full space-y-1.5 text-left"
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>INSERT 0 1 — Transaksi Berhasil!</span>
                    </div>
                    <p className="text-[11px] text-emerald-400/80 leading-relaxed font-sans">
                      Seluruh data valid dan mematuhi aturan skema PostgreSQL. Baris baru disimpan permanen ke disk.
                    </p>
                  </motion.div>
                ) : dbStatus === "error" && errorDetail ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3.5 rounded-lg bg-red-950/80 border border-red-500/50 text-red-300 w-full space-y-1.5 text-left"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-red-400">
                      <AlertOctagon className="w-4 h-4 shrink-0" />
                      <span>{errorDetail.constraint}</span>
                    </div>
                    <pre className="text-[10px] text-red-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {errorDetail.message}
                    </pre>
                  </motion.div>
                ) : (
                  <div className="text-zinc-500 text-center text-xs space-y-1">
                    <Database className="w-6 h-6 mx-auto opacity-50" />
                    <div>Siap mengevaluasi query INSERT.</div>
                    <div className="text-[11px]">Tekan tombol &quot;Kirim Query&quot; atau pilih preset di atas.</div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="text-[11px] font-sans text-zinc-400 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
            🛡️ <strong>Integritas Database:</strong> Validasi JavaScript di browser dapat dibobol via Postman/Curl. Namun SQL constraints di PostgreSQL tidak pernah bisa dibypass oleh siapapun.
          </div>
        </div>
      </div>
    </div>
  );
}
