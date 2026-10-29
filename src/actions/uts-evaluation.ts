"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { getLecturerSessionAction } from "@/actions/lecturer-auth";
import { calculateUtsFinalScore } from "@/lib/uts-calculator";

export interface UtsEvaluationRow {
  id?: string;
  student_nim: string;
  student_name: string;
  class_group: string;
  project_title: string;
  github_url: string;
  demo_url?: string;
  score_concept: number;        // 1. Pemahaman Konsep (25%)
  score_architecture: number;   // 2. Kesesuaian Arsitektur (25%)
  score_prompt: number;         // 3. Konstruksi Prompt (20%)
  score_features: number;       // 4. Kesesuaian Alur & Fitur (20%)
  score_ui_ux: number;          // 5. Estetika UI/UX (10%)
  final_score: number;          // Nilai Akhir Tertimbang
  feedback_notes: string;
  status: "draft" | "graded" | "revision_required";
  is_graded: boolean;
  evaluated_by?: string;
  evaluated_at?: string;
  updated_at?: string;
}

export interface UtsEvaluationInput {
  student_nim: string;
  project_title: string;
  github_url: string;
  demo_url?: string;
  score_concept: number;
  score_architecture: number;
  score_prompt: number;
  score_features: number;
  score_ui_ux: number;
  feedback_notes: string;
  status?: "graded" | "revision_required" | "draft";
}

export interface UtsEvaluationSummary {
  totalStudents: number;
  gradedCount: number;
  ungradedCount: number;
  averageScore: number;
  highScore: number;
  passedCount: number; // Nilai >= 75
}


/**
 * Mengambil daftar seluruh mahasiswa beserta status evaluasi UTS mereka
 */
export async function getUtsEvaluationDataAction(classGroup: string = "all"): Promise<{
  success: boolean;
  data?: UtsEvaluationRow[];
  summary?: UtsEvaluationSummary;
  availableClasses?: string[];
  isTableMissing?: boolean;
  error?: string;
}> {
  try {
    const sessionRes = await getLecturerSessionAction();
    if (!sessionRes.isAuthenticated) {
      return { success: false, error: "Sesi dosen tidak valid. Silakan login kembali." };
    }

    const supabase = createAdminClient();

    // 1. Ambil seluruh data mahasiswa
    let studentQuery = supabase
      .from("students")
      .select("nim, full_name, class_group")
      .order("class_group", { ascending: true })
      .order("nim", { ascending: true });

    if (classGroup && classGroup !== "all") {
      studentQuery = studentQuery.eq("class_group", classGroup);
    }

    const { data: studentsData, error: studentError } = await studentQuery;
    if (studentError) {
      console.error("[UTS Action] Error fetching students:", studentError);
      return { success: false, error: studentError.message };
    }

    const students = studentsData || [];

    // Kumpulkan daftar kelas unik
    const { data: allClassesData } = await supabase.from("students").select("class_group");
    const rawClassList = Array.from(new Set((allClassesData || []).map((s) => s.class_group))).filter(Boolean) as string[];
    const availableClasses = Array.from(new Set(["sp5.1", ...rawClassList])).sort((a, b) =>
      a === "sp5.1" ? -1 : b === "sp5.1" ? 1 : a.localeCompare(b)
    );

    // 2. Ambil data penilaian UTS
    let utsQuery = supabase.from("project_uts_evaluations").select("*");
    const { data: evaluationsData, error: evalError } = await utsQuery;

    // Jika tabel belum dibuat di Supabase
    if (evalError) {
      const isMissing =
        evalError.code === "42P01" ||
        evalError.message.includes("does not exist") ||
        evalError.message.includes("schema cache") ||
        evalError.message.includes("relation");

      if (isMissing) {
        return {
          success: false,
          isTableMissing: true,
          error: "Tabel 'project_uts_evaluations' belum dibuat di database Supabase.",
          availableClasses,
        };
      }
      console.error("[UTS Action] Error fetching evaluations:", evalError);
    }

    const evalMap = new Map<string, any>();
    (evaluationsData || []).forEach((ev) => {
      evalMap.set(ev.student_nim, ev);
    });

    // 3. Gabungkan data mahasiswa dengan nilai evaluasi UTS
    const mergedList: UtsEvaluationRow[] = students.map((st) => {
      const ev = evalMap.get(st.nim);
      if (ev) {
        return {
          id: ev.id,
          student_nim: st.nim,
          student_name: st.full_name,
          class_group: st.class_group,
          project_title: ev.project_title || "",
          github_url: ev.github_url || "",
          demo_url: ev.demo_url || "",
          score_concept: Number(ev.score_concept) || 0,
          score_architecture: Number(ev.score_architecture) || 0,
          score_prompt: Number(ev.score_prompt) || 0,
          score_features: Number(ev.score_features) || 0,
          score_ui_ux: Number(ev.score_ui_ux) || 0,
          final_score: Number(ev.final_score) || 0,
          feedback_notes: ev.feedback_notes || "",
          status: ev.status || "graded",
          is_graded: true,
          evaluated_by: ev.evaluated_by,
          evaluated_at: ev.evaluated_at,
          updated_at: ev.updated_at,
        };
      }

      return {
        student_nim: st.nim,
        student_name: st.full_name,
        class_group: st.class_group,
        project_title: "",
        github_url: "",
        demo_url: "",
        score_concept: 0,
        score_architecture: 0,
        score_prompt: 0,
        score_features: 0,
        score_ui_ux: 0,
        final_score: 0,
        feedback_notes: "",
        status: "draft",
        is_graded: false,
      };
    });

    // 4. Hitung ringkasan statistik
    const totalStudents = mergedList.length;
    const gradedList = mergedList.filter((m) => m.is_graded);
    const gradedCount = gradedList.length;
    const ungradedCount = totalStudents - gradedCount;
    const totalScoresSum = gradedList.reduce((acc, curr) => acc + curr.final_score, 0);
    const averageScore = gradedCount > 0 ? Math.round((totalScoresSum / gradedCount) * 100) / 100 : 0;
    const highScore = gradedList.reduce((acc, curr) => Math.max(acc, curr.final_score), 0);
    const passedCount = gradedList.filter((m) => m.final_score >= 75).length;

    const summary: UtsEvaluationSummary = {
      totalStudents,
      gradedCount,
      ungradedCount,
      averageScore,
      highScore,
      passedCount,
    };

    return {
      success: true,
      data: mergedList,
      summary,
      availableClasses,
    };
  } catch (err: any) {
    console.error("[UTS Action] getUtsEvaluationDataAction exception:", err);
    return { success: false, error: err.message || "Terjadi kesalahan internal." };
  }
}

