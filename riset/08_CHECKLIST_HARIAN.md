# 08 — Checklist Harian & Protokol Operasional Kandidat Doktor
## Panduan Produktivitas Riset: Ritme Kerja Mingguan, Penulisan Disertasi, & Manajemen Promotor

> **Dokumen**: SOP & Checklist Operasional Harian Peneliti  
> **Target**: Menjaga Momentum Akademik Tanpa Mengorbankan Kewajiban Tri Dharma Perguruan Tinggi  
> **Prinsip Utama**: *"Consistency over Intensity — 500 kata berkualitas setiap hari lebih baik daripada 10.000 kata dalam semalam."*  

---

## ⏰ ATURAN EMAS 90 MENIT (THE 90-MINUTE GOLDEN RULE)

Sebagai dosen yang aktif mengajar, melayani mahasiswa, dan menjalankan administrasi prodi, waktu Anda rentan terpecah. Oleh karena itu, tetapkan aturan baku:

> **"90 Menit Pertama Setiap Pagi Khusus untuk Disertasi / Paper."**  
> Dilarang membuka email kampus, WhatsApp grup, atau grading tugas sebelum sesi 90 menit ini selesai. Di waktu inilah otak berada pada kapasitas kognitif tertinggi (*deep work state*).

---

## 🗓️ RITME KERJA MINGGUAN (THE 5-DAY DOCTORAL RHYTHM)

```
SENIN         SELASA & RABU           KAMIS & JUMAT           SABTU               MINGGU
Reading Day   In-Class & Data Day     Writing Deep Work       Code & Analytics    Rest & Review
───────────   ───────────────────     ─────────────────       ────────────────    ─────────────
• Baca 3 paper • Monitor kuis kelas    • Tulis 1.000 kata      • Script mining     • Evaluasi
• Catat di    • Cek log Supabase      • Draf bab / paper      • Refactor fitur    • Siapkan
  Zotero      • Catat anomali         • Edit revisi promotor  • Backup database     minggu depan
```

---

## 📋 CHECKLIST TAHAPAN RISET (PHASE-BY-PHASE CHECKLISTS)

### FASE 1: CHECKLIST HARIAN SAAT PERKULIAHAN BERJALAN (DATA COLLECTION)

#### Sebelum Perkuliahan Dimulai:
- [ ] Buka dashboard Supabase: Pastikan koneksi database aktif dan kuota API Groq / OpenRouter aman.
- [ ] Cek konfigurasi modul aktif: Pastikan nomor modul yang diajarkan hari ini memiliki soal kuis dan warm-up chat yang aktif.
- [ ] Pastikan link kuis dan studio praktikum dapat diakses mahasiswa dari jaringan kampus (wifi/eduroam).

#### Selama Sesi Kelas Nyata:
- [ ] Mahasiswa mulai mengerjakan warm-up check-in: Amati secara visual apakah ada mahasiswa yang bingung menggunakan antarmuka.
- [ ] Kuis dimulai: Catat waktu mulai di papan tulis; perhatikan apakah aktivasi timer berjalan lancar saat ketukan pertama.
- [ ] Amati fenomena kognitif: Apakah ada mahasiswa yang panik saat skor di bawah 80? Bagaimana mereka membaca feedback Socratic AI?
- [ ] Catat 2–3 observasi kualitatif unik di buku catatan lapangan (*Field Notes*).

#### Setelah Perkuliahan Selesai (15 Menit Evaluasi):
- [ ] Buka tabel `student_warmup_chats`: Verifikasi jumlah baris data baru sesuai jumlah mahasiswa yang hadir.
- [ ] Buka tabel `quiz_answers`: Cek apakah kolom `reading_freeze_seconds` dan `attempt_count` terisi angka wajar.
- [ ] Buka tabel `practicum_essays`: Periksa apakah `authenticity_score` berhasil terhitung otomatis oleh Server Actions.
- [ ] Ekspor snapshot backup database mingguan ke file `.sql` / `.csv` lokal ber-timestamp:
  ```bash
  # Contoh penamaan snapshot
  supabase_backup_minggu_03_20261024.sql
  ```

