"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Radio,
  ToggleLeft,
  ToggleRight,
  Code2,
  Copy,
  Check,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Terminal,
  ExternalLink,
  PlusCircle,
  Edit3,
  Trash2,
  Send,
  Sparkles,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function SupabaseLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L.366 14.286a.396.396 0 0 0 .307.632H12v8.958a.396.396 0 0 0 .716.233l10.918-14.123a.396.396 0 0 0-.272-.632z" />
    </svg>
  );
}

interface SupabaseRealtimeStudioSimulatorProps {
  initialTab?: "publications" | "inspector" | "walkthrough";
}

export function SupabaseRealtimeStudioSimulator({
  initialTab = "publications"
}: SupabaseRealtimeStudioSimulatorProps) {
  const [activeTab, setActiveTab] = useState<"publications" | "inspector" | "walkthrough">(initialTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Publications State
  const [tasksReplication, setTasksReplication] = useState<boolean>(true);
  const [profilesReplication, setProfilesReplication] = useState<boolean>(false);

  // Realtime Inspector State
  const [channelTopic, setChannelTopic] = useState("realtime:public:tasks");
  const [wsLogs, setWsLogs] = useState<Array<{
    id: string | number;
    time: string;
    event: "INSERT" | "UPDATE" | "DELETE" | "broadcast";
    topic: string;
    payload: any;
  }>>([
    {
      id: 1,
      time: "10:20:00",
      event: "INSERT",
      topic: "realtime:public:tasks",
      payload: { schema: "public", table: "tasks", commit_timestamp: "2026-11-03T10:20:00Z", eventType: "INSERT", new: { id: "task-101", title: "Integrasi Realtime", status: "todo" } }
    }
  ]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSimulateInsert = () => {
    const newId = `task-${Math.floor(Math.random() * 800) + 200}`;
    const newEntry = {
      id: `ws-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      time: new Date().toLocaleTimeString(),
      event: "INSERT" as const,
      topic: channelTopic,
      payload: {
        schema: "public",
        table: "tasks",
        commit_timestamp: new Date().toISOString(),
        eventType: "INSERT",
        new: { id: newId, title: `Tugas Kolaboratif #${newId}`, status: "todo" }
      }
    };
    setWsLogs((prev) => [newEntry, ...prev.slice(0, 9)]);
  };

  const handleSimulateUpdate = () => {
    const newEntry = {
      id: `ws-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      time: new Date().toLocaleTimeString(),
      event: "UPDATE" as const,
      topic: channelTopic,
      payload: {
        schema: "public",
        table: "tasks",
        commit_timestamp: new Date().toISOString(),
        eventType: "UPDATE",
        new: { id: "task-101", title: "Integrasi Realtime", status: "done" },
        old: { id: "task-101" }
      }
    };
    setWsLogs((prev) => [newEntry, ...prev.slice(0, 9)]);
  };

  const handleSimulateDelete = () => {
    const newEntry = {
      id: `ws-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      time: new Date().toLocaleTimeString(),
      event: "DELETE" as const,
      topic: channelTopic,
      payload: {
        schema: "public",
        table: "tasks",
        commit_timestamp: new Date().toISOString(),
        eventType: "DELETE",
        old: { id: "task-101" }
      }
    };
    setWsLogs((prev) => [newEntry, ...prev.slice(0, 9)]);
  };

  const sqlPublishCommand = `-- EKSEKUSI DI SUPABASE SQL EDITOR ATAU TOGGLE DI PUBLICATIONS:
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;

-- VERIFIKASI APAKAH TABEL SUDAH TERDAFTAR:
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';`;

  return (
    <div className="rounded-2xl border border-emerald-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/95 shadow-md overflow-hidden text-zinc-900 dark:text-zinc-100">
      {/* Top Header: Replicating Supabase Studio */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-white p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <SupabaseLogo />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-1.5">
                  Supabase Studio
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Realtime Engine
                  </span>
                </span>
                <span className="text-zinc-600">/</span>
                <span className="text-xs text-zinc-400 font-mono">
                  Database: Postgres 15+
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Replika Dashboard Nyata: Manajemen Publikasi Database &amp; Live WebSocket Inspector
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Badge className="bg-emerald-600 text-white font-mono text-[11px] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Realtime Status: ACTIVE</span>
            </Badge>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-semibold text-zinc-200 flex items-center gap-1 transition-colors"
            >
              <span>Buka Studio Asli</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 mt-3 pt-2.5 border-t border-zinc-800 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("publications")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "publications"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>1. Database Publications (supabase_realtime)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inspector")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "inspector"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>2. Realtime WebSocket Inspector</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("walkthrough")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "walkthrough"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3. Panduan Langkah Demi Langkah</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 space-y-5 bg-white dark:bg-zinc-900">
        {/* TAB 1: PUBLICATIONS */}
        {activeTab === "publications" && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/80 to-teal-50/40 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-900/60 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5">
                <Database className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-1">
                <span className="font-bold text-zinc-900 dark:text-white block">
                  Lokasi di Dashboard Nyata: Database ➔ Publications ➔ supabase_realtime
                </span>
                <p>
                  Secara default, PostgreSQL tidak menyiarkan perubahan data untuk menghemat memori. Agar tabel <code>public.tasks</code> mengirimkan sinyal ke klien saat ada mutasi, Anda <strong>WAJIB mengaktifkan toggle Realtime</strong> pada tabel tersebut.
                </p>
              </div>
            </div>

            {/* Simulated Publications Table */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xs">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-bold">
                <span>Tabel Terdaftar di Publikasi &quot;supabase_realtime&quot;:</span>
                <span className="text-[11px] font-mono text-zinc-500">Replication Slot: active</span>
              </div>

              <div className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
                {/* Row 1: tasks */}
                <div className="p-3.5 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <span>public.tasks</span>
                        <Badge className="bg-emerald-600 text-[9px] text-white">Tabel Target Modul 11</Badge>
                      </div>
                      <p className="text-[11px] text-zinc-500">Menyiarkan event INSERT, UPDATE, DELETE ke antarmuka Kanban</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTasksReplication(!tasksReplication)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      tasksReplication
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {tasksReplication ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    <span>{tasksReplication ? "Realtime ON" : "Realtime OFF"}</span>
                  </button>
                </div>

                {/* Row 2: profiles */}
                <div className="p-3.5 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-zinc-400" />
                    <div>
                      <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        public.profiles
                      </div>
                      <p className="text-[11px] text-zinc-500">Data profil pengguna kampus</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setProfilesReplication(!profilesReplication)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      profilesReplication
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {profilesReplication ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    <span>{profilesReplication ? "Realtime ON" : "Realtime OFF"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SQL Snippet */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>Atau Eksekusi Langsung via SQL Editor:</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(sqlPublishCommand, "sql_pub")}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  {copiedKey === "sql_pub" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Salin Skrip SQL</span>
                </button>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 text-zinc-200 font-mono text-[11px] leading-relaxed border border-zinc-800 select-all">
                <pre>{sqlPublishCommand}</pre>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: REALTIME INSPECTOR */}
        {activeTab === "inspector" && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {/* Action Bar: Trigger Simulated Events */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Simulasikan Mutasi dari Browser Klien B (Remote Peer):</span>
                </span>
                <span className="text-[11px] font-mono text-zinc-500">Channel: {channelTopic}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button
                  size="sm"
                  onClick={handleSimulateInsert}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-8 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Klien B: Tambah Tugas (INSERT)</span>
                </Button>

                <Button
                  size="sm"
                  onClick={handleSimulateUpdate}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold h-8 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Klien B: Ubah Status (UPDATE)</span>
                </Button>

                <Button
                  size="sm"
                  onClick={handleSimulateDelete}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold h-8 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Klien B: Hapus Tugas (DELETE)</span>
                </Button>
              </div>
            </div>

            {/* Live Message Stream Logger */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  <span>Aliran Frame WebSocket yang Diterima Klien A (Browser Anda):</span>
                </span>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {wsLogs.length} Frame Recorded
                </Badge>
              </div>

              <div className="space-y-2 max-h-[260px] overflow-y-auto">
                <AnimatePresence>
                  {wsLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-200 font-mono text-[11px] space-y-1.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 text-[10px]">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-500">[{log.time}]</span>
                          <Badge
                            className={`text-[9px] font-bold ${
                              log.event === "INSERT"
                                ? "bg-emerald-600 text-white"
                                : log.event === "UPDATE"
                                ? "bg-blue-600 text-white"
                                : "bg-red-600 text-white"
                            }`}
                          >
                            {log.event}
                          </Badge>
                          <span className="text-zinc-400">{log.topic}</span>
                        </div>
                        <span className="text-emerald-400 font-bold">200 OK PUSH</span>
                      </div>
                      <pre className="text-[10px] text-zinc-300 overflow-x-auto select-all">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: WALKTHROUGH */}
        {activeTab === "walkthrough" && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50/80 to-orange-50/40 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/80 dark:border-amber-900/60 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-600 text-white shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-1">
                <span className="font-bold text-zinc-900 dark:text-white block">
                  Panduan 3 Langkah Konfigurasi Realtime di Supabase Studio Nyata
                </span>
                <p>
                  Pastikan Anda menyelesaikan ketiga langkah ini saat mengimplementasikan fitur kolaborasi real-time pada proyek aplikasi Anda.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 space-y-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold">
                  1
                </span>
                <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                  Daftarkan Tabel ke Publikasi
                </h5>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Buka Supabase ➔ <strong>Database</strong> ➔ <strong>Publications</strong>. Pastikan tabel <code>tasks</code> aktif di publikasi <code>supabase_realtime</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 space-y-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold">
                  2
                </span>
                <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                  Periksa Row Level Security (RLS)
                </h5>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Tabel wajib memiliki policy <code>SELECT</code> yang mengizinkan pengguna membaca baris data. Jika tidak ada policy SELECT, server akan menolak mengirimkan event ke klien.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 space-y-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-purple-600 text-white text-xs font-bold">
                  3
                </span>
                <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                  Pasang Cleanup di useEffect
                </h5>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Di Next.js Client Component, selalu kembalikan <code>return () =&gt; &#123; supabase.removeChannel(channel) &#125;</code> untuk mencegah kebocoran koneksi WebSocket.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

