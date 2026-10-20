# 04 — Kerangka Teori: Continuous Contextual Authenticity Profiling Theory (CCAPT)
## Landasan Teori Baru Penilaian Formatif di Era Kecerdasan Buatan Generatif

> **Dokumen**: Perumusan Grand Theory Disertasi Doktoral  
> **Nama Teori**: *Continuous Contextual Authenticity Profiling Theory (CCAPT)*  
> **Klasifikasi**: *Middle-Range Educational Technology & Measurement Theory*  
> **Status**: Draf Teori Baku untuk Pengajuan Sidang Proposal Disertasi  

---

## 1. LATAR BELAKANG EPISTEMOLOGIS & PROBLEM FORMATION

Selama lebih dari lima dekade, evaluasi integritas karya tulis akademik bertumpu pada **Paradigma Klasifikasi Teks Statis (Static Text Classification Paradigm)**:
1. Mahasiswa mengumpulkan artefak final (makalah / jawaban kuis / laporan praktikum).
2. Sistem mencocokkan artefak tersebut dengan basis data dokumen lain (*string matching* atau *n-gram similarity* seperti Turnitin).
3. Munculnya LLM (2022–sekarang) memicu lahirnya *AI Detectors* berbasis perplexity dan burstiness classifier.

### Kegagalan Fundamental Paradigma Lama:
- **Krisis Non-Invertibilitas AI**: Teks yang digenerate oleh AI dapat dimodifikasi secara instan dengan prompt parafrase sederhana, merusak sinyal perplexity detektor.
- **Asumsi Keheningan Konteks (Context-Blind Assumption)**: Detektor memperlakukan teks tanpa memedulikan siapa yang menulis, bagaimana proses berpikirnya, dan materi apa yang sedang dipelajari.
- **Bias Hukuman Struktural (Palliative & Punitive Bias)**: Mahasiswa dengan penguasaan bahasa formal terbatas (termasuk penulis non-native / ESL / EFL) memiliki variasi kata yang lebih rendah, sehingga secara keliru sering dicap sebagai hasil generate AI (Liang et al., 2023).

**CCAPT lahir sebagai pergeseran paradigma (paradigm shift)**: dari *pemeriksaan artefak statis di hilir* beralih ke *perekaman jejak kognitif berkelanjutan di hulu*.

```
PARADIGMA LAMA (Punitif & Hilir):
Mahasiswa ──────────> Bikin Tugas ──────────> Submit Dokumen ──────────> Detektor AI (Vonis Curang!)
                                                                         [Tinggi False Positive]

PARADIGMA CCAPT (Formatif & Hulu):
Mahasiswa ───> Warm-up Chat ───> Bangun Profil Dinamis ───> Kerjakan Ujian ───> Evaluasi Reflektif
              (Santai & Konteks)  (Vector Stylometrics)      (Timer Adaptif)     (Dialog Dosen-Mhs)
```

---

## 2. LANDASAN TEORITIS INTEGRATIF (THEORETICAL ANCHORS)

CCAPT dibangun di atas persimpangan empat teori besar yang telah teruji:

```
                        ┌────────────────────────────────────────┐
                        │      CONSTRUCTIVISM & FORMATIVE        │
                        │      ASSESSMENT THEORY (Black & Wiliam)│
                        └──────────────────┬─────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
┌──────────────────┐             ┌──────────────────┐             ┌──────────────────┐
│ STYLOMETRICS &   │             │ COGNITIVE LOAD   │             │ MASTERY LEARNING │
│ COMPUTATIONAL    │             │ THEORY (Sweller) │             │ THEORY (Bloom)   │
│ AUTHORSHIP       │             │                  │             │                  │
│ (Stamatatos)     │             │ • Pacing Control │             │ • Threshold ≥ 80 │
│ • Unique voice   │             │ • Stress Relief  │             │ • Multi-attempt  │
└────────┬─────────┘             └────────┬─────────┘             └────────┬─────────┘
         │                                │                                │
         └────────────────────────────────┼────────────────────────────────┘
                                          ▼
                      ┌───────────────────────────────────────┐
                      │             TEORI CCAPT               │
                      │  Continuous Contextual Authenticity   │
                      │           Profiling Theory            │
                      └───────────────────────────────────────┘
```

