-- ====================================================================
-- MIGRASI SKEMA MODUL PRAKTIKUM — THE SERVERLESS ODYSSEY
-- Jalankan di SQL Editor Dashboard Supabase:
-- https://supabase.com/dashboard/project/_/sql/new
-- ====================================================================

-- ---------------------------------------------------------------
-- TABEL 1: Definisi Modul-Modul Praktikum (7 modul)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS practicum_modules (
  id              INT PRIMARY KEY,
  title           TEXT NOT NULL,
  lecture_module  INT NOT NULL,       -- Modul kuliah referensi (1,2,3,4,5,6,12)
  capaian         TEXT NOT NULL,
  dasar_teori     TEXT NOT NULL,
  -- Array langkah uji coba: [{step: 1, instruksi: "...", contoh_output: "..."}]
  steps           JSONB NOT NULL DEFAULT '[]',
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ---------------------------------------------------------------
-- TABEL 2: Laporan Praktikum per Mahasiswa
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS practicum_submissions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_nim         TEXT NOT NULL REFERENCES students(nim) ON DELETE CASCADE,
  practicum_id        INT NOT NULL REFERENCES practicum_modules(id) ON DELETE CASCADE,
  status              TEXT NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft', 'submitted', 'approved', 'revision')),
  -- Tanda tangan mahasiswa — base64 PNG (disimpan saat submit)
  student_signature   TEXT,
  -- Tanda tangan dosen — base64 PNG (disalin dari lecturers.signature saat approve)
  lecturer_signature  TEXT,
  -- Nama dosen yang menyetujui
  approved_by_name    TEXT,
  -- Path file PDF di Supabase Storage (bucket: practicum-reports)
  pdf_path            TEXT,
  submitted_at        TIMESTAMPTZ,
  approved_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (student_nim, practicum_id)
);

-- ---------------------------------------------------------------
-- TABEL 3: Jawaban Tabel Pengamatan (per baris/langkah)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS practicum_observations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id   UUID NOT NULL REFERENCES practicum_submissions(id) ON DELETE CASCADE,
  step_number     INT NOT NULL,
  observation     TEXT NOT NULL DEFAULT '',
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (submission_id, step_number)
);

-- ---------------------------------------------------------------
-- TABEL 4: Esai Analisis & Kesimpulan + Evaluasi AI
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS practicum_essays (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id   UUID NOT NULL REFERENCES practicum_submissions(id) ON DELETE CASCADE,
  -- 'analysis' atau 'conclusion'
  essay_type      TEXT NOT NULL CHECK (essay_type IN ('analysis', 'conclusion')),
  student_text    TEXT NOT NULL DEFAULT '',
  ai_score        INT CHECK (ai_score >= 0 AND ai_score <= 100),
  ai_feedback     TEXT,
  ai_provider     TEXT,
  attempt_count   INT NOT NULL DEFAULT 0,
  -- Lulus jika skor >= 70
  is_passed       BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (submission_id, essay_type)
);

-- ---------------------------------------------------------------
-- KOLOM BARU: Tanda Tangan Digital Dosen (pada tabel lecturers)
-- ---------------------------------------------------------------
ALTER TABLE lecturers
  ADD COLUMN IF NOT EXISTS signature_base64 TEXT,
  ADD COLUMN IF NOT EXISTS signature_updated_at TIMESTAMPTZ;

-- ---------------------------------------------------------------
-- INDEKS PERFORMA B-TREE
-- ---------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_practicum_submissions_nim
  ON practicum_submissions(student_nim);
CREATE INDEX IF NOT EXISTS idx_practicum_submissions_practicum
  ON practicum_submissions(practicum_id);
CREATE INDEX IF NOT EXISTS idx_practicum_submissions_status
  ON practicum_submissions(status);
CREATE INDEX IF NOT EXISTS idx_practicum_observations_submission
  ON practicum_observations(submission_id);
CREATE INDEX IF NOT EXISTS idx_practicum_essays_submission
  ON practicum_essays(submission_id);

