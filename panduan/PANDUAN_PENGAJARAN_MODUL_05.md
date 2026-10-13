# BUKU PANDUAN PENGAJAR (TEACHING GUIDE)
## KULIAH "THE SERVERLESS ODYSSEY" — MODUL 5
**Topik:** Arsitektur Autentikasi Serverless: Spektrum Model Autentikasi, Unified Multi-Provider Portal, Next.js 16 Proxy & PostgreSQL Triggers  
**Target Pembaca:** Dosen Pengampu / Instruktur Laboratorium  
**Alokasi Waktu:** 150 Menit (Tatap Muka Lab) + 180 Menit (Tugas Mandiri)  
**CPMK:** Mahasiswa mampu menganalisis 5 model autentikasi industri (ID Institusi, Email/Password, Social OAuth, Passwordless, Enterprise SSO), merancang *Unified Auth Portal* multi-provider, memproteksi rute privat via Next.js 16 Proxy (`src/proxy.ts`), serta mengotomasi sinkronisasi profil pengguna menggunakan PostgreSQL Triggers.

---

## 1. Rencana Alokasi Waktu Kuliah (150 Menit Tatap Muka)

| Durasi | Sesi | Agenda Pengajaran & Aktivitas Kelas |
| :---: | :--- | :--- |
| **00 - 15'** | **Apersepsi & Spektrum Autentikasi** | Membandingkan 5 model autentikasi di dunia nyata: ID Institusi (NIM/NIDN pada LMS kampus) vs Email/Password vs Social OAuth vs Passwordless vs Enterprise SSO. |
| **15 - 45'** | **Pendalaman Konsep Teori** | Membedah 4 Pilar: Stateless JWT (RFC 7519) vs Stateful RAM, Siklus 6 langkah Authorization Code Flow OAuth 2.0, Next.js 16 Proxy `src/proxy.ts` (`getUser()` vs `getSession()`), dan pemisahan `auth.users` vs `public.profiles`. |
| **45 - 65'** | **Simulasi Interaktif Visual** | Membuka tab "Konsep & Teori" pada platform dan menjalankan simulator interaktif (Arsitektur Autentikasi Institusional NIM/NIDN, JWT Lifecycle, OAuth Handshake, Proxy Interception & Matcher, Session Refresher, dan Auto Profile Trigger). |
| **65 - 100'** | **Praktek Lab: Dual-Track Delivery (Bertahap vs All-in-One)** | Mahasiswa memilih metode eksekusi: **Jalur Bertahap (5 Tahapan)** untuk pemahaman & pengujian mandiri per model autentikasi, atau **Jalur All-in-One** untuk perakitan cepat. Verifikasi checkpoint di setiap tahapan. |
| **100 - 125'** | **Live Auth Walkthrough & Verifikasi Sesi** | Dosen memandu setup GitHub OAuth App, menguji login 1-klik GitHub, menguji form Email/Password & Magic Link, serta memeriksa kuki sesi di DevTools. |
| **125 - 140'** | **Misi Snowballing Git** | Memandu mahasiswa membuat branch `feature/unified-multi-provider-auth`, mengecek 6 kriteria *Definition of Done* (DoD), dan melakukan commit git. |
| **140 - 150'** | **Evaluasi Tab 4 (Uji Pemahaman)** | Mengawasi mahasiswa mengerjakan 7 soal esai interaktif anti-cheat (Mastery Learning threshold $\ge 80$). |

---

## 1.1. Strategi Pembelajaran Dual-Track (Jalur Bertahap vs Jalur All-in-One)

Pada platform perkuliahan, tab **Lab & Prompt AI** dilengkapi dengan sakelar **Dual-Track Delivery** yang menyajikan dua metode eksekusi berdampingan:

### Jalur Bertahap (Step-by-Step — Rekomendasi Utama untuk Kelas)
Dirancang agar mahasiswa memahami secara mendalam setiap model autentikasi secara individual tanpa beban kognitif berlebih (*zero cognitive overload*). Setiap tahap bersifat modular dan dapat diuji langsung di peramban tanpa menimbulkan error kompilasi:
1. **Tahap 1: Fondasi Keamanan Proxy & Database Trigger Profil**
   - *Target:* `src/utils/supabase/middleware.ts`, `src/proxy.ts`, `supabase/migrations/02_auth_profiles_trigger.sql`, `src/app/(auth)/login/page.tsx`
   - *Checkpoint Browser:* Akses `http://localhost:3000/dashboard` ➔ Otomatis dialihkan ke `/login?next=%2Fdashboard` dengan pesan gateway aktif tanpa warning terminal `middleware.ts`.
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
Disediakan untuk mahasiswa dengan kemampuan cepat (*fast-track learners*) atau untuk referensi arsitektur komprehensif, merakit seluruh 7 berkas sistem autentikasi sekaligus dalam 1 prompt All-in-One.

---

## 2. Penjelasan Lengkap Tiap Sub-Materi (Teori Komprehensif, Analogi & Narasi Kelas)

### Pilar 1: Spektrum Model Autentikasi Modern & Arsitektur Stateless JWT (RFC 7519)

