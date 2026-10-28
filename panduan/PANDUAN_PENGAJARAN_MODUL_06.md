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

## 3. Peta Arsitektur Berkas: Pemisahan Berkas Terbentuk dari Prompt 1 & Prompt 2

Pada tab **Lab Praktek & Prompt AI**, mahasiswa diberikan opsi jalur eksekusi bertahap (**Dual-Track Stepped Prompts**). Berikut adalah pemetaan detail berkas-berkas yang terbentuk pada masing-masing tahap:

### 3.1. Tabel Matriks Berkas per Tahapan Prompt

| No | Nama Berkas & Lokasi | Asal Prompt | Lingkungan / Direktif | Peran & Tanggung Jawab Komputasi |
| :-: | :--- | :---: | :---: | :--- |
| **1** | `src/lib/schemas.ts` | **Prompt 1** *(di-reuse di Prompt 2)* | Agnostik *(Universal)* | Kontrak skema validasi data Zod tunggal (`taskSchema` & `taskUpdateSchema`) — Prinsip DRY. |
| **2** | `src/actions/tasks.ts` | **Prompt 1** | `'use server'` | Server Actions mutasi form web internal (`createTaskAction`, `deleteTaskAction`, `toggleTaskStatusAction`) & resolusi `project_id`. |
| **3** | `src/components/tasks/task-search-input.tsx` | **Prompt 1** | `'use client'` | Komponen input pencarian Client Component dengan debounce 300ms tersinkronisasi URL search params (`?search=...`). |
| **4** | `src/components/tasks/task-form.tsx` | **Prompt 1** | `'use client'` | Komponen form penambahan tugas interaktif berbasis React 19 (`useActionState` & `useFormStatus`). |
| **5** | `src/app/(dashboard)/tasks/page.tsx` | **Prompt 1** | Server Component (RSC) | Halaman dashboard tugas internal: membaca `await searchParams`, badge peran (👑 Admin / 👤 Member), kueri range pagination Supabase. |
| **6** | `supabase/migrations/03_pragmatic_rbac.sql` | **Prasyarat Prompt 1** | SQL DDL & RLS | Migrasi kolom `role` di tabel `public.profiles` dan update kebijakan RLS `tasks` untuk otorisasi Admin vs Member. |
| **7** | `src/lib/api-response.ts` | **Prompt 2** | Agnostik *(Universal)* | Helper pembuat respons JSON standar RFC 7807 (`apiSuccess`, `apiError`) dan penyedia header CORS (`corsHeaders`). |
| **8** | `src/lib/api-auth.ts` | **Prompt 2** | Agnostik Server | Helper validasi `Authorization: Bearer <token>`, pemanggilan `supabase.auth.getUser()`, dan inisialisasi client RLS pengguna. |
| **9** | `src/app/api/v1/tasks/route.ts` | **Prompt 2** | Route Handler (Edge/Node) | Endpoint REST API Koleksi: handler `OPTIONS` (CORS Preflight), `GET` (Filter & Pagination), dan `POST` (Zod SafeParse & Insert). |
| **10** | `src/app/api/v1/tasks/[id]/route.ts` | **Prompt 2** | Route Handler (Edge/Node) | Endpoint REST API Item Dinamis: `OPTIONS`, `GET` by ID, `PUT` (Update), dan `DELETE` (Otorisasi Admin vs Member & `await params`). |
| **11** | `src/app/(dashboard)/tasks/api-tester/page.tsx` | **Prompt 2** | `'use client'` | Mobile API Tester Sandbox: Simulator playground interaktif mirip Postman untuk menguji endpoint REST API langsung di peramban. |
| **12** | `src/app/page.tsx` | **Prompt 2** *(Update)* | Server Component (RSC) | Root Landing Page (Root Navigation Rule): Hero CTA ganda menuju Dashboard Web (`/tasks`) dan Mobile API Tester (`/tasks/api-tester`). |

