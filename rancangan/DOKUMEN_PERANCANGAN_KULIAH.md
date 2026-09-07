# Buku Rancangan Pembelajaran (BRP) & Spesifikasi Platform Edukasi
**Matakuliah: Pengembangan Aplikasi Serverless API (3 SKS)**

Dokumen ini merupakan gabungan dari Rencana Pembelajaran Semester (RPS) formal dan spesifikasi teknis platform pembelajaran (Konsep Aplikasi) yang saling melengkapi untuk menciptakan pengalaman belajar yang modern, interaktif, dan ter-gamifikasi.

---

## BAGIAN I: RENCANA PEMBELAJARAN SEMESTER (RPS)

### 1. Informasi Umum Matakuliah

| Komponen | Keterangan |
| :--- | :--- |
| **Nama Matakuliah** | Pengembangan Aplikasi Serverless API |
| **Beban SKS** | 3 SKS (150 menit tatap muka/praktikum + 180 menit tugas mandiri & terstruktur per minggu) |
| **Model Pembelajaran** | *Project-Based Learning* (PBL), *Explorable Explanations*, & *AI-Assisted Development* |
| **Teknologi Utama** | Next.js (App Router), Supabase (PostgreSQL, Auth, Realtime, RLS), Cloudinary, Vercel, Framer Motion, DND-Kit |
| **Prasyarat** | Pemrograman Web Dasar, Dasar-dasar React & JavaScript Modern |

### 2. Deskripsi & Visi Matakuliah

Matakuliah ini dirancang untuk membekali mahasiswa dengan keahlian komprehensif dalam membangun aplikasi web modern skala *production* menggunakan arsitektur **Serverless**. Perkuliahan ini mengombinasikan pembelajaran manual dengan penggunaan alat bantu kecerdasan buatan (*AI-Assisted Coding Tools* seperti GitHub Copilot, Cursor, atau ChatGPT) untuk mempercepat penulisan kode *boilerplate*, sehingga mahasiswa dapat memusatkan energi pada arsitektur perangkat lunak, keamanan *Row Level Security* (RLS), optimasi performa, serta antarmuka pengguna tingkat lanjut (*animations* & *drag-and-drop*).

### 3. Capaian Pembelajaran Lulusan (CPL) & CPMK

1. **CPMK 1 (Arsitektur & Konsep):** Mahasiswa mampu menganalisis konsep arsitektur Serverless (BaaS vs FaaS), membandingkannya dengan arsitektur tradisional, serta merancang arsitektur aplikasi berbasis Next.js dan Supabase.
2. **CPMK 2 (Backend & Database Security):** Mahasiswa mampu merancang skema database relasional PostgreSQL, mengimplementasikan autentikasi multi-provider, dan mengamankan akses data dengan *Row Level Security* (RLS) di Supabase.
3. **CPMK 3 (Frontend & Rich Interactivity):** Mahasiswa mampu membangun antarmuka web interaktif, dinamis, dan responsif menggunakan Next.js App Router, animasi transisi (*Framer Motion*), serta interaksi *Drag-and-Drop*.
4. **CPMK 4 (Manajemen Media & Real-time):** Mahasiswa mampu mengintegrasikan layanan Cloudinary untuk manipulasi dan optimasi aset media, serta memanfaatkan protokol WebSocket Supabase untuk fitur kolaboratif *real-time*.
5. **CPMK 5 (Deployment, Observability & AI Workflow):** Mahasiswa mampu menerapkan *pipeline* CI/CD otomatis ke Vercel, melakukan *debugging* berbasis log, serta memanfaatkan AI secara etis dan efisien dalam siklus *software development*.

### 4. Peta Rencana Pembelajaran Mingguan (16 Minggu)

#### FASE 1: Akselerasi Fondasi, Database & MVP (Pra-UTS)

