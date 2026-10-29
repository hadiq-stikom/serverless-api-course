export interface StudentImportItem {
  nim: string;
  fullName: string;
  classGroup: string;
}

/**
 * Parser teks mentah (CSV / Tab-delimited / Baris Excel) menjadi daftar mahasiswa
 */
export function parseRawStudentsText(
  rawText: string,
  defaultClass = "sp5.1"
): StudentImportItem[] {
  const lines = rawText.trim().split(/\r?\n/).filter((line) => line.trim().length > 0);
  const items: StudentImportItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Lewatkan header jika ada
    if (
      /^(no|nim|nama|kelas|student|id|name|class)[\t,; ]/i.test(trimmed) ||
      /^(nim|nama|kelas)$/i.test(trimmed)
    ) {
      continue;
    }

    // Dukung pemisah tab (Excel copy-paste), koma, titik koma, atau multiple spaces
    let parts: string[] = [];
    if (trimmed.includes("\t")) {
      parts = trimmed.split("\t");
    } else if (trimmed.includes(";")) {
      parts = trimmed.split(";");
    } else if (trimmed.includes(",")) {
      parts = trimmed.split(",");
    } else {
      parts = trimmed.split(/\s{2,}/); // 2 spasi atau lebih
    }

    // Bersihkan nilai setiap bagian
    const cleanParts = parts
      .map((p) => p.trim().replace(/^["']|["']$/g, ""))
      .filter((p) => p.length > 0);

    if (cleanParts.length === 0) continue;

    // Jika kolom pertama adalah nomor urut (contoh: "1 \t 1124102161 \t IZZA ...")
    let nimIndex = 0;
    if (
      cleanParts.length >= 3 &&
      /^\d{1,4}$/.test(cleanParts[0]) &&
      /^\d{5,}$/.test(cleanParts[1])
    ) {
      nimIndex = 1; // Kolom 0 adalah nomor urut
    }

    const nim = cleanParts[nimIndex];
    const fullName = cleanParts[nimIndex + 1];
    const classGroup = cleanParts[nimIndex + 2] || defaultClass;

    if (nim && fullName && nim.length >= 4) {
      items.push({
        nim: nim.trim(),
        fullName: fullName.trim(),
        classGroup: classGroup.trim(),
      });
    }
  }

  return items;
}
