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
      subpoints?: { label: string; text: string }[];
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
          title: "1. Paradigma Serverless: FaaS vs BaaS vs Monolith",
          badge: "Pilar 1: Komputasi Cloud Modern",
          content: "Di era web tradisional, developer harus menyewa VPS (Virtual Private Server), menginstal OS Linux, memasang web server Nginx, PM2 process manager, dan memelihara database 24 jam sehari meskipun tidak ada pengguna yang aktif. Serverless mengubah paradigma ini: server tetap ada di cloud, namun seluruh provisioning, auto-scaling, dan maintenance dikelola secara otomatis oleh penyedia platform.",
          subpoints: [
            {
              label: "FaaS (Function as a Service)",
              text: "Model komputasi berbasis event (event-driven). Kode backend dipecah menjadi fungsi-fungsi modular yang hanya 'bangun' saat dipanggil (misal: saat request HTTP masuk), mengeksekusi logika dalam milidetik, lalu otomatis mati kembali (scale-to-zero). Anda hanya membayar per milidetik eksekusi (Rp 0 saat idle). Contoh: Vercel Serverless Functions & Next.js 16 Server Actions."
            },
            {
              label: "BaaS (Backend as a Service)",
              text: "Layanan penyedia seluruh infrastruktur backend siap pakai berbasis API & SDK. Menyediakan Database PostgreSQL terkelola penuh, Autentikasi Pengguna (OAuth GitHub/JWT), File Storage CDN, dan WebSocket Realtime tanpa perlu merakit Linux server database manual. Contoh: Supabase."
            },
            {
              label: "Ekosistem 4 Pilar di Perkuliahan Kita",
              text: "Next.js 16 (Frontend & Server Actions) ↔️ Vercel (Edge/Serverless CI/CD Hosting) ↔️ Supabase (Database PostgreSQL & Auth) ↔️ Cloudinary (AI Media CDN)."
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
          }
        },
        {
          title: "2. Mental Model Git & Keamanan Kunci Rahasia (Secrets Hygiene)",
          badge: "Pilar 2: Keamanan Repositori",
          content: "Git adalah sistem pelacak versi terdistribusi yang membagi status file ke dalam 3 wilayah kerja lokal dan 1 repositori remote di cloud. Memahami siklus ini sangat krusial untuk mencegah kebocoran data sensitif.",
          subpoints: [
            {
              label: "Arsitektur 3 Wilayah Kerja Lokal",
              text: "Working Tree (tempat Anda mengetik kode di editor) ➔ Staging Area (keranjang seleksi berkas via 'git add') ➔ Local Repository / HEAD (snapshot riwayat permanen di folder tersembunyi .git via 'git commit')."
            },
            {
              label: "Identitas Author (Global vs Local)",
              text: "Git mewajibkan setiap commit memiliki user.name dan user.email. Konfigurasi '--global' berlaku untuk seluruh komputer (~/.gitconfig), sedangkan konfigurasi lokal (tanpa --global) memungkinkan override identitas per-folder untuk memisahkan akun kampus dan akun pribadi."
            },
            {
              label: "Mekanisme Perlindungan .gitignore",
              text: "File .env.local memuat API Secret (seperti Supabase Service Role Key). Bot scraper otomatis di GitHub publik memindai setiap commit publik setiap detik. Mendaftarkan .env.local ke dalam file .gitignore memastikan berkas rahasia tidak pernah terunggah ke GitHub."
            },
            {
              label: "Filosofi Feature Branch Workflow",
              text: "Cabang utama 'main' selalu dijaga dalam kondisi stabil dan siap rilis. Seluruh pengerjaan tugas mingguan wajib dilakukan di cabang terpisah ('git checkout -b feature/*') sebelum digabungkan kembali via merge."
            }
          ],
          callout: {
            type: "warning",
            title: "Hukum Keamanan Industri: Jangan Pernah Commit File .env.local!",
            text: "Kunci API yang terlanjur ter-push ke repositori GitHub publik akan tersimpan permanen di histori Git meskipun file tersebut dihapus pada commit berikutnya. Selalu periksa aturan .gitignore sebelum melakukan commit pertama!"
          }
        },
        {
          title: "3. Metodologi Prompting AI Berkonteks Tinggi (Framework C-R-E-T)",
          badge: "Pilar 3: AI-Assisted Engineering",
          content: "Model bahasa besar (LLM seperti Cursor, Copilot, ChatGPT, Claude) dilatih menggunakan miliaran baris kode di internet. Tanpa batasan konteks yang presisi, AI cenderung menghasilkan kode usang (seperti Next.js Pages Router atau React 18 deprecated hooks) yang memicu error fatal di Next.js 16.",
          subpoints: [
            {
              label: "C — Context (Domain Aplikasi)",
              text: "Jelaskan konteks spesifik aplikasi yang sedang dibangun (misal: 'Saya sedang membangun dashboard tugas kuliah serverless')."
            },
            {
              label: "R — Role (Persona Pakar)",
              text: "Berikan peran profesional spesifik kepada AI (misal: 'Bertindaklah sebagai Senior Full-Stack Cloud Architect')."
            },
            {
              label: "E — Explicit Versions & Constraints",
              text: "Sebutkan versi tepat dan batasan arsitektur (misal: 'Wajib Next.js 16 App Router, React 19 useActionState, Tailwind CSS v4, Server Actions async, dilarang membuat file /api/ terpisah')."
            },
            {
              label: "T — Target Output Structure",
              text: "Minta format output yang terstruktur (misal: 'Sertakan skema validasi Zod, tipe return { success, errors }, dan pesan ramah pengguna')."
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
        role: "Senior Full-Stack Architect",
        prompt: "Saya sedang membangun aplikasi web menggunakan Next.js 16 (App Router), Tailwind CSS v4, dan Supabase. Tolong jelaskan struktur folder terbaik di dalam folder /src untuk memisahkan komponen UI, server actions, dan utilitas database sesuai konvensi Next.js 16.",
        tip: "Selalu sebutkan versi Next.js 16 secara spesifik agar AI menghasilkan kode Server Actions terkini dengan standar React 19 dan async cookies."
      },
      warningZone: {
        title: "Zona Bahaya: Kebocoran API Key!",
        desc: "JANGAN PERNAH melakukan git commit pada file .env atau .env.local yang berisi service_role key. Kunci rahasia yang ter-push ke GitHub publik dapat disalahgunakan oleh bot scraper dalam hitungan detik."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 1: Setup Repository & Sandbox Proyek",
      taskDesc: "Buat repository GitHub publik baru untuk proyek kuliah Anda, inisialisasi Next.js, dan buat commit pertama yang bersih.",
      definitionOfDone: [
        "Repository GitHub berhasil dibuat dan terhubung ke local workspace",
        "Next.js berjalan lancar di http://localhost:3000",
        "File .gitignore memuat aturan pengabaian .env.local dan node_modules",
        "Link GitHub disubmit ke LMS / dosen"
      ],
      gitBranchTask: "git checkout -b feature/sandbox-init"
    }
  },
  {
    id: 2,
    worldId: "world-1",
    worldTitle: "Dunia 1: Fondasi & Backend Serverless",
    weekNumber: 2,
    title: "Next.js App Router & Komponen Shadcn UI",
    subtitle: "Membedakan Server vs Client Components, dan merakit antarmuka modern dengan Shadcn UI.",
    cpmk: "Mahasiswa mampu merancang tata letak halaman web dengan Server & Client Components serta mengintegrasikan komponen Shadcn UI.",
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 200,
    concepts: {
      summary: "Next.js App Router secara default memperlakukan semua komponen sebagai Server Components (RSC) untuk performa instan tanpa bundle JS ke client.",
      points: [
        { title: "Server vs Client Components", desc: "RSC merender HTML di server (cepat, SEO friendly). Client Component ('use client') dibutuhkan hanya saat ada event interaktif (onClick, onChange, hooks)." },
        { title: "Shadcn UI Paradigm", desc: "Bukan library NPM tertutup, melainkan komponen berbasis Radix UI & Tailwind yang kodenya disalin langsung ke folder project kita untuk kustomisasi 100%." }
      ]
    },
    references: [
      { title: "Next.js Server and Client Components", url: "https://nextjs.org/docs/app/building-your-application/rendering/server-components", source: "Next.js" },
      { title: "Shadcn UI Installation for Next.js", url: "https://ui.shadcn.com/docs/installation/next", source: "Shadcn UI" }
    ],
    lab: {
      prerequisites: ["Proyek Minggu 1 yang sudah berjalan"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Inisialisasi Shadcn UI di proyek Anda",
          code: "npx shadcn@latest init",
          language: "bash",
          explanation: "Pilih gaya New York / Default, warna Netral/Zinc, dan aktifkan CSS variables."
        },
        {
          stepNumber: 2,
          instruction: "Tambahkan komponen Button, Card, dan Input dari Shadcn",
          code: "npx shadcn@latest add button card input badge",
          language: "bash"
        }
      ],
      aiPromptTemplate: {
        role: "UI Engineer",
        prompt: "Buatkan halaman dashboard sederhana di Next.js App Router (src/app/dashboard/page.tsx) menggunakan komponen Button, Card, dan Badge dari Shadcn UI. Buat komponen ini sebagai Server Component dan gunakan Tailwind CSS untuk tata letak grid responsif.",
        tip: "Ingatkan AI untuk tidak menambahkan 'use client' jika komponen tersebut hanya menampilkan data statis."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 2: Layout Dashboard Proyek Akhir",
      taskDesc: "Rancang kerangka antarmuka (Wireframe / Shell UI) untuk Proyek Akhir Anda menggunakan komponen Shadcn UI.",
      definitionOfDone: [
        "Shadcn UI terpasang dan dapat digunakan",
        "Terdapat minimal 3 komponen Shadcn di halaman utama proyek",
        "Layout responsif di layar mobile dan desktop"
      ],
      gitBranchTask: "git checkout -b feature/ui-scaffolding"
    }
  },
  {
    id: 3,
    worldId: "world-1",
    worldTitle: "Dunia 1: Fondasi & Backend Serverless",
    weekNumber: 3,
    title: "Server Actions & Validasi Data (Zod)",
    subtitle: "Mutasi data aman tanpa membuat API route manual, divalidasi dengan skema Zod.",
    cpmk: "Mahasiswa mampu mengimplementasikan Server Actions ('use server') untuk mutasi data form dan memvalidasi input dengan Zod.",
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 250,
    concepts: {
      summary: "Server Actions memungkinkan pemanggilan fungsi backend asinkron langsung dari form HTML atau tombol tanpa membuat file API terpisah di /api/*.",
      points: [
        { title: "'use server' Directive", desc: "Menandai fungsi yang dieksekusi secara aman di server, menjaga logic dan kredensial database tetap tersembunyi dari browser." },
        { title: "React 19 useActionState & Zod", desc: "Menggunakan hook useActionState dari React 19 untuk mengelola state feedback form dan memvalidasi tipe data secara ketat dengan skema Zod." }
      ]
    },
    references: [
      { title: "Next.js Server Actions Guide", url: "https://nextjs.org/docs/app/building-your-application/data-mutation/server-actions-and-mutations", source: "Next.js" },
      { title: "Zod Schema Validation Docs", url: "https://zod.dev", source: "Zod" }
    ],
    lab: {
      prerequisites: ["Library zod terpasang"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Instal pustaka Zod untuk validasi skema",
          code: "npm install zod",
          language: "bash"
        },
        {
          stepNumber: 2,
          instruction: "Buat file skema validasi Zod (src/lib/schemas.ts)",
          code: `import { z } from "zod";

export const TaskSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(100),
  description: z.string().optional(),
});`,
          language: "typescript"
        }
      ],
      aiPromptTemplate: {
        role: "Backend Architect",
        prompt: "Buatkan Server Action di Next.js 16 untuk menangani submit form tugas. Validasi data FormData menggunakan Zod schema. Kembalikan state { success: boolean, errors?: any } yang kompatibel dengan hook useActionState di React 19.",
        tip: "Gunakan useActionState dari react (bukan useFormState deprecated dari react-dom) untuk mengelola status loading dan validasi form."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 3: Form Input Tervalidasi",
      taskDesc: "Buat form input data pertama untuk entitas utama Proyek Akhir Anda yang diproses dengan Server Action dan Zod.",
      definitionOfDone: [
        "Skema Zod terdefinisi dengan pesan error ramah pengguna",
        "Server Action berhasil membaca FormData",
        "Pesan validasi muncul jika input tidak sesuai"
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
    subtitle: "Inisiasi Proyek Akhir resmi, merancang skema relasional 3 tabel di Supabase SQL Editor.",
    cpmk: "Mahasiswa mampu merancang skema relasi PostgreSQL (1:N, M:N) dan mengonfigurasi klien Supabase SSR.",
    duration: "150 Menit Lab + 180 Menit Mandiri",
    xp: 300,
    concepts: {
      summary: "Supabase menyediakan database PostgreSQL penuh. Minggu ini adalah Kick-off Resmi Proyek Akhir: Mahasiswa membuat repositori final dan merancang database.",
      points: [
        { title: "Relasi 1:N & Foreign Key", desc: "Menghubungkan tabel pengguna dengan tabel postingan/tugas menggunakan UUID sebagai kunci primer." },
        { title: "Supabase SSR & Async Cookies (Next.js 16)", desc: "Next.js 16 mewajibkan penanganan asynchronous pada cookies (const cookieStore = await cookies()). Utilitas SSR menggunakan getAll() dan setAll() untuk mengelola sesi auth secara aman." }
      ]
    },
    references: [
      { title: "Supabase PostgreSQL Database Docs", url: "https://supabase.com/docs/guides/database", source: "Supabase" },
      { title: "Supabase SSR Next.js Guide", url: "https://supabase.com/docs/guides/auth/server-side/nextjs", source: "Supabase" }
    ],
    lab: {
      prerequisites: ["Akun Supabase siap", "Paket @supabase/ssr terinstal"],
      steps: [
        {
          stepNumber: 1,
          instruction: "Instal library Supabase SSR terbaru",
          code: "npm install @supabase/supabase-js @supabase/ssr",
          language: "bash"
        },
        {
          stepNumber: 2,
          instruction: "Konfigurasi utilitas koneksi Supabase di src/utils/supabase/server.ts",
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
            // Dipanggil dari Server Component (diabaikan jika ada middleware pembaru sesi)
          }
        },
      },
    }
  )
}`,
          language: "typescript",
          explanation: "Pada Next.js 16, cookies() adalah fungsi asynchronous sehingga wajib diawali dengan 'await cookies()'."
        }
      ],
      aiPromptTemplate: {
        role: "Database Administrator",
        prompt: "Buatkan query SQL PostgreSQL untuk Supabase untuk membuat 3 tabel yang saling berelasi untuk aplikasi [TEMA APLIKASI ANDA]. Gunakan UUID sebagai primary key (gen_random_uuid()) dan sertakan kolom created_at timestamptz.",
        tip: "Selalu sertakan kolom foreign key dengan klausa ON DELETE CASCADE untuk integritas data referensial."
      }
    },
    mission: {
      taskTitle: "Misi Minggu 4: Inisiasi Repo Final & Migrasi Database",
      taskDesc: "Inisiasi repositori resmi Proyek Akhir dan jalankan script SQL pembuatan minimal 3 tabel di Supabase SQL Editor.",
      definitionOfDone: [
        "Tabel PostgreSQL berhasil dibuat di dashboard Supabase dengan minimal 3 tabel berelasi",
        "File .env.local terisi URL dan Anon Key Supabase",
        "Utilitas Supabase SSR terpasang di src/utils/supabase/"
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
