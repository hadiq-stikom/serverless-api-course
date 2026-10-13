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
  - **Depresiasi `middleware.ts` ➔ Konvensi Resmi `src/proxy.ts`**:
    - Konvensi berkas `middleware.ts` resmi **didepresiasi** di Next.js 16 (menghasilkan deprecation warning pada terminal).
    - Berkas network boundary wajib dinamai `src/proxy.ts` dengan ekspor fungsi `export async function proxy(request: NextRequest)`.
    - Default runtime beralih ke `nodejs` runtime (bukan Edge-only), memungkinkan eksekusi modul Node.js standar.
    - Helper autentikasi Supabase (`updateSession`) didelegasikan langsung dari dalam `src/proxy.ts`.
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
    - Di ujung **Tab 1 (Konsep & Teori)**: Kartu CTA dengan tombol `Lanjut ke Lab Praktek & Prompt AI ➔` (Tema Indigo + ikon `Sparkles`).
    - Di ujung **Tab 2 (Lab Praktek & AI Prompt)**: Kartu CTA dengan tombol `Lanjut ke Misi Proyek ➔` (Tema Emerald + ikon `Target`).
    - Di ujung **Tab 3 (Misi Proyek)**: Checklist *Definition of Done* (DoD) interaktif dan Kartu CTA dengan tombol `Lanjut ke Uji Pemahaman ➔` (Tema Amber + ikon `Sparkles`).
    - Di **Tab 4 (Uji Pemahaman)**: Panel ujian esai interaktif anti-cheat dengan koreksi bertingkat (Groq, Gemini, DeepSeek) dan kartu sertifikasi kelulusan konsep pertemuan.

---

## 2.1. Standar Desain & Interaksi Banner Target Capaian Pembelajaran (CPMK)

Setiap banner hero modul perkuliahan (`/modules/[id]`) wajib menyajikan Target Capaian Pembelajaran (CPMK) dengan standar keterbacaan tinggi dan interaktivitas modern:

- **Struktur Poin-Poin Terukur (Anti-Wall-of-Text)**:
  - **DILARANG KERAS** menyajikan CPMK sebagai satu blok paragraf panjang teks polos yang melelahkan mata mahasiswa.
  - **WAJIB** dipecah menjadi 3 hingga 4 Sub-CPMK terukur menggunakan properti modular `cpmkPoints: CpmkPoint[]` yang memuat:
    - `code`: Penomoran Sub-CPMK terstruktur (contoh: `CPMK 5.1`, `CPMK 6.1`).
    - `badge`: Kategori taksonomi kompetensi (contoh: `BFF vs Universal REST`, `Analisis & Taksonomi`, `Keamanan Edge`).
    - `title`: Judul capaian berbasis Kata Kerja Operasional (KKO) yang dicetak tebal.
    - `desc`: Uraian capaian terukur yang mendukung *inline syntax highlighting* menggunakan backticks (`` `...` ``) untuk fungsi API, nama berkas, dan perintah teknis.
    - `keywords`: Array kata kunci inti yang dirender sebagai baris *chip pill* tagar (`#Keyword`).
- **Efek Wajib Hover Zoom 1.2x & Stacking Context (`hover:scale-[1.2]` & `hover:z-50`)**:
  - Setiap kartu Sub-CPMK wajib merespons hover kursor dengan pembesaran skala 1.2x (`hover:scale-[1.2]`, `transition-all duration-300 ease-out origin-center`, `cursor-pointer`).
  - **Elevasi Lapisan Maksimal**: Wajib menyertakan `hover:z-50` agar kartu yang sedang diteliti melayang di atas kartu-kartu lain di sebelahnya.
  - **Latar Belakang Solid Anti-Tembus Pandang**: Kartu wajib menggunakan warna latar solid (`bg-white dark:bg-zinc-900`) agar teks atau kartu di belakangnya tidak bocor/berbayang saat membesar.
  - **Bayangan Elevasi Adaptif**: `hover:shadow-[0_25px_60px_rgba(79,70,229,0.22)]` di Light Mode dan `dark:hover:shadow-[0_25px_60px_rgba(0,0,0,0.85)]` di Dark Mode.
