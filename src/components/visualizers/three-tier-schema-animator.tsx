"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, 
  Key, 
  Layers, 
  ArrowRight, 
  FolderGit2, 
  CheckSquare, 
  User,
  ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ThreeTierSchemaAnimator() {
  const [activeTable, setActiveTable] = useState<"profiles" | "projects" | "tasks">("projects");

  const tables = [
    {
      id: "profiles" as const,
      name: "1. profiles",
      badge: "User Extension",
      icon: User,
      color: "emerald",
      desc: "Menyimpan profil publik yang terikat langsung ke akun otentikasi Supabase (auth.users).",
      columns: [
        { name: "id", type: "UUID (PK)", desc: "REFERENCES auth.users(id)" },
        { name: "full_name", type: "TEXT", desc: "Nama lengkap pengguna" },
        { name: "avatar_url", type: "TEXT", desc: "Link gambar profil" },
        { name: "created_at", type: "TIMESTAMPTZ", desc: "DEFAULT now()" },
      ],
    },
    {
      id: "projects" as const,
      name: "2. projects",
      badge: "Workspace Unit",
      icon: FolderGit2,
      color: "blue",
      desc: "Wadah utama tempat tugas-tugas dikelompokkan. Terikat ke profiles via user_id.",
      columns: [
        { name: "id", type: "UUID (PK)", desc: "DEFAULT gen_random_uuid()" },
        { name: "user_id", type: "UUID (FK)", desc: "REFERENCES profiles(id) ON DELETE CASCADE" },
        { name: "title", type: "TEXT (NOT NULL)", desc: "Nama proyek perkuliahan" },
        { name: "created_at", type: "TIMESTAMPTZ", desc: "DEFAULT now()" },
      ],
    },
    {
      id: "tasks" as const,
      name: "3. tasks",
      badge: "Action Items",
      icon: CheckSquare,
      color: "purple",
      desc: "Daftar pekerjaan dalam proyek. Terikat ke projects via project_id.",
      columns: [
        { name: "id", type: "UUID (PK)", desc: "DEFAULT gen_random_uuid()" },
        { name: "project_id", type: "UUID (FK)", desc: "REFERENCES projects(id) ON DELETE CASCADE" },
        { name: "title", type: "TEXT (NOT NULL)", desc: "Judul pekerjaan" },
        { name: "status", type: "TEXT (CHECK)", desc: "IN ('todo', 'in_progress', 'done')" },
      ],
    },
  ];

  const current = tables.find((t) => t.id === activeTable)!;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
              Pilar 4.1: Final Project Blueprint
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">ERD 3 Tabel Inti</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Diagram Relasi Entitas (ERD): 3 Tabel Utama Proyek Akhir
          </h4>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Integritas Referensial Bertingkat</span>
        </div>
      </div>

      {/* 3 Tables Flow Navigator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tables.map((t, idx) => {
          const Icon = t.icon;
          const isSelected = activeTable === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTable(t.id)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between space-y-2 cursor-pointer ${
                isSelected
                  ? "bg-white dark:bg-zinc-800 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                  : "bg-zinc-100/60 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${
                  isSelected ? "bg-emerald-600 text-white" : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {t.badge}
                </Badge>
              </div>

              <div>
                <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{t.name}</h5>
                <p className="text-[11px] text-zinc-500 line-clamp-1">{t.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Table Schema Detail */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
          <span>Struktur Kolom Tabel: {current.name}</span>
          <span className="font-mono text-zinc-400">PostgreSQL Schema Inspector</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 text-left border-b border-zinc-200 dark:border-zinc-700">
                <th className="p-2.5">Nama Kolom</th>
                <th className="p-2.5">Tipe Data &amp; Kunci</th>
                <th className="p-2.5">Keterangan Constraint</th>
              </tr>
            </thead>
            <tbody>
              {current.columns.map((col, cIdx) => (
                <tr
                  key={cIdx}
                  className="border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <td className="p-2.5 font-bold text-zinc-900 dark:text-zinc-100">{col.name}</td>
                  <td className="p-2.5 text-emerald-600 dark:text-emerald-400">{col.type}</td>
                  <td className="p-2.5 text-zinc-500 dark:text-zinc-400">{col.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-[11px] text-zinc-500 pt-1">
          💡 <strong>Hubungan Antar Tabel:</strong> Menghapus baris di tabel <code>profiles</code> otomatis menghapus seluruh baris terkait di tabel <code>projects</code> dan seluruh <code>tasks</code> di dalamnya tanpa meninggalkan orphaned records.
        </div>
      </div>
    </div>
  );
}
