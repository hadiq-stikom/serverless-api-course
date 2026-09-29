"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { MODULES } from "@/data/curriculum";

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

export interface StudentDashboardData {
  student: StudentSession;
  modules: ModuleSubmissionSummary[];
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
        const supabase = await createClient();
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
          }
        }
      } catch (err) {
        console.warn("Supabase query fallback to local roster:", err);
      }
    }

    // Jika belum ada di Supabase, gunakan seed bawaan atau buat data profil mahasiswa baru secara otomatis
    if (!studentData) {
      if (DEFAULT_SEED_STUDENTS[nim]) {
        studentData = {
          nim,
          fullName: DEFAULT_SEED_STUDENTS[nim].fullName,
          classGroup: DEFAULT_SEED_STUDENTS[nim].classGroup,
        };
      } else {
        // Izinkan mahasiswa baru mendaftar langsung dengan NIM mereka
        studentData = {
          nim,
          fullName: `Mahasiswa (${nim})`,
          classGroup: "Kelas A",
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
      const supabase = await createClient();
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

  customPasswordsStore[nim] = newPassword;

  if (isLiveSupabase) {
    try {
      const supabase = await createClient();
      await supabase
        .from("students")
        .update({
          password_hash: newPassword,
          updated_at: new Date().toISOString(),
        })
        .eq("nim", nim);
    } catch (err) {
      console.warn("Supabase persist password fallback:", err);
    }
  }

  return {
    success: true,
    message: "Kata sandi berhasil diperbarui. Harap ingat kata sandi baru Anda.",
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
      const supabase = await createClient();
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

  if (isLiveSupabase) {
    try {
      const supabase = await createClient();
      const { data: dbSubmissions } = await supabase
        .from("quiz_submissions")
        .select("module_id, total_score, status, current_question_index, reset_count, completed_at, updated_at")
        .eq("student_nim", student.nim);

      if (dbSubmissions && dbSubmissions.length > 0) {
        for (const sub of dbSubmissions) {
          submissionsMap[sub.module_id] = {
            totalScore: Number(sub.total_score) || 0,
            status: sub.status === "completed" ? "completed" : "in_progress",
            currentQuestionIndex: sub.current_question_index || 0,
            resetCount: sub.reset_count || 0,
            completedAt: sub.completed_at || undefined,
            updatedAt: sub.updated_at || undefined,
          };
        }
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

  return {
    success: true,
    data: {
      student,
      modules: modulesSummary,
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
