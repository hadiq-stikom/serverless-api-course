"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Navigation, 
  Zap, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  Server, 
  Laptop, 
  Globe 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type NavStrategy = "link" | "router" | "redirect";

export function NavigationStrategiesAnimator() {
  const [strategy, setStrategy] = useState<NavStrategy>("link");
  const [isNavigating, setIsNavigating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("Siap untuk pengujian navigasi.");

  const testNavigation = (strat: NavStrategy) => {
    setStrategy(strat);
    setIsNavigating(true);

    if (strat === "link") {
      setStatusMessage("1. Viewport Prefetch: Payload rute sudah diunduh di background...");
      setTimeout(() => {
        setStatusMessage("2. Pengguna Mengklik: Halaman berganti INSTAN (0ms delay)!");
        setIsNavigating(false);
      }, 700);
    } else if (strat === "router") {
      setStatusMessage("1. Event Trigger: Button onClick memanggil router.push('/dashboard')...");
      setTimeout(() => {
        setStatusMessage("2. Client Transition: Transisi SPA selesai dalam 45ms.");
        setIsNavigating(false);
      }, 1200);
    } else {
      setStatusMessage("1. Server Action: Cek sesi auth di server...");
      setTimeout(() => {
        setStatusMessage("2. HTTP Response: Mengirim header HTTP 307 Temporary Redirect ke /login.");
        setIsNavigating(false);
      }, 1500);
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Navigation className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator 3 Strategi Navigasi Next.js 16
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Bandingkan performa prefetching &lt;Link&gt; vs useRouter() imperatif vs redirect() di sisi server.
          </p>
        </div>

        {/* Strategy Switcher */}
        <div className="flex flex-wrap items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700/60">
          <button
            type="button"
            onClick={() => testNavigation("link")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              strategy === "link" ? "bg-indigo-600 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            1. &lt;Link&gt; (Deklaratif)
          </button>
          <button
            type="button"
            onClick={() => testNavigation("router")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              strategy === "router" ? "bg-indigo-600 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            2. useRouter() (Client)
          </button>
          <button
            type="button"
            onClick={() => testNavigation("redirect")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              strategy === "redirect" ? "bg-indigo-600 text-white shadow-xs" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            3. redirect() (Server)
          </button>
        </div>
      </div>

      {/* Benchmarking Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Code Snippet & Environment */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
            <span>Implementasi Kode</span>
            <Badge className="bg-indigo-500/20 text-indigo-300">
              {strategy === "link" ? "Server & Client JSX" : strategy === "router" ? "'use client' Only" : "Server Component / Action"}
            </Badge>
          </div>

          <pre className="text-[11px] leading-relaxed">
            {strategy === "link" && (
`// ⚡ Rekomendasi Utama untuk Navigasi UI
import Link from "next/link";

export function Navbar() {
  return (
    <Link href="/tasks">
      {/* Otomatis prefetch saat Link masuk viewport! */}
      Buka Daftar Tugas
    </Link>
  );
}`
            )}
            {strategy === "router" && (
`// 🚀 Navigasi Programatik Berbasis Event
"use client";
import { useRouter } from "next/navigation";

export function SubmitButton() {
  const router = useRouter();
  const handleSubmit = async () => {
    await savePost();
    router.push("/dashboard"); // Pindah rute
  };
  return <button onClick={handleSubmit}>Simpan</button>;
}`
            )}
            {strategy === "redirect" && (
`// 🔒 Server-Side Guard & Auth Protection
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function ProtectedPage() {
  const user = await getSession();
  if (!user) {
    // Mengirim HTTP 307 sebelum HTML apapun dikirim
    redirect("/login");
  }
  return <h1>Rahasia</h1>;
}`
            )}
          </pre>
        </div>

        {/* Right: Simulation Monitor */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span>Monitor Alur Eksekusi &amp; Latensi</span>
            <Button
              size="sm"
              onClick={() => testNavigation(strategy)}
              disabled={isNavigating}
              className="text-xs h-7 gap-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Play className="w-3 h-3" />
              Uji Navigasi
            </Button>
          </div>

          {/* Interactive Status Card */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-600 dark:text-zinc-400">Status Alur:</span>
              <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                {isNavigating ? "⏳ Memproses..." : "✅ Selesai"}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 text-xs font-medium text-zinc-800 dark:text-zinc-200">
              {statusMessage}
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 space-y-0.5">
                <div className="text-[10px] text-zinc-400">Prefetching Background:</div>
                <div className="font-bold text-zinc-900 dark:text-white">
                  {strategy === "link" ? "✅ Aktif Otomatis" : "❌ Tidak Tersedia"}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 space-y-0.5">
                <div className="text-[10px] text-zinc-400">Perkiraan Waktu Respons:</div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">
                  {strategy === "link" ? "⚡ ~0ms (Instant Cache)" : strategy === "router" ? "🚀 ~30-50ms" : "🔒 Server RTT"}
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <span>Rekomendasi: Gunakan <code>&lt;Link&gt;</code> untuk 90% navigasi tautan Anda.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
