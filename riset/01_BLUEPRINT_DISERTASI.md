# 01 — Blueprint Disertasi S3 (Lengkap)
## "Continuous Contextual Authenticity Profiling Theory (CCAPT)"

> **Dokumen**: Rancangan Lengkap Disertasi Doktoral  
> **Program Studi**: Doktor Ilmu Komputer / Teknologi Informasi / Pendidikan Teknologi  
> **Versi**: 1.0 — Oktober 2026  

---

## BAGIAN A: IDENTITAS & POSITIONING DISERTASI

### A.1. Pilihan Judul Disertasi

> **JUDUL UTAMA (Rekomendasi):**
> *"Continuous Contextual Authenticity Profiling in Generative AI-Pervasive Higher Education: Design, Implementation, and Empirical Validation of a Formative Stylometric Assessment Ecosystem for Cloud-Native Software Engineering Courses"*

**Judul Alternatif Indonesia (untuk keperluan DIKTI):**
> *"Ekosistem Penilaian Formatif Berbasis Profil Stilistika Kontekstual Berkelanjutan: Desain, Implementasi, dan Validasi Empiris pada Pembelajaran Rekayasa Perangkat Lunak Berbasis Cloud di Era Kecerdasan Buatan Generatif"*

**Kata Kunci Utama (untuk pengindeksan Scopus):**
`formative assessment` · `stylometrics` · `academic integrity` · `generative AI` · `cognitive load` · `mastery learning` · `cloud computing education` · `adaptive timer` · `multi-LLM evaluation` · `design-based research`

---

### A.2. Positioning dalam Peta Keilmuan

```
DOMAIN UTAMA: Educational Technology / Technology-Enhanced Learning
    │
    ├─ SUB-DOMAIN 1: AI-Assisted Assessment & Academic Integrity
    │       └─ Spesialisasi: Formative Authenticity Verification
    │
    ├─ SUB-DOMAIN 2: Cognitive Load Theory in Digital Assessment
    │       └─ Spesialisasi: Adaptive Timer & Anxiety Mitigation
    │
    └─ SUB-DOMAIN 3: Curriculum Design for Technical HE
            └─ Spesialisasi: Snowballing Project-Based Learning
```

**Jenis Riset**: Design-Based Research (DBR) + Mixed Methods (Kuantitatif + Kualitatif)  
**Level Inovasi**: Mengusulkan **teori baru** (CCAPT) + **sistem berjalan** (platform live) + **validasi empiris** (2 semester data)

---

## BAGIAN B: GRAND THEORY — CCAPT

### B.1. Philosophical Foundation (Landasan Filosofis)

**Ontologi**: Realisme Kritis — terdapat realitas otentisitas kognitif mahasiswa yang dapat diukur namun hanya dapat didekati melalui triangulasi bukti dari konteks yang beragam.

**Epistemologi**: Post-positivisme — pengetahuan tentang otentisitas akademik bersifat probabilistik, tidak absolut, dan harus dikumpulkan dari multiple evidence sources.

**Aksiologi**: Etika penilaian yang berpusat pada manusia (*human-centered*) — sistem harus melindungi martabat mahasiswa, tidak bersifat surveillance-first tetapi learning-first.

---

### B.2. Definisi Formal CCAPT

**Definisi (Formal):**
> *"Continuous Contextual Authenticity Profiling (CCAP) adalah proses sistematis pengumpulan, pemodelan, dan pembaruan profil stilistika-kognitif individu mahasiswa melalui serangkaian interaksi percakapan tematik yang terkontekstualisasi secara spesifik terhadap domain materi, sehingga menghasilkan baseline referensi dinamis yang dapat digunakan untuk menilai tingkat otentisitas setiap karya akademik yang dihasilkan mahasiswa tersebut dalam konteks yang bersesuaian."*

**Komponen Utama CCAP:**
1. **C — Continuous**: Profil tidak statis; diperbarui setiap sesi interaksi baru.
2. **C — Contextual**: Baseline harus dibangun dalam konteks materi yang sama (domain-specific).
3. **A — Authenticity**: Target pengukuran adalah orisinalitas kognitif, bukan plagiasi teks.
4. **P — Profiling**: Hasil akhir adalah profil multidimensi, bukan skor tunggal.

