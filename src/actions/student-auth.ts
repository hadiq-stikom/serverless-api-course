"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { MODULES } from "@/data/curriculum";
import { PRACTICUM_MODULES } from "@/data/practicum";
import { getLecturerSessionAction } from "./lecturer-auth";

export interface StudentSession {
  nim: string;
  fullName: string;
  classGroup: string;
}

export interface ModuleSubmissionSummary {
  moduleId: number;
  moduleTitle: string;
  worldTitle: string;
  weekNumber: number;
  totalScore: number;
  status: "not_started" | "in_progress" | "completed";
  currentQuestionIndex: number;
  resetCount: number;
  xpEarned: number;
  completedAt?: string;
  updatedAt?: string;
}

export interface StudentPracticumItem {
  id: number;
  title: string;
  lectureModule: number;
  capaian: string;
  themeColor: string;
  themeBadge: string;
  actionHook: string;
  techPills: string[];
  level: "Fundamental" | "Intermediate" | "Advanced";
  durationMinutes: number;
  totalSteps: number;
  submissionId?: string;
  status: "not_started" | "draft" | "submitted" | "approved" | "revision";
  analysisScore: number | null;
  conclusionScore: number | null;
  isPassed: boolean;
  hasStudentSignature: boolean;
  hasLecturerSignature: boolean;
  approvedByName?: string | null;
  pdfPath?: string | null;
  submittedAt?: string | null;
  approvedAt?: string | null;
  observationsCount: number;
}

export interface StudentPracticumStats {
  totalPracticums: number;
  approvedCount: number;
  submittedCount: number;
  draftCount: number;
  notStartedCount: number;
  averageScore: number;
}

export interface StudentDashboardData {
  student: StudentSession;
  modules: ModuleSubmissionSummary[];
  practicums: StudentPracticumItem[];
  practicumStats: StudentPracticumStats;
  stats: {
    totalModules: number;
    completedCount: number;
    inProgressCount: number;
    averageScore: number;
    totalXp: number;
    masteryLevel: string;
    gradeLetter: "A" | "B+" | "B" | "C" | "D";
    improvementOpportunitiesCount: number;
    totalResets: number;
  };
}

const DEFAULT_SEED_STUDENTS: Record<string, { fullName: string; classGroup: string; customPassword?: string }> = {
  "202401001": { fullName: "Budi Santoso", classGroup: "Kelas A" },
  "202401002": { fullName: "Siti Rahmawati", classGroup: "Kelas A" },
  "202401003": { fullName: "Ahmad Fauzi", classGroup: "Kelas A" },
  "202401004": { fullName: "Dewi Lestari", classGroup: "Kelas B" },
  "202401005": { fullName: "Reza Pratama", classGroup: "Kelas B" },
};

// In-memory password store fallback (for local dev without live database)
const customPasswordsStore: Record<string, string> = {};

/**
 * Mendapatkan sesi mahasiswa aktif dari HTTP-only cookie
 */
export async function getStudentSessionAction(): Promise<{
  isAuthenticated: boolean;
  student: StudentSession | null;
}> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("student_session")?.value;

    if (!sessionCookie) {
      return { isAuthenticated: false, student: null };
    }

    const student: StudentSession = JSON.parse(sessionCookie);
    return { isAuthenticated: true, student };
  } catch {
    return { isAuthenticated: false, student: null };
  }
}

/**
 * Autentikasi Mahasiswa berbasis NIM & Password (Default = NIM)
 */
