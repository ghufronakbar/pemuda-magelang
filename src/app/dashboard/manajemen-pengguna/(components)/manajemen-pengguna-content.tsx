import * as React from "react";
import { Role } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DataTableUserTalent, 
  TableUserTalent 
} from "../../(components)/table-user-talent";
import { TableCommunity } from "../../(komunitas)/kelola-komunitas/(components)/table-community";
import { TableProduct } from "../../(components)/table-product";
import { FormAdmin } from "../../(components)/form-admin";
import { deleteUser, getAllUsers } from "@/actions/user";
import { setStatusTalent } from "@/actions/talent";
import { 
  deleteCommunity, 
  getAllCommunities, 
  setCommunityStatus 
} from "@/actions/community";
import { 
  deleteProduct, 
  getAllProducts, 
  setStatusProduct 
} from "@/actions/product";
import { auth } from "@/auth";

export async function ManajemenPenggunaContent() {
  const session = await auth();
  const role = session?.user?.role;
  
  // Fetch all data
  const [users, communities, products] = await Promise.all([
    getAllUsers(),
    getAllCommunities(),
    getAllProducts(),
  ]);

  // Filter pengguna (regular users only)
  const filteredPengguna = users.filter((item) => item.role === Role.user);
  const mappedPengguna: DataTableUserTalent[] = filteredPengguna.map((item) => ({
    id: item.id,
    image: item.profilePicture,
    email: item.email,
    industry: null,
    profession: null,
    publishedArticle: item._count.articles ?? 0,
    publishedProduct: item.talent?._count.products ?? 0,
    name: item.name,
    status: item.talent?.status || null,
    createdAt: item.createdAt,
    type: "pengguna",
    role: item.role,
    isTalent: !!item.talent,
    subdistrict: item.subdistrict ?? "",
    village: item.village ?? "",
    street: item.street ?? "",
    slug: null,
  }));

  // Filter talent (users with talent profile)
  const filteredTalent = users.filter(
    (item) => item.role === Role.user && item.talent
  );
  const mappedTalent: DataTableUserTalent[] = filteredTalent.map((item) => ({
    id: item.id,
    image: item.profilePicture,
    email: item.email,
    industry: null,
    profession: null,
    publishedArticle: item._count.articles ?? 0,
    publishedProduct: item.talent?._count.products ?? 0,
    name: item.name,
    status: item.talent?.status || null,
    createdAt: item.createdAt,
    type: "talenta",
    role: item.role,
    isTalent: !!item.talent,
    subdistrict: item.subdistrict ?? "",
    village: item.village ?? "",
    street: item.street ?? "",
    slug: item.talent?.slug ?? null,
  }));

  // Filter admin (admin and superadmin only)
  const filteredAdmin = users.filter((item) => item.role !== Role.user);
  const mappedAdmin: DataTableUserTalent[] = filteredAdmin.map((item) => ({
    id: item.id,
    image: item.profilePicture,
    email: item.email,
    industry: null,
    profession: null,
    publishedArticle: item._count.articles ?? 0,
    publishedProduct: item.talent?._count.products ?? 0,
    name: item.name,
    status: item.talent?.status || null,
    createdAt: item.createdAt,
    type: "admin",
    role: item.role,
    isTalent: false,
    subdistrict: item.subdistrict ?? "",
    village: item.village ?? "",
    street: item.street ?? "",
    slug: null,
  }));

  // Check if user is super admin
  const isSuperAdmin = role === Role.superadmin;

  return (
    <Tabs defaultValue="pengguna" className="w-full">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Daftar Pengguna</h3>
          <p className="text-sm text-muted-foreground">
            Kelola dan monitor data pengguna, talenta, admin, komunitas, dan produk
          </p>
        </div>
        <TabsList className={`grid w-full ${isSuperAdmin ? 'grid-cols-5' : 'grid-cols-4'}`}>
          <TabsTrigger value="pengguna">Pengguna</TabsTrigger>
          <TabsTrigger value="talent">Talent</TabsTrigger>
          {isSuperAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
          <TabsTrigger value="komunitas">Komunitas</TabsTrigger>
          <TabsTrigger value="produk">Produk</TabsTrigger>
        </TabsList>
      </div>

      {/* Pengguna Tab */}
      <TabsContent value="pengguna" className="mt-4">
        <TableUserTalent
            users={mappedPengguna}
            onSetTalent={async (id, formData) => {
              "use server";
              await setStatusTalent(id, formData);
            }}
            onDelete={async (id) => {
              "use server";
              await deleteUser(id);
            }}
            type="pengguna"
          />
      </TabsContent>

      {/* Talent Tab */}
      <TabsContent value="talent" className="mt-4">
        <TableUserTalent
            users={mappedTalent}
            onSetTalent={async (id, formData) => {
              "use server";
              await setStatusTalent(id, formData);
            }}
            onDelete={async (id) => {
              "use server";
              await deleteUser(id);
            }}
            type="talenta"
          />
      </TabsContent>

      {/* Admin Tab */}
      {isSuperAdmin && (
        <TabsContent value="admin" className="mt-4">
          <TableUserTalent
            users={mappedAdmin}
            onSetTalent={async (id, formData) => {
              "use server";
              await setStatusTalent(id, formData);
            }}
            onDelete={async (id) => {
              "use server";
              await deleteUser(id);
            }}
            type="admin"
            actionButton={<FormAdmin />}
          />
        </TabsContent>
      )}

      {/* Komunitas Tab */}
      <TabsContent value="komunitas" className="mt-4">
        <TableCommunity
            communities={communities}
            onSetStatus={async (id, formData) => {
              "use server";
              await setCommunityStatus(id, formData);
            }}
            onDelete={async (id) => {
              "use server";
              await deleteCommunity(id);
            }}
          />
      </TabsContent>

      {/* Produk Tab */}
      <TabsContent value="produk" className="mt-4">
        <TableProduct
            products={products}
            onSetStatus={async (slug, formData) => {
              "use server";
              await setStatusProduct(slug, formData);
            }}
            onDelete={async (slug) => {
              "use server";
              await deleteProduct(slug);
            }}
          />
      </TabsContent>
    </Tabs>
  );
}