---

### B.3. Tiga Aksioma CCAPT

#### AKSIOMA 1: Cognitive Uniqueness Axiom (CUA)
> *"Setiap individu memiliki profil stilistika-kognitif yang unik dan teridentifikasi, yang termanifestasi secara konsisten dalam produksi teks verbal maupun tulisan mereka, dan dapat dimodelkan secara komputasional menggunakan metrik linguistik dan struktural yang terukur."*

**Implikasi Praktis:**
- Mahasiswa A dan Mahasiswa B, meski mempelajari materi yang sama, akan mengekspresikan pemahaman mereka dengan pola kalimat, pilihan kata, panjang jawaban, dan gaya argumentasi yang berbeda secara signifikan.
- Perbedaan ini cukup konsisten dan dapat diukur menggunakan metrik: avg sentence length, type-token ratio, connector word frequency, technical term density, hedging expression rate.

**Implikasi bagi Sistem:**
- Sistem harus mengumpulkan cukup data awal per mahasiswa sebelum dapat membuat profil yang valid.
- Profil per mahasiswa disimpan dan diperbarui di tabel `student_warmup_chats` (Supabase).

---

#### AKSIOMA 2: Dynamic Contextualization Axiom (DCA)
> *"Baseline stilistika yang valid untuk tujuan verifikasi otentisitas harus diekstrak dari interaksi mahasiswa dalam konteks domain materi yang bersesuaian, dan harus diperbarui secara berkesinambungan untuk mengakomodasi perkembangan kompetensi linguistik teknis mahasiswa."*

**Implikasi Praktis:**
- Baseline yang diambil dari obrolan umum (hari, cuaca, hobi) TIDAK valid untuk menilai esai teknis tentang arsitektur serverless.
- Baseline yang diambil pada Minggu 1 tidak serta-merta valid untuk menilai esai Minggu 12, karena mahasiswa telah belajar lebih banyak kosakata teknis.
- Solusi: Baseline diperbarui setiap sesi *warm-up check-in* (setiap modul perkuliahan).

**Implikasi bagi Sistem:**
- Sistem menggunakan **5 Rotating Conversational Archetypes** yang selalu relevan dengan materi modul aktif.
- `stylometric_profile` diperbarui setiap kali sesi warm-up selesai (bukan hanya dibuat sekali).

---

#### AKSIOMA 3: Formative Integrity Axiom (FIA)
> *"Sistem verifikasi otentisitas akademik yang etis harus bersifat formatif — mendampingi proses belajar, memberikan umpan balik yang konstruktif, dan mendorong perbaikan — bukan bersifat punitif yang semata-mata menghukum berdasarkan output akhir."*

**Implikasi Praktis:**
- Sistem tidak langsung memberikan cap "KECURANGAN TERDETEKSI". Ia menampilkan skor otentisitas beserta catatan spesifik aspek mana yang menyimpang dari baseline.
- Dosen diberi alat untuk melakukan dialog dengan mahasiswa (audit modal), bukan bukti hukum final.
- Mahasiswa dapat melihat skor otentisitas mereka sendiri dan memilih untuk memperbaiki/menjelaskan.

**Implikasi bagi Sistem:**
- Dashboard dosen menampilkan `authenticity_score` + `authenticity_notes` (bukan "curang/tidak").
- Mahasiswa melihat indikator stilistika mereka sendiri di dashboard profil.

---

