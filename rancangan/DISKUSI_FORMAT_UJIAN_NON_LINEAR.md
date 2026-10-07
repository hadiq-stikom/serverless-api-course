# Catatan Diskusi Arsitektur & Pedagogi Evaluasi Ujian Kuis

> **Topik Diskusi**: Evaluasi Transisi dari *Gated Linear Mastery* (Satu per Satu) ke *Open Navigation / CBT Style* (Bebas Pilih Nomor Soal).  
> **Status**: ⏳ Ditunda / Belum Selesai (*Pending Continuation*)  
> **Tanggal Pencatatan**: 7 Oktober 2026  

---

## 1. Latar Belakang & Konteks Diskusi

Saat ini, platform perkuliahan *"The Serverless Odyssey"* menerapkan model pengerjaan kuis **Gated Linear Mastery**:
- Mahasiswa mengerjakan soal secara sekuensial (Soal 1 terlebih dahulu).
- Soal 2 baru terbuka jika Soal 1 memperoleh nilai minimal **80** dari evaluasi AI Socratic.
- Jika nilainya $< 80$, mahasiswa dipandu melakukan revisi hingga mencapai ambang batas sebelum melangkah ke soal berikutnya.

### Pertanyaan Diskusi Utama:
> *"Bagaimana jika semua soal dibuka sejak awal sehingga mahasiswa bebas memilih nomor soal yang ingin dikerjakan terlebih dahulu? Apa plus dan minusnya?"*

---

## 2. Analisis Komparatif: Model Linier vs Model Bebas Pilih

### A. Model Saat Ini: Sekuensial Tertutup (*Gated Linear Mastery*)
*Alur: Soal 1 (wajib $\ge 80$) ➔ Soal 2 (wajib $\ge 80$) ➔ Soal 3 (dst.)*

- **Kelebihan (Plus)**:
  1. **Scaffolding Kognitif Terjamin**: Soal didesain berjenjang dari fondasi/definisi (Soal 1–2) menuju analisis arsitektur & sintesis (Soal 4–5). Mahasiswa dipastikan memahami konsep dasar sebelum melompat ke skenario kompleks.
  2. **Fokus Mendalam (*Deep Focus*)**: Mahasiswa tidak terdistraksi melihat soal-soal berikutnya yang terlihat rumit; perhatian tertuju 100% pada satu masalah di depan mata.
  3. **Umpan Balik Sokrates Seketika**: Pembelajaran aktif (*active learning*) langsung terbentuk saat mahasiswa merevisi jawaban hingga tuntas.

- **Kekurangan (Minus)**:
  1. **Risiko *Mental Block* / *Stuck* Total**: Jika mahasiswa buntu di Soal 1, mereka **terkunci total** dan tidak bisa menyentuh Soal 2–5, padahal materi Soal 2–5 mungkin sangat mereka kuasai.
  2. **Menghilangkan Strategi Ujian Alami**: Mahasiswa terbiasa strategi umum: *"kerjakan yang mudah dulu untuk mengamankan poin, baru kerjakan yang sulit"*. Model linier menghilangkan kebebasan strategi ini.
  3. **Tekanan Stres & Timer Ekstrem**: Timer berjalan saat mahasiswa macet di satu soal, memicu kepanikan dan risiko pelanggaran/reset layar.

---

### B. Model Usulan: Bebas Pilih Nomor (*Open Navigation / Non-Linear CBT*)
*Alur: Seluruh soal (1–5) terbuka sejak awal. Mahasiswa bebas melompat ke nomor berapa saja.*

- **Kelebihan (Plus)**:
  1. **Membangun *Self-Efficacy* (Percaya Diri)**: Mahasiswa dapat memilih soal yang paling mereka kuasai lebih dulu. Nilai tinggi di awal membangun momentum mental positif.
  2. **Manajemen Waktu Lebih Rasional**: Mahasiswa bisa menyapu bersih soal-soal konseptual secara cepat, lalu mengalokasikan sisa waktu terbanyak untuk soal analisis yang berat.
  3. **Sangat Selaras dengan Rumus Nilai yang Telah Disepakati**:
     - Skor tiap butir soal diambil dari **nilai tertinggi (MAX)** dari berbagai percobaan.
     - Nilai akhir modul adalah **rata-rata (AVG)** dari skor terbaik seluruh butir soal.
     - Model terbuka membuat mahasiswa bisa mengumpulkan skor terbaik di masing-masing nomor secara mandiri.
  4. **Resilien terhadap Reset & Sesi Perbaikan (*Retake*)**: Mahasiswa tidak perlu mengulang dari Soal 1 jika hanya ingin memperbaiki nilai pada nomor tertentu yang masih rendah.

