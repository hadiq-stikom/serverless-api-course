"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MODULES, ModuleData } from "@/data/curriculum";
import { ThemeToggle } from "@/components/theme-toggle";
import { CopyButton } from "@/components/copy-button";
import { InteractiveTerm } from "@/components/interactive-term";
import { ServerClientAnimator } from "@/components/visualizers/server-client-animator";
import { ClientHydrationAnimator } from "@/components/visualizers/client-hydration-animator";
import { InterleavingCompositionAnimator } from "@/components/visualizers/interleaving-composition-animator";
import { SpecialFilesHierarchyAnimator } from "@/components/visualizers/special-files-hierarchy-animator";
import { DynamicRoutingAnimator } from "@/components/visualizers/dynamic-routing-animator";
import { CatchAllRoutingAnimator } from "@/components/visualizers/catch-all-routing-animator";
import { RouteGroupsAnimator } from "@/components/visualizers/route-groups-animator";
import { NavigationStrategiesAnimator } from "@/components/visualizers/navigation-strategies-animator";
import { RadixPrimitivesAnimator } from "@/components/visualizers/radix-primitives-animator";
import { SemanticTokensAnimator } from "@/components/visualizers/semantic-tokens-animator";
import { CvaMergeAnimator } from "@/components/visualizers/cva-merge-animator";
import { ShadcnArchitectureAnimator } from "@/components/visualizers/shadcn-architecture-animator";
import { ContainerWidgetAnimator } from "@/components/visualizers/container-widget-animator";
import { ResponsiveTokensAnimator } from "@/components/visualizers/responsive-tokens-animator";
import { ServerActionsRpcAnimator } from "@/components/visualizers/server-actions-rpc-animator";
import { ActionPlacementAnimator } from "@/components/visualizers/action-placement-animator";
import { RevalidationCacheAnimator } from "@/components/visualizers/revalidation-cache-animator";
import { ZodSafeParseAnimator } from "@/components/visualizers/zod-safe-parse-animator";
import { ZodCoercionAnimator } from "@/components/visualizers/zod-coercion-animator";
import { ZodErrorFormatterAnimator } from "@/components/visualizers/zod-error-formatter-animator";
import { UseActionStateAnimator } from "@/components/visualizers/use-action-state-animator";
import { UseFormStatusAnimator } from "@/components/visualizers/use-form-status-animator";
import { UseOptimisticAnimator } from "@/components/visualizers/use-optimistic-animator";
import { ActionStateContractAnimator } from "@/components/visualizers/action-state-contract-animator";
import { ShadcnFormFeedbackAnimator } from "@/components/visualizers/shadcn-form-feedback-animator";
import { FaasComputeAnimator } from "@/components/visualizers/faas-compute-animator";
import { BaasArchitectureAnimator } from "@/components/visualizers/baas-architecture-animator";
import { FourPillarsAnimator } from "@/components/visualizers/four-pillars-animator";
import { GitThreeTreesAnimator } from "@/components/visualizers/git-three-trees-animator";
import { GitIdentityAnimator } from "@/components/visualizers/git-identity-animator";
import { GitBranchLifecycleAnimator } from "@/components/visualizers/git-branch-lifecycle-animator";
import { GitignoreProtectionAnimator } from "@/components/visualizers/gitignore-protection-animator";
import { GitSecretsLeakAnimator } from "@/components/visualizers/git-secrets-leak-animator";
import { CretContextRoleAnimator } from "@/components/visualizers/cret-context-role-animator";
import { CretConstraintsAnimator } from "@/components/visualizers/cret-constraints-animator";
import { CretOutputReviewAnimator } from "@/components/visualizers/cret-output-review-animator";
import { UuidVsSerialAnimator } from "@/components/visualizers/uuid-vs-serial-animator";
import { OneToManyRelAnimator } from "@/components/visualizers/one-to-many-rel-animator";
import { ManyToManyRelAnimator } from "@/components/visualizers/many-to-many-rel-animator";
import { SqlConstraintsAnimator } from "@/components/visualizers/sql-constraints-animator";
import { BtreeIndexAnimator } from "@/components/visualizers/btree-index-animator";
import { PostgresTriggersAnimator } from "@/components/visualizers/postgres-triggers-animator";
import { SupabaseSsrArchAnimator } from "@/components/visualizers/supabase-ssr-arch-animator";
import { AsyncCookiesAnimator } from "@/components/visualizers/async-cookies-animator";
import { ClientVsServerSupabaseAnimator } from "@/components/visualizers/client-vs-server-supabase-animator";
import { ThreeTierSchemaAnimator } from "@/components/visualizers/three-tier-schema-animator";
import { SupabaseTypegenAnimator } from "@/components/visualizers/supabase-typegen-animator";
import { VsCodeSnippet } from "@/components/vscode-snippet";
import { VsCodePrompt } from "@/components/vscode-prompt";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ChevronDown, BookOpen, Terminal, Target,
  ExternalLink, Sparkles, AlertTriangle, CheckCircle2, ShieldCheck,
  Rocket, Layers, Award, Clock, Zap, Map, GitBranch, GitMerge, GitPullRequest, Trash2,
  Info, Lightbulb, ShieldAlert, Code
} from "lucide-react";

