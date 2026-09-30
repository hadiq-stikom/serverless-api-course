import React from "react";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getPracticumById } from "@/data/practicum";
import { getOrCreatePracticumSubmissionAction } from "@/actions/practicum";
import { PracticumWorkspace } from "@/components/practicum/practicum-workspace";

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

  // Check student session
  const cookieStore = await cookies();
  const studentCookie = cookieStore.get("student_session")?.value;

  if (!studentCookie) {
    redirect("/");
  }

  let student: { nim: string; fullName: string; classGroup: string };
  try {
    student = JSON.parse(studentCookie);
  } catch {
    redirect("/");
  }

  // Fetch or initialize submission & existing answers
  const res = await getOrCreatePracticumSubmissionAction(practicumId);

  if (!res.success || !res.data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <div className="p-8 max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl border border-rose-500/30 text-center space-y-4">
          <div className="text-rose-500 font-bold text-lg">Gagal Membuka Praktikum</div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            {res.error ?? "Terjadi kendala saat memuat data laporan praktikum dari database."}
          </p>
          <a
            href="/practicum"
            className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
          >
            Kembali ke Daftar Praktikum
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 md:p-10 lg:p-12 transition-colors duration-300 selection:bg-indigo-500 selection:text-white">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-violet-500/10 dark:bg-violet-600/15 rounded-full blur-3xl" />
      </div>

      <PracticumWorkspace
        practicum={practicum}
        initialData={res.data}
        student={student}
      />
    </div>
  );
}
