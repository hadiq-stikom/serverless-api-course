// src/data/practicum.ts
// Data statis 7 Modul Praktikum — The Serverless Odyssey
// Data ini digunakan di UI dan sebagai referensi untuk seed database

export interface PracticumStep {
  step: number;
  instruksi: string;
  contoh_output: string;
}

export interface PracticumModule {
  id: number;
  title: string;
  lectureModule: number; // Modul kuliah referensi
  capaian: string;
  dasarTeori: string;
  steps: PracticumStep[];
  theme: {
    color: "cyan" | "indigo" | "emerald" | "amber" | "violet" | "rose" | "orange";
    badge: string;
  };
}

export const PRACTICUM_MODULES: PracticumModule[] = [
  {
    id: 1,
    title: "Ekosistem Serverless & Manajemen Repository Git",
    lectureModule: 1,
    capaian:
      "Mahasiswa mampu menginisialisasi repository proyek Next.js, mengonfigurasi proteksi kunci rahasia dengan .gitignore dan .env.local, serta memahami alur kerja Git dasar (init, add, commit, push) sebagai fondasi kolaborasi tim berbasis cloud.",
    dasarTeori:
      "Arsitektur Serverless memungkinkan developer menjalankan logika bisnis tanpa mengelola server secara langsung. Platform seperti Vercel (FaaS) menjalankan fungsi secara on-demand, sementara Supabase (BaaS) menyediakan layanan backend terkelola. Git adalah sistem kontrol versi terdistribusi yang mencatat perubahan kode secara atomik melalui commit. File .env.local menyimpan variabel lingkungan rahasia (seperti API key dan database URL) yang TIDAK boleh masuk ke dalam repository publik — dilindungi oleh entri di file .gitignore.",
    steps: [
      {
        step: 1,
        instruksi:
          "Inisialisasi project Next.js baru dengan perintah: npx create-next-app@latest my-project --typescript --app --tailwind --eslint --no-src-dir. Catat output yang muncul di terminal.",
        contoh_output: "✓ Creating project in ./my-project... ✓ Installing dependencies...",
      },
      {
        step: 2,
        instruksi:
          "Masuk ke folder project dan jalankan git log --oneline untuk melihat commit awal. Catat hash commit dan pesan commit yang ada.",
        contoh_output: "a1b2c3d (HEAD -> main) Initial commit from create-next-app",
      },
      {
        step: 3,
        instruksi:
          "Buat file .env.local dengan isi: NEXT_PUBLIC_SUPABASE_URL=https://test.supabase.co. Cek apakah file tersebut sudah terdaftar di .gitignore dengan perintah: cat .gitignore | grep env.",
        contoh_output: ".env.local tercantum dalam .gitignore",
      },
      {
        step: 4,
        instruksi:
          "Jalankan git status untuk melihat status file. Apakah file .env.local muncul sebagai untracked file? Catat hasilnya.",
        contoh_output: "nothing to commit, working tree clean (atau .env.local tidak muncul di git status)",
      },
      {
        step: 5,
        instruksi:
          "Buat file README.md berisi deskripsi singkat project. Jalankan siklus lengkap: git add README.md, git commit -m 'docs: tambah README awal', dan git log --oneline. Catat hash commit baru.",
        contoh_output: "b2c3d4e (HEAD -> main) docs: tambah README awal",
      },
    ],
    theme: { color: "cyan", badge: "Fondasi & DevOps" },
  },
  {
    id: 2,
    title: "Next.js App Router: Server vs Client Component",
    lectureModule: 2,
    capaian:
      "Mahasiswa mampu membedakan perilaku Server Component dan Client Component di Next.js App Router melalui pengujian langsung, mengamati perbedaan output HTML, ukuran JavaScript bundle, dan cara rendering masing-masing komponen.",
    dasarTeori:
      "Next.js App Router menggunakan React Server Components (RSC) secara default. Server Components dirender sepenuhnya di server — tidak mengirimkan JavaScript ke browser, memungkinkan akses langsung ke database dan environment variables rahasia, namun tidak dapat menggunakan hooks (useState, useEffect) atau event handler. Client Components ditandai dengan direktif 'use client' di baris pertama file — komponen ini dikirimkan sebagai JavaScript bundle ke browser dan dapat menggunakan seluruh fitur React interaktif. Pemisahan yang tepat antara RSC dan Client Component adalah kunci performa aplikasi Next.js modern.",
    steps: [
      {
        step: 1,
        instruksi:
          "Buat file app/test-rsc/page.tsx sebagai Server Component (tanpa 'use client'). Tambahkan console.log('[SERVER] Rendered at:', new Date().toISOString()). Akses halaman di browser dan cek: apakah log muncul di browser console atau terminal server?",
        contoh_output: "Log muncul di terminal server (bukan browser console)",
      },
      {
        step: 2,
        instruksi:
          "Buat file app/test-client/page.tsx dengan direktif 'use client' di baris pertama. Tambahkan useState dan console.log('[CLIENT] Mounted'). Akses di browser. Di mana log muncul sekarang?",
        contoh_output: "Log muncul di browser DevTools console",
      },
      {
        step: 3,
        instruksi:
          "Buka browser DevTools > Network > Filter 'JS'. Bandingkan ukuran JavaScript yang diunduh saat mengakses /test-rsc vs /test-client. Catat perbandingan ukurannya.",
        contoh_output: "test-rsc: ~85 KB | test-client: ~120 KB (lebih besar karena bundle React interaktif)",
      },
      {
        step: 4,
        instruksi:
          "Coba tambahkan useState di dalam Server Component (test-rsc/page.tsx). Jalankan npm run dev. Apa error yang muncul di terminal atau browser?",
        contoh_output: "Error: useState only works in Client Components. Add the 'use client' directive...",
      },
      {
        step: 5,
        instruksi:
          "Implementasikan pola Interleaving: buat ServerWrapper (RSC) yang membungkus ClientCounter (Client). Import dan render ServerWrapper di page.tsx. Verifikasi bahwa kedua komponen berjalan bersamaan.",
        contoh_output:
          "ServerWrapper render di server, ClientCounter dengan tombol increment berjalan di browser",
      },
    ],
    theme: { color: "indigo", badge: "Frontend Architecture" },
  },
  {
    id: 3,
    title: "Server Actions & Validasi Skema Data dengan Zod",
    lectureModule: 3,
    capaian:
      "Mahasiswa mampu membuat Server Action di Next.js untuk memproses mutasi data secara aman, mengimplementasikan validasi schema menggunakan Zod, menangani error validasi, dan menampilkan feedback form yang informatif kepada pengguna.",
    dasarTeori:
      "Server Actions adalah fungsi asinkron yang berjalan eksklusif di server, ditandai dengan direktif 'use server'. Fungsi ini dipanggil langsung dari Client Component seperti memanggil fungsi biasa, namun eksekusinya terjadi di server — membuat operasi mutasi database aman tanpa membuat API route manual. Zod adalah library TypeScript-first untuk deklarasi dan validasi schema data. Metode safeParse() mengembalikan objek {success: boolean, data?, error?} yang memungkinkan penanganan error validasi tanpa melempar exception — sangat ideal untuk validasi form yang mengharapkan input pengguna yang mungkin tidak valid.",
    steps: [
      {
        step: 1,
        instruksi:
          "Buat file src/actions/test-action.ts dengan direktif 'use server'. Buat fungsi createTaskAction yang menerima formData: FormData. Log isi formData ke console server. Panggil dari form HTML biasa di page.tsx.",
        contoh_output: "[Server] FormData: { title: 'test', priority: 'high' }",
      },
      {
        step: 2,
        instruksi:
          "Install Zod: npm install zod. Buat schema validasi TaskSchema dengan field: title (string, min 3 karakter), priority (enum: 'low', 'medium', 'high'), deadline (optional date). Test dengan data valid.",
        contoh_output: "{ success: true, data: { title: 'Belajar Zod', priority: 'high' } }",
      },
      {
        step: 3,
        instruksi:
          "Test schema yang sama dengan data TIDAK VALID: title ' ' (spasi saja), priority 'urgent' (bukan enum). Catat output ZodError dan struktur fieldErrors yang dihasilkan.",
        contoh_output:
          "{ success: false, error: { fieldErrors: { title: ['String must contain at least 3 characters'], priority: ['Invalid enum value'] } } }",
      },
      {
        step: 4,
        instruksi:
          "Integrasikan Zod ke dalam createTaskAction. Gunakan safeParse(), kemudian return { success: false, errors: result.error.flatten().fieldErrors } jika invalid. Tampilkan pesan error di bawah setiap field form.",
        contoh_output: "Form menampilkan pesan merah di bawah field yang error tanpa reload halaman",
      },
      {
        step: 5,
        instruksi:
          "Gunakan useActionState untuk menangkap return value dari Server Action. Verifikasi: saat form valid, tampilkan pesan sukses. Saat invalid, tampilkan error per field. Uji kedua skenario.",
        contoh_output: "State 'idle' → 'pending' → 'success'/'error' berjalan dengan benar",
      },
    ],
    theme: { color: "emerald", badge: "Backend & Validation" },
  },
  {
    id: 4,
    title: "Database Relasional PostgreSQL & Integrasi Supabase",
    lectureModule: 4,
    capaian:
      "Mahasiswa mampu merancang skema database relasional di PostgreSQL menggunakan Supabase, membuat tabel dengan foreign key constraint, menjalankan query CRUD dasar, dan mengintegrasikan Supabase client di aplikasi Next.js menggunakan paket @supabase/ssr.",
    dasarTeori:
      "PostgreSQL adalah sistem manajemen database relasional (RDBMS) yang kuat dan open-source. Supabase menyediakan PostgreSQL sebagai layanan BaaS (Backend-as-a-Service) dengan API RESTful dan client library untuk berbagai bahasa. Relasi antar tabel diimplementasikan melalui Foreign Key Constraint — kolom di tabel anak yang merujuk ke Primary Key tabel induk. UUID (Universally Unique Identifier) dipilih sebagai Primary Key karena aman, tidak prediktif, dan bisa di-generate di sisi client maupun server tanpa koordinasi dengan database.",
    steps: [
      {
        step: 1,
        instruksi:
          "Buka Supabase Dashboard > SQL Editor. Jalankan DDL untuk membuat tabel categories (id UUID PK, name TEXT NOT NULL) dan tasks (id UUID PK, category_id UUID FK REFERENCES categories). Periksa tabel di Table Editor.",
        contoh_output: "Tabel categories dan tasks muncul di sidebar Supabase Table Editor",
      },
      {
        step: 2,
        instruksi:
          "Insert 3 baris ke tabel categories dan 5 baris ke tabel tasks yang merujuk ke categories tersebut. Jalankan query JOIN: SELECT t.*, c.name as category_name FROM tasks t JOIN categories c ON t.category_id = c.id. Catat hasilnya.",
        contoh_output: "5 baris tasks dengan kolom category_name terisi dari tabel categories",
      },
      {
        step: 3,
        instruksi:
          "Coba hapus sebuah baris di tabel categories yang masih dirujuk oleh tasks. Apa error yang muncul? Kemudian ubah FK menjadi ON DELETE CASCADE dan ulangi penghapusan. Apa yang terjadi?",
        contoh_output:
          "Tanpa CASCADE: ERROR violates foreign key constraint. Dengan CASCADE: baris categories + tasks terkait terhapus bersamaan",
      },
      {
        step: 4,
        instruksi:
          "Install @supabase/ssr dan @supabase/supabase-js. Buat utility src/utils/supabase/server.ts. Panggil dari Server Component untuk fetch semua tasks. Tampilkan di UI sebagai list.",
        contoh_output: "Daftar tasks muncul di halaman, diambil langsung dari Supabase di server",
      },
      {
        step: 5,
        instruksi:
          "Jalankan npx supabase gen types typescript --project-id <id> > src/types/database.types.ts. Verifikasi tipe yang dihasilkan mencerminkan schema tabel. Gunakan tipe tersebut di query Supabase client.",
        contoh_output:
          "File database.types.ts berisi interface Tables<'tasks'> dengan field id, category_id, dll.",
      },
    ],
    theme: { color: "orange", badge: "Database" },
  },
  {
    id: 5,
    title: "Autentikasi Multi-Provider & Proteksi Rute Next.js",
    lectureModule: 5,
    capaian:
      "Mahasiswa mampu mengimplementasikan sistem autentikasi lengkap menggunakan Supabase Auth dengan Email/Password dan GitHub OAuth, mengamankan rute privat menggunakan Next.js Middleware, serta mengelola session pengguna secara aman di Server Components.",
    dasarTeori:
      "Autentikasi memverifikasi identitas pengguna, sementara otorisasi menentukan hak akses setelah identitas terverifikasi. Supabase Auth menggunakan JWT (JSON Web Token) yang dirotasi secara kriptografis. GitHub OAuth 2.0 adalah protokol delegasi otorisasi — pengguna memberikan izin kepada aplikasi untuk mengakses data profil GitHub mereka tanpa berbagi password. Next.js Middleware berjalan di Edge Runtime sebelum request mencapai halaman/API, menjadikannya tempat ideal untuk memeriksa session dan melakukan redirect otomatis ke halaman login jika session tidak valid.",
    steps: [
      {
        step: 1,
        instruksi:
          "Buka Supabase Dashboard > Authentication > Providers. Aktifkan Email provider. Buat akun test melalui Supabase Auth > Users > Invite User. Catat: di tabel mana Supabase menyimpan data pengguna dan bagaimana password di-hash?",
        contoh_output:
          "Data pengguna tersimpan di tabel auth.users (bukan public schema). Password di-hash dengan bcrypt.",
      },
      {
        step: 2,
        instruksi:
          "Buat GitHub OAuth App di github.com/settings/applications. Isi Authorization callback URL: http://localhost:3000/auth/callback. Masukkan Client ID dan Client Secret ke Supabase Dashboard. Test alur login GitHub.",
        contoh_output:
          "Klik 'Login dengan GitHub' → redirect ke GitHub → authorize → redirect kembali ke aplikasi dengan session aktif",
      },
      {
        step: 3,
        instruksi:
          "Buat file middleware.ts di root project. Implementasikan pemeriksaan session: jika pengguna belum login dan mengakses /dashboard, redirect ke /login. Uji dengan mengakses /dashboard langsung di browser tanpa login.",
        contoh_output:
          "Browser otomatis di-redirect ke /login saat mengakses /dashboard tanpa session aktif",
      },
      {
        step: 4,
        instruksi:
          "Buat Route Handler di app/auth/callback/route.ts untuk menangani OAuth callback. Verifikasi bahwa setelah login GitHub, cookie session ter-set dengan benar menggunakan browser DevTools > Application > Cookies.",
        contoh_output:
          "Cookie sb-access-token dan sb-refresh-token tersimpan di browser setelah login berhasil",
      },
      {
        step: 5,
        instruksi:
          "Baca session pengguna di Server Component menggunakan createClient() dari @supabase/ssr dan getUser(). Tampilkan nama/email pengguna di navbar. Verifikasi bahwa data user hanya bisa diakses setelah login.",
        contoh_output:
          "Navbar menampilkan avatar dan email pengguna yang sedang login, diambil dari session server",
      },
    ],
    theme: { color: "violet", badge: "Auth & Security" },
  },
  {
    id: 6,
    title: "Integrasi CRUD Penuh & URL sebagai State Manager",
    lectureModule: 6,
    capaian:
      "Mahasiswa mampu mengimplementasikan operasi CRUD (Create, Read, Update, Delete) lengkap menggunakan Supabase client query dengan filter dan pagination, serta mengelola state filter dan pencarian melalui URL Search Parameters tanpa library state management tambahan.",
    dasarTeori:
      "CRUD adalah akronim untuk empat operasi fundamental pada data: Create (INSERT), Read (SELECT), Update (UPDATE), Delete (DELETE). Dengan Supabase JavaScript client, operasi ini dilakukan melalui method .insert(), .select(), .update(), dan .delete() yang menghasilkan query PostgreSQL di balik layar. URL Search Parameters (URLSearchParams) adalah teknik menyimpan state aplikasi di URL — misalnya /tasks?filter=high&page=2&search=belajar. Keuntungannya: state dapat dibagikan via link, tidak hilang saat refresh, dan dapat diakses di Server Component tanpa useState.",
    steps: [
      {
        step: 1,
        instruksi:
          "Implementasikan Create: buat Server Action yang menerima data task baru dan memanggil supabase.from('tasks').insert(). Setelah berhasil, panggil revalidatePath('/tasks'). Uji membuat 3 task baru dan verifikasi muncul di UI.",
        contoh_output: "Task baru muncul di daftar tanpa reload halaman manual (revalidatePath bekerja)",
      },
      {
        step: 2,
        instruksi:
          "Implementasikan Read dengan filter: tambahkan .eq('priority', filter) ke query select jika filter aktif. Buat 3 tombol filter (All, High, Low). Klik masing-masing dan catat berapa task yang muncul.",
        contoh_output:
          "Filter 'High' menampilkan 2 task, filter 'Low' menampilkan 1 task, filter 'All' menampilkan 3 task",
      },
      {
        step: 3,
        instruksi:
          "Pindahkan state filter ke URL: gunakan useRouter().push('/tasks?priority=high'). Di Server Component, baca searchParams.priority untuk filter query. Salin URL dari address bar — apakah halaman tetap sama saat dibuka di tab baru?",
        contoh_output:
          "URL /tasks?priority=high dapat dibagikan dan menghasilkan tampilan yang identik di tab/browser berbeda",
      },
      {
        step: 4,
        instruksi:
          "Implementasikan Update: buat modal edit task. Saat disimpan, panggil Server Action dengan supabase.from('tasks').update(data).eq('id', taskId). Verifikasi perubahan tersimpan ke database.",
        contoh_output: "Nama task berubah di UI setelah disimpan, data ter-update di Supabase Table Editor",
      },
      {
        step: 5,
        instruksi:
          "Implementasikan Delete dengan Optimistic UI: hapus task dari UI seketika, lalu konfirmasi ke server. Jika server error, kembalikan task. Simulasikan error dengan memutus koneksi sementara.",
        contoh_output:
          "Task hilang dari UI instan. Saat koneksi diputus, task muncul kembali otomatis (rollback optimistic)",
      },
    ],
    theme: { color: "amber", badge: "CRUD & State" },
  },
  {
    id: 7,
    title: "Keamanan Database: Row Level Security (RLS) PostgreSQL",
    lectureModule: 12,
    capaian:
      "Mahasiswa mampu mengaktifkan dan mengonfigurasi Row Level Security di PostgreSQL Supabase, menulis RLS Policies untuk operasi SELECT, INSERT, UPDATE, dan DELETE berdasarkan identitas pengguna yang terautentikasi, serta memverifikasi keamanan isolasi data antar pengguna.",
    dasarTeori:
      "Row Level Security (RLS) adalah fitur keamanan PostgreSQL yang memungkinkan kontrol akses pada level baris individual dalam sebuah tabel. Ketika RLS diaktifkan pada sebuah tabel, seluruh akses ke tabel tersebut diblokir secara default — bahkan untuk anon key. Policy kemudian dibuat untuk mendefinisikan kondisi akses: CREATE POLICY \"users_own_tasks\" ON tasks FOR SELECT USING (auth.uid() = user_id). Fungsi auth.uid() mengembalikan UUID pengguna yang sedang terautentikasi dari JWT token, memungkinkan Supabase memfilter baris secara otomatis di level database.",
    steps: [
      {
        step: 1,
        instruksi:
          "Aktifkan RLS pada tabel tasks: ALTER TABLE tasks ENABLE ROW LEVEL SECURITY. Kemudian coba akses tabel dari aplikasi tanpa menambahkan policy. Apa yang terjadi? Catat response Supabase client.",
        contoh_output: "Query mengembalikan [] (array kosong) — RLS memblokir semua akses karena belum ada policy",
      },
      {
        step: 2,
        instruksi:
          "Buat SELECT Policy: CREATE POLICY \"select_own\" ON tasks FOR SELECT USING (auth.uid() = user_id). Login sebagai User A, buat 2 task. Login sebagai User B, buat 1 task. Verifikasi masing-masing hanya bisa melihat task miliknya.",
        contoh_output: "User A melihat 2 task miliknya, User B melihat 1 task miliknya — data terisolasi sempurna",
      },
      {
        step: 3,
        instruksi:
          "Buat INSERT Policy: WITH CHECK (auth.uid() = user_id). Coba insert task sebagai User A dengan user_id milik User B secara manual. Apa response yang diterima?",
        contoh_output:
          "Error: new row violates row-level security policy — tidak bisa menyamar sebagai user lain",
      },
      {
        step: 4,
        instruksi:
          "Buat UPDATE dan DELETE Policy dengan kondisi yang sama. Coba update/delete task User B saat login sebagai User A melalui Supabase client di browser console. Catat hasilnya.",
        contoh_output: "0 rows affected — RLS diam-diam memblokir operasi tanpa error (security by obscurity)",
      },
      {
        step: 5,
        instruksi:
          "Buat policy Admin Override: USING (auth.jwt() ->> 'role' = 'admin' OR auth.uid() = user_id). Set role 'admin' ke salah satu user via Supabase Dashboard > Auth > Users > Custom Claims. Verifikasi admin bisa melihat semua task.",
        contoh_output:
          "User admin melihat semua task dari semua pengguna, sementara user biasa tetap hanya melihat miliknya",
      },
    ],
    theme: { color: "rose", badge: "Security & RLS" },
  },
];

