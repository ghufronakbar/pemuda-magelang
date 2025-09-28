"use client";

import { createCategoryHub } from "@/actions/zhub";
import {
  HubCategoryInput,
  HubCategorySchema,
  initialHubCategoryInput,
} from "@/validator/zhub";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useContext, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface FormCategoryHubContext {
  form: UseFormReturn<HubCategoryInput>;
  onSubmit: () => Promise<void>;
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose: () => void;
  onOpenEdit: (id: string, name: string) => void;
  loading: boolean;
}

const FormCategoryHubContext = createContext<FormCategoryHubContext | null>(
  null
);

const FormCategoryHubProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<HubCategoryInput>({
    resolver: zodResolver(HubCategorySchema),
    defaultValues: initialHubCategoryInput,
  });

  const onClose = () => {
    setOpen(false);
    form.reset({
      id: null,
      name: "",
    });
  };

  const onOpenEdit = (id: string, name: string) => {
    setOpen(true);
    form.reset({
      id: id,
      name: name,
    });
  };

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setLoading(true);
      if (loading) return;
      const fd = new FormData();
      fd.append("payload", JSON.stringify(data));
      const res = await createCategoryHub(fd);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Kategori zhub berhasil ditambahkan");
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  });

  return (
    <FormCategoryHubContext.Provider
      value={{ form, onSubmit, open, setOpen, onClose, onOpenEdit, loading }}
    >
      {children}
    </FormCategoryHubContext.Provider>
  );
};

const useFormCategoryHub = () => {
  const context = useContext(FormCategoryHubContext);
  if (!context) {
    throw new Error(
      "useFormCategoryHub must be used within a FormCategoryHubProvider"
    );
  }
  return context;
};

export { FormCategoryHubProvider, useFormCategoryHub };
