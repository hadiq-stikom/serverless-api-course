-- ====================================================================
-- MIGRASI SKEMA DATABASE RELASIONAL 3 TABEL & SEED DATA
-- PERTEMUAN 4: "THE SERVERLESS ODYSSEY"
-- Jalankan skrip ini langsung di SQL Editor Dashboard Supabase Anda:
-- https://supabase.com/dashboard/project/_/sql/new
--
-- Catatan Arsitektur:
-- Pada Minggu 4, tabel 'profiles' berdiri mandiri dengan UUID v4 murni.
-- Relasi ke auth.users akan disambungkan pada Minggu 5 (Autentikasi & OAuth).
-- ====================================================================

-- 1. Pastikan Ekstensi pgcrypto Aktif untuk UUID v4
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. DDL Tabel 1: profiles (Profil Pengembang Mandiri)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. DDL Tabel 2: projects (Entitas Proyek Multi-Tenant)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  budget NUMERIC(12,2) DEFAULT 0 CHECK (budget >= 0),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. DDL Tabel 3: tasks (Item Pekerjaan Berelasi ke Proyek)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. Indeks Performa B-Tree O(log N) pada Foreign Keys
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- 6. Trigger Otomatis Pembaruan Timestamp updated_at
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_projects_updated_at ON projects;
CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_tasks_updated_at ON tasks;
CREATE TRIGGER trg_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- ====================================================================
-- SEED DATA CONTOH (SAMPLE DATA UNTUK PENGUJIAN MAHASISWA)
-- Tanpa login atau ketergantungan pada auth.users
-- ====================================================================

-- A. Profil Pengembang Contoh (profiles)
INSERT INTO profiles (id, full_name, avatar_url)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Raden Wijaya (Lead Cloud Architect)',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
)
ON CONFLICT (id) DO UPDATE
SET full_name = EXCLUDED.full_name, avatar_url = EXCLUDED.avatar_url;

-- B. Data Proyek Relasional (projects)
INSERT INTO projects (id, user_id, title, description, budget)
VALUES
  (
    'b1111111-1111-4000-a000-000000000001',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Arsitektur Platform E-Commerce Serverless',
    'Pembangunan microservices backend Next.js 16 dan Supabase PostgreSQL untuk toko online modern berkinerja tinggi.',
    25000000
  ),
  (
    'b2222222-2222-4000-a000-000000000002',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Sistem Manajemen Inventaris & AI Media CDN',
    'Integrasi media asset pipeline dengan Cloudinary AI transformations dan optimasi edge caching.',
    18500000
  ),
  (
    'b3333333-3333-4000-a000-000000000003',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Aplikasi Mobile Realtime Telemetri IoT',
    'Streaming sensor suhu dan kelembaban dengan Supabase Realtime Channels dan Webhooks.',
    12000000
  )
ON CONFLICT (id) DO NOTHING;

-- C. Data Tugas Terkait (tasks)
INSERT INTO tasks (project_id, title, status)
VALUES
  ('b1111111-1111-4000-a000-000000000001', 'Desain Skema ERD Relasional 3 Tabel', 'done'),
  ('b1111111-1111-4000-a000-000000000001', 'Konfigurasi Supabase SSR & Async Cookies Next.js 16', 'in_progress'),
  ('b1111111-1111-4000-a000-000000000001', 'Audit Keamanan Row Level Security (RLS)', 'todo'),
  ('b2222222-2222-4000-a000-000000000002', 'Setup Akun Cloudinary & Upload Preset Serverless', 'done'),
  ('b2222222-2222-4000-a000-000000000002', 'Uji Transformasi Gambar Otomatis (f_auto, q_auto)', 'in_progress'),
  ('b3333333-3333-4000-a000-000000000003', 'Setup WebSocket Realtime Listener di Klien Browser', 'todo');
