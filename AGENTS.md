<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Aturan & Konvensi Resmi Pengembangan Platform "The Serverless Odyssey"

Dokumen ini berisi aturan baku, konvensi teknis, standar pedagogi AI, dan arsitektur UI/UX yang telah disepakati dan **WAJIB DIPATUHI** dalam pengembangan setiap modul maupun komponen aplikasi. Seluruh aturan ini menjamin kesinambungan pengembangan (*seamless continuation*) lintas sesi.

---

## 1. Aturan Arsitektur & Teknologi (Next.js 16 App Router)

- **Default Server Components (RSC)**:
  - Setiap file komponen `.tsx` di App Router secara default adalah React Server Component (0 kB JavaScript bundle ke browser).
  - Gunakan RSC untuk data fetching langsung dari database/SDK (misal: Supabase) dan pembacaan environment variables rahasia.
- **Batasan Ketat Client Component (`'use client'`)**:
  - Direktif `'use client'` HANYA boleh ditempatkan pada komponen interaktif daun terluar (*leaf components*) yang secara langsung membutuhkan `useState`, `useEffect`, event listener (`onClick`, `onChange`), atau browser API.
  - **DILARANG KERAS** menambahkan `'use client'` di level `page.tsx` atau `layout.tsx` utama.
- **Breaking Changes Next.js 16**:
  - **Async Params & SearchParams**: `params` dan `searchParams` adalah `Promise<{ ... }>`. Wajib menggunakan `const { id } = await params;` dan `const searchParams = await searchParams;` sebelum membaca propertinya di Server Components.
  - **Async Cookies**: Pembacaan cookies wajib menggunakan `const cookieStore = await cookies();`.
- **Pola Komposisi (Interleaving Pattern)**:
  - Dilarang mengimpor Server Component secara langsung di dalam Client Component.
  - Lewatkan Server Component sebagai prop `children` ke dalam Client Component pembungkus.
- **Ekosistem 4 Pilar**:
  1. Next.js 16 (App Router + Server Actions)
  2. Supabase (PostgreSQL Database, Auth, Realtime, RLS)
  3. Cloudinary (AI Media CDN & Image Processing)
  4. Vercel (Edge Network & CI/CD Deployment)

---

## 2. Aturan Navigasi Tab & Standar Scroll UX (Sticky Sub-Header & Docked Tab Positioning)

Setiap halaman modul perkuliahan (`/modules/[id]`) menerapkan standar navigasi dan posisi layar yang konsisten:

- **Sticky Sub-Header Navigation Bar**:
  - Baris tab navigasi 4 Pilar (`1. Konsep & Teori`, `2. Lab & Prompt AI`, `3. Misi Proyek`, `4. Uji Pemahaman`) wajib melayang (*docked*) tepat di bawah navbar utama (`sticky top-[57px] z-20`).
  - Menggunakan efek kaca buram `backdrop-blur-md` dan warna semantik (`bg-zinc-50/95 dark:bg-zinc-950/95 border-b border-zinc-200/80 dark:border-zinc-800/80`).
  - Menggunakan *negative margin* responsif (`-mx-6 md:-mx-10 lg:-mx-12 px-6 md:px-10 lg:px-12`) agar membentang memenuhi lebar konten tanpa memotong layout.
  - Skema warna 4 pilar: Konsep & Teori (Cyan / `BookOpen`), Lab & Prompt AI (Indigo / `Terminal`), Misi Proyek (Emerald / `Target`), Uji Pemahaman (Amber / `Award` / `Brain`).
- **Aturan Posisi Scroll saat Berpindah Tab (Docked Tab Bar at Top)**:
  - Karena banner hero modul (judul, subtitle, durasi, CPMK) bersifat statis dan identik untuk seluruh tab:
  - **DILARANG** membiarkan halaman berada di posisi scroll bawah lama (menyebabkan mahasiswa terjebak di ujung bawah dokumen tab baru).
  - **DILARANG** melakukan scroll ke `top: 0` penuh (memaksa mahasiswa melihat ulang header dan harus scroll manual ke bawah lagi).
  - **WAJIB**: Layar harus melakukan *smooth scroll* langsung ke posisi **Sticky Tab Bar menempel di bagian paling atas viewport (`top: 57px`)**. Banner pertemuan terlewati sehingga mahasiswa langsung dapat membaca isi tab baru dari baris pertama.
  - Rumus perhitungan matematis baku dari elemen hero static:
    ```typescript
    const hero = document.getElementById("module-hero-banner");
    if (hero) {
      const heroBottomInDoc = hero.getBoundingClientRect().bottom + window.scrollY;
      const targetY = heroBottomInDoc + 32 - 57; // 32px margin space-y-8, 57px header offset
      window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
    }
    ```
