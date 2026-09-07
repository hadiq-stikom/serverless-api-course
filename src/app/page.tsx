"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Rocket, Map, Target, Award, Code2, ShieldCheck, Zap,
  Flame, Sparkles, ChevronRight, ChevronDown, BookOpen, Layers,
  Layout, Database, LockKeyhole, Image as ImageIcon, CheckCircle2,
  SlidersHorizontal, Eye, EyeOff
} from "lucide-react";
import Link from "next/link";
import { MODULES } from "@/data/curriculum";

// Definisi Warna & Ikon Spesifik untuk Setiap Minggu
const WEEK_DETAILS: Record<number, {
  icon: React.ReactNode;
  theme: "cyan" | "amber" | "violet" | "rose";
  badge: string;
  topics: string[];
}> = {
  1: {
    icon: <Rocket className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    theme: "cyan",
    badge: "Fondasi",
    topics: ["BaaS vs FaaS", "Next.js 15", "Git & GitHub", ".env.local"]
  },
  2: {
    icon: <Layout className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    theme: "cyan",
    badge: "Frontend",
    topics: ["App Router", "RSC vs Client", "Shadcn UI", "Tailwind v4"]
  },
  3: {
    icon: <Target className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    theme: "cyan",
    badge: "Backend Logic",
    topics: ["'use server'", "Server Actions", "Validasi Zod", "Form State"]
  },
  4: {
    icon: <Database className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    theme: "cyan",
    badge: "Database",
    topics: ["Supabase Postgres", "Relasi 1:N", "@supabase/ssr", "UUID PK"]
  },
  5: {
    icon: <LockKeyhole className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    theme: "cyan",
    badge: "Keamanan",
    topics: ["Supabase Auth", "GitHub OAuth", "Middleware", "Route Guard"]
  },
  6: {
    icon: <Code2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    theme: "cyan",
    badge: "Integrasi",
    topics: ["Full CRUD", "revalidatePath", "URL SearchParams", "Pagination"]
  },
  7: {
    icon: <Sparkles className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    theme: "cyan",
    badge: "Animasi",
    topics: ["Framer Motion", "AnimatePresence", "Spring Physics", "Transitions"]
  },
  8: {
    icon: <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    theme: "amber",
    badge: "Milestone UTS",
    topics: ["Live Pitching", "Code Quality", "Peer Review", "Git Tag v0.5"]
  },
  9: {
    icon: <Layout className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
    theme: "violet",
    badge: "Interaktivitas",
    topics: ["@dnd-kit", "Sortable Kanban", "Optimistic UI", "State Sync"]
  },
  10: {
    icon: <ImageIcon className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
    theme: "violet",
    badge: "CDN & Media",
    topics: ["next-cloudinary", "Direct Upload", "AI Cropping", "CDN Delivery"]
  },
  11: {
    icon: <Zap className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
    theme: "violet",
    badge: "Real-time",
    topics: ["Postgres Changes", "WebSocket Channel", "Live Sync", "Presence"]
  },
  12: {
    icon: <ShieldCheck className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
    theme: "violet",
    badge: "Keamanan Data",
    topics: ["Row Level Security", "auth.uid()", "Granular Policies", "RBAC"]
  },
  13: {
    icon: <Rocket className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
    theme: "violet",
    badge: "CI/CD DevOps",
    topics: ["Vercel Pipeline", "Preview Deploy", "Production Env", "Build Optimization"]
  },
  14: {
    icon: <Code2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
    theme: "violet",
    badge: "Observability",
    topics: ["Vercel Logs", "error.tsx Boundary", "Reverse Prompting", "Debugging"]
  },
  15: {
    icon: <CheckCircle2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
    theme: "violet",
    badge: "Optimasi",
    topics: ["Lighthouse 90+", "Clean Code", "SEO OpenGraph", "PR Merge"]
  },
  16: {
    icon: <Award className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
    theme: "rose",
    badge: "Final Boss UAS",
    topics: ["Live Production Demo", "Public Showcase", "RLS Audit", "Git Tag v1.0"]
  },
};

