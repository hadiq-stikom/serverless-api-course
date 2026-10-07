# BUKU PANDUAN PENGAJAR (TEACHING GUIDE)
## KULIAH "THE SERVERLESS ODYSSEY" — MODUL 3
**Topik:** Server Actions, React 19 Form Hooks (`useActionState`, `useFormStatus`, `useOptimistic`) & Validasi Data (Zod)  
**Target Pembaca:** Dosen Pengampu / Instruktur Laboratorium  
**Alokasi Waktu:** 150 Menit (Tatap Muka Lab) + 180 Menit (Tugas Mandiri)  
**CPMK:** Mahasiswa mampu mengimplementasikan Server Actions (`'use server'`) untuk mutasi data form, mengelola *lifecycle state* dengan React 19 `useActionState`, dan memvalidasi integritas data dengan Zod.

---

## 1. Rencana Alokasi Waktu Kuliah (150 Menit Tatap Muka)

| Durasi | Sesi | Agenda Pengajaran & Aktivitas Kelas |
| :---: | :--- | :--- |
| **00 - 15'** | **Apersepsi & Paradigma** | Membandingkan cara lama (API Routes manual `POST /api/tasks` + `fetch()` + `useState(false)`) vs cara baru Next.js 16 (Server Actions RPC). |
| **15 - 45'** | **Pendalaman Konsep Teori** | Membedah 4 Pilar: Direktif `'use server'`, Validasi Zod `safeParse()`, React 19 `useActionState`, dan Standarisasi `ActionState<T>`. |
| **45 - 65'** | **Simulasi Interaktif Visual** | Membuka tab "Konsep & Teori" pada platform dan menjalankan 11 simulator interaktif bersama mahasiswa. |
| **65 - 95'** | **Eksekusi AI Prompt All-in-One** | Memandu mahasiswa menyalin **Formula Prompt AI Teruji** ke AI Agent (Antigravity/Cursor) atau AI Chat, mengamati proses scaffolding 5 berkas. |
| **95 - 125'** | **Live Code Walkthrough & DevTools** | Dosen membedah berkas hasil generasi AI, memeriksa Network Tab di browser, dan mendemonstrasikan penanganan error Zod. |
| **125 - 140'** | **Misi Snowballing Git** | Memandu mahasiswa melakukan commit git di branch `feature/server-actions-zod` dan mengecek *Definition of Done* (DoD). |
| **140 - 150'** | **Evaluasi Tab 4 (Uji Pemahaman)** | Mengawasi mahasiswa mengerjakan kuis esai interaktif anti-cheat (Mastery Learning threshold $\ge 80$). |

---

## 2. Penjelasan Lengkap Tiap Sub-Materi (Untuk Narasi Mengajar)

### Pilar 1: Paradigma Mutasi Data Server Actions vs API Routes Tradisional
1. **Direktif `'use server'` & Eksekusi RPC Otomatis:**
   - **Narasi Dosen:** *"Dulu di React dan Next.js Pages Router, untuk menyimpan data form Anda harus membuat file API terpisah di `/api/tasks.ts`, menulis handler `export default async function handler(req, res)`, lalu di client menulis `e.preventDefault()`, `fetch('/api/tasks', { method: 'POST', body: JSON.stringify(...) })`, dan mengurus `isLoading`. Di Next.js 16, Anda cukup menandai fungsi dengan `'use server'`. Next.js otomatis menjadikannya Remote Procedure Call (RPC). Form bisa langsung memanggil fungsi backend seolah-olah fungsi lokal, tetapi dieksekusi 100% aman di server."*
   - **Poin Kunci:** Protokol POST internal dengan hash Action ID terenkripsi.
   - **Keamanan Secrets:** Variabel lingkungan sensitif (database keys) tidak pernah bocor ke browser.

2. **Pola Penempatan: Berkas Terpisah (`src/actions/*`) vs Inline:**
   - **Narasi Dosen:** *"Ada dua cara menulis Server Action: inline (di dalam berkas Server Component) atau berkas terpisah di `src/actions/tasks.ts`. Di industri, standar emasnya adalah **berkas terpisah**. Kenapa? Karena berkas terpisah dapat diimpor bebas oleh Client Component (`'use client'`). Ingat aturan ini: DILARANG KERAS menulis `'use server'` inline di dalam file Client Component!"*