- **Aturan Bebas Terpotong (Zero Clipping Rule)**:
  - Kontainer luar pembungkus CPMK **DILARANG** menggunakan `overflow-hidden`.
  - Efek pendaran cahaya dekoratif (*ambient gradient blur*) wajib diisolasi di dalam sub-wrapper tersendiri bertipe `absolute inset-0 rounded-2xl overflow-hidden pointer-events-none`. Hal ini menjamin kartu yang membesar 1.2x tidak terpotong tepi kontainer.
  - Dilengkapi badge panduan visual: `🔍 Hover Zoom 1.2x` pada sub-header banner CPMK.

---

## 2.2. Standar Pembeda Terminologi: "Praktek" (Tab Modul) vs "Praktikum" (Studio Praktikum Terpadu)

Untuk menjaga ketegasan leksikal dan mencegah kerancuan mahasiswa antara aktivitas koding mingguan di kelas dengan silabus mata kuliah praktikum resmi semesteran:
- **"Praktek" (atau "Lab Praktek & Prompt AI")**:
  - Digunakan khusus untuk seluruh instruksi latihan *hands-on*, eksperimen koding, tahapan bertahap (*Stepped Prompts*), formula prompt AI, dan panduan kode mingguan di dalam 16 modul perkuliahan (`/modules/[id]?tab=lab`).
  - Dilarang keras menggunakan kata "praktikum" untuk menamai langkah latihan atau tab lab pada halaman modul perkuliahan.
- **"Praktikum" (atau "Studio Praktikum Terpadu")**:
  - Dikhususkan HANYA untuk sistem kurikulum laboratorium terpadu 7 Modul Praktikum resmi (`/practicum`), tabel observasi empiris, formulir analisis hasil pengujian ilmiah, esai refleksi, pengesahan tanda tangan digital dosen & mahasiswa, serta penerbitan laporan kelulusan PDF resmi berstempel.
  - Menjaga marwah akademis dan pemisahan tegas antara tugas laporan praktikum berbobot SKS praktikum dengan materi latihan kuliah reguler.

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

> **Standar Alur Kerja Eksekusi AI Agent di IDE (VS Code)**:
> Di atas setiap kotak prompt, disajikan kartu ringkas 3 langkah pipeline AI Agent terintegrasi:
> 1. **Kirim ke Agent Panel**: Salin formula prompt ke AI Agent IDE terintegrasi (Antigravity / Cursor / Copilot / Roo Code).
> 2. **Otomasi CLI & Berkas**: AI Agent secara mandiri memeriksa dependensi di terminal dan merakit struktur berkas ke workspace.
> 3. **Review Diff & Checkpoint**: Mahasiswa bertindak sebagai *Code Reviewer*: meninjau diff di editor dan memverifikasi checkpoint pengujian langsung di peramban.
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
  - **Tab Lab Praktek & Prompt AI**: **DILARANG MENGGUNAKAN ZOOM** (`enableZoom={false}`), karena isinya panjang dan lebar; efek zoom akan menyebabkan konten terpotong (*clipped*) di tepi kanan layar.
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
  - Lab Praktek: 5 Langkah terpadu dari CLI setup, utilitas server/client Next.js 16, eksekusi DDL 3 tabel, hingga generasi tipe TypeScript.
  - Prompt All-in-One 5 Berkas (`src/utils/supabase/server.ts`, `client.ts`, `supabase/migrations/01_initial_schema.sql`, `src/types/database.types.ts`, `src/app/page.tsx` Root Navigation) + Panduan Dual-Mode & Standar Estetika UI Premium.
  - Misi Snowballing: Branch `feature/supabase-database-schema` dengan 5 kriteria DoD terukur dan progress bar interaktif.
  - 7 Soal Esai Uji Pemahaman konsep arsitektur.
