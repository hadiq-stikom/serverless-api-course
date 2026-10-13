"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Send,
  Inbox,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Terminal,
  KeyRound,
  Zap,
  Clock,
  RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function MagicLinkInboxSimulator() {
  const [activeTab, setActiveTab] = useState<"inbox_preview" | "pkce_flow" | "rate_limits">("inbox_preview");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // State Email Simulation
  const [inputEmail, setInputEmail] = useState("budi.santoso@student.ac.id");
  const [hasSent, setHasSent] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isOpeningLink, setIsOpeningLink] = useState(false);
  const [loginCompleted, setLoginCompleted] = useState(false);

  // OTP Demo Code
  const sampleOtp = "849201";
  const sampleTokenHash = "pkce_hash_7f9a2b4c6e8d1035";
  const sampleCallbackUrl = `http://localhost:3000/auth/callback?token_hash=${sampleTokenHash}&type=magiclink&next=/dashboard`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSendEmail = () => {
    setIsSending(true);
    setLoginCompleted(false);
    setTimeout(() => {
      setIsSending(false);
      setHasSent(true);
    }, 600);
  };

  const handleClickMagicLink = () => {
    setIsOpeningLink(true);
    setTimeout(() => {
      setIsOpeningLink(false);
      setLoginCompleted(true);
    }, 800);
  };

  return (
    <div className="rounded-2xl border border-indigo-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm overflow-hidden text-zinc-900 dark:text-zinc-100">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50 via-indigo-50/30 to-teal-50/20 dark:from-zinc-900 dark:via-zinc-900 dark:to-indigo-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">
                Simulasi Panduan: Magic Link OTP &amp; InBucket Webmail
              </span>
              <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-[10px] font-mono">
                Email Auth Playground
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Uji alur login tanpa kata sandi, inspeksi parameter token PKCE, dan pahami cara kerja Route Handler penukar session.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setInputEmail("budi.santoso@student.ac.id");
            setHasSent(true);
            setLoginCompleted(false);
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
          onClick={() => setActiveTab("inbox_preview")}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer border-t border-x ${
            activeTab === "inbox_preview"
              ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-indigo-600 dark:text-indigo-400 -mb-px shadow-xs"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Inbox className="w-4 h-4 text-indigo-500" />
          <span>1. Simulasi Kotak Masuk (Webmail Preview)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pkce_flow")}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer border-t border-x ${
            activeTab === "pkce_flow"
              ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 -mb-px shadow-xs"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Zap className="w-4 h-4 text-emerald-500" />
          <span>2. Alur Penukaran Token PKCE Route Handler</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rate_limits")}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer border-t border-x ${
            activeTab === "rate_limits"
              ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-amber-600 dark:text-amber-400 -mb-px shadow-xs"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>3. Batasan Rate Limit &amp; Tips Praktek</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* ==================== TAB 1: INBOX PREVIEW ==================== */}
        {activeTab === "inbox_preview" && (
          <div className="space-y-6">
            {/* Input Simulator Form */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 space-y-3">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-indigo-500" />
                <span>Simulasikan Pengiriman Magic Link dari Aplikasi Next.js:</span>
              </span>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="Masukkan alamat email mahasiswa"
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
                <Button
                  size="sm"
                  onClick={handleSendEmail}
                  disabled={isSending}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-1.5 text-xs h-9 shrink-0 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? "Mengirim..." : "Kirim Magic Link"}</span>
                </Button>
              </div>
            </div>

            {/* Simulated Webmail Inbox Viewer */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
              {/* Webmail Window Header */}
              <div className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Kotak Masuk Email (Simulasi InBucket / Webmail)</span>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  1 Email Baru
                </Badge>
              </div>

              {/* Email Content Body */}
              <div className="p-5 space-y-4">
                <div className="space-y-1 border-b border-zinc-100 dark:border-zinc-800 pb-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      Dari: Supabase Auth &lt;noreply@mail.app.supabase.io&gt;
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">Baru saja</span>
                  </div>
                  <div className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                    Kepada: <span className="font-mono text-zinc-700 dark:text-zinc-300">{inputEmail}</span>
                  </div>
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 pt-1">
                    Subjek: Log In to The Serverless Odyssey
                  </div>
                </div>

                {/* Email Template Card */}
                <div className="p-5 rounded-xl border border-indigo-100 dark:border-zinc-800 bg-gradient-to-b from-indigo-50/40 to-white dark:from-zinc-800/50 dark:to-zinc-900 space-y-4 text-center">
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      Masuk Instan Tanpa Kata Sandi
                    </h5>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 max-w-md mx-auto leading-relaxed">
                      Klik tombol di bawah ini untuk langsung masuk ke sesi akun Anda di platform <strong>The Serverless Odyssey</strong>:
                    </p>
                  </div>

                  {/* Primary Magic Link Button */}
                  <div className="pt-2">
                    <Button
                      size="sm"
                      onClick={handleClickMagicLink}
                      disabled={isOpeningLink || loginCompleted}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-6 gap-2 cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {isOpeningLink
                          ? "Memverifikasi Token PKCE..."
                          : loginCompleted
                          ? "✓ Sesi Berhasil Diaktifkan!"
                          : "Masuk Sekarang ke The Serverless Odyssey ➔"}
                      </span>
                    </Button>
                  </div>

                  {/* Secondary OTP Code Option */}
                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 max-w-sm mx-auto text-xs space-y-1.5">
                    <span className="text-[11px] text-zinc-500 block">Atau masukkan kode OTP 6-digit berikut:</span>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 font-mono text-base font-bold tracking-widest text-indigo-600 dark:text-indigo-400 border border-zinc-300 dark:border-zinc-700">
                      <span>{sampleOtp}</span>
                    </div>
                  </div>
                </div>

                {/* URL Inspector */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="font-semibold">Inspeksi URL Tautan Asli (Route Handler Callback Target):</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(sampleCallbackUrl, "cb_url")}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === "cb_url" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>Salin URL</span>
                    </button>
                  </div>
                  <code className="block p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 font-mono text-[11px] text-zinc-700 dark:text-zinc-300 break-all border border-zinc-200 dark:border-zinc-700">
                    {sampleCallbackUrl}
                  </code>
                </div>

                {loginCompleted && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>
                      <strong>Handshake Berhasil:</strong> Token PKCE telah diverifikasi oleh Route Handler <code>/auth/callback</code> dan pengguna dialihkan ke <code>/dashboard</code>!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: PKCE FLOW ==================== */}
        {activeTab === "pkce_flow" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Mekanisme Kerja PKCE pada Magic Link:</span>
                <p className="leading-relaxed">
                  Ketika tautan email diklik, peramban membuka Route Handler Next.js 16 di <code>src/app/auth/callback/route.ts</code>. Route Handler membaca parameter <code>token_hash</code> dan menukarnya dengan sesi permanen menggunakan SDK Supabase.
                </p>
              </div>
            </div>

            {/* Stepper Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                    Tautan Email Diklik
                  </span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Browser membuka URL callback dengan query parameter: <code>?token_hash=...&amp;type=magiclink</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                    Route Handler (GET)
                  </span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Fungsi <code>supabase.auth.verifyOtp()</code> menukar token hash menjadi session resmi dan menyimpannya di cookie.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                    Redirect ke /dashboard
                  </span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Route handler mengembalikan <code>NextResponse.redirect(&apos;/dashboard&apos;)</code>. Pengguna langsung login secara mulus!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: RATE LIMITS & BEST PRACTICES ==================== */}
        {activeTab === "rate_limits" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Peringatan Pembatasan Email Gratis Supabase Cloud (Rate Limit Hazard):</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Supabase Cloud tier gratis menggunakan shared SMTP pool dengan batas pengiriman <strong>hanya 3 hingga 4 email per jam</strong> per proyek. Jika seluruh kelas (30 mahasiswa) mengirim magic link serentak, Supabase akan menolak pengiriman dengan status <code>429 Too Many Requests</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
                <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Solusi 1: Supabase CLI Lokal (InBucket)</span>
                </span>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Jalankan Supabase secara lokal via <code>npx supabase start</code>. Supabase CLI menyediakan antarmuka webmail lokal tanpa batas di <code>http://localhost:54324</code>, di mana seluruh email yang dikirim langsung tertangkap di browser tanpa koneksi internet.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2">
                <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Solusi 2: Custom SMTP (Resend / SendGrid)</span>
                </span>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Untuk deployment produksi, sambungkan akun <strong>Resend</strong> (3000 email gratis/bulan) di <strong>Supabase Dashboard ➔ Project Settings ➔ Auth ➔ SMTP Settings</strong>. Email akan terkirim dengan reputasi domain tinggi dan tidak masuk ke folder spam.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Helper Bar */}
      <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
        <span className="text-zinc-500 dark:text-zinc-400 text-[11px] flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>Tautan Magic Link otomatis kedaluwarsa setelah 10 menit (standar keamanan OWASP).</span>
        </span>
        <a
          href="https://supabase.com/docs/guides/auth/passwordless-login/auth-magic-link"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 self-start sm:self-auto text-[11px]"
        >
          <span>Dokumentasi Resmi Supabase Magic Link OTP</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