1. **Formative Assessment Theory (Black & Wiliam, 1998, 2021)**: Asesmen bukan alat penghakim kelulusan semata, melainkan mesin umpan balik untuk memandu penyempurnaan pemahaman saat belajar sedang berlangsung.
2. **Computational Stylometrics (Mosteller & Wallace, 1964; Stamatatos, 2022)**: Kebiasaan linguistik bawah sadar (panjang kalimat, partikel fungsional, rasio leksikal) membentuk "sidik jari kepengarangan" (*authorship fingerprint*) yang sangat sulit dipalsukan secara konsisten oleh orang lain maupun AI umum.
3. **Cognitive Load Theory (Sweller et al., 2020)**: Membatasi beban luar (*extraneous load*) melalui antarmuka ujian adaptif memungkinkan memori kerja mahasiswa fokus 100% pada pemecahan masalah konseptual (*germane load*).
4. **Mastery Learning Theory (Bloom, 1968; Guskey, 2020)**: Menetapkan standar penguasaan tinggi ($\ge 80$) dengan kesempatan revisi tak terbatas yang dipandu bimbingan dialogis.

---

## 3. FORMULASI MATEMATIS & ALGORITMIK CCAPT

### 3.1. Vektor Fitur Stilistika Mahasiswa ($\vec{S}_i$)
Untuk setiap mahasiswa $i$, pada modul pembelajaran $m$, diekstrak vektor profil $k$-dimensi dari respon percakapan warm-up santai:

$$\vec{S}_{i,m} = \left\langle \mu_{len}, \tau_{ttr}, \delta_{conn}, \rho_{tech}, \eta_{hedge}, \sigma_{var} \right\rangle$$

Di mana:
- $\mu_{len}$: Rata-rata panjang kata dan kalimat (Mean Sentence Length).
- $\tau_{ttr}$: *Type-Token Ratio* ($V / \sqrt{N}$), mengukur keragaman kosakata aktif.
- $\delta_{conn}$: Kepadatan kata hubung logis (*"karena"*, *"sehingga"*, *"ibaratnya"*, *"jadi"*).
- $\rho_{tech}$: Rasio terminologi teknis domain serverless (misal: *RLS*, *Edge*, *BaaS*, *Webhook*).
- $\eta_{hedge}$: Frekuensi ungkapan modalitas/keraguan (*"mungkin"*, *"menurut saya"*, *"sepertinya"*).
- $\sigma_{var}$: Variansi burstiness struktur antar-paragraf.

### 3.2. Pembaruan Profil Dinamis Berbobot Waktu (Dynamic Profile Weighting)
Profil seorang mahasiswa tidak bersifat beku; ia bertransformasi seiring peningkatan wawasan. CCAPT memodelkan profil referensi aktif $\vec{P}_{i,T}$ pada modul $T$ menggunakan pembobotan eksponensial historis:

$$\vec{P}_{i,T} = \sum_{t=1}^{T} w_t \cdot \vec{S}_{i,t}, \quad \text{dengan } w_t = \frac{e^{\lambda(t - T)}}{\sum_{j=1}^{T} e^{\lambda(j - T)}}$$

Di mana $\lambda > 0$ adalah parameter *learning recency decay*. Modul-modul terbaru memiliki pengaruh lebih tinggi terhadap profil gaya bahasa terkini daripada modul awal semester.