| Mg | Sub-CPMK / Kemampuan Akhir | Materi / Bahan Kajian | Metode & Pengalaman Belajar (AI & Hands-on) | Kriteria / Indikator Penilaian | Bobot |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Mampu memahami ekosistem serverless dan menyiapkan lingkungan kerja terintegrasi AI. | **Pengantar Serverless & AI-Assisted Workflow**<br>- BaaS vs FaaS & Arsitektur Modern<br>- Next.js, Supabase, Cloudinary, Vercel Overview<br>- **Git & GitHub Dasar:** Inisialisasi Repo, Public vs Private, `.gitignore` & Proteksi Kunci `.env.local`<br>- Setup Node.js & AI Coding Tools (Prompting Dasar) | Ceramah interaktif, live demo setup repository, latihan prompt AI untuk scaffolding komponen. | Kesiapan repo GitHub dan pemahaman arsitektur serverless. | 2% |
| **2** | Mampu membangun antarmuka berbasis App Router dan komponen modern. | **Next.js App Router & UI Libraries**<br>- Server vs Client Components<br>- Nested Layouts & Routing<br>- Integrasi Tailwind CSS & Shadcn UI via AI Prompt | Praktik pembuatan layout aplikasi, generate komponen UI siap pakai dengan bantuan AI. | Kerapian struktur layout dan pemisahan Server/Client component. | 2% |
| **3** | Mampu mengelola mutasi data dan validasi skema form secara aman. | **Server Actions & Skema Validasi Data**<br>- Server Actions di Next.js<br>- Schema Validation dengan **Zod**<br>- Menampilkan pesan error validasi di UI | Hands-on pembuatan form, auto-generate schema Zod dari spesifikasi data menggunakan AI. | Keberhasilan validasi input server-side & feedback error di UI. | 3% |
| **4** | Mampu merancang skema relasional PostgreSQL pada Supabase. | **Database Relasional dengan Supabase**<br>- Konsep Relasi (1:N, N:M) di Postgres<br>- Supabase Table Editor & SQL Editor<br>- AI Prompting untuk ERD & Dummy Data | Praktikum merancang skema database project, generate SQL DDL dan dummy data via AI. | Kebenaran relasi foreign key dan integritas data pada Supabase. | 3% |
| **5** | Mampu mengimplementasikan sistem autentikasi dan proteksi rute. | **Autentikasi & Otorisasi Pengguna**<br>- Supabase Auth (Email/Password & **GitHub OAuth App**)<br>- Middleware Next.js untuk Route Protection<br>- Session Management di Server Components | Live coding autentikasi, integrasi login via GitHub, mengamankan dashboard dari akses unauthenticated. | Keberhasilan alur login/register dan proteksi private routes. | 3% |
| **6** | Mampu mengintegrasikan operasi CRUD dan mengelola state via URL. | **Integrasi CRUD & URL as State**<br>- Supabase Client Query (Filter, Sort, Pagination)<br>- *URL Search Params* sebagai state manager<br>- Optimasi data fetching | Praktik integrasi data dinamis, implementasi filter dan pagination tanpa library state berat. | Fungsi CRUD berjalan penuh dan URL state berfungsi sinkron. | 3% |
| **7** | Mampu menerapkan animasi dan micro-interactions pada antarmuka. | **Advanced UI/UX 1: Framer Motion**<br>- Dasar animasi di React & Next.js<br>- Page transitions & layout animations<br>- Staggered animation & micro-interactions | Eksperimen menambahkan efek animasi halus pada kartu data, modal, dan navigasi. | UI terasa dinamis, responsif, dan estetika visual premium. | 4% |
| **8** | **UTS (Ujian Tengah Semester) - Presentasi Milestone 1 (Progress MVP)** | **Evaluasi Progress Proyek:**<br>- Demonstrasi Prototype / MVP<br>- Kelengkapan: Auth, Database CRUD, Desain UI beranimasi<br>- **Audit Repository GitHub:** Kebersihan commit history & struktur project | Presentasi kelompok/individu, demo aplikasi live, review repo GitHub dan tanya jawab arsitektur sistem. | Rubrik Penilaian UTS (Kesiapan MVP, Desain DB, Kualitas UI, Commit Hygiene). | **35%** |

#### FASE 2: Fitur Lanjutan, Media, Real-time & Deployment (Pasca-UTS)

