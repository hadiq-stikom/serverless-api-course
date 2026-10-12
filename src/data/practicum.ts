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
  capaian: string; // Deskripsi resmi capaian RPS
  dasarTeori: string;
  steps: PracticumStep[];
  theme: {
    color: "teal" | "cyan" | "indigo" | "emerald" | "amber" | "violet" | "rose" | "orange" | "slate";
    badge: string;
  };
  actionHook: string; // Kalimat aksi ringkas pemicu semangat
  techPills: string[]; // Deretan pill teknologi nyata
  level: "Fundamental" | "Intermediate" | "Advanced";
  durationMinutes: number;
}

export const PRACTICUM_MODULES: PracticumModule[] = [
  {
    id: 1,
    title: "Next.js 16 App Router: Server vs Client Component & Hydration",
    lectureModule: 2,
    capaian:
      "Mahasiswa mampu membedakan perilaku Server Component dan Client Component di Next.js App Router melalui pengujian langsung, mengamati perbedaan output streaming HTML, inspeksi ukuran JavaScript bundle di DevTools, serta menerapkan pola komposisi Interleaving.",
    dasarTeori:
      "Arsitektur Next.js 16 App Router membagi pohon komponen menjadi dua ranah komputasi: React Server Components (RSC) dan Client Components. Secara default, setiap komponen adalah RSC yang dieksekusi 100% di server (Node.js runtime) dan menghasilkan streaming HTML murni dengan dampak bundle 0 kB ke sisi klien. Output console.log() pada RSC dieksekusi di server dan hanya tampil pada terminal CLI, bukan di browser console. Sebaliknya, Client Component ditandai dengan direktif 'use client' di baris paling awal, menandakan batas (boundary) bahwa kode komponen beserta dependensinya wajib dibundle dan dikirimkan ke peramban untuk proses hydration interaktif (mengaitkan event listeners dan state dinamis). Pada DevTools Network, halaman RSC murni hanya mengunduh runtime dasar Next.js (~85 KB), sementara halaman Client Component memuat bundle tambahan (~120 KB+). Pemanggilan hooks seperti useState di RSC dilarang keras dan memicu compiler guardrail error. Untuk menggabungkan komponen server di dalam komponen client tanpa mengorbankan sifat 0 kB bundle, diterapkan pola Interleaving (komposisi via props children).",
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
    actionHook: "Uji live streaming HTML, inspeksi bundle 0 kB di DevTools, dan rakit pola Interleaving RSC.",
    techPills: ["Next.js 16", "RSC (0 kB)", "DevTools Network", "Interleaving"],
    level: "Fundamental",
    durationMinutes: 45,
    theme: { color: "teal", badge: "Frontend Architecture" },
  },
  {
    id: 2,
    title: "Server Actions & Validasi Skema Data dengan Zod",
    lectureModule: 3,
    capaian:
      "Mahasiswa mampu membuat Server Action di Next.js untuk memproses mutasi data secara aman, mengimplementasikan validasi schema menggunakan Zod, menangani error validasi fieldErrors, serta mengelola siklus feedback form menggunakan React 19 form hooks.",
    dasarTeori:
      "Server Actions adalah fungsi asinkron yang berjalan eksklusif di lingkungan server Node.js, ditandai dengan direktif 'use server'. Arsitektur ini mengabstraksi mutasi HTTP POST menjadi Remote Procedure Call (RPC) tipe-aman tanpa perlu membuat berkas API route (/api/...) secara manual. Zod bertindak sebagai Single Source of Truth yang menggabungkan validasi runtime JavaScript dengan type inference TypeScript statis (z.infer). Metode safeParse() menerapkan pola zero-exception defensive programming, mengembalikan objek diskriminatif yang memetakan error secara presisi per input field via result.error.flatten().fieldErrors. Pada sisi antarmuka, hook resmi React 19 useActionState mengotomasi seluruh siklus pengiriman formulir (idle → pending → settled) dan menyediakan boolean isPending untuk mencegah insiden double-submission secara bawaan.",
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
    actionHook: "Eksekusi mutasi RPC server-side via Server Actions, validasi skema Zod, dan kelola React 19 form hooks.",
    techPills: ["Server Actions", "Zod 3", "React 19 Forms", "fieldErrors"],
    level: "Fundamental",
    durationMinutes: 45,
    theme: { color: "emerald", badge: "Backend & Validation" },
  },
  {
    id: 3,
    title: "Database Relasional PostgreSQL & Integrasi Supabase",
    lectureModule: 4,
    capaian:
      "Mahasiswa mampu merancang skema database relasional di PostgreSQL menggunakan Supabase, membuat tabel dengan foreign key constraint dan UUID v4, menjalankan query CRUD dasar, serta mengintegrasikan Supabase client di Next.js 16 menggunakan paket @supabase/ssr dan otomatisasi TypeScript typegen.",
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
    actionHook: "Rancang DDL tabel berelasi CASCADE, query JOIN relasional, dan otomatisasi Supabase SSR typegen.",
    techPills: ["PostgreSQL", "Supabase BaaS", "UUID v4", "Typegen TS"],
    level: "Intermediate",
    durationMinutes: 50,
    theme: { color: "cyan", badge: "Database Relasional" },
  },
  {
    id: 4,
    title: "Autentikasi Multi-Provider & Proteksi Rute Edge Middleware",
    lectureModule: 5,
    capaian:
      "Mahasiswa mampu mengimplementasikan sistem autentikasi lengkap menggunakan Supabase Auth dengan Email/Password dan GitHub OAuth 2.0, mengamankan rute privat menggunakan Next.js 16 Edge Middleware, serta mengelola session pengguna secara aman di Server Components dan otomatisasi profile via database trigger.",
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
    actionHook: "Pasang autentikasi Email & GitHub OAuth 2.0, proteksi rute privat dengan Next.js 16 Edge Middleware.",
    techPills: ["Supabase Auth", "GitHub OAuth", "Edge Middleware", "JWT Sessions"],
    level: "Intermediate",
    durationMinutes: 50,
    theme: { color: "indigo", badge: "Auth & Security" },
  },
  {
    id: 5,
    title: "Integrasi CRUD & Universal REST API Route Handlers",
    lectureModule: 6,
    capaian:
      "Mahasiswa mampu mengimplementasikan arsitektur ganda (Server Actions untuk web UI internal dan Universal REST API Route Handlers untuk klien eksternal), menerapkan otentikasi Bearer JWT token, menangani dynamic async params Next.js 16, serta mengelola URL as State manager.",
    dasarTeori:
      "Dalam arsitektur web modern, pendekatan Dual Architecture memadukan Server Actions sebagai Backend-for-Frontend (BFF) untuk mutasi form internal, dan Universal REST API Route Handlers (/api/v1/...) untuk konsumsi klien pihak ketiga atau aplikasi mobile. Route Handlers di Next.js 16 mendukung otentikasi stateless berbasis Bearer Token JWT di header Authorization, standarisasi respons error RFC 7807, serta penanganan parameter dinamis asinkron (await params). URL Search Parameters berfungsi sebagai state manager global yang dapat dibagikan dan tidak hilang saat halaman di-refresh.",
    steps: [
      {
        step: 1,
        instruksi:
          "Implementasikan Create: buat Server Action createTaskAction yang menerima data task baru dan memanggil supabase.from('tasks').insert(). Setelah berhasil, panggil revalidatePath('/tasks'). Uji membuat 3 task baru dan verifikasi muncul di UI.",
        contoh_output: "Task baru muncul di daftar tanpa reload halaman manual (revalidatePath bekerja)",
      },
      {
        step: 2,
        instruksi:
          "Bangun Universal Route Handler GET di src/app/api/v1/tasks/route.ts yang membaca searchParams (limit, page), menjalankan kueri range pagination ke Supabase, dan mengembalikan format respons terstandarisasi { success: true, data: [...], pagination: {...} }.",
        contoh_output: "Response HTTP 200 OK dengan JSON payload koleksi tugas dan pagination metadata",
      },
      {
        step: 3,
        instruksi:
          "Bangun Universal Route Handler POST di rute yang sama untuk menerima JSON body, memverifikasi header Authorization: Bearer <token> menggunakan helper apiAuth, dan mengembalikan HTTP 201 Created atau HTTP 401 Unauthorized.",
        contoh_output: "HTTP 201 Created saat token valid; HTTP 401 Unauthorized saat token tidak disertakan",
      },
      {
        step: 4,
        instruksi:
          "Bangun Dynamic Route Handler di src/app/api/v1/tasks/[id]/route.ts dengan async params (const { id } = await params) untuk menangani method GET dan DELETE spesifik ID. Uji pemanggilan endpoint via cURL atau Thunder Client.",
        contoh_output: "HTTP 200 OK saat ID ditemukan; HTTP 404 Not Found saat ID acak tidak ada di database",
      },
      {
        step: 5,
        instruksi:
          "Pindahkan state filter dan pencarian di halaman web ke URL menggunakan useRouter().push('/tasks?status=done&search=...'). Di Server Component, baca searchParams untuk memfilter data. Verifikasi bahwa URL dapat dibagikan dan menghasilkan tampilan yang identik di tab baru.",
        contoh_output:
          "URL /tasks?status=done dapat dibagikan dan menghasilkan tampilan yang identik di tab/browser berbeda",
      },
    ],
    actionHook: "Implementasikan dual-architecture Server Actions + Universal REST API dengan proteksi Bearer JWT token.",
    techPills: ["Route Handlers", "Universal REST", "Bearer Token", "Async Params"],
    level: "Intermediate",
    durationMinutes: 50,
    theme: { color: "amber", badge: "CRUD & REST API" },
  },
  {
    id: 6,
    title: "Supabase Real-time: Kolaborasi WebSocket & Presence",
    lectureModule: 11,
    capaian:
      "Mahasiswa mampu mengimplementasikan sinkronisasi data real-time menggunakan Supabase Realtime (WebSocket), mengonfigurasi listener 'postgres_changes' untuk event INSERT/UPDATE/DELETE, mendeteksi pengguna online dengan Presence API, serta mengelola lifecycle koneksi channel tanpa memory leak.",
    dasarTeori:
      "Supabase Realtime memanfaatkan protokol WebSocket untuk menyediakan koneksi persisten dua arah antara browser dan server database. Fitur 'postgres_changes' mendengarkan Write-Ahead Log (WAL) PostgreSQL melalui replication slot dan mem-broadcast setiap perubahan baris data ke channel yang tersubscribe seketika tanpa perlu polling HTTP. Presence API memungkinkan pelacakan state pengguna yang sedang aktif secara terdistribusi. Pengelolaan lifecycle channel (subscribe dan removeChannel pada fungsi cleanup useEffect) sangat krusial untuk mencegah kebocoran memori (memory leak) di sisi browser klien.",
    steps: [
      {
        step: 1,
        instruksi:
          "Buka Supabase Dashboard > Database > Publications. Aktifkan replikasi real-time pada tabel tasks. Verifikasi tabel tasks terdaftar di publikasi supabase_realtime.",
        contoh_output: "Tabel tasks berstatus Realtime Enabled di dashboard Supabase",
      },
      {
        step: 2,
        instruksi:
          "Buat hook useRealtimeTasks di client: buat channel supabase.channel('tasks-live') dan pasang listener on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => ...). Tampilkan status koneksi channel di console.",
        contoh_output: "Log browser: Channel status: SUBSCRIBED, siap mendengarkan event database",
      },
      {
        step: 3,
        instruksi:
          "Buka Supabase Table Editor di tab browser lain, lakukan INSERT data baru secara manual ke tabel tasks. Amati jendela browser aplikasi. Apakah data baru langsung tertangkap di console tanpa refresh?",
        contoh_output: "Log browser: Postgres change received: { eventType: 'INSERT', new: { title: 'Tugas Realtime' } }",
      },
      {
        step: 4,
        instruksi:
          "Implementasikan sinkronisasi state lokal: saat event INSERT diterima, masukkan payload baru ke state array tugas. Buka dua jendela browser berdampingan (Tab A dan Tab B). Tambahkan tugas melalui form di Tab A. Amati apakah Tab B menampilkan tugas baru tersebut dalam waktu < 1 detik.",
        contoh_output: "Tugas baru muncul otomatis di Tab B seketika (< 1s) setelah form disubmit di Tab A tanpa reload halaman",
      },
      {
        step: 5,
        instruksi:
          "Implementasikan Presence tracking: panggil channel.track({ user: user.email, online_at: new Date().toISOString() }) dan dengarkan event 'sync'. Tampilkan badge 'X Pengguna Sedang Online' di header aplikasi. Uji dengan membuka dan menutup tab kedua.",
        contoh_output: "Badge menampilkan '2 Online', otomatis berkurang menjadi '1 Online' saat tab kedua ditutup",
      },
    ],
    actionHook: "Sinkronisasi live data via listener WAL PostgreSQL 'postgres_changes' dan lacak user aktif via Presence API.",
    techPills: ["Supabase Realtime", "WebSocket", "WAL Broadcast", "Presence API"],
    level: "Advanced",
    durationMinutes: 55,
    theme: { color: "teal", badge: "Real-time & WebSocket" },
  },
  {
    id: 7,
    title: "Keamanan Database: Row Level Security (RLS) PostgreSQL",
    lectureModule: 12,
    capaian:
      "Mahasiswa mampu mengaktifkan dan mengonfigurasi Row Level Security di PostgreSQL Supabase, menulis RLS Policies untuk operasi SELECT, INSERT, UPDATE, dan DELETE berdasarkan identitas pengguna yang terautentikasi (auth.uid()), serta memverifikasi keamanan isolasi data antar pengguna multi-tenant.",
    dasarTeori:
      "Row Level Security (RLS) adalah fitur keamanan PostgreSQL yang memungkinkan kontrol akses pada level baris individual dalam sebuah tabel. Ketika RLS diaktifkan pada sebuah tabel (ALTER TABLE tasks ENABLE ROW LEVEL SECURITY), seluruh akses ke tabel tersebut diblokir secara default — bahkan untuk anon key. Policy kemudian dibuat untuk mendefinisikan kondisi akses: CREATE POLICY \"users_own_tasks\" ON tasks FOR SELECT USING (auth.uid() = user_id). Fungsi auth.uid() mengembalikan UUID pengguna yang sedang terautentikasi dari JWT token, memungkinkan Supabase memfilter baris secara otomatis di level database.",
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
    actionHook: "Kunci tabel dengan PostgreSQL RLS, susun policy isolasi multi-tenant berbasis auth.uid(), dan uji bypass admin.",
    techPills: ["Postgres RLS", "Security Policies", "auth.uid()", "Multi-Tenant"],
    level: "Advanced",
    durationMinutes: 55,
    theme: { color: "rose", badge: "Database Security & RLS" },
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
  teal: {
    bg: "bg-teal-500/10",
    border: "border-teal-500/25",
    text: "text-teal-700 dark:text-teal-300",
    badge: "bg-teal-500/10 text-teal-800 dark:text-teal-300 border-teal-500/25",
    button: "bg-teal-700 hover:bg-teal-800 text-white dark:bg-teal-600 dark:hover:bg-teal-500",
    accent: "bg-teal-600 dark:bg-teal-500",
    ring: "ring-teal-500/30",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/25",
    text: "text-cyan-700 dark:text-cyan-300",
    badge: "bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border-cyan-500/25",
    button: "bg-cyan-700 hover:bg-cyan-800 text-white dark:bg-cyan-600 dark:hover:bg-cyan-500",
    accent: "bg-cyan-600 dark:bg-cyan-500",
    ring: "ring-cyan-500/30",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    text: "text-emerald-700 dark:text-emerald-300",
    badge: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/25",
    button: "bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500",
    accent: "bg-emerald-600 dark:bg-emerald-500",
    ring: "ring-emerald-500/30",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
    text: "text-amber-800 dark:text-amber-300",
    badge: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/25",
    button: "bg-amber-700 hover:bg-amber-800 text-white dark:bg-amber-600 dark:hover:bg-amber-500",
    accent: "bg-amber-600 dark:bg-amber-500",
    ring: "ring-amber-500/30",
  },
  slate: {
    bg: "bg-slate-500/10",
    border: "border-slate-500/25",
    text: "text-slate-700 dark:text-slate-300",
    badge: "bg-slate-500/10 text-slate-800 dark:text-slate-300 border-slate-500/25",
    button: "bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600",
    accent: "bg-slate-600 dark:bg-slate-500",
    ring: "ring-slate-500/30",
  },
  indigo: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/25",
    text: "text-indigo-700 dark:text-indigo-300",
    badge: "bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 border-indigo-500/25",
    button: "bg-indigo-700 hover:bg-indigo-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500",
    accent: "bg-indigo-600 dark:bg-indigo-500",
    ring: "ring-indigo-500/30",
  },
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/25",
    text: "text-violet-700 dark:text-violet-300",
    badge: "bg-violet-500/10 text-violet-800 dark:text-violet-300 border-violet-500/25",
    button: "bg-violet-700 hover:bg-violet-800 text-white dark:bg-violet-600 dark:hover:bg-violet-500",
    accent: "bg-violet-600 dark:bg-violet-500",
    ring: "ring-violet-500/30",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/25",
    text: "text-rose-700 dark:text-rose-300",
    badge: "bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-500/25",
    button: "bg-rose-700 hover:bg-rose-800 text-white dark:bg-rose-600 dark:hover:bg-rose-500",
    accent: "bg-rose-600 dark:bg-rose-500",
    ring: "ring-rose-500/30",
  },
  orange: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
    text: "text-amber-800 dark:text-amber-300",
    badge: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/25",
    button: "bg-amber-700 hover:bg-amber-800 text-white dark:bg-amber-600 dark:hover:bg-amber-500",
    accent: "bg-amber-600 dark:bg-amber-500",
    ring: "ring-amber-500/30",
  },
};

export const DEFAULT_PRACTICUM_THEME = THEME_COLORS.teal;

export function getPracticumTheme(color?: string) {
  if (color && color in THEME_COLORS) {
    return THEME_COLORS[color as keyof typeof THEME_COLORS];
  }
  return DEFAULT_PRACTICUM_THEME;
}
