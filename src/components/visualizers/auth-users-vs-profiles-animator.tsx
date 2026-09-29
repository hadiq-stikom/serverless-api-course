"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Link as LinkIcon, 
  KeyRound, 
  User, 
  Layers, 
  Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AuthUsersVsProfilesAnimator() {
  const [selectedSchema, setSelectedSchema] = useState<"auth" | "public" | "cascade">("public");

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
              Pilar 4.1: Pemisahan Skema Database
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">auth.users vs public.profiles</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Arsitektur Skema: auth.users (Sistem) vs public.profiles (Aplikasi)
          </h4>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setSelectedSchema("auth")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedSchema === "auth"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            auth.users
          </button>
          <button
            type="button"
            onClick={() => setSelectedSchema("public")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedSchema === "public"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Unlock className="w-3.5 h-3.5" />
            public.profiles
          </button>
          <button
            type="button"
            onClick={() => setSelectedSchema("cascade")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedSchema === "cascade"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Relasi FK &amp; CASCADE
          </button>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
        Supabase secara arsitektural memisahkan data otentikasi inti dengan data domain aplikasi ke dalam <strong>dua skema PostgreSQL berbeda</strong> demi alasan keamanan dan integritas isolasi akun.
      </p>

      {/* Side by Side Database Table Schema Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Table 1: auth.users */}
        <div className={`p-4 rounded-xl border transition-all space-y-3 ${
          selectedSchema === "auth"
            ? "border-zinc-500 bg-zinc-500/10 ring-2 ring-zinc-500/20"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60"
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-zinc-500" />
              <span className="font-mono font-bold text-xs text-zinc-800 dark:text-zinc-200">
                auth.users (Sistem Supabase)
              </span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 font-bold">
              RESTRICTED API
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between p-1.5 rounded bg-zinc-100 dark:bg-zinc-950">
              <span className="text-zinc-900 dark:text-zinc-100 font-bold">id (UUID PK)</span>
              <span className="text-zinc-500">Kunci Utama Kriptografis</span>
            </div>
            <div className="flex justify-between p-1.5 rounded bg-zinc-100 dark:bg-zinc-950">
              <span className="text-zinc-700 dark:text-zinc-300">email (TEXT)</span>
              <span className="text-zinc-500">Alamat surel terdaftar</span>
            </div>
            <div className="flex justify-between p-1.5 rounded bg-zinc-100 dark:bg-zinc-950">
              <span className="text-red-500 font-bold">encrypted_password (TEXT)</span>
              <span className="text-red-400">Hash Bcrypt Rahasia</span>
            </div>
            <div className="flex justify-between p-1.5 rounded bg-zinc-100 dark:bg-zinc-950">
              <span className="text-zinc-700 dark:text-zinc-300">raw_user_meta_data (JSONB)</span>
              <span className="text-zinc-500">Data mentah OAuth provider</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-950 text-[11px] text-zinc-600 dark:text-zinc-400 leading-normal">
            ⚠️ <strong>Dilarang Dimodifikasi Manual:</strong> Dikelola otomatis oleh Supabase GoTrue daemon. Klien aplikasi tidak boleh mengeksekusi direct UPDATE atau menambahkan kolom kustom ke skema auth.
          </div>
        </div>

        {/* Table 2: public.profiles */}
        <div className={`p-4 rounded-xl border transition-all space-y-3 ${
          selectedSchema === "public"
            ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60"
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Unlock className="w-4 h-4 text-emerald-500" />
              <span className="font-mono font-bold text-xs text-zinc-800 dark:text-zinc-200">
                public.profiles (Domain Aplikasi)
              </span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              RLS SECURED
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between p-1.5 rounded bg-zinc-100 dark:bg-zinc-950">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">id (UUID PK &amp; FK)</span>
              <span className="text-emerald-500">REFERENCES auth.users(id)</span>
            </div>
            <div className="flex justify-between p-1.5 rounded bg-zinc-100 dark:bg-zinc-950">
              <span className="text-zinc-700 dark:text-zinc-300">full_name (TEXT)</span>
              <span className="text-zinc-500">Nama lengkap pengguna</span>
            </div>
            <div className="flex justify-between p-1.5 rounded bg-zinc-100 dark:bg-zinc-950">
              <span className="text-zinc-700 dark:text-zinc-300">avatar_url (TEXT)</span>
              <span className="text-zinc-500">URL foto dari GitHub / Cloudinary</span>
            </div>
            <div className="flex justify-between p-1.5 rounded bg-zinc-100 dark:bg-zinc-950">
              <span className="text-zinc-700 dark:text-zinc-300">role (TEXT DEFAULT &apos;student&apos;)</span>
              <span className="text-zinc-500">Peran pengguna di aplikasi</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[11px] text-emerald-800 dark:text-emerald-300 leading-normal">
            ✅ <strong>Bebas Dikustomisasi:</strong> Developer bebas menambah kolom spesifik (seperti bio, nim, universitas) dan menerapkan Row Level Security (<code className="font-bold">auth.uid() = id</code>).
          </div>
        </div>
      </div>

      {/* Relational CASCADE Feature Detail */}
      {selectedSchema === "cascade" && (
        <div className="p-4 rounded-xl border border-purple-500/40 bg-purple-500/5 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-purple-700 dark:text-purple-400">
            <LinkIcon className="w-4 h-4" />
            <span>Integritas Referensial ON DELETE CASCADE:</span>
          </div>
          <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Dengan mendeklarasikan <code className="font-mono text-purple-600 dark:text-purple-400 font-bold">FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE</code>, ketika pengguna menghapus akun atau akun dihapus oleh admin di Supabase Dashboard, baris profil di <code className="font-mono">public.profiles</code> dan seluruh proyek miliknya di <code className="font-mono">public.projects</code> otomatis dibersihkan oleh kernel PostgreSQL secara atomik tanpa menyisakan data yatim (*zero orphaned rows*).
          </p>
        </div>
      )}
    </div>
  );
}
