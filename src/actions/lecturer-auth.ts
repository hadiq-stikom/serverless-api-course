"use server";

import { cookies } from "next/headers";
import crypto from "node:crypto";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { parseRawStudentsText, type StudentImportItem } from "@/utils/student-parser";

export type { StudentImportItem };

export interface LecturerSession {
  nidn: string;
  fullName: string;
  email?: string;
  role: string;
}

// Fallback in-memory jika database Supabase belum terkonfigurasi
const customLecturerPasswords: Record<string, string> = {};
const DEFAULT_LECTURER = {
  nidn: "0012345678",
  fullName: "Hadiq, ST, M.Kom",
  email: "hadiq@stikombanyuwangi.ac.id",
  role: "lecturer",
};

/**
 * Helper: Menghasilkan token tanda tangan HMAC kriptografis untuk sesi Dosen
 */
function generateLecturerSessionToken(nidn: string, secretHash: string): string {
  const secretKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.CRON_SECRET ||
    "fallback-lecturer-crypto-salt-2026";
  return crypto
    .createHmac("sha256", secretKey)
    .update(`${nidn}:${secretHash}`)
    .digest("hex");
}

/**
 * Membaca sesi aktif Dosen dari HTTP-only cookie dengan verifikasi tanda tangan kriptografis & DB Supabase
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

    let parsedCookie: any = null;
    try {
      parsedCookie = JSON.parse(sessionCookie);
    } catch {
      return { isAuthenticated: false, lecturer: null };
    }

    // 1. Cek token kriptografis: Jika tidak memiliki token sah (format lama/palsu), batalkan sesi seketika!
    if (!parsedCookie || !parsedCookie.nidn || !parsedCookie.token) {
      try {
        cookieStore.delete("lecturer_session");
      } catch {}
      return { isAuthenticated: false, lecturer: null };
    }

    // 2. Verifikasi aktif ke database Supabase apakah NIDN masih sah terdaftar di tabel lecturers
    const isLiveSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    let currentPasswordHash = parsedCookie.nidn;
    let lecturerData: LecturerSession | null = null;

    if (isLiveSupabase) {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("lecturers")
        .select("nidn, full_name, email, role, password_hash")
        .eq("nidn", parsedCookie.nidn)
        .maybeSingle();

      if (error || !data) {
        // NIDN sudah tidak ada di database (akun siluman/dihapus) -> tolak & buang sesi!
        try {
          cookieStore.delete("lecturer_session");
        } catch {}
        return { isAuthenticated: false, lecturer: null };
      }

      lecturerData = {
        nidn: data.nidn,
        fullName: data.full_name,
        email: data.email || undefined,
        role: data.role || "lecturer",
      };
      currentPasswordHash = data.password_hash || data.nidn;
    } else {
      if (parsedCookie.nidn !== DEFAULT_LECTURER.nidn) {
        return { isAuthenticated: false, lecturer: null };
      }
      lecturerData = DEFAULT_LECTURER;
      currentPasswordHash = customLecturerPasswords[parsedCookie.nidn] || DEFAULT_LECTURER.nidn;
    }

    // 3. Verifikasi signature HMAC token (mencegah cookie dimodifikasi atau password yang sudah diganti)
    const expectedToken = generateLecturerSessionToken(parsedCookie.nidn, currentPasswordHash);
    if (parsedCookie.token !== expectedToken) {
      try {
        cookieStore.delete("lecturer_session");
      } catch {}
      return { isAuthenticated: false, lecturer: null };
    }

    return { isAuthenticated: true, lecturer: lecturerData };
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
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from("lecturers")
          .select("nidn, full_name, email, role, password_hash")
          .eq("nidn", username)
          .maybeSingle();

        if (data && !error) {
          lecturerData = {
            nidn: data.nidn,
            fullName: data.full_name,
            email: data.email || undefined,
            role: data.role || "lecturer",
          };
          if (data.password_hash) {
            expectedPassword = data.password_hash;
            customLecturerPasswords[username] = data.password_hash;
          }
        }
      } catch (err) {
        console.warn("Supabase lecturer query fallback:", err);
      }
    }

    // Jika belum tersimpan di Supabase, hanya izinkan default pengampu saat offline
    if (!lecturerData) {
      if (username === DEFAULT_LECTURER.nidn) {
        lecturerData = DEFAULT_LECTURER;
      } else {
        return {
          success: false,
          message: "Username atau NIDN tidak terdaftar sebagai Dosen Pengampu.",
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

    // Buat cryptographic session token untuk menjamin otentisitas sesi
    const sessionToken = generateLecturerSessionToken(lecturerData.nidn, expectedPassword);
    const cookiePayload = {
      nidn: lecturerData.nidn,
      fullName: lecturerData.fullName,
      email: lecturerData.email,
      role: lecturerData.role,
      token: sessionToken,
    };

    // Simpan sesi ke cookie aman (7 hari)
    const cookieStore = await cookies();
    cookieStore.set("lecturer_session", JSON.stringify(cookiePayload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

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
  let currentPassword = customLecturerPasswords[nidn] || nidn;

  const isLiveSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  if (isLiveSupabase) {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("lecturers")
        .select("password_hash")
        .eq("nidn", nidn)
        .maybeSingle();

      if (data?.password_hash) {
        currentPassword = data.password_hash;
      }
    } catch (err) {
      console.warn("Supabase fetch current lecturer password fallback:", err);
    }
  }

  if (oldPassword !== currentPassword) {
    return { success: false, message: "Kata sandi lama tidak sesuai." };
  }

  if (newPassword.length < 5) {
    return { success: false, message: "Kata sandi baru minimal 5 karakter." };
  }

  // Update memory cache
  customLecturerPasswords[nidn] = newPassword;

  // Persist ke Supabase database
  if (isLiveSupabase) {
    try {
      const supabase = createAdminClient();
      const { error: upsertErr } = await supabase.from("lecturers").upsert(
        {
          nidn: nidn,
          full_name: session.lecturer.fullName,
          role: session.lecturer.role || "lecturer",
          password_hash: newPassword,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "nidn" }
      );

      if (upsertErr) {
        console.error("Gagal menyimpan password dosen ke Supabase:", upsertErr);
      }
    } catch (err) {
      console.warn("Supabase persist lecturer password fallback:", err);
    }
  }

  // Perbarui cookie sesi aktif dengan token tanda tangan baru
  const newToken = generateLecturerSessionToken(nidn, newPassword);
  const cookieStore = await cookies();
  cookieStore.set(
    "lecturer_session",
    JSON.stringify({
      nidn,
      fullName: session.lecturer.fullName,
      email: session.lecturer.email,
      role: session.lecturer.role || "lecturer",
      token: newToken,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    }
  );

  return {
    success: true,
    message: "Kata sandi Dosen berhasil diperbarui secara permanen.",
  };
}


/**
 * Bulk Import / Tambah Mahasiswa ke Database Supabase (Langsung Copy-Paste dari Excel)
 */