- **Modul 5 (Selesai 100%)**: Autentikasi & Otorisasi Pengguna (Multi-Provider Unified Portal, Next.js 16 Proxy Session Protector, dan User Profiles Sync).
  - 4 Sub-CPMK Modular (`cpmkPoints`) dengan kartu grid responsif, chip kata kunci (`#5 Model Autentikasi`, `#Next.js 16 Proxy`, `#Dual-Cookie Sync`, `#PostgreSQL Triggers`), dan efek interaktif **Hover Zoom 1.2x** (`hover:scale-[1.2]`, `hover:z-50`).
  - Spektrum 5 Model Autentikasi Industri (ID Institusi NIM/NIP, Email/Password, Social OAuth 2.0 GitHub, Passwordless Magic Link, Enterprise SSO) beserta matriks Decision Framework.
  - 12 Simulator Interaktif Konsep + 3 Mockup Lab Praktek lengkap:
    - **12 Simulator Konsep (Tab 1)**: Arsitektur Autentikasi Institusional NIM Mahasiswa & NIDN Dosen vs Supabase Auth (`NimAuthArchitectureSimulator`), Stateless JWT & Rotasi Kriptografis (`JwtLifecycleAnimator`), GitHub OAuth 2.0 6 Langkah (`OauthFlowAnimator`), Passwordless Magic Link & OTP (`MagicLinkAnimator`), Intersepsi Next.js 16 Proxy & Matcher Regex (`MiddlewareInterceptionAnimator`), Keamanan Sesi getUser() vs getSession() Anti-Pattern (`SessionRefresherAnimator`), Matriks Hak Akses Rute Public/Private/Auth (`RouteProtectionMatrixAnimator`), Pembacaan Sesi RSC Zero Client Bundle (`ServerSessionReaderAnimator`), Mutasi Auth Server Actions Login/Signup/Logout (`AuthActionsFlowAnimator`), Route Handler OAuth Callback `/auth/callback` (`AuthCallbackRouteAnimator`), Pemisahan Skema Database `auth.users` vs `public.profiles` (`AuthUsersVsProfilesAnimator`), serta Otomasi Trigger PostgreSQL `on_auth_user_created` (`AutoProfileTriggerAnimator`).
    - **3 Visualizer & Mockup Lab Praktek (Tab 2)**: Mockup Supabase Studio Auth Settings & Confirm Email Toggle (`SupabaseAuthConfigSimulator`), Mockup Inbucket Mail Inbox & Rate Limits (`MagicLinkInboxSimulator`), serta Mockup Registrasi GitHub OAuth App.
  - Interactive Terms: Badges interaktif `supabase-auth`, `oauth`, `jwt`, `proxy`, dan `rls` di ringkasan konsep.
  - Subpoin Konsep: Format penomoran vertikal terstruktur (`1. ...\n\n2. ...\n\n3. ...`) dengan kontras visual kata kunci inline `<code>`.
  - Lab Praktek: 6 Langkah terpadu dari setup GitHub OAuth App, Helper Session `updateSession()`, Konvensi Resmi Next.js 16 `src/proxy.ts`, Callback Route Handler, Auth Server Actions, hingga SQL Trigger `handle_new_user()`.
  - Dual-Track Prompting AI: Formula Prompt All-in-One 7 Berkas (`src/utils/supabase/middleware.ts`, `src/proxy.ts`, `src/app/auth/callback/route.ts`, `src/actions/auth.ts`, `src/app/(auth)/login/page.tsx` + `unified-auth-card.tsx`, `supabase/migrations/02_auth_profiles_trigger.sql`, `src/app/page.tsx` Root Navigation Hero) didampingi **5 Tahap Stepped Prompts Teruji** (Tahap 1: Fondasi Proxy & DB, Tahap 2: Email & Password, Tahap 3: 1-Click Social OAuth GitHub, Tahap 4: Passwordless Magic Link OTP, Tahap 5: Unified Auth Portal & Root Nav Rule) dengan panduan 3-langkah AI Agent IDE workflow.
  - Misi Snowballing: Branch `feature/unified-multi-provider-auth` dengan 6 kriteria DoD terukur dan progress bar interaktif.
  - 7 Soal Esai Uji Pemahaman konsep arsitektur dengan passing threshold $\ge 80$.
  - Dokumen resmi: `panduan/PANDUAN_PENGAJARAN_MODUL_05.md` (150 menit timetable, skrip perkuliahan, arsitektur berkas Next.js 16 Proxy, dan uji bukti eksekusi).
