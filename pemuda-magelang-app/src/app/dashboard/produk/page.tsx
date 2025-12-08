import { Role, TalentStatusEnum } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import {
  deleteProduct,
  getAllProducts,
  setStatusProduct,
} from "@/actions/product";
import { TableProduct } from "../(components)/table-product";
import { getDetailUser } from "@/actions/user";
import { TalentCard } from "@/app/dashboard/ringkasan/(components)/talent-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ProdukPage = async () => {
  const [products, user] = await Promise.all([getAllProducts(), auth()]);
  const detailUser = await getDetailUser(user?.user.id ?? "")();
  const talent = detailUser?.talent;
  const isAdmin =
    user?.user.role === Role.admin || user?.user.role === Role.superadmin;
  const filteredProducts = isAdmin
    ? products
    : products.filter((p) => p.talent.userId === user?.user.id);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold">Produk</CardTitle>
              <CardDescription className="text-sm">Produk yang tersedia</CardDescription>
            </div>
            {!isAdmin && talent?.status === TalentStatusEnum.approved && (
              <Button asChild>
                <Link href="/dashboard/produk/buat-produk">
                  <Plus />
                  Tambah Produk
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Products Content Card */}
      {talent?.status !== TalentStatusEnum.approved && !isAdmin ? (
        <Card>
          <CardContent className="pt-6">
            <TalentCard
              title="Informasi"
              description="Untuk mendaftarkan produk, harus melalui persetujuan dari admin terlebih dahulu."
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Produk</CardTitle>
            <CardDescription>
              {isAdmin 
                ? "Kelola dan monitor semua produk yang terdaftar di platform" 
                : "Kelola produk yang anda daftarkan di platform"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TableProduct
              products={filteredProducts}
              onSetStatus={async (slug, formData) => {
                "use server";
                await setStatusProduct(slug, formData);
              }}
              onDelete={async (slug) => {
                "use server";
                await deleteProduct(slug);
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProdukPage;
