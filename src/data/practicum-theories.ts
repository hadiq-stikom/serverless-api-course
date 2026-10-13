// src/data/practicum-theories.ts
// Data landasan teori terstruktur, konsep kunci, matriks komparasi, dan aturan emas untuk Modul Praktikum

export interface KeyConceptPoint {
  id: number;
  title: string;
  badge: string;
  keywords: string[];
  summary: string;
  explanation: string;
  codeSnippet?: {
    filename: string;
    code: string;
    language: string;
  };
  observationGuide: string; // Panduan spesifik untuk mengisi tabel observasi
}

export interface ComparisonRow {
  aspect: string;
  serverComponent?: string;
  clientComponent?: string;
  colA?: string;
  colB?: string;
  badgeVerdict: "rsc-win" | "client-win" | "neutral";
  verdictText: string;
}

export interface GoldenRuleItem {
  id: number;
  title: string;
  type: "dos" | "donts" | "warning";
  badExample?: {
    title: string;
    code: string;
    explanation: string;
  };
  goodExample?: {
    title: string;
    code: string;
    explanation: string;
  };
  explanation: string;
}

export interface PracticumTheoryData {
  practicumId: number;
  title: string;
  subtitle: string;
  cpmkTarget: string;
  subCpmk?: string[];
  concepts: KeyConceptPoint[];
  comparisonTable: {
    title: string;
    description: string;
    colAHeader?: string;
    colBHeader?: string;
    rows: ComparisonRow[];
  };
  goldenRules: GoldenRuleItem[];
}