/**
 * Menyimpan / memperbarui nilai evaluasi UTS mahasiswa oleh Dosen
 */
export async function saveUtsEvaluationAction(input: UtsEvaluationInput): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const sessionRes = await getLecturerSessionAction();
    if (!sessionRes.isAuthenticated || !sessionRes.lecturer) {
      return { success: false, error: "Sesi dosen telah berakhir. Silakan login kembali." };
    }

    if (!input.student_nim) {
      return { success: false, error: "NIM Mahasiswa wajib diisi." };
    }

    // Hitung final score secara presisi di server
    const final_score = calculateUtsFinalScore({
      concept: input.score_concept,
      architecture: input.score_architecture,
      prompt: input.score_prompt,
      features: input.score_features,
      ui_ux: input.score_ui_ux,
    });

    const status = input.status || (final_score >= 60 ? "graded" : "revision_required");

    const payload = {
      student_nim: input.student_nim,
      project_title: input.project_title?.trim() || "Proyek Aplikasi Serverless",
      github_url: input.github_url?.trim() || "",
      demo_url: input.demo_url?.trim() || "",
      score_concept: Math.max(0, Math.min(100, Number(input.score_concept) || 0)),
      score_architecture: Math.max(0, Math.min(100, Number(input.score_architecture) || 0)),
      score_prompt: Math.max(0, Math.min(100, Number(input.score_prompt) || 0)),
      score_features: Math.max(0, Math.min(100, Number(input.score_features) || 0)),
      score_ui_ux: Math.max(0, Math.min(100, Number(input.score_ui_ux) || 0)),
      final_score,
      feedback_notes: input.feedback_notes?.trim() || "",
      status,
      evaluated_by: sessionRes.lecturer.nidn,
      evaluated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const supabase = createAdminClient();
    const { data: upsertData, error: upsertError } = await supabase
      .from("project_uts_evaluations")
      .upsert(payload, { onConflict: "student_nim" })
      .select()
      .single();

    if (upsertError) {
      console.error("[UTS Action] Error saving evaluation:", upsertError);
      return { success: false, error: upsertError.message };
    }

    return { success: true, data: upsertData };
  } catch (err: any) {
    console.error("[UTS Action] saveUtsEvaluationAction exception:", err);
    return { success: false, error: err.message || "Gagal menyimpan nilai evaluasi." };
  }
}

/**
 * Menghapus data evaluasi UTS mahasiswa (jika ingin reset)
 */
export async function deleteUtsEvaluationAction(studentNim: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const sessionRes = await getLecturerSessionAction();
    if (!sessionRes.isAuthenticated) {
      return { success: false, error: "Akses ditolak. Sesi dosen tidak valid." };
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("project_uts_evaluations")
      .delete()
      .eq("student_nim", studentNim);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal mereset nilai UTS." };
  }
}
