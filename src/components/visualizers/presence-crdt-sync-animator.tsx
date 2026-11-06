"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  UserMinus,
  Radio,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface OnlineUser {
  id: string;
  name: string;
  avatar: string;
  status: "active" | "idle";
  joinedAt: string;
}

export function PresenceCrdtSyncAnimator() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([
    { id: "usr-1", name: "Budi Santoso", avatar: "👨‍💻", status: "active", joinedAt: "10:02" },
    { id: "usr-2", name: "Siti Rahma", avatar: "👩‍💼", status: "active", joinedAt: "10:04" }
  ]);
  const [lastEvent, setLastEvent] = useState<string>("State CRDT tersinkronisasi (2 pengguna aktif)");

  const handleUserJoin = () => {
    const newId = `usr-${Date.now().toString().slice(-4)}-${Math.random().toString(36).slice(2, 6)}`;
    const randomNames = ["Ahmad Fauzi", "Dewi Lestari", "Rian Pratama", "Nadia Putri"];
    const avatars = ["🧑‍🎓", "👩‍💻", "👨‍🎨", "👩‍🔬"];
    const pick = Math.floor(Math.random() * randomNames.length);

    const newUser: OnlineUser = {
      id: newId,
      name: randomNames[pick],
      avatar: avatars[pick],
      status: "active",
      joinedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setOnlineUsers((prev) => [...prev, newUser]);
    setLastEvent(`Event 'JOIN': ${newUser.name} masuk ke channel (channel.track())`);
  };

  const handleUserLeave = (idToRemove: string) => {
    const user = onlineUsers.find((u) => u.id === idToRemove);
    setOnlineUsers((prev) => prev.filter((u) => u.id !== idToRemove));
    setLastEvent(`Event 'LEAVE': ${user ? user.name : "Pengguna"} keluar (channel.untrack())`);
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 space-y-5 text-zinc-900 dark:text-zinc-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
              <Users className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
              Supabase Presence: Pelacakan Pengguna Online Berbasis CRDT
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Sinkronisasi status kehadiran antar-klien tanpa menulis data ke tabel PostgreSQL (Conflict-free Replicated Data Type)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleUserJoin}
            className="text-xs font-bold h-8 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1" />
            <span>Simulasikan User Join</span>
          </Button>
        </div>
      </div>

      {/* Online Users Avatar Bar */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
            <span>Daftar Pengguna Aktif (channel.presenceState()):</span>
            <Badge className="bg-emerald-600 text-white text-[10px] font-mono">
              {onlineUsers.length} Online
            </Badge>
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            Storage: In-Memory Phoenix Nodes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <AnimatePresence>
            {onlineUsers.map((u) => (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative text-2xl">
                    <span>{u.avatar}</span>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-800" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate max-w-[110px]">
                      {u.name}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      Join: {u.joinedAt}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleUserLeave(u.id)}
                  className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Simulasikan User Leave (Tutup Tab)"
                >
                  <UserMinus className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Realtime Event Log */}
        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{lastEvent}</span>
          </div>
          <span className="text-[10px] text-zinc-400">CRDT Resolution: 0 Konflik</span>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="p-3.5 rounded-xl bg-zinc-950 text-zinc-200 font-mono text-[11px] leading-relaxed border border-zinc-800">
        <code>
          {`const channel = supabase.channel('room-1', { config: { presence: { key: user.id } } })\nchannel\n  .on('presence', { event: 'sync' }, () => setUsers(channel.presenceState()))\n  .subscribe(async (status) => {\n    if (status === 'SUBSCRIBED') await channel.track({ online_at: new Date() })\n  })`}
        </code>
      </div>
    </div>
  );
}