---

### FASE 2: CHECKLIST PENULISAN DRAF DISERTASI & MANUSKRIP (WRITING CHECKLIST)

Gunakan checklist ini setiap kali Anda duduk untuk menulis bab disertasi atau artikel jurnal:

#### Target Kuantitas & Kebersihan Teks:
- [ ] Menulis minimal **500 – 1.000 kata** teks ilmiah baru per hari (di luar kutipan langsung).
- [ ] Setiap klaim teoritis atau temuan fakta wajib memiliki sitasi minimal 1 referensi ber-DOI dari folder `02_KAJIAN_LITERATUR_REFERENSI.md`.
- [ ] Hindari kalimat pasif berlebihan (*"It was found that..."* $\rightarrow$ gunakan *"We found that..."* atau *"Empirical evidence demonstrates that..."*).
- [ ] Pastikan setiap tabel dan grafik memiliki nomor urut, judul jelas, dan diacu di dalam paragraf naskah.

#### Checklist Kualitas Argumentasi Paragraf (Model MEAL):
- [ ] **M — Main Idea**: Kalimat pertama paragraf memuat ide pokok yang tegas.
- [ ] **E — Evidence**: Kalimat kedua menyajikan bukti empiris (data log, skor $p$-value, kutipan literatur).
- [ ] **A — Analysis**: Kalimat ketiga dan keempat mengulas MENGAPA bukti tersebut penting dan apa kaitannya dengan Aksioma CCAPT.
- [ ] **L — Link**: Kalimat terakhir menghubungkan pemikiran ke paragraf berikutnya atau kembali ke Research Question.

---

### FASE 3: PROTOKOL KONSULTASI BERSAMA TIM PROMOTOR S3

Promotor adalah mitra strategis kelulusan Anda. Maksimalkan efektivitas bimbingan dengan protokol berikut:

#### Sebelum Jadwal Bimbingan (H-3):
- [ ] Kirim dokumen naskah yang ingin dikonsultasikan via email dalam format Word (`.docx`) dan PDF.
- [ ] **DILARANG** mengirim naskah tanpa surat pengantar (*Cover Letter* bimbingan). Selalu sertakan ringkasan:
  1. Bagian apa yang baru ditambahkan/direvisi sejak pertemuan terakhir (halaman berapa).
  2. Pertanyaan kunci atau kebuntuan spesifik yang membutuhkan pertimbangan Promotor (maksimal 3 poin).
  3. Kemajuan publikasi paper (status submit / review).

#### Format Agenda Bimbingan (1 Halaman):
```
AGENDA BIMBINGAN DISERTASI KE-[X]
Nama Mahasiswa : [Nama Anda]
Topik Naskah   : Draf Bab 3 (Penurunan Aksioma CCAPT)
Tanggal        : [Hari, Tanggal, Jam]

1. Ringkasan Progress 2 Minggu Terakhir:
   - Menyelesaikan draf Bab 3 setebal 45 halaman.
   - Mengambil data kuis Modul 4 & 5 (total 84 mahasiswa terekam).
   - Manuskrip Paper 1 mencapai draf 80%.

2. Poin Diskusi Utama yang Membutuhkan Arahan Promotor:
   - Apakah formulasi rumus Jarak Mahalanobis pada halaman 18 sudah cukup memadai?
   - Saran Promotor mengenai pemilihan jurnal alternatif jika Elsevier Computers & Education desk-reject.

3. Target Kerja untuk 2 Minggu ke Depan:
   - Menyelesaikan draf Bab 1 & menggabungkan naskah proposal.
```

#### Setelah Bimbingan Selesai (Hari H):
- [ ] Catat seluruh masukan, kritik, dan saran revisi dari Promotor ke dalam catatan resmi (*Minutes of Meeting*).
- [ ] Kirimkan email ucapan terima kasih disertai ringkasan poin revisi yang disepakati sebagai komitmen tertulis.

---

### FASE 4: CHECKLIST SUBMISSION JURNAL INTERNASIONAL (SUBMISSION READINESS)