- **Sequential Bottom Flow Call-to-Action (CTA)**:
  - Setiap tab materi panjang wajib menyertakan kartu langkah selanjutnya di ujung paling bawah untuk memandu alur belajar mahasiswa secara sekuensial:
    - Di ujung **Tab 1 (Konsep & Teori)**: Kartu CTA dengan tombol `Lanjut ke Lab & Prompt AI ➔` (Tema Indigo + ikon `Sparkles`).
    - Di ujung **Tab 2 (Lab Praktikum & AI Prompt)**: Kartu CTA dengan tombol `Lanjut ke Misi Proyek ➔` (Tema Emerald + ikon `Target`).
    - Di ujung **Tab 3 (Misi Proyek)**: Checklist *Definition of Done* (DoD) interaktif dan Kartu CTA dengan tombol `Lanjut ke Uji Pemahaman ➔` (Tema Amber + ikon `Sparkles`).
    - Di **Tab 4 (Uji Pemahaman)**: Panel ujian esai interaktif anti-cheat dengan koreksi bertingkat (Groq, Gemini, DeepSeek) dan kartu sertifikasi kelulusan konsep pertemuan.

---

## 3. Aturan Metodologi Prompting AI (Framework C-R-E-T & Pola All-in-One)

Setiap template prompt AI yang disajikan kepada mahasiswa wajib mematuhi 4 unsur presisi **C-R-E-T** dengan pola otomatisasi modern:
1. **C — Context (Domain Aplikasi)**: Jelaskan konteks spesifik fitur dan aplikasi yang sedang dibangun secara mendalam (*"The Serverless Odyssey"*).
2. **R — Role (Persona Pakar)**: Wajib diawali kalimat persona pakar di baris teratas prompt (contoh: *"Bertindaklah sebagai Senior Frontend UI/UX Engineer & Next.js 16 Specialist."*).
3. **E — Explicit Constraints & Pre-condition Automation**:
   - **Pola All-in-One untuk AI Agent (Antigravity / Cursor)**: Prompt wajib menginstruksikan AI Agent untuk memeriksa ketersediaan dependensi atau pustaka prasyarat terlebih dahulu. Jika belum ada, AI Agent otomatis mengeksekusi perintah CLI instalasi di terminal sebelum merakit berkas kode (misal `npx create-next-app` di Modul 1, atau `npx shadcn@latest init` & `add` di Modul 2).
   - Sebutkan versi teknologi dan batasan teknis yang dilarang/diharuskan secara tegas (dilarang `'use client'` di `page.tsx`, Next.js 16 `await params`, semantic Tailwind tokens Shadcn, 0 tipe `any`).
4. **T — Target Output Structure**: Minta struktur file terpisah yang modular, fungsional, dan siap jalan (*ready-to-run*), menuntaskan 100% kriteria *Definition of Done* (DoD) mingguan tanpa potongan kode atau placeholder komentar singkatan.

- **Konektivitas Routing Halaman Utama (Root Navigation Rule)**:
  - Setiap template prompt yang membangun fitur antarmuka modul (seperti dashboard atau sub-rute baru) **WAJIB** memperbarui atau menyertakan berkas landing page utama (`src/app/page.tsx`).
  - Halaman root `/` tidak boleh dibiarkan menampilkan starter template Next.js default. Wajib menyediakan navigasi eksplisit / Hero CTA (misal: tombol *"Masuk ke Dashboard Tugas ➔"*) yang menghubungkan pengguna langsung ke rute fitur yang sedang dibangun (`/tasks`), atau redirect otomatis, sehingga mahasiswa tidak tersesat atau terpaksa mengetikkan URL manual di address bar peramban.
