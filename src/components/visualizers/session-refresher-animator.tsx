"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Lock, 
  Unlock, 
  Server, 
  Globe, 
  Database,
  ArrowRight,
  RefreshCw,
  Cookie
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SessionRefresherAnimator() {
  const [selectedMethod, setSelectedMethod] = useState<"getUser" | "getSession">("getUser");
  const [sessionRevokedInDb, setSessionRevokedInDb] = useState<boolean>(false);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 text-xs font-semibold">
              Pilar 2.2: Kerentanan Kritis &amp; Best Practice
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">getUser() vs getSession()</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Keamanan Sesi di Middleware: Mengapa getSession() Dilarang Keras
          </h4>
        </div>

        {/* Method Switcher */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setSelectedMethod("getUser")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedMethod === "getUser"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            auth.getUser() (Resmi)
          </button>
          <button
            type="button"
            onClick={() => setSelectedMethod("getSession")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedMethod === "getSession"
                ? "bg-red-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            auth.getSession() (Anti-Pattern)
          </button>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
        Banyak tutorial usang menyarankan penggunaan <code className="font-mono text-xs px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-red-500 font-bold">supabase.auth.getSession()</code> di Middleware Next.js. Dokumentasi resmi Supabase secara tegas menyatakan bahwa hal ini adalah <strong>lubang keamanan fatal</strong>!
      </p>

      {/* Database State Toggle */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-500" />
            <span>Kondisi Akun Pengguna di Supabase Database Server:</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {sessionRevokedInDb
              ? "🔴 Akun dinonaktifkan / Password diubah oleh admin / Sesi dicabut!"
              : "🟢 Akun aktif normal di auth.users."}
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          variant={sessionRevokedInDb ? "destructive" : "outline"}
          onClick={() => setSessionRevokedInDb(!sessionRevokedInDb)}
          className="text-xs font-bold"
        >
          {sessionRevokedInDb ? "Pulihkan Akun ke Aktif" : "Simulasikan: Cabut Sesi / Blokir Akun di Database"}
        </Button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Selected Method Behavior */}
        <div className={`p-4 rounded-xl border transition-all space-y-3 ${
          selectedMethod === "getUser"
            ? "border-emerald-500/40 bg-emerald-500/5"
            : "border-red-500/40 bg-red-500/5"
        }`}>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className={selectedMethod === "getUser" ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}>
              Metode: {selectedMethod === "getUser" ? "supabase.auth.getUser()" : "supabase.auth.getSession()"}
            </span>
            <Badge className={selectedMethod === "getUser" ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" : "bg-red-500/20 text-red-700 dark:text-red-300"}>
              {selectedMethod === "getUser" ? "Server Validation" : "Client Cookie Parse Only"}
            </Badge>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300 space-y-2">
            <div className="text-zinc-500 text-[10px]">// Cara kerja internal metode:</div>
            {selectedMethod === "getUser" ? (
              <div className="text-emerald-400 leading-relaxed">
                1. Baca token dari request.cookies<br />
                2. Kirim token ke Supabase Auth Server (GoTrue)<br />
                3. Server Supabase cek status auth.users &amp; validitas sesi<br />
                4. Kembalikan data user TEROTENTIKASI 100%
              </div>
            ) : (
              <div className="text-red-400 leading-relaxed">
                1. Baca cookie browser lokal<br />
                2. Dekode string JWT secara naif (JSON.parse Base64)<br />
                3. TIDAK MENGHUBUNGI SERVER SUPABASE SAMA SEKALI!<br />
                4. Anggap user sah selama token belum expired (BUTA STATUS RIIL)
              </div>
            )}
          </div>

          {/* Outcome Status */}
          <div className={`p-3 rounded-lg border text-xs leading-relaxed ${
            selectedMethod === "getUser"
              ? sessionRevokedInDb
                ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
              : sessionRevokedInDb
              ? "bg-red-500/20 border-red-500/50 text-red-950 dark:text-red-200 font-bold"
              : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
          }`}>
            <div className="font-bold flex items-center gap-1.5 mb-1">
              {selectedMethod === "getUser" ? (
                sessionRevokedInDb ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>KEAMANAN TEGAK: User Terblokir Berhasil Dicegat!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>AKSES RESMI: Pengguna Aktif Diizinkan Masuk.</span>
                  </>
                )
              ) : (
                sessionRevokedInDb ? (
                  <>
                    <ShieldAlert className="w-4 h-4 text-red-500 animate-bounce" />
                    <span>BAHAYA SECURITY BREACH: USER BLOKIR TETAP BISA MASUK!</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>SEMI-AMAN: Belum Teruji Kasus Pencabutan Sesi.</span>
                  </>
                )
              )}
            </div>
            <p className="text-[11px]">
              {selectedMethod === "getUser"
                ? sessionRevokedInDb
                  ? "Server Supabase menolak token karena sesi telah dibatalkan di database. Middleware otomatis menghapus cookies dan mengarahkan pengguna ke /login."
                  : "Status akun valid. Token diperbarui secara otomatis jika masa aktif mendekati habis."
                : sessionRevokedInDb
                ? "KARENA getSession() HANYA MEMBACA COOKIE TANPA KONFIRMASI KE DATABASE, pengguna yang sudah di-banned atau kata sandinya diubah tetap bebas mengakses seluruh rute privat hingga token expired! Ini adalah pelanggaran fatal standar keamanan industri."
                : "Meskipun sekilas berjalan normal, getSession() tidak pernah memvalidasi status integritas akun pengguna ke auth server."}
            </p>
          </div>
        </div>

        {/* Right: The Dual-Cookie Synchronizer Explanation */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <Cookie className="w-4 h-4 text-amber-500" />
              <span>Siklus Pembaharuan Cookie Ganda di Middleware:</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Di Next.js 16, jika Supabase Auth me-refresh token di dalam middleware, token baru harus ditulis ke <strong>DUA TEMPAT SEKALIGUS</strong>:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
                <div className="font-bold text-indigo-600 dark:text-indigo-400">
                  1. request.cookies.set(name, value)
                </div>
                <p className="text-[11px] text-zinc-500">
                  Agar Server Component (RSC) yang akan dirender sesaat lagi langsung menerima token baru tanpa sesi basi.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
                <div className="font-bold text-amber-600 dark:text-amber-400">
                  2. response.cookies.set(name, value)
                </div>
                <p className="text-[11px] text-zinc-500">
                  Agar peramban browser pengguna menyimpan token baru di header Set-Cookie untuk request berikutnya.
                </p>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-800 dark:text-indigo-300">
            💡 Inilah alasan mengapa fungsi pembantu <code className="font-bold font-mono">updateSession(request)</code> menerima objek request dan mengembalikan objek response yang telah disinkronkan.
          </div>
        </div>
      </div>
    </div>
  );
}
