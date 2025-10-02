import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import {
  ArticleStatusEnum,
  ArticleTypeEnum,
  HubStatusEnum,
  IconEnum,
  PartnerTypeEnum,
  ProductStatusEnum,
  Role,
  SocialMediaPlatformEnum,
} from "@prisma/client";

export const runtime = "nodejs"; // penting utk Prisma

// ====== Hardcoded IDs (boleh kamu ganti) ======
const IDS = {
  users: {
    superadmin: "11111111-1111-1111-1111-111111111111",
    admin: "22222222-2222-2222-2222-222222222222",
    user: "33333333-3333-3333-3333-333333333333",
    user2: "44444444-4444-4444-4444-444444444444",
  },
  talents: {
    alya: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    bima: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  },
  socials: {
    alyaIg: "aaaa1111-1111-1111-1111-111111111111",
    alyaLi: "aaaa2222-2222-2222-2222-222222222222",
    bimaX: "bbbb1111-1111-1111-1111-111111111111",
  },
  articles: {
    a1: "44444444-4444-4444-4444-444444444444",
    a2: "55555555-5555-5555-5555-555555555555",
    a3: "66666666-6666-6666-6666-666666666666",
  },
  products: {
    p1: "77777777-7777-7777-7777-777777777777",
    p2: "88888888-8888-8888-8888-888888888888",
    p3: "99999999-9999-9999-9999-999999999999",
  },
};

interface HubCategory {
  id: string;
  title: string;
  items: Hub[];
}

interface Hub {
  title: string;
  description: string;
  image: string | null;
  id: string;
  slug: string;
  status: HubStatusEnum;
  hubCategoryId: string;
}