export const PRACTICUM_THEORIES: Record<number, PracticumTheoryData> = {
  1: {
    practicumId: 1,
    title: "Next.js 16 App Router: Server vs Client Component & Hydration",
    subtitle: "Landasan Teori Komprehensif, Arsitektur Eksekusi, dan Panduan Eksperimen DevTools",
    cpmkTarget:
      "Mahasiswa mampu membedakan perilaku Server Component dan Client Component di Next.js App Router melalui pengujian langsung, mengamati perbedaan output streaming HTML, inspeksi ukuran JavaScript bundle di DevTools, serta menerapkan pola komposisi Interleaving.",
    subCpmk: [
      "Membedakan Lingkungan Eksekusi: Mengidentifikasi perbedaan arsitektural dan siklus hidup antara Server Component (Node.js runtime murni) dan Client Component (peramban V8 engine) melalui pengujian langsung.",
      "Menganalisis Mekanisme Streaming & Log: Mengamati pembentukan output streaming HTML statis dan memverifikasi lokasi eksekusi console.log() antara terminal server dan DevTools Console browser.",
      "Menginspeksi Bobot JavaScript Bundle: Mengukur secara empiris dampak 0 kB bundle Server Component dibandingkan penambahan bobot bundle Client Component menggunakan DevTools Network tab.",
      "Mendiagnosis Batasan Runtime & Hooks: Menjelaskan batasan komputasi stateless pada Server Component dan mengidentifikasi mekanisme proteksi compiler (guardrail) saat React Hooks dipanggil secara tidak valid.",
      "Menerapkan Pola Komposisi Interleaving: Mengimplementasikan arsitektur Children Props Pattern untuk menyematkan Server Component di dalam Client Component tanpa mengorbankan performa 0 kB bundle komponen server.",
    ],
    concepts: [
      {
        id: 1,
        title: "Arsitektur React Server Components (RSC) & Zero-Bundle Impact",
        badge: "0 kB Client Bundle",
        keywords: ["Node.js Runtime", "0 kB Bundle", "Streaming HTML", "Terminal Server"],
        summary:
          "Server Component dieksekusi 100% di lingkungan server (Node.js). Output console.log hanya tercetak di terminal server dan kodenya tidak pernah dikirim ke browser.",
        explanation:
          "1. **Arsitektur Default**: Di Next.js 16 App Router, setiap file komponen (`.tsx`) secara baku adalah **React Server Component (RSC)** yang dieksekusi 100% di server saat request masuk.\n\n" +
          "2. **Output Streaming**: Hasil akhir render berupa **streaming HTML statis** dan representasi pohon komponen (**RSC Payload**), bukan bundle JavaScript mentah.\n\n" +
          "3. **Zero-Bundle Impact (0 kB)**: Ukuran kode komponen ini adalah **0 kB di sisi klien**, menghemat transfer data jaringan dan mempercepat *First Contentful Paint*.\n\n" +
          "4. **Isolasi Log Eksekusi**: Perintah `console.log()` diproses oleh **runtime Node.js server**, sehingga outputnya **hanya tampil di terminal CLI server** dan sama sekali tidak terlihat di Browser DevTools Console.",
        codeSnippet: {
          filename: "app/test-rsc/page.tsx",
          language: "tsx",
          code: `// Default: React Server Component (tanpa 'use client')
export default function TestRscPage() {
  // Log ini HANYA tercetak di Terminal CLI Server (Node.js)
  // TIDAK AKAN pernah muncul di Browser DevTools Console!
  console.log('[SERVER] Rendered at:', new Date().toISOString());

  return (
    <main className="p-8">
      <h1>Halaman Server Component (RSC)</h1>
      <p>Bundle JavaScript komponen ini ke browser: 0 kB</p>
    </main>
  );
}`,
        },
        observationGuide:
          "Pada Langkah 1 Pengamatan: Catat bahwa output log waktu muncul di jendela terminal tempat Anda menjalankan 'npm run dev', bukan di peramban.",
      },
      {
        id: 2,
        title: "Batas Direktif 'use client' & Proses Hydration Interaktif",
        badge: "Hydration Boundary",
        keywords: ["'use client'", "Batas Boundary", "Hydration", "DevTools Console"],
        summary:
          "Direktif 'use client' menandai batas (boundary) bahwa komponen membutuhkan interaktivitas peramban, memicu pengiriman JS bundle dan proses hydration.",
        explanation:
          "1. **Batas Arsitektur (Boundary)**: Direktif `'use client'` di baris paling awal menandai batas bahwa komponen dan pohon dependensinya membutuhkan interaktivitas peramban, state dinamis, atau event handler.\n\n" +
          "2. **Bukan Render Sisi Klien Murni**: Komponen berlabel `'use client'` tetap mengalami pra-render (**SSR**) di server untuk menghasilkan HTML awal, namun kodenya ikut dikemas ke dalam **JavaScript bundle**.\n\n" +
          "3. **Proses Hydration**: Di peramban, React menjalankan proses **Hydration** dengan mengaitkan (*attach*) event listener seperti `onClick` dan memori `useState` ke markup HTML statis yang diterima.\n\n" +
          "4. **Lokasi Log Konsol**: Karena dieksekusi di mesin V8 peramban, pemanggilan `console.log()` akan **tercetak langsung di Browser DevTools Console**.",
        codeSnippet: {
          filename: "app/test-client/page.tsx",
          language: "tsx",
          code: `'use client'; // Menandai Batas (Boundary) Client Component

import { useState, useEffect } from 'react';

export default function TestClientPage() {
  const [count, setCount] = useState(0);

  // Log ini dieksekusi di peramban dan MUNCUL di Browser DevTools Console
  console.log('[CLIENT] Component Mounted or Re-rendered');

  return (
    <main className="p-8">
      <h1>Halaman Client Component</h1>
      <button onClick={() => setCount(c => c + 1)}>
        Klik: {count}
      </button>
    </main>
  );
}`,
        },
        observationGuide:
          "Pada Langkah 2 Pengamatan: Buka DevTools (F12 > Console). Verifikasi bahwa log '[CLIENT]' tercetak jelas di console browser setiap kali halaman dimuat atau tombol diklik.",
      },
      {
        id: 3,
        title: "Inspeksi Empiris Ukuran JS Bundle Melalui DevTools Network",
        badge: "Network Analysis",
        keywords: ["DevTools Network", "Filter JS", "Runtime ~85 KB", "Client Bundle ~120 KB"],
        summary:
          "Membandingkan bobot transfer data JavaScript antara halaman RSC murni (~85 KB core runtime) vs Client Component (~120 KB+ tambahan react-dom bundle).",
        explanation:
          "1. **Metodologi Inspeksi**: Pengamatan empiris transfer data dilakukan melalui tab **Network** pada browser DevTools dengan filter **JS** aktif dan opsi **Disable cache** dicentang.\n\n" +
          "2. **Baseline Runtime RSC (~85 KB)**: Rute Server Component murni (`/test-rsc`) hanya mengunduh chunk runtime dasar Next.js tanpa menyertakan kode komponen halaman ke peramban.\n\n" +
          "3. **Lonjakan Bundle Client (~120 KB+)**: Rute Client Component (`/test-client`) memicu kenaikan ukuran unduhan karena harus mengirim modul event handler, state reconciler, dan runtime interaktivitas.\n\n" +
          "4. **Efisiensi Skala Besar**: Pada aplikasi skala produksi, mempertahankan komponen tetap sebagai RSC menghemat megabyte unduhan skrip bagi pengguna akhir.",
        codeSnippet: {
          filename: "DevTools Network Inspection Steps",
          language: "bash",
          code: `# Langkah Verifikasi DevTools Network:
1. Tekan tombol F12 di browser > Buka tab 'Network'
2. Centang checkbox 'Disable cache'
3. Klik filter 'JS' pada bilah filter resource
4. Refresh halaman /test-rsc  -> Perhatikan total 'Transferred JS' (~85 KB)
5. Navigasi ke /test-client    -> Perhatikan lonjakan 'Transferred JS' (~120 KB+)`,
        },
        observationGuide:
          "Pada Langkah 3 Pengamatan: Catat angka spesifik kilobyte (KB) yang tertera di status bar bawah DevTools Network untuk kedua halaman dan hitung selisihnya.",
      },
      {
        id: 4,
        title: "Batasan Komputasi & Analisis Pesan Error React Hooks di RSC",
        badge: "Compiler Guardrail",
        keywords: ["useState Error", "Hooks Restriction", "Stateless Server", "Compiler Guardrail"],
        summary:
          "Hooks (useState, useEffect) dilarang keras di Server Component karena server bersifat stateless. Next.js memicu error proteksi arsitektur yang eksplisit.",
        explanation:
          "1. **Sifat Stateless Server**: Server Component dieksekusi sekali per siklus request untuk menghasilkan streaming HTML, sehingga konsep *re-render* berbasis state tidak berlaku di server.\n\n" +
          "2. **Larangan Keras React Hooks**: Pemanggilan hooks seperti `useState` atau `useEffect` **dilarang keras** di Server Component tanpa direktif `'use client'`.\n\n" +
          "3. **Proteksi Compiler Guardrail**: Next.js 16 secara cerdas melempar error proteksi arsitektur: `\"useState only works in Client Components. Add the 'use client' directive at the top of the file to use it.\"`,.\n\n" +
          "4. **Fungsi Mekanisme Keamanan**: Error ini mencegah kebocoran memori server dan memblokir *race condition* antar-pengguna yang mengakses server secara bersamaan.",
        codeSnippet: {
          filename: "Simulasi Error (app/test-rsc/page.tsx)",
          language: "tsx",
          code: `// ❌ SALAH: Memanggil useState di Server Component tanpa 'use client'
import { useState } from 'react';

export default function BrokenPage() {
  // ERROR COMPILER NEXT.JS:
  // "useState only works in Client Components. Add the 'use client' directive..."
  const [data, setData] = useState(null); 
  return <div>Gagal compile</div>;
}`,
        },
        observationGuide:
          "Pada Langkah 4 Pengamatan: Salin teks pesan error asli dari terminal server atau overlay browser merah. Jelaskan mengapa error tersebut merupakan mekanisme keamanan (guardrail).",
      },
      {
        id: 5,
        title: "Pola Komposisi Interleaving (Children Slots Pattern)",
        badge: "Advanced Composition",
        keywords: ["Interleaving", "Props Children", "Anti-Pattern Import", "0 kB Preservation"],
        summary:
          "Menggabungkan Server Component di dalam Client Component tanpa mengorbankan performa 0 kB, yaitu dengan melewatkan Server Component via props children.",
        explanation:
          "1. **Bahaya Degradasi Impor Langsung**: Mengimpor Server Component secara langsung di dalam file `'use client'` menyebabkan komponen server tersebut **otomatis terdegradasi** menjadi Client Component dan ikut dibundle.\n\n" +
          "2. **Solusi Interleaving Pattern**: Pola komposisi resmi React untuk menyematkan Server Component ke dalam Client Component tanpa kehilangan keunggulan 0 kB bundle.\n\n" +
          "3. **Pola Props Children**: Komponen server dilewatkan sebagai slot `{children}` ke dalam Client Component pembungkus (*wrapper*).\n\n" +
          "4. **Eksekusi Simultan & Efisien**: Komponen pembungkus mengelola interaksi dinamis di peramban, sementara komponen anak tetap dirender 100% di server dengan bobot **0 kB JS bundle**.",
        codeSnippet: {
          filename: "Pola Interleaving (Children Props Pattern)",
          language: "tsx",
          code: `// 1. Client Component Pembungkus (components/client-wrapper.tsx)
'use client';
import { useState } from 'react';

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="border p-4">
      <button onClick={() => setIsOpen(!isOpen)}>Toggle Interaktif</button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
}

// 2. Server Component Halaman (app/page.tsx)
import { ClientWrapper } from '@/components/client-wrapper';
import { ServerContent } from '@/components/server-content'; // RSC Murni (0 kB)

export default function Page() {
  return (
    <ClientWrapper>
      {/* ServerContent dilewatkan sebagai children: Tetap 0 kB Bundle! */}
      <ServerContent />
    </ClientWrapper>
  );
}`,
        },
        observationGuide:
          "Pada Langkah 5 Pengamatan: Verifikasi bahwa tombol toggle di ClientWrapper dapat diklik untuk menyembunyikan/menampilkan ServerContent, sementara ServerContent tetap dirender di server.",
      },
    ],
    comparisonTable: {
      title: "Matriks Perbandingan Arsitektural: Server Component vs Client Component",
      description: "Gunakan tabel matriks komparasi ini sebagai acuan cepat dalam mengisi tabel observasi dan analisis esai",
      rows: [
        {
          aspect: "Lingkungan Eksekusi Kode",
          serverComponent: "Node.js Server Runtime (100% di server)",
          clientComponent: "Server (SSR awal) + Browser V8 Engine (Hydration)",
          badgeVerdict: "neutral",
          verdictText: "Dua Ranah Berbeda",
        },
        {
          aspect: "Lokasi Output console.log()",
          serverComponent: "Terminal CLI Server (Command Line Interface)",
          clientComponent: "Browser DevTools Console (Jendela Peramban)",
          badgeVerdict: "neutral",
          verdictText: "Indikator Utama Uji 1 & 2",
        },
        {
          aspect: "Ukuran JavaScript Bundle ke Klien",
          serverComponent: "0 kB (Zero Client Bundle Impact)",
          clientComponent: "Bertambah (~120 KB+ untuk React Interactivity)",
          badgeVerdict: "rsc-win",
          verdictText: "RSC Lebih Ringan & Cepat",
        },
        {
          aspect: "Dukungan React State & Lifecycle",
          serverComponent: "TIDAK BISA (Dilarang memanggil useState, useEffect)",
          clientComponent: "BISA PENUH (Mendukung semua React Hooks & custom hooks)",
          badgeVerdict: "client-win",
          verdictText: "Client Wajib untuk State",
        },
        {
          aspect: "Dukungan Browser Event Handlers",
          serverComponent: "TIDAK BISA (onClick, onChange, onSubmit dilarang)",
          clientComponent: "BISA PENUH (Mendukung semua interaksi mouse & keyboard)",
          badgeVerdict: "client-win",
          verdictText: "Client Wajib untuk Interaksi",
        },
        {
          aspect: "Akses Database & Environment Secrets",
          serverComponent: "SANGAT AMAN (Bisa kueri langsung ke DB & baca secret key)",
          clientComponent: "DILARANG (Kunci rahasia akan bocor ke browser inspektor)",
          badgeVerdict: "rsc-win",
          verdictText: "RSC Wajib untuk Keamanan",
        },
        {
          aspect: "Pola Impor Komponen Silang",
          serverComponent: "Bisa mengimpor Server Component & Client Component",
          clientComponent: "DILARANG impor langsung RSC; Wajib lewat prop 'children'",
          badgeVerdict: "neutral",
          verdictText: "Aturan Interleaving",
        },
      ],
    },
    goldenRules: [
      {
        id: 1,
        title: "Aturan Penempatan Direktif 'use client' (Leaf Component Rule)",
        type: "dos",
        explanation:
          "Tempatkan 'use client' hanya pada komponen daun paling ujung (leaf components) yang secara eksplisit membutuhkan event listener atau useState. Jangan letakkan 'use client' di tingkat page.tsx atau layout.tsx utama karena akan merusak manfaat 0 kB bundle di seluruh halaman.",
        goodExample: {
          title: "✅ Rekomendasi (Leaf Component):",
          code: `// src/components/counter-button.tsx
'use client';
export function CounterButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}`,
          explanation: "Hanya komponen tombol kecil ini yang dikirim ke browser; halaman pembungkusnya tetap RSC 0 kB.",
        },
        badExample: {
          title: "❌ Anti-Pattern (Menempatkan di Page Level):",
          code: `// src/app/page.tsx
'use client'; // Jangan lakukan ini!
export default function Page() { ... }`,
          explanation: "Menyebabkan seluruh halaman dan anak-anaknya berubah menjadi Client Component dan memperbesar bundle JS.",
        },
      },
      {
        id: 2,
        title: "Aturan Emas Pola Interleaving (Komposisi Lintas Batas)",
        type: "warning",
        explanation:
          "Dilarang mengimpor Server Component langsung ke file yang berlabel 'use client'. Gunakan slot prop 'children' untuk melewatkan komponen server ke komponen client.",
        badExample: {
          title: "❌ Anti-Pattern (Import Langsung RSC ke Client):",
          code: `'use client';
// ServerDataComponent otomatis terdegradasi menjadi Client Component!
import { ServerDataComponent } from './ServerDataComponent'; 

export function ClientWrapper() {
  return <div><ServerDataComponent /></div>;
}`,
          explanation: "ServerDataComponent kehilangan sifat 0 kB dan seluruh kodenya ikut dibundle ke browser.",
        },
        goodExample: {
          title: "✅ Best Practice (Pola Props Children):",
          code: `// 1. Client Component
'use client';
export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <div className="p-4">{children}</div>;
}

// 2. Di Server Page:
import { ClientWrapper } from './ClientWrapper';
import { ServerDataComponent } from './ServerDataComponent';

export default function Page() {
  return (
    <ClientWrapper>
      <ServerDataComponent /> {/* Tetap murni RSC 0 kB! */}
    </ClientWrapper>
  );
}`,
          explanation: "ServerDataComponent tetap diproses 100% di server, dan ClientWrapper menerima hasil render sebagai children.",
        },
      },
    ],
  },
  2: {
    practicumId: 2,
    title: "Server Actions & Validasi Skema Data dengan Zod",
    subtitle: "Landasan Teori RPC Mutasi Server, Pertahanan Input safeParse(), dan Siklus React 19 Form Hooks",
    cpmkTarget:
      "Mahasiswa mampu membuat Server Action di Next.js untuk memproses mutasi data secara aman berbasis RPC, mengimplementasikan deklarasi dan inferensi skema data menggunakan Zod, menangani struktur error validasi fieldErrors via safeParse(), serta mengelola siklus form terpadu (idle → pending → settled) menggunakan React 19 form hooks (useActionState).",
    subCpmk: [
      "Membangun Server Actions Berbasis RPC: Membuat fungsi mutasi asinkron di lingkungan server dengan direktif 'use server' dan menangani ekstraksi payload FormData sesuai standar Web API tanpa endpoint API manual.",
      "Mendeklarasikan Skema Validasi dengan Zod: Menyusun aturan validasi data runtime deklaratif serta menerapkan otomatisasi inferensi tipe statis TypeScript (z.infer) sebagai Single Source of Truth.",
      "Menerapkan Pertahanan Input via safeParse(): Memvalidasi data masukan formulir secara defensif (zero-crash) dan memetakan struktur galat terperinci ZodError.fieldErrors per nama input tanpa melempar uncaught exception.",
      "Menstandarkan Kontrak State Mutasi: Mengintegrasikan ActionState<T> pada Server Action untuk memberikan umpan balik validasi instan ke antarmuka formulir tanpa memicu reload peramban penuh.",
      "Mengelola Siklus Form dengan React 19: Memanfaatkan hook useActionState untuk mengendalikan transisi status formulir (idle → pending → settled) serta mengaktifkan indikator pemblokiran tombol kirim otomatis guna mencegah insiden double-submission.",
    ],
    concepts: [
      {
        id: 1,
        title: "Arsitektur Server Actions RPC & Penanganan Objek FormData",
        badge: "RPC Protocol ('use server')",
        keywords: ["'use server'", "FormData Web API", "RPC (Remote Procedure Call)", "Progressive Enhancement", "Terminal Server"],
        summary:
          "Server Actions mentransformasikan fungsi JavaScript biasa menjadi endpoint RPC asinkron yang berjalan eksklusif di server Node.js dan menerima FormData tanpa perlu merakit API route manual.",
        explanation:
          "1. **Transformasi Endpoint RPC**: Direktif `'use server'` mentransformasikan fungsi JavaScript biasa menjadi endpoint Remote Procedure Call (**RPC**) asinkron yang berjalan eksklusif di runtime Node.js server.\n\n" +
          "2. **Protokol Web API FormData**: Server Action menerima objek bawaan `FormData` secara langsung tanpa perlu membuat berkas API route (`/api/...`) manual.\n\n" +
          "3. **Isolasi Keamanan Server**: Pemanggilan `console.log()` dan pembacaan credential/database hanya berjalan di server, tercetak di **terminal CLI server**, dan terisolasi dari peramban.\n\n" +
          "4. **Progressive Enhancement**: Formulir HTML standar tetap dapat memproses mutasi data bahkan sebelum file JavaScript di peramban pengguna selesai dimuat.",
        codeSnippet: {
          filename: "src/actions/test-action.ts",
          language: "typescript",
          code: `'use server'; // Menandai file sebagai modul Server Actions (RPC Endpoint)

export async function createTaskAction(formData: FormData) {
  // Ekstrak data form menggunakan Web API FormData standard
  const title = formData.get('title') as string;
  const priority = formData.get('priority') as string;

  // Log ini HANYA tercetak di Terminal CLI Server (Node.js)
  // TIDAK AKAN pernah bocor ke Browser DevTools Console!
  console.log('[Server Action RPC] Menerima FormData di server:', {
    title,
    priority,
    timestamp: new Date().toISOString(),
  });

  return { success: true };
}`,
        },
        observationGuide:
          "Pada Langkah 1 Pengamatan: Submit formulir dari peramban dan pantau Terminal CLI tempat Anda menjalankan 'npm run dev'. Catat bahwa log '[Server Action RPC]' tercetak di terminal server dan BUKAN di DevTools Console browser.",
      },
      {
        id: 2,
        title: "Deklarasi Skema TypeScript-First & Type Inference dengan Zod",
        badge: "Type Inference & Schema",
        keywords: ["z.object()", "z.infer<typeof Schema>", "Single Source of Truth", "z.enum()", "Runtime Validation"],
        summary:
          "Zod bertindak sebagai sumber kebenaran tunggal (Single Source of Truth) yang menyatukan validasi runtime JavaScript dengan type checking statis TypeScript.",
        explanation:
          "1. **Keterbatasan Type Erasure**: Definisi antarmuka TypeScript standar terhapus saat kompilasi runtime, sehingga tidak mampu memvalidasi data masukan pengguna secara fisik.\n\n" +
          "2. **Single Source of Truth**: Zod mendefinisikan skema objek deklaratif di tingkat runtime (`z.object()`, `z.string()`, `z.enum()`) yang aktif memvalidasi payload saat aplikasi berjalan.\n\n" +
          "3. **Otomatisasi Type Inference**: Utilitas `z.infer<typeof Schema>` mengekstrak tipe statis TypeScript secara otomatis dari skema runtime, menghilangkan redundansi penulisan interface terpisah.",
        codeSnippet: {
          filename: "src/lib/schemas.ts",
          language: "typescript",
          code: `import { z } from 'zod';

// 1. Deklarasi Skema Runtime Validasi
export const TaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Judul tugas minimal 3 karakter')
    .trim(),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Prioritas harus: low, medium, atau high' }),
  }),
  deadline: z.string().optional(),
});

// 2. Otomatisasi Type Inference TypeScript (Zero Redundancy)
export type TaskInput = z.infer<typeof TaskSchema>;
// Type yang dihasilkan: { title: string; priority: 'low' | 'medium' | 'high'; deadline?: string | undefined; }`,
        },
        observationGuide:
          "Pada Langkah 2 Pengamatan: Uji schema Zod dengan data valid seperti { title: 'Belajar Zod', priority: 'high' }. Verifikasi bahwa hasil safeParse() mengembalikan objek { success: true, data: { ... } }.",
      },
      {
        id: 3,
        title: "Pertahanan Input & Struktur ZodError.fieldErrors via safeParse()",
        badge: "Zero-Exception Defense",
        keywords: ["safeParse()", "ZodError", "flatten().fieldErrors", "Defensive Programming", "Zero Crash"],
        summary:
          "Metode safeParse() memvalidasi data tanpa melempar exception crash, mengembalikan struktur error fieldErrors terpetakan per field untuk antarmuka pengguna.",
        explanation:
          "1. **Bahaya Uncaught Exception**: Metode bawaan `schema.parse()` melempar exception fatal jika input tidak valid, memicu server crash atau HTTP 500 jika tidak tertangkap try-catch.\n\n" +
          "2. **Pola Zero-Crash safeParse()**: Metode `safeParse()` mengevaluasi data secara defensif, mengembalikan objek diskriminatif `{ success: boolean, data?: T, error?: ZodError }` tanpa melempar crash.\n\n" +
          "3. **Format fieldErrors Terstruktur**: Memanggil `error.flatten().fieldErrors` menghasilkan kamus rapi `{ [fieldName]: string[] }` yang siap dipetakan tepat di bawah input formulir yang keliru.",
        codeSnippet: {
          filename: "Pengujian Input Gagal (Simulasi Langkah 3)",
          language: "typescript",
          code: `import { TaskSchema } from '@/lib/schemas';

// Simulasi payload kotor / tidak valid:
const badPayload = {
  title: '   ',        // Gagal: kurang dari 3 karakter setelah .trim()
  priority: 'urgent',  // Gagal: di luar enum ['low', 'medium', 'high']
};

const result = TaskSchema.safeParse(badPayload);

if (!result.success) {
  // flatten().fieldErrors memetakan error secara presisi per input field:
  const fieldErrors = result.error.flatten().fieldErrors;
  console.log(fieldErrors);
  /* Output yang dihasilkan:
  {
    title: ['Judul tugas minimal 3 karakter'],
    priority: ['Prioritas harus: low, medium, atau high']
  }
  */
}`,
        },
        observationGuide:
          "Pada Langkah 3 Pengamatan: Catat struktur JSON fieldErrors yang dihasilkan terminal atau console. Perhatikan bahwa nama properti di dalam fieldErrors sama persis dengan nama field di skema Zod.",
      },
      {
        id: 4,
        title: "Integrasi Server Action & Kontrak ActionState<T> Tanpa Reload",
        badge: "Standardized Action Contract",
        keywords: ["ActionState<T>", "Object.fromEntries()", "fieldErrors Return", "SPA Feedback", "No Page Reload"],
        summary:
          "Server Action mengubah FormData menjadi objek, memvalidasinya dengan Zod, dan mengembalikan kontrak ActionState standar ke browser tanpa memicu refresh halaman.",
        explanation:
          "1. **Ekstraksi Object.fromEntries**: Mengonversi iterable `formData.entries()` menjadi objek JavaScript plain untuk divalidasi oleh skema Zod.\n\n" +
          "2. **Standarisasi Kontrak ActionState**: Mengadopsi format return state terstandarisasi `{ success: boolean, errors?: Record<string, string[]>, message?: string }`.\n\n" +
          "3. **Reaktivitas SPA Tanpa Reload**: Peramban menampilkan pesan galat merah di bawah input secara instan tanpa memicu Full Page Reload peramban.",
        codeSnippet: {
          filename: "src/actions/task-actions.ts",
          language: "typescript",
          code: `'use server';
import { TaskSchema } from '@/lib/schemas';

export type ActionState = {
  success: boolean;
  errors?: Record<string, string[] | undefined>;
  message?: string;
};

export async function createTaskAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  const validated = TaskSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Validasi gagal. Periksa kolom yang ditandai merah.',
    };
  }

  // Mutasi data aman ke database dapat dilakukan di sini...
  return {
    success: true,
    message: 'Tugas baru berhasil disimpan ke database!',
  };
}`,
        },
        observationGuide:
          "Pada Langkah 4 Pengamatan: Coba kirim form dengan field title kosong. Amati bahwa pesan teks merah langsung muncul di bawah field title secara instan tanpa ada kedipan reload peramban.",
      },
      {
        id: 5,
        title: "Siklus Form React 19 dengan useActionState & Indikator Pending UI",
        badge: "React 19 Form Lifecycle",
        keywords: ["useActionState", "isPending", "React 19 Native", "Form State Management", "Optimistic / Pending UI"],
        summary:
          "Hook resmi React 19 useActionState mengikat Server Action ke komponen form, menyediakan state respon terkini, pemicu formAction, dan status isPending otomatis.",
        explanation:
          "1. **Native Hook React 19 useActionState**: Mengikat Server Action ke komponen form, mengotomasi pengelolaan state respon, pemanggil `formAction`, dan status pemrosesan.\n\n" +
          "2. **Otomasi Pending State**: Variabel boolean `isPending` bernilai `true` secara otomatis selama server memproses mutasi data.\n\n" +
          "3. **Pencegahan Double-Submit**: Menggunakan atribut `disabled={isPending}` pada tombol submit untuk memblokir multi-klik dan mencegah duplikasi data transaksi di server.",
        codeSnippet: {
          filename: "src/components/create-task-form.tsx",
          language: "tsx",
          code: `'use client';
import { useActionState } from 'react';
import { createTaskAction, ActionState } from '@/actions/task-actions';

const initialState: ActionState = { success: false };

export function CreateTaskForm() {
  const [state, formAction, isPending] = useActionState(createTaskAction, initialState);

  return (
    <form action={formAction} className="space-y-4 max-w-md p-6 border rounded-xl">
      <div>
        <label className="text-sm font-semibold">Judul Tugas</label>
        <input name="title" className="w-full border p-2 rounded" disabled={isPending} />
        {state.errors?.title && (
          <p className="text-red-500 text-xs mt-1">{state.errors.title[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-emerald-600 text-white p-2 rounded disabled:opacity-50"
      >
        {isPending ? 'Menyimpan ke Server...' : 'Simpan Tugas'}
      </button>

      {state.success && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded text-sm">
          {state.message}
        </div>
      )}
    </form>
  );
}`,
        },
        observationGuide:
          "Pada Langkah 5 Pengamatan: Uji siklus state form: Perhatikan saat tombol ditekan, status berubah dari diam (idle) → tombol disable dengan teks 'Menyimpan...' (isPending: true) → muncul banner sukses/error (settled).",
      },
    ],
    comparisonTable: {
      title: "Matriks Perbandingan Arsitektural: Next.js 16 Server Actions RPC vs Tradisional API Route",
      description: "Gunakan tabel matriks komparasi ini sebagai rujukan komprehensif saat mengisi tabel observasi dan analisis esai praktikum",
      colAHeader: "Server Actions RPC + Zod (Modern)",
      colBHeader: "API Route Tradisional (fetch /api)",
      rows: [
        {
          aspect: "Mekanisme Pemanggilan Mutasi",
          colA: "Fungsi asinkron langsung via atribut action={formAction} tanpa perlu membuat rute HTTP",
          colB: "Wajib membuat HTTP client call manual via fetch('/api/tasks', { method: 'POST' })",
          badgeVerdict: "rsc-win",
          verdictText: "RPC Lebih Ringkas & Elegan",
        },
        {
          aspect: "Lokasi Deklarasi & Validasi Data",
          colA: "Skema Zod tunggal di schemas.ts divalidasi langsung di server via safeParse()",
          colB: "Parsing manual req.json() di route handler terpisah, rawan inkonsistensi tipe",
          badgeVerdict: "rsc-win",
          verdictText: "Single Source of Truth",
        },
        {
          aspect: "Penanganan Error Validasi",
          colA: "Mengembalikan fieldErrors terstruktur per nama field langsung ke state React 19",
          colB: "Wajib merakit NextResponse.json({ errors }, { status: 400 }) lalu parsing res.json() di browser",
          badgeVerdict: "rsc-win",
          verdictText: "fieldErrors Otomatis",
        },
        {
          aspect: "Manajemen Status Loading / Pending",
          colA: "Disediakan otomatis oleh hook React 19 useActionState via variabel boolean isPending",
          colB: "Wajib membuat state lokal manual const [isLoading, setIsLoading] = useState(false)",
          badgeVerdict: "rsc-win",
          verdictText: "Zero Boilerplate State",
        },
        {
          aspect: "Dukungan Progressive Enhancement",
          colA: "Dukungan penuh bawaan: formulir HTML dapat tersubmit meskipun JavaScript klien belum termuat",
          colB: "Bergantung 100% pada JS klien (e.preventDefault() pada onSubmit); form mati tanpa JS",
          badgeVerdict: "rsc-win",
          verdictText: "Lebih Tangguh & Resilien",
        },
        {
          aspect: "Kebutuhan Berkas & Boilerplate",
          colA: "1 berkas aksi (actions/tasks.ts) dapat menampung puluhan fungsi mutasi server sekaligus",
          colB: "Setiap mutasi membutuhkan folder dan berkas terpisah (app/api/tasks/route.ts)",
          badgeVerdict: "rsc-win",
          verdictText: "0 Endpoint Boilerplate",
        },
        {
          aspect: "Akses Konteks Server (Cookies & DB)",
          colA: "Akses native langsung ke cookies(), Supabase server client, dan revalidatePath()",
          colB: "Akses server ada namun memerlukan penataan header respons, CORS, dan serialisasi manual",
          badgeVerdict: "neutral",
          verdictText: "Sama-Sama di Sisi Server",
        },
      ],
    },
    goldenRules: [
      {
        id: 1,
        title: "Aturan Penggunaan safeParse() (Dilarang Melempar Uncaught Exception parse())",
        type: "warning",
        explanation:
          "Di dalam Server Action, selalu gunakan TaskSchema.safeParse() dan bukan TaskSchema.parse(). Memanggil parse() tanpa try-catch akan melempar exception crash jika input pengguna tidak valid, memicu HTTP 500 fatal dan merusak UX pengguna. Gunakan safeParse() untuk mengembalikan error terstruktur dengan anggun.",
        badExample: {
          title: "❌ Anti-Pattern (Exception Crash via parse()):",
          code: `// ❌ SALAH: parse() melempar exception fatal jika input tidak valid!
export async function createTaskAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const data = TaskSchema.parse(raw); // THROW EXCEPTION! Server crash jika input kosong
  await db.tasks.insert(data);
  return { success: true };
}`,
          explanation: "Ketika pengguna memasukkan string kosong, aplikasi langsung crash atau menampilkan layar error merah karena exception Zod tidak ditangkap.",
        },
        goodExample: {
          title: "✅ Best Practice (Pertahanan Aman via safeParse()):",
          code: `// ✅ BENAR: safeParse() mengembalikan objek diskriminatif yang aman
export async function createTaskAction(prevState: ActionState, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const result = TaskSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors, // Rapi & aman
      message: 'Validasi gagal, silakan periksa formulir.',
    };
  }

  await db.tasks.insert(result.data); // data terjamin 100% valid & type-safe
  return { success: true, message: 'Tugas berhasil disimpan!' };
}`,
          explanation: "Server Action menangani validasi dengan anggun, mengembalikan error spesifik per field ke komponen UI tanpa melempar crash server.",
        },
      },
      {
        id: 2,
        title: "Aturan Validasi Berlapis (Validasi HTML Bukan Pengganti Keamanan Server)",
        type: "dos",
        explanation:
          "Atribut validasi HTML seperti required, minLength, atau pattern hanya berfungsi untuk membantu kenyamanan pengguna (UX). Atribut ini dapat dimatikan dengan mudah oleh penyerang melalui Inspect Element atau script cURL. Server Action WAJIB memvalidasi ulang seluruh data menggunakan Zod di sisi server sebelum menyentuh database.",
        badExample: {
          title: "❌ Anti-Pattern (Mengandalkan Validasi Browser Saja):",
          code: `// Di Form HTML:
<input name="title" required minLength={3} /> // ⚠️ Mudah dihapus via DevTools!

// Di Server Action:
export async function createTaskAction(formData: FormData) {
  // Langsung mempercayai input tanpa validasi server!
  const title = formData.get('title') as string;
  await db.tasks.insert({ title }); // BAHAYA: Payload kotor/kosong lolos ke database!
}`,
          explanation: "Pengguna dapat menghapus atribut 'required' via DevTools Inspect Element dan mengirim string kosong atau script berbahaya langsung ke database.",
        },
        goodExample: {
          title: "✅ Best Practice (Validasi Berlapis dengan Server Guardrail):",
          code: `// Server Action selalu memvalidasi skema dengan Zod secara independen:
export async function createTaskAction(prevState: ActionState, formData: FormData) {
  const result = TaskSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
  // Hanya data yang terverifikasi (result.data) yang boleh diproses ke database:
  await db.tasks.insert(result.data);
  return { success: true };
}`,
          explanation: "Meskipun validasi browser di-bypass, server tetap menolak payload tidak valid dan integritas database tetap terlindungi penuh.",
        },
      },
    ],
  },
  3: {
    practicumId: 3,
    title: "Database Relasional PostgreSQL & Integrasi Supabase",
    subtitle: "Landasan Teori DDL Skema Relasional, Integritas CASCADE, Arsitektur @supabase/ssr, dan TypeScript Typegen",
    cpmkTarget:
      "Mahasiswa mampu merancang skema database relasional di PostgreSQL menggunakan Supabase, membuat tabel dengan foreign key constraint dan UUID v4, menjalankan query CRUD dasar, serta mengintegrasikan Supabase client di Next.js 16 menggunakan paket @supabase/ssr dan otomatisasi TypeScript typegen.",
    subCpmk: [
      "Membedakan Identitas UUID v4 vs Serial: Merancang Primary Key aman non-prediktif yang terdistribusi dan mandiri dari database.",
      "Mengeksekusi Kueri Relasional JOIN: Melakukan operasi manipulasi data (CRUD) dan penggabungan multi-tabel menggunakan sintaks SQL baku di Supabase SQL Editor.",
      "Menerapkan Aturan Penghapusan ON DELETE CASCADE: Menjamin integritas referensial data dengan menguji perilaku constraint saat baris induk dihapus.",
      "Mengonfigurasi Klien Supabase SSR: Mengintegrasikan paket @supabase/ssr pada Next.js 16 untuk menghubungkan Server Components langsung ke database PostgreSQL secara aman.",
      "Mengotomasi TypeScript Typegen: Menghasilkan definisi tipe antarmuka TypeScript otomatis dari skema database aktif menggunakan Supabase CLI guna menjamin end-to-end type safety.",
    ],
    concepts: [
      {
        id: 1,
        title: "Identitas Data: UUID v4 vs Integer Serial Auto-Increment",
        badge: "UUID v4 Primary Key",
        keywords: ["UUID v4", "gen_random_uuid()", "Non-Predictable", "Distributed ID", "Enumeration Attack"],
        summary:
          "UUID v4 (128-bit) mencegah serangan enumerasi data IDOR dan dapat di-generate di klien/server tanpa membebani koordinasi database.",
        explanation:
          "1. **Kelemahan Serial Auto-Increment**: ID numerik sekuensial (`1, 2, 3...`) membocorkan volume data bisnis dan rentan serangan *Insecure Direct Object Reference (IDOR)*.\n\n" +
          "2. **Keunggulan Kriptografis UUID v4**: Nilai 128-bit acak (`gen_random_uuid()`) menjamin probabilitas tabrakan nyaris nol secara global tanpa koordinasi terpusat.\n\n" +
          "3. **Generasi Terdesentralisasi**: UUID dapat di-generate di browser atau server sebelum transaksi database dilakukan (*optimistic creation*).\n\n" +
          "4. **Penerapan DDL PostgreSQL**: Dideklarasikan dengan tipe data native `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`.",
        codeSnippet: {
          filename: "supabase/migrations/01_initial_schema.sql",
          language: "sql",
          code: `-- Tabel Induk Kategori dengan UUID v4
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel Anak Tugas dengan Foreign Key ke Categories
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);`,
        },
        observationGuide:
          "Pada Langkah 1 Pengamatan: Buka Table Editor Supabase, periksa kolom id pada tabel categories dan tasks. Pastikan format nilainya adalah string heksadesimal 36 karakter (UUID v4).",
      },
      {
        id: 2,
        title: "Relasi 1:N & Penggabungan Relasional SQL JOIN Multi-Tabel",
        badge: "Relational JOIN O(N)",
        keywords: ["Foreign Key", "INNER JOIN", "Relasi 1:N", "Normalized Schema", "categories.id"],
        summary:
          "Foreign Key menghubungkan baris tabel anak ke tabel induk, memungkinkan kueri gabungan JOIN yang efisien dan ternormalisasi.",
        explanation:
          "1. **Prinsip Normalisasi Data**: Memisahkan entitas kategori dan tugas mencegah redundansi penulisan teks nama kategori berulang pada setiap tugas.\n\n" +
          "2. **Foreign Key Constraint**: Kolom `category_id UUID REFERENCES categories(id)` menjamin integritas hubungan antar-tabel di tingkat database engine.\n\n" +
          "3. **Eksekusi SQL JOIN**: Menggabungkan tabel anak dan induk menggunakan kueri `SELECT tasks.*, categories.name FROM tasks JOIN categories ON tasks.category_id = categories.id`.\n\n" +
          "4. **Efisiensi Kueri**: Database memanfaatkan indeks B-Tree pada Primary Key kategori untuk menyelesaikan penggabungan relasi secara instan.",
        codeSnippet: {
          filename: "Kueri SQL JOIN (Supabase SQL Editor)",
          language: "sql",
          code: `-- Mengambil daftar tugas beserta nama kategorinya
SELECT 
  t.id AS task_id,
  t.title,
  c.name AS category_name,
  t.created_at
FROM tasks t
JOIN categories c ON t.category_id = c.id
ORDER BY t.created_at DESC;`,
        },
        observationGuide:
          "Pada Langkah 2 Pengamatan: Masukkan data sampel ke kedua tabel lalu jalankan query JOIN di SQL Editor. Verifikasi bahwa kolom category_name terisi dari tabel categories.",
      },
      {
        id: 3,
        title: "Integritas Referensial & Kebijakan ON DELETE CASCADE",
        badge: "Referential Integrity",
        keywords: ["ON DELETE CASCADE", "RESTRICT / NO ACTION", "Orphaned Rows", "Foreign Key Violation"],
        summary:
          "Kebijakan CASCADE secara otomatis menghapus baris anak yang bergantung ketika baris induk dihapus, mencegah baris yatim (orphaned rows).",
        explanation:
          "1. **Perilaku Standar RESTRICT**: PostgreSQL menolak penghapusan baris induk jika masih terdapat baris anak yang merujuknya (*Foreign Key Violation Error 23503*).\n\n" +
          "2. **Pembersihan Otomatis CASCADE**: Klausul `ON DELETE CASCADE` memerintahkan database menghapus seluruh data tugas terkait secara atomik saat sebuah kategori dihapus.\n\n" +
          "3. **Pencegahan Data Yatim**: Menghindari anomali data di tabel `tasks` yang merujuk ke ID kategori yang sudah tidak ada (*orphaned records*).\n\n" +
          "4. **Aturan Kehati-hatian**: CASCADE harus diterapkan dengan bijak pada entitas induk-anak sejati, bukan pada entitas historis bernilai audit tinggi.",
        codeSnippet: {
          filename: "ALTER TABLE Constraint (SQL Editor)",
          language: "sql",
          code: `-- Mengubah Constraint menjadi ON DELETE CASCADE
ALTER TABLE tasks 
DROP CONSTRAINT tasks_category_id_fkey,
ADD CONSTRAINT tasks_category_id_fkey 
  FOREIGN KEY (category_id) 
  REFERENCES categories(id) 
  ON DELETE CASCADE;`,
        },
        observationGuide:
          "Pada Langkah 3 Pengamatan: Amati error penolakan saat menghapus kategori tanpa CASCADE, lalu uji kembali setelah constraint diubah menjadi ON DELETE CASCADE.",
      },
      {
        id: 4,
        title: "Arsitektur @supabase/ssr & Async Cookies Next.js 16",
        badge: "@supabase/ssr Architecture",
        keywords: ["@supabase/ssr", "createServerClient", "Async Cookies", "Server Components", "Node.js Runtime"],
        summary:
          "Paket @supabase/ssr mengelola sinkronisasi session dan pembacaan database di Server Component menggunakan helper cookies asinkron Next.js 16.",
        explanation:
          "1. **Kebutuhan Runtime Server**: Next.js 16 App Router mengeksekusi Server Component di server Node.js di mana browser storage (`localStorage`) tidak dapat diakses.\n\n" +
          "2. **Pola Async Cookies**: Helper `createServerClient` membaca token otorisasi dari HTTP cookies menggunakan `await cookies()` Next.js 16.\n\n" +
          "3. **Data Fetching Bebas Latensi**: Server Component melakukan kueri langsung ke Supabase tanpa perlu melewati API endpoint perantara (*0 kB Client Bundle*).\n\n" +
          "4. **Keamanan Kredensial**: Menggunakan environment variables server-side tanpa risiko membocorkan service key rahasia ke browser.",
        codeSnippet: {
          filename: "src/utils/supabase/server.ts",
          language: "typescript",
          code: `import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies(); // Async Cookies Next.js 16

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Abaikan jika dipanggil dari Server Component murni
          }
        },
      },
    }
  );
}`,
        },
        observationGuide:
          "Pada Langkah 4 Pengamatan: Buat utility server.ts lalu fetch data tasks dari Server Component page.tsx. Pastikan daftar data berhasil tampil di layar peramban.",
      },
      {
        id: 5,
        title: "Otomatisasi TypeScript Typegen dari Skema Database Aktif",
        badge: "End-to-End Type Safety",
        keywords: ["supabase gen types", "database.types.ts", "Zero-Manual Types", "Type Narrowing", "Intellisense"],
        summary:
          "Supabase CLI menginspeksi skema database PostgreSQL aktif dan menghasilkan antarmuka TypeScript lengkap secara instan.",
        explanation:
          "1. **Masalah Inkonsistensi Manual**: Menulis interface TypeScript secara manual rawan salah ketik nama kolom atau tipe data yang berbeda dengan skema database asli.\n\n" +
          "2. **Ekstraksi Skema Otomatis**: Perintah CLI `supabase gen types typescript` membaca katalog PostgreSQL dan menyusun type definition menyeluruh.\n\n" +
          "3. **Integrasi Generic Client**: Meneruskan tipe `createClient<Database>()` memberikan autocompletion nama tabel dan tipe kolom secara presisi di VS Code.\n\n" +
          "4. **Deteksi Error Compile-Time**: Perubahan skema di database akan memicu kompilasi error di TypeScript jika ada kode komponen yang tidak sinkron.",
        codeSnippet: {
          filename: "CLI Typegen & Penggunaan Tipenya",
          language: "bash",
          code: `# Eksekusi Generasi Tipe Otomatis via Supabase CLI:
npx supabase gen types typescript --project-id <id-proyek> > src/types/database.types.ts

# Penggunaan di Komponen TypeScript:
import { Database } from '@/types/database.types';
type Task = Database['public']['Tables']['tasks']['Row'];`,
        },
        observationGuide:
          "Pada Langkah 5 Pengamatan: Periksa file src/types/database.types.ts yang dihasilkan. Verifikasi adanya tipe kolom id, title, category_id pada interface Tables<'tasks'>.",
      },
    ],
    comparisonTable: {
      title: "Matriks Perbandingan Arsitektural: Supabase BaaS vs Self-Hosted PostgreSQL Tradisional",
      description: "Gunakan tabel komparasi ini sebagai acuan analisis komputasi relasional dan integrasi backend modern",
      colAHeader: "Supabase BaaS + @supabase/ssr",
      colBHeader: "Self-Hosted PostgreSQL + ORM (Prisma)",
      rows: [
        {
          aspect: "Infrastruktur & Provisioning Database",
          colA: "Tersedia instan di Cloud dengan Dashboard GUI, REST API, & Auth siap pakai",
          colB: "Wajib konfigurasi instance Linux/Docker, port security, dan koneksi pooling manual",
          badgeVerdict: "rsc-win",
          verdictText: "Supabase Zero DevOps",
        },
        {
          aspect: "Format Primary Key Bawaan",
          colA: "Dukungan native gen_random_uuid() (UUID v4 128-bit terdistribusi)",
          colB: "Sering menggunakan Serial Integer auto-increment yang rentan serangan enumerasi",
          badgeVerdict: "rsc-win",
          verdictText: "UUID Lebih Aman",
        },
        {
          aspect: "Sinkronisasi Tipe Data TypeScript",
          colA: "CLI Typegen otomatis mengekstrak skema database aktif ke database.types.ts",
          colB: "Bergantung pada schema.prisma file sekunder yang rawan desinkronisasi",
          badgeVerdict: "rsc-win",
          verdictText: "Typegen 100% Akurat",
        },
        {
          aspect: "Akses Server Component Next.js 16",
          colA: "Native via @supabase/ssr dengan adaptasi async cookies Next.js 16",
          colB: "Perlu mengelola instance singleton PrismaClient untuk menghindari koneksi bocor",
          badgeVerdict: "rsc-win",
          verdictText: "Integrasi SSR Native",
        },
        {
          aspect: "Integritas Relasi & Constraint",
          colA: "Dikelola di tingkat PostgreSQL kernel (Foreign Keys, CHECK, ON DELETE CASCADE)",
          colB: "Sering diabstraksikan di level aplikasi ORM sehingga rawan anomali kueri raw",
          badgeVerdict: "neutral",
          verdictText: "Standar SQL Relasional",
        },
        {
          aspect: "Fitur Ekosistem Tambahan",
          colA: "Terintegrasi penuh dengan Auth JWT, Storage Media CDN, dan WebSocket Realtime",
          colB: "Database murni; memerlukan integrasi pustaka eksternal pihak ketiga terpisah",
          badgeVerdict: "rsc-win",
          verdictText: "Ekosistem 4 Pilar Terpadu",
        },
        {
          aspect: "Kustomisasi Mesin Database",
          colA: "Akses SQL Editor penuh dan ekstensi PostgreSQL terpopuler (pgvector, uuid-ossp)",
          colB: "Kontrol penuh hingga tingkat OS server dan tuning file konfigurasi postgresql.conf",
          badgeVerdict: "neutral",
          verdictText: "Fleksibilitas Setara",
        },
      ],
    },
    goldenRules: [
      {
        id: 1,
        title: "Aturan Async Cookies Next.js 16 pada @supabase/ssr (Dilarang Sinkron)",
        type: "warning",
        explanation:
          "Di Next.js 16, fungsi cookies() adalah Promise asinkron. Selalu panggil 'const cookieStore = await cookies();' sebelum membaca atau menetapkan cookie. Mengakses cookies() secara sinkron akan memicu deprecation warning dan kegagalan membaca sesi otentikasi Supabase.",
        badExample: {
          title: "❌ Anti-Pattern (Pembacaan Sinkron Next.js Lama):",
          code: `// ❌ SALAH: Membaca cookies() tanpa await di Next.js 16!
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies(); // ERROR! cookies() mengembalikan Promise di Next.js 16
  return createServerClient(url, key, { ... });
}`,
          explanation: "Memicu runtime error 'cookies() should be awaited' dan menyebabkan Supabase gagal mengidentifikasi session pengguna.",
        },
        goodExample: {
          title: "✅ Best Practice (Async Cookies Next.js 16):",
          code: `// ✅ BENAR: Menggunakan await cookies()
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies(); // Sesuai standar Next.js 16
  return createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) { ... }
    }
  });
}`,
          explanation: "Menjamin ketersediaan cookie sesi secara stabil pada lingkungan Server Components dan Server Actions.",
        },
      },
      {
        id: 2,
        title: "Aturan Primary Key UUID v4 & Foreign Key Cascade (Database-Level Enforcement)",
        type: "dos",
        explanation:
          "Gunakan selalu tipe data UUID v4 sebagai Primary Key dan tegakkan relasi menggunakan Foreign Key Constraint dengan klausul ON DELETE CASCADE di level database DDL. Jangan menyerahkan integritas relasi hanya pada logika aplikasi.",
        badExample: {
          title: "❌ Anti-Pattern (Relasi Lemah Tanpa Constraint):",
          code: `-- ❌ SALAH: Kolom category_id tanpa Foreign Key Constraint
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT,
  category_id INT -- Tidak ada REFERENCES! Rawan data yatim jika kategori dihapus
);`,
          explanation: "Jika data kategori dihapus, baris tugas tetap tersisa dengan category_id invalid (orphaned records).",
        },
        goodExample: {
          title: "✅ Best Practice (UUID v4 + Foreign Key ON DELETE CASCADE):",
          code: `-- ✅ BENAR: UUID v4 dan Foreign Key Constraint CASCADE
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE
);`,
          explanation: "PostgreSQL otomatis menghapus baris tasks terkait saat kategori dihapus, menjamin integritas data 100%.",
        },
      },
    ],
  },
  4: {
    practicumId: 4,
    title: "Autentikasi Multi-Provider & Proteksi Rute Next.js 16 Proxy",
    subtitle: "Landasan Teori Stateless JWT, GitHub OAuth 2.0, Next.js 16 Network Boundary Proxy, dan HTTP-Only Session Cookies",
    cpmkTarget:
      "Mahasiswa mampu mengimplementasikan sistem autentikasi lengkap menggunakan Supabase Auth dengan Email/Password dan GitHub OAuth 2.0, mengamankan rute privat menggunakan Next.js 16 Proxy (src/proxy.ts), serta mengelola session pengguna secara aman di Server Components dan otomatisasi profile via database trigger.",
    subCpmk: [
      "Mengonfigurasi Autentikasi Pengguna: Mengaktifkan provider Email/Password dan mengonfigurasi protokol delegasi otorisasi GitHub OAuth 2.0 pada Supabase Auth.",
      "Mengamankan Rute Privat via Next.js 16 Proxy: Membangun logika proteksi sesi pengguna di Next.js 16 Proxy (src/proxy.ts) untuk melakukan pengalihan rute (redirect) otomatis sebelum halaman dimuat.",
      "Mengelola Siklus Sesi Kriptografis: Membaca dan memvalidasi JSON Web Token (JWT) sesi pengguna aktif di lingkungan Server Components menggunakan utilitas async cookies.",
      "Menangani Pertukaran Kode OAuth Callback: Membangun Route Handler callback untuk menukarkan authorization code menjadi sesi persisten HTTP-Only cookie.",
      "Memvalidasi Sesi Server-Side Terverifikasi: Membedakan metode getUser() terverifikasi kriptografis vs getSession() pada Server Components.",
    ],
    concepts: [
      {
        id: 1,
        title: "Identitas Pengguna: Skema auth.users vs Skema Publik & Password Hash",
        badge: "JWT Auth Architecture",
        keywords: ["auth.users", "JWT (JSON Web Token)", "bcrypt Hash", "Stateless Session", "public schema isolation"],
        summary:
          "Supabase mengisolasi kredensial pengguna di skema privat auth.users dengan hash bcrypt dan memvalidasi sesi menggunakan token JWT stateless.",
        explanation:
          "1. **Isolasi Skema Database**: Supabase memisahkan data akun ke dalam skema privat `auth.users` yang tidak dapat diakses langsung oleh kueri REST API publik.\n\n" +
          "2. **Hashing Kriptografis bcrypt**: Password pengguna tidak pernah disimpan dalam format teks polos, melainkan di-hash menggunakan algoritma *salted bcrypt*.\n\n" +
          "3. **Stateless JSON Web Token (JWT)**: Setelah login berhasil, server menerbitkan token akses JWT bertandatangan digital yang membawa identitas pengguna (`sub` / `auth.uid()`).\n\n" +
          "4. **Rotasi Access & Refresh Token**: Token akses memiliki masa berlaku pendek (~1 jam) dan diperbarui secara otomatis menggunakan refresh token yang tersimpan aman di cookie.",
        codeSnippet: {
          filename: "Karakteristik Skema auth.users (Supabase Dashboard)",
          language: "sql",
          code: `-- Data akun disimpan terisolasi di skema auth (bukan public):
SELECT 
  id, 
  email, 
  encrypted_password, -- Hash bcrypt satu arah
  email_confirmed_at,
  created_at
FROM auth.users;`,
        },
        observationGuide:
          "Pada Langkah 1 Pengamatan: Buka Supabase Auth > Users dan buat user test. Periksa apakah password ditampilkan atau disembunyikan dalam bentuk hash terenkripsi.",
      },
      {
        id: 2,
        title: "Protokol Delegasi Otorisasi: GitHub OAuth 2.0 & Callback Exchange",
        badge: "OAuth 2.0 Authorization Flow",
        keywords: ["OAuth 2.0", "Authorization Code", "Client ID & Secret", "Callback URL", "Consent Screen"],
        summary:
          "GitHub OAuth 2.0 mendelegasikan verifikasi identitas pengguna tanpa membagikan kata sandi ke aplikasi kita melalui protokol Authorization Code.",
        explanation:
          "1. **Prinsip Delegasi Otorisasi**: Pengguna memberikan izin kepada aplikasi kita untuk mengakses identitas publik GitHub tanpa perlu menyerahkan kredensial kata sandi.\n\n" +
          "2. **Registrasi OAuth App**: Memerlukan konfigurasi `Client ID`, `Client Secret`, dan `Authorization callback URL` (`http://localhost:3000/auth/callback`).\n\n" +
          "3. **Alur Authorization Code**: Browser diarahkan ke layar konfirmasi GitHub → Pengguna menyetujui → GitHub me-redirect kembali ke aplikasi membawa kode otorisasi sementara (`?code=...`).\n\n" +
          "4. **Penukaran Token Sesi**: Server kita menukarkan kode tersebut ke Supabase Auth untuk menghasilkan sesi login pengguna secara instan.",
        codeSnippet: {
          filename: "src/components/login-github-button.tsx",
          language: "tsx",
          code: `'use client';
import { createClient } from '@/utils/supabase/client';

export function LoginGithubButton() {
  const handleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: \`\${location.origin}/auth/callback\`,
      },
    });
  };

  return <button onClick={handleLogin}>Login dengan GitHub</button>;
}`,
        },
        observationGuide:
          "Pada Langkah 2 Pengamatan: Klik tombol Login GitHub, amati pengalihan layar persetujuan GitHub, lalu verifikasi pengguna berhasil kembali ke aplikasi dengan sesi aktif.",
      },
      {
        id: 3,
        title: "Proteksi Rute Lapisan Terluar via Next.js 16 Proxy (src/proxy.ts)",
        badge: "Network Boundary Proxy Guard",
        keywords: ["src/proxy.ts", "Node.js Runtime", "Network Boundary", "Zero-Latency Redirect", "Session Inspection", "Matcher Pattern"],
        summary:
          "Next.js 16 Proxy (src/proxy.ts) mencegat request HTTP di Network Boundary sebelum halaman dimuat, mengalihkan pengguna yang tidak memiliki sesi aktif ke /login.",
        explanation:
          "1. **Eksekusi di Lapisan Network Terluar**: Proxy berjalan di Node.js runtime sebelum request mencapai React Server Component atau Route Handler.\n\n" +
          "2. **Pola Matcher Protektif**: Menentukan jalur yang diproteksi (misal `/dashboard/:path*`, `/tasks/:path*`) agar aset statis dan rute publik tidak terblokir.\n\n" +
          "3. **Inspeksi Sesi Otentikasi**: Membaca cookie sesi pengguna menggunakan helper `@supabase/ssr` updateSession() di src/utils/supabase/middleware.ts.\n\n" +
          "4. **Redirect Otomatis Bebas Latensi**: Jika session tidak ditemukan, pengguna langsung diarahkan (`NextResponse.redirect('/login')`) tanpa merender halaman internal sama sekali.",
        codeSnippet: {
          filename: "src/proxy.ts (Root Project - Konvensi Resmi Next.js 16)",
          language: "typescript",
          code: `import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function proxy(request: NextRequest) {
  // Panggil helper session refresher Supabase
  return await updateSession(request);
}

export const config = {
  matcher: ['/dashboard/:path*', '/tasks/:path*'],
};`,
        },
        observationGuide:
          "Pada Langkah 3 Pengamatan: Akses rute /dashboard langsung di browser tanpa login. Verifikasi bahwa URL otomatis dialihkan ke /login secara instan.",
      },
      {
        id: 4,
        title: "Penanganan OAuth Callback & Sinkronisasi Cookie HTTP-Only",
        badge: "Session Cookie Exchange",
        keywords: ["app/auth/callback/route.ts", "exchangeCodeForSession", "sb-access-token", "HTTP-Only Cookies"],
        summary:
          "Route Handler /auth/callback menukarkan authorization code sementara menjadi token sesi persisten yang disimpan dalam cookie terenkripsi.",
        explanation:
          "1. **Penerima Callback Eksternal**: Route Handler di `app/auth/callback/route.ts` menerima parameter URL `?code=...` yang dikirimkan oleh GitHub OAuth.\n\n" +
          "2. **Metode exchangeCodeForSession**: Supabase client menukarkan kode tersebut ke auth server untuk memperoleh access token dan refresh token.\n\n" +
          "3. **Penyimpanan HTTP-Only Cookie**: Token disimpan dalam cookie browser dengan flag `HttpOnly` dan `Secure`, memblokir pencurian sesi melalui skrip jahat (*XSS Attack*).\n\n" +
          "4. **Pengalihan ke Halaman Utama**: Setelah cookie tertanam, server mengalihkan pengguna ke halaman dashboard tujuan.",
        codeSnippet: {
          filename: "app/auth/callback/route.ts",
          language: "typescript",
          code: `import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(\`\${origin}\${next}\`);
    }
  }

  return NextResponse.redirect(\`\${origin}/login?error=auth-failed\`);
}`,
        },
        observationGuide:
          "Pada Langkah 4 Pengamatan: Buka DevTools > Application > Cookies setelah login GitHub. Periksa keberadaan cookie sb-access-token dan sb-refresh-token.",
      },
      {
        id: 5,
        title: "Verifikasi Sesi Server-Side: getUser() vs getSession() di RSC",
        badge: "Server-Side User Session",
        keywords: ["supabase.auth.getUser()", "Server Component Session", "User Profile Display", "CSRF Protection"],
        summary:
          "Membaca identitas pengguna langsung di server menggunakan getUser() memberikan keamanan bebas pemalsuan token di browser.",
        explanation:
          "1. **Bahaya getSession() di Server**: Metode `getSession()` hanya mendekode payload JWT lokal tanpa memvalidasi keaslian signature ke server Auth, sehingga rentan jika token telah dicabut.\n\n" +
          "2. **Keamanan Baku getUser()**: Metode `getUser()` menghubungi Supabase Auth server untuk memverifikasi keabsahan token dan memastikan status akun masih aktif.\n\n" +
          "3. **Pengambilan Profil di RSC**: Server Component dapat membaca email, metadata nama, dan avatar pengguna secara instan sebelum HTML dikirim ke browser.\n\n" +
          "4. **Zero-Flicker UI**: Navbar langsung menampilkan nama dan avatar pengguna tanpa ada kedipan loading state (*Hydration Flicker*).",
        codeSnippet: {
          filename: "src/components/navbar-user.tsx (Server Component)",
          language: "tsx",
          code: `import { createClient } from '@/utils/supabase/server';

export async function NavbarUser() {
  const supabase = await createClient();
  // Selalu gunakan getUser() di Server Component:
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <a href="/login">Masuk</a>;
  }

  return (
    <div className="flex items-center gap-2">
      <img src={user.user_metadata.avatar_url} className="w-8 h-8 rounded-full" />
      <span>{user.email}</span>
    </div>
  );
}`,
        },
        observationGuide:
          "Pada Langkah 5 Pengamatan: Refresh halaman dashboard saat login. Verifikasi bahwa email dan profil pengguna muncul langsung di navbar dari server.",
      },
    ],
    comparisonTable: {
      title: "Matriks Perbandingan Arsitektural: Supabase Auth + Edge Middleware vs Custom Auth Tradisional",
      description: "Gunakan tabel komparasi ini sebagai rujukan evaluasi keamanan sesi dan arsitektur otentikasi terdistribusi",
      colAHeader: "Supabase Auth + Next.js 16 Middleware",
      colBHeader: "Custom Auth (Express + Session Redis)",
      rows: [
        {
          aspect: "Penyimpanan Kredensial & Password",
          colA: "Terisolasi di skema auth.users dengan salted bcrypt bawaan engine",
          colB: "Wajib merancang tabel users manual dan mengelola algoritma hashing sendiri",
          badgeVerdict: "rsc-win",
          verdictText: "Supabase Terisolasi Aman",
        },
        {
          aspect: "Integrasi Provider OAuth 2.0 (GitHub)",
          colA: "Tinggal memasukkan Client ID & Secret di Dashboard GUI Supabase",
          colB: "Wajib merakit strategi Passport.js dan alur token exchange secara manual",
          badgeVerdict: "rsc-win",
          verdictText: "Konfigurasi 1-Klik",
        },
        {
          aspect: "Lokasi Proteksi Rute Terlarang",
          colA: "Next.js Edge Middleware (mencegat sebelum halaman/server dirender)",
          colB: "Middleware Express di backend atau redirect kondisional di React client",
          badgeVerdict: "rsc-win",
          verdictText: "Edge Guard Lebih Cepat",
        },
        {
          aspect: "Mekanisme Sesi Pengguna",
          colA: "Stateless JWT dengan refresh token rotasi otomatis via HTTP-Only cookie",
          colB: "Stateful session berbasis memori server atau cluster database Redis terpisah",
          badgeVerdict: "rsc-win",
          verdictText: "Stateless & Scalable",
        },
        {
          aspect: "Metode Verifikasi Server Baku",
          colA: "supabase.auth.getUser() (tervalidasi kriptografis ke Auth server)",
          colB: "Kueri session store Redis pada setiap request yang masuk",
          badgeVerdict: "neutral",
          verdictText: "Sama-Sama Terverifikasi",
        },
        {
          aspect: "Integrasi dengan Row Level Security",
          colA: "Terhubung native via fungsi SQL auth.uid() pada level mesin database",
          colB: "Tidak terhubung ke database; filter user_id wajib ditulis manual di setiap query",
          badgeVerdict: "rsc-win",
          verdictText: "Native auth.uid() di RLS",
        },
        {
          aspect: "Kompleksitas Pemeliharaan Kode",
          colA: "Ramping, modular, dan terkelola secara otomatis oleh ekosistem BaaS",
          colB: "Tinggi; bertanggung jawab penuh atas celah keamanan dan pembaruan patch",
          badgeVerdict: "rsc-win",
          verdictText: "Zero Security Overhead",
        },
      ],
    },
    goldenRules: [
      {
        id: 1,
        title: "Aturan Penggunaan getUser() di Lingkungan Server (Dilarang getSession())",
        type: "warning",
        explanation:
          "Di Server Components, Server Actions, dan Next.js 16 Proxy (`src/proxy.ts`), selalu gunakan 'supabase.auth.getUser()' untuk memverifikasi identitas pengguna. Jangan gunakan 'getSession()' untuk keputusan keamanan karena getSession() hanya membaca cookie tanpa memvalidasi keabsahan token ke Supabase Auth server.",
        badExample: {
          title: "❌ Anti-Pattern (Mengandalkan getSession() di Server):",
          code: `// ❌ SALAH: getSession() tidak memvalidasi ulang token ke server!
export async function ServerPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession(); // Rawan token kadaluarsa/dicabut!
  if (!session) redirect('/login');
}`,
          explanation: "Pengguna dengan token yang telah diblokir masih bisa mengakses rute privat karena token tidak diverifikasi ke server.",
        },
        goodExample: {
          title: "✅ Best Practice (Verifikasi Kriptografis via getUser()):",
          code: `// ✅ BENAR: getUser() memvalidasi token secara otentik
export async function ServerPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser(); // Aman & terverifikasi 100%
  if (error || !user) redirect('/login');
}`,
          explanation: "Menjamin bahwa pengguna yang sedang mengakses halaman memiliki status akun valid dan token yang aktif.",
        },
      },
      {
        id: 2,
        title: "Aturan Penyimpanan Sesi: HTTP-Only Cookies (Dilarang localStorage)",
        type: "dos",
        explanation:
          "Gunakan selalu paket @supabase/ssr yang menyimpan token dalam HTTP-Only cookies. Jangan pernah menyimpan access token atau refresh token di localStorage browser karena rentan dicuri oleh serangan Cross-Site Scripting (XSS).",
        badExample: {
          title: "❌ Anti-Pattern (Menyimpan Token di localStorage):",
          code: `// ❌ SALAH: Menyimpan token di localStorage
localStorage.setItem('access_token', token); // BAHAYA: Skrip XSS dapat mencuri token ini!`,
          explanation: "Jika ada dependensi NPM atau skrip pihak ketiga yang disusupi malware, seluruh token pengguna dapat dicuri dengan mudah.",
        },
        goodExample: {
          title: "✅ Best Practice (Cookie HTTP-Only via @supabase/ssr):",
          code: `// ✅ BENAR: Dikelola otomatis oleh @supabase/ssr dalam cookie HTTP-Only
// Cookie memiliki atribut: HttpOnly; Secure; SameSite=Lax
// Skrip JavaScript peramban TIDAK BISA membaca token ini secara fisik!`,
          explanation: "Melindungi sesi pengguna dari pencurian token melalui eksploitasi peramban atau XSS.",
        },
      },
    ],
  },
  5: {
    practicumId: 5,
    title: "Integrasi CRUD & Universal REST API Route Handlers",
    subtitle: "Landasan Teori Dual Architecture (Server Actions BFF + Universal Route Handlers), Bearer JWT Token, Async Params Next.js 16, dan URL as State Manager",
    cpmkTarget:
      "Mahasiswa mampu mengimplementasikan arsitektur ganda (Server Actions untuk web UI internal dan Universal REST API Route Handlers untuk klien eksternal), menerapkan otentikasi Bearer JWT token, menangani dynamic async params Next.js 16, serta mengelola URL as State manager.",
    subCpmk: [
      "Menerapkan Mutasi CRUD & Revalidasi On-Demand: Mengimplementasikan Server Actions untuk operasi mutasi data dan memperbarui cache antarmuka secara instan menggunakan revalidatePath().",
      "Membangun Universal Route Handlers Terstandarisasi: Merancang endpoint GET kolektif dengan ekstraksi SearchParams, pagination range Supabase, dan format respons RFC-compliant.",
      "Mengamankan REST API via Bearer JWT: Menerapkan proteksi endpoint stateless menggunakan verifikasi Authorization: Bearer <token> dan error envelope HTTP 401 Unauthorized.",
      "Mengelola Dynamic Route Handlers Asinkron: Menangani parameter rute dinamis [id] menggunakan paradigma Promise-based (await params) Next.js 16 pada method GET dan DELETE.",
      "Mengimplementasikan URL as State Manager: Menyelaraskan state filter dan pencarian ke URL Search Parameters guna mendukung deep linking dan reaktivitas Server Component.",
    ],
    concepts: [
      {
        id: 1,
        title: "Mutasi Internal CRUD & On-Demand Revalidation (revalidatePath)",
        badge: "Internal BFF Mutation",
        keywords: ["Server Actions BFF", "revalidatePath()", "Instant Cache Purge", "No Full Page Reload", "Data Mutation"],
        summary:
          "Server Actions bertindak sebagai Backend-for-Frontend (BFF) untuk mutasi data internal, di mana revalidatePath() membersihkan cache server seketika tanpa reload browser.",
        explanation:
          "1. **Dual Architecture Pattern**: Web internal memanfaatkan **Server Actions** sebagai Backend-for-Frontend (BFF) murni tanpa perlu serialisasi manual via `fetch()`.\n\n" +
          "2. **Operasi Mutasi Database**: Server Action menjalankan mutasi `supabase.from('tasks').insert(...)` langsung di server Node.js dengan hak akses terverifikasi.\n\n" +
          "3. **On-Demand Cache Purge**: Pemanggilan `revalidatePath('/tasks')` membersihkan cache halaman di memori server dan memicu render ulang data terbaru ke peramban secara otomatis tanpa reload halaman.\n\n" +
          "4. **Konsistensi UI Instan**: Pengguna langsung melihat baris tugas baru muncul di daftar tabel dalam satu siklus round-trip mutasi yang mulus.",
        codeSnippet: {
          filename: "src/actions/task-crud.ts",
          language: "typescript",
          code: `'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function createTaskAction(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get('title') as string;

  const { error } = await supabase.from('tasks').insert({ title });
  if (error) throw new Error(error.message);

  // Membersihkan cache halaman secara instan tanpa reload browser:
  revalidatePath('/tasks');
}`,
        },
        observationGuide:
          "Pada Langkah 1 Pengamatan: Buat tugas baru melalui Server Action. Perhatikan bahwa baris tugas baru langsung muncul di daftar UI tanpa perlu memuat ulang peramban secara manual (revalidatePath bekerja).",
      },
      {
        id: 2,
        title: "Universal Route Handler GET & SearchParams Range Pagination",
        badge: "Public REST API Endpoint",
        keywords: ["Route Handler GET", "URL SearchParams", "Range Pagination", "Envelope Response", "External Clients"],
        summary:
          "Universal Route Handler GET menyediakan akses data terbuka bagi klien pihak ketiga dengan dukungan pagination range Supabase yang efisien.",
        explanation:
          "1. **Kebutuhan Universal API**: Klien eksternal (aplikasi mobile Flutter/React Native, webhooks, atau integrasi pihak ketiga) membutuhkan endpoint REST baku yang tidak terikat sesi form web.\n\n" +
          "2. **Pola File Route Handler**: Berkas `src/app/api/v1/tasks/route.ts` mengekspor fungsi HTTP `export async function GET(request: Request)`.\n\n" +
          "3. **Ekstraksi SearchParams Dinamis**: Membaca parameter kueri URL `new URL(request.url).searchParams` untuk nilai `page` dan `limit`.\n\n" +
          "4. **Efisiensi Range Pagination**: Menerapkan klausul `.range(from, to)` pada kueri Supabase guna membatasi payload data dan mengembalikan envelope pagination `{ page, limit, total }` yang terstandarisasi.",
        codeSnippet: {
          filename: "src/app/api/v1/tasks/route.ts",
          language: "typescript",
          code: `import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();
  const { data, count, error } = await supabase
    .from('tasks')
    .select('*', { count: 'exact' })
    .range(from, to);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data,
    pagination: { page, limit, total: count },
  });
}`,
        },
        observationGuide:
          "Pada Langkah 2 Pengamatan: Akses endpoint /api/v1/tasks?page=1&limit=5 melalui peramban atau Thunder Client. Verifikasi kembalian status HTTP 200 OK beserta metadata pagination yang akurat.",
      },
      {
        id: 3,
        title: "Proteksi Endpoint Stateless via Bearer JWT Authorization",
        badge: "Stateless Token Security",
        keywords: ["Bearer Token", "Authorization Header", "HTTP 401 Unauthorized", "Stateless Authentication", "JWT Verification"],
        summary:
          "Endpoint REST diamankan secara stateless dengan memverifikasi header Authorization Bearer token ke Supabase Auth sebelum memproses request.",
        explanation:
          "1. **Stateless API Security**: Route Handler publik dilarang mengandalkan session cookies peramban karena klien mobile dan cURL beroperasi secara *cookie-less*.\n\n" +
          "2. **Inspeksi Header Authorization**: Server memeriksa header HTTP `Authorization` dan memvalidasi prefiks `Bearer <jwt_token>`.\n\n" +
          "3. **Validasi Kriptografis Token**: Helper `supabase.auth.getUser(token)` memverifikasi signature token ke Auth engine untuk mengekstrak identitas pemanggil.\n\n" +
          "4. **Pertahanan HTTP 401 Unauthorized**: Jika header absen atau token palsu/kadaluarsa, Route Handler seketika menolak eksekusi dan mengembalikan respons `{ success: false, error: 'Unauthorized' }` dengan kode status 401.",
        codeSnippet: {
          filename: "src/app/api/v1/tasks/route.ts (POST Protection)",
          language: "typescript",
          code: `export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Missing Bearer Token' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Invalid Token' }, { status: 401 });
  }

  const body = await request.json();
  const { data, error } = await supabase.from('tasks').insert({ ...body, user_id: user.id }).select().single();

  return NextResponse.json({ success: true, data }, { status: 201 });
}`,
        },
        observationGuide:
          "Pada Langkah 3 Pengamatan: Kirim request POST ke /api/v1/tasks tanpa menyertakan header Authorization. Amati penolakan HTTP 401 Unauthorized, lalu ulangi dengan Bearer token yang valid untuk menghasilkan HTTP 201 Created.",
      },
      {
        id: 4,
        title: "Dynamic Route Handlers & Resolusi Asinkron await params Next.js 16",
        badge: "Async Dynamic Parameters",
        keywords: ["await params", "Dynamic Routes [id]", "HTTP 404 Not Found", "Breaking Changes Next.js 16", "DELETE Method"],
        summary:
          "Next.js 16 mewajibkan await params untuk mengekstrak parameter rute dinamis [id], menangani operasi spesifik ID seperti GET detail dan DELETE.",
        explanation:
          "1. **Breaking Changes Next.js 16**: Properti `params` pada route handler folder dinamis `[id]/route.ts` kini bertipe `Promise<{ id: string }>`.\n\n" +
          "2. **Kewajiban await params**: Pengembang wajib mengeksekusi `const { id } = await params;` sebelum membaca parameter ID guna mencegah galat runtime dan warning kompilasi.\n\n" +
          "3. **Penanganan Resource Spesifik**: Endpoint menangani method `GET` untuk detail tugas tunggal dan `DELETE` untuk penghapusan baris data berdasarkan ID UUID.\n\n" +
          "4. **Penanganan HTTP 404 Not Found**: Mengembalikan kode status 404 ketika ID acak yang diminta tidak ditemukan di database.",
        codeSnippet: {
          filename: "src/app/api/v1/tasks/[id]/route.ts",
          language: "typescript",
          code: `import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Wajib Promise di Next.js 16!
) {
  const { id } = await params; // Wajib di-await!
  const supabase = await createClient();

  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: \`Tugas \${id} berhasil dihapus\` });
}`,
        },
        observationGuide:
          "Pada Langkah 4 Pengamatan: Panggil GET /api/v1/tasks/<uuid-valid> dan bandingkan hasilnya saat memanggil ID acak tak dikenal. Pastikan ID valid menghasilkan 200 OK dan ID asing menghasilkan 404 Not Found.",
      },
      {
        id: 5,
        title: "Arsitektur 'URL as State Manager' & Sinkronisasi Server Component",
        badge: "Global URL State",
        keywords: ["URL as State", "searchParams Sync", "Deep Linking", "Filter & Pagination", "Zero Loss on Refresh"],
        summary:
          "Menyimpan parameter filter di query URL peramban memungkinkan Server Component merender data terfilter secara native dan mendukung bookmarking.",
        explanation:
          "1. **Kelemahan useState Lokal**: State filter yang disimpan di `useState` akan hilang saat pengguna me-refresh halaman atau membagikan tautan ke rekan kerja.\n\n" +
          "2. **Prinsip URL Single Source of Truth**: Parameter filter (misal `?status=done&search=database`) disimpan langsung di query string URL peramban via `useRouter().push()`.\n\n" +
          "3. **Pembacaan Langsung di Server Component**: Server Component membaca prop `searchParams` (`await searchParams`) dan menjalankan kueri database yang telah terfilter sebelum HTML dirender.\n\n" +
          "4. **Mendukung Deep Linking & Bookmark**: Pengguna dapat menyalin URL, membagikannya di chat, atau mem-bookmark halaman dengan hasil filter yang 100% konsisten.",
        codeSnippet: {
          filename: "src/app/tasks/page.tsx (Server Component)",
          language: "tsx",
          code: `import { createClient } from '@/utils/supabase/server';

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams; // Next.js 16 async searchParams
  const supabase = await createClient();

  let query = supabase.from('tasks').select('*');
  if (status) query = query.eq('status', status);

  const { data: tasks } = await query;

  return (
    <div>
      <h1 className="text-xl font-bold">Daftar Tugas (Filter: {status || 'Semua'})</h1>
      {/* Tampilkan data tasks */}
    </div>
  );
}`,
        },
        observationGuide:
          "Pada Langkah 5 Pengamatan: Ubah filter status menjadi 'done', lalu salin URL /tasks?status=done ke tab baru (incognito). Verifikasi bahwa halaman langsung menampilkan data terfilter tanpa interaksi tambahan.",
      },
    ],
    comparisonTable: {
      title: "Matriks Perbandingan Arsitektural: Server Actions RPC vs Universal REST API Route Handlers",
      description: "Gunakan tabel komparasi ini sebagai rujukan evaluasi pemilihan paradigma mutasi internal vs integrasi eksternal",
      colAHeader: "Server Actions RPC (BFF Internal)",
      colBHeader: "Universal REST API Route Handlers",
      rows: [
        {
          aspect: "Target Konsumen Utama",
          colA: "Aplikasi web internal (UI Formulir & Komponen Next.js)",
          colB: "Klien eksternal universal (Mobile Apps, Webhooks, Integrasi Pihak Ke-3)",
          badgeVerdict: "neutral",
          verdictText: "Sesuai Kebutuhan Klien",
        },
        {
          aspect: "Protokol Komunikasi",
          colA: "Remote Procedure Call (RPC) terenkapsulasi via HTTP POST",
          colB: "Standar Terbuka RESTful (GET, POST, PUT, DELETE, PATCH)",
          badgeVerdict: "neutral",
          verdictText: "RPC vs REST Baku",
        },
        {
          aspect: "Mekanisme Otentikasi",
          colA: "Otomatis membaca HttpOnly Cookie sesi peramban",
          colB: "Stateless Bearer JWT Token di header Authorization",
          badgeVerdict: "rsc-win",
          verdictText: "Server Actions Bebas Header Manual",
        },
        {
          aspect: "Revalidasi Cache Antarmuka",
          colA: "Native via revalidatePath() atau revalidateTag()",
          colB: "Wajib memicu revalidasi manual atau invalidasi cache klien (SWR/TanStack)",
          badgeVerdict: "rsc-win",
          verdictText: "Server Actions Otomatis Bersihkan Cache",
        },
        {
          aspect: "Dukungan Integrasi Eksternal",
          colA: "Sangat sulit (terikat format serialisasi internal Next.js)",
          colB: "Sangat mudah (dapat dikonsumsi cURL, Postman, Flutter, iOS)",
          badgeVerdict: "client-win",
          verdictText: "Route Handlers Universal 100%",
        },
        {
          aspect: "Keamanan Endpoint Publik",
          colA: "Aman secara bawaan (terlindungi CSRF token & Origin check)",
          colB: "Wajib memvalidasi manual CORS, Rate Limit, dan Bearer token",
          badgeVerdict: "rsc-win",
          verdictText: "Server Actions Aman Bawaan",
        },
        {
          aspect: "Serialisasi Data Balikan",
          colA: "ActionState<T> dengan typed fields (bebas parsing JSON)",
          colB: "NextResponse.json() dengan status code HTTP eksplisit",
          badgeVerdict: "neutral",
          verdictText: "Tergantung Arsitektur",
        },
      ],
    },
    goldenRules: [
      {
        id: 1,
        title: "Aturan Wajib Resolusi Asinkron 'await params' di Next.js 16",
        type: "warning",
        explanation:
          "Di Next.js 16, parameter rute dinamis (params) dan pencarian (searchParams) bertipe Promise. Selalu gunakan 'await params' sebelum membaca nilainya. Membaca properti secara sinkron (params.id) akan memicu runtime error atau warning kompilasi.",
        badExample: {
          title: "❌ Anti-Pattern (Akses Properti Sinkron):",
          code: `// ❌ SALAH: params diakses sinkron di Next.js 16
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id; // Warning TS & Potensi runtime failure!
  return NextResponse.json({ id });
}`,
          explanation: "Menyebabkan warning deprecation dan potensi kegagalan resolusi parameter dinamis di lingkungan build produksi.",
        },
        goodExample: {
          title: "✅ Best Practice (Resolusi Asinkron via await):",
          code: `// ✅ BENAR: Menggunakan Promise dan await
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // 100% Type-Safe & Kompatibel Next.js 16
  return NextResponse.json({ id });
}`,
          explanation: "Menjamin kompatibilitas penuh dengan pipeline rendering asinkron Next.js 16.",
        },
      },
      {
        id: 2,
        title: "Aturan Standarisasi Kontrak Envelope Respons REST API",
        type: "dos",
        explanation:
          "Selalu bungkus respons Route Handler dalam envelope JSON terstandarisasi yang memuat flag 'success', data muatan utama ('data'), serta pesan galat yang jelas ('error'). Jangan pernah mengembalikan raw array atau teks tanpa status pembungkus.",
        badExample: {
          title: "❌ Anti-Pattern (Respons JSON Mentah Tanpa Envelope):",
          code: `// ❌ SALAH: Mengembalikan array mentah tanpa status pembungkus
return NextResponse.json(tasks); // Klien sulit mendeteksi status sukses vs error secara konsisten`,
          explanation: "Menyulitkan parsing pada klien mobile dan membuat penanganan error tidak seragam.",
        },
        goodExample: {
          title: "✅ Best Practice (Envelope Terstandarisasi):",
          code: `// ✅ BENAR: Format envelope konsisten
return NextResponse.json({
  success: true,
  data: tasks,
  pagination: { page, limit, total }
});`,
          explanation: "Memudahkan klien mobile dan pihak ketiga memvalidasi status respons secara seragam di seluruh endpoint.",
        },
      },
    ],
  },
  6: {
    practicumId: 6,
    title: "Supabase Real-time: Kolaborasi WebSocket & Presence",
    subtitle: "Landasan Teori PostgreSQL Write-Ahead Log (WAL) Streaming, WebSocket Channels, Broadcast Mutasi, dan Pelacakan Pengguna via Presence API",
    cpmkTarget:
      "Mahasiswa mampu mengimplementasikan sinkronisasi data real-time menggunakan Supabase Realtime (WebSocket), mengonfigurasi listener 'postgres_changes' untuk event INSERT/UPDATE/DELETE, mendeteksi pengguna online dengan Presence API, serta mengelola lifecycle koneksi channel tanpa memory leak.",
    subCpmk: [
      "Mengonfigurasi Publikasi Replikasi PostgreSQL: Mengaktifkan replikasi tabel ke publikasi supabase_realtime pada level database untuk memancarkan perubahan baris data.",
      "Membangun Saluran Langganan WebSocket: Menginisialisasi koneksi persisten dua arah (channel) dan menangani siklus status langganan (SUBSCRIBED, TIMEOUT, CLOSED).",
      "Mencegat Event Perubahan Baris Data: Mengonfigurasi listener postgres_changes untuk menangkap payload mutasi INSERT, UPDATE, dan DELETE secara instan.",
      "Menyinkronkan State Reaktif Multi-Klien: Memperbarui state lokal React secara reaktif saat menerima broadcast mutasi guna menyajikan kolaborasi multi-tab bebas refresh (< 1 detik).",
      "Mengimplementasikan Pelacakan Kehadiran (Presence API): Mengirimkan status kehadiran pengguna terdistribusi via track() dan mendengarkan event sync untuk menghitung jumlah pengguna online.",
    ],
    concepts: [
      {
        id: 1,
        title: "Arsitektur PostgreSQL Write-Ahead Log (WAL) & Publikasi Replikasi",
        badge: "Postgres WAL Replication",
        keywords: ["Write-Ahead Log (WAL)", "supabase_realtime", "Logical Replication", "Zero-Polling", "Database Publication"],
        summary:
          "Supabase Realtime mendengarkan Write-Ahead Log (WAL) PostgreSQL melalui replication slot dan memancarkan mutasi tabel yang terdaftar pada publikasi supabase_realtime.",
        explanation:
          "1. **PostgreSQL WAL Engine**: Setiap mutasi SQL (INSERT/UPDATE/DELETE) dicatat terlebih dahulu ke dalam berkas Write-Ahead Log (WAL) sebelum disimpan permanen ke disk.\n\n" +
          "2. **Logical Replication Slot**: Server Supabase Realtime membaca aliran perubahan WAL secara langsung melalui slot replikasi internal.\n\n" +
          "3. **Publikasi supabase_realtime**: Hanya tabel yang secara eksplisit didaftarkan ke publikasi database (`ALTER PUBLICATION supabase_realtime ADD TABLE tasks;`) yang akan disiarkan ke luar.\n\n" +
          "4. **Efisiensi Database Bandwidth**: Tabel tanpa publikasi realtime tidak membebani koneksi WebSocket klien, menghemat sumber daya CPU dan memori database.",
        codeSnippet: {
          filename: "SQL DDL Publikasi Realtime (Supabase SQL Editor)",
          language: "sql",
          code: `-- Daftarkan tabel tasks ke publikasi replikasi real-time:
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;

-- Verifikasi tabel yang terdaftar dalam publikasi:
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';`,
        },
        observationGuide:
          "Pada Langkah 1 Pengamatan: Buka Supabase Dashboard > Database > Publications. Pastikan tabel tasks berstatus centang aktif pada publikasi supabase_realtime.",
      },
      {
        id: 2,
        title: "Saluran Persisten Dua Arah & Lifecycle Subscription WebSocket",
        badge: "WebSocket Channel Lifecycle",
        keywords: ["supabase.channel()", "SUBSCRIBED", "WebSocket Handshake", "Auto-Reconnect", "Connection Lifecycle"],
        summary:
          "Klien browser membuka koneksi persisten dua arah (channel) dan memantau status langganan seperti SUBSCRIBED untuk memastikan kesiapan penerimaan broadcast.",
        explanation:
          "1. **Koneksi Persisten WebSocket**: Browser membuka saluran TCP dua arah (`ws://` / `wss://`) yang tetap terhubung tanpa *handshake* berulang.\n\n" +
          "2. **Metode Inisialisasi Channel**: Memanggil `supabase.channel('nama-kanal')` untuk membuat instance komunikasi terisolasi.\n\n" +
          "3. **Siklus Status Langganan**: Callback `.subscribe((status) => ...)` memancarkan transisi state seperti `SUBSCRIBED` (siap menerima data), `TIMED_OUT`, atau `CHANNEL_ERROR`.\n\n" +
          "4. **Penanganan Auto-Reconnect**: Klien Supabase secara otomatis mencoba menyambung ulang koneksi jika sambungan internet sempat terputus.",
        codeSnippet: {
          filename: "src/hooks/use-tasks-channel.ts",
          language: "typescript",
          code: `import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useTasksChannel() {
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('tasks-live')
      .subscribe((status) => {
        console.log('Status Saluran WebSocket:', status); // SUBSCRIBED saat berhasil
      });

    return () => {
      supabase.removeChannel(channel); // Wajib cleanup!
    };
  }, [supabase]);
}`,
        },
        observationGuide:
          "Pada Langkah 2 Pengamatan: Buka DevTools Console saat komponen dimuat. Perhatikan kemunculan status 'SUBSCRIBED' yang menandakan koneksi WebSocket telah terjalin aman.",
      },
      {
        id: 3,
        title: "Penangkapan Payload Mutasi via postgres_changes",
        badge: "Postgres Changes Listener",
        keywords: ["postgres_changes", "payload.new", "payload.old", "INSERT Event", "Zero-Latency Broadcast"],
        summary:
          "Listener postgres_changes mencegat event database secara instan dan menguraikan payload.new untuk baris baru atau payload.old untuk baris yang dihapus.",
        explanation:
          "1. **Spesifikasi Event Database**: Listener `.on('postgres_changes', ...)` menerima konfigurasi filter: `event` ('*', 'INSERT', 'UPDATE', 'DELETE'), `schema: 'public'`, dan `table: 'tasks'`.\n\n" +
          "2. **Struktur Payload Broadcast**: Setiap mutasi mengirimkan objek berstruktur `{ eventType, new, old, commit_timestamp }`.\n\n" +
          "3. **Pembedaan payload.new vs payload.old**: Operasi `INSERT` membawa baris baru di `payload.new`. Operasi `DELETE` membawa identitas baris lama di `payload.old`.\n\n" +
          "4. **Zero-Polling Architecture**: Data terkirim secara *push* dari database dalam hitungan milidetik tanpa membebani browser dengan panggilan HTTP berkala.",
        codeSnippet: {
          filename: "Mencegat Event Perubahan Database",
          language: "typescript",
          code: `channel.on(
  'postgres_changes',
  { event: 'INSERT', schema: 'public', table: 'tasks' },
  (payload) => {
    console.log('Baris Baru Masuk:', payload.new);
    // payload.new berisi baris baru yang di-insert ke PostgreSQL
  }
);`,
        },
        observationGuide:
          "Pada Langkah 3 Pengamatan: Buka Supabase Table Editor di tab peramban terpisah dan tambahkan baris secara manual. Amati DevTools Console di tab aplikasi: log postgres_changes langsung muncul seketika.",
      },
      {
        id: 4,
        title: "Sinkronisasi Reaktif State Lokal Multi-Browser (< 1 Detik)",
        badge: "Collaborative State Sync",
        keywords: ["Immutable State Update", "Multi-Tab Sync", "Sub-Second Latency", "useEffect Cleanup", "Memory Leak Prevention"],
        summary:
          "Menerapkan pembaruan state imutabel di React saat menerima broadcast memungkinkan dua tab browser tersinkronisasi secara otomatis dalam tempo di bawah satu detik.",
        explanation:
          "1. **Pembaruan State Imutabel**: Saat menerima event `INSERT`, state lokal diperbarui via `setTasks((prev) => [payload.new, ...prev])` sehingga baris baru muncul di urutan teratas.\n\n" +
          "2. **Penghapusan & Pembaruan Reaktif**: Event `DELETE` menyaring array lokal via `filter(t => t.id !== payload.old.id)`, sementara `UPDATE` memetakan baris yang terubah.\n\n" +
          "3. **Pengujian Multi-Tab Kolaboratif**: Saat Form disubmit pada Tab A, Tab B yang berada di jendela terpisah langsung menampilkan baris tersebut dalam tempo < 1 detik.\n\n" +
          "4. **Pencegahan Memory Leak**: Wajib menjalankan `supabase.removeChannel(channel)` di dalam fungsi return cleanup `useEffect` saat komponen di-unmount.",
        codeSnippet: {
          filename: "src/components/live-task-list.tsx",
          language: "tsx",
          code: `'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function LiveTaskList({ initialTasks }: { initialTasks: any[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('tasks-live-sync')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tasks' }, (payload) => {
        setTasks((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <ul>{tasks.map((t) => <li key={t.id}>{t.title}</li>)}</ul>
  );
}`,
        },
        observationGuide:
          "Pada Langkah 4 Pengamatan: Buka dua jendela peramban berdampingan (Tab A dan Tab B). Submit tugas di Tab A dan perhatikan Tab B: tugas baru muncul seketika tanpa ada refresh halaman sama sekali.",
      },
      {
        id: 5,
        title: "Pelacakan Kehadiran Pengguna Terdistribusi via Presence API",
        badge: "Distributed Presence Mesh",
        keywords: ["Presence API", "channel.track()", "presence.sync", "Online Users Counter", "Distributed State"],
        summary:
          "Presence API melacak kehadiran pengguna aktif secara terdistribusi via track() dan event sync, memperbarui jumlah pengguna online secara instan saat tab dibuka atau ditutup.",
        explanation:
          "1. **Konsep Presence Terdistribusi**: Memungkinkan klien menyiarkan metadata keadaan pengguna (misal identitas email, avatar, dan timestamp online) ke seluruh anggota saluran.\n\n" +
          "2. **Metode channel.track()**: Mengirimkan paket status pengguna aktif ke jaringan mesh WebSocket Supabase.\n\n" +
          "3. **Penyelarasan Event presence.sync**: Komponen mendengarkan event `sync` dan memanggil `channel.presenceState()` untuk menghitung total pengguna yang sedang aktif.\n\n" +
          "4. **Pendeteksian Disconnect Otomatis**: Ketika seorang pengguna menutup tab atau kehilangan sinyal, server Realtime memicu event `leave` dan mengurangi jumlah pengguna online secara instan.",
        codeSnippet: {
          filename: "src/components/online-users-badge.tsx",
          language: "tsx",
          code: `'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function OnlineUsersBadge({ userEmail }: { userEmail: string }) {
  const [onlineCount, setOnlineCount] = useState(1);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase.channel('room-presence');

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setOnlineCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user: userEmail, online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userEmail]);

  return <span className="badge">{onlineCount} Pengguna Online</span>;
}`,
        },
        observationGuide:
          "Pada Langkah 5 Pengamatan: Buka tab browser kedua: badge kehadiran bertambah menjadi '2 Online'. Tutup tab kedua tersebut: badge langsung berkurang menjadi '1 Online' secara otomatis.",
      },
    ],
    comparisonTable: {
      title: "Matriks Perbandingan Arsitektural: Supabase Realtime (WebSocket) vs HTTP Short/Long Polling Tradisional",
      description: "Gunakan tabel komparasi ini sebagai rujukan evaluasi skalabilitas jaringan dan efisiensi komunikasi dua arah",
      colAHeader: "Supabase Realtime (WebSocket WAL)",
      colBHeader: "HTTP Short / Long Polling (setInterval / fetch)",
      rows: [
        {
          aspect: "Mekanisme Pengiriman Data",
          colA: "Push langsung dari server database saat terjadi mutasi WAL",
          colB: "Pull berkala dari browser klien via permintaan HTTP berulang",
          badgeVerdict: "rsc-win",
          verdictText: "Push-Based Sub-Second",
        },
        {
          aspect: "Konsumsi Bandwidth & Overhead Header",
          colA: "Sangat minim (overhead 2-byte frame WebSocket per pesan)",
          colB: "Sangat boros (overhead HTTP headers ~1 KB di setiap kueri polling)",
          badgeVerdict: "rsc-win",
          verdictText: "Hemat Bandwidth 90%+",
        },
        {
          aspect: "Beban Kueri Server Database",
          colA: "Nol kueri polling (membaca stream binary WAL bawaan engine)",
          colB: "Tinggi (mengeksekusi SELECT ke database berulang kali per klien)",
          badgeVerdict: "rsc-win",
          verdictText: "Zero-Query Load di Database",
        },
        {
          aspect: "Latensi Pembaruan Data di Layar",
          colA: "Seketika (< 100 ms setelah commit transaksi database)",
          colB: "Tertunda tergantung interval (misal 5-10 detik latensi)",
          badgeVerdict: "rsc-win",
          verdictText: "Instant Latency",
        },
        {
          aspect: "Dukungan Pelacakan Pengguna (Presence)",
          colA: "Tersedia bawaan melalui Presence API mesh terdistribusi",
          colB: "Wajib membuat heartbeat kustom dan menyimpan TTL di Redis",
          badgeVerdict: "rsc-win",
          verdictText: "Built-in Presence Mesh",
        },
        {
          aspect: "Kompleksitas Manajemen Koneksi",
          colA: "Wajib menangani siklus reconnect dan cleanup channel unmount",
          colB: "Stateless (cukup membatalkan interval timer)",
          badgeVerdict: "neutral",
          verdictText: "Perlu Cleanup Disiplin",
        },
        {
          aspect: "Skalabilitas Pengguna Bersamaan",
          colA: "Mampu melayani ribuan koneksi konkuren per kluster Elixir",
          colB: "Mudah membuat database crash saat ratusan user melakukan polling serentak",
          badgeVerdict: "rsc-win",
          verdictText: "Arsitektur Elixir Teruji",
        },
      ],
    },
    goldenRules: [
      {
        id: 1,
        title: "Aturan Wajib Pembersihan Saluran (removeChannel) di Fungsi Cleanup useEffect",
        type: "warning",
        explanation:
          "Setiap langganan saluran WebSocket wajib dibersihkan menggunakan 'supabase.removeChannel(channel)' di dalam return cleanup function useEffect. Mengabaikan langkah ini menyebabkan memory leak parah dan penggandaan listener setiap kali komponen di-render ulang.",
        badExample: {
          title: "❌ Anti-Pattern (Lupa Membersihkan Channel):",
          code: `// ❌ SALAH: Tidak ada cleanup return di useEffect!
useEffect(() => {
  const channel = supabase.channel('tasks').subscribe();
  // Tidak ada return cleanup: channel WebSocket tetap menggantung di memori!
}, []);`,
          explanation: "Menyebabkan koneksi ganda yang terus menumpuk di latar belakang hingga peramban melambat dan kuota koneksi habis.",
        },
        goodExample: {
          title: "✅ Best Practice (Pembersihan Channel Otomatis):",
          code: `// ✅ BENAR: Selalu panggil removeChannel saat komponen unmount
useEffect(() => {
  const channel = supabase.channel('tasks').subscribe();
  return () => {
    supabase.removeChannel(channel); // Koneksi ditutup bersih saat halaman berganti
  };
}, [supabase]);`,
          explanation: "Menjamin pembersihan sumber daya jaringan secara sempurna dan mencegah duplikasi event listener.",
        },
      },
      {
        id: 2,
        title: "Aturan Pendaftaran Tabel ke Publikasi Database Sebelum Mengaktifkan Listener",
        type: "dos",
        explanation:
          "Pastikan tabel PostgreSQL telah terdaftar di publikasi database ('ALTER PUBLICATION supabase_realtime ADD TABLE nama_tabel;') sebelum memasang listener di kode klien. Listener 'postgres_changes' tidak akan menerima event apa pun jika tabel belum diizinkan untuk replikasi real-time.",
        badExample: {
          title: "❌ Anti-Pattern (Berlangganan Tabel Tanpa Publikasi):",
          code: `// ❌ SALAH: Tabel 'tasks' belum dimasukkan ke publikasi supabase_realtime
// Klien menunggu event selamanya tanpa menerima data apa pun!`,
          explanation: "Mahasiswa sering bingung mengapa kueri tidak mengalir, padahal database belum mengaktifkan replikasi untuk tabel tersebut.",
        },
        goodExample: {
          title: "✅ Best Practice (Publikasi Database Dikonfigurasi):",
          code: `-- ✅ BENAR: Jalankan di SQL Editor terlebih dahulu:
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
-- Setelah tabel terdaftar, listener klien langsung menerima seluruh mutasi data.`,
          explanation: "Memastikan jalur pipa binary WAL terbuka dan menyalurkan data ke soket peramban secara lancar.",
        },
      },
    ],
  },
  7: {
    practicumId: 7,
    title: "Keamanan Database: Row Level Security (RLS) PostgreSQL",
    subtitle: "Landasan Teori Prinsip Zero-Trust Default Deny, Evaluasi Aturan SQL Menggunakan auth.uid(), Pembatasan Mutasi WITH CHECK, dan Admin Role Override (RBAC)",
    cpmkTarget:
      "Mahasiswa mampu mengaktifkan dan mengonfigurasi Row Level Security di PostgreSQL Supabase, menulis RLS Policies untuk operasi SELECT, INSERT, UPDATE, dan DELETE berdasarkan identitas pengguna yang terautentikasi (auth.uid()), serta memverifikasi keamanan isolasi data antar pengguna multi-tenant.",
    subCpmk: [
      "Menerapkan Prinsip Zero-Trust Default Deny: Mengaktifkan status ENABLE ROW LEVEL SECURITY pada tabel database publik untuk memblokir seluruh akses tanpa izin.",
      "Menyusun Kebijakan Isolasi Pembacaan SELECT: Menulis RLS Policy berbasis predikat USING (auth.uid() = user_id) guna mengisolasi visibilitas data antar-pengguna secara absolut.",
      "Memproteksi Integritas Penulisan dengan WITH CHECK: Mengonfigurasi klausul WITH CHECK pada operasi INSERT dan UPDATE untuk mencegah pemalsuan identitas kepemilikan data.",
      "Menganalisis Perilaku Pertahanan Senyap (Silent Defense): Mengidentifikasi karakteristik penolakan manipulasi baris asing tanpa pesan error guna mencegah enumeration attack.",
      "Merancang Hak Akses Berjenjang (RBAC Admin Bypass): Mengimplementasikan policy bersyarat berbasis klaim token JWT auth.jwt() ->> 'role' = 'admin' untuk akses administratif.",
    ],
    concepts: [
      {
        id: 1,
        title: "Prinsip Zero-Trust & Eksekusi ENABLE ROW LEVEL SECURITY",
        badge: "Zero-Trust Default Deny",
        keywords: ["ENABLE ROW LEVEL SECURITY", "Default Deny", "Empty Array Response", "Kernel Defense", "anon_key Vulnerability"],
        summary:
          "Mengaktifkan RLS pada tabel publik seketika memblokir seluruh akses baca dan tulis secara default, melindungi data dari eksploitasi kunci publik anon.",
        explanation:
          "1. **Kelemahan Keamanan Konvensional**: Tanpa RLS, siapa saja yang memegang kunci `anon_key` Supabase dapat menjalankan kueri `select * from tasks` dan membaca seluruh data pengguna lain.\n\n" +
          "2. **Filosofi Zero-Trust Default Deny**: Menjalankan `ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;` mengunci tabel secara total: seluruh akses SELECT, INSERT, UPDATE, dan DELETE langsung diblokir.\n\n" +
          "3. **Pengujian Tanpa Kebijakan**: Jika kueri dijalankan saat RLS aktif namun belum ada policy, Supabase mengembalikan array kosong `[]` (bukan error fatal), membungkam kebocoran data.\n\n" +
          "4. **Pertahanan Lapisan Inti Database**: Perlindungan berada langsung di kernel PostgreSQL, sehingga bug pada kode frontend atau backend tidak akan mampu membocorkan data rahasia.",
        codeSnippet: {
          filename: "SQL DDL Mengunci Tabel dengan RLS",
          language: "sql",
          code: `-- Mengaktifkan Row Level Security (Default Deny):
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Kueri dari klien sekarang mengembalikan [] (kosong) sampai ada Policy yang dibuat!`,
        },
        observationGuide:
          "Pada Langkah 1 Pengamatan: Aktifkan RLS pada tabel tasks di SQL Editor. Buka aplikasi dan jalankan fetch: verifikasi bahwa data mengembalikan array kosong [] karena belum memiliki policy.",
      },
      {
        id: 2,
        title: "Kebijakan Isolasi Pembacaan SELECT Berbasis auth.uid()",
        badge: "Granular Multi-Tenant Isolation",
        keywords: ["auth.uid()", "USING Clause", "Multi-Tenant Isolation", "B-Tree user_id Index", "Row Visibility"],
        summary:
          "Klausul USING (auth.uid() = user_id) pada SELECT Policy memastikan pengguna hanya dapat membaca baris data yang sah menjadi miliknya.",
        explanation:
          "1. **Fungsi SQL Bawaan auth.uid()**: Mesin PostgreSQL mengekstrak nilai klaim `sub` dari JWT token yang dikirimkan klien dan mengubahnya menjadi UUID pengguna aktif.\n\n" +
          "2. **Klausul Predikat USING**: Menetapkan syarat baris mana yang lolos evaluasi pembacaan: `USING (auth.uid() = user_id)`.\n\n" +
          "3. **Isolasi Absolut Multi-Tenant**: Pengguna A hanya dapat membaca baris miliknya sendiri. Kueri dari Pengguna B tidak akan pernah melihat baris Pengguna A meskipun menjalankan `SELECT *`.\n\n" +
          "4. **Indeksasi Kolom user_id**: Wajib menambahkan indeks B-Tree pada kolom `user_id` agar evaluasi predikat RLS berlangsung dengan kompleksitas $O(\\log N)$ yang sangat cepat.",
        codeSnippet: {
          filename: "SQL Policy SELECT Terisolasi",
          language: "sql",
          code: `-- Kebijakan: Pengguna hanya boleh membaca tugas miliknya sendiri
CREATE POLICY "select_own_tasks"
ON tasks
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);`,
        },
        observationGuide:
          "Pada Langkah 2 Pengamatan: Login sebagai User A, buat 2 task. Login sebagai User B, buat 1 task. Verifikasi bahwa User A hanya melihat 2 task miliknya dan User B hanya melihat 1 task miliknya.",
      },
      {
        id: 3,
        title: "Pertahanan Integritas Penulisan INSERT dengan Klausul WITH CHECK",
        badge: "Identity Spoofing Prevention",
        keywords: ["WITH CHECK", "Identity Spoofing", "RLS Violation Error", "DEFAULT auth.uid()", "Insert Integrity"],
        summary:
          "Klausul WITH CHECK (auth.uid() = user_id) memvalidasi baris baru yang disisipkan dan membatalkan transaksi jika ada upaya pemalsuan kepemilikan data.",
        explanation:
          "1. **Celah Pemalsuan Identitas**: Pengguna nakal dapat memodifikasi payload POST dan menyisipkan `user_id` milik orang lain jika tidak divalidasi ketat.\n\n" +
          "2. **Peran Klausul WITH CHECK**: Mengevaluasi baris baru yang hendak disimpan. Jika `auth.uid() != user_id`, transaksi dibatalkan seketika.\n\n" +
          "3. **Pesan Pelanggaran Keamanan**: PostgreSQL melempar galat `violates row-level security policy for table \"tasks\"`.\n\n" +
          "4. **Pola Otomasi Default**: Praktik terbaik adalah menyetel `DEFAULT auth.uid()` pada kolom `user_id` di skema tabel agar pengguna tidak perlu mengirimkan ID secara manual.",
        codeSnippet: {
          filename: "SQL Policy INSERT Anti-Spoofing",
          language: "sql",
          code: `-- Kebijakan: Pengguna dilarang menyimpan tugas atas nama user_id orang lain
CREATE POLICY "insert_own_tasks"
ON tasks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);`,
        },
        observationGuide:
          "Pada Langkah 3 Pengamatan: Coba kirimkan payload insert task dengan user_id milik pengguna lain. Verifikasi munculnya error pelanggaran kebijakan RLS dari database.",
      },
      {
        id: 4,
        title: "Pertahanan UPDATE & DELETE Tanpa Kebocoran (Silent Block Defense)",
        badge: "Silent Block & Obscurity",
        keywords: ["Silent Block Defense", "0 rows affected", "Anti-Enumeration", "USING & WITH CHECK", "Mutation Guard"],
        summary:
          "Operasi UPDATE dan DELETE pada baris asing ditolak secara senyap (0 rows affected) untuk mencegah serangan pencarian ID (enumeration attack).",
        explanation:
          "1. **Ancaman Enumeration Attack**: Jika server mengembalikan pesan 'Anda dilarang menghapus ID 123', penyerang mengetahui bahwa ID 123 benar-benar ada di database.\n\n" +
          "2. **Strategi Silent Block**: Pada operasi UPDATE dan DELETE, PostgreSQL mengevaluasi klausa `USING`. Baris yang bukan milik pengguna dianggap tidak ada, sehingga menghasilkan `0 rows affected`.\n\n" +
          "3. **Kombinasi USING & WITH CHECK pada UPDATE**: Klausul `USING` memastikan hanya baris milik sendiri yang bisa diedit, sedangkan `WITH CHECK` memastikan pengguna tidak dapat mengubah kepemilikan baris ke orang lain.\n\n" +
          "4. **Integritas Transaksi Mutasi**: Menjamin bahwa seluruh data transaksi tetap konsisten dan aman tanpa meninggalkan jejak informasi kepada penyerang.",
        codeSnippet: {
          filename: "SQL Policy UPDATE & DELETE Mutasi Aman",
          language: "sql",
          code: `-- Kebijakan: UPDATE baris tugas hanya jika milik sendiri
CREATE POLICY "update_own_tasks"
ON tasks
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Kebijakan: DELETE baris tugas hanya jika milik sendiri
CREATE POLICY "delete_own_tasks"
ON tasks
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);`,
        },
        observationGuide:
          "Pada Langkah 4 Pengamatan: Coba eksekusi update/delete pada tugas milik User B saat login sebagai User A via browser console. Perhatikan bahwa 0 baris terpengaruh tanpa ada crash atau kebocoran data.",
      },
      {
        id: 5,
        title: "Kebijakan Bersyarat Tingkat Lanjut: Admin Role Override (RBAC)",
        badge: "Role-Based Access Control",
        keywords: ["Admin Role Override", "Custom Claims", "auth.jwt()", "RBAC Policy", "Hierarchical Access"],
        summary:
          "Menggabungkan klaim token auth.jwt() ->> 'role' = 'admin' dengan klausul OR memungkinkan administrator melihat seluruh data multi-tenant secara sentral.",
        explanation:
          "1. **Kebutuhan Akses Superuser**: Administrator sistem membutuhkan akses untuk mengaudit dan melihat tugas milik seluruh pengguna untuk keperluan investigasi.\n\n" +
          "2. **Klaim Token Kustom (Custom Claims)**: Metadata peran pengguna disimpan dalam JWT token dan dapat diakses via fungsi SQL `auth.jwt() ->> 'role'`.\n\n" +
          "3. **Sintaks OR Bersyarat**: Aturan `USING ((auth.jwt() ->> 'role') = 'admin' OR auth.uid() = user_id)` memberikan akses penuh kepada admin, sementara pengguna non-admin tetap terisolasi.\n\n" +
          "4. **Separasi Peran Hirarkis**: Menghilangkan kebutuhan untuk membuat endpoint khusus admin dengan *hardcoded query*, karena seluruh proteksi dijalankan konsisten oleh mesin PostgreSQL.",
        codeSnippet: {
          filename: "SQL Policy Admin Role Override (RBAC)",
          language: "sql",
          code: `-- Kebijakan: Admin boleh melihat semua baris, user biasa hanya miliknya
CREATE POLICY "admin_all_or_user_own"
ON tasks
FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'role') = 'admin' OR auth.uid() = user_id
)
WITH CHECK (
  (auth.jwt() ->> 'role') = 'admin' OR auth.uid() = user_id
);`,
        },
        observationGuide:
          "Pada Langkah 5 Pengamatan: Atur custom claim role: 'admin' pada salah satu user di dashboard. Login dengan akun tersebut dan verifikasi bahwa seluruh tugas dari semua pengguna tampil lengkap di antarmuka.",
      },
    ],
    comparisonTable: {
      title: "Matriks Perbandingan Arsitektural: PostgreSQL Kernel RLS vs Otorisasi Tingkat Aplikasi (ORM WHERE)",
      description: "Gunakan tabel komparasi ini sebagai rujukan evaluasi pertahanan keamanan data di lapisan inti database",
      colAHeader: "PostgreSQL Kernel RLS (Bawaan Database)",
      colBHeader: "Otorisasi Aplikasi Manual (WHERE user_id di ORM)",
      rows: [
        {
          aspect: "Lapisan Penegakan Keamanan",
          colA: "Lapisan Kernel PostgreSQL (mengevaluasi setiap baris di level disk engine)",
          colB: "Lapisan Kode Aplikasi (bergantung pada developer menulis WHERE)",
          badgeVerdict: "rsc-win",
          verdictText: "Kernel Level Defense",
        },
        {
          aspect: "Ketahanan Terhadap Celah Kelalaian (Human Error)",
          colA: "Absolut (kueri SELECT * FROM tasks otomatis terfilter tanpa syarat tambahan)",
          colB: "Rentan (jika programmer lupa menulis .where({ userId }), seluruh data bocor)",
          badgeVerdict: "rsc-win",
          verdictText: "Zero-Leak Guarantee",
        },
        {
          aspect: "Cakupan Akses Klien Langsung (Direct Client Access)",
          colA: "Aman dikueri langsung dari browser menggunakan Supabase Anon Key",
          colB: "Sangat berbahaya jika dibuka ke publik tanpa lapisan server proxy",
          badgeVerdict: "rsc-win",
          verdictText: "Aman untuk Arsitektur Jamstack/BaaS",
        },
        {
          aspect: "Sumber Identitas Pengguna",
          colA: "Kriptografis langsung dari token JWT terverifikasi (auth.uid())",
          colB: "Parameter request atau sesi aplikasi yang rentan spoofing jika ada celah",
          badgeVerdict: "rsc-win",
          verdictText: "JWT Verified Kriptografis",
        },
        {
          aspect: "Perlindungan Mutasi Penulisan",
          colA: "Klausul WITH CHECK menggagalkan transaksi yang memalsukan user_id",
          colB: "Validasi manual di setiap controller/handler sebelum query insert",
          badgeVerdict: "rsc-win",
          verdictText: "Otomasi WITH CHECK",
        },
        {
          aspect: "Dukungan Hierarki Peran (RBAC)",
          colA: "Membaca klaim JWT (auth.jwt() ->> 'role') langsung dalam predikat SQL",
          colB: "Percabangan if-else peran pengguna di controller backend",
          badgeVerdict: "neutral",
          verdictText: "Dua-duanya Mendukung",
        },
        {
          aspect: "Dampak Performa Kueri",
          colA: "Sangat cepat bila kolom user_id diberi indeks B-Tree ($O(\\log N)$)",
          colB: "Sama cepatnya, namun menambah overhead serialisasi di backend",
          badgeVerdict: "rsc-win",
          verdictText: "Efisiensi B-Tree Indeks",
        },
      ],
    },
    goldenRules: [
      {
        id: 1,
        title: "Aturan Wajib Mengaktifkan ENABLE ROW LEVEL SECURITY di Setiap Tabel Publik Baru",
        type: "warning",
        explanation:
          "Setiap kali membuat tabel baru di skema publik Supabase, selalu eksekusi perintah 'ALTER TABLE <nama_tabel> ENABLE ROW LEVEL SECURITY;'. Tanpa perintah ini, tabel bersifat publik terbuka dan dapat dibaca serta dimanipulasi oleh siapa saja menggunakan anon_key.",
        badExample: {
          title: "❌ Anti-Pattern (Membuat Tabel Tanpa Mengaktifkan RLS):",
          code: `// ❌ SALAH: Tabel dibuat tanpa mengaktifkan RLS
CREATE TABLE confidential_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  note TEXT
);
-- BAHAYA BESAR: Siapapun pemegang anon_key dapat membaca seluruh catatan rahasia!`,
          explanation: "Menyebabkan data seluruh pengguna dapat dicuri melalui panggilan API sederhana dari peramban.",
        },
        goodExample: {
          title: "✅ Best Practice (Selalu Aktifkan RLS):",
          code: `-- ✅ BENAR: Segera kunci tabel dengan RLS setelah CREATE TABLE
CREATE TABLE confidential_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID DEFAULT auth.uid(),
  note TEXT
);
ALTER TABLE confidential_notes ENABLE ROW LEVEL SECURITY;
-- Tabel terkunci aman (Default Deny) sampai policy spesifik dibuat.`,
          explanation: "Menerapkan prinsip Zero-Trust default deny sejak detik pertama tabel dibuat.",
        },
      },
      {
        id: 2,
        title: "Aturan Wajib Menyertakan Klausul WITH CHECK pada Seluruh Kebijakan Penulisan",
        type: "dos",
        explanation:
          "Saat membuat Policy untuk operasi INSERT atau UPDATE, selalu sertakan klausul 'WITH CHECK (auth.uid() = user_id)'. Klausul USING saja tidak cukup untuk operasi INSERT karena baris baru belum ada di database saat validasi dimulai.",
        badExample: {
          title: "❌ Anti-Pattern (Policy INSERT Tanpa WITH CHECK):",
          code: `-- ❌ SALAH: Policy INSERT hanya menggunakan USING (tidak berpengaruh!)
CREATE POLICY "insert_task" ON tasks FOR INSERT TO authenticated USING (auth.uid() = user_id);
-- Celah keamanan: Penyerang tetap bisa memasukkan user_id milik pengguna lain!`,
          explanation: "Klausul USING pada INSERT tidak memvalidasi baris masukan baru, sehingga user nakal bisa menyisipkan ID korban.",
        },
        goodExample: {
          title: "✅ Best Practice (Sertakan WITH CHECK):",
          code: `-- ✅ BENAR: Gunakan WITH CHECK untuk memvalidasi baris masukan baru
CREATE POLICY "insert_task" ON tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
-- Transaksi otomatis dibatalkan jika user_id tidak cocok dengan auth.uid()`,
          explanation: "Menjamin integritas kepemilikan data 100% dan memblokir serangan pemalsuan identitas.",
        },
      },
    ],
  },
};

