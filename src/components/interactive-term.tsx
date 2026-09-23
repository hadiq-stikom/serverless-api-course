"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Database, 
  Server, 
  Cpu, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Coins, 
  Play, 
  RefreshCw,
  FolderLock,
  Globe,
  Radio,
  X,
  Code,
  Laptop,
  Lock,
  Unlock,
  Layout,
  Check,
  FileCode,
  Compass,
  Workflow
} from "lucide-react";

export type TermKey = "faas" | "baas" | "rls" | "server-actions" | "cloudinary" | "rsc" | "client-component" | "shadcn" | "app-router";

interface TermData {
  title: string;
  fullName: string;
  badgeColor: string;
  icon: any;
  summary: string;
  analogy: string;
  keyPoints: string[];
  courseRole: string;
  type: "faas" | "baas" | "general";
}

const TERMS_DATA: Record<TermKey, TermData> = {
  faas: {
    title: "FaaS",
    fullName: "Function as a Service",
    badgeColor: "from-amber-500 to-orange-500",
    icon: Zap,
    type: "faas",
    summary: "Model komputasi awan serverless di mana developer hanya menulis potongan fungsi logika backend. Server tidak aktif terus-menerus, melainkan menyala (spin up) dalam milidetik hanya saat ada request, mengeksekusi kode, lalu mati kembali (scale-to-zero).",
    analogy: "💡 Analogi: Seperti lampu sensor gerak. Lampu hanya menyala saat ada orang lewat, lalu mati otomatis. Anda hanya membayar listrik saat lampu menyala.",
    keyPoints: [
      "⚡ On-Demand Execution: Kode jalan hanya saat dipicu event (HTTP Request / Webhook)",
      "🛑 Scale-to-Zero: Biaya komputasi Rp 0 saat aplikasi sedang tidak ada pengunjung",
      "🚀 Auto Scaling: Otomatis menduplikasi 1.000+ instance jika ada lonjakan trafik instan"
    ],
    courseRole: "Di kuliah ini: Vercel Serverless Functions & Next.js Server Actions ('use server')."
  },
  baas: {
    title: "BaaS",
    fullName: "Backend as a Service",
    badgeColor: "from-emerald-500 to-teal-500",
    icon: Database,
    type: "baas",
    summary: "Layanan penyedia seluruh infrastruktur backend siap pakai berbasis API & SDK. Developer tidak perlu merakit Linux server, database engine, atau sistem autentikasi dari nol—semua sudah disediakan dan terkelola secara otomatis di cloud.",
    analogy: "💡 Analogi: Seperti memesan dapur katering lengkap dengan koki, oven, dan kulkas. Anda tidak perlu membangun dapur sendiri, cukup pesan hidangan melalui menu (API).",
    keyPoints: [
      "🗄️ Managed PostgreSQL: Database relasional instan dengan SQL Editor & REST/GraphQL API",
      "🔐 Integrated Auth: Sistem register/login (JWT & OAuth GitHub) siap pakai",
      "📁 Realtime & Storage: Sinkronisasi data WebSocket dan upload media tanpa ribet"
    ],
    courseRole: "Di kuliah ini: Supabase (PostgreSQL Database, Auth OAuth, Realtime Subscription)."
  },
  rls: {
    title: "RLS",
    fullName: "Row Level Security",
    badgeColor: "from-rose-500 to-red-500",
    icon: ShieldCheck,
    type: "general",
    summary: "Kebijakan keamanan di tingkat mesin database PostgreSQL yang membatasi baris data apa saja yang boleh dibaca atau diubah oleh pengguna tertentu berdasarkan ID login mereka.",
    analogy: "💡 Analogi: Seperti brankas hotel. Setiap tamu hanya memiliki kunci untuk membuka kotak deposit kamarnya sendiri, bukan kamar tamu lain.",
    keyPoints: [
      "🛡️ Keamanan Level Database: Menolak query ilegal meskipun API client diretas",
      "🔑 auth.uid(): Mengisolasi data privat secara otomatis berdasarkan token JWT"
    ],
    courseRole: "Di kuliah ini: Supabase PostgreSQL Policies (auth.uid() = user_id)."
  },
  "server-actions": {
    title: "Server Actions",
    fullName: "Next.js Server Actions ('use server')",
    badgeColor: "from-blue-500 to-indigo-500",
    icon: Cpu,
    type: "general",
    summary: "Fitur Next.js yang memungkinkan eksekusi fungsi backend asinkron langsung dari form atau tombol komponen frontend tanpa harus membuat file API route (/api/*) manual.",
    analogy: "💡 Analogi: Seperti menekan tombol bel intercom yang langsung memanggil petugas di ruang mesin tanpa perlu menulis surat permohonan.",
    keyPoints: [
      "🔒 Eksekusi Aman di Server: Kredensial rahasia tidak pernah bocor ke browser klien",
      "⚡ Integrasi Form Instan: Menggunakan action={serverAction} pada form HTML"
    ],
    courseRole: "Di kuliah ini: Mutasi data Supabase dan validasi Zod di Next.js 16."
  },
  cloudinary: {
    title: "Cloudinary",
    fullName: "Media Experience Cloud (CDN & Assets)",
    badgeColor: "from-sky-500 to-blue-600",
    icon: Globe,
    type: "general",
    summary: "Platform CDN dan media management khusus untuk menyimpan, mengompresi otomatis ke format WebP/AVIF, dan mentransformasi gambar/video via URL parameter.",
    analogy: "💡 Analogi: Seperti studio foto profesional yang otomatis mengecilkan ukuran foto dan mengubah resolusinya sebelum dikirim ke pelanggan.",
    keyPoints: [
      "🖼️ Auto Format & Quality: f_auto,q_auto untuk penghematan bandwidth hingga 80%",
      "⚡ Global CDN: Pengiriman gambar super cepat dari server terdekat dengan pengguna"
    ],
    courseRole: "Di kuliah ini: Direct Upload Widget & Optimasi Gambar Proyek Akhir."
  },
  rsc: {
    title: "Server Component (RSC)",
    fullName: "React Server Component",
    badgeColor: "from-blue-600 to-indigo-600",
    icon: Server,
    type: "general",
    summary: "Komponen React default di Next.js App Router yang dieksekusi 100% di server. Mengalirkan HTML murni ke browser dengan 0 kB bundle JavaScript, aman mengakses database & environment variables rahasia.",
    analogy: "💡 Analogi: Seperti memesan makanan siap saji yang sudah matang dari dapur restoran. Anda langsung memakannya tanpa perlu membawa kompor dan wajan (JavaScript) ke meja makan.",
    keyPoints: [
      "🚀 Zero Bundle Size: Tidak ada JavaScript komponen ini yang dikirim ke browser klien",
      "🔒 Keamanan Maksimal: Akses langsung ke database tanpa risiko bocornya API keys",
      "⚡ Performa Cepat: Mengurangi beban CPU dan memori pada HP/laptop pengguna"
    ],
    courseRole: "Di kuliah ini: Halaman layout, page data fetching, dan container utama di Next.js 16."
  },
  "client-component": {
    title: "Client Component",
    fullName: "Client Component ('use client')",
    badgeColor: "from-purple-500 to-pink-500",
    icon: Cpu,
    type: "general",
    summary: "Komponen yang dideklarasikan dengan direktif 'use client' di baris pertama. Mengirim bundle JavaScript ke browser untuk proses hydration agar mendukung event interaktif (onClick, onChange) dan state React (useState, useEffect).",
    analogy: "💡 Analogi: Seperti menerima mainan bongkar-pasang (Lego) beserta baterai. Anda membutuhkan waktu perakitan di rumah (browser hydration) agar mainan bisa bergerak dan merespons tombol.",
    keyPoints: [
      "✨ Interaktivitas Penuh: Mendukung onClick, onChange, drag-and-drop, dan animasi",
      "🔄 State & Hooks: Memungkinkan penggunaan useState, useEffect, useReducer, custom hooks",
      "🌐 Browser APIs: Dapat mengakses localStorage, window, navigator, dan geolocation"
    ],
    courseRole: "Di kuliah ini: Form interaktif, modal dialog, toggle theme, dan komponen dinamis."
  },
  shadcn: {
    title: "Shadcn UI",
    fullName: "Open-Source Accessible Component Architecture",
    badgeColor: "from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-500",
    icon: Layers,
    type: "general",
    summary: "Pendekatan arsitektur komponen modern di mana kode sumber komponen (berbasis Radix UI & Tailwind CSS) disalin langsung ke folder proyek Anda via CLI, memberikan 100% kepemilikan kode tanpa keterikatan library NPM tertutup.",
    analogy: "💡 Analogi: Seperti resep masakan koki bintang lima yang diberikan langsung ke Anda. Anda bebas mengubah bumbu dan menyajikannya sesuai selera tanpa harus bergantung pada pesanan luar.",
    keyPoints: [
      "🔓 100% Code Ownership: Komponen ada di folder Anda, bebas diedit dan dikustomisasi",
      "♿ World-Class Accessibility: Dibangun di atas Radix UI Primitives (WAI-ARIA compliant)",
      "🎨 Tailwind & CSS Variables: Kompatibel sempurna dengan tema Dark/Light mode instan"
    ],
    courseRole: "Di kuliah ini: Desain antarmuka proyek akhir (Button, Card, Dialog, Input, Form)."
  },
  "app-router": {
    title: "App Router",
    fullName: "Next.js File-System Based Routing Engine",
    badgeColor: "from-cyan-500 to-blue-500",
    icon: Globe,
    type: "general",
    summary: "Sistem routing modern Next.js berbasis struktur folder di /src/app yang mendukung Server Components, layout bersarang (nested layouts), dynamic segments [id], streaming Suspense, dan konvensi file terstruktur.",
    analogy: "💡 Analogi: Seperti denah bangunan berlantai. Setiap lantai memiliki lorong umum (layout) dan ruangan-ruangan khusus (page) dengan pintu masuk terstruktur.",
    keyPoints: [
      "📁 Folder-Based Hierarchy: Struktur folder otomatis memetakan path URL browser",
      "🧩 Nested Layouts: Header dan Sidebar bertahan tanpa re-render saat pindah halaman",
      "⚡ Streaming & Fallback: Dukungan otomatis loading.tsx dan error.tsx per rute"
    ],
    courseRole: "Di kuliah ini: Pondasi arsitektur routing dan navigasi seluruh halaman aplikasi."
  }
};