3. **Revalidasi Cache Instan (`revalidatePath`):**
   - **Narasi Dosen:** *"Setelah data berhasil dimasukkan ke database, bagaimana cara antarmuka web langsung menampilkan item baru tersebut tanpa tombol reload browser ditekan? Jawabannya adalah fungsi `revalidatePath('/tasks')`. Next.js akan menghapus cache HTML rute tersebut di server dan mengirimkan pembaruan data secara instan melalui soft navigation."*

---

### Pilar 2: Validasi Skema & Pertahanan Input Ketat dengan Zod
1. **Prinsip "Never Trust Client Input" & `schema.safeParse()`:**
   - **Narasi Dosen:** *"Jangan pernah merasa aman hanya karena form Anda sudah diberi atribut HTML `required` atau `minlength="3"`. Hacker bisa membuka terminal, menjalankan perintah `curl -X POST` atau Postman, dan mengirim payload kosong atau string 10.000 karakter. Validasi browser hanyalah kosmetik UX; validasi server dengan Zod adalah benteng pertahanan mutlak."*
   - **Kenapa `.safeParse()`, bukan `.parse()`?**  
     Method `.parse()` akan melempar exception (*throw error*) yang membuat server crash (HTTP 500) jika validasi gagal. Sebaliknya, `.safeParse()` mengembalikan objek diskriminatif `{ success: true, data }` atau `{ success: false, error }`, sehingga aplikasi tetap stabil.

2. **Type Coercion (`z.coerce`) & Refinement (`.refine()`):**
   - **Narasi Dosen:** *"Seluruh data yang diambil dari objek HTML `formData.get('nama')` selalu bertipe string mentah. Jika form meminta angka harga '50000', nilai yang diterima adalah string `"50000"`. Zod menyediakan `z.coerce.number()` yang otomatis mengubah string ke number. Jika butuh validasi logika bisnis—misalnya deadline tugas harus tanggal di masa depan—kita menggunakan method `.refine()`."*

3. **Format Error Ramah Pengguna (`error.flatten().fieldErrors`):**
   - **Narasi Dosen:** *"ZodError aslinya berbentuk array bersarang yang rumit. Dengan memanggil `.flatten().fieldErrors`, kita mengubahnya menjadi kamus sederhana: `{ title: ['Judul minimal 3 karakter'] }`. Ini membuat komponen form di frontend sangat mudah menampilkan pesan error tepat di bawah kotak input masing-masing."*

---

### Pilar 3: Ekosistem Hook Form React 19 (`useActionState`, `useFormStatus`, `useOptimistic`)
1. **Pengelolaan State Form Modern dengan `useActionState`:**
   - **Narasi Dosen:** *"Ini adalah breaking change besar di React 19! Hook lama `useFormState` dari package `react-dom` telah ditinggalkan (deprecated). Penggantinya adalah `useActionState` yang diimpor langsung dari inti `'react'`. Hook ini mengembalikan 3 nilai tuple: `[state, formAction, isPending]`. Nilai `isPending` otomatis menjadi `true` selama server bekerja, sehingga kita tidak butuh lagi `const [loading, setLoading] = useState(false)`!"*

2. **Tombol Submit Mandiri dengan `useFormStatus`:**
   - **Narasi Dosen:** *"Sering kali tombol submit berada di dalam komponen terpisah. Daripada mengoper prop `loading` dari induk ke anak (*prop drilling*), komponen `<SubmitButton>` cukup memanggil `useFormStatus()`. Komponen tombol otomatis tahu apakah form induknya sedang disubmit atau tidak."*

3. **Pembaruan Antarmuka 0 Milidetik dengan `useOptimistic`:**
   - **Narasi Dosen:** *"Pada koneksi 3G/lambat, menunggu server membalas bisa memakan waktu 1-2 detik. Dengan `useOptimistic`, kita langsung merender tugas baru di layar seketika dengan status sementara (misal abu-abu/pending). Begitu server selesai, data disinkronkan. Jika server gagal, React otomatis me-rollback antarmuka ke kondisi semula tanpa efek glitch."*

---

### Pilar 4: Arsitektur Produksi & Standarisasi (`ActionState<T>`)
1. **Standarisasi Kontrak Respons (`ActionState<T>`):**
   - **Narasi Dosen:** *"Dalam tim besar, setiap developer tidak boleh membuat format respons sesuka hati. Kita membakukan tipe generic `ActionState`: harus selalu ada `success: boolean`, `message: string`, dan opsional `errors` serta `data`. Dengan demikian, komponen UI apa pun bisa menangani respons form dengan konsisten."*