export function getPracticumTheoryData(practicumId: number): PracticumTheoryData | undefined {
  return PRACTICUM_THEORIES[practicumId];
}

export const PRACTICUM_SUB_CPMK: Record<number, string[]> = {
  1: [
    "Membedakan Lingkungan Eksekusi: Mengidentifikasi perbedaan arsitektural dan siklus hidup antara Server Component (Node.js runtime murni) dan Client Component (peramban V8 engine) melalui pengujian langsung.",
    "Menganalisis Mekanisme Streaming & Log: Mengamati pembentukan output streaming HTML statis dan memverifikasi lokasi eksekusi console.log() antara terminal server dan DevTools Console browser.",
    "Menginspeksi Bobot JavaScript Bundle: Mengukur secara empiris dampak 0 kB bundle Server Component dibandingkan penambahan bobot bundle Client Component menggunakan DevTools Network tab.",
    "Mendiagnosis Batasan Runtime & Hooks: Menjelaskan batasan komputasi stateless pada Server Component dan mengidentifikasi mekanisme proteksi compiler (guardrail) saat React Hooks dipanggil secara tidak valid.",
    "Menerapkan Pola Komposisi Interleaving: Mengimplementasikan arsitektur Children Props Pattern untuk menyematkan Server Component di dalam Client Component tanpa mengorbankan performa 0 kB bundle komponen server.",
  ],
  2: [
    "Membangun Server Actions Berbasis RPC: Membuat fungsi mutasi asinkron di lingkungan server dengan direktif 'use server' dan menangani ekstraksi payload FormData sesuai standar Web API tanpa endpoint API manual.",
    "Mendeklarasikan Skema Validasi dengan Zod: Menyusun aturan validasi data runtime deklaratif serta menerapkan otomatisasi inferensi tipe statis TypeScript (z.infer) sebagai Single Source of Truth.",
    "Menerapkan Pertahanan Input via safeParse(): Memvalidasi data masukan formulir secara defensif (zero-crash) dan memetakan struktur galat terperinci ZodError.fieldErrors per nama input tanpa melempar uncaught exception.",
    "Menstandarkan Kontrak State Mutasi: Mengintegrasikan ActionState<T> pada Server Action untuk memberikan umpan balik validasi instan ke antarmuka formulir tanpa memicu reload peramban penuh.",
    "Mengelola Siklus Form dengan React 19: Memanfaatkan hook useActionState untuk mengendalikan transisi status formulir (idle → pending → settled) serta mengaktifkan indikator pemblokiran tombol kirim otomatis guna mencegah insiden double-submission.",
  ],
  3: [
    "Merancang Skema Relasional Berintegritas: Merancang skema tabel PostgreSQL dengan Primary Key UUID v4, Foreign Key Constraint, dan aturan penghapusan berantai ON DELETE CASCADE pada Supabase.",
    "Mengeksekusi Kueri Relasional JOIN: Melakukan operasi manipulasi data (CRUD) dan penggabungan multi-tabel menggunakan sintaks SQL baku di Supabase SQL Editor.",
    "Mengonfigurasi Klien Supabase SSR: Mengintegrasikan paket @supabase/ssr pada Next.js 16 untuk menghubungkan Server Components langsung ke database PostgreSQL secara aman.",
    "Mengotomasi TypeScript Typegen: Menghasilkan definisi tipe antarmuka TypeScript otomatis dari skema database aktif menggunakan Supabase CLI guna menjamin end-to-end type safety.",
    "Menginspeksi Konsistensi Relasi Data: Memvalidasi integritas referensial dan mencegah data yatim piatu (orphaned records) saat baris induk dihapus.",
  ],
  4: [
    "Mengonfigurasi Autentikasi Pengguna: Mengaktifkan provider Email/Password dan mengonfigurasi protokol delegasi otorisasi GitHub OAuth 2.0 pada Supabase Auth.",
    "Mengamankan Rute Privat via Edge Middleware: Membangun logika proteksi sesi pengguna di Next.js 16 Middleware untuk melakukan pengalihan rute (redirect) otomatis sebelum halaman dimuat.",
    "Mengelola Siklus Sesi Kriptografis: Membaca dan memvalidasi JSON Web Token (JWT) sesi pengguna aktif di lingkungan Server Components menggunakan utilitas async cookies.",
    "Menangani Pertukaran Kode OAuth Callback: Membangun Route Handler callback untuk menukarkan authorization code menjadi sesi persisten HTTP-Only cookie.",
    "Memvalidasi Sesi Server-Side Terverifikasi: Membedakan metode getUser() terverifikasi kriptografis vs getSession() pada Server Components.",
  ],
  5: [
    "Menerapkan Mutasi CRUD & Revalidasi On-Demand: Mengimplementasikan Server Actions untuk operasi mutasi data dan memperbarui cache antarmuka secara instan menggunakan revalidatePath().",
    "Membangun Universal Route Handlers Terstandarisasi: Merancang endpoint GET kolektif dengan ekstraksi SearchParams, pagination range Supabase, dan format respons RFC-compliant.",
    "Mengamankan REST API via Bearer JWT: Menerapkan proteksi endpoint stateless menggunakan verifikasi Authorization: Bearer <token> dan error envelope HTTP 401 Unauthorized.",
    "Mengelola Dynamic Route Handlers Asinkron: Menangani parameter rute dinamis [id] menggunakan paradigma Promise-based (await params) Next.js 16 pada method GET dan DELETE.",
    "Mengimplementasikan URL as State Manager: Menyelaraskan state filter dan pencarian ke URL Search Parameters guna mendukung deep linking dan reaktivitas Server Component.",
  ],
  6: [
    "Mengonfigurasi Publikasi Replikasi PostgreSQL: Mengaktifkan replikasi tabel ke publikasi supabase_realtime pada level database untuk memancarkan perubahan baris data.",
    "Membangun Saluran Langganan WebSocket: Menginisialisasi koneksi persisten dua arah (channel) dan menangani siklus status langganan (SUBSCRIBED, TIMEOUT, CLOSED).",
    "Mencegat Event Perubahan Baris Data: Mengonfigurasi listener postgres_changes untuk menangkap payload mutasi INSERT, UPDATE, dan DELETE secara instan.",
    "Menyinkronkan State Reaktif Multi-Klien: Memperbarui state lokal React secara reaktif saat menerima broadcast mutasi guna menyajikan kolaborasi multi-tab bebas refresh (< 1 detik).",
    "Mengimplementasikan Pelacakan Kehadiran (Presence API): Mengirimkan status kehadiran pengguna terdistribusi via track() dan mendengarkan event sync untuk menghitung jumlah pengguna online.",
  ],
  7: [
    "Menerapkan Prinsip Zero-Trust Default Deny: Mengaktifkan status ENABLE ROW LEVEL SECURITY pada tabel database publik untuk memblokir seluruh akses tanpa izin.",
    "Menyusun Kebijakan Isolasi Pembacaan SELECT: Menulis RLS Policy berbasis predikat USING (auth.uid() = user_id) guna mengisolasi visibilitas data antar-pengguna secara absolut.",
    "Memproteksi Integritas Penulisan dengan WITH CHECK: Mengonfigurasi klausul WITH CHECK pada operasi INSERT dan UPDATE untuk mencegah pemalsuan identitas kepemilikan data.",
    "Menganalisis Perilaku Pertahanan Senyap (Silent Defense): Mengidentifikasi karakteristik penolakan manipulasi baris asing tanpa pesan error guna mencegah enumeration attack.",
    "Merancang Hak Akses Berjenjang (RBAC Admin Bypass): Mengimplementasikan policy bersyarat berbasis klaim token JWT auth.jwt() ->> 'role' = 'admin' untuk akses administratif.",
  ],
};

export function getPracticumSubCpmk(practicumId: number): string[] {
  return PRACTICUM_THEORIES[practicumId]?.subCpmk || PRACTICUM_SUB_CPMK[practicumId] || [];
}

