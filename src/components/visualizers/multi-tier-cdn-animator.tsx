"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Server, Play, RotateCcw, CheckCircle2, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function MultiTierCdnAnimator() {
  const [cacheStatus, setCacheStatus] = useState<"miss" | "hit">("miss");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [currentHop, setCurrentHop] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([
    "Sistem CDN Siap: Klik 'Jalankan Request Pengguna' untuk simulasi aliran paket.",
  ]);

  const handleSimulate = () => {
    setIsSimulating(true);
    setCurrentHop(1);
    setLogs(["[1] Pengguna (Jakarta) membuka halaman profil: GET /v1/demo/image/upload/sample.webp"]);

    setTimeout(() => {
      setCurrentHop(2);
      if (cacheStatus === "hit") {
        setLogs((prev) => [
          "[2] Edge POP Singapore: Cache HIT! ✅ Gambar berukuran 42 KB ditemukan di SSD Edge Cache.",
          "[3] Respon instan dikirim kembali ke browser Jakarta dalam 18ms (0 compute cost).",
          ...prev,
        ]);
        setCurrentHop(4);
        setIsSimulating(false);
      } else {
        setLogs((prev) => [
          "[2] Edge POP Singapore: Cache MISS! ⚠️ Gambar belum ada di cache regional.",
          "[3] Request diteruskan ke Origin Shield Cloudinary (US-East) untuk transformasi dinamis...",
          ...prev,
        ]);

        setTimeout(() => {
          setCurrentHop(3);
          setLogs((prev) => [
            "[4] Origin Shield: CPU Cloudinary melakukan transformasi (f_auto, q_auto) ➔ 42 KB.",
            "[5] Gambar disimpan di Edge POP Singapore (TTL 30 hari) & dikirim ke browser (280ms total).",
            "[6] 💡 Request berikutnya dari pengguna manapun di Asia Tenggara akan menjadi Cache HIT 18ms!",
            ...prev,
          ]);
          setCurrentHop(4);
          setIsSimulating(false);
          setCacheStatus("hit"); // request selanjutnya otomatis HIT!
        }, 800);
      }
    }, 600);
  };

  const handleReset = () => {
    setCacheStatus("miss");
    setCurrentHop(0);
    setIsSimulating(false);
    setLogs(["Sistem di-reset: Cache Edge dibersihkan (Cold Cache)."]);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">🌐</span>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
              Simulasi Multi-Tier Global Edge Caching &amp; Origin Shield
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Melihat perbedaan alur antara Cache MISS (transformasi pertama) dan Cache HIT (distribusi Edge instan).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`text-xs font-mono font-bold ${
              cacheStatus === "hit"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
            }`}
          >
            Status Edge: {cacheStatus === "hit" ? "WARM (Cache HIT)" : "COLD (Cache MISS)"}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            disabled={isSimulating}
            className="text-xs gap-1 h-8"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleSimulate}
            disabled={isSimulating}
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 h-8 font-semibold shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Jalankan Request
          </Button>
        </div>
      </div>

      {/* Diagram Node Aliran Data Multi-Tier */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative pt-2">
        {/* Node 1: User / Browser */}
        <div className={`p-4 rounded-xl border transition-all ${
          currentHop === 1 || currentHop === 4
            ? "border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/30"
            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60"
        } space-y-2`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-indigo-500" />
              1. Klien Pengguna
            </span>
            <Badge variant="secondary" className="text-[10px]">Jakarta</Badge>
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Peramban meminta aset via URL CDN Cloudinary: <code>/f_auto,q_auto/sample.jpg</code>.
          </p>
          <div className="text-[11px] font-mono text-zinc-500">
            Jarak ke Edge: <strong className="text-zinc-900 dark:text-white">~15 ms</strong>
          </div>
        </div>

        {/* Node 2: POP Edge Server */}
        <div className={`p-4 rounded-xl border transition-all ${
          currentHop === 2
            ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 ring-2 ring-emerald-500/30"
            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60"
        } space-y-2`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-500" />
              2. Edge POP CDN
            </span>
            <Badge variant="secondary" className="text-[10px]">Singapore</Badge>
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Pusat data terdekat yang menyimpan ribuan aset cache di SSD berkecepatan tinggi.
          </p>
          <div className="text-[11px] font-mono text-zinc-500">
            Hasil Cache:{" "}
            <strong className={cacheStatus === "hit" ? "text-emerald-500" : "text-amber-500"}>
              {cacheStatus === "hit" ? "HIT (18ms)" : "MISS (Teruskan)"}
            </strong>
          </div>
        </div>

        {/* Node 3: Cloudinary Origin Shield */}
        <div className={`p-4 rounded-xl border transition-all ${
          currentHop === 3
            ? "border-purple-500 bg-purple-50/40 dark:bg-purple-950/30 ring-2 ring-purple-500/30"
            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60"
        } space-y-2`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-purple-500" />
              3. Origin Shield &amp; AI
            </span>
            <Badge variant="secondary" className="text-[10px]">Cloud Datacenter</Badge>
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Mesin komputasi AI Cloudinary yang mengeksekusi kompresi dan cropping bila belum ada di cache.
          </p>
          <div className="text-[11px] font-mono text-zinc-500">
            Compute Latency: <strong className="text-purple-600 dark:text-purple-400">~260 ms</strong>
          </div>
        </div>
      </div>

      {/* Terminal Log Console */}
      <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 text-zinc-100 p-3 space-y-1 font-mono text-[11px]">
        <div className="flex items-center justify-between text-[10px] text-zinc-500 pb-1 border-b border-zinc-800/80 mb-1">
          <span>📡 CDN Network Inspection Console</span>
          <span>HTTP/3 (QUIC) • TLS 1.3</span>
        </div>
        <div className="space-y-1 max-h-28 overflow-y-auto">
          {logs.map((log, idx) => (
            <div key={idx} className="leading-relaxed text-zinc-300">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