2. **Integrasi Feedback Error Shadcn UI:**
   - **Narasi Dosen:** *"Ketika `state?.errors?.title` terdeteksi, kita beri garis batas merah semantik pada input (`border-destructive focus-visible:ring-destructive`) dan teks pesan kesalahan di bawahnya. Ini memenuhi standar aksesibilitas dan memberikan visual feedback yang profesional."*

---

## 3. Peta Berkas & Di Mana Menemukan Kode (File Architecture Map)

Setelah mahasiswa mengeksekusi Formula Prompt AI di tab **Lab & Prompt AI**, proyek mereka akan memiliki struktur 5 berkas modular berikut:

```
📁 serverless-project/
├── 📁 src/
│   ├── 📁 lib/
│   │   └── 📄 schemas.ts                <-- [BERKAS 1] Definisi Skema Zod & Kontrak ActionState
│   ├── 📁 actions/
│   │   └── 📄 tasks.ts                  <-- [BERKAS 2] Server Action ('use server')
│   ├── 📁 components/
│   │   └── 📁 tasks/
│   │       └── 📄 create-task-form.tsx  <-- [BERKAS 3] Form Client Component ('use client' + useActionState)
│   └── 📁 app/
│       ├── 📁 (dashboard)/
│       │   └── 📁 tasks/
│       │       └── 📄 page.tsx          <-- [BERKAS 4] Server Component Dashboard (Render form + task list)
│       └── 📄 page.tsx                  <-- [BERKAS 5] Landing Page Root (Tombol CTA navigasi ke /tasks)
```

---

## 4. Runutan Alur Pemanggilan Kode (Call Trace & Data Lifecycle)

Tunjukkan alur ini di papan tulis atau proyektor saat sesi Live Walkthrough:

```
[PENGGUNA DI BROWSER]
       │
       ▼ (1. Ketik judul tugas lalu klik tombol "Tambah Tugas")
[src/components/tasks/create-task-form.tsx]
       │
       ├─► React 19: useActionState otomatis mengubah `isPending = true`
       ├─► UI: Tombol submit terkunci (disabled) & menampilkan spinner
       │
       ▼ (2. Form mentransmisikan data via HTTP POST RPC Action ID)
[JARINGAN / NETWORK LAYER]
       │
       ├─► Request Header: `Next-Action: <hash_id>`
       ├─► Payload: Form data dienkapsulasi (bukan fetch REST biasa)
       │
       ▼ (3. Diterima oleh Node.js / Vercel Edge Serverless Runtime)
[src/actions/tasks.ts] -> 'use server'
       │
       ▼ (4. Validasi Defensif Input)
[src/lib/schemas.ts] -> TaskSchema.safeParse(rawData)
       │
       ├───► [KASUS A: VALIDASI GAGAL]
       │         │
       │         ├─► Ekstraksi: validation.error.flatten().fieldErrors
       │         └─► Return: { success: false, errors: { title: ["..."] } }
       │                  │
       │                  └─► UI Form menerima state error, pesan merah muncul
       │
       └───► [KASUS B: VALIDASI SUKSES]
                 │
                 ├─► Simpan data ke Database (Supabase PostgreSQL / Mock Memory)
                 ├─► Eksekusi: revalidatePath("/tasks") -> Cache server dibersihkan!
                 └─► Return: { success: true, message: "Tugas berhasil dibuat!" }
                          │
                          ▼ (5. Kembalikan respons ke browser)
                 [create-task-form.tsx & tasks/page.tsx]
                          │
                          ├─► `state.success == true` memicu reset form
                          ├─► Server Component me-render data tugas terbaru di tabel
                          └─► `isPending` kembali menjadi `false`
```

---

## 5. Checklist Demonstrasi Kelas Pasca Eksekusi Prompt AI

Saat proyektor menampilkan layar Anda, lakukan 6 langkah demonstrasi ini secara berurutan di hadapan mahasiswa:

### 1. Buka File Explorer VS Code (Tunjukkan Arsitektur 3 Berkas)
- Buka [`src/lib/schemas.ts`](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/lib/schemas.ts): Tunjukkan deklarasi `TaskSchema` dan tipe `ActionState`. Jelaskan bahwa file ini tidak memiliki direktif `'use client'` ataupun `'use server'` sehingga dapat dibagikan (*shared*).
- Buka [`src/actions/tasks.ts`](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/actions/tasks.ts): Tunjukkan direktif `"use server"` di baris paling atas. Tunjukkan bagaimana `TaskSchema.safeParse()` dipanggil di dalam fungsi.
- Buka [`src/components/tasks/create-task-form.tsx`](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/components/tasks/create-task-form.tsx): Tunjukkan direktif `"use client"`. Tunjukkan pemanggilan `useActionState(createTaskAction, null)`.

