"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  UserX, 
  ArrowRight, 
  Lock, 
  Unlock, 
  LayoutDashboard, 
  LogIn, 
  Home, 
  Settings,
  CornerDownRight,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function RouteProtectionMatrixAnimator() {
  const [userState, setUserState] = useState<"guest" | "authenticated">("guest");
  const [targetRoute, setTargetRoute] = useState<string>("/dashboard");

  // Route definitions
  const routes = [
    { path: "/", category: "public", title: "Landing Page (/)", icon: Home },
    { path: "/login", category: "auth", title: "Halaman Login (/login)", icon: LogIn },
    { path: "/dashboard", category: "protected", title: "Dashboard Utama (/dashboard)", icon: LayoutDashboard },
    { path: "/dashboard/settings", category: "protected", title: "Pengaturan Akun (/dashboard/settings)", icon: Settings }
  ];

  // Logic calculation
  const getOutcome = (path: string, auth: "guest" | "authenticated") => {
    if (path === "/") {
      return {
        status: 200,
        action: "IZINKAN AKSES (200 OK)",
        redirectTarget: null,
        desc: "Rute publik terbuka untuk semua orang, baik tamu maupun pengguna yang telah login.",
        isRedirect: false,
        color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
      };
    }

    if (path === "/login") {
      if (auth === "guest") {
        return {
          status: 200,
          action: "IZINKAN AKSES (200 OK)",
          redirectTarget: null,
          desc: "Tamu diizinkan mengakses form login untuk mengotentikasi kredensial mereka.",
          isRedirect: false,
          color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
        };
      } else {
        return {
          status: 307,
          action: "REDIRECT OTOMATIS (307 TEMPORARY REDIRECT)",
          redirectTarget: "/dashboard",
          desc: "Pengguna yang sudah login dilarang melihat halaman login lagi. Middleware otomatis mengarahkan ke dashboard aplikasi.",
          isRedirect: true,
          color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30"
        };
      }
    }

    // Protected routes
    if (auth === "guest") {
      return {
        status: 307,
        action: "TENDANG KE LOGIN (307 REDIRECT)",
        redirectTarget: `/login?next=${encodeURIComponent(path)}`,
        desc: "Middleware mendeteksi user belum memiliki sesi valid. Akses rute privat diblokir dan dialihkan ke login beserta query parameter 'next' untuk redirect kembali setelah sukses login.",
        isRedirect: true,
        color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30"
      };
    } else {
      return {
        status: 200,
        action: "IZINKAN AKSES PRIVAT (200 OK)",
        redirectTarget: null,
        desc: "Sesi valid terverifikasi oleh auth.getUser(). Komponen Server Component dirender dengan isolasi hak akses data user tersebut.",
        isRedirect: false,
        color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
      };
    }
  };

  const outcome = getOutcome(targetRoute, userState);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-semibold">
              Pilar 2.3: Matriks Hak Akses
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Route Guard Controller</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulator Matriks Hak Akses Rute: Tamu vs User Terotentikasi
          </h4>
        </div>

        {/* User State Selector */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setUserState("guest")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              userState === "guest"
                ? "bg-zinc-700 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <UserX className="w-3.5 h-3.5 text-rose-400" />
            Tamu (Belum Login)
          </button>
          <button
            type="button"
            onClick={() => setUserState("authenticated")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              userState === "authenticated"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-white" />
            User Terotentikasi
          </button>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
        Pilih rute tujuan di bawah untuk melihat bagaimana Middleware Next.js secara cerdas menentukan apakah permintaan harus diteruskan (200 OK) atau ditendang (*redirect* 307) sesuai status login aktif pengguna.
      </p>

      {/* Target Route Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {routes.map((r) => {
          const Icon = r.icon;
          const isActive = targetRoute === r.path;
          return (
            <button
              key={r.path}
              type="button"
              onClick={() => setTargetRoute(r.path)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20 shadow-sm"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-500" : "text-zinc-400"}`} />
                <span className={`text-[10px] font-mono px-1 rounded uppercase ${
                  r.category === "public" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                  r.category === "auth" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400" :
                  "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold"
                }`}>
                  {r.category}
                </span>
              </div>
              <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{r.title}</div>
              <div className="text-[11px] font-mono text-zinc-500 mt-0.5">{r.path}</div>
            </button>
          );
        })}
      </div>

      {/* Outcome Simulator Card */}
      <div className={`p-5 rounded-xl border transition-all ${outcome.color} space-y-3`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-current/20">
          <div className="flex items-center gap-2 font-bold text-sm">
            {outcome.isRedirect ? (
              <CornerDownRight className="w-5 h-5 text-current" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-current" />
            )}
            <span>{outcome.action}</span>
          </div>

          <div className="font-mono text-xs font-bold">
            HTTP STATUS {outcome.status}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {outcome.desc}
        </p>

        {outcome.redirectTarget && (
          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-white space-y-1">
            <span className="text-zinc-500 text-[10px]">Tujuan Redirect Browser:</span>
            <div className="text-amber-400 font-bold flex items-center gap-1.5">
              <span>NextResponse.redirect(new URL(&quot;{outcome.redirectTarget}&quot;, request.url))</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