### B.4. Model Konseptual CCAPT (Diagram Teks)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CCAPT CONCEPTUAL MODEL                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  INPUT LAYER:                                                       │
│  ┌─────────────────────────────────────────┐                       │
│  │  Conversational Warm-up (5 Archetypes)  │                       │
│  │  • Debat Santai (Hot Take)              │                       │
│  │  • Detektif Bug (Mystery Case)          │                       │
│  │  • Curhat Momen (Aha! Moment)           │                       │
│  │  • Skenario Klien (Roleplay)            │                       │
│  │  • Pilihan Berani (This or That)        │                       │
│  └────────────────────┬────────────────────┘                       │
│                       │                                             │
│  PROCESSING LAYER:    ▼                                             │
│  ┌─────────────────────────────────────────┐                       │
│  │   Stylometric Feature Extraction        │                       │
│  │   • avg_sentence_length                 │                       │
│  │   • type_token_ratio (lexical diversity)│                       │
│  │   • connector_word_frequency            │                       │
│  │   • technical_term_density              │                       │
│  │   • hedging_expression_rate             │                       │
│  │   • avg_word_length                     │                       │
│  └────────────────────┬────────────────────┘                       │
│                       │                                             │
│  PROFILE LAYER:       ▼                                             │
│  ┌─────────────────────────────────────────┐                       │
│  │   Dynamic Stylometric Profile (DSP)     │                       │
│  │   Stored in: student_warmup_chats       │                       │
│  │   Updated: every warm-up session        │                       │
│  │   Weighted: recent sessions > old       │                       │
│  └────────────────────┬────────────────────┘                       │
│                       │                                             │
│  EVALUATION LAYER:    ▼                                             │
│  ┌─────────────────────────────────────────┐                       │
│  │   Baseline-Referenced Evaluator         │                       │
│  │   Input: DSP (baseline) + Essay (target)│                       │
│  │   Output: authenticity_score (0–100)    │                       │
│  │           + authenticity_notes          │                       │
│  │   Multi-LLM: Groq → Gemini → DeepSeek  │                       │
│  └────────────────────┬────────────────────┘                       │
│                       │                                             │
│  OUTPUT LAYER:        ▼                                             │
│  ┌──────────────────────┐  ┌───────────────────────────────────┐  │
│  │  Student Dashboard   │  │  Lecturer Audit Dashboard         │  │
│  │  • My auth score     │  │  • Per-student auth scores        │  │
│  │  • Style feedback    │  │  • Flagged essays modal           │  │
│  │  • Improvement tips  │  │  • Multi-week trend chart         │  │
│  └──────────────────────┘  └───────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## BAGIAN C: STRUKTUR DISERTASI DETAIL (10 BAB)

### BAB 1 — PENDAHULUAN

**Target**: 25–35 halaman  
**Target Selesai**: Maret 2027

#### 1.1. Latar Belakang Masalah
- Krisis integritas akademik di era ChatGPT (2022–sekarang)
- Keterbatasan detektor AI komersial (Turnitin, GPTZero, Copyleaks):
  - False-positive rate tinggi pada penulis non-native
  - Tidak mempertimbangkan konteks domain
  - Bersifat post-hoc dan punitif
- Kecemasan ujian yang diperparah oleh AI-assisted assessment:
  - Timer kaku tidak mengakomodasi latensi AI
  - Mahasiswa frustrasi menunggu tanpa kompensasi waktu
- Gap kurikulum cloud computing di PT Indonesia:
  - Mayoritas masih konvensional (PowerPoint + UTS/UAS)
  - Belum ada model yang terintegrasi dengan tools AI koding

#### 1.2. Identifikasi & Rumusan Masalah
**Masalah Utama**: Bagaimana merancang, mengimplementasikan, dan memvalidasi secara empiris sebuah ekosistem penilaian formatif berbasis profil stilistika kontekstual yang dapat memverifikasi otentisitas akademik mahasiswa secara akurat, adil, dan pedagogis di era dominasi AI generatif?

**6 Research Questions (RQ):**

| RQ | Rumusan | Jenis |
|:---:|:---|:---:|
| RQ1 | Seberapa akurat sistem Conversational Stylometric Baseline mendeteksi teks buatan AI generatif dibanding detektor komersial, diukur dari F1-score dan False-Positive Rate? | Kuantitatif |
| RQ2 | Apakah Cognitive Load-Adaptive Timer secara signifikan menurunkan skor beban kognitif (NASA-TLX) mahasiswa dibanding timer kaku konvensional? | Kuantitatif |
| RQ3 | Bagaimana kualitas umpan balik Socratic dari sistem multi-LLM dibandingkan dengan feedback rubrik konvensional dosen, diukur dari rubrik 4-dimensi dan inter-rater reliability? | Mixed |
| RQ4 | Bagaimana tingkat penerimaan dan persepsi keadilan mahasiswa terhadap sistem Baseline Authenticity Evaluator, diukur dari SUS Score dan kuesioner fairness? | Mixed |
| RQ5 | Apakah model Snowballing Project 16 minggu menghasilkan outcome pembelajaran yang lebih tinggi dibanding model konvensional UTS/UAS, diukur dari skor proyek akhir dan retensi konsep? | Kuantitatif |
| RQ6 | Seberapa efektif Cross-Pillar Authenticity dalam memberikan gambaran longitudinal otentisitas akademik mahasiswa kepada dosen, diukur dari korelasi lintas-konteks dan persepsi dosen? | Mixed |