### 3.3. Indeks Otentisitas Kontekstual (Contextual Authenticity Index / $\mathcal{A}$)
Ketika mahasiswa mengumpulkan esai (kuis atau laporan praktikum) dengan vektor representasi $\vec{E}_{i,T}$, deviasi stilistika diukur melalui jarak Mahalanobis atau gabungan Cosine-Distance dan Jaccard lexical overlap:

$$\mathcal{D}(\vec{E}_{i,T}, \vec{P}_{i,T}) = 1 - \cos(\vec{E}_{i,T}, \vec{P}_{i,T}) + \alpha \cdot \Delta_{\rho}$$

Skor Otentisitas Akhir ($\mathcal{A} \in [0, 100]$):

$$\mathcal{A}(E) = 100 \times \left(1 - \frac{1}{1 + e^{-\beta (\mathcal{D} - \theta_0)}}\right)$$

- Jika $\mathcal{A} \ge 80$: **Otentisitas Tinggi** (Selaras penuh dengan suara kepengarangan mahasiswa).
- Jika $60 \le \mathcal{A} < 80$: **Moderasi / Investigasi Formatif** (Terdapat lonjakan kosa kata mendadak, dosen meninjau catatan audit).
- Jika $\mathcal{A} < 60$: **Deviasi Ekstrem** (Indikasi kuat salin-tempel prompt AI mentah tanpa internalisasi).

---

## 4. TIGA AKSIOMA CCAPT & DERIVASI ILMIAH

### Aksioma 1: Cognitive Uniqueness Axiom (CUA)
> *"Pola pengungkapan kognitif manusia dalam teks bersifat khas secara individu dan memiliki kestabilan intrapersonal yang dapat dipisahkan secara komputasional dari gaya bahasa orang lain maupun teks generatif buatan mesin."*

**Landasan Empiris**: Dibuktikan oleh Stamatatos (2022) dan Neal et al. (2020) bahwa fungsi kata gramatikal dan ritme kalimat seseorang merefleksikan arsitektur kognitif yang telah terkristalisasi bertahun-tahun. Generator AI memproduksi teks dengan distribusi kemungkinan kata yang sangat rata (*uniform probability*), sedangkan tulisan manusia menunjukkan ketidakteraturan dinamis (*irregular bursts*).

---

### Aksioma 2: Dynamic Contextualization Axiom (DCA)
> *"Baseline otentisitas hanya memiliki daya validitas inferensial jika diekstraksi dari lingkungan domain pengetahuan yang setara dan terus diperbarui secara sinkron seiring pematangan kompetensi mahasiswa."*

**Landasan Empiris**: Altakrori et al. (2023) membuktikan ekstraksi kepengarangan lintas domain (misal: gaya obrolan media sosial dibawa ke artikel medis) mengalami degradasi akurasi hingga 44%. Oleh karena itu, CCAPT mewajibkan obrolan pemanasan *warm-up* tetap berjangkar pada topik teknis modul terkait (misal: mendiskusikan *bug* arsitektur serverless) sebelum profil dibandingkan dengan esai praktikum arsitektur serverless.

---

### Aksioma 3: Formative Integrity Axiom (FIA)
> *"Sistem evaluasi integritas akademik yang berkelanjutan harus berfungsi sebagai cermin refleksi formatif yang memanusiakan mahasiswa, bukan sebagai instrumen pengawasan panoptikon yang mematikan rasa percaya diri dan daya nalar kritis."*

**Landasan Empiris**: Dawson (2021) dan Bearman & Ajjawi (2023) menunjukkan bahwa sistem deteksi AI punitif menciptakan *atmosphere of distrust* yang memicu resistensi mahasiswa dan merusak motivasi intrinsik belajar. CCAPT menolak vonis biner "Curang / Tidak Curang". Skor otentisitas disajikan sebagai sarana dialog akademik antara mahasiswa dan dosen pengampu.

---

## 5. HUBUNGAN ANTAR-VARIABEL (CONCEPTUAL PROPOSITIONAL NETWORK)

