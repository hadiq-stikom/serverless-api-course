"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileJson, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Search, 
  ServerCrash,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type StatusCodeKey = 200 | 201 | 400 | 401 | 404 | 422 | 500;

interface StatusDetail {
  code: StatusCodeKey;
  text: string;
  category: "success" | "client_error" | "server_error";
  description: string;
  sampleBody: any;
}

const STATUS_DETAILS: Record<StatusCodeKey, StatusDetail> = {
  200: {
    code: 200,
    text: "OK",
    category: "success",
    description: "Request sukses diproses (biasanya untuk GET, PUT update, atau DELETE sukses).",
    sampleBody: {
      status: "success",
      data: [
        { id: "e8b23f1a-...", title: "Belajar Next.js 16 REST API", status: "completed" }
      ],
      meta: { page: 1, limit: 10, total: 1 }
    }
  },
  201: {
    code: 201,
    text: "Created",
    category: "success",
    description: "Resource baru berhasil dibuat di database via request POST.",
    sampleBody: {
      status: "success",
      data: {
        id: "7c9d1234-...",
        title: "Tugas Baru dari Mobile App",
        created_at: "2026-10-01T08:00:00Z"
      }
    }
  },
  400: {
    code: 400,
    text: "Bad Request",
    category: "client_error",
    description: "Format request malformed (misal: JSON rusak atau parameter syntax salah).",
    sampleBody: {
      status: "error",
      code: "BAD_REQUEST",
      message: "Payload body bukan format JSON valid"
    }
  },
  401: {
    code: 401,
    text: "Unauthorized",
    category: "client_error",
    description: "Header Authorization Bearer token tidak disertakan atau token sudah kedaluwarsa.",
    sampleBody: {
      status: "error",
      code: "UNAUTHORIZED",
      message: "Kredensial autentikasi Bearer Token tidak valid atau tidak ditemukan"
    }
  },
  404: {
    code: 404,
    text: "Not Found",
    category: "client_error",
    description: "Data dengan ID spesifik tidak ditemukan di database Supabase.",
    sampleBody: {
      status: "error",
      code: "NOT_FOUND",
      message: "Data tugas dengan ID '42' tidak ditemukan"
    }
  },
  422: {
    code: 422,
    text: "Unprocessable Content",
    category: "client_error",
    description: "Sintaks JSON valid tetapi gagal memenuhi aturan validasi skema Zod.",
    sampleBody: {
      status: "error",
      code: "VALIDATION_ERROR",
      message: "Validasi skema data gagal",
      errors: [
        { field: "title", message: "Minimal 3 karakter" },
        { field: "priority", message: "Pilihan harus: low, medium, atau high" }
      ]
    }
  },
  500: {
    code: 500,
    text: "Internal Server Error",
    category: "server_error",
    description: "Terjadi kesalahan tak terduga pada serverless runtime atau koneksi database terputus.",
    sampleBody: {
      status: "error",
      code: "INTERNAL_SERVER_ERROR",
      message: "Terjadi gangguan sistem internal pada server"
    }
  }
};

export function RestResponseContractAnimator() {
  const [selectedCode, setSelectedCode] = useState<StatusCodeKey>(200);
  const current = STATUS_DETAILS[selectedCode];

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-950 shadow-sm space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-xs font-semibold">
              Pilar 1.3: Semantika HTTP
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">RFC 7807 JSON Contract</span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Simulator Standarisasi Respons RESTful &amp; Semantika HTTP Status Code
          </h4>
        </div>

        <Badge variant="outline" className="text-xs font-mono">
          Consistent API Contract
        </Badge>
      </div>

      {/* Status Code Buttons */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(STATUS_DETAILS) as unknown as StatusCodeKey[]).map((codeNum) => {
          const item = STATUS_DETAILS[codeNum];
          const isSelected = selectedCode === Number(codeNum);
          return (
            <button
              key={codeNum}
              type="button"
              onClick={() => setSelectedCode(Number(codeNum) as StatusCodeKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                isSelected
                  ? item.category === "success"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : item.category === "client_error"
                    ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                    : "bg-rose-600 text-white border-rose-600 shadow-xs"
                  : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <span className="font-mono">{item.code}</span> {item.text}
            </button>
          );
        })}
      </div>

      {/* Detail Inspection Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5 p-4 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center gap-2">
            <span className={`text-xl font-black font-mono ${
              current.category === "success" ? "text-emerald-500" : current.category === "client_error" ? "text-amber-500" : "text-rose-500"
            }`}>
              {current.code} {current.text}
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {current.description}
          </p>
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 space-y-1">
            <p><strong>Dampaknya pada Mobile:</strong></p>
            <p>
              {current.code === 200 && "Aplikasi mobile langsung merender data ke antarmuka ListView / GridView."}
              {current.code === 201 && "Aplikasi mobile menampilkan Snackbar sukses dan mereset form input."}
              {current.code === 400 && "Mobile menangani kesalahan payload sebelum dikirim ulang."}
              {current.code === 401 && "Mobile otomatis me-redirect pengguna ke halaman Login / me-refresh token."}
              {current.code === 404 && "Mobile menampilkan Empty State ilustrasi 'Data tidak ditemukan'."}
              {current.code === 422 && "Mobile memetakan pesan error ke masing-masing input field TextField secara spesifik."}
              {current.code === 500 && "Mobile menampilkan dialog 'Server sedang sibuk, silakan coba beberapa saat lagi'."}
            </p>
          </div>
        </div>

        <div className="md:col-span-7 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-2 border-b border-zinc-800">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <FileJson className="w-3.5 h-3.5" /> Response Body Payload (application/json)
            </span>
            <Badge variant="outline" className="text-[10px] text-zinc-400">Content-Type: JSON</Badge>
          </div>
          <pre className="text-zinc-300 leading-relaxed overflow-x-auto text-[11px]">
            {JSON.stringify(current.sampleBody, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