#### 1.3. Tujuan Penelitian
1. Mengembangkan Teori CCAPT sebagai kerangka konseptual baru untuk penilaian formatif di era GenAI.
2. Merancang dan mengimplementasikan platform CCAP yang terintegrasi dan terukur.
3. Memvalidasi secara empiris 8 hipotesis turunan CCAPT melalui eksperimen kelas nyata.
4. Menghasilkan model adopsi yang dapat direplikasi oleh institusi perguruan tinggi lain.

#### 1.4. Signifikansi Penelitian
- **Teoritis**: Mengusulkan CCAPT sebagai paradigma alternatif terhadap black-box AI detection.
- **Praktis**: Menyediakan cetak biru teknis platform yang dapat diimplementasikan ulang.
- **Kebijakan**: Memberikan rekomendasi kebijakan penilaian digital untuk kemendikbud/dikti.

#### 1.5. Batasan Penelitian
- Subjek: Mahasiswa S1 Informatika/Teknik Informatika semester aktif.
- Domain: Matakuliah rekayasa perangkat lunak berbasis cloud (konteks spesifik).
- Platform: Hanya diuji pada Next.js 16 + Supabase + Vercel stack.
- Bahasa: Bahasa Indonesia (bukan English) — perlu dicatat sebagai kontribusi spesifik.

---

### BAB 2 — KAJIAN LITERATUR SISTEMATIS

**Target**: 60–80 halaman  
**Target Selesai**: April 2027  
*(Lihat dokumen `02_KAJIAN_LITERATUR_REFERENSI.md` untuk detail 75 referensi)*

**Protokol SLR (Systematic Literature Review):**
- **Database**: Scopus, Web of Science, IEEE Xplore, ACM Digital Library, Google Scholar
- **Rentang Tahun**: 2020–2026 (dominan), dengan seminal works hingga 1960
- **Kata Kunci Pencarian**: (stylometrics OR "authorship verification") AND (education OR "higher education") AND ("AI detection" OR "academic integrity" OR "generative AI")
- **Kriteria Inklusi**: Peer-reviewed, terpublikasi di jurnal Q1/Q2 atau conference A/B, relevan dengan 1 dari 4 kluster gap
- **Kriteria Eksklusi**: Gray literature, blog, buku teks, artikel < 5 halaman

**5 Kluster Kajian Literatur:**
1. AI & Academic Integrity (20 referensi)
2. Cognitive Load Theory & Digital Assessment (15 referensi)
3. Stylometrics & Computational Authorship Verification (15 referensi)
4. Mastery Learning & Formative Assessment Technology (15 referensi)
5. Project-Based Learning & Cloud Computing Education (10 referensi)

---

### BAB 3 — KERANGKA TEORI & MODEL KONSEPTUAL

**Target**: 40–50 halaman  
**Target Selesai**: Mei 2027  
*(Lihat dokumen `04_KERANGKA_TEORI_CCAPT.md` untuk detail)*

**Isi:**
- Derivasi formal CCAPT dari 3 aksioma
- 8 Hipotesis penelitian turunan aksioma
- Model konseptual sistem lengkap (diagram UML)
- Hubungan antar-variabel (conceptual map)
- Operasionalisasi variabel

---

### BAB 4 — METODOLOGI PENELITIAN

**Target**: 40–50 halaman  
**Target Selesai**: Juni 2027  
*(Lihat dokumen `03_METODOLOGI_PENELITIAN.md` untuk detail)*

