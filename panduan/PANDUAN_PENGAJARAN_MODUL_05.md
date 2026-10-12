# BUKU PANDUAN PENGAJAR (TEACHING GUIDE)
## KULIAH "THE SERVERLESS ODYSSEY" — MODUL 5
**Topik:** Arsitektur Autentikasi Serverless: Spektrum Model Autentikasi, Unified Multi-Provider Portal, Next.js 16 Edge Middleware & PostgreSQL Triggers  
**Target Pembaca:** Dosen Pengampu / Instruktur Laboratorium  
**Alokasi Waktu:** 150 Menit (Tatap Muka Lab) + 180 Menit (Tugas Mandiri)  
**CPMK:** Mahasiswa mampu menganalisis 5 model autentikasi industri (ID Institusi, Email/Password, Social OAuth, Passwordless, Enterprise SSO), merancang *Unified Auth Portal* multi-provider, memproteksi rute privat via Next.js 16 Edge Middleware, serta mengotomasi sinkronisasi profil pengguna menggunakan PostgreSQL Triggers.

---

## 1. Rencana Alokasi Waktu Kuliah (150 Menit Tatap Muka)

| Durasi | Sesi | Agenda Pengajaran & Aktivitas Kelas |
| :---: | :--- | :--- |
| **00 - 15'** | **Apersepsi & Spektrum Autentikasi** | Membandingkan 5 model autentikasi di dunia nyata: ID Institusi (NIM/NIDN pada LMS kampus) vs Email/Password vs Social OAuth vs Passwordless vs Enterprise SSO. |
| **15 - 45'** | **Pendalaman Konsep Teori** | Membedah 4 Pilar: Stateless JWT (RFC 7519) vs Stateful RAM, Siklus 6 langkah Authorization Code Flow OAuth 2.0, Next.js 16 Edge Middleware (`getUser()` vs `getSession()`), dan pemisahan `auth.users` vs `public.profiles`. |
| **45 - 65'** | **Simulasi Interaktif Visual** | Membuka tab "Konsep & Teori" pada platform dan menjalankan simulator interaktif (JWT Lifecycle, OAuth Handshake, Session Refresher, dan Auto Profile Trigger). |
| **65 - 100'** | **Praktikum Lab: Dual-Track Delivery (Bertahap vs All-in-One)** | Mahasiswa memilih metode eksekusi: **Jalur Bertahap (5 Tahapan)** untuk pemahaman & pengujian mandiri per model autentikasi, atau **Jalur All-in-One** untuk perakitan cepat. Verifikasi checkpoint di setiap tahapan. |
| **100 - 125'** | **Live Auth Walkthrough & Verifikasi Sesi** | Dosen memandu setup GitHub OAuth App, menguji login 1-klik GitHub, menguji form Email/Password & Magic Link, serta memeriksa kuki sesi di DevTools. |
| **125 - 140'** | **Misi Snowballing Git** | Memandu mahasiswa membuat branch `feature/unified-multi-provider-auth`, mengecek 6 kriteria *Definition of Done* (DoD), dan melakukan commit git. |
| **140 - 150'** | **Evaluasi Tab 4 (Uji Pemahaman)** | Mengawasi mahasiswa mengerjakan 7 soal esai interaktif anti-cheat (Mastery Learning threshold $\ge 80$). |

---

## 1.1. Strategi Pembelajaran Dual-Track (Jalur Bertahap vs Jalur All-in-One)

Pada platform perkuliahan, tab **Lab & Prompt AI** dilengkapi dengan sakelar **Dual-Track Delivery** yang menyajikan dua metode eksekusi berdampingan:

### Jalur Bertahap (Step-by-Step — Rekomendasi Utama untuk Kelas)
Dirancang agar mahasiswa memahami secara mendalam setiap model autentikasi secara individual tanpa beban kognitif berlebih (*zero cognitive overload*). Setiap tahap bersifat modular dan dapat diuji langsung di peramban tanpa menimbulkan error kompilasi:
1. **Tahap 1: Fondasi Keamanan Edge & Database Trigger Profil**
   - *Target:* `src/utils/supabase/middleware.ts`, `src/middleware.ts`, `supabase/migrations/02_auth_profiles_trigger.sql`, `src/app/(auth)/login/page.tsx`
   - *Checkpoint Browser:* Akses `http://localhost:3000/dashboard` ➔ Otomatis dialihkan ke `/login?next=%2Fdashboard` dengan pesan gateway aktif.
2. **Tahap 2: Model 1 — Kredensial Mandiri (Email & Password)**
   - *Target:* `src/actions/auth.ts`, `src/components/auth/email-password-form.tsx`, `src/app/(auth)/login/page.tsx`
   - *Checkpoint Browser:* Registrasi & login email ➔ Redirect ke `/dashboard`. Cek `public.profiles` di Supabase: baris baru otomatis terbentuk!
3. **Tahap 3: Model 2 — 1-Click Social OAuth 2.0 GitHub**
   - *Target:* `src/app/auth/callback/route.ts`, `src/actions/auth.ts`, `src/components/auth/github-login-button.tsx`, `src/app/(auth)/login/page.tsx`
   - *Checkpoint Browser:* Klik "Masuk dengan GitHub" ➔ Otorisasi ➔ Kembali via `/auth/callback` ke `/dashboard` dengan avatar & profil tersinkronisasi.
4. **Tahap 4: Model 3 — Passwordless Magic Link OTP**
   - *Target:* `src/actions/auth.ts`, `src/components/auth/magic-link-form.tsx`, `src/app/(auth)/login/page.tsx`
   - *Checkpoint Browser:* Kirim tautan Magic Link ➔ Cek inbox email / Inbucket ➔ Klik tautan verifikasi ➔ Login otomatis tanpa password.
5. **Tahap 5: Penyatuan Antarmuka (Unified Auth Portal) & Navigasi Root**
   - *Target:* `src/components/auth/unified-auth-card.tsx`, `src/app/(auth)/login/page.tsx`, `src/app/page.tsx`
   - *Checkpoint Browser:* Halaman `/` cerdas mendeteksi sesi; halaman `/login` menyajikan portal 3 metode terpadu berbasis tab modern.

### Jalur Cepat (All-in-One — Fast-Track)
Disediakan untuk mahasiswa dengan kemampuan cepat (*fast-track learners*) atau untuk referensi arsitektur komprehensif, merakit seluruh 6 berkas sistem autentikasi sekaligus dalam 1 prompt All-in-One.

---

## 2. Penjelasan Lengkap Tiap Sub-Materi (Untuk Narasi Mengajar)

### Pilar 1: Spektrum Model Autentikasi Modern & Arsitektur Supabase Auth Engine

1. **Dekonstruksi 5 Model Autentikasi Industri & Kasus Penggunaan:**
   - **Narasi Dosen:** *"Di dunia kerja, seorang software architect tidak sekadar tahu cara membuat form login. Anda harus tahu model autentikasi mana yang paling tepat untuk domain bisnis Anda:*
     - *Model 1: ID Internal (NIM/NIDN/NIK) — Tepat untuk jaringan tertutup seperti SIAKAD kampus atau sistem kepegawaian. Akun dibuat oleh admin, kontrol 100%, bebas pihak ketiga.*
     - *Model 2: Email & Password — Standar B2C publik (E-Commerce). Universal, tapi membawa risiko kebocoran database dan serangan credential stuffing.*
     - *Model 3: Social OAuth 2.0 (GitHub/Google) — Standar emas aplikasi SaaS. Pendaftaran 1-klik instan menaikkan konversi hingga 40-50%, dan aplikasi kita bebas dari liabilitas menyimpan password (Zero Password Liability).*
     - *Model 4: Passwordless (Magic Link / OTP WA) — Dipakai Notion, Slack, FinTech. Menghapus beban mengingat kata sandi.*
     - *Model 5: Enterprise SSO (SAML/Okta) — Standar B2B korporasi multinasional agar IT bisa mencabut akses karyawan keluar dalam 1 klik."*
   - **Poin Kunci:** Pemilihan model autentikasi menentukan konversi pengguna dan profil risiko keamanan data.

