import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { PracticumModule } from "@/data/practicum";

export interface GeneratePracticumPDFParams {
  student: {
    nim: string;
    fullName: string;
    classGroup: string;
  };
  practicum: PracticumModule;
  observations: {
    stepNumber: number;
    observation: string;
  }[];
  analysis: {
    text: string;
    score: number | null;
  } | null;
  conclusion: {
    text: string;
    score: number | null;
  } | null;
  studentSignature: string | null;
  lecturerSignature: string | null;
  approvalStatus: "pending" | "approved";
  submittedAt: string | null;
  approvedAt: string | null;
  approvedByName: string | null;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 40,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1e293b",
    lineHeight: 1.45,
  },
  // KOP SURAT / HEADER
  headerContainer: {
    borderBottomWidth: 2,
    borderBottomColor: "#0f172a",
    borderBottomStyle: "solid",
    paddingBottom: 8,
    marginBottom: 14,
    alignItems: "center",
    textAlign: "center",
  },
  instTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    letterSpacing: 0.5,
  },
  subInstTitle: {
    fontSize: 8.5,
    color: "#475569",
    marginTop: 2,
  },
  reportMainTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#1e1b4b",
    marginTop: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  reportSubTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#4338ca",
    marginTop: 2,
  },

  // METADATA CARD / IDENTITAS
  metaCard: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  metaLabel: {
    width: 120,
    fontFamily: "Helvetica-Bold",
    color: "#475569",
    fontSize: 8.5,
  },
  metaColon: {
    width: 10,
    color: "#64748b",
    fontSize: 8.5,
  },
  metaValue: {
    flex: 1,
    color: "#0f172a",
    fontSize: 8.5,
  },

  // SEKSI UMUM
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    backgroundColor: "#e0e7ff",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#4338ca",
    borderLeftStyle: "solid",
    marginBottom: 6,
  },
  sectionBody: {
    paddingHorizontal: 4,
    color: "#334155",
    fontSize: 8.5,
    textAlign: "justify",
    lineHeight: 1.4,
  },

  // TABEL PENGAMATAN
  table: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 3,
    marginTop: 4,
    marginBottom: 8,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingVertical: 4,
    paddingHorizontal: 4,
    minHeight: 24,
  },
  tableColNo: {
    width: "7%",
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: "#475569",
  },
  tableColStep: {
    width: "48%",
    paddingRight: 6,
    fontSize: 8,
    color: "#334155",
  },
  tableColObs: {
    width: "45%",
    paddingRight: 4,
    fontSize: 8,
    color: "#0f172a",
    backgroundColor: "#fafafa",
  },

  // SCORE BADGE
  scoreBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#ecfdf5",
    borderColor: "#a7f3d0",
    borderWidth: 1,
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginBottom: 4,
    marginTop: 2,
  },
  scoreBadgeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#065f46",
  },

  // ESSAY BOX
  essayBox: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fbfcfd",
    padding: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  essayText: {
    fontSize: 8.5,
    color: "#1e293b",
    lineHeight: 1.45,
    textAlign: "justify",
  },

  // SIGNATURE SECTION
  signatureContainer: {
    marginTop: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBox: {
    width: "45%",
    alignItems: "center",
    textAlign: "center",
  },
  signRole: {
    fontSize: 8.5,
    color: "#64748b",
    marginBottom: 4,
  },
  signImagePlaceholder: {
    height: 55,
    width: 140,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },
  signImage: {
    height: 50,
    maxWidth: 130,
    objectFit: "contain",
  },
  signName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginTop: 2,
    textDecoration: "underline",
  },
  signId: {
    fontSize: 8,
    color: "#475569",
    marginTop: 1,
  },
  stampApproved: {
    marginTop: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: "#059669",
    borderRadius: 3,
    backgroundColor: "#ecfdf5",
  },
  stampText: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#059669",
    letterSpacing: 0.5,
  },
  stampPending: {
    marginTop: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#f59e0b",
    borderRadius: 3,
    backgroundColor: "#fffbeb",
  },
  stampPendingText: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#d97706",
  },

  // FOOTER
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    borderTopWidth: 0.5,
    borderTopColor: "#cbd5e1",
    paddingTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#94a3b8",
    fontSize: 7.5,
  },
});

function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return "-";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