export async function loginStudentAction(
  nimInput: string,
  passwordInput: string
): Promise<{
  success: boolean;
  message: string;
  student?: StudentSession;
}> {
  const nim = nimInput.trim();
  const password = passwordInput.trim();

  if (!nim || !password) {
    return { success: false, message: "NIM dan Kata Sandi wajib diisi." };
  }

  try {
    let studentData: StudentSession | null = null;
    let expectedPassword = customPasswordsStore[nim] || nim;

    // Coba periksa ke database Supabase jika kredensial terisi
    const isLiveSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isLiveSupabase) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from("students")
          .select("nim, full_name, class_group, password_hash")
          .eq("nim", nim)
          .maybeSingle();

        if (data && !error) {
          studentData = {
            nim: data.nim,
            fullName: data.full_name,
            classGroup: data.class_group || "Kelas A",
          };
          if (data.password_hash) {
            expectedPassword = data.password_hash;
            customPasswordsStore[nim] = data.password_hash;
          }
        }
      } catch (err) {
        console.warn("Supabase query fallback to local roster:", err);
      }
    }

    // Jika belum ada di Supabase atau seed lokal, tolak login
    if (!studentData) {
      if (DEFAULT_SEED_STUDENTS[nim]) {
        studentData = {
          nim,
          fullName: DEFAULT_SEED_STUDENTS[nim].fullName,
          classGroup: DEFAULT_SEED_STUDENTS[nim].classGroup,
        };
      } else {
        return {
          success: false,
          message: "NIM tidak terdaftar di daftar mahasiswa. Silakan hubungi Dosen Pengampu untuk dimasukkan ke roster kelas.",
        };
      }
    }

    // Verifikasi password (default adalah NIM)
    if (password !== expectedPassword) {
      return {
        success: false,
        message: "Kata sandi salah. Jika belum pernah diubah, kata sandi awal adalah NIM Anda.",
      };
    }

    // Simpan sesi ke cookie aman (7 hari)
    const cookieStore = await cookies();
    cookieStore.set("student_session", JSON.stringify(studentData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return {
      success: true,
      message: `Selamat datang, ${studentData.fullName}!`,
      student: studentData,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan sistem";
    return { success: false, message: `Gagal login: ${errorMsg}` };
  }
}

/**
 * Logout Mahasiswa
 */
export async function logoutStudentAction(): Promise<{ success: boolean; message: string }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("student_session");
    return { success: true, message: "Berhasil keluar dari sesi kuis." };
  } catch {
    return { success: false, message: "Gagal menghapus sesi." };
  }
}

/**
 * Dosen masuk ke mode praktikum menggunakan identitas dosen sebagai instruktur kelas
 */
export async function loginAsLecturerGuideAction(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const lecRes = await getLecturerSessionAction();
    if (!lecRes.isAuthenticated || !lecRes.lecturer) {
      return {
        success: false,
        message: "Sesi dosen tidak valid. Silakan login ke Portal Dosen terlebih dahulu.",
      };
    }
    const lecturer = lecRes.lecturer;
    const instructorStudent: StudentSession = {
      nim: lecturer.nidn || "0012345678",
      fullName: lecturer.fullName || "Dosen Pengampu",
      classGroup: "Dosen Pengampu",
    };

    // Upsert ke database students jika live supabase agar aman relasi foreign key
    const isLiveSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isLiveSupabase) {
      try {
        const supabase = await createClient();
        await supabase.from("students").upsert(
          {
            nim: instructorStudent.nim,
            full_name: instructorStudent.fullName,
            class_group: instructorStudent.classGroup,
            password_hash: instructorStudent.nim,
          },
          { onConflict: "nim" }
        );
      } catch (err) {
        console.warn("Gagal upsert akun instruktur dosen ke tabel students:", err);
      }
    }

    const cookieStore = await cookies();
    cookieStore.set("student_session", JSON.stringify(instructorStudent), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return {
      success: true,
      message: `Mode panduan aktif untuk ${instructorStudent.fullName}`,
    };
  } catch (err) {
    return {
      success: false,
      message: "Terjadi kesalahan sistem saat mengaktifkan mode instruktur dosen.",
    };
  }
}

/**
 * Ubah Kata Sandi Mandiri oleh Mahasiswa
 */