- **Standar Estetika UI Premium (Bukan Standar Polos / Bare-Bones)**:
  - Prompt AI dilarang hanya meminta komponen fungsional polos. Wajib secara eksplisit menginstruksikan standar desain antarmuka modern yang memukau (*rich aesthetics*):
    1. *Navbar Glassmorphism*: `backdrop-blur-md`, border semantik tipis, logo brand, dan ThemeToggle.
    2. *Kartu Metrik & Statistik*: Aksen gradien halus, ikon tematik berwarna (Indigo, Amber, Emerald), dan indikator persentase capaian.
    3. *Micro-interactions & Hover Effects*: Elevasi halus (`hover:-translate-y-1`, `hover:shadow-lg`, `transition-all`).
    4. *Hierarki Tipografi & Status Badges*: Variasi kontras semantik yang adaptif penuh pada Dark Mode dan Light Mode.

> **Banner Panduan Visual Alur Kerja AI Tool di UI**:
> Di atas setiap kotak prompt, wajib disediakan kartu petunjuk dual-mode:
> - 🤖 **AI Agent (Antigravity / Cursor)**: Menjelaskan otomasi All-in-One (deteksi dependensi, eksekusi CLI terminal, dan scaffolding berkas).
> - 💬 **AI Chat (OpenCode / ChatGPT)**: Menginstruksikan mahasiswa menjalankan langkah CLI di terminal terlebih dahulu secara manual, baru menyalin kode berkas yang dihasilkan.
> 
> **Penamaan Prompt**: Gunakan judul profesional generik: **"Formula Prompt AI Teruji"** (hindari penamaan vendor di judul). Seluruh teks prompt harus *copy-ready*.

---

## 4. Aturan Tampilan & Efek Zoom Kode (VS Code Aesthetics)

Setiap contoh kode, struktur berkas, dan formula prompt harus disajikan menggunakan komponen bergaya editor **VS Code** (`VsCodeSnippet` dan `VsCodePrompt`):
- **Elemen Wajib VS Code**:
  - Tombol kontrol jendela (🔴 🟡 🟢).
  - Tab berkas aktif dengan ikon bahasa/alat (`FileCode` untuk TS/TSX, `Terminal` untuk Bash/CLI, `Sparkles` untuk Prompt).
  - Nomor baris (*gutter*) di sisi kiri yang rapi dan `select-none`.
  - Pewarnaan sintaks (*syntax highlighting*) akurat tema VS Code Dark+ (`#1e1e1e` latar belakang, ungu untuk kontrol, biru untuk deklarasi, oranye untuk string, teal untuk tipe/JSX, hijau zaitun untuk komentar).
  - Status bar bawah biru khas VS Code (`#007acc`) atau indigo dengan info baris, `UTF-8`, dan bahasa aktif.
  - Tombol *Copy to Clipboard* di pojok kanan atas.
- **Aturan Efek Hover Zoom**:
  - **Tab Konsep / Teori Pendalaman**: **WAJIB MENGGUNAKAN ZOOM 1.2x** (`enableZoom={true}`, `hover:scale-[1.2]`, `hover:z-50`, bayangan elevasi tebal) untuk menarik fokus pada cuplikan kode ringkas.
  - **Tab Lab Praktikum & Prompt AI**: **DILARANG MENGGUNAKAN ZOOM** (`enableZoom={false}`), karena isinya panjang dan lebar; efek zoom akan menyebabkan konten terpotong (*clipped*) di tepi kanan layar.
- **Format Typography & Penomoran Poin Konsep**:
  - Poin-poin konsep disajikan dalam bentuk penomoran vertikal terstruktur, kontras visual jelas pada kata-kata kunci / kode (inline `<code>` kontras), mudah dipindai secara visual (*scannable*).

---

## 5. Aturan Tab Misi Proyek & Metode Bola Salju (*Snowballing Project*)

