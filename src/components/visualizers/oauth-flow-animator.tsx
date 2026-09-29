"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ShieldCheck, 
  RotateCcw, 
  Lock, 
  CheckCircle2, 
  Play, 
  Server, 
  Globe, 
  Cpu, 
  Layers, 
  KeyRound,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export function OauthFlowAnimator() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [autoPlaying, setAutoPlaying] = useState<boolean>(false);

  const steps = [
    {
      step: 1,
      title: "Inisiasi Login di Browser",
      sender: "Browser Client",
      receiver: "Supabase / GitHub",
      action: "signInWithOAuth({ provider: 'github' })",
      desc: "Pengguna mengklik tombol 'Login dengan GitHub'. Next.js Client Component memanggil SDK Supabase untuk mengarahkan URL browser ke gateway GitHub OAuth dengan parameter client_id, scope=user:email, dan redirect_uri.",
      packet: "GET https://github.com/login/oauth/authorize?client_id=GH_123&redirect_uri=...&scope=user:email",
      color: "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300"
    },
    {
      step: 2,
      title: "Persetujuan Akses di GitHub",
      sender: "Pengguna",
      receiver: "GitHub Server",
      action: "Authorize Application Consent Screen",
      desc: "GitHub menampilkan layar persetujuan: 'Aplikasi The Serverless Odyssey meminta akses ke profil publik dan email Anda'. Pengguna menekan tombol 'Authorize'.",
      packet: "POST /login/oauth/authorize (Consent Granted by User)",
      color: "border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-300"
    },
    {
      step: 3,
      title: "Redirect Kembali Membawa Auth Code",
      sender: "GitHub Server",
      receiver: "Route Handler Next.js",
      action: "Redirect ke /auth/callback?code=gh_auth_code_789xyz",
      desc: "GitHub mengembalikan pengguna ke aplikasi kita melalui URL Callback dengan menyertakan Authorization Code sementara yang berumur 10 menit (bukan token akses langsung demi keamanan!).",
      packet: "HTTP 302 Redirect ➔ https://my-app.vercel.app/auth/callback?code=gh_auth_code_789xyz",
      color: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
    },
    {
      step: 4,
      title: "Penukaran Kode di Route Handler",
      sender: "Next.js Route Handler",
      receiver: "Supabase Auth Gateway",
      action: "supabase.auth.exchangeCodeForSession(code)",
      desc: "Route Handler Next.js di serverless backend menerima parameter ?code, lalu memanggil fungsi penukaran kode resmi Supabase secara rahasia di balik layar tanpa terlihat oleh pengguna.",
      packet: "POST https://project.supabase.co/auth/v1/token?grant_type=authorization_code&code=gh_auth_code_789xyz",
      color: "border-cyan-500/40 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300"
    },
    {
      step: 5,
      title: "Pertukaran Server-to-Server",
      sender: "Supabase Engine",
      receiver: "GitHub API Backend",
      action: "Exchange Code with GitHub Client Secret",
      desc: "Supabase menghubungi server GitHub API menggunakan Client Secret rahasia milik aplikasi. GitHub memvalidasi kode dan mengembalikan profil email & ID akun terverifikasi.",
      packet: "GET https://api.github.com/user (Authorization: Bearer gh_access_token_secure)",
      color: "border-indigo-500/40 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
    },
    {
      step: 6,
      title: "Penerbitan Sesi & Set-Cookie",
      sender: "Route Handler Next.js",
      receiver: "Browser Client",
      action: "Set HTTP-Only Cookies & Redirect to /dashboard",
      desc: "Supabase membuat entitas user di auth.users, menerbitkan token JWT, lalu menyimpannya ke Cookie HTTP-Only yang aman dari XSS. Pengguna resmi masuk ke Dashboard!",
      packet: "Set-Cookie: sb-access-token=...; HttpOnly; Secure; SameSite=Lax ➔ 307 Redirect /dashboard",
      color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
    }
  ];

  const current = steps[currentStep - 1];

  const handleNext = () => {
    setCurrentStep((prev) => (prev < 6 ? prev + 1 : 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : 6));
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-xs font-semibold">
              Pilar 1.2: Protokol OAuth 2.0
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Authorization Code Grant</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi 6 Langkah Alur Pertukaran Token GitHub OAuth 2.0
          </h4>
        </div>

        {/* Navigation Step Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrev}
            className="text-xs h-8"
          >
            Kembali
          </Button>
          <div className="px-3 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200">
            Langkah {currentStep} / 6
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleNext}
            className="text-xs h-8 bg-purple-600 hover:bg-purple-700 text-white"
          >
            Lanjut
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>

      {/* 4 Entities Topology Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        <div className={`p-2.5 rounded-xl border text-center transition-all ${
          current.sender === "Browser Client" || current.receiver === "Browser Client"
            ? "border-blue-500 bg-blue-500/10 shadow-sm font-bold text-blue-700 dark:text-blue-300"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500"
        }`}>
          <Globe className="w-4 h-4 mx-auto mb-1 text-blue-500" />
          <span>1. Browser User</span>
        </div>

        <div className={`p-2.5 rounded-xl border text-center transition-all ${
          current.sender.includes("Next.js") || current.receiver.includes("Next.js")
            ? "border-cyan-500 bg-cyan-500/10 shadow-sm font-bold text-cyan-700 dark:text-cyan-300"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500"
        }`}>
          <Server className="w-4 h-4 mx-auto mb-1 text-cyan-500" />
          <span>2. Next.js Server</span>
        </div>

        <div className={`p-2.5 rounded-xl border text-center transition-all ${
          current.sender.includes("GitHub") || current.receiver.includes("GitHub")
            ? "border-purple-500 bg-purple-500/10 shadow-sm font-bold text-purple-700 dark:text-purple-300"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500"
        }`}>
          <GithubIcon className="w-4 h-4 mx-auto mb-1 text-purple-500" />
          <span>3. GitHub OAuth</span>
        </div>

        <div className={`p-2.5 rounded-xl border text-center transition-all ${
          current.sender.includes("Supabase") || current.receiver.includes("Supabase")
            ? "border-emerald-500 bg-emerald-500/10 shadow-sm font-bold text-emerald-700 dark:text-emerald-300"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500"
        }`}>
          <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
          <span>4. Supabase Auth</span>
        </div>
      </div>

      {/* Main Step Detail Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4"
        >
          {/* Step Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold">
                {current.step}
              </span>
              <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                {current.title}
              </h5>
            </div>
            <div className="text-xs font-mono flex items-center gap-2 text-zinc-500">
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">{current.sender}</span>
              <span>➔</span>
              <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">{current.receiver}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {current.desc}
          </p>

          {/* Code / Network Packet Inspector */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-purple-500" />
              <span>Transmisi Data / Network Payload:</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-purple-300 overflow-x-auto break-all">
              {current.packet}
            </div>
          </div>

          {/* Step Indicators Bar */}
          <div className="grid grid-cols-6 gap-1 pt-2">
            {steps.map((s) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStep(s.step)}
                className={`h-1.5 rounded-full transition-all ${
                  s.step === currentStep
                    ? "bg-purple-600"
                    : s.step < currentStep
                    ? "bg-purple-300 dark:bg-purple-900"
                    : "bg-zinc-200 dark:bg-zinc-800"
                }`}
                title={s.title}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
