---
title: "Standar & Aturan Resmi Pengembangan Platform The Serverless Odyssey"
description: "Aturan arsitektur Next.js 16, framework prompt C-R-E-T, estetika VS Code, hover zoom, dan alur misi proyek."
---

# Standar & Aturan Resmi Pengembangan Platform "The Serverless Odyssey"

Dokumen ini adalah acuan resmi sistem agen, AI coding assistant, dan pengembang untuk seluruh modul perkuliahan.

---

## 1. Arsitektur & Teknologi (Next.js 16 App Router)

- **Default Server Components (RSC)**:
  - Setiap file komponen `.tsx` di App Router secara default adalah React Server Component (0 kB JavaScript bundle ke klien).
  - Gunakan RSC untuk akses database langsung, SDK server, dan rahasia environment.
- **Batasan Ketat Client Component (`'use client'`)**:
  - Direktif `'use client'` HANYA boleh ditempatkan pada komponen daun terluar (*leaf components*) yang secara langsung membutuhkan `useState`, `useEffect`, event listener (`onClick`, `onChange`), atau browser API.
  - **DILARANG KERAS** menambahkan `'use client'` di level `page.tsx` atau `layout.tsx` utama.
- **Breaking Change Next.js 16 (Async Params)**:
  - `params` dan `searchParams` adalah `Promise<{ ... }>`.
  - Wajib menggunakan `const { id } = await params;` sebelum membaca propertinya di Server Components.
- **Pola Komposisi (Interleaving Pattern)**:
  - Dilarang mengimpor Server Component secara langsung di dalam Client Component.
  - Lewatkan Server Component sebagai prop `children` ke dalam Client Component pembungkus.
- **Ekosistem 4 Pilar**:
  1. Next.js 16 (App Router + Server Actions)
  2. Supabase (PostgreSQL Database, Auth, Realtime, RLS)
  3. Cloudinary (AI Media CDN & Image Processing)
  4. Vercel (Edge Network & CI/CD Deployment)

---

## 2. Metodologi Prompting AI (Framework C-R-E-T)

Setiap template prompt AI yang disajikan kepada mahasiswa wajib mematuhi 4 unsur presisi **C-R-E-T**:
1. **C — Context (Domain Aplikasi)**: Jelaskan konteks spesifik fitur dan aplikasi yang sedang dibangun secara mendalam.
2. **R — Role (Persona Pakar)**: Wajib diawali kalimat persona pakar di baris teratas prompt (contoh: *"Bertindaklah sebagai Senior Frontend UI/UX Engineer & Next.js 16 Specialist."*).
3. **E — Explicit Constraints**: Sebutkan versi teknologi dan batasan teknis yang dilarang/diharuskan secara tegas (misal: dilarang `'use client'` di file `page.tsx`, gunakan semantic Tailwind tokens Shadcn, tanpa tipe `any`).
4. **T — Target Output Structure**: Minta struktur file terpisah yang modular dan jelas (misal: file 1 Server Page dan file 2 Client Component filter).

> **Catatan Penamaan Prompt:**
> - Hindari penamaan spesifik vendor seperti "(Copilot / Cursor)".
> - Gunakan judul profesional generik: **"Formula Prompt AI Teruji"**.
> - Teks prompt harus *copy-ready* (sekali klik tombol copy, seluruh formula C-R-E-T tersalin utuh).

---

## 3. Tampilan & Efek Zoom Kode (VS Code Aesthetics)

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

---

## 4. Tab Misi Proyek & Metode Bola Salju (*Snowballing Project*)

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

## 5. Lingkungan Pengembangan & Server Lokal

- Jangan pernah menjalankan `next build` bersamaan ketika dev server (`next dev`) sedang berjalan, karena dapat merusak cache internal Turbopack.
- Jika browser menampilkan cache usang (*stale*), bersihkan direktori `.next/` lalu jalankan ulang dev server dan lakukan *hard refresh* (`Ctrl + Shift + R`).
- Dilarang membuat file sementara di luar direktori workspace.