// Mapping Konfigurasi Visualizer Interaktif untuk Seluruh 14 Subpoin Konsep Pertemuan 2
const MODULE_2_VISUALIZERS: Record<string, { key: string; title: string; subtitle: string; component: React.ReactNode }> = {
  // Pilar 1: Paradigma Komputasi Next.js 16 (Server vs Client)
  "0-0": {
    key: "server-client",
    title: "Simulasi Arsitektur: RSC vs Client Components",
    subtitle: "Buka visualisasi alur cloud server, database query, secrets isolation & 0 kB JS bundle",
    component: <ServerClientAnimator />,
  },
  "0-1": {
    key: "client-hydration",
    title: "Simulasi Siklus Rehidrasi: Client Component ('use client')",
    subtitle: "Lihat transisi HTML statis ➔ Unduh JS Bundle ➔ Binding Event Listener ➔ Full Interaktif",
    component: <ClientHydrationAnimator />,
  },
  "0-2": {
    key: "interleaving",
    title: "Simulasi Pola Komposisi: Interleaving Pattern & Children Props",
    subtitle: "Bandingkan Anti-Pattern (Direct Import) vs Best Practice (Children Props)",
    component: <InterleavingCompositionAnimator />,
  },

  // Pilar 2: Anatomi Sistem Routing Next.js 16 App Router
  "1-0": {
    key: "special-files",
    title: "Simulasi Hierarki Berkas Khusus: layout, loading, error & not-found",
    subtitle: "Uji respons Next.js saat navigasi normal, loading Suspense, runtime error crash, dan 404",
    component: <SpecialFilesHierarchyAnimator />,
  },
  "1-1": {
    key: "dynamic-routing",
    title: "Simulasi Routing: Dynamic Routes [id] & Async Params",
    subtitle: "Uji coba perubahan parameter URL, resolusi Promise await params, dan respon notFound()",
    component: <DynamicRoutingAnimator />,
  },
  "1-2": {
    key: "catch-all",
    title: "Simulasi Segmen Catch-all [...slug] & [[...slug]]",
    subtitle: "Eksplorasi parsing URL segmen bersarang tak terbatas menjadi array parameter string",
    component: <CatchAllRoutingAnimator />,
  },
  "1-3": {
    key: "route-groups",
    title: "Simulasi Route Groups '(folder)' & Private Folders '_folder'",
    subtitle: "Pahami perbedaan organisasi struktur folder internal vs URL publik browser",
    component: <RouteGroupsAnimator />,
  },
  "1-4": {
    key: "nav-strategies",
    title: "Simulasi 3 Strategi Navigasi & Pengiriman Params/Query: <Link> vs useRouter() vs redirect()",
    subtitle: "Uji transmisi parameter dinamis, query strings URLSearchParams, dan panduan matriks use case",
    component: <NavigationStrategiesAnimator />,
  },

  // Pilar 3: Revolusi Shadcn UI
  "2-0": {
    key: "radix-primitives",
    title: "Simulasi Headless Accessibility: Radix UI Primitives",
    subtitle: "Uji navigasi keyboard, focus trap, dan atribut WAI-ARIA standar industri",
    component: <RadixPrimitivesAnimator />,
  },
  "2-1": {
    key: "semantic-tokens",
    title: "Simulasi Semantic CSS Variables & Tailwind Tokens",
    subtitle: "Lihat adaptabilitas warna HSL pada Dark Mode & Light Mode tanpa duplikasi CSS",
    component: <SemanticTokensAnimator />,
  },
  "2-2": {
    key: "cva-merge",
    title: "Simulasi CVA & Utilitas cn() (tailwind-merge + clsx)",
    subtitle: "Uji resolusi otomatis konflik class CSS Tailwind dan seleksi varian type-safe",
    component: <CvaMergeAnimator />,
  },
  "2-3": {
    key: "shadcn-arch",
    title: "Simulasi Arsitektur: Shadcn Open Scaffolding vs NPM Blackbox",
    subtitle: "Bandingkan kepemilikan kode langsung di src/components/ui/ vs node_modules tertutup",
    component: <ShadcnArchitectureAnimator />,
  },

  // Pilar 4: Clean Component Scaffolding
  "3-0": {
    key: "container-widget",
    title: "Simulasi Pemisahan: Server Container (RSC) vs Client Widget",
    subtitle: "Alur fetch data 1x di server ➔ filtering instan di memori browser pengguna",
    component: <ContainerWidgetAnimator />,
  },
  "3-1": {
    key: "responsive-tokens",
    title: "Simulasi Desain Responsif & Semantic Token Hierarchy",
    subtitle: "Uji kartu Shadcn pada ukuran Mobile (320px), Tablet (500px), dan Desktop dengan token semantic",
    component: <ResponsiveTokensAnimator />,
  },
};

// Mapping Konfigurasi Visualizer Interaktif untuk Seluruh 11 Subpoin Konsep Pertemuan 3
const MODULE_3_VISUALIZERS: Record<string, { key: string; title: string; subtitle: string; component: React.ReactNode }> = {
  // Pilar 1: Arsitektur RPC Serverless & Server Actions
  "0-0": {
    key: "server-actions-rpc",
    title: "Simulasi Alur RPC Server Actions ('use server')",
    subtitle: "Lihat dispatch POST terenkripsi tanpa endpoint /api/* manual",
    component: <ServerActionsRpcAnimator />,
  },
  "0-1": {
    key: "action-placement",
    title: "Simulasi Pola Penempatan Server Actions",
    subtitle: "Perbedaan berkas terpisah (src/actions/*) vs inline di Server Component",
    component: <ActionPlacementAnimator />,
  },
  "0-2": {
    key: "revalidation-cache",
    title: "Simulasi Revalidasi Cache Server (revalidatePath)",
    subtitle: "Uji purge cache data server seketika untuk pembaruan UI instan",
    component: <RevalidationCacheAnimator />,
  },

  // Pilar 2: Validasi Skema & Pertahanan Input Ketat dengan Zod
  "1-0": {
    key: "zod-safeparse",
    title: "Simulator Zod safeParse() & Pertahanan Input",
    subtitle: "Uji validasi skema tanpa melempar unhandled crash exception",
    component: <ZodSafeParseAnimator />,
  },
  "1-1": {
    key: "zod-coercion",
    title: "Simulator Zod Type Coercion (z.coerce) & Refinement",
    subtitle: "Konversi string FormData mentah ke typed JavaScript object",
    component: <ZodCoercionAnimator />,
  },
  "1-2": {
    key: "zod-error-format",
    title: "Simulator Pemformatan ZodError (error.flatten)",
    subtitle: "Transformasi Zod issues ke dictionary fieldErrors ramah UI",
    component: <ZodErrorFormatterAnimator />,
  },

  // Pilar 3: Ekosistem Hook Form React 19
  "2-0": {
    key: "use-action-state",
    title: "Simulator Siklus React 19 useActionState Hook",
    subtitle: "Transisi state [state, formAction, isPending] native React 19",
    component: <UseActionStateAnimator />,
  },
  "2-1": {
    key: "use-form-status",
    title: "Simulator useFormStatus (Tombol Daun Sadar Status)",
    subtitle: "Deteksi pending state form induk tanpa prop drilling",
    component: <UseFormStatusAnimator />,
  },
  "2-2": {
    key: "use-optimistic",
    title: "Simulator UI Optimistik: useOptimistic Hook (React 19)",
    subtitle: "Bandingkan respons instan 0ms vs menunggu server 1500ms",
    component: <UseOptimisticAnimator />,
  },

  // Pilar 4: Arsitektur Produksi & Shadcn Form
  "3-0": {
    key: "action-state-contract",
    title: "Simulator Standar Kontrak Tipe ActionState<T>",
    subtitle: "Konsistensi kontrak respons enterprise untuk seluruh Server Actions",
    component: <ActionStateContractAnimator />,
  },
  "3-1": {
    key: "shadcn-form-feedback",
    title: "Simulator Integrasi Form Shadcn UI & Error Feedback",
    subtitle: "Uji interaksi Input, Label, inline error alerts, dan status loading",
    component: <ShadcnFormFeedbackAnimator />,
  },
};