-- ---------------------------------------------------------------
-- SEED DATA: 7 Modul Praktikum
-- ---------------------------------------------------------------
INSERT INTO practicum_modules (id, title, lecture_module, capaian, dasar_teori, steps)
VALUES
-- PRAKTIKUM 1: Ekosistem Serverless & Git
(1,
 'Ekosistem Serverless & Manajemen Repository Git',
 1,
 'Mahasiswa mampu menginisialisasi repository proyek Next.js, mengonfigurasi proteksi kunci rahasia dengan .gitignore dan .env.local, serta memahami alur kerja Git dasar (init, add, commit, push) sebagai fondasi kolaborasi tim berbasis cloud.',
 'Arsitektur Serverless memungkinkan developer menjalankan logika bisnis tanpa mengelola server secara langsung. Platform seperti Vercel (FaaS) menjalankan fungsi secara on-demand, sementara Supabase (BaaS) menyediakan layanan backend terkelola. Git adalah sistem kontrol versi terdistribusi yang mencatat perubahan kode secara atomik melalui commit. File .env.local menyimpan variabel lingkungan rahasia (seperti API key dan database URL) yang TIDAK boleh masuk ke dalam repository publik — dilindungi oleh entri di file .gitignore.',
 '[
   {"step": 1, "instruksi": "Inisialisasi project Next.js baru dengan perintah: npx create-next-app@latest my-project --typescript --app --tailwind --eslint --no-src-dir. Catat output yang muncul di terminal.", "contoh_output": "✓ Creating project in ./my-project... ✓ Installing dependencies..."},
   {"step": 2, "instruksi": "Masuk ke folder project dan jalankan git log --oneline untuk melihat commit awal. Catat hash commit dan pesan commit yang ada.", "contoh_output": "a1b2c3d (HEAD -> main) Initial commit from create-next-app"},
   {"step": 3, "instruksi": "Buat file .env.local dengan isi: NEXT_PUBLIC_SUPABASE_URL=https://test.supabase.co. Cek apakah file tersebut sudah terdaftar di .gitignore dengan perintah: cat .gitignore | grep env.", "contoh_output": ".env.local tercantum dalam .gitignore"},
   {"step": 4, "instruksi": "Jalankan git status untuk melihat status file. Apakah file .env.local muncul sebagai untracked file? Catat hasilnya.", "contoh_output": "nothing to commit, working tree clean (atau .env.local tidak muncul)"},
   {"step": 5, "instruksi": "Buat file README.md berisi deskripsi singkat project. Jalankan siklus lengkap: git add README.md, git commit -m ''docs: tambah README awal'', dan git log --oneline. Catat hash commit baru.", "contoh_output": "b2c3d4e (HEAD -> main) docs: tambah README awal"}
 ]'::jsonb
),

-- PRAKTIKUM 2: Next.js App Router
(2,
 'Next.js App Router: Server vs Client Component',
 2,
 'Mahasiswa mampu membedakan perilaku Server Component dan Client Component di Next.js App Router melalui pengujian langsung, mengamati perbedaan output HTML, ukuran JavaScript bundle, dan cara rendering masing-masing komponen.',
 'Next.js App Router menggunakan React Server Components (RSC) secara default. Server Components dirender sepenuhnya di server — tidak mengirimkan JavaScript ke browser, memungkinkan akses langsung ke database dan environment variables rahasia, namun tidak dapat menggunakan hooks (useState, useEffect) atau event handler. Client Components ditandai dengan direktif ''use client'' di baris pertama file — komponen ini dikirimkan sebagai JavaScript bundle ke browser dan dapat menggunakan seluruh fitur React interaktif. Pemisahan yang tepat antara RSC dan Client Component adalah kunci performa aplikasi Next.js modern.',
 '[
   {"step": 1, "instruksi": "Buat file app/test-rsc/page.tsx sebagai Server Component (tanpa ''use client''). Tambahkan kode: console.log(''[SERVER] Rendered at:'', new Date().toISOString()). Akses halaman di browser dan cek: apakah log muncul di browser console atau terminal server?", "contoh_output": "Log muncul di terminal server (bukan browser console)"},
   {"step": 2, "instruksi": "Buat file app/test-client/page.tsx dengan direktif ''use client'' di baris pertama. Tambahkan useState dan console.log(''[CLIENT] Mounted''). Akses di browser. Di mana log muncul sekarang?", "contoh_output": "Log muncul di browser DevTools console"},
   {"step": 3, "instruksi": "Buka browser DevTools > Network > Filter ''JS''. Bandingkan ukuran JavaScript yang diunduh saat mengakses /test-rsc vs /test-client. Catat perbandingan ukurannya.", "contoh_output": "test-rsc: ~85 KB | test-client: ~120 KB (lebih besar karena bundle React interaktif)"},
   {"step": 4, "instruksi": "Coba tambahkan useState di dalam Server Component (test-rsc/page.tsx). Jalankan npm run dev. Apa error yang muncul di terminal atau browser?", "contoh_output": "Error: useState only works in Client Components. Add the ''use client'' directive..."},
   {"step": 5, "instruksi": "Implementasikan pola Interleaving: buat ServerWrapper (RSC) yang membungkus ClientCounter (Client). Import dan render ServerWrapper di page.tsx. Verifikasi bahwa kedua komponen berjalan bersamaan.", "contoh_output": "ServerWrapper render di server, ClientCounter dengan tombol increment berjalan di browser"}
 ]'::jsonb
),