**Framework**: Design-Based Research (DBR) — 3 Siklus Iteratif  
**Paradigma**: Post-positivisme + Pragmatisme (Mixed Methods)  

**Desain Eksperimen:**
```
Kelompok Eksperimen (Kelas A):
  → Menggunakan platform CCAP penuh
  → Pre-test → [16 Minggu Platform] → Post-test → Survey NASA-TLX + SUS + Interview

Kelompok Kontrol (Kelas B):
  → Menggunakan LMS konvensional (Moodle/Google Classroom)
  → Pre-test → [16 Minggu Konvensional] → Post-test → Survey NASA-TLX
```

**Teknik Pengambilan Data:**
1. Log sistem otomatis (quiz_answers, warmup_chats, practicum_essays)
2. Kuesioner NASA-TLX (setelah setiap sesi kuis)
3. Kuesioner SUS (akhir semester)
4. Kuesioner Fairness Perception (Likert 5 poin, 12 item)
5. Wawancara semi-terstruktur (10–15 mahasiswa + 2–3 dosen)
6. Analisis artefak (commit history GitHub, PDF laporan praktikum)

**Teknik Analisis:**
- Kuantitatif: Independent-samples t-test / Mann-Whitney U, Cohen's d (effect size), Pearson/Spearman Correlation, Precision/Recall/F1
- Kualitatif: Thematic Analysis (Braun & Clarke, 6 fase), Member Checking, Inter-Rater Reliability (Kappa)

---

### BAB 5 — DESAIN SISTEM & IMPLEMENTASI PLATFORM

**Target**: 60–80 halaman  
**Target Selesai**: Juli 2027

**Isi:**
- Arsitektur teknis lengkap (Next.js 16 App Router + Supabase + Multi-LLM + Vercel)
- ERD (Entity Relationship Diagram) database Supabase
- Alur data per komponen (sequence diagram)
- Desain detail 5 subsistem:
  1. Conversational Warm-up Engine
  2. Cognitive Load-Adaptive Timer System
  3. Multi-LLM Socratic Evaluator
  4. Baseline-Referenced Authenticity Evaluator
  5. Cross-Pillar Practicum Studio

**Tabel Komponen Platform:**

| Subsistem | Teknologi | Tabel DB | Komponen UI |
|:---|:---|:---|:---|
| Warm-up Engine | Groq LLaMA3, Server Actions | student_warmup_chats | WarmupChatSection |
| Adaptive Timer | React useState, localStorage | quiz_answers | QuizTimerDisplay |
| Socratic Evaluator | Groq/Gemini/DeepSeek, Server Actions | quiz_answers | QuizEvaluatorSection |
| Authenticity Evaluator | Multi-LLM, Supabase RPC | practicum_essays | EssaySection |
| Practicum Studio | Supabase Storage, PDF | practicum_essays | PracticumSubmitSection |

---

### BAB 6 — IMPLEMENTASI & PENGUJIAN SIKLUS 1 (DBR Iterasi 1)

**Target**: 30–40 halaman  
**Target Selesai**: Agustus 2027

**Isi:**
- Proses iterasi pengembangan platform (changelog per milestone)
- Hasil pengujian usability awal (alpha testing dengan 5–10 pengguna awal)
- Temuan bug & perbaikan iteratif
- Revisi desain berdasarkan feedback pengguna awal
- Persiapan platform untuk implementasi penuh (Siklus 2)

---

### BAB 7 — HASIL & ANALISIS EKSPERIMEN (DBR Iterasi 2)

**Target**: 70–90 halaman  
**Target Selesai**: Oktober 2027

**Struktur per RQ:**

#### 7.1. RQ1 — Akurasi Deteksi Baseline vs Detektor Komersial
- Tabel perbandingan: Platform CCAP vs Turnitin vs GPTZero
- Metrik: Precision, Recall, F1-Score, False-Positive Rate
- Uji signifikansi statistik (Chi-square untuk proporsi)
- Visualisasi: ROC Curve, Confusion Matrix

#### 7.2. RQ2 — Cognitive Load (NASA-TLX) Timer Adaptif vs Kaku
- Statistik deskriptif skor NASA-TLX (6 dimensi)
- Independent-samples t-test (Kelompok Eksperimen vs Kontrol)
- Effect size Cohen's d
- Distribusi waktu ketukan pertama (histogram)