- **Metode Proyek Akhir**:
  - Seluruh perkuliahan berpusat pada **1 Proyek Aplikasi Web Full-Stack Utuh** yang dibangun bertahap dari Minggu 1 hingga Minggu 16.
  - Mahasiswa **dilarang** membuat repositori baru setiap minggu; setiap misi mingguan wajib dikerjakan langsung pada repositori proyek akhir masing-masing.
- **Siklus 4 Langkah Git**:
  Setiap pengerjaan misi wajib mengikuti alur:
  1. *Langkah 1: Buat & Masuk ke Branch Fitur* (`git checkout -b <nama-branch>`)
  2. *Langkah 2: Kerjakan & Simpan* (`git add . && git commit -m "feat: ..."`)
  3. *Langkah 3: Gabungkan ke Main* (Disediakan 2 opsi: Terminal Merge atau GitHub Pull Request)
  4. *Langkah 4: Bersihkan Branch Fitur* (`git branch -d <nama-branch>`)
- **Definition of Done (DoD)**:
  - Wajib dilengkapi indikator progres interaktif (*Progress Bar*) yang menghitung persentase kriteria terselesaikan (`X dari Y Kriteria (Z%)`).
  - Menampilkan banner selebrasi saat semua kriteria tercentang (100%).

---

## 6. Aturan Visualisasi Interaktif & Animasi Konsep (Interactive Simulation Standards)

Setiap materi modul perkuliahan wajib menyertakan media visual interaktif dan animasi untuk menjembatani pemahaman mahasiswa terhadap konsep-konsep komputasi abstrak:

- **Cakupan Wajib 100% Konsep**:
  - Setiap konsep inti dan subpoin teori pada setiap modul perkuliahan **WAJIB** memiliki visualisasi/simulasi interaktif mandiri (1:1 mapping).
  - Dilarang menyajikan materi teknis mendalam secara teks murni tanpa simulator pendukung.
- **Pola Interaksi Baku: Smooth Accordion Unfold (Opsi 2)**:
  - Dilarang menempatkan simulator statis di bagian paling atas halaman yang memisahkan mahasiswa dari konteks bacaannya.
  - Simulator diletakkan tepat di bawah cuplikan kode (`VsCodeSnippet`) atau penjelasan dari masing-masing subpoin materi.
  - **Elemen Wajib Tombol Picu (Trigger Button)**:
    - Ikon tema (*Sparkles*, *Zap*, *Folder*, dll.) dengan styling badge rounded.
    - Judul simulasi spesifik dan badge status **"Interactive Lab"**.
    - Subjudul penjelasan singkat manfaat simulasi saat tertutup.
    - Indikator aksi (*"Jalankan Simulasi"* saat tertutup / *"Tutup Simulasi"* saat terbuka).
    - Panah dropdown `ChevronDown` dengan transisi rotasi 180 derajat saat status aktif.
  - **Animasi Buka-Tutup (Framer Motion)**:
    - Wajib menggunakan `AnimatePresence` dan `motion.div` (`initial={{ opacity: 0, height: 0 }}`, `animate={{ opacity: 1, height: "auto" }}`) agar transisi ke bawah (*downward accordion*) berlangsung mulus tanpa *layout shift* atau memotong tepi layar.
  - **Independensi State**:
    - Kontrol buka-tutup wajib independen per simulator menggunakan dictionary `expandedVisualizers[key]` sehingga mahasiswa dapat membuka dan membandingkan beberapa simulator sekaligus.
- **Standar Arsitektur Komponen Visualizer (`src/components/visualizers/`)**:
  - Setiap simulator dipisahkan menjadi berkas komponen mandiri di `src/components/visualizers/<nama-konsep>-animator.tsx`.
  - Direktif `'use client'` wajib disematkan pada komponen visualizer sebagai *leaf component*.
  - Wajib mendukung Dark Mode dan Light Mode secara konsisten menggunakan token semantik Tailwind/Shadcn (`bg-card`, `border-border`, `text-card-foreground`, `text-muted-foreground`).
  - Dilengkapi kontrol interaktif langsung: stepper alur eksekusi bertahap (*Step 1 ➔ Step 2 ➔ Step 3*), toggle switcher perbandingan arsitektur (*Best Practice vs Anti-Pattern*), simulasi latency peramban, dan inspektur state/DOM/ARIA/token HSL.