// Klasifikasi 4 Zona / Dunia
const SECTIONS = [
  {
    id: "world-1",
    title: "Dunia 1: Fondasi & Backend Serverless",
    range: "Minggu 1 – 7",
    desc: "Membangun arsitektur dasar, Next.js App Router, PostgreSQL Supabase, Auth, CRUD, dan Animasi.",
    theme: "cyan",
    tagColor: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
    buttonColor: "bg-cyan-600 hover:bg-cyan-700",
    borderGlow: "border-cyan-500/30 dark:border-cyan-500/40 hover:border-cyan-500/70",
    gradient: "from-cyan-500/20 via-sky-500/10 to-transparent",
    weekIds: [1, 2, 3, 4, 5, 6, 7]
  },
  {
    id: "boss-1",
    title: "Boss Fight 1: UTS Prototype Pitching",
    range: "Minggu 8",
    desc: "Evaluasi Milestone 1: Demonstrasi langsung prototipe aplikasi MVP dengan Auth dan Database relasional.",
    theme: "amber",
    tagColor: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    buttonColor: "bg-amber-600 hover:bg-amber-700",
    borderGlow: "border-amber-500/30 dark:border-amber-500/40 hover:border-amber-500/70",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    weekIds: [8]
  },
  {
    id: "world-2",
    title: "Dunia 2: Rich UI, Media & Real-time",
    range: "Minggu 9 – 15",
    desc: "Meningkatkan kualitas aplikasi: Drag & Drop Kanban, Cloudinary Media, Real-time WebSocket, RLS, dan CI/CD Vercel.",
    theme: "violet",
    tagColor: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30",
    buttonColor: "bg-violet-600 hover:bg-violet-700",
    borderGlow: "border-violet-500/30 dark:border-violet-500/40 hover:border-violet-500/70",
    gradient: "from-violet-500/20 via-indigo-500/10 to-transparent",
    weekIds: [9, 10, 11, 12, 13, 14, 15]
  },
  {
    id: "boss-2",
    title: "Final Boss: UAS Production Live Demo",
    range: "Minggu 16",
    desc: "Puncak petualangan: Peluncuran aplikasi skala produksi di Vercel publik dan live demo sistem aman dengan RLS.",
    theme: "rose",
    tagColor: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
    buttonColor: "bg-rose-600 hover:bg-rose-700",
    borderGlow: "border-rose-500/30 dark:border-rose-500/40 hover:border-rose-500/70",
    gradient: "from-rose-500/20 via-red-500/10 to-transparent",
    weekIds: [16]
  }
];

