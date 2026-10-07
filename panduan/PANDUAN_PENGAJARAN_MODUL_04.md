# BUKU PANDUAN PENGAJAR (TEACHING GUIDE)
## KULIAH "THE SERVERLESS ODYSSEY" — MODUL 4
**Topik:** Database Relasional PostgreSQL, Integritas Skema, Indexing, dan Integrasi Supabase SSR Next.js 16  
**Target Pembaca:** Dosen Pengampu / Instruktur Laboratorium  
**Alokasi Waktu:** 150 Menit (Tatap Muka Lab) + 180 Menit (Tugas Mandiri)  
**CPMK:** Mahasiswa mampu merancang skema relasi PostgreSQL (1:N, M:N), mengonfigurasi klien Supabase SSR Next.js 16 dengan *async cookies*, serta mengotomasi tipe TypeScript via Supabase Typegen.

---

## 1. Rencana Alokasi Waktu Kuliah (150 Menit Tatap Muka)

| Durasi | Sesi | Agenda Pengajaran & Aktivitas Kelas |
| :---: | :--- | :--- |
| **00 - 15'** | **Apersepsi & Kick-off Proyek** | Mengumumkan Kick-off Proyek Akhir resmi. Menjelaskan evolusi dari data mock memori (Modul 3) menuju database relasional cloud permanen (Supabase PostgreSQL). |
| **15 - 45'** | **Pendalaman Konsep Teori** | Membedah 4 Pilar: UUID v4 vs Serial, Relasi 1:N & M:N (Junction Table), Integrity Constraints & B-Tree Indexing, serta integrasi `@supabase/ssr` dengan *async cookies* Next.js 16. |
| **45 - 65'** | **Simulasi Interaktif Visual** | Membuka tab "Konsep & Teori" pada platform dan menjalankan 11 simulator interaktif bersama mahasiswa (termasuk demonstrasi pelanggaran FK dan Composite PK). |
| **65 - 95'** | **Eksekusi AI Prompt All-in-One** | Memandu mahasiswa menyalin **Formula Prompt AI Teruji** ke AI Agent (Antigravity/Cursor) atau AI Chat, mengamati proses scaffolding 5 berkas modular. |
| **95 - 125'** | **Live Database & App Walkthrough** | Dosen membedah Supabase SQL Editor, mengeksekusi DDL & seed data, memeriksa tabel fisik, serta memverifikasi data hidup yang tampil di halaman root `/`. |
| **125 - 140'** | **Misi Snowballing Git** | Memandu mahasiswa membuat branch `feature/supabase-database-schema`, mengecek 6 kriteria *Definition of Done* (DoD), dan melakukan commit. |
| **140 - 150'** | **Evaluasi Tab 4 (Uji Pemahaman)** | Mengawasi mahasiswa mengerjakan 7 soal esai interaktif anti-cheat (Mastery Learning threshold $\ge 80$). |

---

## 2. Penjelasan Lengkap Tiap Sub-Materi (Untuk Narasi Mengajar)

### Pilar 1: Arsitektur Relasional PostgreSQL & Supabase SQL Engine

1. **UUID Primary Key (`gen_random_uuid()`) vs Serial ID:**
   - **Narasi Dosen:** *"Di perkuliahan pengantar database dasar, Anda mungkin terbiasa menggunakan integer auto-increment `SERIAL 1, 2, 3...`. Namun di arsitektur industri dan cloud terdistribusi, pola ini adalah bahaya besar! Bayangkan URL aplikasi Anda adalah `/orders/100`. Peretas langsung tahu bahwa ada order nomor 99 dan 101, memudahkan serangan ID Enumeration. Selain itu, kompetitor bisa menebak jumlah transaksi bisnis Anda. Dengan `UUID v4`, ID berupa 128-bit acak kriptografis (2¹²² kombinasi) yang tidak bisa ditebak, dan dapat digenerate secara independen di client, Edge, maupun server tanpa tabrakan (Zero Collision)."*
   - **Poin Kunci:** Kebal enumerasi, menjaga kerahasiaan metrik bisnis, dan bebas tabrakan replikasi cloud.

