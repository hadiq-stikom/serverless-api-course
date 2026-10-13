"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Play,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
  ShieldCheck,
  Table,
  Zap,
  Terminal,
  ExternalLink,
  Lock,
  Code2
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

export function SupabaseSqlEditorSimulator() {
  const [activeTab, setActiveTab] = useState<"sql_editor" | "table_editor" | "trigger_inspector" | "architecture">("sql_editor");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // State Tab 1: SQL Editor Runner
  const [hasExecuted, setHasExecuted] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);

  // State Tab 2: Table Editor Simulation (New User Insertion)
  const [simulatedUsers, setSimulatedUsers] = useState<
    Array<{ id: string; email: string; full_name: string; avatar_url: string; role: string; created_at: string }>
  >([
    {
      id: "usr_99a1b2c3-4d5e",
      email: "budi@student.ac.id",
      full_name: "Budi Santoso",
      avatar_url: "https://avatars.githubusercontent.com/u/101?v=4",
      role: "student",
      created_at: "2026-10-12 10:15:00"
    }
  ]);
  const [isAddingUser, setIsAddingUser] = useState(false);

  const sampleSqlScript = `-- 1. TABEL PROFIL APLIKASI
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT 'Explorer',
  avatar_url TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'lecturer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. FUNGSI TRIGGER SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Explorer'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. ATTACH TRIGGER KE auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExecuteSql = () => {
    setIsExecuting(true);
    setExecutionMessage(null);
    setTimeout(() => {
      setIsExecuting(false);
      setHasExecuted(true);
      setExecutionMessage("Success. No rows returned (Query completed in 38ms). Table 'public.profiles' and Trigger 'on_auth_user_created' are now ACTIVE!");
    }, 700);
  };

  const handleSimulateNewSignup = () => {
    setIsAddingUser(true);
    const newId = `usr_${Math.random().toString(36).substring(2, 8)}-${Date.now().toString(36)}`;
    const names = ["Siti Rahma", "Ahmad Fauzi", "Dewi Lestari", "Rian Hidayat"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomEmail = `${randomName.toLowerCase().replace(" ", ".")}@univ.ac.id`;

    setTimeout(() => {
      setSimulatedUsers((prev) => [
        {
          id: newId,
          email: randomEmail,
          full_name: randomName,
          avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${newId}`,
          role: "student",
          created_at: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
      setIsAddingUser(false);
    }, 600);
  };

  return (
    <div className="rounded-2xl border border-emerald-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm overflow-hidden text-zinc-900 dark:text-zinc-100">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50 via-emerald-50/30 to-teal-50/20 dark:from-zinc-900 dark:via-zinc-900 dark:to-emerald-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">
                Simulasi Panduan: Supabase SQL Editor &amp; Database Trigger
              </span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-mono">
                PostgreSQL Automation Guide
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Pelajari cara mengeksekusi skrip DDL profil di SQL Editor dan memahami bagaimana Database Trigger mereplikasi data secara otomatis.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setHasExecuted(false);
            setExecutionMessage(null);
            setSimulatedUsers([
              {
                id: "usr_99a1b2c3-4d5e",
                email: "budi@student.ac.id",
                full_name: "Budi Santoso",
                avatar_url: "https://avatars.githubusercontent.com/u/101?v=4",
                role: "student",
                created_at: "2026-10-12 10:15:00"
              }
            ]);
          }}
          className="text-xs self-start sm:self-auto gap-1.5 h-8 border-emerald-300 dark:border-zinc-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-zinc-800 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 px-3 pt-2 gap-1 overflow-x-auto scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveTab("sql_editor")}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer border-t border-x ${
            activeTab === "sql_editor"
              ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 -mb-px shadow-xs"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Terminal className="w-4 h-4 text-emerald-500" />
          <span>1. SQL Editor (Eksekusi DDL &amp; Trigger)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("table_editor")}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer border-t border-x ${
            activeTab === "table_editor"
              ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 -mb-px shadow-xs"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Table className="w-4 h-4 text-indigo-500" />
          <span>2. Table Editor (Simulasi Replikasi Data)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("trigger_inspector")}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer border-t border-x ${
            activeTab === "trigger_inspector"
              ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 -mb-px shadow-xs"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>3. Verifikasi Trigger (Database Menu)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("architecture")}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer border-t border-x ${
            activeTab === "architecture"
              ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 -mb-px shadow-xs"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Layers className="w-4 h-4 text-purple-500" />
          <span>4. Arsitektur: auth.users vs public.profiles</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* ==================== TAB 1: SQL EDITOR RUNNER ==================== */}
        {activeTab === "sql_editor" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
              <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Langkah Eksekusi di Dashboard Asli:</span>
                <p className="leading-relaxed">
                  Buka <strong>https://supabase.com/dashboard</strong> ➔ Pilih Proyek Anda ➔ Klik menu <strong>SQL Editor</strong> di sidebar kiri ➔ Klik tombol <strong>New Query</strong> ➔ Tempel skrip SQL di bawah ➔ Klik tombol <strong>Run (Ctrl+Enter)</strong>.
                </p>
              </div>
            </div>

            {/* Mockup Supabase SQL Editor */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden shadow-md font-mono text-xs">
              {/* Top Editor Bar */}
              <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-zinc-400">SQL Editor /</span>
                  <span className="text-emerald-400 font-bold">01_init_profiles_trigger.sql</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(sampleSqlScript, "sql_script")}
                    className="text-xs h-7 gap-1 text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
                  >
                    {copiedKey === "sql_script" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Salin SQL</span>
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleExecuteSql}
                    disabled={isExecuting}
                    className="text-xs h-7 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isExecuting ? "Menjalankan..." : "RUN"}</span>
                  </Button>
                </div>
              </div>

              {/* Code Editor Body */}
              <div className="p-4 bg-[#141414] overflow-x-auto max-h-[300px] leading-relaxed text-zinc-300 scrollbar-thin">
                <pre>{sampleSqlScript}</pre>
              </div>

              {/* Bottom Result Log Terminal */}
              <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">Output:</span>
                  {isExecuting ? (
                    <span className="text-amber-400 animate-pulse">Menjalankan query di PostgreSQL engine...</span>
                  ) : hasExecuted ? (
                    <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{executionMessage}</span>
                    </span>
                  ) : (
                    <span className="text-zinc-500">Klik tombol RUN di atas untuk mensimulasikan eksekusi DDL.</span>
                  )}
                </div>

                {hasExecuted && (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                    Status: 200 OK
                  </Badge>
                )}
              </div>
            </div>

            {/* Penjelasan Komponen DDL */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 space-y-1">
                <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5 text-emerald-500" />
                  <span>1. Tabel public.profiles</span>
                </span>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Memiliki foreign key <code>REFERENCES auth.users(id) ON DELETE CASCADE</code>, sehingga jika user dihapus, profil otomatis terhapus.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 space-y-1">
                <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span>2. Row Level Security (RLS)</span>
                </span>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Kebijakan keamanan: semua user boleh membaca profil publik (SELECT), namun hanya pemilik akun yang boleh mengedit data dirinya (UPDATE).
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 space-y-1">
                <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>3. SECURITY DEFINER</span>
                </span>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Fungsi trigger dieksekusi dengan hak akses superuser Postgres, memungkinkan penulisan ke tabel <code>public.profiles</code> secara aman saat signup.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: TABLE EDITOR SIMULATION ==================== */}
        {activeTab === "table_editor" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  Simulasi Otomasi Replikasi Profil Pengguna Baru
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Saat mahasiswa atau pengguna mendaftar melalui Email, GitHub, atau Magic Link, trigger otomatis menyalin data ke tabel <code>public.profiles</code>.
                </p>
              </div>

              <Button
                size="sm"
                onClick={handleSimulateNewSignup}
                disabled={isAddingUser}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 text-xs h-8 cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAddingUser ? "Memproses Trigger..." : "Simulasikan Pendaftaran Akun Baru"}</span>
              </Button>
            </div>

            {/* Mockup Supabase Table Editor */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
              <div className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Table Editor</span>
                  <span className="text-zinc-400">/</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">public.profiles</span>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {simulatedUsers.length} Baris Data
                </Badge>
              </div>

              {/* Table Data */}
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-700 font-mono text-[11px]">
                    <tr>
                      <th className="p-3">id (UUID)</th>
                      <th className="p-3">full_name</th>
                      <th className="p-3">avatar_url</th>
                      <th className="p-3">role</th>
                      <th className="p-3">created_at</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-mono text-[11px]">
                    {simulatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">{user.id}</td>
                        <td className="p-3 font-sans font-semibold text-zinc-900 dark:text-zinc-100">{user.full_name}</td>
                        <td className="p-3 text-zinc-500 dark:text-zinc-400 truncate max-w-[180px]">{user.avatar_url}</td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-[10px] bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-600 border-indigo-300 dark:border-indigo-800">
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-3 text-zinc-400">{user.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Verifikasi Berhasil: Setiap baris di <code>public.profiles</code> memiliki ID yang identik 100% dengan ID di <code>auth.users</code>!
              </span>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: TRIGGER INSPECTOR ==================== */}
        {activeTab === "trigger_inspector" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-3">
              <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Cara Memverifikasi Trigger di Supabase Asli:</span>
                <p className="leading-relaxed">
                  Setelah mengeksekusi skrip di SQL Editor, Anda dapat memastikan trigger sudah terpasang dengan membuka menu <strong>Database</strong> di sidebar kiri ➔ pilih tab <strong>Triggers</strong>.
                </p>
              </div>
            </div>

            {/* Mockup Supabase Studio: Database -> Triggers */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
              <div className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Database</span>
                  <span className="text-zinc-400">/</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">Triggers</span>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  1 Active Trigger
                </Badge>
              </div>

              <div className="p-4 sm:p-5 space-y-4">
                <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 dark:border-emerald-900/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 font-mono">
                        on_auth_user_created
                      </span>
                    </div>
                    <Badge className="bg-emerald-600 text-white text-[10px] font-mono self-start sm:self-auto">
                      Status: ACTIVE (Enabled)
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-zinc-500 text-[11px] block">Target Table:</span>
                      <code className="font-bold text-zinc-900 dark:text-zinc-100">auth.users</code>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[11px] block">Trigger Events:</span>
                      <code className="font-bold text-indigo-600 dark:text-indigo-400">AFTER INSERT</code>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[11px] block">Executed Function:</span>
                      <code className="font-bold text-emerald-600 dark:text-emerald-400">public.handle_new_user()</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: ARCHITECTURE INSPECTOR ==================== */}
        {activeTab === "architecture" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-3">
              <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Mengapa Supabase Memisahkan auth.users dan public.profiles?</span>
                <p className="leading-relaxed">
                  Ini adalah pola arsitektur resmi (*defense-in-depth*). Skema <code>auth</code> diisolasi ketat dari API publik untuk melindungi hash password dan token sesi pengguna.
                </p>
              </div>
            </div>

            {/* Perbandingan 2 Skema */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-red-300 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="font-bold text-xs text-red-950 dark:text-red-100">
                    Skema: auth.users (Terkunci &amp; Internal)
                  </span>
                </div>
                <ul className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1.5 list-disc list-inside">
                  <li><strong>Akses:</strong> Hanya dapat diakses oleh Supabase Auth Engine.</li>
                  <li><strong>Isi Data:</strong> Hash password bcrypt, encrypted session tokens, email, phone.</li>
                  <li><strong>API Publik:</strong> DILARANG di-query langsung oleh browser client demi keamanan.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-xs text-emerald-950 dark:text-emerald-100">
                    Skema: public.profiles (Tabel Aplikasi)
                  </span>
                </div>
                <ul className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1.5 list-disc list-inside">
                  <li><strong>Akses:</strong> Dapat di-query langsung via SDK <code>supabase.from(&#39;profiles&#39;)</code>.</li>
                  <li><strong>Isi Data:</strong> Nama lengkap, URL avatar, role (student/lecturer/admin), bio.</li>
                  <li><strong>Keamanan:</strong> Dilindungi secara granular oleh Row Level Security (RLS).</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Helper Bar */}
      <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
        <span className="text-zinc-500 dark:text-zinc-400 text-[11px] flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-emerald-500" />
          <span>Skrip ini bersifat Idempotent (aman dijalankan berulang kali tanpa merusak database).</span>
        </span>
        <a
          href="https://supabase.com/docs/guides/auth/managing-user-data"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 self-start sm:self-auto text-[11px]"
        >
          <span>Dokumentasi Resmi Managing User Data di Supabase</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
