"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Tablet, Monitor, Image as ImageIcon, Sparkles, Play, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CldImageSrcsetAnimator() {
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("mobile");
  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  const deviceData = {
    mobile: { label: "Mobile (iPhone / Android)", width: 390, cldWidth: 480, dpr: "2x", sizeKB: 48 },
    tablet: { label: "Tablet (iPad)", width: 768, cldWidth: 800, dpr: "2x", sizeKB: 110 },
    desktop: { label: "Desktop Widescreen", width: 1440, cldWidth: 1600, dpr: "1x", sizeKB: 240 },
  };

  const current = deviceData[device];

  const handleSimulateLoad = () => {
    setIsLoaded(false);
    setTimeout(() => {
      setIsLoaded(true);
    }, 800);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">📱</span>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
              Simulasi Responsive &lt;CldImage&gt;: Otomasi srcset &amp; Blur-Up Placeholder
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Mencegah Cumulative Layout Shift (CLS) dan memuat resolusi yang tepat sesuai viewport perangkat.
          </p>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl self-start sm:self-center border border-zinc-200/60 dark:border-zinc-700/60 text-xs">
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              device === "mobile"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Mobile (390px)
          </button>
          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              device === "tablet"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            Tablet (768px)
          </button>
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              device === "desktop"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Desktop
          </button>
        </div>
      </div>

      {/* Simulator Blur-Up Effect */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Preview Container dengan Aspect Ratio Lock (Zero CLS) */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center space-y-3">
          <div className="flex items-center justify-between w-full text-xs text-zinc-400 pb-1 border-b border-zinc-800">
            <span>Viewport Peramban ({current.width}px)</span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSimulateLoad}
              className="text-[11px] h-7 gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Uji Efek Blur-Up
            </Button>
          </div>

          {/* Aspect-Ratio Box 16:9 */}
          <div className="relative w-full max-w-xs aspect-video rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center bg-zinc-900">
            {/* 1. LQIP Tiny Placeholder (Selalu ada, 0ms, blur 20px) */}
            <div className={`absolute inset-0 bg-indigo-950/80 flex items-center justify-center transition-opacity duration-500 ${
              isLoaded ? "opacity-0" : "opacity-100"
            }`}>
              <div className="w-16 h-16 rounded-full bg-indigo-500/30 filter blur-md animate-pulse" />
              <span className="absolute bottom-2 text-[10px] font-mono text-indigo-300">
                ⏳ LQIP Blur (~800 Byte Placeholder)
              </span>
            </div>

            {/* 2. Sharp Image (Fade In setelah CDN merespons) */}
            <motion.div
              initial={false}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full bg-gradient-to-br from-indigo-900 via-zinc-900 to-purple-900 flex flex-col items-center justify-center p-3"
            >
              <span className="text-4xl">🏙️</span>
              <span className="text-xs font-bold text-white mt-1">Hero Banner Resolusi Penuh</span>
              <span className="text-[10px] font-mono text-emerald-400">
                f_auto, q_auto, w_{current.cldWidth} ({current.sizeKB} KB)
              </span>
            </motion.div>
          </div>

          <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Dimensi dikunci (aspect-video) ➔ <strong>CLS Score = 0.00</strong> (Google Core Web Vitals Hijau!)</span>
          </div>
        </div>

        {/* Inspector Srcset HTML Markup */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-200 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 pb-2 border-b border-zinc-800">
            <span>Otomasi Srcset HTML oleh &lt;CldImage&gt;</span>
            <Badge variant="outline" className="text-[10px] text-indigo-400 border-indigo-400/40">
              Responsive
            </Badge>
          </div>

          <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
            Peramban secara otomatis memilih baris URL dengan lebar terdekat dari srcset tanpa logika JavaScript tambahan:
          </p>

          <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] space-y-1.5 leading-relaxed overflow-x-auto">
            <div className={device === "mobile" ? "text-emerald-400 font-bold bg-emerald-950/40 p-1 rounded" : "text-zinc-500"}>
              .../upload/w_480,f_auto,q_auto/hero.jpg 480w {device === "mobile" && "◀ Dipilih Mobile!"}
            </div>
            <div className={device === "tablet" ? "text-emerald-400 font-bold bg-emerald-950/40 p-1 rounded" : "text-zinc-500"}>
              .../upload/w_800,f_auto,q_auto/hero.jpg 800w {device === "tablet" && "◀ Dipilih Tablet!"}
            </div>
            <div className={device === "desktop" ? "text-emerald-400 font-bold bg-emerald-950/40 p-1 rounded" : "text-zinc-500"}>
              .../upload/w_1600,f_auto,q_auto/hero.jpg 1600w {device === "desktop" && "◀ Dipilih Desktop!"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

