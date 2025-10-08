import * as React from "react";
import { Role } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DataTableUserTalent,
  TableUserTalent,
} from "../../(components)/table-user-talent";
import { TableCommunity } from "../../(komunitas)/kelola-komunitas/(components)/table-community";
import { TableProduct } from "../../(components)/table-product";
import { deleteUser, getAllUsers } from "@/actions/user";
import { setStatusTalent } from "@/actions/talent";
import {
  deleteCommunity,
  getAllCommunities,
  setCommunityStatus,
} from "@/actions/community";
import {
  deleteProduct,
  getAllProducts,
  setStatusProduct,
} from "@/actions/product";
import { auth } from "@/auth";
import { Users, Star, Shield, Users2, Package } from "lucide-react";
import { FormAdminProvider } from "@/context/form-admin-context";
import { FormCreateAdmin } from "@/components/custom/form-create-admin";

export async function ManajemenPenggunaContent({ tab }: { tab: string }) {
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
  const mappedPengguna: DataTableUserTalent[] = filteredPengguna.map(
    (item) => ({
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
    })
  );

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
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h3 className="text-2xl font-bold tracking-tight">
          Manajemen Pengguna
        </h3>
        <p className="text-muted-foreground">
          Kelola dan monitor data pengguna, talenta, admin, komunitas, dan
          produk secara terpusat
        </p>
      </div>

      {/* Enhanced Tabs */}
      <Tabs defaultValue={tab} className="w-full">
        <div className="space-y-4">
          {/* Desktop Tabs */}
          <div className="hidden sm:block">
            <TabsList
              className={`grid w-full h-12 ${
                isSuperAdmin ? "grid-cols-5" : "grid-cols-4"
              } gap-1 bg-muted/50 p-1 rounded-xl`}
            >
              <TabsTrigger
                value="pengguna"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-background/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg"
              >
                <Users className="h-4 w-4" />
                <span className="hidden lg:inline">Pengguna</span>
                <span className="lg:hidden">User</span>
              </TabsTrigger>
              <TabsTrigger
                value="talenta"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-background/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg"
              >
                <Star className="h-4 w-4" />
                <span className="hidden lg:inline">Talent</span>
                <span className="lg:hidden">Talent</span>
              </TabsTrigger>
              {isSuperAdmin && (
                <TabsTrigger
                  value="admin"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-background/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg"
                >
                  <Shield className="h-4 w-4" />
                  <span className="hidden lg:inline">Admin</span>
                  <span className="lg:hidden">Admin</span>
                </TabsTrigger>
              )}
              <TabsTrigger
                value="komunitas"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-background/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg"
              >
                <Users2 className="h-4 w-4" />
                <span className="hidden lg:inline">Komunitas</span>
                <span className="lg:hidden">Kom</span>
              </TabsTrigger>
              <TabsTrigger
                value="produk"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-background/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg"
              >
                <Package className="h-4 w-4" />
                <span className="hidden lg:inline">Produk</span>
                <span className="lg:hidden">Prod</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Mobile Tabs - Scrollable */}
          <div className="sm:hidden">
            <div className="overflow-x-auto scrollbar-hide">
              <TabsList
                className={`inline-flex w-max h-12 gap-1 bg-muted/50 p-1 rounded-xl ${
                  isSuperAdmin ? "min-w-[400px]" : "min-w-[320px]"
                }`}
              >
                <TabsTrigger
                  value="pengguna"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-background/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg whitespace-nowrap"
                >
                  <Users className="h-4 w-4" />
                  Pengguna
                </TabsTrigger>
                <TabsTrigger
                  value="talenta"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-background/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg whitespace-nowrap"
                >
                  <Star className="h-4 w-4" />
                  Talent
                </TabsTrigger>
                {isSuperAdmin && (
                  <TabsTrigger
                    value="admin"
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-background/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg whitespace-nowrap"
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="komunitas"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-background/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg whitespace-nowrap"
                >
                  <Users2 className="h-4 w-4" />
                  Komunitas
                </TabsTrigger>
                <TabsTrigger
                  value="produk"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-background/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-lg whitespace-nowrap"
                >
                  <Package className="h-4 w-4" />
                  Produk
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        {/* Pengguna Tab */}
        <TabsContent value="pengguna" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Daftar Pengguna
                </h4>
                <p className="text-sm text-muted-foreground">
                  Kelola pengguna terdaftar dalam sistem
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                Total: {mappedPengguna.length} pengguna
              </div>
            </div>
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
          </div>
        </TabsContent>

        {/* Talent Tab */}
        <TabsContent value="talenta" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Daftar Talent
                </h4>
                <p className="text-sm text-muted-foreground">
                  Kelola talenta yang telah terverifikasi
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                Total: {mappedTalent.length} talent
              </div>
            </div>
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
          </div>
        </TabsContent>

        {/* Admin Tab */}
        {isSuperAdmin && (
          <TabsContent value="admin" className="mt-6">
            <FormAdminProvider>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Daftar Admin
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Kelola administrator sistem
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      Total: {mappedAdmin.length} admin
                    </div>
                    <FormCreateAdmin />
                  </div>
                </div>
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
                />
              </div>
            </FormAdminProvider>
          </TabsContent>
        )}

        {/* Komunitas Tab */}
        <TabsContent value="komunitas" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <Users2 className="h-5 w-5" />
                  Daftar Komunitas
                </h4>
                <p className="text-sm text-muted-foreground">
                  Kelola komunitas yang terdaftar
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                Total: {communities.length} komunitas
              </div>
            </div>
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
          </div>
        </TabsContent>

        {/* Produk Tab */}
        <TabsContent value="produk" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Daftar Produk
                </h4>
                <p className="text-sm text-muted-foreground">
                  Kelola produk yang telah dipublikasikan
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                Total: {products.length} produk
              </div>
            </div>
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
