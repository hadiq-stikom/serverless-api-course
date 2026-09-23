"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderTree, 
  FileCode, 
  RotateCcw, 
  AlertOctagon, 
  SearchX, 
  CheckCircle2, 
  Layout, 
  Clock, 
  Sparkles, 
  RefreshCw 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type SimulationScenario = "normal" | "loading" | "error" | "notfound";

export function SpecialFilesHierarchyAnimator() {
  const [scenario, setScenario] = useState<SimulationScenario>("normal");
  const [selectedFile, setSelectedFile] = useState<string>("page.tsx");

  const files = [
    { name: "layout.tsx", role: "Shell Pembungkus Bersama", type: "Server Component", desc: "Membungkus children, mempertahankan state form/sidebar, tidak me-re-render saat navigasi." },
    { name: "loading.tsx", role: "Suspense Skeleton Instan", type: "Server Component", desc: "Ditampilkan otomatis saat page.tsx sedang menunggu query database asinkron." },
    { name: "error.tsx", role: "Runtime Error Boundary", type: "'use client' Wajib", desc: "Menangkap crash runtime pada segmen rute dan menyediakan fungsi reset() tanpa merusak seluruh web." },
    { name: "not-found.tsx", role: "HTTP 404 Fallback", type: "Server Component", desc: "Aktif saat fungsi notFound() dipanggil atau rute tidak terdaftar di sistem." },
    { name: "page.tsx", role: "Konten Unik Segmen URL", type: "Server Component", desc: "Tampilan utama halaman yang dapat diakses publik pada rute URL ini." },
  ];

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <FolderTree className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator Hierarki Berkas Khusus App Router
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Uji bagaimana Next.js 16 secara otomatis memilih berkas khusus sesuai kondisi runtime aplikasi.
          </p>
        </div>

        {/* Scenario Controls */}
        <div className="flex flex-wrap items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700/60">
          <button
            type="button"
            onClick={() => { setScenario("normal"); setSelectedFile("page.tsx"); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              scenario === "normal" ? "bg-indigo-600 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Normal (page)
          </button>
          <button
            type="button"
            onClick={() => { setScenario("loading"); setSelectedFile("loading.tsx"); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              scenario === "loading" ? "bg-amber-600 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Delay (loading)
          </button>
          <button
            type="button"
            onClick={() => { setScenario("error"); setSelectedFile("error.tsx"); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              scenario === "error" ? "bg-rose-600 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            Crash (error)
          </button>
          <button
            type="button"
            onClick={() => { setScenario("notfound"); setSelectedFile("not-found.tsx"); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              scenario === "notfound" ? "bg-purple-600 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            404 (not-found)
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive File Tree */}
        <div className="lg:col-span-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
            <span>Struktur Folder: src/app/dashboard/</span>
            <span className="text-[10px] text-zinc-400">Pilih berkas</span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            {files.map((file) => {
              const isSelected = selectedFile === file.name;
              const isTriggered = 
                (file.name === "page.tsx" && scenario === "normal") ||
                (file.name === "loading.tsx" && scenario === "loading") ||
                (file.name === "error.tsx" && scenario === "error") ||
                (file.name === "not-found.tsx" && scenario === "notfound") ||
                file.name === "layout.tsx";

              return (
                <div
                  key={file.name}
                  onClick={() => setSelectedFile(file.name)}
                  className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-indigo-500/15 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold"
                      : isTriggered
                      ? "bg-white dark:bg-zinc-800/80 border-indigo-300 dark:border-indigo-800 text-zinc-800 dark:text-zinc-200"
                      : "bg-white/40 dark:bg-zinc-900/30 border-zinc-200/60 dark:border-zinc-800/60 text-zinc-400 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileCode className={`w-3.5 h-3.5 ${
                      file.name === "error.tsx" ? "text-rose-500" :
                      file.name === "loading.tsx" ? "text-amber-500" :
                      file.name === "layout.tsx" ? "text-blue-500" : "text-emerald-500"
                    }`} />
                    <span>{file.name}</span>
                  </div>
                  {isTriggered && (
                    <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-indigo-400/40 text-indigo-600 dark:text-indigo-400">
                      Aktif di Layar
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active File Explanation */}
          <div className="mt-3 p-3 rounded-lg bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-1 text-xs">
            <div className="flex items-center justify-between font-bold text-zinc-800 dark:text-zinc-200">
              <span>{selectedFile}</span>
              <Badge className="text-[9px]">
                {files.find((f) => f.name === selectedFile)?.type}
              </Badge>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
              {files.find((f) => f.name === selectedFile)?.desc}
            </p>
          </div>
        </div>

        {/* Right: Live Render Engine Visualizer */}
        <div className="lg:col-span-7 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-indigo-500" />
              Komposisi UI yang Ditampilkan di Browser
            </span>
            <Badge variant="outline" className="text-[10px]">
              Kondisi: {scenario === "normal" ? "200 OK" : scenario === "loading" ? "Suspended" : scenario === "error" ? "Runtime Error" : "404 Not Found"}
            </Badge>
          </div>

          {/* Simulated Outer Layout Shell */}
          <div className="p-4 rounded-xl border-2 border-dashed border-blue-400/70 dark:border-blue-500/50 bg-blue-50/30 dark:bg-blue-950/20 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-300">
              <span className="flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5" />
                layout.tsx (Sidebar & Navbar Shell Tetap Menetap)
              </span>
              <span className="text-[10px] font-mono opacity-80">Persistent State</span>
            </div>

            {/* Inner Content Swapped by Next.js */}
            <div className="min-h-[160px] rounded-lg border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 p-4 flex flex-col justify-center items-center text-center shadow-xs">
              <AnimatePresence mode="wait">
                {scenario === "normal" && (
                  <motion.div
                    key="normal"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      page.tsx Berhasil Dirender!
                    </h5>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
                      Data selesai diambil dari server. Konten unik segmen ini langsung disuntikkan ke dalam prop <code>children</code> layout.
                    </p>
                  </motion.div>
                )}

                {scenario === "loading" && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full space-y-3"
                  >
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>loading.tsx (Suspense Skeleton Shimmer)</span>
                    </div>
                    <div className="space-y-2 animate-pulse w-full max-w-md mx-auto">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-3/4 mx-auto" />
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/2 mx-auto" />
                      <div className="h-16 bg-zinc-100 dark:bg-zinc-800/60 rounded-lg w-full" />
                    </div>
                    <p className="text-[10px] text-zinc-400">
                      Pengguna melihat skeleton instan tanpa blank screen sementara server memproses query data.
                    </p>
                  </motion.div>
                )}

                {scenario === "error" && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-2.5"
                  >
                    <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                      <AlertOctagon className="w-5 h-5" />
                    </div>
                    <h5 className="font-bold text-sm text-rose-600 dark:text-rose-400">
                      error.tsx Menangkap Crash Runtime
                    </h5>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
                      Koneksi database terputus! Error boundary membatasi crash hanya pada area konten tanpa merusak Navbar & Sidebar aplikasi.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => setScenario("normal")}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-7 gap-1 shadow-sm"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Panggil reset()
                    </Button>
                  </motion.div>
                )}

                {scenario === "notfound" && (
                  <motion.div
                    key="notfound"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
                      <SearchX className="w-5 h-5" />
                    </div>
                    <h5 className="font-bold text-sm text-purple-600 dark:text-purple-400">
                      not-found.tsx (HTTP 404 Kustom)
                    </h5>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
                      Fungsi <code>notFound()</code> dipicu di server karena item ID tidak ditemukan pada tabel database.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
