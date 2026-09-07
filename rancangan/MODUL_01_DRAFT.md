# Modul 1: Memulai Perjalanan Serverless & AI-Assisted Workflow

Selamat datang di "The Serverless Odyssey"! Di modul pertama ini, kita tidak akan langsung menulis ratusan baris kode. Kita akan fokus membangun fondasi: memahami medan perang (arsitektur Serverless), menyiapkan persenjataan (Git, Node.js, AI Tools), dan memastikan pertahanan kita aman (Security Hygiene).

---

## 1. Arsitektur Modern: Serverless (BaaS vs FaaS)

Di masa lalu, mendeploy aplikasi berarti Anda harus menyewa server fisik atau VPS (Virtual Private Server), menginstal sistem operasi, mengatur database, dan menjaganya tetap hidup 24/7. Ini sangat melelahkan!

Sekarang, kita menggunakan **Arsitektur Serverless**. *Serverless* BUKAN berarti tidak ada server, melainkan **Anda tidak perlu mengurus servernya**. Provider cloud yang akan mengurusnya untuk Anda. 

Ada dua model utama dalam Serverless:
1. **FaaS (Function-as-a-Service):** Anda hanya menulis satu fungsi kecil (misal: fungsi kalkulasi diskon). Fungsi ini hanya berjalan (dan Anda hanya membayar) ketika ada yang memanggilnya. Contoh: *Vercel Serverless Functions*, *AWS Lambda*.
2. **BaaS (Backend-as-a-Service):** Anda mendapatkan backend utuh (Database, Autentikasi, Storage) yang sudah jadi dan dikelola penuh oleh penyedia layanan. Contoh: **Supabase**, *Firebase*.

### Ekosistem Aplikasi Kita (The Tech Stack)
Di kelas ini, kita akan menggunakan kombinasi teknologi *bleeding-edge* terbaik di industri:
* 🌐 **Next.js (App Router):** Framework React tercanggih untuk membangun antarmuka web (Frontend) sekaligus logika sisi server (Server Actions).
* 🗄️ **Supabase:** Penyedia *Backend-as-a-Service* open-source berbasis PostgreSQL. Mengurus Database, Login User, dan Keamanan Data (RLS).
* 🖼️ **Cloudinary:** Layanan penyimpanan dan optimasi aset media (gambar/video) super cepat berbasis AI.
* 🚀 **Vercel:** Platform *cloud* tempat kita mendeploy (menerbitkan) aplikasi Next.js ke internet secara instan.

---

## 2. Setup Lingkungan Tempur (Environment Setup)

Sebelum menulis kode, pastikan laptop Anda sudah terinstal:
1. **Node.js (Versi LTS terbaru - minimal v20):** Mesin (runtime) untuk menjalankan JavaScript di luar browser. [Download Node.js](https://nodejs.org/)
2. **Visual Studio Code (VS Code) / Cursor:** Editor teks tempat kita mengetik kode.

### The AI-Assisted Workflow (Kerja Bareng AI)
Kalian diizinkan, bahkan **diwajibkan**, menggunakan bantuan AI (seperti GitHub Copilot, Cursor, atau ChatGPT) untuk membantu ngoding. 
Namun ada syaratnya: **Pahami kode yang dihasilkan AI.**

**Rumus Prompting Dasar yang Baik:**
> *"Saya menggunakan Next.js 15 App Router dan Tailwind CSS v4. Buatkan komponen form login dengan 2 input (email dan password). Jangan gunakan state React (useState), melainkan gunakan Server Actions."*

*(Semakin spesifik versi framework yang Anda sebutkan, semakin akurat jawaban AI).*

---

## 3. Git & GitHub: Jantung Kolaborasi & CI/CD

Git adalah sistem *version control* (penyimpan riwayat kode). GitHub adalah sosial media dan tempat penyimpanan cloud untuk riwayat kode Anda.

Mengapa kita pakai GitHub? Karena **Vercel terhubung langsung dengan GitHub**. Setiap kali Anda menyimpan kode ke GitHub, Vercel akan otomatis memperbarui website Anda di internet! (Ini disebut CI/CD).

### Public vs Private Repository
* **Private Repo:** Kode Anda tidak bisa dilihat publik. Cocok saat Anda masih belajar dan takut kode berantakan dilihat orang.
* **Public Repo:** Semua orang bisa melihat kode Anda. Sangat direkomendasikan untuk portofolio melamar kerja! Di kelas ini, proyek Anda bebas dimulai secara *Private*, namun wajib *Public* saat pengumpulan UAS.

### Langkah-langkah Dasar Git
Buka terminal di VS Code, dan jalankan secara berurutan:
```bash
git init                   # 1. Menginisialisasi folder ini agar dilacak Git
git add .                  # 2. Memasukkan semua file yang berubah ke 'keranjang'
git commit -m "init project" # 3. Memberi label/pesan pada riwayat ini
git push origin main       # 4. Mengirim riwayat ini ke cloud (GitHub)
```

### ⚠️ PERINGATAN KRITIS: `.gitignore` dan `.env.local`
Dalam proyek nyata, Anda akan memiliki kunci rahasia (seperti *Supabase Secret Key* atau kata sandi database). Kunci ini disimpan di file bernama `.env.local`.

**HUKUM DOSA TAK TERAMPUNI DI INDUSTRI:** 
Mendorong (nge-push) file `.env.local` ke GitHub Publik! Jika Anda melakukannya, *hacker* bisa mencuri database Anda dalam hitungan detik.

**Solusinya:** Gunakan file `.gitignore`.
Pastikan di dalam file `.gitignore` proyek Anda terdapat tulisan `.env.local`. Ini akan memberitahu Git untuk "mengabaikan" file tersebut sehingga tidak akan pernah terkirim ke GitHub.

---

## Misi Minggu Ini (Praktikum)
1. Buat akun di **GitHub**, **Supabase**, dan **Vercel**.
2. Buat repository baru di GitHub (Pilih Public/Private sesuai kenyamanan).
3. Buat folder proyek di laptop Anda, buka terminal, lalu jalankan:
   `npx -y create-next-app@latest my-serverless-app --app --ts --tailwind --eslint`
4. Lakukan `git commit` pertama Anda dan `git push` ke repository GitHub yang sudah dibuat.
5. Kumpulkan link repository GitHub Anda sebagai bukti penyelesaian Misi 1.
