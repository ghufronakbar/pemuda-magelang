import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-lg">Halaman tidak ditemukan</p>
        <p className="text-sm text-muted-foreground">
            Sayang sekali, halaman yang Anda cari tidak ditemukan :(
        </p>
      </div>
      <Button className="mt-8">
        <Link href="/">Kembali ke beranda</Link>
      </Button>
    </div>
  );
}