2. **Stateful Session vs Stateless JWT (RFC 7519):**
   - **Narasi Dosen:** *"Pada server monolith Express atau Laravel tradisional, sesi disimpan di RAM server atau Redis. Ketika serverless function menyala dan mati dalam milidetik (*scale-to-zero*), tidak ada memori persisten bersama antar-eksekusi (*no shared memory*). Solusinya adalah Stateless JWT: token 3 bagian (Header, Payload, Signature) yang ditandatangani secara kriptografis menggunakan kunci rahasia HMAC-SHA256. Serverless function memverifikasi keaslian token seketika tanpa perlu kueri database berulang-ulang."*
   - **Poin Kunci:** Verifikasi instan via tanda tangan digital, hemat compute database, dan kebal terhadap scale-to-zero.

3. **Pola Desain Hibrida: Unified Auth Portal:**
   - **Narasi Dosen:** *"Jangan batasi pengguna Anda pada 1 metode saja. Di industri, kita menggabungkan tombol 1-Click Social Login (GitHub) di baris atas untuk onboarding instan, disertai pilihan tab Email & Password dan Magic Link di baris bawah untuk fleksibilitas maksimal. Semua metode ini bermuara ke mesin Supabase Auth yang sama dan diverifikasi oleh satu Middleware yang sama."*

---

### Pilar 2: Protokol OAuth 2.0 Authorization Code Flow & Passwordless

1. **Alur 6 Langkah Authorization Code Grant (GitHub Provider):**
   - **Narasi Dosen:** *"Mengapa GitHub tidak langsung mengirimkan access token ke peramban pengguna? Jika token rahasia ditaruh di URL peramban (`#access_token=...`), token tersebut sangat rentan dicuri lewat ekstensi browser jahat atau log history. Karena itu, protokol OAuth 2.0 menggunakan 2 tahap:*
     1. *GitHub mengirimkan authorization code sementara (berumur 10 menit) ke URL callback.*
     2. *Route Handler backend kita di `/auth/callback` menukarkan kode tersebut secara rahasia ke server GitHub/Supabase via saluran HTTPS server-to-server. Hasilnya: token tidak pernah terpapar di peramban publik!"*

2. **Mekanisme Passwordless (Email Magic Link):**
   - **Narasi Dosen:** *"Ketika pengguna meminta Magic Link, Supabase membuat token acak kriptografis sekali pakai (OTP) berumur 15 menit dan mengirimkannya ke email pengguna. Mengklik link tersebut membuktikan bahwa pengguna adalah pemilik sah email tersebut tanpa risiko password pengguna dicuri atau ditebak hacker."*

---

### Pilar 3: Proteksi Rute di Next.js 16 (Edge Middleware & Session Sync)

1. **Intersepsi Edge di `src/middleware.ts`:**
   - **Narasi Dosen:** *"Middleware berjalan di Vercel Edge Network yang paling dekat dengan lokasi fisik pengguna di seluruh dunia. Middleware mencegat request HTTP sebelum Server Component dirender. Mengapa ini penting? Untuk mencegah 'Flash of Unauthenticated Content'—yaitu kondisi ketika halaman privat sempat berkedip tampil sebelum akhirnya dialihkan."*

2. **Bahaya Fatal `getSession()` vs Keharusan Mutlak `getUser()`:**
   - **Narasi Dosen:** *"Ingat aturan keamanan nomor satu di Supabase: DILARANG KERAS memanggil `getSession()` di Middleware! Mengapa? Karena `getSession()` hanya membaca payload kuki lokal di laptop user tanpa menghubungi server Supabase. Jika ada karyawan yang sudah dipecat atau akunnya dinonaktifkan admin 5 menit lalu, `getSession()` tetap menganggap user tersebut sah! Selalu gunakan `getUser()` yang melakukan verifikasi kriptografis real-time ke auth server Supabase."*

