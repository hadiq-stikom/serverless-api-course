-- ====================================================================
-- SEED DATA MAHASISWA KELAS SP5.1
-- Jalankan skrip ini di SQL Editor Supabase:
-- https://supabase.com/dashboard/project/_/sql/new
-- ====================================================================

INSERT INTO students (nim, full_name, class_group)
VALUES
  ('1123102110', 'KIKY RESTU NOVIANSYAH', 'sp5.1'),
  ('1123102159', 'MOHAMMAD AKMAL HAFID ASYAFFAK', 'sp5.1'),
  ('1124102161', 'IZZA AULIA MAGHFIROH', 'sp5.1'),
  ('1124102162', 'RAFLI RAHMAN EFENDY', 'sp5.1'),
  ('1124102163', 'GUS WAHYU ENDIK ROHMAT', 'sp5.1'),
  ('1124102164', 'DZAKY ARIENDRA DHAIFULLAH YULIANTO', 'sp5.1'),
  ('1124102166', 'BINTANG FATHIR FADILAH ACHMAD', 'sp5.1'),
  ('1124102167', 'KHODIJAH QONITA', 'sp5.1'),
  ('1124102168', 'LUKMANUL HAKIM', 'sp5.1'),
  ('1124102172', 'DILLA ALFIA PUTRI', 'sp5.1'),
  ('1124102181', 'IMTINAN JENY MAULIDAH BELVARIYANTO', 'sp5.1'),
  ('1124102182', 'AHMAD FIRDAUS', 'sp5.1'),
  ('1124102188', 'DARMA ADHYAKSA PUTRA', 'sp5.1'),
  ('1124102193', 'M RAVI ACHYAR TRISTA ZHAID', 'sp5.1'),
  ('1124102194', 'MOZAKIYATUN NUFUS', 'sp5.1'),
  ('1124102195', 'SCENDY APRIANDA ISLAMY', 'sp5.1'),
  ('1124102196', 'MUHAMAD LATIFUL MINAN', 'sp5.1')
ON CONFLICT (nim) DO UPDATE 
SET 
  full_name = EXCLUDED.full_name,
  class_group = EXCLUDED.class_group,
  updated_at = now();