-- PRAKTIKUM 3: Server Actions & Validasi Zod
(3,
 'Server Actions & Validasi Skema Data dengan Zod',
 3,
 'Mahasiswa mampu membuat Server Action di Next.js untuk memproses mutasi data secara aman, mengimplementasikan validasi schema menggunakan Zod, menangani error validasi, dan menampilkan feedback form yang informatif kepada pengguna.',
 'Server Actions adalah fungsi asinkron yang berjalan eksklusif di server, ditandai dengan direktif ''use server''. Fungsi ini dipanggil langsung dari Client Component seperti memanggil fungsi biasa, namun eksekusinya terjadi di server — membuat operasi mutasi database aman tanpa membuat API route manual. Zod adalah library TypeScript-first untuk deklarasi dan validasi schema data. Metode safeParse() mengembalikan objek {success: boolean, data?, error?} yang memungkinkan penanganan error validasi tanpa melempar exception — sangat ideal untuk validasi form yang mengharapkan input pengguna yang mungkin tidak valid.',
 '[
   {"step": 1, "instruksi": "Buat file src/actions/test-action.ts dengan direktif ''use server''. Buat fungsi createTaskAction yang menerima formData: FormData. Log isi formData ke console server. Panggil dari form HTML biasa di page.tsx.", "contoh_output": "[Server] FormData: { title: ''test'', priority: ''high'' }"},
   {"step": 2, "instruksi": "Install Zod: npm install zod. Buat schema validasi TaskSchema dengan field: title (string, min 3 karakter), priority (enum: ''low'', ''medium'', ''high''), deadline (optional date). Test dengan data valid.", "contoh_output": "{ success: true, data: { title: ''Belajar Zod'', priority: ''high'' } }"},
   {"step": 3, "instruksi": "Test schema yang sama dengan data TIDAK VALID: title '' '' (spasi saja), priority ''urgent'' (bukan enum). Catat output ZodError dan struktur fieldErrors yang dihasilkan.", "contoh_output": "{ success: false, error: { fieldErrors: { title: [''String must contain at least 3 characters''], priority: [''Invalid enum value''] } } }"},
   {"step": 4, "instruksi": "Integrasikan Zod ke dalam createTaskAction. Gunakan safeParse(), kemudian return { success: false, errors: result.error.flatten().fieldErrors } jika invalid. Tampilkan pesan error di bawah setiap field form.", "contoh_output": "Form menampilkan pesan merah di bawah field yang error tanpa reload halaman"},
   {"step": 5, "instruksi": "Gunakan useActionState untuk menangkap return value dari Server Action. Verifikasi: saat form valid, tampilkan pesan sukses. Saat invalid, tampilkan error per field. Uji kedua skenario.", "contoh_output": "State ''idle'' → ''pending'' → ''success''/''error'' berjalan dengan benar"}
 ]'::jsonb
),