### 2. Jalankan Aplikasi di Browser (`http://localhost:3000`)
- Buka halaman root `/`. Tunjukkan bahwa halaman tidak menampilkan template standar Next.js, melainkan Hero Banner dengan tombol CTA **"Buka Dashboard Tugas ➔"**.
- Klik tombol CTA tersebut dan tunjukkan transisi navigasi menuju `/tasks`.

### 3. Buka Browser DevTools (Network Tab) — Momen Pembuktian RPC
- Tekan `F12` atau `Inspect Element` ➔ Buka tab **Network** ➔ Filter ke **Fetch/XHR**.
- Ketik tugas di form, misalnya: *"Belajar Server Actions Next.js 16"*, lalu klik **Tambah Tugas**.
- **Tunjukkan ke Mahasiswa:**
  - Ada 1 request POST ke URL halaman saat ini (`/tasks`).
  - Periksa Request Headers: Terdapat header khusus `Next-Action: [string hash]`.
  - Jelaskan: *"Lihat, kita tidak pernah membuat file API `/api/tasks`. Next.js menangani transmisi RPC ini di latar belakang!"*

### 4. Uji Kasus Negatif: Pertahanan Validasi Zod
- Kosongkan input judul atau ketik hanya 1 huruf (misal: `"A"`), lalu klik submit.
- **Tunjukkan ke Mahasiswa:**
  - Halaman **TIDAK RELOAD** (tidak kedip).
  - Browser **TIDAK CRASH** (tidak muncul error merah layar putih).
  - Muncul teks merah rapi di bawah input: *"Judul tugas minimal harus 3 karakter"*.
  - Jelaskan: *"Pesan ini bukan dibuat oleh JavaScript browser biasa, melainkan dikirim langsung oleh validasi Zod di server!"*

### 5. Uji Kasus Positif: Sukses & Revalidasi Otomatis
- Ketik judul yang valid: *"Menyiapkan Database PostgreSQL Supabase"*, pilih prioritas *"High"*, lalu klik submit.
- **Tunjukkan ke Mahasiswa:**
  - Form otomatis bersih kembali (*reset*).
  - Baris tugas baru seketika muncul di tabel/daftar tugas di bawahnya tanpa mahasiswa perlu menekan tombol F5 / Refresh browser!
  - Jelaskan: *"Ini terjadi berkat fungsi `revalidatePath('/tasks')` di dalam Server Action."*

### 6. Tunjukkan Pencegahan Klik Ganda (Double-Submit Lock)
- Perlihatkan bahwa saat tombol submit diklik, tombol langsung berstatus `disabled` dengan teks *"Menyimpan..."*.
- Jelaskan: *"Ini mencegah pengguna yang tidak sabar mengklik tombol 5 kali berturut-turut yang berisiko membuat 5 data kembar di database."*

---

## 6. Protokol Eksperimen & Uji Coba Pembuktian Kinerja (Proof of Execution Labs)

Untuk membuktikan secara nyata di hadapan mahasiswa bahwa **Server Actions**, **Form Hooks React 19**, dan **Zod** bekerja sesuai teori dan bukan sekadar "keajaiban" (magic) otomatis, lakukan 3 protokol uji coba eksperimental berikut secara *live*:

```
               LAB EKSPERIMEN PEMBUKTIAN KELAS
 ┌──────────────────────┬──────────────────────┬──────────────────────┐
 │   1. SERVER ACTIONS  │    2. FORM HOOKS     │     3. ZOD SCHEMA    │
 │   Bukti Eksekusi Server  │   Uji Latensi 2.5s   │   Bypass HTML Form   │
 │   Terminal vs Console│   isPending & Lock   │   safeParse vs parse │
 └──────────────────────┴──────────────────────┴──────────────────────┘
```

---

### EKSPERIMEN 1: Pembuktian Kinerja Server Actions (`'use server'`)