// Mapping Konfigurasi Visualizer Interaktif untuk Seluruh 11 Subpoin Konsep Pertemuan 1
const MODULE_1_VISUALIZERS: Record<string, { key: string; title: string; subtitle: string; component: React.ReactNode }> = {
  // Pilar 1: Paradigma Komputasi Cloud Serverless
  "0-0": {
    key: "faas-compute",
    title: "Simulasi Siklus Eksekusi FaaS vs VPS Monolith",
    subtitle: "Uji coba scale-to-zero, lonjakan request, dan perbandingan biaya $0 saat idle",
    component: <FaasComputeAnimator />,
  },
  "0-1": {
    key: "baas-architecture",
    title: "Simulasi Ekosistem BaaS: 4 Layanan Backend Siap Pakai",
    subtitle: "Uji request SDK PostgreSQL RLS, Supabase Auth, WebSocket Realtime, dan Storage CDN",
    component: <BaasArchitectureAnimator />,
  },
  "0-2": {
    key: "four-pillars",
    title: "Simulasi Alur Transaksi Data Melintasi 4 Pilar Komputasi",
    subtitle: "Lihat alur sinergi Next.js 16 ➔ Vercel Edge ➔ Supabase DB ➔ Cloudinary Media",
    component: <FourPillarsAnimator />,
  },

  // Pilar 2: Sistem Kontrol Versi Terdistribusi & Siklus Kerja Git
  "1-0": {
    key: "git-three-trees",
    title: "Simulasi 3 Wilayah Kerja Git & Transmisi ke Remote GitHub",
    subtitle: "Alur pergerakan file: Working Tree ➔ git add (Staging) ➔ git commit ➔ git push",
    component: <GitThreeTreesAnimator />,
  },
  "1-1": {
    key: "git-identity",
    title: "Simulasi Multi-Akun: Resolusi Identitas Author (Global vs Local)",
    subtitle: "Pahami cara memisahkan akun kampus dan pribadi menggunakan git config lokal",
    component: <GitIdentityAnimator />,
  },
  "1-2": {
    key: "git-branch-lifecycle",
    title: "Simulasi Siklus 4 Langkah Git: Branching, Commit, Merge & Cleanup",
    subtitle: "Visualisasi graf percabangan feature branch terisolasi hingga kembali ke main",
    component: <GitBranchLifecycleAnimator />,
  },

  // Pilar 3: Keamanan Repositori & Higienitas Kredensial Rahasia
  "2-0": {
    key: "gitignore-protection",
    title: "Simulasi Mekanisme Proteksi .gitignore Terhadap File .env.local",
    subtitle: "Bandingkan status keamanan git status dengan .gitignore aktif vs tanpa proteksi",
    component: <GitignoreProtectionAnimator />,
  },
  "2-1": {
    key: "git-secrets-leak",
    title: "Simulasi Kebocoran Secrets & Bahaya Git History Permanence",
    subtitle: "Pahami kecepatan bot scraper GitHub dan mengapa hapus commit biasa tidak cukup",
    component: <GitSecretsLeakAnimator />,
  },

  // Pilar 4: Metodologi Rekayasa AI Berkonteks Tinggi (Framework C-R-E-T)
  "3-0": {
    key: "cret-context-role",
    title: "Simulasi Pengaruh C (Context) & R (Role) Terhadap Kualitas Output AI",
    subtitle: "Bandingkan hasil prompt asal-asalan vs prompt dengan persona pakar & arsitektur jelas",
    component: <CretContextRoleAnimator />,
  },
  "3-1": {
    key: "cret-constraints",
    title: "Simulasi Penguncian Batasan Teknis (Explicit Constraints) Menangkal Kode Usang",
    subtitle: "Uji pengaruh batasan Next.js 16, React 19, dan zero-any terhadap respons AI",
    component: <CretConstraintsAnimator />,
  },
  "3-2": {
    key: "cret-output-review",
    title: "Simulasi Target Output Modular & Checklist Review Mandiri Kode AI",
    subtitle: "Inspeksi struktur berkas modular dan verifikasi checklist sebelum commit",
    component: <CretOutputReviewAnimator />,
  },
};

// Mapping Konfigurasi Visualizer Interaktif untuk Seluruh 11 Subpoin Konsep Pertemuan 4
const MODULE_4_VISUALIZERS: Record<string, { key: string; title: string; subtitle: string; component: React.ReactNode }> = {
  // Pilar 1: Arsitektur Relasional Database PostgreSQL Modern
  "0-0": {
    key: "uuid-vs-serial",
    title: "Simulasi Identitas Entitas: UUID v4 vs Auto-Increment Serial",
    subtitle: "Uji coba keamanan enumerasi ID, konkurensi skala terdistribusi, dan dampak storage",
    component: <UuidVsSerialAnimator />,
  },
  "0-1": {
    key: "one-to-many-rel",
    title: "Simulasi Relasi 1:N & Integritas ON DELETE CASCADE",
    subtitle: "Bandingkan CASCADE (pembersihan otomatis) vs RESTRICT (larangan hapus relasi yatim)",
    component: <OneToManyRelAnimator />,
  },
  "0-2": {
    key: "many-to-many-rel",
    title: "Simulasi Relasi M:N & Junction Table (task_tags)",
    subtitle: "Lihat dekonstruksi relasi banyak-ke-banyak dengan Composite Primary Key",
    component: <ManyToManyRelAnimator />,
  },

  // Pilar 2: Integritas Data, Indeksasi, & Otomasi Triggers di PostgreSQL
  "1-0": {
    key: "sql-constraints",
    title: "Simulasi Integritas Skema: NOT NULL, UNIQUE, & CHECK Constraint",
    subtitle: "Uji pertahanan validasi lapis database terhadap serangan data anomali & bypass API",
    component: <SqlConstraintsAnimator />,
  },
  "1-1": {
    key: "btree-index",
    title: "Simulasi Performa Indeksasi: B-Tree Index Scan vs Sequential Scan",
    subtitle: "Bandingkan kecepatan pencarian O(log N) 0.8ms vs full table scan O(N) 240ms pada 100.000 row",
    component: <BtreeIndexAnimator />,
  },
  "1-2": {
    key: "postgres-triggers",
    title: "Simulasi Otomasi PostgreSQL Triggers: updated_at Timestamp",
    subtitle: "Lihat eksekusi otomatis BEFORE UPDATE trigger function tanpa intervensi manual server",
    component: <PostgresTriggersAnimator />,
  },

  // Pilar 3: Arsitektur Klien Supabase SSR & Keamanan Kredensial
  "2-0": {
    key: "supabase-ssr-arch",
    title: "Simulasi Arsitektur Adapter: @supabase/ssr vs Legacy auth-helpers",
    subtitle: "Pahami pemisahan CookieAdapter dan mengapa auth-helpers resmi didepresiasi",
    component: <SupabaseSsrArchAnimator />,
  },
  "2-1": {
    key: "async-cookies",
    title: "Simulasi Next.js 16 Async Cookies & Siklus get/set Cookie",
    subtitle: "Uji coba breaking change await cookies(), getAll() di RSC dan setAll() di Server Actions/Proxy",
    component: <AsyncCookiesAnimator />,
  },
  "2-2": {
    key: "client-vs-server-supabase",
    title: "Simulasi Supabase Client: Browser Singleton vs Server Per-Request",
    subtitle: "Bandingkan client browser untuk Realtime vs client server aman bebas kebocoran sesi antar-user",
    component: <ClientVsServerSupabaseAnimator />,
  },

  // Pilar 4: Blueprint Skema Proyek Akhir & Supabase Typegen
  "3-0": {
    key: "three-tier-schema",
    title: "Simulasi Blueprint Skema 3 Tingkat: profiles ➔ projects ➔ tasks",
    subtitle: "Inspeksi keterkaitan ERD enterprise, foreign keys, cascade rules, dan isolasi multi-tenant",
    component: <ThreeTierSchemaAnimator />,
  },
  "3-1": {
    key: "supabase-typegen",
    title: "Simulasi Supabase CLI Typegen: Otomasi Type-Safe Database ke TS",
    subtitle: "Saksikan migrasi skema SQL langsung di-generate menjadi file database.types.ts yang akurat",
    component: <SupabaseTypegenAnimator />,
  },
};