| Mg | Sub-CPMK / Kemampuan Akhir | Materi / Bahan Kajian | Metode & Pengalaman Belajar (AI & Hands-on) | Kriteria / Indikator Penilaian | Bobot |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **9** | Mampu membangun interaksi Drag-and-Drop yang tersinkronisasi ke DB. | **Advanced UI/UX 2: Drag & Drop (DND)**<br>- Library DND (misal: `@dnd-kit`)<br>- Reorderable lists & Kanban boards<br>- Optimistic UI Update & sinkronisasi database | Pembuatan modul kanban/sorting, menguji feedback drag-and-drop yang mulus ke database. | Kelancaran interaksi DND dan akurasi urutan data di Supabase. | 4% |
| **10** | Mampu mengelola dan mengoptimasi aset media secara dinamis. | **Manajemen Media dengan Cloudinary**<br>- Integrasi Cloudinary SDK di Next.js<br>- Direct/Server Uploads<br>- Dynamic Image Transformations (Crop, Compress, Format) | Praktikum upload aset gambar/avatar/thumbnail, rendering gambar via Next.js `<Image>`. | Keberhasilan upload, transformasi otomatis, dan performa loading gambar. | 4% |
| **11** | Mampu mengimplementasikan komunikasi real-time dan notifikasi. | **Fitur Real-time dengan Supabase**<br>- Arsitektur WebSocket Serverless<br>- Supabase Realtime Subscriptions (Broadcast, Presence, Postgres Changes) | Studi kasus: live comments, notifikasi instan, atau status indikator online. | Data ter-update otomatis pada multi-klien tanpa reload halaman. | 4% |
| **12** | Mampu mengamankan data multi-tenant dengan Row Level Security. | **Keamanan Database: Row Level Security (RLS)**<br>- Konsep RLS di PostgreSQL<br>- Menulis RLS Policies (SELECT, INSERT, UPDATE, DELETE)<br>- Role-Based Access Control (RBAC) | Praktik audit keamanan database, menulis policies agar user hanya dapat mengakses datanya sendiri. | Keamanan data teruji (mencegah data breach antar-user). | 4% |
| **13** | Mampu men-deploy aplikasi ke cloud dan mengonfigurasi CI/CD. | **Deployment & Performance Optimization (Vercel)**<br>- Menghubungkan Repository GitHub ke Vercel CI/CD<br>- **Branching Strategy:** `main` (Production) vs `feature-*` (Vercel Preview Deployments)<br>- Pull Request Workflow & Preview URL Review<br>- Manajemen Environment Variables & Caching Next.js | Deploy proyek ke Vercel production, membuat branch baru untuk preview branch deployment. | Aplikasi live dengan HTTPS, custom domain, dan preview deployment branch aktif. | 4% |
| **14** | Mampu memantau log aplikasi dan memanfaatkan AI untuk debugging tingkat lanjut. | **Observability & AI-Powered Debugging**<br>- Penanganan error global (Error Boundaries)<br>- Membaca runtime logs di Vercel Dashboard<br>- *Reverse Prompting*: Analisis stack trace menggunakan AI | Simulasi pemecahan bug kritis produksi, analisis performa dengan Vercel Analytics/Lighthouse. | Kemampuan mendiagnosis error dan memperbaiki bug sistematis. | 3% |
| **15** | Mampu melakukan refactoring kode, audit performa, dan finalisasi proyek. | **Finalisasi Proyek & Code Review**<br>- Code clean-up & refactoring<br>- Merge final Pull Request ke `main`<br>- SEO Metadata & OpenGraph Optimization<br>- Persiapan pitching & materi demo | Peer review antar mahasiswa via GitHub PR, uji coba performa menyeluruh, final deployment. | Kualitas kode (*clean code*), skor Lighthouse, dan kesiapan presentasi. | 2% |
| **16** | **UAS (Ujian Akhir Semester) - Presentasi Final Project (Live Demo)** | **Evaluasi Akhir Proyek Serverless:**<br>- Live demo aplikasi skala produksi di Vercel<br>- Presentasi fitur kompleks (DND, Realtime, Media, RLS)<br>- Publikasi Repository GitHub & dokumentasi README | Presentasi terbuka, live testing fungsionalitas dan keamanan sistem oleh penguji. | Rubrik Penilaian UAS (Kompleksitas, Keamanan, UX, Performa, Deploy). | **45%** |

### 5. Prinsip Pengembangan & Mitigasi Risiko Ekosistem (Kesepakatan)

Mengingat cepatnya perubahan ekosistem modern (*bleeding-edge tech*), matakuliah ini menerapkan 3 prinsip utama pengembangan modul agar mahasiswa terhindar dari *error deprecation*:

1. **Wajib Menggunakan Standar/Paket Terbaru:**
   - **Next.js:** Wajib menggunakan **App Router (v14/v15)** & Server Actions (Meninggalkan *Pages Router* dan *API Routes*).
   - **Supabase:** Wajib menggunakan paket **`@supabase/ssr`** untuk manajemen sesi yang aman di Server Components (Meninggalkan `@supabase/auth-helpers-nextjs` dan terminologi `anon_key` lama pada metode auth usang).
   - **Cloudinary:** Menggunakan library **`next-cloudinary`** untuk optimasi komponen Vercel-native.
2. **"Build & Test First, Write Module Later":**
   Setiap modul dan kode *boilerplate* wajib dibangun, diuji (*Proof of Concept*), dan divalidasi jalan 100% pada repository utama sebelum diubah menjadi panduan teks untuk mahasiswa.
3. **Penyertaan Referensi Resmi (Primary Sources):**
   Setiap materi/modul wajib menyertakan link dokumentasi resmi (Supabase Docs, Next.js Docs). Tujuannya agar mahasiswa terbiasa membaca dari sumber aslinya dan adaptif terhadap pembaruan *syntax*.

### 6. Aturan Main & Kriteria Proyek Akhir (Final Project)

Untuk memastikan beban kerja mahasiswa seragam dan tidak terjadi penumpukan tugas di akhir semester, matakuliah ini menggunakan **Metode Bola Salju (Snowballing Project)**:
- **Minggu 1-3:** Fase Sandbox (Eksplorasi tools dasar).
- **Minggu 4:** Inisiasi repositori resmi untuk Proyek Akhir.
- **Minggu 5-15:** Tugas mingguan **wajib** diterapkan langsung pada Proyek Akhir (incremental).

**Kriteria Wajib Kelulusan Proyek (Technical Constraints):**
Pengerjaan proyek dilakukan secara **Individu** (dengan bantuan AI). Tema aplikasi dibebaskan, namun WAJIB memenuhi 6 kriteria teknis berikut:
1. 🔐 **Autentikasi:** Memiliki fitur Login/Register dan rute privat (Supabase Auth).
2. 🗄️ **Relasi Database:** Memiliki minimal 3 tabel dengan minimal 1 relasi di PostgreSQL.
3. 🖼️ **Manajemen Media:** Memiliki fitur unggah gambar dinamis (terintegrasi Cloudinary).
4. ✨ **Interaksi Dinamis:** Menggunakan animasi (*Framer Motion*) dan memiliki fitur UI interaktif (misal: *Drag and Drop* atau *Real-time updates*).
5. 🛡️ **Keamanan Data:** Memiliki *Row Level Security (RLS)* di database agar data pengguna terisolasi dengan aman.
6. 🚀 **Production Ready:** Berhasil di-deploy ke Vercel tanpa error dan bersih dari bug fatal.

### 7. Skema & Rubrik Penilaian

```
  ┌─────────────────────────────────────────────────────────────┐
  │ KOMPOSISI EVALUASI NILAI AKHIR                              │
  ├─────────────────────────────────────────────────────────────┤
  │ 1. Tugas Praktikum Mingguan & Partisipasi            : 20%  │
  │ 2. UTS (Milestone 1 - Progress & MVP)                : 35%  │
  │ 3. UAS (Milestone 2 - Final Live Production Project) : 45%  │
  │    TOTAL                                             : 100% │
  └─────────────────────────────────────────────────────────────┘
```

#### Rubrik Penilaian Proyek (UTS & UAS)
* **Arsitektur & Database (25%):** Skema database normal, relasi tepat, implementasi RLS yang aman.
* **Fitur & Kompleksitas (30%):** Integrasi Next.js, Supabase, Cloudinary, Real-time, dan fitur interaktif (DND/Animasi).
* **UI/UX & Responsivitas (20%):** Desain modern, konsisten, responsif pada mobile/desktop, micro-interactions mulus.
* **Kualitas Kode & Deployment (15%):** Clean code, error handling memadai, konfigurasi Vercel CI/CD optimal.
* **Presentasi & Penguasaan Materi (10%):** Kemampuan mendemonstrasikan sistem dan menjawab pertanyaan teknis arsitektur.

---

## BAGIAN II: KONSEP & SPESIFIKASI PLATFORM PEMBELAJARAN
Platform pembelajaran disajikan bukan sebagai LMS kaku biasa, melainkan sebagai **Peta Perjalanan Eksplorasi (Quest Map)** yang diberi judul *"The Serverless Odyssey"*.

