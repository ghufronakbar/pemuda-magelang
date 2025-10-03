"use client";

import {
  ProductInput,
  ProductInputSchema,
  initialProductInput,
} from "@/validator/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@prisma/client";
import { useParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface FormProductContext {
  form: UseFormReturn<ProductInput>;
  loading: boolean;
}

const FormProductContext = createContext<FormProductContext | null>(null);

const FormProductProvider = ({ children }: { children: React.ReactNode }) => {
  const form = useForm<ProductInput>({
    resolver: zodResolver(ProductInputSchema),
    defaultValues: initialProductInput,
  });
  const params = useParams();
  const id = (params.id as string) || null;
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchArticle = async (id: string) => {
      try {
        setLoading(true);
        const res = await fetch(`/api/product/${id}`);
        if (!res.ok) return;
        const product = (await res.json())?.data as Product;
        if (!product) return;
        form.setValue("title", product.title);
        form.setValue("images", product.images);
        form.setValue("description", product.description);
        form.setValue("price", product.price ?? 0);
        form.setValue("category", product.category);
        form.setValue("tags", product.tags);
        form.setValue("status", product.status);
      } catch (error) {
        console.error(error);
        toast.error("Gagal mengambil data produk");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchArticle(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <FormProductContext.Provider value={{ form, loading }}>
      {children}
    </FormProductContext.Provider>
  );
};

const useFormProduct = () => {
  const context = useContext(FormProductContext);
  if (!context) {
    throw new Error("useFormProduct must be used within a FormProductProvider");
  }
  return context;
};

export { FormProductProvider, useFormProduct };
