# BUKU PANDUAN PENGAJAR (TEACHING GUIDE)
## KULIAH "THE SERVERLESS ODYSSEY" — MODUL 6
**Topik:** Arsitektur Komputasi Ganda: Server Actions (Web BFF) vs REST API Route Handlers (Mobile Backend), Pragmatic RBAC (Admin vs Member), Keamanan Bearer Token JWT, CORS & URL as State  
**Target Pembaca:** Dosen Pengampu / Instruktur Laboratorium  
**Alokasi Waktu:** 150 Menit (Tatap Muka Lab) + 180 Menit (Tugas Mandiri)  
**CPMK:** Mahasiswa mampu merancang arsitektur data ganda (Server Actions untuk Web dan REST API Route Handlers untuk Mobile/Universal Clients), menerapkan otorisasi berbasis peran (Pragmatic RBAC: Admin vs Member) dengan pertahanan dua lapis (Application Logic & PostgreSQL RLS), mengamankan endpoint publik dengan Bearer Token JWT Supabase, CORS headers, mitigasi abuse, validasi skema Zod, serta mengelola URL search params untuk filter dan pagination.

---

## 1. Rencana Alokasi Waktu Kuliah (150 Menit Tatap Muka)

| Durasi | Sesi | Agenda Pengajaran & Aktivitas Kelas |
| :---: | :--- | :--- |
| **00 - 15'** | **Apersepsi & Dilema Klien Mobile** | Membuka sesi dengan pertanyaan pemantik: *"Mengapa aplikasi mobile Flutter atau klien pihak ketiga tidak bisa langsung memanggil Server Actions Next.js?"* Menjelaskan batas antara format serialisasi internal web (Flight RPC) vs protokol universal HTTP RESTful. |
| **15 - 45'** | **Pendalaman Konsep 4 Pilar & RBAC** | Membedah 4 Pilar: Arsitektur Komputasi Ganda (BFF vs Universal REST), Prinsip DRY dengan Shared Zod Schema, Keamanan Stateless Bearer Token JWT, CORS Preflight (OPTIONS), Otorisasi Pragmatic RBAC (Admin vs Member pada CRUD & PostgreSQL RLS), serta URL as State & Supabase Pagination Range Query. |
| **45 - 65'** | **Simulasi Interaktif Visual** | Membuka tab "Konsep & Teori" pada platform dan menjalankan 11 simulator interaktif (Dual-Arch, Shared-Zod, REST Contract RFC 7807, Bearer Flow, CORS Preflight, RLS vs Service Role Key, **Multi-Role RBAC Admin vs Member**, Route Handlers, URL State Sync, dan Pagination Range). |
| **65 - 95'** | **Eksekusi AI Prompt All-in-One** | Memandu mahasiswa menyalin **Formula Prompt AI Teruji** ke AI Agent (Antigravity/Cursor), mengamati proses scaffolding skema RBAC dan 6 berkas modular API siap produksi. |
| **95 - 125'** | **Live API Testing via cURL / Thunder Client** | Dosen memandu live demo pengujian endpoint: CORS OPTIONS preflight, tes penolakan 401 Unauthorized tanpa token, tes validasi 422 Unprocessable Content, pengujian otorisasi peran (403 Forbidden saat Member menghapus tugas orang lain vs 200 OK oleh Admin), dan kueri range pagination. |
| **125 - 140'** | **Misi Snowballing Git** | Memandu mahasiswa membuat branch `feature/crud-rest-api-security`, mengecek 6 kriteria *Definition of Done* (DoD) termasuk kontrol akses multi-role, dan melakukan commit git. |
| **140 - 150'** | **Evaluasi Tab 4 (Uji Pemahaman)** | Mengawasi mahasiswa mengerjakan 7 soal esai interaktif anti-cheat (Mastery Learning threshold $\ge 80$). |

---

## 2. Penjelasan Lengkap Tiap Sub-Materi (Untuk Narasi Mengajar)

### Pilar 1: Arsitektur Komputasi Ganda (Server Actions vs REST API Route Handlers)