export async function bulkImportStudentsAction(
  rawText: string,
  defaultClass = "sp5.1"
): Promise<{
  success: boolean;
  message: string;
  count: number;
  imported: StudentImportItem[];
}> {
  const session = await getLecturerSessionAction();
  if (!session.isAuthenticated || !session.lecturer) {
    return {
      success: false,
      message: "Hanya Dosen yang memiliki hak akses untuk mengimpor data mahasiswa.",
      count: 0,
      imported: [],
    };
  }

  const studentsToImport = parseRawStudentsText(rawText, defaultClass);

  if (studentsToImport.length === 0) {
    return {
      success: false,
      message:
        "Tidak ada baris mahasiswa valid yang terdeteksi. Pastikan terdapat kolom NIM dan Nama (bisa langsung copy-paste dari Excel).",
      count: 0,
      imported: [],
    };
  }

  try {
    const isLiveSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isLiveSupabase) {
      const supabase = createAdminClient();

      const payload = studentsToImport.map((s) => ({
        nim: s.nim,
        full_name: s.fullName,
        class_group: s.classGroup || defaultClass,
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
      message: `Berhasil mengimpor / memperbarui ${studentsToImport.length} data mahasiswa ke database!`,
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

export interface StudentRosterRecord {
  nim: string;
  fullName: string;
  classGroup: string;
  hasCustomPassword: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Server Action: Mengambil data mahasiswa lengkap untuk tabel Manajemen Mahasiswa di Dashboard Dosen
 */
export async function getStudentRosterAction(classGroup = "all"): Promise<{
  success: boolean;
  students: StudentRosterRecord[];
  message?: string;
}> {
  const session = await getLecturerSessionAction();
  if (!session.isAuthenticated || !session.lecturer) {
    return {
      success: false,
      students: [],
      message: "Unauthorized: Sesi Dosen tidak valid.",
    };
  }

  try {
    const isLiveSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isLiveSupabase) {
      const supabase = createAdminClient();
      let query = supabase
        .from("students")
        .select("nim, full_name, class_group, password_hash, created_at, updated_at")
        .order("nim", { ascending: true });

      if (classGroup !== "all") {
        query = query.eq("class_group", classGroup);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);

      const mapped: StudentRosterRecord[] = (data || []).map((s: any) => ({
        nim: s.nim,
        fullName: s.full_name || `Mahasiswa (${s.nim})`,
        classGroup: s.class_group || "Kelas A",
        hasCustomPassword: !!s.password_hash && s.password_hash !== s.nim,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
      }));

      return { success: true, students: mapped };
    }

    return { success: true, students: [] };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
    return { success: false, students: [], message: errorMsg };
  }
}

/**
 * Server Action: Tambah 1 Mahasiswa Baru secara manual oleh Dosen
 */
export async function addSingleStudentAction(studentData: {
  nim: string;
  fullName: string;
  classGroup: string;
}): Promise<{ success: boolean; message: string }> {
  const session = await getLecturerSessionAction();
  if (!session.isAuthenticated || !session.lecturer) {
    return { success: false, message: "Unauthorized: Sesi Dosen tidak valid." };
  }

  const nim = studentData.nim.trim();
  const fullName = studentData.fullName.trim();
  const classGroup = studentData.classGroup.trim() || "Kelas A";

  if (!nim || !fullName) {
    return { success: false, message: "NIM dan Nama Lengkap wajib diisi." };
  }

  if (nim.length < 5) {
    return { success: false, message: "NIM minimal terdiri dari 5 digit/karakter." };
  }

  try {
    const isLiveSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isLiveSupabase) {
      const supabase = createAdminClient();

      // Cek apakah NIM sudah ada
      const { data: existing } = await supabase
        .from("students")
        .select("nim")
        .eq("nim", nim)
        .maybeSingle();

      if (existing) {
        return {
          success: false,
          message: `NIM ${nim} sudah terdaftar di sistem. Gunakan tombol Edit jika ingin memperbarui datanya.`,
        };
      }

      const { error } = await supabase.from("students").insert({
        nim,
        full_name: fullName,
        class_group: classGroup,
        password_hash: null, // default NIM
        updated_at: new Date().toISOString(),
      });

      if (error) throw new Error(error.message);
    }

    return {
      success: true,
      message: `Mahasiswa ${fullName} (${nim}) berhasil ditambahkan ke ${classGroup}!`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
    return { success: false, message: `Gagal menambahkan mahasiswa: ${errorMsg}` };
  }
}

/**
 * Server Action: Perbarui Data Mahasiswa (Nama, Kelas, atau Koreksi NIM) oleh Dosen
 */
export async function updateStudentAction(payload: {
  currentNim: string;
  newNim?: string;
  fullName: string;
  classGroup: string;
}): Promise<{ success: boolean; message: string }> {
  const session = await getLecturerSessionAction();
  if (!session.isAuthenticated || !session.lecturer) {
    return { success: false, message: "Unauthorized: Sesi Dosen tidak valid." };
  }

  const currentNim = payload.currentNim.trim();
  const newNim = payload.newNim?.trim() || currentNim;
  const fullName = payload.fullName.trim();
  const classGroup = payload.classGroup.trim() || "Kelas A";

  if (!currentNim || !fullName) {
    return { success: false, message: "NIM dan Nama Lengkap wajib diisi." };
  }

  try {
    const isLiveSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isLiveSupabase) {
      const supabase = createAdminClient();

      // Jika NIM dikoreksi/diubah
      if (newNim !== currentNim) {
        // Cek apakah newNim sudah dipakai oleh orang lain
        const { data: existing } = await supabase
          .from("students")
          .select("nim")
          .eq("nim", newNim)
          .maybeSingle();

        if (existing) {
          return {
            success: false,
            message: `NIM baru (${newNim}) sudah digunakan oleh mahasiswa lain.`,
          };
        }

        // Ambil data lama termasuk password_hash
        const { data: oldStudent } = await supabase
          .from("students")
          .select("password_hash")
          .eq("nim", currentNim)
          .single();

        // 1. Insert row baru dengan newNim
        const { error: insErr } = await supabase.from("students").insert({
          nim: newNim,
          full_name: fullName,
          class_group: classGroup,
          password_hash: oldStudent?.password_hash || null,
          updated_at: new Date().toISOString(),
        });
        if (insErr) throw new Error(insErr.message);

        // 2. Alihkan relasi child foreign keys ke newNim
        await supabase
          .from("quiz_submissions")
          .update({ student_nim: newNim })
          .eq("student_nim", currentNim);

        await supabase
          .from("practicum_submissions")
          .update({ student_nim: newNim })
          .eq("student_nim", currentNim);

        await supabase
          .from("student_warmup_chats")
          .update({ student_nim: newNim })
          .eq("student_nim", currentNim);

        // 3. Hapus row lama
        await supabase.from("students").delete().eq("nim", currentNim);
      } else {
        // Update nama dan kelas pada NIM yang sama
        const { error } = await supabase
          .from("students")
          .update({
            full_name: fullName,
            class_group: classGroup,
            updated_at: new Date().toISOString(),
          })
          .eq("nim", currentNim);

        if (error) throw new Error(error.message);
      }
    }

    return {
      success: true,
      message: `Data mahasiswa ${fullName} (${newNim}) berhasil diperbarui!`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
    return { success: false, message: `Gagal memperbarui data: ${errorMsg}` };
  }
}

/**
 * Server Action: Hapus Mahasiswa dari Roster oleh Dosen
 */
export async function deleteStudentAction(
  nim: string
): Promise<{ success: boolean; message: string }> {
  const session = await getLecturerSessionAction();
  if (!session.isAuthenticated || !session.lecturer) {
    return { success: false, message: "Unauthorized: Sesi Dosen tidak valid." };
  }

  const targetNim = nim.trim();
  if (!targetNim) {
    return { success: false, message: "NIM mahasiswa wajib disertakan." };
  }

  try {
    const isLiveSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isLiveSupabase) {
      const supabase = createAdminClient();

      const { data: stu } = await supabase
        .from("students")
        .select("full_name")
        .eq("nim", targetNim)
        .maybeSingle();

      const studentName = stu?.full_name || targetNim;

      const { error } = await supabase
        .from("students")
        .delete()
        .eq("nim", targetNim);

      if (error) throw new Error(error.message);

      return {
        success: true,
        message: `Mahasiswa ${studentName} (${targetNim}) berhasil dihapus dari roster.`,
      };
    }

    return { success: true, message: `Mahasiswa ${targetNim} berhasil dihapus.` };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
    return { success: false, message: `Gagal menghapus mahasiswa: ${errorMsg}` };
  }
}

/**
 * Server Action: Hapus Semua Mahasiswa dalam Kelas Tertentu beserta Data Terkait
 */
export async function deleteStudentsByClassAction(
  classGroup: string
): Promise<{ success: boolean; message: string; count: number }> {
  const session = await getLecturerSessionAction();
  if (!session.isAuthenticated || !session.lecturer) {
    return { success: false, message: "Unauthorized: Sesi Dosen tidak valid.", count: 0 };
  }

  const targetClass = classGroup.trim();
  if (!targetClass || targetClass === "all") {
    return { success: false, message: "Pilih kelas spesifik yang ingin dihapus.", count: 0 };
  }

  if (targetClass.toLowerCase() === "dosen pengampu") {
    return { success: false, message: "Kelas akun Dosen tidak dapat dihapus.", count: 0 };
  }

  try {
    const isLiveSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isLiveSupabase) {
      const supabase = createAdminClient();

      // Ambil seluruh NIM mahasiswa di kelas target
      const { data: studentsInClass, error: findErr } = await supabase
        .from("students")
        .select("nim")
        .eq("class_group", targetClass);

      if (findErr) throw new Error(findErr.message);

      const nims = (studentsInClass || []).map((s: { nim: string }) => s.nim);
      if (nims.length === 0) {
        return {
          success: false,
          message: `Tidak ada mahasiswa yang terdaftar di kelas "${targetClass}".`,
          count: 0,
        };
      }

      // Bersihkan data submissions & chats terkait
      await supabase.from("quiz_submissions").delete().in("student_nim", nims);
      await supabase.from("practicum_submissions").delete().in("student_nim", nims);
      await supabase.from("student_warmup_chats").delete().in("student_nim", nims);

      // Hapus data mahasiswa di kelas tersebut
      const { error: delErr } = await supabase
        .from("students")
        .delete()
        .eq("class_group", targetClass);

      if (delErr) throw new Error(delErr.message);

      return {
        success: true,
        message: `Berhasil menghapus ${nims.length} mahasiswa dari kelas "${targetClass}" beserta seluruh riwayat nilai kuis dan praktikum mereka.`,
        count: nims.length,
      };
    }

    return {
      success: true,
      message: `Mahasiswa kelas ${targetClass} berhasil dihapus.`,
      count: 0,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
    return { success: false, message: `Gagal menghapus mahasiswa kelas: ${errorMsg}`, count: 0 };
  }
}

/**
 * Server Action: Hapus Seluruh Mahasiswa (Persiapan Semester / Tahun Ajaran Baru)
 */
export async function deleteAllStudentsAction(): Promise<{
  success: boolean;
  message: string;
  count: number;
}> {
  const session = await getLecturerSessionAction();
  if (!session.isAuthenticated || !session.lecturer) {
    return { success: false, message: "Unauthorized: Sesi Dosen tidak valid.", count: 0 };
  }

  try {
    const isLiveSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isLiveSupabase) {
      const supabase = createAdminClient();

      // Dapatkan seluruh mahasiswa non-dosen
      const { data: allStudents, error: findErr } = await supabase
        .from("students")
        .select("nim, class_group")
        .neq("class_group", "Dosen Pengampu");

      if (findErr) throw new Error(findErr.message);

      const nims = (allStudents || []).map((s: { nim: string }) => s.nim);
      if (nims.length === 0) {
        return {
          success: true,
          message: "Database mahasiswa sudah dalam keadaan bersih/kosong.",
          count: 0,
        };
      }

      // Bersihkan seluruh submission kuis, praktikum, dan chat pemanasan
      await supabase.from("quiz_submissions").delete().in("student_nim", nims);
      await supabase.from("practicum_submissions").delete().in("student_nim", nims);
      await supabase.from("student_warmup_chats").delete().in("student_nim", nims);

      // Hapus seluruh baris mahasiswa non-dosen
      const { error: delErr } = await supabase
        .from("students")
        .delete()
        .neq("class_group", "Dosen Pengampu");

      if (delErr) throw new Error(delErr.message);

      return {
        success: true,
        message: `Berhasil mengosongkan total ${nims.length} mahasiswa dari seluruh kelas untuk persiapan tahun ajaran baru.`,
        count: nims.length,
      };
    }

    return {
      success: true,
      message: "Seluruh data mahasiswa berhasil dibersihkan.",
      count: 0,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
    return { success: false, message: `Gagal mengosongkan database mahasiswa: ${errorMsg}`, count: 0 };
  }
}

/**
 * Server Action: Ekspor Data Mahasiswa & Rekap Nilai (Format CSV UTF-8 BOM untuk Excel)
 */
export async function exportStudentsAndGradesAction(
  classGroup = "all"
): Promise<{
  success: boolean;
  message: string;
  csvContent?: string;
  filename?: string;
  count?: number;
}> {
  const session = await getLecturerSessionAction();
  if (!session.isAuthenticated || !session.lecturer) {
    return { success: false, message: "Unauthorized: Sesi Dosen tidak valid." };
  }

  try {
    const isLiveSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    let students: any[] = [];
    let submissions: any[] = [];
    let practicums: any[] = [];

    if (isLiveSupabase) {
      const supabase = createAdminClient();

      let stuQuery = supabase
        .from("students")
        .select("nim, full_name, class_group, password_hash, created_at")
        .order("class_group")
        .order("nim");

      if (classGroup !== "all") {
        stuQuery = stuQuery.eq("class_group", classGroup);
      }

      const { data: stuData, error: stuErr } = await stuQuery;
      if (stuErr) throw new Error(stuErr.message);
      students = stuData || [];

      // Ambil rekap kuis
      const { data: subData } = await supabase
        .from("quiz_submissions")
        .select("student_nim, module_id, status, total_score");
      submissions = subData || [];

      // Ambil rekap praktikum
      const { data: pracData } = await supabase
        .from("practicum_submissions")
        .select("student_nim, practicum_id, status");
      practicums = pracData || [];
    }

    if (students.length === 0) {
      return { success: false, message: "Tidak ada data mahasiswa untuk diekspor." };
    }

    // Bangun CSV Header
    const headers = [
      "No",
      "NIM",
      "Nama Mahasiswa",
      "Kelas",
      "Status Sandi",
      "Kuis Selesai",
      "Rata-rata Skor Kuis",
      "Praktikum Disetujui",
      "Tanggal Terdaftar",
    ];

    const escapeCsv = (val: string | number | undefined | null) => {
      const str = String(val ?? "");
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = students.map((stu, idx) => {
      // Hitung skor kuis
      const stuSubs = submissions.filter((s) => s.student_nim === stu.nim);
      const completedSubs = stuSubs.filter((s) => s.status === "completed");
      const avgScore =
        completedSubs.length > 0
          ? (
              completedSubs.reduce((acc, curr) => acc + (Number(curr.total_score) || 0), 0) /
              completedSubs.length
            ).toFixed(1)
          : "0.0";

      // Hitung praktikum
      const stuPracs = practicums.filter((p) => p.student_nim === stu.nim);
      const approvedPracs = stuPracs.filter((p) => p.status === "approved").length;

      const passwordStatus =
        stu.password_hash && stu.password_hash !== stu.nim ? "Sandi Khusus" : "Default (NIM)";

      const createdAtFormatted = stu.created_at
        ? new Date(stu.created_at).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "-";

      return [
        escapeCsv(idx + 1),
        escapeCsv(stu.nim),
        escapeCsv(stu.full_name),
        escapeCsv(stu.class_group),
        escapeCsv(passwordStatus),
        escapeCsv(`${completedSubs.length}/16 Modul`),
        escapeCsv(avgScore),
        escapeCsv(`${approvedPracs}/7 Praktikum`),
        escapeCsv(createdAtFormatted),
      ].join(",");
    });

    // UTF-8 BOM (\uFEFF) untuk kompatibilitas penuh Microsoft Excel
    const csvContent = "\uFEFF" + [headers.map(escapeCsv).join(","), ...rows].join("\r\n");

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const classTag = classGroup === "all" ? "semua_kelas" : classGroup.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `rekap_mahasiswa_${classTag}_${dateStr}.csv`;

    return {
      success: true,
      message: `Berhasil mengekspor ${students.length} data mahasiswa.`,
      csvContent,
      filename,
      count: students.length,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
    return { success: false, message: `Gagal mengekspor data: ${errorMsg}` };
  }
}
