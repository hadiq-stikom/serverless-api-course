-- ====================================================================
-- Migrasi Sistem Autentikasi Dosen (NIDN) & Mahasiswa (NIM)
-- ====================================================================

-- 1. Ekstensi pgcrypto untuk hashing kata sandi aman jika diperlukan
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Tabel Data Dosen Pengampu (Lecturers)
CREATE TABLE IF NOT EXISTS lecturers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nidn TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  password_hash TEXT, -- Jika NULL, default kata sandi = NIDN
  role TEXT NOT NULL DEFAULT 'lecturer',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Tabel Data Mahasiswa (Students Roster - memastikan kolom password_hash tersedia)
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nim TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  class_group TEXT DEFAULT 'Kelas A',
  password_hash TEXT, -- Jika NULL, default kata sandi = NIM
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indeks unik & performa
CREATE INDEX IF NOT EXISTS idx_lecturers_nidn ON lecturers(nidn);
CREATE INDEX IF NOT EXISTS idx_students_nim ON students(nim);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_group);

-- 4. Akun Dosen Pengampu Default
INSERT INTO lecturers (nidn, full_name, email)
VALUES ('0012345678', 'Dosen Pengampu Arsitektur Serverless', 'dosen@universitas.ac.id')
ON CONFLICT (nidn) DO UPDATE
SET full_name = EXCLUDED.full_name;