const DUMMY_HUB_CATEGORIES: HubCategory[] = [
  {
    id: "dukungan-institusional",
    title: "Dukungan Institusional",
    items: [
      {
        title: "Dukungan Institusional Organisasi Kebudayaan",
        description:
          "Penguatan kapasitas & pendanaan untuk organisasi kebudayaan di berbagai daerah.",
        image:
          "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1200&auto=format&fit=crop",
        id: "dukungan-institusional",
        slug: "dukungan-institusional",
        status: HubStatusEnum.active,
        hubCategoryId: "dukungan-institusional",
      },
      {
        title: "Program Manajemen Organisasi Seni",
        description:
          "Pelatihan manajemen program, fundraising, hingga tata kelola berkelanjutan.",
        image:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
        id: "manajemen-organisasi-seni",
        slug: "manajemen-organisasi-seni",
        status: HubStatusEnum.soon,
        hubCategoryId: "dukungan-institusional",
      },
    ],
  },
  {
    id: "residensi-dan-kolaborasi",
    title: "Residensi & Kolaborasi",
    items: [
      {
        title: "Residensi Seniman Nusantara",
        description:
          "Fasilitasi residensi lintas daerah untuk kolaborasi & pertukaran pengetahuan.",
        image:
          "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?q=80&w=1200&auto=format&fit=crop",
        id: "residensi-seniman",
        slug: "residensi-seniman",
        status: HubStatusEnum.soon,
        hubCategoryId: "residensi-dan-kolaborasi",
      },
      {
        title: "Kolaborasi Komunitas Lokal",
        description:
          "Pengembangan proyek seni berbasis komunitas dengan pendampingan mentor.",
        image:
          "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop",
        id: "kolaborasi-komunitas",
        slug: "kolaborasi-komunitas",
        status: HubStatusEnum.active,
        hubCategoryId: "residensi-dan-kolaborasi",
      },
    ],
  },
  {
    id: "arsip-dan-pelestarian",
    title: "Arsip & Pelestarian",
    items: [
      {
        title: "Arsip Digital Warisan Budaya",
        description:
          "Digitalisasi arsip budaya untuk pelestarian dan akses publik yang lebih luas.",
        image:
          "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop",
        id: "arsip-digital",
        slug: "arsip-digital",
        status: HubStatusEnum.inactive,
        hubCategoryId: "arsip-dan-pelestarian",
      },
      {
        title: "Pemetaan Cagar Budaya",
        description:
          "Inisiatif pemetaan lokasi cagar budaya sebagai bahan kebijakan pelestarian.",
        image: null,
        id: "pemetaan-cagar-budaya",
        slug: "pemetaan-cagar-budaya",
        status: HubStatusEnum.active,
        hubCategoryId: "arsip-dan-pelestarian",
      },
    ],
  },
];

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Disabled in production" },
      { status: 403 }
    );
  }

  const summary = {
    created: {
      users: 0,
      talents: 0,
      socials: 0,
      articles: 0,
      products: 0,
      hubs: { category: 0, data: 0 },
    },
    skipped: {
      users: 0,
      talents: 0,
      socials: 0,
      articles: 0,
      products: 0,
      hubs: { category: 0, data: 0 },
    },
  };

  try {
    const PASSWORD = "12345678";
    const passwordHash = await bcrypt.hash(PASSWORD, 10);

    // ===== Users =====
    const usersSeed = [
      {
        id: IDS.users.superadmin,
        name: "Super Admin",
        email: "superadmin@pemudamagelang.id",
        password: passwordHash,
        role: Role.superadmin,
        profilePicture: "https://i.pravatar.cc/300?img=1",
      },
      {
        id: IDS.users.admin,
        name: "Admin",
        email: "admin@pemudamagelang.id",
        password: passwordHash,
        role: Role.admin,
        profilePicture: "https://i.pravatar.cc/300?img=2",
      },
      {
        id: IDS.users.user,
        name: "Alya Putri",
        email: "alya@pemudamagelang.id",
        password: passwordHash,
        role: Role.user,
        profilePicture: "https://i.pravatar.cc/300?img=3",
      },
      {
        id: IDS.users.user2,
        name: "Bima Ardiansyah",
        email: "bima@pemudamagelang.id",
        password: passwordHash,
        role: Role.user,
      },
    ];

    for (const u of usersSeed) {
      const exist = await db.user.findUnique({ where: { id: u.id } });
      if (!exist) {
        await db.user.create({ data: u });
        summary.created.users++;
      } else summary.skipped.users++;
    }

    // ===== Talents (relasi ke user) =====
    const talentsSeed = [
      {
        id: IDS.talents.alya,
        name: "Alya Putri",
        slug: generateSlug("Alya Putri"),
        profession: "Product Designer",
        industry: "Design",
        profilePicture: "https://i.pravatar.cc/300?img=3",
        bannerPicture:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
        description:
          "Desainer produk yang fokus pada sistem desain, aksesibilitas, dan pengalaman pengguna.",
        isVerified: true,
        userId: IDS.users.user,
      },
      {
        id: IDS.talents.bima,
        name: "Bima Ardiansyah",
        slug: generateSlug("Bima Ardiansyah"),
        profession: "Software Engineer",
        industry: "Technology",
        profilePicture: "https://i.pravatar.cc/300?img=4",
        bannerPicture:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
        description:
          "Engineer yang suka membangun produk web performa tinggi dan DX yang asyik.",
        isVerified: false,
        userId: IDS.users.user2, // contoh: admin juga punya talent
      },
    ];

    for (const t of talentsSeed) {
      const exist = await db.talent.findUnique({ where: { id: t.id } });
      if (!exist) {
        await db.talent.create({ data: t });
        summary.created.talents++;
      } else summary.skipped.talents++;
    }

    // ===== Social Medias =====
    const socialsSeed = [
      {
        id: IDS.socials.alyaIg,
        platform: SocialMediaPlatformEnum.instagram,
        url: "https://instagram.com/alya.design",
        talentId: IDS.talents.alya,
      },
      {
        id: IDS.socials.alyaLi,
        platform: SocialMediaPlatformEnum.linkedin,
        url: "https://www.linkedin.com/in/alya-putri",
        talentId: IDS.talents.alya,
      },
      {
        id: IDS.socials.bimaX,
        platform: SocialMediaPlatformEnum.twitter,
        url: "https://x.com/bima_dev",
        talentId: IDS.talents.bima,
      },
    ];

    for (const s of socialsSeed) {
      const exist = await db.socialMedia.findUnique({ where: { id: s.id } });
      if (!exist) {
        await db.socialMedia.create({ data: s });
        summary.created.socials++;
      } else summary.skipped.socials++;
    }

    // ===== Articles =====
    const articlesSeed = [
      {
        id: IDS.articles.a1,
        slug: generateSlug("Mendesain Sistem Design Tokens di Skala Besar"),
        title: "Mendesain Sistem Design Tokens di Skala Besar",
        thumbnailImage:
          "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop",
        content: `<p>Mengelola design tokens untuk multi brand dan platform membutuhkan strategi yang matang. 
          Artikel ini membahas arsitektur token, penskalaan, dan automasi.</p>`,
        category: "Design",
        tags: ["design-system", "tokens", "scale"],
        status: ArticleStatusEnum.published,
        userId: IDS.users.user,
      },
      {
        id: IDS.articles.a2,
        slug: generateSlug("Membangun API yang Tahan Skala"),
        title: "Membangun API yang Tahan Skala",
        thumbnailImage:
          "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
        content: `<p>Dari pagination hingga idempotency: praktik terbaik untuk API yang stabil, aman, dan siap tumbuh.</p>`,
        category: "Technology",
        tags: ["api", "scalability", "best-practices"],
        status: ArticleStatusEnum.published,
        userId: IDS.users.admin,
      },
      {
        id: IDS.articles.a3,
        slug: generateSlug("Strategi Monetisasi untuk Kreator"),
        title: "Strategi Monetisasi untuk Kreator",
        thumbnailImage:
          "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1200&auto=format&fit=crop",
        content: `<p>Langganan, kursus, sponsor, dan merchandise—mana yang paling cocok untukmu? Kita bedah pro-kontra dan metriknya.</p>`,
        category: "Business",
        tags: ["monetization", "creator-economy"],
        status: ArticleStatusEnum.draft,
        userId: IDS.users.user,
      },
    ];

    for (const a of articlesSeed) {
      const exist = await db.article.findUnique({ where: { id: a.id } });
      if (!exist) {
        await db.article.create({
          data: {
            ...a,
            type: ArticleTypeEnum.detak, // TOOD: fix seeder
          },
        });
        summary.created.articles++;
      } else summary.skipped.articles++;
    }

    // ===== Products =====
    const productsSeed = [
      {
        id: IDS.products.p1,
        slug: generateSlug("Kamera Mirrorless Alpha X"),
        title: "Kamera Mirrorless Alpha X",
        images: [
          "https://images.unsplash.com/photo-1519183071298-a2962be96f83?q=80&w=1200&auto=format&fit=crop",
        ],
        description:
          "Kamera ringkas dengan sensor full-frame dan stabilisasi 5-axis untuk hasil jernih.",
        price: 14990000,
        talentId: IDS.talents.alya,
        status: ProductStatusEnum.published,
        category: "Camera",
      },
      {
        id: IDS.products.p2,
        slug: generateSlug("Sneakers Urban Runner"),
        title: "Sneakers Urban Runner",
        images: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
        ],
        description:
          "Nyaman untuk aktivitas harian dengan outsole grip kuat dan upper berpori.",
        price: 899000,
        talentId: IDS.talents.bima,
        status: ProductStatusEnum.published,
        category: "Sneakers",
      },
      {
        id: IDS.products.p3,
        slug: generateSlug("Manual Brew Set"),
        title: "Manual Brew Set",
        images: [
          "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop",
        ],
        description:
          "Set kopi manual untuk pour-over; nikmati aroma dan rasa yang lebih kompleks.",
        price: 559000,
        talentId: IDS.talents.alya,
        status: ProductStatusEnum.published,
        category: "Coffee",
      },
    ];

    for (const p of productsSeed) {
      const exist = await db.product.findUnique({ where: { id: p.id } });
      if (!exist) {
        await db.product.create({ data: p });
        summary.created.products++;
      } else summary.skipped.products++;
    }

    for await (const hc of DUMMY_HUB_CATEGORIES) {
      const exist = await db.hubCategory.findUnique({ where: { id: hc.id } });
      if (!exist) {
        await db.hubCategory.create({
          data: {
            id: hc.id,
            name: hc.title,
          },
        });
        summary.created.hubs.category++;
      } else {
        summary.skipped.hubs.category++;
      }
    }

    const flattedHubs = DUMMY_HUB_CATEGORIES.flatMap((hc) => hc.items);
    for await (const h of flattedHubs) {
      const exist = await db.hub.findUnique({ where: { id: h.id } });
      if (!exist) {
        await db.hub.create({
          data: {
            id: h.id,
            name: h.title,
            description: h.description,
            image: h.image,
            slug: h.slug,
            status: h.status,
            hubCategoryId: h.hubCategoryId,
          },
        });
        summary.created.hubs.data++;
      } else summary.skipped.hubs.data++;
    }

    const ID_APP_DATA = "id_app_data";

    let appData = await db.appData.findUnique({
      where: {
        id: ID_APP_DATA,
      },
      include: {
        aboutItems: true,
        partners: true,
        appSocialMedias: true,
      },
    });

    let isAppDataCreated = false;

    if (!appData) {
      appData = await db.appData.create({
        data: {
          id: ID_APP_DATA,
          // HERO SECTION
          heroTitle: "Pemuda Magelang",
          heroDescription:
            "Wadah kolaborasi talenta Kota Magelang — temukan komunitas, bangun portofolio, dan bertumbuh bersama.",
          heroImage:
            "https://cjip.jatengprov.go.id/storage/profil/foto/qQ90oLmKqOXj0tTGLIzjlkouGkWSeh-metaMjAyMDEwMjlEUkEyMV9tZW5hcmEtYWlyLWtvdGEtbWFnZWxhbmcuanBn-.jpg",
          // ABOUT SECTION
          aboutTitle: "Tentang Pemuda Magelang",
          aboutDescription:
            "Pemuda Magelang adalah wadah kolaborasi talenta Kota Magelang — temukan komunitas, bangun portofolio, dan bertumbuh bersama.",
          aboutImage:
            "https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/68/2024/01/21/magelang-ok-3599004207.jpg",
          aboutItems: {
            createMany: {
              data: [
                {
                  key: "Komunitas Talenta",
                  value:
                    "Jaringan lintas disiplin: teknologi, seni, desain, musik, film, dan penulisan.",
                  icon: IconEnum.users,
                },
                {
                  key: "Kolaborasi Nyata",
                  value:
                    "Dari proyek komunitas hingga program kota—wadah untuk berkolaborasi.",
                  icon: IconEnum.handshake,
                },
                {
                  key: "Fokus Kota Magelang",
                  value:
                    "Inisiatif lokal untuk dampak yang terasa—tumbuh dari daerah, untuk daerah.",
                  icon: IconEnum.mapPin,
                },
                {
                  key: "Portofolio & Eksposur",
                  value:
                    "Bangun profil, tampilkan karya, dan raih kesempatan baru.",
                  icon: IconEnum.sparkles,
                },
              ],
            },
          },
          // BRANDING SECTION
          brandingTitle: "Keindahan Panorama KOTA MAGELANG",
          brandingDescription:
            "Pemuda Magelang adalah wadah kolaborasi talenta Kota Magelang — temukan komunitas, bangun portofolio, dan bertumbuh bersama.",
          brandingVideo: "https://www.youtube.com/watch?v=z-JqZQy0Qyo",

          // PARTNERS SECTION
          partners: {
            createMany: {
              data: [
                ...supported.map((s) => ({
                  name: s.name,
                  image: s.image,
                  href: s.href,
                  type: PartnerTypeEnum.supported,
                })),
                ...collabs.map((c) => ({
                  name: c.name,
                  image: c.image,
                  href: c.href,
                  type: PartnerTypeEnum.collaborator,
                })),
                ...medias.map((m) => ({
                  name: m.name,
                  image: m.image,
                  href: m.href,
                  type: PartnerTypeEnum.media,
                })),
              ],
            },
          },
          pageFaq:
            "<h1>FAQ (Pertanyaan yang Sering Diajukan)</h1><h2>A. Akun &amp; Keamanan</h2><h3>1) Bagaimana cara membuat akun?</h3><p>Klik <strong>Daftar</strong>, masukkan nama &amp; email, lalu verifikasi. Kamu juga dapat menggunakan SSO bila tersedia.</p><h3>2) Lupa kata sandi?</h3><p>Gunakan menu <strong>Lupa Kata Sandi</strong> untuk reset via email.</p><h3>3) Bagaimana mengganti nama/foto profil?</h3><p>Masuk ke <strong>Dashboard → Pengaturan Akun</strong>, lalu simpan perubahan.</p><h2>B. Artikel &amp; Komentar</h2><h3>1) Bagaimana cara menulis artikel?</h3><p>Buka <strong>Dashboard → Artikel → Tulis Baru</strong>. Gunakan editor (heading, list, gambar, dll.), lalu <strong>Simpan Draft</strong> atau <strong>Publikasikan</strong>.</p><h3>2) Konten seperti apa yang dilarang?</h3><p>Konten ilegal, plagiarisme, ujaran kebencian, pornografi, SARA, doxing, spam, serta pelanggaran hak cipta/privasi.</p><h3>3) Apakah saya bisa mengedit/menghapus artikel?</h3><p>Ya, selama kamu pemiliknya dan belum dihapus/moderasi. Admin dapat menurunkan artikel yang melanggar.</p><h3>4) Bagaimana cara berkomentar?</h3><p>Masuk, buka artikel, tuliskan komentar. Gunakan bahasa sopan dan relevan.</p><h2>C. Talenta &amp; Produk</h2><h3>1) Apa itu Talenta?</h3><p>Talenta adalah pengguna yang terverifikasi untuk menampilkan karya/produk/jasa.</p><h3>2) Cara mendaftar sebagai Talenta?</h3><p><strong>Dashboard → Pengaturan Akun → Talenta</strong>, isi formulir dan ajukan. Status akan <strong>pending</strong> sampai disetujui.</p><h3>3) Produk apa yang boleh dijual?</h3><p>Produk yang sesuai hukum, kebijakan platform, dan tidak melanggar hak pihak lain. Lihat pedoman konten untuk detailnya.</p><h3>4) Bagaimana kebijakan harga &amp; refund?</h3><p>Harga ditentukan Talenta. Kebijakan refund ditetapkan <strong>[NAMA ORGANISASI/talenta]</strong>—cek halaman produk atau hubungi dukungan.</p><h2>D. Komunitas &amp; Event</h2><h3>1) Apa itu Hub/Komunitas?</h3><p>Tempat berjejaring berdasar minat/lokasi. Kamu bisa mengikuti hub untuk update kegiatan.</p><h3>2) Bisakah saya mengusulkan acara?</h3><p>Ya. Cek <strong>Dashboard/Hub</strong> terkait atau hubungi admin hub.</p><h2>E. Teknis</h2><h3>1) Gambar tidak terunggah?</h3><p>Pastikan format (JPG/PNG), ukuran file tidak melebihi batas <strong>[ukuran]</strong>, dan koneksi stabil.</p><h3>2) Editor berbeda tampilan dengan halaman publik?</h3><p>Kami menyertakan stylesheet yang sama pada halaman publik. Jika jarak paragraf/heading terasa berbeda, bersihkan cache dan laporkan ke <strong>[ALAMAT EMAIL]</strong>.</p><h3>3) Saya menemukan bug atau ingin usulan fitur</h3><p>Kirim detail (langkah reproduksi, tangkapan layar) ke <strong>[ALAMAT EMAIL]</strong>.</p><h2>F. Privasi &amp; Data</h2><h3>1) Data apa yang kalian kumpulkan?</h3><p>Data akun (nama, email), konten yang kamu unggah, serta data teknis untuk keamanan dan analitik. Lihat <strong>Kebijakan Privasi</strong>.</p><h3>2) Bagaimana cara meminta penghapusan data?</h3><p>Email ke <strong>[ALAMAT EMAIL]</strong> dengan subjek <em>Permintaan Penghapusan Data</em>. Kami akan memverifikasi permintaanmu.</p>",
          pagePrivacy:
            "<h1>Kebijakan Privasi</h1><p><strong>Terakhir diperbarui:</strong> 1 Oktober 2025<br><strong>Berlaku untuk:</strong> platform dan layanan digital milik <strong>[NAMA ORGANISASI]</strong> (“kami”).</p><h2>1) Ringkasan Singkat</h2><ul><li><p>Kami mengumpulkan data yang kamu berikan (mis. nama, email) dan data teknis (mis. alamat IP, cookies) untuk operasional platform.</p></li><li><p>Kami memakai cookies/teknologi serupa untuk login, preferensi, analitik, dan peningkatan pengalaman.</p></li><li><p>Kamu dapat meminta akses, koreksi, atau penghapusan data pribadimu.</p></li><li><p>Hubungi kami di <strong>[ALAMAT EMAIL]</strong> untuk pertanyaan privasi.</p></li></ul><h2>2) Data yang Kami Kumpulkan</h2><h3>a. Data yang kamu berikan</h3><ul><li><p><strong>Akun</strong>: nama, email, foto profil, kata sandi (di-hash), profesi/industri (jika mendaftar Talenta).</p></li><li><p><strong>Konten</strong>: artikel, komentar, gambar, produk/layanan yang kamu unggah.</p></li><li><p><strong>Pembelian/Transaksi</strong> (jika ada): alamat pengiriman, rincian pembayaran (diproses oleh mitra pembayaran; kami tidak menyimpan data kartu).</p></li></ul><h3>b. Data yang dikumpulkan otomatis</h3><ul><li><p><strong>Data perangkat &amp; log</strong>: alamat IP, jenis peramban, sistem operasi, halaman yang diakses, waktu akses, URL rujukan.</p></li><li><p><strong>Cookies / local storage</strong>: untuk sesi login, preferensi, dan analitik.</p></li></ul><h3>c. Data dari pihak ketiga (opsional)</h3><ul><li><p>Media sosial/SSO (jika kamu memilih login via pihak ketiga) sesuai pengaturan perizinanmu di platform tersebut.</p></li></ul><h2>3) Tujuan Penggunaan Data</h2><ul><li><p>Menyediakan dan memelihara layanan (autentikasi, profil, dashboard).</p></li><li><p>Moderasi dan keamanan (mencegah spam/penyalahgunaan).</p></li><li><p>Analitik dan peningkatan kualitas fitur.</p></li><li><p>Komunikasi (pemberitahuan, dukungan, informasi pembaruan).</p></li><li><p>Kepatuhan hukum.</p></li></ul><h2>4) Dasar Pemrosesan</h2><ul><li><p><strong>Persetujuan</strong> (mis. pemasaran, cookies non-esensial).</p></li><li><p><strong>Kontrak</strong> (penyediaan layanan yang kamu minta).</p></li><li><p><strong>Kepentingan yang sah</strong> (mis. keamanan, pencegahan penyalahgunaan).</p></li><li><p><strong>Kepatuhan hukum</strong>.</p></li></ul><h2>5) Berbagi Data dengan Siapa</h2><ul><li><p><strong>Penyedia layanan</strong> (hosting, analitik, email, pembayaran) dengan perjanjian pemrosesan data.</p></li><li><p><strong>Kepatuhan hukum</strong> bila diwajibkan.</p></li><li><p><strong>Transfer bisnis</strong> (jika terjadi penggabungan/akuisisi; kami akan memberi pemberitahuan).</p></li></ul><h2>6) Cookies &amp; Teknologi Serupa</h2><ul><li><p><strong>Esensial</strong>: menjaga sesi dan keamanan.</p></li><li><p><strong>Fungsional</strong>: preferensi tampilan/ bahasa.</p></li><li><p><strong>Analitik</strong>: memahami penggunaan untuk pengembangan fitur.<br>Kamu bisa mengatur preferensi cookies via pengaturan peramban atau banner persetujuan (jika tersedia).</p></li></ul><h2>7) Penyimpanan &amp; Keamanan</h2><ul><li><p>Kami menerapkan langkah teknis &amp; organisasi yang wajar (enkripsi transit, kontrol akses).</p></li><li><p><strong>Retensi</strong>: data disimpan selama akun aktif atau diperlukan untuk tujuan pengumpulan; kemudian dihapus/dianonimkan sesuai kebijakan retensi.</p></li></ul><h2>8) Hak-Hakmu</h2><ul><li><p><strong>Akses</strong> salinan data; <strong>perbaikan</strong> kesalahan; <strong>penghapusan</strong>; <strong>penarikan persetujuan</strong>; <strong>keberatan</strong> atau <strong>pembatasan</strong> pemrosesan bila berlaku.</p></li><li><p>Ajukan permintaan ke <strong>[ALAMAT EMAIL]</strong>. Kami mungkin perlu memverifikasi identitasmu.</p></li></ul><h2>9) Anak di Bawah Umur</h2><ul><li><p>Layanan tidak ditujukan untuk anak di bawah <strong>[umur kebijakan, mis. 13/16]</strong> tahun. Jika tanpa sengaja mengumpulkan data anak, kirimkan email ke <strong>[ALAMAT EMAIL]</strong> untuk penghapusan.</p></li></ul><h2>10) Tautan ke Situs Lain</h2><ul><li><p>Konten pihak ketiga memiliki kebijakan sendiri. Kami tidak bertanggung jawab atas praktik privasi situs eksternal.</p></li></ul><h2>11) Perubahan Kebijakan</h2><ul><li><p>Kami dapat memperbarui kebijakan ini. Tanggal “Terakhir diperbarui” akan berubah. Perubahan material akan diberitahukan secara jelas.</p></li></ul><h2>12) Kontak</h2><p><strong>[NAMA ORGANISASI]</strong><br><strong>[ALAMAT KANTOR]</strong><br><strong>Email:</strong> <strong>[ALAMAT EMAIL]</strong></p>",
          pageTerms:
            "<h1>Syarat &amp; Ketentuan</h1><p><strong>Terakhir diperbarui:</strong> 1 Oktober 2025</p><h2>1) Penerimaan Syarat</h2><p>Dengan membuat akun/menggunakan layanan <strong>[NAMA ORGANISASI]</strong>, kamu menyetujui Syarat &amp; Ketentuan ini dan Kebijakan Privasi kami.</p><h2>2) Definisi Singkat</h2><ul><li><p><strong>Platform</strong>: situs dan layanan digital kami.</p></li><li><p><strong>Pengguna</strong>: semua pihak yang mengakses platform.</p></li><li><p><strong>Konten Pengguna</strong>: artikel, komentar, gambar, produk, atau materi lain yang kamu unggah.</p></li><li><p><strong>Talenta</strong>: pengguna yang mendaftar dan disetujui sebagai penyedia karya/produk/jasa.</p></li></ul><h2>3) Kelayakan &amp; Akun</h2><ul><li><p>Kamu menyatakan berusia minimal <strong>[umur]</strong> tahun dan memberikan informasi yang akurat.</p></li><li><p>Jagalah kredensial akunmu; segala aktivitas di akunmu menjadi tanggung jawabmu.</p></li></ul><h2>4) Hak &amp; Kepemilikan Konten</h2><ul><li><p>Kamu <strong>tetap</strong> memiliki hak atas Konten Pengguna yang kamu unggah.</p></li><li><p>Kamu memberikan lisensi non-eksklusif, global, bebas royalti kepada kami untuk <strong>menyimpan, menampilkan, menyesuaikan tampilan (mis. thumbnail/crop), dan mendistribusikan</strong> konten di platform demi operasional layanan.</p></li><li><p>Pastikan konten tidak melanggar hak pihak ketiga (hak cipta, merek, privasi).</p></li></ul><h2>5) Aturan Perilaku</h2><p>Dilarang mengunggah konten yang:</p><ul><li><p>Ilegal, menyesatkan, memfitnah, melecehkan, diskriminatif, eksplisit, atau berbahaya.</p></li><li><p>Melanggar hak kekayaan intelektual atau privasi orang lain.</p></li><li><p>Mengandung malware, spam, atau manipulasi trafik.<br>Kami berhak menghapus konten, membatasi akun, atau mengambil tindakan lain demi keselamatan komunitas.</p></li></ul><h2>6) Talenta, Produk &amp; Transaksi (jika berlaku)</h2><ul><li><p>Talenta wajib mematuhi pedoman konten dan kebijakan listing.</p></li><li><p>Harga, ketersediaan, serta deskripsi produk adalah tanggung jawab Talenta.</p></li><li><p>Pembayaran diproses oleh <strong>[penyedia pembayaran]</strong>; syarat layanan mereka berlaku.</p></li><li><p>Pengembalian/refund mengikuti kebijakan <strong>[NAMA ORGANISASI/talenta]</strong> (cantumkan kebijakan yang berlaku).</p></li></ul><h2>7) Moderasi &amp; Takedown</h2><p>Kami dapat meninjau/menurunkan konten yang melanggar kebijakan. Untuk laporan pelanggaran, kirimkan detail ke <strong>[ALAMAT EMAIL]</strong>.</p><h2>8) Penafian (Disclaimer)</h2><p>Layanan “apa adanya” tanpa jaminan eksplisit maupun implisit. Konten pengguna adalah tanggung jawab pengunggah. Kami tidak menjamin ketersediaan permanen, bebas kesalahan, atau kecocokan untuk tujuan tertentu.</p><h2>9) Batas Tanggung Jawab</h2><p>Sejauh diizinkan hukum, <strong>[NAMA ORGANISASI]</strong> tidak bertanggung jawab atas kerugian tidak langsung/khusus/konsekuensial akibat penggunaan platform.</p><h2>10) Pengakhiran</h2><p>Kami dapat menghentikan/menangguhkan akses jika melanggar S&amp;K. Kamu juga dapat menutup akun kapan saja—beberapa data mungkin tetap disimpan sesuai kewajiban hukum/retensi.</p><h2>11) Hukum yang Berlaku &amp; Sengketa</h2><p>Syarat ini diatur oleh hukum <strong>Republik Indonesia</strong>. Sengketa diselesaikan di <strong>[domisili pengadilan]</strong>.</p><h2>12) Perubahan Syarat</h2><p>Kami dapat memperbarui S&amp;K ini sewaktu-waktu. Tanggal “Terakhir diperbarui” akan disesuaikan; perubahan material akan diinformasikan.</p><h2>13) Kontak</h2><p><strong>[NAMA ORGANISASI]</strong> — <strong>[ALAMAT EMAIL]</strong></p>",
          appSocialMedias: {
            createMany: {
              data: [
                {
                  platform: "instagram",
                  url: "https://www.instagram.com/pemudamagelang/",
                },
                {
                  platform: "facebook",
                  url: "https://www.facebook.com/pemudamagelang/",
                },
                {
                  platform: "twitter",
                  url: "https://www.twitter.com/pemudamagelang/",
                },
                {
                  platform: "youtube",
                  url: "https://www.youtube.com/pemudamagelang/",
                },
                {
                  platform: "linkedin",
                  url: "https://www.linkedin.com/pemudamagelang/",
                },
              ],
            },
          },
        },
        include: {
          aboutItems: true,
          partners: true,
          appSocialMedias: true,
        },
      });
      isAppDataCreated = true;
    }

    return NextResponse.json({
      ok: true,
      message: "Seeding selesai",
      summary,
      appData: {
        isCreated: isAppDataCreated,
        data: appData,
      },
      hint: {
        usersPassword: PASSWORD,
        users: usersSeed.map((u) => ({
          id: u.id,
          email: u.email,
          role: u.role,
        })),
      },
    });
  } catch (err) {
    console.error("[SEED_ERROR]", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}

const generateSlug = (str: string) => {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

const supported = [
  {
    name: "Pemkot Magelang",
    href: "https://magelangkota.go.id/",
    image: "https://pngimg.com/uploads/mcdonalds/mcdonalds_PNG17.png",
  },
  {
    name: "Disbudpar",
    href: "#",
    image: "https://pngimg.com/uploads/mcdonalds/mcdonalds_PNG17.png",
  },
  {
    name: "Bank Jateng",
    href: "#",
    image:
      "https://upload.wikimedia.org/wikipedia/id/thumb/c/c4/Bank_Jateng_logo.svg/1200px-Bank_Jateng_logo.svg.png",
  },
];

const collabs = [
  {
    name: "Komunitas Fotografi",
    href: "#",
    image:
      "https://komunitassemutfoto.com/wp-content/uploads/2025/03/LOGO-2D.gif",
  },
  {
    name: "Studio Desain",
    href: "#",
    image:
      "https://png.pngtree.com/png-vector/20230523/ourmid/pngtree-photo-studio---a-photography-logo-design-vector-png-image_7107703.png",
  },
  {
    name: "Haystudio",
    href: "#",
    image:
      "https://media.licdn.com/dms/image/v2/D5616AQGNyQRHMZcxXg/profile-displaybackgroundimage-shrink_350_1400/profile-displaybackgroundimage-shrink_350_1400/0/1724563314006?e=1761782400&v=beta&t=K8ff5PXRyxhuchPbCt1uEpYY2FUiOs8-mIldn2DMbZY",
  },
  {
    name: "Postmatic",
    href: "#",
    image: "https://postmatic.id/logo-bg-blue-ico.ico",
  },
];

const medias = [
  {
    name: "Garuda FM",
    href: "#",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/b/b6/Logo_Radio_Garuda_FM.png",
  },
  {
    name: "Magelang News",
    href: "#",
    image:
      "https://scontent.fsub3-2.fna.fbcdn.net/v/t39.30808-6/240395137_2620141134958192_4692591651212229701_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=fUQYgQx--cQQ7kNvwH8jLBV&_nc_oc=AdmGnNgHtKNH4-SLeKH4FAli6__DLpZfwI2RW4E_MACfDHdqSs5HTN8mikmoD-kF-28&_nc_zt=23&_nc_ht=scontent.fsub3-2.fna&_nc_gid=kPJ2dYRqF2fn1uuBp-G3fw&oh=00_AfaZstiNOIyRdXk2xaw1ZSGooeLRYiO3l0bRhXg4pVSlkQ&oe=68DA24D3",
  },
  {
    name: "Lestari",
    href: "#",
    image: "https://lestarikehati.com/logo.png",
  },
];
