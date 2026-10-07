"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusCircle, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  FolderGit2,
  Edit3,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  isDeleted?: boolean;
}

interface ProjectRecord {
  id: string;
  userId: string;
  title: string;
  status: string;
}

export function OneToManyRelAnimator() {
  const [activeTab, setActiveTab] = useState<"insert" | "update" | "delete">("insert");
  const [cascadeMode, setCascadeMode] = useState<"cascade" | "restrict">("cascade");

  const initialUsers: UserProfile[] = [
    { id: "usr_01", name: "Sarah Connor", email: "sarah@resistance.org" },
    { id: "usr_02", name: "John Connor", email: "john@resistance.org" },
  ];

  const initialProjects: ProjectRecord[] = [
    { id: "p1", userId: "usr_01", title: "Serverless LMS Platform", status: "Active" },
    { id: "p2", userId: "usr_01", title: "Supabase Realtime Chat", status: "In Progress" },
    { id: "p3", userId: "usr_02", title: "AI Media Generator", status: "Active" },
  ];

  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [projects, setProjects] = useState<ProjectRecord[]>(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("p1");

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    sqlQuery: string;
  } | null>({
    type: "success",
    title: "PostgreSQL Database Engine Ready",
    message: "Relasi 1:N aktif antara profiles(id) dan projects(user_id). Silakan uji operasi INSERT, UPDATE, atau DELETE di bawah.",
    sqlQuery: "-- Status: Database terhubung dan foreign key siap diuji",
  });

  // Handler: Uji Coba INSERT Proyek
  const handleInsert = (isValid: boolean) => {
    if (isValid) {
      const newId = `p${projects.length + 1}`;
      const newProj: ProjectRecord = {
        id: newId,
        userId: "usr_01",
        title: `Next.js Microservice #${projects.length + 1}`,
        status: "Todo",
      };
      setProjects((prev) => [...prev, newProj]);
      setFeedback({
        type: "success",
        title: "INSERT Berhasil (FK Valid)",
        message: 'PostgreSQL memverifikasi bahwa foreign key user_id = "usr_01" valid dan terdaftar di tabel profiles. Baris baru berhasil disimpan!',
        sqlQuery: `INSERT INTO projects (id, user_id, title, status)\nVALUES ('${newId}', 'usr_01', '${newProj.title}', 'Todo');\n-- ✅ STATUS: 201 CREATED (Integritas Terjaga)`,
      });
    } else {
      setFeedback({
        type: "error",
        title: "ERROR: Foreign Key Violation (Penolakan Kernel)",
        message: 'Database menolak keras operasi INSERT! Nilai user_id = "usr_99_ghost" tidak ditemukan di tabel induk profiles. Konsistensi data 100% terlindungi dari data yatim.',
        sqlQuery: `INSERT INTO projects (id, user_id, title, status)\nVALUES ('p_err', 'usr_99_ghost', 'Proyek Ilegal', 'Todo');\n-- ❌ ERROR 23503 (foreign_key_violation):\n-- Key (user_id)=(usr_99_ghost) is not present in table "profiles".`,
      });
    }
  };

  // Handler: Uji Coba UPDATE Foreign Key Proyek
  const handleUpdate = (isValid: boolean) => {
    const targetProj = projects.find((p) => p.id === selectedProjectId);
    if (!targetProj) return;

    if (isValid) {
      const nextOwner = targetProj.userId === "usr_01" ? "usr_02" : "usr_01";
      const nextOwnerName = users.find((u) => u.id === nextOwner)?.name || nextOwner;
      setProjects((prev) =>
        prev.map((p) => (p.id === selectedProjectId ? { ...p, userId: nextOwner } : p))
      );
      setFeedback({
        type: "success",
        title: "UPDATE Berhasil (Reassignment FK)",
        message: `Kepemilikan proyek "${targetProj.title}" berhasil dialihkan ke "${nextOwnerName}" (${nextOwner}). PostgreSQL mengonfirmasi target user_id ada di profiles.`,
        sqlQuery: `UPDATE projects\nSET user_id = '${nextOwner}'\nWHERE id = '${targetProj.id}';\n-- ✅ STATUS: UPDATE 1 (Foreign Key Valid)`,
      });
    } else {
      setFeedback({
        type: "error",
        title: "ERROR: Foreign Key Violation saat UPDATE",
        message: 'Operasi UPDATE dibatalkan oleh kernel PostgreSQL! Anda mencoba mengubah user_id menjadi "usr_hantu_404" yang tidak ada di profiles.',
        sqlQuery: `UPDATE projects\nSET user_id = 'usr_hantu_404'\nWHERE id = '${targetProj.id}';\n-- ❌ ERROR 23503 (foreign_key_violation):\n-- Key (user_id)=(usr_hantu_404) is not present in table "profiles".`,
      });
    }
  };

  // Handler: Uji Coba DELETE Parent Record
  const handleDeleteUser = () => {
    const targetUserId = "usr_01";
    const referencedProjects = projects.filter((p) => p.userId === targetUserId);

    if (cascadeMode === "restrict") {
      setFeedback({
        type: "error",
        title: "ERROR: RESTRICT Menolak Penghapusan Parent",
        message: `Tabel profiles tidak boleh menghapus "usr_01" karena masih memiliki ${referencedProjects.length} proyek anak yang bergantung padanya! Hapus proyek anaknya terlebih dahulu.`,
        sqlQuery: `DELETE FROM profiles WHERE id = 'usr_01';\n-- ❌ ERROR 23503 (foreign_key_violation):\n-- update or delete on table "profiles" violates foreign key constraint "projects_user_id_fkey" on table "projects".\n-- DETAIL: Key (id)=(usr_01) is still referenced from table "projects".`,
      });
      return;
    }

    // ON DELETE CASCADE: Hapus user 1 beserta seluruh proyek miliknya secara atomik
    setUsers((prev) => prev.map((u) => (u.id === targetUserId ? { ...u, isDeleted: true } : u)));
    setProjects((prev) => prev.filter((p) => p.userId !== targetUserId));
    setFeedback({
      type: "success",
      title: "ON DELETE CASCADE: Pembersihan Otomatis Atomik",
      message: `User "usr_01" berhasil dihapus. PostgreSQL secara otomatis membersihkan seluruh ${referencedProjects.length} proyek anak yang terikat tanpa meninggalkan data yatim (orphaned records).`,
      sqlQuery: `DELETE FROM profiles WHERE id = 'usr_01';\n-- ✅ STATUS: DELETE 1\n-- ⚡ CASCADE EFFECT: ${referencedProjects.length} baris di tabel projects otomatis dibersihkan atomik oleh kernel database!`,
    });
  };

  // Reset Simulasi
  const handleReset = () => {
    setUsers(initialUsers);
    setProjects(initialProjects);
    setSelectedProjectId("p1");
    setFeedback({
      type: "success",
      title: "Simulasi Di-reset ke Data Semula",
      message: "Data tabel profiles dan projects telah dikembalikan ke kondisi awal.",
      sqlQuery: "-- Status: Data awal dipulihkan",
    });
  };

  return (
    <div className="border border-border/80 rounded-2xl p-5 md:p-6 bg-card/90 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
              Pilar 1.2: Relasi 1:N &amp; Integritas Kernel
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">INSERT • UPDATE • DELETE</span>
          </div>
          <h4 className="text-base font-bold text-foreground mt-1">
            Simulasi Penegakan Integritas Foreign Key (1:N) di PostgreSQL
          </h4>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleReset}
          className="text-xs gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Reset Simulasi</span>
        </Button>
      </div>

      {/* Operasional Tabs Switcher: INSERT vs UPDATE vs DELETE */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-muted/60 border border-border/80">
        <button
          type="button"
          onClick={() => setActiveTab("insert")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "insert"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>1. Uji Operasi INSERT</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("update")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "update"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>2. Uji Operasi UPDATE (Reassign FK)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("delete")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "delete"
              ? "bg-rose-600 text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Trash2 className="w-4 h-4" />
          <span>3. Uji Operasi DELETE (CASCADE vs RESTRICT)</span>
        </button>
      </div>

      {/* Action Controller Panel Sesuai Tab Aktif */}
      <div className="p-4 rounded-xl border border-border/70 bg-muted/30 space-y-3">
        {activeTab === "insert" && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-emerald-500" />
                Uji Aturan Foreign Key saat INSERT Anak:
              </span>
              <p className="text-[11px] text-muted-foreground">
                Coba simpan proyek baru dengan user_id yang sah vs user_id hantu yang tidak ada di tabel profiles.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                onClick={() => handleInsert(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Insert Proyek Valid (usr_01)</span>
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleInsert(false)}
                className="text-xs gap-1.5 cursor-pointer shadow-xs"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Insert FK Ilegal (usr_99_ghost)</span>
              </Button>
            </div>
          </div>
        )}

        {activeTab === "update" && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-blue-500" />
                Uji Aturan Foreign Key saat UPDATE Pemilik Proyek:
              </span>
              <p className="text-[11px] text-muted-foreground">
                Pilih proyek, lalu uji pengalihan kepemilikan ke pengguna sah lain vs ke ID pengguna yang tidak ada.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="text-xs font-mono p-1.5 rounded-lg border border-border bg-card text-foreground"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.userId})
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                onClick={() => handleUpdate(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Reassign ke User Sah</span>
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleUpdate(false)}
                className="text-xs gap-1.5 cursor-pointer shadow-xs"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Update ke FK Hantu</span>
              </Button>
            </div>
          </div>
        )}

        {activeTab === "delete" && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-rose-500" />
                Pilih Mode Proteksi Foreign Key:
              </span>
              <div className="flex items-center gap-1 bg-muted p-1 rounded-lg w-fit border border-border/60">
                <button
                  type="button"
                  onClick={() => setCascadeMode("cascade")}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    cascadeMode === "cascade"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  CASCADE (Hapus Atomik)
                </button>
                <button
                  type="button"
                  onClick={() => setCascadeMode("restrict")}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    cascadeMode === "restrict"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  RESTRICT (Tolak Hapus Parent)
                </button>
              </div>
            </div>

            <Button
              size="sm"
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={users.find((u) => u.id === "usr_01")?.isDeleted}
              className="text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Sarah Connor (usr_01)</span>
            </Button>
          </div>
        )}
      </div>

      {/* Relational Table Visualizer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        {/* Parent Table: profiles */}
        <div className="p-4 rounded-xl border border-border/80 bg-card space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-500" />
              Tabel Induk: profiles (Parent 1)
            </span>
            <Badge variant="outline" className="text-[10px] font-mono">
              {users.filter((u) => !u.isDeleted).length} Baris Aktif
            </Badge>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {users.map((usr) =>
                !usr.isDeleted ? (
                  <motion.div
                    key={usr.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, backgroundColor: "rgba(239, 68, 68, 0.15)" }}
                    className={`p-3 rounded-xl border text-xs font-mono transition-all ${
                      usr.id === "usr_01"
                        ? "bg-emerald-500/5 border-emerald-500/30"
                        : "bg-blue-500/5 border-blue-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">id: {usr.id}</span>
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[10px] border-emerald-500/30">
                        PRIMARY KEY
                      </Badge>
                    </div>
                    <div className="text-muted-foreground mt-1">
                      name: <strong className="text-foreground">{usr.name}</strong>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">{usr.email}</div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`del-${usr.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 rounded-xl bg-destructive/10 border border-dashed border-destructive/40 text-center text-xs"
                  >
                    <span className="font-bold text-destructive">Record {usr.id} Telah Dihapus</span>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Child Table: projects */}
        <div className="p-4 rounded-xl border border-border/80 bg-card space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <FolderGit2 className="w-4 h-4 text-blue-500" />
              Tabel Anak: projects (Child N)
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              user_id REFERENCES profiles(id)
            </span>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            <AnimatePresence>
              {projects.length > 0 ? (
                projects.map((proj) => {
                  const owner = users.find((u) => u.id === proj.userId);
                  const isOwnerSarah = proj.userId === "usr_01";
                  const isSelected = proj.id === selectedProjectId;

                  return (
                    <motion.div
                      key={proj.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`p-2.5 rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${
                        isSelected && activeTab === "update"
                          ? "ring-2 ring-blue-500 border-blue-500/40 bg-blue-500/10"
                          : "bg-muted/40 border-border/80"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-foreground flex items-center gap-1.5">
                          <span>{proj.title}</span>
                          <span className="text-[10px] font-normal text-muted-foreground">({proj.id})</span>
                        </div>
                        <div className="text-[11px] flex items-center gap-1.5 mt-0.5">
                          <span className="text-muted-foreground">FK user_id:</span>
                          <span
                            className={`font-bold px-1.5 py-0.2 rounded ${
                              isOwnerSarah
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                                : "bg-blue-500/15 text-blue-700 dark:text-blue-400"
                            }`}
                          >
                            {proj.userId} ({owner?.name.split(" ")[0] || "Deleted"})
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                        {proj.status}
                      </Badge>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 rounded-xl bg-muted/40 border border-dashed border-border/80 text-center space-y-1 text-xs text-muted-foreground"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                  <div className="font-bold text-foreground">
                    Semua Proyek usr_01 Terhapus Otomatis
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Zero orphaned data. Klausa ON DELETE CASCADE membersihkan seluruh baris anak yang bersangkutan.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Live Terminal & PostgreSQL Engine Response */}
      {feedback && (
        <motion.div
          key={feedback.title}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${
            feedback.type === "error"
              ? "bg-destructive/10 text-destructive border-destructive/40"
              : "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30"
          }`}
        >
          <div className="flex items-center gap-2 font-bold">
            {feedback.type === "error" ? (
              <ShieldAlert className="w-4 h-4 text-destructive shrink-0" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            )}
            <span>{feedback.title}</span>
          </div>
          <p className="text-[11px] leading-relaxed">{feedback.message}</p>

          <div className="p-2.5 rounded-lg bg-zinc-950 text-zinc-200 text-[11px] overflow-x-auto space-y-1 border border-zinc-800">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] pb-1 border-b border-zinc-800">
              <Terminal className="w-3 h-3" />
              <span>Query Execution &amp; PostgreSQL Kernel Response:</span>
            </div>
            <pre className="text-zinc-100 whitespace-pre leading-relaxed">{feedback.sqlQuery}</pre>
          </div>
        </motion.div>
      )}

      {/* DDL Architecture Legend */}
      <div className="p-3.5 rounded-xl border border-border/80 bg-muted/40 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] bg-background font-mono">
            DDL Constraint
          </Badge>
          <span>
            <code>user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE</code>
          </span>
        </div>
        <span className="text-[11px]">
          Integritas 100% dijamin di tingkat kernel PostgreSQL, bukan sekadar di kode aplikasi.
        </span>
      </div>
    </div>
  );
}