#### 1.1. Dekonstruksi 5 Model Autentikasi Industri & Framework Pengambilan Keputusan
- **Teori Komprehensif & Spesifikasi Teknis:**
  Dalam rekayasa perangkat lunak modern, autentikasi (*Authentication* — proses verifikasi dan pembuktian keabsahan identitas *"siapa Anda sebenarnya"*) adalah gerbang awal sebelum otorisasi (*Authorization* — proses penentuan hak akses dan izin komputasi *"apa saja yang boleh Anda lakukan"*). Seorang arsitek perangkat lunak tidak boleh asal memasang formulir login standar; arsitektur autentikasi harus dipilih secara cermat berdasarkan 3 pilar:
  - **Domain Kepercayaan (*Trust Domain*):** Batas lingkup perimeter jaringan atau sistem di mana seluruh entitas di dalamnya saling mempercayai otoritas keamanan yang sama (misal: jaringan intranet tertutup kampus vs rimba internet publik yang tanpa batas).
  - **Model Ancaman (*Threat Model*):** Analisis terstruktur untuk mengidentifikasi potensi jenis serangan siber, celah kerentanan, dan motif penyerang yang mungkin menargetkan aset aplikasi.
  - **Friksi Pengguna (*User Friction*):** Tingkat hambatan kognitif dan kerepotan teknis yang dialami pengguna saat mencoba masuk ke sistem (misalnya: panjangnya kolom form registrasi yang harus diisi, keharusan menghafal kata sandi rumit, atau lamanya menunggu tautan verifikasi email).
  
  Berdasarkan 3 pilar di atas, industri membedakan 5 model autentikasi:
  1. **Model 1: ID Institusi / Jaringan Tertutup (NIM Mahasiswa & NIDN Dosen):**
     - *Karakteristik:* Berlaku pada sistem akademik (SIAKAD) dan intranet kepegawaian institusi. Tidak mengizinkan pendaftaran mandiri publik (*self-registration*); seluruh akun dibuat terpusat oleh administrator kampus.
     - *Arsitektur Keamanan:* Menggunakan tabel database lokal terisolasi (`students`, `lecturers`), perlindungan kata sandi satu arah menggunakan algoritma hashing lambat anti-GPU seperti **Bcrypt dengan cost factor 10 salt rounds** (`bcrypt.hash(password, 10)` — parameter kekuatan komputasi di mana fungsi hashing diulang sebanyak $2^{10} = 1024$ putaran dengan *salt* acak unik, sengaja diperlambat agar peretas gagal melakukan serangan tebakan masif berbasis kartu grafis GPU), komparasi hash anti-*timing attack* (teknik komparasi waktu konstan / *constant-time comparison* agar peretas tidak bisa menebak kecocokan karakter per karakter dari selisih milidetik waktu respons server), serta kuki sesi `HttpOnly` bertanda tangan server. Menerapkan **Zero Third-Party Dependency** (kondisi di mana sistem autentikasi berjalan 100% mandiri secara lokal tanpa bergantung pada server, API, atau penyedia pihak ketiga di luar kampus).
  2. **Model 2: Kredensial Mandiri Publik (Email & Password):**
     - *Karakteristik:* Standar web B2C konvensional (E-Commerce). Pengguna mendaftarkan alamat email dan kata sandi mereka secara mandiri.
     - *Tantangan & Risiko:* Membawa beban liabilitas hukum penyimpanan kata sandi (**Password Liability** — beban tanggung jawab hukum, denda regulasi privasi data, dan risiko tuntutan hukum yang harus dipikul pemilik sistem jika database bocor dan kata sandi pengguna dicuri). Rentan terhadap:
       - *Credential Stuffing:* Serangan siber otomatis di mana peretas menggunakan jutaan kombinasi email & password curian dari situs web lain yang pernah bocor untuk mencoba membobol akun di aplikasi target, memanfaatkan kecerobohan umum pengguna yang menggunakan password yang sama untuk banyak situs web.
       - *Brute Force Attack:* Serangan tebakan sistematis secara membabi-buta dengan mencoba ribuan kombinasi kata sandi kamus populer hingga berhasil masuk.
       - *Rainbow Table Attack:* Metode pembalikan hash password menggunakan tabel pencarian raksasa yang berisi prapolasi jutaan pasangan teks dan nilai hash-nya (hanya dapat ditangkal jika hashing menggunakan teknik garam acak / *random salt*).
       Wajib menerapkan konfigurasi *Confirm Email* via SMTP server agar database tidak dibanjiri ribuan akun bot fiktif.
  3. **Model 3: Social OAuth 2.0 Federated Identity (GitHub Provider):**
     - *Karakteristik:* Standar emas aplikasi SaaS pengembang. Menerapkan **Federated Identity** (arsitektur identitas terfederasi di mana hak pembuktian identitas didelegasikan ke penyedia eksternal terpercaya seperti GitHub, sehingga pengguna tidak perlu membuat akun dan password baru).
     - *Keuntungan Arsitektural:* Konversi pendaftaran meningkat drastis 40–50% berkat onboarding 1-klik (**Zero Friction** — proses pendaftaran pengguna yang berjalan mulus tanpa hambatan kognitif sama sekali, tanpa perlu mengetik email, tanpa mengarang password baru, dan tanpa verifikasi captcha). Sistem mencapai status **Zero Password Liability** (aplikasi kita sama sekali tidak menyimpan maupun mengelola kata sandi pengguna; jika database kita diretas, peretas tidak akan menemukan satu pun password untuk dicuri). Otomatis memperoleh metadata asli (nama terverifikasi, email resmi, avatar GitHub).
  4. **Model 4: Passwordless Authentication (Email Magic Link / OTP WhatsApp):**
     - *Karakteristik:* Menghapus konsep kata sandi statis seumur hidup. Sistem menerbitkan **Time-Based Single-Use Token** (token kriptografis unik acak sekali pakai yang memiliki batas masa hidup otomatis ketat, misalnya 10–15 menit; setelah digunakan atau kedaluwarsa, token otomatis hangus dan tidak dapat dipakai lagi).
     - *Keuntungan:* Menghapus kelelahan mengingat kata sandi (**Password Fatigue** — sindrom kelelahan psikologis dan frustrasi pengguna akibat tuntutan harus mengingat puluhan kombinasi kata sandi rumit di berbagai aplikasi, yang biasanya memicu pengguna membuat password lemah seperti `123456`). Keamanan bergantung penuh pada integritas kepemilikan kotak masuk email pengguna.
  5. **Model 5: Enterprise Single Sign-On (SSO via SAML 2.0 / OIDC):**
     - *Karakteristik:* Standar korporasi multinasional menggunakan Identity Provider (IdP) terpusat (Okta, Azure Active Directory, Google Workspace).
     - *Keuntungan:* Mendukung **Just-In-Time (JIT) Provisioning** (mekanisme otomatisasi di mana baris akun dan hak akses pengguna baru langsung dibuatkan di database aplikasi secara instan tepat saat pengguna pertama kali berhasil login lewat SSO perusahaan, tanpa perlu dibuat manual oleh admin IT sebelumnya) dan **Instant Access Revocation** (kemampuan mencabut seluruh hak akses pengguna ke puluhan aplikasi internal seketika hanya dengan 1 kali klik nonaktif di konsol pusat ketika seorang karyawan diberhentikan).
- **Analogi Dunia Nyata (Storytelling Pedagogis):**
  - *Model 1 (NIM/NIDN):* Seperti **"Kartu Tanda Mahasiswa (KTM) Berbarcode Kampus"** — Hanya pos satpam kampus yang memegang master list mahasiswa. Orang luar tidak bisa masuk ke ruang kelas menggunakan kartu member bioskop.
  - *Model 2 (Email/Pass):* Seperti **"Kunci Gembok Rumah Tradisional"** — Penghuni membuat sendiri anak kuncinya. Jika penghuni ceroboh membuat anak kunci yang sama persis untuk rumah, brankas, dan sepedanya, pencuri yang menemukan satu kunci bisa membuka seluruh aset.
  - *Model 3 (GitHub OAuth):* Seperti **"Lencana Tamu VIP Bersegel Kedutaan Besar"** — Resepsionis hotel tidak perlu menyuruh tamu membuat kunci baru; cukup percaya penuh pada stempel sah kedutaan. Hotel tidur nyenyak karena tidak memegang tanggung jawab menyimpan kunci tamu (*Zero Liability*).
  - *Model 4 (Magic Link):* Seperti **"Surat Bersegel Lilin yang Dikirimkan Langsung ke Kotak Pos Pribadi Bergembok"** — Siapapun yang memegang kunci kotak pos di halaman rumah dan membuka surat berstempel tersebut terbukti sah sebagai pemilik rumah.
  - *Model 5 (Enterprise SSO):* Seperti **"Master Keycard Gedung Pencakar Langit Satu Pintu"** — Sekali tap membuka gerbang lobi, lift lantai 50, dan ruang arsip. Begitu kartu dinonaktifkan di resepsionis pusat, semua pintu terkunci serentak.
- **Skrip Narasi Dosen di Kelas:**
  *"Jangan pernah berpikir membuat login itu cuma perkara text input email dan password! Di industri nyata, pilihan model autentikasi adalah keputusan arsitektur strategis antara konversi bisnis dan tanggung jawab hukum keamanan data. Buka simulator 'Arsitektur Autentikasi Institusional NIM & NIDN' di Tab Konsep untuk melihat bagaimana kampus kita memvalidasi akun Anda tanpa bergantung pada server luar!"*
- **Visualizer Terkait:** [NimAuthArchitectureSimulator](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/components/visualizers/nim-auth-architecture-simulator.tsx) (Tab Konsep), [SupabaseAuthConfigSimulator](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/components/visualizers/supabase-auth-config-simulator.tsx) (Tab Lab).

---

