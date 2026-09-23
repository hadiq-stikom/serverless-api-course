"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Laptop, 
  Server, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Code,
  FileCode,
  Radio,
  Lock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ClientVsServerSupabaseAnimator() {
  const [activeContext, setActiveContext] = useState<"client" | "server">("server");

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-xs font-semibold">
              Pilar 3.3: Client Architecture
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Browser vs Server Runtime</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Pemisahan: createBrowserClient vs createServerClient
          </h4>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveContext("server")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeContext === "server"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            Server Client (RSC &amp; Actions)
          </button>
          <button
            type="button"
            onClick={() => setActiveContext("client")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeContext === "client"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            Browser Client (&apos;use client&apos;)
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Code Import File */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
            <span>Berkas Inisialisasi Klien:</span>
            <Badge variant="outline" className="text-[10px] font-mono">
              {activeContext === "server" ? "src/utils/supabase/server.ts" : "src/utils/supabase/client.ts"}
            </Badge>
          </div>

          <pre className="p-3 rounded-lg bg-[#1e1e1e] text-zinc-200 text-xs font-mono overflow-x-auto leading-relaxed border border-zinc-800">
            <code>
              {activeContext === "server" ? `// Di Server Component & Server Actions:
import { createClient } from "@/utils/supabase/server";

export async function DashboardPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*");
    
  return <ProjectList items={projects} />;
}` : `// Di Client Component ('use client'):
"use client";

import { createClient } from "@/utils/supabase/client";

export function RealtimeChatWidget() {
  const supabase = createClient();
  // Langsung dapat mengakses WebSocket & Browser APIs
  supabase.channel("room-1").subscribe();
  
  return <div>Chat Live</div>;
}`}
            </code>
          </pre>
        </div>

        {/* Right: Runtime Characteristics */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Karakteristik Lingkungan Runtime:
            </div>

            <div className="space-y-2 text-xs leading-relaxed">
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-1">
                <span className="text-[11px] text-zinc-500 font-semibold block">Lokasi Eksekusi:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  {activeContext === "server" ? "Node.js / Vercel Edge Server" : "Browser Web (Perangkat Pengguna)"}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-1">
                <span className="text-[11px] text-zinc-500 font-semibold block">Siklus Hidup Object (Lifecycle):</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  {activeContext === "server" ? "Per-Request Instance (Async Cookies)" : "Singleton Instance di Memori Browser"}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-1">
                <span className="text-[11px] text-zinc-500 font-semibold block">Fitur Unggulan:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  {activeContext === "server" ? "0 kB JS Bundle & Data Fetching Cepat" : "Realtime WebSocket & Client Auth State"}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
            ⚠️ <strong>Peringatan Arsitektur:</strong> DILARANG mengimpor <code>server.ts</code> ke dalam Client Component karena modul <code>next/headers</code> tidak tersedia di lingkungan browser.
          </div>
        </div>
      </div>
    </div>
  );
}
