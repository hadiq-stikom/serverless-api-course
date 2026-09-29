"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  KeyRound, 
  ShieldCheck, 
  ShieldAlert, 
  RefreshCw, 
  Lock, 
  Unlock, 
  Clock, 
  Copy, 
  Check, 
  AlertTriangle,
  Code,
  FileCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function JwtLifecycleAnimator() {
  const [activeTab, setActiveTab] = useState<"structure" | "tamper" | "rotation">("structure");
  const [isTampered, setIsTampered] = useState(false);
  const [tamperedRole, setTamperedRole] = useState("admin");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [tokenAge, setTokenAge] = useState(15); // minutes
  const [rotationStep, setRotationStep] = useState<1 | 2 | 3>(1);

  // Copy helper
  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 1500);
  };

  const headerJson = JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2);
  const originalPayload = {
    sub: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    email: "mahasiswa@kampus.ac.id",
    role: "student",
    iat: 1716982400,
    exp: 1716986000
  };

  const currentPayload = isTampered
    ? { ...originalPayload, role: tamperedRole }
    : originalPayload;

  const payloadJson = JSON.stringify(currentPayload, null, 2);
  const signatureText = isTampered
    ? "HMACSHA256(header.tamperedPayload, secret) ➔ ❌ MISMATCH WITH CLIENT TOKEN!"
    : "HMACSHA256(header.payload, supabase_jwt_secret) ➔ ✅ VALID SIGNATURE";

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-xs font-semibold">
              Pilar 1.1: Arsitektur Token
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">RFC 7519 Stateless JWT</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Siklus Hidup Stateless JWT: Header, Payload &amp; Rotasi Kriptografis
          </h4>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("structure")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "structure"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:white"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Anatomi 3 Bagian
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tamper")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "tamper"
                ? "bg-red-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:white"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Uji Manipulasi Data
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rotation")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "rotation"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:white"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Rotasi Token 1 Jam
          </button>
        </div>
      </div>

      {/* TAB 1: Anatomi JWT */}
      {activeTab === "structure" && (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            JWT (JSON Web Token) adalah string terenkripsi yang terdiri dari 3 blok Base64URL yang dipisahkan oleh karakter titik (<code className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-xs">.</code>). Serverless Function tidak membutuhkan pencarian database untuk mengetahui identitas user—semua klaim diverifikasi secara matematis via tanda tangan digital (*signature*).
          </p>

          {/* Visual 3-part Token String */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs overflow-x-auto select-all">
            <span className="text-rose-400 font-bold">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span>
            <span className="text-zinc-500 font-bold">.</span>
            <span className="text-purple-400 font-bold">
              {`eyJzdWIiOiI5YjFkZWI0ZC0zYjdkLT...",role":"student"}`}
            </span>
            <span className="text-zinc-500 font-bold">.</span>
            <span className="text-emerald-400 font-bold">TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ</span>
          </div>

          {/* 3 Columns Breakdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Header */}
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
                <span>1. Header (Algoritma)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10">Base64URL</span>
              </div>
              <pre className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-rose-300 overflow-x-auto">
                {headerJson}
              </pre>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
                Menyatakan tipe token (JWT) dan algoritma kriptografis hash (misal HS256 / SHA-256 HMAC).
              </p>
            </div>

            {/* Payload */}
            <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
                <span>2. Payload (Claims &amp; Data)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10">Base64URL</span>
              </div>
              <pre className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-purple-300 overflow-x-auto max-h-32">
                {payloadJson}
              </pre>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
                Memuat identitas unik (<code className="text-zinc-300">sub = auth.uid()</code>), email, role, dan timestamp kedaluwarsa (<code className="text-zinc-300">exp</code>).
              </p>
            </div>

            {/* Signature */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>3. Signature (Integritas)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10">HMAC-SHA256</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-emerald-300 break-all leading-relaxed">
                HMACSHA256(
                  base64Url(header) + "." + base64Url(payload),
                  JWT_SECRET
                )
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
                Dihitung menggunakan kunci rahasia server Supabase. Mencegah manipulasi isi payload di browser pengguna.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Uji Manipulasi (Tampering Test) */}
      {activeTab === "tamper" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <strong className="font-bold">Eksperimen Keamanan Kriptografis:</strong>
              <p className="mt-0.5 text-zinc-600 dark:text-zinc-300">
                Payload JWT tersimpan dalam format Base64 yang dapat didekode oleh siapa saja di browser (F12 Application tab). Apa yang terjadi jika pengguna iseng mengubah nilai <code className="font-mono font-bold bg-amber-500/20 px-1 py-0.5 rounded">role: student</code> menjadi <code className="font-mono font-bold bg-amber-500/20 px-1 py-0.5 rounded">role: admin</code> di localStorage/cookie mereka?
              </p>
            </div>
          </div>

          {/* Interactive Tamper Toggle */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                Status Modifikasi Payload:
              </div>
              <p className="text-[11px] text-zinc-500">
                {isTampered
                  ? "Payload telah diubah secara ilegal di peramban pengguna!"
                  : "Token asli yang diterbitkan resmi oleh Supabase Auth Engine."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant={isTampered ? "destructive" : "outline"}
                onClick={() => setIsTampered(!isTampered)}
                className="font-bold text-xs"
              >
                {isTampered ? "Kembalikan ke Token Asli" : "Simulasikan Manipulasi ke 'role: admin'"}
              </Button>
            </div>
          </div>

          {/* Validation Result Box */}
          <div className={`p-4 rounded-xl border transition-all duration-300 ${
            isTampered 
              ? "bg-red-500/10 border-red-500/40 text-red-900 dark:text-red-300"
              : "bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-300"
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {isTampered ? (
                <>
                  <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                  <span>HASIL VALIDASI SERVER: 401 UNAUTHORIZED (SIGNATURE MISMATCH)</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span>HASIL VALIDASI SERVER: 200 OK (TOKEN VERIFIED &amp; UNTAMPERED)</span>
                </>
              )}
            </div>
            <p className="text-xs mt-1.5 leading-relaxed text-zinc-700 dark:text-zinc-300">
              {isTampered ? (
                <span>
                  Meskipun hacker berhasil mengubah payload Base64 menjadi <code className="font-mono bg-red-500/20 px-1 py-0.5 rounded font-bold">role: &quot;admin&quot;</code>, server Next.js dan Supabase menghitung ulang signature menggunakan <strong>JWT_SECRET</strong> rahasia. Karena tanda tangan tidak cocok dengan string signature di token, seluruh request <strong>DITOLAK INSTAN</strong> sebelum mencapai database!
                </span>
              ) : (
                <span>
                  Signature yang dihitung server cocok 100% dengan signature bawaan token. Serverless function dapat membaca data user tanpa query database berulang.
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: Rotasi Token & Masa Aktif */}
      {activeTab === "rotation" && (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Untuk menjaga keamanan jika token dicuri, <strong>Access Token (JWT)</strong> hanya berumur pendek (default Supabase: <strong>3600 detik = 1 jam</strong>). Ketika token kedaluwarsa, klien menggunakan <strong>Refresh Token</strong> yang berumur panjang untuk meminta Access Token baru secara transparan tanpa memaksa user login ulang.
          </p>

          {/* Stepper Timeline */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <span>Siklus Rotasi Token di Next.js 16 Middleware:</span>
              <span className="font-mono text-indigo-500">Langkah {rotationStep} dari 3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setRotationStep(1)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  rotationStep === 1
                    ? "bg-indigo-500/10 border-indigo-500/50 ring-2 ring-indigo-500/20"
                    : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
                  <Clock className="w-4 h-4" />
                  <span>1. Token Aktif (0 - 59 mnt)</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Access Token sah. Middleware mengizinkan akses halaman privat langsung.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRotationStep(2)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  rotationStep === 2
                    ? "bg-amber-500/10 border-amber-500/50 ring-2 ring-amber-500/20"
                    : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>2. Kedaluwarsa (Menit 60+)</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Access token ditolak. Middleware membaca Refresh Token di cookie HTTP-Only.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRotationStep(3)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  rotationStep === 3
                    ? "bg-emerald-500/10 border-emerald-500/50 ring-2 ring-emerald-500/20"
                    : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                  <RefreshCw className="w-4 h-4" />
                  <span>3. Silent Token Refresh</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Supabase menerbitkan pasangan token baru; Cookie diperbarui di header respons.
                </p>
              </button>
            </div>

            {/* Step Detail Explanation */}
            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1.5">
              <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-500" />
                <span>
                  {rotationStep === 1 && "Fase Normal: Validasi Kriptografis Instan di Edge"}
                  {rotationStep === 2 && "Fase Expired: Deteksi Token Kedaluwarsa oleh getUser()"}
                  {rotationStep === 3 && "Fase Pembaruan: Set-Cookie Header ke Browser Tanpa Interupsi Pengguna"}
                </span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                {rotationStep === 1 && "Serverless function memverifikasi exp claim: now() < exp. Operasi berlangsung dalam ~1ms tanpa request HTTP tambahan."}
                {rotationStep === 2 && "supabase.auth.getUser() di Next.js Middleware mendeteksi masa berlaku habis, lalu mengirim Refresh Token terenkripsi ke Auth Gateway Supabase."}
                {rotationStep === 3 && "Middleware menuliskan cookies baru ke objek request dan response via setAll(). Pengguna tetap berada di halaman tanpa pernah merasakan reload atau logout paksa."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