1. **Mengapa Aplikasi Modern Membutuhkan Dua Jalur Backend?**
   - **Narasi Dosen:** *"Bayangkan Anda membangun aplikasi manajemen tugas (The Serverless Odyssey). Di web browser desktop, kita ingin rendering secepat kilat tanpa menulis API manual, sehingga kita menggunakan React Server Components dan Server Actions (Backend-for-Frontend / BFF pattern). Tetapi 3 bulan kemudian, tim bisnis meminta aplikasi Android dan iOS dibangun menggunakan Flutter. Flutter tidak berjalan di dalam peramban, tidak memiliki kuki browser Next.js, dan tidak memahami format Flight RPC React. Karena itu, Next.js menyediakan Route Handlers (`src/app/api/.../route.ts`) yang merespons payload baku JSON standar (application/json) dengan status codes HTTP resmi (200, 201, 400, 401, 403, 404, 422). Arsitektur ini disebut Dual Architecture."*
   - **Poin Kunci:** Server Actions untuk web internal (0 kB bundle); Route Handlers untuk interoperabilitas universal lintas-klien (Mobile, cURL, third-party integrations).

2. **Prinsip DRY: Validasi Skema Zod Terpusat:**
   - **Narasi Dosen:** *"Jangan menduplikasi aturan validasi! Jangan buat validasi di Server Actions lalu menulis ulang validasi berbeda di REST API. Jika batas panjang judul tugas diubah dari 3 ke 5 karakter, developer rawan lupa mengubah salah satunya. Buat satu berkas kontrak data: `src/lib/schemas.ts`. Skema ini diimpor oleh Server Action untuk form web DAN diimpor oleh Route Handler untuk payload JSON mobile."*

3. **Format Respons Standar RFC 7807:**
   - **Narasi Dosen:** *"Dilarang keras mengembalikan `{ status: 200, error: 'Password salah' }`! Itu adalah anti-pattern terburuk yang merusak parser aplikasi mobile. Gunakan HTTP Status Codes semantik: 200 untuk pembacaan sukses, 201 untuk data baru yang tercipta, 401 jika tanpa token, 403 jika terbentur otorisasi peran, 404 jika ID tidak ditemukan, dan 422 Unprocessable Content jika validasi Zod gagal."*

---

### Pilar 2: Standar Keamanan Optimal Serverless REST API (Bearer JWT, CORS, RLS & Pragmatic RBAC)

1. **Otentikasi Stateless via Bearer Token JWT:**
   - **Narasi Dosen:** *"Klien mobile menyimpan token akses yang didapat saat login. Setiap memanggil endpoint `/api/v1/tasks`, mobile wajib menyertakan header `Authorization: Bearer <token_jwt>`. Route Handler membaca token ini dan memverifikasinya melalui `supabase.auth.getUser(token)`. Mengapa ini disebut Stateless? Karena serverless function tidak menyimpan session ID di memori RAM. Begitu eksekusi selesai, function mati (scale-to-zero). Request berikutnya dapat ditangani oleh serverless node yang berbeda di belahan dunia lain tanpa kehilangan status autentikasi."*

2. **Mekanisme CORS Preflight (HTTP OPTIONS):**
   - **Narasi Dosen:** *"Saat frontend web di domain lain memanggil API kita, browser secara otomatis mengirimkan sinyal pendahuluan bertipe HTTP OPTIONS sebelum mengirim request berbahaya (POST/DELETE). Route Handler kita wajib merespons OPTIONS dengan status 204 No Content dan menyertakan header `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods`, dan `Access-Control-Allow-Headers: Content-Type, Authorization` agar browser tidak memblokir koneksi."*

3. **Golden Rule Keamanan Cloud: RLS Enforcement vs Bahaya Service Role Key:**
   - **Narasi Dosen:** *"Perhatikan peringatan keras ini: JANGAN PERNAH menggunakan SUPABASE_SERVICE_ROLE_KEY di Route Handler publik! Service Role Key memiliki hak akses superadmin yang menonaktifkan seluruh Row Level Security (RLS) PostgreSQL. Jika Anda memakainya, seorang peretas bisa membaca atau menghapus seluruh tugas milik pengguna lain hanya dengan menebak UUID! Selalu gunakan instance client yang membawa token pengguna sehingga PostgreSQL otomatis menerapkan filter `auth.uid() = user_id`."*