#### A. Uji Lokasi Eksekusi (Server Terminal vs Browser Console)
- **Tujuan:** Membuktikan bahwa kode Server Action benar-benar dieksekusi 100% di server Node.js, bukan di peramban klien.
- **Langkah Eksperimen:**
  1. Buka berkas `src/actions/tasks.ts`.
  2. Tambahkan baris pencatatan log di baris pertama fungsi `createTaskAction`:
     ```typescript
     console.log("🔥 [SERVER LOG] Menerima data form di Server:", rawData);
     ```
  3. Buka browser di `http://localhost:3000/tasks`, buka **Console DevTools (F12)**.
  4. Buka terminal VS Code di samping browser yang menjalankan `npm run dev`.
  5. Kirim form dari browser.
- **Hasil yang Ditunjukkan ke Mahasiswa:**
  - Periksa **Console Browser**: Tidak ada teks log apa pun (bersih).
  - Periksa **Terminal Server VS Code**: Muncul teks log `🔥 [SERVER LOG] Menerima data form di Server: ...`.
  - **Kesimpulan untuk Mahasiswa:** *"Terbukti! Log dieksekusi di server runtime, membuktikan fungsi `'use server'` tidak pernah diunduh atau dijalankan oleh mesin JavaScript browser pengguna."*

#### B. Uji Kebocoran Rahasia (Secrets Isolation Test)
- **Tujuan:** Membuktikan bahwa kunci rahasia aman di dalam Server Action.
- **Langkah Eksperimen:**
  1. Tunjukkan pembacaan variabel lingkungan rahasia di dalam `src/actions/tasks.ts`:
     ```typescript
     console.log("🔒 Server Secret:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "TERSEDIA DI SERVER" : "KOSONG");
     ```
  2. Submit form dan tunjukkan terminal server berhasil membaca nilai rahasia tanpa pernah terkirim ke klien.

---

### EKSPERIMEN 2: Pembuktian Siklus Form Hooks React 19 (`useActionState`, `useFormStatus`, `useOptimistic`)

#### A. Uji Latensi Jaringan Buatan (*Artificial Delay Simulation*)
- **Tujuan:** Membuktikan kinerja otomatis boolean `isPending` dan mekanisme penguncian tombol anti-klik ganda.
- **Langkah Eksperimen:**
  1. Di dalam `src/actions/tasks.ts`, sisipkan jeda waktu palsu 2,5 detik sebelum revalidasi:
     ```typescript
     // Simulasi koneksi lambat atau proses database berat (2.5 detik)
     await new Promise((resolve) => setTimeout(resolve, 2500));
     ```
  2. Buka form di browser, masukkan data, lalu klik tombol **Tambah Tugas**.
- **Hasil yang Ditunjukkan ke Mahasiswa:**
  - Seketika tombol diklik, perhatikan bahwa **posisi ke-3 tuple `useActionState` (`isPending`)** otomatis bernilai `true`.
  - Tombol berubah teks menjadi *"Menyimpan..."* dan terkunci (`disabled = true`).
  - Input teks tidak dapat diedit (`disabled = true`).
  - Mintalah mahasiswa mencoba mengklik tombol 5 kali secara cepat. Tunjukkan bahwa browser tidak mengirim 5 request ganda (*double-submit terhindar 100%*).
  - Tepat pada detik ke-2,5, tombol kembali normal dan baris data baru muncul di tabel.

#### B. Uji Responsivitas 0ms & Rollback Otomatis (`useOptimistic`)
- **Tujuan:** Membuktikan bagaimana `useOptimistic` memberikan ilusi kecepatan seketika dan kemampuan *auto-rollback* saat terjadi kegagalan jaringan.
- **Langkah Eksperimen:**
  1. Pasang hook `useOptimistic` pada antarmuka daftar tugas.
  2. Di dalam Server Action `src/actions/tasks.ts`, lemparkan error buatan di akhir proses:
     ```typescript
     throw new Error("Koneksi database terputus!");
     ```
  3. Submit form.
- **Hasil yang Ditunjukkan ke Mahasiswa:**
  - Tugas baru muncul seketika di daftar (0 milidetik latency) dengan status visual redup/pending.
  - Setelah server melempar error, React secara instan menghapus kembali tugas sementara tersebut dari layar (*rollback*) dan menampilkan notifikasi kegagalan tanpa menyebabkan layar putih (*no white screen of death*).

---

### EKSPERIMEN 3: Pembuktian Pertahanan Validasi Skema Zod

