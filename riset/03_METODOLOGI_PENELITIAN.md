# 03 — Metodologi Penelitian: Design-Based Research & Mixed Methods
## Desain Riset Disertasi S3 & Pengambilan Data Empiris Kelas Nyata

> **Dokumen**: Metodologi Penelitian Disertasi Doktoral  
> **Pendekatan**: Design-Based Research (DBR) + Explanatory Sequential Mixed Methods  
> **Populasi & Sampel**: Mahasiswa S1 Teknik Informatika / Sistem Informasi Mata Kuliah Rekayasa Web & Cloud  
> **Status**: Siap Diajukan ke Komite Etik Penelitian & Dewan Promotor  

---

## 1. PARADIGMA & KERANGKA METODOLOGIS

Penelitian ini memadukan dua paradigma ilmiah:
1. **Pragmatisme (Tashakkori & Teddlie, 2021)**: Menekankan nilai praktis bahwa kebenaran teori diuji melalui efektivitas solusinya dalam menyelesaikan problem dunia nyata (intervensi teknologi di kelas).
2. **Post-positivisme (Creswell & Creswell, 2023)**: Mengakui bahwa pengukuran otentisitas kognitif dan beban mental bersifat probabilistik, sehingga membutuhkan triangulasi bukti kuantitatif dan kualitatif.

```
                  ┌────────────────────────────────────────┐
                  │    DESIGN-BASED RESEARCH (DBR)         │
                  │         (McKenney & Reeves, 2021)      │
                  └──────────────────┬─────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
   SIKLUS 1 (Smt 1)            SIKLUS 2 (Smt 2)            SIKLUS 3 (Smt 3)
  Eksplorasi & Alpha          Uji Eksperimen Penuh       Longitudinal Transfer
  • Analisis Kebutuhan        • Quasi-Experiment         • Cross-Cohort Audit
  • Prototipe 4 Pilar         • Kontrol vs Intervensi    • Teori CCAPT Final
  • Usability Test (SUS)      • NASA-TLX & Log Analisis  • Model Adopsi Nasional
```

---

## 2. DESAIN EKSPERIMEN: QUASI-EXPERIMENTAL NON-EQUIVALENT CONTROL GROUP

Karena mahasiswa perguruan tinggi terikat dalam kelas paralel yang tidak dapat diacak secara individu (*intact classes*), penelitian menggunakan desain **Quasi-Experimental Non-Equivalent Pretest-Posttest Design**:

$$\begin{array}{lcccc}
\text{Kelompok Intervensi (Kelas A)}: & O_1 & X_{CCAPT} & O_2 & O_3 \\
\text{Kelompok Kontrol (Kelas B)}:    & O_1 & X_{Tradisional} & O_2 & -
\end{array}$$

### Keterangan Notasi:
- $O_1$: *Pre-test* kemampuan arsitektur web & pengisian baseline kognitif awal.
- $X_{CCAPT}$: Pembelajaran menggunakan platform **The Serverless Odyssey** (Warm-up chat dinamis, adaptive timer, Socratic multi-LLM, cross-pillar authenticity, snowballing repo).
- $X_{Tradisional}$: Pembelajaran menggunakan LMS standar institusi (Moodle/Google Classroom), modul slide PDF, timer ujian kaku statis, dan pengumpulan tugas terpisah mingguan.
- $O_2$: *Post-test*, survey NASA-TLX per sesi, kuesioner SUS, uji akurasi deteksi AI, dan evaluasi proyek akhir.
- $O_3$: *Longitudinal audit* (analisis transferabilitas baseline kuis ke Studio Praktikum Terpadu).

---

## 3. POPULASI, SAMPEL, & PROSEDUR SAMPLING

### 3.1. Ukuran Sampel & Analisis Kekuatan Statistik (Power Analysis)
Menggunakan perangkat lunak **G*Power 3.1.9.7**:
- **Test Family**: $t$-tests (Difference between two independent means)
- **Effect Size ($d$)**: 0.65 (Medium to Large effect berdasarkan studi meta-analisis van der Kleij et al., 2022)
- **$\alpha$ error probability**: 0.05
- **Power ($1 - \beta$)**: 0.85
- **Hasil Minimal N**: Dibutuhkan minimal **38 mahasiswa per kelompok** (Total $N = 76$).
- **Realisasi Kelas**:
  - Kelas A (Eksperimen): 40–45 mahasiswa
  - Kelas B (Kontrol): 40–45 mahasiswa
  - Total partisipan aktif: **80–90 mahasiswa** (memenuhi ambang batas statistik).

