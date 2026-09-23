"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileCode, 
  FolderTree, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Sparkles, 
  ArrowRight 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ActionPlacementAnimator() {
  const [placement, setPlacement] = useState<"separate" | "inline">("separate");

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-zinc-900/90 dark:via-zinc-950 dark:to-zinc-950 p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <FolderTree className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm md:text-base text-zinc-900 dark:text-white">
              Simulator Pola Penempatan Server Actions
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Pelajari perbedaan arsitektur antara file terpisah (src/actions/*) vs fungsi inline di dalam Server Component.
          </p>
        </div>

        {/* Placement Switcher */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPlacement("separate")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              placement === "separate"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            🌟 Berkas Terpisah (src/actions/*)
          </button>
          <button
            type="button"
            onClick={() => setPlacement("inline")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              placement === "inline"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            ⚡ Inline (Di Server Component)
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Code Structure */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
            <span>Struktur Kode TypeScript</span>
            <Badge className="bg-indigo-500/20 text-indigo-300">
              {placement === "separate" ? "Dapat Diimpor ke Mana Saja" : "Hanya untuk Server Component"}
            </Badge>
          </div>

          <pre className="text-[11px] leading-relaxed">
            {placement === "separate" ? (
`// src/actions/tasks.ts
"use server"; // Wajib di baris 1 file terpisah!

import { TaskSchema } from "@/lib/schemas";

export async function createTask(formData: FormData) {
  // ✅ Dapat diimpor di Client Component ('use client')
  // ✅ Maupun di Server Component
  const title = formData.get("title");
  await db.tasks.insert({ title });
}`
            ) : (
`// src/app/tasks/page.tsx (Server Component)
export default function TasksPage() {
  // Inline Server Action:
  async function createTask(formData: FormData) {
    "use server"; // Wajib di baris 1 fungsi inline
    await db.tasks.insert({ title: formData.get("title") });
  }

  // ⚠️ Hanya dapat dipasangkan ke form di file ini
  return <form action={createTask}>...</form>;
}`
            )}
          </pre>
        </div>

        {/* Right: Architectural Rules & Trade-offs */}
        <div className="lg:col-span-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span>Karakteristik &amp; Rekomendasi Industri</span>
            <span className="text-[10px] text-zinc-400 font-mono">Architecture Matrix</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className={`p-3 rounded-lg border ${
              placement === "separate"
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200"
                : "bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800/80 text-blue-900 dark:text-blue-200"
            }`}>
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{placement === "separate" ? "Pilihan Standar Skala Produksi (Direkomendasikan)" : "Pilihan Cepat untuk Komponen Server Mandiri"}</span>
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed">
                {placement === "separate"
                  ? "Menempatkan Server Actions di dalam direktori `src/actions/*` memungkinkan fungsi dipanggil dari mana saja, termasuk Client Components yang menggunakan hook `useActionState`."
                  : "Sangat ringkas untuk prototyping di Server Component. Namun, Anda DILARANG membuat inline Server Action di dalam Client Component ('use client')!"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60">
                <span className="text-zinc-400 block text-[10px]">Dukungan Client Component:</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">
                  {placement === "separate" ? "✅ Ya (Bebas Impor)" : "❌ Dilarang (Syntax Error)"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60">
                <span className="text-zinc-400 block text-[10px]">Kemudahan Unit Testing:</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">
                  {placement === "separate" ? "✅ Sangat Mudah" : "⚠️ Terikat ke File Page"}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <span>Konvensi: Selalu buat folder <code>src/actions/</code> untuk proyek tim.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