#### 7.3. RQ3 — Kualitas Feedback Socratic AI
- Rata-rata skor rubrik 4-dimensi (per model LLM)
- Inter-Rater Reliability (Cohen's Kappa antara 2 rater)
- Analisis tematik contoh feedback terbaik vs terburuk

#### 7.4. RQ4 — Persepsi Keadilan & Usability
- SUS Score (target ≥ 70 = "Good")
- Analisis kuesioner fairness (12 item, Likert 5)
- Tema utama dari wawancara semi-terstruktur

#### 7.5. RQ5 — Outcome Snowballing Project
- Skor proyek akhir: Eksperimen vs Kontrol (t-test)
- Distribusi nilai UAS
- Analisis commit frequency sebagai indikator keterlibatan

#### 7.6. RQ6 — Efektivitas Cross-Pillar Authenticity
- Korelasi skor warm-up vs skor esai praktikum (Pearson/Spearman)
- Analisis trend longitudinal authenticity_score per mahasiswa
- Persepsi dosen (tema dari wawancara)

---

### BAB 8 — PEMBAHASAN

**Target**: 40–50 halaman  
**Target Selesai**: November 2027

**Isi:**
- Penafsiran temuan terhadap 3 aksioma CCAPT
- Konfirmasi/falsifikasi 8 hipotesis
- Perbandingan dengan sistem sejenis di literatur
- Penjelasan temuan yang tidak terduga
- Keterbatasan penelitian:
  - Generalisabilitas (1 PT, 1 matakuliah, Bahasa Indonesia)
  - Potensi confounding variables (tingkat motivasi mahasiswa, kondisi internet)
  - Keterbatasan model LLM (rate limit, halusinasi AI)

---

### BAB 9 — KONTRIBUSI ILMIAH & IMPLIKASI

**Target**: 20–30 halaman  
**Target Selesai**: Desember 2027

**9.1. Kontribusi Teoritis:**
- CCAPT sebagai paradigma baru penilaian formatif di era GenAI
- Taksonomi mekanisme timer adaptif untuk ujian berbantuan AI
- Model transferabilitas baseline stilistika lintas-konteks

**9.2. Kontribusi Praktis:**
- Cetak biru teknis platform CCAP (open source)
- Panduan implementasi untuk PT lain (adoption model)
- Template instrumen: NASA-TLX adaptasi, SUS modifikasi, rubrik AI

**9.3. Implikasi Kebijakan:**
- Rekomendasi untuk Kemendikbud tentang standar penilaian digital
- Rekomendasi untuk jurnal/konferensi tentang evaluasi karya berbantuan AI
- Rekomendasi untuk akreditasi program studi (LAM Teknik, BAN-PT)

---

### BAB 10 — KESIMPULAN & AGENDA PENELITIAN LANJUTAN

**Target**: 15–20 halaman  
**Target Selesai**: Januari 2028

**Isi:**
- Ringkasan jawaban 6 RQ
- Konfirmasi/penolakan grand thesis statement
- 5 kontribusi orisinal yang telah diverifikasi
- Agenda penelitian 5 tahun ke depan:
  1. Replikasi di domain lain (kedokteran, hukum, bisnis)
  2. Ekspansi ke bahasa Inggris (lintas institusi global)
  3. Pengembangan model ML lokal untuk stylometric profiling
  4. Integrasi dengan sistem penilaian portfolio
  5. Standarisasi protokol CCAP untuk adopsi massal

---

## BAGIAN D: 8 HIPOTESIS PENELITIAN

| # | Hipotesis (H) | Aksioma | Metode Uji |
|:---:|:---|:---:|:---|
| H1 | Sistem CCAP menghasilkan F1-Score deteksi teks AI generatif yang lebih tinggi secara signifikan dibanding detektor komersial pada konteks domain spesifik. | CUA | Chi-square, z-test proporsi |
| H2 | False-Positive Rate sistem CCAP (mahasiswa jujur yang salah diflagging) lebih rendah secara signifikan dibanding detektor komersial. | CUA + FIA | Chi-square |
| H3 | Mahasiswa yang menggunakan Cognitive Load-Adaptive Timer memiliki skor NASA-TLX lebih rendah secara signifikan dibanding kelompok timer kaku. | CUA | Independent t-test |
| H4 | Feedback Socratic multi-LLM memiliki skor kualitas dimensi "Arah Pedagogis" yang lebih tinggi dibanding feedback rubrik konvensional. | FIA | Mann-Whitney U |
| H5 | Baseline stilistika yang diperbarui secara berkala (DCA) menghasilkan authenticity_score yang lebih stabil (variance lebih rendah) dibanding baseline statis. | DCA | F-test (Levene) |
| H6 | Mahasiswa yang menggunakan platform Snowballing Project memiliki skor proyek akhir lebih tinggi secara signifikan dibanding kelompok konvensional. | — | Independent t-test |
| H7 | Terdapat korelasi positif yang signifikan antara baseline stilistika warm-up dan authenticity_score esai praktikum pada domain materi yang sama. | DCA | Pearson Correlation |
| H8 | SUS Score platform CCAP dari persepsi mahasiswa ≥ 70 (kategori "Good" dalam benchmark SUS). | FIA | One-sample t-test vs 70 |

---

## BAGIAN E: CHECKLIST PERSIAPAN SEBELUM MENDAFTAR S3

### E.1. Dokumen Administratif
- [ ] Ijazah S2 yang dilegalisir (asli + fotokopi 3 lembar)
- [ ] Transkrip nilai S2 (IPK minimal 3.5 direkomendasikan)
- [ ] KTP + Pas foto terbaru (4×6 latar merah)
- [ ] Surat keterangan aktif bekerja (dari kampus/institusi)
- [ ] Surat rekomendasi 2 profesor/doktor di bidang relevan
- [ ] TOEFL ITP ≥ 500 atau IELTS ≥ 6.0 (untuk PT yang mensyaratkan)
- [ ] Sertifikat publikasi/karya ilmiah sebelumnya (jika ada)

### E.2. Dokumen Akademis (Research Proposal)
- [ ] Research Proposal (15–20 halaman) — gunakan dokumen ini sebagai dasar
- [ ] Latar belakang masalah (min. 3 halaman)
- [ ] Kajian literatur awal (min. 20 referensi)
- [ ] Research Gap yang jelas (4 kluster gap yang sudah diidentifikasi)
- [ ] Kerangka teori konseptual (CCAPT — sudah siap)
- [ ] Metodologi penelitian (DBR + Mixed Methods — sudah siap)
- [ ] Timeline penelitian 3–4 tahun

### E.3. Strategi Memilih Promotor
- **Ideal Promotor 1 (Bidang Utama)**: Dosen yang meneliti di bidang *educational technology* atau *AI in education* atau *technology-enhanced learning*.
- **Ideal Promotor 2 (Bidang Teknis)**: Dosen yang meneliti *software engineering education*, *cloud computing*, atau *information systems*.
- **Tips**: Cari promotor yang memiliki h-index Scopus ≥ 5 dan memiliki jaringan reviewer di jurnal target Anda.
- **Hindari**: Promotor yang bidangnya terlalu jauh (murni matematika atau fisika).

### E.4. Program S3 yang Direkomendasikan (Indonesia)
- S3 Ilmu Komputer — UI, ITS, UGM, ITB
- S3 Teknologi Informasi — ITS, Binus University
- S3 Pendidikan Teknologi — UPI Bandung
- S3 Ilmu Pendidikan (konsentrasi Teknologi Pendidikan) — UM Malang

### E.5. Beasiswa yang Perlu Dilamar
- **BPPDN/BUDI-DN** (Kemendikbud) — untuk dosen PTN/PTS aktif
- **Beasiswa Fulbright** (jika ingin double degree di AS)
- **LPDP** — untuk talenta terbaik Indonesia
- **Beasiswa kampus tujuan** — banyak kampus swasta top menyediakan beasiswa S3 internal

---

*Dokumen ini adalah living document. Perbarui setiap kali ada perkembangan signifikan dalam penelitian atau pendaftaran S3.*