- **Modul 6 (Selesai 100%)**: Integrasi CRUD End-to-End: Server Actions vs REST API Route Handlers (Mobile-Ready Backend) & Keamanan API.
  - 4 Sub-CPMK Modular (`cpmkPoints`) dengan kartu grid responsif, chip kata kunci (`#Dual Architecture`, `#Route Handlers`, `#Shared Zod Schemas`, `#Bearer Token JWT`, `#URL as State`), dan efek interaktif **Hover Zoom 1.2x** (`hover:scale-[1.2]`, `hover:z-50`).
  - 10 Simulator Interaktif lengkap: Arsitektur Ganda BFF vs Universal REST (`DualArchAnimator`), Skema Validasi Terbagi Web & API (`SharedZodSchemaAnimator`), Standarisasi Respons RFC 7807 & Status Codes (`RestResponseContractAnimator`), Otentikasi Stateless Bearer Token JWT (`BearerAuthFlowAnimator`), Mekanisme CORS Preflight OPTIONS (`CorsPreflightAnimator`), Evaluasi Keamanan RLS vs Bahaya Service Role Key (`RlsVsServiceRoleAnimator`), Route Handler Koleksi GET & POST (`CollectionRouteAnimator`), Route Handler Item Spesifik Async Params Next.js 16 (`ItemRouteAnimator`), Sinkronisasi URL as State & Debounce (`UrlStateSyncAnimator`), serta Rumus Matematika Supabase Pagination Range Query (`PaginationRangeAnimator`).
  - Interactive Terms: Badges interaktif `route-handler`, `rest-api`, `bearer-token`, `cors`, dan `rls` di ringkasan konsep dengan diagram alur pipeline visual.
  - Subpoin Konsep: Format penomoran vertikal terstruktur (`1. ...\n\n2. ...\n\n3. ...`) dengan kontras visual kata kunci inline `<code>`.
  - Lab Praktek: 5 Langkah terpadu dari helper respons standar & CORS, verifikasi Bearer Token JWT, Route Handler koleksi, Route Handler dinamis async params, hingga pengujian endpoint cURL / Thunder Client.
  - Prompt All-in-One 6 Berkas (`src/lib/api-response.ts`, `src/lib/api-auth.ts`, `src/app/api/v1/tasks/route.ts`, `src/app/api/v1/tasks/[id]/route.ts`, `src/components/tasks/task-search-input.tsx`, `src/app/page.tsx` Root Navigation Hero) + Panduan Dual-Mode & Standar Estetika UI Premium.
  - Misi Snowballing: Branch `feature/crud-rest-api-security` dengan 5 kriteria DoD terukur dan progress bar interaktif.
  - 7 Soal Esai Uji Pemahaman konsep arsitektur & keamanan API dengan passing threshold $\ge 80$.
  - Dokumen resmi: `panduan/PANDUAN_PENGAJARAN_MODUL_06.md` (150 menit timetable, skrip perkuliahan, arsitektur 6 berkas, dan uji bukti eksekusi cURL).
- **Implementasi Tab 4 & Sistem Autentikasi (Selesai 100%)**:
  - Tab 4 "Uji Pemahaman" (Mastery Learning $\ge 80$, Anti-Cheat Reset Instan, Triad Multi-Provider AI Groq/Gemini/DeepSeek/Heuristic).
  - Autentikasi Mahasiswa berbasis NIM & Dosen berbasis NIDN dengan cookie HTTP-only Next.js 16.
  - Database PostgreSQL Supabase aktif terhubung via `.env.local` (`setup_supabase.sql`).
  - Dashboard Monitoring Dosen (`/monitoring`) dengan kontrol import roster mahasiswa massal dan reset password mahasiswa.