#### 1.2. Stateful Session Memory vs Stateless JWT (RFC 7519) dalam Komputasi Serverless
- **Teori Komprehensif & Spesifikasi Teknis:**
  - *Dilema Komputasi Serverless:* Pada arsitektur monolith lama (Express.js, Laravel, Django), sesi bersifat **Stateful** (server mengingat status pengguna di memori internalnya). Saat pengguna login, server mencatat Session ID acak di memori RAM server atau kluster Redis, lalu mengirimkan ID tersebut ke cookie browser. Setiap request berikutnya, server mencocokkan Session ID dengan isi RAM.
  - *Mengapa Stateful Gagal di Serverless?* Serverless Function (Vercel Edge/Serverless) menerapkan paradigma:
    - **Scale-to-Zero:** Karakteristik elastis komputasi serverless di mana alokasi server/kontainer otomatis dimatikan menjadi 0 instance ketika tidak ada lalu lintas trafik masuk untuk menghemat biaya operasional.
    - **Cold Starts:** Latensi jeda waktu (sekitar 100–300 ms) yang dibutuhkan oleh penyedia cloud untuk menyalakan dan menginisialisasi kontainer serverless baru dari kondisi mati saat ada request masuk pertama kali.
    - **No Shared In-Memory State (Tiadanya Memori Bersama):** Setiap instance fungsi serverless berjalan terisolasi di kontainernya sendiri tanpa RAM bersama. Jika Request 1 mendarat di Serverless Function A (di region Singapura) dan Request 2 mendarat di Function B (di region Tokyo), Function B tidak memiliki akses ke memori RAM Function A.
    - **Connection Exhaustion:** Kondisi di mana kuota batas maksimal koneksi konkuren ke database PostgreSQL habis terpakai akibat lonjakan ratusan fungsi serverless yang membuka koneksi bersamaan jika setiap request harus kueri database hanya untuk memvalidasi sesi.
  - *Solusi Stateless JWT (RFC 7519):* JSON Web Token memindahkan beban penyimpanan dari RAM server ke token mandiri (*self-contained*) yang dibawa oleh klien. JWT terdiri dari 3 bagian yang dipisahkan tanda titik (`.`):
    1. **Header (Algoritma & Tipe):** Berisi metadata kriptografi, misal `{"alg": "HS256", "typ": "JWT"}` yang di-encode menggunakan Base64Url.
    2. **Payload (Data Klaim Identitas):** Berisi klaim identitas pengguna seperti `sub` (Subject / User UUID), `email`, `role`, dan waktu kedaluwarsa `exp` yang di-encode menggunakan Base64Url.
    3. **Signature (Tanda Tangan Kriptografis):** Dihasilkan dari rumus `HMAC-SHA256(Base64Url(Header) + "." + Base64Url(Payload), SECRET_KEY)`.
  - *Kekebalan Tamper-Proof (Kebal Manipulasi):* Karakteristik keamanan di mana setiap perubahan sekecil apapun pada isi data payload (misal hacker mengubah `"role": "student"` menjadi `"role": "admin"`) akan otomatis merusak validitas tanda tangan kriptografis token saat dihitung ulang, sehingga token seketika ditolak server. Serverless function manapun di seluruh dunia dapat memvalidasi keaslian token hanya dengan menghitung ulang signature dalam hitungan mikrodetik tanpa kueri database!
- **Analogi Dunia Nyata (Storytelling Pedagogis):**
  - *Stateful Session:* Seperti **"Karcis Penitipan Jaket di Restoran Mewah"**. Pelayan memberi Anda nomor karcis "77". Jaket Anda digantung di lemari restoran. Jika Anda pindah ke cabang restoran lain di seberang kota, karcis "77" tidak berguna karena cabang itu tidak punya lemari jaket Anda! Restoran lama harus menelepon cabang baru, atau membangun gudang sentral raksasa yang mahal.
  - *Stateless JWT:* Seperti **"Paspor Resmi Diplomatik dengan Cap Air Kriptografis & Hologram"**. Di paspor Anda, semua data diri (nama, foto, tanggal kedaluwarsa) tercetak transparan (Payload). Di bagian bawah ada hologram timbul dan tanda tangan pejabat tinggi yang sah (Signature). Petugas imigrasi di bandara manapun di seluruh dunia (serverless function manapun yang baru booting dari scale-to-zero) cukup memeriksa keaslian stempelnya dengan lampu sinar UV (verifikasi signature). Petugas TIDAK PERLU menelepon kantor presiden negara asal Anda setiap kali Anda melangkah melewati pintu gerbang!
- **Skrip Narasi Dosen di Kelas:**
  *"Ingat konsep penting ini: JWT bukan brankas rahasia tempat menyembunyikan data sensitif, melainkan sebuah dokumen berstempel resmi yang anti-pemalsuan! Serverless function kita bisa memeriksa paspor mahasiswa kapanpun dan dimanapun tanpa membebani database PostgreSQL kita!"*
- **Visualizer Terkait:** [JwtLifecycleAnimator](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/components/visualizers/jwt-lifecycle-animator.tsx) (Tab Konsep).

---

#### 1.3. Pola Desain Hibrida: Unified Auth Portal
- **Teori Komprehensif & Spesifikasi Teknis:**
  Dalam standar desain antarmuka industri (seperti Supabase Studio, Vercel, Linear), formulir login tidak boleh memaksa satu jalur tunggal. *Unified Auth Portal* menggabungkan:
  1. *Primary Action:* Tombol 1-Click Social OAuth (GitHub) di posisi teratas dengan visual paling mencolok untuk memfasilitasi mayoritas pengguna teknis.
  2. *Secondary Options:* Tab switcher adaptif di bagian bawah yang memisahkan form *Email & Password* (dengan penanganan status registrasi vs login) dan form *Magic Link* (dengan input email instan tanpa password).
  Semua metode ini bermuara ke *Auth Engine* yang sama dan diamankan oleh gerbang *Reverse Proxy* yang identik.
- **Analogi Dunia Nyata (Storytelling Pedagogis):**
  Seperti **"Lobi Gedung Bandara Internasional Terpadu"**: Di lobi utama disediakan pintu putar express berpemindai wajah (Social OAuth 1-klik) untuk penumpang yang ingin serba cepat, dan disediakan pula loket tiket manual konvensional (Email/Password) serta mesin tiket mandiri kode booking (Magic Link) untuk penumpang dengan preferensi lain. Semuanya tetap menuju pintu boarding pesawat yang sama!
- **Skrip Narasi Dosen di Kelas:**
  *"Jangan bikin user bingung mencari tombol login. Satukan semua pintu masuk di satu portal elegan, sediakan jalur ekspres di atas dan jalur kredensial di bawah!"*

---

### Pilar 2: Protokol OAuth 2.0 Authorization Code Flow & Passwordless

#### 2.1. Alur 6 Langkah Authorization Code Grant (RFC 6749)
- **Teori Komprehensif & Spesifikasi Teknis:**
  - *Mengapa Bukan Implicit Flow?* Di masa lalu, OAuth menyediakan *Implicit Grant* (model otorisasi langsung di mana Identity Provider langsung melemparkan access token ke browser dalam hash URL `#access_token=xyz`). Pola ini kini **diharamkan secara resmi oleh IETF OAuth Security Best Current Practice** karena token terpapar secara telanjang di riwayat peramban (*browser history*), header `Referer`, dan rentan disedot oleh skrip jahat atau ekstensi browser.
  - *Mekanisme 2-Tahap Authorization Code Flow:*
    1. **Langkah 1 (User Consent Request):** Pengguna mengklik "Masuk dengan GitHub". Browser dialihkan ke endpoint otorisasi dengan membawa parameter `client_id`, `redirect_uri`, dan **Scopes** (lingkup izin spesifik yang diminta aplikasi kepada pengguna di GitHub, misal `read:user` untuk membaca data profil dasar dan `user:email` untuk membaca alamat email terverifikasi).
    2. **Langkah 2 (Pengesahan Identitas):** Pengguna login ke akun GitHub mereka dan menyetujui izin akses (*Grant Access*).
    3. **Langkah 3 (Penerbitan Kode Sementara):** GitHub mengalihkan peramban kembali ke rute callback aplikasi kita: `http://localhost:3000/auth/callback?code=AUTH_CODE_SEMENTARA`. Kode ini bersifat:
       - Berumur sangat pendek (hanya aktif 5–10 menit).
       - Sekali pakai (*Single-use* / otomatis hangus setelah ditukarkan 1 kali).
       - Tidak dapat digunakan sendiri tanpa rahasia server (*Client Secret*).
    4. **Langkah 4 (Pertukaran Server-to-Server via Backchannel):** Next.js Route Handler di `src/app/auth/callback/route.ts` mengekstrak parameter `code`, lalu memanggil API Supabase/GitHub melalui **Backchannel Communication** (saluran komunikasi privat terenkripsi HTTPS antar-server secara langsung, tanpa pernah melewati peramban pengguna publik): `supabase.auth.exchangeCodeForSession(code)`.
    5. **Langkah 5 (Verifikasi Kriptografis Backend):** Server GitHub memvalidasi authorization code dan rahasia aplikasi (**Client Secret** — string kunci rahasia milik aplikasi yang tersimpan aman di server dan tidak boleh bocor ke publik). Jika valid, GitHub menyerahkan data token akses dan informasi profil ke Supabase GoTrue Engine.
    6. **Langkah 6 (Pembentukan Sesi Aman):** Supabase GoTrue menerbitkan token sesi JWT baru, membungkusnya ke dalam kuki `HttpOnly`, dan Route Handler mengarahkan browser pengguna ke `/dashboard`.
  - *Keuntungan Keamanan Mutlak:* `client_secret` disimpan aman di environment variable server (`.env.local`) dan TIDAK PERNAH terkirim ke browser. Token akses berpindah tangan hanya melalui saluran komunikasi privat server-to-server, terisolasi total dari peramban publik.
