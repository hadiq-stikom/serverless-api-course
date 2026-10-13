"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Mail,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Info,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Server,
  KeyRound,
  Terminal,
  Zap,
  Play
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

export function SupabaseAuthConfigSimulator() {
  const [activeTab, setActiveTab] = useState<"url_config" | "email_provider" | "redirect_flow" | "troubleshooting">("url_config");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // State Tab 1: URL Configuration
  const [siteUrl, setSiteUrl] = useState("http://localhost:3000");
  const [redirectUrls, setRedirectUrls] = useState<string[]>([
    "http://localhost:3000/**",
    "http://localhost:3000/auth/callback"
  ]);
  const [newRedirectInput, setNewRedirectInput] = useState("");
  const [urlInputError, setUrlInputError] = useState<string | null>(null);

  // State Tab 2: Email Provider
  const [emailProviderEnabled, setEmailProviderEnabled] = useState(true);
  const [confirmEmailEnabled, setConfirmEmailEnabled] = useState(false); // Default recommended for dev: false
  const [secureEmailChange, setSecureEmailChange] = useState(true);

  // State Tab 3: Interactive Flow
  const [flowScenario, setFlowScenario] = useState<"email_pass" | "magic_link" | "oauth_github">("email_pass");
  const [simStep, setSimStep] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);

  // State Tab 4: Troubleshooting
  const [selectedIssue, setSelectedIssue] = useState<"err_email_confirm" | "err_redirect_mismatch" | "err_wrong_site">("err_email_confirm");

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddRedirectUrl = () => {
    const trimmed = newRedirectInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      setUrlInputError("URL wajib diawali dengan protokol 'http://' atau 'https://'");
      return;
    }

    if (redirectUrls.includes(trimmed)) {
      setUrlInputError("URL sudah ada di dalam daftar whitelist!");
      return;
    }

    setRedirectUrls([...redirectUrls, trimmed]);
    setNewRedirectInput("");
    setUrlInputError(null);
  };

  const handleRemoveRedirectUrl = (urlToRemove: string) => {
    setRedirectUrls(redirectUrls.filter((u) => u !== urlToRemove));
  };

  const handleResetToRecommended = () => {
    setSiteUrl("http://localhost:3000");
    setRedirectUrls(["http://localhost:3000/**", "http://localhost:3000/auth/callback"]);
    setConfirmEmailEnabled(false);
    setEmailProviderEnabled(true);
  };

  const runFlowSimulation = () => {
    setIsSimulating(true);
    setSimStep(1);
    setTimeout(() => setSimStep(2), 700);
    setTimeout(() => setSimStep(3), 1500);
    setTimeout(() => {
      setSimStep(4);
      setIsSimulating(false);
    }, 2300);
  };

  return (
    <div className="rounded-2xl border border-emerald-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm overflow-hidden text-zinc-900 dark:text-zinc-100">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50 via-emerald-50/30 to-teal-50/20 dark:from-zinc-900 dark:via-zinc-900 dark:to-emerald-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
            <SupabaseLogo className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">
                Simulasi Panduan: Konfigurasi Supabase Auth &amp; URL Redirect
              </span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-mono">
                Supabase Studio Mockup
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Pelajari pengaturan <strong>Site URL</strong>, whitelist <strong>Redirect URLs</strong>, dan toggle <strong>Confirm email</strong> untuk mencegah error di lingkungan lokal.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetToRecommended}
          className="text-xs self-start sm:self-auto gap-1.5 h-8 border-emerald-300 dark:border-zinc-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-zinc-800 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Rekomendasi Dev</span>
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 px-3 pt-2 gap-1 overflow-x-auto scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveTab("url_config")}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer border-t border-x ${
            activeTab === "url_config"
              ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 -mb-px shadow-xs"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Globe className="w-4 h-4 text-emerald-500" />
          <span>1. URL Configuration (Redirect Whitelist)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("email_provider")}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer border-t border-x ${
            activeTab === "email_provider"
              ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 -mb-px shadow-xs"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Mail className="w-4 h-4 text-emerald-500" />
          <span>2. Email Provider &amp; Confirm Toggle</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("redirect_flow")}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer border-t border-x ${
            activeTab === "redirect_flow"
              ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 -mb-px shadow-xs"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Zap className="w-4 h-4 text-indigo-500" />
          <span>3. Simulasi Alur Redirect (Live Test)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("troubleshooting")}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer border-t border-x ${
            activeTab === "troubleshooting"
              ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-amber-600 dark:text-amber-400 -mb-px shadow-xs"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>4. Diagnostik Error &amp; Solusi</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* ==================== TAB 1: URL CONFIGURATION MOCKUP ==================== */}
        {activeTab === "url_config" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
              <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Mengapa URL Configuration Sangat Krusial?</span>
                <p className="leading-relaxed">
                  Supabase menerapkan <strong>keamanan whitelist ketat</strong>. Setiap kali Anda menggunakan Magic Link OTP atau OAuth 2.0 yang mengarahkan peramban ke <code>redirectTo</code>, Supabase akan memverifikasi apakah target URL terdaftar di daftar <strong>Redirect URLs</strong>. Jika belum didaftarkan, Supabase menolak pengalihan dengan error <code>redirect_uri_mismatch</code>.
                </p>
              </div>
            </div>

            {/* Mockup Antarmuka Supabase Studio */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 overflow-hidden shadow-xs">
              {/* Top Studio Bar */}
              <div className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Supabase Studio</span>
                  <span className="text-zinc-400">/</span>
                  <span className="text-zinc-500">Authentication</span>
                  <span className="text-zinc-400">/</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">URL Configuration</span>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono border-zinc-300 dark:border-zinc-700">
                  Project Settings
                </Badge>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {/* 1. Site URL */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Site URL (Default Redirect Target)</span>
                    </label>
                    <span className="text-[11px] text-zinc-500 font-mono">Wajib untuk Next.js lokal</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      placeholder="http://localhost:3000"
                      className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(siteUrl, "site_url")}
                      className="text-xs shrink-0 h-9 gap-1 cursor-pointer"
                    >
                      {copiedKey === "site_url" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">Salin</span>
                    </Button>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    URL dasar aplikasi web Anda. Pada fase pengembangan lokal, nilai ini wajib diisi <code>http://localhost:3000</code>. Di lingkungan production, ganti dengan URL domain Vercel Anda (misal <code>https://odyssey.vercel.app</code>).
                  </p>
                </div>

                {/* 2. Redirect URLs Whitelist */}
                <div className="space-y-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Redirect URLs (Security Whitelist)</span>
                      </h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Daftar pola URL yang diizinkan menerima redirect dari otentikasi Supabase.
                      </p>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono self-start sm:self-auto">
                      {redirectUrls.length} Pola Terdaftar
                    </Badge>
                  </div>

                  {/* List of URLs */}
                  <div className="space-y-2">
                    {redirectUrls.map((url) => {
                      const isWildcard = url.includes("/**");
                      const isCallback = url.includes("/auth/callback");

                      return (
                        <div
                          key={url}
                          className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-mono"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-emerald-500">✓</span>
                            <span className="text-zinc-900 dark:text-zinc-100 truncate">{url}</span>
                            {isWildcard && (
                              <Badge variant="outline" className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-300 dark:border-emerald-800">
                                Wildcard Sub-routes
                              </Badge>
                            )}
                            {isCallback && (
                              <Badge variant="outline" className="text-[9px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 border-indigo-300 dark:border-indigo-800">
                                Next.js 16 Route Handler
                              </Badge>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveRedirectUrl(url)}
                            className="p-1 rounded text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Hapus URL"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add URL Form */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newRedirectInput}
                        onChange={(e) => {
                          setNewRedirectInput(e.target.value);
                          if (urlInputError) setUrlInputError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddRedirectUrl();
                        }}
                        placeholder="Contoh: http://localhost:3000/**"
                        className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddRedirectUrl}
                        className="text-xs shrink-0 h-9 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah URL</span>
                      </Button>
                    </div>

                    {urlInputError && (
                      <p className="text-[11px] text-red-500 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{urlInputError}</span>
                      </p>
                    )}
                  </div>

                  {/* Wildcard Explanation Tip */}
                  <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-[11px] space-y-1">
                    <div className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <span>💡 Tips Pola Wildcard Supabase (Glob Pattern):</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Tambahkan <code>http://localhost:3000/**</code> agar Supabase mengizinkan pengalihan ke semua rute Next.js Anda (seperti <code>/dashboard</code>, <code>/auth/callback</code>, maupun rute dinamis dengan query parameters <code>?next=/tasks</code>).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: EMAIL PROVIDER & CONFIRM TOGGLE ==================== */}
        {activeTab === "email_provider" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Jebakan Paling Sering Terjadi pada Praktek Mahasiswa:</span>
                <p className="leading-relaxed">
                  Secara default, Supabase Cloud mengaktifkan <strong>&quot;Confirm email&quot;</strong>. Ketika mahasiswa mendaftarkan akun baru via <code>signUp()</code> di Tab 2, lalu langsung mencoba login via <code>signInWithPassword()</code>, Supabase akan menolak login dengan error <code>Email not confirmed</code>.
                </p>
              </div>
            </div>

            {/* Mockup Supabase Studio: Providers -> Email */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 overflow-hidden shadow-xs">
              <div className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Supabase Studio</span>
                  <span className="text-zinc-400">/</span>
                  <span className="text-zinc-500">Authentication</span>
                  <span className="text-zinc-400">/</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Providers: Email</span>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono border-zinc-300 dark:border-zinc-700">
                  Auth Configuration
                </Badge>
              </div>

              <div className="p-4 sm:p-6 space-y-5">
                {/* 1. Toggle Enable Email Provider */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Enable Email Provider
                    </span>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Izinkan pengguna masuk menggunakan alamat email dan kata sandi atau Magic Link OTP.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailProviderEnabled(!emailProviderEnabled)}
                    className="cursor-pointer"
                  >
                    {emailProviderEnabled ? (
                      <ToggleRight className="w-8 h-8 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-zinc-400" />
                    )}
                  </button>
                </div>

                {/* 2. Toggle Confirm Email (KRUSIAL) */}
                <div className={`p-4 rounded-xl border-2 transition-all space-y-3 ${
                  !confirmEmailEnabled
                    ? "border-emerald-400 dark:border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20"
                    : "border-amber-400 dark:border-amber-600 bg-amber-50/50 dark:bg-amber-950/20"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          Confirm email
                        </span>
                        <Badge className={`text-[10px] font-mono ${
                          !confirmEmailEnabled
                            ? "bg-emerald-600 text-white"
                            : "bg-amber-600 text-white"
                        }`}>
                          {!confirmEmailEnabled ? "Mode Dev (Rekomendasi Praktek)" : "Mode Production (Ketat)"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-300">
                        Menentukan apakah pengguna harus mengonfirmasi alamat email mereka sebelum dapat login.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setConfirmEmailEnabled(!confirmEmailEnabled)}
                      className="cursor-pointer shrink-0"
                    >
                      {confirmEmailEnabled ? (
                        <ToggleRight className="w-9 h-9 text-amber-500" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-zinc-400" />
                      )}
                    </button>
                  </div>

                  {/* Penjelasan Interaktif Berdasarkan Status Toggle */}
                  <div className="p-3 rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-xs">
                    {!confirmEmailEnabled ? (
                      <div className="space-y-1.5 text-emerald-900 dark:text-emerald-200">
                        <div className="flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Status: Confirm Email DIMATIKAN (Recommended for Local Dev)</span>
                        </div>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          Saat mahasiswa mendaftar di <code>http://localhost:3000/login</code>, Supabase otomatis menandai <code>email_confirmed_at = NOW()</code>. Mahasiswa bisa <strong>langsung menguji login detik itu juga</strong> tanpa perlu membuka email atau memeriksa spam!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1.5 text-amber-900 dark:text-amber-200">
                        <div className="flex items-center gap-1.5 font-bold">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          <span>Status: Confirm Email DIAKTIFKAN (Standar Produksi)</span>
                        </div>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          Saat pendaftaran, Supabase mengirim email konfirmasi berbatas waktu. Selama tautan di email belum diklik, atribut <code>email_confirmed_at</code> bernilai <code>NULL</code> dan <strong>semua percobaan login akan ditolak</strong>.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Secure Email Change */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Secure email change
                    </span>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Wajibkan konfirmasi ke email lama dan email baru saat pengguna memperbarui alamat email.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSecureEmailChange(!secureEmailChange)}
                    className="cursor-pointer"
                  >
                    {secureEmailChange ? (
                      <ToggleRight className="w-8 h-8 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-zinc-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Perbandingan Matriks Dev vs Production */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                    ✓
                  </span>
                  <span className="font-bold text-xs text-emerald-950 dark:text-emerald-100">
                    Fase Praktek / Development
                  </span>
                </div>
                <ul className="text-[11px] text-zinc-600 dark:text-zinc-300 space-y-1.5 list-disc list-inside">
                  <li><strong>Confirm email:</strong> OFF (Unchecked).</li>
                  <li><strong>Site URL:</strong> <code>http://localhost:3000</code>.</li>
                  <li><strong>Redirect URLs:</strong> <code>http://localhost:3000/**</code>.</li>
                  <li><strong>Keuntungan:</strong> Bebas hambatan, pengujian cepat tanpa batas limit SMTP.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-indigo-300 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                    🚀
                  </span>
                  <span className="font-bold text-xs text-indigo-950 dark:text-indigo-100">
                    Fase Deploy / Production (Vercel)
                  </span>
                </div>
                <ul className="text-[11px] text-zinc-600 dark:text-zinc-300 space-y-1.5 list-disc list-inside">
                  <li><strong>Confirm email:</strong> ON (Checked).</li>
                  <li><strong>Site URL:</strong> Domain Vercel (misal <code>https://odyssey.vercel.app</code>).</li>
                  <li><strong>Custom SMTP:</strong> Hubungkan Resend / SendGrid untuk menghindari spam.</li>
                  <li><strong>Keamanan:</strong> Memastikan akun diverifikasi oleh pemilik email asli.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: SIMULASI ALUR REDIRECT (LIVE PLAYGROUND) ==================== */}
        {activeTab === "redirect_flow" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  Uji Alur Interaktif &amp; Handshake Whitelist
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Simulasikan bagaimana request otentikasi diproses dari browser ke Supabase hingga diarahkan kembali ke aplikasi Next.js Anda.
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg shrink-0">
                <button
                  type="button"
                  onClick={() => setFlowScenario("email_pass")}
                  className={`px-2.5 py-1 text-xs rounded-md font-semibold cursor-pointer ${
                    flowScenario === "email_pass" ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-2xs" : "text-zinc-500"
                  }`}
                >
                  Email &amp; Password
                </button>
                <button
                  type="button"
                  onClick={() => setFlowScenario("magic_link")}
                  className={`px-2.5 py-1 text-xs rounded-md font-semibold cursor-pointer ${
                    flowScenario === "magic_link" ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-2xs" : "text-zinc-500"
                  }`}
                >
                  Magic Link OTP
                </button>
                <button
                  type="button"
                  onClick={() => setFlowScenario("oauth_github")}
                  className={`px-2.5 py-1 text-xs rounded-md font-semibold cursor-pointer ${
                    flowScenario === "oauth_github" ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-2xs" : "text-zinc-500"
                  }`}
                >
                  GitHub OAuth
                </button>
              </div>
            </div>

            {/* Tombol Play Simulator */}
            <div className="flex justify-center">
              <Button
                size="sm"
                onClick={runFlowSimulation}
                disabled={isSimulating}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 text-xs h-9 px-5 cursor-pointer shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isSimulating ? "Memproses Alur..." : "Jalankan Simulasi Alur Redirect"}</span>
              </Button>
            </div>

            {/* Visual Flowchart Stepper */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
              {/* Step 1: Client Form Submit */}
              <div className={`p-4 rounded-xl border transition-all space-y-2 ${
                simStep >= 1
                  ? "border-indigo-400 dark:border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 opacity-60"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <Badge variant="outline" className="text-[9px] font-mono">
                    Client Browser
                  </Badge>
                </div>
                <div className="space-y-0.5">
                  <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                    Form Submit (Next.js)
                  </h5>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {flowScenario === "email_pass" && "User submit formulir login/register ke Server Action auth.ts"}
                    {flowScenario === "magic_link" && "User request link login instan ke alamat email@mahasiswa.ac.id"}
                    {flowScenario === "oauth_github" && "User klik tombol 'Masuk dengan GitHub'"}
                  </p>
                </div>
              </div>

              {/* Step 2: Supabase Auth Engine */}
              <div className={`p-4 rounded-xl border transition-all space-y-2 ${
                simStep >= 2
                  ? "border-emerald-400 dark:border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 opacity-60"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <Badge variant="outline" className="text-[9px] font-mono">
                    Supabase Cloud
                  </Badge>
                </div>
                <div className="space-y-0.5">
                  <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                    Auth Engine Processing
                  </h5>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {flowScenario === "email_pass" && (confirmEmailEnabled ? "Kirim email aktivasi (email_confirmed_at: NULL)" : "Auto-confirm aktif! Buat session JWT instan.")}
                    {flowScenario === "magic_link" && "Generate token OTP 6 digit & tautan redirectTo dengan hash"}
                    {flowScenario === "oauth_github" && "Redirect ke GitHub consent screen untuk persetujuan akun"}
                  </p>
                </div>
              </div>

              {/* Step 3: Whitelist Verification */}
              <div className={`p-4 rounded-xl border transition-all space-y-2 ${
                simStep >= 3
                  ? "border-amber-400 dark:border-amber-600 bg-amber-50/50 dark:bg-amber-950/20"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 opacity-60"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <Badge variant="outline" className="text-[9px] font-mono">
                    Security Guard
                  </Badge>
                </div>
                <div className="space-y-0.5">
                  <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                    Cek Redirect Whitelist
                  </h5>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Supabase mencocokkan target URL dengan daftar <code>Redirect URLs</code> di dashboard.
                  </p>
                </div>
              </div>

              {/* Step 4: Final Handshake */}
              <div className={`p-4 rounded-xl border transition-all space-y-2 ${
                simStep >= 4
                  ? "border-emerald-500 dark:border-emerald-500 bg-emerald-100/60 dark:bg-emerald-950/40 shadow-xs"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 opacity-60"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                    4
                  </span>
                  <Badge variant="outline" className="text-[9px] font-mono text-emerald-600 border-emerald-400">
                    Success 200 OK
                  </Badge>
                </div>
                <div className="space-y-0.5">
                  <h5 className="font-bold text-xs text-emerald-900 dark:text-emerald-100">
                    Session Disimpan di Cookie
                  </h5>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    Pengguna dialihkan ke <code>/dashboard</code> dengan session aktif di cookie terenkripsi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: DIAGNOSTIK ERROR & SOLUSI ==================== */}
        {activeTab === "troubleshooting" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Pilih Masalah Error yang Sedang Dihadapi:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedIssue("err_email_confirm")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedIssue === "err_email_confirm"
                      ? "border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 text-amber-950 dark:text-amber-100 shadow-2xs ring-1 ring-amber-500"
                      : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs mb-1">
                    <span className="text-amber-500">⚠️</span>
                    <span>1. Email Not Confirmed</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Login gagal tepat setelah daftar akun baru.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedIssue("err_redirect_mismatch")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedIssue === "err_redirect_mismatch"
                      ? "border-red-500 bg-red-50/60 dark:bg-red-950/30 text-red-950 dark:text-red-100 shadow-2xs ring-1 ring-red-500"
                      : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs mb-1">
                    <span className="text-red-500">🚫</span>
                    <span>2. Invalid Redirect URL</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Error redirect_uri_mismatch saat Magic Link / OAuth.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedIssue("err_wrong_site")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedIssue === "err_wrong_site"
                      ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-950 dark:text-indigo-100 shadow-2xs ring-1 ring-indigo-500"
                      : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs mb-1">
                    <span className="text-indigo-500">🌐</span>
                    <span>3. Nyasar ke Domain Supabase</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Email redirect tidak kembali ke localhost:3000.
                  </p>
                </button>
              </div>
            </div>

            {/* Detail Solusi untuk Isu Terpilih */}
            <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-xs">
              {selectedIssue === "err_email_confirm" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Penyebab: Fitur verifikasi email masih aktif di Supabase Cloud</span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    Saat fungsi <code>signUp()</code> dipanggil, akun dibuat dengan status belum terverifikasi. Ketika langsung mencoba login dengan <code>signInWithPassword()</code>, Supabase menolak otentikasi demi alasan kepatuhan keamanan.
                  </p>
                  <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 space-y-2">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                      Langkah Solusi 1-Menit di Supabase Studio:
                    </span>
                    <ol className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1 list-decimal list-inside">
                      <li>Buka dashboard proyek Anda di <strong>https://supabase.com/dashboard</strong>.</li>
                      <li>Pilih menu <strong>Authentication</strong> di sidebar kiri ➔ <strong>Providers</strong>.</li>
                      <li>Klik provider <strong>Email</strong> untuk membuka pengaturan.</li>
                      <li>Matikan (uncheck) toggle <strong>&quot;Confirm email&quot;</strong>.</li>
                      <li>Klik <strong>Save</strong> di pojok kanan bawah. Coba login ulang di localhost!</li>
                    </ol>
                  </div>
                </div>
              )}

              {selectedIssue === "err_redirect_mismatch" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Penyebab: URL callback belum didaftarkan di Redirect URLs Whitelist</span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    Supabase melindungi aplikasi dari serangan Open Redirect. Jika parameter <code>redirectTo: &quot;http://localhost:3000/auth/callback&quot;</code> tidak cocok dengan daftar URL yang diizinkan di Supabase Studio, proses otentikasi akan dibatalkan seketika.
                  </p>
                  <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 space-y-2">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                      Langkah Solusi di Supabase Studio:
                    </span>
                    <ol className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1 list-decimal list-inside">
                      <li>Buka menu <strong>Authentication</strong> ➔ <strong>URL Configuration</strong>.</li>
                      <li>Pada bagian <strong>Redirect URLs</strong>, klik tombol <strong>Add URL</strong>.</li>
                      <li>Ketik <code>http://localhost:3000/**</code> lalu klik Save.</li>
                      <li>Pola wildcard <code>/**</code> akan otomatis mengizinkan seluruh sub-rute lokal Anda!</li>
                    </ol>
                  </div>
                </div>
              )}

              {selectedIssue === "err_wrong_site" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                    <Globe className="w-4 h-4" />
                    <span>Penyebab: Site URL masih menggunakan nilai default atau kosong</span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    Jika kode Anda tidak menyertakan parameter <code>redirectTo</code> saat memanggil <code>signInWithOtp()</code>, Supabase akan mengarahkan pengguna ke nilai <strong>Site URL</strong> default. Jika Site URL masih default Supabase, browser tidak akan kembali ke server development Next.js Anda.
                  </p>
                  <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 space-y-2">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                      Langkah Solusi di Supabase Studio:
                    </span>
                    <ol className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1 list-decimal list-inside">
                      <li>Buka menu <strong>Authentication</strong> ➔ <strong>URL Configuration</strong>.</li>
                      <li>Di kolom <strong>Site URL</strong>, ganti nilainya menjadi <code>http://localhost:3000</code>.</li>
                      <li>Klik tombol <strong>Save</strong>.</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Helper Bar */}
      <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
        <span className="text-zinc-500 dark:text-zinc-400 text-[11px] flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-emerald-500" />
          <span>Panduan ini berlaku universal untuk Supabase Cloud &amp; Local Supabase CLI.</span>
        </span>
        <a
          href="https://supabase.com/docs/guides/auth/redirect-urls"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 self-start sm:self-auto text-[11px]"
        >
          <span>Dokumentasi Resmi Supabase Redirect URLs</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
