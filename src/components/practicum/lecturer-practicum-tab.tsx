"use client";

import React, { useState, useEffect, useRef } from "react";
import SignaturePad from "signature_pad";
import {
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  PenTool,
  Upload,
  RotateCcw,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Check,
  X,
  FileText,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LecturerPracticumRow,
  getLecturerPracticumDataAction,
  getPracticumPdfSignedUrlAction,
  approvePracticumReportAction,
  requestRevisionAction,
  saveLecturerSignatureAction,
} from "@/actions/practicum";
import { PRACTICUM_MODULES } from "@/data/practicum";

interface LecturerPracticumTabProps {
  selectedClass: string;
}

export function LecturerPracticumTab({ selectedClass }: LecturerPracticumTabProps) {
  const [data, setData] = useState<LecturerPracticumRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<number | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal Preview PDF
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");

  // Modal Tanda Tangan Dosen
  const [showSignModal, setShowSignModal] = useState(false);
  const [signTab, setSignTab] = useState<"draw" | "upload">("draw");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sigPadRef = useRef<SignaturePad | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedSign, setUploadedSign] = useState<string | null>(null);
  const [signSaving, setSignSaving] = useState(false);
  const [hasLecturerSign, setHasLecturerSign] = useState<boolean | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await getLecturerPracticumDataAction({
        classGroup: selectedClass,
        practicumId: selectedModule === "all" ? undefined : selectedModule,
        status: selectedStatus === "all" ? undefined : selectedStatus,
      });

      if (res.success && res.data) {
        setData(res.data);
      }
    } catch {
      setMessage({ type: "error", text: "Gagal memuat daftar laporan praktikum." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedClass, selectedModule, selectedStatus]);

  // Initialize Canvas for Lecturer Signature
  useEffect(() => {
    if (showSignModal && signTab === "draw" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(ratio, ratio);

      const pad = new SignaturePad(canvas, {
        penColor: "#0f172a",
        backgroundColor: "rgba(255, 255, 255, 0)",
        minWidth: 1.5,
        maxWidth: 3.5,
      });
      sigPadRef.current = pad;

      return () => pad.off();
    }
  }, [showSignModal, signTab]);

  const handleSaveSignature = async () => {
    let finalBase64 = "";
    if (signTab === "draw") {
      if (!sigPadRef.current || sigPadRef.current.isEmpty()) {
        setMessage({ type: "error", text: "Silakan gambar tanda tangan pada kanvas terlebih dahulu." });
        return;
      }
      finalBase64 = sigPadRef.current.toDataURL("image/png");
    } else {
      if (!uploadedSign) {
        setMessage({ type: "error", text: "Silakan unggah gambar tanda tangan terlebih dahulu." });
        return;
      }
      finalBase64 = uploadedSign;
    }

    setSignSaving(true);
    try {
      const res = await saveLecturerSignatureAction(finalBase64);
      if (res.success) {
        setHasLecturerSign(true);
        setShowSignModal(false);
        setMessage({ type: "success", text: "Tanda tangan digital dosen berhasil disimpan dan siap digunakan!" });
      } else {
        setMessage({ type: "error", text: res.error ?? "Gagal menyimpan tanda tangan dosen." });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan saat menyimpan tanda tangan dosen." });
    } finally {
      setSignSaving(false);
    }
  };

  const handlePreviewPdf = async (row: LecturerPracticumRow) => {
    if (!row.pdf_path) {
      setMessage({ type: "error", text: "Dokumen PDF untuk laporan ini belum di-generate." });
      return;
    }
    setActionLoadingId(row.id);
    try {
      const res = await getPracticumPdfSignedUrlAction(row.pdf_path);
      if (res.success && res.url) {
        setPreviewPdfUrl(res.url);
        setPreviewTitle(`Laporan P-0${row.practicum_id} — ${row.student_name} (${row.student_nim})`);
      } else {
        setMessage({ type: "error", text: res.error ?? "Gagal mendapatkan URL dokumen PDF." });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan saat memuat preview PDF." });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleApprove = async (row: LecturerPracticumRow) => {
    setActionLoadingId(row.id);
    setMessage(null);
    try {
      const res = await approvePracticumReportAction(row.id);
      if (res.success) {
        setMessage({
          type: "success",
          text: `Laporan ${row.student_name} (${row.student_nim}) berhasil disetujui dan dicap stempel resmi!`,
        });
        await fetchReports();
      } else {
        setMessage({ type: "error", text: res.error ?? "Gagal menyetujui laporan praktikum." });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan saat menyetujui laporan praktikum." });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRequestRevision = async (row: LecturerPracticumRow) => {
    setActionLoadingId(row.id);
    setMessage(null);
    try {
      const res = await requestRevisionAction(row.id);
      if (res.success) {
        setMessage({
          type: "success",
          text: `Status laporan ${row.student_name} diubah menjadi 'Perlu Revisi'.`,
        });
        await fetchReports();
      } else {
        setMessage({ type: "error", text: res.error ?? "Gagal meminta revisi laporan." });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan saat memproses status revisi." });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtered rows by search query
  const filteredData = data.filter((row) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      row.student_nim.toLowerCase().includes(q) ||
      row.student_name.toLowerCase().includes(q) ||
      row.practicum_title.toLowerCase().includes(q)
    );
  });

  // Calculate statistics
  const totalReports = data.length;
  const pendingApproval = data.filter((r) => r.status === "submitted").length;
  const approvedReports = data.filter((r) => r.status === "approved").length;
  const needRevision = data.filter((r) => r.status === "revision").length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Signature Settings Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Monitoring Laporan Praktikum Mahasiswa
            </h2>
            <Badge variant="outline" className="text-indigo-600 dark:text-indigo-400 font-mono text-xs">
              7 Modul Praktikum
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Periksa hasil pengamatan, skor AI analisis & kesimpulan, dan bubuhkan persetujuan resmi bertanda tangan digital.
          </p>
        </div>

        <Button
          onClick={() => setShowSignModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs gap-2 shrink-0 self-start sm:self-auto shadow-xs"
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Pengaturan TTD Digital Dosen</span>
        </Button>
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="p-1 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <div className="text-xs text-zinc-500 font-medium">Total Laporan Masuk</div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
            {totalReports}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Semua status</div>
        </Card>

        <Card className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 shadow-xs">
          <div className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu Persetujuan</span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-400 mt-1">
            {pendingApproval}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Siap di-review & disetujui</div>
        </Card>

        <Card className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-xs">
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Telah Disetujui</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-1">
            {approvedReports}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Berstempel sah dosen</div>
        </Card>

        <Card className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/20 shadow-xs">
          <div className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Perlu Revisi</span>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-700 dark:text-rose-400 mt-1">
            {needRevision}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Dikembalikan ke mahasiswa</div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari NIM, nama mahasiswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Module Filter */}
          <select
            value={selectedModule}
            onChange={(e) =>
              setSelectedModule(e.target.value === "all" ? "all" : parseInt(e.target.value, 10))
            }
            className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs"
          >
            <option value="all">Semua Praktikum (1-7)</option>
            {PRACTICUM_MODULES.map((pm) => (
              <option key={pm.id} value={pm.id}>
                P-0{pm.id}: {pm.title.substring(0, 30)}...
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs"
          >
            <option value="all">Semua Status</option>
            <option value="submitted">Menunggu Persetujuan</option>
            <option value="approved">Disetujui</option>
            <option value="revision">Perlu Revisi</option>
            <option value="draft">Draft</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchReports}
            className="h-8 px-2.5 text-xs text-zinc-600 dark:text-zinc-300 gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Reports Table */}
      <Card className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Mahasiswa</th>
                <th className="py-3 px-4">Modul Praktikum</th>
                <th className="py-3 px-4 text-center">Skor Analisis</th>
                <th className="py-3 px-4 text-center">Skor Kesimpulan</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Tanggal Submit</th>
                <th className="py-3 px-4 text-right">Aksi & Persetujuan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    <span>Memuat data laporan praktikum...</span>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <span>Tidak ada laporan praktikum yang sesuai filter.</span>
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => {
                  const isActionBusy = actionLoadingId === row.id;

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      {/* Mahasiswa */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {row.student_name}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          {row.student_nim} • {row.class_group}
                        </div>
                      </td>

                      {/* Modul Praktikum */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          P-0{row.practicum_id}: {row.practicum_title}
                        </div>
                      </td>

                      {/* Skor Analisis */}
                      <td className="py-3 px-4 text-center">
                        {row.analysis_score !== null ? (
                          <span
                            className={`font-mono font-bold ${
                              row.analysis_score >= 70
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600"
                            }`}
                          >
                            {row.analysis_score}/100
                          </span>
                        ) : (
                          <span className="text-zinc-400">-</span>
                        )}
                      </td>

                      {/* Skor Kesimpulan */}
                      <td className="py-3 px-4 text-center">
                        {row.conclusion_score !== null ? (
                          <span
                            className={`font-mono font-bold ${
                              row.conclusion_score >= 70
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600"
                            }`}
                          >
                            {row.conclusion_score}/100
                          </span>
                        ) : (
                          <span className="text-zinc-400">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        {row.status === "approved" ? (
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                            Disetujui
                          </Badge>
                        ) : row.status === "submitted" ? (
                          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px]">
                            Menunggu Dosen
                          </Badge>
                        ) : row.status === "revision" ? (
                          <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 text-[10px]">
                            Perlu Revisi
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-zinc-400 text-[10px]">
                            Draft
                          </Badge>
                        )}
                      </td>

                      {/* Tanggal Submit */}
                      <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">
                        {row.submitted_at
                          ? new Date(row.submitted_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview PDF */}
                          {row.pdf_path && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreviewPdf(row)}
                              disabled={isActionBusy}
                              className="h-7 px-2 text-[11px] text-zinc-600 dark:text-zinc-300 gap-1"
                              title="Lihat PDF Laporan"
                            >
                              <Eye className="w-3 h-3 text-indigo-500" />
                              <span>PDF</span>
                            </Button>
                          )}

                          {/* Tombol Setujui */}
                          {row.status === "submitted" && (
                            <Button
                              size="sm"
                              onClick={() => handleApprove(row)}
                              disabled={isActionBusy}
                              className="h-7 px-2.5 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white gap-1 font-semibold"
                            >
                              {isActionBusy ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                              <span>Setujui</span>
                            </Button>
                          )}

                          {/* Tombol Revisi */}
                          {row.status === "submitted" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRequestRevision(row)}
                              disabled={isActionBusy}
                              className="h-7 px-2 text-[11px] text-rose-600 border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              title="Minta Revisi"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Revisi</span>
                            </Button>
                          )}

                          {row.status === "approved" && (
                            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Sah
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL PREVIEW PDF */}
      {previewPdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-4xl h-[85vh] bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {previewTitle}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di Tab Baru</span>
                </a>
                <button
                  onClick={() => setPreviewPdfUrl(null)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 p-2">
              <iframe
                src={previewPdfUrl}
                className="w-full h-full rounded-lg border border-zinc-200 dark:border-zinc-800"
                title="Preview PDF Laporan Praktikum"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL PENGATURAN TANDA TANGAN DOSEN */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
                  <PenTool className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    Tanda Tangan Digital Dosen Pengampu
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Disimpan 1x dan otomatis disematkan saat Anda menyetujui laporan mahasiswa
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSignModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSignTab("draw")}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 ${
                    signTab === "draw"
                      ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                      : "text-zinc-500"
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Gambar di Kanvas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSignTab("upload")}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 ${
                    signTab === "upload"
                      ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                      : "text-zinc-500"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Gambar TTD</span>
                </button>
              </div>

              {signTab === "draw" ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>Goreskan tanda tangan Anda:</span>
                    <button
                      type="button"
                      onClick={() => sigPadRef.current?.clear()}
                      className="text-xs text-amber-600 hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Hapus
                    </button>
                  </div>
                  <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-950 h-48 flex items-center justify-center overflow-hidden">
                    <canvas ref={canvasRef} className="w-full h-full cursor-crosshair touch-none" />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setUploadedSign(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-6 text-center cursor-pointer hover:border-amber-500 transition-colors"
                  >
                    <Upload className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                    <div className="text-xs font-semibold">Klik untuk memilih gambar tanda tangan</div>
                    <div className="text-[11px] text-zinc-400 mt-1">PNG / JPG transparan disarankan</div>
                  </div>
                  {uploadedSign && (
                    <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                      <img src={uploadedSign} alt="Preview" className="h-10 object-contain bg-white p-1 rounded" />
                      <Button variant="ghost" size="sm" onClick={() => setUploadedSign(null)} className="text-xs text-rose-500">
                        Hapus
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-2.5">
              <Button variant="outline" size="sm" onClick={() => setShowSignModal(false)} className="text-xs">
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleSaveSignature}
                disabled={signSaving}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs gap-1.5 shadow-sm"
              >
                {signSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>Simpan Tanda Tangan Dosen</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
