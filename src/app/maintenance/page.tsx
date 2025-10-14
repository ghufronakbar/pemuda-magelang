import { getAppData } from "@/actions/app-data";
import { CdnImage } from "@/components/custom/cdn-image";
import { LOGO } from "@/constants";

export const metadata = {
  robots: { index: false, follow: false },
};

const getImage = async () => {
  try {
    const appData = await getAppData();
    return appData.baseLogo || "/favicon.ico";
  } catch (error) {
    console.error(error);
    return "/favicon.ico";
  }
};

export default async function Maintenance() {
  const image = await getImage();
  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center">
      <div className="text-center flex flex-col items-center gap-4 px-8">
        <CdnImage
          uniqueKey={image}
          alt="Pemeliharaan"
          className="h-40 w-40 rounded"
          width={400}
          height={400}
        />
        <h1 className="text-4xl font-bold">Pemeliharaan</h1>
        <p className="text-lg">
          Kami sedang melakukan pemeliharaan pada aplikasi kami. Silakan coba
          lagi nanti.
        </p>
        <p className="text-sm text-muted-foreground">
          Kami akan segera kembali. Silakan coba lagi nanti. Terima kasih.
        </p>
      </div>
    </div>
  );
}