export function PracticumReportDocument({
  student,
  practicum,
  observations,
  analysis,
  conclusion,
  studentSignature,
  lecturerSignature,
  approvalStatus,
  submittedAt,
  approvedAt,
  approvedByName,
}: GeneratePracticumPDFParams) {
  return (
    <Document title={`Laporan_Praktikum_${practicum.id}_${student.nim}`}>
      <Page size="A4" style={styles.page}>
        {/* KOP LAPORAN */}
        <View style={styles.headerContainer}>
          <Text style={styles.instTitle}>PROGRAM STUDI TEKNIK INFORMATIKA</Text>
          <Text style={styles.subInstTitle}>
            Matakuliah: Pengembangan Aplikasi Serverless API (Next.js, Supabase, Cloudinary, Vercel)
          </Text>
          <Text style={styles.reportMainTitle}>LAPORAN HASIL PRAKTIKUM</Text>
          <Text style={styles.reportSubTitle}>
            PRAKTIKUM {practicum.id}: {practicum.title.toUpperCase()}
          </Text>
        </View>

        {/* IDENTITAS MAHASISWA & PRAKTIKUM */}
        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Nama Mahasiswa</Text>
            <Text style={styles.metaColon}>:</Text>
            <Text style={styles.metaValue}>{student.fullName}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Nomor Induk Mahasiswa (NIM)</Text>
            <Text style={styles.metaColon}>:</Text>
            <Text style={styles.metaValue}>{student.nim}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Kelas / Rombel</Text>
            <Text style={styles.metaColon}>:</Text>
            <Text style={styles.metaValue}>{student.classGroup}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Modul Teori Kuliah</Text>
            <Text style={styles.metaColon}>:</Text>
            <Text style={styles.metaValue}>Modul {practicum.lectureModule}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Tanggal Pengiriman</Text>
            <Text style={styles.metaColon}>:</Text>
            <Text style={styles.metaValue}>{formatDate(submittedAt)}</Text>
          </View>
          {approvalStatus === "approved" && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Status Verifikasi</Text>
              <Text style={styles.metaColon}>:</Text>
              <Text style={styles.metaValue}>
                DISETUJUI oleh {approvedByName ?? "Dosen Pengampu"} ({formatDate(approvedAt)})
              </Text>
            </View>
          )}
        </View>

        {/* SEKSI A: CAPAIAN PRAKTIKUM */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>A. CAPAIAN PEMBELAJARAN PRAKTIKUM</Text>
          <Text style={styles.sectionBody}>{practicum.capaian}</Text>
        </View>

        {/* SEKSI B: DASAR TEORI */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>B. DASAR TEORI</Text>
          <Text style={styles.sectionBody}>{practicum.dasarTeori}</Text>
        </View>

        {/* SEKSI C: PROSEDUR & HASIL PENGAMATAN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>C. PROSEDUR UJI COBA & HASIL PENGAMATAN</Text>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableColNo}>No</Text>
              <Text style={styles.tableColStep}>Instruksi & Prosedur Uji Coba</Text>
              <Text style={styles.tableColObs}>Hasil Pengamatan Mahasiswa</Text>
            </View>
            {practicum.steps.map((step) => {
              const obs = observations.find((o) => o.stepNumber === step.step);
              return (
                <View key={step.step} style={styles.tableRow} wrap={false}>
                  <Text style={styles.tableColNo}>{step.step}</Text>
                  <Text style={styles.tableColStep}>{step.instruksi}</Text>
                  <Text style={styles.tableColObs}>
                    {obs?.observation && obs.observation.trim() !== ""
                      ? obs.observation
                      : "(Tidak ada catatan pengamatan)"}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* SEKSI D: ANALISIS */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>D. ANALISIS HASIL PENGUJIAN</Text>
          {analysis?.score !== null && analysis?.score !== undefined && (
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreBadgeText}>
                ✓ Skor Evaluasi AI: {analysis.score}/100 (Lulus Ambang Batas ≥ 70)
              </Text>
            </View>
          )}
          <View style={styles.essayBox}>
            <Text style={styles.essayText}>
              {analysis?.text || "(Mahasiswa belum mengisikan analisis)"}
            </Text>
          </View>
        </View>

        {/* SEKSI E: KESIMPULAN */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>E. KESIMPULAN</Text>
          {conclusion?.score !== null && conclusion?.score !== undefined && (
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreBadgeText}>
                ✓ Skor Evaluasi AI: {conclusion.score}/100 (Lulus Ambang Batas ≥ 70)
              </Text>
            </View>
          )}
          <View style={styles.essayBox}>
            <Text style={styles.essayText}>
              {conclusion?.text || "(Mahasiswa belum mengisikan kesimpulan)"}
            </Text>
          </View>
        </View>

        {/* SEKSI F: TANDA TANGAN DIGITAL & PENGESAHAN */}
        <View style={styles.signatureContainer} wrap={false}>
          {/* Sisi Mahasiswa */}
          <View style={styles.signatureBox}>
            <Text style={styles.signRole}>Praktikan / Mahasiswa,</Text>
            <View style={styles.signImagePlaceholder}>
              {studentSignature ? (
                <Image src={studentSignature} style={styles.signImage} />
              ) : (
                <Text style={{ fontSize: 7.5, color: "#94a3b8" }}>
                  (Tanda Tangan Digital)
                </Text>
              )}
            </View>
            <Text style={styles.signName}>{student.fullName}</Text>
            <Text style={styles.signId}>NIM: {student.nim}</Text>
          </View>

          {/* Sisi Dosen */}
          <View style={styles.signatureBox}>
            <Text style={styles.signRole}>Dosen Pengampu,</Text>
            <View style={styles.signImagePlaceholder}>
              {approvalStatus === "approved" && lecturerSignature ? (
                <Image src={lecturerSignature} style={styles.signImage} />
              ) : approvalStatus === "approved" ? (
                <Text style={{ fontSize: 7.5, color: "#059669", fontFamily: "Helvetica-Bold" }}>
                  [Tervalidasi Sistem]
                </Text>
              ) : (
                <View style={styles.stampPending}>
                  <Text style={styles.stampPendingText}>Menunggu Persetujuan</Text>
                </View>
              )}
            </View>
            <Text style={styles.signName}>
              {approvedByName ? approvedByName : "(Nama Dosen Pengampu)"}
            </Text>
            <Text style={styles.signId}>Dosen Pengampu Serverless API</Text>
            {approvalStatus === "approved" && (
              <View style={styles.stampApproved}>
                <Text style={styles.stampText}>
                  ✓ DISETUJUI — {formatDate(approvedAt)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* FOOTER HALAMAN */}
        <View style={styles.footer} fixed>
          <Text>The Serverless Odyssey — Dokumen Laporan Praktikum Resmi</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Halaman ${pageNumber} dari ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

export async function generatePracticumPDF(
  params: GeneratePracticumPDFParams
): Promise<Buffer> {
  const doc = React.createElement(PracticumReportDocument, params);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(doc as any);
  return Buffer.from(buffer);
}
