"use client";

import { createUpdateCommunity } from "@/actions/community";
import {
  CommunityInput,
  CommunityInputSchema,
  initialCommunityInput,
} from "@/validator/community";
import { zodResolver } from "@hookform/resolvers/zod";
import { Community, CommunityStatusEnum, User } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface FormCommunityContext {
  form: UseFormReturn<CommunityInput>;
  loading: boolean;
  onSubmit: () => Promise<void>;
  communityStatus: CommunityStatusEnum | null;
  openCommunityDialog: boolean;
  setOpenCommunityDialog: (open: boolean) => void;
  fetching: boolean;
}

const FormCommunityContext = createContext<FormCommunityContext | null>(null);

interface FetchCommunityResponse {
  data:
    | (Community & {
        user: User;
      })
    | null;
}

const FormCommunityProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [communityStatus, setCommunityStatus] =
    useState<CommunityStatusEnum | null>(null);
  const [openCommunityDialog, setOpenCommunityDialog] = useState(false);
  const [fetching, setFetching] = useState(false);
  const form = useForm<CommunityInput>({
    resolver: zodResolver(CommunityInputSchema),
    defaultValues: initialCommunityInput,
  });

  useEffect(() => {
    fetchCommunity();
  }, []);

  const fetchCommunity = async () => {
    try {
      setFetching(true);
      const res = await fetch(`/api/community`);
      const data = (await res.json()) as FetchCommunityResponse;
      if (!res.ok) {
        setCommunityStatus(null);
        throw new Error("Gagal mengambil data komunitas");
      } else if (data.data) {
        setCommunityStatus(data.data.status);
        form.reset({
          name: data.data.name,
          description: data.data.description ?? "",
          profilePicture: data.data.profilePicture ?? "",
          bannerPicture: data.data.bannerPicture ?? "",
          ctaText: data.data.ctaText ?? "",
          ctaLink: data.data.ctaLink ?? "",
          category: data.data.category ?? "",
          id: data.data.id,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil data komunitas");
    } finally {
      setFetching(false);
    }
  };

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setLoading(true);
      if (loading) return;
      const fd = new FormData();
      fd.append("payload", JSON.stringify(data));
      const res = await createUpdateCommunity(fd);
      if (res.error) {
        toast.error(res.error);
      } else {
        if (res.result) {
          setCommunityStatus(res.result.status);
          form.reset({
            bannerPicture: res.result.bannerPicture ?? "",
            profilePicture: res.result.profilePicture ?? "",
            name: res.result.name,
            description: res.result.description ?? "",
            ctaText: res.result.ctaText,
            ctaLink: res.result.ctaLink,
            category: res.result.category,
          });
          setOpenCommunityDialog(false);
        }
        if (data.id) {
          toast.success("Berhasil mengedit data komunitas");
        } else {
          toast.success("Berhasil mendaftarkan komunitas");
        }
        form.reset(initialCommunityInput);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  });

  return (
    <FormCommunityContext.Provider
      value={{
        form,
        loading,
        onSubmit,
        communityStatus,
        openCommunityDialog,
        setOpenCommunityDialog,
        fetching,
      }}
    >
      {children}
    </FormCommunityContext.Provider>
  );
};

const useFormCommunity = () => {
  const context = useContext(FormCommunityContext);
  if (!context) {
    throw new Error(
      "useFormCommunity must be used within a FormCommunityProvider"
    );
  }
  return context;
};

export { FormCommunityProvider, useFormCommunity };