---

### 3.2. Rincian Berkas yang Dihasilkan Prompt Tahap 1 (Monolith Web & Pragmatic RBAC)
Prompt Tahap 1 berfokus pada **Paradigma Full-Stack Monolith Web** untuk pengguna internal peramban:
1. `supabase/migrations/03_pragmatic_rbac.sql`: Menambahkan kolom peran `role TEXT NOT NULL DEFAULT 'member'` dan memperbarui RLS policy PostgreSQL.
2. `src/lib/schemas.ts`: Membangun kontrak Zod (`taskSchema`) dengan validasi panjang judul, prioritas (`low`, `medium`, `high`), status, dan optional `project_id`.
3. `src/actions/tasks.ts`: Fungsi-fungsi Server Actions dengan kuki sesi aktif, pencegahan konstrain `NOT NULL` melalui `resolveTargetProjectId`, serta pengecekan role Admin vs Member saat penghapusan tugas.
4. `src/components/tasks/task-search-input.tsx`: Input pencarian debounced 300ms yang memperbarui URL bar (`?search=...&page=1`) secara instan tanpa me-reload peramban.
5. `src/components/tasks/task-form.tsx`: Formulir pembuatan tugas dengan integrasi hook mutasi React 19 (`useActionState`, `useFormStatus`) dan indikator error per-field.
6. `src/app/(dashboard)/tasks/page.tsx`: Halaman Server Component utama yang membaca `await searchParams`, menampilkan badge status peran pengguna, tabel tugas dengan pagination range query, dan tombol navigasi ke API Tester.

---

### 3.3. Rincian Berkas yang Dihasilkan Prompt Tahap 2 (Universal REST API & Mobile Tester)
Prompt Tahap 2 menambahkan **Lapisan Endpoint HTTP Terbuka (Decoupled API Gateway)** untuk klien mobile dan pihak ketiga:
1. `src/lib/api-response.ts`: Standarisasi respons format JSON IETF RFC 7807 (`type`, `title`, `status`, `detail`, `errors`) dan header universal CORS.
2. `src/lib/api-auth.ts`: Helper gerbang keamanan yang membedah header Bearer Token JWT, memvalidasi sesi ke Supabase Auth, dan menyiapkan client ber-RLS.
3. `src/app/api/v1/tasks/route.ts`: Endpoint koleksi yang menangani handshake CORS OPTIONS, pembacaan daftar tugas berindeks dengan pagination, dan penerimaan data baru via POST.
4. `src/app/api/v1/tasks/[id]/route.ts`: Endpoint item spesifik dengan pemenuhan standar Next.js 16 (`const { id } = await params;`) untuk operasi GET detail, PUT update parsial, dan DELETE dengan otorisasi multi-role.
5. `src/app/(dashboard)/tasks/api-tester/page.tsx`: Sandbox simulator pengujian API berbasis web dengan pemilih metode HTTP (GET, POST, PUT, DELETE), tombol 1-klik "Gunakan Token Sesi Saya", input body JSON, dan panel inspektur respons live.
6. `src/app/page.tsx`: Pemenuhan *Root Navigation Rule* dengan menambahkan Hero Section dan tombol CTA langsung ke `/tasks` dan `/tasks/api-tester`.

---

### 3.4. Peta Pohon Berkas Terpadu Proyek (Annotated File Tree)