4. **Pragmatic RBAC: Otorisasi Multi-Role (Admin vs Member) & Pertahanan 2-Lapis:**
   - **Narasi Dosen:** *"Di dunia nyata, aplikasi manajemen tim memiliki hirarki peran: `admin` (Project Manager/Scrum Master) dan `member` (Anggota Tim). Jangan over-engineering dengan membuat tabel izin kompleks! Cukup tambahkan kolom `role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member'))` pada `public.profiles`. Otorisasi kita tegakkan dengan pertahanan 2-lapis (Defense-in-Depth):*
     - *Lapis 1 (Application Logic): Pada Server Action atau Route Handler DELETE, kita periksa apakah `user.role === 'admin' || task.user_id === user.id`. Jika bukan admin dan bukan pemilik, tolak seketika dengan 403 Forbidden!*
     - *Lapis 2 (Database Kernel RLS): Kebijakan PostgreSQL mengevaluasi: `USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))`.*
     - *Pencegahan Privilege Escalation: Kolom `role` dilarang keras diekspos pada form edit profil publik di browser agar pengguna biasa tidak bisa mempromosikan dirinya sendiri menjadi admin."*

---

### Pilar 3: Endpoint REST API CRUD Lengkap & Penanganan Async Params Next.js 16

1. **Endpoint Koleksi vs Item Spesifik:**
   - **Koleksi (`src/app/api/v1/tasks/route.ts`):** Menangani `GET` (daftar tugas dengan filter dan pagination) dan `POST` (pembuatan tugas baru dengan Zod safeParse).
   - **Item Spesifik (`src/app/api/v1/tasks/[id]/route.ts`):** Menangani `GET` (detail), `PUT` (update), dan `DELETE` (penghapusan data dengan verifikasi kepemilikan atau role admin).

2. **Breaking Change Next.js 16: Asynchronous Params:**
   - **Narasi Dosen:** *"Di Next.js 16, parameter rute dinamis `params` adalah Promise. Anda wajib menuliskan `const { id } = await params;` sebelum membaca ID tugas. Lupa menulis `await` akan menyebabkan error 'params should be awaited before using its properties' saat runtime."*

---

### Pilar 4: URL as State & Server-Side Filtering & Pagination

1. **Filosofi URL as Single Source of Truth:**
   - **Narasi Dosen:** *"Jika Anda menyimpan kata kunci pencarian tugas hanya di `useState` lokal, saat tautan dibagikan ke teman, teman Anda akan melihat daftar tanpa filter. Dengan URL as State, kata kunci disimpan di query string peramban: `?search=laporan&page=2`. URL menjadi shareable, bookmarkable, dan mendukung navigasi Back/Forward secara native."*

2. **Debounce 300ms untuk Mencegah Flooding Query:**
   - **Narasi Dosen:** *"Jika pengguna mengetik kata 'LAPORAN' (7 huruf), tanpa debounce browser akan memicu 7x navigasi URL dan 7x kueri database ke server. Dengan `useDebouncedCallback(..., 300)`, sistem menunggu 300ms setelah ketikan terakhir selesai baru menyinkronkan URL."*

3. **Rumus Matematika Supabase Range Query:**
   - `from = (page - 1) * limit`
   - `to = from + limit - 1`
   - Kueri Supabase: `.range(from, to)` membaca tepat sejumlah data yang dibutuhkan halaman tersebut tanpa membebani memori jaringan.

---

## 3. Arsitektur 6 Berkas Modular Hasil Scaffolding AI

```
src/
├── lib/
│   ├── api-response.ts            # Helper respons terstandarisasi RFC 7807 (apiSuccess, apiError, corsHeaders)
│   ├── api-auth.ts                # Helper verifikasi Bearer Token JWT, fetch user role & inisialisasi Supabase RLS Client
│   └── schemas.ts                 # Kontrak Zod tunggal (taskSchema) yang dipakai bersama Web & REST API
├── app/
│   ├── page.tsx                   # Root Landing Page dengan Hero CTA Navigasi & Showcase REST API
│   ├── api/
│   │   └── v1/
│   │       └── tasks/
│   │           ├── route.ts       # Endpoint Koleksi: OPTIONS (CORS), GET (Filter/Pagination), POST (Zod)
│   │           └── [id]/
│   │               └── route.ts   # Endpoint Item: OPTIONS, GET by ID, DELETE (Role Check Admin vs Member & await params)
└── components/
    └── tasks/
        └── task-search-input.tsx  # Input pencarian Client Component dengan debounce 300ms & URL search params

supabase/
└── migrations/
    └── 03_pragmatic_rbac.sql      # DDL penambahan kolom role di public.profiles & update policy RLS tasks
```

---

## 4. Panduan Live Testing di Kelas (cURL Test Suite)