- **Analogi Dunia Nyata (Storytelling Pedagogis):**
  - **"Kupon Klaim Emas Batangan vs Emas Asli di Trotoar Jalan Raya"**:
    - Bayangkan hadiah emas murni 1 kg (Access Token). Bank Sentral (GitHub) TIDAK AKAN PERNAH melemparkan emas batangan tersebut langsung di trotoar jalan raya yang dipadati orang asing (URL bar peramban publik).
    - Bank Sentral hanya menyerahkan selembar **Karcis Klaim Sementara bernomor acak** (Authorization Code) berumur 5 menit kepada Anda.
    - Anda membawa karcis tersebut ke kantor cabang resmi Anda yang dijaga satpam berbrankas besi (Backend Route Handler `/auth/callback`).
    - Kantor cabang Anda kemudian menelpon Bank Sentral melalui jalur telepon rahasia berkode sandi khusus (Client Secret) untuk menukarkan karcis tersebut dengan emas batangan aslinya.
    - Jika ada copet di trotoar yang sempat memfoto nomor karcis klaim Anda, foto itu sama sekali tidak berguna bagi si copet, karena si copet tidak memiliki kode sandi telepon rahasia kantor cabang Anda!
- **Skrip Narasi Dosen di Kelas:**
  *"Lihat indahnya arsitektur OAuth 2.0 ini! Mahasiswa sering bertanya: 'Kenapa mutar-mutar pakai code dulu, kenapa tidak langsung kirim token?' Jawabannya: karena browser adalah rimba liar penuh ekstensi browser dan virus. Token asli hanya boleh melintas di jalur tertutup antar-server!"*
- **Visualizer Terkait:** [OauthFlowAnimator](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/components/visualizers/oauth-flow-animator.tsx) (Tab Konsep), [GithubOauthSetupSimulator](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/components/visualizers/github-oauth-setup-simulator.tsx) (Tab Lab).

---

#### 2.2. Mekanisme Passwordless: Email Magic Link & OTP
- **Teori Komprehensif & Spesifikasi Teknis:**
  Pengguna memasukkan email tanpa password. Server GoTrue membuat token kriptografis acak (nonce) berumur 15 menit, mencatat hash-nya di database, dan mengirimkan link verifikasi via SMTP. Ketika link diklik, endpoint `/auth/callback` memverifikasi token dan menerbitkan sesi resmi.
- **Analogi Dunia Nyata (Storytelling Pedagogis):**
  Seperti **"Kunci Hotel Sekali Pakai via QR Code Smartphone"**: Hotel tidak memberi kunci kuningan yang bisa diduplikasi tukang kunci; hotel mengirim kode QR sekali scan yang otomatis rusak begitu pintu kamar terbuka satu kali.
- **Visualizer Terkait:** [MagicLinkAnimator](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/components/visualizers/magic-link-animator.tsx) (Tab Konsep), [MagicLinkInboxSimulator](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/components/visualizers/magic-link-inbox-simulator.tsx) (Tab Lab).

---

### Pilar 3: Proteksi Rute di Next.js 16 (Arsitektur Proxy & Session Sync)

#### 3.1. Evolusi Resmi: Depresiasi `middleware.ts` ➔ Konvensi `src/proxy.ts` (Network Boundary)
- **Teori Komprehensif & Spesifikasi Teknis:**
  - *Alasan Depresiasi:* Pada versi Next.js sebelumnya, developer mengira `middleware.ts` adalah rantai middleware bergaya Express.js yang bisa memanipulasi request body atau berjalan bertingkat. Di Next.js 16, konvensi berkas `middleware.ts` resmi **didepresiasi** (menghasilkan deprecation warning pada build) dan distandarisasi menjadi `src/proxy.ts` dengan ekspor fungsi `export async function proxy(request: NextRequest)`.
  - *Peran Arsitektural Network Boundary (Batas Jaringan Terluar):* Berfungsi sebagai **Reverse Proxy** (komponen jaringan terdepan yang menerima seluruh permintaan dari internet publik dan memfilternya sebelum diteruskan ke server aplikasi internal). Berjalan pada **Node.js runtime bawaan**, memungkinkan eksekusi modul-modul Node.js standar (kriptografi, DNS resolving), dan mencegat setiap request HTTP sebelum request tersebut menyentuh layout atau Server Component.
  - *Regex Route Matcher:* Pola ekspresi reguler `config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'] }` yang bertugas menyaring rute URL: hanya rute aplikasi yang diproses, sementara aset statis (gambar, font, css) dilewatkan langsung tanpa beban eksekusi proxy.
  - *Zero Flash of Unauthenticated Content (FOUC):* Jaminan arsitektural di mana konten rahasia halaman privat tidak akan pernah sempat berkedip sedetik pun di layar pengguna yang belum login, karena proxy memblokir request di level transport HTTP sebelum HTML sempat dirender.
- **Analogi Dunia Nyata (Storytelling Pedagogis):**
  - **"Satpam Pos Gerbang Utama Kompleks Perumahan Mewah"**:
    - Sebelum mobil tamu (Request HTTP) diizinkan melintasi jalan kompleks dan mengetuk pintu rumah mewah (React Server Components), satpam di pos gerbang luar (`src/proxy.ts`) menghentikan mobil untuk memeriksa kartu pass.
    - Jika tamu tidak punya kartu pass atau tujuannya ke area privat, satpam langsung memutarbalikkan mobil tamu ke pos pendaftaran tamu di luar gerbang (Redirect 307 ke `/login`).
    - Tuan rumah di dalam rumah mewah tidak perlu repot-repot keluar kamar atau mengunci pintu lemari berharga; satpam gerbang luar sudah menepis penyusup sejak awal (**Zero Compute Waste** di Server Components).
- **Skrip Narasi Dosen di Kelas:**
  *"Jangan biarkan halaman dashboard Anda menghabiskan kuota database mengecek user yang belum login. Hadang mereka di gerbang paling depan menggunakan Next.js 16 Proxy!"*
- **Visualizer Terkait:** [MiddlewareInterceptionAnimator](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/components/visualizers/middleware-interception-animator.tsx) & [RouteProtectionMatrixAnimator](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/components/visualizers/route-protection-matrix-animator.tsx) (Tab Konsep).

---