#### A. Uji Coba Peretasan Form Browser (*DOM Inspection Bypass Test*)
- **Tujuan:** Membuktikan kepada mahasiswa bahwa validasi HTML browser sangat rapuh dan validasi Zod di server adalah benteng sejati.
- **Langkah Eksperimen:**
  1. Pada form browser, klik kanan pada kotak input judul ➔ pilih **Inspect Element**.
  2. Di tab Elements DevTools, cari tag `<input name="title" ...>` dan hapus atribut `required` atau `minlength="3"` secara langsung.
  3. Masukkan hanya 1 karakter (misal: `"X"`) lalu klik tombol submit.
- **Hasil yang Ditunjukkan ke Mahasiswa:**
  - Browser tidak lagi mencegah form dikirim (validasi browser berhasil ditembus).
  - Namun seketika request mencapai server, method `TaskSchema.safeParse()` menangkap pelanggaran tersebut.
  - Form menerima respons `{ success: false, errors: { title: ["Judul tugas minimal harus 3 karakter"] } }`.
  - Teks error merah tetap muncul di bawah input.
  - **Kesimpulan untuk Mahasiswa:** *"Lihat! Pengguna bisa memanipulasi HTML browser sesuka hati lewat Inspect Element, tetapi mereka TIDAK BISA memanipulasi skema Zod di server kita."*

#### B. Uji Perbedaan Fatal: `TaskSchema.safeParse()` vs `TaskSchema.parse()`
- **Tujuan:** Menjelaskan mengapa kita melarang penggunaan `.parse()` pada Server Action.
- **Langkah Eksperimen:**
  1. Ubah sementara kode di `src/actions/tasks.ts` dari:
     ```typescript
     const validation = TaskSchema.safeParse(rawData);
     ```
     Menjadi:
     ```typescript
     const data = TaskSchema.parse(rawData); // ❌ Uji coba bahaya crash!
     ```
  2. Kirim form dengan data kosong.
- **Hasil yang Ditunjukkan ke Mahasiswa:**
  - Muncul layar merah crash *Unhandled Runtime Error: ZodError* (HTTP 500). Aplikasi terhenti.
  3. Kembalikan kode ke `TaskSchema.safeParse(rawData)`. Kirim form kosong lagi.
  - Aplikasi berjalan mulus, server tidak crash, dan pesan error tertata rapi di UI form.
  - **Kesimpulan untuk Mahasiswa:** *"Method `.parse()` melempar uncaught exception yang mematikan serverless runtime. Method `.safeParse()` mengembalikan objek terkontrol yang menjaga aplikasi tetap hidup."*

---

## 7. Socratic Q&A (Pertanyaan Uji Kritis untuk Mahasiswa di Kelas)

Lemparkan 4 pertanyaan ini ke mahasiswa untuk memicu diskusi kritis:

1. **Pertanyaan:** *"Apa yang terjadi jika kita lupa menambahkan `'use server'` di baris teratas file `src/actions/tasks.ts`?"*  
   **Jawaban Benar:** Next.js akan memperlakukan fungsi tersebut sebagai modul JavaScript client biasa. Jika di dalamnya terdapat kode akses database atau secret key, kode tersebut akan gagal dieksekusi atau bahkan membocorkan secret ke browser.

2. **Pertanyaan:** *"Mengapa kita menggunakan `TaskSchema.safeParse()`, bukan `TaskSchema.parse()`?"*  
   **Jawaban Benar:** Karena `.parse()` melempar exception (*throw error*) saat validasi gagal yang memicu HTTP 500 (crash). Sedangkan `.safeParse()` mengembalikan objek `{ success, error }` yang aman ditangani di alur kode biasa.

3. **Pertanyaan:** *"Apa fungsi posisi ke-3 pada hook `const [state, formAction, isPending] = useActionState(...)`?"*  
   **Jawaban Benar:** `isPending` adalah boolean reaktif dari React 19 yang bernilai `true` selama Server Action sedang dieksekusi di server, dan otomatis kembali `false` setelah selesai. Digunakan untuk indikator loading dan mengunci tombol.

4. **Pertanyaan:** *"Apakah validasi form di HTML (seperti atribut `required`) sudah cukup untuk mengamankan data aplikasi?"*  
   **Jawaban Benar:** Tidak cukup sama sekali. Atribut HTML mudah dihapus pengguna melalui Inspect Element atau di-bypass menggunakan tools seperti Postman dan cURL. Validasi server dengan Zod adalah pertahanan mutlak yang wajib ada.

---

*Dokumen Panduan Pengajaran ini disusun secara resmi untuk mendampingi modul perkuliahan The Serverless Odyssey — Pertemuan 3.*
