import React from "react";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getPracticumById } from "@/data/practicum";
import { getOrCreatePracticumSubmissionAction } from "@/actions/practicum";
import { PracticumWorkspace } from "@/components/practicum/practicum-workspace";
import { PracticumLoginGate } from "@/components/practicum/practicum-login-gate";
import { getLecturerSessionAction } from "@/actions/lecturer-auth";

interface PracticumPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PracticumPageProps) {
  const { id } = await params;
  const practicumId = parseInt(id, 10);
  const practicum = getPracticumById(practicumId);

  if (!practicum) {
    return {
      title: "Praktikum Tidak Ditemukan",
    };
  }

  return {
    title: `Praktikum ${practicum.id}: ${practicum.title} | The Serverless Odyssey`,
    description: practicum.capaian,
  };
}

export default async function PracticumDetailPage({ params }: PracticumPageProps) {
  const { id } = await params;
  const practicumId = parseInt(id, 10);

  if (isNaN(practicumId) || practicumId < 1 || practicumId > 7) {
    notFound();
  }

  const practicum = getPracticumById(practicumId);
  if (!practicum) {
    notFound();
  }

  // Check student & lecturer session
  const cookieStore = await cookies();
  const studentCookie = cookieStore.get("student_session")?.value;
  const lecturerAuth = await getLecturerSessionAction();
  const isLecturer = lecturerAuth.isAuthenticated && !!lecturerAuth.lecturer;
  const lecturerName = lecturerAuth.lecturer?.fullName;

  let student: { nim: string; fullName: string; classGroup: string } | null = null;
  if (studentCookie) {
    try {
      student = JSON.parse(studentCookie);
    } catch {
      student = null;
    }
  }

  // If not logged in as student, display the Login Gate with instant test login option
  if (!student) {
    return (
      <div className="min-h-screen bg-slate-50/60 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 p-6 md:p-10 lg:p-12 transition-colors duration-300 selection:bg-teal-500 selection:text-white">
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-32 w-96 h-96 bg-slate-400/5 dark:bg-teal-600/5 rounded-full blur-3xl" />
        </div>

        <PracticumLoginGate
          practicum={practicum}
          isLecturer={isLecturer}
          lecturerName={lecturerName}
        />
      </div>
    );
  }

  // Fetch or initialize submission & existing answers
  const res = await getOrCreatePracticumSubmissionAction(practicumId);

  if (!res.success || !res.data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50/60 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100">
        <div className="p-8 max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl border border-rose-500/30 text-center space-y-4 shadow-lg">
          <div className="text-rose-600 dark:text-rose-400 font-bold text-lg">Gagal Membuka Praktikum</div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            {res.error ?? "Terjadi kendala saat memuat data laporan praktikum dari database."}
          </p>
          <a
            href="/practicum"
            className="inline-block px-4 py-2.5 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            Kembali ke Daftar Praktikum
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 p-6 md:p-10 lg:p-12 transition-colors duration-300 selection:bg-teal-500 selection:text-white">
      {/* Zen Ambient Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-slate-400/5 dark:bg-teal-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-600/5 rounded-full blur-3xl" />
      </div>

      <PracticumWorkspace
        practicum={practicum}
        initialData={res.data}
        student={student}
        isLecturer={isLecturer}
        lecturerName={lecturerName}
      />
    </div>
  );
}
