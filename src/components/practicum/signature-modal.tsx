"use client";

import React, { useRef, useState, useEffect } from "react";
import SignaturePad from "signature_pad";
import {
  X,
  PenTool,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (signatureBase64: string) => Promise<void>;
  studentName: string;
  studentNim: string;
  isSubmitting: boolean;
}

export function SignatureModal({
  isOpen,
  onClose,
  onSubmit,
  studentName,
  studentNim,
  isSubmitting,
}: SignatureModalProps) {
  const [activeTab, setActiveTab] = useState<"draw" | "upload">("draw");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize SignaturePad
  useEffect(() => {
    if (isOpen && activeTab === "draw" && canvasRef.current) {
      const canvas = canvasRef.current;
      // Adjust canvas resolution for sharp drawing on retina screens
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(ratio, ratio);
      }

      const pad = new SignaturePad(canvas, {
        penColor: "#0f172a", // Dark navy ink for clear printing on white PDF
        backgroundColor: "rgba(255, 255, 255, 0)",
        minWidth: 1.2,
        maxWidth: 3,
      });

      signaturePadRef.current = pad;

      return () => {
        pad.off();
      };
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setErrorMsg(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("File harus berupa gambar (PNG, JPG, atau JPEG).");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("Ukuran file maksimal 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmSubmit = async () => {
    setErrorMsg(null);
    let finalBase64 = "";

    if (activeTab === "draw") {
      if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
        setErrorMsg("Silakan gambar tanda tangan Anda terlebih dahulu pada bidang kanvas.");
        return;
      }
      finalBase64 = signaturePadRef.current.toDataURL("image/png");
    } else {
      if (!uploadedImage) {
        setErrorMsg("Silakan unggah file gambar tanda tangan Anda.");
        return;
      }
      finalBase64 = uploadedImage;
    }

    await onSubmit(finalBase64);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Pengesahan Laporan Praktikum
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Bubuhkan tanda tangan digital Anda sebelum mengirim laporan ke dosen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Identity confirmation notice */}
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 text-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-zinc-500 dark:text-zinc-400">Praktikan Pengirim:</span>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                {studentName} ({studentNim})
              </div>
            </div>
            <Badge variant="outline" className="text-indigo-600 dark:text-indigo-400 font-mono text-[10px]">
              Otentikasi Terverifikasi
            </Badge>
          </div>

          {/* Tab Selection */}
          <div className="flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab("draw");
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "draw"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Gambar di Layar (Canvas)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("upload");
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "upload"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah Gambar Tanda Tangan</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: DRAW CANVAS */}
          {activeTab === "draw" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>Goreskan tanda tangan menggunakan mouse, stylus, atau jari:</span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Hapus / Ulangi
                </button>
              </div>

              <div className="relative border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-950 overflow-hidden h-48 flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full cursor-crosshair touch-none"
                />
                <div className="absolute bottom-2 left-3 pointer-events-none text-[10px] text-zinc-400">
                  Area Tanda Tangan Digital
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD IMAGE */}
          {activeTab === "upload" && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-all space-y-2"
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Klik untuk memilih file tanda tangan
                </div>
                <div className="text-[11px] text-zinc-400">
                  Format PNG, JPG atau JPEG (Disarankan background putih/transparan, maks 2MB)
                </div>
              </div>

              {uploadedImage && (
                <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={uploadedImage}
                      alt="Preview Tanda Tangan"
                      className="h-12 max-w-[120px] object-contain border border-zinc-200 dark:border-zinc-700 rounded bg-white p-1"
                    />
                    <div className="text-xs text-zinc-700 dark:text-zinc-300">
                      File siap digunakan
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUploadedImage(null)}
                    className="text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    Hapus
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70">
            ℹ️ <strong>Pernyataan Kejujuran Akademik:</strong> Dengan menyetujui dan membubuhkan tanda tangan ini, Anda menyatakan bahwa seluruh catatan pengamatan, analisis, dan kesimpulan dalam laporan ini adalah hasil pengerjaan Anda sendiri secara objektif.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs text-zinc-600 dark:text-zinc-300"
          >
            Batal
          </Button>
          <Button
            size="sm"
            onClick={handleConfirmSubmit}
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs gap-1.5 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Membuat PDF & Mengirim...</span>
              </>
            ) : (
              <>
                <FileCheck className="w-3.5 h-3.5" />
                <span>Bubuhkan TTD & Submit Laporan</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