- **Pola Integrasi Terpusat (`MODULE_X_VISUALIZERS`)**:
  - Komponen visualizer dihubungkan ke halaman modul melalui objek konfigurasi terpusat `MODULE_X_VISUALIZERS` berdasarkan kombinasi indeks bagian dan subpoin (`${sIdx}-${subIdx}`).
  - Menjaga kode halaman modul tetap bersih (*clean code*), *DRY* (Don't Repeat Yourself), dan seragam.

---

## 7. Aturan Tab 4: Uji Pemahaman (Mastery Learning, Anti-Cheat & Multi-Provider AI)

Tab ke-4 perkuliahan (`/modules/[id]?tab=quiz`) adalah platform evaluasi kognitif interaktif yang menjamin mahasiswa benar-benar memahami arsitektur dan konsep materi sebelum melangkah lebih jauh:

- **Model Pembelajaran Tuntas (Mastery Learning Threshold $\ge 80$)**:
  - Setiap pertemuan menyajikan **5 hingga 7 soal esai mendalam** (disesuaikan dengan bobot materi perkuliahan).
  - Soal dikerjakan secara sekuensial (satu per satu); mahasiswa **HANYA BISA** melangkah ke soal berikutnya jika soal saat ini memperoleh **nilai minimal 80**.
  - **Socratic AI Guidance**: Jika nilai $< 80$, AI penilai dilarang membocorkan kunci jawaban secara eksplisit. AI wajib memberikan arahan pemikiran (*Socratic hints*), analogi, atau menunjuk kembali bagian konsep yang belum lengkap agar mahasiswa merevisi jawabannya.
- **Sistem Timer Berkeadilan & Bank Waktu Akumulatif (*Fischer Accumulative Time Bank*)**:
  - **Alokasi Waktu Dasar (*Base Time*)**: Bobot $\le 15$ (4 menit), Bobot $16-20$ (5 menit), Bobot $\ge 21$ (7 menit).
  - **Kompensasi Latensi AI (*AI Latency Freeze*)**: Timer otomatis dijeda/dibekukan seketika saat tombol kirim ditekan (`isEvaluating = true`) sehingga detik waktu mahasiswa tidak terpotong oleh proses inferensi AI atau kepadatan jaringan.
  - **Akumulasi Waktu (*Time Rollover*)**: Sisa detik pada soal yang berhasil lulus ($\ge 80$) otomatis ditabung dan ditambahkan ke alokasi waktu dasar soal berikutnya, memberi insentif positif bagi mahasiswa yang cepat dan tangkas.
  - **Hard Reset saat Waktu Habis (*Timeout Hard Reset*)**: Jika hitung mundur menyentuh `00:00` sebelum seluruh pertanyaan tuntas, sesi kuis otomatis di-reset instan kembali ke Soal 1, tabungan waktu di-nolkan, dan insiden tercatat ke database dosen (`reset_count`). Mahasiswa dituntut mencapai kelancaran kognitif (*cognitive fluency*) yang tuntas.
- **Protokol Integritas & Keamanan Ujian (Anti-Cheat Engine)**:
  - **Anti-Paste & Anti-Copy**: Fitur salin-tempel (`onPaste`, `onCopy`, `onDrop`) dinonaktifkan pada kotak esai; mahasiswa wajib mengetikkan pemikirannya secara mandiri.
  - **Reset Instan Sekali Pelanggaran**:
    - Jika peramban kehilangan fokus, berpindah tab, meminimalkan jendela, atau membuka aplikasi lain (`window.onblur`, `document.visibilitychange`), **sesi kuis langsung di-reset secara instan kembali ke Soal 1**.
    - Setiap kejadian pelanggaran dicatat ke dalam database (`reset_count`) sebagai rekaman integritas akademik mahasiswa yang dapat dipantau oleh dosen.
- **Arsitektur Multi-Provider AI Fallback Engine (Triad AI Korektor + OpenRouter)**:
  - Untuk mencegah kegagalan *rate-limit* (`429 Too Many Requests`) saat 30–50 mahasiswa mengerjakan ujian serentak di kelas:
    1. **Groq (Qwen 3.8 27B / GPT-OSS 120B)**: Korektor utama (*Primary Evaluator*) dengan latensi inferensi ultra-cepat (~1.5s).
    2. **OpenRouter (DeepSeek Chat V3 / Gemini 2.5 Flash / Llama 3.3 70B)**: *Fallback multi-model tingkat lanjut* dengan penalaran analitis Socratic mendalam.
    3. **Direct Google Gemini & DeepSeek**: *Fallback langsung* jika kunci API primer aktif.
    4. **Heuristic Offline Evaluator**: Pengaman lokal pencocokan kata kunci dan kedalaman analitis saat jaringan luar terputus total.
  - Menggunakan 1 fungsi universal Next.js Server Action berbasis format OpenAI-compatible endpoint dengan prioritas DNS IPv4 (`dns.setDefaultResultOrder("ipv4first")`).
- **Sistem Autentikasi Dosen & Mahasiswa**:
  - **Dosen (NIDN)**:
    - Username: **NIDN Dosen** (Akun default pengampu: `0012345678`).
    - Default Password Awal: **NIDN Dosen** (dapat diubah mandiri melalui modal sandi).
    - Akses Eksklusif: Portal Monitoring Dosen (`/monitoring`) diproteksi penuh.
    - Otoritas & Alat: Reset kata sandi mahasiswa satu-klik ke default NIM, dan Import Massal Roster Mahasiswa (`bulkImportStudentsAction`) melalui copy-paste format `NIM, Nama Mahasiswa, Kelas` langsung dari Excel/CSV.
  - **Mahasiswa (NIM)**:
    - Username: **NIM Mahasiswa**.
    - Default Password Awal: **NIM Mahasiswa**.
    - Fitur Ubah Password Mandiri: Mahasiswa dapat mengganti password melalui menu profil.
    - Kendali Dosen: Dosen berwenang me-reset password mahasiswa kembali ke default NIM jika lupa kata sandi.
- **Database Tracking & Dashboard Monitoring Dosen**:
  - Terhubung langsung ke database PostgreSQL Supabase Cloud aktif (`supabase/setup_supabase.sql`):
    - Tabel `lecturers`: Data dosen pengampu (NIDN, Nama, Email, Password Hash, Role).
    - Tabel `students`: Roster mahasiswa aktif (NIM, Nama, Kelas, Password Hash).
    - Tabel `quiz_submissions`: Progres kuis per modul (status `in_progress`/`completed`, `current_question_index`, `reset_count`, skor total, waktu mulai & selesai).
    - Tabel `quiz_answers`: Rekaman detail esai per soal (teks jawaban, skor AI, feedback Socratic, provider AI yang menilai, jumlah revisi `attempt_count`, dan status `is_passed`).
  - Halaman Monitoring Dosen (`/monitoring`): Menampilkan 4 kartu statistik ringkasan, filter kelas dan modul, pencarian instan nama/NIM, inspeksi teks jawaban esai mahasiswa, dan modal import mahasiswa baru.

---

## 8. Status Modul & Peta Jalan Pengembangan (Current Status & Roadmap)

- **Modul 1 (Selesai 100%)**: Ekosistem Serverless & AI-Assisted Workflow.
  - 6 Simulator Interaktif (FaaS, BaaS, 4 Pillars, Git 3-Trees, Git Identity, Git Branch Lifecycle, Gitignore, Git Secrets Leak, C-R-E-T Context/Role, C-R-E-T Constraints, C-R-E-T Output Review).
  - Prompt All-in-One 3 Berkas (`.gitignore`, `.env.example`, `README.md`) + Panduan Dual-Mode.
  - 5 Soal Esai Uji Pemahaman konsep arsitektur.
- **Modul 2 (Selesai 100%)**: Next.js 16 App Router, RSC & Shadcn UI.
  - 14 Simulator Interaktif lengkap (RSC vs Client, Hydration, Interleaving, Special Files Hierarchy, Dynamic Routing `[id]`, Catch-All `[...slug]`, Route Groups `(auth)`, Navigation Strategies `<Link>` vs `useRouter` vs `redirect` + Parameter Query Builder, Radix Primitives, Semantic Tokens, CVA Merge, Shadcn Architecture, Container Widget, Responsive Tokens).
  - Prompt All-in-One 5 Berkas (`src/app/page.tsx` Hero Landing di Root `/`, `layout.tsx`, `tasks/page.tsx`, `task-status-filter.tsx`, `[id]/page.tsx`) + Panduan Dual-Mode & Standar Estetika UI Premium.
  - 6 Soal Esai Uji Pemahaman konsep arsitektur.
- **Modul 3 (Selesai 100%)**: Server Actions, React 19 Form Hooks (`useActionState`, `useFormStatus`, `useOptimistic`) & Validasi Data (Zod).
  - 11 Simulator Interaktif lengkap: Server Actions RPC (`ServerActionsRpcAnimator`), Penempatan Berkas vs Inline (`ActionPlacementAnimator`), Revalidasi Cache on-demand (`RevalidationCacheAnimator`), Zod safeParse pertahanan input (`ZodSafeParseAnimator`), Type Coercion & Refine (`ZodCoercionAnimator`), Format ZodError fieldErrors (`ZodErrorFormatterAnimator`), Siklus useActionState React 19 (`UseActionStateAnimator`), useFormStatus tombol mandiri (`UseFormStatusAnimator`), UI Optimistik 0ms useOptimistic (`UseOptimisticAnimator`), Standarisasi Kontrak ActionState<T> (`ActionStateContractAnimator`), serta Integrasi Feedback Form Shadcn (`ShadcnFormFeedbackAnimator`).
  - Interactive Terms: Badges interaktif `server-actions`, `zod`, `use-action-state`, dan `shadcn` di ringkasan konsep.
  - Prompt All-in-One 5 Berkas (`src/lib/schemas.ts`, `src/actions/tasks.ts`, `src/components/tasks/create-task-form.tsx`, `src/app/(dashboard)/tasks/page.tsx`, `src/app/page.tsx`) + Panduan Dual-Mode (AI Agent vs AI Chat), Root Navigation Rule, dan Standar Estetika UI Premium.
  - Misi Snowballing: Branch `feature/server-actions-zod` dengan 5 kriteria DoD dan progress bar interaktif.
  - 6 Soal Esai Uji Pemahaman konsep arsitektur.
- **Modul 4 (Selesai 100%)**: Database Relasional PostgreSQL & Supabase Integration.
  - 11 Simulator Interaktif lengkap: Identitas UUID v4 vs Serial (`UuidVsSerialAnimator`), Relasi 1:N Cascade (`OneToManyRelAnimator`), Relasi M:N Junction (`ManyToManyRelAnimator`), SQL Constraints CHECK (`SqlConstraintsAnimator`), Indeksasi B-Tree O(log N) (`BtreeIndexAnimator`), Otomasi Triggers updated_at (`PostgresTriggersAnimator`), Arsitektur @supabase/ssr (`SupabaseSsrArchAnimator`), Async Cookies Next.js 16 (`AsyncCookiesAnimator`), Client vs Server Instance (`ClientVsServerSupabaseAnimator`), Blueprint 3 Tingkat (`ThreeTierSchemaAnimator`), serta Otomasi Supabase Typegen (`SupabaseTypegenAnimator`).
  - Interactive Terms: Badges interaktif `postgresql`, `baas`, `uuid`, dan `rls` di ringkasan konsep.
  - Subpoin Konsep: Format penomoran vertikal terstruktur (`1. ...\n\n2. ...\n\n3. ...`) dengan kontras visual kata kunci inline `<code>`.
  - Lab Praktikum: 5 Langkah terpadu dari CLI setup, utilitas server/client Next.js 16, eksekusi DDL 3 tabel, hingga generasi tipe TypeScript.
  - Prompt All-in-One 5 Berkas (`src/utils/supabase/server.ts`, `client.ts`, `supabase/migrations/01_initial_schema.sql`, `src/types/database.types.ts`, `src/app/page.tsx` Root Navigation) + Panduan Dual-Mode & Standar Estetika UI Premium.
  - Misi Snowballing: Branch `feature/supabase-database-schema` dengan 5 kriteria DoD terukur dan progress bar interaktif.
  - 7 Soal Esai Uji Pemahaman konsep arsitektur.
- **Modul 5 (Selesai 100%)**: Autentikasi & Otorisasi Pengguna (GitHub OAuth & Email Supabase Auth, Next.js 16 Middleware Session Protector, dan User Profiles).
  - 11 Simulator Interaktif lengkap: Stateless JWT & Rotasi Kriptografis (`JwtLifecycleAnimator`), GitHub OAuth 2.0 6 Langkah (`OauthFlowAnimator`), Passwordless Magic Link & OTP (`MagicLinkAnimator`), Intersepsi Edge Middleware & Matcher Regex (`MiddlewareInterceptionAnimator`), Keamanan Sesi getUser() vs getSession() Anti-Pattern (`SessionRefresherAnimator`), Matriks Hak Akses Rute Public/Private/Auth (`RouteProtectionMatrixAnimator`), Pembacaan Sesi RSC Zero Client Bundle (`ServerSessionReaderAnimator`), Mutasi Auth Server Actions Login/Signup/Logout (`AuthActionsFlowAnimator`), Route Handler OAuth Callback `/auth/callback` (`AuthCallbackRouteAnimator`), Pemisahan Skema Database `auth.users` vs `public.profiles` (`AuthUsersVsProfilesAnimator`), serta Otomasi Trigger PostgreSQL `on_auth_user_created` (`AutoProfileTriggerAnimator`).
  - Interactive Terms: Badges interaktif `supabase-auth`, `oauth`, `jwt`, `middleware`, dan `rls` di ringkasan konsep.
  - Subpoin Konsep: Format penomoran vertikal terstruktur (`1. ...\n\n2. ...\n\n3. ...`) dengan kontras visual kata kunci inline `<code>`.
  - Lab Praktikum: 5 Langkah terpadu dari setup GitHub OAuth App, Helper Middleware `updateSession()`, Callback Route Handler, Auth Server Actions, hingga SQL Trigger `handle_new_user()`.
  - Prompt All-in-One 6 Berkas (`src/utils/supabase/middleware.ts`, `src/middleware.ts`, `src/app/auth/callback/route.ts`, `src/actions/auth.ts`, `src/app/(auth)/login/page.tsx` + `login-form.tsx`, `src/app/page.tsx` Root Navigation Hero) + Panduan Dual-Mode & Standar Estetika UI Premium.
  - Misi Snowballing: Branch `feature/auth-and-middleware` dengan 5 kriteria DoD terukur dan progress bar interaktif.
  - 6 Soal Esai Uji Pemahaman konsep arsitektur.
- **Implementasi Tab 4 & Sistem Autentikasi (Selesai 100%)**:
  - Tab 4 "Uji Pemahaman" (Mastery Learning $\ge 80$, Anti-Cheat Reset Instan, Triad Multi-Provider AI Groq/Gemini/DeepSeek/Heuristic).
  - Autentikasi Mahasiswa berbasis NIM & Dosen berbasis NIDN dengan cookie HTTP-only Next.js 16.
  - Database PostgreSQL Supabase aktif terhubung via `.env.local` (`setup_supabase.sql`).
  - Dashboard Monitoring Dosen (`/monitoring`) dengan kontrol import roster mahasiswa massal dan reset password mahasiswa.
- **Target Prioritas Pengerjaan Berikutnya**:
  - **Modul 6**: Integrasi CRUD & URL as State (Filter, Sort, Pagination, searchParams Next.js 16).
  - **Modul 7-16**: Melanjutkan secara terstruktur sesuai RPS di `rancangan/DOKUMEN_PERANCANGAN_KULIAH.md`.

---

## 9. Aturan Lingkungan & Development Server

- Jangan pernah menjalankan `next build` bersamaan ketika dev server (`next dev`) sedang berjalan, karena dapat merusak cache internal Turbopack.
- Jika browser menampilkan cache usang (*stale*), bersihkan direktori `.next/` lalu jalankan ulang dev server dan lakukan *hard refresh* (`Ctrl + Shift + R`).
- Dilarang membuat file sementara di luar direktori workspace.



