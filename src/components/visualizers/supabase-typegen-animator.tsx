"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileCode, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Code2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SupabaseTypegenAnimator() {
  const [isGenerated, setIsGenerated] = useState(true);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
              Pilar 4.2: End-to-End Type Safety
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">supabase gen types typescript</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Otomasi Typegen: Generasi Tipe TypeScript dari Skema PostgreSQL
          </h4>
        </div>

        <Button
          size="sm"
          onClick={() => setIsGenerated((prev) => !prev)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {isGenerated ? "Regenerasi Tipe" : "Jalankan CLI Typegen"}
        </Button>
      </div>

      {/* Terminal Command Bar */}
      <div className="p-3.5 rounded-xl bg-[#1e1e1e] text-zinc-100 font-mono text-xs flex items-center justify-between border border-zinc-800 shadow-inner">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-emerald-400">$</span>
          <span className="text-zinc-200">
            npx supabase gen types typescript --project-id abcxyz &gt; src/types/database.types.ts
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] text-zinc-400 hidden sm:inline">Supabase CLI</Badge>
      </div>

      {/* Code Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Generated Type Definition File */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
            <span className="flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-emerald-500" />
              src/types/database.types.ts (Auto-generated)
            </span>
            <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">100% Type-Safe</Badge>
          </div>

          <pre className="p-3 rounded-lg bg-[#1e1e1e] text-zinc-200 text-xs font-mono overflow-x-auto leading-relaxed border border-zinc-800 max-h-56">
            <code>{`export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string; // UUID
          user_id: string;
          title: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          created_at?: string;
        };
        Update: {
          title?: string;
        };
      };
    };
  };
};`}</code>
          </pre>
        </div>

        {/* Right: Autocomplete in VS Code */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <span>Keuntungan di Editor VS Code Pengembang:</span>
              <span className="font-mono text-zinc-400 text-[11px]">IntelliSense Active</span>
            </div>

            <pre className="p-3 rounded-lg bg-[#1e1e1e] text-zinc-200 text-xs font-mono overflow-x-auto leading-relaxed border border-zinc-800">
              <code>{`// Inisialisasi klien dengan generic Database:
const supabase = createClient<Database>();

// ✨ Autocomplete muncul otomatis saat mengetik:
const { data } = await supabase
  .from("projects") // Tidak bisa salah ketik nama tabel
  .select("id, title, user_id");

// data bertipe: { id: string; title: string; user_id: string }[]`}</code>
            </pre>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Menghilangkan kesalahan ketik (*typo*) nama kolom dan menjamin kepatuhan tipe dari database hingga antarmuka React!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
