/**
 * Rumus Resmi Perhitungan Nilai Akhir UTS (Milestone 1):
 * - Pemahaman Konsep: 25%
 * - Kesesuaian Arsitektur: 25%
 * - Konstruksi Prompt: 20%
 * - Kesesuaian Alur & Fitur: 20%
 * - Estetika UI/UX: 10%
 */
export function calculateUtsFinalScore(scores: {
  concept: number;
  architecture: number;
  prompt: number;
  features: number;
  ui_ux: number;
}): number {
  const c = Math.max(0, Math.min(100, Number(scores.concept) || 0));
  const a = Math.max(0, Math.min(100, Number(scores.architecture) || 0));
  const p = Math.max(0, Math.min(100, Number(scores.prompt) || 0));
  const f = Math.max(0, Math.min(100, Number(scores.features) || 0));
  const u = Math.max(0, Math.min(100, Number(scores.ui_ux) || 0));

  const total = (c * 0.25) + (a * 0.25) + (p * 0.20) + (f * 0.20) + (u * 0.10);
  return Math.round(total * 100) / 100;
}
