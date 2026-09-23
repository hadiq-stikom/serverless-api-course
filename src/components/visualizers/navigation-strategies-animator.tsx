"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Navigation, 
  Zap, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  Server, 
  Laptop, 
  Globe,
  Sliders,
  Filter,
  ShieldCheck,
  Code2,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type NavStrategy = "link" | "router" | "redirect";

export function NavigationStrategiesAnimator() {
  const [strategy, setStrategy] = useState<NavStrategy>("link");
  const [projectId, setProjectId] = useState<string>("odyssey-core");
  const [statusFilter, setStatusFilter] = useState<string>("in_progress");
  const [sortOrder, setSortOrder] = useState<string>("priority");
  const [viewTab, setViewTab] = useState<string>("tasks");
  const [isNavigating, setIsNavigating] = useState(false);
  const [executionStep, setExecutionStep] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>("Pilih parameter di atas lalu uji jalankan navigasi.");

  // Target Dynamic URL computed from parameters
  const computedUrl = `/projects/${projectId}/${viewTab}?status=${statusFilter}&sort=${sortOrder}`;

  const triggerNavigation = (strat: NavStrategy) => {
    setStrategy(strat);
    setIsNavigating(true);
    setExecutionStep(1);

    if (strat === "link") {
      setStatusMessage("Langkah 1: Tautan <Link> memasuki viewport. Next.js otomatis mem-prefetch RSC payload target di background...");
      setTimeout(() => {
        setExecutionStep(2);
        setStatusMessage("Langkah 2: Pengguna mengklik tautan. Halaman bertransisi instan (~0ms) dari cache tanpa full page reload!");
        setIsNavigating(false);
      }, 900);
    } else if (strat === "router") {
      setStatusMessage("Langkah 1: Event trigger non-link (misal dropdown filter). URLSearchParams mengompilasi query string baru...");
      setTimeout(() => {
        setExecutionStep(2);
        setStatusMessage(`Langkah 2: router.push('${computedUrl}', { scroll: false }) memperbarui rute & searchParams di memori klien dalam 35ms.`);
        setIsNavigating(false);
      }, 1000);
    } else {
      setStatusMessage("Langkah 1: Server Action memproses mutasi atau Server Component mengecek sesi auth...");
      setTimeout(() => {
        setExecutionStep(2);
        setStatusMessage(`Langkah 2: Server mengirim header HTTP 307 Temporary Redirect ke '${computedUrl}' sebelum HTML dirender.`);
        setIsNavigating(false);
      }, 1200);
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Navigation className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator 3 Strategi Navigasi &amp; Pengiriman Params/Query
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Uji transmisi Route Parameters (<code className="text-indigo-600 dark:text-indigo-400">[id]</code>) &amp; Query Strings (<code className="text-indigo-600 dark:text-indigo-400">?status=...&amp;sort=...</code>) pada &lt;Link&gt;, useRouter(), dan redirect().
          </p>
        </div>

        {/* Strategy Switcher */}
        <div className="flex flex-wrap items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700/60 shrink-0">
          <button
            type="button"
            onClick={() => { setStrategy("link"); setExecutionStep(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              strategy === "link" ? "bg-indigo-600 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            1. &lt;Link&gt; (Deklaratif)
          </button>
          <button
            type="button"
            onClick={() => { setStrategy("router"); setExecutionStep(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              strategy === "router" ? "bg-indigo-600 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            2. useRouter() (Client)
          </button>
          <button
            type="button"
            onClick={() => { setStrategy("redirect"); setExecutionStep(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              strategy === "redirect" ? "bg-indigo-600 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            3. redirect() (Server)
          </button>
        </div>
      </div>

      {/* Interactive Parameter & Query Builder Bar */}
      <div className="p-4 rounded-xl border border-indigo-200/80 dark:border-indigo-900/50 bg-white/90 dark:bg-zinc-900/80 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-800 dark:text-zinc-200">
            <Sliders className="w-3.5 h-3.5 text-indigo-500" />
            <span>Interactive URL &amp; Query Builder (Ubah Nilai Parameter):</span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">Next.js 16 Route Resolver</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Route Param: projectId */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              Route Param ([id]):
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-xs focus:ring-2 focus:ring-indigo-500"
            >
              <option value="odyssey-core">odyssey-core</option>
              <option value="alpha-lab">alpha-lab</option>
              <option value="phoenix-db">phoenix-db</option>
            </select>
          </div>

          {/* Subview Segmen */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              Segmen Rute:
            </label>
            <select
              value={viewTab}
              onChange={(e) => setViewTab(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-xs focus:ring-2 focus:ring-indigo-500"
            >
              <option value="tasks">tasks</option>
              <option value="members">members</option>
              <option value="settings">settings</option>
            </select>
          </div>

          {/* Query Param: status */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              Query (?status=):
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-xs focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">all</option>
              <option value="in_progress">in_progress</option>
              <option value="completed">completed</option>
            </select>
          </div>

          {/* Query Param: sort */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              Query (&amp;sort=):
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-xs focus:ring-2 focus:ring-indigo-500"
            >
              <option value="newest">newest</option>
              <option value="priority">priority</option>
              <option value="deadline">deadline</option>
            </select>
          </div>
        </div>

        {/* Dynamic Computed URL Display */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
          <span className="font-semibold text-zinc-500 shrink-0">Target URL Terbentuk:</span>
          <div className="flex-1 font-mono text-xs px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-bold truncate border border-zinc-200/60 dark:border-zinc-700/60">
            {computedUrl}
          </div>
          <Button
            size="sm"
            onClick={() => triggerNavigation(strategy)}
            disabled={isNavigating}
            className="h-8 gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            Uji Jalankan Navigasi
          </Button>
        </div>
      </div>

      {/* Main Grid: Code Display vs Interactive Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Reactive Code Snippet */}
        <div className="lg:col-span-7 rounded-xl border border-zinc-800 bg-[#1e1e1e] text-zinc-100 p-4 font-mono text-xs space-y-3 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
            <span className="flex items-center gap-1.5 font-sans font-medium">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              Sintaks Pengiriman &amp; Pembacaan
            </span>
            <Badge className="bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
              {strategy === "link"
                ? "Deklaratif & Auto-Prefetch"
                : strategy === "router"
                ? "Client Event-Driven"
                : "Server Auth & Action PRG"}
            </Badge>
          </div>

          <pre className="text-[11px] leading-relaxed overflow-x-auto text-zinc-300">
            {strategy === "link" && (
`// ⚡ STRATEGI 1: <Link> DEKLARATIF (Rekomendasi 90% Tautan UI)
import Link from "next/link";

export function ProjectNav() {
  return (
    <div className="flex gap-4">
      {/* FORMAT A: Template Literals (String Interpolation) */}
      <Link href="${computedUrl}">
        Buka Tugas (String Literal)
      </Link>

      {/* FORMAT B: URL Object (Lebih Terstruktur & Type-Safe) */}
      <Link
        href={{
          pathname: "/projects/${projectId}/${viewTab}",
          query: { status: "${statusFilter}", sort: "${sortOrder}" },
        }}
      >
        Buka Tugas (URL Object)
      </Link>
    </div>
  );
}

// 📥 PEMBACAAN DI SERVER COMPONENT (src/app/projects/[id]/[view]/page.tsx)
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; view: string }>;
  searchParams: Promise<{ status?: string; sort?: string }>;
}) {
  // Breaking Change Next.js 16: WAJIB await params & searchParams!
  const { id, view } = await params;
  const { status, sort } = await searchParams;
  // Hasil: id="${projectId}", view="${viewTab}", status="${statusFilter}", sort="${sortOrder}"
}`
            )}

            {strategy === "router" && (
`// 🚀 STRATEGI 2: useRouter() IMPERATIF (Khusus Client Component)
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function FilterControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Pertahankan query yang ada saat memperbarui filter tertentu
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);

    // Navigasi programatik tanpa melompat ke atas halaman ({ scroll: false })
    router.push(\`\${pathname}?\${params.toString()}\`, { scroll: false });
  };

  return (
    <button onClick={() => updateFilter("status", "${statusFilter}")}>
      Terapkan Filter Status: ${statusFilter}
    </button>
  );
}

// ⚠️ CATATAN: Komponen yang memakai useSearchParams() WAJIB
// dibungkus komponen <Suspense> pada Server Page pembungkusnya!`
            )}

            {strategy === "redirect" && (
`// 🔒 STRATEGI 3: redirect() SERVER-SIDE (Server Actions / Server Components)
import { redirect } from "next/navigation";

// SKENARIO A: Auth Guard di Server Component (page.tsx)
export default async function ProtectedTasksPage() {
  const session = await getAuthSession();
  if (!session) {
    // Kirim HTTP 307 sebelum HTML apapun dikirim ke klien
    redirect("/login?callbackUrl=" + encodeURIComponent("${computedUrl}"));
  }
}

// SKENARIO B: Pola Post-Redirect-Get (PRG) di Server Action ('use server')
export async function updateTaskStatusAction(formData: FormData) {
  "use server";
  // 1. Eksekusi mutasi basis data Supabase...
  // await supabase.from('tasks').update(...);

  // 2. Redirect server-side dengan query notifikasi toast
  redirect("${computedUrl}&toast=updated_success");
}`
            )}
          </pre>
        </div>

        {/* Right: Simulation Monitor & Workflow Tracer */}
        <div className="lg:col-span-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Tracer Alur Eksekusi &amp; Siklus Komputasi
              </span>
              <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                {isNavigating ? "⏳ Memproses..." : executionStep > 0 ? "✅ Selesai" : "IDLE"}
              </span>
            </div>

            {/* Stepper Progress Visualizer */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  executionStep >= 1 ? "bg-indigo-600 text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                }`}>
                  1
                </span>
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  {strategy === "link"
                    ? "Inisiasi Viewport Prefetch"
                    : strategy === "router"
                    ? "Pemicu Event & Query Build"
                    : "Evaluasi Guard / Mutasi Server"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  executionStep >= 2 ? "bg-emerald-600 text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                }`}>
                  2
                </span>
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  {strategy === "link"
                    ? "Transisi SPA Instan (~0ms)"
                    : strategy === "router"
                    ? "Client History Push & Re-render"
                    : "Emisi HTTP 307 / 303 Redirect"}
                </span>
              </div>
            </div>

            {/* Status Message Box */}
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {statusMessage}
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 space-y-0.5">
                <div className="text-[10px] text-zinc-400">Prefetching Viewport:</div>
                <div className="font-bold text-zinc-900 dark:text-white">
                  {strategy === "link" ? "✅ Aktif Otomatis" : strategy === "router" ? "⚠️ Manual (router.prefetch)" : "❌ Tidak Relevan"}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 space-y-0.5">
                <div className="text-[10px] text-zinc-400">Estimasi Latensi:</div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">
                  {strategy === "link" ? "⚡ ~0ms (Instant Cache)" : strategy === "router" ? "🚀 ~30-40ms (Client)" : "🔒 1x Round-Trip (Server)"}
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            {strategy === "link" && "💡 Tips: Gunakan selalu <Link> untuk navigasi menu, kartu, dan link umum agar bot search engine (SEO) dapat mengindeks rute."}
            {strategy === "router" && "💡 Tips: Selalu gunakan { scroll: false } saat memperbarui query filter agar layar pengguna tidak terlempar ke puncak halaman."}
            {strategy === "redirect" && "💡 Tips: Jangan pernah membungkus redirect() di dalam try/catch tanpa re-throw karena Next.js melempar exception NEXT_REDIRECT internal."}
          </div>
        </div>
      </div>

      {/* Comprehensive Use Case Comparison Matrix Card */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 space-y-3">
        <h5 className="font-bold text-xs md:text-sm text-zinc-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Panduan Matriks Use Case: Kapan Wajib Menggunakan Masing-Masing?
        </h5>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px] md:text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold">
                <th className="py-2 pr-3">Kriteria</th>
                <th className="py-2 px-3 text-indigo-600 dark:text-indigo-400">&lt;Link&gt;</th>
                <th className="py-2 px-3 text-amber-600 dark:text-amber-400">useRouter()</th>
                <th className="py-2 pl-3 text-purple-600 dark:text-purple-400">redirect()</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-zinc-700 dark:text-zinc-300">
              <tr>
                <td className="py-2 pr-3 font-semibold text-zinc-900 dark:text-zinc-100">Lingkungan Kode</td>
                <td className="py-2 px-3">Server &amp; Client JSX</td>
                <td className="py-2 px-3"><code className="text-amber-600 dark:text-amber-400">'use client'</code> saja</td>
                <td className="py-2 pl-3">Server Component &amp; Actions</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 font-semibold text-zinc-900 dark:text-zinc-100">Transmisi Query</td>
                <td className="py-2 px-3">Template string &amp; URL Object</td>
                <td className="py-2 px-3"><code>new URLSearchParams()</code></td>
                <td className="py-2 pl-3">String URL target langsung</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 font-semibold text-zinc-900 dark:text-zinc-100">Kepatuhan SEO</td>
                <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-bold">100% (HTML &lt;a&gt;)</td>
                <td className="py-2 px-3 text-zinc-400">Rendah (Event JS)</td>
                <td className="py-2 pl-3 text-emerald-600 dark:text-emerald-400 font-bold">Tinggi (HTTP 307/303)</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 font-semibold text-zinc-900 dark:text-zinc-100">Skenario Wajib</td>
                <td className="py-2 px-3">Navbar, Sidebar, Card click, Tombol detail</td>
                <td className="py-2 px-3">Dropdown filter, Search debounce, Wizard form</td>
                <td className="py-2 pl-3">Auth guards, Post-Redirect-Get pasca mutasi form</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