interface InteractiveTermProps {
  term: TermKey;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export function InteractiveTerm({ term, children, showIcon = true }: InteractiveTermProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const data = TERMS_DATA[term];
  if (!data) return <>{children}</>;

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 250);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const Icon = data.icon;
  const showContent = isHovered || isOpen;

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1 px-2 py-0.5 my-0.5 mx-0.5 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer border shadow-xs ${
          term === "faas"
            ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:border-amber-500/60"
            : term === "baas"
            ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:border-emerald-500/60"
            : "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 hover:border-indigo-500/60"
        }`}
      >
        {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
        <span className="underline decoration-dotted underline-offset-2">
          {children || data.title}
        </span>
        <span className="text-[10px] opacity-70 ml-0.5">ℹ️</span>
      </button>

      {/* Floating Rich Popover / Hover Card */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-2 z-50 w-[340px] sm:w-[440px] md:w-[480px] max-h-[85vh] overflow-y-auto p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-indigo-500/30 dark:border-indigo-500/40 shadow-2xl text-left"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${data.badgeColor} text-white shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-zinc-900 dark:text-white">
                      {data.title}
                    </h4>
                    <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                      Pilar Serverless
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    {data.fullName}
                  </p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); setIsHovered(false); }}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Definition */}
            <div className="py-3 space-y-2">
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                {data.summary}
              </p>
              
              <div className="p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200 font-medium">
                {data.analogy}
              </div>
            </div>

            {/* Visual Lifecycle Animation / Diagram */}
            <div className="my-2 p-3 rounded-xl bg-zinc-950 text-zinc-100 border border-zinc-800 space-y-2 overflow-hidden">
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <Play className="w-3 h-3 fill-indigo-400" />
                  Alur Kerja & Visualisasi {data.title}
                </span>
                <span className="text-[10px] text-zinc-500">Live Simulation</span>
              </div>

              {/* FaaS Animated Pipeline */}
              {data.type === "faas" && (
                <div className="py-2">
                  <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] sm:text-xs">
                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center">
                      <Globe className="w-4 h-4 text-sky-400 mb-1 animate-pulse" />
                      <span className="font-semibold text-zinc-200">1. HTTP Event</span>
                      <span className="text-[9px] text-zinc-500">Request masuk</span>
                    </div>

                    <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/40 flex flex-col items-center justify-center relative">
                      <Zap className="w-4 h-4 text-amber-400 mb-1 animate-bounce" />
                      <span className="font-semibold text-amber-300">2. Spin Up</span>
                      <span className="text-[9px] text-amber-400/80">&lt; 50ms Boot</span>
                    </div>

                    <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/40 flex flex-col items-center justify-center">
                      <Cpu className="w-4 h-4 text-indigo-400 mb-1" />
                      <span className="font-semibold text-indigo-300">3. Run Logic</span>
                      <span className="text-[9px] text-zinc-400">Fungsi jalan</span>
                    </div>

                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center">
                      <Coins className="w-4 h-4 text-emerald-400 mb-1" />
                      <span className="font-semibold text-emerald-300">4. Scale to 0</span>
                      <span className="text-[9px] text-zinc-500">Mati (Rp 0/idle)</span>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex items-center justify-between px-6 pt-2 text-[10px] text-amber-400/90 font-mono font-medium">
                    <span>Client Click</span>
                    <span>➔</span>
                    <span>Instance Siap</span>
                    <span>➔</span>
                    <span>Return JSON</span>
                    <span>➔</span>
                    <span>Server Tidur</span>
                  </div>
                </div>
              )}

              {/* BaaS Animated Architecture */}
              {data.type === "baas" && (
                <div className="py-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center text-[10px] sm:text-xs">
                    <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex flex-col items-center justify-center">
                      <Database className="w-4 h-4 text-emerald-400 mb-1" />
                      <span className="font-semibold text-emerald-300">Postgres DB</span>
                      <span className="text-[9px] text-zinc-400">Auto REST API</span>
                    </div>

                    <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/40 flex flex-col items-center justify-center">
                      <FolderLock className="w-4 h-4 text-cyan-400 mb-1" />
                      <span className="font-semibold text-cyan-300">Auth & OAuth</span>
                      <span className="text-[9px] text-zinc-400">GitHub / JWT</span>
                    </div>

                    <div className="p-2 rounded-lg bg-teal-950/40 border border-teal-500/40 flex flex-col items-center justify-center">
                      <Radio className="w-4 h-4 text-teal-400 mb-1 animate-pulse" />
                      <span className="font-semibold text-teal-300">Realtime</span>
                      <span className="text-[9px] text-zinc-400">WebSocket sync</span>
                    </div>

                    <div className="p-2 rounded-lg bg-blue-950/40 border border-blue-500/40 flex flex-col items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-blue-400 mb-1" />
                      <span className="font-semibold text-blue-300">RLS Policies</span>
                      <span className="text-[9px] text-zinc-400">Data Isolation</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-emerald-300/90 text-center pt-2 font-mono">
                    Next.js panggil Supabase SDK ➔ Semua layanan backend siap tanpa kelola Linux OS!
                  </p>
                </div>
              )}
            </div>

            {/* Key bullet points */}
            <div className="space-y-1.5 pt-1 text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-300">
              {data.keyPoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            {/* Role in our tech stack */}
            <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{data.courseRole}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

/**
 * Visual Comparison Card between FaaS and BaaS for rich display in Architecture overview
 */
export function FaasVsBaasVisualizer() {
  const [selectedPillar, setSelectedPillar] = useState<"faas" | "baas">("faas");

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            Eksplorasi Interaktif: Dua Pilar Serverless (FaaS vs BaaS)
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Klik atau hover pilar di bawah untuk membedah arsitektur dan simulasinya
          </p>
        </div>

        {/* Toggle Pills */}
        <div className="flex items-center gap-1 bg-zinc-200/80 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setSelectedPillar("faas")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedPillar === "faas"
                ? "bg-amber-500 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            FaaS (Compute)
          </button>
          <button
            type="button"
            onClick={() => setSelectedPillar("baas")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedPillar === "baas"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            BaaS (Storage & Auth)
          </button>
        </div>
      </div>

      {/* Dynamic Content based on selected pillar */}
      <AnimatePresence mode="wait">
        {selectedPillar === "faas" ? (
          <motion.div
            key="faas-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
          >
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/30">
                  Function as a Service
                </span>
                <span className="text-xs font-medium text-zinc-500">Contoh: Vercel Functions</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <strong className="text-zinc-900 dark:text-white">FaaS</strong> adalah logika backend yang berjalan on-demand. Daripada menyewa Virtual Machine yang menyala 24/7 dan memakan biaya saat sepi pengunjung, FaaS hanya "bangun" saat ada event/request, memproses data, lalu mati seketika.
              </p>
              <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                <p>⚡ <strong>Kelebihan:</strong> Zero Maintenance, Instant Auto-scale, Bayar per millisecond eksekusi.</p>
                <p>🛠️ <strong>Peran di Next.js:</strong> Server Actions (`'use server'`) & API Routes.</p>
              </div>
            </div>

            <div className="md:col-span-6 bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-white space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-1 border-b border-zinc-800">
                <span>SIMULASI SIKLUS HIDUP FAAS</span>
                <span className="text-amber-400 font-bold">Vercel Edge/Node Engine</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-sky-400" />
                    <span>User klik submit form</span>
                  </div>
                  <span className="text-[10px] text-sky-400 font-sans">HTTP Request</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-amber-950/40 border border-amber-500/40">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Container Spin-up & Eksekusi</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-sans">~35ms Execution</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <span>Scale-to-Zero (Server Mati)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-sans">Biaya $0 saat diam</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="baas-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
          >
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  Backend as a Service
                </span>
                <span className="text-xs font-medium text-zinc-500">Contoh: Supabase</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <strong className="text-zinc-900 dark:text-white">BaaS</strong> menyediakan seluruh infrastruktur siap pakai. Alih-alih membangun sistem auth login, setup PostgreSQL di Ubuntu server, dan konfigurasi WebSocket manual, BaaS memberikan semuanya via SDK.
              </p>
              <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                <p>🗄️ <strong>Layanan Siap Pakai:</strong> Database Postgres, Auth OAuth GitHub, File Storage, & Realtime.</p>
                <p>🛡️ <strong>Keamanan:</strong> Dilindungi Row Level Security (RLS) di level database.</p>
              </div>
            </div>

            <div className="md:col-span-6 bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-white space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-1 border-b border-zinc-800">
                <span>ARSITEKTUR BAAS TERPADU</span>
                <span className="text-emerald-400 font-bold">Supabase Cloud Platform</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Database className="w-3.5 h-3.5" />
                    <span>PostgreSQL</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-sans">Tabel, Relasi 1:N, SQL Functions</p>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <FolderLock className="w-3.5 h-3.5" />
                    <span>Auth System</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-sans">GitHub OAuth, JWT, & Sessions</p>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-teal-400 font-bold">
                    <Radio className="w-3.5 h-3.5" />
                    <span>Realtime Sync</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-sans">WebSocket Postgres Changes</p>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Row Level Security</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-sans">Policy auth.uid() = user_id</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ServerVsClientVisualizer() {
  const [activeTab, setActiveTab] = useState<"server" | "client" | "composition">("server");

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 md:p-6 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-500" />
            Simulasi Arsitektur Komputasi Next.js 16
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Eksplorasi perbedaan eksekusi Server Component (RSC), Client Component (&apos;use client&apos;), dan Pola Komposisi Interleaving.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl">
          <button
            onClick={() => setActiveTab("server")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "server"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Server (RSC)
          </button>
          <button
            onClick={() => setActiveTab("client")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "client"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Client (&apos;use client&apos;)
          </button>
          <button
            onClick={() => setActiveTab("composition")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "composition"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Komposisi Interleaving
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "server" && (
          <motion.div
            key="server-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
          >
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-500/30">
                  React Server Component (RSC) — Standar Default
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Di Next.js 16 App Router, secara default <strong className="text-zinc-900 dark:text-white">seluruh komponen adalah Server Component</strong>. Komponen dieksekusi 100% di server, menghasilkan payload HTML murni yang dialirkan ke browser tanpa mengorbankan ukuran JavaScript bundle.
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
                  <span className="text-[11px] text-zinc-500 block">Bundle JS ke Klien</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">0 kB (Zero JS)</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
                  <span className="text-[11px] text-zinc-500 block">Akses Database / Secrets</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">100% Langsung & Aman</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
                  <span className="text-[11px] text-zinc-500 block">First Contentful Paint</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">⚡ Instan (Streaming)</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
                  <span className="text-[11px] text-zinc-500 block">React Hooks / onClick</span>
                  <span className="text-sm font-bold text-zinc-400">❌ Tidak Didukung</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-zinc-950 p-4 sm:p-5 rounded-2xl border border-zinc-800 text-white space-y-3 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-2 border-b border-zinc-800">
                <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                  <Server className="w-3.5 h-3.5" /> ALUR EKSEKUSI SERVER COMPONENT
                </span>
                <span className="text-emerald-400 text-[10px]">0 KB Bundle</span>
              </div>

              <div className="space-y-2 font-sans text-xs">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="flex items-center justify-between font-bold text-blue-400">
                    <span className="flex items-center gap-1.5"><Server className="w-4 h-4" /> 1. Server-Side Execution</span>
                    <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded">Node / Edge</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">Query Supabase Postgres langsung via SQL/SDK dengan kunci rahasia aman.</p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="flex items-center justify-between font-bold text-cyan-400">
                    <span className="flex items-center gap-1.5"><Radio className="w-4 h-4" /> 2. Streaming RSC Payload</span>
                    <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded">HTTP Stream</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">Mengalirkan data JSON representasi UI + HTML siap saji ke browser.</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-1">
                  <div className="flex items-center justify-between font-bold text-emerald-400">
                    <span className="flex items-center gap-1.5"><Laptop className="w-4 h-4" /> 3. Browser Paint</span>
                    <span className="text-[10px] bg-emerald-900 text-emerald-300 px-1.5 py-0.5 rounded">Zero JS Hydration</span>
                  </div>
                  <p className="text-[11px] text-zinc-300">Browser langsung menampilkan HTML tanpa parsing JS yang berat. RAM hemat.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "client" && (
          <motion.div
            key="client-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
          >
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold border border-purple-500/30">
                  Client Component (&apos;use client&apos;) — Khusus Interaktivitas
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Diaktifkan dengan menambahkan <code className="text-purple-600 dark:text-purple-400 font-mono bg-purple-500/10 px-1 rounded">&apos;use client&apos;</code> di baris pertama. File ini mengirimkan JavaScript bundle ke browser agar React dapat melakukan <strong className="text-zinc-900 dark:text-white">Hydration</strong> (menghubungkan event listener, state, dan lifecycle).
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
                  <span className="text-[11px] text-zinc-500 block">Bundle JS ke Klien</span>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">+35 s/d 60 kB</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
                  <span className="text-[11px] text-zinc-500 block">Akses Database Secrets</span>
                  <span className="text-sm font-bold text-rose-500">❌ Terlarang (Bocor)</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
                  <span className="text-[11px] text-zinc-500 block">React State (useState)</span>
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">✅ Penuh & Responsif</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
                  <span className="text-[11px] text-zinc-500 block">DOM Event Listeners</span>
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">✅ onClick, onChange, dll.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-zinc-950 p-4 sm:p-5 rounded-2xl border border-zinc-800 text-white space-y-3 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-2 border-b border-zinc-800">
                <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                  <Cpu className="w-3.5 h-3.5" /> ALUR SIKLUS HYDRATION CLIENT
                </span>
                <span className="text-amber-400 text-[10px]">Bundle JS Download</span>
              </div>

              <div className="space-y-2 font-sans text-xs">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="flex items-center justify-between font-bold text-blue-400">
                    <span className="flex items-center gap-1.5"><Server className="w-4 h-4" /> 1. Server Pre-render</span>
                    <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded">Initial HTML Shell</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">Next.js merender kerangka HTML awal di server agar SEO dan preview cepat.</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-1">
                  <div className="flex items-center justify-between font-bold text-amber-400">
                    <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> 2. Unduh Bundle JS</span>
                    <span className="text-[10px] bg-amber-900 text-amber-300 px-1.5 py-0.5 rounded">Network Transfer</span>
                  </div>
                  <p className="text-[11px] text-zinc-300">Browser mendownload file komponen .js dan pustaka dependensinya.</p>
                </div>

                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-1">
                  <div className="flex items-center justify-between font-bold text-purple-400">
                    <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> 3. React Hydration</span>
                    <span className="text-[10px] bg-purple-900 text-purple-300 px-1.5 py-0.5 rounded">Ready Interactive</span>
                  </div>
                  <p className="text-[11px] text-zinc-300">React memasang event listener ke DOM. Tombol kini aktif dan siap diklik.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "composition" && (
          <motion.div
            key="composition-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
          >
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  Pola Komposisi Emas (Interleaving Children Pattern)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Bagaimana jika kita butuh container interaktif (misal: Sidebar bisa di-toggle atau Modal Dialog) yang di dalamnya memuat data berat dari database?
              </p>
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-1.5">
                <p className="font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Aturan Larangan Keras:
                </p>
                <p className="opacity-90">
                  Jangan pernah mengimpor Server Component secara langsung di dalam Client Component (<code className="font-mono">import ServerData from &apos;./ServerData&apos;</code>), karena itu akan memaksa ServerData ikut di-bundle ke client!
                </p>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                ✅ <strong>Solusi Elegan:</strong> Lewatkan Server Component sebagai prop <code className="font-mono text-emerald-600 dark:text-emerald-400">children</code> ke Client Component.
              </p>
            </div>

            <div className="lg:col-span-6 bg-zinc-950 p-4 sm:p-5 rounded-2xl border border-zinc-800 text-white space-y-3 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-2 border-b border-zinc-800">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Workflow className="w-3.5 h-3.5" /> BLUEPRINT KODE KOMPOSISI
                </span>
                <span className="text-zinc-400 text-[10px]">src/app/page.tsx</span>
              </div>

              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 space-y-2 text-[11px] text-zinc-300 overflow-x-auto leading-relaxed">
                <div className="text-zinc-500">// 1. page.tsx adalah SERVER COMPONENT</div>
                <div><span className="text-purple-400">import</span> InteractiveModal <span className="text-purple-400">from</span> <span className="text-emerald-300">&apos;@/components/modal&apos;</span>; <span className="text-zinc-500">// &apos;use client&apos;</span></div>
                <div><span className="text-purple-400">import</span> HeavyDatabaseList <span className="text-purple-400">from</span> <span className="text-emerald-300">&apos;@/components/db-list&apos;</span>; <span className="text-zinc-500">// Server</span></div>
                <div className="pt-1"><span className="text-blue-400">export default async function</span> <span className="text-amber-300">Page</span>() &#123;</div>
                <div className="pl-3"><span className="text-purple-400">return</span> (</div>
                <div className="pl-6 text-emerald-400">&lt;<span className="text-indigo-400">InteractiveModal</span>&gt;</div>
                <div className="pl-9 text-blue-400">&lt;<span className="text-amber-300">HeavyDatabaseList</span> /&gt; <span className="text-zinc-500">// ✅ Tetap 0 KB JS di Server!</span></div>
                <div className="pl-6 text-emerald-400">&lt;/<span className="text-indigo-400">InteractiveModal</span>&gt;</div>
                <div className="pl-3">);</div>
                <div>&#125;</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
