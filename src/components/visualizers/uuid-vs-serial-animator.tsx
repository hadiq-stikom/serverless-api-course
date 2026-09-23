"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Key, 
  ShieldAlert, 
  ShieldCheck, 
  Hash, 
  Globe, 
  Server, 
  Play, 
  RotateCcw,
  Sparkles,
  AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function UuidVsSerialAnimator() {
  const [selectedType, setSelectedType] = useState<"serial" | "uuid">("uuid");
  const [sampleId, setSampleId] = useState("550e8400-e29b-41d4-a716-446655440000");
  const [enumerationCount, setEnumerationCount] = useState(105);

  const generateNewId = () => {
    if (selectedType === "serial") {
      setEnumerationCount((prev) => prev + 1);
      setSampleId(String(enumerationCount + 1));
    } else {
      const hex = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      const uuid = `${hex()}${hex()}-${hex()}-4${hex().substr(0,3)}-a${hex().substr(0,3)}-${hex()}${hex()}${hex()}`;
      setSampleId(uuid);
    }
  };

  const handleTypeSwitch = (type: "serial" | "uuid") => {
    setSelectedType(type);
    if (type === "serial") {
      setSampleId("105");
      setEnumerationCount(105);
    } else {
      setSampleId("7f3a8b29-c1d0-4e4f-b6b7-c8d9e0f1a2b3");
    }
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
              Pilar 1.1: Primary Key Strategy
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">gen_random_uuid() vs SERIAL</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulasi Kriptografi Kunci Primer: UUID v4 vs Auto-Increment Serial ID
          </h4>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => handleTypeSwitch("uuid")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedType === "uuid"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            UUID v4 (Rekomendasi)
          </button>
          <button
            type="button"
            onClick={() => handleTypeSwitch("serial")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedType === "serial"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            Serial Integer (Legacy)
          </button>
        </div>
      </div>

      {/* Interactive ID Display & Generator */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs text-zinc-500 font-medium">Contoh URL Endpoint API yang Dihasilkan:</span>
            <div className="font-mono text-xs sm:text-sm bg-zinc-100 dark:bg-zinc-950 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 overflow-x-auto">
              https://course-app.vercel.app/api/invoices/<strong className={selectedType === "uuid" ? "text-emerald-500" : "text-amber-500"}>{sampleId}</strong>
            </div>
          </div>

          <Button
            size="sm"
            onClick={generateNewId}
            className="self-start sm:self-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate Record Baru
          </Button>
        </div>

        {/* Security & Architectural Analysis Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {/* Card 1: Enumeration Vulnerability */}
          <div className={`p-3.5 rounded-xl border space-y-2 ${
            selectedType === "uuid"
              ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-900 dark:text-emerald-300"
              : "bg-red-50/60 dark:bg-red-950/30 border-red-500/40 text-red-900 dark:text-red-300"
          }`}>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              {selectedType === "uuid" ? (
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
              )}
              <span>Ketahanan dari Serangan Enumerasi ID:</span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              {selectedType === "uuid"
                ? "✅ Sangat Aman. Panjang 128-bit (2^122 variasi acak). Mustahil ditebak oleh script peretas atau bot scraper."
                : "⚠️ Sangat Berbahaya. Urutan berurutan (101, 102, 103...) memungkinkan siapapun menebak seluruh data pengguna lain hanya dengan melakukan looping URL."}
            </p>
          </div>

          {/* Card 2: Distributed Database Scaling */}
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-zinc-800 dark:text-zinc-200">
              <Server className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Skalabilitas Multi-Region & Cloud Migration:</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {selectedType === "uuid"
                ? "Dapat digenerate langsung di client atau serverless function tanpa perlu bertanya nomor terakhir ke database master (Zero Collision)."
                : "Memerlukan penguncian sequence database terpusat (SELECT nextval). Rawan tabrakan saat sinkronisasi data antar cabang database."}
            </p>
          </div>
        </div>
      </div>

      {/* SQL DDL Definition Snippet */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#1e1e1e] text-zinc-200 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-zinc-800 text-[11px]">
          <span>SQL DDL Standar Supabase:</span>
          <span className="text-emerald-400">{selectedType === "uuid" ? "Best Practice" : "Legacy Pattern"}</span>
        </div>
        <pre className="text-emerald-400 leading-relaxed overflow-x-auto">
          <code>
            {selectedType === "uuid"
              ? `CREATE TABLE projects (
  -- 🔒 UUID v4 otomatis digenerate kriptografis
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);`
              : `CREATE TABLE projects (
  -- ⚠️ Rawan tertebak & ID collision
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);`}
          </code>
        </pre>
      </div>
    </div>
  );
}