#### 3.2. Bahaya Fatal `getSession()` (Anti-Pattern) vs Keharusan Mutlak `getUser()` (Standar Industri)
- **Teori Komprehensif & Spesifikasi Teknis:**
  - *Kesalahan Klasik Developer:* Banyak tutorial usang menggunakan `supabase.auth.getSession()` di middleware/proxy karena mengira kinerjanya lebih cepat.
  - *Celah Keamanan Fatal `getSession()`:* Fungsi ini hanya mendekode string token yang ada di cookie lokal browser laptop pengguna **secara pasif tanpa menghubungi auth server Supabase**. Jika token belum melewati masa kedaluwarsa waktu lokal laptopnya, `getSession()` menganggap pengguna valid 100%! Bayangkan jika seorang admin telah memecat karyawan tersebut, membekukan akunnya (*banned*), atau pengguna mengganti password di perangkat lain 1 menit lalu. Dengan `getSession()`, mantan karyawan tersebut masih bebas masuk ke dashboard rahasia perusahaan!
  - *Standar Industri `getUser()`:* Mengirimkan request otentikasi jaringan langsung ke auth server Supabase (`/auth/v1/user`). Auth server memeriksa status integritas akun secara real-time di database: apakah akun aktif, belum di-banned, dan secret key belum di-revoke. Jika akun tidak valid, `getUser()` mengembalikan error dan proxy langsung menendang pengguna ke `/login`.
- **Analogi Dunia Nyata (Storytelling Pedagogis):**
  - *Anti-Pattern `getSession()`:* Seperti satpam gedung yang **hanya melirik foto usang di kartu ID plastik karyawan**. Karyawan tersebut sebenarnya sudah dipecat kemarin sore oleh direktur HRD, tetapi karena kartu plastiknya masih ada di sakunya, satpam tetap membukakan pintu gedung!
  - *Best Practice `getUser()`:* Seperti satpam modern yang **melakukan tap barcode kartu ID ke mesin scanner online HRD**. Begitu kartu di-tap, layar scanner seketika berbunyi merah nyaring: *"Akses Ditolak: Karyawan telah dinonaktifkan!"*. Karyawan seketika digiring keluar oleh petugas keamanan.
- **Skrip Narasi Dosen di Kelas:**
  *"Ingat aturan emas keamanan serverless: Jangan pernah percaya kuki lokal laptop user! Selalu panggil getUser() agar database pusat yang menentukan hidup-matinya sebuah sesi!"*
- **Visualizer Terkait:** [SessionRefresherAnimator](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/components/visualizers/session-refresher-animator.tsx) (Tab Konsep).

---

#### 3.3. Sinkronisasi Kuki Ganda (Dual-Cookie Synchronization pada Helper `updateSession`)
- **Teori Komprehensif & Spesifikasi Teknis:**
  - *Sifat Immutable NextRequest:* Di Next.js App Router, objek `NextRequest` yang masuk ke proxy bersifat *immutable* (kebal dari modifikasi langsung di tempat).
  - *Token Rotation (Rotasi Token):* Mekanisme keamanan di mana setiap kali refresh token digunakan untuk memperpanjang sesi pengguna, sistem otomatis menerbitkan refresh token baru dan mematikan refresh token yang lama untuk mencegah serangan pembajakan sesi berulang (*replay attack*).
  - *Session Desynchronization (Session Desync):* Kondisi anomali di mana token sesi di peramban klien tidak sinkron dengan token sesi yang dibaca oleh Server Component di backend, menyebabkan pengguna tiba-tiba terlempar keluar dari sesi (*logout misterius*).
  - *Kebutuhan Salin Dua Arah:*
    1. **Salin ke `request.cookies`:** Dibutuhkan agar Server Component (RSC) atau Server Actions yang akan dieksekusi **tepat setelah** proxy selesai langsung menerima token sesi yang sudah ter-refresh (mencegah RSC membaca token basi).
    2. **Salin ke `response.cookies`:** Dibutuhkan agar header HTTP `Set-Cookie` tersemat pada objek respons yang dikirim kembali ke browser klien, sehingga peramban pengguna menyimpan token baru tersebut di disk lokal untuk request selanjutnya.
  Jika salah satu terlewat, sesi akan mengalami desinkronisasi (*session desync*) dan user akan tiba-tiba ter-logout sendiri secara acak.
- **Analogi Dunia Nyata (Storytelling Pedagogis):**
  - **"Kasir Loket Bioskop yang Menyerahkan Tiket Terbarukan Sekaligus ke Dua Orang"**:
    - Ketika tiket film Anda di-upgrade menjadi tiket VIP di loket pintu depan, kasir harus menyerahkan satu lembar tiket baru ke dompet Anda (`response.cookies` untuk Anda simpan saat keluar), SEKALIGUS menyerahkan selembar salinan tiket baru itu ke petugas pintu teater yang berdiri tepat di samping kasir (`request.cookies` untuk Anda tonton filmnya detik ini juga). Jika kasir lupa memberikan ke salah satu pihak, Anda akan ditahan oleh petugas teater karena tiket Anda dianggap belum di-upgrade!
- **Visualizer Terkait:** [ServerSessionReaderAnimator](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/components/visualizers/server-session-reader-animator.tsx) & [AuthActionsFlowAnimator](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/components/visualizers/auth-actions-flow-animator.tsx) (Tab Konsep).

---

### Pilar 4: Sinkronisasi Profil Pengguna & Database Triggers

#### 4.1. Pemisahan Skema Database: `auth.users` vs `public.profiles`
- **Teori Komprehensif & Spesifikasi Teknis:**
  - *Isolasi Sistem Supabase GoTrue:* Supabase menyimpan kredensial inti akun (email, password hash, identities OAuth) di dalam skema privat terisolasi: `auth.users` (dikelola oleh GoTrue — mesin autentikasi open-source berbasis Go yang mengatur siklus akun Supabase). Developer dilarang keras menambahkan kolom kustom (seperti `avatar_url`, `bio`, `role`, `reputasi`) ke tabel `auth.users` karena dapat merusak migrasi internal engine saat update versi.
  - *Pemisahan Skema Aplikasi:* Seluruh data domain aplikasi wajib dibuat di skema publik: `public.profiles`. Hubungan keduanya diikat secara relasional menggunakan Foreign Key:
    ```sql
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
    ```
    Aturan `ON DELETE CASCADE` (penghapusan bertingkat otomatis) menjamin bahwa jika suatu saat akun pengguna dihapus dari sistem auth, seluruh baris profil pengguna di tabel aplikasi otomatis terhapus bersih tanpa meninggalkan sampah relasi (*orphan record*).
- **Analogi Dunia Nyata (Storytelling Pedagogis):**
  - **"Buku Paspor Resmi Negara (`auth.users`) vs Kartu Member Klub Kebugaran / Gym (`public.profiles`)"**:
    - Anda tidak boleh mencorat-coret buku paspor resmi negara dengan stempel poin diskon gym atau catatan berat badan Anda! Buku paspor adalah milik negara dan dikelola oleh Kementerian Imigrasi. Manajemen gym Anda hanya boleh membuat kartu keanggotaan sendiri yang mencatat nomor paspor Anda sebagai referensi identitas resmi.
- **Visualizer Terkait:** [AuthUsersVsProfilesAnimator](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/components/visualizers/auth-users-vs-profiles-animator.tsx) (Tab Konsep).

---

