"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Database, Link2, Code, ShieldCheck, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PublicIdSchemaAnimator() {
  const [strategy, setStrategy] = useState<"public_id_only" | "hardcoded_url">("public_id_only");

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">📋</span>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
              Arsitektur Schema Supabase: Menyimpan public_id vs Hardcoded URL
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Menganalisis fleksibilitas pemeliharaan jangka panjang dan portabilitas aset di database relasional.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl self-start sm:self-center border border-zinc-200/60 dark:border-zinc-700/60 text-xs">
          <button
            type="button"
            onClick={() => setStrategy("public_id_only")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              strategy === "public_id_only"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Simpan public_id (Best Practice)
          </button>
          <button
            type="button"
            onClick={() => setStrategy("hardcoded_url")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              strategy === "hardcoded_url"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            Hardcoded URL Penuh
          </button>
        </div>
      </div>

      {/* Skema Tabel Mockup */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-cyan-500" />
            Tabel: <code>public.tasks</code> (Supabase PostgreSQL)
          </span>
          <Badge variant="outline" className="text-[10px] font-mono">Row Definition</Badge>
        </div>

        <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-mono">
          <div className="grid grid-cols-12 gap-2 p-2 bg-zinc-100/80 dark:bg-zinc-900 text-[11px] text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 font-bold">
            <div className="col-span-2">id (UUID)</div>
            <div className="col-span-3">title (TEXT)</div>
            <div className="col-span-7">{strategy === "public_id_only" ? "image_public_id (TEXT)" : "image_url (TEXT)"}</div>
          </div>
          <div className="grid grid-cols-12 gap-2 p-3 items-center text-zinc-700 dark:text-zinc-300">
            <div className="col-span-2 text-zinc-400 text-[10px]">f47ac10b...</div>
            <div className="col-span-3 font-semibold text-zinc-900 dark:text-white truncate">Audit Desain Logo</div>
            <div className="col-span-7">
              {strategy === "public_id_only" ? (
                <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                  &quot;tasks/logo_audit_v2&quot;
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400 text-[10px] truncate block bg-rose-50 dark:bg-rose-950/60 p-1 rounded border border-rose-200 dark:border-rose-900">
                  https://res.cloudinary.com/kampus-cloud/image/upload/v171720/tasks/logo_audit_v2.jpg
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Dampak Fleksibilitas Frontend Component */}
        <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-200 text-xs font-mono space-y-1.5">
          <div className="text-[10px] text-zinc-500 flex items-center justify-between pb-1 border-b border-zinc-800">
            <span>Komponen React Klien: &lt;CldImage&gt;</span>
            <span className={strategy === "public_id_only" ? "text-emerald-400" : "text-amber-400"}>
              {strategy === "public_id_only" ? "Otomatisasi Transformasi Aktif" : "Transformasi Terkunci (Kaku)"}
            </span>
          </div>
          {strategy === "public_id_only" ? (
            <pre className="text-emerald-400 text-[11px] leading-relaxed overflow-x-auto">
              <code>{`<CldImage
  src={task.image_public_id} // Bebas ganti ukuran, crop AI, & format!
  width={400}
  height={300}
  crop="fill"
  gravity="auto"
/>`}</code>
            </pre>
          ) : (
            <pre className="text-zinc-400 text-[11px] leading-relaxed overflow-x-auto">
              <code>{`// ❌ URL statis tidak dapat memanfaatkan helper CldImage secara optimal:
<img src={task.image_url} alt="Task image" />
// Jika ingin crop wajah atau format AVIF, URL di database harus di-replace manual!`}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