3. **Dual-Cookie Synchronization (`updateSession`):**
   - **Narasi Dosen:** *"Ketika token sesi di-refresh oleh Supabase, helper middleware wajib menyalin token baru ke dua tempat secara bersamaan:*
     1. *Ke `request.cookies`: agar Server Component (RSC) yang akan dirender tepat setelah middleware langsung menerima token baru.*
     2. *Ke `response.cookies`: agar peramban pengguna menyimpan header `Set-Cookie` untuk request berikutnya."*

---

### Pilar 4: Sinkronisasi Profil Pengguna & Database Triggers

1. **Pemisahan `auth.users` vs `public.profiles`:**
   - **Narasi Dosen:** *"Skema `auth.users` adalah skema internal milik sistem Supabase GoTrue. Jangan pernah lancang menambahkan kolom kustom seperti `role` atau `avatar_url` ke tabel tersebut karena dapat merusak update Supabase! Buatlah tabel aplikasi sendiri di `public.profiles` dengan primary key `id UUID REFERENCES auth.users(id) ON DELETE CASCADE`."*

2. **Otomasi Trigger PostgreSQL (`on_auth_user_created`):**
   - **Narasi Dosen:** *"Jangan pernah menulis kode pembuatan profil di aplikasi JavaScript! Mengapa? Jika pengguna login via GitHub OAuth dan koneksi internetnya putus tepat saat diarahkan kembali ke web kita, profilnya bisa gagal dibuat (anomali data). Dengan membuat PostgreSQL Trigger `AFTER INSERT ON auth.users`, pembuatan profil dijamin 100% atomik di tingkat kernel database, apapun metode login yang digunakan!"*

---

## 3. Peta Berkas & Di Mana Menemukan Kode (File Architecture Map)

Setelah mahasiswa mengeksekusi Formula Prompt AI di tab **Lab & Prompt AI**, repositori proyek mereka akan memiliki arsitektur 7 berkas modular berikut:

```
📁 serverless-project/
├── 📁 supabase/
│   └── 📁 migrations/
│       └── 📄 02_auth_profiles_trigger.sql    <-- [BERKAS 6] DDL public.profiles & Trigger on_auth_user_created
├── 📁 src/
│   ├── 📁 middleware.ts                       <-- [BERKAS 2] Root Edge Interceptor (Regex Matcher)
│   ├── 📁 utils/
│   │   └── 📁 supabase/
│   │       └── 📄 middleware.ts               <-- [BERKAS 1] Helper updateSession() (Dual-Cookie Sync & Route Guard)
│   ├── 📁 actions/
│   │   └── 📄 auth.ts                         <-- [BERKAS 4] Server Actions: Email Login, SignUp, Magic Link, Logout
│   ├── 📁 components/
│   │   └── 📁 auth/
│   │       └── 📄 unified-auth-card.tsx       <-- [BERKAS 5B] Kartu Login Terpadu (GitHub 1-Click + Tab Kredensial)
│   └── 📁 app/
│       ├── 📁 (auth)/
│       │   └── 📁 login/
│       │       └── 📄 page.tsx                <-- [BERKAS 5A] Halaman Login (Server Component)
│       ├── 📁 auth/
│       │   └── 📁 callback/
│       │       └── 📄 route.ts                <-- [BERKAS 3] Route Handler Penukar Kode Otorisasi OAuth
│       └── 📄 page.tsx                        <-- [BERKAS 7] Root Landing Page (Auth State Aware Navigation)
```

---

## 4. Runutan Alur Eksekusi Data (Data Lifecycle Trace)

Tunjukkan diagram alur ini di proyektor saat sesi walkthrough:

```
[PENGGUNA DI BROWSER]
       │
       ▼ (1. Klik "Masuk dengan GitHub" di Unified Auth Portal)
[SUPABASE BROWSER CLIENT - signInWithOAuth({ provider: 'github' })]
       │
       ▼ (2. Browser dialihkan ke halaman izin GitHub)
[GITHUB AUTHORIZATION SERVER]
       │ (User setuju memberikan akses)
       ▼ (3. GitHub mengalihkan kembali dengan Authorization Code sementara)
[NEXT.JS ROUTE HANDLER - src/app/auth/callback/route.ts]
       │
       ├─► Ekstraksi parameter URL: const code = searchParams.get('code')
       ├─► Eksekusi Server-to-Server: supabase.auth.exchangeCodeForSession(code)
       │
       ▼ (4. Supabase GoTrue Engine Memverifikasi Kredensial)
[POSTGRESQL KERNEL ENGINE]
       │
       ├─► 4A. Baris akun baru dibuat di tabel internal `auth.users`
       ├─► 4B. Trigger PL/pgSQL `on_auth_user_created` otomatis menyala!
       └─► 4C. Baris profil disuntikkan ke `public.profiles` secara atomik!
       │
       ▼ (5. Token JWT Sesi Diterbitkan)
[BROWSER MEMPEROLEH KUKI SESI HTTP-ONLY]
       │
       ▼ (6. Pengguna dialihkan ke rute privat /dashboard)
[NEXT.JS 16 EDGE MIDDLEWARE - src/middleware.ts]
       │
       ├─► Intersepsi: updateSession(request)
       ├─► Verifikasi Real-time: const { data: { user } } = await supabase.auth.getUser()
       ├─► Dual Cookie Sync: Salin ke request.cookies dan response.cookies
       └─► Status Lolos 200 OK ➔ Izinkan Server Component /dashboard merender data!
```

---

## 5. Checklist Demonstrasi Kelas Pasca Eksekusi Prompt AI

Lakukan 6 langkah demonstrasi ini secara berurutan di hadapan mahasiswa:

### 1. Buka Supabase Dashboard ➔ Provider GitHub & Redirect URLs
- Tunjukkan menu **Authentication ➔ Providers ➔ GitHub**: Pastikan sakelar aktif, Client ID dan Secret terisi.
- Tunjukkan menu **Authentication ➔ URL Configuration**: Pastikan `http://localhost:3000/auth/callback` terdaftar di *Redirect URLs*.

### 2. Buka Supabase SQL Editor (Eksekusi Trigger Profil)
- Buka file `supabase/migrations/02_auth_profiles_trigger.sql` di VS Code, salin dan tempel ke Supabase SQL Editor.
- Klik **Run**. Tunjukkan bahwa tabel `public.profiles` dan fungsi trigger `handle_new_user()` telah aktif.

### 3. Demonstrasi Halaman Login Terpadu (`http://localhost:3000/login`)
- Tunjukkan tampilan antarmuka *Unified Auth Portal*:
  - Tombol hitam mencolok: **"Masuk dengan GitHub"** dengan logo brand.
  - Pemisah: *"Atau pilih metode kredensial"*.
  - Tab Switcher: Tab **Email & Password** dan Tab **Magic Link**.

### 4. Demonstrasi Login 1-Klik GitHub OAuth
- Klik tombol **"Masuk dengan GitHub"**.
- Tunjukkan transisi layar ke domain `github.com/login/oauth/authorize`.
- Klik tombol hijau izin ➔ Tunjukkan browser otomatis mendarat mulus di `/dashboard`.

### 5. Buktikan Eksekusi Trigger di Supabase Table Editor
- Buka Supabase **Table Editor ➔ public.profiles**.
- Tunjukkan ke mahasiswa: Baris baru otomatis muncul berisi ID yang sama dengan ID akun GitHub, nama lengkap akun GitHub, dan link foto avatar asli!
- Jelaskan: *"Lihat! Kita tidak menulis satu baris pun kode JavaScript untuk membuat profil ini; PostgreSQL menuntaskannya secara atomik lewat Trigger!"*

