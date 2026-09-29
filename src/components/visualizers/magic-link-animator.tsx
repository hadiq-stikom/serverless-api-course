"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  RotateCcw, 
  Lock, 
  ExternalLink,
  Sparkles,
  Inbox,
  MousePointerClick
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function MagicLinkAnimator() {
  const [emailInput, setEmailInput] = useState("mahasiswa@serverless.ac.id");
  const [linkSent, setLinkSent] = useState(false);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [activeMode, setActiveMode] = useState<"flow" | "vs-password">("flow");

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    setLinkSent(true);
    setTokenVerified(false);
  };

  const handleVerifyLink = () => {
    setTokenVerified(true);
  };

  const handleReset = () => {
    setLinkSent(false);
    setTokenVerified(false);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
              Pilar 1.3: Passwordless Auth
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">OTP Cryptographic Token</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Otentikasi Passwordless: Magic Link &amp; One-Time Token (OTP)
          </h4>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveMode("flow")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMode === "flow"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Alur Simulasi Interaktif
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("vs-password")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMode === "vs-password"
                ? "bg-zinc-700 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Perbandingan vs Password
          </button>
        </div>
      </div>

      {activeMode === "flow" ? (
        <div className="space-y-5">
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Metode <strong>Passwordless Magic Link</strong> menghilangkan keharusan mengingat kata sandi. Supabase Auth membuat token kriptografis berumur 15 menit dan mengirimkannya ke surel pengguna. Mengklik tautan tersebut langsung memverifikasi identitas pengguna secara sah.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: Input Form */}
            <div className={`p-4 rounded-xl border transition-all ${
              !linkSent 
                ? "border-emerald-500/50 bg-emerald-500/5 ring-2 ring-emerald-500/20"
                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 opacity-80"
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                <span>1. Form Entri Email</span>
                <span className="font-mono text-emerald-500">signInWithOtp()</span>
              </div>
              <form onSubmit={handleSendLink} className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-zinc-500 block mb-1">Email Pengguna:</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    disabled={linkSent}
                    className="w-full text-xs font-mono p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  disabled={linkSent}
                  className="w-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Kirim Magic Link
                </Button>
              </form>
            </div>

            {/* Step 2: Simulated Inbox */}
            <div className={`p-4 rounded-xl border transition-all ${
              linkSent && !tokenVerified
                ? "border-amber-500/50 bg-amber-500/5 ring-2 ring-amber-500/20"
                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60"
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                <span>2. Kotak Masuk Email</span>
                <Inbox className="w-4 h-4 text-amber-500" />
              </div>

              {linkSent ? (
                <div className="space-y-2.5">
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white space-y-2 font-mono text-[11px]">
                    <div className="text-zinc-400 text-[10px]">Dari: noreply@supabase.co</div>
                    <div className="font-bold text-amber-400">Masuk ke The Serverless Odyssey</div>
                    <div className="text-zinc-300 text-[10px]">
                      Klik tautan aman berikut untuk login ke akun Anda (berlaku 15 menit):
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyLink}
                      disabled={tokenVerified}
                      className="w-full mt-1 py-1.5 px-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MousePointerClick className="w-3.5 h-3.5" />
                      {tokenVerified ? "Tautan Telah Terverifikasi" : "Klik untuk Masuk ➔"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-32 flex flex-col items-center justify-center text-center text-zinc-400 text-xs">
                  <Mail className="w-6 h-6 mb-1 text-zinc-300 dark:text-zinc-600" />
                  <span>Menunggu formulir dikirim...</span>
                </div>
              )}
            </div>

            {/* Step 3: Verified Session */}
            <div className={`p-4 rounded-xl border transition-all ${
              tokenVerified
                ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20"
                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60"
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                <span>3. Sesi Terbit di Browser</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>

              {tokenVerified ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs space-y-1">
                    <div className="flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Otentikasi Berhasil!</span>
                    </div>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-300">
                      OTP ditukar menjadi JWT Session. Cookie HTTP-Only telah tertanam di browser.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="w-full text-xs font-bold"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    Ulangi Simulasi
                  </Button>
                </div>
              ) : (
                <div className="h-32 flex flex-col items-center justify-center text-center text-zinc-400 text-xs">
                  <Lock className="w-6 h-6 mb-1 text-zinc-300 dark:text-zinc-600" />
                  <span>Sesi belum aktif</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Comparison Table View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>Password Tradisional (Rentan)</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-red-500 font-bold">✗</span>
                <span><strong>Credential Stuffing:</strong> User sering memakai password yang sama di banyak situs web. Jika salah satu bocor, akun lain ikut terancam.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-red-500 font-bold">✗</span>
                <span><strong>Brute Force &amp; Dictionary Attack:</strong> Hacker mencoba jutaan kombinasi kata sandi populer (seperti 123456, password, qwerty).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-red-500 font-bold">✗</span>
                <span><strong>Beban Fitur Reset Password:</strong> Membutuhkan alur "Lupa Kata Sandi" yang rumit dan rawan phishing.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Passwordless Magic Link (Serverless Standard)</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Nol Password Tersimpan:</strong> Database Supabase sama sekali tidak menyimpan password hash user, mengeliminasi risiko kebocoran sandi.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Validasi Kepemilikan Nyata:</strong> Menjamin pengguna adalah pemilik sah kotak masuk email yang didaftarkan.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>One-Time Use &amp; Auto Expire:</strong> Token hanya bisa diklik satu kali dan otomatis hangus dalam 15 menit.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
