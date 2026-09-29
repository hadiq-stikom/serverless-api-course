"use server";

import { loginLecturerAction } from "./lecturer-auth";
import { loginStudentAction } from "./student-auth";
import { createClient } from "@/utils/supabase/server";

export interface UnifiedLoginResult {
  success: boolean;
  message: string;
  role?: "student" | "lecturer";
  redirectUrl?: string;
  user?: {
    identifier: string;
    fullName: string;
  };
}

/**
 * Server Action: Smart Unified Login
 * Mengautentikasi Dosen atau Mahasiswa secara otomatis melalui 1 endpoint tunggal.
 */
export async function unifiedLoginAction(
  identifierInput: string,
  passwordInput: string
): Promise<UnifiedLoginResult> {
  const identifier = identifierInput.trim();
  const password = passwordInput.trim();

  if (!identifier || !password) {
    return {
      success: false,
      message: "Nomor Induk dan Kata Sandi wajib diisi.",
    };
  }

  // 1. Cek apakah nomor induk terdaftar sebagai Dosen
  const isDefaultLecturer = identifier === "0012345678";
  let isLecturerInDb = false;

  const isLiveSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  if (isLiveSupabase) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("lecturers")
        .select("nidn")
        .eq("nidn", identifier)
        .maybeSingle();

      if (data) {
        isLecturerInDb = true;
      }
    } catch (err) {
      console.warn("Supabase lecturer check fallback:", err);
    }
  }

  // Jika Dosen, autentikasi melalui alur Dosen
  if (isDefaultLecturer || isLecturerInDb) {
    const lecRes = await loginLecturerAction(identifier, password);
    if (lecRes.success && lecRes.lecturer) {
      return {
        success: true,
        message: `Selamat datang, ${lecRes.lecturer.fullName}!`,
        role: "lecturer",
        redirectUrl: "/dosen",
        user: {
          identifier: lecRes.lecturer.nidn,
          fullName: lecRes.lecturer.fullName,
        },
      };
    } else {
      return {
        success: false,
        message: lecRes.message || "Kata sandi tidak sesuai.",
      };
    }
  }

  // 2. Jika bukan Dosen, proses otomatis sebagai Mahasiswa
  const stuRes = await loginStudentAction(identifier, password);
  if (stuRes.success && stuRes.student) {
    return {
      success: true,
      message: `Selamat datang, ${stuRes.student.fullName}!`,
      role: "student",
      redirectUrl: "/dashboard",
      user: {
        identifier: stuRes.student.nim,
        fullName: stuRes.student.fullName,
      },
    };
  }

  return {
    success: false,
    message: stuRes.message || "Nomor Induk atau Kata Sandi tidak sesuai.",
  };
}