### 1. Pilar Pengalaman Belajar (Learning UX & Visual Explanations)

#### A. Interactive Visualizers & Animated Explanations (Komponen Penjelas Inti)
Konsep-konsep abstrak Serverless diubah menjadi simulasi visual interaktif yang dapat dicoba langsung oleh mahasiswa:
1. **Server vs Client Component Hydration Visualizer (Minggu 2):** Tombol "Simulasi Render" memperlihatkan streaming HTML murni vs pengiriman JavaScript bundle & proses *hydration* di browser.
2. **Server Actions Data-Flow Cycle (Minggu 3):** Animasi aliran paket data (*pulsing dots*) langkah demi langkah (Form Input -> RPC Call -> Supabase -> revalidatePath -> UI Auto-Update).
3. **RLS Policy Simulator (Minggu 7 & 12):** Sakelar Role Interaktif ([User A], [Admin]). Tabel data bereaksi seketika: baris yang lolos policy menyala HIJAU, baris yang dilarang memudar dan bergembok MERAH.
4. **Cloudinary Transformation Playground (Minggu 10):** Slider interaktif untuk visualisasi *crop*, optimasi *format*, beserta grafik perbandingan ukuran file secara real-time.
5. **Supabase Realtime WebSocket Pipeline (Minggu 11):** Mockup dua browser berdampingan untuk menyimulasikan aliran data PostgreSQL WAL melalui WebSocket tanpa *page reload*.
6. **Vercel Edge Caching & Latency Globe (Minggu 13):** Visualisasi interaktif alur Cache HIT (latensi rendah dari Edge terdekat) vs Cache MISS (latensi tinggi ke Origin).

#### B. Pendekatan Lainnya
* **Bite-Sized Lessons:** Penjelasan terfokus dengan *Code Blueprint* interaktif dan *Live Sandbox*.
* **AI Prompt Recipe Cards:** Kumpulan *prompt template* siap pakai yang melatih mahasiswa menjadi *AI-empowered developer* yang memahami arsitektur sistem.
* **Interactive Mission & Checklist:** Tugas mingguan berwujud daftar periksa interaktif dengan *acceptance criteria*.
* **Micro-Quiz & Knowledge Check:** Kuis cepat 3-5 soal interaktif (disertai efek *confetti*) di akhir materi.

### 2. Sistem Gamifikasi (Motivation UX & Ketepatan Waktu)
Sistem gamifikasi difokuskan untuk **mengapresiasi kecepatan, ketepatan waktu, dan konsistensi**, demi menekan *procrastination*.

* **Early Bird & On-Time XP Multipliers:** Mengumpulkan H-2 mendapat bonus 1.5x XP. Telat akan memotong perolehan XP.
* **Sistem Streak:** Mengakses materi dan mengumpulkan tugas per minggu secara berturut-turut memberikan *Weekly Fire Streak* dan bonus multiplier.
* **Level & Gelar Pengembang:** Kenaikan level (Novice -> BaaS Explorer -> Cloud Crafter -> Edge Architect -> Full-Stack Serverless Guru) berdasarkan akumulasi XP.
* **Lencana Prestasi (Badges):** Misalnya *Speed Demon* (kumpul cepat), *RLS Guardian* (security), *Cloud Master* (deploy sukses), dan *Prompt Engineer*.
* **Leaderboard & Showcase:** Papan peringkat XP kelas, galeri publik untuk memamerkan proyek, serta fitur apresiasi *Peer Kudos*.

### 3. Arsitektur Teknologi Platform Pembelajaran
Aplikasi ini sendiri dibangun menggunakan stack yang diajarkan (sebagai *dogfooding*):
* **Frontend:** Next.js (App Router), Tailwind CSS, Shadcn UI, Framer Motion (animasi & visualizer), Canvas Confetti, Lucide Icons.
* **Backend & Database:** Supabase (PostgreSQL Database, Auth, Realtime Subscriptions, RLS).
* **Media & Assets:** Cloudinary (penyimpanan badge, avatar, dan screenshot showcase).
* **Hosting & CI/CD:** Vercel (Edge network, Analytics).

---
*(Dokumen disetujui untuk digunakan sebagai landasan pengembangan bahan ajar dan platform pembelajaran matakuliah Serverless API)*
