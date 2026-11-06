/**
 * Standar Skala Penilaian Akademik Resmi:
 * 90 - 100 = A  (Istimewa / Sangat Memuaskan)
 * 80 - 89  = AB (Sangat Baik)
 * 70 - 79  = B  (Baik)
 * 60 - 69  = BC (Cukup Baik)
 * 50 - 59  = C  (Cukup / Batas Lulus)
 * 40 - 49  = CD (Kurang / Perlu Perbaikan)
 * 30 - 39  = D  (Kurang / Tidak Lulus)
 *  0 - 29  = E  (Gagal / Mengulang)
 */

export type GradeLetter = "A" | "AB" | "B" | "BC" | "C" | "CD" | "D" | "E";

export interface GradeTier {
  grade: GradeLetter;
  range: string;
  min: number;
  max: number;
  dot: string;
  border: string;
  text: string;
  bg: string;
}

export const GRADE_TIERS: GradeTier[] = [
  {
    grade: "A",
    range: "90 - 100",
    min: 90,
    max: 100,
    dot: "bg-amber-400",
    border: "border-amber-400/40",
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    grade: "AB",
    range: "80 - 89",
    min: 80,
    max: 89,
    dot: "bg-blue-400",
    border: "border-blue-400/40",
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    grade: "B",
    range: "70 - 79",
    min: 70,
    max: 79,
    dot: "bg-emerald-400",
    border: "border-emerald-400/40",
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    grade: "BC",
    range: "60 - 69",
    min: 60,
    max: 69,
    dot: "bg-cyan-400",
    border: "border-cyan-400/40",
    text: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    grade: "C",
    range: "50 - 59",
    min: 50,
    max: 59,
    dot: "bg-yellow-400",
    border: "border-yellow-400/40",
    text: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    grade: "CD",
    range: "40 - 49",
    min: 40,
    max: 49,
    dot: "bg-orange-400",
    border: "border-orange-400/40",
    text: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    grade: "D",
    range: "30 - 39",
    min: 30,
    max: 39,
    dot: "bg-rose-400",
    border: "border-rose-400/40",
    text: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    grade: "E",
    range: "0 - 29",
    min: 0,
    max: 29,
    dot: "bg-zinc-400",
    border: "border-zinc-400/40",
    text: "text-zinc-600 dark:text-zinc-400",
    bg: "bg-zinc-500/10",
  },
];

export function getGradeLetter(score: number): GradeLetter {
  const rounded = Math.round(Number(score) || 0);
  if (rounded >= 90) return "A";
  if (rounded >= 80) return "AB";
  if (rounded >= 70) return "B";
  if (rounded >= 60) return "BC";
  if (rounded >= 50) return "C";
  if (rounded >= 40) return "CD";
  if (rounded >= 30) return "D";
  return "E";
}

export function getGradeBadgeStyle(grade: GradeLetter): string {
  switch (grade) {
    case "A":
      return "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30";
    case "AB":
      return "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30";
    case "B":
      return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
    case "BC":
      return "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30";
    case "C":
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30";
    case "CD":
      return "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30";
    case "D":
      return "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30";
    case "E":
    default:
      return "bg-zinc-500/20 text-zinc-700 dark:text-zinc-400 border-zinc-500/30";
  }
}

export function getGradePredicate(score: number): {
  grade: GradeLetter;
  label: string;
  color: string;
  border: string;
  bg: string;
  passed: boolean;
} {
  const grade = getGradeLetter(score);
  switch (grade) {
    case "A":
      return {
        grade,
        label: "A (Istimewa / Sangat Memuaskan)",
        color: "amber",
        border: "border-amber-500/40",
        bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        passed: true,
      };
    case "AB":
      return {
        grade,
        label: "AB (Sangat Baik)",
        color: "blue",
        border: "border-blue-500/40",
        bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        passed: true,
      };
    case "B":
      return {
        grade,
        label: "B (Baik)",
        color: "emerald",
        border: "border-emerald-500/40",
        bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        passed: true,
      };
    case "BC":
      return {
        grade,
        label: "BC (Cukup Baik)",
        color: "cyan",
        border: "border-cyan-500/40",
        bg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
        passed: true,
      };
    case "C":
      return {
        grade,
        label: "C (Cukup / Lulus)",
        color: "yellow",
        border: "border-yellow-500/40",
        bg: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
        passed: true,
      };
    case "CD":
      return {
        grade,
        label: "CD (Kurang / Perlu Perbaikan)",
        color: "orange",
        border: "border-orange-500/40",
        bg: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
        passed: false,
      };
    case "D":
      return {
        grade,
        label: "D (Kurang / Tidak Lulus)",
        color: "rose",
        border: "border-rose-500/40",
        bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
        passed: false,
      };
    case "E":
    default:
      return {
        grade,
        label: "E (Gagal / Mengulang)",
        color: "zinc",
        border: "border-zinc-500/40",
        bg: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
        passed: false,
      };
  }
}