2. **Relasi 1:N (Foreign Key & `ON DELETE CASCADE`):**
   - **Narasi Dosen:** *"Relasi 1:N menghubungkan 1 profil pengguna (`profiles.id`) ke banyak proyek (`projects.user_id`). Apa jadinya jika profil pengguna dihapus dari sistem? Jika kita tidak menggunakan klausa referensial, proyek-proyek milik pengguna tersebut akan tertinggal sebagai data yatim (orphaned records) yang mengotori database. Dengan menambahkan `ON DELETE CASCADE`, PostgreSQL di tingkat kernel otomatis membersihkan seluruh proyek anak secara atomik tanpa developer perlu menulis query delete manual."*
   - **Poin Kunci:** Eliminasi data yatim secara atomik, konsistensi data 100%.

3. **Relasi M:N (Junction Table & Composite Primary Key):**
   - **Narasi Dosen:** *"Satu tugas bisa memiliki banyak tag (misal: 'Next.js 16', 'Auth', 'High Priority'), dan satu tag bisa dipakai oleh banyak tugas. Hubungan ini disebut Relasi Banyak-ke-Banyak (M:N). Jangan pernah menyimpannya sebagai string teks dipisah koma `tags = 'Next.js, Auth'` karena melanggar bentuk normalisasi 1NF dan pencariannya sangat lambat! Kita pecah menjadi tabel perantara `task_tags`. Kunci primernya adalah gabungan dua kolom: `PRIMARY KEY (task_id, tag_id)`. Kunci komposit ini menjamin tidak ada yang bisa memasang tag yang sama dua kali pada satu tugas."*
   - **Poin Kunci:** Dekomposisi 3 tabel, pencegahan tag duplikat, dan dukungan pencarian dua arah (Tugas ➔ Tag vs Tag ➔ Daftar Tugas).

---

### Pilar 2: Integritas Skema, Constraints & Indexing

1. **Integrity Constraints (`NOT NULL`, `UNIQUE`, `CHECK`):**
   - **Narasi Dosen:** *"Validasi di frontend (HTML/React) atau validasi Zod di server actions hanyalah baris pertahanan awal. Garis pertahanan paling kokoh yang tidak pernah bisa ditembus oleh peretas menggunakan cURL atau Postman adalah integritas skema di tingkat kernel PostgreSQL. Dengan `CHECK (budget >= 0)`, database menolak keras angka minus. Dengan `CHECK (status IN ('todo', 'in_progress', 'done'))`, database menjamin hanya status legal yang bisa tersimpan di disk."*
   - **Poin Kunci:** Pertahanan mutlak di level storage engine, bebas bypass.

2. **B-Tree Indexing untuk Akses Cepat (`CREATE INDEX`):**
   - **Narasi Dosen:** *"Ingat aturan industri ini: PostgreSQL TIDAK OTOMATIS membuat indeks pada kolom Foreign Key! PostgreSQL hanya otomatis mengindeks Primary Key. Jika tabel projects memiliki 100.000 baris dan Anda melakukan JOIN tanpa indeks pada `user_id`, PostgreSQL harus membaca seluruh disk baris demi baris (Sequential Scan $O(N)$) yang memakan waktu ratusan milidetik. Dengan `CREATE INDEX idx_projects_user_id ON projects(user_id)`, pencarian melompat menggunakan pohon seimbang B-Tree ($O(\log N)$) dalam 0,5 milidetik."*
   - **Poin Kunci:** Transformasi $O(N)$ ke $O(\log N)$, wajib dibuat untuk setiap kolom foreign key.

3. **Otomasi Timestamp dengan PostgreSQL Triggers (`updated_at`):**
   - **Narasi Dosen:** *"Daripada aplikasi kita harus mengingat untuk mengirim `updated_at = new Date()` setiap kali ada update data, kita delegasikan tugas ini ke PostgreSQL menggunakan fungsi trigger PL/pgSQL. Trigger `BEFORE UPDATE` otomatis menyuntikkan `NEW.updated_at = NOW()` di level database, menjamin stempel waktu selalu akurat dan tersinkronisasi."*
   - **Poin Kunci:** Jam server database atomik, zero maintenance di kode aplikasi.

