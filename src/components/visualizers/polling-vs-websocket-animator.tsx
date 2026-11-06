"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  RefreshCw,
  Radio,
  ArrowRight,
  Server,
  Laptop,
  CheckCircle2,
  Clock,
  Gauge,
  Wifi,
  WifiOff
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PollingVsWebsocketAnimator() {
  const [protocol, setProtocol] = useState<"polling" | "websocket">("polling");
  const [isSimulating, setIsSimulating] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [networkPackets, setNetworkPackets] = useState<Array<{ id: string; type: "poll_empty" | "poll_data" | "ws_push"; label: string; time: string }>>([]);
  const [clientData, setClientData] = useState<string>("Tugas #1 (Awal)");

  const packetIdRef = useRef(0);
  const pollCountRef = useRef(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSimulating) {
      if (protocol === "polling") {
        interval = setInterval(() => {
          pollCountRef.current += 1;
          const currentCount = pollCountRef.current;
          const hasNewData = currentCount % 4 === 0;
          packetIdRef.current += 1;
          const newPacket = {
            id: `pkt-${packetIdRef.current}-${Date.now()}`,
            type: hasNewData ? ("poll_data" as const) : ("poll_empty" as const),
            label: hasNewData
              ? "GET /api/tasks ➔ 200 OK (Ada data baru!) [~850 bytes HTTP overhead]"
              : "GET /api/tasks ➔ 304 / Data Kosong (Sia-sia) [~850 bytes HTTP overhead]",
            time: new Date().toLocaleTimeString()
          };
          setPollCount(currentCount);
          setNetworkPackets((pkts) => [newPacket, ...pkts.slice(0, 5)]);
          if (hasNewData) {
            setClientData(`Tugas #${currentCount} (Update Polling)`);
          }
        }, 1800);
      } else {
        // WebSocket: Persistent connection, server pushes only when event happens
        interval = setInterval(() => {
          pollCountRef.current += 1;
          const currentCount = pollCountRef.current;
          packetIdRef.current += 1;
          const newPacket = {
            id: `pkt-${packetIdRef.current}-${Date.now()}`,
            type: "ws_push" as const,
            label: `WS Frame (PUSH): { event: 'INSERT', new: { id: ${currentCount}, title: 'Misi Baru' } } [~6 bytes overhead]`,
            time: new Date().toLocaleTimeString()
          };
          setPollCount(currentCount);
          setNetworkPackets((pkts) => [newPacket, ...pkts.slice(0, 5)]);
          setClientData(`Tugas #${currentCount} (Instan via WebSocket Push)`);
        }, 2600);
      }
    }

    return () => clearInterval(interval);
  }, [isSimulating, protocol]);

  const handleToggleProtocol = (p: "polling" | "websocket") => {
    setProtocol(p);
    setPollCount(0);
    pollCountRef.current = 0;
    setNetworkPackets([]);
    setClientData("Tugas #1 (Awal)");
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 space-y-5 text-zinc-900 dark:text-zinc-100 shadow-sm">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
              <Zap className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
              Spektrum Real-Time: Polling Berkala vs WebSocket Full-Duplex
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Perbandingan efisiensi bandwidth, beban HTTP request header overhead, dan latensi pembaruan data
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isSimulating ? "destructive" : "default"}
            onClick={() => setIsSimulating(!isSimulating)}
            className="text-xs font-bold h-8 cursor-pointer"
          >
            {isSimulating ? "Stop Simulasi" : "Mulai Simulasi"}
          </Button>
        </div>
      </div>

      {/* Protocol Toggle */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl">
        <button
          type="button"
          onClick={() => handleToggleProtocol("polling")}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            protocol === "polling"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Short Polling (Tanya Tiap 2 Detik)</span>
        </button>

        <button
          type="button"
          onClick={() => handleToggleProtocol("websocket")}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            protocol === "websocket"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          <Wifi className="w-3.5 h-3.5" />
          <span>WebSocket Full-Duplex (Koneksi Persisten)</span>
        </button>
      </div>

      {/* Visual Pipeline Animation */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
          {/* Client Node */}
          <div className="md:col-span-4 p-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <Laptop className="w-4 h-4 text-blue-500" />
              <span>Browser Client (Next.js 16)</span>
            </div>
            <div className="p-2 rounded bg-zinc-100 dark:bg-zinc-900 font-mono text-[11px] text-zinc-600 dark:text-zinc-400 truncate">
              {clientData}
            </div>
            <Badge variant="outline" className="text-[10px]">
              {protocol === "polling" ? `Total Request HTTP: ${pollCount}` : "1 Persistent TCP Connection"}
            </Badge>
          </div>

          {/* Connection Channel */}
          <div className="md:col-span-4 flex flex-col items-center justify-center space-y-2 py-2">
            <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{protocol === "polling" ? "Request-Response Berulang" : "Full-Duplex Bi-directional"}</span>
            </div>

            <div className="relative w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${protocol === "polling" ? "bg-amber-500" : "bg-emerald-500"}`}
                animate={
                  isSimulating
                    ? protocol === "polling"
                      ? { x: ["-100%", "100%"] }
                      : { x: ["100%", "-100%"] }
                    : { x: 0 }
                }
                transition={{
                  repeat: Infinity,
                  duration: protocol === "polling" ? 1.5 : 0.8,
                  ease: "linear"
                }}
              />
            </div>

            <div className="text-[10px] text-center font-semibold">
              {protocol === "polling" ? (
                <span className="text-amber-700 dark:text-amber-300">
                  Header Overhead: <strong>~800 - 1.200 bytes per HTTP request</strong>
                </span>
              ) : (
                <span className="text-emerald-700 dark:text-emerald-300">
                  Frame Overhead: <strong>Hanya ~2 - 6 bytes per WebSocket message!</strong>
                </span>
              )}
            </div>
          </div>

          {/* Server Node */}
          <div className="md:col-span-4 p-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <Server className="w-4 h-4 text-emerald-500" />
              <span>Supabase Realtime (Phoenix Engine)</span>
            </div>
            <div className="p-2 rounded bg-zinc-100 dark:bg-zinc-900 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
              PostgreSQL WAL Change Detector
            </div>
            <Badge variant="outline" className="text-[10px] text-emerald-600">
              {protocol === "polling" ? "Beban Query CPU Konstan" : "Push Hanya Saat Event"}
            </Badge>
          </div>
        </div>

        {/* Network Packet Stream Logger */}
        <div className="space-y-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-600 dark:text-zinc-400">
            <span>Log Paket Jaringan Real-Time:</span>
            <span className="text-[10px] font-mono">
              Status: {isSimulating ? "⚡ Streaming Aktif" : "⏸️ Dijeda"}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-950 text-zinc-300 font-mono text-[11px] space-y-1.5 min-h-[90px] border border-zinc-800">
            {networkPackets.length === 0 ? (
              <div className="text-zinc-500 text-center py-4">
                Klik tombol &quot;Mulai Simulasi&quot; untuk melihat aliran paket data
              </div>
            ) : (
              networkPackets.map((pkt) => (
                <div key={pkt.id} className="flex items-start gap-2 text-[10px] leading-tight">
                  <span className="text-zinc-500">[{pkt.time}]</span>
                  <span
                    className={
                      pkt.type === "poll_empty"
                        ? "text-zinc-400"
                        : pkt.type === "poll_data"
                        ? "text-amber-400 font-semibold"
                        : "text-emerald-400 font-semibold"
                    }
                  >
                    {pkt.label}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Comparison Metrics Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
          <div className="font-bold text-zinc-900 dark:text-zinc-100">Efisiensi Bandwidth</div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {protocol === "polling"
              ? "Boros: 95% request mengembalikan data kosong tetapi tetap memakan header HTTP."
              : "Sangat Hemat: 0 request jika data tidak berubah; payload langsung tiba seketika."}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
          <div className="font-bold text-zinc-900 dark:text-zinc-100">Latensi Pembaruan</div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {protocol === "polling"
              ? "Tinggi (1–5 detik tergantung interval polling)."
              : "Sangat Rendah (< 50ms langsung dari database WAL)."}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
          <div className="font-bold text-zinc-900 dark:text-zinc-100">Beban Server Database</div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {protocol === "polling"
              ? "Tinggi: Ribuan SELECT dieksekusi terus-menerus."
              : "Nol Query: Mendengarkan replication log tanpa mengeksekusi SELECT berulang."}
          </p>
        </div>
      </div>
    </div>
  );
}