#### 4.2. Otomasi PostgreSQL Trigger `AFTER INSERT ON auth.users` (Jaminan ACID Atomicity)
- **Teori Komprehensif & Spesifikasi Teknis:**
  - *Kelemahan Fatal Pembuatan Profil di JavaScript (Client / Server Actions):*
    Jika pembuatan baris profil di tabel `public.profiles` ditulis di kode aplikasi web (misal di Route Handler callback atau Server Action):
    1. **Kegagalan Partisi Jaringan (*Network Split / Partition*):** Terputusnya koneksi internet secara tiba-tiba antara klien dan server cloud di tengah proses transaksi. Ketika pengguna login via GitHub, akun berhasil dibuat di `auth.users`, tetapi saat browser pengguna dialihkan kembali ke web, koneksi internet pengguna tiba-tiba terputus sebelum request `supabase.from('profiles').insert()` terkirim. Akibatnya: Akun terdaftar di database auth, tetapi tidak memiliki profil di database aplikasi! Terjadilah **Orphaned User Anomaly** (anomali pengguna yatim — kondisi di mana akun ada di sistem auth tetapi tidak memiliki profil aplikasi sehingga dashboard mengalami *runtime error null pointer*).
    2. **Pintu Masuk Jamak (*Multiple Ingress Points*):** Akun baru bisa dibuat lewat banyak pintu masuk: Social OAuth GitHub, Email SignUp, Magic Link, atau dibuat langsung oleh admin di Supabase Studio. Jika mengandalkan JavaScript, developer harus menulis kode create profile di 4 tempat berbeda.
  - *Solusi Kernel PostgreSQL Trigger PL/pgSQL:*
    Dengan membuat trigger database:
    ```sql
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    ```
    Eksekusi pembuatan profil berpindah ke **level kernel engine PostgreSQL**. Trigger ini berjalan dalam satu transaksi **ACID Atomicity** (prinsip basis data di mana seluruh operasi dianggap sebagai satu kesatuan tunggal yang utuh: semuanya berhasil 100% atau semuanya dibatalkan 0%, tanpa pernah terjadi status setengah jalan). Apapun pintu pendaftarannya, dan sekalipun koneksi internet peramban mati total tepat setelah autentikasi, PostgreSQL menjamin profil pasti tercipta secara atomik 100%!
- **Analogi Dunia Nyata (Storytelling Pedagogis):**
  - **"Pintu Putar Otomatis Masuk Bank dengan Sensor Mekanis Lantai"**:
    - Ketika seorang nasabah baru melangkahkan kaki melewati pintu putar masuk bank (`INSERT ON auth.users`), sensor mekanis di bawah ubin seketika memicu mesin printer di meja resepsionis untuk mencetak map berkas nasabah baru (`INSERT INTO public.profiles`).
    - Hal ini terjadi secara mekanis dan otomatis oleh konstruksi gedung (kernel database).
    - Jika kita mengandalkan satpam manusia (kode JavaScript) yang berdiri di lobi untuk membuat map berkas tersebut secara manual, bagaimana jika satpam pingsan, mengantuk, atau sedang ke toilet saat nasabah baru masuk? Nasabah akan masuk ke ruang bank tanpa map berkas!