### 3.2. Ethical Clearance & Perlindungan Data Mahasiswa
- **Informed Consent**: Mahasiswa menandatangani persetujuan bahwa log interaksi belajar mereka dianonimkan untuk keperluan analisis riset tanpa memengaruhi hak nilai akademik.
- **Data Anonymization**: Seluruh `user_id` dienkripsi dengan hashing SHA-256 (`student_hash_id`) sebelum diekspor ke format analisis (SPSS / R / Python Pandas).
- **Opt-Out Clause**: Mahasiswa berhak meminta datanya tidak dimasukkan dalam publikasi tanpa konsekuensi penalti apapun.

---

## 4. PROSEDUR PENGAMBILAN DATA (DATA COLLECTION PROTOCOL)

Pengambilan data dirancang otomatis menyatu dengan alur perkuliahan 16 minggu (*stealth assessment*), meminimalkan distorsi akibat kesadaran sedang diteliti (*Hawthorne Effect*):

```
MINGGU PERKULIAHAN        AKTIVITAS & LOG DATA YANG DIREKAM OTOMATIS
─────────────────────────────────────────────────────────────────────────────
Minggu 1                 Pre-Test Konseptual + Inisiasi Warm-up Baseline (Turn 1–4)
                         ➔ DB: `student_warmup_chats` (stylometrics awal)

Minggu 2–7 (Pra-UTS)     Kuis Mingguan (5 Soal Bertingkat)
                         • Rekam: `time_to_first_keystroke`
                         • Rekam: `ai_latency_duration` & `reading_freeze_seconds`
                         • Rekam: `attempt_count` & `reset_count` (anti-cheat log)
                         • Form NASA-TLX singkat pasca kuis (Minggu 3 & Minggu 6)
                         • Proyek: Commit incremental pada branch fitur GitHub

Minggu 8 (UTS)           Audit Proyek Milestone 1 + Post-test Mid-Semester

Minggu 9–14 (Pasca-UTS)  Studio Praktikum Terpadu (Laporan Ilmiah & Analisis)
                         • Evaluasi Authenticity Score berbasis baseline kuis
                         • Dashboard Dosen: Rekam tindakan dosen (Approve / Flag)
                         • Form NASA-TLX (Minggu 11)

Minggu 15                Pengisian Kuesioner Akhir:
                         • System Usability Scale (SUS)
                         • Perceived Fairness & Ethics Scale (12 item)

Minggu 16 (UAS)          Penilaian Proyek Akhir (Rubrik Standar Industri)
                         + Wawancara Semi-Terstruktur (12 Mahasiswa + 2 Dosen)
```

---

## 5. OPERASIONALISASI VARIABEL PENELITIAN

| Variabel | Tipe | Indikator Operasional | Skala Pengukuran | Instrumen / Sumber Data |
|:---|:---:|:---|:---:|:---|
| **Penerapan Ekosistem CCAPT** | Independen | Akses platform vs LMS konvensional | Nominal (0/1) | Grup Kelas |
| **Akurasi Verifikasi Otentisitas** | Dependen | Precision, Recall, F1-Score, False-Positive Rate | Rasio (0–100%) | Confusion Matrix vs Ground Truth |
| **Beban Kognitif (Cognitive Load)** | Dependen | Mental demand, temporal demand, effort, frustration | Interval (0–100) | NASA-TLX Questionnaire |
| **Kualitas Feedback Socratic** | Dependen | Akurasi, Kedalaman, Arah Bimbingan, Relevansi | Ordinal (1–5) | Rubrik 4 Dimensi (2 Rater) |
| **Persepsi Keadilan (Fairness)** | Dependen | Transparansi, keadilan koreksi, rasa aman psikologis | Likert (1–5) | Kuesioner Fairness 12 Item |
| **Hasil Belajar Proyek** | Dependen | Nilai akhir proyek, kebersihan commit, arsitektur RLS | Rasio (0–100) | Rubrik Proyek Akhir Terstandar |
| **Perilaku Anti-Cheat** | Dependen | Frekuensi reset layar (`reset_count`), rasio timeout | Rasio | Log Database Supabase |

---

## 6. TEKNIK ANALISIS DATA KUANTITATIF & STATISTIKA