export default function Home() {
  const currentLevel = "Serverless Novice";
  const xp = 150;
  const nextLevelXp = 1500;
  const progressPercent = (xp / nextLevelXp) * 100;
  const streakWeeks = 1;

  // State untuk melacak klasifikasi mana saja yang terbuka (default semua terbuka)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "world-1": true,
    "boss-1": true,
    "world-2": true,
    "boss-2": true,
  });

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const expandAll = () => {
    setOpenSections({ "world-1": true, "boss-1": true, "world-2": true, "boss-2": true });
  };

  const collapseAll = () => {
    setOpenSections({ "world-1": false, "boss-1": false, "world-2": false, "boss-2": false });
  };

  const allOpen = Object.values(openSections).every(Boolean);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 md:p-10 lg:p-12 space-y-10 transition-colors duration-300 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-violet-500/10 dark:bg-violet-600/15 rounded-full blur-3xl" />
      </div>

      {/* Top Navbar / Stats Banner */}
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800/80 relative z-10">
        <div className="space-y-2.5 max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide uppercase">
              <Map className="w-3.5 h-3.5" />
              Buku Rancangan Pembelajaran (RPS)
            </div>
            <div className="lg:hidden">
              <ThemeToggle />
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-white"
          >
            The Serverless{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 dark:from-indigo-400 dark:via-purple-300 dark:to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
              Odyssey
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-zinc-600 dark:text-zinc-300 text-sm md:text-base leading-relaxed font-normal"
          >
            Peta jalan (Roadmap) 16 pertemuan menguasai ekosistem <span className="text-zinc-900 dark:text-white font-semibold">Next.js</span>,{" "}
            <span className="text-zinc-900 dark:text-white font-semibold">Supabase</span>,{" "}
            <span className="text-zinc-900 dark:text-white font-semibold">Cloudinary</span>, dan <span className="text-zinc-900 dark:text-white font-semibold">Vercel</span> dengan bantuan AI.
          </motion.p>
        </div>

        {/* Student Progress Card & Theme Switcher */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-end gap-3">
          <div className="hidden lg:flex items-center gap-2 self-end mb-1">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Tema Tampilan</span>
            <ThemeToggle />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-80 bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-4 shadow-md dark:shadow-black/40 backdrop-blur-md"
          >
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">Status Anda</p>
                <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                  <Rocket className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> {currentLevel}
                </h2>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-[11px]">
                  <Flame className="w-3 h-3 fill-amber-500 dark:fill-amber-400 text-amber-500 dark:text-amber-400" /> {streakWeeks} Mg
                </span>
                <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{xp} <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal">XP</span></p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-zinc-600 dark:text-zinc-300 font-medium">
                <span>Progress Milestone 1</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} className="h-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50" />
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Section: Quest Map dengan Collapsible Clasifications */}
      <section className="space-y-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Peta Petualangan (Quest Map) — 16 Pertemuan
            </h2>
            <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
              Pilih kartu modul pertemuan di bawah untuk masuk ke ruang belajar interaktif, salin prompt AI, dan selesaikan misi mingguan.
            </p>
          </div>

          {/* Quick Toggle Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {allOpen ? (
              <Button
                variant="outline"
                size="sm"
                onClick={collapseAll}
                className="text-xs gap-1.5 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                <EyeOff className="w-3.5 h-3.5" />
                Tutup Semua
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={expandAll}
                className="text-xs gap-1.5 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                <Eye className="w-3.5 h-3.5" />
                Buka Semua
              </Button>
            )}
            <Badge variant="outline" className="border-indigo-500/40 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 text-xs py-1">
              4 Klasifikasi Zona
            </Badge>
          </div>
        </div>

        {/* 4 Thematic Classification Sections */}
        <div className="space-y-10">
          {SECTIONS.map((section) => {
            const isOpen = !!openSections[section.id];
            const sectionModules = MODULES.filter((m) => section.weekIds.includes(m.id));

            return (
              <div key={section.id} className="space-y-4">
                {/* Thin Interactive Divider Line with Clickable Header */}
                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800" />
                  
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="mx-3 sm:mx-6 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm transition-all group cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {section.title}
                    </span>
                    <Badge variant="outline" className={`text-[10px] sm:text-xs py-0 px-2 font-semibold ${section.tagColor}`}>
                      {section.range} • {sectionModules.length} Modul
                    </Badge>
                    <motion.div
                      animate={{ rotate: isOpen ? 0 : -90 }}
                      transition={{ duration: 0.2 }}
                      className="text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800" />
                </div>

                {/* Collapsible Cards Grid */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key={`content-${section.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className={
                        sectionModules.length === 1
                          ? "flex justify-center items-center pt-2 pb-4 w-full"
                          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 pt-2 pb-4"
                      }>
                        {sectionModules.map((module, idx) => {
                          const details = WEEK_DETAILS[module.id] || {
                            icon: <Code2 className="w-5 h-5 text-indigo-500" />,
                            theme: "cyan",
                            badge: "Materi",
                            topics: module.concepts.points.map((p) => p.title)
                          };

                          return (
                            <motion.div
                              key={module.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.04 }}
                              whileHover={{ y: -4, transition: { duration: 0.2 } }}
                              className={sectionModules.length === 1 ? "w-full max-w-sm sm:max-w-md h-full" : "h-full"}
                            >
                              <Card className={`h-full flex flex-col justify-between overflow-hidden relative border-2 ${section.borderGlow} bg-white/90 dark:bg-zinc-900/80 backdrop-blur-xl shadow-sm dark:shadow-none transition-all duration-300 group rounded-2xl`}>
                                {/* Accent top gradient */}
                                <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${section.gradient} pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`} />

                                <CardHeader className="relative z-10 p-5 pb-3">
                                  <div className="flex items-center justify-between gap-2 mb-2.5">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                      MINGGU {module.weekNumber}
                                    </span>
                                    <Badge className="font-semibold text-[10px] py-0 px-2 bg-zinc-900/10 dark:bg-zinc-100/10 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700">
                                      {details.badge}
                                    </Badge>
                                  </div>

                                  <div className="flex items-start gap-2.5">
                                    <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 shadow-sm group-hover:scale-105 transition-transform shrink-0 mt-0.5">
                                      {details.icon}
                                    </div>
                                    <CardTitle className="text-base font-bold tracking-tight text-zinc-900 dark:text-white leading-snug">
                                      {module.title.split(":")[0]}
                                    </CardTitle>
                                  </div>

                                  <CardDescription className="text-zinc-600 dark:text-zinc-300 text-xs leading-relaxed mt-2.5 line-clamp-3">
                                    {module.subtitle}
                                  </CardDescription>
                                </CardHeader>

                                <CardContent className="relative z-10 px-5 py-2 space-y-2">
                                  <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
                                    Materi Inti:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {details.topics.map((t, i) => (
                                      <span
                                        key={i}
                                        className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-300 font-medium"
                                      >
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                </CardContent>

                                <CardFooter className="relative z-10 p-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/50 mt-auto">
                                  <Link href={`/modules/${module.id}`} className="w-full">
                                    <Button size="sm" className={`w-full ${section.buttonColor} text-white shadow-sm font-semibold text-xs flex items-center justify-center gap-1.5 group-hover:gap-2 transition-all rounded-xl py-2`}>
                                      <BookOpen className="w-3.5 h-3.5" />
                                      Eksplorasi Modul
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </Button>
                                  </Link>
                                </CardFooter>
                              </Card>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