Dosen membuka terminal atau Thunder Client di hadapan mahasiswa dan mendemonstrasikan 5 pengujian kunci:

### Test 1: Verifikasi Preflight CORS (OPTIONS Handshake)
```bash
curl -X OPTIONS http://localhost:3000/api/v1/tasks -i
```
* **Hasil Diharapkan:** HTTP Status `204 No Content` dengan header `Access-Control-Allow-Origin: *` dan `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`.

### Test 2: Verifikasi Penolakan Request Tanpa Token (401 Unauthorized)
```bash
curl -X GET http://localhost:3000/api/v1/tasks -i
```
* **Hasil Diharapkan:** HTTP Status `401 Unauthorized` dengan payload JSON terstruktur:
  ```json
  {
    "status": "error",
    "code": "UNAUTHORIZED",
    "message": "Kredensial Bearer Token tidak ditemukan di header"
  }
  ```

### Test 3: Verifikasi Validasi Input Zod (422 Unprocessable Content)
```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Authorization: Bearer <VALID_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title": ""}' -i
```
* **Hasil Diharapkan:** HTTP Status `422 Unprocessable Content` dengan pesan error validasi Zod spesifik pada field `title`.

### Test 4: Verifikasi Pagination & Server-Side Search
```bash
curl -X GET "http://localhost:3000/api/v1/tasks?search=laporan&page=1&limit=5" \
  -H "Authorization: Bearer <VALID_JWT_TOKEN>" -i
```
* **Hasil Diharapkan:** HTTP Status `200 OK` dengan metadata pagination (`page: 1`, `limit: 5`, `total: X`).

### Test 5: Verifikasi Otorisasi Berbasis Peran / Pragmatic RBAC (403 Forbidden vs 200 OK)
```bash
# Skenario A: Member biasa mencoba menghapus tugas milik rekan tim lain
curl -X DELETE "http://localhost:3000/api/v1/tasks/<OTHER_USER_TASK_UUID>" \
  -H "Authorization: Bearer <MEMBER_JWT_TOKEN>" -i
```
* **Hasil Diharapkan:** HTTP Status `403 Forbidden` dengan pesan error otorisasi:
  ```json
  {
    "status": "error",
    "code": "FORBIDDEN",
    "message": "Anda tidak memiliki wewenang untuk menghapus tugas milik pengguna lain"
  }
  ```

```bash
# Skenario B: Admin tim mengeksekusi penghapusan tugas siapapun (Super-Access)
curl -X DELETE "http://localhost:3000/api/v1/tasks/<ANY_TASK_UUID>" \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" -i
```
* **Hasil Diharapkan:** HTTP Status `200 OK` mengonfirmasi tugas berhasil dihapus berkat wewenang admin.

---

## 5. Misi Snowballing Git & Kriteria Definition of Done (DoD)

Instruksikan mahasiswa mengeksekusi 4 langkah Git pada branch tugas minggu ini:
1. `git checkout -b feature/crud-rest-api-security`
2. Penuhi 6 kriteria DoD pada platform:
   - [x] Endpoint REST API `GET /api/v1/tasks` mendukung filter pencarian dan pagination dengan JSON standar RFC 7807.
   - [x] Endpoint `POST /api/v1/tasks` memvalidasi input via Zod dan mengembalikan `201 Created` atau `422 Unprocessable Content`.
   - [x] Endpoint terproteksi `DELETE /api/v1/tasks/[id]` mewajibkan header `Authorization: Bearer <token>` dan menolak request ilegal tanpa token dengan `401 Unauthorized`.
   - [x] Otorisasi peran multi-role (*Pragmatic RBAC*) terpasang: Akun bertipe `admin` dapat mengelola seluruh tugas tim, sedangkan akun `member` hanya dapat mengelola tugas miliknya sendiri dengan perlindungan 2-layer (Server Action/Route Handler & PostgreSQL RLS).
   - [x] Header CORS (`Access-Control-Allow-*`) dan preflight `OPTIONS` terpasang pada route handler untuk mendukung akses klien mobile.
   - [x] Halaman dashboard web mengintegrasikan pencarian instan tersinkronisasi URL (`?search=...`) dengan debounce 300ms.
3. `git add . && git commit -m "feat: complete REST API endpoints, pragmatic rbac, bearer auth, and debounced search"`
4. `git checkout main && git merge feature/crud-rest-api-security`
