"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeartbeatReconnectAnimator() {
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "reconnecting">("connected");
  const [heartbeatCount, setHeartbeatCount] = useState(0);
  const [missedMutations, setMissedMutations] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (connectionStatus === "connected") {
      interval = setInterval(() => {
        setHeartbeatCount((c) => c + 1);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [connectionStatus]);

  const handleSimulateDrop = () => {
    setConnectionStatus("disconnected");
    setMissedMutations(2); // 2 mutations occurred while offline
  };

  const handleSimulateReconnect = () => {
    setConnectionStatus("reconnecting");
    setTimeout(() => {
      setConnectionStatus("connected");
      setMissedMutations(0); // Catch-up query executed!
    }, 1200);
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 space-y-5 text-zinc-900 dark:text-zinc-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
              <Activity className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
              Ketahanan Jaringan: Heartbeat Ping/Pong &amp; Reconnection Catch-Up
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Mekanisme deteksi koneksi mati melalui frame heartbeat dan pemulihan data yang terlewat (catch-up query)
          </p>
        </div>

        <Badge
          className={`font-mono text-xs ${
            connectionStatus === "connected"
              ? "bg-emerald-600 text-white"
              : connectionStatus === "reconnecting"
              ? "bg-amber-600 text-white animate-pulse"
              : "bg-red-600 text-white"
          }`}
        >
          {connectionStatus === "connected"
            ? "Status: CONNECTED (Online)"
            : connectionStatus === "reconnecting"
            ? "Status: RECONNECTING..."
            : "Status: DISCONNECTED (Offline)"}
        </Badge>
      </div>

      {/* Connection State Dashboard */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Heartbeat Status */}
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 space-y-1 text-center">
            <span className="text-[11px] font-bold text-zinc-500 block">Frame Heartbeat (Ping/Pong)</span>
            <div className="flex items-center justify-center gap-1.5 text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400">
              <Activity className={`w-5 h-5 ${connectionStatus === "connected" ? "animate-bounce" : ""}`} />
              <span>{connectionStatus === "connected" ? `#${heartbeatCount} OK` : "TIMEOUT"}</span>
            </div>
            <p className="text-[10px] text-zinc-400">Tiap 30 detik mendeteksi drop</p>
          </div>

          {/* Missed Mutations during Offline */}
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 space-y-1 text-center">
            <span className="text-[11px] font-bold text-zinc-500 block">Mutasi Terlewat Saat Offline</span>
            <div className="text-lg font-mono font-bold text-amber-600 dark:text-amber-400">
              {missedMutations > 0 ? `${missedMutations} Events Lost` : "0 (Synced)"}
            </div>
            <p className="text-[10px] text-zinc-400">WebSocket tidak memiliki buffer tak terbatas</p>
          </div>

          {/* Fallback Strategy */}
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 space-y-1 text-center">
            <span className="text-[11px] font-bold text-zinc-500 block">Pemulihan (Re-Fetch Trigger)</span>
            <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {connectionStatus === "connected" ? "router.refresh() Ready" : "Menunggu Sinyal Reconnect"}
            </div>
            <p className="text-[10px] text-zinc-400">Panggil query fresh setelah reconnect</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-200 dark:border-zinc-800">
          <span className="text-xs text-zinc-600 dark:text-zinc-400">
            Uji coba simulasi kondisi jaringan mahasiswa:
          </span>

          <div className="flex gap-2">
            {connectionStatus === "connected" ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleSimulateDrop}
                className="text-xs font-bold h-8 cursor-pointer"
              >
                <WifiOff className="w-3.5 h-3.5 mr-1" />
                <span>Simulasikan Jaringan Putus (Offline)</span>
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSimulateReconnect}
                className="text-xs font-bold h-8 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Wifi className="w-3.5 h-3.5 mr-1" />
                <span>Pulihkan Jaringan &amp; Re-Fetch State</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