function FormattedSubpointText({ text }: { text: string }) {
  if (!text) return null;

  // Split into paragraphs by double newlines or single newlines
  const paragraphs = text.split(/\n\n+/).filter(Boolean);

  // Helper to format inline markdown like `code`, **bold**, and *italic*
  const formatInline = (str: string) => {
    // Regex for matching `code`, **bold**, or *italic*
    const parts = str.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        const code = part.slice(1, -1);
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/70 mx-0.5 inline-block align-baseline"
          >
            {code}
          </code>
        );
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        const bold = part.slice(2, -2);
        return (
          <strong key={idx} className="font-bold text-zinc-900 dark:text-zinc-100">
            {bold}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        const italic = part.slice(1, -1);
        return (
          <em key={idx} className="italic text-zinc-800 dark:text-zinc-200 font-medium">
            {italic}
          </em>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  // If there's only 1 paragraph and it's not a numbered list item
  if (paragraphs.length === 1 && !paragraphs[0].match(/^\d+\.\s+/)) {
    return (
      <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
        {formatInline(paragraphs[0])}
      </p>
    );
  }

  return (
    <div className="space-y-3 pt-1">
      {paragraphs.map((p, pIdx) => {
        // Check if paragraph is a numbered item: "1. Title: Description" or "1. Description"
        const numMatch = p.match(/^(\d+)\.\s+([^:]+):?\s*([\s\S]*)$/);

        if (numMatch) {
          const num = numMatch[1];
          const hasColon = p.includes(":");
          const itemTitle = hasColon ? numMatch[2].trim() : "";
          const itemDesc = hasColon ? numMatch[3].trim() : numMatch[2].trim() + (numMatch[3] ? ": " + numMatch[3].trim() : "");

          return (
            <div
              key={pIdx}
              className="group relative flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 shadow-sm transition-all duration-300 ease-out origin-center cursor-pointer hover:scale-[1.2] hover:z-50 hover:shadow-[0_20px_60px_rgba(0,0,0,0.22)] dark:hover:shadow-[0_25px_70px_rgba(0,0,0,0.9)] hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500/25"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold font-mono text-xs shrink-0 shadow-xs mt-0.5 group-hover:scale-110 transition-transform">
                {num}
              </span>
              <div className="space-y-1.5 flex-1 text-xs md:text-sm leading-relaxed">
                {itemTitle && (
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 flex-wrap">
                    {formatInline(itemTitle)}
                  </div>
                )}
                <div className="text-zinc-600 dark:text-zinc-300">
                  {formatInline(itemDesc)}
                </div>
              </div>
            </div>
          );
        }

        // Standard introductory or concluding paragraph
        return (
          <p
            key={pIdx}
            className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium"
          >
            {formatInline(p)}
          </p>
        );
      })}
    </div>
  );
}

export default function ModuleDetailPage() {
  const params = useParams();
  const moduleId = Number(params.id) || 1;
  const currentModule = MODULES.find((m) => m.id === moduleId);

  const [activeTab, setActiveTab] = useState<"concept" | "lab" | "mission">("concept");
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [mergeStrategy, setMergeStrategy] = useState<"terminal" | "pr">("terminal");
  const [expandedVisualizers, setExpandedVisualizers] = useState<Record<string, boolean>>({});

  const toggleVisualizer = (key: string) => {
    setExpandedVisualizers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTabChange = (tab: "concept" | "lab" | "mission") => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const anchor = document.getElementById("tab-navigation-bar");
      if (anchor) {
        const topOffset = anchor.getBoundingClientRect().top + window.scrollY - 70;
        if (window.scrollY > topOffset) {
          window.scrollTo({ top: topOffset, behavior: "smooth" });
        }
      }
    }
  };

  if (!currentModule) {
    return notFound();
  }

  const prevModule = MODULES.find((m) => m.id === moduleId - 1);
  const nextModule = MODULES.find((m) => m.id === moduleId + 1);

  const toggleTask = (taskIndex: number) => {
    const key = `${currentModule.id}-${taskIndex}`;
    setCompletedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Group modules by world for the sidebar
  const worldGroups = [
    { id: "world-1", title: "Dunia 1: Fondasi & Backend", badge: "M1 – M7", modules: MODULES.filter((m) => m.worldId === "world-1") },
    { id: "boss-1", title: "Boss Fight 1: UTS Pitching", badge: "M8", modules: MODULES.filter((m) => m.worldId === "boss-1") },
    { id: "world-2", title: "Dunia 2: Rich UI & Media", badge: "M9 – M15", modules: MODULES.filter((m) => m.worldId === "world-2") },
    { id: "boss-2", title: "Final Boss: UAS Live Demo", badge: "M16", modules: MODULES.filter((m) => m.worldId === "boss-2") },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors duration-300">
      {/* Top sticky navbar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Quest Map</span>
            </Button>
          </Link>
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Minggu {currentModule.weekNumber.toString().padStart(2, "0")}
            </span>
            <span className="text-zinc-400 dark:text-zinc-600 hidden md:inline">•</span>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate max-w-xs md:max-w-md hidden md:inline">
              {currentModule.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/5 font-semibold text-xs py-0.5">
            +{currentModule.xp} XP
          </Badge>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Workspace: 2 Columns (Sidebar + Content) */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto">
        {/* Left Sidebar: 16 Weeks Navigator */}
        <aside className="w-full lg:w-80 lg:shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800/80 p-4 lg:p-6 bg-zinc-100/40 dark:bg-zinc-900/20 lg:h-[calc(100vh-57px)] lg:sticky lg:top-[57px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Map className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Daftar Pertemuan (RPS)
            </h2>
          </div>

          <div className="space-y-6">
            {worldGroups.map((group) => (
              <div key={group.id} className="space-y-1.5">
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                    {group.title}
                  </span>
                  <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
                    {group.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  {group.modules.map((m) => {
                    const isCurrent = m.id === currentModule.id;
                    return (
                      <Link key={m.id} href={`/modules/${m.id}`}>
                        <div
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            isCurrent
                              ? "bg-indigo-600 text-white shadow-sm font-semibold"
                              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
                          }`}
                        >
                          <span className="truncate pr-2">
                            {m.weekNumber}. {m.title.split(":")[0]}
                          </span>
                          {m.worldId.startsWith("boss") && (
                            <Badge
                              className={`text-[9px] px-1 py-0 h-4 uppercase ${
                                isCurrent
                                  ? "bg-white/20 text-white"
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                              }`}
                            >
                              Exam
                            </Badge>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Content Area: Hero + 3 Pillars */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 space-y-8 max-w-5xl">
          {/* Module Hero Banner */}
          <div className="space-y-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-xs font-semibold">
                {currentModule.worldTitle}
              </Badge>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {currentModule.duration}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
              {currentModule.title}
            </h1>

            <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
              {currentModule.subtitle}
            </p>

            {/* Target CPMK Box */}
            <div className="bg-indigo-500/5 dark:bg-indigo-950/30 border border-indigo-500/20 rounded-2xl p-4 flex items-start gap-3">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-0.5">
                  Target Capaian Pembelajaran (CPMK):
                </p>
                <p className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                  {currentModule.cpmk}
                </p>
              </div>
            </div>
          </div>

          {/* 3 Pillars Tabs Navigation (Sticky Sub-Header) */}
          <div
            id="tab-navigation-bar"
            className="sticky top-[57px] z-20 -mx-6 md:-mx-10 lg:-mx-12 px-6 md:px-10 lg:px-12 py-3 bg-zinc-50/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-all shadow-xs"
          >
            <div className="flex items-center gap-2 p-1.5 bg-zinc-200/80 dark:bg-zinc-900 border border-zinc-300/80 dark:border-zinc-800 rounded-2xl shadow-inner max-w-5xl mx-auto">
              <button
                type="button"
                onClick={() => handleTabChange("concept")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "concept"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <BookOpen className="w-4 h-4 text-cyan-500" />
                <span>1. Konsep &amp; Teori</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("lab")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "lab"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <Terminal className="w-4 h-4 text-indigo-500" />
                <span>2. Lab &amp; Prompt AI</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("mission")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "mission"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <Target className="w-4 h-4 text-emerald-500" />
                <span>3. Misi Proyek</span>
              </button>
            </div>
          </div>

          {/* TAB 1: KONSEP & TEORI */}
          {activeTab === "concept" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-500" />
                  Intisari Arsitektur
                </h3>
                {currentModule.id === 1 ? (
                  <div className="space-y-2">
                    <div className="text-zinc-600 dark:text-zinc-300 text-base leading-relaxed">
                      Serverless membebaskan developer dari manajemen infrastruktur server manual. Kita berfokus pada dua pilar utama:{" "}
                      <InteractiveTerm term="faas">FaaS (Vercel Serverless Functions)</InteractiveTerm>{" "}
                      dan{" "}
                      <InteractiveTerm term="baas">BaaS (Supabase)</InteractiveTerm>.
                    </div>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                      <span>💡</span>
                      <span>Arahkan kursor (hover) atau klik badge FaaS / BaaS untuk melihat definisi & simulasi alur kerjanya.</span>
                    </p>
                  </div>
                ) : currentModule.id === 2 ? (
                  <div className="space-y-2">
                    <div className="text-zinc-600 dark:text-zinc-300 text-base leading-relaxed">
                      Next.js 16 App Router memadukan performa tinggi{" "}
                      <InteractiveTerm term="rsc">Server Components (RSC)</InteractiveTerm>{" "}
                      dengan interaktivitas dinamis{" "}
                      <InteractiveTerm term="client-component">Client Components (&apos;use client&apos;)</InteractiveTerm>,{" "}
                      sistem navigasi{" "}
                      <InteractiveTerm term="app-router">App Router</InteractiveTerm>,{" "}
                      serta arsitektur komponen terbuka{" "}
                      <InteractiveTerm term="shadcn">Shadcn UI</InteractiveTerm>.
                    </div>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                      <span>💡</span>
                      <span>Arahkan kursor (hover) atau klik badge istilah untuk melihat analogi, panduan teknis & simulasi komputasi.</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-zinc-600 dark:text-zinc-300 text-base leading-relaxed">
                    {currentModule.concepts.summary}
                  </p>
                )}
              </div>



              {/* Point-by-point breakdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentModule.concepts.points.map((pt, i) => (
                  <Card key={i} className="border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 shadow-none">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-black">
                          {i + 1}
                        </span>
                        {pt.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-1 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {pt.desc}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Deep Dive Conceptual Sections */}
              {currentModule.concepts.deepDiveSections && currentModule.concepts.deepDiveSections.length > 0 && (
                <div className="space-y-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-indigo-500" />
                      Landasan Teori & Arsitektur Mendalam
                    </h3>
                    <span className="text-xs text-zinc-500 hidden sm:inline">Pemahaman Konsep Komprehensif</span>
                  </div>

                  <div className="space-y-6">
                    {currentModule.concepts.deepDiveSections.map((section, sIdx) => (
                      <div
                        key={sIdx}
                        className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/70 p-5 md:p-6 space-y-4 shadow-sm"
                      >
                        {/* Header & Badge */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                          <h4 className="text-base md:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                            {section.title}
                          </h4>
                          {section.badge && (
                            <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-xs font-semibold">
                              {section.badge}
                            </Badge>
                          )}
                        </div>

                        {/* Main Content Paragraph */}
                        <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                          {section.content}
                        </p>

                        {/* Subpoints */}
                        {section.subpoints && section.subpoints.length > 0 && (
                          <div className="space-y-3 pt-1">
                            {section.subpoints.map((sub, subIdx) => (
                              <div
                                key={subIdx}
                                className="p-4 rounded-xl bg-zinc-50/90 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 space-y-3 transition-all hover:border-zinc-300 dark:hover:border-zinc-600"
                              >
                                <div className="flex items-start gap-3">
                                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold shrink-0 mt-0.5 text-xs">
                                    {subIdx + 1}
                                  </span>
                                  <div className="space-y-1 flex-1">
                                    <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                                      {sub.label}
                                    </h5>
                                    <FormattedSubpointText text={sub.text} />
                                  </div>
                                </div>

                                {/* VS Code Styled Code / File Structure Example Box with 1.2x Zoom on Hover */}
                                {sub.code && (
                                  <div className="ml-0 sm:ml-9 pt-2 pb-2">
                                    <VsCodeSnippet
                                      code={sub.code}
                                      language={sub.language}
                                      caption={sub.caption}
                                      enableZoom={true}
                                    />
                                  </div>
                                )}

                                {/* Interactive Simulation Accordions for Module Concepts (Option 2: Smooth Accordion Unfold) */}
                                {(() => {
                                  const activeVizMap = currentModule.id === 1 ? MODULE_1_VISUALIZERS : currentModule.id === 2 ? MODULE_2_VISUALIZERS : currentModule.id === 3 ? MODULE_3_VISUALIZERS : currentModule.id === 4 ? MODULE_4_VISUALIZERS : null;
                                  const viz = activeVizMap ? activeVizMap[`${sIdx}-${subIdx}`] : null;
                                  if (!viz) return null;
                                  const isExpanded = !!expandedVisualizers[viz.key];

                                  return (
                                    <div className="ml-0 sm:ml-9 pt-2">
                                      <button
                                        type="button"
                                        onClick={() => toggleVisualizer(viz.key)}
                                        className={`w-full group flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all duration-200 text-left cursor-pointer ${
                                          isExpanded
                                            ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 shadow-md ring-2 ring-indigo-500/20"
                                            : "bg-white dark:bg-zinc-800/80 border-indigo-200/80 dark:border-zinc-700/80 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-indigo-50/40 dark:hover:bg-zinc-800 shadow-sm"
                                        }`}
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className={`p-2 rounded-lg transition-colors ${
                                            isExpanded
                                              ? "bg-indigo-600 text-white"
                                              : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white"
                                          }`}>
                                            <Sparkles className="w-4 h-4" />
                                          </div>
                                          <div>
                                            <div className="text-xs sm:text-sm font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                                              <span>{viz.title}</span>
                                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                                                Interactive Lab
                                              </span>
                                            </div>
                                            <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-normal mt-0.5">
                                              {isExpanded
                                                ? "Klik untuk melipat panel simulasi interaktif"
                                                : viz.subtitle}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
                                          <span className="hidden sm:inline">{isExpanded ? "Tutup Simulasi" : "Jalankan Simulasi"}</span>
                                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                                        </div>
                                      </button>

                                      <AnimatePresence>
                                        {isExpanded && (
                                          <motion.div
                                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                            animate={{ opacity: 1, height: "auto", marginTop: 14 }}
                                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                            transition={{ duration: 0.35, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                          >
                                            {viz.component}
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  );
                                })()}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Comparison Table */}
                        {section.comparisonTable && (
                          <div className="space-y-2 pt-2">
                            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                              <table className="w-full text-left text-xs md:text-sm border-collapse">
                                <thead>
                                  <tr className="bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold">
                                    {section.comparisonTable.headers.map((h, hIdx) => (
                                      <th key={hIdx} className="py-3 px-4 first:rounded-tl-xl last:rounded-tr-xl whitespace-nowrap">
                                        {h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                                  {section.comparisonTable.rows.map((row, rIdx) => (
                                    <tr
                                      key={rIdx}
                                      className={rIdx % 2 === 0 ? "bg-white dark:bg-zinc-900/40" : "bg-zinc-50/70 dark:bg-zinc-900/80"}
                                    >
                                      {row.map((cell, cIdx) => (
                                        <td
                                          key={cIdx}
                                          className={`py-3 px-4 ${cIdx === 0 ? "font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap" : ""}`}
                                        >
                                          {cell}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Callout Box */}
                        {section.callout && (
                          <div
                            className={`rounded-xl p-4 flex items-start gap-3 border ${
                              section.callout.type === "warning"
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
                                : section.callout.type === "tip"
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                                : "bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-200"
                            }`}
                          >
                            {section.callout.type === "warning" && (
                              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            )}
                            {section.callout.type === "tip" && (
                              <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            )}
                            {section.callout.type === "info" && (
                              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            )}
                            <div className="space-y-1">
                              <h5 className="text-sm font-bold">{section.callout.title}</h5>
                              <p className="text-xs md:text-sm opacity-90 leading-relaxed">
                                {section.callout.text}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Official References Section (Primary Sources) */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    Dokumentasi Resmi (Primary Sources)
                  </h4>
                  <span className="text-[11px] text-zinc-500">Wajib dijadikan acuan sintaks</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {currentModule.references.map((ref, idx) => (
                    <a
                      key={idx}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 transition-all shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-semibold text-indigo-600 dark:text-indigo-400 border-indigo-500/30">
                          {ref.source}
                        </Badge>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2">
                        {ref.title}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Bottom Flow CTA: Proceed to Lab */}
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <div className="p-5 md:p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/80 dark:from-zinc-900 dark:via-zinc-900 dark:to-indigo-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Langkah Selanjutnya
                    </span>
                    <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                      Selesai Mempelajari Teori?
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Uji kode &amp; jalankan eksperimen langsung di tab Lab Praktikum serta Formula Prompt AI.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleTabChange("lab")}
                    className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-10 px-5 rounded-xl shrink-0 shadow-sm cursor-pointer"
                  >
                    <span>Lanjut ke Lab &amp; Prompt AI</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: LAB PRAKTIKUM & PROMPT AI */}
          {activeTab === "lab" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Warning Alert if exists */}
              {currentModule.lab.warningZone && (
                <div className="bg-rose-500/10 border-2 border-rose-500/30 rounded-2xl p-4 flex items-start gap-3.5 text-rose-900 dark:text-rose-200">
                  <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold mb-1">{currentModule.lab.warningZone.title}</h4>
                    <p className="text-xs md:text-sm text-rose-800 dark:text-rose-300 leading-relaxed">
                      {currentModule.lab.warningZone.desc}
                    </p>
                  </div>
                </div>
              )}

              {/* Lab Steps */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-500" />
                  Langkah-Langkah Praktikum
                </h3>

                <div className="space-y-4">
                  {currentModule.lab.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 bg-white dark:bg-zinc-900/90 space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold shrink-0">
                          {step.stepNumber}
                        </span>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5">
                          {step.instruction}
                        </p>
                      </div>

                      {step.code && (
                        <div className="pt-1 pb-1 pl-0 sm:pl-9">
                          <VsCodeSnippet
                            code={step.code}
                            language={step.language}
                          />
                        </div>
                      )}

                      {step.explanation && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 italic pl-9">
                          💡 Catatan: {step.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Prompt Formula Box (VS Code Style) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                      Formula Prompt AI Teruji
                    </h4>
                  </div>
                  <span className="text-xs text-zinc-500 hidden sm:inline">Format Editor Prompt VS Code</span>
                </div>

                {/* Panduan Alur Kerja AI Tool */}
                {currentModule.id === 1 && (
                  <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/30 text-xs space-y-2.5">
                    <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Petunjuk Eksekusi Berdasarkan Jenis AI Assistant Anda:</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-0.5">
                      <div className="p-3 rounded-lg bg-white/90 dark:bg-zinc-900/80 border border-indigo-100 dark:border-zinc-800 space-y-1 shadow-2xs">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 text-xs">
                          <span>🤖</span> Jika Menggunakan AI Agent (Antigravity / Cursor)
                        </span>
                        <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-[11px]">
                          Prompt ini dirancang <strong>All-in-One</strong>. Jika dijalankan di folder proyek kosong, AI Agent akan otomatis mendeteksi dan mengeksekusi instalasi Next.js 16 via CLI terminal, lalu langsung melengkapi berkas <code className="font-mono text-indigo-600 dark:text-indigo-400">.gitignore</code>, <code className="font-mono text-indigo-600 dark:text-indigo-400">.env.example</code>, dan <code className="font-mono text-indigo-600 dark:text-indigo-400">README.md</code>.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-white/90 dark:bg-zinc-900/80 border border-indigo-100 dark:border-zinc-800 space-y-1 shadow-2xs">
                        <span className="font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5 text-xs">
                          <span>💬</span> Jika Menggunakan AI Chat (OpenCode / ChatGPT)
                        </span>
                        <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-[11px]">
                          Jalankan terlebih dahulu perintah terminal di <strong>Langkah 2 Lab</strong> (<code className="font-mono text-zinc-800 dark:text-zinc-200">npx create-next-app@latest</code>) untuk mengunduh engine Next.js. Setelah proyek terpasang, salin respons 3 berkas dari prompt ini ke dalam proyek Anda.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <VsCodePrompt
                  role={currentModule.lab.aiPromptTemplate.role}
                  prompt={currentModule.lab.aiPromptTemplate.prompt}
                  tip={currentModule.lab.aiPromptTemplate.tip}
                />
              </div>

              {/* Bottom Flow CTA: Proceed to Mission */}
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <div className="p-5 md:p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/80 dark:from-zinc-900 dark:via-zinc-900 dark:to-emerald-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      Langkah Selanjutnya
                    </span>
                    <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                      Kunci &amp; Kode Lab Sudah Teruji?
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Terapkan hasil kode langsung ke repositori proyek akhir Anda pada branch mingguan.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleTabChange("mission")}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-5 rounded-xl shrink-0 shadow-sm cursor-pointer"
                  >
                    <span>Lanjut ke Misi Proyek</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: MISI PROYEK AKHIR (BOLA SALJU) */}
          {activeTab === "mission" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Mission Briefing Hero Card */}
              <div className="relative overflow-hidden rounded-2xl border border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/30 dark:from-zinc-900 dark:via-zinc-900/90 dark:to-indigo-950/30 p-6 md:p-8 space-y-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Target className="w-5 h-5" />
                    </span>
                    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs font-semibold">
                      Target Capaian Mingguan
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs border-indigo-500/30 text-indigo-700 dark:text-indigo-300 bg-indigo-500/5 px-3 py-1 font-semibold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Reward: +{currentModule.xp} XP
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                    {currentModule.mission.taskTitle}
                  </h3>
                  <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-3xl">
                    {currentModule.mission.taskDesc}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 text-xs text-indigo-800 dark:text-indigo-300 font-medium">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span>
                    Metode Bola Salju: Dikerjakan langsung pada repositori proyek akhir Anda (tanpa membuat repositori baru).
                  </span>
                </div>
              </div>

              {/* Git Branch & Merge Workflow Guide */}
              {(() => {
                const branchName = currentModule.mission.gitBranchTask.replace("git checkout -b ", "").trim();
                return (
                  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-5 md:p-6 space-y-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                      <div>
                        <h4 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-indigo-500" />
                          Alur Kerja Git Branch & Penggabungan (*Merge*)
                        </h4>
                        <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                          Standar industri: pisahkan fitur mingguan ke branch terpisah agar cabang <code>main</code> selalu aman dan stabil.
                        </p>
                      </div>

                      {/* Merge Mode Toggle */}
                      <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl shrink-0 self-start sm:self-auto border border-zinc-200/60 dark:border-zinc-700/60">
                        <button
                          type="button"
                          onClick={() => setMergeStrategy("terminal")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            mergeStrategy === "terminal"
                              ? "bg-indigo-600 text-white shadow-xs"
                              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                          }`}
                        >
                          <GitMerge className="w-3.5 h-3.5" />
                          Opsi 1: Terminal Merge
                        </button>
                        <button
                          type="button"
                          onClick={() => setMergeStrategy("pr")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            mergeStrategy === "pr"
                              ? "bg-indigo-600 text-white shadow-xs"
                              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                          }`}
                        >
                          <GitPullRequest className="w-3.5 h-3.5" />
                          Opsi 2: GitHub PR
                        </button>
                      </div>
                    </div>

                    {/* 4 Steps Grid with Improved Readability */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Step 1: Create Branch */}
                      <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 space-y-3 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-white text-[11px] font-bold">1</span>
                            <span className="font-bold text-sm text-zinc-900 dark:text-white">Buat & Masuk ke Branch Fitur</span>
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-7">
                            Isolasi pengerjaan misi minggu ini ke dalam cabang baru agar branch <code>main</code> tidak rusak.
                          </p>
                        </div>

                        <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-xs">
                          <div className="flex items-center justify-between px-3 py-1 bg-zinc-900/90 border-b border-zinc-800 text-[10px] text-zinc-400 font-mono">
                            <span className="flex items-center gap-1.5 text-[#4ec9b0]">
                              <Terminal className="w-3 h-3" />
                              terminal
                            </span>
                            <CopyButton text={currentModule.mission.gitBranchTask} />
                          </div>
                          <pre className="p-3 text-xs font-mono text-zinc-200 overflow-x-auto">
                            <code>{currentModule.mission.gitBranchTask}</code>
                          </pre>
                        </div>
                      </div>

                      {/* Step 2: Commit */}
                      <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 space-y-3 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-white text-[11px] font-bold">2</span>
                            <span className="font-bold text-sm text-zinc-900 dark:text-white">Kerjakan & Simpan (*Commit*)</span>
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-7">
                            Setelah fitur berfungsi dan teruji, buat snapshot riwayat pekerjaan Anda.
                          </p>
                        </div>

                        <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-xs">
                          <div className="flex items-center justify-between px-3 py-1 bg-zinc-900/90 border-b border-zinc-800 text-[10px] text-zinc-400 font-mono">
                            <span className="flex items-center gap-1.5 text-[#4ec9b0]">
                              <Terminal className="w-3 h-3" />
                              terminal
                            </span>
                            <CopyButton text={`git add .\ngit commit -m "feat: complete week ${currentModule.weekNumber} mission"`} />
                          </div>
                          <pre className="p-3 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
                            <code>{`git add .\ngit commit -m "feat: complete week ${currentModule.weekNumber} mission"`}</code>
                          </pre>
                        </div>
                      </div>

                      {/* Step 3: Merge */}
                      <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 space-y-3 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-[11px] font-bold">3</span>
                            <span className="font-bold text-sm text-zinc-900 dark:text-white">
                              {mergeStrategy === "terminal" ? "Gabungkan ke Main (Terminal)" : "Merge via GitHub Pull Request"}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-7">
                            {mergeStrategy === "terminal"
                              ? "Beralih ke cabang main, lalu tarik perubahan dari branch fitur."
                              : "Push branch ke GitHub, buat Pull Request, lalu lakukan konfirmasi merge di web."}
                          </p>
                        </div>

                        <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-xs">
                          <div className="flex items-center justify-between px-3 py-1 bg-zinc-900/90 border-b border-zinc-800 text-[10px] text-zinc-400 font-mono">
                            <span className="flex items-center gap-1.5 text-emerald-400">
                              <Terminal className="w-3 h-3" />
                              terminal
                            </span>
                            <CopyButton
                              text={
                                mergeStrategy === "terminal"
                                  ? `git checkout main\ngit merge ${branchName}\ngit push origin main`
                                  : `git push -u origin ${branchName}\n# Buka GitHub repo & klik 'Compare & pull request'\ngit checkout main && git pull`
                              }
                            />
                          </div>
                          <pre className="p-3 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
                            <code>
                              {mergeStrategy === "terminal"
                                ? `git checkout main\ngit merge ${branchName}\ngit push origin main`
                                : `git push -u origin ${branchName}\n# Buka GitHub & merge PR\ngit checkout main && git pull`}
                            </code>
                          </pre>
                        </div>
                      </div>

                      {/* Step 4: Cleanup */}
                      <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 space-y-3 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold">4</span>
                            <span className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                              Bersihkan Branch Fitur (*Housekeeping*)
                            </span>
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-7">
                            Hapus branch fitur yang sudah selesai di-merge agar repositori tetap rapi.
                          </p>
                        </div>

                        <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-xs">
                          <div className="flex items-center justify-between px-3 py-1 bg-zinc-900/90 border-b border-zinc-800 text-[10px] text-zinc-400 font-mono">
                            <span className="flex items-center gap-1.5 text-rose-400">
                              <Terminal className="w-3 h-3" />
                              terminal
                            </span>
                            <CopyButton
                              text={
                                mergeStrategy === "terminal"
                                  ? `git branch -d ${branchName}`
                                  : `git branch -d ${branchName}\ngit push origin --delete ${branchName}`
                              }
                            />
                          </div>
                          <pre className="p-3 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
                            <code>
                              {mergeStrategy === "terminal"
                                ? `git branch -d ${branchName}`
                                : `git branch -d ${branchName}\ngit push origin --delete ${branchName}`}
                            </code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Definition of Done (Checklist Mandiri & Quest Tracker) */}
              {(() => {
                const totalDod = currentModule.mission.definitionOfDone.length;
                const completedDodCount = currentModule.mission.definitionOfDone.filter(
                  (_, idx) => !!completedTasks[`${currentModule.id}-${idx}`]
                ).length;
                const dodProgress = totalDod > 0 ? Math.round((completedDodCount / totalDod) * 100) : 0;
                const isAllCompleted = totalDod > 0 && completedDodCount === totalDod;

                return (
                  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-5 md:p-6 space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                      <div>
                        <h4 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          Kriteria Selesai (*Definition of Done*)
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          Centang setiap kriteria setelah Anda memverifikasinya di aplikasi lokal.
                        </p>
                      </div>

                      {/* Progress Counter Badge */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          {completedDodCount} dari {totalDod} Kriteria ({dodProgress}%)
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${dodProgress}%` }}
                      />
                    </div>

                    {/* All Completed Banner */}
                    {isAllCompleted && (
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs md:text-sm font-semibold animate-in fade-in duration-300">
                        <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>
                          🎉 Hebat! Seluruh kriteria misi minggu ini telah terpenuhi. Siap untuk di-merge ke main dan dilaporkan!
                        </span>
                      </div>
                    )}

                    {/* Interactive Checklist Cards */}
                    <div className="space-y-2.5 pt-1">
                      {currentModule.mission.definitionOfDone.map((dod, idx) => {
                        const isChecked = !!completedTasks[`${currentModule.id}-${idx}`];
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleTask(idx)}
                            className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                              isChecked
                                ? "bg-emerald-500/10 border-emerald-500/30 text-zinc-900 dark:text-white shadow-xs"
                                : "bg-zinc-50/60 dark:bg-zinc-950/40 border-zinc-200/80 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${
                                isChecked
                                  ? "bg-emerald-500 border-emerald-500 text-white shadow-xs scale-105"
                                  : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
                              }`}
                            >
                              {isChecked && <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />}
                            </div>
                            <div className="space-y-0.5 flex-1">
                              <span
                                className={`text-xs md:text-sm leading-relaxed transition-all duration-200 ${
                                  isChecked
                                    ? "line-through text-zinc-500 dark:text-zinc-400 font-normal"
                                    : "font-medium text-zinc-900 dark:text-zinc-100"
                                }`}
                              >
                                {dod}
                              </span>
                            </div>
                            {isChecked && (
                              <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px] font-semibold">
                                Selesai
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* Footer Navigation (Previous / Next Week) */}
          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
            {prevModule ? (
              <Link href={`/modules/${prevModule.id}`}>
                <Button variant="outline" className="gap-2 border-zinc-200 dark:border-zinc-800">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Minggu {prevModule.weekNumber}:</span> {prevModule.title.split(":")[0]}
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {nextModule ? (
              <Link href={`/modules/${nextModule.id}`}>
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                  <span className="hidden sm:inline">Minggu {nextModule.weekNumber}:</span> {nextModule.title.split(":")[0]}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/">
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                  Selesai & Kembali ke Quest Map
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