### 6.1. Uji Validitas & Reliabilitas Instrumen
- **Validitas Konstruk**: Confirmatory Factor Analysis (CFA) pada instrumen NASA-TLX dan Fairness Scale (KMO > 0.7, Barlett's Test $p < 0.001$).
- **Reliabilitas Konsistensi Internal**: Cronbach's Alpha ($\alpha \ge 0.80$).
- **Inter-Rater Reliability**: Cohen's Kappa ($\kappa$) untuk kesepakatan dua rater independen dalam menilai kualitas feedback AI dan esai praktikum ($\kappa \ge 0.75$).

### 6.2. Uji Hipotesis Komparatif & Inferensial
1. **Uji Normalitas & Homogenitas**: Shapiro-Wilk Test ($p > 0.05$) dan Levene's Test for Equality of Variances.
2. **Uji Beda Dua Kelompok (H2, H3, H6)**:
   - Jika berdistribusi normal: **Independent Samples $t$-test**.
   - Jika data tidak normal/ordinal: **Mann-Whitney $U$ Test**.
   - Menghitung Effect Size: Cohen's $d$ ($0.2$ = small, $0.5$ = medium, $0.8$ = large):
     $$d = \frac{\bar{X}_1 - \bar{X}_2}{s_{pooled}}$$
3. **Uji Pengaruh Berulang Antar Waktu (Repeated Measures)**:
   - **Repeated-Measures ANOVA** untuk melacak perkembangan stabilitas profil stilistika dari Minggu 1 hingga Minggu 14.
4. **Uji Asosiasi & Korelasi (H7)**:
   - **Pearson's Product-Moment Correlation** ($r$) atau **Spearman's Rank Correlation** ($\rho$) untuk menguji kekuatan transferabilitas baseline kuis ke skor otentisitas esai praktikum.

### 6.3. Evaluasi Metrik Deteksi AI (H1 & H2)
Menguji performa sistem CCAP melawan detektor komersial (Turnitin / GPTZero) menggunakan dataset ground truth yang divalidasi (50 esai asli mahasiswa vs 50 esai yang digenerate AI):

$$\text{Precision} = \frac{TP}{TP + FP}, \quad \text{Recall} = \frac{TP}{TP + FN}$$

$$\text{F1-Score} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$$

$$\text{False-Positive Rate (FPR)} = \frac{FP}{FP + TN} \quad (\text{Target Kritis: } FPR < 3\%)$$

---

## 7. TEKNIK ANALISIS DATA KUALITATIF

Untuk melengkapi dan menjelaskan temuan statistik kuantitatif (*explanatory sequential design*), data wawancara dianalisis menggunakan **Thematic Analysis 6-Fase (Braun & Clarke, 2021)**:

```
FASE 1: Familiarisasi Data (Transkripsi verbatim audio wawancara)
   │
FASE 2: Pembuatan Kode Awal (Generating initial codes dengan NVivo / Atlas.ti)
   │     Contoh kode: [kecemasan-timer-hilang], [merasa-tidak-dituduh-curang]
   │
FASE 3: Pencarian Tema (Searching for overarching themes)
   │
FASE 4: Peninjauan Tema (Reviewing candidate themes terhadap transkrip utuh)
   │
FASE 5: Pendefinisian & Penamaan Tema (Defining and naming 3–5 tema utama)
   │
FASE 6: Penulisan Laporan Naratif (Memilih petikan kutipan mahasiswa yang representatif)
```

### Kriteria Kredibilitas Kualitatif (Lincoln & Guba):
- **Credibility**: Melalui *Member Checking* (mengembalikan ringkasan temuan ke partisipan untuk verifikasi akurasi).
- **Transferability**: Melalui *Thick Description* mengenai konteks detail matakuliah dan karakteristik mahasiswa.
- **Dependability & Confirmability**: Melalui *Audit Trail* log interaksi sistem yang tidak dapat diubah (immutable PostgreSQL audit log).

---

## 8. MITIGASI ANCAMAN VALIDITAS (THREATS TO VALIDITY)

| Ancaman Validitas | Potensi Risiko | Strategi Mitigasi Terpasang |
|:---|:---|:---|
| **Internal: Hawthorne Effect** | Mahasiswa belajar lebih giat karena merasa diteliti | Pengambilan data dilakukan secara transparan dan melekat pada nilai resmi semesteran; tidak ada tugas "buatan riset" di luar RPS. |
| **Internal: History & Maturation** | Peningkatan pemahaman terjadi alami karena bertambahnya minggu | Kelompok Kontrol paralel diajar pada semester dan topik yang sama persis oleh dosen pengampu yang sama. |
| **Construct: LLM Fluctuation** | Model AI cloud berubah atau mengalami penurunan performa | Penerapan arsitektur **Failover Fallback Chaining** (Groq → OpenRouter → Gemini → DeepSeek → Heuristic Offline). |
| **Statistical: Extreme Outliers** | Mahasiswa yang meninggalkan ujian tanpa logout | Sistem mencatat `reset_count` dan filter otomatis durasi idle > 15 menit dari agregasi statistik inferensial. |

---

*Dokumen ini menjadi Bab 4 resmi pada draf disertasi doktoral dan bagian metodologi pada Paper 1, 2, dan 3.*
