# 05 — Instrumen Penelitian Lengkap: Kuesioner, Rubrik, & Protokol Wawancara
## Toolkit Pengukuran Empiris Siap Pakai (Google Forms, LMS, & Platform Next.js)

> **Dokumen**: Instrumen Pengumpulan Data Disertasi S3  
> **Sasaran Pengguna**: Mahasiswa Peserta Kuliah, Dosen Pengampu, & Penilai Eksternal  
> **Status**: Terkalibrasi Metodologis, Dilengkapi Rumus Skoring & Panduan Distribusi  

---

## 📑 DAFTAR INSTRUMEN PENELITIAN

1. [Instrumen 1: NASA-Task Load Index (NASA-TLX) Adaptasi Ujian Digital](#instrumen-1)
2. [Instrumen 2: Modified System Usability Scale (SUS) Platform Pembelajaran](#instrumen-2)
3. [Instrumen 3: Perceived Academic Fairness & Authenticity Questionnaire (PAFAQ-12)](#instrumen-3)
4. [Instrumen 4: Rubrik Kualitas Umpan Balik AI Socrates (AFQR-4D)](#instrumen-4)
5. [Instrumen 5: Protokol Wawancara Semi-Terstruktur (Mahasiswa & Dosen)](#instrumen-5)
6. [Instrumen 6: Rubrik Evaluasi Proyek Akhir Snowballing (Arsitektur & Git Hygiene)](#instrumen-6)

---

<a name="instrumen-1"></a>
## INSTRUMEN 1: NASA-Task Load Index (NASA-TLX) Adaptasi Ujian Digital
*Digunakan untuk menguji Hipotesis H3 (Penurunan Beban Kognitif berkat Timer Adaptif)*  
*Distribusi: Diisi mahasiswa pasca pengerjaan Kuis Modul 3, Modul 6, dan Modul 11 (Google Form / Popup UI)*

### Petunjuk Pengisian:
Berikan penilaian pada skala 0 (Sangat Rendah) hingga 100 (Sangat Tinggi) dengan kelipatan 5 terhadap pengalaman mental yang Anda rasakan selama mengerjakan kuis:

| Subskala NASA-TLX | Definisi Operasional dalam Ujian Kuis | Skala Penilaian |
|:---|:---|:---:|
| **1. Mental Demand (MD)** | Seberapa besar aktivitas mental dan pemikiran mendalam yang dibutuhkan untuk menganalisis dan menjawab soal esai? | 0 — 100 |
| **2. Physical Demand (PD)** | Seberapa melelahkan aktivitas fisik yang dirasakan (mengetik cepat, menatap layar, ketegangan postur)? | 0 — 100 |
| **3. Temporal Demand (TD)** | Seberapa terburu-buru atau tertekan Anda oleh kecepatan hitung mundur waktu ujian yang berjalan? | 0 — 100 |
| **4. Performance (OP)** | Seberapa puas Anda terhadap keberhasilan pemahaman konsep yang berhasil Anda buktikan dalam jawaban Anda? *(Skala: 0 = Sempurna, 100 = Gagal Total)* | 0 — 100 |
| **5. Effort (EF)** | Seberapa keras usaha mental dan konsentrasi yang harus Anda kerahkan untuk menyelesaikan revisi hingga lulus ambang 80? | 0 — 100 |
| **6. Frustration Level (FR)** | Seberapa cemas, stres, jengkel, atau terintimidasi Anda selama proses evaluasi dan pengerjaan kuis berlangsung? | 0 — 100 |

### Rumus Perhitungan Skor Raw NASA-TLX (RTLX):
$$\text{RTLX Score} = \frac{MD + PD + TD + OP + EF + FR}{6}$$
*(Skor lebih rendah menunjukkan beban kognitif extraneous yang lebih ringan dan lingkungan ujian yang lebih bersahabat).*

---

<a name="instrumen-2"></a>
## INSTRUMEN 2: Modified System Usability Scale (SUS)
*Digunakan untuk menguji Hipotesis H8 (Tingkat Penerimaan Sistem oleh Pengguna)*  
*Distribusi: Diisi pada Minggu ke-15 oleh seluruh mahasiswa kelompok intervensi*

### Pilihan Jawaban (Skala Likert 1–5):
`[1] Sangat Tidak Setuju` · `[2] Tidak Setuju` · `[3] Ragu-ragu / Netral` · `[4] Setuju` · `[5] Sangat Setuju`

| # | Butir Pernyataan SUS | Sifat Butir |
|:---:|:---|:---:|
| 1 | Saya merasa ingin menggunakan platform pembelajaran ini secara rutin dalam perkuliahan pemrograman lainnya. | Positif (+) |
| 2 | Saya merasa antarmuka dan navigasi tab platform ini rumit dan membingungkan untuk digunakan. | Negatif (-) |
| 3 | Saya merasa fitur-fitur platform (animasi visualizer, obrolan santai, kuis Socratic) sangat mudah digunakan. | Positif (+) |
| 4 | Saya merasa membutuhkan bantuan teknis orang lain untuk dapat memahami cara kerja kuis dan studio praktikum di platform ini. | Negatif (-) |
| 5 | Saya merasa berbagai fitur dalam platform ini terintegrasi secara sangat baik dan selaras satu sama lain. | Positif (+) |
| 6 | Saya merasa ada terlalu banyak inkonsistensi desain dan alur kerja di dalam platform ini. | Negatif (-) |
| 7 | Saya membayangkan bahwa kebanyakan rekan mahasiswa akan dapat menguasai penggunaan platform ini dengan sangat cepat. | Positif (+) |
| 8 | Saya merasa platform ini sangat canggung dan merepotkan ketika digunakan untuk belajar dan mengumpulkan tugas. | Negatif (-) |
| 9 | Saya merasa sangat percaya diri dan tenang saat menyelesaikan tugas dan kuis melalui platform ini. | Positif (+) |
| 10 | Saya harus mempelajari banyak hal baru sebelum saya dapat mulai mengerjakan tugas di platform ini. | Negatif (-) |

### Rumus Baku Perhitungan Skor SUS:
1. Untuk butir bernomor ganjil ($1, 3, 5, 7, 9$): $\text{Poin} = \text{Skor Mentah} - 1$.
2. Untuk butir bernomor genap ($2, 4, 6, 8, 10$): $\text{Poin} = 5 - \text{Skor Mentah}$.
3. Kalikan jumlah total poin dari 10 butir dengan **2.5**:

$$\text{SUS Total Score} = 2.5 \times \sum_{i=1}^{10} \text{Poin}_i \quad (\text{Rentang: } 0 - 100)$$

*Kriteria Keberhasilan Disertasi: $\text{SUS} \ge 70$ (Grade B / Kategori "Good" menurut standar Bangor et al., 2021).*

---

<a name="instrumen-3"></a>
## INSTRUMEN 3: Perceived Academic Fairness & Authenticity Questionnaire (PAFAQ-12)
*Instrumen Orisinal Khusus Disertasi CCAPT untuk menguji Persepsi Keadilan & Moralitas Asesmen*  
*Skala Likert 1–5 (Sangat Tidak Setuju s.d. Sangat Setuju)*

### Dimensi A: Transparansi & Keadilan Evaluasi AI (Fairness)
1. Saya merasa sistem penilaian berbasis profil gaya bahasa (*warm-up baseline*) lebih adil daripada sistem deteksi plagiasi Turnitin yang langsung menuduh curang tanpa alasan jelas.
2. Skor keaslian (*authenticity score*) yang diberikan sistem mencerminkan pemahaman asli saya sendiri terhadap materi.
3. Saya merasa tenang karena sistem membedakan waktu membaca penjelasan AI dengan waktu pengetikan jawaban saya (*Reading & Latency Freeze*).
4. Penambahan waktu +90 detik saat nilai saya hampir lulus (skor 60–79) memberi saya motivasi positif untuk terus mencoba dan tidak putus asa.

### Dimensi B: Keamanan Psikologis & Beban Stres (Psychological Safety)
5. Adanya sesi obrolan santai sebelum kuis membantu pikiran saya lebih rileks dan siap menjawab soal-soal analisis yang sulit.
6. Saya tidak merasa dicurigai atau dimata-matai secara berlebihan oleh sistem selama mengerjakan kuis di kelas.
7. Mekanisme reset saat berpindah tab membuat saya lebih disiplin dan fokus menyelesaikan soal tanpa tergoda menyalin jawaban dari tempat lain.
8. Sistem evaluasi bertingkat (wajib $\ge 80$) membuat saya benar-benar memahami materi, bukan sekadar menghafal untuk lulus ujian.

### Dimensi C: Kepercayaan terhadap Dosen & Sistem (Institutional Trust)
9. Adanya dashboard audit di mana dosen dapat meninjau catatan keaslian tulisan saya membuat saya merasa hak akademik saya terlindungi.
10. Tanda tangan digital dosen pada laporan praktikum memberikan kepastian hukum bahwa hasil analisis saya telah diperiksa secara seksama.
11. Saya merasa gaya penulisan dan cara berpikir saya dihormati oleh sistem pembelajaran ini.
12. Secara keseluruhan, saya merekomendasikan sistem evaluasi seperti ini diterapkan pada mata kuliah teknologi lainnya.

---

<a name="instrumen-4"></a>
## INSTRUMEN 4: Rubrik Kualitas Umpan Balik AI Socrates (AFQR-4D)
*Digunakan oleh 2 Rater Independen (Dosen / Pakar Pendidikan) untuk menguji Hipotesis H4*  
*Sampel: 100 respons acak dari AI Grader terhadap jawaban mahasiswa*

| Dimensi Penilaian | Skor 1 (Sangat Buruk) | Skor 3 (Cukup / Moderat) | Skor 5 (Sangat Baik / Unggul) |
|:---|:---|:---|:---|
| **D1: Akurasi Konseptual (Weight: 25%)** | Umpan balik memuat halusinasi fakta teknis atau mengoreksi hal yang sebenarnya sudah benar. | Umpan balik benar secara umum namun terdapat ketidaktelitian pada parameter spesifik arsitektur serverless. | Umpan balik 100% akurat secara teknis, sesuai dengan dokumentasi resmi Next.js/Supabase terbaru. |
| **D2: Kedalaman Nalar / Non-Superficial (Weight: 25%)** | Hanya memberikan komentar pendek generik (*"Jawaban Anda kurang tepat, silakan baca lagi"*). | Menyebutkan bagian jawaban yang salah, namun penjelasannya dangkal dan tidak mengulas akar masalah. | Mengupas secara mendalam mengapa konsep tersebut keliru dan apa konsekuensi sistem jika diterapkan di dunia nyata. |
| **D3: Arah Bimbingan Socrates (Weight: 30%)** | Membocorkan kalimat jawaban yang harus disalin ATAU tidak memberikan petunjuk sama sekali. | Memberikan petunjuk arah, namun petunjuk terlalu eksplisit sehingga mahasiswa tidak perlu berpikir mandiri. | Mengajukan pertanyaan reflektif, menyajikan analogi yang tepat, dan memandu mahasiswa menemukan solusinya sendiri. |
| **D4: Relevansi Kontekstual & Nada (Weight: 20%)** | Bahasa terdengar menghakimi, kaku, robotik, dan tidak relevan dengan tingkat pemahaman mahasiswa. | Bahasa sopan namun terasa seperti template standar yang diulang-ulang. | Nada empatik, suportif, memotivasi mahasiswa untuk merevisi, dan menggunakan metafora kontekstual. |

---

<a name="instrumen-5"></a>
## INSTRUMEN 5: Protokol Wawancara Semi-Terstruktur

### A. Protokol Wawancara Mahasiswa (Durasi: 30–45 Menit)
1. *Pembuka*: "Bagaimana kesan umum Anda setelah satu semester belajar menggunakan platform The Serverless Odyssey?"
2. *Pengalaman Warm-up Chat*: "Sebelum mulai kuis, ada obrolan santai dengan AI bertema misteri/debat. Bagaimana Anda memandang obrolan tersebut? Apakah itu terasa seperti ujian, atau terasa santai? Mengapa?"
3. *Timer Adaptif*: "Pernahkah Anda memperhatikan bahwa timer baru berdetik saat Anda mulai mengetik, dan berhenti saat membaca feedback? Bagaimana fitur ini memengaruhi detak jantung atau ketenangan Anda saat mengerjakan kuis?"
4. *Bimbingan Socrates*: "Ketika nilai Anda di bawah 80, AI memberikan arahan revisi tanpa memberi tahu kunci jawaban langsung. Bagaimana perasaan Anda saat harus merevisi berulang kali? Apakah Anda merasa terbantu atau merasa lelah?"
5. *Keaslian Laporan Praktikum*: "Di Studio Praktikum, sistem menilai skor otentisitas esai Anda berdasarkan obrolan kuis mingguan. Apakah Anda merasa penilaian keaslian ini akurat mencerminkan tulisan Anda sendiri?"
6. *Penutup*: "Jika Anda diberi pilihan antara kuis pilihan ganda tradisional di Moodle vs kuis esai interaktif Socrates di platform ini, mana yang Anda pilih dan mengapa?"

### B. Protokol Wawancara Dosen Pengampu & Asisten Lab (Durasi: 45–60 Menit)
1. "Bagaimana dashboard audit keaslian membantu Anda memantau orisinalitas tugas dari puluhan mahasiswa secara real-time?"
2. "Apakah Anda menemukan kasus di mana mahasiswa diflagging oleh sistem, dan bagaimana modal audit memfasilitasi dialog klarifikasi dengan mahasiswa tersebut?"
3. "Bagaimana fitur integrasi tanda tangan digital dan stempel kelulusan PDF mengubah alur kerja praktikum di laboratorium?"
4. "Apakah beban kerja koreksi dosen berkurang, bertambah, atau bertransformasi menjadi lebih bermakna dengan adanya multi-LLM grader ini?"

---

<a name="instrumen-6"></a>
## INSTRUMEN 6: Rubrik Evaluasi Proyek Akhir Snowballing (Rubrik UAS)
*Digunakan untuk menguji Hipotesis H6 (Peningkatan Outcome Belajar Proyek 16 Minggu)*

| Kriteria Penilaian | Bobot | Deskripsi Capaian Sempurna (Skor 85–100) |
|:---|:---:|:---|
| **1. Arsitektur Serverless & RLS** | 25% | Skema relasional PostgreSQL optimal, proteksi data multi-tenant dengan Row Level Security (RLS) policies teruji 100%, tidak ada kebocoran kunci rahasia ke klien. |
| **2. App Router & Server Actions** | 20% | Pemisahan tegas RSC (Server Components) dan Client Components, 0 direktif `'use client'` di level rute utama, mutasi data aman via Server Actions terintegrasi Zod. |
| **3. Advanced UI/UX & Animasi** | 20% | Interaksi Drag-and-Drop (DND) mulus dengan optimistic updates, transisi animasi Framer Motion harmonis, dukungan Dark/Light mode konsisten semantik. |
| **4. Cloud Media & Real-time Integration** | 15% | Optimasi unggah dan transformasi gambar Cloudinary dinamis, sinkronisasi realtime WebSocket Supabase berjalan responsif tanpa memory leak. |
| **5. Git Hygiene & Branching Strategy** | 10% | Riwayat commit mencerminkan metodologi bola salju 16 minggu, strategi branching fitur (`feature/*`) ke `main` rapi, Pull Request terdokumentasi bersih. |
| **6. Deployment CI/CD & Observability** | 10% | Proyek live di Vercel dengan domain aktif, preview branch deployment sukses, Error Boundaries mencegah layar blank saat simulasi crash. |

---

*Seluruh instrumen di atas telah siap dikonversi ke kuesioner daring dan diintegrasikan langsung ke dalam database Supabase pada tabel analisis penelitian.*