---

### Pilar 3: Integrasi Next.js 16 SSR & Async Cookies

1. **Arsitektur `@supabase/ssr` Modern:**
   - **Narasi Dosen:** *"Paket lama `@supabase/auth-helpers-nextjs` telah resmi ditinggalkan (deprecated). Paket resmi generasi terbaru adalah `@supabase/ssr`. Paket ini dirancang khusus untuk Next.js App Router dengan memisahkan otentikasi browser dan server secara bersih melalui adapter cookie standar."*

2. **Breaking Change Next.js 16: `await cookies()`:**
   - **Narasi Dosen:** *"Perhatikan perubahan penting di Next.js 16! Pemanggilan `cookies()` dari pustaka `'next/headers'` sekarang bertipe Promise asinkron dan WAJIB di-await: `const cookieStore = await cookies()`. Jangan lupa membungkus method `setAll()` dengan blok `try/catch` agar Server Component yang dieksekusi secara streaming tidak melempar runtime error."*

3. **Pemisahan Klien `server.ts` vs `client.ts`:**
   - **Narasi Dosen:** *"Kita membuat dua utilitas Supabase: `src/utils/supabase/server.ts` untuk Server Component dan Server Actions (0 kB JS ke browser, aman untuk secret), dan `client.ts` untuk Client Component ('use client') yang berjalan sebagai singleton di peramban. Pola dual-key fallback yang kita terapkan memastikan aplikasi otomatis kompatibel dengan Publishable Key format baru (`sb_publishable_...`) maupun Anon Key lama (`eyJ...`)."*

---

### Pilar 4: Blueprint Proyek Akhir & Kontrak Data Antar-Modul

1. **Hierarki 3 Tingkat Multi-Tenant:**
   - **Narasi Dosen:** *"Skema yang kita bangun hari ini adalah pondasi Proyek Akhir: `profiles` (profil pengembang) ➔ `projects` (proyek perkuliahan) ➔ `tasks` (daftar pekerjaan). Perhatikan bahwa pada Minggu 4 ini, tabel `profiles` kita buat mandiri menggunakan `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` tanpa ketergantungan pada `auth.users`. Mengapa? Agar data seed contoh dapat langsung dimasukkan dan ditampilkan di web tanpa mahasiswa harus login terlebih dahulu! Di Minggu 5 nanti, kita akan menghubungkan `profiles.id` ke `auth.users.id` via Supabase Auth."*

2. **Pemetaan Tipe Otomatis via Supabase Typegen:**
   - **Narasi Dosen:** *"Jangan pernah mengetik interface TypeScript secara manual untuk tabel database! Satu typo saja pada nama kolom bisa memicu bug runtime. Dengan menjalankan `npx supabase gen types typescript`, Supabase CLI membaca langsung katalog PostgreSQL dan menghasilkan file `database.types.ts`. Hasilnya: autocomplete 100% akurat di VS Code dan nol kesalahan tipe (0 `any`)."*

---

## 3. Peta Berkas & Di Mana Menemukan Kode (File Architecture Map)

Setelah mahasiswa mengeksekusi Formula Prompt AI di tab **Lab & Prompt AI**, repositori proyek mereka akan memiliki arsitektur 5 berkas modular berikut:

```
📁 serverless-project/
├── 📁 supabase/
│   └── 📁 migrations/
│       └── 📄 01_initial_schema.sql         <-- [BERKAS 3] DDL 3 Tabel, Constraints, Index, Triggers & Seed Data
├── 📁 src/
│   ├── 📁 utils/
│   │   └── 📁 supabase/
│   │       ├── 📄 server.ts                 <-- [BERKAS 1] Server Client (await cookies() Next.js 16)
│   │       └── 📄 client.ts                 <-- [BERKAS 2] Browser Client ('use client' + Dual-Key Fallback)
│   ├── 📁 types/
│   │   └── 📄 database.types.ts             <-- [BERKAS 4] Kontrak Interface TypeScript Supabase
│   └── 📁 app/
│       └── 📄 page.tsx                      <-- [BERKAS 5] Landing Page Root (Fetch Live Data Seed & Tombol CTA)
```

