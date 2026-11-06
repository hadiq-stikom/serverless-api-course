"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Users,
  Eye,
  EyeOff,
  Database,
  Radio,
  Laptop
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function RlsRealtimeFilterAnimator() {
  const [currentUserRole, setCurrentUserRole] = useState<"admin" | "member" | "anon">("member");
  const [rlsPolicyActive, setRlsPolicyActive] = useState<boolean>(true);

  // Sample tasks being mutated in database
  const mutatedTasks = [
    { id: 1, title: "Tugas Umum Kampus", ownerId: "admin", isPublic: true },
    { id: 2, title: "Draft Rahasia Anggota (user-42)", ownerId: "user-42", isPublic: false },
    { id: 3, title: "Catatan Pribadi Anda", ownerId: "user-current", isPublic: false }
  ];

  const canReceiveTask = (task: typeof mutatedTasks[0]) => {
    if (!rlsPolicyActive) return true; // Without RLS, everyone receives all events!
    if (currentUserRole === "admin") return true; // Admin sees all
    if (currentUserRole === "anon") return task.isPublic; // Anon only sees public
    // Member:
    return task.isPublic || task.ownerId === "user-current";
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 space-y-5 text-zinc-900 dark:text-zinc-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
              Pertahanan Keamanan: Row Level Security (RLS) pada Realtime WebSocket
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Supabase Realtime mengevaluasi kebijakan RLS PostgreSQL sebelum mem-broadcast event ke token JWT klien
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRlsPolicyActive(!rlsPolicyActive)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            rlsPolicyActive
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-red-600 text-white shadow-xs animate-pulse"
          }`}
        >
          {rlsPolicyActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          <span>{rlsPolicyActive ? "RLS on Realtime: AKTIF" : "RLS NONAKTIF (BAHAYA)"}</span>
        </button>
      </div>

      {/* Role Selector */}
      <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
          Simulasikan Identitas JWT Klien yang Tersambung:
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setCurrentUserRole("member")}
            className={`py-1 px-3 rounded-md text-xs font-bold transition-all cursor-pointer ${
              currentUserRole === "member"
                ? "bg-indigo-600 text-white shadow-xs"
                : "border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
            }`}
          >
            👤 Member (user-current)
          </button>

          <button
            type="button"
            onClick={() => setCurrentUserRole("admin")}
            className={`py-1 px-3 rounded-md text-xs font-bold transition-all cursor-pointer ${
              currentUserRole === "admin"
                ? "bg-purple-600 text-white shadow-xs"
                : "border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
            }`}
          >
            👑 Admin (Superuser)
          </button>

          <button
            type="button"
            onClick={() => setCurrentUserRole("anon")}
            className={`py-1 px-3 rounded-md text-xs font-bold transition-all cursor-pointer ${
              currentUserRole === "anon"
                ? "bg-amber-600 text-white shadow-xs"
                : "border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
            }`}
          >
            👻 Tamu (Anon / Public)
          </button>
        </div>
      </div>

      {/* Events Stream Evaluation Grid */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
          Evaluasi Event PostgreSQL yang Masuk ke WebSocket Klien:
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {mutatedTasks.map((t) => {
            const allowed = canReceiveTask(t);
            return (
              <div
                key={t.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  allowed
                    ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20"
                    : "border-red-300 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20"
                } space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-mono ${
                      t.isPublic ? "text-blue-600 border-blue-400" : "text-amber-600 border-amber-400"
                    }`}
                  >
                    {t.isPublic ? "Public Row" : `Owner: ${t.ownerId}`}
                  </Badge>
                  <span className="text-[10px] font-bold">
                    {allowed ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Diterima
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                        <EyeOff className="w-3.5 h-3.5" /> Diblokir RLS
                      </span>
                    )}
                  </span>
                </div>

                <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                  {t.title}
                </div>

                <p className="text-[11px] text-zinc-500 leading-tight">
                  {allowed
                    ? "Event lolos filter RLS server & dikirimkan ke WebSocket klien."
                    : "Realtime Server menahan payload ini karena token JWT tidak berhak membaca baris tersebut."}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {!rlsPolicyActive && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-900 dark:text-red-200 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Peringatan Bahaya Kebocoran Data Realtime:</span>
            <p className="leading-relaxed">
              Jika tabel di-publish ke Realtime tanpa Row Level Security, siapa pun yang menghubungkan WebSocket dengan Anon Key dapat menyadap mutasi data seluruh pengguna lain! Pastikan selalu mengeksekusi <code>ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;</code>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

