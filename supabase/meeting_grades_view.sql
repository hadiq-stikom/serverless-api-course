-- ====================================================================
-- SKRIP VIEW & FUNGSI NILAI PERTEMUAN (MEETING GRADES)
-- "THE SERVERLESS ODYSSEY"
-- 
-- Logika Penilaian Resmi:
-- 1. Per Soal (Question Level):
--    Mahasiswa dapat mencoba berkali-kali pada soal yang sama.
--    Skor yang digunakan adalah SKOR TERTINGGI (MAX) dari seluruh percobaan.
-- 2. Per Pertemuan / Modul (Module Level):
--    Nilai modul yang masuk ke Dashboard Dosen & Mahasiswa adalah
--    NILAI RATA-RATA (AVG) dari skor tertinggi seluruh butir soal.
-- ====================================================================

-- 1. View Rincian Nilai Terbaik per Nomor Soal
CREATE OR REPLACE VIEW v_student_best_question_scores AS
SELECT 
    qa.submission_id,
    qs.student_nim,
    s.full_name AS student_name,
    s.class_group,
    qs.module_id,
    qa.question_number,
    MAX(qa.score) AS best_score,
    COUNT(qa.id) AS attempt_count,
    BOOL_OR(qa.is_passed) AS has_passed
FROM quiz_answers qa
JOIN quiz_submissions qs ON qs.id = qa.submission_id
JOIN students s ON s.nim = qs.student_nim
GROUP BY 
    qa.submission_id,
    qs.student_nim,
    s.full_name,
    s.class_group,
    qs.module_id,
    qa.question_number;

-- 2. View Nilai Akhir Modul (Rata-rata dari Nilai Tertinggi Tiap Soal)
CREATE OR REPLACE VIEW v_student_meeting_grades AS
SELECT 
    qs.id AS submission_id,
    qs.student_nim,
    s.full_name AS student_name,
    s.class_group,
    qs.module_id,
    qs.status,
    qs.reset_count,
    COUNT(bqs.question_number) AS answered_questions_count,
    -- Nilai Rata-rata dari nilai tertinggi semua soal yang dijawab (dibulatkan 2 desimal)
    ROUND(AVG(bqs.best_score)::NUMERIC, 2) AS average_module_score,
    qs.started_at,
    qs.completed_at,
    qs.updated_at
FROM quiz_submissions qs
JOIN students s ON s.nim = qs.student_nim
LEFT JOIN v_student_best_question_scores bqs ON bqs.submission_id = qs.id
GROUP BY 
    qs.id,
    qs.student_nim,
    s.full_name,
    s.class_group,
    qs.module_id,
    qs.status,
    qs.reset_count,
    qs.started_at,
    qs.completed_at,
    qs.updated_at;

-- 3. Fungsi Utility untuk Sinkronisasi Otomatis total_score di quiz_submissions
CREATE OR REPLACE FUNCTION sync_quiz_submission_total_score()
RETURNS TRIGGER AS $$
DECLARE
    target_submission_id UUID;
    calculated_avg NUMERIC(5,2);
BEGIN
    target_submission_id := NEW.submission_id;

    -- Hitung rata-rata dari skor terbaik tiap nomor soal
    SELECT ROUND(AVG(best_score)::NUMERIC, 2)
    INTO calculated_avg
    FROM (
        SELECT MAX(score) AS best_score
        FROM quiz_answers
        WHERE submission_id = target_submission_id
        GROUP BY question_number
    ) sub;

    -- Perbarui total_score pada tabel quiz_submissions
    UPDATE quiz_submissions
    SET 
        total_score = COALESCE(calculated_avg, 0),
        updated_at = NOW()
    WHERE id = target_submission_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger Otomatis: Setiap ada jawaban baru dimasukkan ke quiz_answers,
-- total_score pada quiz_submissions otomatis diperbarui ke rata-rata nilai terbaik
DROP TRIGGER IF EXISTS trg_sync_submission_score ON quiz_answers;
CREATE TRIGGER trg_sync_submission_score
AFTER INSERT OR UPDATE ON quiz_answers
FOR EACH ROW
EXECUTE FUNCTION sync_quiz_submission_total_score();
