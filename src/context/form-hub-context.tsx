"use client";

import { createHub } from "@/actions/zhub";
import { HubInput, HubInputSchema, initialHubInput } from "@/validator/zhub";
import { zodResolver } from "@hookform/resolvers/zod";
import { Hub, HubStatusEnum } from "@prisma/client";
import { createContext, useContext, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface FormHubContext {
  form: UseFormReturn<HubInput>;
  onSubmit: () => Promise<void>;
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose: () => void;
  onOpenEdit: (item: Hub) => void;
  loading: boolean;
}

const FormHubContext = createContext<FormHubContext | null>(null);

const FormHubProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<HubInput>({
    resolver: zodResolver(HubInputSchema),
    defaultValues: initialHubInput,
  });

  const onClose = () => {
    setOpen(false);
    form.reset({
      id: null,
      hubCategoryId: "",
      name: "",
      description: "",
      image: null,
      ctaLink: null,
      status: HubStatusEnum.active,
    });
  };

  const onOpenEdit = (item: Hub) => {
    setOpen(true);
    form.reset({
      id: item.id,
      hubCategoryId: item.hubCategoryId,
      name: item.name,
      description: item.description,
      image: item.image,
      ctaLink: item.ctaLink,
      status: item.status,
    });
  };

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setLoading(true);
      if (loading) return;
      const fd = new FormData();
      fd.append("payload", JSON.stringify(data));
      const res = await createHub(fd);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Program zhub berhasil ditambahkan");
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  });

  return (
    <FormHubContext.Provider
      value={{ form, onSubmit, open, setOpen, onClose, onOpenEdit, loading }}
    >
      {children}
    </FormHubContext.Provider>
  );
};

const useFormHub = () => {
  const context = useContext(FormHubContext);
  if (!context) {
    throw new Error("useFormHub must be used within a FormHubProvider");
  }
  return context;
};

export { FormHubProvider, useFormHub };