### 6. Uji Coba Tombol Keluar (SignOut)
- Klik tombol **Logout** di navbar.
- Tunjukkan bahwa sesi dibersihkan, kuki dihapus, dan pengguna dikembalikan ke `/login`.

---

## 6. Protokol Eksperimen & Uji Coba Pembuktian Kinerja (Proof of Execution Labs)

Lakukan 4 protokol uji coba *live* berikut di depan kelas:

```
               LAB EKSPERIMEN PEMBUKTIAN KELAS (MODUL 5)
 ┌──────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┐
 │  1. OAUTH HANDSHAKE  │  2. EDGE PENETRATION │  3. GETSESSION AUDIT │  4. KUKI HTTP-ONLY   │
 │     Code vs Token    │     Bypass Route /   │     Akun Terblokir   │     XSS Immunity     │
 │  Network Tab Inspect │  dashboard Blocking  │     Real-Time Revoke │  document.cookie Log │
 └──────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┘
```

---

### EKSPERIMEN 1: Pembuktian Alur OAuth & Inspeksi Authorization Code

- **Tujuan:** Membuktikan bahwa GitHub tidak pernah membocorkan token langsung ke browser.
- **Langkah Eksperimen:**
  1. Buka browser, tekan `F12` ➔ Tab **Network**. Centang opsi **Preserve log**.
  2. Klik tombol **Masuk dengan GitHub**.
  3. Amati URL saat browser kembali dari GitHub ke aplikasi kita.
- **Hasil yang Ditunjukkan ke Mahasiswa:**
  - URL yang masuk adalah: `http://localhost:3000/auth/callback?code=e74bf912...`
  - Perhatikan bahwa parameter yang dikirim bernama `code`, BUKAN `token` atau `password`.
  - Kode ini hanya berlaku 1 kali pakai. Coba salin kode tersebut dan buka di tab lain ➔ Supabase menolak karena kode sudah kedaluwarsa.
- **Kesimpulan:** *"Terbukti! Saluran OAuth 2.0 melindungi token dari kebocoran URL browser publik."*

---

### EKSPERIMEN 2: Uji Penetrasi Keamanan Rute (Bypass Attack Test)

- **Tujuan:** Membuktikan bahwa rute `/dashboard` dilindungi secara absolut di layer Edge oleh Middleware.
- **Langkah Eksperimen:**
  1. Buka jendela peramban baru dalam mode **Incognito / Private Window** (di mana pengguna dipastikan belum login).
  2. Ketik langsung URL rahasia di address bar: `http://localhost:3000/dashboard` dan tekan Enter.
- **Hasil yang Ditunjukkan ke Mahasiswa:**
  - Browser seketika dialihkan (HTTP 307) kembali ke halaman `/login?next=%2Fdashboard`.
  - Halaman dashboard sama sekali tidak sempat berkedip tampil di layar (*Zero Flash of Unauthenticated Content*).
- **Kesimpulan:** *"Next.js 16 Edge Middleware berhasil mengawal rute sebelum kode Server Component sempat dieksekusi!"*

---

### EKSPERIMEN 3: Uji Audit Keamanan: `getSession()` vs `getUser()`

- **Tujuan:** Menunjukkan mengapa `getSession()` dilarang keras di industri.
- **Langkah Eksperimen:**
  1. Mahasiswa login ke aplikasi.
  2. Buka Supabase Dashboard ➔ **Authentication ➔ Users**.
  3. Cari akun mahasiswa tersebut, klik titik tiga ➔ pilih **Ban User** (Nonaktifkan Pengguna).
  4. Jika aplikasi menggunakan `getSession()` di middleware: pengguna masih bisa bebas membuka `/dashboard` karena kuki lokal di laptop masih ada.
  5. Namun karena kita menggunakan `getUser()`: seketika pengguna merefresh `/dashboard`, panggilan jaringan `getUser()` ke Supabase mendeteksi bahwa akun telah diblokir, dan pengguna langsung ditendang keluar ke `/login`!
