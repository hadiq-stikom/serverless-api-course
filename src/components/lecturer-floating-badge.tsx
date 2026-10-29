"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Award, GraduationCap, X, ChevronRight, ShieldCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function LecturerFloatingBadge() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Pill Widget (Tampil di Pojok Kanan Bawah Semua Halaman) */}
      <aside
        aria-label="Informasi Dosen Pengampu"
        className="fixed bottom-5 right-5 z-40 flex flex-col items-end pointer-events-auto"
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Buka profil Dosen Pengampu"
          className="group flex items-center gap-2.5 p-1.5 pl-1.5 pr-3.5 rounded-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-indigo-200/80 dark:border-indigo-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:shadow-indigo-500/20 hover:border-indigo-400 dark:hover:border-indigo-500/80 hover:scale-105 transition-all duration-200 cursor-pointer text-left"
        >
          {/* Avatar Dosen dengan Green Active Indicator */}
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-indigo-500/60 shadow-sm shrink-0 bg-indigo-50 dark:bg-indigo-950">
            <Image
              src="/dosen.png"
              alt="Foto Resmi Dosen Pengampu"
              fill
              className="object-cover object-top transition-transform duration-300 group-hover:scale-110"
              sizes="40px"
              priority
            />
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900 shadow-xs"
              title="Dosen Pengampu Aktif"
            />
          </div>

          {/* Label Ringkas */}
          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <span>Dosen Pengampu</span>
            </span>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              STIKOM PGRI BWI
            </span>
          </div>
        </button>

        {/* Modal Popover Profil Dosen */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute bottom-14 right-0 w-80 sm:w-88 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-indigo-200/90 dark:border-indigo-900/70 shadow-2xl p-4 sm:p-5 text-left space-y-4"
            >
              {/* Header Popover */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Profil Dosen Pengampu
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                      Pengembangan Aplikasi Serverless API
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body: Foto Besar & Bio Resmi */}
              <div className="flex items-center gap-3.5">
                <div className="relative w-16 h-20 rounded-xl overflow-hidden border-2 border-indigo-500/40 shadow-md shrink-0 bg-indigo-50 dark:bg-indigo-950">
                  <Image
                    src="/dosen.png"
                    alt="Foto Profil Dosen Pengampu: Hadiq, ST, M.Kom"
                    fill
                    className="object-cover object-top"
                    sizes="80px"
                  />
                </div>
                <div className="space-y-1 min-w-0">
                  <Badge className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 text-[10px] font-semibold">
                    <ShieldCheck className="w-3 h-3 mr-1 text-emerald-500" />
                    Dosen Pengampu Matakuliah
                  </Badge>
                  <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 truncate">
                    Hadiq, ST, M.Kom
                  </h5>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-tight">
                    Program Studi Teknik Informatika
                  </p>
                  <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                    STIKOM PGRI Banyuwangi
                  </p>
                </div>
              </div>

              {/* Kode Matakuliah & Praktikum */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-900/50">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 block">Kode Matakuliah</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-xs">KK112112</span>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-900/50">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Kode Praktikum</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-xs">KK112113</span>
                </div>
              </div>

              {/* Status & Keterangan */}
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed space-y-1.5">
                <div className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100 font-semibold">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Sistem Perkuliahan 16 Pertemuan</span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Membimbing implementasi arsitektur cloud serverless, integrasi database Supabase PostgreSQL, keamanan RLS, dan 7 Modul Praktikum terpadu.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </>
  );
}
