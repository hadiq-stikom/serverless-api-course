"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  KeyRound,
  Mail,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Database,
  Layers,
  Terminal,
  ExternalLink,
  Info,
  Check,
  Copy,
  User,
  School,
  Lock,
  FileSpreadsheet
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function NimAuthArchitectureSimulator() {
  const [activeTab, setActiveTab] = useState<"playground" | "domain_alias" | "custom_roster" | "security_policy">("playground");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // State Playground
  const [identifierInput, setIdentifierInput] = useState("202401001");
  const [passwordInput, setPasswordInput] = useState("202401001");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [simResult, setSimResult] = useState<{
    detectedType: "nim" | "email";
    routedEmail: string;
    authSuccess: boolean;
    studentName?: string;
  } | null>({
    detectedType: "nim",
    routedEmail: "202401001@student.ac.id",
    authSuccess: true,
    studentName: "Budi Santoso (NIM: 202401001)"
  });

  const isEmail = identifierInput.includes("@");

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunPlayground = () => {
    setIsSubmitting(true);
    setSimResult(null);

    setTimeout(() => {
      setIsSubmitting(false);
      const isEmailFormat = identifierInput.includes("@");
      if (isEmailFormat) {
        setSimResult({
          detectedType: "email",
          routedEmail: identifierInput.trim().toLowerCase(),
          authSuccess: true,
          studentName: "Pengguna Publik (Akun Email)"
        });
      } else {
        const cleanNim = identifierInput.trim();
        setSimResult({
          detectedType: "nim",
          routedEmail: `${cleanNim}@student.ac.id`,
          authSuccess: true,
          studentName: `Mahasiswa Kampus (${cleanNim})`
        });
      }
    }, 600);
  };

  const sampleServerActionCode = `// src/actions/auth.ts - Pola Dual-Identifier (Email atau NIM)
export async function loginWithCredentialAction(prevState: unknown, formData: FormData) {
  const identifier = (formData.get("identifier") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  // Validasi Dasar
  if (!identifier || !password) {
    return { success: false, error: "Identifier dan Kata Sandi wajib diisi." };
  }

  // DETEKSI OTOMATIS: Email Publik vs NIM Institusi
  let targetEmail = identifier.toLowerCase();
  let isInstitutionStudent = false;

  if (!identifier.includes("@")) {
    // Pengguna memasukkan NIM (hanya angka/huruf tanpa '@')
    // Petakan ke domain internal kampus secara transparan:
    targetEmail = \`\${identifier}@student.ac.id\`;
    isInstitutionStudent = true;
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  // Eksekusi Login Supabase Native
  const { data, error } = await supabase.auth.signInWithPassword({
    email: targetEmail,
    password: password,
  });

  if (error) {
    return { 
      success: false, 
      error: isInstitutionStudent 
        ? "NIM atau Kata Sandi tidak sesuai. (Default Kata Sandi = NIM)" 
        : error.message 
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}`;

  return (
    <div className="rounded-2xl border border-indigo-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm overflow-hidden text-zinc-900 dark:text-zinc-100">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50 via-indigo-50/30 to-purple-50/20 dark:from-zinc-900 dark:via-zinc-900 dark:to-indigo-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">
                Simulasi Panduan: Arsitektur Autentikasi NIM Institusi &amp; Dual-Identifier
              </span>
              <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-[10px] font-mono">
                Academic &amp; Enterprise Auth
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Pelajari bagaimana platform kampus (SIAKAD &amp; LMS) mengelola login berbasis NIM/NIDN di atas Supabase Auth tanpa repot membuat auth engine dari nol.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIdentifierInput("202401001");
            setPasswordInput("202401001");
            setSimResult({
              detectedType: "nim",
              routedEmail: "202401001@student.ac.id",
              authSuccess: true,
              studentName: "Budi Santoso (NIM: 202401001)"
            });
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
          onClick={() => setActiveTab("playground")}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer border-t border-x ${
            activeTab === "playground"
              ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-indigo-600 dark:text-indigo-400 -mb-px shadow-xs"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>1. Dual-Identifier Playground (Live Test)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("domain_alias")}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer border-t border-x ${
            activeTab === "domain_alias"
              ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 -mb-px shadow-xs"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <School className="w-4 h-4 text-emerald-500" />
          <span>2. Pola A: Virtual Campus Domain Alias</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("custom_roster")}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer border-t border-x ${
            activeTab === "custom_roster"
              ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-purple-600 dark:text-purple-400 -mb-px shadow-xs"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-purple-500" />
          <span>3. Pola B: Custom Roster Table (LMS Kita)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security_policy")}
          className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer border-t border-x ${
            activeTab === "security_policy"
              ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-amber-600 dark:text-amber-400 -mb-px shadow-xs"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <span>4. Kebijakan Keamanan Akun Institusi</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* ==================== TAB 1: PLAYGROUND ==================== */}
        {activeTab === "playground" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-3">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Konsep Inti: Dual-Identifier Smart Routing</span>
                <p className="leading-relaxed">
                  Pengguna tidak perlu pusing memilih tab login terpisah. Satu kolom input cerdas dapat menerima <strong>Email Pribadi</strong> (misal <code>budi@gmail.com</code>) ATAU <strong>NIM Mahasiswa</strong> (misal <code>202401001</code>). Server Action secara otomatis mengenali dan merutekannya ke backend Supabase!
                </p>
              </div>
            </div>

            {/* Live Interactive Form Mockup */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
              <div className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-mono">
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Formulir Masuk: Dual-Identifier Login Form</span>
                </div>
                <Badge className={isEmail ? "bg-emerald-600 text-white text-[10px]" : "bg-indigo-600 text-white text-[10px]"}>
                  {isEmail ? "Mode: Email Publik" : "Mode: NIM Institusi"}
                </Badge>
              </div>

              <div className="p-5 sm:p-6 space-y-4 max-w-lg mx-auto">
                {/* Input Identifier */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span>Email atau Nomor Induk Mahasiswa (NIM)</span>
                    </label>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {isEmail ? "Terditeksi '@' (Email)" : "Hanya Karakter (NIM)"}
                    </span>
                  </div>

                  <input
                    type="text"
                    value={identifierInput}
                    onChange={(e) => setIdentifierInput(e.target.value)}
                    placeholder="Contoh: 202401001 atau budi@gmail.com"
                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                {/* Input Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                    <span>Kata Sandi</span>
                    <span className="text-[11px] text-zinc-400 font-normal">
                      {!isEmail && "(Default Akun Mahasiswa Baru = NIM)"}
                    </span>
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-2 pt-1 text-[11px]">
                  <span className="text-zinc-500">Contoh Cepat:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifierInput("202401001");
                      setPasswordInput("202401001");
                    }}
                    className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 cursor-pointer"
                  >
                    NIM: 202401001
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifierInput("alex@gmail.com");
                      setPasswordInput("password123");
                    }}
                    className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 cursor-pointer"
                  >
                    Email: alex@gmail.com
                  </button>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    size="sm"
                    onClick={handleRunPlayground}
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-10 gap-2 cursor-pointer shadow-sm"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{isSubmitting ? "Memproses Autentikasi..." : "Uji Coba Masuk ke Sistem ➔"}</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Execution Inspector Result */}
            {simResult && (
              <div className="p-4 sm:p-5 rounded-xl border border-indigo-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-500" />
                    <span>Inspektur Server Action (Next.js 16 Backend)</span>
                  </span>
                  <Badge variant="outline" className="text-[10px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border-emerald-300">
                    Routing Selesai (200 OK)
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
                    <span className="text-zinc-500 block">1. Input Form Mentah:</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{identifierInput}</span>
                    <span className="text-zinc-400 block text-[10px]">
                      Tipe: {simResult.detectedType === "nim" ? "NIM Institusi (Tanpa @)" : "Alamat Email Standar"}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
                    <span className="text-zinc-500 block">2. Payload Target ke Supabase Auth:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{simResult.routedEmail}</span>
                    <span className="text-zinc-400 block text-[10px]">
                      Parameter: <code>signInWithPassword(&#123; email, password &#125;)</code>
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    <strong>Sesi Aktif:</strong> Login berhasil diverifikasi sebagai <strong>{simResult.studentName}</strong>. JWT diterbitkan dan profil dimuat!
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 2: POLA A: VIRTUAL DOMAIN ALIAS ==================== */}
        {activeTab === "domain_alias" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
              <School className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Pola A: Virtual Campus Domain Alias (Native Supabase Auth)</span>
                <p className="leading-relaxed">
                  Ini adalah pola arsitektur paling elegan dan direkomendasikan saat membangun sistem di atas Supabase. Mahasiswa memasukkan NIM di browser, dan Server Action secara transparan memetakannya ke email institusi <code>&#123;nim&#125;@student.ac.id</code> sebelum memanggil SDK Supabase.
                </p>
              </div>
            </div>

            {/* Stepper Diagram Alur */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">1</span>
                  <span className="font-bold text-xs">Mahasiswa di Kampus</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Mengetik NIM <code>202401001</code> dan kata sandi di formulir aplikasi.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">2</span>
                  <span className="font-bold text-xs">Next.js Server Action</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Mendeteksi tidak ada &apos;@&apos;, otomatis mengubahnya menjadi <code>202401001@student.ac.id</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">3</span>
                  <span className="font-bold text-xs">Supabase Auth</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Memverifikasi hash password di <code>auth.users</code> dan menerbitkan Stateless JWT.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">4</span>
                  <span className="font-bold text-xs">Row Level Security</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Trigger memuat profil dan RLS mengunci akses data hanya untuk mahasiswa terkait.
                </p>
              </div>
            </div>

            {/* Code Snippet Server Action */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden font-mono text-xs shadow-md">
              <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-zinc-400">Implementasi Server Action:</span>
                  <span className="text-emerald-400 font-bold">src/actions/auth.ts</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(sampleServerActionCode, "sa_code")}
                  className="text-xs h-7 gap-1 text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
                >
                  {copiedKey === "sa_code" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Salin Kode Action</span>
                </Button>
              </div>

              <div className="p-4 bg-[#141414] overflow-x-auto max-h-[280px] leading-relaxed text-zinc-300 scrollbar-thin">
                <pre>{sampleServerActionCode}</pre>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: POLA B: CUSTOM ROSTER TABLE ==================== */}
        {activeTab === "custom_roster" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-3">
              <FileSpreadsheet className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Pola B: Custom Roster Table (Arsitektur LMS Platform Ini)</span>
                <p className="leading-relaxed">
                  Pada sistem akademik nyata di mana dosen mengimpor roster mahasiswa massal dari spreadsheet SIAKAD/Excel (NIM, Nama, Kelas), pendaftaran mandiri (*self-signup*) seringkali ditiadakan. Mahasiswa tidak terdaftar di <code>auth.users</code>, melainkan di tabel tersendiri <code>public.students</code>.
                </p>
              </div>
            </div>

            {/* Perbandingan Langsung Pola A vs Pola B */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 sm:p-5 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <School className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-xs text-emerald-950 dark:text-emerald-100">
                    Pola A: Virtual Domain Alias
                  </span>
                </div>
                <ul className="text-xs text-zinc-600 dark:text-zinc-300 space-y-2 list-disc list-inside">
                  <li><strong>Tabel Akun:</strong> <code>auth.users</code> bawaan Supabase.</li>
                  <li><strong>Manajemen Token:</strong> JWT resmi dari Supabase GoTrue.</li>
                  <li><strong>Integrasi RLS:</strong> Sangat mudah via fungsi <code>auth.uid()</code>.</li>
                  <li><strong>Skenario Terbaik:</strong> Aplikasi SaaS modern yang mengizinkan mahasiswa mendaftar mandiri atau login multi-model (bisa login via GitHub, Email, dan NIM sekaligus).</li>
                </ul>
              </div>

              <div className="p-4 sm:p-5 rounded-xl border border-purple-300 dark:border-purple-800/80 bg-purple-50/50 dark:bg-purple-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                  <span className="font-bold text-xs text-purple-950 dark:text-purple-100">
                    Pola B: Custom Roster Table
                  </span>
                </div>
                <ul className="text-xs text-zinc-600 dark:text-zinc-300 space-y-2 list-disc list-inside">
                  <li><strong>Tabel Akun:</strong> Tabel PostgreSQL kustom (<code>students</code>).</li>
                  <li><strong>Manajemen Token:</strong> Custom encrypted HTTP-Only Cookie session (Next.js 16).</li>
                  <li><strong>Integrasi RLS:</strong> Menggunakan RLS berbasis header kustom atau query service role di server.</li>
                  <li><strong>Skenario Terbaik:</strong> Sistem Ujian / LMS tertutup yang mensyaratkan akun dibuat terpusat oleh Dosen/BAAK dari Excel/CSV.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: KEBIJAKAN KEAMANAN INSTITUSI ==================== */}
        {activeTab === "security_policy" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Malapetaka Keamanan Umum: Default Password = NIM</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Di banyak kampus, kata sandi awal mahasiswa disetel identik dengan NIM mereka demi kemudahan distribusi akun pertama kali. Jika mahasiswa tidak dipaksa mengganti kata sandi, siapa pun yang mengetahui NIM temannya dapat masuk dan mengakses tugas atau ujian orang lain!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-500" />
                  <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">1. Force Password Change</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Tambahkan kolom boolean <code>must_change_password</code> di tabel profil. Saat login pertama kali, arahkan pengguna ke modal ganti kata sandi sebelum membuka dashboard.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">2. RLS Berbasis Kelas</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Manfaatkan metadata sesi untuk membatasi kueri tugas hanya untuk mahasiswa di <code>class_group</code> yang sama (misal Kelas A tidak bisa melihat tugas Kelas B).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">3. Anti-Enumeration</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Pesan kegagalan login wajib generik (*&quot;NIM atau Kata Sandi tidak sesuai&quot;*), jangan pernah memberi tahu hacker apakah NIM terdaftar atau tidak.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Helper Bar */}
      <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
        <span className="text-zinc-500 dark:text-zinc-400 text-[11px] flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
          <span>Pola ini menjembatani identitas akademik (NIM) dengan ekosistem Serverless modern.</span>
        </span>
        <a
          href="https://supabase.com/docs/guides/auth"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 self-start sm:self-auto text-[11px]"
        >
          <span>Dokumentasi Resmi Arsitektur Supabase Auth</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
