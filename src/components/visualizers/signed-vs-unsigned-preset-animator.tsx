"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, ShieldCheck, ShieldAlert, Lock, Unlock, Play, RefreshCw, FileCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SignedVsUnsignedPresetAnimator() {
  const [presetType, setPresetType] = useState<"signed" | "unsigned">("signed");
  const [timestamp, setTimestamp] = useState<number>(1717200000);
  const [isGenerated, setIsGenerated] = useState<boolean>(true);

  // Parameter simulasi
  const folder = "tasks_attachments";
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  // Simulasi HMAC-SHA1 hash
  const signatureHash = presetType === "signed" ? "b8f2a174c89e491d90c5a21fa89b21f301d54e12" : "N/A (Unsigned)";

  const handleGenerate = () => {
    setTimestamp(Math.floor(Date.now() / 1000));
    setIsGenerated(true);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">🔐</span>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
              Simulasi Keamanan: Unsigned vs HMAC SHA-1 Signed Upload Preset
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Membandingkan kemudahan unsigned preset dengan proteksi kriptografis signed preset di Server Action.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl self-start sm:self-center border border-zinc-200/60 dark:border-zinc-700/60 text-xs">
          <button
            type="button"
            onClick={() => setPresetType("signed")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              presetType === "signed"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Signed (HMAC SHA-1)
          </button>
          <button
            type="button"
            onClick={() => setPresetType("unsigned")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              presetType === "unsigned"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Unlock className="w-3.5 h-3.5" />
            Unsigned Preset
          </button>
        </div>
      </div>

      {/* Komparasi Alur Arsitektur */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kolom Kiri: Mekanisme Otorisasi */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-indigo-500" />
              Alur Otorisasi Unggah
            </span>
            <Badge variant="outline" className="text-[10px] font-mono">
              {presetType === "signed" ? "Two-Phase Signature" : "Single-Step Direct"}
            </Badge>
          </div>

          <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-1.5">
            {presetType === "signed" ? (
              <>
                <p><strong>1. Request Signature:</strong> Klien memanggil Server Action Next.js terproteksi <code>auth.uid()</code> untuk meminta tanda tangan digital.</p>
                <p><strong>2. Server HMAC Hash:</strong> Server menggabungkan timestamp + folder + <code>CLOUDINARY_API_SECRET</code> menghasilkan signature.</p>
                <p><strong>3. Validasi Cloudinary:</strong> Cloudinary mencocokkan signature sebelum menerima file.</p>
              </>
            ) : (
              <>
                <p><strong>1. Static Preset:</strong> Klien langsung menyertakan string preset publik (misal <code>ml_default</code>) di browser.</p>
                <p><strong>2. Tanpa Kunci Rahasia:</strong> Tidak memerlukan Server Action atau komputasi backend sama sekali.</p>
                <p><strong>3. Risiko Abuse:</strong> Siapapun yang melihat inspect network tab dapat menggunakan preset untuk mengunggah file sembarangan!</p>
              </>
            )}
          </div>

          {presetType === "signed" && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleGenerate}
              className="text-xs gap-1.5 h-8 w-full mt-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Generate Timestamp Baru (Batas 1 Jam)
            </Button>
          )}
        </div>

        {/* Kolom Kanan: Parameter Kriptografis Inspection */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100 font-mono text-xs space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-2 border-b border-zinc-800">
            <span>Inspector Payload Parameter</span>
            <span>{presetType === "signed" ? "Signed Pipeline" : "Unsigned Pipeline"}</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div>
              <span className="text-zinc-500">upload_preset: </span>
              <span className="text-indigo-400 font-bold">{presetType === "signed" ? "signed_tasks_preset" : "my_unsigned_preset"}</span>
            </div>
            <div>
              <span className="text-zinc-500">folder: </span>
              <span className="text-cyan-400 font-bold">&quot;{folder}&quot;</span>
            </div>
            <div>
              <span className="text-zinc-500">timestamp: </span>
              <span className="text-amber-400 font-bold">{timestamp}</span>
            </div>
            {presetType === "signed" && (
              <>
                <div className="pt-1 text-zinc-500">
                  <span>string_to_sign: </span>
                  <span className="text-zinc-300 block truncate">{paramsToSign}</span>
                </div>
                <div className="pt-1">
                  <span className="text-zinc-500">signature (HMAC-SHA1): </span>
                  <span className="text-emerald-400 font-bold block truncate">{signatureHash}</span>
                </div>
              </>
            )}
          </div>

          <div className="pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500 flex items-center justify-between">
            <span>API_SECRET tetap aman di server (0% kebocoran)</span>
            <span className="text-emerald-400 font-bold">HMAC OK</span>
          </div>
        </div>
      </div>
    </div>
  );
}

