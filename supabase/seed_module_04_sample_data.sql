-- ====================================================================
-- SEED DATA CONTOH PERTEMUAN 4 (SAMPLE DATA ONLY)
-- "THE SERVERLESS ODYSSEY"
-- Jalankan skrip ini di SQL Editor Dashboard Supabase Anda:
-- Murni mengisi 3 tabel aplikasi tanpa perlu login atau tabel auth.users
-- ====================================================================

-- 1. Isi Profil Pengguna Contoh (profiles)
-- (Menggunakan UUID deterministik agar tabel projects di bawah dapat berelasi dengan pasti)
INSERT INTO profiles (id, full_name, avatar_url)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Raden Wijaya (Lead Cloud Architect)',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
)
ON CONFLICT (id) DO UPDATE
SET full_name = EXCLUDED.full_name, avatar_url = EXCLUDED.avatar_url;

-- 2. Isi Data Proyek Relasional (projects)
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

-- 3. Isi Data Tugas Terkait (tasks) dengan Status Bervariasi
INSERT INTO tasks (project_id, title, status)
VALUES
  ('b1111111-1111-4000-a000-000000000001', 'Desain Skema ERD Relasional 3 Tabel', 'done'),
  ('b1111111-1111-4000-a000-000000000001', 'Konfigurasi Supabase SSR & Async Cookies Next.js 16', 'in_progress'),
  ('b1111111-1111-4000-a000-000000000001', 'Audit Keamanan Row Level Security (RLS)', 'todo'),
  ('b2222222-2222-4000-a000-000000000002', 'Setup Akun Cloudinary & Upload Preset Serverless', 'done'),
  ('b2222222-2222-4000-a000-000000000002', 'Uji Transformasi Gambar Otomatis (f_auto, q_auto)', 'in_progress'),
  ('b3333333-3333-4000-a000-000000000003', 'Setup WebSocket Realtime Listener di Klien Browser', 'todo');

-- 4. Query Verifikasi: Pastikan Relasi JOIN 1:N Berhasil Ditampilkan
SELECT 
  p.title AS nama_proyek,
  pr.full_name AS pemilik,
  COUNT(t.id) AS jumlah_tugas,
  p.budget AS anggaran
FROM projects p
JOIN profiles pr ON pr.id = p.user_id
LEFT JOIN tasks t ON t.project_id = p.id
GROUP BY p.id, p.title, pr.full_name, p.budget;
