"use client";

import { useEffect, useState } from "react";
import { FormCategoryHub } from "@/app/dashboard/(zhub)/(components)/(category)/form-category-zhub";
import {
  DataCategoryHub,
  TableZHubCategory,
} from "@/app/dashboard/(zhub)/(components)/(category)/table-zhub-category";
import { deleteCategoryHub, getAllHubs } from "@/actions/zhub";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const FormKategoriZhub = () => {
  const [categories, setCategories] = useState<DataCategoryHub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllHubs();
        const mappedCategories: DataCategoryHub[] = data.map((item) => ({
          id: item.id,
          name: item.name,
          createdAt: item.createdAt,
          updatedAt: item.createdAt,
          active: item.hubs.filter((h) => h.status === "active").length,
          inactive: item.hubs.filter((h) => h.status === "inactive").length,
          soon: item.hubs.filter((h) => h.status === "soon").length,
        }));
        setCategories(mappedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteCategoryHub(id);
      // Refresh the list
      const data = await getAllHubs();
      const mappedCategories: DataCategoryHub[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: item.createdAt,
        updatedAt: item.createdAt,
        active: item.hubs.filter((h) => h.status === "active").length,
        inactive: item.hubs.filter((h) => h.status === "inactive").length,
        soon: item.hubs.filter((h) => h.status === "soon").length,
      }));
      setCategories(mappedCategories);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kategori Zhub</CardTitle>
          <CardDescription>Memuat data kategori...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center">
            <div className="text-muted-foreground">Memuat...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kategori Zhub</CardTitle>
        <CardDescription>
          Kategori Zhub yang terdaftar di platform ini
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-end">
          <FormCategoryHub />
        </div>
        <TableZHubCategory
          data={categories}
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
};
