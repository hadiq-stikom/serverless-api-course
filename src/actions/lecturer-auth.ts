"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export interface LecturerSession {
  nidn: string;
  fullName: string;
  email?: string;
  role: string;
}

export interface StudentImportItem {
  nim: string;
  fullName: string;
  classGroup: string;
}

// Fallback in-memory jika database Supabase belum terkonfigurasi
const customLecturerPasswords: Record<string, string> = {};
const DEFAULT_LECTURER = {
  nidn: "0012345678",
  fullName: "Dosen Pengampu",
  email: "dosen@universitas.ac.id",
  role: "lecturer",
};

/**
 * Membaca sesi aktif Dosen dari HTTP-only cookie
 */
export async function getLecturerSessionAction(): Promise<{
  isAuthenticated: boolean;
  lecturer: LecturerSession | null;
}> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("lecturer_session")?.value;

    if (!sessionCookie) {
      return { isAuthenticated: false, lecturer: null };
    }

    const lecturer: LecturerSession = JSON.parse(sessionCookie);
    return { isAuthenticated: true, lecturer };
  } catch {
    return { isAuthenticated: false, lecturer: null };
  }
}

/**
 * Autentikasi Dosen menggunakan Username & Password
 */
export async function loginLecturerAction(
  usernameInput: string,
  passwordInput: string
): Promise<{
  success: boolean;
  message: string;
  lecturer?: LecturerSession;
}> {
  const username = usernameInput.trim();
  const password = passwordInput.trim();

  if (!username || !password) {
    return { success: false, message: "Username dan Password wajib diisi." };
  }

  try {
    let lecturerData: LecturerSession | null = null;
    let expectedPassword = customLecturerPasswords[username] || username;

    // Coba periksa ke database Supabase
    const isLiveSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isLiveSupabase) {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase
          .from("lecturers")
          .select("nidn, full_name, email, role")
          .eq("nidn", username)
          .maybeSingle();

        if (data && !error) {
          lecturerData = {
            nidn: data.nidn,
            fullName: data.full_name,
            email: data.email || undefined,
            role: data.role || "lecturer",
          };
        }
      } catch (err) {
        console.warn("Supabase lecturer query fallback:", err);
      }
    }

    // Jika belum tersimpan di Supabase, gunakan default pengampu atau daftarkan username ini
    if (!lecturerData) {
      if (username === DEFAULT_LECTURER.nidn) {
        lecturerData = DEFAULT_LECTURER;
      } else {
        // Izinkan Dosen dengan username baru login sebagai pengampu
        lecturerData = {
          nidn: username,
          fullName: `Dosen Pengampu (${username})`,
          role: "lecturer",
        };
      }
    }

    // Verifikasi password
    if (password !== expectedPassword) {
      return {
        success: false,
        message: "Password salah. Silakan periksa kembali password Anda.",
      };
    }

    // Simpan sesi ke cookie aman (7 hari)
    const cookieStore = await cookies();
    cookieStore.set("lecturer_session", JSON.stringify(lecturerData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // Simpan data dosen ke Supabase jika aktif dan belum tercatat
    if (isLiveSupabase && lecturerData) {
      try {
        const supabase = await createClient();
        await supabase.from("lecturers").upsert(
          {
            nidn: lecturerData.nidn,
            full_name: lecturerData.fullName,
            role: "lecturer",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "nidn" }
        );
      } catch (err) {
        console.warn("Supabase upsert lecturer fallback:", err);
      }
    }

    return {
      success: true,
      message: `Selamat datang, Bapak/Ibu ${lecturerData.fullName}!`,
      lecturer: lecturerData,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan sistem";
    return { success: false, message: `Gagal login: ${errorMsg}` };
  }
}

/**
 * Logout Dosen
 */
export async function logoutLecturerAction(): Promise<{ success: boolean; message: string }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("lecturer_session");
    return { success: true, message: "Berhasil keluar dari sesi Dosen." };
  } catch {
    return { success: false, message: "Gagal menghapus sesi." };
  }
}

/**
 * Ubah Kata Sandi Dosen Mandiri
 */
export async function changeLecturerPasswordAction(
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const session = await getLecturerSessionAction();
  if (!session.isAuthenticated || !session.lecturer) {
    return { success: false, message: "Anda harus login sebagai Dosen terlebih dahulu." };
  }

  const nidn = session.lecturer.nidn;
  const currentPassword = customLecturerPasswords[nidn] || nidn;

  if (oldPassword !== currentPassword) {
    return { success: false, message: "Kata sandi lama tidak sesuai." };
  }

  if (newPassword.length < 5) {
    return { success: false, message: "Kata sandi baru minimal 5 karakter." };
  }

  customLecturerPasswords[nidn] = newPassword;

  return {
    success: true,
    message: "Kata sandi Dosen berhasil diperbarui.",
  };
}

/**
 * Parser teks mentah (CSV / Tab-delimited / Baris Excel) menjadi daftar mahasiswa
 */
function parseRawStudentsText(rawText: string): StudentImportItem[] {
  const lines = rawText.trim().split(/\r?\n/).filter((line) => line.trim().length > 0);
  const items: StudentImportItem[] = [];

  for (const line of lines) {
    // Lewatkan header jika ada
    if (/^(nim|nama|kelas|no|student)/i.test(line.trim())) continue;

    // Dukung pemisah koma, titik koma, atau tab (Excel copy-paste)
    let parts: string[] = [];
    if (line.includes("\t")) {
      parts = line.split("\t");
    } else if (line.includes(";")) {
      parts = line.split(";");
    } else if (line.includes(",")) {
      parts = line.split(",");
    } else {
      parts = line.trim().split(/\s{2,}/); // 2 spasi atau lebih
    }

    if (parts.length >= 2) {
      const nim = parts[0].trim().replace(/['"]/g, "");
      const fullName = parts[1].trim().replace(/['"]/g, "");
      const classGroup = parts[2]?.trim().replace(/['"]/g, "") || "Kelas A";

      if (nim && fullName) {
        items.push({ nim, fullName, classGroup });
      }
    }
  }

  return items;
}

/**
 * Bulk Import / Tambah Mahasiswa ke Database Supabase
 */
export async function bulkImportStudentsAction(
  rawText: string
): Promise<{
  success: boolean;
  message: string;
  count: number;
  imported: StudentImportItem[];
}> {
  const session = await getLecturerSessionAction();
  if (!session.isAuthenticated) {
    return {
      success: false,
      message: "Hanya Dosen yang memiliki hak akses untuk mengimpor data mahasiswa.",
      count: 0,
      imported: [],
    };
  }

  const studentsToImport = parseRawStudentsText(rawText);

  if (studentsToImport.length === 0) {
    return {
      success: false,
      message: "Format tidak dikenali. Gunakan format per baris: NIM, Nama Mahasiswa, Kelas (opsional).",
      count: 0,
      imported: [],
    };
  }

  try {
    const isLiveSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isLiveSupabase) {
      const supabase = await createClient();

      const payload = studentsToImport.map((s) => ({
        nim: s.nim,
        full_name: s.fullName,
        class_group: s.classGroup,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("students")
        .upsert(payload, { onConflict: "nim" });

      if (error) {
        throw new Error(error.message);
      }
    }

    return {
      success: true,
      message: `Berhasil mengimpor ${studentsToImport.length} data mahasiswa ke roster aktif!`,
      count: studentsToImport.length,
      imported: studentsToImport,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
    return {
      success: false,
      message: `Gagal menyimpan ke database: ${errorMsg}`,
      count: 0,
      imported: [],
    };
  }
}
