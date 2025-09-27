import { FormProduct } from "../../(components)/form-product";
const BuatProdukPage = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Produk</h1>
          <p className="text-muted-foreground text-sm">Tambahkan produk baru</p>
        </div>
      </div>
      <FormProduct />
    </div>
  );
};
export default BuatProdukPage;
