"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  RotateCcw,
  KeyRound,
  Globe,
  Settings,
  Layers,
  ArrowRight,
  Info,
  Sparkles,
  Zap,
  Lock,
  ChevronRight,
  Play
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function SupabaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L.366 14.286a.396.396 0 0 0 .307.632H12v8.958a.396.396 0 0 0 .716.233l10.918-14.123a.396.396 0 0 0-.272-.632z" />
    </svg>
  );
}

export function GithubOauthSetupSimulator() {
  const [activeTab, setActiveTab] = useState<"walkthrough" | "github" | "supabase" | "diagnostics">("walkthrough");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // State Simulasi GitHub Dashboard
  const [appName, setAppName] = useState("The Serverless Odyssey Dev");
  const [homepageUrl, setHomepageUrl] = useState("http://localhost:3000");
  const [callbackUrl, setCallbackUrl] = useState("https://xyzproject.supabase.co/auth/v1/callback");
  const [isRegistered, setIsRegistered] = useState(false);
  const [secretGenerated, setSecretGenerated] = useState(false);

  // State Simulasi Supabase Dashboard
  const [providerEnabled, setProviderEnabled] = useState(true);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [redirectUrlAdded, setRedirectUrlAdded] = useState(true);

  // State Diagnostic Error Simulation
  const [diagnosticScenario, setDiagnosticScenario] = useState<"correct" | "err_callback" | "err_disabled" | "err_redirect">("correct");

  const sampleClientId = "Ov23abc8899xyz4567";
  const sampleClientSecret = "ghp_sec_a91b2c3d4e5f6g7h8i9j0k_demo";
  const defaultSupabaseCallback = "https://xyzproject.supabase.co/auth/v1/callback";

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isCallbackUrlValid = callbackUrl.includes(".supabase.co/auth/v1/callback");
  const isLocalhostMistake = callbackUrl.includes("localhost:3000");

  const handleAutoPasteToSupabase = () => {
    setClientId(sampleClientId);
    setClientSecret(sampleClientSecret);
  };

  return (
    <div className="rounded-2xl border border-indigo-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm overflow-hidden text-zinc-900 dark:text-zinc-100">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50 via-indigo-50/30 to-purple-50/20 dark:from-zinc-900 dark:via-zinc-900 dark:to-indigo-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">
                Simulasi Panduan Setup: GitHub OAuth 2.0 &amp; Supabase Handshake
              </span>
              <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-[10px] font-mono">
                Interactive Dashboard Guide
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Pelajari alur pertukaran kredensial antara GitHub Developer Settings dan Supabase Studio tanpa risiko salah konfigurasi.
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("walkthrough")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "walkthrough"
                ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            1. Panduan Alur
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("github")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "github"
                ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <GithubIcon />
            <span>Dashboard GitHub</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("supabase")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "supabase"
                ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <SupabaseIcon className="text-emerald-500" />
            <span>Studio Supabase</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("diagnostics")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "diagnostics"
                ? "bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Uji &amp; Diagnostik Error</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Content */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* TAB 1: WALKTHROUGH ALUR 4 LANGKAH */}
        {activeTab === "walkthrough" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/50 flex items-start gap-3">
              <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-1">
                <span className="font-bold text-zinc-900 dark:text-white block">
                  Prinsip Handshake: Mengapa Dibutuhkan 2 Dashboard Berbeda?
                </span>
                <p>
                  Aplikasi Next.js Anda tidak berbicara langsung ke GitHub untuk otorisasi rahasia. <strong>Supabase Auth bertindak sebagai Gateway OAuth</strong> di tengah-tengah. Oleh karena itu, GitHub memerlukan alamat callback milik Supabase, dan Supabase memerlukan kunci rahasia (*Client Secret*) milik aplikasi GitHub Anda.
                </p>
              </div>
            </div>

            {/* Step Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Step 1 */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    1
                  </span>
                  <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                    Mulai di Supabase Studio
                  </Badge>
                </div>
                <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  Salin Callback URL Resmi dari Supabase
                </h5>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Buka Supabase ➔ <strong>Authentication</strong> ➔ <strong>Providers</strong> ➔ <strong>GitHub</strong>. Di sana terdapat kolom bertuliskan <em>&quot;Callback URL (for OAuth)&quot;</em>.
                </p>
                <div className="p-2.5 rounded-lg bg-zinc-900 text-zinc-200 font-mono text-[11px] flex items-center justify-between gap-2 border border-zinc-700">
                  <span className="truncate">{defaultSupabaseCallback}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(defaultSupabaseCallback, "step1")}
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Salin URL"
                  >
                    {copiedKey === "step1" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-zinc-900 text-white dark:bg-zinc-700 text-xs font-bold">
                    2
                  </span>
                  <Badge variant="outline" className="text-[10px] text-zinc-700 dark:text-zinc-300 border-zinc-400">
                    Buka GitHub Developer Settings
                  </Badge>
                </div>
                <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  Daftarkan OAuth App Baru di GitHub
                </h5>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Klik profil GitHub ➔ <strong>Settings</strong> ➔ <strong>Developer Settings</strong> (paling bawah) ➔ <strong>OAuth Apps</strong> ➔ <strong>New OAuth App</strong>.
                </p>
                <div className="space-y-1 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <div>• Homepage URL: <span className="text-indigo-600 dark:text-indigo-400 font-bold">http://localhost:3000</span></div>
                  <div>• Authorization callback URL: <span className="text-emerald-600 dark:text-emerald-400 font-bold">Tempel URL Supabase tadi!</span></div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                    3
                  </span>
                  <Badge variant="outline" className="text-[10px] text-indigo-600 border-indigo-500/30">
                    GitHub ➔ Supabase
                  </Badge>
                </div>
                <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  Generate Client Secret &amp; Salin ke Supabase
                </h5>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Salin <strong>Client ID</strong> dari halaman GitHub App. Lalu klik <em>&quot;Generate a new client secret&quot;</em> dan salin kodenya. Bawa kedua string rahasia ini kembali ke Supabase Dashboard.
                </p>
                <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Client Secret hanya ditampilkan satu kali oleh GitHub!</span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold">
                    4
                  </span>
                  <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-500/30">
                    Supabase URL Configuration
                  </Badge>
                </div>
                <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  Daftarkan Redirect URL Lokal Aplikasi
                </h5>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Di Supabase ➔ <strong>Authentication</strong> ➔ <strong>URL Configuration</strong> ➔ <strong>Redirect URLs</strong>. Tambahkan URL lokal Next.js Anda:
                </p>
                <div className="p-2.5 rounded-lg bg-zinc-900 text-zinc-200 font-mono text-[11px] flex items-center justify-between border border-zinc-700">
                  <span className="text-purple-300">http://localhost:3000/auth/callback</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                    Wajib Ditambahkan
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs text-zinc-500">
                Ingin mencoba simulasi pengisian langsung di mockup dashboard?
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setActiveTab("github")}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs cursor-pointer gap-1.5"
                >
                  <GithubIcon />
                  <span>Buka Mockup GitHub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: MOCKUP DASHBOARD GITHUB */}
        {activeTab === "github" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* GitHub Header Bar Style */}
            <div className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-950 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <GithubIcon className="w-6 h-6 text-zinc-800 dark:text-zinc-200" />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                      GitHub Developer Settings ➔ OAuth Apps ➔ Register a new application
                    </span>
                    <span className="block text-[11px] text-zinc-500 font-mono">
                      https://github.com/settings/applications/new
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] text-zinc-600 dark:text-zinc-400">
                  Simulasi Formulir GitHub
                </Badge>
              </div>

              {!isRegistered ? (
                /* Registration Form */
                <div className="space-y-4 max-w-2xl">
                  {/* Field 1: App Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                      <span>Application name <span className="text-red-500">*</span></span>
                      <span className="text-[10px] font-normal text-zinc-500">Nama yang muncul saat persetujuan login</span>
                    </label>
                    <input
                      type="text"
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      className="w-full text-xs font-mono p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  {/* Field 2: Homepage URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                      <span>Homepage URL <span className="text-red-500">*</span></span>
                      <span className="text-[10px] font-normal text-zinc-500">Alamat website utama Anda</span>
                    </label>
                    <input
                      type="text"
                      value={homepageUrl}
                      onChange={(e) => setHomepageUrl(e.target.value)}
                      className="w-full text-xs font-mono p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  {/* Field 3: Authorization Callback URL (Critical Field) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        Authorization callback URL <span className="text-red-500">*</span>
                      </label>
                      {isCallbackUrlValid ? (
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Format Valid: Mengarah ke Supabase Gateway
                        </span>
                      ) : isLocalhostMistake ? (
                        <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          SALAH: Jangan isi localhost di GitHub!
                        </span>
                      ) : null}
                    </div>
                    <input
                      type="text"
                      value={callbackUrl}
                      onChange={(e) => setCallbackUrl(e.target.value)}
                      className={`w-full text-xs font-mono p-2.5 rounded-lg border bg-white dark:bg-zinc-900 outline-none transition-all ${
                        isCallbackUrlValid
                          ? "border-emerald-500/80 ring-2 ring-emerald-500/20"
                          : isLocalhostMistake
                          ? "border-rose-500 ring-2 ring-rose-500/20"
                          : "border-zinc-300 dark:border-zinc-700"
                      }`}
                    />

                    {/* Presets to test */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] text-zinc-500">Coba Klik Contoh:</span>
                      <button
                        type="button"
                        onClick={() => setCallbackUrl("https://xyzproject.supabase.co/auth/v1/callback")}
                        className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 cursor-pointer"
                      >
                        ✅ URL Benar (Supabase Gateway)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCallbackUrl("http://localhost:3000/auth/callback")}
                        className="text-[11px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 cursor-pointer"
                      >
                        ❌ URL Salah (Jebakan Mahasiswa)
                      </button>
                    </div>

                    {isLocalhostMistake && (
                      <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs space-y-1">
                        <span className="font-bold block">⚠️ Mengapa diisi localhost adalah salah besar?</span>
                        <p>
                          Jika Anda mengisi <code>localhost:3000</code> di GitHub, maka GitHub akan langsung melempar kode otorisasi ke laptop Anda tanpa melalui server Supabase Auth. Server Anda tidak memiliki hak kriptografi untuk menukarkannya menjadi token sesi Supabase! Supabase-lah yang harus menjadi perantara.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button
                      type="button"
                      onClick={() => setIsRegistered(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4 rounded-lg cursor-pointer"
                    >
                      Register application
                    </Button>
                  </div>
                </div>
              ) : (
                /* App Registered Detail View */
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Aplikasi &quot;{appName}&quot; berhasil didaftarkan di GitHub!</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setIsRegistered(false); setSecretGenerated(false); }}
                      className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 underline cursor-pointer"
                    >
                      Ubah data
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Client ID Card */}
                    <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Client ID (Publik)</span>
                        <Badge variant="outline" className="text-[10px] text-zinc-500">Siap Disalin</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-xs">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">{sampleClientId}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(sampleClientId, "client_id")}
                          className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                          title="Salin Client ID"
                        >
                          {copiedKey === "client_id" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500">Salin nilai ini ke kolom Client ID di Supabase Studio.</p>
                    </div>

                    {/* Client Secrets Card */}
                    <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Client secrets (Rahasia)</span>
                        <Badge variant="outline" className="text-[10px] text-rose-500 border-rose-500/30">Never Commit</Badge>
                      </div>

                      {!secretGenerated ? (
                        <div className="space-y-2">
                          <p className="text-[11px] text-zinc-500">Belum ada client secret yang aktif untuk aplikasi ini.</p>
                          <Button
                            size="sm"
                            type="button"
                            onClick={() => setSecretGenerated(true)}
                            className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs h-8 cursor-pointer"
                          >
                            Generate a new client secret
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between p-2 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-xs">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold truncate max-w-[200px]">{sampleClientSecret}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(sampleClientSecret, "client_secret")}
                              className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                              title="Salin Client Secret"
                            >
                              {copiedKey === "client_secret" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                            ⚠️ Kode ini hanya muncul satu kali! Salin sekarang ke Supabase.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {secretGenerated && (
                    <div className="pt-2 flex justify-end">
                      <Button
                        type="button"
                        onClick={() => {
                          handleAutoPasteToSupabase();
                          setActiveTab("supabase");
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5 cursor-pointer"
                      >
                        <span>Lanjut &amp; Salin Otomatis ke Supabase</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 3: MOCKUP DASHBOARD SUPABASE */}
        {activeTab === "supabase" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Supabase Studio UI Style */}
            <div className="rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                    <SupabaseIcon />
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                      Supabase Studio ➔ Authentication ➔ Providers ➔ GitHub
                    </span>
                    <span className="block text-[11px] text-zinc-500 font-mono">
                      https://supabase.com/dashboard/project/xyzproject/auth/providers
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                  Auth Providers Config
                </Badge>
              </div>

              {/* Form Settings */}
              <div className="space-y-5 max-w-2xl">
                {/* Switch: Enable GitHub */}
                <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200">
                      Enable GitHub Provider
                    </span>
                    <p className="text-[11px] text-zinc-500">
                      Izinkan pengguna masuk ke aplikasi Anda menggunakan akun GitHub
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProviderEnabled((prev) => !prev)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      providerEnabled ? "bg-emerald-600" : "bg-zinc-300 dark:bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 left-1 ${
                        providerEnabled ? "translate-x-6" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Field: Client ID */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      Client ID (for OAuth) <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setClientId(sampleClientId)}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      Paste dari GitHub
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Tempel Client ID dari GitHub Developer Settings"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Field: Client Secret */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      Client Secret (for OAuth) <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setClientSecret(sampleClientSecret)}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      Paste dari GitHub
                    </button>
                  </div>
                  <input
                    type="password"
                    placeholder="Tempel Client Secret dari GitHub"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Reference Callback Box provided by Supabase */}
                <div className="p-3.5 rounded-lg bg-zinc-200/60 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 space-y-1.5">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                    Callback URL (for OAuth to copy to GitHub)
                  </span>
                  <div className="flex items-center justify-between p-2 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-xs border border-zinc-300 dark:border-zinc-700">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold truncate">
                      {defaultSupabaseCallback}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(defaultSupabaseCallback, "sb_callback")}
                      className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                    >
                      {copiedKey === "sb_callback" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    Ini adalah URL resmi yang wajib Anda tempelkan pada kolom <em>Authorization callback URL</em> di GitHub.
                  </p>
                </div>

                {/* Second Section: Redirect URLs */}
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200 block">
                        URL Configuration ➔ Redirect URLs
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        Daftar URL yang diizinkan untuk dikembalikan ke aplikasi lokal
                      </span>
                    </div>
                    <Badge className={redirectUrlAdded ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-500/20 text-zinc-400"}>
                      {redirectUrlAdded ? "http://localhost:3000/auth/callback (Aktif)" : "Belum Ada"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value="http://localhost:3000/auth/callback"
                      className="flex-1 text-xs font-mono p-2 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                    />
                    <Button
                      size="sm"
                      type="button"
                      variant="outline"
                      onClick={() => setRedirectUrlAdded(true)}
                      className="text-xs cursor-pointer"
                    >
                      {redirectUrlAdded ? "Terdaftar" : "Tambah URL"}
                    </Button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">
                    Status: {clientId && clientSecret && providerEnabled ? "✅ Kredensial Lengkap" : "⚠️ Belum Lengkap"}
                  </span>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("diagnostics")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer gap-1.5"
                  >
                    <span>Uji Hasil Konfigurasi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: DIAGNOSTICS & TEST HANDSHAKE */}
        {activeTab === "diagnostics" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Scenario Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                Pilih Skenario untuk Menguji Respon Sistem:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDiagnosticScenario("correct")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    diagnosticScenario === "correct"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 font-bold shadow-xs ring-1 ring-emerald-500"
                      : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Skenario 1 (Ideal)</span>
                  </div>
                  <span className="text-[11px] font-normal opacity-80 block">
                    Semua URL &amp; Kredensial terpasang benar
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDiagnosticScenario("err_callback")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    diagnosticScenario === "err_callback"
                      ? "border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-200 font-bold shadow-xs ring-1 ring-rose-500"
                      : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>Skenario 2 (URL Error)</span>
                  </div>
                  <span className="text-[11px] font-normal opacity-80 block">
                    GitHub diisi localhost alih-alih Supabase
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDiagnosticScenario("err_disabled")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    diagnosticScenario === "err_disabled"
                      ? "border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-200 font-bold shadow-xs ring-1 ring-rose-500"
                      : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>Skenario 3 (Provider Off)</span>
                  </div>
                  <span className="text-[11px] font-normal opacity-80 block">
                    Lupa mengaktifkan toggle di Supabase
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDiagnosticScenario("err_redirect")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    diagnosticScenario === "err_redirect"
                      ? "border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-200 font-bold shadow-xs ring-1 ring-rose-500"
                      : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>Skenario 4 (Redirect URL)</span>
                  </div>
                  <span className="text-[11px] font-normal opacity-80 block">
                    Lupa daftar localhost di Redirect URLs
                  </span>
                </button>
              </div>
            </div>

            {/* Simulated Browser Window */}
            <div className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-950 overflow-hidden shadow-lg">
              {/* Window Title Bar */}
              <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-zinc-400 ml-2">Peramban Pengguna: Simulasi Alur Login</span>
                </div>
                <Badge variant="outline" className="text-[10px] text-zinc-400 border-zinc-700">
                  HTTP Status Monitor
                </Badge>
              </div>

              {/* Address Bar */}
              <div className="p-2.5 bg-zinc-900/50 border-b border-zinc-800/80 px-4 flex items-center gap-2 text-xs font-mono">
                <Globe className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-zinc-300 truncate">
                  {diagnosticScenario === "correct" && "http://localhost:3000/dashboard (307 Sukses)"}
                  {diagnosticScenario === "err_callback" && "https://github.com/login/oauth/error?error=redirect_uri_mismatch"}
                  {diagnosticScenario === "err_disabled" && "http://localhost:3000/login?error=Unsupported_provider:_github"}
                  {diagnosticScenario === "err_redirect" && "https://xyzproject.supabase.co/auth/v1/error?error=redirect_to_not_allowed"}
                </span>
              </div>

              {/* Window Content */}
              <div className="p-6 text-center space-y-4">
                {diagnosticScenario === "correct" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto space-y-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h5 className="font-bold text-base text-white">
                      🎉 Handshake Sukses 100%!
                    </h5>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      GitHub mengizinkan otorisasi, melempar kode sementara ke gateway Supabase, Supabase menukar ke token JWT via Client Secret, dan pengguna berhasil dialihkan masuk ke <code>/dashboard</code>!
                    </p>
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                      Status: 200 OK | Cookie: sb-access-token (HttpOnly)
                    </div>
                  </motion.div>
                )}

                {diagnosticScenario === "err_callback" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto space-y-3 text-left"
                  >
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-sm text-rose-400">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <span>The redirect_uri MUST match the registered callback URL</span>
                      </div>
                      <p className="text-xs text-rose-300/90 leading-relaxed">
                        GitHub menolak permintaan otorisasi karena aplikasi Anda mengirimkan parameter callback Supabase, tetapi di Developer Settings Anda malah menulis <code>http://localhost:3000</code>.
                      </p>
                      <div className="p-2.5 rounded bg-zinc-900 border border-rose-500/30 text-[11px] font-mono text-zinc-300">
                        💡 Solusi: Ganti Authorization callback URL di GitHub dengan <code>https://&lt;project&gt;.supabase.co/auth/v1/callback</code>.
                      </div>
                    </div>
                  </motion.div>
                )}

                {diagnosticScenario === "err_disabled" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto space-y-3 text-left"
                  >
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-sm text-amber-400">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <span>Error: Unsupported provider: &apos;github&apos;</span>
                      </div>
                      <p className="text-xs text-amber-300/90 leading-relaxed">
                        Supabase menolak permintaan login karena sakelar &quot;Enable GitHub Provider&quot; di Supabase Studio belum dinyalakan atau tombol Save belum ditekan.
                      </p>
                      <div className="p-2.5 rounded bg-zinc-900 border border-amber-500/30 text-[11px] font-mono text-zinc-300">
                        💡 Solusi: Masuk ke Supabase Studio ➔ Auth ➔ Providers ➔ GitHub ➔ Aktifkan Toggle ➔ Klik Save.
                      </div>
                    </div>
                  </motion.div>
                )}

                {diagnosticScenario === "err_redirect" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto space-y-3 text-left"
                  >
                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/40 text-purple-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-sm text-purple-400">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <span>Error: Redirect to URL is not allowed</span>
                      </div>
                      <p className="text-xs text-purple-300/90 leading-relaxed">
                        Supabase berhasil memvalidasi GitHub, namun saat hendak mengembalikan pengguna ke aplikasi lokal Anda di <code>http://localhost:3000/auth/callback</code>, Supabase memblokirnya demi mencegah serangan phishing Open-Redirect.
                      </p>
                      <div className="p-2.5 rounded bg-zinc-900 border border-purple-500/30 text-[11px] font-mono text-zinc-300">
                        💡 Solusi: Daftarkan <code>http://localhost:3000/auth/callback</code> pada tabel Redirect URLs di menu URL Configuration Supabase.
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