---

## 4. Runutan Alur Eksekusi Data (Data Lifecycle & Flow Trace)

Tunjukkan diagram ini di papan tulis atau proyektor saat sesi walkthrough:

```
[1. SUPABASE CLOUD POSTGRESQL ENGINE]
       │
       ├─► Tabel `profiles` (1 Profil Pengembang)
       ├─► Tabel `projects` (3 Proyek Serverless dengan Anggaran)
       ├─► Tabel `tasks` (6 Tugas dengan Status Relasional)
       │
       ▼ (2. Request HTTP dari Peramban Masuk ke Rute Root `/`)
[2. NEXT.JS 16 SERVER RUNTIME - src/app/page.tsx (RSC)]
       │
       ├─► 0 kB JavaScript dikirim ke browser untuk data fetching
       ├─► Eksekusi: const supabase = await createClient()
       │        │
       │        ▼ (3. src/utils/supabase/server.ts)
       │        ├─► const cookieStore = await cookies() (Async Header Resolution)
       │        └─► createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY)
       │
       ▼ (4. Query Relasional Terpadu via Supabase SDK)
supabase.from("projects").select("id, title, budget, tasks(id, title, status)")
       │
       ▼ (5. PostgreSQL Engine Memproses Query)
B-Tree Index Scan (idx_tasks_project_id) ➔ Mengembalikan 3 Proyek + Relasi Tugas Anak
       │
       ▼ (6. Server Rendering HTML)
Next.js 16 me-render HTML statis/stream berisi kartu proyek & badge metrik
       │
       ▼ (7. Layar Pengguna di Browser)
Pengguna melihat 3 Proyek nyata dari database TANPA PERLU LOGIN!
```

---

## 5. Checklist Demonstrasi Kelas Pasca Eksekusi Prompt AI

Saat proyektor menampilkan layar Anda, lakukan 6 langkah demonstrasi ini secara berurutan:

### 1. Buka File Explorer VS Code (Struktur 5 Berkas)
- Buka [`src/utils/supabase/server.ts`](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/utils/supabase/server.ts): Tunjukkan `await cookies()`, `getAll()`, `setAll()`, dan dual-key fallback.
- Buka [`src/utils/supabase/client.ts`](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/utils/supabase/client.ts): Tunjukkan penggunaan `createBrowserClient`.
- Buka [`supabase/migrations/01_initial_schema.sql`](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/supabase/migrations/01_initial_schema.sql): Tunjukkan struktur DDL 3 tabel, CHECK constraints, dan query seed data contoh.
- Buka [`src/types/database.types.ts`](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/types/database.types.ts): Tunjukkan interface tipe hasil typegen.

### 2. Buka Supabase Cloud Dashboard ➔ SQL Editor
- Buka dashboard proyek Supabase di browser ➔ Masuk ke menu **SQL Editor**.
- Buka berkas `supabase/migrations/01_initial_schema.sql`, salin seluruh kodenya, lalu tempel ke SQL Editor Supabase.
- Klik tombol **Run (Ctrl + Enter)**.
- **Tunjukkan ke Mahasiswa:**
  - Status `Success. No rows returned`.
  - Masuk ke menu **Table Editor** di bilah kiri.
  - Tunjukkan 3 tabel baru telah tercipta: `profiles`, `projects`, dan `tasks`.
  - Buka tabel `projects`: Tunjukkan bahwa 3 baris data proyek contoh telah terisi lengkap dengan relasi `user_id` ke tabel `profiles`!

