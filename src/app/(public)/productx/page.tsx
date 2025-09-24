import { revalidatePath } from "next/cache";
import { createProduct, getProducts } from "./actions";
import { ProductsForm } from "./client";

const ProductsPage = async () => {
  const products = await getProducts();

  const onSubmit = async (formData: FormData) => {
    "use server";
    try {
      const result = await createProduct(formData);
      if (result.success) {
        console.log("Product created successfully");
        // revalidatePath("/products");
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id}>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
      <ProductsForm action={onSubmit} />
    </div>
  );
};

export default ProductsPage;
