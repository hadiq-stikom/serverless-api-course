"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  PlusCircle,
  Edit3,
  Trash2,
  Code2,
  ArrowRight,
  Database,
  CheckCircle2,
  Layers
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PostgresChangesEventAnimator() {
  const [selectedEvent, setSelectedEvent] = useState<"INSERT" | "UPDATE" | "DELETE">("INSERT");

  const eventPayloads = {
    INSERT: {
      action: "INSERT",
      description: "Terjadi ketika baris baru ditambahkan ke tabel.",
      schema: {
        eventType: "INSERT",
        new: { id: "task-901", title: "Review Modul 11", status: "todo", user_id: "usr-42" },
        old: {},
        errors: null
      },
      clientAction: "tambahkan objek ke state lokal: setTasks(prev => [payload.new, ...prev])"
    },
    UPDATE: {
      action: "UPDATE",
      description: "Terjadi ketika data kolom pada baris yang sudah ada diperbarui.",
      schema: {
        eventType: "UPDATE",
        new: { id: "task-901", title: "Review Modul 11", status: "done", user_id: "usr-42" },
        old: { id: "task-901" }, // Default REPLICA IDENTITY (hanya primary key)
        errors: null
      },
      clientAction: "perbarui item di array: setTasks(prev => prev.map(t => t.id === payload.new.id ? payload.new : t))"
    },
    DELETE: {
      action: "DELETE",
      description: "Terjadi ketika sebuah baris dihapus dari PostgreSQL.",
      schema: {
        eventType: "DELETE",
        new: {},
        old: { id: "task-901" }, // Hanya berisi primary key kecuali REPLICA IDENTITY FULL
        errors: null
      },
      clientAction: "filter keluar dari state: setTasks(prev => prev.filter(t => t.id !== payload.old.id))"
    }
  };

  const current = eventPayloads[selectedEvent];

  return (
    <div className="rounded-2xl border border-indigo-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 space-y-5 text-zinc-900 dark:text-zinc-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
              <Zap className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
              Granularitas Event postgres_changes: INSERT, UPDATE, DELETE
            </h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Anatomi payload real-time WebSocket dan strategi pemutakhiran state lokal React
          </p>
        </div>

        {/* Event Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <button
            type="button"
            onClick={() => setSelectedEvent("INSERT")}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedEvent === "INSERT"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>INSERT</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedEvent("UPDATE")}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedEvent === "UPDATE"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>UPDATE</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedEvent("DELETE")}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedEvent === "DELETE"
                ? "bg-red-600 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>DELETE</span>
          </button>
        </div>
      </div>

      {/* Main Breakdown Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left: JSON Payload Viewer */}
        <div className="md:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-600 dark:text-zinc-400">
            <span className="flex items-center gap-1.5 font-mono">
              <Code2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>WebSocket Received Payload ({selectedEvent})</span>
            </span>
            <Badge
              variant="outline"
              className={`text-[10px] font-bold ${
                selectedEvent === "INSERT"
                  ? "text-emerald-600 border-emerald-400"
                  : selectedEvent === "UPDATE"
                  ? "text-blue-600 border-blue-400"
                  : "text-red-600 border-red-400"
              }`}
            >
              {selectedEvent} Event
            </Badge>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950 text-zinc-200 font-mono text-[11px] leading-relaxed border border-zinc-800 overflow-x-auto shadow-inner">
            <pre>{JSON.stringify(current.schema, null, 2)}</pre>
          </div>
        </div>

        {/* Right: Structural Analysis & React Reducer Strategy */}
        <div className="md:col-span-5 space-y-3">
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 space-y-2">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
              Karakteristik Payload {selectedEvent}:
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {current.description}
            </p>

            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-500">payload.new:</span>
                <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                  {selectedEvent === "DELETE" ? "{ } (Kosong)" : "Berisi data baris baru"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">payload.old:</span>
                <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                  {selectedEvent === "INSERT" ? "{ } (Kosong)" : "{ id: '...' } (Primary Key)"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-1.5">
            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Strategi Mutasi State React:</span>
            </span>
            <div className="p-2 rounded bg-zinc-900 text-indigo-300 font-mono text-[10px] leading-relaxed break-all">
              {current.clientAction}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

