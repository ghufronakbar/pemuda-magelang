import { FormProduct } from "@/app/dashboard/(components)/form-product";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

const EditProdukPage = () => {
  return (
    <div className="w-full space-y-6">
      {/* Header Card */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold">Edit Produk</CardTitle>
              <CardDescription className="text-sm">
                Perbarui informasi produk atau karya Anda
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Form Card */}
      <Card>
        <CardContent className="pt-6">
          <FormProduct />
        </CardContent>
      </Card>
    </div>
  );
};
export default EditProdukPage;