-- PRAKTIKUM 4: Database Relasional Supabase
(4,
 'Database Relasional PostgreSQL & Integrasi Supabase',
 4,
 'Mahasiswa mampu merancang skema database relasional di PostgreSQL menggunakan Supabase, membuat tabel dengan foreign key constraint, menjalankan query CRUD dasar, dan mengintegrasikan Supabase client di aplikasi Next.js menggunakan paket @supabase/ssr.',
 'PostgreSQL adalah sistem manajemen database relasional (RDBMS) yang kuat dan open-source. Supabase menyediakan PostgreSQL sebagai layanan BaaS (Backend-as-a-Service) dengan API RESTful dan client library untuk berbagai bahasa. Relasi antar tabel diimplementasikan melalui Foreign Key Constraint — kolom di tabel anak yang merujuk ke Primary Key tabel induk. UUID (Universally Unique Identifier) dipilih sebagai Primary Key karena aman, tidak prediktif, dan bisa di-generate di sisi client maupun server tanpa koordinasi dengan database.',
 '[
   {"step": 1, "instruksi": "Buka Supabase Dashboard > SQL Editor. Jalankan DDL untuk membuat tabel categories (id UUID PK, name TEXT NOT NULL) dan tasks (id UUID PK, category_id UUID FK REFERENCES categories). Periksa tabel di Table Editor.", "contoh_output": "Tabel categories dan tasks muncul di sidebar Supabase Table Editor"},
   {"step": 2, "instruksi": "Insert 3 baris ke tabel categories dan 5 baris ke tabel tasks yang merujuk ke categories tersebut. Jalankan query JOIN: SELECT t.*, c.name as category_name FROM tasks t JOIN categories c ON t.category_id = c.id. Catat hasilnya.", "contoh_output": "5 baris tasks dengan kolom category_name terisi dari tabel categories"},
   {"step": 3, "instruksi": "Coba hapus sebuah baris di tabel categories yang masih dirujuk oleh tasks. Apa error yang muncul? Kemudian ubah FK menjadi ON DELETE CASCADE dan ulangi penghapusan. Apa yang terjadi?", "contoh_output": "Tanpa CASCADE: ERROR violates foreign key constraint. Dengan CASCADE: baris categories + tasks terkait terhapus bersamaan"},
   {"step": 4, "instruksi": "Install @supabase/ssr dan @supabase/supabase-js. Buat utility src/utils/supabase/server.ts. Panggil dari Server Component untuk fetch semua tasks. Tampilkan di UI sebagai list.", "contoh_output": "Daftar tasks muncul di halaman, diambil langsung dari Supabase di server"},
   {"step": 5, "instruksi": "Jalankan npx supabase gen types typescript --project-id <id> > src/types/database.types.ts. Verifikasi tipe yang dihasilkan mencerminkan schema tabel. Gunakan tipe tersebut di query Supabase client.", "contoh_output": "File database.types.ts berisi interface Tables<''tasks''> dengan field id, category_id, dll."}
 ]'::jsonb
),

-- PRAKTIKUM 5: Autentikasi & Route Protection
(5,
 'Autentikasi Multi-Provider & Proteksi Rute Next.js',
 5,
 'Mahasiswa mampu mengimplementasikan sistem autentikasi lengkap menggunakan Supabase Auth dengan Email/Password dan GitHub OAuth, mengamankan rute privat menggunakan Next.js Middleware, serta mengelola session pengguna secara aman di Server Components.',
 'Autentikasi memverifikasi identitas pengguna, sementara otorisasi menentukan hak akses setelah identitas terverifikasi. Supabase Auth menggunakan JWT (JSON Web Token) yang dirotasi secara kriptografis. GitHub OAuth 2.0 adalah protokol delegasi otorisasi — pengguna memberikan izin kepada aplikasi untuk mengakses data profil GitHub mereka tanpa berbagi password. Next.js Middleware berjalan di Edge Runtime sebelum request mencapai halaman/API, menjadikannya tempat ideal untuk memeriksa session dan melakukan redirect otomatis ke halaman login jika session tidak valid.',
 '[
   {"step": 1, "instruksi": "Buka Supabase Dashboard > Authentication > Providers. Aktifkan Email provider. Buat akun test melalui Supabase Auth > Users > Invite User. Catat: di tabel mana Supabase menyimpan data pengguna dan bagaimana password di-hash?", "contoh_output": "Data pengguna tersimpan di tabel auth.users (bukan public schema). Password di-hash dengan bcrypt."},
   {"step": 2, "instruksi": "Buat GitHub OAuth App di github.com/settings/applications. Isi Authorization callback URL: http://localhost:3000/auth/callback. Masukkan Client ID dan Client Secret ke Supabase Dashboard. Test alur login GitHub.", "contoh_output": "Klik ''Login dengan GitHub'' → redirect ke GitHub → authorize → redirect kembali ke aplikasi dengan session aktif"},
   {"step": 3, "instruksi": "Buat file middleware.ts di root project. Implementasikan pemeriksaan session: jika pengguna belum login dan mengakses /dashboard, redirect ke /login. Uji dengan mengakses /dashboard langsung di browser tanpa login.", "contoh_output": "Browser otomatis di-redirect ke /login saat mengakses /dashboard tanpa session aktif"},
   {"step": 4, "instruksi": "Buat Route Handler di app/auth/callback/route.ts untuk menangani OAuth callback. Verifikasi bahwa setelah login GitHub, cookie session ter-set dengan benar menggunakan browser DevTools > Application > Cookies.", "contoh_output": "Cookie sb-access-token dan sb-refresh-token tersimpan di browser setelah login berhasil"},
   {"step": 5, "instruksi": "Baca session pengguna di Server Component menggunakan createClient() dari @supabase/ssr dan getUser(). Tampilkan nama/email pengguna di navbar. Verifikasi bahwa data user hanya bisa diakses setelah login.", "contoh_output": "Navbar menampilkan avatar dan email pengguna yang sedang login, diambil dari session server"}
 ]'::jsonb
),

