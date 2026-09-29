-- ====================================================================
-- SKEMA RESMI PLATFORM "THE SERVERLESS ODYSSEY"
-- Jalankan skrip ini di SQL Editor Dashboard Supabase Anda:
-- https://supabase.com/dashboard/project/_/sql/new
-- ====================================================================

-- 1. Ekstensi pgcrypto untuk kriptografi & UUID
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Tabel Dosen Pengampu (Lecturers)
CREATE TABLE IF NOT EXISTS lecturers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nidn TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  password_hash TEXT, -- Jika NULL, default password = NIDN
  role TEXT NOT NULL DEFAULT 'lecturer',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Tabel Data Mahasiswa (Students Roster)
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nim TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  class_group TEXT DEFAULT 'Kelas A',
  password_hash TEXT, -- Jika NULL, default password = NIM
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Tabel Pengajuan Kuis Modul (Quiz Submissions)
CREATE TABLE IF NOT EXISTS quiz_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_nim TEXT NOT NULL REFERENCES students(nim) ON DELETE CASCADE,
  module_id INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  current_question_index INT NOT NULL DEFAULT 0,
  reset_count INT NOT NULL DEFAULT 0,
  total_score NUMERIC(5,2) DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (student_nim, module_id)
);

-- 5. Tabel Detail Jawaban & Evaluasi AI (Quiz Answers)
CREATE TABLE IF NOT EXISTS quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES quiz_submissions(id) ON DELETE CASCADE,
  question_number INT NOT NULL,
  student_answer TEXT NOT NULL,
  score INT NOT NULL CHECK (score >= 0 AND score <= 100),
  ai_feedback TEXT NOT NULL,
  ai_provider TEXT NOT NULL DEFAULT 'groq',
  attempt_count INT NOT NULL DEFAULT 1,
  is_passed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 6. Indeks Performa B-Tree O(log N)
CREATE INDEX IF NOT EXISTS idx_lecturers_nidn ON lecturers(nidn);
CREATE INDEX IF NOT EXISTS idx_students_nim ON students(nim);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_group);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_nim ON quiz_submissions(student_nim);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_module ON quiz_submissions(module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_submission ON quiz_answers(submission_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_question ON quiz_answers(submission_id, question_number);

-- 7. Seed Data Dosen Pengampu Awal
INSERT INTO lecturers (nidn, full_name, email)
VALUES ('0012345678', 'Dosen Pengampu Arsitektur Serverless', 'dosen@universitas.ac.id')
ON CONFLICT (nidn) DO UPDATE
SET full_name = EXCLUDED.full_name;

-- 8. Seed Data Mahasiswa Awal untuk Pengujian
INSERT INTO students (nim, full_name, class_group) VALUES
  ('202401001', 'Budi Santoso', 'Kelas A'),
  ('202401002', 'Siti Rahmawati', 'Kelas A'),
  ('202401003', 'Ahmad Fauzi', 'Kelas A'),
  ('202401004', 'Dewi Lestari', 'Kelas B'),
  ('202401005', 'Reza Pratama', 'Kelas B')
ON CONFLICT (nim) DO UPDATE 
SET full_name = EXCLUDED.full_name, class_group = EXCLUDED.class_group;
