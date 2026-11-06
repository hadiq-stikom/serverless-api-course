"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Radio,
  Send,
  MousePointer,
  MessageSquare,
  Sparkles,
  Zap,
  CheckCircle2,
  Database
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function EphemeralBroadcastAnimator() {
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [broadcastMessages, setBroadcastMessages] = useState<Array<{ id: string | number; sender: string; text: string; time: string }>>([
    { id: 1, sender: "Budi (Browser A)", text: "Halo tim, saya sedang edit tugas!", time: "10:15:02" }
  ]);
  const [inputText, setInputText] = useState("");

  const handleSimulateTyping = () => {
    setTypingUser("Budi (Browser A)");
    setTimeout(() => {
      setTypingUser(null);
    }, 2500);
  };

  const handleSendBroadcast = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sender: "Anda (Browser B)",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString()
    };
    setBroadcastMessages((prev) => [...prev, newMsg]);
    setInputText("");
  };

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 space-y-5 text-zinc-900 dark:text-zinc-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
              <Radio className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
              Ephemeral Broadcast: Siaran Kilat Tanpa Beban Disk PostgreSQL
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Komunikasi pesan instan (typing indicator, mouse cursor, ping) yang diteruskan langsung via RAM server tanpa INSERT database
          </p>
        </div>

        <Badge variant="outline" className="border-indigo-400 text-indigo-700 dark:text-indigo-300 font-mono text-xs">
          Zero Database I/O
        </Badge>
      </div>

      {/* Main Interactive Broadcast Console */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left: Broadcast Action Panel */}
        <div className="md:col-span-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 p-4 space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
              1. Simulasi Typing Indicator (Klien A):
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSimulateTyping}
              className="w-full text-xs font-bold h-8 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Kirim Sinyal Mengetik ({`{ isTyping: true }`})</span>
            </Button>
            <p className="text-[11px] text-zinc-500">
              Memicu <code>channel.send({`{ type: 'broadcast', event: 'typing' }`})</code>.
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
              2. Kirim Pesan Broadcast Cepat:
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ketik pesan ephemeral..."
                className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                onKeyDown={(e) => e.key === "Enter" && handleSendBroadcast()}
              />
              <Button
                size="sm"
                onClick={handleSendBroadcast}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Message Stream Viewer */}
        <div className="md:col-span-7 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
              <span>Feed Pesan Broadcast (In-Memory Channel):</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Latensi: ~15ms</span>
          </div>

          {/* Typing Notification Banner */}
          {typingUser && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-2"
            >
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="font-semibold">{typingUser} sedang mengetik...</span>
            </motion.div>
          )}

          {/* Chat Bubble List */}
          <div className="space-y-2 min-h-[140px] max-h-[180px] overflow-y-auto">
            {broadcastMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{msg.sender}</span>
                  <span className="text-zinc-400 font-mono">{msg.time}</span>
                </div>
                <div className="text-zinc-800 dark:text-zinc-200">{msg.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