export function getPracticumById(id: number): PracticumModule | undefined {
  return PRACTICUM_MODULES.find((p) => p.id === id);
}

export const THEME_COLORS: Record<
  PracticumModule["theme"]["color"],
  {
    bg: string;
    border: string;
    text: string;
    badge: string;
    button: string;
    accent: string;
    ring: string;
  }
> = {
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    text: "text-cyan-600 dark:text-cyan-400",
    badge: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
    button: "bg-cyan-600 hover:bg-cyan-700 text-white",
    accent: "bg-cyan-500",
    ring: "ring-cyan-500/40",
  },
  indigo: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    text: "text-indigo-600 dark:text-indigo-400",
    badge: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
    button: "bg-indigo-600 hover:bg-indigo-700 text-white",
    accent: "bg-indigo-500",
    ring: "ring-indigo-500/40",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    button: "bg-emerald-600 hover:bg-emerald-700 text-white",
    accent: "bg-emerald-500",
    ring: "ring-emerald-500/40",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    button: "bg-amber-600 hover:bg-amber-700 text-white",
    accent: "bg-amber-500",
    ring: "ring-amber-500/40",
  },
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    text: "text-violet-600 dark:text-violet-400",
    badge: "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30",
    button: "bg-violet-600 hover:bg-violet-700 text-white",
    accent: "bg-violet-500",
    ring: "ring-violet-500/40",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-600 dark:text-rose-400",
    badge: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
    button: "bg-rose-600 hover:bg-rose-700 text-white",
    accent: "bg-rose-500",
    ring: "ring-rose-500/40",
  },
  orange: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-600 dark:text-orange-400",
    badge: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
    button: "bg-orange-600 hover:bg-orange-700 text-white",
    accent: "bg-orange-500",
    ring: "ring-orange-500/40",
  },
};
