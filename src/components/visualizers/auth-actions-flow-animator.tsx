"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  LogIn, 
  UserPlus, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle, 
  Cookie, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  Code
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AuthActionsFlowAnimator() {
  const [selectedAction, setSelectedAction] = useState<"login" | "signup" | "logout">("login");
  const [simulationState, setSimulationState] = useState<"idle" | "running" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const triggerSimulation = (simType: "valid" | "invalid") => {
    setSimulationState("running");
    setTimeout(() => {
      if (simType === "valid") {
        setSimulationState("success");
      } else {
        setSimulationState("error");
        setErrorMessage(
          selectedAction === "login" 
            ? "Invalid login credentials (Email atau kata sandi salah)"
            : selectedAction === "signup"
            ? "Password minimal 8 karakter dan harus mengandung angka"
            : "Gagal menghapus sesi auth"
        );
      }
    }, 600);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
              Pilar 3.2: Mutasi Server
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">src/actions/auth.ts</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulator Alur Auth Server Actions (&apos;use server&apos;): Login, Signup &amp; Logout
          </h4>
        </div>

        {/* Action Picker */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => { setSelectedAction("login"); setSimulationState("idle"); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedAction === "login"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Login
          </button>
          <button
            type="button"
            onClick={() => { setSelectedAction("signup"); setSimulationState("idle"); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedAction === "signup"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => { setSelectedAction("logout"); setSimulationState("idle"); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedAction === "logout"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
        Server Actions memungkinkan antarmuka formulir mengeksekusi operasi autentikasi secara type-safe di server, mengolah cookie HTTP-Only, dan mengembalikan status terstruktur <code className="font-mono text-xs">ActionState&lt;T&gt;</code> ke hook <code className="font-mono text-xs">useActionState</code>.
      </p>

      {/* Action Pipeline Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1">
          <div className="text-[10px] text-zinc-400 font-mono">1. VALIDASI INPUT</div>
          <div className="font-bold text-zinc-900 dark:text-zinc-100">Zod safeParse(data)</div>
          <p className="text-[11px] text-zinc-500">
            {selectedAction === "logout" ? "Tidak memerlukan input form" : "Cek format email & panjang password minimum"}
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1">
          <div className="text-[10px] text-zinc-400 font-mono">2. SUPABASE SDK</div>
          <div className="font-bold text-zinc-900 dark:text-zinc-100">
            {selectedAction === "login" ? "signInWithPassword()" : selectedAction === "signup" ? "signUp()" : "signOut()"}
          </div>
          <p className="text-[11px] text-zinc-500">
            Koneksi TLS aman ke auth gateway Supabase
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1">
          <div className="text-[10px] text-zinc-400 font-mono">3. COOKIE MUTATION</div>
          <div className="font-bold text-zinc-900 dark:text-zinc-100">setAll() / clear</div>
          <p className="text-[11px] text-zinc-500">
            {selectedAction === "logout" ? "Pembersihan total cookie sesi" : "Set cookie HTTP-Only sb-access-token"}
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1">
          <div className="text-[10px] text-zinc-400 font-mono">4. POST-AUTH</div>
          <div className="font-bold text-zinc-900 dark:text-zinc-100">revalidatePath &amp; redirect</div>
          <p className="text-[11px] text-zinc-500">
            {selectedAction === "logout" ? "Redirect ke /login" : "Redirect ke /dashboard"}
          </p>
        </div>
      </div>

      {/* Simulator Execution Controls */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
            Uji Eksekusi Server Action: {selectedAction === "login" ? "loginUserAction" : selectedAction === "signup" ? "signupUserAction" : "logoutUserAction"}
          </div>
          <p className="text-[11px] text-zinc-500">
            Pilih respons server yang ingin disimulasikan:
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => triggerSimulation("valid")}
            className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Simulasikan Sukses (200 OK)
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => triggerSimulation("invalid")}
            className="text-xs font-bold text-red-600 border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            Simulasikan Gagal (Error)
          </Button>
        </div>
      </div>

      {/* Execution Feedback Panel */}
      {simulationState !== "idle" && (
        <div className={`p-4 rounded-xl border transition-all text-xs space-y-2 ${
          simulationState === "running"
            ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
            : simulationState === "success"
            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-300"
            : "bg-red-500/10 border-red-500/40 text-red-900 dark:text-red-300"
        }`}>
          {simulationState === "running" && (
            <div className="flex items-center gap-2 font-mono text-zinc-600 dark:text-zinc-400">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
              <span>Memproses mutasi Server Action di Edge runtime...</span>
            </div>
          )}

          {simulationState === "success" && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>MUTASI SERVER BERHASIL! (STATUS: SUCCESS)</span>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                {selectedAction === "login" && "Token sesi diterbitkan. Cookie HTTP-Only tersimpan. redirect('/dashboard') dieksekusi."}
                {selectedAction === "signup" && "User baru masuk ke auth.users. Email konfirmasi/magic link terkirim. Trigger public.profiles berjalan."}
                {selectedAction === "logout" && "Sesi dibatalkan di server Supabase. Cookie dibersihkan. redirect('/login') dieksekusi."}
              </p>
            </div>
          )}

          {simulationState === "error" && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span>SERVER ACTION MENGEMBALIKAN ERROR!</span>
              </div>
              <p className="text-[11px] font-mono text-red-600 dark:text-red-400">
                Return: &#123; success: false, error: &quot;{errorMessage}&quot; &#125;
              </p>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                Form UI tidak crash! useActionState menerima pesan error dan menampilkannya pada banner peringatan merah.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