### 3. Jalankan Aplikasi Next.js (`npm run dev`)
- Buka terminal VS Code, jalankan `npm run dev`.
- Buka peramban di `http://localhost:3000`.
- **Tunjukkan ke Mahasiswa:**
  - Halaman root `/` langsung menampilkan **3 Kartu Proyek Serverless** hidup dari database:
    1. *Arsitektur Platform E-Commerce Serverless* (Rp 25.000.000 - 3 Tugas)
    2. *Sistem Manajemen Inventaris & AI Media CDN* (Rp 18.500.000 - 2 Tugas)
    3. *Aplikasi Mobile Realtime Telemetri IoT* (Rp 12.000.000 - 1 Tugas)
  - Tunjukkan bahwa data ini tampil **tanpa perlu login**, membuktikan bahwa arsitektur tabel kita bersih dan siap dipublikasikan.

### 4. Periksa Eksekusi Query Relasional di SQL Editor
- Di Supabase SQL Editor, jalankan query verifikasi JOIN 3 tabel:
  ```sql
  SELECT 
    p.title AS nama_proyek,
    pr.full_name AS pemilik,
    COUNT(t.id) AS jumlah_tugas,
    p.budget AS anggaran
  FROM projects p
  JOIN profiles pr ON pr.id = p.user_id
  LEFT JOIN tasks t ON t.project_id = p.id
  GROUP BY p.id, p.title, pr.full_name, p.budget;
  ```
- Tunjukkan tabel hasil query yang membuktikan integritas relasi 1:N antar tabel berhasil 100%.

### 5. Verifikasi B-Tree Indexing dengan `EXPLAIN ANALYZE`
- Jalankan query inspeksi query planner di Supabase SQL Editor:
  ```sql
  EXPLAIN ANALYZE SELECT * FROM projects WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  ```
- **Tunjukkan ke Mahasiswa:** Terdapat baris `Index Scan using idx_projects_user_id`, membuktikan bahwa pencarian dieksekusi melalui pohon indeks B-Tree, bukan pembacaan disk sekuensial lambat!

### 6. Verifikasi Type Safety di VS Code Editor
- Buka file `src/app/page.tsx` di VS Code.
- Arahkan kursor (*hover*) ke variabel `projects` atau properti `proj.budget`.
- **Tunjukkan ke Mahasiswa:** Tipe data terdeteksi otomatis sebagai `number | null`, dan nama kolom mendapatkan autocomplete IntelliSense. Jika nama kolom sengaja diubah menjadi `proj.budgett` (typo), TypeScript langsung memunculkan garis merah error.

---

## 6. Protokol Eksperimen & Uji Coba Pembuktian Kinerja (Proof of Execution Labs)

Lakukan 4 protokol eksperimen *live* berikut di depan kelas untuk membuktikan bahwa PostgreSQL dan Supabase bekerja sesuai teori:

```
               LAB EKSPERIMEN PEMBUKTIAN KELAS (MODUL 4)
 ┌──────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┐
 │  1. FOREIGN KEY &    │  2. COMPOSITE PK     │  3. CHECK CONSTRAINT │  4. ASYNC COOKIES    │
 │     CASCADE DELETE   │     ANTI-DUPLIKASI   │     BUDGET & ENUM    │     NEXT.JS 16       │
 │  Orphan Prevention   │  Unique Violation    │  Kernel Rejection    │  Promise Resolution  │
 └──────────────────────┴──────────────────────┴──────────────────────┴──────────────────────┘
```

---

### EKSPERIMEN 1: Pembuktian Foreign Key & Cascading Delete

#### A. Uji Coba Penolakan Foreign Key Siluman (Orphan Prevention)
- **Tujuan:** Membuktikan bahwa PostgreSQL menolak menyimpan entitas anak jika ID induk tidak terdaftar.
- **Langkah di Supabase SQL Editor:**
  Jalankan perintah insert dengan ID user fiktif:
  ```sql
  INSERT INTO projects (title, user_id, budget)
  VALUES ('Proyek Yatim Ilegal', '00000000-0000-0000-0000-000000000000', 5000000);
  ```
- **Hasil yang Ditunjukkan:**
  PostgreSQL menolak keras dengan error:
  ```
  ERROR: insert or update on table "projects" violates foreign key constraint "projects_user_id_fkey"
  DETAIL: Key (user_id)=(00000000-0000-0000-0000-000000000000) is not present in table "profiles".
  ```
