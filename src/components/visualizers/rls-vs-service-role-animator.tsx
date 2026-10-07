"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Database, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  UserCheck, 
  UserX,
  FileCode
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function RlsVsServiceRoleAnimator() {
  const [clientType, setClientType] = useState<"auth_client" | "service_role">("auth_client");
  const [requestedUserId, setRequestedUserId] = useState<"own_task" | "other_user_task">("other_user_task");

  const isBypassed = clientType === "service_role";
  const isBreached = isBypassed && requestedUserId === "other_user_task";

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 text-xs font-semibold">
              Pilar 2.3: Zona Bahaya Keamanan
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">RLS vs Service Role</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Kebocoran Data: RLS Enforcement vs Bahaya Service Role Key di REST API
          </h4>
        </div>

        {/* Security Mode Switcher */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setClientType("auth_client")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              clientType === "auth_client"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> ✅ User Client (RLS Aktif)
          </button>
          <button
            type="button"
            onClick={() => setClientType("service_role")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              clientType === "service_role"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> ❌ Service Role (Bypass RLS)
          </button>
        </div>
      </div>

      {/* Target Data Simulation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Request Parameter Target */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 space-y-3">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
            Target Data yang Diminta oleh Klien:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRequestedUserId("own_task")}
              className={`p-2.5 rounded-lg text-xs font-bold transition-all border text-left ${
                requestedUserId === "own_task"
                  ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-300"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <div className="flex items-center gap-1 font-bold">
                <UserCheck className="w-3.5 h-3.5 text-indigo-500" /> Tugas Milik Sendiri
              </div>
              <div className="text-[10px] text-zinc-500 mt-1 font-mono">user_id = auth.uid()</div>
            </button>

            <button
              type="button"
              onClick={() => setRequestedUserId("other_user_task")}
              className={`p-2.5 rounded-lg text-xs font-bold transition-all border text-left ${
                requestedUserId === "other_user_task"
                  ? "bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-300"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <div className="flex items-center gap-1 font-bold">
                <UserX className="w-3.5 h-3.5 text-amber-500" /> Tugas Milik User Lain!
              </div>
              <div className="text-[10px] text-zinc-500 mt-1 font-mono">user_id != auth.uid()</div>
            </button>
          </div>

          <div className="text-[11px] text-zinc-500 leading-relaxed">
            Seorang hacker mencoba memanggil endpoint <code className="font-mono text-zinc-800 dark:text-zinc-200">GET /api/v1/tasks/task-999</code> yang merupakan tugas rahasia milik pengguna lain.
          </div>
        </div>

        {/* Database Engine Evaluation */}
        <div className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
          isBreached 
            ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20" 
            : "border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/20"
        }`}>
          <div className="flex items-center justify-between pb-1 border-b border-zinc-200/50 dark:border-zinc-800">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <Database className="w-4 h-4 text-cyan-500" /> Evaluasi PostgreSQL Policy
            </span>
            <Badge className={isBreached ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"}>
              {isBreached ? "🚨 PRIVILEGE ESCALATION" : "🛡️ PROTEKSI SUKSES"}
            </Badge>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-950 font-mono text-[10px] space-y-1 overflow-x-auto text-zinc-300">
            <div className="text-zinc-500">// Kueri yang dieksekusi di database:</div>
            {clientType === "auth_client" ? (
              <>
                <div className="text-emerald-400">SELECT * FROM tasks WHERE id = &apos;task-999&apos;</div>
                <div className="text-cyan-400">AND (auth.uid() = user_id); -- RLS Policy Injection</div>
                <div className="text-zinc-400 pt-1">Hasil: <strong>0 baris (Empty Array / 404 Not Found)</strong></div>
              </>
            ) : (
              <>
                <div className="text-rose-400 font-bold">SELECT * FROM tasks WHERE id = &apos;task-999&apos;;</div>
                <div className="text-rose-300">-- ⚠️ RLS DIBYPASS KARENA SUPABASE_SERVICE_ROLE_KEY!</div>
                <div className="text-rose-400 font-bold pt-1">Hasil: 1 baris bocor ke hacker! 💥</div>
              </>
            )}
          </div>

          <p className="text-[11px] leading-relaxed">
            {isBreached ? (
              <span className="text-rose-700 dark:text-rose-300 font-semibold">
                Bahaya Fatal! Service Role Key menonaktifkan seluruh kebijakan RLS. Siapa saja yang mengetahui ID data pengguna lain dapat mencuri data tersebut via API.
              </span>
            ) : (
              <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                Aman! Client menggunakan token pengguna terverifikasi, sehingga Postgres RLS otomatis menyaring data dan mencegah kebocoran data lintas akun.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Code Best Practice Callout */}
      <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono text-xs space-y-1.5">
        <div className="text-[11px] text-zinc-400 flex items-center justify-between">
          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5" /> Golden Rule Keamanan REST API Serverless
          </span>
          <span className="text-zinc-400 text-[10px]">Security Directive</span>
        </div>
        <p className="text-zinc-300 text-[11px] leading-relaxed">
          <strong>DILARANG KERAS</strong> menggunakan <code className="text-rose-400">SUPABASE_SERVICE_ROLE_KEY</code> di dalam Route Handler publik. Selalu buat instance client Supabase menggunakan token pengguna dari header: <code className="text-emerald-400">createClient(url, anonKey, &#123; global: &#123; headers: &#123; Authorization: `Bearer $&#123;token&#125;` &#125; &#125; &#125;)</code>.
        </p>
      </div>
    </div>
  );
}