Sebelum menekan tombol *"Submit Manuscript"* di portal editorial Elsevier / IEEE / Wiley / Springer, periksa kelengkapan berikut:

- [ ] **Aims & Scope Alignment**: Judul dan abstrak naskah selaras 100% dengan fokus jurnal yang dituju.
- [ ] **Guide for Authors Compliance**:
  - Batasan jumlah kata teks utama (*word count*) tidak melebihi ambang (misal: 8.500 kata untuk C&E).
  - Gaya referensi sesuai pedoman (APA 7th Edition untuk Elsevier/Wiley, IEEE Numeric untuk IEEE).
  - Struktur naskah memuat sub-bab wajib: Highlights (3–5 poin), Abstract, Keywords, Introduction, Methods, Results, Discussion, Conclusion.
- [ ] **Kelengkapan Berkas Tambahan (Supplementary Files)**:
  - File *Title Page* terpisah (memuat nama penulis, afiliasi, email korespondensi, ORCID ID, Acknowledgments).
  - File *Blind Manuscript* (nama penulis dan afiliasi dihapus total untuk proses *double-blind review*).
  - File *Cover Letter* kepada Editor-in-Chief (menjelaskan kebaruan, signifikansi riset, dan pernyataan bahwa naskah belum pernah dipublikasikan di tempat lain).
  - File gambar resolusi tinggi (TIFF / EPS / SVG minimal 300 DPI).
  - Formulir *Declaration of Interest* / *Conflict of Interest*.
  - Surat Pernyataan *Ethical Clearance* dari Komite Etik Universitas.
- [ ] **Rekomendasi Reviewer Independen**:
  - Siapkan minimal **3–4 nama reviewer internasional** yang relevan (Nama lengkap, Afiliasi, Email institusi resmi, Bidang keahlian).
  - *Tips*: Pilih penulis dari daftar 76 referensi di dokumen `02_KAJIAN_LITERATUR_REFERENSI.md` yang karyanya banyak Anda kutip secara positif.

---

### FASE 5: CHECKLIST MERESPONS REVISI REVIEWER (REVISION DEFENSE PROTOCOL)

Ketika email keputusan *"Major Revision"* atau *"Minor Revision"* tiba, jangan berkecil hati. Ini adalah berita gembira (naskah Anda tidak ditolak!). Eksekusi langkah berikut:

- [ ] **Istirahatkan Diri 24 Jam**: Baca komentar reviewer dengan tenang; jangan langsung membalas dalam keadaan defensif.
- [ ] Buat dokumen tabel **"Response to Reviewers Matrix"** dengan 3 kolom:
  - Kolom 1: Komentar asli reviewer nomor per nomor (*verbatim*).
  - Kolom 2: Respon dan penjelasan sopan dari penulis (*"We completely agree with the reviewer that..."*).
  - Kolom 3: Lokasi perubahan pada naskah bersih (*"Page 14, Lines 285–302, highlighted in yellow"*).
- [ ] Bersikap sangat sopan dan apresiatif: Selalu awali setiap jawaban dengan ucapan terima kasih atas ketelitian reviewer.
- [ ] Jika Anda tidak setuju dengan saran reviewer, jelaskan dengan argumen ilmiah yang santun disertai rujukan literatur tambahan, tanpa terkesan membantah secara emosional.
- [ ] Unggah naskah revisi tepat waktu sebelum batas tenggat masa revisi berakhir.

---

## 🏆 KATA-KATA PENGUAT MENTAL KANDIDAT DOKTOR

> *"Gelar Doktor bukan bukti bahwa Anda adalah manusia paling jenius di bumi. Gelar Doktor adalah tanda kehormatan bahwa Anda adalah pribadi yang paling gigih, paling tahan banting terhadap penolakan, dan paling setia menyelesaikan apa yang telah Anda mulai."*

**Platform Anda sudah berjalan. Mahasiswa Anda sedang belajar. Data Anda sedang mengalir.**  
Sekarang giliran Anda merangkainya menjadi mahakarya ilmiah. **Bismillah, selamat berjuang Doktor!**
