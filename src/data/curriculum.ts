export interface ModuleData {
  id: number;
  worldId: "world-1" | "boss-1" | "world-2" | "boss-2";
  worldTitle: string;
  weekNumber: number;
  title: string;
  subtitle: string;
  cpmk: string;
  duration: string;
  xp: number;
  
  // Pilar 1: Konsep & Teori
  concepts: {
    summary: string;
    points: { title: string; desc: string }[];
    diagramNote?: string;
    deepDiveSections?: {
      title: string;
      badge?: string;
      content: string;
      subpoints?: {
        label: string;
        text: string;
        code?: string;
        language?: string;
        caption?: string;
      }[];
      comparisonTable?: {
        headers: string[];
        rows: string[][];
      };
      callout?: {
        type: "warning" | "tip" | "info";
        title: string;
        text: string;
      };
    }[];
  };
  references: { title: string; url: string; source: string }[];
  
  // Pilar 2: Lab & Prompting AI
  lab: {
    prerequisites: string[];
    steps: {
      stepNumber: number;
      instruction: string;
      code?: string;
      language?: string;
      explanation?: string;
    }[];
    aiPromptTemplate: {
      role: string;
      prompt: string;
      tip: string;
    };
    warningZone?: {
      title: string;
      desc: string;
    };
  };

  // Pilar 3: Misi Proyek Akhir (Bola Salju)
  mission: {
    taskTitle: string;
    taskDesc: string;
    definitionOfDone: string[];
    gitBranchTask: string;
  };
}

