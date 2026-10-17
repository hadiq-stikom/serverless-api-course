// src/data/warmup-prompts.ts
// Pertanyaan santai & reflektif untuk sesi pemanasan (Warm-up Check-in) sebelum Uji Pemahaman

export type WarmupFormatType =
  | "hot_take"        // Debat Santai di Kafe
  | "bug_detective"   // Detektif Bug & Kasus Misteri
  | "aha_moment"      // Curhat & Titik Balik Pemahaman
  | "client_scenario" // Skenario Klien / Rekan Kerja
  | "this_or_that";   // Pilihan Berani (This or That)

export interface WarmupPromptItem {
  moduleId: number;
  formatType: WarmupFormatType;
  formatBadge: string;
  themeTitle: string;
  greeting: string;
  initialQuestion: string;
  contextKeywords: string[];
}

export const WARMUP_PROMPTS: Record<number, WarmupPromptItem> = {
  1: {
    moduleId: 1,
    formatType: "this_or_that",
    formatBadge: "Pilihan Berani (This or That) ⚡",
    themeTitle: "Serverless vs Begadang Setup Server",
    greeting: "Hai! Sebelum mulai Uji Pemahaman Modul 1, yuk ngobrol santai 1–2 menit. Anggap kita lagi ngopi di warung kampus.",
    initialQuestion: "Kalau kamu disuruh bangun startup baru besok pagi: Mending sewa VPS Linux murah tapi harus konfigurasi OS & Nginx sendiri sampai jam 2 pagi, atau langsung deploy Serverless ke Vercel terus tidur nyenyak? Kenapa pilihan itu yang paling bikin kamu mantap?",
    contextKeywords: ["serverless", "faas", "vps", "git", "staging", "commit"],
  },
  2: {
    moduleId: 2,
    formatType: "aha_moment",
    formatBadge: "Curhat & Titik Balik (Aha! Moment) 💡",
    themeTitle: "Momen 'Klik' Server Components",
    greeting: "Halo! Selamat datang di evaluasi Modul 2 tentang Next.js 16 App Router & Shadcn UI.",
    initialQuestion: "Jujur, pas pertama kali mencoba memisahkan Server Component (RSC) dengan Client Component ('use client'), bagian mana yang sempat bikin kamu mikir keras? Terus momen 'aha!'-nya terjadi pas kamu nyadar apa?",
    contextKeywords: ["rsc", "server component", "use client", "shadcn", "bundle size"],
  },
  3: {
    moduleId: 3,
    formatType: "hot_take",
    formatBadge: "Debat Kafe (Hot Take) ☕",
    themeTitle: "Server Actions vs Validasi di Form Saja",
    greeting: "Hai! Di Modul 3 kita menyelami Server Actions RPC dan validasi skema Zod.",
    initialQuestion: "Misal kamu lagi nongkrong bareng sesama programmer, terus ada yang bilang: 'Ngapain repot validasi Zod di server kalau form React di browser udah kita pasang required & regex rapi?'. Kira-kira kamu bakal belain siapa dan gimana argumen santaimu?",
    contextKeywords: ["server actions", "zod", "tampering", "rpc", "validation"],
  },
  4: {
    moduleId: 4,
    formatType: "client_scenario",
    formatBadge: "Skenario Nyata & Analogi 🏢",
    themeTitle: "Analogi ON DELETE CASCADE di Dunia Kampus",
    greeting: "Halo! Di Modul 4 kita merancang database relasional PostgreSQL di Supabase.",
    initialQuestion: "Bayangkan kamu lagi menjelaskan struktur data ke teman yang bukan anak IT: Kalau aturan foreign key ON DELETE CASCADE itu diibaratkan dinamika hubungan pertemanan atau kepanitiaan organisasi kampus, skenario apa yang paling pas menurutmu?",
    contextKeywords: ["postgresql", "foreign key", "cascade", "uuid", "relational"],
  },
  5: {
    moduleId: 5,
    formatType: "bug_detective",
    formatBadge: "Detektif Keamanan 🕵️‍♂️",
    themeTitle: "Misteri Halaman Akun Bocor saat Tombol Back",
    greeting: "Hai! Modul 5 membahas pintu gerbang keamanan: GitHub OAuth dan Edge Middleware.",
    initialQuestion: "Pernah nggak kamu nemu web yang pas kita klik logout terus kita pencet tombol 'Back' di peramban, halaman akunnya masih sempat kelihatan sedetik? Menurut firasat teknismu, apa yang bocor dan gimana Edge Middleware mencegah kejadian memalukan itu?",
    contextKeywords: ["oauth", "edge middleware", "session", "cookie", "redirect"],
  },
  6: {
    moduleId: 6,
    formatType: "hot_take",
    formatBadge: "Debat Kafe (Hot Take) ☕",
    themeTitle: "Satu Backend untuk Dua Dunia",
    greeting: "Halo! Modul 6 mempertemukan kita dengan Server Actions BFF dan Universal REST API.",
    initialQuestion: "Ada rekan tim frontend mobile yang protes: 'Kenapa sih backend kita ada dua jalur? Pakai REST API aja buat semua kan beres!'. Kalau kamu Tech Lead-nya, gimana caramu menjelaskan secara santai kenapa web Next.js lebih enak pakai Server Actions sedangkan mobile butuh REST API?",
    contextKeywords: ["bff", "rest api", "mobile", "json", "endpoint"],
  },
  7: {
    moduleId: 7,
    formatType: "this_or_that",
    formatBadge: "Pilihan Berani (This or That) 🛡️",
    themeTitle: "Satpam Depan Gerbang vs Brankas Kamar (RLS)",
    greeting: "Hai! Modul 7 adalah benteng pertahanan data terpenting: PostgreSQL Row Level Security (RLS).",
    initialQuestion: "Kalau disuruh memilih analogi: Menurutmu RLS di database itu lebih mirip satpam yang memeriksa KTP di gerbang perumahan, atau brankas berpengaman sidik jari di dalam kamar masing-masing warga? Kenapa analogi itu yang paling cocok?",
    contextKeywords: ["rls", "policies", "auth.uid()", "security", "postgres"],
  },
  8: {
    moduleId: 8,
    formatType: "aha_moment",
    formatBadge: "Curhat & Titik Balik (Aha! Moment) 📸",
    themeTitle: "Keajaiban Transformasi Media Cloudinary",
    greeting: "Halo! Modul 8 membahas optimasi media cloud dan transformasi gambar otomatis.",
    initialQuestion: "Gimana reaksimu waktu melihat gambar resolusi raksasa bisa langsung dipotong, diubah ke WebP, dan di-deliver lewat CDN dalam hitungan milidetik tanpa membebani harddisk server kita sama sekali? Bagian mana yang paling bikin kagum?",
    contextKeywords: ["cloudinary", "cdn", "presigned upload", "image optimization", "webp"],
  },
  9: {
    moduleId: 9,
    formatType: "bug_detective",
    formatBadge: "Detektif Bug 🕵️‍♂️",
    themeTitle: "Teka-teki Optimistic UI vs Jaringan Lemot",
    greeting: "Hai! Modul 9 membawa kita ke reaktivitas tingkat tinggi: Optimistic Updates & Server Actions.",
    initialQuestion: "Bayangkan kamu bikin tombol 'Like', begitu diklik langsung berubah merah seketika. Tapi 3 detik kemudian jaringan server putus! Menurutmu gimana cara terbaik menangani kekecewaan pengguna saat perubahan optimistik itu harus di-rollback?",
    contextKeywords: ["optimistic updates", "useoptimistic", "network failure", "rollback"],
  },
  10: {
    moduleId: 10,
    formatType: "client_scenario",
    formatBadge: "Skenario Klien & Arsitektur 🏢",
    themeTitle: "Webhooks vs Polling Berkala di Jam Sibuk",
    greeting: "Halo! Modul 10 membahas integrasi asinkron melalui Webhooks dan Event-Driven Architecture.",
    initialQuestion: "Klien bertanya: 'Kenapa kita nggak minta server ngecek status pembayaran tiap 2 detik aja sih?'. Gimana caramu menjelaskan analogi perbedaan 'bolak-balik tanya ke resepsionis' (polling) versus 'ditelepon saat kurir paket datang' (webhook)?",
    contextKeywords: ["webhooks", "event-driven", "polling", "async", "signature"],
  },
  11: {
    moduleId: 11,
    formatType: "hot_take",
    formatBadge: "Debat Kafe (Hot Take) ☕",
    themeTitle: "Edge Functions vs Regional Serverless",
    greeting: "Hai! Modul 11 mengeksplorasi komputasi global di tepi jaringan (Edge Computing).",
    initialQuestion: "Ada developer yang bilang: 'Semua fungsi serverless wajib dipindah ke Edge biar secepat kilat!'. Apakah menurutmu semua jenis API cocok ditaruh di Edge, atau kapan kita justru harus tetap pakai server regional biasa?",
    contextKeywords: ["edge computing", "latency", "cdn", "v8 isolates", "regional"],
  },
  12: {
    moduleId: 12,
    formatType: "this_or_that",
    formatBadge: "Pilihan Berani (This or That) 🏢",
    themeTitle: "Multi-tenant RLS vs Pisah Database",
    greeting: "Halo! Modul 12 merancang sistem SaaS Multi-tenant dengan isolasi data tingkat tinggi.",
    initialQuestion: "Pilih mana: Seluruh perusahaan klien disimpan di 1 database yang sama dengan RLS ketat, atau tiap klien punya 1 database PostgreSQL terpisah sendiri? Apa trade-off terbesar yang paling bikin kamu berpikir keras?",
    contextKeywords: ["multi-tenant", "saas", "database isolation", "rls", "tenant_id"],
  },
  13: {
    moduleId: 13,
    formatType: "aha_moment",
    formatBadge: "Curhat & Titik Balik (Aha! Moment) ⚡",
    themeTitle: "Penyelamat Trafik: Stale-While-Revalidate",
    greeting: "Hai! Modul 13 mendalami strategi caching modern dan ISR (Incremental Static Regeneration).",
    initialQuestion: "Kapan momen kamu menyadari betapa mewahnya fitur Stale-While-Revalidate? Bayangkan jutaan pengunjung membaca cache super cepat, sementara hanya 1 request di latar belakang yang memperbarui data ke database!",
    contextKeywords: ["caching", "swr", "isr", "stale-while-revalidate", "cdn"],
  },
  14: {
    moduleId: 14,
    formatType: "bug_detective",
    formatBadge: "Detektif Keamanan 🕵️‍♂️",
    themeTitle: "Misteri Token JWT Expired di Tengah Transaksi",
    greeting: "Halo! Modul 14 mengupas siklus hidup autentikasi: Refresh Token & Silent Re-authentication.",
    initialQuestion: "Pernah lagi asyik mengisi formulir panjang di web, pas klik Submit tiba-tiba error 'Session Expired' dan semua ketikan hilang? Dari kacamata arsitek sistem, gimana cara kita bikin mekanisme auto-refresh token tanpa mengganggu user?",
    contextKeywords: ["jwt", "refresh token", "session expiry", "silent refresh", "auth"],
  },
  15: {
    moduleId: 15,
    formatType: "client_scenario",
    formatBadge: "Skenario Klien & FinOps 💰",
    themeTitle: "Mengendalikan Ledakan Biaya Serverless",
    greeting: "Hai! Modul 15 membahas observabilitas, rate-limiting, dan efisiensi biaya Serverless.",
    initialQuestion: "Bos kamu panik: tagihan cloud serverless tiba-tiba naik 5x lipat gara-gara ada bot yang menyerang salah satu fungsi API kita! Apa 2 langkah mitigasi darurat pertama yang bakal kamu pasang di level Edge?",
    contextKeywords: ["rate limiting", "upstash", "ddos", "serverless costs", "finops"],
  },
  16: {
    moduleId: 16,
    formatType: "this_or_that",
    formatBadge: "Pilihan Berani: Puncak Sintesis 🏆",
    themeTitle: "Refleksi Akhir: Menjadi Full-Stack Serverless Architect",
    greeting: "Selamat datang di Modul Terakhir! Perjalanan 16 minggu 'The Serverless Odyssey' sampai di puncaknya.",
    initialQuestion: "Setelah membangun seluruh pilar dari awal hingga deployment: Kalau kamu melihat diri kamu di Minggu 1 vs Minggu 16 sekarang, perubahan terbesar apa dalam cara kamu memandang arsitektur web modern?",
    contextKeywords: ["serverless odyssey", "full-stack", "architecture", "synthesis", "production"],
  },
};

export function getWarmupPromptForModule(moduleId: number): WarmupPromptItem {
  if (WARMUP_PROMPTS[moduleId]) {
    return WARMUP_PROMPTS[moduleId];
  }
  return {
    moduleId,
    formatType: "hot_take",
    formatBadge: "Refleksi Santai ☕",
    themeTitle: `Eksplorasi Konsep Modul ${moduleId}`,
    greeting: `Halo! Sebelum memulai Uji Pemahaman Modul ${moduleId}, yuk rileks sejenak 1–2 menit agar pikiran segar dan siap fokus.`,
    initialQuestion: `Dari eksplorasi Modul ${moduleId} kemarin, ada satu hal baru atau konsep teknis yang menurutmu paling berkesan atau bikin penasaran?`,
    contextKeywords: [`modul ${moduleId}`, "arsitektur", "serverless"],
  };
}
