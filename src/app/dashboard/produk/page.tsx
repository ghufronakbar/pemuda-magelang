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
import { TalentCard } from "../ringkasan/(components)/talent-card";

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
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Produk</h1>
          <p className="text-muted-foreground text-sm">Produk yang tersedia</p>
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
      {talent?.status !== TalentStatusEnum.approved && !isAdmin ? (
        <TalentCard
          title="Informasi"
          description="Untuk mendaftarkan produk, harus melalui persetujuan dari admin terlebih dahulu."
        />
      ) : (
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
      )}
    </div>
  );
};

export default ProdukPage;
