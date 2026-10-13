"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  Copy,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Terminal,
  ExternalLink,
  Info,
  Layers,
  FileCode,
  Bug
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

export function SupabaseApiKeysSimulator() {
  const [activeTab, setActiveTab] = useState<"keys_dashboard" | "security_exploit" | "env_generator">("keys_dashboard");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // State Project
  const [projectRef, setProjectRef] = useState("xyzabcdefghijklm");
  const [showServiceKey, setShowServiceKey] = useState(false);

  // State Exploit Demo
  const [exploitScenario, setExploitScenario] = useState<"safe_anon" | "leaked_service">("safe_anon");
  const [isHacking, setIsHacking] = useState(false);
  const [hackLogs, setHackLogs] = useState<string[]>([]);

  const sampleUrl = `https://${projectRef}.supabase.co`;
  const sampleAnonKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IiR7cHJvamVjdFJlZn0iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.demo_anon_token_signature_abc123`;
  const sampleServiceRoleKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IiR7cHJvamVjdFJlZn0iLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjIwMDAwMDAwMDB9.DANGER_MASTER_SECRET_KEY_BYPASS_ALL_RLS_xyz789`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunExploit = () => {
    setIsHacking(true);
    setHackLogs([]);

    if (exploitScenario === "safe_anon") {
      setTimeout(() => {
        setHackLogs([
          "> Attacker mencoba query: DELETE FROM public.profiles WHERE role = 'admin';",
          "> Supabase RLS Engine: auth.uid() != target.id",
          "> 403 FORBIDDEN: RLS policy 'Users can update their own profile' memblokir aksi!",
          "> Status: DATABASE AMAN. Kunci anon public tidak memiliki hak superuser."
        ]);
        setIsHacking(false);
      }, 700);
    } else {
      setTimeout(() => {
        setHackLogs([
          "> Attacker menemukan kunci SERVICE_ROLE di peramban (NEXT_PUBLIC_ leak)...",
          "> Attacker bypass RLS via: DELETE FROM public.profiles;",
          "> 200 OK: Master key service_role mengabaikan seluruh kebijakan RLS!",
          "> MALAPETAKA: 142 baris profil pengguna terhapus seketika oleh penyerang!"
        ]);
        setIsHacking(false);
      }, 700);
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm overflow-hidden text-zinc-900 dark:text-zinc-100">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50 via-indigo-50/30 to-purple-50/20 dark:from-zinc-900 dark:via-zinc-900 dark:to-indigo-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">
                Simulasi Panduan: Supabase API Keys &amp; Bahaya Kebocoran Kunci Rahasia
              </span>
              <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-[10px] font-mono">
                Security Architecture Guide
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Pahami perbedaan mutlak antara kunci <strong>anon public</strong> (aman untuk peramban) dan <strong>service_role secret</strong> (kunci superuser anti-RLS).
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setProjectRef("xyzabcdefghijklm");
            setShowServiceKey(false);
            setExploitScenario("safe_anon");
            setHackLogs([]);
          }}
          className="text-xs self-start sm:self-auto gap-1.5 h-8 border-indigo-300 dark:border-zinc-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-zinc-800 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 px-3 pt-2 gap-1 overflow-x-auto scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveTab("keys_dashboard")}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer border-t border-x ${
            activeTab === "keys_dashboard"
              ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-indigo-600 dark:text-indigo-400 -mb-px shadow-xs"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <KeyRound className="w-4 h-4 text-indigo-500" />
          <span>1. Dashboard API Keys (Supabase Studio)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security_exploit")}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer border-t border-x ${
            activeTab === "security_exploit"
              ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-red-600 dark:text-red-400 -mb-px shadow-xs"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <span>2. Lab Simulasi Eksploitasi RLS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("env_generator")}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer border-t border-x ${
            activeTab === "env_generator"
              ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 -mb-px shadow-xs"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <FileCode className="w-4 h-4 text-emerald-500" />
          <span>3. Generator Berkas .env.local</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* ==================== TAB 1: KEYS DASHBOARD MOCKUP ==================== */}
        {activeTab === "keys_dashboard" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-3">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Lokasi Pengambilan Kunci API di Supabase Studio (2025/2026 UI):</span>
                <p className="leading-relaxed">
                  Buka <strong>https://supabase.com/dashboard</strong> ➔ Klik tombol <strong>Connect</strong> di header atas, ATAU buka menu <strong>Project Settings</strong> (ikon gerigi) di sidebar kiri bawah ➔ pilih sub-menu <strong>API</strong> (atau <strong>Configuration ➔ Data API</strong>).
                </p>
              </div>
            </div>

            {/* Mockup Supabase Studio: Project Settings -> API */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 overflow-hidden shadow-xs">
              <div className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Supabase Studio</span>
                  <span className="text-zinc-400">/</span>
                  <span className="text-zinc-500">Project Settings</span>
                  <span className="text-zinc-400">/</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">API Keys</span>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  Project: the-serverless-odyssey
                </Badge>
              </div>

              <div className="p-4 sm:p-6 space-y-5">
                {/* 1. Project URL */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span>Project URL (NEXT_PUBLIC_SUPABASE_URL)</span>
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px]">
                        Public
                      </Badge>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={sampleUrl}
                      className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(sampleUrl, "url")}
                      className="text-xs shrink-0 h-9 gap-1 cursor-pointer"
                    >
                      {copiedKey === "url" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Salin</span>
                    </Button>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Endpoint RESTful dan WebSocket khusus untuk instans basis data Supabase Anda.
                  </p>
                </div>

                {/* 2. Anon Public Key */}
                <div className="space-y-1.5 p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-950 dark:text-emerald-100">
                        Project API Key: anon (public)
                      </span>
                      <Badge className="bg-emerald-600 text-white text-[9px] font-mono">
                        Aman untuk Browser
                      </Badge>
                    </div>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-mono">
                      NEXT_PUBLIC_SUPABASE_ANON_KEY
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={sampleAnonKey}
                      className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 truncate"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(sampleAnonKey, "anon_key")}
                      className="text-xs shrink-0 h-9 gap-1 border-emerald-300 dark:border-emerald-700 cursor-pointer"
                    >
                      {copiedKey === "anon_key" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Salin</span>
                    </Button>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300">
                    Kunci ini aman dipublikasikan ke browser karena <strong>seluruh akses dibatasi oleh Row Level Security (RLS)</strong>.
                  </p>
                </div>

                {/* 3. Service Role Secret Key (BAHAYA) */}
                <div className="space-y-1.5 p-3.5 rounded-xl border-2 border-red-400 dark:border-red-800/80 bg-red-50/50 dark:bg-red-950/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-red-950 dark:text-red-100">
                        Project API Key: service_role (secret)
                      </span>
                      <Badge className="bg-red-600 text-white text-[9px] font-mono">
                        DILARANG KE CLIENT
                      </Badge>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowServiceKey(!showServiceKey)}
                      className="text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      {showServiceKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showServiceKey ? "Sembunyikan" : "Tampilkan"}</span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type={showServiceKey ? "text" : "password"}
                      readOnly
                      value={sampleServiceRoleKey}
                      className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-red-300 dark:border-red-800 bg-white dark:bg-zinc-900 text-red-900 dark:text-red-200 truncate"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(sampleServiceRoleKey, "service_key")}
                      className="text-xs shrink-0 h-9 gap-1 border-red-300 dark:border-red-700 text-red-600 cursor-pointer"
                    >
                      {copiedKey === "service_key" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Salin</span>
                    </Button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-red-100/60 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-[11px] text-red-900 dark:text-red-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>BAHAYA FATAL:</strong> Kunci ini adalah kunci master superuser yang <strong>mengabaikan (bypass) seluruh Row Level Security</strong>. JANGAN PERNAH menyalin kunci ini ke variabel dengan awalan <code>NEXT_PUBLIC_</code>!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: SECURITY EXPLOIT LAB ==================== */}
        {activeTab === "security_exploit" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Pilih Skenario Kunci yang Diinjeksikan ke Browser Client:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setExploitScenario("safe_anon");
                    setHackLogs([]);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    exploitScenario === "safe_anon"
                      ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20"
                      : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Skenario Aman: Gunakan Kunci &quot;anon public&quot;</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                    Sesuai best-practice: RLS aktif menjaga integritas data pengguna.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setExploitScenario("leaked_service");
                    setHackLogs([]);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    exploitScenario === "leaked_service"
                      ? "border-red-500 bg-red-50/60 dark:bg-red-950/30 text-red-950 dark:text-red-100 ring-2 ring-red-500/20"
                      : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs mb-1">
                    <Bug className="w-4 h-4 text-red-500" />
                    <span>Skenario Fatal: Kunci &quot;service_role&quot; Bocor ke Browser</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                    Salah menyalin kunci ke NEXT_PUBLIC_SUPABASE_ANON_KEY.
                  </p>
                </button>
              </div>
            </div>

            {/* Run Exploit Button */}
            <div className="flex justify-center">
              <Button
                size="sm"
                onClick={handleRunExploit}
                disabled={isHacking}
                className={`text-xs h-9 px-6 font-bold cursor-pointer text-white gap-2 ${
                  exploitScenario === "safe_anon"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{isHacking ? "Mengeksekusi Exploit..." : "Simulasikan Serangan Hacker di Browser DevTools"}</span>
              </Button>
            </div>

            {/* Terminal Hacker Logs */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 space-y-2 min-h-[140px]">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-[11px] text-zinc-500">
                <span>DevTools Network / Console Attack Simulator</span>
                <span className="text-zinc-400">Bash Terminal</span>
              </div>

              {hackLogs.length > 0 ? (
                <div className="space-y-1.5 pt-1">
                  {hackLogs.map((log, idx) => (
                    <p
                      key={idx}
                      className={
                        log.includes("MALAPETAKA") || log.includes("403")
                          ? log.includes("MALAPETAKA")
                            ? "text-red-400 font-bold"
                            : "text-amber-400 font-bold"
                          : log.includes("AMAN")
                          ? "text-emerald-400 font-bold"
                          : "text-zinc-300"
                      }
                    >
                      {log}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-20 text-zinc-600">
                  <span>Klik tombol di atas untuk melihat respons keamanan basis data.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: .ENV.LOCAL GENERATOR ==================== */}
        {activeTab === "env_generator" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
              <FileCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Standar Berkas .env.local Proyek &quot;The Serverless Odyssey&quot;:</span>
                <p className="leading-relaxed">
                  Berkas ini wajib ditaruh di direktori root proyek. Berkas ini otomatis diabaikan oleh Git via <code>.gitignore</code> sehingga kredensial Anda tidak bocor ke repositori publik GitHub.
                </p>
              </div>
            </div>

            {/* Snippet .env.local */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden font-mono text-xs shadow-md">
              <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-zinc-400">File:</span>
                  <span className="text-emerald-400 font-bold">.env.local</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleCopy(
                      `# Supabase Cloud Project Configuration\nNEXT_PUBLIC_SUPABASE_URL=${sampleUrl}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${sampleAnonKey}\n\n# Optional: Server-only Secret Key (Hanya jika dibutuhkan cron / webhook backend)\n# SUPABASE_SERVICE_ROLE_KEY=${sampleServiceRoleKey}`,
                      "env_file"
                    )
                  }
                  className="text-xs h-7 gap-1 text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
                >
                  {copiedKey === "env_file" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Salin Semua</span>
                </Button>
              </div>

              <div className="p-4 bg-[#141414] leading-relaxed text-zinc-300">
                <p className="text-zinc-500"># Supabase Cloud Project Configuration</p>
                <p>
                  <span className="text-indigo-400">NEXT_PUBLIC_SUPABASE_URL</span>=
                  <span className="text-emerald-300">{sampleUrl}</span>
                </p>
                <p>
                  <span className="text-indigo-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>=
                  <span className="text-emerald-300">{sampleAnonKey}</span>
                </p>
                <br />
                <p className="text-zinc-500"># PERINGATAN: Jangan pernah menambahkan prefix NEXT_PUBLIC_ pada kunci rahasia!</p>
                <p className="text-zinc-500"># SUPABASE_SERVICE_ROLE_KEY=...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Helper Bar */}
      <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
        <span className="text-zinc-500 dark:text-zinc-400 text-[11px] flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-indigo-500" />
          <span>Aturan Baku: Kunci dengan prefix NEXT_PUBLIC_ akan dikirimkan ke browser client.</span>
        </span>
        <a
          href="https://supabase.com/docs/guides/api/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 self-start sm:self-auto text-[11px]"
        >
          <span>Dokumentasi Resmi Supabase API Keys &amp; Security</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
