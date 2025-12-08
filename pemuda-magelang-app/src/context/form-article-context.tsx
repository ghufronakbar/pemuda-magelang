"use client";

import {
  ArticleInput,
  ArticleInputSchema,
  initialArticleInput,
} from "@/validator/article";
import { zodResolver } from "@hookform/resolvers/zod";
import { Article } from "@prisma/client";
import { useParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface FormArticleContext {
  form: UseFormReturn<ArticleInput>;
  loading: boolean;
}

const FormArticleContext = createContext<FormArticleContext | null>(null);

const FormArticleProvider = ({ children }: { children: React.ReactNode }) => {
  const form = useForm<ArticleInput>({
    resolver: zodResolver(ArticleInputSchema),
    defaultValues: initialArticleInput,
  });
  const params = useParams();
  const id = (params.id as string) || null;
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchArticle = async (id: string) => {
      try {
        setLoading(true);
        const res = await fetch(`/api/article/${id}`);
        if (!res.ok) return;
        const article = (await res.json())?.data as Article;
        if (!article) return;
        form.setValue("title", article.title);
        form.setValue("thumbnailImage", article.thumbnailImage);
        form.setValue("content", article.content);
        form.setValue("category", article.category);
        form.setValue("tags", article.tags);
        form.setValue("status", article.status);
        form.setValue("communityId", article.communityId ?? null);
      } catch (error) {
        console.error(error);
        toast.error("Gagal mengambil data artikel");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  return (
    <FormArticleContext.Provider value={{ form, loading }}>
      {children}
    </FormArticleContext.Provider>
  );
};

const useFormArticle = () => {
  const context = useContext(FormArticleContext);
  if (!context) {
    throw new Error("useFormArticle must be used within a FormArticleProvider");
  }
  return context;
};

export { FormArticleProvider, useFormArticle };