export async function changeStudentPasswordAction(
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const session = await getStudentSessionAction();
  if (!session.isAuthenticated || !session.student) {
    return { success: false, message: "Anda harus login terlebih dahulu." };
  }

  const nim = session.student.nim;
  let currentPassword = customPasswordsStore[nim] || nim;

  const isLiveSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  if (isLiveSupabase) {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("students")
        .select("password_hash")
        .eq("nim", nim)
        .maybeSingle();
      if (data?.password_hash) {
        currentPassword = data.password_hash;
      }
    } catch (err) {
      console.warn("Supabase fetch current password fallback:", err);
    }
  }

  if (oldPassword !== currentPassword) {
    return { success: false, message: "Kata sandi lama tidak sesuai." };
  }

  if (newPassword.length < 4) {
    return { success: false, message: "Kata sandi baru minimal 4 karakter." };
  }

  // Update memory cache
  customPasswordsStore[nim] = newPassword;

  // Persist ke Supabase database dengan upsert agar terjamin tersimpan
  if (isLiveSupabase) {
    try {
      const supabase = createAdminClient();
      const { error: upsertErr } = await supabase.from("students").upsert(
        {
          nim: nim,
          full_name: session.student.fullName,
          class_group: session.student.classGroup || "Kelas A",
          password_hash: newPassword,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "nim" }
      );

      if (upsertErr) {
        console.error("Gagal menyimpan password mahasiswa ke Supabase:", upsertErr);
      }
    } catch (err) {
      console.warn("Supabase persist password fallback:", err);
    }
  }

  return {
    success: true,
    message: "Kata sandi berhasil diperbarui secara permanen. Harap ingat kata sandi baru Anda.",
  };
}

/**
 * Reset Kata Sandi Mahasiswa ke NIM (Otoritas Dosen)
 */
export async function resetStudentPasswordByLecturerAction(
  targetNim: string
): Promise<{ success: boolean; message: string }> {
  delete customPasswordsStore[targetNim];

  const isLiveSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  if (isLiveSupabase) {
    try {
      const supabase = createAdminClient();
      await supabase
        .from("students")
        .update({
          password_hash: null,
          updated_at: new Date().toISOString(),
        })
        .eq("nim", targetNim);
    } catch (err) {
      console.warn("Supabase reset student password fallback:", err);
    }
  }

  return {
    success: true,
    message: `Kata sandi untuk NIM ${targetNim} berhasil di-reset kembali ke nilai default (NIM).`,
  };
}

/**
 * Server Action: Mengambil data komprehensif Mahasiswa untuk Dashboard
 */