- **Target Prioritas Pengerjaan Berikutnya**:
  - **Modul 7**: Advanced UI/UX 1: Animasi & Framer Motion (Transisi layout, micro-interactions, exit animations).
  - **Modul 8**: BOSS FIGHT 1: UTS – Prototype Pitching & Code Review.
  - **Modul 9**: Advanced UI/UX 2: Drag & Drop Kanban Board (`@dnd-kit`).
  - **Modul 10**: Manajemen Media & Aset dengan Cloudinary.
  - **Modul 11**: Supabase Real-time (WebSocket Collaboration, Presence & Postgres Changes).
  - **Modul 12**: Keamanan Database: Row Level Security (RLS) PostgreSQL & RBAC.
  - **Modul 13**: Deployment ke Vercel, CI/CD Pipeline & Observability (GitHub CI/CD, Preview Branches, Env Sync, Error Boundaries `error.tsx`, dan Runtime Logs).
  - **Modul 14**: Otomasi Serverless, Vercel Cron Jobs & Arsitektur Webhooks (Pola Background Jobs asinkron mengatasi timeout, proteksi token `CRON_SECRET`, verifikasi kriptografis HMAC SHA-256 payload Webhook via `node:crypto`, dan transaksi idempoten).
  - **Modul 15**: Finalisasi Proyek, Performance Audit (Lighthouse $\ge 90$) & SEO OpenGraph.
  - **Modul 16**: BOSS FIGHT 2: UAS – Final Production Live Demo.

- **Struktur 7 Modul Praktikum Resmi (`/practicum`) (Selesai 100% - Paket A)**:
  - Mengikuti standar kurikulum terpadu 7 Modul Praktikum (Praktikum 1 s.d. Praktikum 7) yang berpusat pada pengujian empiris, analisis berbantuan AI, dan pembuatan laporan digital resmi dengan pengesahan tanda tangan.

---

## 9. Standar Arsitektur & Kurikulum Studio Praktikum Terpadu (`/practicum`)

Studio Praktikum merupakan laboratorium komputasi serverless interaktif terpadu yang memadukan pengujian empiris, bimbingan AI analitis, dan penandatanganan laporan digital resmi:

### 9.1. Standar Desain Katalog Modul ("Compact 3-Column Studio Grid")
- **Layout Grid 3-Kolom Proporsional**:
  - Halaman katalog (`/practicum`) menerapkan layout 3 kolom di desktop (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6`).
  - Dilarang menggunakan layout 2 kolom melebar (*horizontal bloat*) yang menyebabkan kartu tampak kebesaran dan menyisakan banyak ruang kosong pasif.
- **Visual Anchor & Ikonografi Tematik**:
  - Setiap kartu modul dilengkapi wadah ikon unik 36×36 px beraksen warna pilar (`Layers` untuk P-01, `ShieldCheck` untuk P-02, `Database` untuk P-03, `KeyRound` untuk P-04, `Globe` untuk P-05, `Zap` untuk P-06, `Lock` untuk P-07).
  - Dilengkapi *ambient gradient glow* halus di pojok atas yang membesar dinamis saat di-hover.
- **Keseimbangan Akademik RPS & Adrenalin Industri**:
  - **Deretan Tech Pills Industri**: Setiap kartu menampilkan 3–4 tag alat/teknologi nyata (`Next.js 16`, `RSC (0 kB)`, `DevTools`, `Zod 3`, `React 19 Forms`, `PostgreSQL`, `Supabase BaaS`, `OAuth 2.0`, dll.) untuk memicu antusiasme eksplorasi mahasiswa.
  - **Kalimat Aksi Ringkas (*Mission Hook*)**: 1 kalimat tantangan aksi berikon `Target` yang menyajikan inti eksperimen secara hidup dan menarik.
  - **Target Capaian RPS Resmi Tetap Dipertahankan**: Kalimat capaian pembelajaran resmi silabus tetap ditampilkan dengan label rapi `🎯 Capaian RPS (Modul X Kuliah)` (2 baris *line-clamp* proporsional) demi menjaga marwah dan bobot akademis kurikulum.
- **Meta Bar & Tombol Aksi Sleek**:
  - Menampilkan estimasi waktu (`⏱️ ~45 mnt`), jumlah langkah (`5 Langkah Uji`), dan level (`Fundamental`, `Intermediate`, `Advanced`).
  - Tombol aksi menggunakan bentuk ramping `h-10 rounded-xl` beraksen tema modul dengan mikro-animasi panah `ChevronRight` yang meluncur dinamis saat di-hover.

### 9.2. Standar Landasan Teori Komprehensif (1:1 Mapping ke Langkah Praktikum)
- **Hierarki Baku 6 Seksi Lembar Kerja Praktikum**:
  1. **Seksi 1: Target Capaian Pembelajaran Praktikum (CPMK & Sub-CPMK)** (`PracticumCpmk`): Kartu pengantar kompetensi akademik dan daftar Sub-CPMK bernomor (`01` s.d. `05`).
  2. **Seksi 2: Landasan Teori & Panduan Konsep Praktikum** (`PracticumTheory`): Modul teori 3-tab (5 Konsep Kunci, Matriks Komparasi 7 Baris, Aturan Emas & Anti-Pattern).
  3. **Seksi 3: Prosedur Uji Coba & Hasil Pengamatan** (`ObservationTable`): Tabel 5 langkah pengujian empiris dan input pengamatan mahasiswa.
  4. **Seksi 4: Analisis Hasil Pengujian** (`EssaySection` tipe `analysis`): Formulir esai analitis ilmiah dengan koreksi AI dan evaluasi mendalam.
  5. **Seksi 5: Kesimpulan Praktikum** (`EssaySection` tipe `conclusion`): Formulir rangkuman esensial dan refleksi ketercapaian CPMK.
  6. **Seksi 6: Pengesahan & Pengiriman Laporan Praktikum**: Panel status kelulusan, tanda tangan digital dosen & mahasiswa, dan ekspor PDF resmi ber-stempel.
- **Standar Penyajian Capaian Pembelajaran Baku (CPMK & Sub-CPMK - Seksi 1)**:
  - CPMK disajikan sesuai kaidah baku silabus akademik OBE (Outcome-Based Education):
    1. Diawali kalimat pembuka resmi: *"Setelah menyelesaikan seluruh tahapan modul praktikum ini, mahasiswa diharapkan mampu:"*.
    2. Diikuti deretan kartu poin Sub-CPMK bernomor urut rapi (`01`, `02`, `03`, dst.).
    3. Setiap poin diawali Kata Kerja Operasional (KKO) Taksonomi Bloom yang dicetak tebal (`font-semibold`) seperti **Membedakan Lingkungan Eksekusi**, **Mengamati Mekanisme Streaming**, **Menginspeksi Bobot Bundle**, dst., diikuti uraian capaian yang terukur (*measurable & observable*).
  - **Dilarang keras** menampilkan CPMK sebagai satu paragraf teks panjang polos tanpa poin-poin terstruktur.
- **Prinsip Keselarasan 100% (1:1 Mapping)**:
  - Setiap langkah pengujian pada tabel observasi praktikum **WAJIB** berakar pada landasan teori yang eksplisit dan lengkap. Tidak boleh ada langkah eksperimen yang tidak tercakup secara teoritis.
  - Teori berfungsi sebagai acuan resmi mahasiswa sebelum melakukan pengujian dan saat menyusun analisis esai ilmiah.
- **Format Antarmuka 3-Tab Interaktif (`PracticumTheory` - Seksi 2)**:
  - **Tab 1: 5 Konsep Kunci Acuan Eksperimen**:
    - Nomor urut & badge topik (`01` • `0 kB Client Bundle`).
    - *Pill Kata Kunci* (*Keywords Highlighting*) untuk mempermudah pemindaian konsep penting.
    - *Kotak Intisari Konsep* (*Key Takeaway / 3-Detik Paham*): Ringkasan cepat berlatar warna tema.
    - *Penjelasan Teori Mendalam (Anti-Wall-of-Text)*: Disajikan dalam format kartu poin bernomor vertikal (`1.`, `2.`, `3.`, dst.) dengan penekanan visual kuat pada kata kunci penting (`**bold**`), istilah komputasi, dan kode inline (`` `code` ``) berlatar badge monospace agar mudah dipindai secara visual (*scannable*). Dilarang menyajikan teks teori sebagai paragraf monolitik panjang yang menjemukan.
    - *Cuplikan Kode / Panduan DevTools*: Komponen editor bergaya VS Code (`VsCodeSnippet` dengan aturan wajib `enableZoom={false}`).
    - *Kotak Acuan Langkah Praktikum (Amber Box)*: Penunjuk spesifik yang mengarahkan mahasiswa ke nomor baris tabel observasi terkait.
  - **Tab 2: Matriks Komparasi Arsitektural**:
    - Tabel perbandingan multi-baris (Zebra striping, analisis verdict, status badge) untuk referensi cepat mahasiswa membandingkan dua pendekatan komputasi.
  - **Tab 3: Aturan Emas & Anti-Pattern**:
    - Komparasi visual berdampingan antara ❌ *Anti-Pattern (Kesalahan Umum Mahasiswa)* vs ✅ *Best Practice (Standar Industri)* dengan cuplikan kode VS Code.
- **Penyimpanan Terpusat di `src/data/practicum-theories.ts`**:
  - Seluruh data konsep pilar, matriks komparasi, dan aturan emas disimpan secara terstruktur dan modular dalam berkas terdedikasi `src/data/practicum-theories.ts`.

### 9.3. Standar Akses Dosen: "Mode Panduan Dosen (Instruktur Kelas)"
- **Dual-Mode Gerbang Masuk (`PracticumLoginGate`)**:
  - Gerbang login praktikum menyediakan dua tab: `[🎓 Akun Mahasiswa]` dan `[🎖️ Mode Panduan Dosen]`.
  - Dosen dilarang masuk menggunakan akun dummy mahasiswa ("Budi Santoso").
- **Deteksi Otomatis & Sesi 1-Klik**:
  - Jika dosen telah memiliki sesi aktif (`lecturer_session`), sistem menampilkan kartu verifikasi emas dengan tombol 1-klik: `[Masuk Mode Panduan (Nama Dosen) ➔]`.
  - Jika belum memiliki sesi, dosen dapat menggunakan login instan NIDN pengampu default (`0012345678`).
- **Profil Resmi Instruktur di Lembar Kerja**:
  - Header lembar kerja praktikum (`PracticumHeader`) menampilkan profil resmi dosen: Nama Dosen, badge **Dosen**, dan NIDN, disertai badge khusus **"Mode Panduan Kelas"**.
  - Dosen leluasa menginput sampel observasi dan men-generate analisis AI langsung di layar proyektor untuk percontohan kelas tanpa merusak/mencampuri data mahasiswa.
  - Dilengkapi tombol pintasan cepat `[🎖️ Portal Dosen]` untuk memantau setoran mahasiswa secara real-time dan `[🚪 Ganti Akun]` untuk berganti ke mode mahasiswa biasa.

### 9.4. Daftar 7 Modul Praktikum Resmi (Paket A):
1. **Praktikum 1** (Ref: Kuliah M2): Next.js 16 App Router: Server vs Client Component & Hydration (Tema: Teal).
2. **Praktikum 2** (Ref: Kuliah M3): Server Actions & Validasi Skema Data dengan Zod (Tema: Emerald).
3. **Praktikum 3** (Ref: Kuliah M4): Database Relasional PostgreSQL & Integrasi Supabase (Tema: Cyan).
4. **Praktikum 4** (Ref: Kuliah M5): Autentikasi Multi-Provider & Proteksi Rute Edge Middleware (Tema: Indigo).
5. **Praktikum 5** (Ref: Kuliah M6): Integrasi CRUD & Universal REST API Route Handlers (Tema: Amber).
6. **Praktikum 6** (Ref: Kuliah M11): Supabase Real-time: Kolaborasi WebSocket & Presence (Tema: Teal).
7. **Praktikum 7** (Ref: Kuliah M12): Keamanan Database: Row Level Security (RLS) PostgreSQL (Tema: Rose).

---

## 10. Aturan Lingkungan & Development Server

- Jangan pernah menjalankan `next build` bersamaan ketika dev server (`next dev`) sedang berjalan, karena dapat merusak cache internal Turbopack.
- Jika browser menampilkan cache usang (*stale*), bersihkan direktori `.next/` lalu jalankan ulang dev server dan lakukan *hard refresh* (`Ctrl + Shift + R`).
- Dilarang membuat file sementara di luar direktori workspace.