```
📁 serverless-project/
├── 📁 supabase/
│   └── 📁 migrations/
│       └── 📄 03_pragmatic_rbac.sql              <-- [PRASYARAT PROMPT 1] DDL Kolom Role & RLS Policy
├── 📁 src/
│   ├── 📁 lib/
│   │   ├── 📄 schemas.ts                         <-- [PROMPT 1] Kontrak Validasi Zod (Dipakai Bersama di Prompt 2)
│   │   ├── 📄 api-response.ts                    <-- [PROMPT 2] Helper Respons JSON RFC 7807 & CORS Headers
│   │   └── 📄 api-auth.ts                        <-- [PROMPT 2] Verifikasi Bearer Token JWT & Client Supabase RLS
│   ├── 📁 actions/
│   │   └── 📄 tasks.ts                           <-- [PROMPT 1] Server Actions Web ('use server') + Cek Role Admin
│   ├── 📁 components/
│   │   └── 📁 tasks/
│   │       ├── 📄 task-search-input.tsx          <-- [PROMPT 1] Input Pencarian Debounce 300ms ('use client')
│   │       └── 📄 task-form.tsx                  <-- [PROMPT 1] Form Tambah Tugas useActionState ('use client')
│   └── 📁 app/
│       ├── 📁 (dashboard)/
│       │   └── 📁 tasks/
│       │       ├── 📄 page.tsx                   <-- [PROMPT 1] Dashboard Web Monolith (Server Component RSC)
│       │       └── 📁 api-tester/
│       │           └── 📄 page.tsx               <-- [PROMPT 2] Mobile API Tester Playground Sandbox ('use client')
│       ├── 📁 api/
│       │   └── 📁 v1/
│       │       └── 📁 tasks/
│       │           ├── 📄 route.ts               <-- [PROMPT 2] Endpoint Koleksi: OPTIONS, GET, POST
│       │           └── 📁 [id]/
│       │               └── 📄 route.ts           <-- [PROMPT 2] Endpoint Item: OPTIONS, GET, PUT, DELETE (await params)
│       └── 📄 page.tsx                           <-- [PROMPT 2] Root Landing Page (Hero CTA Navigasi ke Web & API Tester)
```

---

### 3.5. Di Berkas Mana Saja Role 'admin' & 'member' Diterapkan? (Code & File Traceability)

Untuk memudahkan dosen menelusuri implementasi kode (*code review & debugging*) di hadapan mahasiswa, berikut adalah peta berkas lengkap yang memuat kata kunci dan logika peran `admin` vs `member`:

| No | Berkas Target | Lapisan Arsitektur | Peran Kata Kunci `admin` & `member` |
| :-: | :--- | :---: | :--- |
| **1** | `supabase/migrations/03_pragmatic_rbac.sql` | **Database Kernel** *(PostgreSQL)* | Definisi constraint kolom `CHECK (role IN ('admin', 'member'))` dan evaluasi RLS policy delete via subquery profil. |
| **2** | `src/actions/tasks.ts` | **Server Actions** *(Web Monolith)* | Pengecekan `profile.role === 'admin'` pada fungsi `deleteTaskAction` untuk membedakan penghapusan global vs kepemilikan baris. |
| **3** | `src/app/(dashboard)/tasks/page.tsx` | **React Server Component** *(UI)* | Pembacaan nilai `role` dari database untuk merender Badge Status (`👑 Admin` vs `👤 Member`) dan kontrol tombol aksi. |
| **4** | `src/lib/api-auth.ts` | **Security Helper** *(REST API)* | Pengambilan nilai `role` dari tabel `profiles` setelah Bearer JWT lolos validasi, disematkan ke payload objek `user.role`. |
| **5** | `src/app/api/v1/tasks/[id]/route.ts` | **Route Handler** *(REST Endpoint)* | Penjaga otorisasi method `DELETE`: menolak request dengan status `403 Forbidden` jika `user.role !== 'admin'` dan `task.user_id !== user.id`. |
| **6** | `src/components/visualizers/multi-role-rbac-animator.tsx` | **Interactive Visualizer** *(Edukasi)* | State switcher interaktif `role: 'admin' \| 'member'` untuk mensimulasikan mekanisme pertahanan 2-lapis di layar kelas. |

#### Cuplikan Kode Implementasi di Tiap Berkas:

