-- ====================================================================
-- MIGRATION: 04_uts_evaluations.sql
-- TABEL EVALUASI PRESENTASI PROYEK UTS (MILESTONE 1)
-- Platform Pembelajaran: "The Serverless Odyssey"
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.project_uts_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_nim TEXT NOT NULL UNIQUE REFERENCES public.students(nim) ON DELETE CASCADE,
    project_title TEXT DEFAULT '',
    github_url TEXT DEFAULT '',
    demo_url TEXT DEFAULT '',
    
    -- 5 Kriteria Penilaian Berbobot Resmi RPS UTS:
    score_concept NUMERIC(5,2) DEFAULT 0 CHECK (score_concept >= 0 AND score_concept <= 100),       -- 1. Pemahaman Konsep (25%)
    score_architecture NUMERIC(5,2) DEFAULT 0 CHECK (score_architecture >= 0 AND score_architecture <= 100),  -- 2. Kesesuaian Arsitektur (25%)
    score_prompt NUMERIC(5,2) DEFAULT 0 CHECK (score_prompt >= 0 AND score_prompt <= 100),        -- 3. Konstruksi Prompt (20%)
    score_features NUMERIC(5,2) DEFAULT 0 CHECK (score_features >= 0 AND score_features <= 100),      -- 4. Kesesuaian Alur & Fitur (20%)
    score_ui_ux NUMERIC(5,2) DEFAULT 0 CHECK (score_ui_ux >= 0 AND score_ui_ux <= 100),         -- 5. Estetika UI/UX (10%)
    
    -- Nilai Akhir Tertimbang (0 - 100)
    final_score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (final_score >= 0 AND final_score <= 100),
    
    -- Feedback & Catatan Evaluasi Dosen
    feedback_notes TEXT DEFAULT '',
    
    -- Status Penilaian
    status TEXT NOT NULL DEFAULT 'graded' CHECK (status IN ('draft', 'graded', 'revision_required')),
    
    -- Metadata Dosen & Timestamp
    evaluated_by TEXT, -- NIDN Dosen
    evaluated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeks untuk pencarian cepat
CREATE INDEX IF NOT EXISTS idx_uts_eval_student_nim ON public.project_uts_evaluations(student_nim);
CREATE INDEX IF NOT EXISTS idx_uts_eval_final_score ON public.project_uts_evaluations(final_score);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.project_uts_evaluations ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses RLS
DROP POLICY IF EXISTS "Allow read project_uts_evaluations for all" ON public.project_uts_evaluations;
CREATE POLICY "Allow read project_uts_evaluations for all"
ON public.project_uts_evaluations
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow all for authenticated/service role" ON public.project_uts_evaluations;
CREATE POLICY "Allow all for authenticated/service role"
ON public.project_uts_evaluations
FOR ALL
USING (true)
WITH CHECK (true);
