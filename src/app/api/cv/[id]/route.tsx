import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import type {
  Talent,
  WorkExperience,
  Education,
  Award,
  SocialMedia,
  User,
} from "@prisma/client";
import { socialMediaPlatformEnum } from "@/enum/social-media-platform-enum";
import { id as idLocale } from "date-fns/locale";
import { cdnUrl } from "@/components/custom/cdn-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TalentWithRelations = Talent & {
  workExperiences: WorkExperience[];
  educations: Education[];
  awards: Award[];
  socialMedias: SocialMedia[];
  user: User;
};

const ACCENT = "#2563eb";
const MUTED = "#525252";

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 10.5,
    fontFamily: "Times-Roman",
    color: "#111",
  },

  // Header
  header: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 14,
    alignItems: "center",
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 9999, // FULL ROUNDED
    objectFit: "cover",
    backgroundColor: "#eee",
  },
  titleWrap: { flexGrow: 1, justifyContent: "center" },
  name: { fontSize: 22, fontFamily: "Times-Bold" },
  sub: { fontSize: 12, color: MUTED, marginTop: 2 },

  // Sosmed bar
  smBar: { marginBottom: 10 },
  smRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  smItem: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 9999,
    backgroundColor: "#f3f4f6",
  },
  link: { color: ACCENT, textDecoration: "none" },

  // Section (atas: Ringkasan / Tentang Saya)
  sectionTop: { marginBottom: 14 },
  sectionTitleTop: {
    fontSize: 11.5,
    fontFamily: "Times-Bold",
    color: ACCENT,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  para: { lineHeight: 1, color: "#222", textAlign: "justify" },

  // Row 1/3 : 2/3
  row: { flexDirection: "row", gap: 16, marginBottom: 14 },
  rowLeft: { width: "33%" },
  rowRight: { width: "67%" },
  rowTitle: {
    fontSize: 11.5,
    fontFamily: "Times-Bold",
    color: ACCENT,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },

  // List items
  item: { marginBottom: 8 },
  itemTitle: { fontFamily: "Times-Bold" },
  itemSub: { color: MUTED, marginTop: 1 },
  itemPara: { marginTop: 3, lineHeight: 1, textAlign: "justify" },

  // Skills
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    fontSize: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: "#f3f4f6",
  },

  // Media (thumbnail di dalam isi section)
  mediaRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  thumb: {
    width: 54,
    height: 42,
    borderRadius: 8,
    marginTop: 4,
    objectFit: "cover",
    backgroundColor: "#eee",
  },

  // Footer
  pageNum: {
    position: "absolute",
    bottom: 16,
    right: 28,
    fontSize: 9,
    color: MUTED,
  },

  // Separator
  separator: {
    height: 1,
    marginBottom: 14,
    backgroundColor: "#eee",
  },
});