- **Kesimpulan untuk Mahasiswa:** *"Database menolak pembuatan data anak tanpa induk, menjamin tidak ada data yatim yang mengotori sistem!"*

#### B. Uji Coba Pembersihan Atomik (`ON DELETE CASCADE`)
- **Tujuan:** Membuktikan bahwa menghapus entitas induk otomatis membersihkan seluruh proyek dan tugas anak.
- **Langkah di Supabase SQL Editor:**
  1. Hitung jumlah tugas saat ini:
     ```sql
     SELECT count(*) FROM tasks; -- Hasil: 6 tugas
     ```
  2. Hapus profil pengembang `profiles`:
     ```sql
     DELETE FROM profiles WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
     ```
  3. Periksa kembali tabel `projects` dan `tasks`:
     ```sql
     SELECT count(*) FROM projects; -- Hasil: 0
     SELECT count(*) FROM tasks;    -- Hasil: 0
     ```
- **Hasil yang Ditunjukkan:** Seluruh data proyek dan tugas anak terhapus bersih secara otomatis!
- **Catatan Pengajar:** Setelah eksperimen ini selesai, jalankan ulang query INSERT seed data agar database terisi kembali.

---

### EKSPERIMEN 2: Pembuktian Kunci Primer Komposit (Anti-Duplikasi M:N)

- **Tujuan:** Membuktikan peran `PRIMARY KEY (task_id, tag_id)` pada tabel perantara relasi M:N.
- **Langkah di Supabase SQL Editor:**
  1. Buat tabel master tag dan junction table sementara:
     ```sql
     CREATE TABLE IF NOT EXISTS tags (
       id TEXT PRIMARY KEY,
       name TEXT NOT NULL
     );
     INSERT INTO tags VALUES ('tag_nextjs', 'Next.js 16') ON CONFLICT DO NOTHING;

     CREATE TABLE IF NOT EXISTS task_tags (
       task_id UUID NOT NULL,
       tag_id TEXT NOT NULL REFERENCES tags(id),
       PRIMARY KEY (task_id, tag_id)
     );
     ```
  2. Masukkan relasi tag pertama (valid):
     ```sql
     INSERT INTO task_tags (task_id, tag_id)
     VALUES ('b1111111-1111-4000-a000-000000000001', 'tag_nextjs');
     -- Output: INSERT 0 1 (Sukses)
     ```
  3. Coba masukkan pasangan yang sama untuk KEDUA KALINYA:
     ```sql
     INSERT INTO task_tags (task_id, tag_id)
     VALUES ('b1111111-1111-4000-a000-000000000001', 'tag_nextjs');
     ```
- **Hasil yang Ditunjukkan:**
  PostgreSQL menolak dengan kode error 23505:
  ```
  ERROR: duplicate key value violates unique constraint "task_tags_pkey"
  DETAIL: Key (task_id, tag_id)=(b1111111-1111-4000-a000-000000000001, tag_nextjs) already exists.
  ```
- **Kesimpulan untuk Mahasiswa:** *"Kunci komposit di database mencegah tag ganda muncul di kartu tugas yang sama, tanpa perlu menulis logika if-else di backend!"*

---

### EKSPERIMEN 3: Pembuktian Pertahanan CHECK Constraints

#### A. Uji Coba Budget Negatif
- **Langkah di Supabase SQL Editor:**
  ```sql
  INSERT INTO projects (title, user_id, budget)
  VALUES ('Proyek Minus', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -500000);
  ```
- **Hasil:**
  ```
  ERROR: new row for relation "projects" violates check constraint "projects_budget_check"
  DETAIL: Failing row contains (..., budget: -500000.00).
  ```

#### B. Uji Coba Status Tugas Tidak Sah
- **Langkah di Supabase SQL Editor:**
  ```sql
  INSERT INTO tasks (project_id, title, status)
  VALUES ('b1111111-1111-4000-a000-000000000001', 'Tugas Error', 'sedang_dikerjakan');
  ```
