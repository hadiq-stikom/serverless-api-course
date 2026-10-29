"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  UserPlus,
  Edit3,
  Trash2,
  KeyRound,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  RotateCcw,
  Upload,
  X,
  GraduationCap,
  AlertTriangle,
  Building2,
  Calendar,
  Lock,
  Unlock,
  Download,
  FileSpreadsheet,
  FileText,
  ShieldAlert,
  ClipboardPaste,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  getStudentRosterAction,
  addSingleStudentAction,
  updateStudentAction,
  deleteStudentAction,
  deleteStudentsByClassAction,
  deleteAllStudentsAction,
  exportStudentsAndGradesAction,
  bulkImportStudentsAction,
  StudentRosterRecord,
} from "@/actions/lecturer-auth";
import { parseRawStudentsText } from "@/utils/student-parser";
import { resetStudentPasswordByLecturerAction } from "@/actions/student-auth";

interface StudentManagementTabProps {
  onOpenImportModal?: () => void;
  onRefreshParent?: () => void;
}

export function StudentManagementTab({
  onOpenImportModal,
  onRefreshParent,
}: StudentManagementTabProps) {
  const [students, setStudents] = useState<StudentRosterRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // Default filter kelas disetel ke "sp5.1" sesuai preferensi dosen
  const [selectedClass, setSelectedClass] = useState("sp5.1");
  const [copiedNim, setCopiedNim] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Export State
  const [isExporting, setIsExporting] = useState(false);

  // Modal State: Tambah Mahasiswa Manual
  const [showAddModal, setShowAddModal] = useState(false);
  const [addNim, setAddNim] = useState("");
  const [addName, setAddName] = useState("");
  const [addClass, setAddClass] = useState("sp5.1");
  const [addCustomClass, setAddCustomClass] = useState("");
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);
  const [addError, setAddError] = useState("");

  // Modal State: Import dari Excel Langsung (Copy-Paste)
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [excelText, setExcelText] = useState("");
  const [excelDefaultClass, setExcelDefaultClass] = useState("sp5.1");
  const [isSubmittingExcel, setIsSubmittingExcel] = useState(false);
  const [excelError, setExcelError] = useState("");

  // Modal State: Edit Mahasiswa
  const [studentToEdit, setStudentToEdit] = useState<StudentRosterRecord | null>(null);
  const [editNim, setEditNim] = useState("");
  const [editName, setEditName] = useState("");
  const [editClass, setEditClass] = useState("");
  const [editCustomClass, setEditCustomClass] = useState("");
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  // Modal State: Hapus 1 Mahasiswa
  const [studentToDelete, setStudentToDelete] = useState<StudentRosterRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal State: Hapus Mahasiswa per Kelas
  const [showDeleteClassModal, setShowDeleteClassModal] = useState(false);
  const [deleteClassTarget, setDeleteClassTarget] = useState("");
  const [deleteClassInput, setDeleteClassInput] = useState("");
  const [isDeletingClass, setIsDeletingClass] = useState(false);

  // Modal State: Hapus Semua Mahasiswa (Reset Semester)
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteAllInput, setDeleteAllInput] = useState("");
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  // Modal State: Reset Password Mahasiswa
  const [studentToReset, setStudentToReset] = useState<StudentRosterRecord | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Load Data Roster Lengkap
  const fetchRoster = async () => {
    setLoading(true);
    const res = await getStudentRosterAction("all");
    if (res.success) {
      setStudents(res.students);
    } else if (res.message) {
      showNotice("error", res.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoster();
  }, []);

  const showNotice = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCopyNim = (nim: string) => {
    navigator.clipboard.writeText(nim);
    setCopiedNim(nim);
    setTimeout(() => setCopiedNim(null), 1500);
  };

  // Daftar kelas unik dari database (prioritas sp5.1 terdepan)
  const existingClasses = useMemo(() => {
    const list = Array.from(new Set(students.map((s) => s.classGroup))).filter(Boolean);
    if (!list.includes("sp5.1")) list.unshift("sp5.1");
    return list.sort((a, b) => (a === "sp5.1" ? -1 : b === "sp5.1" ? 1 : a.localeCompare(b)));
  }, [students]);

  // Filter & Search Mahasiswa (Secara Default Menyaring Kelas sp5.1)
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchClass = selectedClass === "all" || s.classGroup === selectedClass;
      return matchSearch && matchClass;
    });
  }, [students, searchQuery, selectedClass]);

  // Statistik Kelas
  const classBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach((s) => {
      counts[s.classGroup] = (counts[s.classGroup] || 0) + 1;
    });
    return counts;
  }, [students]);

  // Real-time Parser Mahasiswa dari Teks Excel yang di-paste
  const parsedExcelStudents = useMemo(() => {
    if (!excelText.trim()) return [];
    return parseRawStudentsText(excelText, excelDefaultClass);
  }, [excelText, excelDefaultClass]);

  // Cek duplikat NIM dalam teks Excel yang di-paste
  const excelDuplicateNims = useMemo(() => {
    const seen = new Set<string>();
    const dupes = new Set<string>();
    for (const s of parsedExcelStudents) {
      if (seen.has(s.nim)) {
        dupes.add(s.nim);
      } else {
        seen.add(s.nim);
      }
    }
    return Array.from(dupes);
  }, [parsedExcelStudents]);

  // Handler Ekspor Data Mahasiswa & Rekap Nilai ke CSV (Excel UTF-8 BOM)
  const handleExportData = async (exportClass = selectedClass) => {
    setIsExporting(true);
    try {
      const res = await exportStudentsAndGradesAction(exportClass);
      if (res.success && res.csvContent) {
        const blob = new Blob([res.csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = res.filename || `rekap_mahasiswa_${exportClass}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showNotice("success", `File ${res.filename} berhasil diunduh (${res.count} mahasiswa).`);
      } else {
        showNotice("error", res.message || "Gagal mengekspor data.");
      }
    } catch (err: unknown) {
      showNotice("error", err instanceof Error ? err.message : "Terjadi kesalahan saat ekspor data");
    } finally {
      setIsExporting(false);
    }
  };

  // Handler Tambah Mahasiswa Manual
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setIsSubmittingAdd(true);

    const targetClass = addClass === "custom" ? addCustomClass.trim() : addClass;

    const res = await addSingleStudentAction({
      nim: addNim,
      fullName: addName,
      classGroup: targetClass || "sp5.1",
    });

    if (res.success) {
      showNotice("success", res.message);
      setShowAddModal(false);
      setAddNim("");
      setAddName("");
      setAddCustomClass("");
      await fetchRoster();
      if (onRefreshParent) onRefreshParent();
    } else {
      setAddError(res.message);
    }
    setIsSubmittingAdd(false);
  };

  // Handler Simpan Mahasiswa dari Copy-Paste Excel Langsung
  const handleSaveExcelImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedExcelStudents.length === 0) return;
    setIsSubmittingExcel(true);
    setExcelError("");

    const res = await bulkImportStudentsAction(excelText, excelDefaultClass);
    if (res.success) {
      showNotice("success", res.message);
      setShowExcelModal(false);
      setExcelText("");
      await fetchRoster();
      if (onRefreshParent) onRefreshParent();
    } else {
      setExcelError(res.message);
    }
    setIsSubmittingExcel(false);
  };

  // Handler Edit Mahasiswa
  const openEditModal = (stu: StudentRosterRecord) => {
    setStudentToEdit(stu);
    setEditNim(stu.nim);
    setEditName(stu.fullName);
    if (existingClasses.includes(stu.classGroup)) {
      setEditClass(stu.classGroup);
      setEditCustomClass("");
    } else {
      setEditClass("custom");
      setEditCustomClass(stu.classGroup);
    }
    setEditError("");
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentToEdit) return;
    setEditError("");
    setIsSubmittingEdit(true);

    const targetClass = editClass === "custom" ? editCustomClass.trim() : editClass;

    const res = await updateStudentAction({
      currentNim: studentToEdit.nim,
      newNim: editNim,
      fullName: editName,
      classGroup: targetClass || "sp5.1",
    });

    if (res.success) {
      showNotice("success", res.message);
      setStudentToEdit(null);
      await fetchRoster();
      if (onRefreshParent) onRefreshParent();
    } else {
      setEditError(res.message);
    }
    setIsSubmittingEdit(false);
  };

  // Handler Hapus 1 Mahasiswa
  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);

    const res = await deleteStudentAction(studentToDelete.nim);
    if (res.success) {
      showNotice("success", res.message);
      setStudentToDelete(null);
      await fetchRoster();
      if (onRefreshParent) onRefreshParent();
    } else {
      showNotice("error", res.message);
    }
    setIsDeleting(false);
  };

  // Handler Hapus Mahasiswa per Kelas
  const openDeleteClassModal = (cls: string) => {
    setDeleteClassTarget(cls);
    setDeleteClassInput("");
    setShowDeleteClassModal(true);
  };

  const handleConfirmDeleteClass = async () => {
    if (!deleteClassTarget || deleteClassInput !== deleteClassTarget) return;
    setIsDeletingClass(true);

    const res = await deleteStudentsByClassAction(deleteClassTarget);
    if (res.success) {
      showNotice("success", res.message);
      setShowDeleteClassModal(false);
      if (selectedClass === deleteClassTarget) {
        setSelectedClass("all");
      }
      await fetchRoster();
      if (onRefreshParent) onRefreshParent();
    } else {
      showNotice("error", res.message);
    }
    setIsDeletingClass(false);
  };

  // Handler Hapus Semua Mahasiswa (Reset Semester)
  const handleConfirmDeleteAll = async () => {
    if (deleteAllInput !== "HAPUS SEMUA") return;
    setIsDeletingAll(true);

    const res = await deleteAllStudentsAction();
    if (res.success) {
      showNotice("success", res.message);
      setShowDeleteAllModal(false);
      setDeleteAllInput("");
      await fetchRoster();
      if (onRefreshParent) onRefreshParent();
    } else {
      showNotice("error", res.message);
    }
    setIsDeletingAll(false);
  };

  // Handler Reset Password Mahasiswa
  const handleConfirmReset = async () => {
    if (!studentToReset) return;
    setIsResetting(true);

    const res = await resetStudentPasswordByLecturerAction(studentToReset.nim);
    if (res.success) {
      showNotice("success", res.message);
      setStudentToReset(null);
      await fetchRoster();
    } else {
      showNotice("error", res.message);
    }
    setIsResetting(false);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getClassBadgeColor = (classGroup: string) => {
    const lower = classGroup.toLowerCase();
    if (lower.includes("sp5.1")) return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25";
    if (lower.includes("a")) return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25";
    if (lower.includes("b")) return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/25";
    return "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-500/25";
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-md transition-all ${
            notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
              : "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/80 shadow-xs bg-card/60 backdrop-blur-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Mahasiswa
              </p>
              <h3 className="text-2xl font-black text-foreground">{students.length}</h3>
              <p className="text-[11px] text-muted-foreground">Roster aktif terdaftar di database</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {Object.entries(classBreakdown).slice(0, 3).map(([className, count]) => (
          <Card
            key={className}
            onClick={() => setSelectedClass(className)}
            className={`border shadow-xs bg-card/60 backdrop-blur-xs cursor-pointer transition-all hover:border-emerald-500/40 ${
              selectedClass === className ? "ring-2 ring-emerald-500/40 border-emerald-500/50" : "border-border/80"
            }`}
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate flex items-center gap-1.5">
                  <span>Kelas {className}</span>
                  {selectedClass === className && (
                    <Badge variant="outline" className="text-[9px] py-0 px-1 bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                      Aktif
                    </Badge>
                  )}
                </p>
                <h3 className="text-2xl font-black text-foreground">{count}</h3>
                <p className="text-[11px] text-muted-foreground">Mahasiswa terdaftar</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controls Bar: Search, Filter, Action Buttons */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border shadow-xs">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari NIM atau Nama Mahasiswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-input bg-background/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-mono"
            />
          </div>

          {/* Filter Kelas (Default sp5.1) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer font-medium"
            >
              <option value="sp5.1">
                Kelas sp5.1 ({students.filter((s) => s.classGroup === "sp5.1").length})
              </option>
              <option value="all">Semua Kelas ({students.length})</option>
              {existingClasses
                .filter((c) => c !== "sp5.1")
                .map((c) => (
                  <option key={c} value={c}>
                    Kelas {c} ({students.filter((s) => s.classGroup === c).length})
                  </option>
                ))}
            </select>
          </div>

          {/* Refresh Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchRoster}
            disabled={loading}
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            title="Segarkan Data"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>

          {/* Tombol Ekspor CSV */}
          <Button
            onClick={() => handleExportData(selectedClass)}
            variant="outline"
            size="sm"
            disabled={isExporting || students.length === 0}
            className="h-9 gap-1.5 text-xs font-semibold rounded-xl border-border hover:bg-muted cursor-pointer"
            title={selectedClass === "all" ? "Ekspor seluruh mahasiswa & nilai" : `Ekspor data mahasiswa & nilai kelas ${selectedClass}`}
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            )}
            <span>
              {isExporting
                ? "Mengekspor..."
                : selectedClass === "all"
                ? "Ekspor CSV (Semua)"
                : `Ekspor CSV (${selectedClass})`}
            </span>
          </Button>
        </div>

        {/* Action Buttons Group */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Tombol Import Excel Langsung (Fitur Utama Copy-Paste) */}
          <Button
            onClick={() => {
              setExcelDefaultClass(selectedClass !== "all" ? selectedClass : "sp5.1");
              setExcelError("");
              setShowExcelModal(true);
            }}
            size="sm"
            className="h-9 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>📋 Paste dari Excel</span>
          </Button>

          {/* Tombol Tambah Manual */}
          <Button
            onClick={() => setShowAddModal(true)}
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs font-semibold rounded-xl border-border hover:bg-muted cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-muted-foreground" />
            <span>+ Manual</span>
          </Button>

          {/* Tombol Hapus per Kelas (aktif saat kelas spesifik dipilih) */}
          {selectedClass !== "all" && selectedClass !== "Dosen Pengampu" && (
            <Button
              onClick={() => openDeleteClassModal(selectedClass)}
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 text-xs border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 font-semibold rounded-xl cursor-pointer"
              title={`Hapus seluruh mahasiswa kelas ${selectedClass}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Kelas {selectedClass}</span>
            </Button>
          )}

          {/* Tombol Kosongkan Semua (Reset Tahun Ajaran Baru) */}
          <Button
            onClick={() => {
              setDeleteAllInput("");
              setShowDeleteAllModal(true);
            }}
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs border-zinc-300 dark:border-zinc-800 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-600 text-muted-foreground font-semibold rounded-xl cursor-pointer"
            title="Kosongkan seluruh data mahasiswa untuk persiapan tahun ajaran baru"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>Kosongkan Semua</span>
          </Button>
        </div>
      </div>

      {/* Main Students Table */}
      <Card className="border border-border shadow-xs bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Mahasiswa</th>
                <th className="py-3 px-4">NIM</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Status Sandi</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
                    <span>Memuat data roster mahasiswa dari Supabase...</span>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold text-foreground">Tidak ada mahasiswa yang ditemukan</p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {searchQuery
                        ? `Tidak ada data yang cocok dengan "${searchQuery}".`
                        : `Belum ada mahasiswa yang terdaftar di kelas "${selectedClass}". Tekan tombol "📋 Paste dari Excel" di atas untuk menambahkan.`}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu, idx) => (
                  <tr key={stu.nim} className="hover:bg-muted/30 transition-colors">
                    {/* No */}
                    <td className="py-3.5 px-4 text-center font-mono text-[11px] text-muted-foreground">
                      {idx + 1}
                    </td>

                    {/* Mahasiswa Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                          {getInitials(stu.fullName)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate max-w-xs sm:max-w-md">
                            {stu.fullName}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            ID Roster #{stu.nim}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* NIM & Copy */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleCopyNim(stu.nim)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 font-mono text-xs font-semibold text-foreground transition-colors cursor-pointer group"
                        title="Klik untuk menyalin NIM"
                      >
                        <span>{stu.nim}</span>
                        {copiedNim === stu.nim ? (
                          <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                        ) : (
                          <Copy className="w-3 h-3 text-muted-foreground group-hover:text-foreground shrink-0 opacity-60" />
                        )}
                      </button>
                    </td>

                    {/* Kelas Badge */}
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className={`${getClassBadgeColor(stu.classGroup)} text-[11px] font-semibold`}>
                        {stu.classGroup}
                      </Badge>
                    </td>

                    {/* Status Sandi */}
                    <td className="py-3.5 px-4">
                      {stu.hasCustomPassword ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                          <Lock className="w-3 h-3 shrink-0" />
                          <span>Sandi Khusus</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-500/10 border border-zinc-500/20 px-2 py-0.5 rounded-md">
                          <Unlock className="w-3 h-3 shrink-0" />
                          <span>Default (NIM)</span>
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(stu)}
                          className="h-8 px-2.5 text-xs gap-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 cursor-pointer"
                          title="Edit Data Mahasiswa"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Button>

                        {/* Reset Password Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setStudentToReset(stu)}
                          className="h-8 px-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer"
                          title="Reset Kata Sandi ke NIM"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setStudentToDelete(stu)}
                          className="h-8 px-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                          title="Hapus Mahasiswa dari Roster"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ================= MODAL PASTE DARI EXCEL LANGSUNG ================= */}
      {showExcelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />
            <div className="p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                      <span>Import Mahasiswa dari Excel Langsung</span>
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                        Copy-Paste Instan
                      </Badge>
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Pilih kolom tabel di file Excel Anda, tekan <strong>Ctrl+C</strong>, lalu tekan <strong>Ctrl+V</strong> di bawah
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowExcelModal(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Petunjuk Format Kolom Excel */}
              <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-foreground space-y-1.5">
                <div className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <ClipboardPaste className="w-4 h-4" />
                  <span>Format Kolom Excel yang Didukung:</span>
                </div>
                <ul className="text-[11px] text-muted-foreground space-y-1 pl-5 list-disc">
                  <li>
                    <strong>2 Kolom</strong>: <code className="text-foreground font-mono bg-muted px-1 rounded">NIM [TAB] Nama</code> (Otomatis masuk ke Kelas Default yang dipilih di bawah).
                  </li>
                  <li>
                    <strong>3 Kolom</strong>: <code className="text-foreground font-mono bg-muted px-1 rounded">NIM [TAB] Nama [TAB] Kelas</code> (Membaca kelas masing-masing dari kolom 3).
                  </li>
                  <li>
                    <strong>4 Kolom dengan No</strong>: <code className="text-foreground font-mono bg-muted px-1 rounded">No [TAB] NIM [TAB] Nama [TAB] Kelas</code>.
                  </li>
                  <li>
                    Baris header (seperti <em>&quot;NIM&quot;, &quot;Nama&quot;, &quot;Kelas&quot;</em>) otomatis dideteksi dan dilewati.
                  </li>
                </ul>
              </div>

              {excelError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{excelError}</span>
                </div>
              )}

              <form onSubmit={handleSaveExcelImport} className="space-y-4">
                {/* Selector Kelas Default */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-muted/40 border border-border">
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Kelas Default:
                    </label>
                    <p className="text-[11px] text-muted-foreground">
                      Diterapkan jika baris di Excel tidak memiliki kolom kelas
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={excelDefaultClass}
                      onChange={(e) => setExcelDefaultClass(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-xl border border-input bg-background text-foreground font-medium focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
                    >
                      {existingClasses.map((c) => (
                        <option key={c} value={c}>
                          Kelas {c}
                        </option>
                      ))}
                      <option value="custom">+ Kelas Baru...</option>
                    </select>
                    {excelDefaultClass === "custom" && (
                      <input
                        type="text"
                        placeholder="Nama kelas baru..."
                        onChange={(e) => setExcelDefaultClass(e.target.value)}
                        className="px-3 py-1.5 text-xs rounded-xl border border-input bg-background font-medium focus:ring-2 focus:ring-emerald-500/30 w-32"
                      />
                    )}
                  </div>
                </div>

                {/* Textarea Paste */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <span>Area Paste Data Excel:</span>
                    </label>
                    {excelText && (
                      <button
                        type="button"
                        onClick={() => setExcelText("")}
                        className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                      >
                        Bersihkan teks
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={6}
                    value={excelText}
                    onChange={(e) => setExcelText(e.target.value)}
                    placeholder={`Tempelkan (Ctrl+V) langsung data tabel Excel di sini...\nContoh:\n1124102161\tIZZA AULIA MAGHFIROH\tsp5.1\n1123102110\tKIKY RESTU NOVIANSYAH\tsp5.1`}
                    className="w-full p-3.5 text-xs font-mono rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/30 leading-relaxed placeholder:text-muted-foreground"
                    autoFocus
                  />
                </div>

                {/* Live Real-time Parsing Statistics & Preview */}
                {excelText.trim() && (
                  <div className="space-y-3 p-3.5 rounded-xl border border-border bg-card/60">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            parsedExcelStudents.length > 0
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-bold"
                              : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
                          }
                        >
                          {parsedExcelStudents.length} Mahasiswa Terdeteksi
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">
                          dari total {excelText.trim().split(/\r?\n/).filter(Boolean).length} baris
                        </span>
                      </div>

                      {excelDuplicateNims.length > 0 && (
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{excelDuplicateNims.length} NIM duplikat (otomatis di-merge)</span>
                        </span>
                      )}
                    </div>

                    {/* Preview Table (First 10 Rows) */}
                    {parsedExcelStudents.length > 0 && (
                      <div className="max-h-48 overflow-y-auto rounded-lg border border-border/70 overflow-x-auto text-[11px]">
                        <table className="w-full text-left">
                          <thead className="bg-muted/60 text-muted-foreground font-semibold sticky top-0">
                            <tr>
                              <th className="py-1.5 px-3 w-10 text-center">No</th>
                              <th className="py-1.5 px-3">NIM</th>
                              <th className="py-1.5 px-3">Nama Mahasiswa</th>
                              <th className="py-1.5 px-3">Kelas Target</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/60 font-mono">
                            {parsedExcelStudents.slice(0, 10).map((item, idx) => (
                              <tr key={item.nim + idx} className="hover:bg-muted/30">
                                <td className="py-1.5 px-3 text-center text-muted-foreground">
                                  {idx + 1}
                                </td>
                                <td className="py-1.5 px-3 font-bold text-foreground">
                                  {item.nim}
                                </td>
                                <td className="py-1.5 px-3 font-sans text-foreground">
                                  {item.fullName}
                                </td>
                                <td className="py-1.5 px-3">
                                  <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                                    {item.classGroup}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {parsedExcelStudents.length > 10 && (
                          <div className="p-2 text-center text-[10px] text-muted-foreground bg-muted/30 border-t border-border">
                            ... dan {parsedExcelStudents.length - 10} mahasiswa lainnya
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 text-[11px] text-muted-foreground leading-relaxed flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Kata sandi awal setiap mahasiswa baru otomatis disetel sama dengan <strong>NIM masing-masing</strong>.
                  </span>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowExcelModal(false)}
                    disabled={isSubmittingExcel}
                    className="text-xs rounded-xl cursor-pointer"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmittingExcel || parsedExcelStudents.length === 0}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-bold cursor-pointer"
                  >
                    {isSubmittingExcel ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan ke Database...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Simpan {parsedExcelStudents.length} Mahasiswa ke Database</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH MAHASISWA MANUAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">Tambah Mahasiswa Baru</h3>
                    <p className="text-[11px] text-muted-foreground">Daftarkan mahasiswa baru secara manual</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {addError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{addError}</span>
                </div>
              )}

              <form onSubmit={handleAddStudent} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Nomor Induk Mahasiswa (NIM)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 1124102199"
                    value={addNim}
                    onChange={(e) => setAddNim(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Nama Lengkap Mahasiswa
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Rizki Pratama"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Kelas / Rombel</label>
                  <select
                    value={addClass}
                    onChange={(e) => setAddClass(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer font-medium"
                  >
                    {existingClasses.map((c) => (
                      <option key={c} value={c}>
                        Kelas {c}
                      </option>
                    ))}
                    <option value="custom">+ Kelas Baru / Lainnya</option>
                  </select>
                </div>

                {addClass === "custom" && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Nama Kelas Baru</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: sp5.2 atau Kelas C"
                      value={addCustomClass}
                      onChange={(e) => setAddCustomClass(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
                    />
                  </div>
                )}

                <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 text-[11px] text-muted-foreground leading-relaxed">
                  💡 Kata sandi awal mahasiswa otomatis sama dengan <strong>NIM masing-masing</strong>.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddModal(false)}
                    disabled={isSubmittingAdd}
                    className="text-xs rounded-xl cursor-pointer"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmittingAdd}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-semibold cursor-pointer"
                  >
                    {isSubmittingAdd ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Simpan Mahasiswa</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL EDIT MAHASISWA ================= */}
      {studentToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">Edit Data Mahasiswa</h3>
                    <p className="text-[11px] text-muted-foreground">
                      Perbarui nama, kelas, atau koreksi NIM mahasiswa
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setStudentToEdit(null)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {editError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <form onSubmit={handleUpdateStudent} className="space-y-3.5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">
                      Nomor Induk Mahasiswa (NIM)
                    </label>
                    {editNim !== studentToEdit.nim && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                        Koreksi NIM aktif
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={editNim}
                    onChange={(e) => setEditNim(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                  {editNim !== studentToEdit.nim && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 leading-tight">
                      ⚠️ Mengubah NIM akan otomatis mengalihkan riwayat nilai kuis dan praktikum ke NIM baru.
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Nama Lengkap Mahasiswa
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Kelas / Rombel</label>
                  <select
                    value={editClass}
                    onChange={(e) => setEditClass(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer font-medium"
                  >
                    {existingClasses.map((c) => (
                      <option key={c} value={c}>
                        Kelas {c}
                      </option>
                    ))}
                    <option value="custom">+ Kelas Baru / Lainnya</option>
                  </select>
                </div>

                {editClass === "custom" && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Nama Kelas Baru</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: sp5.2 atau Kelas C"
                      value={editCustomClass}
                      onChange={(e) => setEditCustomClass(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setStudentToEdit(null)}
                    disabled={isSubmittingEdit}
                    className="text-xs rounded-xl cursor-pointer"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmittingEdit}
                    className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2 font-semibold cursor-pointer"
                  >
                    {isSubmittingEdit ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Simpan Perubahan</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL KONFIRMASI HAPUS 1 MAHASISWA ================= */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-foreground text-sm">Hapus Mahasiswa?</h3>
              <p className="text-xs text-muted-foreground">
                Apakah Anda yakin ingin menghapus mahasiswa:
              </p>
              <div className="p-3 my-2 rounded-xl bg-muted/60 text-xs font-semibold">
                <p className="text-foreground">{studentToDelete.fullName}</p>
                <p className="text-muted-foreground font-mono text-[11px]">NIM: {studentToDelete.nim} • {studentToDelete.classGroup}</p>
              </div>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 leading-tight">
                ⚠️ Seluruh riwayat kuis dan lembar praktikum mahasiswa ini akan ikut terhapus secara permanen.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStudentToDelete(null)}
                disabled={isDeleting}
                className="flex-1 text-xs rounded-xl cursor-pointer"
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-xl gap-2 font-semibold cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Permanen</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL HAPUS PER KELAS DENGAN KONFIRMASI ================= */}
      {showDeleteClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-bold text-foreground text-base">
                Hapus Seluruh Mahasiswa Kelas {deleteClassTarget}?
              </h3>
              <p className="text-xs text-muted-foreground">
                Tindakan ini akan menghapus permanen seluruh data mahasiswa di kelas:
              </p>
              <div className="p-3 my-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-700 dark:text-rose-300">
                <p className="text-sm font-bold">Kelas: {deleteClassTarget}</p>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  Jumlah: <strong>{students.filter((s) => s.classGroup === deleteClassTarget).length} Mahasiswa</strong>
                </p>
              </div>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 leading-tight">
                ⚠️ Seluruh riwayat pengajuan kuis, lembar pengamatan praktikum, dan chat pemanasan mahasiswa di kelas ini akan dihapus secara permanen.
              </p>
            </div>

            {/* Opsi Ekspor Sebelum Hapus */}
            <div className="pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleExportData(deleteClassTarget)}
                disabled={isExporting}
                className="w-full text-xs rounded-xl gap-2 font-semibold border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Cadangan CSV Kelas {deleteClassTarget} Dulu</span>
              </Button>
            </div>

            {/* Konfirmasi Teks */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <label className="text-xs font-semibold text-foreground">
                Ketik nama kelas: <strong className="text-rose-600 font-mono">{deleteClassTarget}</strong> untuk konfirmasi:
              </label>
              <input
                type="text"
                placeholder={deleteClassTarget}
                value={deleteClassInput}
                onChange={(e) => setDeleteClassInput(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/30 font-semibold"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteClassModal(false)}
                disabled={isDeletingClass}
                className="flex-1 text-xs rounded-xl cursor-pointer"
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmDeleteClass}
                disabled={isDeletingClass || deleteClassInput !== deleteClassTarget}
                className="flex-1 text-xs bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-xl gap-2 font-semibold cursor-pointer"
              >
                {isDeletingClass ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Kelas Ini</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL KOSONGKAN SEMUA MAHASISWA ================= */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-card border border-rose-500/30 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1.5">
              <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/30 text-[10px] font-bold">
                ⚠️ PERSIAPAN TAHUN AJARAN BARU
              </Badge>
              <h3 className="font-bold text-foreground text-base">
                Kosongkan Seluruh Data Mahasiswa?
              </h3>
              <p className="text-xs text-muted-foreground">
                Tindakan ini akan menghapus <strong>seluruh {students.length} mahasiswa</strong> dari semua kelas untuk menyambut semester baru.
              </p>
              <div className="p-3 my-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300">
                <p className="text-[11px] leading-relaxed">
                  Semua riwayat nilai kuis, pengesahan praktikum, dan sesi mahasiswa akan dibersihkan total.
                  <br />
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    🛡️ Akun Dosen Pengampu tetap aman dan tidak akan terhapus.
                  </span>
                </p>
              </div>
            </div>

            {/* Opsi Ekspor Sebelum Hapus */}
            <div className="pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleExportData("all")}
                disabled={isExporting}
                className="w-full text-xs rounded-xl gap-2 font-semibold border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Cadangan Lengkap CSV Mahasiswa & Nilai</span>
              </Button>
            </div>

            {/* Konfirmasi Teks Baku HAPUS SEMUA */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <label className="text-xs font-semibold text-foreground">
                Ketik <strong className="text-rose-600 font-mono">HAPUS SEMUA</strong> untuk konfirmasi:
              </label>
              <input
                type="text"
                placeholder="HAPUS SEMUA"
                value={deleteAllInput}
                onChange={(e) => setDeleteAllInput(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/30 font-bold"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteAllModal(false)}
                disabled={isDeletingAll}
                className="flex-1 text-xs rounded-xl cursor-pointer"
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmDeleteAll}
                disabled={isDeletingAll || deleteAllInput !== "HAPUS SEMUA"}
                className="flex-1 text-xs bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-xl gap-2 font-bold cursor-pointer"
              >
                {isDeletingAll ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengosongkan Database...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Kosongkan Semua Mahasiswa</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL KONFIRMASI RESET PASSWORD ================= */}
      {studentToReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-foreground text-sm">Reset Kata Sandi Mahasiswa?</h3>
              <p className="text-xs text-muted-foreground">
                Kata sandi mahasiswa akan dikembalikan ke nilai awal:
              </p>
              <div className="p-3 my-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <p className="font-bold text-amber-700 dark:text-amber-400">{studentToReset.fullName}</p>
                <p className="text-muted-foreground font-mono text-[11px]">
                  Password Baru = <strong className="text-foreground font-mono">{studentToReset.nim}</strong>
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Mahasiswa dapat langsung login kembali menggunakan NIM sebagai kata sandi.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStudentToReset(null)}
                disabled={isResetting}
                className="flex-1 text-xs rounded-xl cursor-pointer"
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmReset}
                disabled={isResetting}
                className="flex-1 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-xl gap-2 font-semibold cursor-pointer"
              >
                {isResetting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mereset...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Reset ke NIM</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