export async function getStudentDashboardDataAction(): Promise<{
  success: boolean;
  message?: string;
  data?: StudentDashboardData;
}> {
  const sessionRes = await getStudentSessionAction();
  if (!sessionRes.isAuthenticated || !sessionRes.student) {
    return {
      success: false,
      message: "Sesi tidak ditemukan. Silakan masuk terlebih dahulu.",
    };
  }

  const student = sessionRes.student;
  const submissionsMap: Record<number, {
    totalScore: number;
    status: "in_progress" | "completed";
    currentQuestionIndex: number;
    resetCount: number;
    completedAt?: string;
    updatedAt?: string;
  }> = {};

  const isLiveSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  let dbPracticumSubs: any[] = [];
  let dbPracticumEssays: any[] = [];
  let dbPracticumObs: any[] = [];

  if (isLiveSupabase) {
    try {
      const supabase = await createClient();
      const { data: dbSubmissions } = await supabase
        .from("quiz_submissions")
        .select("id, module_id, total_score, status, current_question_index, reset_count, completed_at, updated_at")
        .eq("student_nim", student.nim);

      if (dbSubmissions && dbSubmissions.length > 0) {
        const subIds = dbSubmissions.map((s) => s.id);
        const { data: dbAnswers } = await supabase
          .from("quiz_answers")
          .select("submission_id, question_number, score")
          .in("submission_id", subIds);

        const answersBySubId = new Map<string, any[]>();
        (dbAnswers || []).forEach((a) => {
          const list = answersBySubId.get(a.submission_id) || [];
          list.push(a);
          answersBySubId.set(a.submission_id, list);
        });

        for (const sub of dbSubmissions) {
          let scoreToUse = Number(sub.total_score) || 0;
          const answersForThisSub = answersBySubId.get(sub.id) || [];
          if (answersForThisSub.length > 0) {
            const maxPerQ: Record<number, number> = {};
            answersForThisSub.forEach((a) => {
              const q = Number(a.question_number);
              maxPerQ[q] = Math.max(maxPerQ[q] || 0, Number(a.score) || 0);
            });
            const bestScores = Object.values(maxPerQ);
            if (bestScores.length > 0) {
              const targetMod = MODULES.find((m) => m.id === sub.module_id);
              const totalQ = targetMod?.quiz?.questions.length || bestScores.length || 1;
              const divisor = sub.status === "completed" ? totalQ : bestScores.length;
              scoreToUse = Math.round((bestScores.reduce((acc, sc) => acc + sc, 0) / divisor) * 10) / 10;
            }
          }

          submissionsMap[sub.module_id] = {
            totalScore: scoreToUse,
            status: sub.status === "completed" ? "completed" : "in_progress",
            currentQuestionIndex: sub.current_question_index || 0,
            resetCount: sub.reset_count || 0,
            completedAt: sub.completed_at || undefined,
            updatedAt: sub.updated_at || undefined,
          };
        }
      }

      // Query Practicum Submissions
      try {
        const { data: pSubs } = await supabase
          .from("practicum_submissions")
          .select("id, practicum_id, status, student_signature, lecturer_signature, approved_by_name, pdf_path, submitted_at, approved_at, updated_at")
          .eq("student_nim", student.nim);
        dbPracticumSubs = pSubs || [];

        if (dbPracticumSubs.length > 0) {
          const subIds = dbPracticumSubs.map((s) => s.id);
          const { data: essays } = await supabase
            .from("practicum_essays")
            .select("submission_id, essay_type, ai_score, is_passed")
            .in("submission_id", subIds);
          dbPracticumEssays = essays || [];

          const { data: obs } = await supabase
            .from("practicum_observations")
            .select("submission_id, step_number, observation")
            .in("submission_id", subIds);
          dbPracticumObs = obs || [];
        }
      } catch (pErr) {
        console.warn("Supabase practicum fetch fallback:", pErr);
      }
    } catch (err) {
      console.warn("Supabase dashboard data fetch fallback:", err);
    }
  }

  // Petakan 16 Modul
  let totalScoreSum = 0;
  let completedCount = 0;
  let inProgressCount = 0;
  let totalResets = 0;
  let totalXp = 0;

  const modulesSummary: ModuleSubmissionSummary[] = MODULES.map((mod) => {
    const sub = submissionsMap[mod.id];
    let status: "not_started" | "in_progress" | "completed" = "not_started";
    let totalScore = 0;
    let currentQuestionIndex = 0;
    let resetCount = 0;
    let xpEarned = 0;

    if (sub) {
      status = sub.status;
      totalScore = sub.totalScore;
      currentQuestionIndex = sub.currentQuestionIndex;
      resetCount = sub.resetCount;
      totalResets += resetCount;

      if (status === "completed") {
        completedCount++;
        totalScoreSum += totalScore;
        xpEarned = mod.xp;
        totalXp += xpEarned;
      } else if (status === "in_progress") {
        inProgressCount++;
      }
    }

    return {
      moduleId: mod.id,
      moduleTitle: mod.title,
      worldTitle: mod.worldTitle,
      weekNumber: mod.weekNumber,
      totalScore,
      status,
      currentQuestionIndex,
      resetCount,
      xpEarned,
      completedAt: sub?.completedAt,
      updatedAt: sub?.updatedAt,
    };
  });

  const averageScore = completedCount > 0 ? Math.round((totalScoreSum / completedCount) * 10) / 10 : 0;

  // Grade Letter
  let gradeLetter: "A" | "B+" | "B" | "C" | "D" = "D";
  if (averageScore >= 85) gradeLetter = "A";
  else if (averageScore >= 80) gradeLetter = "B+";
  else if (averageScore >= 75) gradeLetter = "B";
  else if (averageScore >= 60) gradeLetter = "C";

  // Mastery Level Title
  let masteryLevel = "Novice Explorer";
  if (averageScore >= 90 && completedCount >= 3) {
    masteryLevel = "Elite Cloud Architect";
  } else if (averageScore >= 80 && completedCount >= 1) {
    masteryLevel = "Serverless Specialist";
  } else if (completedCount >= 1) {
    masteryLevel = "Apprentice Engineer";
  }

  // Modul yang sudah selesai tapi nilai < 95 (Peluang Perbaikan Nilai)
  const improvementOpportunitiesCount = modulesSummary.filter(
    (m) => m.status === "completed" && m.totalScore < 95
  ).length;

  // Petakan 7 Modul Praktikum Terpadu
  const pSubMap = new Map<number, any>();
  dbPracticumSubs.forEach((s) => pSubMap.set(s.practicum_id, s));

  const essaysBySub = new Map<string, any[]>();
  dbPracticumEssays.forEach((e) => {
    const arr = essaysBySub.get(e.submission_id) || [];
    arr.push(e);
    essaysBySub.set(e.submission_id, arr);
  });

  const obsCountBySub = new Map<string, number>();
  dbPracticumObs.forEach((o) => {
    if (o.observation && o.observation.trim().length > 0) {
      obsCountBySub.set(o.submission_id, (obsCountBySub.get(o.submission_id) || 0) + 1);
    }
  });

  let approvedPracticumCount = 0;
  let submittedPracticumCount = 0;
  let draftPracticumCount = 0;
  let practicumScoreSum = 0;
  let evaluatedPracticumCount = 0;

  const practicumsSummary: StudentPracticumItem[] = PRACTICUM_MODULES.map((pm) => {
    const sub = pSubMap.get(pm.id);
    let status: "not_started" | "draft" | "submitted" | "approved" | "revision" = "not_started";
    let analysisScore: number | null = null;
    let conclusionScore: number | null = null;
    let isPassed = false;
    let hasStudentSignature = false;
    let hasLecturerSignature = false;
    let approvedByName: string | null = null;
    let pdfPath: string | null = null;
    let submittedAt: string | null = null;
    let approvedAt: string | null = null;
    let observationsCount = 0;

    if (sub) {
      status = sub.status || "draft";
      hasStudentSignature = !!sub.student_signature;
      hasLecturerSignature = !!sub.lecturer_signature;
      approvedByName = sub.approved_by_name || null;
      pdfPath = sub.pdf_path || null;
      submittedAt = sub.submitted_at || null;
      approvedAt = sub.approved_at || null;
      observationsCount = obsCountBySub.get(sub.id) || 0;

      const essays = essaysBySub.get(sub.id) || [];
      const analysis = essays.find((e) => e.essay_type === "analysis");
      const conclusion = essays.find((e) => e.essay_type === "conclusion");

      if (analysis) analysisScore = analysis.ai_score;
      if (conclusion) conclusionScore = conclusion.ai_score;

      if (analysis && conclusion && analysis.is_passed && conclusion.is_passed) {
        isPassed = true;
      }

      if (status === "approved") {
        approvedPracticumCount++;
      } else if (status === "submitted") {
        submittedPracticumCount++;
      } else if (status === "draft" || status === "revision") {
        draftPracticumCount++;
      }

      if (analysisScore !== null || conclusionScore !== null) {
        const scores = [analysisScore, conclusionScore].filter((s): s is number => s !== null);
        if (scores.length > 0) {
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
          practicumScoreSum += avg;
          evaluatedPracticumCount++;
        }
      }
    }

    return {
      id: pm.id,
      title: pm.title,
      lectureModule: pm.lectureModule,
      capaian: pm.capaian,
      themeColor: pm.theme.color,
      themeBadge: pm.theme.badge,
      actionHook: pm.actionHook,
      techPills: pm.techPills,
      level: pm.level,
      durationMinutes: pm.durationMinutes,
      totalSteps: pm.steps.length,
      submissionId: sub?.id,
      status,
      analysisScore,
      conclusionScore,
      isPassed,
      hasStudentSignature,
      hasLecturerSignature,
      approvedByName,
      pdfPath,
      submittedAt,
      approvedAt,
      observationsCount,
    };
  });

  const notStartedPracticumCount = PRACTICUM_MODULES.length - (approvedPracticumCount + submittedPracticumCount + draftPracticumCount);
  const practicumAverageScore = evaluatedPracticumCount > 0 ? Math.round((practicumScoreSum / evaluatedPracticumCount) * 10) / 10 : 0;

  return {
    success: true,
    data: {
      student,
      modules: modulesSummary,
      practicums: practicumsSummary,
      practicumStats: {
        totalPracticums: PRACTICUM_MODULES.length,
        approvedCount: approvedPracticumCount,
        submittedCount: submittedPracticumCount,
        draftCount: draftPracticumCount,
        notStartedCount: notStartedPracticumCount,
        averageScore: practicumAverageScore,
      },
      stats: {
        totalModules: MODULES.length,
        completedCount,
        inProgressCount,
        averageScore,
        totalXp,
        masteryLevel,
        gradeLetter,
        improvementOpportunitiesCount,
        totalResets,
      },
    },
  };
}