1. **Pada `supabase/migrations/03_pragmatic_rbac.sql` (Database & RLS):**
   ```sql
   -- 1. Tambah kolom role dengan default 'member'
   ALTER TABLE public.profiles 
   ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'member' 
   CHECK (role IN ('admin', 'member'));

   -- 2. Kebijakan RLS: Pemilik baris ATAU role 'admin'
   CREATE POLICY "Users can delete own tasks or admin can delete any"
   ON public.tasks FOR DELETE TO authenticated
   USING (
     auth.uid() = user_id 
     OR EXISTS (
       SELECT 1 FROM public.profiles 
       WHERE id = auth.uid() AND role = 'admin'
     )
   );
   ```

2. **Pada `src/actions/tasks.ts` (Server Action `deleteTaskAction`):**
   ```typescript
   export async function deleteTaskAction(id: string) {
     const cookieStore = await cookies();
     const supabase = createClient(cookieStore);
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) throw new Error("Unauthorized");

     // Cek role pengguna dari profil
     const { data: profile } = await supabase
       .from('profiles')
       .select('role')
       .eq('id', user.id)
       .single();

     const isAdmin = profile?.role === 'admin';

     // Admin dapat menghapus tugas siapapun, Member hanya tugas miliknya
     if (isAdmin) {
       await supabase.from('tasks').delete().eq('id', id);
     } else {
       await supabase.from('tasks').delete().eq('id', id).eq('user_id', user.id);
     }

     revalidatePath('/tasks');
   }
   ```

3. **Pada `src/app/(dashboard)/tasks/page.tsx` (Server Component UI):**
   ```tsx
   // Ambil profil user saat RSC merender di server
   const { data: profile } = await supabase
     .from('profiles')
     .select('role')
     .eq('id', user.id)
     .single();

   const userRole = profile?.role || 'member';

   // Render badge identitas peran di antarmuka
   {userRole === 'admin' ? (
     <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-semibold">
       👑 Admin (Wewenang Penuh)
     </span>
   ) : (
     <span className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 px-3 py-1 rounded-full text-xs font-medium">
       👤 Member (Akses Mandiri)
     </span>
   )}
   ```

4. **Pada `src/lib/api-auth.ts` (API Auth Helper):**
   ```typescript
   export async function verifyApiAuth(request: Request) {
     const authHeader = request.headers.get('Authorization');
     if (!authHeader?.startsWith('Bearer ')) {
       return { user: null, supabase: null, error: 'Token Bearer tidak valid' };
     }
     const token = authHeader.split(' ')[1];
     const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
       global: { headers: { Authorization: `Bearer ${token}` } },
     });
     const { data: { user } } = await supabase.auth.getUser(token);
     if (!user) return { user: null, supabase: null, error: 'Sesi kedaluwarsa' };

     // Fetch role dari tabel profiles
     const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
     return { 
       user: { ...user, role: (profile?.role || 'member') as 'admin' | 'member' }, 
       supabase, 
       error: null 
     };
   }
   ```

5. **Pada `src/app/api/v1/tasks/[id]/route.ts` (Dynamic REST API Handler):**
   ```typescript
   export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
     const { id } = await params;
     const { user, supabase, error } = await verifyApiAuth(request);
     if (error || !user) return apiError("Kredensial tidak valid", "UNAUTHORIZED", 401);

     // Ambil tugas untuk memeriksa pemilik
     const { data: task } = await supabase.from('tasks').select('user_id').eq('id', id).single();
     if (!task) return apiError("Tugas tidak ditemukan", "NOT_FOUND", 404);

     // Penegakan Otorisasi RBAC:
     if (user.role !== 'admin' && task.user_id !== user.id) {
       return apiError("Anda tidak memiliki wewenang untuk menghapus tugas ini", "FORBIDDEN", 403);
     }

     await supabase.from('tasks').delete().eq('id', id);
     return apiSuccess({ message: "Tugas berhasil dihapus" }, undefined, 200);
   }
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