- **Visualizer Terkait:** [AutoProfileTriggerAnimator](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/components/visualizers/auto-profile-trigger-animator.tsx) (Tab Konsep), [SupabaseSqlEditorSimulator](file:///home/hadiq/Documents/0-workDir/0-TriDharma/kuliah/serverlessApi/serverless-api-course/src/components/visualizers/supabase-sql-editor-simulator.tsx) (Tab Lab).

---

### Pilar 5: Pertahanan Keamanan Sesi: Kuki HttpOnly vs LocalStorage (XSS Attack Immunity)
- **Teori Komprehensif & Spesifikasi Teknis:**
  Banyak pengembang pemula menyimpan token autentikasi di `localStorage` peramban karena mudah diakses. Data di `localStorage` dapat dibaca secara bebas oleh kode JavaScript apapun yang sedang berjalan di halaman melalui API `window.localStorage.getItem()`. Jika aplikasi Anda menggunakan library npm pihak ketiga yang memiliki celah keamanan, atau website terkena serangan **Cross-Site Scripting (XSS)** (serangan peretasan di mana penyerang berhasil menyuntikkan script JavaScript berbahaya ke dalam halaman web yang dilihat oleh pengguna lain), script jahat dapat mencuri token dan mengirimkannya ke server peretas dalam 1 baris kode saja. Sebaliknya, kuki bertanda **HttpOnly** diamankan langsung oleh mesin peramban (*browser engine*): JavaScript di dalam halaman web dilarang keras membaca atau mengakses kuki ini (`document.cookie` tidak menampilkan kuki HttpOnly). Kuki hanya dikirimkan secara otomatis oleh browser melalui header HTTP saat request dikirimkan ke server.
- **Analogi Dunia Nyata (Storytelling Pedagogis):**
  - **"Kunci Brankas di Atas Meja Ruang Tamu (LocalStorage) vs Kunci di Dalam Tabung Pneumatik Tertutup Bawah Tanah (HttpOnly Cookie)"**:
    - Menaruh token di `localStorage` seperti menaruh kunci brankas di atas meja kopi ruang tamu. Tamu manapun yang Anda undang masuk (termasuk paket dependensi npm liar yang disusupi malware) bisa melihat, memotret, dan menduplikasi kunci tersebut saat Anda lengah.
    - Menaruh token di kuki `HttpOnly` seperti menaruh kunci di dalam tabung kapsul pneumatik bawah tanah yang tertanam di dinding fondasi. Siapapun yang bertamu di ruang tamu tidak memiliki mata atau tangan untuk melihat dan menyentuh tabung tersebut; hanya kurir resmi dari luar rumah yang bisa mengaksesnya!
- **Visualizer Terkait:** Protokol Eksperimen 4 di kelas (`document.cookie` inspection).

---

### 2.5. Tabel Matriks Analogi Cepat Dosen (Master Teaching Analogy Matrix)

Gunakan tabel intisari ini sebagai contekan cepat (*cheat-sheet*) saat berdiri di depan kelas untuk memantik pemahaman visual mahasiswa:

| No | Konsep Teknis Rumit | Masalah yang Dipecahkan | Analogi Dunia Nyata (Storytelling) | Nilai Filosofis & Arsitektural |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **Stateful Session vs Stateless JWT** | Serverless *scale-to-zero* kehilangan memori RAM bersama antar-eksekusi | **Karcis Penitipan Jaket Restoran vs Paspor Diplomatik Berstempel Hologram** | Verifikasi matematis lokal mandiri tanpa membebani database sentral. |
| **2** | **OAuth 2.0 Auth Code Flow** | Token rahasia tidak boleh terekspos di URL bar peramban publik | **Kupon Klaim Sementara di Jalan vs Pengambilan Emas di Kantor Cabang Berbrankas** | Jalur publik hanya membawa kupon hangus; token asli ditukar server-to-server. |
| **3** | **Next.js 16 Proxy (`src/proxy.ts`)** | Server Component menghabiskan komputasi merender data untuk tamu liar | **Pos Satpam Pintu Gerbang Luar Kompleks Perumahan Mewah** | Memutarbalikkan penyusup sebelum mereka sempat mengetuk pintu rumah (*Zero Compute Waste*). |
| **4** | **`getSession()` vs `getUser()`** | Kuki laptop masih ada padahal akun sudah di-banned admin 5 menit lalu | **Satpam Melihat Foto Kartu ID Plastik vs Satpam Men-scan Barcode ke Server HRD** | Jangan percaya kuki offline; database pusat yang menentukan keabsahan sesi. |
| **5** | **Dual-Cookie Sync (`updateSession`)** | Server Component membaca token basi saat token baru di-refresh | **Kasir Bioskop Memberi Tiket Baru ke Dompet Penonton Sekaligus ke Satpam Pintu Studio** | Menjaga sinkronisasi antara peramban klien dan runtime Server Component. |
| **6** | **Pemisahan `auth.users` vs `public.profiles`** | Mencegah kerusakan skema internal auth engine saat penambahan field kustom | **Buku Paspor Resmi Negara vs Kartu Anggota Klub Kebugaran Gym** | Identitas inti dikelola negara/engine; data aplikasi dikelola domain sendiri. |
| **7** | **PostgreSQL Triggers (`on_auth_user_created`)** | Profil gagal terbuat jika browser putus koneksi saat redirect OAuth | **Sensor Lantai Mekanis Pintu Putar Bank yang Otomatis Mencetak Berkas Nasabah** | Menjamin integritas ACID atomik 100% di tingkat kernel database. |
| **8** | **Kuki HttpOnly vs LocalStorage** | Serangan XSS mencuri token pengguna via JavaScript injection | **Kunci Brankas di Meja Tamu vs Kunci di Dalam Tabung Tertanam Bawah Tanah** | Menghilangkan kemampuan JavaScript untuk menyentuh token sesi. |

---

### 2.6. Glosarium Pedagogis Istilah Kunci (Key Technical Terms & Definitions)

Glosarium ini menyajikan definisi resmi, padanan bahasa, dan konteks penggunaan untuk seluruh istilah teknis yang diajarkan pada Modul 5 agar tidak ada kerancuan istilah bagi mahasiswa:

#### A. Istilah Model Autentikasi & Pengalaman Pengguna (UX & Identity)
1. **Authentication (Autentikasi):** Proses verifikasi teknis untuk membuktikan kebenaran identitas pengguna (*"Siapa Anda?"*), misalnya dengan memeriksa kecocokan email dan kata sandi atau token biometrik.
2. **Authorization (Otorisasi):** Proses evaluasi hak akses untuk menentukan tindakan atau sumber daya apa saja yang diizinkan untuk diakses oleh pengguna yang sudah terotentikasi (*"Apa yang boleh Anda lakukan?"*), misalnya membedakan hak akses Admin vs Mahasiswa.
3. **Trust Domain (Domain Kepercayaan):** Batas perimeter sistem atau jaringan di mana seluruh komponen di dalamnya saling mempercayai otoritas keamanan dan penerbit identitas yang sama.
4. **Threat Model (Model Ancaman):** Metode terstruktur untuk memetakan skenario serangan peretasan, motif penyerang, dan celah kerentanan potensial yang mungkin dihadapi oleh suatu aplikasi.
5. **User Friction (Friksi Pengguna):** Hambatan teknis atau beban kognitif yang dirasakan pengguna saat berinteraksi dengan sistem, seperti banyaknya form isian atau rumitnya syarat kata sandi yang memicu pengguna membatalkan pendaftaran.
6. **Zero Friction (Tanpa Hambatan):** Pengalaman registrasi yang berjalan instan tanpa friksi kognitif sama sekali, misalnya pendaftaran akun cukup dengan satu kali klik tombol GitHub OAuth tanpa mengisi formulir apa pun.
7. **Password Liability (Liabilitas Kata Sandi):** Beban risiko hukum, finansial, dan reputasi yang dipikul pemilik aplikasi jika database mereka diretas dan kata sandi pengguna bocor ke pihak luar.
8. **Zero Password Liability:** Kondisi di mana aplikasi terbebas 100% dari risiko kebocoran kata sandi karena aplikasi sama sekali tidak menyimpan maupun mengelola kata sandi pengguna (didelegasikan ke pihak ketiga seperti GitHub OAuth).
9. **Password Fatigue (Kelelahan Kata Sandi):** Sindrom kelelahan mental pengguna akibat tuntutan harus menghafal puluhan kata sandi berbeda di berbagai aplikasi digital, yang sering memicu kecerobohan menggunakan password lemah atau sama di mana-mana.
10. **Time-Based Single-Use Token (Token Sekali Pakai Berbatas Waktu / OTP):** String token acak unik kriptografis yang hanya sah digunakan satu kali dan memiliki waktu kedaluwarsa otomatis (misal 10–15 menit), digunakan pada Magic Link dan verifikasi email.
11. **Federated Identity (Identitas Terfederasi):** Sistem identitas lintas platform yang memungkinkan pengguna memakai satu akun terverifikasi dari Identity Provider terpercaya (GitHub, Google) untuk mengakses banyak aplikasi independen lainnya.
12. **Just-In-Time (JIT) Provisioning:** Mekanisme pembuatan akun pengguna secara otomatis dan instan di database aplikasi lokal tepat pada saat pengguna pertama kali berhasil login via SSO atau OAuth, tanpa perlu dibuat manual oleh admin.
13. **Instant Access Revocation (Pencabutan Akses Seketika):** Kemampuan administrator untuk menonaktifkan seluruh akses pengguna ke seluruh ekosistem aplikasi secara serentak hanya dengan satu klik di konsol pusat.

#### B. Istilah Komputasi Serverless, Kriptografi & Token
14. **Scale-to-Zero:** Karakteristik elastis arsitektur serverless di mana kontainer komputasi otomatis dimatikan menjadi nol saat tidak ada permintaan trafik guna menghemat biaya operasional.
15. **Cold Start:** Waktu jeda latensi (100–300 ms) yang dibutuhkan platform cloud untuk menyalakan dan menginisialisasi kontainer serverless baru dari kondisi mati saat menerima request pertama kali.
16. **No Shared In-Memory State (Tiadanya Memori Bersama):** Sifat arsitektur serverless di mana setiap instance fungsi berjalan terisolasi tanpa memori RAM bersama, sehingga data sesi tidak dapat disimpan di variabel global memori server.
17. **Connection Exhaustion (Kelelahan Koneksi):** Kondisi saat batas maksimal kuota koneksi database (misal 100 pool koneksi PostgreSQL) habis terpakai akibat lonjakan ratusan kontainer serverless yang menyala serentak.
18. **Stateless JWT (JSON Web Token - RFC 7519):** Format token standar terbuka yang membawa data klaim identitas secara mandiri (*self-contained*) dan diamankan oleh tanda tangan digital kriptografis tanpa membutuhkan penyimpanan memori di server.
19. **Tamper-Proof (Kebal Manipulasi):** Karakteristik keamanan kriptografis di mana setiap upaya pengubahan data pada payload token seketika membatalkan validitas tanda tangan digitalnya sehingga token langsung ditolak oleh server.
20. **Base64Url Encoding:** Skema pengkodean biner ke teks ASCII yang aman digunakan pada URL dan header HTTP (mengganti karakter `+` menjadi `-` dan `/` menjadi `_`, serta membuang karakter *padding* `=`).
21. **HMAC-SHA256:** Algoritma *Hash-based Message Authentication Code* yang memadukan fungsi hash kriptografis SHA-256 dengan kunci rahasia (*Secret Key*) untuk menghasilkan tanda tangan digital yang tidak dapat dipalsukan.

#### C. Istilah Protokol OAuth 2.0 & Jaringan Next.js
22. **Authorization Code Grant:** Alur protokol OAuth 2.0 paling aman yang menggunakan kode otorisasi sementara sekali pakai di peramban, lalu ditukarkan dengan token akses asli melalui saluran privat antar-server.
23. **Scopes:** Lingkup batasan izin akses spesifik yang diminta oleh aplikasi klien kepada pengguna di Identity Provider (misal: `read:user` untuk profil publik, `user:email` untuk membaca email).
24. **Backchannel Communication:** Jalur pertukaran data langsung dari server backend aplikasi ke server otorisasi eksternal melalui koneksi HTTPS terenkripsi tanpa melewati peramban publik.
25. **Client Secret:** Kunci rahasia milik aplikasi yang diterbitkan oleh OAuth Provider (GitHub) yang wajib disimpan aman di lingkungan server (`.env.local`) dan diharamkan bocor ke browser klien.
26. **Reverse Proxy / Network Boundary:** Gerbang jaringan terluar di depan aplikasi web yang bertugas menerima, memfilter, dan mengamankan seluruh request HTTP sebelum diteruskan ke Server Components.
27. **Zero Flash of Unauthenticated Content (FOUC):** Jaminan tampilan di mana halaman privat terproteksi tidak akan pernah sempat berkedip atau terlihat sedetik pun di layar pengguna yang belum terautentikasi.
28. **Token Rotation (Rotasi Token):** Standar keamanan di mana setiap kali refresh token dipakai untuk memperpanjang sesi, server menerbitkan refresh token baru dan mematikan refresh token lama guna mencegah serangan pengulangan (*replay attack*).
29. **Session Desynchronization (Session Desync):** Anomali di mana token sesi yang disimpan di peramban tidak selaras dengan token yang dibaca oleh Server Components, menyebabkan pengguna tiba-tiba ter-logout sendiri.

#### D. Istilah Database PostgreSQL & Keamanan Siber
30. **Orphaned User Anomaly (Pengguna Yatim):** Anomali inkonsistensi data di mana baris akun berhasil tercipta di tabel `auth.users` tetapi tidak memiliki data profil di `public.profiles` akibat kegagalan transaksi di tengah jalan.
31. **Network Partition / Network Split:** Peristiwa putusnya koneksi jaringan internet secara tiba-tiba antara klien dan server cloud saat transaksi data sedang berlangsung.
32. **ACID Atomicity:** Prinsip integritas basis data di mana serangkaian operasi diperlakukan sebagai satu kesatuan tunggal: seluruh operasi berhasil 100% atau seluruhnya dibatalkan 0% tanpa pernah menyisakan status setengah jadi.
33. **ON DELETE CASCADE:** Aturan integritas referensial pada SQL yang secara otomatis menghapus baris data anak (*child rows*) di tabel profil jika baris induk (*parent row*) di tabel akun auth dihapus.
34. **Cross-Site Scripting (XSS):** Serangan siber di mana peretas menyuntikkan skrip kode JavaScript berbahaya ke dalam halaman web yang sah untuk mencuri data sensitif seperti token di `localStorage`.
35. **HttpOnly Cookie:** Atribut keamanan kuki HTTP yang secara ketat melarang kode JavaScript peramban membaca atau mengakses kuki tersebut, memberikan kekebalan total dari pencurian token akibat serangan XSS.
36. **Credential Stuffing:** Serangan siber otomatis berskala besar yang menguji jutaan pasang kredensial curian dari kebocoran data web lain untuk membobol akun di aplikasi target.
37. **Timing Attack:** Teknik peretasan kriptografi di mana penyerang mengukur perbedaan waktu komputasi dalam skala milidetik untuk menebak isi teks rahasia yang sedang dibandingkan oleh server.

## 3. Peta Berkas & Di Mana Menemukan Kode (File Architecture Map)

Setelah mahasiswa mengeksekusi Formula Prompt AI di tab **Lab & Prompt AI**, repositori proyek mereka akan memiliki arsitektur 7 berkas modular berikut:

```
📁 serverless-project/
├── 📁 supabase/
│   └── 📁 migrations/
│       └── 📄 02_auth_profiles_trigger.sql    <-- [BERKAS 6] DDL public.profiles & Trigger on_auth_user_created
├── 📁 src/
│   ├── 📁 proxy.ts                            <-- [BERKAS 2] Root Network Boundary Proxy (Resmi Next.js 16, Regex Matcher)
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
[NEXT.JS 16 PROXY - src/proxy.ts]
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

- **Tujuan:** Membuktikan bahwa rute `/dashboard` dilindungi secara absolut di layer Network Boundary oleh Next.js 16 Proxy (`src/proxy.ts`).
- **Langkah Eksperimen:**
  1. Buka jendela peramban baru dalam mode **Incognito / Private Window** (di mana pengguna dipastikan belum login).
  2. Ketik langsung URL rahasia di address bar: `http://localhost:3000/dashboard` dan tekan Enter.
- **Hasil yang Ditunjukkan ke Mahasiswa:**
  - Browser seketika dialihkan (HTTP 307) kembali ke halaman `/login?next=%2Fdashboard`.
  - Halaman dashboard sama sekali tidak sempat berkedip tampil di layar (*Zero Flash of Unauthenticated Content*).
- **Kesimpulan:** *"Next.js 16 Proxy (`src/proxy.ts`) berhasil mengawal rute sebelum kode Server Component sempat dieksekusi!"*

---

### EKSPERIMEN 3: Uji Audit Keamanan: `getSession()` vs `getUser()`

- **Tujuan:** Menunjukkan mengapa `getSession()` dilarang keras di industri.
- **Langkah Eksperimen:**
  1. Mahasiswa login ke aplikasi.
  2. Buka Supabase Dashboard ➔ **Authentication ➔ Users**.
  3. Cari akun mahasiswa tersebut, klik titik tiga ➔ pilih **Ban User** (Nonaktifkan Pengguna).
  4. Jika aplikasi menggunakan `getSession()` di proxy: pengguna masih bisa bebas membuka `/dashboard` karena kuki lokal di laptop masih ada.
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

3. **Pertanyaan:** *"Mengapa pada fungsi updateSession di Next.js 16 Proxy (src/proxy.ts), kita wajib menyalin token sesi ke request.cookies DAN response.cookies secara bersamaan?"*  
   **Jawaban Benar:** Menyalin ke `request.cookies` memastikan Server Component (RSC) yang dirender tepat setelah proxy selesai dapat membaca token baru secara langsung. Menyalin ke `response.cookies` memastikan browser pengguna menyimpan token baru tersebut melalui header HTTP `Set-Cookie`.

4. **Pertanyaan:** *"Mengapa pembuatan profil pengguna di public.profiles wajib ditangani oleh Database Trigger PostgreSQL dan bukan ditulis di kode Server Action web?"*  
   **Jawaban Benar:** Karena pendaftaran akun bisa terjadi melalui banyak pintu (GitHub OAuth, Magic Link, atau dashboard Supabase). Jika ditulis di aplikasi, kegagalan koneksi saat redirect OAuth dapat membuat user terdaftar di auth.users tetapi tidak memiliki profil di public.profiles. Database Trigger menjamin pembuatan profil selalu terjadi secara atomik 100% di level kernel database (seperti sensor mekanis lantai yang otomatis mencetak berkas nasabah saat pintu putar bank dilewati).

5. **Pertanyaan Analogi:** *"Mengapa mengandalkan getSession() di Next.js 16 Proxy diibaratkan seperti satpam yang hanya melihat foto ID karyawan tanpa men-scan barcode ke server pusat HRD?"*  
   **Jawaban Benar:** Karena `getSession()` hanya membaca payload kuki lokal di laptop pengguna tanpa melakukan network call ke Supabase GoTrue Auth. Jika status user telah dibekukan (*banned*) atau password diubah di perangkat lain, `getSession()` tidak mengetahuinya dan tetap meloloskan request. `getUser()` melakukan verifikasi real-time ke auth server sehingga hak akses selalu terjamin akurat.

6. **Pertanyaan Analogi:** *"Mengapa pada protokol OAuth 2.0 Authorization Code Flow, GitHub mengirimkan kupon 'code' sementara terlebih dahulu ke peramban, dan bukan langsung mengirimkan 'access_token'?"*  
   **Jawaban Benar:** Karena peramban publik adalah lingkungan yang tidak aman (rawan terekspos di browser history, log proxy publik, atau dicuri ekstensi browser jahat). Dengan mengirimkan authorization code sementara (5-10 menit), penukaran dengan `access_token` asli dilakukan secara server-to-server di backend (`/auth/callback`) menggunakan `client_secret` yang dirahasiakan, sehingga token akses tidak pernah terpapar ke peramban publik (seperti menukar kupon undian klaim di kantor cabang berbrankas alih-alih melempar emas batangan di jalan raya).

7. **Pertanyaan Analogi:** *"Dalam arsitektur serverless yang menerapkan scale-to-zero, mengapa Stateful Session diibaratkan seperti karcis penitipan jaket yang gagal saat Anda pindah cabang restoran, sedangkan Stateless JWT diibaratkan seperti paspor diplomatik?"*  
   **Jawaban Benar:** Karena serverless function tidak memiliki memori RAM bersama antar-eksekusi (*no shared in-memory state*). Instansi fungsi baru yang menyala di region lain tidak tahu Session ID yang tersimpan di RAM instansi lama. Sebaliknya, Stateless JWT membawa data klaim identitas mandiri yang disahkan secara kriptografis oleh tanda tangan digital (signature), sehingga fungsi manapun di dunia dapat memvalidasi keabsahannya seketika tanpa perlu kueri database.

---

*Dokumen Panduan Pengajaran ini disusun secara resmi untuk mendampingi modul perkuliahan The Serverless Odyssey — Pertemuan 5.*