-- PRAKTIKUM 6: CRUD & URL as State
(6,
 'Integrasi CRUD Penuh & URL sebagai State Manager',
 6,
 'Mahasiswa mampu mengimplementasikan operasi CRUD (Create, Read, Update, Delete) lengkap menggunakan Supabase client query dengan filter dan pagination, serta mengelola state filter dan pencarian melalui URL Search Parameters tanpa library state management tambahan.',
 'CRUD adalah akronim untuk empat operasi fundamental pada data: Create (INSERT), Read (SELECT), Update (UPDATE), Delete (DELETE). Dengan Supabase JavaScript client, operasi ini dilakukan melalui method .insert(), .select(), .update(), dan .delete() yang menghasilkan query PostgreSQL di balik layar. URL Search Parameters (URLSearchParams) adalah teknik menyimpan state aplikasi di URL — misalnya /tasks?filter=high&page=2&search=belajar. Keuntungannya: state dapat dibagikan via link, tidak hilang saat refresh, dan dapat diakses di Server Component tanpa useState.',
 '[
   {"step": 1, "instruksi": "Implementasikan Create: buat Server Action yang menerima data task baru dan memanggil supabase.from(''tasks'').insert(). Setelah berhasil, panggil revalidatePath(''/tasks''). Uji membuat 3 task baru dan verifikasi muncul di UI.", "contoh_output": "Task baru muncul di daftar tanpa reload halaman manual (revalidatePath bekerja)"},
   {"step": 2, "instruksi": "Implementasikan Read dengan filter: tambahkan .eq(''priority'', filter) ke query select jika filter aktif. Buat 3 tombol filter (All, High, Low). Klik masing-masing dan catat berapa task yang muncul.", "contoh_output": "Filter ''High'' menampilkan 2 task, filter ''Low'' menampilkan 1 task, filter ''All'' menampilkan 3 task"},
   {"step": 3, "instruksi": "Pindahkan state filter ke URL: gunakan useRouter().push(''/tasks?priority=high''). Di Server Component, baca searchParams.priority untuk filter query. Salin URL dari address bar — apakah halaman tetap sama saat dibuka di tab baru?", "contoh_output": "URL /tasks?priority=high dapat dibagikan dan menghasilkan tampilan yang identik di tab/browser berbeda"},
   {"step": 4, "instruksi": "Implementasikan Update: buat modal edit task. Saat disimpan, panggil Server Action dengan supabase.from(''tasks'').update(data).eq(''id'', taskId). Verifikasi perubahan tersimpan ke database.", "contoh_output": "Nama task berubah di UI setelah disimpan, data ter-update di Supabase Table Editor"},
   {"step": 5, "instruksi": "Implementasikan Delete: tambahkan tombol hapus di setiap task card. Gunakan Optimistic UI: hapus task dari UI seketika, lalu konfirmasi ke server. Jika server error, kembalikan task. Simulasikan error dengan memutus koneksi.", "contoh_output": "Task hilang dari UI instan. Saat koneksi diputus, task muncul kembali otomatis (rollback optimistic)"}
 ]'::jsonb
),