// ===== Helpers =====
function formatMY(date: Date | string | null | undefined) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return "";

  return format(d, "MMMM yyyy", { locale: idLocale });
}
function formatRange(start: Date | string, end?: Date | string | null) {
  const s = formatMY(start);
  const e = end ? formatMY(end) : "Present";
  return `${s} — ${e}`;
}
function safeText(s?: string | null) {
  return (s || "").trim();
}
function filenameFromTalent(t: Talent) {
  const base = (t.slug || t.name || "cv")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `${base || "cv"}.pdf`;
}
/** Ekstrak handle dari https://xxx.yyy/zzz(/...)? -> zzz */
function extractHandle(url: string) {
  try {
    const u = new URL(url);
    const segs = u.pathname.split("/").filter(Boolean);
    return segs.length ? decodeURIComponent(segs[segs.length - 1]) : u.hostname;
  } catch {
    const m = url.match(/https?:\/\/[^/]+\/([^/?#]+)/i);
    return m?.[1] || url;
  }
}

function CvDocument({ talent }: { talent: TalentWithRelations }) {
  const address = [
    talent.user?.street,
    talent.user?.village,
    talent.user?.subdistrict,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Document
      title={`${safeText(talent.name) || "Talent"} - CV`}
      author={safeText(talent.name) || undefined}
      subject="Curriculum Vitae"
      language="id-ID"
    >
      <Page size="A4" style={styles.page}>
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          {talent.profilePicture ? (
            <Image src={cdnUrl(talent.profilePicture)} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatar,
                { justifyContent: "center", alignItems: "center" },
              ]}
            >
              <Text>{(talent.name || "T").slice(0, 1).toUpperCase()}</Text>
            </View>
          )}

          <View style={styles.titleWrap}>
            <Text style={styles.name}>{safeText(talent.name)}</Text>
            <Text style={styles.sub}>
              {safeText(talent.profession)}
              {talent.industry ? ` • ${talent.industry}` : ""}
            </Text>
            <Text style={styles.sub}>
              {talent.user?.email ? `${talent.user.email}` : ""}
              {address
                ? (talent.user?.email ? "  •  " : "") + `${address}`
                : ""}
            </Text>
          </View>
        </View>

        {/* ===== SOSIAL MEDIA (bar) ===== */}
        {talent.socialMedias?.length ? (
          <View style={styles.smBar}>
            <View style={styles.smRow}>
              {talent.socialMedias.map((s) => {
                const label = socialMediaPlatformEnum.getLabel(s.platform);
                const handle = extractHandle(s.url);
                return (
                  <View key={s.id} style={styles.smItem}>
                    <Link src={s.url} style={styles.link}>
                      <Text>
                        {label}: {handle}
                      </Text>
                    </Link>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        {/* SEPARATOR */}
        <View style={styles.separator} />

        {/* ===== RINGKASAN / TENTANG SAYA ===== */}
        {safeText(talent.description) ? (
          <View style={styles.sectionTop}>
            <Text style={styles.sectionTitleTop}>Tentang Saya</Text>
            <Text style={styles.para}>{safeText(talent.description)}</Text>
          </View>
        ) : null}

        {/* SEPARATOR */}
        <View style={styles.separator} />

        {/* ===== BELOW: layout 1/3 (left) : 2/3 (right) ===== */}

        {/* KEAHLIAN */}
        {Array.isArray(talent.skills) && talent.skills.length > 0 && (
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>Keahlian</Text>
            </View>
            <View style={styles.rowRight}>
              <View style={styles.chipWrap}>
                {talent.skills.map((sk, i) => (
                  <Text key={i}>
                    {toReadableText(sk)}{" "}
                    {i < talent.skills.length - 1 ? ", " : ""}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* SEPARATOR */}
        <View style={styles.separator} />

        {/* PENGALAMAN KERJA */}
        {talent.workExperiences?.length ? (
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>Pengalaman Kerja</Text>
            </View>
            <View style={styles.rowRight}>
              {talent.workExperiences.map((w) => (
                <View key={w.id} style={styles.item}>
                  <Text style={styles.itemTitle}>
                    {w.position} • {w.companyName}
                  </Text>
                  <Text style={styles.itemSub}>
                    {formatRange(w.startDate, w.endDate)}
                  </Text>
                  {safeText(w.description) ? (
                    <Text style={styles.itemPara}>
                      {safeText(w.description)}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* SEPARATOR */}
        <View style={styles.separator} />

        {/* PENDIDIKAN */}
        {talent.educations?.length ? (
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>Pendidikan</Text>
            </View>
            <View style={styles.rowRight}>
              {talent.educations.map((e) => (
                <View key={e.id} style={styles.item}>
                  <Text style={styles.itemTitle}>
                    {e.degree} • {e.schoolName}
                  </Text>
                  <Text style={styles.itemSub}>
                    {formatRange(e.startDate, e.endDate)}
                  </Text>
                  {safeText(e.description) ? (
                    <Text style={styles.itemPara}>
                      {safeText(e.description)}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* SEPARATOR */}
        <View style={styles.separator} />

        {/* PENGHARGAAN (dengan media bila ada) */}
        {talent.awards?.length ? (
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>Penghargaan</Text>
            </View>
            <View style={styles.rowRight}>
              {talent.awards.map((a) => (
                <View key={a.id} style={[styles.item, styles.mediaRow]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{a.name}</Text>
                    <Text style={styles.itemSub}>{formatMY(a.date)}</Text>
                    {safeText(a.description) ? (
                      <Text style={styles.itemPara}>
                        {safeText(a.description)}
                      </Text>
                    ) : null}
                    {a.image ? (
                      <Image src={cdnUrl(a.image)} style={styles.thumb} />
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Footer page number */}
        <Text
          style={styles.pageNum}
          render={({ pageNumber, totalPages }) =>
            `Halaman ${pageNumber} dari ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    const talent = await db.talent.findUnique({
      where: { id },
      include: {
        awards: { orderBy: { date: "desc" } },
        educations: { orderBy: { startDate: "desc" } },
        workExperiences: { orderBy: { startDate: "desc" } },
        socialMedias: true,
        user: true,
      },
    });

    if (!talent) {
      return NextResponse.json(
        { message: "Tidak ada data CV yang ditemukan" },
        { status: 404 }
      );
    }

    const doc = <CvDocument talent={talent as TalentWithRelations} />;
    const buffer = await pdf(doc).toBuffer();

    const fname = filenameFromTalent(talent);
    const isDownload =
      new URL(_request.url).searchParams.get("download") === "1";

    return new NextResponse(buffer as unknown as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${
          isDownload ? "attachment" : "inline"
        }; filename="${fname}"`,
        "Cache-Control": "no-store",
        "Content-Length": String((buffer as unknown as Uint8Array).length),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 });
  }
};

const toReadableText = (text: string) => {
  const words = text.split(" ");
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
