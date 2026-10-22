"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Crown, 
  User, 
  Trash2, 
  Database, 
  CheckCircle2, 
  XCircle,
  Lock,
  Unlock,
  KeyRound,
  FileCode
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function MultiRoleRbacAnimator() {
  const [activeRole, setActiveRole] = useState<"admin" | "member">("admin");
  const [actionTarget, setActionTarget] = useState<"own_task" | "team_task">("team_task");

  const isAdmin = activeRole === "admin";
  const isOwnTask = actionTarget === "own_task";

  // Evaluasi Otorisasi:
  // Admin boleh hapus tugas milik sendiri dan tugas tim
  // Member HANYA boleh hapus tugas milik sendiri
  const isAllowed = isAdmin || isOwnTask;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-xs font-semibold">
              Pilar 2.4: Pragmatic RBAC
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Admin vs Member</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Otorisasi Multi-Role: Evaluasi Hak Akses CRUD & RLS
          </h4>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveRole("admin")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              isAdmin
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-300" /> 👑 Role: Admin
          </button>
          <button
            type="button"
            onClick={() => setActiveRole("member")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              !isAdmin
                ? "bg-zinc-700 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <User className="w-3.5 h-3.5 text-zinc-300" /> 👤 Role: Member
          </button>
        </div>
      </div>

      {/* Target Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kolom 1: Pilihan Operasi CRUD */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 space-y-3">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
            Pilih Target Operasi Hapus (DELETE Task):
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActionTarget("own_task")}
              className={`p-2.5 rounded-lg text-xs font-bold transition-all border text-left ${
                isOwnTask
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <div className="flex items-center gap-1 font-bold">
                <User className="w-3.5 h-3.5 text-emerald-500" /> Tugas Milik Sendiri
              </div>
              <div className="text-[10px] text-zinc-500 mt-1 font-mono">user_id = auth.uid()</div>
            </button>

            <button
              type="button"
              onClick={() => setActionTarget("team_task")}
              className={`p-2.5 rounded-lg text-xs font-bold transition-all border text-left ${
                !isOwnTask
                  ? "bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-300"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <div className="flex items-center gap-1 font-bold">
                <Trash2 className="w-3.5 h-3.5 text-amber-500" /> Tugas Anggota Tim Lain
              </div>
              <div className="text-[10px] text-zinc-500 mt-1 font-mono">user_id ≠ auth.uid()</div>
            </button>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-300 flex items-center justify-between">
            <span>Sesi Pengguna Aktif:</span>
            <Badge variant="outline" className="font-mono text-[10px]">
              {isAdmin ? "admin@odyssey.id (👑 Admin)" : "member@odyssey.id (👤 Member)"}
            </Badge>
          </div>
        </div>

        {/* Kolom 2: Hasil Evaluasi Otorisasi Real-Time */}
        <div className={`p-4 rounded-xl border transition-all space-y-3 ${
          isAllowed 
            ? "border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20" 
            : "border-rose-500/40 bg-rose-50/40 dark:bg-rose-950/20"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Hasil Evaluasi Keamanan:</span>
            {isAllowed ? (
              <Badge className="bg-emerald-600 text-white font-bold text-[11px] gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> DISETUJUI (200 OK)
              </Badge>
            ) : (
              <Badge className="bg-rose-600 text-white font-bold text-[11px] gap-1">
                <XCircle className="w-3.5 h-3.5" /> DITOLAK (403 Forbidden)
              </Badge>
            )}
          </div>

          <div className="text-xs leading-relaxed space-y-2">
            {isAdmin ? (
              <p className="text-emerald-800 dark:text-emerald-300">
                ✅ <strong>Super-Access Granted:</strong> Sebagai <strong>Admin</strong>, Anda memiliki hak penuh untuk mengelola dan menghapus seluruh tugas proyek tim tanpa batasan baris kepemilikan.
              </p>
            ) : isOwnTask ? (
              <p className="text-emerald-800 dark:text-emerald-300">
                ✅ <strong>Row-Ownership Match:</strong> Sebagai <strong>Member</strong>, Anda diizinkan menghapus tugas ini karena ID pembuat cocok dengan sesi Anda (<code className="font-mono text-[10px] bg-white dark:bg-zinc-800 px-1 py-0.5 rounded">auth.uid() = user_id</code>).
              </p>
            ) : (
              <p className="text-rose-800 dark:text-rose-300">
                ❌ <strong>Access Denied:</strong> Sebagai <strong>Member</strong>, Anda dilarang menghapus tugas milik rekan kerja lain! Server Actions dan PostgreSQL RLS memblokir aksi ini untuk mencegah <em>Privilege Escalation</em>.
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Filter Kueri Database:</span>
            <span className="font-mono font-bold text-[10px] text-zinc-800 dark:text-zinc-200">
              {isAdmin ? "DELETE WHERE id = $1" : "DELETE WHERE id = $1 AND user_id = auth.uid()"}
            </span>
          </div>
        </div>
      </div>

      {/* Arsitektur Visual: Alur Otorisasi 2-Tier */}
      <div className="p-4 rounded-xl bg-zinc-900 text-zinc-100 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-indigo-400" />
            <span>Alur Evaluasi Otorisasi (Server Action & RLS PostgreSQL)</span>
          </div>
          <span className="text-[10px] text-emerald-400">Defense-in-Depth</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
          {/* Sisi Server Action */}
          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5">
            <div className="text-indigo-400 font-bold flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5" /> 1. Server Action (deleteTaskAction)
            </div>
            <p className="text-zinc-400 text-[10px]">
              {isAdmin
                ? "👑 Admin terdeteksi: Bypass filter user_id, hapus langsung by id."
                : "👤 Member terdeteksi: Menambahkan klausul .eq('user_id', user.id)."}
            </p>
          </div>

          {/* Sisi PostgreSQL RLS */}
          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5">
            <div className="text-teal-400 font-bold flex items-center gap-1">
              <Database className="w-3.5 h-3.5" /> 2. PostgreSQL RLS Engine
            </div>
            <p className="text-zinc-400 text-[10px]">
              {isAllowed
                ? "🛡️ Policy match: Baris ditemukan dan berhasil dihapus."
                : "🛡️ Policy mismatch: 0 baris terpengaruh (akses diblokir di kernel DB)."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
