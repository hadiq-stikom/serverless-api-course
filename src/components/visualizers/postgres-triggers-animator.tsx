"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Clock, 
  RotateCcw, 
  CheckCircle2, 
  Database, 
  ArrowRight,
  Code,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PostgresTriggersAnimator() {
  const [projectTitle, setProjectTitle] = useState("Sistem Pembayaran E-Commerce");
  const [updatedAt, setUpdatedAt] = useState("2026-09-23 08:30:00 UTC");
  const [triggerFired, setTriggerFired] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);

  const handleUpdate = () => {
    setTriggerFired(true);
    setUpdateCount((c) => c + 1);

    const now = new Date();
    const formatted = now.toISOString().replace("T", " ").substring(0, 19) + " UTC";
    setUpdatedAt(formatted);

    setTimeout(() => {
      setTriggerFired(false);
    }, 2000);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
              Pilar 2.3: Database Automation
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">BEFORE UPDATE Triggers</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi PostgreSQL Trigger: Pembaruan Otomatis Kolom updated_at
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
            Total Update: {updateCount}x
          </Badge>
        </div>
      </div>

      {/* Row Record Inspector */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            Baris Data Tabel projects:
          </div>

          <Button
            size="sm"
            onClick={handleUpdate}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Jalankan Query UPDATE (Simulasi Edit Data)
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-1">
            <span className="text-[10px] text-zinc-400 block">Kolom: title</span>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded p-1.5 text-zinc-900 dark:text-zinc-100 font-bold focus:outline-emerald-500"
            />
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-1">
            <span className="text-[10px] text-zinc-400 block">Kolom: created_at</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-bold block pt-1">
              2026-09-23 08:00:00 UTC
            </span>
            <span className="text-[10px] text-zinc-400">(Konstan / Tidak Berubah)</span>
          </div>

          {/* updated_at with Trigger Highlight */}
          <motion.div
            animate={{
              borderColor: triggerFired ? "#10b981" : "#e4e4e7",
              scale: triggerFired ? 1.03 : 1,
            }}
            className={`p-3 rounded-lg border transition-all space-y-1 ${
              triggerFired
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20"
                : "bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 block">Kolom: updated_at</span>
              {triggerFired && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 animate-bounce" />
                  TRIGGER FIRED!
                </span>
              )}
            </div>
            <span className="font-bold block pt-1 font-mono text-zinc-900 dark:text-zinc-100">
              {updatedAt}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans block">
              Di-update otomatis oleh database engine
            </span>
          </motion.div>
        </div>
      </div>

      {/* SQL DDL Definition Snippet */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#1e1e1e] text-zinc-200 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-zinc-800 text-[11px]">
          <span>SQL Trigger Function di PostgreSQL:</span>
          <span className="text-emerald-400">Zero Maintenance</span>
        </div>
        <pre className="text-emerald-400 leading-relaxed overflow-x-auto">
          <code>{`-- 1. Buat fungsi otomasi timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Pasang trigger ke tabel projects
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();`}</code>
        </pre>
      </div>
    </div>
  );
}
