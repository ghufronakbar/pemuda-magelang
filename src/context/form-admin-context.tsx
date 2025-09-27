"use client";

import { createAdmin } from "@/actions/user";
import {
  UserCreateAdminInput,
  UserCreateAdminSchema,
  initialUserCreateAdminInput,
} from "@/validator/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useContext, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface FormAdminContext {
  form: UseFormReturn<UserCreateAdminInput>;
  loading: boolean;
  onSubmit: () => Promise<void>;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const FormAdminContext = createContext<FormAdminContext | null>(null);

const FormAdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const form = useForm<UserCreateAdminInput>({
    resolver: zodResolver(UserCreateAdminSchema),
    defaultValues: initialUserCreateAdminInput,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setLoading(true);
      if (loading) return;
      const fd = new FormData();
      fd.append("name", data.name);
      fd.append("email", data.email);
      const res = await createAdmin(fd);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(
          "Admin berhasil ditambahkan dengan password default admin123"
        );
        form.reset();
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  });

  return (
    <FormAdminContext.Provider
      value={{ form, loading, onSubmit, open, setOpen }}
    >
      {children}
    </FormAdminContext.Provider>
  );
};

const useFormAdmin = () => {
  const context = useContext(FormAdminContext);
  if (!context) {
    throw new Error("useFormAdmin must be used within a FormAdminProvider");
  }
  return context;
};

export { FormAdminProvider, useFormAdmin };