- **Hasil:**
  ```
  ERROR: new row for relation "tasks" violates check constraint "tasks_status_check"
  DETAIL: Failing row contains (..., status: "sedang_dikerjakan").
  ```
- **Kesimpulan untuk Mahasiswa:** *"Aturan bisnis `CHECK (budget >= 0)` dan `CHECK (status IN ('todo', 'in_progress', 'done'))` dieksekusi langsung oleh engine PostgreSQL dan mustahil di-bypass oleh peretas!"*

---

### EKSPERIMEN 4: Pembuktian Async Cookies Next.js 16

- **Tujuan:** Menunjukkan apa yang terjadi jika mahasiswa melupakan breaking change `await cookies()` di Next.js 16.
- **Langkah Eksperimen:**
  1. Buka file `src/utils/supabase/server.ts`.
  2. Hapus keyword `await` pada baris:
     ```typescript
     // ❌ Eksperimen Error: Tanpa await!
     const cookieStore = cookies();
     ```
  3. Buka browser dan refresh `http://localhost:3000`.
- **Hasil yang Ditunjukkan:**
  Muncul layar error Next.js 16:
  ```
  Error: Route / used cookies().getAll() without awaiting cookies().
  In Next.js 16, cookies() returns a Promise and must be awaited.
  ```
  4. Kembalikan keyword `await`: `const cookieStore = await cookies();`. Refresh browser ➔ halaman langsung berjalan mulus kembali!
- **Kesimpulan untuk Mahasiswa:** *"Ingat aturan ini: Di Next.js 16 App Router, cookies() adalah Promise asinkron!"*

---

## 7. Socratic Q&A (Pertanyaan Uji Kritis untuk Mahasiswa di Kelas)

Lemparkan 4 pertanyaan ini ke mahasiswa untuk menguji pemahaman mendalam mereka:

1. **Pertanyaan:** *"Mengapa sistem cloud terdistribusi lebih memilih UUID v4 daripada serial integer 1, 2, 3... sebagai Primary Key?"*  
   **Jawaban Benar:** UUID v4 kebal terhadap serangan ID enumeration di URL API, tidak membocorkan metrik volume transaksi bisnis ke kompetitor, dan dapat dibuat secara independen di client/edge tanpa risiko tabrakan ID (Zero Collision).

2. **Pertanyaan:** *"Jika tabel projects memiliki 100.000 data, mengapa kita wajib menjalankan `CREATE INDEX idx_projects_user_id ON projects(user_id)`? Bukankah PostgreSQL mengindeksnya otomatis?"*  
   **Jawaban Benar:** PostgreSQL HANYA mengindeks Primary Key secara otomatis. Kolom Foreign Key TIDAK diindeks otomatis. Tanpa B-Tree index, operasi `JOIN` akan memaksa Sequential Scan $O(N)$ yang lambat dan membebani CPU server.

3. **Pertanyaan:** *"Apa fungsi tabel perantara (junction table) pada relasi Many-to-Many dan mengapa kita menggunakan Composite Primary Key?"*  
   **Jawaban Benar:** Junction table memecah relasi M:N menjadi dua relasi 1:N yang ternormalisasi (memenuhi 1NF). Composite Primary Key `PRIMARY KEY (task_id, tag_id)` memastikan satu tag tidak bisa disematkan dua kali pada tugas yang sama di level kernel database.

4. **Pertanyaan:** *"Mengapa kita dilarang mengimpor `src/utils/supabase/server.ts` ke dalam komponen yang memiliki direktif `'use client'`?"*  
   **Jawaban Benar:** Karena berkas `server.ts` mengimpor `cookies` dari modul `'next/headers'`, yang merupakan pustaka khusus server runtime. Mengimpornya ke client akan memicu kompilasi error karena browser tidak memiliki akses ke runtime headers server.

---

*Dokumen Panduan Pengajaran ini disusun secara resmi untuk mendampingi modul perkuliahan The Serverless Odyssey — Pertemuan 4.*