- **Kesimpulan:** *"Inilah alasan mengapa getUser() wajib digunakan: integritas keamanan akun ditegakkan secara real-time!"*

---

### EKSPERIMEN 4: Uji Kekebalan XSS Kuki HTTP-Only

- **Tujuan:** Membuktikan bahwa kuki sesi aman dari pencurian script jahat JavaScript.
- **Langkah Eksperimen:**
  1. Dalam keadaan login, buka tab **Console DevTools (F12)** di browser.
  2. Ketik perintah JavaScript:
     ```javascript
     console.log("Kuki yang bisa dibaca JS:", document.cookie);
     ```
- **Hasil yang Ditunjukkan ke Mahasiswa:**
  - Kuki token Supabase (`sb-access-token` / `sb-refresh-token`) **TIDAK MUNCUL SAMA SEKALI** di output console.
  - Tunjukkan bahwa kuki tersebut memiliki bendera **HttpOnly** di tab Application DevTools.
- **Kesimpulan:** *"Sekalipun website kita disusupi malware atau script injeksi XSS, hacker TIDAK BISA mencuri token sesi kita karena browser melarang JavaScript membaca kuki HttpOnly!"*

---

## 7. Socratic Q&A (Pertanyaan Uji Kritis untuk Mahasiswa di Kelas)

Lemparkan 4 pertanyaan ini ke mahasiswa untuk memicu diskusi kritis:

1. **Pertanyaan:** *"Jika sebuah startup membangun SaaS untuk developer seperti platform deployment atau CLI tools, mengapa model GitHub OAuth jauh lebih disukai daripada form pendaftaran email konvensional?"*  
   **Jawaban Benar:** Karena audiens pengembang menginginkan proses onboarding 1-klik instan (zero friction), startup terbebas dari liabilitas hukum menyimpan kata sandi (zero password liability), dan sistem otomatis mendapatkan identitas username serta avatar GitHub yang terverifikasi.

2. **Pertanyaan:** *"Apa bahaya terbesar jika token otentikasi disimpan di 'localStorage' peramban alih-alih di HTTP-only Cookies?"*  
   **Jawaban Benar:** Data di `localStorage` dapat dibaca secara bebas oleh kode JavaScript apapun di halaman web. Jika website memuat library pihak ketiga yang disusupi script jahat (serangan Cross-Site Scripting / XSS), token pengguna dapat dicuri dan dikirim ke server peretas. Kuki HttpOnly memblokir pembacaan JavaScript secara absolut.

3. **Pertanyaan:** *"Mengapa pada fungsi updateSession di Middleware, kita wajib menyalin token sesi ke request.cookies DAN response.cookies secara bersamaan?"*  
   **Jawaban Benar:** Menyalin ke `request.cookies` memastikan Server Component (RSC) yang dirender tepat setelah middleware selesai dapat membaca token baru secara langsung. Menyalin ke `response.cookies` memastikan browser pengguna menyimpan token baru tersebut melalui header HTTP `Set-Cookie`.

4. **Pertanyaan:** *"Mengapa pembuatan profil pengguna di public.profiles wajib ditangani oleh Database Trigger PostgreSQL dan bukan ditulis di kode Server Action web?"*  
   **Jawaban Benar:** Karena pendaftaran akun bisa terjadi melalui banyak pintu (GitHub OAuth, Magic Link, atau dashboard Supabase). Jika ditulis di aplikasi, kegagalan koneksi saat redirect OAuth dapat membuat user terdaftar di auth.users tetapi tidak memiliki profil di public.profiles. Database Trigger menjamin pembuatan profil selalu terjadi secara atomik 100% di level kernel database.

---

*Dokumen Panduan Pengajaran ini disusun secara resmi untuk mendampingi modul perkuliahan The Serverless Odyssey — Pertemuan 5.*
