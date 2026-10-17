-- ====================================================================
-- Migrasi 03: Pemanasan Reflektif (Warm-up Check-in) & Baseline Orisinalitas
-- ====================================================================

-- 1. Tabel Riwayat Chat Pemanasan Santai (Warm-up Check-in)
CREATE TABLE IF NOT EXISTS student_warmup_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_nim TEXT NOT NULL REFERENCES students(nim) ON DELETE CASCADE,
  module_id INT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  writing_metrics JSONB DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (student_nim, module_id)
);

-- 2. Tambahkan kolom pendukung orisinalitas pada tabel quiz_answers
ALTER TABLE quiz_answers 
ADD COLUMN IF NOT EXISTS authenticity_score INT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS authenticity_notes TEXT DEFAULT NULL;

-- 3. Tambahkan kolom pendukung orisinalitas pada tabel practicum_essays
ALTER TABLE practicum_essays 
ADD COLUMN IF NOT EXISTS authenticity_score INT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS authenticity_notes TEXT DEFAULT NULL;

-- Indeks Performa
CREATE INDEX IF NOT EXISTS idx_warmup_chats_nim ON student_warmup_chats(student_nim);
CREATE INDEX IF NOT EXISTS idx_warmup_chats_module ON student_warmup_chats(module_id);