-- PRAKTIKUM 7: Row Level Security
(7,
 'Keamanan Database: Row Level Security (RLS) PostgreSQL',
 12,
 'Mahasiswa mampu mengaktifkan dan mengonfigurasi Row Level Security di PostgreSQL Supabase, menulis RLS Policies untuk operasi SELECT, INSERT, UPDATE, dan DELETE berdasarkan identitas pengguna yang terautentikasi, serta memverifikasi keamanan isolasi data antar pengguna.',
 'Row Level Security (RLS) adalah fitur keamanan PostgreSQL yang memungkinkan kontrol akses pada level baris individual dalam sebuah tabel. Ketika RLS diaktifkan pada sebuah tabel (ALTER TABLE tasks ENABLE ROW LEVEL SECURITY), seluruh akses ke tabel tersebut diblokir secara default — bahkan untuk anon key. Policy kemudian dibuat untuk mendefinisikan kondisi akses: CREATE POLICY "users_own_tasks" ON tasks FOR SELECT USING (auth.uid() = user_id). Fungsi auth.uid() mengembalikan UUID pengguna yang sedang terautentikasi dari JWT token, memungkinkan Supabase memfilter baris secara otomatis di level database.',
 '[
   {"step": 1, "instruksi": "Aktifkan RLS pada tabel tasks: ALTER TABLE tasks ENABLE ROW LEVEL SECURITY. Kemudian coba akses tabel dari aplikasi tanpa menambahkan policy. Apa yang terjadi? Catat response Supabase client.", "contoh_output": "Query mengembalikan [] (array kosong) — RLS memblokir semua akses karena belum ada policy"},
   {"step": 2, "instruksi": "Buat SELECT Policy: CREATE POLICY \"select_own\" ON tasks FOR SELECT USING (auth.uid() = user_id). Login sebagai User A, buat 2 task. Login sebagai User B, buat 1 task. Verifikasi masing-masing hanya bisa melihat task miliknya.", "contoh_output": "User A melihat 2 task miliknya, User B melihat 1 task miliknya — data terisolasi sempurna"},
   {"step": 3, "instruksi": "Buat INSERT Policy: WITH CHECK (auth.uid() = user_id). Coba insert task sebagai User A dengan user_id milik User B secara manual. Apa response yang diterima?", "contoh_output": "Error: new row violates row-level security policy — tidak bisa menyamar sebagai user lain"},
   {"step": 4, "instruksi": "Buat UPDATE dan DELETE Policy dengan kondisi yang sama. Coba update/delete task User B saat login sebagai User A melalui Supabase client di browser console. Catat hasilnya.", "contoh_output": "0 rows affected — RLS diam-diam memblokir operasi tanpa error (security by obscurity)"},
   {"step": 5, "instruksi": "Buat policy Admin Override: USING (auth.jwt() ->> ''role'' = ''admin'' OR auth.uid() = user_id). Set role ''admin'' ke salah satu user via Supabase Dashboard > Auth > Users > Custom Claims. Verifikasi admin bisa melihat semua task.", "contoh_output": "User admin melihat semua task dari semua pengguna, sementara user biasa tetap hanya melihat miliknya"}
 ]'::jsonb
)
ON CONFLICT (id) DO UPDATE
  SET title = EXCLUDED.title,
      lecture_module = EXCLUDED.lecture_module,
      capaian = EXCLUDED.capaian,
      dasar_teori = EXCLUDED.dasar_teori,
      steps = EXCLUDED.steps;

-- ---------------------------------------------------------------
-- STORAGE BUCKET: practicum-reports
-- ---------------------------------------------------------------
-- Otomatis buat bucket privat 'practicum-reports' jika belum ada
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'practicum-reports',
  'practicum-reports',
  false, -- private bucket (akses aman via signed URL)
  10485760, -- 10 MB per file PDF
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Kebijakan Akses (RLS) Storage Bucket:
-- 1. Izinkan insert/upload dokumen PDF laporan
CREATE POLICY "Allow uploads to practicum-reports"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'practicum-reports');

-- 2. Izinkan update/overwrite dokumen saat dosen menyetujui laporan
CREATE POLICY "Allow updates to practicum-reports"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'practicum-reports');

-- 3. Izinkan pembacaan file untuk download & preview PDF
CREATE POLICY "Allow reads from practicum-reports"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'practicum-reports');

