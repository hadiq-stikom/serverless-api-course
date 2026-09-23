"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  CheckCircle2, 
  Keyboard, 
  Eye, 
  ShieldCheck, 
  ChevronDown, 
  X, 
  Layers 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function RadixPrimitivesAnimator() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  const menuItems = ["Profil Mahasiswa", "Pengaturan Proyek", "Kunci API Supabase", "Keluar"];

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator Aksesibilitas Headless: Radix UI Primitives
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Lihat bagaimana Radix UI menangani fokus keyboard dan atribut WAI-ARIA standar industri tanpa styling kaku.
          </p>
        </div>

        <Badge variant="outline" className="text-xs">
          WAI-ARIA Compliant
        </Badge>
      </div>

      {/* Simulator Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: ARIA & Accessibility State Inspector */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              Live DOM Accessibility Tree
            </span>
            <span className="text-[10px] text-zinc-400">Screen Reader View</span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5 text-[11px]">
            <div className="text-zinc-400 flex items-center justify-between">
              <span>// Atribut Trigger Menu</span>
              <span className={isOpen ? "text-emerald-400 font-bold" : "text-zinc-500"}>
                aria-expanded=&quot;{isOpen ? "true" : "false"}&quot;
              </span>
            </div>
            <div className="text-zinc-400 flex items-center justify-between">
              <span>// Tipe Konten Popup</span>
              <span className="text-indigo-400">aria-haspopup=&quot;menu&quot;</span>
            </div>
            <div className="text-zinc-400 flex items-center justify-between">
              <span>// Focus Trap &amp; Keyboard</span>
              <span className={isOpen ? "text-cyan-400 font-bold" : "text-zinc-500"}>
                {isOpen ? `Fokus: [${menuItems[activeItemIndex]}]` : "Fokus Bebas"}
              </span>
            </div>
            <div className="text-zinc-400 flex items-center justify-between">
              <span>// Tombol Escape Listener</span>
              <span className={isOpen ? "text-emerald-400" : "text-zinc-500"}>
                {isOpen ? "✅ Otomatis Tutup" : "Standby"}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-zinc-400 leading-relaxed p-2.5 rounded-lg bg-zinc-800/40 border border-zinc-700/60">
            Radix UI Primitives menjamin 100% aksesibilitas bagi pengguna dengan disabilitas penglihatan (*screen readers*) atau mereka yang hanya bernavigasi menggunakan keyboard.
          </div>
        </div>

        {/* Right: Interactive Component Playground */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span>Uji Coba Headless Dropdown Menu</span>
            <span className="text-[10px] text-zinc-400 font-mono">Interactive Demo</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
            {/* Trigger Button */}
            <Button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2 px-4 shadow-sm"
              aria-expanded={isOpen}
            >
              <span>Menu Pengguna</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </Button>

            {/* Simulated Accessible Popup Menu */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 8, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  className="w-56 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1.5 shadow-xl space-y-1 z-20 text-xs"
                >
                  <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Akun Mahasiswa
                  </div>
                  {menuItems.map((item, idx) => (
                    <button
                      key={item}
                      type="button"
                      onMouseEnter={() => setActiveItemIndex(idx)}
                      onClick={() => setIsOpen(false)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        activeItemIndex === idx
                          ? "bg-indigo-500 text-white font-bold"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <span>{item}</span>
                      {activeItemIndex === idx && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Keyboard hint */}
          <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Keyboard className="w-3.5 h-3.5 text-indigo-500" />
              Kontrol: Klik tombol di atas untuk melihat ARIA attributes berubah!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