export const MODULES: ModuleData[] = [
  // ==================== DUNIA 1: FONDASI & BACKEND (M1 - M7) ====================
  {
    id: 1,
    worldId: "world-1",
    worldTitle: "Dunia 1: Fondasi & Backend Serverless",
    weekNumber: 1,
    title: "Pengantar Serverless & AI-Assisted Workflow",
    subtitle: "Memahami ekosistem komputasi awan modern, keamanan Git, dan berkolaborasi dengan AI.",
    cpmk: "Mahasiswa mampu membedakan BaaS vs FaaS, mengonfigurasi repository Git yang aman (.gitignore & .env.local), serta mempraktikkan prompting AI berkonteks tinggi.",
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 150,
    concepts: {
      summary: "Serverless membebaskan developer dari manajemen infrastruktur server manual. Kita berfokus pada dua pilar: FaaS (Vercel Serverless Functions) dan BaaS (Supabase), yang dipadukan dengan manajemen repositori Git yang disiplin dan aman.",
      points: [
        { title: "BaaS vs FaaS", desc: "FaaS mengeksekusi kode per-event on-demand. BaaS menyediakan database, auth, dan storage siap pakai via API." },
        { title: "The Tech Stack", desc: "Next.js (Frontend & Server Logic), Supabase (Postgres & Auth), Cloudinary (Media CDN), Vercel (CI/CD Deploy)." },
        { title: "Arsitektur 3 Area Git", desc: "Working Tree (file yang diedit) ➔ Staging Area (git add untuk memilih berkas) ➔ Local Repository (git commit untuk snapshot permanen) ➔ Remote GitHub (git push)." },
        { title: "Identitas & Git Hygiene", desc: "Identitas global vs lokal (git config) menentukan pencatatan author. File .env.local berisi kunci rahasia yang wajib masuk .gitignore agar tidak terunggah ke publik." }
      ],
      diagramNote: "Client Browser ↔️ Next.js (Vercel Serverless) ↔️ Supabase (Data/Auth) & Cloudinary (Media CDN)",
      deepDiveSections: [
        {
          title: "1. Paradigma Serverless: FaaS vs BaaS vs Monolith VPS",
          badge: "Pilar 1: Komputasi Cloud Modern",
          content: "Di era web tradisional, developer harus menyewa VPS (Virtual Private Server), menginstal OS Linux, memasang web server Nginx, PM2 process manager, dan memelihara database 24 jam sehari meskipun tidak ada pengguna yang aktif. Serverless mengubah paradigma ini: server tetap ada di cloud, namun seluruh provisioning, auto-scaling, dan maintenance dikelola secara otomatis oleh penyedia platform.",
          subpoints: [
            {
              label: "FaaS (Function as a Service) & Event-Driven Execution",
              text: "Model komputasi berbasis event (event-driven). Kode backend dipecah menjadi fungsi-fungsi modular yang hanya 'bangun' saat dipanggil (misal: saat request HTTP masuk), mengeksekusi logika dalam milidetik, lalu otomatis mati kembali (scale-to-zero). Anda hanya membayar per milidetik eksekusi (Rp 0 saat idle).",
              code: `// Contoh Server Action di Next.js 16 (FaaS on Vercel)
"use server";

export async function submitTask(formData: FormData) {
  // Hanya aktif saat ada HTTP request, lalu mati otomatis
  const title = formData.get("title");
  return { success: true, message: \`Tugas "\${title}" berhasil disimpan!\` };
}`,
              language: "tsx",
              caption: "Contoh Logika Serverless Function"
            },
            {
              label: "BaaS (Backend as a Service) & Layanan Cloud Terkelola",
              text: "Layanan penyedia seluruh infrastruktur backend siap pakai berbasis API & SDK. Menyediakan Database PostgreSQL terkelola penuh, Autentikasi Pengguna (OAuth GitHub/JWT), File Storage CDN, dan WebSocket Realtime tanpa perlu merakit Linux server database manual.",
              code: `// Mengakses Database PostgreSQL via Supabase SDK
import { supabase } from "@/lib/supabase";

const { data: tasks, error } = await supabase
  .from("tasks")
  .select("*")
  .order("created_at", { ascending: false });`,
              language: "typescript",
              caption: "Konsumsi SDK BaaS Supabase"
            },
            {
              label: "Ekosistem 4 Pilar di Perkuliahan Kita",
              text: "Next.js 16 (Frontend & Server Actions) ↔️ Vercel (Edge/Serverless CI/CD Hosting) ↔️ Supabase (Database PostgreSQL & Auth) ↔️ Cloudinary (AI Media CDN).",
              code: `Next.js 16 (Frontend & Server Actions)
   ↕️ (Hosting & Edge CI/CD)
Vercel Serverless Platform
   ↕️ (Database PostgreSQL & Auth)
Supabase Cloud BaaS
   ↕️ (Media Optimization CDN)
Cloudinary AI Image Pipeline`,
              language: "text",
              caption: "Arsitektur Integrasi 4 Pilar"
            }
          ],
          comparisonTable: {
            headers: ["Dimensi", "Monolith VPS Tradisional", "FaaS (Function as a Service)", "BaaS (Backend as a Service)"],
            rows: [
              ["Manajemen Server", "Manual (Install Linux, Nginx, PM2)", "Zero Server (Dikelola Vercel)", "Zero Server (Dikelola Supabase)"],
              ["Skalabilitas", "Manual / Perlu Setup Load Balancer", "Auto-scale Instan per Event Masuk", "Auto-scale Cloud PostgreSQL Native"],
              ["Model Biaya", "Sewa Tetap 24/7 (Bayar meski idle)", "Pay-per-execution (Rp 0 saat sepi)", "Freemium / Berbasis Kuota Database"],
              ["Fokus Pengembang", "Mengurus Infrastruktur + Kode", "Fokus Murni Logika Server Actions", "Fokus Konsumsi SDK & Skema Data"]
            ]
          },
          callout: {
            type: "tip",
            title: "Prinsip Scale-to-Zero: Mengapa Startup Modern Memilih Serverless?",
            text: "Dengan FaaS dan BaaS, startup tidak perlu mengeluarkan biaya infrastruktur ribuan dolar per bulan saat pengguna masih sedikit. Arsitektur serverless otomatis membesar saat viral dan mengecil ke Rp 0 saat sepi pengunjung."
          }
        },
        {
          title: "2. Sistem Kontrol Versi Terdistribusi & Siklus Kerja Git",
          badge: "Pilar 2: Manajemen Riwayat Kode",
          content: "Git adalah sistem pelacak versi terdistribusi yang membagi status file ke dalam 3 wilayah kerja lokal dan 1 repositori remote di cloud. Memahami siklus ini sangat krusial agar kolaborasi tim berjalan mulus dan riwayat commit tetap bersih.",
          subpoints: [
            {
              label: "Arsitektur 3 Wilayah Kerja Git",
              text: "Git membagi tahapan perubahan file secara teratur sebelum dikirim ke remote cloud:",
              code: `Working Tree (Ketik Kode di VS Code)
   ➔ [git add] ➔ Staging Area (Seleksi Berkas Siap Simpan)
   ➔ [git commit] ➔ Local Repository / HEAD (Snapshot Permanen)
   ➔ [git push] ➔ Remote GitHub (Penyimpanan Cloud Terdistribusi)`,
              language: "text",
              caption: "Siklus 3 Wilayah Kerja Git"
            },
            {
              label: "Identitas Author (Konfigurasi Global vs Local Override)",
              text: "Git mewajibkan setiap commit memiliki user.name dan user.email. Konfigurasi '--global' berlaku untuk seluruh komputer (~/.gitconfig), sedangkan konfigurasi lokal (tanpa --global) memungkinkan override identitas per-folder untuk memisahkan akun kampus dan akun pribadi:",
              code: `# 1. Konfigurasi Global (berlaku untuk semua proyek di laptop ini):
git config --global user.name "Nama Lengkap Anda"
git config --global user.email "email-utama@example.com"

# 2. Konfigurasi Lokal (override hanya untuk repositori folder ini):
git config user.name "Nama Mahasiswa Kuliah"
git config user.email "nim@kampus.ac.id"`,
              language: "bash",
              caption: "Perintah Konfigurasi Identitas Git"
            },
            {
              label: "Filosofi Feature Branch & Siklus Merge Git (4 Langkah Baku)",
              text: "Cabang utama 'main' selalu dijaga dalam kondisi stabil dan siap rilis. Seluruh pengerjaan tugas mingguan wajib dilakukan di cabang terpisah sebelum digabungkan kembali via merge:",
              code: `# 1. Langkah 1: Buat dan berpindah ke branch fitur:
git checkout -b feature/sandbox-init

# 2. Langkah 2: Kerjakan tugas dan simpan commit:
git add . && git commit -m "feat: inisialisasi sandbox"

# 3. Langkah 3: Gabungkan kembali ke branch main:
git checkout main && git merge feature/sandbox-init

# 4. Langkah 4: Hapus branch fitur yang sudah selesai:
git branch -d feature/sandbox-init`,
              language: "bash",
              caption: "Siklus 4 Langkah Git Workflow"
            }
          ],
          comparisonTable: {
            headers: ["Zona Git", "Lokasi Fisik", "Status File", "Tujuan Utama"],
            rows: [
              ["Working Tree", "Folder proyek di komputer", "Untracked / Modified", "Tempat mengetik dan mengedit kode aplikasi"],
              ["Staging Area", "Indeks memori internal Git", "Staged (Changes to be committed)", "Memilih berkas yang siap dipotret ke riwayat"],
              ["Local Repo", "Folder tersembunyi .git/objects", "Committed (Snapshot Permanen)", "Menyimpan versi riwayat utuh di mesin lokal"],
              ["Remote GitHub", "Cloud Server GitHub", "Pushed (Origin Main)", "Kolaborasi tim, backup aman & trigger auto-deploy Vercel"]
            ]
          },
          callout: {
            type: "tip",
            title: "Aturan Emas: Jangan Pernah Ngoding Langsung di Branch Main!",
            text: "Selalu buat branch fitur baru untuk setiap pengerjaan misi. Jika terjadi kesalahan fatal atau kode error, branch main tetap aman dan dapat dipulihkan dengan mudah."
          }
        },
        {
          title: "3. Keamanan Repositori & Higienitas Kredensial Rahasia (Secrets Hygiene)",
          badge: "Pilar 3: Keamanan Data Sensitif",
          content: "File .env.local memuat API Secret (seperti Supabase Service Role Key) yang memberi akses penuh ke database cloud. Bot scraper otomatis di internet memindai setiap commit publik setiap detik. Menjaga higienitas repositori adalah garis pertahanan pertama bagi software engineer.",
          subpoints: [
            {
              label: "Mekanisme Proteksi .gitignore & File .env.local",
              text: "File .env.local menyimpan kredensial rahasia database. Mendaftarkan aturan '.env*.local' ke dalam file .gitignore memastikan Git mengabaikan file tersebut secara otomatis:",
              code: `# .gitignore
# Berkas kredensial rahasia (DILARANG di-commit)
.env*.local
.env

# Dependensi & Cache Turbopack
node_modules/
.next/`,
              language: "gitignore",
              caption: "Aturan Proteksi di .gitignore"
            },
            {
              label: "Ancaman Bot Scraper & Jejak Digital Commit History",
              text: "Jika file rahasia terlanjur ter-push ke GitHub publik, menghapusnya di commit berikutnya TIDAK AKAN MENGHAPUS kunci dari riwayat Git. Bot scraper hanya butuh 2 detik untuk mencuri kunci Anda dari histori commit:",
              code: `# ⚠️ SALAH KAPRAH: Menghapus file di commit berikutnya
git rm .env.local
git commit -m "fix: hapus secret" 
# Hasil: Kunci API TETAP BISA DILIHAT di riwayat commit sebelumnya!

# ✅ SOLUSI BENAR: Segera rotate (ganti) API Key di Dashboard Cloud Provider!`,
              language: "bash",
              caption: "Mengapa History Commit Menyimpan Data Permanen"
            }
          ],
          comparisonTable: {
            headers: ["Jenis Berkas", "Contoh File", "Status Git", "Risiko Jika Terunggah"],
            rows: [
              ["Kode Sumber Publik", "src/app/page.tsx, components/*", "Wajib di-commit & di-push", "Tidak ada (merupakan logika aplikasi publik)"],
              ["Konfigurasi Dependensi", "package.json, tsconfig.json", "Wajib di-commit", "Aman (hanya daftar nama pustaka)"],
              ["Environment Variables", ".env.local, .env.production", "WAJIB DIABAIKAN (.gitignore)", "FATAL (Database bisa disusupi, kuota jebol)"]
            ]
          },
          callout: {
            type: "warning",
            title: "Hukum Keamanan Industri: Anggap Secret yang Ter-push Sudah Dicuri!",
            text: "Jika Anda tidak sengaja mengunggah .env.local ke GitHub publik, jangan hanya menghapus file tersebut. Anda WAJIB membuka dashboard Supabase dan menekan tombol 'Roll / Rotate Secret Key' agar kunci lama dimatikan seketika."
          }
        },
        {
          title: "4. Metodologi Rekayasa AI Berkonteks Tinggi (Framework C-R-E-T)",
          badge: "Pilar 4: AI-Assisted Engineering",
          content: "Model bahasa besar (LLM seperti Claude, ChatGPT, Cursor, Copilot) dilatih menggunakan miliaran baris kode lama di internet. Tanpa batasan konteks presisi (C-R-E-T), AI akan menghasilkan kode usang React 18 atau Pages Router yang memicu error fatal di Next.js 16.",
          subpoints: [
            {
              label: "C — Context & R — Role (Mengarahkan Domain & Persona Pakar)",
              text: "Mendefinisikan peran profesional senior dan konteks domain aplikasi untuk mengarahkan gaya arsitektur dan standar rekayasa yang dihasilkan AI:",
              code: `// [ROLE]: Persona Pakar di baris teratas
"Bertindaklah sebagai Senior Cloud Software Engineer & Next.js 16 Specialist."

// [CONTEXT]: Domain aplikasi & arsitektur sistem
"Saya sedang membangun portal perkuliahan Serverless menggunakan Next.js 16 App Router, Tailwind CSS v4, dan Supabase PostgreSQL."`,
              language: "text",
              caption: "Komponen Context & Role"
            },
            {
              label: "E — Explicit Constraints & Versi Teknologi (Next.js 16 & React 19)",
              text: "Sebutkan versi spesifik dan batasan teknis yang dilarang/diharuskan secara tegas guna menangkal kode usang:",
              code: `// [EXPLICIT CONSTRAINTS]: Batasan teknis tegas
- Wajib Next.js 16 App Router (params adalah Promise async yang wajib di-await).
- Gunakan React 19 hook (useActionState, useFormStatus).
- Dilarang menambahkan direktif 'use client' di file page.tsx.
- Dilarang menggunakan tipe 'any' (wajib strict TypeScript).
- Gunakan Server Actions 'use server' (dilarang membuat /api/* terpisah).`,
              language: "text",
              caption: "Komponen Explicit Constraints"
            },
            {
              label: "T — Target Output Structure & Standar Review Kode AI",
              text: "Minta arsitektur berkas terpisah yang modular dan selalu lakukan review mandiri sebelum kode disalin ke codebase:",
              code: `// [TARGET OUTPUT]: Struktur file modular
"Hasilkan 3 file terpisah:
 1. src/app/tasks/page.tsx (Server Component untuk fetch data)
 2. src/components/tasks/task-form.tsx (Client Component form)
 3. src/actions/tasks.ts (Server Action dengan validasi Zod)"`,
              language: "text",
              caption: "Komponen Target Output"
            }
          ],
          comparisonTable: {
            headers: ["Aspek", "Vague Prompt (Asal-asalan) ❌", "High-Context Prompt (Presisi C-R-E-T) ✅"],
            rows: [
              ["Spesifikasi Versi", "\"Buatkan form input data tugas\"", "\"Buatkan form input di Next.js 16 App Router dengan React 19\""],
              ["Logika & Backend", "\"Pakai validasi form\"", "\"Validasi FormData menggunakan skema Zod dan Server Actions 'use server'\""],
              ["State Management", "Menghasilkan useState / API routes usang", "Menggunakan useActionState untuk umpan balik instan tanpa reload"],
              ["Hasil Kode", "Beresiko error / deprecated di Next.js 16", "Kompatibel 100%, modern, aman, dan siap produksi"]
            ]
          },
          callout: {
            type: "tip",
            title: "Filosofi Human in the Loop: Pahami Kode AI Anda!",
            text: "Kalian diizinkan dan diwajibkan memanfaatkan AI sebagai co-pilot pemrograman. Namun, Anda tetaplah kaptennya. Selalu review setiap baris kode yang dihasilkan AI menggunakan checklist verifikasi sebelum melakukan commit."
          }
        }
      ]
    },
    references: [
      { title: "Next.js Official Documentation", url: "https://nextjs.org/docs", source: "Next.js" },
      { title: "Tailwind CSS Documentation", url: "https://tailwindcss.com/docs", source: "Tailwind CSS" },
      { title: "Supabase Architecture Overview", url: "https://supabase.com/docs/guides/getting-started/architecture", source: "Supabase" },
      { title: "Git Basics & Architecture Guide", url: "https://git-scm.com/book/en/v2/Getting-Started-Git-Basics", source: "Git SCM" }
    ],
    lab: {
      prerequisites: ["Node.js v20+ LTS", "Git terinstal (Git Bash disarankan di Windows)", "Akun GitHub aktif", "VS Code / Cursor"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Setel Identitas Pengembang Git (Global vs Local)",
          code: `# 1. Setel identitas global (berlaku untuk semua proyek di laptop ini):
git config --global user.name "Nama Lengkap Anda"
git config --global user.email "email-github-anda@example.com"

# 2. Periksa apakah konfigurasi identitas sudah tersimpan:
git config --list`,
          language: "bash",
          explanation: "Git mewajibkan setiap commit memiliki nama & email pembuat agar tercatat di riwayat GitHub. Tips Multi-Akun: Jika Anda menggunakan akun GitHub khusus kuliah/kantor di folder tertentu, Anda bisa menimpanya di dalam folder proyek tersebut dengan 'git config user.name ...' (tanpa --global)."
        },
        {
          stepNumber: 2,
          instruction: "Inisialisasi Proyek Next.js & Masuk ke Direktori Kerja",
          code: `npx create-next-app@latest my-serverless-app --typescript --tailwind --eslint --app --src-dir
cd my-serverless-app`,
          language: "bash",
          explanation: "Perintah create-next-app secara otomatis membuatkan folder tersembunyi .git/ (database pelacak versi lokal) dan file .gitignore bawaan yang sudah terkonfigurasi untuk mengabaikan node_modules dan file .env."
        },
        {
          stepNumber: 3,
          instruction: "Eksperimen Git Hygiene: Buat .env.local dan Verifikasi .gitignore",
          code: `# 1. Buat file kredensial rahasia (pilih sesuai OS/Terminal Anda):
# Linux / macOS / Git Bash:  touch .env.local
# Windows PowerShell:        New-Item .env.local
# Windows CMD:               type nul > .env.local

# 2. Verifikasi status Git (berlaku di semua OS):
git status`,
          language: "bash",
          explanation: "Perhatikan output 'git status'. File .env.local TIDAK BOLEH muncul di daftar 'Untracked files'. Warnanya akan memudar (abu-abu) di VS Code. Ini membuktikan aturan .gitignore berhasil melindungi API Key rahasia agar tidak bocor ke publik."
        },
        {
          stepNumber: 4,
          instruction: "Hubungkan Repositori Lokal ke GitHub Cloud (Pilih 1 dari 3 Metode)",
          code: `# =========================================================================
# OPSI A: Cara Standar (Web GitHub + Git CLI) - [Rekomendasi Pemula]
# =========================================================================
# 1. Buka https://github.com/new dan buat repo baru
#    (PENTING: JANGAN centang Add README atau .gitignore agar tidak konflik!)
# 2. Standarisasi branch utama & hubungkan remote URL:
git branch -M main
git remote add origin https://github.com/USERNAME/my-serverless-app.git
git push -u origin main

# =========================================================================
# OPSI B: Cara Modern (GitHub CLI 'gh') - [Satu Perintah 3-in-1 Otomatis]
# =========================================================================
# 💡 Panduan Instalasi GitHub CLI (jika belum terpasang):
# - Windows (PowerShell/CMD) : winget install --id GitHub.cli
# - macOS (Homebrew)         : brew install gh
# - Linux (Ubuntu/Debian)    : sudo apt install gh
# - Login akun (sekali saja) : gh auth login (Pilih GitHub.com -> HTTPS -> Browser)
#
# Eksekusi 1 baris (otomatis buat repo di cloud, pasang remote, dan push):
gh repo create my-serverless-app --public --source=. --remote=origin --push

# =========================================================================
# OPSI C: Cara Visual (VS Code / Cursor GUI) - [Tanpa Terminal]
# =========================================================================
# 1. Buka tab Source Control di kiri VS Code (Ctrl + Shift + G)
# 2. Klik tombol "Publish to GitHub" -> Pilih "Publish to GitHub Public Repository"`,
          language: "bash",
          explanation: "Opsi A melatih pemahaman alur remote URL dan flag '-u' (upstream locking). Opsi B adalah standar efisiensi industri modern dengan GitHub CLI (lengkap dengan panduan instalasi multi-platform). Opsi C memanfaatkan integrasi grafis editor. Ketiganya menghasilkan repositori aktif yang sama di akun GitHub Anda."
        }
      ],
      aiPromptTemplate: {
        role: "Formula Prompt AI Teruji (C-R-E-T Framework)",
        prompt: `Bertindaklah sebagai Senior Cloud Software Engineer & DevSecOps Specialist.

[CONTEXT]
Saya sedang menginisialisasi repositori proyek perkuliahan "The Serverless Odyssey" berbasis Full-Stack Serverless (Next.js 16 App Router, Supabase Cloud PostgreSQL, Cloudinary CDN, dan Vercel Edge). Repositori ini akan dipublikasikan ke GitHub publik, sehingga memerlukan standar fondasi keamanan kredensial dan dokumentasi repositori yang profesional.

[EXPLICIT CONSTRAINTS]
1. DETEKSI INSTALASI NEXT.JS 16:
   - Jika direktori proyek ini belum memiliki Next.js (belum ada file package.json), EKSEKUSI (jika memiliki tool terminal) atau BERIKAN instruksi perintah CLI resmi berikut untuk inisialisasi:
     npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --yes
2. HIGIENITAS DEVSECOPS & SECRETS:
   - Dilarang keras membocorkan file kredensial rahasia (.env, .env.local, .env*.local), cache Turbopack (.next/), log error, dan folder dependensi (node_modules).
3. TEMPLATE PUBLIK:
   - Buatkan file .env.example yang AMAN untuk di-commit publik (hanya menyertakan key variabel tanpa nilai/token asli).
4. DOKUMENTASI RESMI:
   - Buatkan file README.md bergaya profesional standar industri menggunakan Markdown dengan tech stack badges (Next.js 16, Supabase, Cloudinary, Vercel), ringkasan arsitektur 4 pilar, panduan setup lokal (.env.example -> .env.local), dan aturan 4 langkah Git branch.

[TARGET OUTPUT STRUCTURE]
Hasilkan luaran yang terstruktur dan lengkap:
1. Inisialisasi: Perintah terminal Next.js 16 (eksekusi atau panduan jika belum diinstal)
2. Berkas 1: .gitignore (Konfigurasi pengabaian komprehensif untuk Next.js 16, Supabase, OS temporary files, dan secrets)
3. Berkas 2: .env.example (Template variabel lingkungan publik aman untuk Supabase & Cloudinary)
4. Berkas 3: README.md (Dokumentasi resmi proyek The Serverless Odyssey lengkap dengan badges dan panduan instalasi)
5. CLI Script: Perintah terminal bash 1 baris untuk menguji proteksi gitignore sebelum commit pertama.`,
        tip: "Salin formula C-R-E-T ini ke Antigravity, OpenCode, atau AI coding assistant pilihan Anda untuk otomatisasi setup proyek atau panduan instalasi lengkap."
      },
      warningZone: {
        title: "Zona Bahaya: Kebocoran API Key!",
        desc: "JANGAN PERNAH melakukan git commit pada file .env atau .env.local yang berisi service_role key. Kunci rahasia yang ter-push ke GitHub publik dapat disalahgunakan oleh bot scraper dalam hitungan detik."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 1: Setup Repository & Sandbox Proyek",
      taskDesc: "Inisialisasi repositori GitHub publik proyek perkuliahan Anda, amankan berkas .env.local via .gitignore, dan eksekusi siklus 4 langkah Git.",
      definitionOfDone: [
        "Langkah 1: Berpindah ke branch fitur baru ('git checkout -b feature/sandbox-init')",
        "Langkah 2: Inisialisasi Next.js 16 App Router dan buat file .env.local dengan proteksi .gitignore",
        "Langkah 3: Simpan commit pertama yang bersih ('git add . && git commit -m \"feat: init sandbox\"')",
        "Langkah 4: Gabungkan ke branch main dan push ke repositori GitHub publik"
      ],
      gitBranchTask: "git checkout -b feature/sandbox-init"
    }
  },
  {
    id: 2,
    worldId: "world-1",
    worldTitle: "Dunia 1: Fondasi & Backend Serverless",
    weekNumber: 2,
    title: "Next.js 16 App Router, RSC & Arsitektur Komponen Shadcn UI",
    subtitle: "Menguasai paradigma Server vs Client Components, sistem routing file-system lengkap, dan merakit antarmuka modern dengan Shadcn UI.",
    cpmk: "Mahasiswa mampu merancang arsitektur halaman web hibrida (Server & Client Components), mengimplementasikan routing bersarang dan dinamis di Next.js 16, serta mengintegrasikan sistem komponen Shadcn UI yang responsif dan accessible.",
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 200,
    concepts: {
      summary: "Next.js 16 App Router memadukan arsitektur React Server Components (RSC) untuk efisiensi komputasi server dengan Client Components untuk interaktivitas dinamis. Didukung oleh sistem routing hierarki folder dan ekosistem komponen terbuka Shadcn UI, developer dapat membangun antarmuka web skala produksi berkecepatan tinggi tanpa overhead bundle JavaScript berlebih.",
      points: [
        { title: "Server Components (RSC) by Default", desc: "Dieksekusi 100% di server dengan payload streaming HTML, 0 kB JavaScript bundle ke klien, aman mengakses environment secrets dan database langsung." },
        { title: "Client Components ('use client')", desc: "Komponen interaktif yang mengirim bundle JavaScript ke browser untuk proses hydration saat membutuhkan state (useState), event listener (onClick), atau API browser." },
        { title: "Anatomi File-System Routing", desc: "Hierarki konvensi file khusus (layout.tsx, page.tsx, loading.tsx, error.tsx, not-found.tsx) beserta rute dinamis [id] dan route groups (auth)." },
        { title: "Filosofi Open Architecture Shadcn UI", desc: "Bukan library NPM tertutup, melainkan komponen berbasis Radix UI Primitives & Tailwind CSS yang disalin langsung ke folder proyek untuk kepemilikan kode 100%." }
      ],
      diagramNote: "Browser Client (Hydrated UI) ↔️ Next.js 16 (App Router + RSC Streaming) ↔️ Shadcn Components (Radix + Tailwind) ↔️ Backend Database",
      deepDiveSections: [
        {
          title: "1. Paradigma Komputasi Next.js 16: Server Components (RSC) vs Client Components ('use client')",
          badge: "Pilar 1: Arsitektur Rendering React 19",
          content: "Secara default di Next.js App Router, setiap file komponen (.tsx) adalah React Server Component (RSC). Komponen ini dieksekusi 100% di server dan hanya mengirimkan hasil komputasi berupa HTML siap pakai dan RSC payload ringan ke browser. Ini menghemat kuota pengguna, mempercepat waktu muat (FCP), dan melindungi kunci rahasia backend dari kebocoran.",
          subpoints: [
            {
              label: "Kapan Wajib Menggunakan Server Component (Default)",
              text: "Server Components adalah pilihan default ideal untuk membaca data dari backend, menjaga kredensial database tetap aman di server, dan memastikan browser pengguna menerima HTML instan tanpa beban bundle JavaScript.",
              code: `// src/app/dashboard/page.tsx (Server Component secara default)
import { supabase } from "@/lib/supabase";

export default async function DashboardPage() {
  // 🔒 Query database langsung di server — Kunci API rahasia 100% aman
  const { data: projects } = await supabase.from("projects").select("*");
  return <ProjectGrid items={projects} />;
}`,
              language: "tsx",
              caption: "Contoh Server Component Data Fetching"
            },
            {
              label: "Kapan Wajib Menggunakan Client Component ('use client')",
              text: "Tambahkan direktif 'use client' hanya pada komponen yang secara langsung menangani interaktivitas pengguna, state reaktif, atau API khusus browser.",
              code: `// src/components/counter-button.tsx (Client Component)
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CounterButton() {
  // ✨ Memerlukan state dan onClick handler di browser
  const [count, setCount] = useState(0);
  return <Button onClick={() => setCount(count + 1)}>Diklik: {count}x</Button>;
}`,
              language: "tsx",
              caption: "Contoh Client Component Interaktif"
            },
            {
              label: "Aturan Emas Komposisi (Interleaving Pattern)",
              text: "Anda dapat mengimpor Client Component ke dalam Server Component. Namun, Anda DILARANG mengimpor Server Component secara langsung di dalam Client Component. Solusinya: lewati Server Component sebagai prop 'children' agar ServerList tetap dieksekusi di server tanpa menjadi bundle client.",
              code: `// src/app/page.tsx (Server Component)
import { ClientModal } from "@/components/client-modal";
import { ServerTaskList } from "@/components/server-task-list";

export default function Page() {
  return (
    <ClientModal> {/* Client Component: menangani tombol buka/tutup */}
      <ServerTaskList /> {/* Server Component: tetap 0 kB JS di server! */}
    </ClientModal>
  );
}`,
              language: "tsx",
              caption: "Pola Komposisi Props Children (Interleaving)"
            }
          ],
          comparisonTable: {
            headers: ["Dimensi / Fitur", "Server Component (RSC) ⚡", "Client Component ('use client') 🚀"],
            rows: [
              ["Tempat Eksekusi", "100% di Server (Node.js / Edge)", "Pre-render di Server + Hydration di Browser"],
              ["Ukuran JS Bundle", "0 kB (Zero Client Bundle Overhead)", "Sesuai ukuran kode komponen & pustaka (30-60 kB)"],
              ["Akses Database & Secrets", "✅ Langsung & Aman via process.env", "❌ DILARANG (Kredensial rahasia bisa bocor ke publik)"],
              ["State (useState / useEffect)", "❌ Tidak Didukung", "✅ Penuh & Responsif"],
              ["Event Listener (onClick, onChange)", "❌ Tidak Didukung", "✅ Penuh untuk Interaktivitas Pengguna"],
              ["Akses Browser APIs (window, storage)", "❌ Tidak Ada (Berjalan di Server)", "✅ Dapat Mengakses DOM & Web APIs"]
            ]
          },
          callout: {
            type: "tip",
            title: "Prinsip Desain: Pushing 'use client' to the Leaves (Daun Terluar)",
            text: "Jangan letakkan direktif 'use client' di file layout atau page utama. Buatlah halaman utama sebagai Server Component untuk data fetching, lalu pisahkan bagian interaktif kecil (seperti tombol toggle, modal pop-up, atau search input) ke dalam komponen Client tersendiri di folder components/."
          }
        },
        {
          title: "2. Anatomi Sistem Routing Next.js 16 App Router (File-System Based Routing)",
          badge: "Pilar 2: Navigasi & Struktur URL",
          content: "Next.js menggunakan hierarki folder di dalam direktori /src/app untuk mendefinisikan rute URL secara otomatis. Setiap folder merepresentasikan segmen URL, dan konvensi nama file khusus mengontrol perilaku tampilan, layout bersama, status loading, dan penanganan error.",
          subpoints: [
            {
              label: "Konvensi File Khusus (Special Files Hierarchy)",
              text: "App Router membaca struktur file khusus secara hierarkis per folder untuk merakit pengalaman navigasi halaman secara otomatis:",
              code: `src/app/
├── layout.tsx     # Shell bersama (Header/Sidebar, persistent state)
├── loading.tsx    # Fallback skeleton instan (React Suspense)
├── error.tsx      # Boundary penanganan crash runtime ('use client')
├── not-found.tsx  # Tampilan HTTP 404 kustom saat rute tidak ditemukan
└── page.tsx       # Tampilan konten unik untuk segmen URL ini`,
              language: "bash",
              caption: "Hierarki Berkas Khusus App Router"
            },
            {
              label: "Dynamic Routes & Parameter Asinkron Next.js 16",
              text: "Folder bernama [id] menangani parameter URL dinamis (misal /tasks/123). Pada Next.js 16, params adalah Promise asinkron yang wajib di-await sebelum nilainya dibaca:",
              code: `// src/app/tasks/[id]/page.tsx
export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ⚠️ Breaking Change Next.js 16: params wajib di-await!
  const { id } = await params;
  return <h1>Detail Tugas ID: #{id}</h1>;
}`,
              language: "tsx",
              caption: "Implementasi Async Params di Next.js 16"
            },
            {
              label: "Catch-all ([...slug]) & Optional Catch-all ([[...slug]])",
              text: "Gunakan tanda kurung siku tiga titik untuk menangani rute bersarang tak terbatas (seperti hierarki artikel dokumentasi atau kategori katalog):",
              code: `# Catch-all ([...slug]):
/app/docs/[...slug]/page.tsx   ➔ Menangkap /docs/a, /docs/a/b, /docs/a/b/c

# Optional Catch-all ([[...slug]]):
/app/shop/[[...slug]]/page.tsx  ➔ Menangkap /shop DAN /shop/kategori/sepatu`,
              language: "text",
              caption: "Pemetaan URL Catch-All Segments"
            },
            {
              label: "Route Groups '(namaFolder)' & Private Folders '_namaFolder'",
              text: "Atur struktur arsitektur folder kode Anda tanpa mengotori atau mengubah path URL publik pengguna:",
              code: `# Route Groups: Folder dalam tanda kurung diabaikan dari URL publik
src/app/(auth)/login/page.tsx       ➔ URL: /login (folder (auth) dilewati)
src/app/(dashboard)/tasks/page.tsx  ➔ URL: /tasks

# Private Folders: Awalan underscore dikecualikan dari routing sistem
src/app/_components/task-card.tsx   ➔ File internal (tidak bisa diakses browser)`,
              language: "text",
              caption: "Organisasi Berkas vs Path URL Publik"
            },
            {
              label: "Strategi Navigasi & Pengiriman Parameter/Query: <Link> vs useRouter() vs redirect()",
              text: "Next.js 16 menyediakan **3 mekanisme navigasi utama** dengan batas arsitektur, metode pengiriman parameter rute (`route params`), dan query string (`searchParams`) yang berbeda secara fundamental:\n\n" +
                "1. `<Link>` (Deklaratif & Link UI): Pilihan utama untuk **90% navigasi tautan antarmuka** (Navbar, Card, Sidebar). Mengunduh rute target secara asinkron saat elemen masuk ke viewport (**automatic prefetching**), sepenuhnya **ramah SEO** (dirender sebagai tag HTML native `<a>`), dan mendukung transmisi query string via **string template literals** maupun **Objek URL**.\n\n" +
                "2. `useRouter()` (Navigasi Programatik Client): Hook khusus Client Component (`'use client'`) untuk navigasi yang dipicu oleh **event non-anchor** (misal: submit form client, debounce input pencarian, dropdown filter, timer). Memungkinkan manipulasi query params dinamis tanpa *full page reload* via utilitas `URLSearchParams` bersama hook `usePathname()` dan `useSearchParams()`, lengkap dengan opsi `{ scroll: false }` agar posisi layar tidak melompat.\n\n" +
                "3. `redirect()` (Server-Side Navigation): Fungsi navigasi server yang **wajib digunakan** di Server Components, Server Actions (`'use server'`), atau Route Handlers. Mengirimkan respons **HTTP 307 (Temporary Redirect)** atau **303 (See Other)** langsung dari server sebelum payload HTML dikirimkan ke browser. Menjadi standar industri untuk **Server Auth Guards** (mencegah *Flash of Unauthorized Content* / FOUC) dan implementasi pola **Post-Redirect-Get (PRG)** pasca mutasi basis data berhasil.\n\n" +
                "4. Pembacaan Parameter & Query di Sisi Penerima (Breaking Change Next.js 16): Di Server Component (`page.tsx`), parameter dan query **WAJIB di-await secara asinkron**: `const { id } = await params;` dan `const { status, sort } = await searchParams;`. Sedangkan di Client Component, gunakan hook `useParams()` dan `useSearchParams()` yang **wajib dibungkus komponen `<Suspense>`** agar tidak merusak streaming SSR.",
              code: `// ============================================================================
// 1. PENGIRIMAN PARAMS & QUERY STRING DENGAN <Link> (Deklaratif)
// ============================================================================
import Link from "next/link";

export function ProjectNavLinks({ projectId }: { projectId: string }) {
  return (
    <div className="flex gap-4">
      {/* Opsi A: Format String Interpolation Langsung */}
      <Link href={\`/projects/\${projectId}/tasks?status=in_progress&sort=priority\`}>
        Tugas Aktif (String Literal)
      </Link>

      {/* Opsi B: Format Objek URL Bersih & Terstruktur */}
      <Link
        href={{
          pathname: \`/projects/\${projectId}/tasks\`,
          query: { status: "completed", sort: "deadline" },
        }}
      >
        Tugas Selesai (URL Object)
      </Link>
    </div>
  );
}

// ============================================================================
// 2. PENGIRIMAN & PEMBARUAN QUERY DENGAN useRouter() (Client Component)
// ============================================================================
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function TaskFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Memperbarui query parameter tanpa menghapus parameter URL yang sudah ada
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Navigasi programatik tanpa melompat ke atas halaman ({ scroll: false })
    router.push(\`\${pathname}?\${params.toString()}\`, { scroll: false });
  };

  return (
    <select onChange={(e) => handleFilterChange("status", e.target.value)}>
      <option value="all">Semua Status</option>
      <option value="in_progress">Sedang Dikerjakan</option>
      <option value="completed">Selesai</option>
    </select>
  );
}

// ============================================================================
// 3. SERVER-SIDE REDIRECT DENGAN redirect() (Server Actions & Auth Guards)
// ============================================================================
// src/actions/task-actions.ts ('use server')
import { redirect } from "next/navigation";

export async function createProjectTask(formData: FormData) {
  "use server";
  const projectId = formData.get("projectId") as string;
  const title = formData.get("title") as string;

  // 1. Eksekusi mutasi basis data...
  // await db.tasks.create({ projectId, title });

  // 2. Terapkan pola Post-Redirect-Get (PRG) dengan query notifikasi
  redirect(\`/projects/\${projectId}/tasks?status=all&toast=created_success\`);
}

// ============================================================================
// 4. PEMBACAAN PARAMS & QUERY DI NEXT.JS 16 SERVER COMPONENT (page.tsx)
// ============================================================================
// src/app/projects/[id]/tasks/page.tsx
export default async function ProjectTasksPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; sort?: string; toast?: string }>;
}) {
  // Breaking Change Next.js 16: WAJIB di-await secara asinkron!
  const { id } = await params;
  const { status = "all", sort = "newest", toast } = await searchParams;

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Proyek ID: {id}</h1>
      <p className="text-sm">Filter: {status} | Sort: {sort}</p>
      {toast && <div className="alert alert-success">Operasi Berhasil!</div>}
    </main>
  );
}`,
              language: "tsx",
              caption: "Sintaks Lengkap Pengiriman & Pembacaan Params/Query di Next.js 16"
            }
          ],
          comparisonTable: {
            headers: ["File Spesial", "Tipe Default", "Fungsi Utama & Perilaku Navigasi"],
            rows: [
              ["page.tsx", "Server Component", "Mendefinisikan UI unik yang dapat diakses publik pada path URL terkait."],
              ["layout.tsx", "Server Component", "Membungkus halaman anak (children). Mempertahankan state & tidak me-re-render saat navigasi."],
              ["loading.tsx", "Server Component", "Menampilkan skeleton/spinner instan menggunakan React Suspense saat page.tsx memproses data."],
              ["error.tsx", "Client Component ('use client')", "Menangkap runtime error pada segmen rute agar seluruh aplikasi tidak crash."],
              ["not-found.tsx", "Server Component", "UI fallback khusus saat fungsi notFound() dipanggil atau rute tidak terdaftar (HTTP 404)."],
              ["(group)/", "Folder Pengelompok", "Mengelompokkan rute secara logis tanpa menambahkan nama folder ke dalam path URL."]
            ]
          },
          callout: {
            type: "warning",
            title: "Breaking Change Next.js 16: Params & SearchParams adalah Asinkron!",
            text: "Pada Next.js 16, mengakses params dan searchParams secara langsung (misal: props.params.id) akan memicu runtime error. Anda WAJIB menggunakan 'await params' atau 'await searchParams' di dalam Server Components! Untuk Client Components, bungkus komponen yang menggunakan 'useSearchParams()' dengan <Suspense> agar tidak membatalkan streaming HTML dari server."
          }
        },
        {
          title: "3. Revolusi Shadcn UI: Filosofi Open Architecture, Radix Primitives & Tailwind CVA",
          badge: "Pilar 3: Modern UI Engineering",
          content: "Shadcn UI mendisrupsi paradigma library UI konvensional. Daripada mengunci developer ke dalam paket NPM tertutup yang sulit dimodifikasi (black-box), Shadcn menyalin kode sumber komponen TypeScript langsung ke dalam direktori proyek (@/components/ui/*). Ini memberikan 100% kepemilikan kode tanpa dependency lock-in.",
          subpoints: [
            {
              label: "Pilar 1: Radix UI Primitives (Headless Accessibility)",
              text: "Menyediakan logika antarmuka yang kompleks, navigasi keyboard (keyboard navigation), fokus manajemen (focus trap pada modal), dan kepatuhan standar WAI-ARIA kelas dunia tanpa menyertakan styling CSS kaku."
            },
            {
              label: "Pilar 2: Tailwind CSS & Semantic CSS Variables",
              text: "Styling diatur menggunakan utility classes dan CSS variables HSL (seperti bg-background, text-foreground, bg-primary). Tema Dark Mode dan Light Mode dapat berganti secara mulus tanpa penulisan style terpisah."
            },
            {
              label: "Pilar 3: CVA (Class Variance Authority) & Utilitas cn()",
              text: "CVA memungkinkan pembuatan varian komponen secara type-safe, sedangkan fungsi helper cn() menggabungkan clsx dan tailwind-merge untuk mencegah konflik class CSS:",
              code: `// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  // Otomatis menggabungkan class dan menyelesaikan konflik utilitas Tailwind
  return twMerge(clsx(inputs));
}`,
              language: "typescript",
              caption: "Utilitas cn() Pemersatu Class Tailwind"
            },
            {
              label: "Anatomi Folder Shadcn UI di Proyek",
              text: "Struktur berkas yang rapi memberikan kontrol dan kustomisasi 100% pada antarmuka aplikasi Anda:",
              code: `my-serverless-app/
├── components.json          # Konfigurasi skema & direktori alias Shadcn
├── src/
│   ├── components/ui/       # Komponen copy-paste (button.tsx, card.tsx, dll)
│   └── lib/utils.ts         # Fungsi helper cn() penggabung Tailwind class
└── tailwind.config.ts       # Definisi token tema warna & CSS variables`,
              language: "bash",
              caption: "Arsitektur Folder Shadcn UI"
            }
          ],
          comparisonTable: {
            headers: ["Karakteristik", "Library NPM Konvensional (MUI / AntD) 📦", "Arsitektur Shadcn UI 🚀"],
            rows: [
              ["Metode Distribusi", "Paket NPM ter-bundle di node_modules", "Scaffolding source code via CLI langsung ke src/components/ui/"],
              ["Kepemilikan Kode", "Tertutup (Black-box), sulit diubah", "100% Milik Anda, bebas diedit langsung di file .tsx"],
              ["Kustomisasi Desain", "Memerlukan override style / theme provider yang rumit", "Cukup ubah Tailwind utility class di kode komponen"],
              ["Ukuran Bundle", "Sering memuat kode komponen yang tidak terpakai", "Hanya menyertakan komponen yang Anda install via CLI"],
              ["Aksesibilitas (a11y)", "Bervariasi antar vendor", "Sempurna (Didukung Radix UI Primitives WAI-ARIA)"]
            ]
          },
          callout: {
            type: "info",
            title: "Standar Industri: Mengapa Perusahaan Modern Memilih Shadcn UI?",
            text: "Dengan kepemilikan kode penuh, tim rekayasa perangkat lunak tidak perlu menunggu update dari maintainer open-source jika ingin menambahkan fitur kustom atau memperbaiki bug internal."
          }
        },
        {
          title: "4. Strategi Clean Component Scaffolding & Komposisi Antarmuka Responsif",
          badge: "Pilar 4: Best Practices",
          content: "Membangun aplikasi web skala besar membutuhkan struktur komponen yang rapi dan modular. Memisahkan container logika backend dari elemen interaktif adalah kunci arsitektur Next.js 16 yang bersih dan mudah dirawat.",
          subpoints: [
            {
              label: "Pemisahan Container (RSC) vs Presentational Widget (Client)",
              text: "Terapkan prinsip separation of concerns agar komponen pengambilan data tetap aman di server dan widget interaktif tetap ringan di browser:",
              code: `// 1. Server Container: src/app/(dashboard)/tasks/page.tsx (0 kB JS bundle)
export default async function TasksPage() {
  const data = await getTasksFromSupabase();
  return <TaskFilterWidget initialData={data} />;
}

// 2. Client Widget: src/components/tasks/task-filter.tsx ('use client')
"use client";
export function TaskFilterWidget({ initialData }: Props) {
  const [filter, setFilter] = useState("all");
  return <div>{/* Tombol filter & event listener onClick */}</div>;
}`,
              language: "tsx",
              caption: "Arsitektur Server Container vs Client Widget"
            },
            {
              label: "Pemanfaatan Semantic CSS Tokens Shadcn",
              text: "Gunakan class semantic seperti text-muted-foreground untuk teks sekunder dan bg-card / border-border untuk kontainer kartu agar otomatis harmonis di mode gelap maupun terang:",
              code: `<Card className="bg-card border-border text-card-foreground shadow-sm">
  <p className="text-muted-foreground text-xs">Otomatis adaptif dark/light mode</p>
</Card>`,
              language: "tsx",
              caption: "Contoh Penggunaan Semantic Tokens"
            }
          ],
          callout: {
            type: "tip",
            title: "Tips AI Workflow: Menjaga Komponen Tetap Modular",
            text: "Saat meminta AI membuat tampilan dengan Shadcn UI, selalu instruksikan AI untuk membuat file terpisah antara Server Page utama dengan Client Interactive Components agar struktur kode tetap bersih."
          }
        }
      ]
    },
    references: [
      { title: "Next.js Server and Client Components", url: "https://nextjs.org/docs/app/building-your-application/rendering/server-components", source: "Next.js" },
      { title: "Next.js App Router File Conventions", url: "https://nextjs.org/docs/app/building-your-application/routing", source: "Next.js" },
      { title: "Shadcn UI Installation & Concepts", url: "https://ui.shadcn.com/docs/installation/next", source: "Shadcn UI" },
      { title: "Radix UI Primitives Philosophy", url: "https://www.radix-ui.com/primitives/docs/overview/introduction", source: "Radix UI" }
    ],
    lab: {
      prerequisites: ["Proyek Minggu 1 yang sudah berjalan di http://localhost:3000", "Node.js v20+ LTS", "Git workspace aktif"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Inisialisasi Shadcn UI di Proyek Next.js 16",
          code: `npx shadcn@latest init -d`,
          language: "bash",
          explanation: "Perintah ini otomatis mengonfigurasi file components.json, membuat direktori src/lib/utils.ts dengan utilitas cn(), dan menyuntikkan variabel CSS warna HSL ke dalam globals.css."
        },
        {
          stepNumber: 2,
          instruction: "Tambahkan Komponen Inti Shadcn UI yang Dibutuhkan",
          code: `npx shadcn@latest add button card badge input label separator tabs dialog`,
          language: "bash",
          explanation: "CLI akan menyalin kode TypeScript murni untuk masing-masing komponen ke dalam folder src/components/ui/. Komponen ini sepenuhnya menjadi milik Anda dan dapat diedit secara bebas."
        },
        {
          stepNumber: 3,
          instruction: "Buat Struktur Rute Dashboard Bersama (Route Groups & Nested Layout)",
          code: `// src/app/(dashboard)/layout.tsx (Server Component)
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-black text-lg tracking-tight">CloudTask Pro</span>
          <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <Link href="/tasks" className="hover:text-foreground transition-colors">Tugas</Link>
            <Link href="/analytics" className="hover:text-foreground transition-colors">Analitik</Link>
          </nav>
        </div>
        <ThemeToggle />
      </header>
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}`,
          language: "tsx",
          explanation: "Route group (dashboard) mengelompokkan halaman tanpa mengubah URL publik (URL tetap /tasks). File layout.tsx membungkus konten dan mempertahankan state saat berpindah halaman."
        },
        {
          stepNumber: 4,
          instruction: "Rakit Server Page dengan Komposisi Client Component",
          code: `// 1. Client Component: src/components/task-status-filter.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function TaskStatusFilter() {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="flex items-center gap-2">
      {["all", "pending", "completed"].map((status) => (
        <Button
          key={status}
          size="sm"
          variant={activeFilter === status ? "default" : "outline"}
          onClick={() => setActiveFilter(status)}
          className="capitalize text-xs"
        >
          {status}
        </Button>
      ))}
    </div>
  );
}

// 2. Server Component: src/app/(dashboard)/tasks/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskStatusFilter } from "@/components/task-status-filter";
import Link from "next/link";

export default async function TasksPage() {
  // Simulasi data fetch di server (0 KB JS ke browser!)
  const tasks = [
    { id: "1", title: "Setup Database PostgreSQL Supabase", status: "Selesai", xp: 150 },
    { id: "2", title: "Rancang Layout Dashboard dengan Shadcn", status: "Berjalan", xp: 200 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Daftar Tugas Serverless</h1>
          <p className="text-sm text-muted-foreground">Kelola progres tugas kuliah Anda secara real-time.</p>
        </div>
        <TaskStatusFilter />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <Link key={task.id} href={\`/tasks/\${task.id}\`}>
            <Card className="hover:border-primary/50 transition-all cursor-pointer">
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold">{task.title}</CardTitle>
                <Badge variant={task.status === "Selesai" ? "default" : "secondary"}>
                  {task.status}
                </Badge>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                Hadiah: +{task.xp} XP • Klik untuk melihat detail & rute dinamis
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}`,
          language: "tsx",
          explanation: "Perhatikan pemisahan tanggung jawab: Page utama adalah Server Component (data fetch cepat & aman), sedangkan TaskStatusFilter adalah Client Component terisolasi yang menangani event onClick dan hook useState."
        },
        {
          stepNumber: 5,
          instruction: "Buat Dynamic Route dengan Parameter Asinkron Next.js 16 & Loading Fallback",
          code: `// 1. Loading UI: src/app/(dashboard)/tasks/[id]/loading.tsx
export default function TaskDetailLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-1/3 bg-muted rounded-lg" />
      <div className="h-32 bg-muted rounded-2xl" />
    </div>
  );
}

// 2. Dynamic Page: src/app/(dashboard)/tasks/[id]/page.tsx
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // PENTING: Di Next.js 16, params adalah Promise asinkron
  const { id } = await params;

  if (id !== "1" && id !== "2") {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/tasks" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Tugas
      </Link>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">ID Tugas: #{id}</Badge>
            <Badge>Next.js 16 Async Params</Badge>
          </div>
          <CardTitle className="text-xl mt-2">Detail Modul Perkuliahan #{id}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground leading-relaxed">
          Halaman ini membuktikan cara kerja Dynamic Route [id] dengan async params dan streaming React Suspense otomatis via loading.tsx.
        </CardContent>
      </Card>
    </div>
  );
}`,
          language: "tsx",
          explanation: "File loading.tsx otomatis membungkus rute dengan React Suspense. Di Next.js 16, params wajib di-await sebelum membaca nilainya."
        }
      ],
      aiPromptTemplate: {
        role: "Senior Frontend UI/UX Engineer & Next.js 16 Specialist",
        prompt: `Bertindaklah sebagai Senior Frontend UI/UX Engineer & Next.js 16 Specialist.

Saya sedang membangun kerangka antarmuka (Dashboard & Shell UI) untuk aplikasi "The Serverless Odyssey" menggunakan Next.js 16 App Router, Tailwind CSS v4, dan Shadcn UI.

Instruksi Pengerjaan:
1. Periksa apakah Shadcn UI sudah terpasang (cek keberadaan berkas 'components.json'). Jika belum ada, jalankan perintah terminal berikut secara otomatis:
   npx -y shadcn@latest init -d
   npx -y shadcn@latest add button card badge input label separator

2. Setelah dependensi dan komponen siap, buatkan 4 berkas antarmuka modular yang saling terhubung:
   - Berkas 1: 'src/app/(dashboard)/layout.tsx' (Server Component) sebagai shell layout dashboard utama dengan header navigasi, judul "CloudTask Pro", navigasi link ke /tasks, dan ThemeToggle.
   - Berkas 2: 'src/app/(dashboard)/tasks/page.tsx' (Server Component) yang merender kartu metrik ringkasan tugas (Total, Berjalan, Selesai), pemanggil Client Component filter, dan grid daftar tugas statis dengan tautan link ke detail tugas.
   - Berkas 3: 'src/components/task-status-filter.tsx' (Client Component 'use client') yang menyediakan tombol tab filter status interaktif (Semua, Berjalan, Selesai) menggunakan hook useState.
   - Berkas 4: 'src/app/(dashboard)/tasks/[id]/page.tsx' (Server Component) untuk rute dinamis detail tugas dengan penanganan async params Next.js 16 dan tombol kembali ke /tasks.

Batasan Teknis Wajib:
- DILARANG menambahkan 'use client' di file page.tsx atau layout.tsx utama (React Server Components by default).
- Di Next.js 16, wajib menggunakan 'const { id } = await params;' karena params bersifat Promise asinkron.
- Gunakan semantic Tailwind tokens Shadcn (bg-background, text-muted-foreground, border-border, bg-card).
- Pastikan seluruh tipe TypeScript didefinisikan secara eksplisit dan bebas dari tipe any.
- Kode yang dihasilkan harus utuh, fungsional, dan siap pakai tanpa placeholder komentar singkatan.`,
        tip: "Formula prompt All-in-One ini otomatis menginisialisasi komponen Shadcn UI via CLI jika belum terpasang, lalu merakit 4 berkas modular yang menuntaskan 100% kriteria Definition of Done Misi Minggu 2."
      },
      warningZone: {
        title: "Zona Bahaya: Menjadikan Seluruh Halaman 'use client'!",
        desc: "Kesalahan paling fatal developer pemula adalah menaruh direktif 'use client' di baris teratas file page.tsx atau layout.tsx hanya karena ada 1 tombol interaktif. Tindakan ini merusak seluruh keunggulan Server Components (RSC) dan membengkakkan ukuran bundle JavaScript ke browser pengguna. Selalu isolasi 'use client' ke komponen terkecil di daun terluar (leaves)!"
      }
    },
    mission: {
      taskTitle: "Misi Minggu 2: Scaffolding Dashboard & Shell UI Proyek Akhir",
      taskDesc: "Rancang kerangka antarmuka (Wireframe & Shell UI) untuk Proyek Akhir Anda menggunakan Route Groups, Server & Client Components, serta komponen Shadcn UI yang responsif.",
      definitionOfDone: [
        "Shadcn UI terinisialisasi dan minimal 4 komponen terpasang (@/components/ui/*)",
        "Struktur rute menggunakan Route Group (dashboard) dengan layout.tsx bersama",
        "Halaman utama dashboard dibuat sebagai Server Component dengan pemisahan Client Component untuk interaktivitas",
        "Terdapat minimal 1 rute dinamis [id] dengan file loading.tsx skeleton",
        "Tampilan responsif di mobile & desktop serta mendukung Dark/Light mode"
      ],
      gitBranchTask: "git checkout -b feature/ui-scaffolding-shadcn"
    }
  },
  {
    id: 3,
    worldId: "world-1",
    worldTitle: "Dunia 1: Fondasi & Backend Serverless",
    weekNumber: 3,
    title: "Server Actions, React 19 Form Hooks & Validasi Data (Zod)",
    subtitle: "Mutasi data aman tanpa membuat API route manual, divalidasi dengan skema Zod dan dikelola dengan useActionState.",
    cpmk: "Mahasiswa mampu mengimplementasikan Server Actions ('use server') untuk mutasi data form, mengelola lifecycle state dengan React 19 useActionState, dan memvalidasi integritas data dengan Zod.",
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 250,
    concepts: {
      summary: "Server Actions merevolusi mutasi data di Next.js 16 dengan memungkinkan pemanggilan fungsi server langsung dari form JSX tanpa membuat file API endpoint manual di /api/*. Dipadukan dengan validasi skema Zod yang ketat dan hook terpadu React 19 useActionState, developer dapat membangun alur pengiriman formulir yang aman, bebas runtime crash, dan responsif secara instan.",
      points: [
        { title: "Direktif 'use server' & Eksekusi RPC", desc: "Mengeksekusi fungsi mutasi langsung di server Node.js/Edge melalui protokol RPC terenkripsi, menjaga logic dan database keys tetap tersembunyi dari peramban." },
        { title: "Pertahanan Input Berlapis dengan Zod", desc: "Memvalidasi seluruh input pengguna di server menggunakan schema.safeParse() untuk menjamin integritas tipe data dan mencegah payload anomali." },
        { title: "React 19 Form Lifecycle (useActionState)", desc: "Mengelola status loading pending, data return state, dan trigger formAction dalam 1 hook terpadu tanpa boilerplate useState manual." },
        { title: "Revalidasi Cache On-Demand (revalidatePath)", desc: "Memperbarui cache data server seketika setelah mutasi berhasil agar antarmuka pengguna tersinkronisasi tanpa reload halaman penuh." }
      ],
      diagramNote: "Browser Form JSX ➔ React 19 useActionState ➔ RPC POST (__rsc) ➔ Next.js 'use server' ➔ Zod safeParse() ➔ Supabase DB ➔ revalidatePath()",
      deepDiveSections: [
        {
          title: "1. Paradigma Mutasi Data Next.js 16: Server Actions vs API Routes Tradisional",
          badge: "Pilar 1: Arsitektur RPC Serverless",
          content: "Sebelum Server Actions, setiap mutasi data di aplikasi React membutuhkan pembuatan endpoint API terpisah (misal POST /api/tasks), penanganan parsing body JSON secara manual, dan pemanggilan fetch() dari client. Next.js 16 mengeliminasi kompleksitas ini melalui Remote Procedure Call (RPC) yang terintegrasi langsung dengan JSX form.",
          subpoints: [
            {
              label: "Direktif 'use server' & Eksekusi RPC Otomatis",
              text: "Menandai sebuah fungsi dengan direktif 'use server' menginstruksikan Next.js untuk membuat endpoint RPC POST internal dengan hash Action ID unik. Browser memanggil fungsi ini secara asinkron tanpa membocorkan kode implementasi ke bundle klien:",
              code: `// src/actions/tasks.ts
"use server";

import { revalidatePath } from "next/cache";

export async function createTaskAction(formData: FormData) {
  // 🔒 Eksekusi 100% aman di Server
  const title = formData.get("title");
  
  // Mutasi database langsung tanpa ekspos API key
  await db.tasks.create({ data: { title } });
  
  // Revalidasi cache halaman seketika
  revalidatePath("/tasks");
}`,
              language: "tsx",
              caption: "Deklarasi Server Action dengan 'use server'"
            },
            {
              label: "Pola Penempatan: Inline vs Berkas Terpisah (src/actions/*)",
              text: "Server Action dapat didefinisikan secara inline di dalam Server Component untuk mutasi cepat. Namun, untuk digunakan bersama Client Component ('use client') atau hook React 19, Server Action WAJIB ditempatkan pada berkas terpisah dengan 'use server' di baris paling atas:",
              code: `// ✅ REKOMENDASI: Berkas Terpisah (src/actions/tasks.ts)
"use server";
export async function updateTask(id: string, formData: FormData) {
  // Dapat diimpor oleh Server Component maupun Client Component
}

// ⚠️ INLINE: Hanya di Server Component (src/app/tasks/page.tsx)
export default function TasksPage() {
  async function inlineAction(formData: FormData) {
    "use server"; // Dilarang di Client Component!
  }
  return <form action={inlineAction}>...</form>;
}`,
              language: "tsx",
              caption: "Pola Penempatan Berkas Terpisah vs Inline"
            },
            {
              label: "Revalidasi Cache Instan (revalidatePath & revalidateTag)",
              text: "Setelah Server Action berhasil memodifikasi database, panggil revalidatePath() untuk membersihkan Data Cache dan Full Route Cache di server. Pengguna menerima data terbaru via Soft Navigation tanpa refresh peramban:",
              code: `import { revalidatePath, revalidateTag } from "next/cache";

export async function deleteTask(id: string) {
  "use server";
  await db.tasks.delete({ where: { id } });

  // 1. Revalidasi path spesifik:
  revalidatePath("/dashboard/tasks");

  // 2. Revalidasi berdasarkan cache tag:
  revalidateTag("user-tasks");
}`,
              language: "tsx",
              caption: "Purge Cache On-Demand dengan revalidatePath"
            }
          ],
          comparisonTable: {
            headers: ["Karakteristik", "API Route Tradisional (/api/*) 📦", "Server Actions ('use server') ⚡"],
            rows: [
              ["File Endpoint", "Wajib membuat file route.ts terpisah", "Cukup tulis fungsi TypeScript dengan 'use server'"],
              ["Metode Pemanggilan", "fetch('/api/tasks', { method: 'POST', body })", "Dilewatkan langsung ke prop action={formAction}"],
              ["Type Safety", "Rentan desinkronisasi tipe antara client & API", "100% Type-Safe dari input form hingga backend"],
              ["Revalidasi Cache", "Harus memanggil router.refresh() manual di client", "Otomatis di server via revalidatePath()"],
              ["Keamanan Secrets", "Bisa bocor jika endpoint publik tidak diproteksi", "Otomatis terisolasi di server tanpa endpoint publik terbuka"]
            ]
          },
          callout: {
            type: "tip",
            title: "Keamanan Database: Mengapa Server Actions Kebal dari Kebocoran Secrets?",
            text: "Kunci API rahasia (seperti SUPABASE_SERVICE_ROLE_KEY) hanya dibaca di dalam runtime server. Karena kode Server Action tidak pernah dikirim ke browser pengguna, risiko kebocoran kunci kredensial menjadi nol."
          }
        },
        {
          title: "2. Validasi Skema & Pertahanan Input Ketat dengan Zod",
          badge: "Pilar 2: Data Integrity & Security",
          content: "Validasi form di browser (HTML5 required, minlength) hanyalah untuk kenyamanan pengalaman pengguna (UX), bukan untuk keamanan. Pengguna jahat dapat dengan mudah mem-bypass form menggunakan Postman, Curl, atau script eksternal. Server Actions WAJIB memvalidasi ulang seluruh data menggunakan skema Zod.",
          subpoints: [
            {
              label: "Prinsip 'Never Trust Client Input' & schema.safeParse()",
              text: "Hindari penggunaan schema.parse() karena akan melempar unhandled exception saat data invalid. Selalu gunakan safeParse() yang mengembalikan objek diskriminatif { success: true, data } atau { success: false, error }:",
              code: `import { z } from "zod";

export const TaskSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(100),
  priority: z.enum(["low", "medium", "high"], {
    errorMap: () => ({ message: "Pilih prioritas yang valid" })
  }),
});

// Di dalam Server Action:
const result = TaskSchema.safeParse({
  title: formData.get("title"),
  priority: formData.get("priority"),
});

if (!result.success) {
  // Tangani error tanpa membuat server crash!
  return { success: false, errors: result.error.flatten().fieldErrors };
}`,
              language: "tsx",
              caption: "Validasi Defensif dengan safeParse Zod"
            },
            {
              label: "Transformasi Tipe Data (z.coerce) & Validasi Logika (.refine())",
              text: "FormData HTML selalu mengembalikan nilai bertipe string. Gunakan z.coerce untuk otomatis mengubah string ke number atau Date, dan .refine() untuk aturan validasi bisnis kustom:",
              code: `export const CreateProjectSchema = z.object({
  name: z.string().min(3),
  // ⚡ Otomatis mengonversi string "25" menjadi number 25:
  budget: z.coerce.number().positive("Budget harus lebih dari 0"),
  deadline: z.coerce.date(),
}).refine((data) => data.deadline > new Date(), {
  message: "Deadline harus tanggal di masa depan!",
  path: ["deadline"], // Tempelkan error ke field deadline
});`,
              language: "tsx",
              caption: "Type Coercion & Validasi Bisnis Refinement"
            },
            {
              label: "Format Error Ramah Pengguna (error.flatten().fieldErrors)",
              text: "Objek ZodError bawaan berbentuk array bersarang yang sulit dibaca komponen UI. Gunakan metode .flatten() untuk meratakannya menjadi dictionary namaField -> string[]:",
              code: `if (!result.success) {
  const { fieldErrors } = result.error.flatten();
  // Hasil: { title: ["Judul minimal 3 karakter"], budget: ["Budget harus > 0"] }
  return {
    success: false,
    message: "Validasi formulir gagal",
    errors: fieldErrors,
  };
}`,
              language: "tsx",
              caption: "Ekstraksi Dictionary Field Errors"
            }
          ],
          comparisonTable: {
            headers: ["Aspek Validasi", "Validasi Browser (HTML5) 🌐", "Validasi Skema Zod (Server) 🛡️"],
            rows: [
              ["Lokasi Eksekusi", "Browser pengguna (Client-side)", "Server Node.js/Edge (Server-side)"],
              ["Tingkat Keamanan", "Rendah (Dapat di-bypass lewat Inspect Element/Curl)", "Maksimal (Menjamin integritas database)"],
              ["Tipe Data", "Semua nilai diperlakukan sebagai string", "Type coercion kuat (Number, Boolean, Date, Enum)"],
              ["Logika Bisnis", "Terbatas pada regex dan atribut min/max", "Tak terbatas (.refine untuk cek ke database / cross-field)"],
              ["Tujuan Utama", "Memberikan feedback instan saat mengetik", "Mencegah injeksi dan kerusakan integritas data"]
            ]
          },
          callout: {
            type: "warning",
            title: "Peringatan Keamanan: Jangan Gunakan Tipe 'any' pada Payload Input!",
            text: "Mengabaikan validasi skema di Server Action dan langsung menyimpan input FormData ke database adalah celah keamanan kritis yang dapat merusak data atau memicu SQL injection."
          }
        },
        {
          title: "3. Ekosistem Hook Form React 19: useActionState, useFormStatus & useOptimistic",
          badge: "Pilar 3: Modern React 19 State",
          content: "React 19 memperkenalkan pembaruan revolusioner pada manajemen antarmuka formulir. Hook useActionState menyederhanakan pengelolaan loading state dan pesan error, useFormStatus meniadakan kebutuhan prop drilling, sedangkan useOptimistic memberikan ilusi responsivitas 0 milidetik.",
          subpoints: [
            {
              label: "Pengelolaan State Form Modern dengan useActionState",
              text: "Menggantikan hook usang useFormState dari react-dom. Hook useActionState diimpor langsung dari package 'react' dan mengembalikan [state, formAction, isPending]:",
              code: `// src/components/tasks/create-task-form.tsx ('use client')
"use client";

import { useActionState } from "react";
import { createTaskAction } from "@/actions/tasks";

export function CreateTaskForm() {
  // state: data return terakhir dari server
  // formAction: fungsi yang disematkan ke tag <form action={...}>
  // isPending: boolean true saat Server Action sedang berjalan
  const [state, formAction, isPending] = useActionState(createTaskAction, null);

  return (
    <form action={formAction}>
      <input name="title" disabled={isPending} />
      {state?.errors?.title && <p className="text-red-500">{state.errors.title[0]}</p>}
      <button disabled={isPending}>{isPending ? "Menyimpan..." : "Kirim"}</button>
    </form>
  );
}`,
              language: "tsx",
              caption: "Penerapan Hook useActionState di React 19"
            },
            {
              label: "Tombol Submit Sadar Status Form dengan useFormStatus",
              text: "Hook useFormStatus (dari 'react-dom') dipanggil di dalam komponen anak tag <form>. Tombol ini otomatis mengetahui apakah form induk sedang memproses submit tanpa perlu passing prop boolean:",
              code: `// src/components/ui/submit-button.tsx ('use client')
"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  // pending: true jika form induk sedang proses kirim
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Memproses..." : children}
    </Button>
  );
}`,
              language: "tsx",
              caption: "Komponen Tombol Mandiri dengan useFormStatus"
            },
            {
              label: "Pembaruan Antarmuka Cepat dengan useOptimistic",
              text: "Hook useOptimistic merender item baru seketika di layar sebelum server selesai menyimpan data. Jika server merespon gagal, antarmuka otomatis kembali ke data semula (*auto-rollback*):",
              code: `const [optimisticTasks, setOptimisticTasks] = useOptimistic(
  tasks,
  (currentTasks, newTask: Task) => [...currentTasks, { ...newTask, isPending: true }]
);

async function handleAction(formData: FormData) {
  const title = formData.get("title") as string;
  // ⚡ Render instan di UI (0ms delay):
  setOptimisticTasks({ id: "temp", title, status: "pending" });
  // Simpan permanen ke server:
  await createTaskAction(formData);
}`,
              language: "tsx",
              caption: "Pola Optimistic UI dengan useOptimistic"
            }
          ],
          comparisonTable: {
            headers: ["Fitur", "Pola Lama (React 18 / Next.js 14) 📦", "Pola Baru (React 19 / Next.js 16) 🚀"],
            rows: [
              ["Import Hook", "useFormState dari 'react-dom'", "useActionState dari 'react'"],
              ["Status Loading", "Harus membuat state const [isPending, startTransition]", "isPending otomatis dikembalikan dari useActionState"],
              ["Handling Pending", "Memerlukan pembungkus useTransition ganda", "Tersedia out-of-the-box pada tuple posisi ke-3"],
              ["UI Optimistic", "Memerlukan custom state reducer yang rumit", "Disediakan native via hook useOptimistic()"],
              ["Kompatibilitas", "Rentan hydration mismatch", "Terintegrasi penuh dengan Server Actions async"]
            ]
          },
          callout: {
            type: "warning",
            title: "Breaking Change React 19: Migrasi dari useFormState ke useActionState",
            text: "Pada React 19, hook 'useFormState' dari package 'react-dom' telah deprecated. Anda WAJIB menggunakan 'useActionState' yang diimpor langsung dari package 'react'."
          }
        },
        {
          title: "4. Arsitektur Produksi: Standarisasi ActionState<T> & Integrasi Shadcn Form",
          badge: "Pilar 4: Enterprise Production Standards",
          content: "Membangun aplikasi skala besar memerlukan konsistensi kontrak pengembalian data dari Server Actions. Menggunakan interface ActionState generik dan mengintegrasikannya dengan komponen Shadcn UI menghasilkan pengalaman form kelas enterprise.",
          subpoints: [
            {
              label: "Standarisasi Kontrak Respons: ActionState<T>",
              text: "Definisikan tipe generik terpusat agar seluruh Server Actions di aplikasi Anda memiliki struktur pengembalian pesan, status sukses, dan pesan error yang seragam:",
              code: `// src/types/actions.ts
export type ActionState<T = unknown> = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: T;
};

// Penggunaan di Server Action:
export async function addTask(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState<Task>> {
  // Selalu return objek yang sesuai dengan ActionState
  return { success: true, message: "Tugas disimpan!", data: newTask };
}`,
              language: "tsx",
              caption: "Tipe Generik Kontrak ActionState"
            },
            {
              label: "Integrasi Komponen Input & Feedback Error Shadcn UI",
              text: "Gabungkan komponen <Label>, <Input>, penanda error border merah, dan notifikasi sukses untuk antarmuka yang ramah pengguna:",
              code: `<div className="space-y-2">
  <Label htmlFor="title">Judul Tugas</Label>
  <Input
    id="title"
    name="title"
    className={state?.errors?.title ? "border-destructive focus-visible:ring-destructive" : ""}
  />
  {state?.errors?.title && (
    <p className="text-xs text-destructive font-medium">
      {state.errors.title[0]}
    </p>
  )}
</div>`,
              language: "tsx",
              caption: "Integrasi Input Shadcn dengan Feedback Validasi"
            }
          ],
          callout: {
            type: "tip",
            title: "Tips Workflow AI: Pola 3 Berkas Modular untuk Form Mutasi Data",
            text: "Saat membangun fitur mutasi data dengan bantuan AI, selalu bagi kode ke dalam 3 berkas terpisah: 1) Berkas skema validasi (schemas/task.ts), 2) Berkas Server Action ('use server' di actions/task.ts), dan 3) Komponen Client Form ('use client' di components/task-form.tsx)."
          }
        }
      ]
    },
    references: [
      { title: "Next.js Server Actions & Mutations", url: "https://nextjs.org/docs/app/building-your-application/data-mutation/server-actions-and-mutations", source: "Next.js" },
      { title: "React 19 useActionState Documentation", url: "https://react.dev/reference/react/useActionState", source: "React" },
      { title: "Zod: TypeScript-first Schema Validation", url: "https://zod.dev", source: "Zod" },
      { title: "Shadcn UI Form & Input Documentation", url: "https://ui.shadcn.com/docs/components/form", source: "Shadcn UI" }
    ],
    lab: {
      prerequisites: ["Proyek Minggu 2 yang telah berjalan di http://localhost:3000", "Komponen button, input, label Shadcn UI terpasang"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Instalasi Pustaka Zod untuk Skema Validasi",
          code: `npm install zod`,
          language: "bash",
          explanation: "Zod adalah pustaka validasi skema deklaratif berbasis TypeScript yang otomatis menghasilkan tipe data type-safe dari definisi skema Anda."
        },
        {
          stepNumber: 2,
          instruction: "Buat Definisi Skema Validasi & Tipe ActionState di src/lib/schemas.ts",
          code: `import { z } from "zod";

export const TaskSchema = z.object({
  title: z.string().min(3, "Judul tugas minimal harus 3 karakter").max(100),
  description: z.string().optional(),
});

export type TaskInput = z.infer<typeof TaskSchema>;

export type ActionState<T = unknown> = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: T;
};`,
          language: "typescript",
          explanation: "File ini mendefinisikan aturan validasi dan tipe data kontrak respons bersama yang akan digunakan oleh Server Action maupun Client Component."
        },
        {
          stepNumber: 3,
          instruction: "Buat Berkas Server Action di src/actions/tasks.ts",
          code: `"use server";

import { revalidatePath } from "next/cache";
import { TaskSchema, ActionState } from "@/lib/schemas";

export async function createTaskAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const validation = TaskSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Validasi formulir gagal. Periksa input Anda.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  // Simulasi mutasi database serverless (Supabase)
  console.log("Menyimpan tugas baru:", validation.data);

  revalidatePath("/tasks");

  return {
    success: true,
    message: "Tugas berhasil dibuat dan disimpan ke database!",
  };
}`,
          language: "typescript",
          explanation: "Fungsi ini dieksekusi murni di server ('use server'), memvalidasi data dengan safeParse(), dan merevalidasi cache halaman secara instan."
        },
        {
          stepNumber: 4,
          instruction: "Rakit Komponen Client Form dengan useActionState di src/components/tasks/create-task-form.tsx",
          code: `"use client";

import { useActionState } from "react";
import { createTaskAction } from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateTaskForm() {
  const [state, formAction, isPending] = useActionState(createTaskAction, null);

  return (
    <form action={formAction} className="space-y-4 max-w-md p-6 rounded-2xl border bg-card">
      <div className="space-y-2">
        <Label htmlFor="title">Judul Tugas</Label>
        <Input id="title" name="title" disabled={isPending} />
        {state?.errors?.title && (
          <p className="text-xs text-destructive">{state.errors.title[0]}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Menyimpan ke Server..." : "Tambah Tugas"}
      </Button>

      {state?.success && (
        <p className="text-xs text-emerald-600 font-medium">{state.message}</p>
      )}
    </form>
  );
}`,
          language: "tsx",
          explanation: "Komponen interaktif 'use client' menggunakan hook useActionState dari React 19 untuk menangani loading state pending dan feedback validasi secara otomatis."
        }
      ],
      aiPromptTemplate: {
        role: "Senior Full-Stack Architect & React 19 Specialist",
        prompt: `Bertindaklah sebagai Senior Full-Stack Architect & React 19 Specialist. 

Konteks Proyek:
Saya sedang membangun platform web full-stack modern menggunakan Next.js 16 (App Router), Supabase PostgreSQL, dan Shadcn UI untuk aplikasi [Sebutkan Tema Proyek Akhir Anda].

Tugas:
Buatkan modul mutasi data formulir entri data utama yang aman dan tervalidasi penuh menggunakan Server Actions dan Zod.

Batasan Ketat (Explicit Constraints):
1. DILARANG membuat API Route manual di /api/*. Wajib menggunakan Server Action dengan direktif 'use server'.
2. Wajib menggunakan hook useActionState dari package 'react' (bukan useFormState deprecated dari 'react-dom').
3. Validasi seluruh input FormData di server menggunakan schema.safeParse() dari Zod (tanpa tipe 'any').
4. Pisahkan kode secara modular ke dalam 3 berkas terpisah:
   - Berkas 1: src/lib/schemas/[entitas].ts (Definisi Zod Schema & interface ActionState<T>).
   - Berkas 2: src/actions/[entitas].ts ('use server' Server Action dengan safeParse dan revalidatePath).
   - Berkas 3: src/components/[entitas]/[entitas]-form.tsx ('use client' form dengan useActionState dan komponen Shadcn: Input, Label, Button, Alert).
5. Tampilkan status loading pending pada tombol submit dan pesan error validasi di bawah field input yang bermasalah.

Target Output Structure:
Sajikan 3 berkas kode lengkap yang siap pakai (*copy-ready*) dengan panduan penempatan file yang jelas.`,
        tip: "Pastikan menggunakan useActionState yang diimpor langsung dari 'react' agar kompatibel dengan React 19 dan Next.js 16."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 3: Form Entri Data Tervalidasi Zod & Server Actions",
      taskDesc: "Lanjutkan repositori Proyek Akhir Anda. Bangun form entri data utama pertama yang diproses menggunakan Server Actions ('use server'), divalidasi dengan Zod, dan dikelola oleh React 19 useActionState.",
      definitionOfDone: [
        "Skema validasi Zod terdefinisi dengan pesan error ramah pengguna di src/lib/schemas.ts",
        "Berkas Server Action di src/actions/* berhasil membaca FormData dan memvalidasi via safeParse()",
        "Komponen form menggunakan hook useActionState dari React 19 dengan penanganan isPending",
        "Pesan error validasi muncul secara inline di bawah input saat data tidak sesuai kriteria"
      ],
      gitBranchTask: "git checkout -b feature/server-actions-zod"
    }
  },
  {
    id: 4,
    worldId: "world-1",
    worldTitle: "Dunia 1: Fondasi & Backend Serverless",
    weekNumber: 4,
    title: "Database Relasional PostgreSQL & Supabase",
    subtitle: "Inisiasi Proyek Akhir resmi, merancang skema relasional 3 tabel di Supabase SQL Editor, dan mengonfigurasi klien Supabase SSR Next.js 16.",
    cpmk: "Mahasiswa mampu merancang skema relasi PostgreSQL (1:N, M:N), mengonfigurasi klien Supabase SSR Next.js 16 dengan async cookies, serta mengotomasi tipe TypeScript via Supabase Typegen.",
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 300,
    concepts: {
      summary: "Supabase menyediakan database PostgreSQL kelas enterprise terkelola penuh. Minggu ini menandai Kick-off Resmi Proyek Akhir: Mahasiswa merancang skema relasional 3 tabel inti, mengimplementasikan foreign key cascading, serta menghubungkan Next.js 16 dengan Supabase SSR via adapter async cookies.",
      points: [
        { title: "Relasi 1:N & Foreign Key Cascade", desc: "Menghubungkan tabel pengguna dengan tabel proyek menggunakan UUID sebagai primary key dan aturan ON DELETE CASCADE untuk mencegah data yatim (orphaned records)." },
        { title: "Relasi M:N & Junction Table", desc: "Memodelkan relasi banyak-ke-banyak (tugas dan label kategori) via pivot table dengan composite primary key (task_id, tag_id)." },
        { title: "Integritas Data & B-Tree Indexing", desc: "Penegakan aturan validasi level database (NOT NULL, UNIQUE, CHECK) serta indexing B-Tree O(log N) untuk optimasi kecepatan query." },
        { title: "Supabase SSR & Async Cookies (Next.js 16)", desc: "Adapter createServerClient dengan await cookies() memisahkan siklus hidup token autentikasi di lingkungan Server Component dan Server Actions secara aman." }
      ],
      diagramNote: "Next.js 16 (await cookies) ➔ @supabase/ssr ➔ Supabase Cloud (PostgreSQL 15 RLS Engine) ➔ 3-Tier Tables (Profiles ➔ Projects ➔ Tasks)",
      deepDiveSections: [
        {
          title: "1. Arsitektur Relasional PostgreSQL & Supabase SQL Engine",
          badge: "Pilar 1: Fondasi Relasional",
          content: "PostgreSQL adalah sistem database objek-relasional paling canggih di dunia. Supabase membungkus PostgreSQL murni dengan API realtime dan isolasi Row Level Security (RLS). Memahami perancangan kunci dan relasi tabel adalah fondasi mutlak sebelum menulis kode aplikasi.",
          subpoints: [
            {
              label: "UUID Primary Key (gen_random_uuid()) vs Serial ID",
              text: "Hindari penggunaan auto-increment integer (SERIAL 1, 2, 3...) karena rawan diserang peretas via teknik ID Enumeration dan berisiko tabrakan data (collision) pada arsitektur multi-region. Selalu gunakan UUID v4 128-bit yang dihasilkan secara kriptografis oleh PostgreSQL:",
              code: `-- 🔒 REKOMENDASI: UUID v4 Kriptografis
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ⚠️ ANTI-PATTERN: Serial ID (Mudah ditebak di URL /api/projects/101)
-- id SERIAL PRIMARY KEY`,
              language: "sql",
              caption: "Penerapan UUID v4 Kriptografis di PostgreSQL"
            },
            {
              label: "Relasi 1:N (Foreign Key & ON DELETE CASCADE)",
              text: "Relasi Satu-ke-Banyak (1:N) memodelkan satu entitas induk (misal: 1 User) yang memiliki banyak entitas anak (banyak Proyek). Gunakan klausa ON DELETE CASCADE agar saat akun pengguna dihapus, seluruh proyek miliknya otomatis dibersihkan oleh database tanpa meninggalkan orphaned records:",
              code: `CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  
  -- 🔗 Foreign Key ke tabel profiles dengan pembersihan otomatis
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);`,
              language: "sql",
              caption: "Relasi 1:N dengan Klausa ON DELETE CASCADE"
            },
            {
              label: "Relasi M:N (Junction / Pivot Table & Composite Primary Key)",
              text: "Relasi Banyak-ke-Banyak (M:N) menghubungkan dua entitas di mana 1 Tugas dapat memiliki banyak Tag, dan 1 Tag dapat ditempelkan ke banyak Tugas. Relasi ini WAJIB dipecah menggunakan tabel perantara (Junction Table) dengan Composite Primary Key:",
              code: `CREATE TABLE task_tags (
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- 🔒 Composite Primary Key: Mencegah duplikasi pasangan tag pada task yang sama
  PRIMARY KEY (task_id, tag_id)
);`,
              language: "sql",
              caption: "Junction Table M:N dengan Composite Primary Key"
            }
          ],
          comparisonTable: {
            headers: ["Karakteristik Kunci", "Auto-Increment Serial ID (1, 2, 3...) 📦", "UUID v4 gen_random_uuid() ⚡"],
            rows: [
              ["Keamanan URL", "Rentan serangan enumerasi (/users/1 ➔ /users/2)", "Kebal enumerasi (2^122 kombinasi acak kriptografis)"],
              ["Kerahasiaan Bisnis", "Membocorkan jumlah transaksi ke kompetitor", "Identitas acak tidak mencerminkan volume transaksi"],
              ["Generasi Klien", "Harus query ke server (SELECT nextval)", "Bisa dibuat di client / Edge sebelum dikirim ke DB"],
              ["Skalabilitas Cloud", "Rawan tabrakan ID saat merge database", "Zero Collision di seluruh node cloud global"]
            ]
          },
          callout: {
            type: "tip",
            title: "Prinsip Desain: Selalu Gunakan ON DELETE CASCADE untuk Data Anak",
            text: "Ketiadaan klausa ON DELETE CASCADE memaksa developer menulis kode pembersihan manual berulang kali di aplikasi. Menyerahkan tugas referensial ke database menjamin integritas data selalu konsisten dan atomik."
          }
        },
        {
          title: "2. Integritas Skema, Constraints & Indexing",
          badge: "Pilar 2: Optimasi & Pertahanan Database",
          content: "Validasi form di frontend atau server actions hanyalah garis pertahanan awal. Garis pertahanan paling kokoh yang tidak pernah bisa ditembus adalah integritas skema di dalam PostgreSQL itu sendiri melalui constraints dan indexing performa tinggi.",
          subpoints: [
            {
              label: "Integrity Constraints (NOT NULL, UNIQUE, CHECK)",
              text: "Gunakan constraint SQL untuk menolak anomali data di tingkat kernel database. Constraint CHECK memastikan logika bisnis esensial (seperti saldo tidak boleh minus atau enum status) ditegakkan secara absolut:",
              code: `CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  
  -- 🛡️ CHECK Constraint: Memastikan budget selalu positif
  budget NUMERIC(12, 2) NOT NULL CHECK (budget > 0),
  
  -- 🛡️ CHECK Constraint: Membatasi pilihan status tugas
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);`,
              language: "sql",
              caption: "Penegakan Aturan Bisnis via CHECK Constraints"
            },
            {
              label: "B-Tree Indexing untuk Akses Cepat (CREATE INDEX)",
              text: "Secara default, query WHERE pada kolom tanpa index akan memicu Sequential Scan (membaca jutaan baris satu per satu, O(N)). Memasang B-Tree Index mentransformasikan pencarian menjadi penelusuran pohon biner O(log N) yang 300x lebih cepat:",
              code: `-- ⚡ Buat B-Tree Index pada kolom Foreign Key dan filter pencarian:
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);`,
              language: "sql",
              caption: "Optimasi Query Database dengan B-Tree Index"
            },
            {
              label: "Otomasi Timestamp dengan PostgreSQL Triggers (updated_at)",
              text: "Jangan mengandalkan kode frontend untuk memperbarui kolom updated_at. Pasang fungsi trigger di PostgreSQL sehingga setiap operasi UPDATE di tabel otomatis menyetel updated_at ke waktu saat ini:",
              code: `-- 1. Buat fungsi trigger pembaruan timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Pasang trigger ke tabel projects
CREATE TRIGGER set_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();`,
              language: "sql",
              caption: "Otomasi updated_at via PostgreSQL Trigger"
            }
          ],
          comparisonTable: {
            headers: ["Metode Pencarian", "Sequential Scan (Tanpa Index) ⏳", "B-Tree Index (CREATE INDEX) ⚡"],
            rows: [
              ["Kompleksitas Waktu", "O(N) — Linear sebanding jumlah baris", "O(log N) — Sangat cepat dan konstan"],
              ["Kecepatan (100k Baris)", "200 ms – 500 ms (CPU intensive)", "0.5 ms – 2 ms (Instant Disk Seek)"],
              ["Konsumsi Compute", "Membaca seluruh blok memori database", "Hanya membaca 3 - 4 blok node pohon"],
              ["Kapan Wajib Dipakai", "Hanya pada tabel kecil (< 50 baris)", "Seluruh kolom foreign key, email, dan status filter"]
            ]
          },
          callout: {
            type: "warning",
            title: "Aturan Industri: Selalu Buat Index pada Kolom Foreign Key!",
            text: "PostgreSQL tidak otomatis membuat index pada kolom foreign key (hanya primary key yang diindeks otomatis). Jika Anda tidak membuat CREATE INDEX pada user_id, operasi JOIN akan lambat saat data membesar."
          }
        },
        {
          title: "3. Integrasi Next.js 16 SSR & Async Cookies",
          badge: "Pilar 3: Konektivitas Full-Stack",
          content: "Next.js 16 App Router memperkenalkan perubahan besar pada cara pembacaan cookies peramban. Paket resmi @supabase/ssr menyediakan pola adapter yang memisahkan otentikasi browser dan server secara elegan.",
          subpoints: [
            {
              label: "Arsitektur @supabase/ssr vs Legacy Auth Helpers",
              text: "Paket lama @supabase/auth-helpers-nextjs telah deprecated karena mengikat framework secara kaku. Paket modern @supabase/ssr menggunakan pola Adapter fleksibel yang hanya membutuhkan fungsi getAll() dan setAll() untuk mengelola token sesi:",
              code: `// Instalasi paket resmi terkini:
npm install @supabase/supabase-js @supabase/ssr`,
              language: "bash",
              caption: "Pemasangan Paket @supabase/ssr Resmi"
            },
            {
              label: "Breaking Change Next.js 16: await cookies() & Handler getAll() / setAll()",
              text: "Pada Next.js 16, fungsi cookies() dari 'next/headers' bertipe Promise asinkron dan WAJIB diawali dengan 'await cookies()'. Handler setAll() dibungkus try/catch agar Server Component yang berjalan secara streaming tidak melempar crash:",
              code: `// src/utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // ⚡ Breaking Change Next.js 16: Wajib di-await!
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Dipanggil dari Server Component (aman diabaikan)
          }
        },
      },
    }
  )
}`,
              language: "typescript",
              caption: "Utilitas Supabase Server dengan Async Cookies"
            },
            {
              label: "Pemisahan Client vs Server Supabase Client",
              text: "Gunakan createBrowserClient untuk Client Component interaktif (berjalan sebagai singleton di memori browser), dan createServerClient untuk Server Component dan Server Actions:",
              code: `// src/utils/supabase/client.ts ('use client')
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}`,
              language: "typescript",
              caption: "Utilitas Supabase Browser Client"
            }
          ],
          comparisonTable: {
            headers: ["Dimensi", "createBrowserClient (client.ts) 🌐", "createServerClient (server.ts) 🔒"],
            rows: [
              ["Lingkungan Eksekusi", "Browser Pengguna ('use client')", "Node.js / Edge Server (RSC & Server Actions)"],
              ["Lifecycle Objek", "Singleton (Dibuat 1x di memori browser)", "Per-Request Instance (Setiap HTTP request)"],
              ["Akses Cookies", "Membaca document.cookie peramban", "Membaca via await cookies() dari next/headers"],
              ["Fitur Utama", "Realtime WebSockets, OAuth login button", "Data fetching 0 kB JS, Server Actions mutation"]
            ]
          },
          callout: {
            type: "warning",
            title: "Peringatan Arsitektur: Dilarang Mengimpor server.ts di Client Component!",
            text: "Mengimpor createClient dari server.ts ke dalam berkas 'use client' akan memicu build error karena pustaka next/headers hanya tersedia di lingkungan server runtime."
          }
        },
        {
          title: "4. Kick-off Proyek Akhir & Kontrak Data Antar-Modul",
          badge: "Pilar 4: Blueprint Proyek Akhir",
          content: "Mulai Minggu 4, seluruh mahasiswa resmi menginisiasi repositori Proyek Akhir masing-masing. Membangun skema 3 tabel yang solid dan menghasilkan kontrak tipe TypeScript otomatis adalah langkah pertama menuju aplikasi full-stack kelas industri.",
          subpoints: [
            {
              label: "Skema Inti 3 Tabel Berelasi Proyek Akhir",
              text: "Proyek perkuliahan berpusat pada hierarki 3 tabel relasional bertingkat: profiles (terikat ke auth.users), projects (wadah kerja), dan tasks (item pekerjaan):",
              code: `-- Skema Inti Proyek Akhir (The Serverless Odyssey)
-- 1. profiles: Ekstensi data publik auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. projects: Entitas utama proyek perkuliahan
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. tasks: Item pekerjaan di dalam proyek
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);`,
              language: "sql",
              caption: "DDL 3 Tabel Berelasi Proyek Akhir"
            },
            {
              label: "Pemetaan Tipe TypeScript Otomatis (Supabase CLI Typegen)",
              text: "Jangan pernah menulis interface TypeScript secara manual untuk database. Gunakan Supabase CLI untuk men-generate tipe data otomatis langsung dari skema PostgreSQL Anda:",
              code: `# Jalankan di terminal untuk membuat kontrak tipe:
npx supabase gen types typescript --project-id <your-project-id> > src/types/database.types.ts

// Di kode TypeScript Next.js 16:
import { Database } from "@/types/database.types";
const supabase = createClient<Database>();
// ✨ Autocomplete kolom tabel aktif 100% dan bebas salah ketik!`,
              language: "bash",
              caption: "Generasi Tipe Data TypeScript Otomatis"
            }
          ],
          comparisonTable: {
            headers: ["Pendekatan Definisi Tipe", "Mengetik Manual (Manual Interfaces) ❌", "Supabase CLI Typegen 🚀"],
            rows: [
              ["Sinkronisasi Schema", "Mudah desinkronisasi saat kolom DB diubah", "Otomatis 100% sinkron dengan skema PostgreSQL"],
              ["Ketahanan Human Error", "Rentan salah ketik (typo) nama kolom", "Divalidasi langsung oleh TypeScript compiler"],
              ["Autocomplete IntelliSense", "Terbatas pada interface buatan sendiri", "Mencakup tipe Insert, Update, Row, dan Enums"],
              ["Efisiensi Pengembang", "Membuang waktu mengetik ulang DDL", "Selesai dalam 1 baris perintah CLI"]
            ]
          },
          callout: {
            type: "tip",
            title: "Aturan Proyek Bola Salju: Jaga Integritas Repositori!",
            text: "Skema 3 tabel yang dibuat pada pertemuan ini akan terus digunakan, diperluas dengan fitur autentikasi di Minggu 5, filter pencarian di Minggu 6, dan upload media di Minggu 7. Kerjakan skema ini dengan presisi!"
          }
        }
      ]
    },
    references: [
      { title: "Supabase PostgreSQL Database Docs", url: "https://supabase.com/docs/guides/database", source: "Supabase" },
      { title: "Supabase SSR Next.js Guide", url: "https://supabase.com/docs/guides/auth/server-side/nextjs", source: "Supabase" },
      { title: "PostgreSQL Constraints Documentation", url: "https://www.postgresql.org/docs/current/ddl-constraints.html", source: "PostgreSQL" },
      { title: "Supabase CLI Type Generation", url: "https://supabase.com/docs/guides/api/rest/generating-types", source: "Supabase CLI" }
    ],
    lab: {
      prerequisites: ["Akun Supabase siap & project baru dibuat", "Node.js v20+ LTS", "Repositori resmi Proyek Akhir aktif"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Instal SDK Supabase Resmi untuk Next.js 16 App Router",
          code: "npm install @supabase/supabase-js @supabase/ssr",
          language: "bash",
          explanation: "Paket @supabase/ssr adalah pustaka generasi terbaru yang menggantikan @supabase/auth-helpers-nextjs dan mendukung penuh async cookies di Next.js 16."
        },
        {
          stepNumber: 2,
          instruction: "Konfigurasi Utilitas Klien Server di src/utils/supabase/server.ts",
          code: `import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Dipanggil dari Server Component (aman diabaikan)
          }
        },
      },
    }
  )
}`,
          language: "typescript",
          explanation: "Perhatikan baris 'const cookieStore = await cookies()'. Pada Next.js 16, cookies() adalah Promise asinkron yang wajib di-await."
        },
        {
          stepNumber: 3,
          instruction: "Konfigurasi Utilitas Klien Browser di src/utils/supabase/client.ts",
          code: `import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}`,
          language: "typescript",
          explanation: "Fungsi ini digunakan di dalam Client Component ('use client') untuk operasi browser seperti interaktivitas tombol login atau channel realtime."
        },
        {
          stepNumber: 4,
          instruction: "Eksekusi Script SQL Skema 3 Tabel di Supabase SQL Editor",
          code: `-- Buka Dashboard Supabase -> SQL Editor -> Tempel Script Ini:
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  budget NUMERIC(12,2) DEFAULT 0 CHECK (budget >= 0),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Buat B-Tree Index untuk performa query cepat:
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);`,
          language: "sql",
          explanation: "Script SQL ini membangun fondasi 3 tabel relasional Proyek Akhir lengkap dengan UUID v4, relasi cascading, check constraints, dan B-Tree index."
        }
      ],
      aiPromptTemplate: {
        role: "Formula Prompt AI Teruji (C-R-E-T Framework)",
        prompt: `Bertindaklah sebagai Senior PostgreSQL Database Administrator & Supabase Specialist.

Saya sedang menginisiasi repositori Proyek Akhir perkuliahan "The Serverless Odyssey" menggunakan Next.js 16 (App Router), Tailwind CSS v4, dan Supabase PostgreSQL.

Tolong rancang skema SQL relasional PostgreSQL lengkap untuk tema aplikasi [SEBUTKAN TEMA APLIKASI ANDA, MISAL: APLIKASI MANAJEMEN EVENT KAMPUS].

Batasan teknis ketat yang WAJIB dipatuhi:
1. Buat minimal 3 tabel relasional yang saling terhubung dengan foreign key (1:N atau M:N).
2. Gunakan UUID v4 (gen_random_uuid()) sebagai Primary Key untuk seluruh tabel (dilarang menggunakan auto-increment serial integer).
3. Terapkan klausa ON DELETE CASCADE pada setiap Foreign Key untuk mencegah orphaned records.
4. Tambahkan CHECK constraints untuk validasi logika bisnis (misal: nominal > 0 atau status enum) dan NOT NULL pada kolom esensial.
5. Buat B-Tree index (CREATE INDEX) pada seluruh kolom foreign key dan kolom yang sering dicari.
6. Sertakan fungsi trigger PostgreSQL untuk mengotomasi pembaruan kolom updated_at pada tabel utama.

Target output: Berikan script SQL murni yang siap dieksekusi di Supabase SQL Editor beserta penjelasan relasi antar-tabelnya.`,
        tip: "Salin formula C-R-E-T ini ke AI coding assistant pilihan Anda untuk merancang skema database PostgreSQL proyek akhir dengan standar industri."
      },
      warningZone: {
        title: "Zona Bahaya: Menghapus Tabel Tanpa Backup di Supabase!",
        desc: "Perintah DROP TABLE CASCADE akan menghapus seluruh data dan tabel yang berelasi secara permanen. Selalu lakukan perancangan skema secara hati-hati di SQL Editor sebelum memasukkan data nyata."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 4: Inisiasi Repositori Final & Migrasi Database Relasional",
      taskDesc: "Inisiasi repositori resmi Proyek Akhir Anda, amankan kredensial Supabase di .env.local, dan jalankan migrasi 3 tabel relasional di Supabase SQL Editor.",
      definitionOfDone: [
        "Langkah 1: Masuk ke branch fitur baru ('git checkout -b feature/supabase-database-schema')",
        "Langkah 2: Konfigurasi utilitas Supabase SSR di src/utils/supabase/server.ts dan client.ts",
        "Langkah 3: Eksekusi script DDL 3 tabel relasional di Supabase SQL Editor dan verifikasi di Table Editor",
        "Langkah 4: Simpan commit dan gabungkan branch fitur ke main ('git merge feature/supabase-database-schema')"
      ],
      gitBranchTask: "git checkout -b feature/supabase-database-schema"
    }
  },
  {
    id: 5,
    worldId: "world-1",
    worldTitle: "Dunia 1: Fondasi & Backend Serverless",
    weekNumber: 5,
    title: "Autentikasi & Otorisasi Pengguna (GitHub OAuth)",
    subtitle: "Implementasi sistem login aman, integrasi GitHub OAuth, dan proteksi rute dengan Middleware.",
    cpmk: "Mahasiswa mampu mengimplementasikan alur login/register via Supabase Auth serta memproteksi rute privat dengan Next.js Middleware.",
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 350,
    concepts: {
      summary: "Autentikasi mengidentifikasi siapa pengguna, sedangkan Otorisasi menentukan apa yang boleh dilakukan pengguna tersebut.",
      points: [
        { title: "OAuth 2.0 Flow with GitHub", desc: "Pengguna login menggunakan akun GitHub mereka tanpa perlu membagikan kata sandi ke aplikasi kita." },
        { title: "Next.js Middleware Interceptor", desc: "Memeriksa token sesi pada setiap request sebelum halaman dirender. Jika belum login, redirect otomatis ke /login." }
      ]
    },
    references: [
      { title: "Supabase Next.js Auth Guide", url: "https://supabase.com/docs/guides/auth/server-side/nextjs", source: "Supabase" },
      { title: "GitHub OAuth Apps Configuration", url: "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app", source: "GitHub" }
    ],
    lab: {
      prerequisites: ["Supabase Client siap di Minggu 4"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Buat Middleware penangan sesi di src/middleware.ts",
          code: `import { type NextRequest } from 'next/request'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}`,
          language: "typescript"
        }
      ],
      aiPromptTemplate: {
        role: "Security Engineer",
        prompt: "Buatkan Server Action untuk login menggunakan Supabase Auth OAuth provider GitHub. Sertakan fungsi redirect ke callback URL yang tepat di Next.js App Router.",
        tip: "Pastikan callback URL diizinkan di tab Authentication -> URL Configuration pada dashboard Supabase."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 5: Implementasi Sistem Login Proyek",
      taskDesc: "Pasang fitur login/register di Proyek Akhir Anda dan proteksi halaman dashboard sehingga hanya bisa diakses user yang sudah login.",
      definitionOfDone: [
        "Halaman /login berfungsi dan berhasil mengarahkan ke dashboard setelah autentikasi",
        "Middleware berhasil menendang pengguna yang belum login jika mencoba mengakses rute privat",
        "Terdapat tombol Logout yang membersihkan sesi pengguna"
      ],
      gitBranchTask: "git checkout -b feature/auth-and-middleware"
    }
  },
  {
    id: 6,
    worldId: "world-1",
    worldTitle: "Dunia 1: Fondasi & Backend Serverless",
    weekNumber: 6,
    title: "Integrasi CRUD & URL as State (Filter & Pagination)",
    subtitle: "Operasi database menyeluruh, sinkronisasi state via URL Search Params untuk filter dan pencarian.",
    cpmk: "Mahasiswa mampu membuat operasi Create, Read, Update, Delete secara end-to-end serta mengelola state pencarian melalui URL parameters.",
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 350,
    concepts: {
      summary: "Menyimpan state pencarian dan pagination di URL (?query=...&page=1) membuat halaman dapat di-bookmark dan dibagikan secara instan tanpa kehilangan konteks.",
      points: [
        { title: "End-to-End CRUD", desc: "Membaca data langsung di Server Component (fetch instan) dan memutasi data via Server Actions dengan revalidatePath()." },
        { title: "Async Page Props (Next.js 16)", desc: "Di Next.js 16, props 'params' dan 'searchParams' bertipe Promise: const { query } = await searchParams; wajib di-await sebelum difilter ke query database." }
      ]
    },
    references: [
      { title: "Next.js Revalidating Data", url: "https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#revalidating-data", source: "Next.js" },
      { title: "Supabase JS Client Queries", url: "https://supabase.com/docs/reference/javascript/select", source: "Supabase" }
    ],
    lab: {
      prerequisites: ["Tabel Supabase & Auth aktif"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Buat fungsi Server Action untuk create dan delete data dengan revalidasi",
          code: `import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function deleteTask(id: string) {
  const supabase = await createClient()
  await supabase.from('tasks').delete().eq('id', id)
  revalidatePath('/dashboard')
}`,
          language: "typescript"
        }
      ],
      aiPromptTemplate: {
        role: "Full-Stack Specialist",
        prompt: "Buatkan komponen pencarian instan (Search Bar) di Next.js App Router yang mengubah query parameter URL (?search=...) menggunakan useRouter dan usePathname dengan debounce 300ms.",
        tip: "Gunakan library use-debounce untuk mencegah pemanggilan berlebihan saat user mengetik."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 6: Fitur CRUD & Filter Lengkap",
      taskDesc: "Lengkapi aplikasi Proyek Akhir Anda dengan alur Create, Read, Update, Delete dan fitur filter/pencarian data.",
      definitionOfDone: [
        "Data dapat ditambahkan dan dihapus secara langsung dari antarmuka web",
        "Fungsi revalidatePath memperbarui tampilan data tanpa reload halaman",
        "Fitur filter atau pencarian bekerja berdasarkan URL query parameter"
      ],
      gitBranchTask: "git checkout -b feature/crud-url-state"
    }
  },
  {
    id: 7,
    worldId: "world-1",
    worldTitle: "Dunia 1: Fondasi & Backend Serverless",
    weekNumber: 7,
    title: "Advanced UI/UX 1: Animasi & Framer Motion",
    subtitle: "Menghidupkan antarmuka web dengan animasi transisi halaman, micro-interactions, dan layout animations.",
    cpmk: "Mahasiswa mampu mengintegrasikan pustaka Framer Motion untuk menghasilkan pengalaman visual yang responsif, dinamis, dan halus.",
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 400,
    concepts: {
      summary: "Micro-animations meningkatkan persepsi performa aplikasi dan memberikan umpan balik instan atas tindakan pengguna.",
      points: [
        { title: "AnimatePresence & Layout Animations", desc: "Menghasilkan transisi mulus saat elemen DOM masuk atau dihapus dari layar." },
        { title: "Spring Physics vs Ease", desc: "Animasi berbasis fisika pegas (spring) terasa jauh lebih alami dibanding transisi linier CSS biasa." }
      ]
    },
    references: [
      { title: "Framer Motion Documentation", url: "https://www.framer.com/motion/", source: "Framer Motion" }
    ],
    lab: {
      prerequisites: ["Framer Motion terinstal"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Instal paket Framer Motion",
          code: "npm install framer-motion",
          language: "bash"
        }
      ],
      aiPromptTemplate: {
        role: "Creative Frontend Developer",
        prompt: "Buatkan komponen modal konfirmasi hapus data yang muncul dengan animasi spring scale & fade-in menggunakan Framer Motion (AnimatePresence) di Next.js.",
        tip: "Pastikan komponen yang menggunakan motion.div diberi deklarasi 'use client'."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 7: Polish UI Menjelang UTS",
      taskDesc: "Terapkan animasi transisi pada form, modal, dan list data di Proyek Akhir Anda sebelum presentasi Milestone 1 UTS.",
      definitionOfDone: [
        "Terdapat animasi hover/tap pada tombol aksi utama",
        "List data muncul dengan efek stagger/fade-in yang halus",
        "Aplikasi bersih dari error console dan siap dipresentasikan"
      ],
      gitBranchTask: "git checkout -b feature/framer-motion-polish"
    }
  },

  // ==================== BOSS FIGHT 1: UTS (M8) ====================
  {
    id: 8,
    worldId: "boss-1",
    worldTitle: "Boss Fight 1: UTS Milestone 1",
    weekNumber: 8,
    title: "BOSS FIGHT 1: UTS – Prototype Pitching & Code Review",
    subtitle: "Ujian Tengah Semester: Demonstrasi langsung aplikasi MVP yang sudah terintegrasi Auth dan Database.",
    cpmk: "Mahasiswa mampu mempresentasikan fungsionalitas MVP Proyek Akhir, mempertanggungjawabkan arsitektur kode, serta menerima peer review.",
    duration: "Sesi Ujian / Pitching Kelas",
    xp: 500,
    concepts: {
      summary: "Evaluasi Milestone 1 menguji apakah fondasi aplikasi Anda sudah kokoh (Struktur Folder, Skema Database, Autentikasi, dan CRUD).",
      points: [
        { title: "Kriteria Evaluasi UTS", desc: "Kelengkapan skema relasi database (3 tabel), integrasi login, operasi CRUD, dan kualitas UI/UX." },
        { title: "Git Milestone Tagging", desc: "Membuat tag rilis di GitHub untuk mengunci versi kode saat evaluasi UTS." }
      ]
    },
    references: [
      { title: "Git Tagging Guide", url: "https://git-scm.com/book/en/v2/Git-Basics-Tagging", source: "Git SCM" }
    ],
    lab: {
      prerequisites: ["Semua misi Minggu 1-7 selesai"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Buat Git Tag rilis v0.5.0-uts untuk penandaan milestone",
          code: "git tag -a v0.5.0-uts -m \"Release Milestone 1 UTS Submission\"\ngit push origin v0.5.0-uts",
          language: "bash"
        }
      ],
      aiPromptTemplate: {
        role: "Lead Code Reviewer",
        prompt: "Review struktur kode saya berikut untuk memastikan tidak ada celah keamanan dasar atau kebocoran kredensial sebelum presentasi UTS.",
        tip: "Pastikan tidak ada console.log sensitif yang tertinggal di kode Anda."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 8: Live Demo & Submission UTS",
      taskDesc: "Presentasikan aplikasi MVP Anda di depan kelas dan kumpulkan link repository GitHub ber-tag v0.5.0-uts.",
      definitionOfDone: [
        "Aplikasi dapat didemokan tanpa crash fatal",
        "Sistem Login dan CRUD berjalan lancar",
        "Tag rilis v0.5.0-uts terlihat di halaman Releases GitHub"
      ],
      gitBranchTask: "git checkout -b release/uts-milestone-1"
    }
  },

  // ==================== DUNIA 2: RICH UI, MEDIA & REALTIME (M9 - M15) ====================
  {
    id: 9,
    worldId: "world-2",
    worldTitle: "Dunia 2: Rich UI, Media & Real-time",
    weekNumber: 9,
    title: "Advanced UI/UX 2: Drag and Drop (Kanban Board)",
    subtitle: "Membangun papan interaktif drag and drop dengan @dnd-kit dan sinkronisasi urutan state ke Supabase.",
    cpmk: "Mahasiswa mampu mengimplementasikan pustaka @dnd-kit untuk interaksi reordering (Drag and Drop) dengan Optimistic UI.",
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 450,
    concepts: {
      summary: "Interaksi Drag & Drop (DnD) menuntut pembaruan UI secara instan (Optimistic Updates) sebelum server selesai memproses perubahan urutan di database.",
      points: [
        { title: "@dnd-kit Architecture", desc: "Library modular berbasis sensor sentuh/mouse yang ringan dan mudah diakses (accessible)." },
        { title: "Optimistic State Updates", desc: "Mengubah urutan kartu di layar secara instan (useOptimistic) sembari mengirim request perubahan posisi ke Postgres di latar belakang." }
      ]
    },
    references: [
      { title: "@dnd-kit Core Documentation", url: "https://docs.dndkit.com/", source: "DND Kit" },
      { title: "React useOptimistic Hook", url: "https://react.dev/reference/react/useOptimistic", source: "React Official" }
    ],
    lab: {
      prerequisites: ["Proyek pasca-UTS aktif"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Instal modul @dnd-kit yang dibutuhkan",
          code: "npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities",
          language: "bash"
        }
      ],
      aiPromptTemplate: {
        role: "Senior React Developer",
        prompt: "Buatkan komponen Sortable Kanban Column menggunakan @dnd-kit/sortable di Next.js App Router (Client Component). Sertakan handler onDragEnd yang mengembalikan urutan array baru.",
        tip: "Gunakan arrayMove utility dari @dnd-kit/sortable untuk menghitung index baru secara presisi."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 9: Integrasi Drag and Drop",
      taskDesc: "Tambahkan fitur Drag and Drop untuk mengurutkan atau memindahkan item antar kolom di Proyek Akhir Anda.",
      definitionOfDone: [
        "Elemen dapat di-drag dan di-drop secara halus tanpa glitch visual",
        "Urutan baru tersimpan ke kolom order/position di database Supabase"
      ],
      gitBranchTask: "git checkout -b feature/dnd-kanban-board"
    }
  },
  {
    id: 10,
    worldId: "world-2",
    worldTitle: "Dunia 2: Rich UI, Media & Real-time",
    weekNumber: 10,
    title: "Manajemen Media & Aset dengan Cloudinary",
    subtitle: "Unggah gambar langsung dari klien, transformasi cerdas berbasis AI, dan optimasi CDN.",
    cpmk: "Mahasiswa mampu mengintegrasikan Cloudinary (next-cloudinary) untuk upload widget, kompresi otomatis, dan transformasi gambar.",
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 450,
    concepts: {
      summary: "Menyimpan gambar langsung di database adalah praktik buruk. Cloudinary bertindak sebagai CDN dan media server khusus yang mengompres gambar otomatis menjadi format WebP/AVIF.",
      points: [
        { title: "Direct Upload Widget", desc: "Mengunggah gambar langsung dari browser ke Cloudinary tanpa membebani memori serverless Next.js." },
        { title: "Dynamic Transformations", desc: "Mengubah ukuran, memotong (crop) berbasis AI deteksi wajah, dan efek gambar langsung melalui URL." }
      ]
    },
    references: [
      { title: "Next Cloudinary Official Docs", url: "https://next-cloudinary.spacejelly.dev/", source: "Cloudinary" },
      { title: "Cloudinary Programmable Media API", url: "https://cloudinary.com/documentation", source: "Cloudinary" }
    ],
    lab: {
      prerequisites: ["Akun Cloudinary siap", "Cloud Name & Upload Preset terkonfigurasi"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Instal pustaka next-cloudinary",
          code: "npm install next-cloudinary",
          language: "bash"
        },
        {
          stepNumber: 2,
          instruction: "Konfigurasi next.config.ts untuk domain remote Cloudinary",
          code: `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;`,
          language: "typescript",
          explanation: "Next.js 16 mewajibkan konfigurasi remotePatterns di next.config.ts agar komponen gambar dapat merender aset dari domain Cloudinary secara aman."
        },
        {
          stepNumber: 3,
          instruction: "Tambahkan kredensial Cloud Name di .env.local",
          code: "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=\"your-cloud-name\"",
          language: "bash"
        }
      ],
      aiPromptTemplate: {
        role: "Media Pipeline Specialist",
        prompt: "Tunjukkan cara mengintegrasikan <CldUploadWidget> dari next-cloudinary pada Next.js 16 App Router (React 19) dan menyimpan secure_url hasil upload ke form state sebelum dikirim ke Server Action.",
        tip: "Pastikan membuat Unsigned Upload Preset di console Cloudinary dan tentukan event onSuccess={(result) => ...}."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 10: Fitur Unggah Gambar Proyek",
      taskDesc: "Pasang fitur upload gambar (misal: Avatar User, Foto Produk, atau Cover Proyek) yang diproses via Cloudinary.",
      definitionOfDone: [
        "Upload widget Cloudinary terbuka dan berhasil mengunggah file gambar",
        "URL gambar Cloudinary tersimpan di kolom database Supabase",
        "Gambar dirender menggunakan komponen <CldImage> yang teroptimasi"
      ],
      gitBranchTask: "git checkout -b feature/cloudinary-media-upload"
    }
  },
  {
    id: 11,
    worldId: "world-2",
    worldTitle: "Dunia 2: Rich UI, Media & Real-time",
    weekNumber: 11,
    title: "Supabase Real-time (WebSocket Collaboration)",
    subtitle: "Sinkronisasi data multi-pengguna secara langsung tanpa reload halaman menggunakan Postgres Changes Listener.",
    cpmk: "Mahasiswa mampu memanfaatkan protokol WebSocket Supabase Realtime untuk mendeteksi perubahan database secara instan.",
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 500,
    concepts: {
      summary: "Supabase Realtime memanfaatkan WebSocket untuk mem-broadcast setiap event INSERT, UPDATE, atau DELETE di database Postgres ke semua browser klien yang sedang aktif.",
      points: [
        { title: "Postgres Changes Subscription", desc: "Mendengarkan event spesifik pada suatu tabel (misal: ada komentar baru masuk)." },
        { title: "Presence & Broadcast", desc: "Mendeteksi siapa saja pengguna yang sedang online di halaman yang sama secara real-time." }
      ]
    },
    references: [
      { title: "Supabase Realtime Guide", url: "https://supabase.com/docs/guides/realtime", source: "Supabase" },
      { title: "Supabase Realtime React Hook Recipes", url: "https://supabase.com/docs/guides/realtime/subscribing-to-database-changes", source: "Supabase" }
    ],
    lab: {
      prerequisites: ["Tabel Supabase sudah diaktifkan Realtime-nya di dashboard"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Buat Client Hook untuk mendengarkan perubahan data real-time",
          code: `import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export function useRealtimeTasks(onUpdate: () => void) {
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('realtime-tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        onUpdate()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, onUpdate])
}`,
          language: "typescript"
        }
      ],
      aiPromptTemplate: {
        role: "Realtime Systems Engineer",
        prompt: "Buatkan custom hook React di Next.js untuk mendengarkan event INSERT pada tabel 'comments' di Supabase dan menambahkan item baru ke state lokal secara instan.",
        tip: "Jangan lupa fungsi cleanup supabase.removeChannel(channel) di return useEffect untuk mencegah memory leak."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 11: Fitur Kolaborasi Real-time",
      taskDesc: "Pasang listener real-time di Proyek Akhir Anda sehingga perubahan data oleh User A langsung terlihat oleh User B tanpa refresh.",
      definitionOfDone: [
        "Fitur Realtime aktif pada tabel target di Dashboard Supabase",
        "Dua tab browser berbeda menunjukkan sinkronisasi data seketika saat data ditambah atau diubah"
      ],
      gitBranchTask: "git checkout -b feature/supabase-realtime"
    }
  },
  {
    id: 12,
    worldId: "world-2",
    worldTitle: "Dunia 2: Rich UI, Media & Real-time",
    weekNumber: 12,
    title: "Keamanan Database: Row Level Security (RLS)",
    subtitle: "Mengamankan akses data langsung di level database engine menggunakan PostgreSQL Policies.",
    cpmk: "Mahasiswa mampu merancang dan menguji kebijakan Row Level Security (RLS) di Supabase untuk mengisolasi data antar pengguna.",
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 500,
    concepts: {
      summary: "RLS adalah benteng pertahanan terkuat. Tanpa RLS, siapa pun yang memiliki Anon Key bisa membaca/menghapus seluruh tabel Anda melalui API.",
      points: [
        { title: "auth.uid() Function", desc: "Fungsi bawaan Postgres yang mengekstrak ID pengguna yang sedang login dari token JWT." },
        { title: "Granular CRUD Policies", desc: "Membedakan hak akses: Publik boleh SELECT, tetapi hanya pemilik (user_id = auth.uid()) yang boleh UPDATE dan DELETE." }
      ]
    },
    references: [
      { title: "Supabase Row Level Security Guide", url: "https://supabase.com/docs/guides/database/postgres/row-level-security", source: "Supabase" }
    ],
    lab: {
      prerequisites: ["Tabel Supabase dengan kolom user_id bertipe UUID"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Aktifkan RLS dan buat policy keamanan di SQL Editor Supabase",
          code: `-- 1. Aktifkan RLS pada tabel
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 2. Kebijakan: User hanya boleh melihat datanya sendiri
CREATE POLICY "Users can view their own tasks"
ON tasks FOR SELECT
USING (auth.uid() = user_id);

-- 3. Kebijakan: User hanya boleh menambah data miliknya sendiri
CREATE POLICY "Users can insert their own tasks"
ON tasks FOR INSERT
WITH CHECK (auth.uid() = user_id);`,
          language: "sql"
        }
      ],
      aiPromptTemplate: {
        role: "Database Security Auditor",
        prompt: "Buatkan kebijakan Row Level Security (RLS) PostgreSQL lengkap (SELECT, INSERT, UPDATE, DELETE) untuk tabel [NAMA TABEL] di Supabase, di mana setiap record hanya dapat dimanipulasi oleh pemilik kolom user_id.",
        tip: "Uji coba selalu dengan 2 akun berbeda untuk memastikan User A tidak bisa menghapus data User B."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 12: Audit & Penerapan RLS Penuh",
      taskDesc: "Aktifkan RLS pada seluruh tabel di proyek Supabase Anda dan pastikan seluruh policy CRUD terpasang dengan benar.",
      definitionOfDone: [
        "Seluruh tabel di dashboard Supabase berstatus 'RLS Enabled' (Ikon gembok hijau)",
        "Teruji aman: Akun berbeda tidak dapat memodifikasi data milik pengguna lain"
      ],
      gitBranchTask: "git checkout -b feature/database-rls-security"
    }
  },
  {
    id: 13,
    worldId: "world-2",
    worldTitle: "Dunia 2: Rich UI, Media & Real-time",
    weekNumber: 13,
    title: "Deployment & CI/CD Pipeline ke Vercel",
    subtitle: "Otomatisasi build produksi dari GitHub ke Vercel, konfigurasi Environment Variables, dan domain publik.",
    cpmk: "Mahasiswa mampu mengonfigurasi pipeline CI/CD otomatis dari GitHub ke platform Vercel dengan konfigurasi env yang tepat.",
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 400,
    concepts: {
      summary: "Vercel menyediakan pipeline CI/CD bawaan: setiap push ke branch fitur menghasilkan Preview Deployment, dan push ke branch main menghasilkan Production Deployment.",
      points: [
        { title: "Production Build Lifecycle", desc: "Next.js melakukan optimasi kompilasi, static generation, dan pengecekan tipe data TypeScript saat proses build." },
        { title: "Environment Variables Synchronization", desc: "Memasukkan nilai NEXT_PUBLIC_SUPABASE_URL dan kunci lain ke tab Settings -> Environment Variables Vercel." }
      ]
    },
    references: [
      { title: "Vercel Next.js Deployment Docs", url: "https://vercel.com/docs/frameworks/nextjs", source: "Vercel" },
      { title: "Vercel Environment Variables Guide", url: "https://vercel.com/docs/projects/environment-variables", source: "Vercel" }
    ],
    lab: {
      prerequisites: ["Akun Vercel terhubung ke GitHub"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Uji coba build lokal terlebih dahulu untuk menangkap error sebelum deploy",
          code: "npm run build",
          language: "bash",
          explanation: "Jika perintah ini sukses menghasilkan folder .next, aplikasi Anda siap di-deploy ke Vercel."
        }
      ],
      aiPromptTemplate: {
        role: "DevOps Engineer",
        prompt: "Aplikasi Next.js saya mengalami error saat build di Vercel: [PASTE PESAN ERROR BUILD VERCEL]. Tolong bantu analisis penyebab kegagalan build dan berikan solusinya.",
        tip: "Periksa selalu apakah ada variabel environment yang lupa dimasukkan di dashboard Vercel."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 13: Live Deployment Pertama di Vercel",
      taskDesc: "Hubungkan repository GitHub Anda ke Vercel, konfigurasikan Environment Variables, dan dapatkan domain publik *.vercel.app.",
      definitionOfDone: [
        "Project berhasil di-import ke Vercel",
        "Environment variables Supabase & Cloudinary terpasang di Vercel",
        "Website publik dapat diakses dan berfungsi 100% di browser"
      ],
      gitBranchTask: "git checkout -b feature/vercel-deployment"
    }
  },
  {
    id: 14,
    worldId: "world-2",
    worldTitle: "Dunia 2: Rich UI, Media & Real-time",
    weekNumber: 14,
    title: "Observability & AI-Powered Debugging",
    subtitle: "Membaca Vercel Runtime Logs, menangani error dengan Error Boundaries, dan reverse-prompting bug.",
    cpmk: "Mahasiswa mampu memanfaatkan log sistem serverless dan AI untuk mengidentifikasi serta memperbaiki bug runtime di level produksi.",
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 400,
    concepts: {
      summary: "Pada arsitektur serverless, kita tidak bisa login SSH ke server. Kita mengandalkan Observability: membaca Runtime Logs dan Error Traces secara real-time.",
      points: [
        { title: "Next.js error.tsx & not-found.tsx", desc: "Menangkap runtime crash secara elegan dengan UI fallback kustom tanpa merusak seluruh halaman aplikasi." },
        { title: "Reverse-Prompting Bug Fix", desc: "Menyalin stack trace log dari Vercel ke AI untuk mendapatkan diagnosis akar masalah secara cepat." }
      ]
    },
    references: [
      { title: "Next.js Error Handling Guide", url: "https://nextjs.org/docs/app/building-your-application/routing/error-handling", source: "Next.js" },
      { title: "Vercel Runtime Logs Docs", url: "https://vercel.com/docs/observability/runtime-logs", source: "Vercel" }
    ],
    lab: {
      prerequisites: ["Aplikasi sudah live di Vercel"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Buat komponen penangkap error di src/app/error.tsx",
          code: `'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="p-8 text-center space-y-4">
      <h2 className="text-2xl font-bold text-red-500">Terjadi Kesalahan Sistem!</h2>
      <p className="text-zinc-500">{error.message}</p>
      <button onClick={() => reset()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
        Coba Lagi
      </button>
    </div>
  )
}`,
          language: "typescript"
        }
      ],
      aiPromptTemplate: {
        role: "Site Reliability Engineer (SRE)",
        prompt: "Berikut adalah log error dari Vercel Serverless Function saya: [PASTE LOG ERROR]. Tolong jelaskan mengapa error ini terjadi dan bagaimana cara memperbaiki kode Server Action terkait.",
        tip: "Sertakan juga potongan baris kode tempat error tersebut dipicu."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 14: Pasang Error Boundary & Log Audit",
      taskDesc: "Pasang file error.tsx dan not-found.tsx di aplikasi Anda dan lakukan simulasi penanganan error tak terduga.",
      definitionOfDone: [
        "File error.tsx dan not-found.tsx terpasang di root app",
        "Aplikasi tidak menampilkan layar putih kosong (blank screen) jika terjadi error"
      ],
      gitBranchTask: "git checkout -b feature/error-handling-observability"
    }
  },
  {
    id: 15,
    worldId: "world-2",
    worldTitle: "Dunia 2: Rich UI, Media & Real-time",
    weekNumber: 15,
    title: "Finalisasi Proyek, Code Review & SEO",
    subtitle: "Refactoring kode, audit performa Google Lighthouse, optimasi OpenGraph metadata, dan merge Pull Request ke main.",
    cpmk: "Mahasiswa mampu melakukan audit kualitas kode (clean code), optimasi performa (Lighthouse Score), serta menyiapkan dokumentasi README.",
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 450,
    concepts: {
      summary: "Tahap akhir sebelum peluncuran besar: Memastikan skor performa di atas 90, metadata OpenGraph untuk pratinjau media sosial, dan penulisan dokumentasi README.",
      points: [
        { title: "Lighthouse Performance Audit", desc: "Mengoptimasi Largest Contentful Paint (LCP) dan Cumulative Layout Shift (CLS) pada antarmuka Next.js." },
        { title: "Dynamic OpenGraph Metadata", desc: "Membuat thumbnail pratinjau media sosial yang menarik saat link website dibagikan." }
      ]
    },
    references: [
      { title: "Next.js Metadata and SEO Guide", url: "https://nextjs.org/docs/app/building-your-application/optimizing/metadata", source: "Next.js" },
      { title: "Google Lighthouse Performance Guide", url: "https://developer.chrome.com/docs/lighthouse/overview/", source: "Google Chrome" }
    ],
    lab: {
      prerequisites: ["Proyek mendekati sempurna"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Tambahkan metadata SEO di src/app/layout.tsx",
          code: `export const metadata = {
  title: 'Nama Proyek Akhir Saya - Serverless App',
  description: 'Aplikasi web modern skala produksi dibangun dengan Next.js, Supabase, dan Cloudinary.',
  openGraph: {
    title: 'Nama Proyek Akhir Saya',
    description: 'Aplikasi web modern skala produksi.',
    url: 'https://proyek-saya.vercel.app',
  },
}`,
          language: "typescript"
        }
      ],
      aiPromptTemplate: {
        role: "Technical Writer & Senior Architect",
        prompt: "Buatkan template dokumentasi README.md profesional untuk repositori GitHub proyek akhir saya yang mencakup: Deskripsi Proyek, Tech Stack Badges, Panduan Instalasi Lokal (.env.local), Fitur Utama, dan Skema Database.",
        tip: "README yang rapi dan profesional akan meningkatkan nilai portofolio Anda di mata penguji dan recruiter."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 15: Merge Final PR & Final Polish",
      taskDesc: "Lakukan merge seluruh branch fitur ke branch main, pastikan README.md lengkap, dan jalankan audit Lighthouse.",
      definitionOfDone: [
        "Seluruh kode ter-merge rapi di branch main GitHub",
        "README.md memuat dokumentasi proyek yang lengkap dan jelas",
        "Skor Lighthouse performa minimal 85+"
      ],
      gitBranchTask: "git checkout main && git merge feature/final-polish"
    }
  },

  // ==================== FINAL BOSS: UAS (M16) ====================
  {
    id: 16,
    worldId: "boss-2",
    worldTitle: "Final Boss: UAS Live Demo",
    weekNumber: 16,
    title: "FINAL BOSS: UAS – Production Live Demo & Portofolio Showcase",
    subtitle: "Ujian Akhir Semester: Peluncuran publik dan demonstrasi langsung aplikasi skala produksi di hadapan penguji.",
    cpmk: "Mahasiswa mampu mendemonstrasikan aplikasi Full-Stack Serverless skala produksi di Vercel publik, membuktikan keamanan RLS, dan mempertanggungjawabkan arsitektur sistem.",
    duration: "Sesi Sidang / Live Demo Final UAS",
    xp: 1000,
    concepts: {
      summary: "Puncak dari petualangan 'The Serverless Odyssey'. Anda kini adalah seorang Full-Stack Serverless Engineer yang kompeten.",
      points: [
        { title: "Kriteria Kelulusan UAS", desc: "Aplikasi berjalan di domain Vercel publik, memenuhi 6 kriteria teknis (Auth, DB 3 Tabel, Cloudinary, DND/Realtime, RLS, Deploy)." },
        { title: "Public GitHub Showcase", desc: "Repository publik yang siap dijadikan portofolio unggulan di LinkedIn atau CV industri." }
      ]
    },
    references: [
      { title: "The 12-Factor App Methodology", url: "https://12factor.net/", source: "Cloud Architecture" }
    ],
    lab: {
      prerequisites: ["Semua misi Minggu 1-15 tuntas"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Buat Git Tag rilis final v1.0.0-production",
          code: "git tag -a v1.0.0-production -m \"Release Final Production UAS Submission\"\ngit push origin v1.0.0-production",
          language: "bash"
        }
      ],
      aiPromptTemplate: {
        role: "Startup Founder & Pitch Coach",
        prompt: "Buatkan panduan presentasi pitching 5 menit untuk mendemokan aplikasi web Full-Stack Serverless saya di hadapan dosen penguji, menonjolkan fitur unik, keamanan RLS, dan arsitektur Next.js + Supabase.",
        tip: "Fokuskan demo pada problem yang diselesaikan dan keandalan sistem saat diuji coba secara live."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 16: Live Showcase UAS & Publikasi",
      taskDesc: "Lakukan live demo aplikasi di depan kelas/penguji dan publikasikan link website Vercel serta link GitHub ke publik.",
      definitionOfDone: [
        "Aplikasi aktif dan berfungsi normal di URL Vercel produksi publik",
        "Penguji berhasil menguji coba fitur autentikasi, upload gambar, dan manipulasi data",
        "Keamanan Row Level Security terbukti berfungsi dengan baik",
        "Tag rilis v1.0.0-production tersemat di repository GitHub"
      ],
      gitBranchTask: "git tag -a v1.0.0-production -m \"UAS Live Demo\""
    }
  }
];