Berdasarkan ketiga aksioma di atas, dirumuskan proposisi teoritis yang diuji oleh 8 Hipotesis Empiris:

```
    [Conversational Warm-up Engine]
                 │
                 ▼ (Ekstraksi Ciri Linguistik)
    [Dynamic Stylometric Profile] ────────┐
                 │                        │
                 ▼                        ▼ (Uji Asosiasi Transferabilitas)
    [Baseline-Referenced Evaluator] ───> [Cross-Pillar Authenticity Score]
                 ▲                                │
                 │                                ▼
    [Adaptive Timer Scaffolding]        [Peningkatan Kualitas Proyek Akhir]
    • First-keystroke activation         & Pengurangan Kecemasan Kognitif
    • Reading & AI Latency Freeze
```

| Proposisi Teoritis | Hipotesis Terkait | Indikator Keberhasilan |
|:---|:---:|:---|
| **P1**: Ekstraksi profil konteks spesifik mengungguli detektor global. | **H1, H2** | $F1 > 0.88$, False-Positive Rate $< 3\%$ |
| **P2**: Scaffolding timer adaptif mereduksi extraneous load. | **H3** | Skor NASA-TLX turun signifikan ($p < 0.01, d > 0.60$) |
| **P3**: Bimbingan dialogis multi-LLM mempertahankan integritas kognitif. | **H4** | Skor Rubrik Pedagogis $\ge 4.2 / 5.0$ |
| **P4**: Profil dinamis lebih andal dibanding profil statis satu kali. | **H5** | Variansi skor antar-pekan homogen ($p > 0.05$) |
| **P5**: Snowballing project memfasilitasi internalisasi kompetensi utuh. | **H6** | Rata-rata nilai UAS proyek eksperimen $>$ kontrol ($p < 0.01$) |
| **P6**: Profil linguistik kuis bertransfer ke analisis laporan ilmiah. | **H7** | Korelasi Pearson $r > 0.65$ ($p < 0.001$) |
| **P7**: Mahasiswa memandang sistem sebagai pendukung belajar yang adil. | **H8** | Skor SUS $\ge 70$ (Good) dan persepsi keadilan tinggi |

---

## 6. PERBANDINGAN KOMPARATIF CCAPT DENGAN TEORI ASESMEN LAIN

| Parameter Evaluasi | Classical Test Theory (CTT) | Item Response Theory (IRT) | Plagiarism / AI Detector Model | **CCAPT (Teori Usulan Disertasi)** |
|:---|:---:|:---:|:---:|:---:|
| **Fokus Pengukuran** | Skor Kebenaran Jawaban | Probabilitas Latent Trait ($\theta$) | Kesamaan Teks / Perplexity | **Otentisitas Suara Nalar Mahasiswa** |
| **Dimensi Waktu** | Satu Titik (Cross-sectional) | Satu Titik Ujian | Pasca-Submit (Post-hoc) | **Berkelanjutan Longitudinal (16 Pekan)** |
| **Perlakuan Konteks** | Diabaikan (Standardized) | Dikalibrasi per Butir Soal | Diabaikan | **Terkontekstualisasi Domain Penuh** |
| **Dukungan Waktu Kognitif** | Waktu Kaku Menit | Waktu Kaku / Rata-rata Butir | Tidak Relevan | **Adaptive First-Keystroke & Freezes** |
| **Peran Pengajar** | Pemeriksa Lembar Ujian | Pengamat Kurva Karakteristik | Polisi Akademik / Hakim | **Mentor Reflektif & Auditor Formatif** |
| **Output Sistem** | Angka Skor Mentah | Estimasi Kemampuan ($\theta$) | Label Persentase Curang | **Profil Gaya, Skor Keaslian, Umpan Balik Dialogis** |

---

*Dokumen ini menjadi Bab 3 resmi Disertasi S3 dan fondasi konseptual penulisan Paper 1.*