- **Kekurangan (Minus)**:
  1. **Peluang Melewatkan Konsep Dasar**: Mahasiswa mungkin langsung mencoba soal tingkat lanjut tanpa membaca/memahami konsep fondasi pada soal-soal awal.
  2. **Penyesuaian Mekanisme Pemicu AI Evaluator**: Perlu diputuskan apakah AI mengevaluasi per butir soal saat tombol *"Uji Jawaban"* diklik, atau mengevaluasi seluruh soal sekaligus di akhir. *(Rekomendasi: tetap per butir soal agar interaksi Socratic tetap hidup).*
  3. **Penyesuaian Sistem Timer**: Timer akumulatif per soal (*Fischer Time Bank*) harus dialihkan ke **Timer Sesi Global Modul** (misalnya 25–30 menit untuk 5 soal sekaligus).

---

## 3. Matriks Perbandingan Cepat

| Parameter | Model Sekuensial (Saat Ini) | Model Bebas Pilih (Usulan) |
| :--- | :--- | :--- |
| **Beban Stres Kognitif** | Tinggi *(risiko terblokir di soal awal)* | Rendah–Sedang *(ada kontrol mandiri)* |
| **Fleksibilitas Strategi** | Kaku *(wajib 1 ➔ 2 ➔ 3)* | Fleksibel *(pilih nomor sesuka urutan)* |
| **Scaffolding Belajar** | Sangat Ketat | Bebas Mandiri |
| **Integrasi Rata-rata Nilai** | Baik | **Sangat Baik & Alami** |
| **Konfigurasi Timer** | Per Soal + Time Rollover | Global Modul (misal: 30 Menit) |
| **Resiko Frustrasi Mahasiswa** | Rawan komplain jika macet di soal 1 | Sangat minim komplain |

---

## 4. Opsi Solusi Rekomendasi: Model Hibrida (*CBT Modern + Live Socratic AI*)

Jika transisi dilakukan nanti, opsi jalan tengah terbaik adalah **Model Hibrida**:

1. **Panel Navigasi Kotak Nomor Soal `[ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]`**:
   - Selalu terlihat di bagian atas lembar kuis.
   - Memiliki indikator warna status dinamis:
     - ⚪ **Abu-abu**: Belum dijawab.
     - 🟡 **Kuning**: Sudah dijawab, namun skor $< 80$ (Perlu Revisi).
     - 🟢 **Hijau**: Lolos tuntas ($\ge 80$).
2. **Evaluasi AI Mandiri per Butir Soal**:
   - Mahasiswa mengetik jawaban di nomor mana pun dan menekan tombol *"Evaluasi Soal Ini"*.
   - AI langsung menilai dan menampilkan umpan balik Socratic.
   - Jika $< 80$, mahasiswa **boleh merevisi sekarang**, ATAU **pindah dulu ke nomor lain** dan kembali merevisinya nanti.
3. **Syarat Kelulusan Modul Tuntas 100%**:
   - Mahasiswa baru dinyatakan selesai jika **seluruh kotak nomor sudah berwarna hijau ($\ge 80$)**.
   - Nilai akhir modul dihitung dari **rata-rata skor terbaik** dari kelima nomor tersebut.

---

## 5. Item yang Perlu Ditinjau Kembali saat Melanjutkan Diskusi

Saat diskusi dilanjutkan pada sesi berikutnya, berikut poin-poin keputusan akhir yang perlu disepakati:
- [ ] Menentukan apakah memilih **Model Bebas Murni** atau **Model Hibrida (Kotak Nomor + Status Hijau/Kuning)**.
- [ ] Menentukan format durasi timer: apakah **Timer Global 30 Menit** per sesi pertemuan.
- [ ] Menentukan perilaku Anti-Cheat (Reset Layar): saat ter-reset, apakah kotak nomor yang sudah hijau tetap aman atau ikut ter-reset.
