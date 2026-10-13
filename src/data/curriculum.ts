export interface CpmkPoint {
  code: string;
  badge?: string;
  title: string;
  desc: string;
  keywords?: string[];
}

export interface ManualActionItem {
  required: boolean;
  title: string;
  location?: string;
  description: string;
  codeSnippet?: {
    code: string;
    language: string;
  };
  simulatorKey?: string;
  note?: string;
}

export interface SteppedPromptItem {
  stepNumber: number;
  title: string;
  badge: string;
  description: string;
  targetFiles: string[];
  prompt: string;
  checkpoint: string;
  tip?: string;
  manualAction?: ManualActionItem;
}

export interface ModuleData {
  id: number;
  worldId: "world-1" | "boss-1" | "world-2" | "boss-2";
  worldTitle: string;
  weekNumber: number;
  title: string;
  subtitle: string;
  cpmk: string;
  cpmkPoints?: CpmkPoint[];
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
      badge?: string;
      actionType?: "manual" | "prompt" | "hybrid";
      targetPromptStep?: number;
    }[];
    aiPromptTemplate: {
      role: string;
      prompt: string;
      tip: string;
      steppedPrompts?: SteppedPromptItem[];
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

  // Pilar 4: Uji Pemahaman Konsep AI (Mastery Learning)
  quiz?: {
    totalQuestions: number;
    passingScore: number; // default: 80
    questions: {
      id: number;
      question: string;
      rubric: string;
      keyConcepts: string[];
      weight: number;
      socraticHint: string;
    }[];
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
    cpmkPoints: [
      {
        code: "CPMK 1.1",
        badge: "Paradigma Serverless",
        title: "Komparasi Arsitektur BaaS vs FaaS",
        desc: "Membedakan model komputasi Backend-as-a-Service (BaaS) dan Function-as-a-Service (FaaS) dalam ekosistem modern berbasis event-driven dan scale-to-zero.",
        keywords: ["BaaS vs FaaS", "Serverless Architecture", "Scale-to-Zero", "4 Pilar Odyssey"]
      },
      {
        code: "CPMK 1.2",
        badge: "Git & Secrets Hygiene",
        title: "Konfigurasi Repositori Git & Keamanan Secrets",
        desc: "Mengonfigurasi repositori Git yang aman dengan isolasi berkas sensitif (.gitignore dan .env.local) untuk mencegah kebocoran kredensial API ke repositori publik.",
        keywords: ["Git 3-Trees", "Gitignore Protection", ".env.local Secrets", "Branch Lifecycle"]
      },
      {
        code: "CPMK 1.3",
        badge: "AI Engineering",
        title: "Metodologi Prompting AI Berkonteks Tinggi (C-R-E-T)",
        desc: "Menerapkan formula prompting AI 4 pilar (Context, Role, Explicit Constraints, Target Output) untuk scaffolding kode teruji dan bebas halusinasi arsitektur.",
        keywords: ["Formula C-R-E-T", "Role-Based Persona", "Explicit Constraints", "All-in-One Prompt"]
      }
    ],
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
    },
    quiz: {
      totalQuestions: 5,
      passingScore: 80,
      questions: [
        {
          id: 1,
          question: "Jelaskan perbedaan mendasar antara Function-as-a-Service (FaaS) dan Backend-as-a-Service (BaaS) dalam arsitektur serverless, serta sebutkan layanan konkret yang mewakili masing-masing pilar dalam perkuliahan ini!",
          rubric: "Mahasiswa harus menjelaskan FaaS sebagai komputasi on-demand per event (Vercel Functions / Next.js Server Actions) dan BaaS sebagai penyedia infrastruktur backend siap pakai via API/SDK (Supabase untuk DB, Auth, Realtime).",
          keyConcepts: ["FaaS", "BaaS", "on-demand event", "Supabase", "Vercel"],
          weight: 20,
          socraticHint: "Coba renungkan siapa yang bertugas mengeksekusi logika fungsi komputasi vs siapa yang menyimpan data dan otentikasi. Layanan apa di teknologi kuliah kita yang mewakili masing-masing pilar tersebut?"
        },
        {
          id: 2,
          question: "Mengapa model scale-to-zero pada arsitektur FaaS jauh lebih menguntungkan dari sisi efisiensi biaya dibanding menyewa server Virtual Private Server (VPS) tradisional?",
          rubric: "Mahasiswa harus membandingkan biaya $0 saat idle pada FaaS dengan biaya sewa flat bulanan 24/7 pada VPS tradisional meskipun tidak ada request pengunjung yang masuk.",
          keyConcepts: ["scale-to-zero", "idle $0", "VPS flat cost", "bayar per eksekusi"],
          weight: 20,
          socraticHint: "Pikirkan apa yang terjadi dengan tagihan listrik atau biaya sewa server saat aplikasi Anda tidak ada pengunjung sama sekali di tengah malam. Mengapa FaaS tidak menagih biaya pada kondisi tersebut?"
        },
        {
          id: 3,
          question: "Uraikan alur perpindahan berkas pada arsitektur 3 area Git (Working Tree, Staging Area, Local Repository), dan jelaskan mengapa pemisahan Staging Area sangat penting sebelum melakukan commit!",
          rubric: "Mahasiswa harus menjelaskan fungsi Working Tree (tempat edit), Staging Area (seleksi snapshot berkas via git add), dan Local Repo (snapshot permanen via git commit), serta pentingnya menyusun commit yang atomik dan rapi.",
          keyConcepts: ["Working Tree", "Staging Area", "Local Repository", "git add", "git commit", "atomik"],
          weight: 20,
          socraticHint: "Mengapa developer tidak langsung meng-commit seluruh file yang diubah sekaligus? Apa peran penting staging area dalam memilih file mana yang siap dipotret ke riwayat?"
        },
        {
          id: 4,
          question: "Mengapa file .env.local DILARANG KERAS di-commit ke repositori publik GitHub, dan apa bahaya yang dapat terjadi jika kunci rahasia (secrets) di dalamnya bocor ke publik?",
          rubric: "Mahasiswa harus menjelaskan bahaya kebocoran kredensial rahasia (seperti Supabase Service Role Key) yang dapat dieksploitasi oleh bot scraper peretas untuk mencuri, merusak, atau menghapus database.",
          keyConcepts: [".env.local", ".gitignore", "service_role key", "bot scraper", "eksploitasi database"],
          weight: 20,
          socraticHint: "Apa yang tersimpan di dalam file .env.local yang tidak boleh diketahui orang lain? Apa dampak terburuk bagi database Anda jika orang tak dikenal memegang token service role?"
        },
        {
          id: 5,
          question: "Jelaskan peran masing-masing 4 komponen dalam framework prompting C-R-E-T (Context, Role, Explicit Constraints, Target Output) dalam memandu AI coding assistant menghasilkan kode yang berkualitas produksi!",
          rubric: "Mahasiswa harus menjelaskan C (konteks domain aplikasi), R (persona pakar), E (batasan teknologi dan dependensi tegas), dan T (struktur berkas target yang modular dan siap pakai).",
          keyConcepts: ["Context", "Role", "Explicit Constraints", "Target Output", "C-R-E-T"],
          weight: 20,
          socraticHint: "Bagaimana cara Anda mencegah AI memberikan solusi usang atau potongan kode komentar singkatan yang belum selesai? Elemen C-R-E-T mana yang bertugas mengunci aturan tersebut?"
        }
      ]
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
    cpmkPoints: [
      {
        code: "CPMK 2.1",
        badge: "Arsitektur RSC",
        title: "Komposisi Hibrida Server & Client Components",
        desc: "Merancang arsitektur rendering Next.js 16 dengan memprioritaskan React Server Components (0 kB JS bundle) dan mengisolasi Client Components ('use client') menggunakan pola interleaving children.",
        keywords: ["Server Components (RSC)", "Client Rehydration", "Interleaving Pattern", "0 kB Bundle"]
      },
      {
        code: "CPMK 2.2",
        badge: "App Router Routing",
        title: "Routing Bersarang, Dinamis, & Route Groups",
        desc: "Mengimplementasikan sistem routing Next.js 16 App Router dengan rute dinamis [id], rute catch-all [...slug], dan route groups bersarang (auth) tanpa mengacaukan struktur URL publik.",
        keywords: ["Dynamic Routing [id]", "Catch-All [...slug]", "Route Groups (auth)", "Special Files Hierarchy"]
      },
      {
        code: "CPMK 2.3",
        badge: "Design System",
        title: "Integrasi Komponen Shadcn UI & Desain Aksesibel",
        desc: "Mengintegrasikan primitif Radix UI dan styling Tailwind CSS berbasis semantic tokens (CVA merge) untuk menghasilkan antarmuka web modern yang responsif dan berstandar aksesibilitas tinggi.",
        keywords: ["Shadcn UI Primitives", "Radix Primitives", "Semantic HSL Tokens", "CVA Class Variance"]
      }
    ],
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
        role: "Senior Frontend UI/UX Designer & Next.js 16 Specialist",
        prompt: `Bertindaklah sebagai Senior Frontend UI/UX Designer & Next.js 16 Specialist.

Saya sedang membangun antarmuka web modern berskala produksi untuk aplikasi "The Serverless Odyssey" menggunakan Next.js 16 App Router, Tailwind CSS, dan Shadcn UI. Desain antarmuka harus memiliki estetika premium (modern typography, subtle gradients, glassmorphism, dan micro-interactions yang memukau).

Instruksi Pengerjaan:
1. Periksa ketersediaan berkas 'components.json'. Jika Shadcn UI belum terpasang, eksekusi CLI terminal berikut secara otomatis:
   npx -y shadcn@latest init -d
   npx -y shadcn@latest add button card badge input label separator avatar

2. Rakitlah arsitektur 5 berkas antarmuka yang saling terintegrasi penuh:
   - Berkas 1: 'src/app/page.tsx' (Landing Hero Page di Root /)
     Halaman utama (/) dengan desain hero yang memikat, badge "The Serverless Odyssey • Minggu 02", judul tebal modern, deskripsi singkat arsitektur, dan tombol Call-to-Action (CTA) beranimasi hover yang mengarahkan pengguna langsung ke rute "/tasks".
   - Berkas 2: 'src/app/(dashboard)/layout.tsx' (Shell Layout Dashboard)
     Layout bersama dengan navbar sticky glassmorphism (backdrop-blur-md), logo brand "CloudTask Pro", navigasi link (/tasks, /analytics), ThemeToggle, dan profil user avatar ringkas.
   - Berkas 3: 'src/app/(dashboard)/tasks/page.tsx' (Server Component RSC)
     Halaman utama tugas: 
     a. Tiga kartu metrik ringkasan (Total Tugas, Berjalan, Selesai) dengan ikon tematik bergradien halus (Indigo, Amber, Emerald) dan persentase capaian.
     b. Bilah kontrol atas yang memuat Client Component filter status dan tombol "Tambah Tugas".
     c. Grid tugas responsif (1 kolom mobile, 2 kolom desktop) dengan kartu tugas interaktif yang memiliki hover elevasi halus (hover:-translate-y-1 hover:shadow-lg transition-all), badge status semantik yang kontras, reward XP, dan tautan Link deklaratif ke detail tugas.
   - Berkas 4: 'src/components/task-status-filter.tsx' (Client Component 'use client')
     Bilah filter status tab pill (Semua, Berjalan, Selesai) dengan interaksi klik aktif visual yang kontras dan badge jumlah tugas.
   - Berkas 5: 'src/app/(dashboard)/tasks/[id]/page.tsx' (Dynamic Route RSC)
     Halaman detail tugas menggunakan Next.js 16 async params ('const { id } = await params;'), breadcrumb navigasi kembali ke /tasks, detail deskripsi tugas, dan badge status lengkap.

Batasan Teknis Wajib:
- DILARANG menambahkan 'use client' di file page.tsx atau layout.tsx utama (Server Components by default).
- Desain UI wajib terasa PREMIUM: gunakan semantic Tailwind tokens (bg-background, text-muted-foreground, border-border, bg-card) yang adaptif terhadap Dark Mode dan Light Mode.
- Di Next.js 16, wajib menggunakan 'const { id } = await params;' karena params bersifat Promise asinkron.
- Pastikan seluruh tipe TypeScript didefinisikan secara eksplisit dan bebas dari tipe any.
- Kode yang dihasilkan harus utuh, fungsional, dan siap jalan tanpa placeholder komentar singkatan.`,
        tip: "Formula prompt All-in-One ini menghubungkan rute utama (/) ke dashboard (/tasks), menginisialisasi Shadcn UI via CLI secara otomatis jika belum ada, dan menghasilkan antarmuka premium 5 berkas yang menuntaskan 100% kriteria Definition of Done Misi Minggu 2."
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
    },
    quiz: {
      totalQuestions: 6,
      passingScore: 80,
      questions: [
        {
          id: 1,
          question: "Jelaskan perbedaan mendasar antara React Server Component (RSC) dan Client Component ('use client') dari sisi tempat eksekusi dan dampaknya terhadap ukuran bundle JavaScript yang dikirim ke browser pengguna!",
          rubric: "Mahasiswa harus menjelaskan RSC dieksekusi 100% di server dengan bundle 0 kB JS ke browser, sedangkan Client Component mengirim JavaScript ke browser untuk proses hydration dan interaktivitas event listener.",
          keyConcepts: ["React Server Component", "Client Component", "0 kB bundle", "hydration", "use client"],
          weight: 15,
          socraticHint: "Pikirkan apa yang terjadi saat browser mengunduh halaman. Mana komponen yang mengirim kode JS untuk dijalankan di HP/laptop pengguna, dan mana yang hanya mengirim HTML murni hasil render dapur server?"
        },
        {
          id: 2,
          question: "Apa yang dimaksud dengan proses Hydration pada Client Component, dan mengapa arsitektur Next.js 16 mewajibkan kita membatasi penggunaan direktif 'use client' hanya pada komponen daun terluar (leaf components)?",
          rubric: "Mahasiswa harus menjelaskan hydration sebagai proses pemasangan event listener ke HTML statis, dan pentingnya leaf component untuk menjaga performa loading dan mempertahankan manfaat 0 kB JS RSC pada sisa halaman.",
          keyConcepts: ["Hydration", "leaf components", "event listener", "performa loading", "bundle size"],
          weight: 15,
          socraticHint: "Jika Anda meletakkan 'use client' di layout.tsx atau page.tsx teratas, apa dampaknya terhadap seluruh komponen anak di bawahnya? Mengapa kita sebaiknya hanya menaruhnya di tombol atau form interaktif saja?"
        },
        {
          id: 3,
          question: "Mengapa Server Component DILARANG diimpor secara langsung di dalam Client Component, dan bagaimana cara mengatasi batasan tersebut menggunakan pola komposisi (Interleaving Pattern / children prop)?",
          rubric: "Mahasiswa harus menjelaskan bahwa mengimpor RSC ke dalam file 'use client' otomatis mengubah RSC menjadi Client Component. Solusinya adalah melewatkan RSC sebagai prop children dari parent Server Component.",
          keyConcepts: ["Interleaving Pattern", "children prop", "larangan import RSC di Client", "komposisi komponen"],
          weight: 20,
          socraticHint: "Ingat kembali analogi donat dan selai. Bagaimana cara kita memasukkan selai server ke dalam donat klien tanpa merusak adonan donatnya?"
        },
        {
          id: 4,
          question: "Bandingkan skenario penggunaan komponen <Link>, hook useRouter(), dan fungsi redirect() di Next.js 16. Kapan Anda wajib memilih masing-masing metode navigasi tersebut?",
          rubric: "Mahasiswa harus menjelaskan <Link> untuk navigasi deklaratif SEO-friendly dengan prefetching, useRouter() untuk navigasi programatik berbasis event di Client Component, dan redirect() untuk server-side guard dan pasca-mutasi Server Action.",
          keyConcepts: ["<Link>", "useRouter()", "redirect()", "prefetching", "server guard"],
          weight: 20,
          socraticHint: "Kapan Anda membutuhkan navigasi yang bisa diindeks Google vs navigasi setelah menekan tombol submit form vs pengecekan auth di server sebelum halaman dirender?"
        },
        {
          id: 5,
          question: "Jelaskan breaking change terkait pembacaan parameter rute dinamis (params dan searchParams) di Server Component Next.js 16 dibanding versi sebelumnya, serta tunjukkan cara penulisan sintaksnya yang benar!",
          rubric: "Mahasiswa harus menjelaskan bahwa params dan searchParams sekarang berupa Promise asinkron dan wajib di-await ('const { id } = await params;').",
          keyConcepts: ["Promise asinkron", "await params", "await searchParams", "Next.js 16 breaking change"],
          weight: 15,
          socraticHint: "Mengapa kode lama 'const id = params.id' sekarang memunculkan error atau warning di Next.js 16? Kata kunci apa yang wajib ditambahkan sebelum membaca properti params?"
        },
        {
          id: 6,
          question: "Mengapa Shadcn UI tidak didistribusikan sebagai pustaka komponen monolitik via NPM (seperti Material UI atau Bootstrap), dan apa keuntungan arsitektur kepemilikan kode sumber lokal (code ownership) bagi pengembang?",
          rubric: "Mahasiswa harus menjelaskan filosofi Shadcn UI yang menyalin kode komponen (Radix UI + Tailwind) langsung ke folder proyek, memberikan 100% kendali kustomisasi tanpa ketergantungan versi dependensi tertutup.",
          keyConcepts: ["Code Ownership", "Radix UI Primitives", "Tailwind CSS", "kustomisasi bebas", "non-monolithic"],
          weight: 15,
          socraticHint: "Apa bedanya jika kode tombol ada langsung di folder components/ui/button.tsx proyek Anda dibanding terkunci di dalam folder node_modules?"
        }
      ]
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
    cpmkPoints: [
      {
        code: "CPMK 3.1",
        badge: "Server Actions RPC",
        title: "Mutasi Data Form via Server Actions ('use server')",
        desc: "Mengimplementasikan mutasi data aman langsung di server tanpa API endpoints terpisah, mengelola penempatan berkas aksi, serta mengeksekusi revalidasi cache on-demand.",
        keywords: ["Server Actions RPC", "'use server' Directive", "Revalidation Cache", "RPC Protocol"]
      },
      {
        code: "CPMK 3.2",
        badge: "Validasi Skema",
        title: "Pertahanan Integritas Data Menggunakan Zod",
        desc: "Membangun skema validasi Zod ketat dengan safeParse, type coercion, refine kustom, serta pemformatan pesan kesalahan field-level (ActionState) yang terstruktur.",
        keywords: ["Zod safeParse", "Type Coercion", "Refine Constraints", "fieldErrors Formatting"]
      },
      {
        code: "CPMK 3.3",
        badge: "React 19 Form Hooks",
        title: "Manajemen Siklus Form & Optimistic UI",
        desc: "Mengelola siklus state form menggunakan useActionState React 19, memanfaatkan useFormStatus untuk tombol submit mandiri, dan menghadirkan responsifitas 0ms via useOptimistic.",
        keywords: ["useActionState", "useFormStatus", "useOptimistic (0ms)", "ActionState<T> Contract"]
      }
    ],
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
          content: "Sebelum Server Actions, setiap mutasi data di aplikasi React membutuhkan pembuatan endpoint API terpisah (misal POST /api/tasks), parsing request body manual, serta manajemen state loading terpisah. Next.js 16 menghadirkan Server Actions yang mengubah paradigma ini menjadi Remote Procedure Call (RPC) yang aman dan deklaratif.",
          subpoints: [
            {
              label: "Direktif 'use server' & Eksekusi RPC Otomatis",
              text: "1. Protokol Eksekusi RPC POST Otomatis: Menandai fungsi dengan direktif `'use server'` menginstruksikan Next.js untuk secara otomatis membuat endpoint RPC POST internal dengan hash Action ID terenkripsi tanpa perlu membuat file `/api/*` manual.\n\n" +
                    "2. Proteksi Kredensial 100% Aman: Kunci API rahasia backend (seperti `SUPABASE_SERVICE_ROLE_KEY`) hanya dieksekusi di runtime server dan tidak pernah dikirim atau dibocorkan ke bundle browser pengguna.\n\n" +
                    "3. Integrasi Deklaratif Formulir: Server Action dapat dilewatkan langsung ke atribut `action={formAction}` pada tag `<form>`, mengeliminasi kebutuhan penulisan `fetch()` dan `event.preventDefault()` manual.",
              code: `// src/actions/tasks.ts
"use server";

import { revalidatePath } from "next/cache";

export async function createTaskAction(formData: FormData) {
  // 🔒 Eksekusi 100% aman di Server Node.js / Edge
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
              text: "1. Berkas Terpisah (`src/actions/*.ts` - Standar Industri): Server Action didefinisikan pada berkas khusus dengan `'use server'` di baris teratas. Berkas ini dapat diimpor bebas oleh Server Component maupun Client Component (`'use client'`).\n\n" +
                    "2. Inline Action (Khusus Server Component): Ditulis langsung di dalam fungsi Server Component. DILARANG KERAS menuliskan inline `'use server'` di dalam berkas Client Component.\n\n" +
                    "3. Arsitektur Terisolasi: Memisahkan berkas actions menjaga kode tetap modular, mudah diuji via unit testing, dan dapat digunakan kembali lintas halaman.",
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
              text: "1. Pembersihan Cache Seketika (`revalidatePath`): Memerintahkan Next.js menghapus cache halaman server setelah mutasi sukses, sehingga browser menerima data terbaru seketika via Soft Navigation.\n\n" +
                    "2. Revalidasi Granular (`revalidateTag`): Membersihkan cache data spesifik berdasarkan tag tanpa harus merender ulang rute yang tidak terdampak.\n\n" +
                    "3. Pola Post-Redirect-Get (PRG): Gabungkan dengan `redirect('/tasks')` pasca mutasi untuk mencegah pengiriman form berulang saat pengguna me-refresh peramban.",
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
              text: "1. Celah Keamanan Validasi Browser: Atribut HTML5 seperti `required` atau `minlength` mudah di-bypass via Curl, Postman, atau skrip eksternal. Validasi sisi server adalah pertahanan mutlak.\n\n" +
                    "2. Pertahanan Tangguh dengan `schema.safeParse()`: Hindari `.parse()` yang melempar exception crash runtime. Selalu gunakan `.safeParse()` yang mengembalikan objek diskriminatif `{ success: true, data }` atau `{ success: false, error }`.\n\n" +
                    "3. Inferensi Tipe TypeScript Otomatis: Ekstrak tipe statis dengan `z.infer<typeof Schema>` agar antarmuka TypeScript selalu tersinkronisasi 100% dengan aturan validasi.",
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
              text: "1. Type Coercion Otomatis (`z.coerce`): Input `FormData` dari form HTML selalu bertipe string. Gunakan `z.coerce.number()` atau `z.coerce.date()` untuk mengonversi string angka atau tanggal secara aman.\n\n" +
                    "2. Validasi Logika Bisnis Lanjutan (`.refine()`): Menambahkan aturan bisnis kustom (misal: tanggal deadline harus di masa depan, atau validasi cross-field antar dua input).\n\n" +
                    "3. Penargetan Path Pesan Error: Properti `path: ['deadline']` memastikan pesan kesalahan menempel tepat pada field input yang bermasalah di antarmuka.",
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
              text: "1. Ekstraksi Struktur ZodError: Objek error bawaan Zod berbentuk array bersarang yang sulit dibaca form UI. Gunakan `.flatten()` untuk mengubahnya menjadi dictionary `fieldErrors`.\n\n" +
                    "2. Pemetaan Langsung ke Field Input: Menghasilkan format `{ title: ['Judul minimal 3 karakter'], budget: ['Budget harus > 0'] }` yang siap ditampilkan di bawah komponen `<Input>`.\n\n" +
                    "3. Pesan Error Ramah Pengguna: Selalu berikan pesan kesalahan spesifik berbahasa Indonesia agar pengguna memahami langkah perbaikan yang harus dilakukan.",
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
              text: "1. Standar Mutasi Form React 19: Menggantikan hook `useFormState` (react-dom) yang telah deprecated. Hook `useActionState` diimpor langsung dari package inti `'react'`.\n\n" +
                    "2. Anatomi Nilai Kembalian Tuple: Mengembalikan `[state, formAction, isPending]` di mana `state` memuat data return terakhir dari server, `formAction` disematkan ke `<form action={...}>`, dan `isPending` menandakan proses transmisi aktif.\n\n" +
                    "3. Eliminasi Boilerplate Loading Manual: Tidak perlu lagi membuat state `const [isLoading, setIsLoading] = useState(false)` secara terpisah.",
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
              text: "1. Zero Prop Drilling: Hook `useFormStatus` (dari `'react-dom'`) dipanggil di dalam komponen anak tag `<form>` dan otomatis mendeteksi status pending form induk tanpa perlu passing props.\n\n" +
                    "2. Status Pending Otomatis: Menghasilkan boolean `{ pending }` yang langsung dapat digunakan untuk menonaktifkan tombol submit (`disabled={pending}`) dan menampilkan ikon spinner animasi.\n\n" +
                    "3. Pencegahan Klik Ganda (Double-Submit): Mengunci tombol saat permintaan sedang diproses untuk mencegah data ganda tersimpan ke database.",
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
              text: "1. Responsivitas 0 Milidetik: Hook `useOptimistic` menampilkan data baru di antarmuka seketika sebelum server merespons, memberikan ilusi aplikasi yang berjalan tanpa latensi jaringan.\n\n" +
                    "2. State Reducer Sementara: Menerima daftar data saat ini dan payload tugas baru, lalu menggabungkannya dengan penanda status sementara (misal: `isPending: true`).\n\n" +
                    "3. Pemulihan Otomatis (*Auto-Rollback*): Jika Server Action gagal atau melempar error, React secara otomatis mengembalikan tampilan ke data riil tanpa glitch.",
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
              text: "1. Tipe Kontrak Generik `ActionState<T>`: Menstandarisasi struktur respons seluruh Server Actions dengan properti `{ success: boolean, message: string, errors?: Record<string, string[]>, data?: T }`.\n\n" +
                    "2. Prediktabilitas Komponen Klien: Setiap Client Component form memiliki ekspektasi tipe data yang seragam sehingga penanganan error dan notifikasi menjadi konsisten.\n\n" +
                    "3. Kompatibilitas Notifikasi Toast: Properti `message` dapat langsung dihubungkan ke library toast (seperti Sonner) untuk memberikan umpan balik visual instan.",
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
              text: "1. Komposisi Elemen Form Shadcn UI: Memadukan komponen `<Label>`, `<Input>`, `<Textarea>`, dan `<Button>` untuk tata letak formulir modern yang accessible (WAI-ARIA).\n\n" +
                    "2. Penanda Validasi Visual: Terapkan class `border-destructive focus-visible:ring-destructive` secara kondisional jika field memiliki error pada `state?.errors`.\n\n" +
                    "3. Feedback Error Inline: Tampilkan pesan kesalahan pertama `state.errors[field][0]` dengan teks merah semantik (`text-destructive text-xs`) tepat di bawah elemen input.",
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
          instruction: "Instalasi Pustaka Zod & Komponen Form Shadcn UI Tambahan",
          code: `npm install zod && npx shadcn@latest add alert textarea`,
          language: "bash",
          explanation: "Zod bertindak sebagai mesin validasi data defensif di server, sedangkan komponen Alert dan Textarea melengkapi antarmuka entri formulir."
        },
        {
          stepNumber: 2,
          instruction: "Buat Definisi Skema Validasi & Tipe ActionState di src/lib/schemas.ts",
          code: `import { z } from "zod";

export const TaskSchema = z.object({
  title: z.string().min(3, "Judul tugas minimal harus 3 karakter").max(100, "Judul tugas maksimal 100 karakter"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"], {
    errorMap: () => ({ message: "Pilih prioritas yang valid (low, medium, high)" })
  }).default("medium"),
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
    priority: formData.get("priority") || "medium",
  };

  const validation = TaskSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Validasi formulir gagal. Periksa kembali input Anda.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  // Simulasi penyimpanan mutasi basis data serverless
  console.log("Menyimpan tugas baru ke server:", validation.data);

  // Revalidasi cache halaman tugas seketika
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, PlusCircle } from "lucide-react";

export function CreateTaskForm() {
  const [state, formAction, isPending] = useActionState(createTaskAction, null);

  return (
    <Card className="border border-border/80 shadow-sm">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-indigo-500" />
          <span>Tambah Tugas Baru</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold">Judul Tugas</Label>
            <Input
              id="title"
              name="title"
              placeholder="Contoh: Implementasi RLS Supabase..."
              disabled={isPending}
              className={state?.errors?.title ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {state?.errors?.title && (
              <p className="text-xs text-destructive font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{state.errors.title[0]}</span>
              </p>
            )}
          </div>

          <Button type="submit" disabled={isPending} className="w-full h-9 text-xs font-bold gap-2">
            {isPending ? "Menyimpan ke Server..." : "Simpan Tugas"}
          </Button>

          {state?.success && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{state.message}</span>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}`,
          language: "tsx",
          explanation: "Komponen interaktif 'use client' menggunakan hook useActionState dari React 19 untuk menangani loading state pending dan feedback validasi secara otomatis."
        },
        {
          stepNumber: 5,
          instruction: "Integrasikan Form ke Dashboard Tugas (src/app/(dashboard)/tasks/page.tsx)",
          code: `// Sisipkan CreateTaskForm ke dalam src/app/(dashboard)/tasks/page.tsx
import { CreateTaskForm } from "@/components/tasks/create-task-form";

// Letakkan di atas grid daftar tugas:
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-1">
    <CreateTaskForm />
  </div>
  <div className="lg:col-span-2">
    {/* Grid Daftar Tugas */}
  </div>
</div>`,
          language: "tsx",
          explanation: "Menyandingkan CreateTaskForm di kolom kiri dan daftar tugas di kolom kanan memungkinkan mahasiswa langsung menguji pengiriman form dan mengamati revalidasi data secara real-time."
        }
      ],
      aiPromptTemplate: {
        role: "Senior Full-Stack Architect & React 19 Specialist",
        prompt: `Bertindaklah sebagai Senior Full-Stack Architect & React 19 Specialist.

Saya sedang membangun modul formulir mutasi data tugas berskala produksi untuk aplikasi "The Serverless Odyssey" menggunakan Next.js 16 App Router, React 19, Zod, dan Shadcn UI. Desain antarmuka harus memiliki estetika premium (modern typography, subtle gradients, border semantik, dan feedback interaktif yang elegan).

Instruksi Pengerjaan:
1. Periksa ketersediaan dependensi 'zod' dan komponen Shadcn UI (button, card, badge, input, label, separator, alert, textarea). Jika belum terpasang, eksekusi CLI terminal berikut secara otomatis:
   npm install zod
   npx -y shadcn@latest add button card badge input label separator alert textarea

2. Rakitlah arsitektur 5 berkas modular terintegrasi yang saling terhubung:
   - Berkas 1: 'src/lib/schemas.ts'
     Definisikan skema Zod 'TaskSchema' (title min 3 max 100 karakter, description opsional, priority enum: low/medium/high), inferensi tipe 'TaskInput', dan tipe kontrak generik 'ActionState<T>'.
   - Berkas 2: 'src/actions/tasks.ts' (Server Action 'use server')
     Fungsi 'createTaskAction(prevState, formData): Promise<ActionState>' yang membaca input FormData, memvalidasi defensif via 'TaskSchema.safeParse()', mengembalikan fieldErrors jika invalid, merevalidasi cache via 'revalidatePath("/tasks")', dan mengembalikan status sukses.
   - Berkas 3: 'src/components/tasks/create-task-form.tsx' (Client Component 'use client')
     Formulir interaktif modern menggunakan hook 'useActionState(createTaskAction, null)', indikator loading 'isPending', feedback border merah saat invalid ('border-destructive'), pesan error inline per field, tombol submit responsif, dan alert sukses saat data tersimpan.
   - Berkas 4: 'src/app/(dashboard)/tasks/page.tsx' (Server Component RSC)
     Perbarui dashboard tugas dengan layout 2 kolom: kolom kiri memuat 'CreateTaskForm', dan kolom kanan memuat kartu metrik ringkasan serta daftar tugas statis dengan tautan ke detail tugas.
   - Berkas 5: 'src/app/page.tsx' (Root Landing Page)
     Perbarui halaman utama (/) dengan hero CTA yang memuat preview modul mutasi data dan tombol aksi cepat "Buka Form Pembuatan Tugas" yang mengarahkan ke "/tasks".

Batasan Teknis Wajib:
- DILARANG membuat API Route manual di /api/*. Wajib menggunakan Server Action dengan direktif 'use server'.
- Wajib menggunakan hook 'useActionState' yang diimpor langsung dari package 'react' (bukan useFormState deprecated dari 'react-dom').
- Validasi seluruh input di server menggunakan 'schema.safeParse()' tanpa tipe 'any'.
- Desain antarmuka wajib PREMIUM: gunakan semantic Tailwind tokens Shadcn (bg-card, text-muted-foreground, border-border, text-destructive) yang adaptif terhadap Dark Mode dan Light Mode.
- Kode yang dihasilkan harus utuh, fungsional, dan siap jalan tanpa placeholder komentar singkatan.`,
        tip: "Formula prompt All-in-One ini otomatis menginstal pustaka Zod dan komponen Shadcn via CLI jika belum ada, lalu merakit 5 berkas arsitektur form mutasi yang 100% menuntaskan Definition of Done Misi Minggu 3."
      },
      warningZone: {
        title: "Zona Bahaya: Mengabaikan Validasi Sisi Server!",
        desc: "Hanya mengandalkan validasi atribut HTML5 (seperti required atau minlength) di browser adalah kesalahan fatal. Siapa pun dapat mem-bypass validasi peramban menggunakan cURL atau Postman. Selalu gunakan Zod safeParse() di dalam Server Action untuk melindungi integritas database Anda!"
      }
    },
    mission: {
      taskTitle: "Misi Minggu 3: Form Entri Data Tervalidasi Zod & Server Actions",
      taskDesc: "Lanjutkan repositori Proyek Akhir Anda. Bangun form entri data utama pertama yang diproses menggunakan Server Actions ('use server'), divalidasi dengan Zod, dan dikelola oleh React 19 useActionState.",
      definitionOfDone: [
        "Pustaka Zod terpasang dan skema validasi terdefinisi lengkap di src/lib/schemas.ts",
        "Berkas Server Action di src/actions/tasks.ts berhasil membaca FormData dan memvalidasi via safeParse()",
        "Komponen form menggunakan hook useActionState dari React 19 dengan penanganan isPending dan pesan error inline",
        "Form terintegrasi di halaman dashboard /tasks dan halaman landing root / memiliki tautan CTA navigasi langsung",
        "Tampilan form responsif, memiliki indikator loading tombol submit, serta mendukung Dark/Light mode"
      ],
      gitBranchTask: "git checkout -b feature/server-actions-zod"
    },
    quiz: {
      totalQuestions: 6,
      passingScore: 80,
      questions: [
        {
          id: 1,
          question: "Jelaskan bagaimana paradigma Server Actions ('use server') di Next.js 16 menyederhanakan mutasi data dibanding metode tradisional membuat API Route (/api/*), serta jelaskan mengapa kredensial database lebih aman!",
          rubric: "Mahasiswa harus menjelaskan Server Actions sebagai Remote Procedure Call (RPC) otomatis langsung dari form JSX tanpa file route.ts manual, dan keamanan terjamin karena kode dieksekusi murni di runtime server sehingga secret keys tidak pernah dikirim ke browser.",
          keyConcepts: ["Server Actions", "RPC", "use server", "tanpa API route manual", "proteksi credentials"],
          weight: 15,
          socraticHint: "Bandingkan berapa banyak file dan baris fetch() manual yang harus Anda tulis di metode lama vs langsung menyematkan fungsi ke prop action={formAction}."
        },
        {
          id: 2,
          question: "Mengapa validasi form atribut HTML5 di browser tidak dapat diandalkan untuk keamanan database, dan bagaimana method schema.safeParse() pada Zod mencegah terjadinya unhandled runtime crash di server?",
          rubric: "Mahasiswa harus menjelaskan bahwa validasi browser mudah di-bypass via cURL/Postman, dan safeParse() mengembalikan objek diskriminatif { success, data/error } yang aman tanpa melempar exception fatal.",
          keyConcepts: ["Never Trust Client Input", "bypass HTML5 validation", "safeParse()", "unhandled crash prevention", "Zod"],
          weight: 15,
          socraticHint: "Apa yang terjadi pada server Node.js Anda jika pengguna mengirim payload JSON anomali dan Anda menggunakan schema.parse() tanpa blok try/catch vs menggunakan safeParse()?"
        },
        {
          id: 3,
          question: "Mengapa fungsi z.coerce sangat krusial saat memvalidasi data yang bersumber dari FormData formulir HTML, dan pada skenario apa kita wajib menerapkan method .refine()?",
          rubric: "Mahasiswa harus menjelaskan FormData selalu bernilai string sehingga perlu dikonversi ke number/Date via z.coerce, dan .refine() digunakan untuk aturan bisnis kustom (seperti tanggal deadline harus di masa depan).",
          keyConcepts: ["FormData string", "z.coerce", "type coercion", ".refine()", "validasi logika bisnis"],
          weight: 15,
          socraticHint: "Ketika pengguna mengisi input type='number', tipe data apa yang sebenarnya diterima server dari formData.get('angka')? Bagaimana Zod mengubahnya menjadi number murni?"
        },
        {
          id: 4,
          question: "Uraikan fungsi masing-masing elemen pada tuple kembalian hook React 19 useActionState: [state, formAction, isPending], dan jelaskan mengapa hook ini mengeliminasi kebutuhan useState loading manual!",
          rubric: "Mahasiswa harus menjelaskan state (data return server terakhir), formAction (handler untuk atribut form), dan isPending (boolean status transmisi otomatis), mengeliminasi boilerplate useState(false) dan useTransition ganda.",
          keyConcepts: ["useActionState", "tuple [state, formAction, isPending]", "React 19 native", "eliminasi useState loading"],
          weight: 20,
          socraticHint: "Bagaimana cara komponen form mengetahui bahwa Server Action sedang berjalan di server tanpa Anda membuat state const [isLoading, setIsLoading] = useState(false)?"
        },
        {
          id: 5,
          question: "Bagaimana hook useFormStatus dari 'react-dom' memungkinkan pembuatan komponen tombol submit mandiri tanpa mengalami masalah prop drilling dari formulir induk?",
          rubric: "Mahasiswa harus menjelaskan useFormStatus mendeteksi context status pending dari tag <form> induk terdekat secara otomatis sehingga tombol submit tahu kapan harus mengunci diri (disabled).",
          keyConcepts: ["useFormStatus", "zero prop drilling", "form context", "disabled pending", "anti-double-submit"],
          weight: 15,
          socraticHint: "Di mana hook useFormStatus harus dipanggil? Apakah di dalam tag <form> atau di luarnya? Mengapa kita tidak perlu mengoper prop isLoading ke tombol tersebut?"
        },
        {
          id: 6,
          question: "Bagaimana hook useOptimistic memberikan responsivitas antarmuka 0 milidetik pada aplikasi web, dan bagaimana mekanisme auto-rollback bekerja jika server gagal menyimpan data?",
          rubric: "Mahasiswa harus menjelaskan useOptimistic merender data prediksi secara instan sebelum respons server tiba, dan jika Server Action gagal/error, React otomatis memulihkan UI ke state riil dari server tanpa glitch.",
          keyConcepts: ["useOptimistic", "0ms responsivitas", "state reducer sementara", "auto-rollback", "resilient UI"],
          weight: 20,
          socraticHint: "Bayangkan Anda menekan tombol 'Like' di media sosial. Mengapa ikon hati langsung merah seketika? Apa yang terjadi jika koneksi internet Anda tiba-tiba terputus saat request dikirim?"
        }
      ]
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
    cpmkPoints: [
      {
        code: "CPMK 4.1",
        badge: "Desain Relasional",
        title: "Pemodelan Relasi PostgreSQL & Integritas Skema",
        desc: "Merancang skema database relasional PostgreSQL dengan primary key UUID v4, relasi 1:N CASCADE, relasi M:N junction table, serta batasan CHECK dan indeks B-Tree O(log N).",
        keywords: ["UUID v4 vs Serial", "Relasi 1:N & M:N", "CHECK Constraints", "B-Tree Indexing"]
      },
      {
        code: "CPMK 4.2",
        badge: "Next.js 16 SSR Client",
        title: "Klien Supabase SSR & Asynchronous Cookies",
        desc: "Mengonfigurasi klien Supabase SSR Next.js 16 (@supabase/ssr) dengan penanganan async cookies Next.js 16 yang membedakan instance server dan browser secara aman.",
        keywords: ["@supabase/ssr", "Async Cookies Next.js 16", "Server vs Client", "Secure Cookie Storage"]
      },
      {
        code: "CPMK 4.3",
        badge: "Type Safety",
        title: "Otomasi Tipe TypeScript via Supabase Typegen",
        desc: "Mengotomasi pembuatan definisi tipe TypeScript dari skema PostgreSQL menggunakan CLI Supabase Typegen untuk menjamin keamanan tipe 100% dari database ke frontend.",
        keywords: ["Supabase Typegen", "TypeScript Strict Safety", "Database Types", "0 Any Type"]
      }
    ],
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
              text: "1. Mitigasi Serangan ID Enumeration: Penggunaan integer auto-increment (`SERIAL 1, 2, 3...`) membocorkan pola urutan data dan memudahkan peretas merayapi endpoint API rahasia (`/users/1042` ➔ `/users/1043`).\n\n" +
                    "2. Bebas Tabrakan di Cloud Terdistribusi (*Zero Collision*): Nilai 128-bit acak kriptografis `gen_random_uuid()` dapat dibuat secara independen di browser client, Edge server, maupun database tanpa risiko tabrakan ID saat replikasi.\n\n" +
                    "3. Proteksi Kerahasiaan Metrik Bisnis: ID acak tidak mencerminkan volume transaksi harian atau jumlah pelanggan baru, menjaga metrik pertumbuhan bisnis tetap terlindungi dari kompetitor.",
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
              text: "1. Pemodelan Hierarkis Induk-Anak: Menghubungkan satu entitas pengguna master (`profiles.id`) dengan banyak entitas proyek (`projects.user_id`) melalui deklarasi constraint referensial `REFERENCES`.\n\n" +
                    "2. Eliminasi Data Yatim (*Zero Orphaned Records*): Klausa `ON DELETE CASCADE` memastikan jika satu baris profile dihapus, seluruh entitas anak miliknya otomatis dibersihkan secara atomik oleh PostgreSQL tanpa perlu query delete bertingkat dari aplikasi.\n\n" +
                    "3. Penegakan Integritas di Tingkat Kernel: Database menolak operasi insert atau update jika foreign key `user_id` yang dimasukkan tidak ditemukan di tabel induk, menjamin konsistensi data 100%.",
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
              text: "1. Dekomposisi Relasi Banyak-ke-Banyak: Menghubungkan dua entitas fleksibel (1 tugas memiliki banyak tag, dan 1 tag menempel di banyak tugas) menggunakan tabel perantara (*Junction Table* `task_tags`).\n\n" +
                    "2. Kunci Primer Komposit (*Composite Primary Key*): Menyatukan pasangan `(task_id, tag_id)` sebagai `PRIMARY KEY` ganda untuk mencegah duplikasi penyematan tag yang sama pada tugas yang bersangkutan.\n\n" +
                    "3. Efisiensi Indeks Bawaan: Primary key komposit secara otomatis membuat indeks unik dua arah, memungkinkan pencarian relasional instan dari sisi tugas maupun dari sisi kategori label.",
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
              text: "1. Garis Pertahanan Absolut di Tingkat Kernel: Aturan constraint SQL dieksekusi langsung oleh engine PostgreSQL dan mustahil di-bypass oleh Postman, curl, maupun bug manipulasi request di frontend.\n\n" +
                    "2. Penegakan Logika Bisnis Hakiki via CHECK: Constraint `CHECK (budget > 0)` dan `CHECK (status IN ('todo', 'in_progress', 'done'))` memastikan hanya nilai yang sah menurut aturan domain yang diizinkan masuk ke disk penyimpanan.\n\n" +
                    "3. Jaminan Keunikan Entitas (*UNIQUE Constraint*): Memastikan integritas data tanpa redundansi (seperti email unik atau slug proyek) yang secara otomatis dikawal oleh indeks unik.",
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
              text: "1. Akselerasi Penelusuran Pohon Biner: Mentransformasikan Sequential Scan $O(N)$ (membaca jutaan baris data dari disk satu per satu) menjadi B-Tree Index Scan $O(\\log N)$ yang hanya membutuhkan 3–4 kali pembacaan blok memori.\n\n" +
                    "2. Indeksasi Wajib Kolom Foreign Key: PostgreSQL TIDAK otomatis membuat indeks pada foreign key; developer wajib mengeksekusi `CREATE INDEX` pada `user_id` dan `project_id` agar operasi `JOIN` tidak membebani performa saat data bertumbuh.\n\n" +
                    "3. Optimasi Filter & Sorting Dashboard: Indeks pada kolom status filter dan `created_at DESC` memangkas waktu respons query dashboard dari 250ms menjadi sub-milidetik (< 1ms).",
              code: `-- ⚡ Buat B-Tree Index pada kolom Foreign Key dan filter pencarian:
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);`,
              language: "sql",
              caption: "Optimasi Query Database dengan B-Tree Index"
            },
            {
              label: "Otomasi Timestamp dengan PostgreSQL Triggers (updated_at)",
              text: "1. Stempel Waktu Atomik Sisi Database: Menghilangkan risiko ketidaksinkronan jam lokal server aplikasi dengan menyerahkan pencatatan waktu pembaruan langsung ke kernel database via `NOW()`.\n\n" +
                    "2. Fungsi Prosedural PL/pgSQL: Mendefinisikan fungsi trigger `BEFORE UPDATE` yang secara otomatis menyuntikkan nilai `NEW.updated_at = NOW()` tepat sebelum operasi penulisan disk dieksekusi.\n\n" +
                    "3. Zero Maintenance di Sisi Aplikasi: Developer tidak perlu lagi mengingat untuk menuliskan pembaruan timestamp di setiap query mutasi Server Actions; PostgreSQL mengelolanya secara otonom.",
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
              text: "1. Evolusi Arsitektur SDK Modern: Paket lama `@supabase/auth-helpers-nextjs` telah ditinggalkan (deprecated) karena keterikatan erat pada Next.js versi lama; paket resmi `@supabase/ssr` dirancang universal untuk App Router.\n\n" +
                    "2. Pola Cookie Adapter Generik: Mengabstraksi pembacaan dan penulisan token sesi melalui fungsi callback sederhana `getAll()` dan `setAll()` yang kompatibel di Server Components, Server Actions, dan Route Handlers.\n\n" +
                    "3. Isolasi Keamanan Sesi Pengguna: Menjaga token otentikasi JWT tetap aman di cookie HTTP-only tanpa risiko kebocoran data antar-permintaan pengguna di server.",
              code: `// Instalasi paket resmi terkini:
npm install @supabase/supabase-js @supabase/ssr`,
              language: "bash",
              caption: "Pemasangan Paket @supabase/ssr Resmi"
            },
            {
              label: "Breaking Change Next.js 16: await cookies() & Handler getAll() / setAll()",
              text: "1. Resolusi Asinkron Wajib: Pada Next.js 16, fungsi `cookies()` dari `'next/headers'` bertipe Promise asinkron dan WAJIB dipanggil dengan sintaks `const cookieStore = await cookies()`.\n\n" +
                    "2. Penanganan Error Streaming Server Component: Method `setAll()` dibungkus blok `try/catch` agar Server Component yang dieksekusi secara streaming tidak melempar runtime exception saat terjadi pembaruan token sesi.\n\n" +
                    "3. Sinkronisasi Sesi Otomatis: Memastikan rotasi token sesi JWT secara mulus disematkan ke header respon HTTP tanpa memerlukan intervensi manual developer.",
              code: `// src/utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // ⚡ Breaking Change Next.js 16: Wajib di-await!
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  // 🛡️ Mendukung Publishable Key (Supabase Baru) & Legacy Anon Key
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createServerClient(
    supabaseUrl,
    supabaseKey,
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
              text: "1. Klien Browser (`client.ts` - Singleton): Menggunakan `createBrowserClient` di Client Component (`'use client'`) yang berjalan sebagai singleton di memori peramban untuk otentikasi OAuth dan langganan WebSocket Realtime.\n\n" +
                    "2. Klien Server (`server.ts` - Per-Request Instance): Menggunakan `createServerClient` di Server Component dan Server Actions; instance dibuat baru per HTTP request dengan bundle 0 kB JS ke browser.\n\n" +
                    "3. Standar Kunci API Modern (Publishable Key vs Anon Key): Supabase resmi merekomendasikan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (`sb_publishable_...`) menggantikan legacy `anon` key (`eyJ...`). Gunakan pola dual-key fallback agar kode mahasiswa kebal terhadap perbedaan nama variabel di `.env.local`.",
              code: `// src/utils/supabase/client.ts ('use client')
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  // 🛡️ Mendukung Publishable Key (Supabase Baru) & Legacy Anon Key
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createBrowserClient(supabaseUrl, supabaseKey)
}`,
              language: "typescript",
              caption: "Utilitas Supabase Browser Client dengan Dual-Key Support"
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
              text: "1. Arsitektur 3 Tingkat Multi-Tenant: Hierarki data berjenjang `auth.users` ➔ `profiles` ➔ `projects` ➔ `tasks` yang memisahkan kepemilikan data antar pengguna secara tegas dan aman.\n\n" +
                    "2. Kunci Primer Kriptografis Terpadu: Seluruh tabel menggunakan `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` dengan relasi cascading `ON DELETE CASCADE`.\n\n" +
                    "3. Skalabilitas Snowballing Proyek: Skema 3 tabel ini menjadi pondasi kokoh yang akan terus dikembangkan dengan otentikasi OAuth (Minggu 5), filter pencarian (Minggu 6), dan upload media Cloudinary (Minggu 7).",
              code: `-- Skema Inti Proyek Akhir (The Serverless Odyssey)
-- 1. profiles: Entitas profil pengembang (akan disambungkan ke auth.users pada Minggu 5)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
              text: "1. Zero Human Error: Mengeliminasi penulisan manual interface TypeScript yang rawan typo dan sering tertinggal saat skema PostgreSQL mengalami perubahan struktur.\n\n" +
                    "2. Eksekusi CLI Satu Perintah: Perintah `npx supabase gen types typescript` secara otomatis mengompilasi seluruh tabel, kolom, enum, dan fungsi PostgreSQL menjadi file tipe statis `src/types/database.types.ts`.\n\n" +
                    "3. End-to-End Type Safety & Autocomplete: Memberikan bantuan IntelliSense 100% akurat di VS Code untuk operasi `select()`, `insert()`, `update()`, dan `delete()`, mencegah error nama kolom sejak masa pengetikan.",
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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  // 🛡️ Mendukung Publishable Key (Quickstart Baru) & Legacy Anon Key
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createServerClient(supabaseUrl, supabaseKey, {
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
  })
}`,
          language: "typescript",
          explanation: "Perhatikan baris 'const cookieStore = await cookies()' (Next.js 16) serta baris fallback supabaseKey yang mendukung format Publishable Key baru maupun Anon Key lama dari .env.local."
        },
        {
          stepNumber: 3,
          instruction: "Konfigurasi Utilitas Klien Browser di src/utils/supabase/client.ts",
          code: `import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  // 🛡️ Mendukung Publishable Key (Quickstart Baru) & Legacy Anon Key
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createBrowserClient(supabaseUrl, supabaseKey)
}`,
          language: "typescript",
          explanation: "Fungsi ini digunakan di Client Component ('use client'). Pola fallback menjamin koneksi berhasil baik menggunakan token Publishable Key (sb_publishable_...) maupun Anon Key (JWT eyJ...)."
        },
        {
          stepNumber: 4,
          instruction: "Eksekusi Script SQL Skema 3 Tabel di Supabase SQL Editor",
          code: `-- Buka Dashboard Supabase -> SQL Editor -> Tempel Script Ini:
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
          explanation: "Script SQL ini membangun fondasi 3 tabel relasional Proyek Akhir lengkap dengan UUID v4, relasi cascading, check constraints, dan B-Tree index tanpa ketergantungan pada auth.users (autentikasi dibahas di Minggu 5)."
        },
        {
          stepNumber: 5,
          instruction: "Eksekusi Seed Data Contoh & Verifikasi Relasi Multi-Tabel di Supabase SQL Editor",
          code: `-- ====================================================================
-- SEED DATA CONTOH (Jalankan di Supabase SQL Editor setelah DDL dibuat)
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
    'Pembangunan microservices backend Next.js 16 dan Supabase PostgreSQL untuk toko online modern.',
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
GROUP BY p.id, p.title, pr.full_name, p.budget;`,
          language: "sql",
          explanation: "Query seed ini murni mengisi 3 tabel aplikasi (profiles, projects, tasks) tanpa perlu menyentuh tabel internal auth.users (materi autentikasi dipelajari di Minggu 5). Data ini langsung bisa dibaca dan ditampilkan secara publik di Next.js Server Component tanpa perlu login!"
        },
        {
          stepNumber: 6,
          instruction: "Generasi Kontrak Tipe TypeScript & Verifikasi Koneksi RSC (src/types/database.types.ts)",
          code: `# 1. Jalankan Typegen via Supabase CLI di terminal:
npx supabase gen types typescript --project-id <your-project-id> > src/types/database.types.ts

# 2. Verifikasi pemanggilan di Server Component (src/app/page.tsx):
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/types/database.types";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, title, description, budget, tasks(id, title, status)");

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-xl font-bold">Daftar Proyek Serverless ({projects?.length ?? 0})</h1>
      {projects?.map((proj) => (
        <div key={proj.id} className="p-4 border rounded-xl">
          <h2 className="font-semibold text-lg">{proj.title}</h2>
          <p className="text-sm text-gray-500">{proj.description}</p>
          <p className="text-xs font-mono text-emerald-600">Anggaran: Rp {Number(proj.budget).toLocaleString("id-ID")}</p>
          <p className="text-xs text-gray-400 mt-2">Jumlah Tugas: {proj.tasks?.length ?? 0} Item</p>
        </div>
      ))}
    </div>
  );
}`,
          language: "tsx",
          explanation: "Karena data seed telah dimasukkan pada Langkah 5, Server Component sekarang langsung menampilkan 3 proyek beserta relasi tugasnya secara nyata (bukan 0 proyek kosong)!"
        }
      ],
      aiPromptTemplate: {
        role: "Senior Database Architect & Supabase Specialist",
        prompt: `Bertindaklah sebagai Senior Database Architect & Supabase Specialist.

Saya sedang menginisiasi repositori Proyek Akhir perkuliahan "The Serverless Odyssey" menggunakan Next.js 16 App Router, Tailwind CSS v4, dan Supabase PostgreSQL. Desain antarmuka landing page harus memiliki estetika premium (modern typography, subtle gradients, border semantik, dan status badge interaktif).

Instruksi Pengerjaan:
1. Periksa ketersediaan dependensi '@supabase/supabase-js' dan '@supabase/ssr'. Jika belum terpasang, eksekusi CLI terminal berikut secara otomatis:
   npm install @supabase/supabase-js @supabase/ssr

2. Rakitlah arsitektur 5 berkas modular terintegrasi yang saling terhubung:
   - Berkas 1: 'src/utils/supabase/server.ts' (Server Client)
     Gunakan 'createServerClient' dari '@supabase/ssr' dengan implementasi async cookies Next.js 16 ('const cookieStore = await cookies()') yang membaca 'getAll()' dan menyetel 'setAll()' dalam blok try/catch. Wajib mendukung dual-key fallback ('process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!').
   - Berkas 2: 'src/utils/supabase/client.ts' (Browser Client 'use client')
     Gunakan 'createBrowserClient' dari '@supabase/ssr' membaca NEXT_PUBLIC_SUPABASE_URL dan dual-key fallback ('process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!').
   - Berkas 3: 'supabase/migrations/01_initial_schema.sql' (DDL PostgreSQL & Seed Data Contoh)
     Rancang skema relasional 3 tabel: 'profiles' (UUID v4 mandiri 'gen_random_uuid()', akan disambungkan ke auth.users pada Minggu 5), 'projects' (FK profiles), dan 'tasks' (FK projects). Seluruh tabel wajib menggunakan UUID v4 ('gen_random_uuid()'), foreign key 'ON DELETE CASCADE', CHECK constraints untuk validasi logika (misal budget >= 0 dan enum status: todo/in_progress/done), B-Tree indexes pada foreign key, serta trigger fungsi PL/pgSQL otomatis untuk kolom 'updated_at'.
     Wajib sertakan pula query INSERT seed data contoh yang realistis (1 profil pengembang, 3 proyek serverless lengkap dengan deskripsi & budget, serta 6 tasks berelasi dengan klausa ON CONFLICT DO NOTHING) tanpa menyentuh tabel internal auth.users agar database langsung terisi data hidup untuk verifikasi cepat tanpa login!
   - Berkas 4: 'src/types/database.types.ts' (TypeScript Definitions)
     Definisikan interface tipe data 'Database' lengkap (Tables, Row, Insert, Update, Enums) yang merefleksikan 100% skema 3 tabel di atas tanpa tipe 'any'.
   - Berkas 5: 'src/app/page.tsx' (Root Landing Page - Root Navigation Rule)
     Perbarui halaman utama (/) dengan tampilan Hero modern: badge status koneksi Supabase terverifikasi, arsitektur skema 3 tabel, kartu metrik proyek, daftar proyek real-time dari database hasil seed data, dan tombol Call-to-Action (CTA) "Buka Dashboard Tugas" yang menghubungkan navigasi langsung ke rute "/tasks".

Batasan Teknis Wajib:
- DILARANG menggunakan paket deprecated '@supabase/auth-helpers-nextjs'.
- Wajib menggunakan async cookies 'await cookies()' sesuai standar Next.js 16.
- Dilarang mengimpor 'server.ts' di Client Component.
- Seluruh input dan query wajib type-safe 100% menggunakan tipe dari 'database.types.ts' (0 tipe 'any').
- Desain antarmuka landing page wajib PREMIUM: gunakan token semantik Tailwind (bg-card, text-card-foreground, border-border) yang adaptif terhadap Dark Mode dan Light Mode.
- Kode yang dihasilkan harus utuh, fungsional, dan siap jalan tanpa placeholder komentar singkatan.`,
        tip: "Formula prompt All-in-One ini otomatis menginstal SDK Supabase via CLI jika belum ada, lalu merakit 5 berkas arsitektur database Supabase SSR lengkap dengan DDL dan seed data contoh realistis yang 100% menuntaskan Definition of Done Misi Minggu 4."
      },
      warningZone: {
        title: "Zona Bahaya: Menghapus Tabel Tanpa Backup di Supabase!",
        desc: "Perintah DROP TABLE CASCADE akan menghapus seluruh data dan tabel yang berelasi secara permanen. Selalu lakukan perancangan skema secara hati-hati di SQL Editor sebelum memasukkan data nyata."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 4: Inisiasi Repositori Final & Migrasi Database Relasional",
      taskDesc: "Inisiasi repositori resmi Proyek Akhir Anda, amankan kredensial Supabase di .env.local, dan jalankan migrasi 3 tabel relasional beserta seed data contoh di Supabase SQL Editor.",
      definitionOfDone: [
        "Kredensial Supabase (NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY / ANON_KEY) terkonfigurasi di .env.local",
        "Paket resmi @supabase/supabase-js dan @supabase/ssr terpasang tanpa dependensi usang auth-helpers",
        "Utilitas Supabase SSR (server.ts dengan await cookies() Next.js 16 dan client.ts) aktif di src/utils/supabase/",
        "Skema DDL 3 tabel (profiles, projects, tasks) berhasil dimigrasikan ke Supabase dengan UUID, FK Cascading, dan B-Tree index",
        "Seed data contoh (1 profil, 3 projects, 6 tasks) sukses dieksekusi di database dan berhasil ditampilkan di Next.js Server Components tanpa login",
        "Berkas kontrak tipe src/types/database.types.ts siap pakai dan halaman landing root / memiliki kartu navigasi arsitektur database"
      ],
      gitBranchTask: "git checkout -b feature/supabase-database-schema"
    },
    quiz: {
      totalQuestions: 7,
      passingScore: 80,
      questions: [
        {
          id: 1,
          question: "Jelaskan mengapa sistem cloud terdistribusi dan aplikasi modern seperti 'The Serverless Odyssey' lebih memilih UUID v4 (gen_random_uuid()) sebagai Primary Key daripada serial integer (SERIAL 1, 2, 3...)! Sebutkan minimal 2 implikasi keamanannya!",
          rubric: "Mahasiswa harus menjelaskan mitigasi serangan ID enumeration (mencegah perayapan ID berurutan), pencegahan tabrakan ID (zero collision) di arsitektur multi-node/edge, dan perlindungan kerahasiaan metrik volume bisnis.",
          keyConcepts: ["UUID v4", "anti-enumeration attack", "zero collision terdistribusi", "gen_random_uuid()", "business metrics privacy"],
          weight: 15,
          socraticHint: "Apa yang terjadi jika peretas melihat URL /api/orders/100? Apakah peretas bisa menebak bahwa order nomor 99 dan 101 ada? Bagaimana UUID mencegah tebakan tersebut?"
        },
        {
          id: 2,
          question: "Dalam perancangan relasi 1:N (One-to-Many) antara tabel projects dan tasks, jelaskan perbedaan mendasar perilaku sistem jika Anda menggunakan ON DELETE CASCADE dibandingkan ON DELETE RESTRICT saat entitas induk (project) dihapus!",
          rubric: "Mahasiswa harus menjelaskan bahwa ON DELETE CASCADE otomatis menghapus data anak (child tasks) untuk mencegah data yatim (orphan records), sedangkan RESTRICT memblokir penghapusan entitas induk jika masih ada relasi aktif demi mencegah kehilangan data tidak sengaja.",
          keyConcepts: ["ON DELETE CASCADE", "ON DELETE RESTRICT", "referential integrity", "orphan data prevention", "foreign key constraint"],
          weight: 15,
          socraticHint: "Jika seorang manajer menghapus sebuah proyek, apa yang terjadi pada 50 tugas di dalamnya jika tidak ada aturan CASCADE? Kapan kita justru ingin database menolak penghapusan proyek?"
        },
        {
          id: 3,
          question: "Mengapa relasi Many-to-Many (M:N) antara tasks dan tags tidak boleh disimpan sebagai kolom array/string di tabel tasks? Jelaskan peran junction table dan alasan penggunaan Composite Primary Key PRIMARY KEY (task_id, tag_id)!",
          rubric: "Mahasiswa harus menjelaskan pelanggaran 1NF pada kolom array, peran junction table memecah relasi M:N menjadi dua relasi 1:N yang ternormalisasi, dan peran Composite PK menjamin tidak ada duplikasi tag ganda pada satu task di level storage engine.",
          keyConcepts: ["relasi M:N", "junction table", "composite primary key", "1NF normalisasi", "anti-duplikasi tag"],
          weight: 15,
          socraticHint: "Bagaimana Anda mencegah seorang pengguna menambahkan label 'Bug' dua kali pada tugas yang sama langsung dari level integritas database tanpa mengandalkan validasi if-else di backend?"
        },
        {
          id: 4,
          question: "Jika aplikasi Anda sudah memvalidasi input formulir menggunakan Zod di Server Action, mengapa Anda tetap wajib mendefinisikan constraint CHECK (seperti CHECK (priority IN ('low', 'medium', 'high'))) di level skema PostgreSQL?",
          rubric: "Mahasiswa harus menjelaskan prinsip 'Defense in Depth': Zod memvalidasi input aplikasi web, sedangkan constraint CHECK di database menjamin integritas data absolut dari sumber manapun (Direct SQL, script migrasi, background worker, API service lain).",
          keyConcepts: ["defense in depth", "CHECK constraint", "integritas data absolut", "multi-client consistency", "storage engine enforcement"],
          weight: 15,
          socraticHint: "Bayangkan rekan tim Anda memasukkan data langsung lewat Supabase SQL Editor atau DBeaver tanpa melalui form Next.js. Apa yang menjamin kolom priority tidak terisi nilai sembarangan seperti 'urgent_banget'?"
        },
        {
          id: 5,
          question: "Secara default, PostgreSQL tidak otomatis membuat index pada kolom Foreign Key (misal: tasks.project_id). Jelaskan dampak ketiadaan index ini terhadap performa query saat tabel memiliki ratusan ribu baris, dan bagaimana B-Tree Index mengubah kompleksitas pencariannya!",
          rubric: "Mahasiswa harus menjelaskan bahwa ketiadaan index memaksa Sequential Scan O(N) yang membaca seluruh disk block. B-Tree Index memangkas kompleksitas menjadi O(log N), mempercepat operasi JOIN dan klausul WHERE secara drastis.",
          keyConcepts: ["B-Tree index", "sequential scan O(N)", "O(log N)", "foreign key index", "optimasi JOIN"],
          weight: 15,
          socraticHint: "Berapa banyak operasi baca yang dibutuhkan database untuk mencari task milik proyek tertentu dalam tabel 1 juta baris jika harus membaca satu per satu (Sequential) dibanding struktur pohon seimbang (B-Tree)?"
        },
        {
          id: 6,
          question: "Mengapa otomatisasi kolom updated_at lebih baik ditangani menggunakan PostgreSQL Trigger dan Stored Procedure daripada mengandalkan kode backend JavaScript (new Date().toISOString()) pada setiap operasi UPDATE?",
          rubric: "Mahasiswa harus menjelaskan konsistensi waktu tunggal (single source of truth dari database clock), eliminasi human error lupa memperbarui timestamp di backend, dan penegakan audit trail universal untuk semua jalur mutasi data.",
          keyConcepts: ["PostgreSQL triggers", "stored procedure", "clock skew consistency", "single source of truth", "audit trail otomatis"],
          weight: 10,
          socraticHint: "Apa yang terjadi jika ada 5 developer berbeda membuat fungsi update data, dan salah satu developer lupa menuliskan baris pembaruan waktu di kodenya?"
        },
        {
          id: 7,
          question: "Mengapa Next.js 16 mewajibkan await cookies() saat menginisialisasi Supabase Server Client di src/utils/supabase/server.ts, dan bagaimana arsitektur @supabase/ssr mengelola token sesi JWT secara aman di lingkungan Server Component vs Server Action?",
          rubric: "Mahasiswa harus menjelaskan perubahan async cookies pada Next.js 16 untuk streaming/concurrent rendering, serta pemisahan hak akses: Server Component bersifat read-only untuk membaca token httpOnly, sedangkan Server Action/Middleware memiliki hak modifikasi cookie untuk refresh token, melindungi JWT dari pencurian via XSS.",
          keyConcepts: ["Next.js 16 await cookies()", "@supabase/ssr", "httpOnly cookies", "Server Component vs Server Action", "anti-XSS JWT"],
          weight: 15,
          socraticHint: "Mengapa menyimpan token JWT login di localStorage browser dianggap berbahaya terhadap serangan XSS? Mengapa Server Component di App Router hanya boleh membaca (get) cookie dan tidak boleh mengubah (set) cookie?"
        }
      ]
    }
  },
  {
    id: 5,
    worldId: "world-1",
    worldTitle: "Dunia 1: Fondasi & Backend Serverless",
    weekNumber: 5,
    title: "Autentikasi & Otorisasi Pengguna: Multi-Provider Unified Portal & Next.js 16 Proxy",
    subtitle: "Spektrum 5 model autentikasi, implementasi Unified Auth Portal (GitHub OAuth 1-Click, Email/Password, Magic Link), Next.js 16 Proxy (Evolusi Middleware), dan PostgreSQL Trigger sync.",
    cpmk: "Mahasiswa mampu menganalisis 5 model autentikasi industri (ID Institusi, Email/Password, Social OAuth, Passwordless, Enterprise SSO), merancang Unified Auth Portal multi-provider, memproteksi rute privat via Next.js 16 Proxy (src/proxy.ts), serta mengotomasi sinkronisasi profil pengguna menggunakan PostgreSQL Triggers.",
    cpmkPoints: [
      {
        code: "CPMK 5.1",
        badge: "Analisis & Taksonomi",
        title: "Analisis Spektrum 5 Model Autentikasi Industri",
        desc: "Menganalisis karakteristik arsitektur, matriks use-case, dan trade-off keamanan dari 5 model: `ID Institusi (NIM/NIDN)`, `Email & Password`, `Social OAuth 2.0 (GitHub)`, `Passwordless (Magic Link)`, dan `Enterprise SSO`.",
        keywords: ["5 Model Autentikasi", "Decision Matrix", "Social OAuth 2.0", "Passwordless", "Trade-off Keamanan"]
      },
      {
        code: "CPMK 5.2",
        badge: "Arsitektur UI/UX",
        title: "Perancangan Unified Auth Portal Multi-Provider",
        desc: "Merancang dan mengimplementasikan antarmuka login terpadu satu pintu (Unified Portal) yang memadukan tombol `1-Click GitHub OAuth` di tingkat atas dengan tab kredensial `Email/Password` dan `Magic Link OTP` di tingkat bawah.",
        keywords: ["Unified Auth Portal", "1-Click GitHub OAuth", "Multi-Provider UI", "Magic Link OTP"]
      },
      {
        code: "CPMK 5.3",
        badge: "Batas Jaringan & Proxy",
        title: "Proteksi Rute Privat & Refresh Sesi via Next.js 16 Proxy",
        desc: "Mengamankan rute privat `/dashboard` menggunakan konvensi resmi `Next.js 16 Proxy` (`src/proxy.ts` yang menggantikan `middleware.ts`), menegakkan verifikasi resmi `getUser()` untuk menangkal stale session, serta menyinkronkan `Dual-Cookie`.",
        keywords: ["Next.js 16 Proxy", "src/proxy.ts", "getUser()", "Dual-Cookie Sync", "Route Protection"]
      },
      {
        code: "CPMK 5.4",
        badge: "Integritas Database",
        title: "Otomasi Sinkronisasi Profil Pengguna via PostgreSQL Triggers",
        desc: "Menegakkan pemisahan skema terisolasi antara `auth.users` (kredensial privat) dan `public.profiles` (data domain aplikasi) secara atomik menggunakan `PostgreSQL Triggers` dan fungsi `PL/pgSQL`.",
        keywords: ["PostgreSQL Triggers", "PL/pgSQL", "auth.users vs public.profiles", "Atomic Sync"]
      }
    ],
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 350,
    concepts: {
      summary: "Sistem autentikasi modern serverless mengombinasikan multi-provider Supabase Auth (GitHub OAuth 2.0, Email & Password, serta Passwordless Magic Link) dengan token sesi Stateless JWT RFC 7519. Proteksi rute ditegakkan di batas jaringan aplikasi melalui Next.js 16 Proxy (src/proxy.ts) yang me-refresh token secara transparan via updateSession() serta mengisolasi profil pengguna di tabel PostgreSQL dengan trigger otomatis on_auth_user_created.",
      points: [
        { title: "Spektrum Model Autentikasi & Decision Framework", desc: "Menganalisis 5 model autentikasi industri (ID Institusi NIM/NIP, Email & Password, Social OAuth, Passwordless, Enterprise SSO) beserta matriks use-case dan profil risikonya." },
        { title: "Stateless JWT & GitHub OAuth 2.0 Code Flow", desc: "Verifikasi identitas pengguna menggunakan token kriptografis HMAC-SHA256 tanpa lookup database berulang, serta alur pertukaran kode otorisasi 6 langkah GitHub." },
        { title: "Next.js 16 Proxy & Dual-Cookie Session Sync", desc: "Intersepsi rute pada layer Proxy (src/proxy.ts) menggunakan getUser() resmi untuk menangkal token basi, menyinkronkan request.cookies dan response.cookies secara simultan." },
        { title: "Pemisahan Skema auth.users vs public.profiles", desc: "Isolasi kredensial internal Supabase dengan data domain aplikasi, disinkronkan secara atomik via PostgreSQL BEFORE/AFTER INSERT Triggers." }
      ],
      diagramNote: "Browser (Unified Auth Portal) ➔ Route Handler (/auth/callback) ➔ Supabase Auth (Exchange Code to JWT) ➔ Next.js 16 Proxy (getUser() Refresher) ➔ PostgreSQL Trigger (public.profiles Sync)",
      deepDiveSections: [
        {
          title: "1. Spektrum Model Autentikasi Modern & Arsitektur Supabase Auth Engine",
          badge: "Pilar 1: Fondasi Autentikasi & Spektrum Model",
          content: "Autentikasi adalah pembuktian 'Siapa Anda', sedangkan Otorisasi adalah 'Apa yang boleh Anda akses'. Pada arsitektur Serverless yang scale-to-zero, pemilihan model autentikasi harus mempertimbangkan kenyamanan pengguna, liabilitas hukum keamanan data, dan karakteristik infrastruktur cloud.",
          subpoints: [
            {
              label: "Dekonstruksi 5 Model Autentikasi Industri & Use Case Nyata",
              text: "1. Model ID Internal Institusi (NIM, NIDN, NIP, NIK): Beroperasi pada jaringan tertutup (*Gated/Closed System* — sistem terproteksi di mana pendaftaran akun ditutup untuk umum dan hanya diterbitkan secara terpusat oleh administrator kampus/organisasi). Keunggulannya adalah *Zero Third-Party Dependency* (bebas 100% dari ketergantungan API atau uptime vendor eksternal) dan verifikasi identitas fisik terjamin. Menggunakan pengacakan *Bcrypt 10 salt rounds* ($2^{10} = 1024$ iterasi hashing komputasi lambat) untuk menangkal serangan pencocokan kata sandi.\n\n" +
                    "2. Model Email & Password Konvensional: Standar universal aplikasi B2C publik dan e-commerce. Membawa *Password Liability* (beban tanggung jawab hukum, finansial, dan reputasi yang dipikul pengembang aplikasi jika database pengguna bocor). Sangat rentan terhadap *Credential Stuffing* (serangan otomatis peretas yang menguji jutaan kombinasi email & password hasil kebocoran situs lain) dan *Rainbow Table Attack* (pencocokan hash terhadap tabel kamus pra-kalkulasi) akibat kebiasaan pengguna mendaur ulang satu sandi untuk banyak akun.\n\n" +
                    "3. Model Social Login / Federated Identity (OAuth 2.0 - GitHub, Google, Apple): Pendelegasian pembuktian identitas ke penyedia pihak ketiga terpercaya tanpa aplikasi pernah mengetahui kata sandi pengguna. Menghadirkan *Zero Friction* (pengalaman pendaftaran 1-klik tanpa mengisi formulir bertele-tele, menaikkan tingkat konversi pengguna baru hingga 40-50%) dan *Zero Password Liability* (bebas 100% dari risiko kebocoran kata sandi karena server aplikasi sama sekali tidak menyimpan string kata sandi).\n\n" +
                    "4. Model Passwordless (Magic Link Email & OTP WhatsApp/SMS): Metode masuk tanpa kata sandi menggunakan *Time-Based Single-Use Token* (token kriptografis unik satu kali pakai berbatas waktu 10-15 menit). Mengeliminasi fenomena *Password Fatigue* (kelelahan kognitif dan frustrasi mental pengguna akibat keharusan menghafal puluhan kata sandi rumit di internet), namun memiliki trade-off latensi antrean pengiriman email SMTP dan biaya SMS/WhatsApp API per pesan.\n\n" +
                    "5. Model Enterprise Single Sign-On (SSO / SAML 2.0 / OIDC): Standar korporasi B2B (Okta, Microsoft Entra ID) di mana satu kredensial akun kantor digunakan untuk mengakses puluhan aplikasi kerja sekaligus. Memungkinkan *Instant Access Revocation / Centralized De-provisioning* (kemampuan administrator IT untuk mencabut hak akses seluruh aplikasi karyawan yang keluar dalam 1 klik di direktori pusat tanpa harus membuka aplikasi satu per satu).",
              code: `// Spektrum Perbandingan Implementasi di Supabase Auth SDK:
// 1. Social OAuth (GitHub 1-Click)
await supabase.auth.signInWithOAuth({ provider: 'github' });

// 2. Email & Password Tradisional
await supabase.auth.signInWithPassword({ email, password });

// 3. Passwordless Magic Link (OTP Token)
await supabase.auth.signInWithOtp({ email });`,
              language: "typescript",
              caption: "Panggilan SDK Supabase untuk 3 Model Autentikasi Utama"
            },
            {
              label: "Stateful Session vs Stateless JWT (JSON Web Tokens RFC 7519)",
              text: "1. Keterbatasan Stateful Session di Arsitektur Serverless: *Stateful Session* adalah model autentikasi tradisional di mana server menyimpan status sesi aktif di memori RAM atau basis data pusat (misal Redis), dan peramban hanya menyimpan Session ID di cookie. Pada arsitektur Serverless yang memiliki sifat *Scale-to-Zero* (kontainer mati saat tidak ada request dan menyala instan saat request baru tiba) dan *No Shared In-Memory State* (tidak ada memori RAM bersama antar-kontainer yang hidup-mati), stateful session memicu *Connection Exhaustion* (kehabisan batas koneksi database akibat ribuan fungsi serverless membuka koneksi mandiri secara bersamaan) serta latensi tinggi saat *Cold Starts*.\n\n" +
                    "2. Dekonstruksi Kriptografis Stateless JWT (RFC 7519): *Stateless JWT* adalah format token string kompak mandiri (*self-contained*) dengan struktur tiga bagian: `Header.Payload.Signature`. Serverless Function memverifikasi keaslian identitas secara instan tanpa perlu kueri database berulang, cukup dengan memvalidasi tanda tangan kriptografis (*Tamper-Proof HMAC-SHA256 Signature*) menggunakan kunci rahasia `JWT_SECRET`. Jika seorang penyerang memanipulasi klaim Payload (misalnya mengubah `role: student` menjadi `role: admin`), kalkulasi signature otomatis tidak cocok dan token ditolak seketika.\n\n" +
                    "3. Masa Aktif Pendek & Refresh Token Rotation: Untuk meminimalkan risiko jika token dicuri, *Access Token* memiliki masa aktif singkat (misal 3600 detik / 1 jam). Pembaruan sesi dilakukan melalui *Refresh Token Rotation* (mekanisme keamanan di mana Refresh Token lama langsung hangus seketika begitu ditukarkan untuk memperoleh pasangan token baru), menjamin token curian tidak dapat digunakan berulang kali (*replay attack prevention*).",
              code: `// Anatomi JSON Web Token (Base64URL Decoded):
// 1. HEADER (Algoritma & Tipe)
{ "alg": "HS256", "typ": "JWT" }

// 2. PAYLOAD (Klaim Identitas Pengguna - auth.uid())
{
  "sub": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "email": "mahasiswa@kampus.ac.id",
  "role": "authenticated",
  "exp": 1716986000
}

// 3. SIGNATURE (Integritas Kriptografis Anti-Manipulasi)
// HMACSHA256(base64(header) + "." + base64(payload), JWT_SECRET)`,
              language: "typescript",
              caption: "Anatomi Tiga Bagian Kriptografis JSON Web Token (JWT)"
            },
            {
              label: "Matriks Keputusan Arsitektur Autentikasi (Architecture Decision Framework)",
              text: "1. Architecture Decision Framework (Kerangka Keputusan Arsitektur): Pendekatan sistematis untuk memilih metode autentikasi berdasarkan evaluasi tiga dimensi: *Trust Domain* (apakah pengguna dari lingkungan internal terpercaya atau publik umum), *Threat Model* (vektor ancaman dan nilai aset data yang dilindungi), serta *User Friction* (kemudahan pendaftaran pengguna). Memilih metode yang salah memicu *User Drop-Off Rate* tinggi (calon pengguna membatalkan pendaftaran karena proses pengisian formulir yang lambat dan rumit).\n\n" +
                    "2. Pendekatan Hibrida (Unified Auth Hub): Standar industri terbaik yang memadukan beberapa model autentikasi dalam satu antarmuka terpadu—menempatkan tombol Social OAuth di posisi teratas untuk efisiensi *Zero Friction*, didampingi pilihan tab Email/Password konvensional dan Magic Link untuk pengguna yang memerlukan privasi atau fleksibilitas tanpa akun pihak ketiga.\n\n" +
                    "3. Normalisasi Identitas Terpusat: Seluruh variasi metode login pada antarmuka dinormalisasi oleh Supabase GoTrue Auth Engine menjadi satu representasi entitas pengguna tunggal (`UUID v4` di `auth.users`), menjamin konsistensi integrasi ke seluruh tabel domain aplikasi.",
              code: `// Matriks Evaluasi Arsitektur Autentikasi:
// • Developer SaaS (Vercel/Railway) ➔ GitHub OAuth (Wajib) + Email
// • Mass Consumer Web (Canva/Spotify) ➔ Google OAuth + Email/Password
// • Mobile FinTech (GoPay/OVO)        ➔ Phone OTP + Biometrik
// • Academic / LMS Internal           ➔ NIM / NIDN (Closed System)
// • Corporate Enterprise (B2B SaaS)   ➔ SAML SSO / Okta`,
              language: "typescript",
              caption: "Panduan Keputusan Arsitektur Autentikasi Berdasarkan Domain"
            }
          ],
          comparisonTable: {
            headers: ["Model Autentikasi", "Target Domain Utama", "Tingkat Friksi User", "Liabilitas Password", "Rekomendasi Terbaik"],
            rows: [
              ["ID Institusi (NIM/NIDN)", "SIAKAD Kampus & Internal RS", "Rendah (Sudah terdaftar)", "Dikelola admin internal", "Sistem tertutup / evaluasi nilai"],
              ["Email & Password", "E-Commerce publik & forum B2C", "Sedang (Isi form & ingat sandi)", "Tinggi (Rawan kebocoran hash)", "Situs publik umum"],
              ["Social OAuth 2.0 (GitHub)", "Developer tools & SaaS modern", "Sangat Rendah (1-Klik)", "NOL (Dikelola GitHub/Google)", "Aplikasi portofolio & tech stack"],
              ["Passwordless (Magic Link)", "Notion, Substack, Slack", "Rendah (Tanpa password)", "NOL (Token acak sekali pakai)", "Aplikasi pembacaan & konten"],
              ["Enterprise SSO (SAML/OIDC)", "Korporasi multinasional & B2B", "Sangat Rendah (SSO Kantor)", "NOL (Dikelola Okta/Azure AD)", "Aplikasi enterprise skala besar"]
            ]
          },
          callout: {
            type: "tip",
            title: "💡 Prinsip Desain Industri: Terapkan Pola Unified Auth Portal",
            text: "Jangan memaksa pengguna hanya memiliki 1 cara masuk. Sediakan tombol Social OAuth (GitHub) di bagian atas untuk 1-klik instan, disertai pilihan tab Email/Password dan Magic Link di bawahnya untuk fleksibilitas maksimal."
          }
        },
        {
          title: "2. Protokol OAuth 2.0 Authorization Code Flow & Passwordless",
          badge: "Pilar 2: Protokol Delegasi Identitas",
          content: "OAuth 2.0 adalah protokol standar industri untuk otorisasi yang memungkinkan aplikasi mengakses identitas pengguna di penyedia pihak ketiga tanpa pernah meminta atau menyimpan kata sandi pengguna.",
          subpoints: [
            {
              label: "Alur Kerja 6 Langkah GitHub OAuth 2.0 Authorization Code Flow",
              text: "1. Authorization Code Grant vs Implicit Flow: Protokol pertukaran izin akses standar industri di mana peramban klien HANYA menerima kode otorisasi sementara (*temporary code* dengan masa berlaku ketat 10 menit), BUKAN access token langsung. Mekanisme ini mengeliminasi risiko *URL Hash Leakage* (kebocoran token di riwayat peramban atau log proksi yang sering terjadi pada model usang *Implicit Flow*).\n\n" +
                    "2. Komunikasi Saluran Privat Server-ke-Server (*Backchannel Communication*): Kode otorisasi sementara dikirimkan via URL callback ke Route Handler backend (`/auth/callback`). Backend kemudian melakukan pertukaran langsung (*backchannel*) ke server Supabase/GitHub menggunakan `Client Secret` (kunci rahasia aplikasi yang hanya disimpan di environment variable server dan haram dibocorkan ke browser bundle) melalui saluran HTTPS terenkripsi untuk mendapatkan token JWT asli.\n\n" +
                    "3. Pembatasan Hak Akses (*OAuth Scopes*): Aplikasi menerapkan prinsip *least privilege* dengan meminta cakupan izin minimal dari akun GitHub pengguna (misal hanya profil publik `read:user` dan alamat email primer `user:email`), menjamin privasi pengguna tetap aman tanpa akses ke repositori privat.",
              code: `// Inisiasi Login OAuth GitHub dari Client Component
"use client";

import { createClient } from "@/utils/supabase/client";

export function LoginGithubButton() {
  const handleGithubLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        // Callback URL yang menangani penukaran kode sementara
        redirectTo: \`\${window.location.origin}/auth/callback\`
      }
    });
  };

  return <button onClick={handleGithubLogin}>Masuk dengan GitHub</button>;
}`,
              language: "typescript",
              caption: "Inisiasi GitHub OAuth Flow via Supabase Browser Client"
            },
            {
              label: "Email Magic Link & Passwordless Authentication",
              text: "1. Passwordless Authentication (Autentikasi Tanpa Sandi): Metode pembuktian identitas tanpa menggunakan kata sandi sama sekali, mengeliminasi 100% risiko serangan *Credential Stuffing* dan bahaya kebocoran hash kata sandi pada basis data aplikasi.\n\n" +
                    "2. Mekanisme Time-Based Single-Use Token (Nonce): Supabase Auth membangkitkan token acak kriptografis sekali pakai (*Number Used Once / Nonce*) dengan masa berlaku 10–15 menit, lalu menyematkannya ke dalam URL tautan unik (*magic link*). Begitu tautan diklik satu kali, token langsung hangus secara permanen di server, mencegah serangan pemutaran ulang (*replay attack*).\n\n" +
                    "3. Verifikasi Jalur Luar (*Out-of-Band Verification*): Mengonfirmasi kepemilikan akun melalui kanal komunikasi sekunder (kotak masuk email pribadi pengguna). Proses ini secara otomatis memvalidasi bahwa email tersebut benar-benar aktif dan dapat diakses oleh pemiliknya tanpa memerlukan alur verifikasi email terpisah yang memakan waktu.",
              code: `// Mengirimkan Tautan Ajaib (Magic Link) via Server Action
import { createClient } from "@/utils/supabase/server";

export async function sendMagicLinkAction(email: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: \`\${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback\`
    }
  });

  if (error) return { success: false, message: error.message };
  return { success: true, message: "Tautan login telah dikirim ke email Anda!" };
}`,
              language: "typescript",
              caption: "Pengiriman Passwordless Magic Link via Server Action"
            },
            {
              label: "Unified Auth Portal: Arsitektur Multi-Provider Terintegrasi",
              text: "1. Desain Antarmuka Multi-Provider Terpadu (*Unified Multi-Provider Interface*): Antarmuka masuk tunggal yang memadukan tombol 1-klik GitHub OAuth di posisi teratas (memaksimalkan konversi *Zero Friction*) dan tab switcher di bawahnya yang memungkinkan pengguna berpindah mulus antara formulir Email/Password konvensional dan Magic Link.\n\n" +
                    "2. Normalisasi Mesin GoTrue (@supabase/ssr): Mesin autentikasi Supabase menyatukan seluruh metode masuk yang berbeda ke dalam satu model sesi terpadu berbasis Stateless JWT (`sb-access-token` dan `sb-refresh-token`), sehingga lapisan otorisasi backend dan Proxy memperlakukan sesi pengguna secara identik tanpa perkecualian.\n\n" +
                    "3. Reaktivitas Status & Validasi Zod: Validasi skema input formulir di sisi klien dan server menggunakan pustaka Zod, didukung oleh komponen reaktif Shadcn UI yang menampilkan status loading, animasi spinner, dan umpan balik kesalahan secara real-time.",
              code: `// Struktur Logika Unified Auth Portal (src/components/auth/unified-auth-card.tsx)
<Card className="max-w-md mx-auto p-6 backdrop-blur-md">
  {/* Opsi 1: 1-Click Social Login */}
  <Button onClick={loginWithGithub} className="w-full gap-2">
    <GithubIcon className="w-4 h-4" /> Masuk dengan GitHub
  </Button>
  
  <Separator text="Atau pilih metode kredensial" />
  
  {/* Opsi 2 & 3: Tab Switcher Kredensial */}
  <Tabs defaultValue="password">
    <TabsList className="grid grid-cols-2">
      <TabsTrigger value="password">Email & Password</TabsTrigger>
      <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
    </TabsList>
    <TabsContent value="password"><EmailPasswordForm /></TabsContent>
    <TabsContent value="magic-link"><MagicLinkForm /></TabsContent>
  </Tabs>
</Card>`,
              language: "tsx",
              caption: "Konsep Struktur Komponen Unified Auth Portal"
            }
          ]
        },
        {
          title: "3. Proteksi Rute di Next.js 16: Arsitektur Proxy (Evolusi Resmi Middleware)",
          badge: "Pilar 3: Proteksi Akses & Proxy",
          content: "Pada Next.js 16, konvensi berkas middleware.ts resmi didepresiasi dan berganti nama menjadi proxy.ts. Proxy beroperasi sebagai reverse proxy / network boundary di depan aplikasi sebelum Server Component atau Route Handler dirender, berjalan pada Node.js runtime bawaan untuk memeriksa status sesi dan me-refresh token yang kedaluwarsa.",
          subpoints: [
            {
              label: "Evolusi Next.js 16: Dari middleware.ts ke src/proxy.ts (Network Boundary)",
              text: "1. Depresiasi Resmi middleware.ts ke src/proxy.ts: Di Next.js 16, konvensi berkas `middleware.ts` resmi didepresiasi dan digantikan oleh `src/proxy.ts` dengan ekspor fungsi utama `export async function proxy(request: NextRequest)`. Penamaan ini menegaskan perannya sebagai *Reverse Proxy / Network Boundary* (gerbang batas jaringan terdepan) yang mengevaluasi setiap *incoming request* sebelum mencapai Server Components atau Route Handlers.\n\n" +
                    "2. Peralihan Lingkungan ke Node.js Runtime: Berbeda dengan middleware lama yang dipaksa berjalan pada Edge runtime dengan banyak limitasi API, `proxy.ts` di Next.js 16 berjalan secara bawaan pada lingkungan *Node.js Runtime*, memberikan akses penuh ke seluruh ekosistem modul Node.js standar tanpa kompromi kompatibilitas.\n\n" +
                    "3. Filter Regex Matcher (Negative Lookahead): Konfigurasi filter rute pada objek `config.matcher` menggunakan ekspresi reguler negatif untuk mengecualikan berkas statis (`_next/static`, `_next/image`, favicon, gambar) agar langsung dilewati tanpa memicu eksekusi kode proxy yang boros komputasi CPU.\n\n" +
                    "4. Zero Flash of Unauthenticated Content (FOUC): Jaminan keamanan antarmuka di mana konten halaman privat yang dilindungi tidak akan pernah sempat terkirim atau terlihat sekilas di browser pengguna yang belum login, karena proxy langsung mencegat dan mengalihkan *request* sebelum proses rendering server dimulai.",
              code: `// src/proxy.ts (Konvensi Resmi Next.js 16, Menggantikan middleware.ts)
import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  // Jalankan refresher sesi dan evaluasi proteksi rute via Proxy
  return await updateSession(request);
}

export const config = {
  // Filter ketat: Hanya rute aplikasi yang dicegat, lewati aset statis
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};`,
              language: "typescript",
              caption: "Konfigurasi src/proxy.ts dan Regex Matcher Resmi di Next.js 16"
            },
            {
              label: "Sinkronisasi & Rotasi Token Sesi di Proxy (updateSession)",
              text: "1. Bahaya Kritis getSession() vs Keamanan auth.getUser(): Metode `supabase.auth.getSession()` adalah *anti-pattern* fatal di layer Proxy karena hanya membaca payload cookie lokal tanpa menghubungi server Supabase—sehingga akun yang telah diblokir administrator atau kata sandinya telah diganti tetap dianggap aktif! Sebaliknya, `supabase.auth.getUser()` melakukan verifikasi kriptografis real-time langsung ke server Supabase Auth dan otomatis me-refresh token jika masa aktif mendekati habis.\n\n" +
                    "2. Mekanisme Dual-Cookie Synchronization (Sinkronisasi Ganda Cookie): Helper `updateSession` wajib menulis pasangan token baru hasil rotasi ke DUA tempat sekaligus: ke `request.cookies` (agar React Server Component di hilir membaca identitas terbaru pada siklus render saat ini) dan ke `response.cookies` (agar peramban menyimpan cookie terbaru melalui header HTTP `Set-Cookie`).\n\n" +
                    "3. Pencegahan Session Desynchronization (Session Desync): Kondisi anomali fatal di mana token pada cookie peramban sudah kedaluwarsa sementara Server Component menganggap sesi masih aktif (atau sebaliknya), yang memicu kegagalan sistemik seperti *infinite redirect loop* atau sesi pengguna terputus mendadak di tengah aktivitas.",
              code: `// src/utils/supabase/middleware.ts (Helper Session Refresher)
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          // 1. Tulis ke request agar RSC membaca token baru
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          // 2. Tulis ke response agar browser menyimpan Set-Cookie
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        }
      }
    }
  );

  // ⚠️ WAJIB: getUser() menghubungi server Supabase, BUKAN getSession()
  const { data: { user } } = await supabase.auth.getUser();

  // Proteksi rute privat /dashboard
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Jika user sudah login mencoba buka /login, lempar ke /dashboard
  if (user && request.nextUrl.pathname.startsWith("/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}`,
              language: "typescript",
              caption: "Implementasi Fungsi Helper updateSession() dengan Dual Cookie Sync"
            },
            {
              label: "Proteksi Rute Dinamis: Public vs Private vs Auth Routes",
              text: "1. Triad Klasifikasi Rute Aplikasi: Pemisahan arsitektur rute web menjadi tiga kategori terisolasi: Rute Publik (`/` bebas diakses siapa pun), Rute Khusus Auth (`/login`, `/register` hanya boleh diakses tamu yang belum masuk), dan Rute Privat (`/dashboard`, `/tasks` terkunci khusus pengguna terautentikasi).\n\n" +
                    "2. Mekanisme State Preservation (?next=): Teknik penyimpanan URL tujuan asli ke dalam query parameter saat tamu dialihkan paksa ke halaman login (misalnya tamu membuka `/dashboard/tasks?filter=urgent`, maka dialihkan ke `/login?next=%2Fdashboard%2Ftasks%3Ffilter%3Durgent`). Setelah proses autentikasi berhasil, aplikasi membaca parameter ini dan langsung mengembalikan pengguna ke halaman yang dituju tanpa tersesat.\n\n" +
                    "3. Protokol HTTP 307 Temporary Redirect: Kode status pengalihan HTTP yang secara ketat mempertahankan metode pemanggilan (GET tetap GET, POST tetap POST) dan muatan data (*body payload*) asli tanpa mengubahnya menjadi metode GET, menjaga integritas alur pengiriman formulir.",
              code: `// Logika Seleksi Matriks Rute di updateSession:
const isAuthRoute = request.nextUrl.pathname.startsWith("/login");
const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");

if (!user && isProtectedRoute) {
  // Tamu mengakses rute privat ➔ Lempar ke login + query next
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

if (user && isAuthRoute) {
  // Pengguna login mengakses rute login ➔ Lempar langsung ke dashboard
  return NextResponse.redirect(new URL("/dashboard", request.url));
}`,
              language: "typescript",
              caption: "Matriks Evaluasi Hak Akses dan Pengalihan Rute Dinamis"
            }
          ],
          comparisonTable: {
            headers: ["Aspek", "getSession() ❌ Anti-Pattern", "getUser() ✅ Best Practice"],
            rows: [
              ["Validasi Sumber", "Lokal (decode cookie saja)", "Server Supabase (network call)"],
              ["Deteksi Akun Diblokir", "Tidak bisa", "Bisa real-time"],
              ["Deteksi Password Diubah", "Tidak bisa", "Bisa real-time"],
              ["Keamanan Sesi di Proxy (src/proxy.ts)", "BERBAHAYA", "AMAN"],
              ["Latensi Tambahan", "0ms (lokal)", "~50ms (Network call)"],
              ["Standar Resmi Supabase", "Tidak direkomendasikan", "Wajib digunakan"]
            ]
          },
          callout: {
            type: "warning",
            title: "⚠️ Anti-Pattern Kritis: DILARANG KERAS getSession() di Next.js 16 Proxy (src/proxy.ts)!",
            text: "supabase.auth.getSession() hanya mendekode JWT dari cookie lokal tanpa menghubungi auth server Supabase. Akun yang sudah diblokir admin atau password yang diubah TETAP dianggap valid sampai token kedaluwarsa. Selalu gunakan getUser() yang melakukan verifikasi kriptografis real-time ke server Supabase."
          }
        },
        {
          title: "4. Sinkronisasi Profil Pengguna (User Profiles & DB Triggers)",
          badge: "Pilar 4: Data Profil Pengguna & RLS",
          content: "Sistem aplikasi web memerlukan tabel profil pengguna tersendiri untuk menyimpan nama lengkap, foto avatar, dan peran (role). Di Supabase, data ini dipisahkan dari skema internal sistem dan disinkronkan secara atomik via Trigger PostgreSQL.",
          subpoints: [
            {
              label: "Pemisahan auth.users (Sistem) dan public.profiles (Aplikasi)",
              text: "1. Prinsip Isolasi Skema Sistem vs Domain: Skema `auth.users` dikelola secara eksklusif oleh *GoTrue Engine* Supabase dan dilindungi dari modifikasi langsung. Menambahkan kolom kustom ke `auth.users` adalah pelanggaran arsitektur berat yang dapat merusak skema migrasi bawaan Supabase. Seluruh data domain bisnis aplikasi (nama lengkap, foto avatar, bio, role) wajib diisolasi di skema aplikasi `public.profiles`.\n\n" +
                    "2. Integritas Relasional Foreign Key ON DELETE CASCADE: Tabel `public.profiles` dihubungkan ke `auth.users(id)` dengan relasi berantai (*cascade cleanup*), menjamin bahwa ketika sebuah akun dihapus dari sistem autentikasi, seluruh data profil terkait otomatis terhapus bersih dari basis data tanpa menyisakan baris data sampah (*orphaned data*).\n\n" +
                    "3. Keamanan Tingkat Baris Row Level Security (RLS): Fitur keamanan bawaan mesin PostgreSQL di mana setiap baris tabel memiliki aturan evaluasi mandiri (*security policy*). Data profil dapat dibaca oleh publik (`SELECT true`), tetapi mutasi data (`UPDATE`) hanya diizinkan jika `auth.uid() = id`, menjamin pengguna tidak bisa memanipulasi profil milik pengguna lain.",
              code: `-- Skema Tabel Profil Pengguna (public.profiles)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT 'Explorer',
  avatar_url TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'lecturer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Siapa pun boleh membaca profil publik
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT USING (true);

-- Pengguna hanya boleh memperbarui profilnya sendiri
CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE USING (auth.uid() = id);`,
              language: "sql",
              caption: "DDL Skema public.profiles dengan Foreign Key Cascade & RLS"
            },
            {
              label: "PostgreSQL Trigger Otomatis: on_auth_user_created",
              text: "1. Kelemahan Pembuatan Profil di Layer Aplikasi: Jika pembuatan baris profil dijalankan secara manual di kode frontend atau backend aplikasi, risiko *Network Partition* (gangguan jaringan saat redirect) atau kegagalan eksekusi aplikasi dapat menyebabkan akun tercipta di `auth.users` namun profilnya gagal terbuat di `public.profiles`, menghasilkan fenomena *Orphaned User Anomaly*.\n\n" +
                    "2. Jaminan ACID Atomicity di Tingkat Kernel Database: Pemicu (*Database Trigger*) `AFTER INSERT ON auth.users` mengeksekusi fungsi stored procedure `handle_new_user()` langsung di dalam mesin PostgreSQL. Eksekusi ini berada dalam satu transaksi ACID atomik—jika pembuatan profil gagal, transaksi pembuatan akun ikut dibatalkan (*rollback*), menjamin 100% konsistensi relasi data.\n\n" +
                    "3. Hak Akses Khusus SECURITY DEFINER: Klausa keamanan pada fungsi PL/pgSQL yang menginstruksikan PostgreSQL untuk mengeksekusi kode fungsi menggunakan privilese pemilik fungsi (superuser/postgres) bukan pengguna biasa yang sedang login. Hal ini mutlak diperlukan karena skema `auth` berada di area terisolasi yang tidak dapat diakses langsung oleh *anonymous role* atau pengguna biasa saat membaca metadata `raw_user_meta_data`.",
              code: `-- Fungsi Trigger Otomasi Profil Pengguna
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Explorer'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pemasangan Trigger AFTER INSERT pada auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`,
              language: "sql",
              caption: "Fungsi Trigger PL/pgSQL untuk Otomasi Pembuatan Profil Pengguna"
            }
          ],
          callout: {
            type: "tip",
            title: "💡 Mengapa SECURITY DEFINER Diperlukan pada Fungsi Trigger?",
            text: "Klausa SECURITY DEFINER memerintahkan PostgreSQL untuk menjalankan fungsi trigger menggunakan hak akses pemilik fungsi (biasanya superuser) bukan hak akses pemanggil. Ini diperlukan karena tabel auth.users berada di skema auth yang terisolasi, dan pengguna biasa tidak memiliki izin untuk membaca raw_user_meta_data dari sistem auth internal Supabase."
          }
        }
      ]
    },
    references: [
      { title: "Supabase Next.js Auth Server-Side Guide", url: "https://supabase.com/docs/guides/auth/server-side/nextjs", source: "Supabase Docs" },
      { title: "GitHub OAuth Apps Configuration Manual", url: "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app", source: "GitHub Docs" },
      { title: "Next.js 16 Proxy File Convention (Replacement for middleware.ts)", url: "https://nextjs.org/docs/app/api-reference/file-conventions/proxy", source: "Next.js Docs" },
      { title: "Supabase Managing User Data & Triggers", url: "https://supabase.com/docs/guides/auth/managing-user-data", source: "Supabase Docs" }
    ],
    lab: {
      prerequisites: [
        "Proyek Next.js 16 dari Pertemuan 4 telah aktif dan terhubung ke Supabase Cloud",
        "Akun GitHub aktif untuk membuat GitHub OAuth App di Developer Settings",
        "Paket dependensi @supabase/ssr dan @supabase/supabase-js telah terinstal"
      ],
      steps: [
        {
          stepNumber: 1,
          badge: "Fondasi Proxy & DB (Tahap 1)",
          actionType: "hybrid",
          targetPromptStep: 1,
          instruction: "Tahap 1: Eksekusi DDL Trigger di Supabase & Pasang Proxy Session Refresher",
          code: `-- 1. EKSEKUSI DI SUPABASE DASHBOARD > SQL EDITOR:
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT 'Explorer',
  avatar_url TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'lecturer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Fungsi trigger handle_new_user() SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Explorer'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`,
          language: "sql",
          explanation: "1) Langkah Manual: Eksekusi skrip SQL di atas pada Supabase SQL Editor untuk membuat tabel profil dan trigger atomik. 2) Eksekusi AI Agent: Salin Prompt Tahap 1 di bawah ke panel AI Agent untuk merakit src/utils/supabase/middleware.ts, src/proxy.ts, dan halaman login gateway sementara. 3) Checkpoint: Buka http://localhost:3000/dashboard, peramban harus otomatis mengalihkan Anda ke /login?next=%2Fdashboard."
        },
        {
          stepNumber: 2,
          badge: "Model 1: Email & Password (Tahap 2)",
          actionType: "prompt",
          targetPromptStep: 2,
          instruction: "Tahap 2: Rakit Server Actions & Formulir Autentikasi Email & Password",
          code: `// src/actions/auth.ts (Server Actions 'use server')
export async function loginWithEmailAction(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { success: false, error: error.message };
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signupWithEmailAction(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });
  if (error) return { success: false, error: error.message };
  return { success: true, message: "Pendaftaran berhasil! Silakan masuk." };
}`,
          language: "typescript",
          explanation: "1) Eksekusi AI Agent: Salin Prompt Tahap 2 di bawah untuk merakit Server Actions dan form src/components/auth/email-password-form.tsx. 2) Uji Coba: Buka http://localhost:3000/login, daftarkan akun baru dengan email dan password. 3) Verifikasi DB: Buka Supabase Studio ➔ Table Editor ➔ public.profiles, pastikan data profil otomatis terbuat via trigger!"
        },
        {
          stepNumber: 3,
          badge: "Model 2: GitHub OAuth 2.0 (Tahap 3)",
          actionType: "hybrid",
          targetPromptStep: 3,
          instruction: "Tahap 3: Konfigurasi OAuth GitHub & Rakit Route Handler Penukar Kode Sesi",
          code: `# 1. LANGKAH MANUAL SETUP DASHBOARD (Gunakan Simulator di Bawah):
# - Buka GitHub ➔ Settings ➔ Developer Settings ➔ OAuth Apps ➔ New OAuth App
# - Application Name: The Serverless Odyssey Dev
# - Homepage URL: http://localhost:3000
# - Authorization callback URL: https://<PROJECT-REF>.supabase.co/auth/v1/callback
# - Generate Client Secret & Salin ke Supabase ➔ Auth ➔ Providers ➔ GitHub (Enabled)
# - Tambahkan http://localhost:3000/auth/callback ke Supabase Redirect URLs`,
          language: "bash",
          explanation: "1) Langkah Manual: Ikuti panduan visual pada simulator interaktif di bawah untuk menghubungkan GitHub dan Supabase. 2) Eksekusi AI Agent: Salin Prompt Tahap 3 di bawah untuk merakit Route Handler src/app/auth/callback/route.ts, signInWithGithubAction, dan tombol GithubLoginButton. 3) Checkpoint: Klik 'Masuk dengan GitHub' di /login, lalu verifikasi berhasil dialihkan ke /dashboard."
        },
        {
          stepNumber: 4,
          badge: "Model 3: Magic Link OTP (Tahap 4)",
          actionType: "prompt",
          targetPromptStep: 4,
          instruction: "Tahap 4: Tambahkan Otentikasi Passwordless Berbasis Magic Link OTP",
          code: `// src/actions/auth.ts (Penambahan sendMagicLinkAction)
export async function sendMagicLinkAction(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: \`\${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback\`
    }
  });
  if (error) return { success: false, error: error.message };
  return { success: true, message: "Tautan masuk ajaib telah dikirimkan ke email Anda!" };
}`,
          language: "typescript",
          explanation: "1) Eksekusi AI Agent: Salin Prompt Tahap 4 di bawah untuk menambahkan Server Action dan komponen form src/components/auth/magic-link-form.tsx. 2) Uji Coba: Masukkan email Anda di form Magic Link di http://localhost:3000/login, cek inbox email (atau Inbucket di CLI), klik tautan, dan peramban otomatis masuk ke /dashboard tanpa mengetik password!"
        },
        {
          stepNumber: 5,
          badge: "Unified Portal & Polishing (Tahap 5)",
          actionType: "prompt",
          targetPromptStep: 5,
          instruction: "Tahap 5: Satukan ke Unified Auth Portal (Tabs Shadcn) & Terapkan Root Navigation Rule",
          code: `// src/components/auth/unified-auth-card.tsx & src/app/page.tsx
// Struktur Komposisi Antarmuka Terpadu Satu Pintu:
<Card className="max-w-md w-full backdrop-blur-md bg-card/80 border-border/80 shadow-2xl">
  <CardHeader>
    <GithubLoginButton /> {/* 1-Click Social OAuth di Tingkat Teratas */}
    <Separator label="Atau pilih metode login" />
    <Tabs defaultValue="password">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="password">Email & Password</TabsTrigger>
        <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
      </TabsList>
      <TabsContent value="password"><EmailPasswordForm /></TabsContent>
      <TabsContent value="magic-link"><MagicLinkForm /></TabsContent>
    </Tabs>
  </CardHeader>
</Card>`,
          language: "tsx",
          explanation: "1) Eksekusi AI Agent: Salin Prompt Tahap 5 di bawah untuk mengonsolidasikan ketiga model ke dalam kartu UnifiedAuthCard dengan Tabs Shadcn UI dan memperbarui halaman root src/app/page.tsx sesuai ROOT NAVIGATION RULE. 2) Checkpoint Akhir: Buka http://localhost:3000/ untuk melihat tombol CTA cerdas, lalu buka /login untuk memastikan ketiga model autentikasi berfungsi harmonis tanpa bug!"
        }
      ],
      aiPromptTemplate: {
        role: "Senior Full-Stack Security Engineer & Next.js 16 Specialist",
        prompt: `Bertindaklah sebagai Senior Full-Stack Security Engineer & Next.js 16 Specialist.
Tugas Anda adalah mengimplementasikan sistem Unified Multi-Provider Authentication Portal lengkap (GitHub OAuth 1-Click, Email & Password, dan Passwordless Magic Link) menggunakan @supabase/ssr pada proyek "The Serverless Odyssey", memproteksi rute privat dengan Next.js 16 Proxy Session Refresher (src/proxy.ts, konvensi resmi pengganti middleware.ts), dan menyinkronkan profil pengguna via PostgreSQL Trigger.

LANGKAH PRE-KONDISI & DEPENDENSI (JALANKAN OTOMATIS JIKA BELUM ADA):
1. Periksa apakah @supabase/ssr dan @supabase/supabase-js sudah ada di package.json. Jika belum, eksekusi:
   npm install @supabase/ssr @supabase/supabase-js
2. Periksa apakah komponen Shadcn UI yang dibutuhkan sudah ada (Button, Card, Input, Label, Badge, Avatar, Tabs, Separator). Jika belum, eksekusi:
   npx shadcn@latest add button card input label badge avatar tabs separator

BATASAN ARSITEKTUR KETAT (DILARANG DILANGGAR):
1. Next.js 16 Async APIs: Wajib menggunakan \`const cookieStore = await cookies()\` di semua Server Components dan Route Handlers.
2. Direktif 'use client' HANYA boleh berada di komponen daun interaktif (UnifiedAuthCard, LogoutButton). DILARANG di page.tsx dan layout.tsx.
3. Keamanan Sesi: WAJIB \`supabase.auth.getUser()\` di Proxy (src/proxy.ts) dan RSC. DILARANG KERAS \`getSession()\`.
4. Dual-Cookie Synchronization: Helper updateSession harus menulis token baru ke request.cookies (untuk RSC) DAN response.cookies (untuk browser Set-Cookie).
5. UI Estetika Premium: Glassmorphism (backdrop-blur-md), micro-interactions (hover:-translate-y-0.5), Dark/Light mode penuh via semantic tokens Tailwind/Shadcn.
6. Zero TypeScript 'any' types. Semua tipe data eksplisit.

STRUKTUR 6 BERKAS YANG WAJIB DIBUAT/DIPERBARUI (SIAP JALAN 100%, TANPA POTONGAN KODE):

BERKAS 1: src/utils/supabase/middleware.ts
- Helper fungsi updateSession(request: NextRequest) dengan dual-cookie sync lengkap (getAll, setAll ke request dan response).
- Logika proteksi rute: redirect tamu dari /dashboard ke /login?next=<path>, redirect user login dari /login ke /dashboard.
- Parameter ?next= dipertahankan untuk state preservation setelah login.

BERKAS 2: src/proxy.ts (KONVENSI RESMI NEXT.JS 16 - MENGGANTIKAN middleware.ts)
- Buat berkas src/proxy.ts dengan ekspor fungsi 'export async function proxy(request: NextRequest)'.
- PERHATIAN: DILARANG menamai berkas src/middleware.ts karena telah resmi didepresiasi di Next.js 16 dan menimbulkan warning terminal.
- Import dan delegasikan eksekusi ke updateSession() dari berkas utils/supabase/middleware.
- Config matcher dengan regex negative lookahead yang mengecualikan _next/static, _next/image, favicon.ico, dan semua aset statis.

BERKAS 3: src/app/auth/callback/route.ts
- Route Handler GET untuk menerima ?code= dari GitHub OAuth redirect maupun Magic Link confirmation.
- Panggil exchangeCodeForSession(code) dan redirect ke parameter ?next atau /dashboard jika sukses.
- Fallback redirect ke /auth/auth-code-error jika kode kosong atau penukaran gagal.

BERKAS 4: src/actions/auth.ts ('use server')
- loginWithEmailAction(formData: FormData): Baca identifier (Email atau NIM) dan password. Deteksi tipe: jika NIM (tanpa @), petakan ke {nim}@student.ac.id. Validasi via Zod, panggil signInWithPassword, revalidatePath dan redirect('/dashboard').
- signupWithEmailAction(formData: FormData): Validasi email/NIM via Zod, panggil signUp, redirect('/check-email').
- sendMagicLinkAction(formData: FormData): Validasi email, panggil signInWithOtp, return { success: true, message: '...' }.
- signOutAction(): Panggil signOut(), revalidatePath('/', 'layout'), redirect('/login').

BERKAS 5: src/app/(auth)/login/page.tsx + src/components/auth/unified-auth-card.tsx
- page.tsx: Server Component, cek sesi (jika sudah login redirect ke /dashboard), render UnifiedAuthCard sebagai children.
- unified-auth-card.tsx ('use client'): Kartu login terpadu tiga opsi:
  1. Tombol GitHub OAuth ("Masuk dengan GitHub") dengan ikon brand GitHub.
  2. Garis pemisah semantik "Atau pilih metode kredensial".
  3. Tabs Shadcn: Tab "Kredensial (Email / NIM)" dan Tab "Magic Link" (Passwordless).
- Feedback status interaktif: loading spinner isPending, pesan error Zod/Supabase, dan notifikasi sukses kirim Magic Link.

BERKAS 6: supabase/migrations/02_auth_profiles_trigger.sql
- DDL PostgreSQL untuk membuat tabel public.profiles (id UUID PK REFERENCES auth.users ON DELETE CASCADE, full_name, avatar_url, role).
- Aktifkan RLS dengan kebijakan SELECT publik dan UPDATE pemilik akun (auth.uid() = id).
- Fungsi trigger handle_new_user() SECURITY DEFINER dan trigger AFTER INSERT ON auth.users.

BERKAS 7: src/app/page.tsx (ROOT NAVIGATION RULE)
- Perbarui Root Landing Page agar cerdas mendeteksi sesi: tampilkan tombol "Buka Dashboard Tugas →" jika sudah login, atau Hero CTA "Mulai Perjalanan Serverless →" + "Masuk / Daftar →" jika tamu.`,
        tip: "Pastikan URL http://localhost:3000/auth/callback sudah didaftarkan di Supabase Dashboard ➔ Authentication ➔ URL Configuration ➔ Redirect URLs, dan konfigurasi GitHub OAuth App di GitHub Developer Settings sudah mengarah ke https://<PROJECT-REF>.supabase.co/auth/v1/callback sebagai Authorization callback URL!",
        steppedPrompts: [
          {
            stepNumber: 1,
            title: "Tahap 1: Fondasi Keamanan Proxy & Database Trigger Profil",
            badge: "Fondasi Proxy & DB",
            description: "Mempersiapkan pengamanan rute pada tingkat Network Boundary (Next.js 16 Proxy - src/proxy.ts) dengan sinkronisasi dual-cookie, serta otomatisasi replikasi profil pengguna ke PostgreSQL melalui Database Trigger.",
            manualAction: {
              required: true,
              title: "Eksekusi Skrip DDL Profil & Trigger di Supabase SQL Editor",
              location: "Supabase Dashboard ➔ SQL Editor",
              description: "Sebelum menjalankan kode aplikasi Next.js, Anda wajib mengeksekusi skrip SQL berikut di Supabase Dashboard untuk membuat tabel public.profiles dan trigger otomatis handle_new_user() yang menyalin data pengguna baru dari auth.users.",
              codeSnippet: {
                language: "sql",
                code: `-- 1. EKSEKUSI DI SUPABASE DASHBOARD > SQL EDITOR:
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT 'Explorer',
  avatar_url TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'lecturer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Fungsi trigger handle_new_user() SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Explorer'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`
              },
              simulatorKey: "supabase-sql-editor",
              note: "⚠️ Salin dan jalankan skrip SQL di atas langsung di Supabase SQL Editor (bukan di editor VS Code). Setelah sukses dijalankan, lanjutkan ke Eksekusi Prompt AI di bawah."
            },
            targetFiles: [
              "src/utils/supabase/middleware.ts",
              "src/proxy.ts",
              "supabase/migrations/02_auth_profiles_trigger.sql",
              "src/app/(auth)/login/page.tsx"
            ],
            prompt: `Bertindaklah sebagai Senior Full-Stack Security Engineer & Next.js 16 Specialist.
Tugas Anda adalah mengimplementasikan Tahap 1 dari arsitektur autentikasi pada proyek "The Serverless Odyssey": Fondasi Keamanan Network Boundary (Next.js 16 Proxy Session Refresher - src/proxy.ts) dan PostgreSQL User Profile Sync Trigger.

LANGKAH PRE-KONDISI & DEPENDENSI (JALANKAN OTOMATIS JIKA BELUM ADA):
1. Periksa apakah @supabase/ssr dan @supabase/supabase-js sudah ada di package.json. Jika belum, eksekusi:
   npm install @supabase/ssr @supabase/supabase-js
2. Periksa apakah komponen Shadcn UI yang dibutuhkan sudah ada (Card, Button, Badge). Jika belum, eksekusi:
   npx shadcn@latest add card button badge

BATASAN ARSITEKTUR KETAT:
1. Next.js 16 Proxy File Convention: Wajib menggunakan berkas src/proxy.ts dengan 'export async function proxy(request: NextRequest)'. DILARANG KERAS menggunakan nama middleware.ts karena telah resmi didepresiasi di Next.js 16.
2. Keamanan Sesi: Wajib panggil supabase.auth.getUser() di updateSession helper. DILARANG KERAS getSession().
3. Dual-Cookie Synchronization: Tulis token baru ke request.cookies DAN response.cookies secara simultan.
4. Proteksi Rute: Jika user belum login mengakses rute privat /dashboard, alihkan ke /login?next=<path>. Jika sudah login mengakses /login, alihkan ke /dashboard.
5. Halaman Login Sementara (Tahap 1): Buat src/app/(auth)/login/page.tsx sebagai Server Component yang menampilkan kartu status "Authentication Gateway: Fondasi Keamanan Proxy Aktif" dengan badge status, agar proyek dapat langsung dikompilasi dan diuji alur redirect-nya tanpa error.
6. Zero TypeScript 'any' types.

STRUKTUR 4 BERKAS YANG WAJIB DIBUAT/DIPERBARUI:

BERKAS 1: src/utils/supabase/middleware.ts
- Fungsi updateSession(request: NextRequest) yang menangani pembacaan dan penulisan cookies secara aman.
- Cek user via getUser(), lalu lakukan redirect cerdas dengan parameter ?next= untuk preserving target URL.

BERKAS 2: src/proxy.ts (KONVENSI RESMI NEXT.JS 16 - PENGGANTI middleware.ts)
- Ekspor 'export async function proxy(request: NextRequest)' yang mendelegasikan eksekusi ke updateSession(request) dari src/utils/supabase/middleware.ts.
- Konfigurasi config matcher dengan pola regex negative lookahead untuk mengecualikan _next/static, _next/image, favicon.ico, dan ekstensi file statis.

BERKAS 3: supabase/migrations/02_auth_profiles_trigger.sql
- DDL PostgreSQL: Buat tabel public.profiles (id UUID PK REFERENCES auth.users ON DELETE CASCADE, full_name TEXT, avatar_url TEXT, updated_at TIMESTAMPTZ DEFAULT now()).
- Aktifkan RLS: Kebijakan SELECT dapat dibaca semua user (authenticated & anon), kebijakan UPDATE hanya oleh pemilik (auth.uid() = id).
- Buat fungsi trigger handle_new_user() SECURITY DEFINER yang otomatis mengekstrak raw_user_meta_data->>'full_name' dan raw_user_meta_data->>'avatar_url' ke public.profiles saat ada user baru di auth.users.
- Buat trigger on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user().

BERKAS 4: src/app/(auth)/login/page.tsx
- Server Component: Cek status getUser(). Jika sudah ada user, redirect ke /dashboard.
- Jika belum login, render kartu sambutan status fondasi autentikasi aktif dengan indikator badge "Tahap 1: Proxy Refresher Siap" dan petunjuk melanjutkan ke Tahap 2.`,
            checkpoint: "Jalankan dev server, lalu buka http://localhost:3000/dashboard di browser. Proxy Next.js 16 harus otomatis mengalihkan Anda ke http://localhost:3000/login?next=%2Fdashboard dan menampilkan kartu gateway status Tahap 1 tanpa error serta bebas dari peringatan deprecation middleware.",
            tip: "Jalankan migrasi SQL supabase/migrations/02_auth_profiles_trigger.sql di Supabase Dashboard (SQL Editor) sebelum melanjutkan ke pembuatan user!"
          },
          {
            stepNumber: 2,
            title: "Tahap 2: Model 1 — Kredensial Mandiri & ID Institusi (Email atau NIM & Password)",
            badge: "Model 1: Dual-Auth (Email / NIM)",
            description: "Membangun otentikasi kredensial fleksibel yang mendukung Email Publik maupun Nomor Induk Mahasiswa (NIM) dengan Server Actions Next.js 16, validasi Zod ketat, penanganan error, serta pemetaan transparan domain kampus.",
            manualAction: {
              required: true,
              title: "Arsitektur Login NIM Institusi & Toggle 'Confirm email' (Dev Mode)",
              location: "Supabase Studio ➔ Auth Settings & Visual Architecture Guide",
              description: "Buka simulator interaktif di bawah untuk mempelajari bagaimana sistem kampus memetakan NIM secara otomatis ke domain institusi ({nim}@student.ac.id), serta pastikan toggle 'Confirm email' dimatikan di Supabase Studio selama masa development lokal.",
              simulatorKey: "nim-auth-architecture",
              note: "💡 Tips: Di lingkungan production (saat deploy ke Vercel), toggle 'Confirm email' wajib dinyalakan kembali demi keamanan akun."
            },
            targetFiles: [
              "src/actions/auth.ts",
              "src/components/auth/email-password-form.tsx",
              "src/app/(auth)/login/page.tsx"
            ],
            prompt: `Bertindaklah sebagai Senior Full-Stack Security Engineer & Next.js 16 Specialist.
Tugas Anda adalah mengimplementasikan Tahap 2: Model Autentikasi 1 (Kredensial Mandiri & ID Institusi: Email atau NIM & Password) dengan Server Actions Next.js 16 dan validasi Zod pada proyek "The Serverless Odyssey".

LANGKAH PRE-KONDISI & DEPENDENSI (JALANKAN OTOMATIS JIKA BELUM ADA):
1. Periksa apakah zod sudah ada di package.json. Jika belum, eksekusi:
   npm install zod
2. Periksa apakah komponen Shadcn UI yang dibutuhkan sudah ada (Input, Label, Button, Alert). Jika belum, eksekusi:
   npx shadcn@latest add input label button alert

BATASAN ARSITEKTUR KETAT:
1. Server Actions ('use server'): Buat di src/actions/auth.ts.
2. Next.js 16 Async Cookies: Gunakan createServerClient dengan const cookieStore = await cookies() di dalam Server Action.
3. Fitur Cerdas Dual-Identifier (Email / NIM):
   - Jika identifier mengandung '@', proses sebagai email publik normal.
   - Jika identifier TIDAK mengandung '@' (karakter angka/huruf tanpa '@', misal NIM '202401001'), petakan secara otomatis di server ke domain kampus: \`\${identifier.trim()}@student.ac.id\`.
4. Validasi Zod: Identifier minimal 3 karakter, password minimal 8 karakter.
5. Client Component: Komponen form src/components/auth/email-password-form.tsx menggunakan 'use client' dengan useActionState atau form status pending untuk indikator loading.
6. Pertahankan src/proxy.ts dan skema database dari Tahap 1 tanpa gangguan.

STRUKTUR 3 BERKAS YANG WAJIB DIBUAT/DIPERBARUI:

BERKAS 1: src/actions/auth.ts
- loginWithEmailAction(prevState: unknown, formData: FormData): Baca identifier (Email atau NIM) dan password. Deteksi tipe: jika NIM, ubah menjadi {nim}@student.ac.id. Panggil supabase.auth.signInWithPassword, revalidatePath('/', 'layout'), lalu redirect ke target next atau /dashboard.
- signupWithEmailAction(prevState: unknown, formData: FormData): Validasi email/NIM, password, dan nama lengkap via Zod. Panggil supabase.auth.signUp dengan options data { full_name }. Kembalikan pesan sukses verifikasi email atau alihkan ke /dashboard jika auto-confirm aktif.
- signOutAction(): Panggil supabase.auth.signOut(), revalidatePath('/', 'layout'), redirect('/login').

BERKAS 2: src/components/auth/email-password-form.tsx ('use client')
- Formulir toggle antara mode "Masuk" dan "Daftar Akun Baru".
- Label input cerdas: "Email atau NIM (Nomor Induk Mahasiswa)". Placeholder: "budi@gmail.com atau 202401001".
- Input password, dan nama lengkap (pada mode pendaftaran).
- Feedback visual: status loading spinner saat submit, banner pesan error jika kredensial salah, dan pesan sukses jika pendaftaran berhasil.

BERKAS 3: src/app/(auth)/login/page.tsx
- Perbarui halaman login untuk merender EmailPasswordForm di dalam kartu login yang rapi dan elegan (glassmorphism Tailwind).`,
            checkpoint: "Buka http://localhost:3000/login. Coba masuk menggunakan NIM institusi (misal 202401001) atau email biasa beserta password. Server Action akan mendeteksi tipe identifier, memetakan NIM ke email kampus secara transparan, dan mengarahkan Anda ke /dashboard setelah sukses!",
            tip: "Di Supabase Studio, Anda juga dapat membuka simulator interaktif di atas untuk memahami perbandingan Pola Virtual Domain Alias vs Custom Roster Table."
          },
          {
            stepNumber: 3,
            title: "Tahap 3: Model 2 — 1-Click Social OAuth 2.0 GitHub",
            badge: "Model 2: GitHub OAuth 2.0",
            description: "Mengintegrasikan login sosial 1-Click menggunakan GitHub OAuth 2.0 dengan penukaran kode otorisasi PKCE (exchangeCodeForSession) pada Route Handler Next.js 16.",
            manualAction: {
              required: true,
              title: "Konfigurasi GitHub OAuth App & Supabase Auth Provider",
              location: "GitHub Developer Settings & Supabase Dashboard",
              description: "Hubungkan GitHub dengan Supabase dengan mendaftarkan New OAuth App di GitHub Developer Settings, lalu salin Client ID & Client Secret ke Supabase Studio (Authentication ➔ Providers ➔ GitHub). Buka simulator interaktif di bawah untuk panduan visual langkah demi langkah.",
              simulatorKey: "github-oauth-setup",
              note: "⚠️ PENTING: Authorization callback URL di GitHub wajib mengarah ke https://<PROJECT-REF>.supabase.co/auth/v1/callback (bukan localhost). Dan pastikan http://localhost:3000/auth/callback terdaftar di Supabase Redirect URLs!"
            },
            targetFiles: [
              "src/app/auth/callback/route.ts",
              "src/actions/auth.ts",
              "src/components/auth/github-login-button.tsx",
              "src/app/(auth)/login/page.tsx"
            ],
            prompt: `Bertindaklah sebagai Senior Full-Stack Security Engineer & Next.js 16 Specialist.
Tugas Anda adalah mengimplementasikan Tahap 3: Model Autentikasi 2 (1-Click Social OAuth 2.0 GitHub) dengan PKCE Code Exchange Route Handler pada proyek "The Serverless Odyssey".

LANGKAH PRE-KONDISI:
1. Pastikan GitHub OAuth App sudah dikonfigurasi di GitHub Developer Settings dengan Authorization callback URL: https://<PROJECT-REF>.supabase.co/auth/v1/callback.
2. Pastikan Client ID dan Client Secret GitHub sudah diinput ke Supabase Dashboard ➔ Authentication ➔ Providers ➔ GitHub (Enabled).
3. Pastikan http://localhost:3000/auth/callback sudah didaftarkan di Supabase Dashboard ➔ Authentication ➔ URL Configuration ➔ Redirect URLs.

BATASAN ARSITEKTUR KETAT:
1. Route Handler: src/app/auth/callback/route.ts wajib menggunakan const cookieStore = await cookies() (Next.js 16 async cookies).
2. Penukaran Kode PKCE: Gunakan supabase.auth.exchangeCodeForSession(code).
3. Parameter Preservasi: Dukung redirect ke query parameter ?next= jika ada, default ke /dashboard.
4. Pertahankan aksi-aksi dari Tahap 2 di src/actions/auth.ts tanpa menghapusnya.

STRUKTUR 4 BERKAS YANG WAJIB DIBUAT/DIPERBARUI:

BERKAS 1: src/app/auth/callback/route.ts
- Export fungsi GET(request: Request).
- Baca searchParams ?code= dan ?next=.
- Inisialisasi createServerClient(@supabase/ssr), tukar code dengan exchangeCodeForSession(code).
- Jika berhasil, redirect ke requestUrl.origin + next. Jika gagal, redirect ke /login?error=oauth_callback_failed.

BERKAS 2: src/actions/auth.ts (Penambahan Action)
- Tambahkan signInWithGithubAction(): Panggil supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: \`\${origin}/auth/callback?next=\${next}\` } }). Kembalikan URL redirect OAuth.

BERKAS 3: src/components/auth/github-login-button.tsx ('use client')
- Tombol dengan ikon SVG resmi GitHub, label "Masuk dengan GitHub", efek hover halus (hover:-translate-y-0.5), dan state loading saat proses inisiasi OAuth.

BERKAS 4: src/app/(auth)/login/page.tsx
- Sisipkan GithubLoginButton di atas formulir kredensial Email & Password, dipisahkan oleh garis pembatas horizontal "Atau lanjutkan dengan kredensial".`,
            checkpoint: "Klik tombol 'Masuk dengan GitHub' di http://localhost:3000/login. Anda akan diarahkan ke halaman izin GitHub, dan setelah otorisasi, kembali via /auth/callback langsung ke /dashboard. Cek public.profiles di Supabase: nama dan avatar GitHub tersinkronisasi otomatis!",
            tip: "Jika muncul error redirect_uri_mismatch, pastikan URL callback di GitHub OAuth App mengarah ke domain Supabase Anda, bukan langsung ke localhost:3000!"
          },
          {
            stepNumber: 4,
            title: "Tahap 4: Model 3 — Passwordless Magic Link OTP",
            badge: "Model 3: Magic Link OTP",
            description: "Mengimplementasikan autentikasi tanpa kata sandi (Passwordless Magic Link) berbasis OTP dan penukaran tautan email berbatas waktu yang ramah pengguna.",
            manualAction: {
              required: true,
              title: "Pengujian Magic Link via Simulasi Webmail Inbox & Whitelist URL",
              location: "Supabase Studio ➔ URL Configuration & Webmail Inbox",
              description: "Pastikan Site URL dan Redirect URLs (http://localhost:3000/**) sudah terdaftar di Supabase Studio. Buka simulator Webmail interaktif di bawah untuk menguji alur pengiriman Magic Link, menyalin OTP 6-digit, dan memverifikasi parameter token PKCE.",
              simulatorKey: "magic-link-inbox",
              note: "⚠️ Karena batasan rate limit Supabase Cloud (~3-4 email per jam pada tier gratis), simulator Webmail di bawah memungkinkan Anda menguji mekanisme token tanpa khawatir kuota SMTP habis."
            },
            targetFiles: [
              "src/actions/auth.ts",
              "src/components/auth/magic-link-form.tsx",
              "src/app/(auth)/login/page.tsx"
            ],
            prompt: `Bertindaklah sebagai Senior Full-Stack Security Engineer & Next.js 16 Specialist.
Tugas Anda adalah mengimplementasikan Tahap 4: Model Autentikasi 3 (Passwordless Magic Link OTP) pada proyek "The Serverless Odyssey".

BATASAN ARSITEKTUR KETAT:
1. Server Action: Tambahkan sendMagicLinkAction(prevState: unknown, formData: FormData) di src/actions/auth.ts menggunakan supabase.auth.signInWithOtp().
2. Email Redirect: Arahkan emailRedirectTo ke \`\${origin}/auth/callback?next=\${next}\`.
3. Client Component: Komponen src/components/auth/magic-link-form.tsx menangani input email, tombol kirim dengan loading state, dan banner konfirmasi interaktif saat link terkirim.
4. Integrasi: Pertahankan seluruh fungsi sebelumnya (Email/Password & GitHub OAuth) tanpa konflik.

STRUKTUR 3 BERKAS YANG WAJIB DIBUAT/DIPERBARUI:

BERKAS 1: src/actions/auth.ts (Penambahan Action)
- Tambahkan sendMagicLinkAction(prevState: unknown, formData: FormData):
  Validasi email via Zod. Panggil supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: \`\${origin}/auth/callback\` } }).
  Kembalikan status { success: true, message: 'Tautan login telah dikirimkan ke email Anda!' } atau pesan error.

BERKAS 2: src/components/auth/magic-link-form.tsx ('use client')
- Input alamat email dengan ikon Mail.
- Tombol kirim "Kirim Tautan Magic Link" dengan spinner loading.
- Tampilan notifikasi sukses yang informatif: "Silakan periksa kotak masuk email Anda dan klik tautan untuk masuk instan tanpa password."

BERKAS 3: src/app/(auth)/login/page.tsx
- Tambahkan bagian formulir Magic Link pada kartu autentikasi, berdampingan dengan Email/Password dan GitHub OAuth.`,
            checkpoint: "Ketikkan email Anda pada form Magic Link di http://localhost:3000/login, lalu klik 'Kirim Tautan'. Cek inbox email Anda (atau Supabase Inbucket jika di local Supabase CLI). Klik tautan verifikasi, dan peramban akan langsung login otomatis ke /dashboard tanpa mengetik password!",
            tip: "Magic Link menggunakan rute callback yang sama (/auth/callback) yang telah kita buat pada Tahap 3, membuktikan efisiensi arsitektur modular!"
          },
          {
            stepNumber: 5,
            title: "Tahap 5: Penyatuan Antarmuka (Unified Auth Portal) & Navigasi Root",
            badge: "Unified Portal & Polishing",
            description: "Mengonsolidasikan ketiga model autentikasi ke dalam satu kartu elegan terpadu (UnifiedAuthCard) dengan Tabs Shadcn UI, serta memperbarui Root Landing Page (src/app/page.tsx) dengan navigasi adaptif.",
            manualAction: {
              required: false,
              title: "Tidak Perlu Koding Manual — 100% Diotomasi oleh AI Agent",
              description: "AI Agent akan mengonsolidasikan seluruh metode login ke dalam satu kartu terpadu (src/components/auth/unified-auth-card.tsx) berbasis Shadcn Tabs, serta memperbarui landing page src/app/page.tsx sesuai Root Navigation Rule."
            },
            targetFiles: [
              "src/components/auth/unified-auth-card.tsx",
              "src/app/(auth)/login/page.tsx",
              "src/app/page.tsx"
            ],
            prompt: `Bertindaklah sebagai Senior Full-Stack Security Engineer & Next.js 16 Specialist.
Tugas Anda adalah menyelesaikan Tahap 5: Menyatukan seluruh model autentikasi ke dalam Unified Auth Portal berestetika premium menggunakan Shadcn UI Tabs, serta mematuhi ROOT NAVIGATION RULE pada src/app/page.tsx.

LANGKAH PRE-KONDISI & DEPENDENSI:
1. Pastikan komponen Tabs dan Separator Shadcn UI sudah terpasang:
   npx shadcn@latest add tabs separator

BATASAN ARSITEKTUR KETAT:
1. UI Estetika Premium: UnifiedAuthCard harus memukau (glassmorphism bg-card/80 backdrop-blur-md, border tipis border-border/80, shadow-xl, transisi halus).
2. Tab Switcher: Tab 1 "Kredensial (Email / NIM)" dan Tab 2 "Magic Link" di bawah tombol GitHub OAuth 1-Click.
3. Root Navigation Rule (WAJIB): src/app/page.tsx (halaman root /) TIDAK BOLEH membiarkan user bingung. Cek sesi di Server Component: jika sudah login tampilkan CTA "Buka Dashboard Tugas →" (/dashboard), jika belum tampilkan Hero CTA "Mulai Perjalanan Serverless →" (/login).
4. Sempurnakan seluruh tipe TypeScript tanpa ada tipe 'any'.

STRUKTUR 3 BERKAS YANG WAJIB DIBUAT/DIPERBARUI:

BERKAS 1: src/components/auth/unified-auth-card.tsx ('use client')
- Satukan GithubLoginButton di bagian atas dengan badge "1-Click Social OAuth".
- Garis pemisah estetik Separator dengan label "Atau pilih metode login".
- Tabs Shadcn UI dengan tab trigger: "Kredensial (Email / NIM)" (ikon Kunci) dan "Magic Link" (ikon Sparkles/Mail).
- Pasang EmailPasswordForm di Tab 1 (mendukung input Email publik maupun NIM) dan MagicLinkForm di Tab 2.

BERKAS 2: src/app/(auth)/login/page.tsx
- Server Component: Validasi getUser(). Jika user aktif, redirect('/dashboard').
- Render UnifiedAuthCard di tengah layar dengan background gradien ambient yang menawan, logo aplikasi, dan tautan kembali ke beranda.

BERKAS 3: src/app/page.tsx (ROOT NAVIGATION RULE)
- Server Component: Panggil getUser() dari Supabase SSR.
- Perbarui Hero Section: Tombol CTA cerdas yang langsung mengarahkan user login ke /dashboard, atau user tamu ke /login. Navbar menampilkan status user (avatar/nama) jika sudah login, atau tombol "Masuk" jika tamu.`,
            checkpoint: "Buka http://localhost:3000/. Verifikasi bahwa halaman utama mendeteksi status sesi Anda dan menyediakan tombol CTA yang sesuai. Kunjungi http://localhost:3000/login untuk melihat Unified Auth Portal lengkap dengan 3 metode login (GitHub, Kredensial Email/NIM, dan Magic Link) yang berfungsi harmonis tanpa bug!",
            tip: "Seluruh tahapan kini tuntas 100%! Proyek Anda memiliki sistem autentikasi kelas industri yang aman, responsif, dan siap untuk deployment Vercel."
          }
        ]
      },
      warningZone: {
        title: "Perhatian Kritis: Bahaya Redirect URL Mismatch di Supabase",
        desc: "Jika Anda tidak mendaftarkan http://localhost:3000/auth/callback ke tab Authentication ➔ URL Configuration ➔ Redirect URLs pada Supabase Dashboard, GitHub OAuth dan Magic Link akan menolak login dan melempar error 'redirect_uri_mismatch'!"
      }
    },
    mission: {
      taskTitle: "Misi Minggu 5: Implementasi Multi-Provider Authentication & Proxy Session Refresher",
      taskDesc: "Lanjutkan pengerjaan Proyek Akhir resmi Anda dari branch feature/supabase-database-schema. Bangun Unified Auth Portal (GitHub OAuth, Dual-Identifier Email/NIM, dan Magic Link), buat Next.js 16 Proxy session refresher (src/proxy.ts), amankan rute dashboard, dan sinkronkan profil pengguna ke public.profiles.",
      definitionOfDone: [
        "Unified Auth Portal Aktif: Halaman /login menampilkan tombol GitHub OAuth 1-Click, tab Kredensial (Email / NIM), dan tab Magic Link passwordless.",
        "Pendaftaran & Login Kredensial Berfungsi: Pengguna dapat masuk dengan email maupun NIM institusi (auto-alias) dan dialihkan ke /dashboard.",
        "GitHub OAuth Handshake Sukses: Integrasi GitHub OAuth App berhasil menukar kode otorisasi sementara menjadi sesi kuki resmi di /auth/callback.",
        "Magic Link OTP Terkirim: Pengguna dapat meminta tautan masuk ajaib dan diverifikasi tanpa perlu mengingat kata sandi.",
        "Next.js 16 Proxy Route Guard (src/proxy.ts): Tamu yang belum login otomatis dialihkan (307) saat mengakses /dashboard, dan pengguna login dialihkan dari /login ke /dashboard tanpa peringatan deprecation.",
        "Otomasi Sinkronisasi Profil: Trigger PostgreSQL on_auth_user_created otomatis menyalin data akun baru ke tabel public.profiles dengan aman."
      ],
      gitBranchTask: "git checkout -b feature/unified-multi-provider-auth"
    },
    quiz: {
      totalQuestions: 7,
      passingScore: 80,
      questions: [
        {
          id: 1,
          question: "Bandingkan 3 model autentikasi: ID Institusi (NIM/NIDN), Email & Password, dan Social OAuth (GitHub)! Dalam skenario bisnis apa masing-masing model paling tepat digunakan, dan mengapa aplikasi SaaS developer memilih GitHub OAuth alih-alih membuat form registrasi sendiri?",
          rubric: "Mahasiswa harus menjelaskan bahwa ID Institusi cocok untuk jaringan tertutup akademik dengan kontrol 100%, Email/Password untuk B2C universal dengan liabilitas hash tinggi, dan Social OAuth untuk SaaS developer karena menawarkan zero password liability, profil terverifikasi instan, serta eliminasi drop-off pendaftaran (1-click login).",
          keyConcepts: ["ID Institusi", "Email & Password", "Social OAuth", "Zero Password Liability", "1-Click Frictionless Conversion"],
          weight: 15,
          socraticHint: "Mengapa aplikasi seperti Vercel dan Railway lebih menyukai Anda login dengan GitHub daripada menyuruh Anda mengisi formulir pendaftaran 10 baris dengan password baru?"
        },
        {
          id: 2,
          question: "Mengapa arsitektur komputasi Serverless yang bersifat stateless (scale-to-zero) mewajibkan penggunaan Stateless JWT dan bukannya sistem sesi stateful tradisional di memori RAM server?",
          rubric: "Mahasiswa harus menjelaskan bahwa serverless function menyala dan mati secara independen tanpa memori RAM bersama (shared memory), sehingga JWT yang memuat identitas dan ditandatangani secara kriptografis (HMAC-SHA256) memungkinkan verifikasi instan tanpa lookup database terpusat.",
          keyConcepts: ["Stateless", "scale-to-zero", "ketiadaan shared memory RAM", "verifikasi kriptografis signature", "RFC 7519 JWT"],
          weight: 15,
          socraticHint: "Apa yang terjadi pada data sesi yang tersimpan di memori server Express/Node.js ketika instance serverless dimatikan ke 0 instance saat tidak ada pengunjung?"
        },
        {
          id: 3,
          question: "Uraikan 6 langkah alur kerja Authorization Code Grant pada GitHub OAuth 2.0, dan jelaskan mengapa GitHub mengirimkan 'authorization code' sementara ke Route Handler alih-alih langsung memberikan access token ke browser pengguna!",
          rubric: "Mahasiswa harus merinci 6 tahap pertukaran (Browser ➔ GitHub consent ➔ Redirect membawa code ➔ Route Handler menukar code ➔ Supabase kontak GitHub API ➔ Set-Cookie sesi), serta menjelaskan risiko kebocoran token di peramban jika token dikirim langsung (URL leakage/XSS).",
          keyConcepts: ["Authorization Code Flow", "6 langkah pertukaran", "pencegahan token leakage", "Route Handler /auth/callback", "exchangeCodeForSession"],
          weight: 15,
          socraticHint: "Jika GitHub langsung menaruh access token rahasia di URL hash browser pengguna (#access_token=...), apa bahaya yang mengintai jika halaman tersebut memiliki script pelacak atau ekstensi peramban pihak ketiga?"
        },
        {
          id: 4,
          question: "Mengapa dokumentasi resmi Supabase melarang keras penggunaan 'supabase.auth.getSession()' di Next.js 16 Proxy (src/proxy.ts) dan mewajibkan 'supabase.auth.getUser()'? Jelaskan celah keamanan apa yang dapat terjadi!",
          rubric: "Mahasiswa harus menjelaskan getSession() hanya membaca dan mendecode JWT dari cookie lokal tanpa menghubungi auth server Supabase sehingga buta terhadap akun yang diblokir/password yang diubah, sedangkan getUser() memvalidasi integritas sesi langsung ke server Supabase secara real-time.",
          keyConcepts: ["getSession anti-pattern", "getUser server-validated", "session revocation", "akun terblokir", "integritas sesi real-time"],
          weight: 15,
          socraticHint: "Jika seorang karyawan dipecat dan akunnya dinonaktifkan di database Supabase oleh admin, apa yang terjadi jika aplikasi hanya memeriksa cookie lokal menggunakan getSession()?"
        },
        {
          id: 5,
          question: "Mengapa fungsi pembantu 'updateSession' di Next.js 16 Proxy (src/proxy.ts, konvensi resmi pengganti middleware.ts) wajib menuliskan token yang diperbarui ke 'request.cookies' sekaligus 'response.cookies' secara simultan?",
          rubric: "Mahasiswa harus menjelaskan bahwa request.cookies perlu diperbarui agar Server Component (RSC) yang akan dirender langsung membaca token baru, sedangkan response.cookies perlu diperbarui agar browser pengguna menyimpan header Set-Cookie untuk request selanjutnya.",
          keyConcepts: ["updateSession", "src/proxy.ts", "Next.js 16 proxy convention", "dual-cookie sync", "request.cookies untuk RSC", "response.cookies untuk browser", "Set-Cookie header"],
          weight: 10,
          socraticHint: "Jika proxy memperbarui token sesi tetapi hanya menuliskannya ke objek NextResponse, apa yang dibaca oleh Server Component (RSC) yang dieksekusi tepat setelah proxy selesai?"
        },
        {
          id: 6,
          question: "Jelaskan alasan arsitektural di balik pemisahan skema 'auth.users' dan 'public.profiles', serta mengapa pembuatan baris profil pengguna wajib didelegasikan ke Database Trigger PostgreSQL daripada ditulis di kode aplikasi web!",
          rubric: "Mahasiswa harus menjelaskan isolasi keamanan skema auth internal dari modifikasi sembarangan, relasi FK ON DELETE CASCADE, serta jaminan atomik Database Trigger yang pasti berjalan pada semua metode pendaftaran (OAuth, Magic Link) tanpa risiko kegagalan koneksi di aplikasi.",
          keyConcepts: ["Pemisahan skema auth vs public", "ON DELETE CASCADE", "Database Trigger AFTER INSERT", "SECURITY DEFINER", "inkonsistensi pendaftaran OAuth"],
          weight: 15,
          socraticHint: "Jika pengguna mendaftar via GitHub OAuth dan koneksi internet pengguna terputus saat peramban diarahkan kembali ke aplikasi Anda, apa yang terjadi pada profilnya jika kodenya ditulis di Server Action vs jika ditangani oleh PostgreSQL Trigger?"
        },
        {
          id: 7,
          question: "Mengapa token otentikasi sesi di Next.js 16 disimpan di dalam HTTP-only Cookies, bukan di 'localStorage' peramban? Vektor serangan siber apa yang berhasil ditangkal oleh atribut HttpOnly dan SameSite=Lax?",
          rubric: "Mahasiswa harus menjelaskan bahwa localStorage rentan terhadap pencurian script jahat melalui Cross-Site Scripting (XSS) karena dapat dibaca via JavaScript, sedangkan HttpOnly memblokir akses JavaScript secara absolut. Atribut SameSite=Lax mencegah serangan Cross-Site Request Forgery (CSRF).",
          keyConcepts: ["HTTP-only Cookies", "localStorage vs Cookies", "mitigasi XSS attack", "mitigasi CSRF", "SameSite=Lax", "kriptografi sesi aman"],
          weight: 15,
          socraticHint: "Jika website Anda secara tidak sengaja memuat pustaka JavaScript pihak ketiga yang disusupi malware, apa yang terjadi pada token pengguna jika token disimpan di localStorage vs jika disimpan di cookie HttpOnly?"
        }
      ]
    }
  },
  {
    id: 6,
    worldId: "world-1",
    worldTitle: "Dunia 1: Fondasi & Backend Serverless",
    weekNumber: 6,
    title: "Integrasi CRUD End-to-End: Server Actions vs REST API Route Handlers & Keamanan API",
    subtitle: "Membangun arsitektur ganda (Web BFF via Server Actions & Universal REST API via Route Handlers), validasi Zod terbagi, proteksi Bearer Token JWT, CORS, dan URL as State.",
    cpmk: "Mahasiswa mampu merancang arsitektur data ganda (Server Actions untuk Web dan REST API Route Handlers untuk Mobile/Universal Clients), mengamankan endpoint publik dengan Bearer Token JWT Supabase, CORS headers, mitigasi abuse, validasi skema Zod, serta mengelola URL search params untuk filter dan pagination.",
    cpmkPoints: [
      {
        code: "CPMK 6.1",
        badge: "BFF vs Universal REST",
        title: "Perancangan Arsitektur Ganda (Web BFF & Mobile REST API)",
        desc: "Merancang arsitektur data hibrida yang memisahkan `Server Actions` (Web BFF tanpa bundle) dari `Next.js 16 Route Handlers` (`/api/v1/*`) untuk melayani klien mobile multi-platform (*Flutter, React Native, cURL*).",
        keywords: ["Dual Architecture", "Server Actions (BFF)", "Route Handlers", "Universal REST API", "Mobile-Ready Backend"]
      },
      {
        code: "CPMK 6.2",
        badge: "DRY Schema & RFC 7807",
        title: "Standarisasi Validasi Terbagi (Shared Zod) & Kontrak Respons",
        desc: "Menerapkan prinsip *Don't Repeat Yourself (DRY)* dengan skema `Zod safeParse()` terpusat serta menstandarisasi format respons JSON semantik berbasis spesifikasi `RFC 7807` dan status codes (`200`, `201`, `400`, `401`, `422`).",
        keywords: ["Shared Zod Schemas", "Zod safeParse", "RFC 7807 Contract", "HTTP Status Codes", "DRY Principle"]
      },
      {
        code: "CPMK 6.3",
        badge: "Bearer JWT & CORS",
        title: "Pengamanan Endpoint Publik (Bearer Token JWT & Kebijakan CORS)",
        desc: "Mengamankan endpoint publik menggunakan autentikasi stateless `Authorization: Bearer <jwt>`, penanganan `OPTIONS Preflight CORS`, isolasi `Row Level Security (RLS)`, dan pencegahan kebocoran `SERVICE_ROLE_KEY`.",
        keywords: ["Bearer Token JWT", "CORS Preflight (OPTIONS)", "PostgreSQL RLS", "Anti-ServiceRole Leak", "Stateless Auth"]
      },
      {
        code: "CPMK 6.4",
        badge: "URL as State & Pagination",
        title: "Sinkronisasi State Pencarian (URL as State) & Supabase Pagination",
        desc: "Mengelola state pencarian dan penyaringan di server via `URLSearchParams` dengan teknik *debounced input (300ms)* serta mengoptimasi eksekusi pagination range query Supabase `range(from, to)` berskala jutaan baris.",
        keywords: ["URL as State", "URLSearchParams", "Debounced Search (300ms)", "Supabase Range Query", "Server-Side Filtering"]
      }
    ],
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 400,
    concepts: {
      summary: "Membangun aplikasi modern menuntut fleksibilitas arsitektur ganda: Web Dashboard yang cepat dan reaktif menggunakan React Server Components & Server Actions (BFF Pattern), serta RESTful API Route Handlers berbasis standar HTTP untuk melayani Klien Mobile (Flutter/React Native) dan integrasi publik. Seluruh endpoint publik diamankan dengan verifikasi Bearer Token JWT, kebijakan CORS lintas-domain, penegakan Row Level Security (RLS) PostgreSQL, serta sinkronisasi state pencarian dan pagination melalui URL search parameters.",
      points: [
        { title: "Dual Architecture: BFF vs Universal REST API", desc: "Server Actions untuk internal web dengan 0-bundle dan progressive enhancement; Route Handlers (route.ts) untuk melayani aplikasi mobile Flutter/React Native dengan format JSON standar." },
        { title: "DRY Validation: Shared Zod Schemas", desc: "Satu skema Zod (taskSchema) memvalidasi form web via Server Action dan memvalidasi payload request.json() di REST Route Handler secara konsisten." },
        { title: "Optimal REST API Security (Bearer JWT & CORS)", desc: "Autentikasi stateless via header Authorization: Bearer <jwt>, penanganan CORS Preflight OPTIONS, dan pencegahan mutlak kebocoran SERVICE_ROLE_KEY." },
        { title: "URL as State & Server-Side Filtering", desc: "Sinkronisasi kata kunci pencarian dan pagination di URL search params (?search=...&page=...) dengan input debounced 300ms dan Supabase range queries." }
      ],
      diagramNote: "Mobile Client (Bearer JWT) ➔ OPTIONS Preflight (CORS) ➔ Route Handler (Zod safeParse) ➔ Supabase Auth (getUser) ➔ PostgreSQL RLS (auth.uid) ➔ JSON RFC 7807 Response",
      deepDiveSections: [
        {
          title: "1. Arsitektur Komputasi Ganda: Server Actions (Web BFF) vs REST API Route Handlers (Mobile Backend)",
          badge: "Pilar 1: Fondasi Komputasi Ganda",
          content: "Di ekosistem Next.js modern, kita tidak lagi dipaksa memilih antara monolithic web atau decoupled API. Kita dapat menerapkan keduanya secara harmonis: Server Actions bertindak sebagai Backend-for-Frontend (BFF) untuk web peramban internal, sedangkan Route Handlers (src/app/api/.../route.ts) bertindak sebagai Universal REST API Gateway yang siap melayani aplikasi Mobile (Flutter, Kotlin, Swift) maupun integrasi pihak ketiga.",
          subpoints: [
            {
              label: "BFF Server Actions vs Decoupled Universal REST API",
              text: "1. Keterbatasan Server Actions untuk Mobile: Server Actions menggunakan format serialisasi internal Next.js (Flight RPC) yang terikat erat dengan sesi kuki peramban (browser-based cookies) dan siklus render React 19. Format ini tidak dirancang untuk dikonsumsi langsung oleh HTTP client standar seperti aplikasi mobile Flutter, cURL, atau Postman.\n\n" +
                    "2. Next.js 16 Route Handlers sebagai API Gateway: Dengan meletakkan berkas route.ts di dalam direktori src/app/api/, Next.js membangkitkan endpoint RESTful serverless murni. Route Handlers menerima dan merespons payload baku application/json dengan HTTP Status Code semantik (200, 201, 400, 401, 404, 422, 500).\n\n" +
                    "3. Skalabilitas Serverless Edge: Setiap pemanggilan method GET, POST, PUT, atau DELETE pada Route Handler dieksekusi secara instan on-demand di Edge Network dengan scale-to-zero, tanpa membebani server fisik yang menyala 24 jam.",
              code: `// src/app/api/v1/tasks/route.ts
import { NextResponse } from 'next/server';

// 1. HTTP GET - Membaca data tugas untuk aplikasi mobile
export async function GET(request: Request) {
  return NextResponse.json({
    status: 'success',
    data: [{ id: '1', title: 'Belajar REST API' }]
  });
}

// 2. HTTP POST - Membuat data tugas baru dari mobile
export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ status: 'success', data: body }, { status: 201 });
}`,
              language: "typescript",
              caption: "Anatomi Dasar Route Handler RESTful di Next.js 16 App Router"
            },
            {
              label: "Pola Reusable Business Logic & Shared Zod Schema Validation",
              text: "1. Prinsip DRY (Don't Repeat Yourself): Kesalahan arsitektur paling umum adalah membuat dua aturan validasi terpisah untuk web dan mobile. Jika syarat panjang judul tugas berubah menjadi minimal 5 karakter, developer rawan lupa memperbarui salah satu sisi.\n\n" +
                    "2. Skema Zod Terpusat (src/lib/schemas.ts): Kita mendeklarasikan kontrak data satu kali saja. Skema ini kemudian diimpor oleh Server Action (createTaskAction) untuk form web DAN diimpor oleh Route Handler (POST /api/v1/tasks) untuk payload JSON mobile.\n\n" +
                    "3. safeParse vs parse: Selalu gunakan safeParse() pada Route Handler agar kegagalan validasi tidak melempar uncaught exception (500 crash), melainkan menghasilkan objek kesalahan terstruktur yang dapat dikembalikan sebagai respons HTTP 422 Unprocessable Content.",
              code: `// src/lib/schemas.ts (Shared Contract)
import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter').max(100),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

export type TaskInput = z.infer<typeof taskSchema>;`,
              language: "typescript",
              caption: "Skema Zod Tunggal yang Dibagikan Antara Form Web dan REST API"
            },
            {
              label: "Standarisasi Format Respons RESTful & HTTP Status Code Semantics",
              text: "1. Format Respons RFC 7807: Aplikasi mobile membutuhkan kontrak JSON yang konsisten agar parser data (misal: serialisasi Dart di Flutter) tidak crash saat menerima error. Struktur baku wajib memuat properti: status, data (jika sukses), atau code dan details (jika gagal).\n\n" +
                    "2. Semantika Status Code: Dilarang keras mengembalikan HTTP 200 OK jika terjadi kesalahan (anti-pattern: { status: 200, error: 'Password salah' }). Gunakan kode status resmi:\n" +
                    "   - 200 OK: Pembacaan data (GET) atau pembaruan sukses (PUT).\n" +
                    "   - 201 Created: Pembuatan entitas baru berhasil (POST).\n" +
                    "   - 400 Bad Request: Format JSON rusak atau malformed syntax.\n" +
                    "   - 401 Unauthorized: Kredensial Bearer Token tidak ada atau kedaluwarsa.\n" +
                    "   - 404 Not Found: Data dengan ID spesifik tidak ditemukan di database.\n" +
                    "   - 422 Unprocessable Content: Data tidak lolos validasi skema Zod.\n" +
                    "   - 500 Internal Server Error: Kesalahan sistem serverless / database terputus.",
              code: `// Format Standar Respons Sukses (200 OK / 201 Created):
{
  "status": "success",
  "data": { "id": "uuid-1", "title": "Implementasi Flutter REST Client" },
  "meta": { "page": 1, "total": 1 }
}

// Format Standar Respons Kesalahan (422 Unprocessable Content):
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Input data tidak memenuhi validasi skema",
  "errors": [{ "field": "title", "message": "Judul minimal 3 karakter" }]
}`,
              language: "typescript",
              caption: "Standarisasi Struktur Payload JSON Sukses dan Error RFC 7807"
            }
          ],
          comparisonTable: {
            headers: ["Karakteristik", "Server Actions ('use server')", "REST Route Handlers (/api/...)", "Supabase PostgREST (Direct)"],
            rows: [
              ["Target Klien Utama", "Web Internal Next.js (Dashboard)", "Universal: Mobile, Web, Webhook, API Publik", "Aplikasi Mobile / Frontend Client Langsung"],
              ["Format Pertukaran Data", "React Flight RPC Payload / multipart", "Standard JSON (application/json)", "JSON via PostgREST Specification"],
              ["Metode Autentikasi", "Browser Cookies (Async cookieStore)", "Bearer Token (JWT di Header Authorization)", "Anon Key / User JWT via SDK"],
              ["Status Respons HTTP", "200 OK (dengan mutasi state internal)", "Semantik (200, 201, 400, 401, 404, 422)", "Status Codes Baku PostgREST"],
              ["Lapisan Business Logic", "Validasi Zod + mutasi data server", "Validasi Zod + Logging + Integrasi pihak ke-3", "Tergantung Database Constraints & Triggers"],
              ["CORS Requirement", "Tidak perlu (Same-Origin Web)", "Wajib dikonfigurasi untuk Mobile & Public", "Dikonfigurasi di Dashboard Supabase"]
            ]
          },
          callout: {
            type: "tip",
            title: "Prinsip Single Source of Truth",
            text: "Jangan pernah membuat file skema validasi terpisah untuk Web dan API. Selalu impor skema yang sama dari 'src/lib/schemas.ts' agar seluruh aturan bisnis aplikasi Anda terpusat di satu titik."
          }
        },
        {
          title: "2. Standar Keamanan Optimal Serverless REST API (Bearer JWT, CORS & RLS)",
          badge: "Pilar 2: Benteng Keamanan REST API",
          content: "Membuka endpoint REST API ke publik berarti mengekspos aplikasi ke potensi serangan brute-force, pencurian data lintas akun, dan manipulasi origin. Kita menerapkan standar keamanan industri berlapis: autentikasi Bearer Token JWT stateless, konfigurasi CORS (Cross-Origin Resource Sharing) dengan penanganan Preflight OPTIONS, serta penegakan mutlak Row Level Security (RLS) PostgreSQL.",
          subpoints: [
            {
              label: "Autentikasi Stateless Bearer Token JWT & Validasi Supabase Auth",
              text: "1. Mengapa Aplikasi Mobile Menggunakan Bearer Token: Berbeda dengan web browser yang otomatis mengelola cookie, aplikasi mobile (Flutter/React Native) menyimpan Access Token di penyimpanan aman perangkat (Flutter Secure Storage / Keychain). Setiap kali mobile memanggil API, token tersebut dikirimkan pada header: `Authorization: Bearer <jwt_access_token>`.\n\n" +
                    "2. Ekstraksi & Verifikasi di Route Handler: Route Handler membaca header Authorization, memisahkan prefiks 'Bearer ', lalu memanggil method resmi `supabase.auth.getUser(token)`. Supabase akan memverifikasi tanda tangan kriptografis token secara stateless.\n\n" +
                    "3. Penolakan Instan (Fast-Fail 401): Jika header tidak ditemukan, token berformat salah, atau token telah kedaluwarsa, Route Handler langsung mengembalikan respons `401 Unauthorized` sebelum mengeksekusi kueri apa pun ke database.",
              code: `// src/lib/api-auth.ts
import { createClient } from '@supabase/supabase-js';

export async function verifyApiAuth(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: 'Header Authorization: Bearer <token> wajib disertakan' };
  }

  const token = authHeader.split(' ')[1];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(
    supabaseUrl,
    supabaseKey,
    { global: { headers: { Authorization: \`Bearer \${token}\` } } }
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return { user: null, error: 'Token tidak valid atau telah kedaluwarsa' };
  }

  return { user, supabase, error: null };
}`,
              language: "typescript",
              caption: "Helper Ekstraksi & Verifikasi Bearer Token JWT pada Route Handler"
            },
            {
              label: "CORS (Cross-Origin Resource Sharing) & Penanganan Preflight OPTIONS",
              text: "1. Mekanisme Keamanan Same-Origin Browser: Saat aplikasi web frontend (misal: frontend terpisah di domain client.com) atau mobile web memanggil API di api.com, browser secara otomatis memblokir respons kecuali server memberikan izin eksplisit via header CORS.\n\n" +
                    "2. Preflight Request (HTTP OPTIONS): Sebelum peramban mengirimkan method berbahaya (POST, PUT, DELETE) atau header non-standar (Authorization), browser mengirim permintaan pendahuluan otomatis bertipe `OPTIONS`. Route Handler wajib menangkap method OPTIONS ini dan merespons dengan status 204 No Content beserta header CORS yang sah.\n\n" +
                    "3. Header CORS Wajib: Respons API wajib menyertakan:\n" +
                    "   - `Access-Control-Allow-Origin`: Menentukan domain mana yang diizinkan (gunakan '*' untuk mobile/public API atau domain spesifik untuk dashboard web).\n" +
                    "   - `Access-Control-Allow-Methods`: 'GET, POST, PUT, DELETE, OPTIONS'.\n" +
                    "   - `Access-Control-Allow-Headers`: 'Content-Type, Authorization'.",
              code: `// Helper CORS Headers baku di Next.js 16:
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Penanganan Preflight Request di Route Handler:
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}`,
              language: "typescript",
              caption: "Konfigurasi Header CORS dan Penanganan Preflight OPTIONS"
            },
            {
              label: "Isolasi Keamanan: RLS Enforcement vs Bahaya Service Role Key di Endpoint Publik",
              text: "1. Golden Rule Keamanan Cloud: DILARANG KERAS mengimpor `SUPABASE_SERVICE_ROLE_KEY` di dalam Route Handler yang dapat diakses publik! Service Role Key memiliki hak akses admin super (bypass all RLS) yang menonaktifkan seluruh kebijakan Row Level Security.\n\n" +
                    "2. Bahaya Privilege Escalation: Jika Route Handler menggunakan Service Role Key, seorang penyerang dapat mengirim request `GET /api/v1/tasks/uuid-orang-lain` dan berhasil membaca data rahasia orang lain karena RLS tidak dievaluasi oleh PostgreSQL.\n\n" +
                    "3. Penerapan RLS yang Benar: Selalu bangun instance client Supabase menggunakan token pengguna dari header request: `createClient(url, anonKey, { global: { headers: { Authorization: \`Bearer \${token}\` } } })`. Dengan demikian, PostgreSQL secara otomatis menyisipkan klaim `auth.uid() = user_id` ke setiap kueri SELECT, INSERT, UPDATE, dan DELETE.",
              code: `// ❌ ANTI-PATTERN FATAL (Bypass RLS - Bahaya Kebocoran Data!):
// const supabaseAdmin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);
// await supabaseAdmin.from('tasks').select('*'); // Mengembalikan seluruh data semua user!

// ✅ BEST PRACTICE TERUJI (RLS Enforced - Terisolasi Sempurna):
const supabaseUser = createClient(url, anonKey, {
  global: { headers: { Authorization: \`Bearer \${token}\` } }
});
// Postgres otomatis menyaring hanya data milik user yang sedang login!
const { data, error } = await supabaseUser.from('tasks').select('*');`,
              language: "typescript",
              caption: "Perbandingan Fatal: Bahaya Service Role Key vs Penegakan User Client RLS"
            }
          ],
          callout: {
            type: "warning",
            title: "Zona Bahaya Privilege Escalation",
            text: "Jangan pernah menggunakan SUPABASE_SERVICE_ROLE_KEY di Route Handler publik! Kunci ini membypass seluruh kebijakan Row Level Security (RLS) sehingga penyerang dapat membaca, mengubah, dan menghapus data milik pengguna lain."
          }
        },
        {
          title: "3. Endpoint REST API CRUD Lengkap & Penanganan Async Params Next.js 16",
          badge: "Pilar 3: Implementasi Route Handlers",
          content: "Implementasi REST API di Next.js 16 App Router terbagi menjadi dua kategori struktur rute: Endpoint Koleksi (/api/v1/tasks) untuk operasi jamak, serta Endpoint Item Spesifik (/api/v1/tasks/[id]) untuk operasi data tunggal. Next.js 16 memperkenalkan perubahan breaking change arsitektur di mana parameter rute dinamis bersifat asinkron (Promise).",
          subpoints: [
            {
              label: "Endpoint Koleksi: GET (Filtering & Pagination) & POST (Creation)",
              text: "1. Struktur Berkas src/app/api/v1/tasks/route.ts: Menangani pemanggilan pada path koleksi. Method GET menerima URL query parameters untuk filter status, pencarian kata kunci, dan pagination.\n\n" +
                    "2. Membaca Query String di Route Handler: Gunakan `const { searchParams } = new URL(request.url)` untuk mengekstrak parameter seperti ?search=laporan&page=1&limit=10.\n\n" +
                    "3. Method POST dengan Validasi Zod: Membaca request body dengan `await request.json()`, memvalidasi data menggunakan `taskSchema.safeParse(body)`, lalu menyisipkan `user_id: user.id` dari token terverifikasi sebelum mengirim kueri INSERT ke Supabase.",
              code: `// src/app/api/v1/tasks/route.ts
import { NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/api-auth';
import { taskSchema } from '@/lib/schemas';
import { corsHeaders } from '@/lib/api-response';

export async function GET(request: Request) {
  const { user, supabase, error } = await verifyApiAuth(request);
  if (error || !user || !supabase) {
    return NextResponse.json({ status: 'error', message: error }, { status: 401, headers: corsHeaders });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('tasks').select('*', { count: 'exact' }).range(from, to);
  if (search) query = query.ilike('title', \`%\${search}%\`);

  const { data, count, error: dbError } = await query;
  if (dbError) {
    return NextResponse.json({ status: 'error', message: dbError.message }, { status: 500, headers: corsHeaders });
  }

  return NextResponse.json({
    status: 'success',
    data,
    meta: { page, limit, total: count }
  }, { headers: corsHeaders });
}`,
              language: "typescript",
              caption: "Implementasi Route Handler Koleksi GET dengan Filter & Pagination"
            },
            {
              label: "Endpoint Item Spesifik: GET by ID, PUT & DELETE (Async Params Next.js 16)",
              text: "1. Breaking Change Next.js 16 pada Route Handler Params: Parameter dinamis kedua dari Route Handler sekarang bertipe Promise: `{ params }: { params: Promise<{ id: string }> }`. Anda WAJIB mengeksekusi `const { id } = await params;` sebelum membaca nilai ID.\n\n" +
                    "2. Operasi PUT (Update Parsial/Penuh): Memvalidasi perubahan data dan memperbarui record dengan klausa `.eq('id', id)`. Berkat RLS, operasi update otomatis gagal jika data tersebut bukan milik user yang sedang login.\n\n" +
                    "3. Operasi DELETE (Penghapusan Bersih): Menghapus entitas berdasarkan ID dan mengembalikan konfirmasi respons JSON dengan status 200 OK.",
              code: `// src/app/api/v1/tasks/[id]/route.ts
import { NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/api-auth';
import { corsHeaders } from '@/lib/api-response';

// ⚠️ Next.js 16: params adalah Promise<{ id: string }>
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Wajib di-await!
  const { user, supabase, error } = await verifyApiAuth(request);
  if (error || !user || !supabase) {
    return NextResponse.json({ status: 'error', message: error }, { status: 401, headers: corsHeaders });
  }

  const { error: dbError } = await supabase.from('tasks').delete().eq('id', id);
  if (dbError) {
    return NextResponse.json({ status: 'error', message: dbError.message }, { status: 500, headers: corsHeaders });
  }

  return NextResponse.json({
    status: 'success',
    message: \`Tugas dengan ID '\${id}' berhasil dihapus\`
  }, { headers: corsHeaders });
}`,
              language: "typescript",
              caption: "Implementasi DELETE Route Handler dengan Async Params Next.js 16"
            }
          ],
          callout: {
            type: "info",
            title: "Breaking Change Next.js 16: Async Params",
            text: "Pada Next.js 16, context.params pada Route Handlers dan Server Components bersifat asinkron. Jangan pernah langsung menulis params.id tanpa 'await params', karena hal tersebut akan memicu runtime error atau mengembalikan nilai undefined."
          }
        },
        {
          title: "4. URL as State & Server-Side Filtering & Pagination",
          badge: "Pilar 4: State Management & UX",
          content: "Pada arsitektur modern, URL peramban adalah Single Source of Truth untuk status antarmuka pengguna. Menyimpan kata kunci pencarian, filter status, dan nomor halaman di URL parameters (?search=...&page=...) menjamin bahwa halaman dapat di-refresh, di-bookmark, dan dibagikan secara instan tanpa kehilangan konteks data.",
          subpoints: [
            {
              label: "URL Search Parameters sebagai Single Source of Truth",
              text: "1. Kekurangan Menyimpan Filter di useState Lokal: Jika state pencarian hanya disimpan di memori React (useState), saat pengguna menyalin tautan website dan mengirimkannya ke rekan kerja, rekan kerja akan membuka halaman kosong tanpa filter yang sama. Demikian pula saat tombol reload browser ditekan, filter akan hilang.\n\n" +
                    "2. URL as State Pattern: Setiap ketikan input memperbarui query string URL peramban melalui pustaka Next.js (`useRouter`, `usePathname`, dan `useSearchParams`). Server Component di App Router secara otomatis menangkap nilai terbaru via `await searchParams` dan merender ulang data dari database.\n\n" +
                    "3. Browser History & Navigasi Back/Forward: Dengan URL as State, tombol Back dan Forward peramban berfungsi secara alami untuk mengembalikan filter sebelumnya.",
              code: `// src/components/tasks/task-search-input.tsx ('use client')
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function TaskSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Debounce 300ms untuk mencegah spam pergantian URL saat user mengetik cepat
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // Reset ke halaman 1 saat pencarian baru
    router.replace(\`\${pathname}?\${params.toString()}\`);
  }, 300);

  return (
    <input
      type="text"
      placeholder="Cari tugas..."
      defaultValue={searchParams.get('search')?.toString()}
      onChange={(e) => handleSearch(e.target.value)}
      className="px-3 py-2 border rounded-lg"
    />
  );
}`,
              language: "typescript",
              caption: "Komponen Input Pencarian dengan Sinkronisasi URL Search Params & Debounce"
            },
            {
              label: "Server-Side Range Query Supabase & Debounced Input",
              text: "1. Async searchParams di Next.js 16: Pada Server Component page.tsx, props searchParams bertipe Promise: `const { search, page } = await searchParams;`.\n\n" +
                    "2. Rumus Matematika Pagination Supabase: Supabase menggunakan method `.range(from, to)`. Rumus perhitungan offset dan limit:\n" +
                    "   - `from = (page - 1) * pageSize`\n" +
                    "   - `to = from + pageSize - 1`\n" +
                    "   Contoh untuk pageSize = 10: Halaman 1 membaca range(0, 9), Halaman 2 membaca range(10, 19), Halaman 3 membaca range(20, 29).\n\n" +
                    "3. ILIKE Search di Postgres: Gunakan `.ilike('title', \`%\${search}%\`)` untuk pencarian case-insensitive yang efisien memanfaatkan B-Tree index pada kolom teks.",
              code: `// src/app/(dashboard)/tasks/page.tsx (Server Component)
import { createClient } from '@/utils/supabase/server';

export default async function TasksPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const { search, page = '1' } = await searchParams; // ⚠️ Next.js 16 await
  const currentPage = Math.max(1, parseInt(page));
  const pageSize = 10;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await createClient();
  let query = supabase.from('tasks').select('*', { count: 'exact' }).range(from, to);

  if (search) {
    query = query.ilike('title', \`%\${search}%\`);
  }

  const { data: tasks, count } = await query;
  return <div>{/* Render daftar tugas & pagination control */}</div>;
}`,
              language: "typescript",
              caption: "Pembacaan searchParams Asinkron & Supabase Range Query di Server Component"
            }
          ]
        }
      ]
    },
    references: [
      { title: "Next.js Route Handlers Guide", url: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers", source: "Next.js" },
      { title: "Supabase Auth REST API & Bearer Tokens", url: "https://supabase.com/docs/guides/auth/auth-rest-api", source: "Supabase" },
      { title: "MDN Web Docs: Cross-Origin Resource Sharing (CORS)", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS", source: "Mozilla" },
      { title: "RFC 7807: Problem Details for HTTP APIs", url: "https://datatracker.ietf.org/doc/html/rfc7807", source: "IETF" }
    ],
    lab: {
      prerequisites: ["Proyek Modul 5 (Supabase Auth & Database) berjalan", "Pustaka use-debounce terpasang"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Instal modul pembantu debounce dan buat berkas utilitas respons standar & CORS",
          code: `npm install use-debounce

// src/lib/api-response.ts
import { NextResponse } from 'next/server';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function apiSuccess<T>(data: T, meta?: any, status = 200) {
  return NextResponse.json({ status: 'success', data, meta }, { status, headers: corsHeaders });
}

export function apiError(message: string, code = 'BAD_REQUEST', status = 400, details?: any) {
  return NextResponse.json({ status: 'error', code, message, details }, { status, headers: corsHeaders });
}`,
          language: "typescript",
          explanation: "Helper ini menjamin seluruh endpoint REST API mengembalikan format JSON yang seragam dan menyertakan header CORS untuk akses aplikasi mobile."
        },
        {
          stepNumber: 2,
          instruction: "Buat helper verifikasi autentikasi Bearer Token JWT di src/lib/api-auth.ts",
          code: `// src/lib/api-auth.ts
import { createClient } from '@supabase/supabase-js';

export async function verifyApiAuth(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, supabase: null, error: 'Kredensial Bearer Token tidak ditemukan di header' };
  }

  const token = authHeader.split(' ')[1];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(
    supabaseUrl,
    supabaseKey,
    { global: { headers: { Authorization: \`Bearer \${token}\` } } }
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return { user: null, supabase: null, error: 'Token autentikasi tidak valid atau telah kedaluwarsa' };
  }

  return { user, supabase, error: null };
}`,
          language: "typescript",
          explanation: "Helper ini memvalidasi token JWT secara stateless ke Supabase Auth dan membangun instance database client yang patuh pada RLS."
        },
        {
          stepNumber: 3,
          instruction: "Bangun Endpoint Koleksi REST API di src/app/api/v1/tasks/route.ts",
          code: `// src/app/api/v1/tasks/route.ts
import { verifyApiAuth } from '@/lib/api-auth';
import { apiSuccess, apiError, corsHeaders } from '@/lib/api-response';
import { taskSchema } from '@/lib/schemas';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: Request) {
  const { user, supabase, error } = await verifyApiAuth(request);
  if (error || !user || !supabase) return apiError(error || 'Unauthorized', 'UNAUTHORIZED', 401);

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('tasks').select('*', { count: 'exact' }).range(from, to);
  if (search) query = query.ilike('title', \`%\${search}%\`);

  const { data, count, error: dbError } = await query;
  if (dbError) return apiError(dbError.message, 'DB_ERROR', 500);

  return apiSuccess(data, { page, limit, total: count });
}

export async function POST(request: Request) {
  const { user, supabase, error } = await verifyApiAuth(request);
  if (error || !user || !supabase) return apiError(error || 'Unauthorized', 'UNAUTHORIZED', 401);

  try {
    const body = await request.json();
    const parsed = taskSchema.safeParse(body);
    if (!parsed.success) {
      return apiError('Validasi data gagal', 'VALIDATION_ERROR', 422, parsed.error.flatten().fieldErrors);
    }

    const { data, error: dbError } = await supabase
      .from('tasks')
      .insert({ ...parsed.data, user_id: user.id })
      .select()
      .single();

    if (dbError) return apiError(dbError.message, 'DB_ERROR', 500);
    return apiSuccess(data, undefined, 201);
  } catch {
    return apiError('Format JSON malformed atau tidak valid', 'BAD_REQUEST', 400);
  }
}`,
          language: "typescript",
          explanation: "Endpoint ini melayani pembacaan koleksi tugas dengan filter pencarian dan pagination, serta pembuatan tugas baru dengan validasi skema Zod."
        },
        {
          stepNumber: 4,
          instruction: "Bangun Endpoint Item Spesifik di src/app/api/v1/tasks/[id]/route.ts",
          code: `// src/app/api/v1/tasks/[id]/route.ts
import { verifyApiAuth } from '@/lib/api-auth';
import { apiSuccess, apiError, corsHeaders } from '@/lib/api-response';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ⚠️ Next.js 16 wajib await params
  const { user, supabase, error } = await verifyApiAuth(request);
  if (error || !user || !supabase) return apiError(error || 'Unauthorized', 'UNAUTHORIZED', 401);

  const { error: dbError } = await supabase.from('tasks').delete().eq('id', id);
  if (dbError) return apiError(dbError.message, 'DB_ERROR', 500);

  return apiSuccess({ message: \`Data tugas '\${id}' berhasil dihapus\` });
}`,
          language: "typescript",
          explanation: "Endpoint dinamis ini menangani penghapusan item tugas spesifik berdasarkan UUID yang diproteksi RLS."
        },
        {
          stepNumber: 5,
          instruction: "Uji coba pemanggilan endpoint menggunakan cURL atau Thunder Client",
          code: `# 1. Tes Preflight CORS:
curl -X OPTIONS http://localhost:3000/api/v1/tasks -i

# 2. Tes GET tanpa Token (Wajib ditolak 401):
curl -X GET http://localhost:3000/api/v1/tasks -i

# 3. Tes GET dengan Bearer Token:
curl -X GET "http://localhost:3000/api/v1/tasks?search=laporan&page=1" \\
  -H "Authorization: Bearer YOUR_SUPABASE_ACCESS_TOKEN"`,
          language: "bash",
          explanation: "Pengujian cURL memverifikasi penegakan status 401 Unauthorized saat tanpa token dan respons 200 OK saat token valid disertakan."
        }
      ],
      aiPromptTemplate: {
        role: "Senior Cloud Architect & REST API Specialist",
        prompt: `Bertindaklah sebagai Senior Cloud Architect & Next.js 16 Specialist.
Tugas Anda adalah merancang arsitektur ganda (Dual Architecture) pada aplikasi "The Serverless Odyssey":
1. Server Actions untuk kebutuhan Web Dashboard internal.
2. REST API Route Handlers terproteksi (/api/v1/tasks) untuk kebutuhan Klien Mobile (Flutter/React Native) dan integrasi publik.

Silakan periksa dan pasang dependensi prasyarat:
- Pastikan pustaka 'use-debounce' terpasang: 'npm install use-debounce'
- Pastikan skema Zod 'taskSchema' di 'src/lib/schemas.ts' dapat diimpor secara modular.

Rakit kode produksi utuh siap jalan (tanpa placeholder atau komentar terpotong) untuk 6 berkas berikut:
1. 'src/lib/api-response.ts': Standarisasi JSON response helper (apiSuccess, apiError) dan objek 'corsHeaders' lengkap dengan penanganan Access-Control-Allow-*.
2. 'src/lib/api-auth.ts': Helper ekstraksi 'Authorization: Bearer <token>', verifikasi via 'supabase.auth.getUser(token)', dan inisialisasi client Supabase berbasis token pengguna (menjaga kepatuhan RLS, 0 pemakaian service role key).
3. 'src/app/api/v1/tasks/route.ts': Route Handler koleksi:
   - 'OPTIONS': Handler preflight CORS 204 No Content.
   - 'GET': Ekstraksi URL query string (?search, ?page, ?limit), kueri range Supabase, dan pagination metadata.
   - 'POST': Validasi JSON body via 'taskSchema.safeParse()', penolakan 422 jika gagal, penyisipan user_id dari token, dan pengembalian 201 Created.
4. 'src/app/api/v1/tasks/[id]/route.ts': Dynamic Route Handler:
   - Menangani Next.js 16 async params: 'const { id } = await params;'
   - 'OPTIONS', 'GET' spesifik, dan 'DELETE' terproteksi Bearer Auth.
5. 'src/components/tasks/task-search-input.tsx': Komponen Client ('use client') input pencarian tersinkronisasi URL via useRouter & useSearchParams dengan debounce 300ms.
6. 'src/app/page.tsx': Perbarui Landing Page utama di root '/' dengan Banner Hero navigasi dan tombol CTA jelas menuju Dashboard Tugas (/tasks) serta dokumentasi singkat endpoint REST API Mobile.

Batasan Arsitektur Ketat:
- Dilarang keras menggunakan 'SUPABASE_SERVICE_ROLE_KEY' di Route Handler publik.
- Next.js 16: Parameter dinamis 'params' dan 'searchParams' WAJIB di-await.
- 0 tipe 'any', gunakan TypeScript strict.`,
        tip: "Dapatkan Access Token pengguna yang sedang login di browser melalui console peramban: `(await supabase.auth.getSession()).data.session?.access_token` untuk menguji endpoint via Postman atau cURL."
      },
      warningZone: {
        title: "Zona Bahaya: Kebocoran Data Lintas Pengguna via Service Role Key",
        desc: "Jangan pernah menggunakan SUPABASE_SERVICE_ROLE_KEY di dalam REST Route Handler publik. Kunci ini mematikan seluruh Row Level Security (RLS) PostgreSQL, sehingga penyerang dapat membaca dan menghapus tugas milik pengguna lain hanya dengan menebak parameter UUID."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 6: Implementasi REST API Terproteksi & Search URL State",
      taskDesc: "Bangun endpoint REST API serverless lengkap untuk aplikasi mobile yang diamankan dengan Bearer Token JWT dan CORS, serta integrasikan fitur pencarian URL as State pada dashboard web.",
      definitionOfDone: [
        "Endpoint REST API GET /api/v1/tasks mendukung filter pencarian dan pagination dengan format JSON standar",
        "Endpoint POST /api/v1/tasks memvalidasi input via Zod dan mengembalikan 201 Created atau 422 Unprocessable Content",
        "Endpoint terproteksi DELETE /api/v1/tasks/[id] mewajibkan header Authorization: Bearer <token> dan menolak request ilegal dengan 401 Unauthorized",
        "Header CORS (Access-Control-Allow-*) dan preflight OPTIONS terpasang pada route handler untuk mendukung akses klien mobile",
        "Halaman dashboard web mengintegrasikan pencarian instan tersinkronisasi URL (?search=...) dengan debounce 300ms"
      ],
      gitBranchTask: "git checkout -b feature/crud-rest-api-security"
    },
    quiz: {
      totalQuestions: 7,
      passingScore: 80,
      questions: [
        {
          id: 1,
          question: "Mengapa fungsi Server Actions Next.js ('use server') tidak cocok dikonsumsi secara langsung oleh aplikasi mobile (Flutter / React Native), dan bagaimana Route Handlers (route.ts) menyelesaikan kebutuhan arsitektur ini?",
          rubric: "Mahasiswa wajib menjelaskan bahwa Server Actions menggunakan format serialisasi internal Next.js (Flight RPC) yang terikat dengan browser cookie session dan siklus render React Web. Route Handlers menyelesaikan masalah ini dengan menyediakan endpoint HTTP RESTful universal berbasis format JSON standar (application/json) dan status code HTTP semantik yang dapat dikonsumsi oleh HTTP client multi-platform.",
          keyConcepts: ["Flight RPC vs JSON REST", "Browser Cookie Session vs Stateless HTTP", "Universal Client Interoperability", "Route Handlers sebagai API Gateway"],
          weight: 15,
          socraticHint: "Bandingkan format data yang dihasilkan oleh Server Action saat form disubmit dengan respons JSON murni dari endpoint REST API. Bagaimana aplikasi mobile di luar browser menangani kedua format tersebut?"
        },
        {
          id: 2,
          question: "Jelaskan alur verifikasi autentikasi Bearer Token JWT pada Route Handler Next.js 16! Mengapa pendekatan ini disebut stateless dibanding sistem sesi berbasis kuki peramban tradisional?",
          rubric: "Mahasiswa wajib menguraikan bahwa klien mobile menyertakan token JWT pada header 'Authorization: Bearer <jwt>'. Route Handler mengekstrak token dan memverifikasinya melalui supabase.auth.getUser(token) secara kriptografis tanpa mencari session ID di memori RAM server, sehingga cocok dengan karakteristik serverless yang scale-to-zero.",
          keyConcepts: ["Header Authorization: Bearer", "Stateless JWT Verification", "Scale-to-Zero Compatibility", "supabase.auth.getUser()"],
          weight: 15,
          socraticHint: "Pikirkan apa yang terjadi jika serverless function mati setelah mengeksekusi request. Mengapa server tidak perlu mengingat sesi login sebelumnya saat memproses Bearer Token pada request berikutnya?"
        },
        {
          id: 3,
          question: "Apa itu mekanisme CORS Preflight (HTTP OPTIONS) dan mengapa peramban web mengirimkannya secara otomatis sebelum memproses request POST, PUT, atau DELETE ke endpoint REST API yang berbeda origin?",
          rubric: "Mahasiswa wajib menjelaskan mekanisme Same-Origin Policy pada peramban, peran HTTP OPTIONS sebagai preflight handshake untuk menanyakan izin apakah origin, method, dan header (seperti Authorization) diizinkan oleh server, serta kewajiban Route Handler merespons dengan header Access-Control-Allow-* dan status 204 No Content.",
          keyConcepts: ["Cross-Origin Resource Sharing (CORS)", "Preflight Request (OPTIONS)", "Same-Origin Policy", "Access-Control-Allow-Headers", "204 No Content"],
          weight: 15,
          socraticHint: "Bayangkan sebuah website jahat di browser mencoba memanggil API bank Anda secara diam-diam dengan membawa kredensial Anda. Bagaimana preflight OPTIONS melindungi pengguna sebelum request mutasi data dieksekusi?"
        },
        {
          id: 4,
          question: "Mengapa penggunaan SUPABASE_SERVICE_ROLE_KEY di dalam Route Handler yang dapat diakses publik merupakan bencana keamanan fatal (Privilege Escalation)? Bagaimana cara yang benar menginisialisasi client Supabase di dalam Route Handler?",
          rubric: "Mahasiswa wajib menjelaskan bahwa Service Role Key membypass 100% kebijakan Row Level Security (RLS) PostgreSQL sehingga penyerang dapat membaca dan memanipulasi data milik semua pengguna. Pendekatan yang benar adalah menggunakan ANON_KEY yang dikombinasikan dengan token pengguna pada header Authorization agar PostgreSQL tetap menerapkan isolasi RLS berbasis auth.uid().",
          keyConcepts: ["Bypass Row Level Security (RLS)", "Privilege Escalation Vulnerability", "Anon Key + Bearer Header", "Isolasi Data auth.uid()"],
          weight: 15,
          socraticHint: "Apa yang terjadi pada evaluasi klausul 'USING (auth.uid() = user_id)' di PostgreSQL jika koneksi database dilakukan menggunakan peran superuser / service_role?"
        },
        {
          id: 5,
          question: "Mengapa pada aplikasi web Next.js Server Components, state pencarian dan pagination sebaiknya disimpan di URL Search Parameters (?search=...&page=...) dibanding hanya di-state lokal React (useState)?",
          rubric: "Mahasiswa wajib menjelaskan konsep URL as Single Source of Truth: halaman menjadi shareable, bookmarkable, mendukung navigasi browser (back/forward history), serta memungkinkan Server Component membaca searchParams secara langsung di sisi server untuk fetching data teroptimasi tanpa client-side waterfall.",
          keyConcepts: ["URL as Single Source of Truth", "Bookmarkable & Shareable State", "Server-Side Fetching via searchParams", "Browser History Navigation", "Debounce Input"],
          weight: 14,
          socraticHint: "Jika Anda memfilter daftar tugas dengan kata kunci 'penting' dan menyalin link di address bar peramban untuk dikirimkan ke teman, apa yang terjadi jika filter tersebut hanya disimpan di useState lokal?"
        },
        {
          id: 6,
          question: "Bagaimana standarisasi format respons JSON (RFC 7807) dan penggunaan semantika HTTP Status Code (200, 201, 400, 401, 404, 422, 500) meningkatkan stabilitas aplikasi mobile klien?",
          rubric: "Mahasiswa wajib menjelaskan bahwa format terstruktur (status, data, error, code, details) memudahkan deserialisasi model di aplikasi mobile (seperti Dart di Flutter), dan status code semantik memungkinkan klien menentukan alur UI secara otomatis (misal: redirect ke login saat 401, mapping error ke form field saat 422, atau menampilkan banner retry saat 500).",
          keyConcepts: ["RFC 7807 Problem Details", "HTTP Status Code Semantics", "Mobile Deserialization Stability", "Error Mapping (422 vs 401 vs 500)"],
          weight: 13,
          socraticHint: "Bagaimana developer aplikasi mobile Flutter membedakan antara 'token login habis' dan 'input form judul kosong' jika backend selalu mengembalikan HTTP status 200 OK untuk semua kondisi?"
        },
        {
          id: 7,
          question: "Bagaimana cara kerja rumus pemetaan pagination Supabase '.range(from, to)' dari parameter query 'page' dan 'limit'? Jelaskan keunggulan query range berindeks dibanding pemuatan seluruh data ke memori!",
          rubric: "Mahasiswa wajib menjelaskan rumus matematika: from = (page - 1) * limit dan to = from + limit - 1. Selanjutnya menjelaskan bahwa membatasi pembacaan data di level database engine mencegah overhead transmisi memori jaringan (O(1) memory per page) dibanding memuat 10.000 baris ke RAM aplikasi, serta memanfaatkan indeks B-Tree PostgreSQL untuk pemindaian cepat.",
          keyConcepts: ["Supabase .range(from, to)", "Rumus from & to", "Index Scan vs Full Table Scan", "Memory Overhead Prevention", "Scalable Server-Side Pagination"],
          weight: 13,
          socraticHint: "Jika tabel Anda memiliki 50.000 baris tugas, mengapa query .range(0, 9) jauh lebih hemat memori dan cepat dibanding mengambil semua data lalu melakukan .slice(0, 10) di memori JavaScript?"
        }
      ]
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
    title: "Deployment ke Vercel, CI/CD Pipeline & Observability",
    subtitle: "Otomatisasi build produksi dari GitHub ke Vercel, konfigurasi Preview Deployments, dan penanganan crash dengan Error Boundaries.",
    cpmk: "Mahasiswa mampu mengonfigurasi pipeline CI/CD otomatis dari GitHub ke platform Vercel, mengisolasi fitur via Preview Branches, serta menangani runtime error dengan Error Boundaries.",
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 450,
    concepts: {
      summary: "Vercel menyediakan pipeline CI/CD otomatis untuk setiap push ke GitHub. Digabungkan dengan Error Boundaries (error.tsx, not-found.tsx) dan Vercel Runtime Logs, aplikasi memiliki ketahanan tinggi terhadap error tak terduga di lingkungan produksi.",
      points: [
        { title: "Production Build & Environment Sync", desc: "Next.js melakukan optimasi kompilasi dan type-check saat build, disinkronkan dengan Environment Variables aman di Vercel." },
        { title: "Branching & Preview Deployments", desc: "Setiap push ke branch fitur menghasilkan URL pratinjau terisolasi untuk peninjauan sebelum digabungkan ke branch main." },
        { title: "Error Boundaries (error.tsx & not-found.tsx)", desc: "Menangkap runtime crash secara elegan pada tingkat layout tanpa menyebabkan layar putih kosong (blank screen) bagi pengguna." },
        { title: "Vercel Runtime Logs & Reverse-Prompting", desc: "Membaca stack trace error serverless di cloud secara real-time dan mendiagnosis solusinya dengan bantuan AI Prompt." }
      ]
    },
    references: [
      { title: "Vercel Next.js Deployment Docs", url: "https://vercel.com/docs/frameworks/nextjs", source: "Vercel" },
      { title: "Next.js Error Handling Guide", url: "https://nextjs.org/docs/app/building-your-application/routing/error-handling", source: "Next.js" },
      { title: "Vercel Runtime Logs Docs", url: "https://vercel.com/docs/observability/runtime-logs", source: "Vercel" }
    ],
    lab: {
      prerequisites: ["Akun Vercel terhubung ke GitHub", "Proyek lokal bebas error lint dan build"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Uji coba build lokal terlebih dahulu untuk menangkap error sebelum deploy",
          code: "npm run build",
          language: "bash",
          explanation: "Jika perintah ini sukses menghasilkan folder .next tanpa error typecheck, aplikasi Anda siap di-deploy ke Vercel."
        },
        {
          stepNumber: 2,
          instruction: "Buat komponen Error Boundary di src/app/error.tsx",
          code: `'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error ke sistem analitik / monitoring
    console.error('Runtime error caught by boundary:', error)
  }, [error])

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Terjadi Kesalahan Sistem!</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md">
        {error.message || 'Terjadi gangguan saat memproses data. Tim teknis telah menerima log insiden ini.'}
      </p>
      {error.digest && (
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
          Digest: {error.digest}
        </span>
      )}
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Coba Muat Ulang
      </button>
    </div>
  )
}`,
          language: "typescript",
          explanation: "File error.tsx wajib berupa Client Component dan menyediakan fungsi reset() untuk mencoba me-render ulang rute yang gagal."
        },
        {
          stepNumber: 3,
          instruction: "Buat halaman 404 Kustom di src/app/not-found.tsx",
          code: `import Link from 'next/link'
import { FileQuestion, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
        <FileQuestion className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Halaman Tidak Ditemukan (404)</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md">
        Data atau rute yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Beranda
      </Link>
    </div>
  )
}`,
          language: "typescript",
          explanation: "File not-found.tsx menangani status HTTP 404 ketika pemanggilan fungsi notFound() dieksekusi di Server Component."
        }
      ],
      aiPromptTemplate: {
        role: "DevOps & Reliability Engineer",
        prompt: "Aplikasi Next.js saya mengalami error saat build/runtime di Vercel: [PASTE PESAN ERROR / LOG]. Tolong bantu analisis penyebab kegagalan dari stack trace tersebut dan berikan solusi perbaikannya pada kode terkait.",
        tip: "Periksa selalu apakah variabel lingkungan rahasia seperti NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY sudah dimasukkan di tab Settings -> Environment Variables Vercel."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 13: Live Deployment & Observability",
      taskDesc: "Hubungkan repository GitHub ke Vercel, terapkan Environment Variables, uji Preview Deployment dari Pull Request, serta pasang error boundary pencegah crash.",
      definitionOfDone: [
        "Project berhasil di-deploy ke Vercel dengan domain publik *.vercel.app aktif",
        "Environment variables Supabase & Cloudinary terpasang sempurna di dashboard Vercel",
        "Komponen error.tsx dan not-found.tsx terpasang dan teruji menangkal crash tak terduga",
        "Terdapat minimal 1 Preview Deployment sukses yang dihasilkan dari Pull Request branch fitur"
      ],
      gitBranchTask: "git checkout -b feature/vercel-deployment-observability"
    }
  },
  {
    id: 14,
    worldId: "world-2",
    worldTitle: "Dunia 2: Rich UI, Media & Real-time",
    weekNumber: 14,
    title: "Otomasi Serverless, Vercel Cron Jobs & Arsitektur Webhooks",
    subtitle: "Mengatasi limitasi timeout serverless dengan tugas terjadwal (Vercel Cron) dan integrasi event eksternal asinkron yang aman (Webhooks).",
    cpmk: "Mahasiswa mampu merancang sistem otomatisasi terjadwal (Vercel Cron Jobs) dan endpoint Webhook receiver aman berbasis verifikasi kriptografis HMAC SHA-256.",
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 450,
    concepts: {
      summary: "Fungsi Serverless bersifat stateless dan memiliki batas waktu eksekusi ketat (Execution Timeout 10–60s). Vercel Cron Jobs dan Webhook Signature Verification adalah dua fondasi wajib untuk menjalankan otomatisasi periodik dan memproses event eksternal secara asinkron tanpa risiko pemalsuan data.",
      points: [
        { title: "Serverless Timeout & Asynchronous Pattern", desc: "Mengapa fungsi serverless tidak boleh menjalankan loop daemon dan bagaimana pola pemicu asinkron bekerja." },
        { title: "Vercel Cron Jobs (vercel.json)", desc: "Mendefinisikan jadwal eksekusi ekspresi cron (5-field) yang secara otomatis memicu Route Handler Next.js di cloud." },
        { title: "Pengamanan Endpoint via CRON_SECRET", desc: "Memvalidasi header Authorization: Bearer agar endpoint otomatisasi tidak dapat ditembak atau dieksploitasi publik." },
        { title: "Webhook Architecture: Push vs Poll", desc: "Menerima notifikasi instan saat terjadi event di layanan pihak ketiga (Stripe, GitHub, Supabase) tanpa polling berkala." },
        { title: "Verifikasi Kriptografis HMAC SHA-256", desc: "Membandingkan hash signature payload menggunakan kunci rahasia (node:crypto) untuk memastikan payload asli dan belum dimanipulasi." },
        { title: "Idempotensi Transaksi", desc: "Menjamin mutasi database aman dari eksekusi ganda jika webhook dikirim ulang oleh sistem pengirim." }
      ]
    },
    references: [
      { title: "Vercel Cron Jobs Documentation", url: "https://vercel.com/docs/cron-jobs", source: "Vercel" },
      { title: "Securing Webhooks with HMAC SHA-256", url: "https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries", source: "GitHub Docs" },
      { title: "Next.js Route Handlers Guide", url: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers", source: "Next.js" }
    ],
    lab: {
      prerequisites: ["Aplikasi Next.js 16 aktif", "Akun Vercel terhubung ke GitHub", "Tools HTTP Client (cURL, Thunder Client, atau Postman)"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Buat berkas konfigurasi vercel.json untuk jadwal Cron Job",
          code: `{
  "crons": [
    {
      "path": "/api/cron/cleanup-tasks",
      "schedule": "0 0 * * *"
    }
  ]
}`,
          language: "json",
          explanation: "Ekspresi cron '0 0 * * *' menjadwalkan Vercel untuk memanggil rute /api/cron/cleanup-tasks setiap tengah malam (00:00 UTC)."
        },
        {
          stepNumber: 2,
          instruction: "Bangun Route Handler Cron Terproteksi di src/app/api/cron/cleanup-tasks/route.ts",
          code: `import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  // 1. Verifikasi token rahasia CRON_SECRET dari Vercel Scheduler
  const authHeader = request.headers.get('authorization')
  if (authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing CRON_SECRET token' },
      { status: 401 }
    )
  }

  // 2. Eksekusi tugas otomatis (misal: arsipkan tugas berstatus done yang lebih dari 30 hari)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('tasks')
    .update({ is_archived: true })
    .eq('status', 'done')
    .lt('updated_at', thirtyDaysAgo)
    .select('id')

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    message: 'Cron job executed successfully',
    archivedCount: data?.length ?? 0,
    timestamp: new Date().toISOString(),
  })
}`,
          language: "typescript",
          explanation: "Vercel secara otomatis mengirimkan header 'Authorization: Bearer <CRON_SECRET>' saat memicu cron. Endpoint wajib memvalidasi token ini."
        },
        {
          stepNumber: 3,
          instruction: "Bangun Webhook Receiver Aman dengan HMAC SHA-256 di src/app/api/webhooks/external/route.ts",
          code: `import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'

export async function POST(request: NextRequest) {
  try {
    // 1. Baca raw body sebagai teks untuk validasi kriptografis
    const rawBody = await request.text()
    const signature = request.headers.get('x-webhook-signature')
    const secret = process.env.WEBHOOK_SIGNING_SECRET

    if (!signature || !secret) {
      return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
    }

    // 2. Hitung digest HMAC SHA-256 dari raw body
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex')

    // 3. Bandingkan signature secara aman dari timing attack
    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )

    if (!isSignatureValid) {
      return NextResponse.json({ error: 'Invalid cryptographic signature' }, { status: 401 })
    }

    // 4. Parse payload JSON setelah tanda tangan terbukti sah
    const payload = JSON.parse(rawBody)
    console.log('Valid webhook payload received:', payload.event)

    // 5. Kembalikan 200 OK sesegera mungkin (< 5 detik)
    return NextResponse.json({ received: true, event: payload.event }, { status: 200 })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: 'Webhook processing failed', details: errorMsg }, { status: 500 })
  }
}`,
          language: "typescript",
          explanation: "Verifikasi webhook wajib membaca raw body murni (bukan request.json()) sebelum di-hash dan diverifikasi dengan timingSafeEqual."
        }
      ],
      aiPromptTemplate: {
        role: "Serverless Systems Architect & Security Engineer",
        prompt: "Buatkan Next.js 16 Route Handler untuk Webhook Receiver di /api/webhooks/[nama-layanan] yang membaca raw body, memvalidasi tanda tangan kriptografis HMAC SHA-256 dari header x-signature menggunakan secret key dari process.env, dan memproses data secara idempoten ke Supabase.",
        tip: "Gunakan crypto.timingSafeEqual saat membandingkan hash signature untuk mencegah serangan timing attack."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 14: Otomasi Terjadwal & Integrasi Webhook Aman",
      taskDesc: "Pasang konfigurasi vercel.json untuk tugas otomatis berkala, bangun endpoint cron terproteksi, serta sediakan webhook receiver dengan verifikasi tanda tangan kriptografis.",
      definitionOfDone: [
        "File vercel.json terkonfigurasi dengan jadwal cron yang valid",
        "Endpoint cron /api/cron/... menolak request tanpa token CRON_SECRET yang valid (401 Unauthorized)",
        "Endpoint webhook /api/webhooks/... memverifikasi keaslian signature HMAC SHA-256 sebelum memproses payload",
        "Pengujian simulasi payload webhook berhasil mengembalikan status 200 OK via cURL atau Thunder Client"
      ],
      gitBranchTask: "git checkout -b feature/cron-and-webhooks"
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
