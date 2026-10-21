"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout, Sparkles, Maximize2, X, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TABS = ["Semua", "Berjalan", "Review", "Selesai"] as const;
type TabType = typeof TABS[number];

interface CardItem {
  id: string;
  title: string;
  desc: string;
  detail: string;
  tag: string;
}

const DEMO_CARDS: CardItem[] = [
  {
    id: "card-auth",
    title: "Unified Auth Portal",
    tag: "Security",
    desc: "Multi-provider login via GitHub OAuth & Email OTP",
    detail: "Mengintegrasikan @supabase/ssr di Next.js 16 Proxy dengan rotasi JWT stateless dan proteksi session HttpOnly.",
  },
  {
    id: "card-crud",
    title: "Universal REST API",
    tag: "Backend",
    desc: "Route Handlers melayani web dan aplikasi mobile",
    detail: "Mendukung verifikasi Bearer Token JWT, CORS preflight OPTIONS 204, dan validasi skema Zod terpusat.",
  },
];

export function LayoutIdAnimator() {
  const [activeTab, setActiveTab] = useState<TabType>("Semua");
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30 text-xs font-semibold">
              Pilar 3.3: Shared Elements
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">layoutId="sharedIdentifier"</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Shared Element Transitions Menggunakan layoutId
          </h4>
        </div>
        <Badge variant="outline" className="text-xs font-mono">
          layoutId = Optical Illusion of Single Entity
        </Badge>
      </div>

      {/* Demo 1: Sliding Tab Pill Indicator */}
      <div className="space-y-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-orange-500" />
          Studi Kasus 1: Sliding Active Pill pada Filter Tabs (Klik salah satu tab)
        </span>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 w-fit">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2 text-xs font-bold rounded-lg transition-colors z-10 ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {/* layoutId Magic Pill */}
                {isActive && (
                  <motion.div
                    layoutId="demoActivePill"
                    className="absolute inset-0 rounded-lg bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200/80 dark:border-zinc-700 -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Demo 2: Card to Modal Expansion via layoutId */}
      <div className="space-y-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 relative">
        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
          <Maximize2 className="w-4 h-4 text-orange-500" />
          Studi Kasus 2: Ekspansi Kartu ke Modal Detail (Klik kartu untuk membuka modal)
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DEMO_CARDS.map((card) => (
            <motion.div
              key={card.id}
              layoutId={`card-container-${card.id}`}
              onClick={() => setSelectedCard(card)}
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 hover:border-orange-500/50 cursor-pointer shadow-sm space-y-1.5 transition-colors"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] font-mono text-orange-500">
                  {card.tag}
                </Badge>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <motion.h5
                layoutId={`card-title-${card.id}`}
                className="font-bold text-sm text-zinc-900 dark:text-white"
              >
                {card.title}
              </motion.h5>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Modal Overlay via AnimatePresence & layoutId */}
        <AnimatePresence>
          {selectedCard && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                layoutId={`card-container-${selectedCard.id}`}
                className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <Badge className="bg-orange-500 text-white text-xs font-mono">
                    {selectedCard.tag}
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setSelectedCard(null)}
                    className="w-7 h-7 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <motion.h4
                  layoutId={`card-title-${selectedCard.id}`}
                  className="text-lg font-bold text-zinc-900 dark:text-white"
                >
                  {selectedCard.title}
                </motion.h4>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {selectedCard.detail}
                </p>

                <div className="pt-2 flex justify-end">
                  <Button size="sm" onClick={() => setSelectedCard(null)} className="text-xs">
                    Tutup Modal
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
