"use client";

import {
  UserPasswordInput,
  UserPasswordSchema,
  UserProfileInput,
  UserProfileSchema,
  UserTalentInput,
  UserTalentSchema,
  initialUserPasswordInput,
  initialUserProfileInput,
  initialUserTalentInput,
} from "@/validator/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Talent, TalentStatusEnum, User } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface FormUserContext {
  formProfile: UseFormReturn<UserProfileInput>;
  formTalent: UseFormReturn<UserTalentInput>;
  formPassword: UseFormReturn<UserPasswordInput>;
  loading: boolean;
  talentStatus: TalentStatusEnum | null;
  openTalentDialog: boolean;
  setOpenTalentDialog: (open: boolean) => void;
}

const FormUserContext = createContext<FormUserContext | null>(null);

const FormUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [talentStatus, setTalentStatus] = useState<TalentStatusEnum | null>(
    null
  );
  const [openTalentDialog, setOpenTalentDialog] = useState(false);
  const formProfile = useForm<UserProfileInput>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: initialUserProfileInput,
  });
  const formTalent = useForm<UserTalentInput>({
    resolver: zodResolver(UserTalentSchema),
    defaultValues: initialUserTalentInput,
  });
  const formPassword = useForm<UserPasswordInput>({
    resolver: zodResolver(UserPasswordSchema),
    defaultValues: initialUserPasswordInput,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/profile");
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        const user = (await res.json()).data as User & {
          talent: Talent | null;
        };
        formProfile.reset(user);
        if (user.talent && user.role === "user") {
          formTalent.reset(user.talent);
          setTalentStatus(user.talent.status);
        }
      } catch (error) {
        console.error(error);
        toast.error("Gagal mengambil data user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <FormUserContext.Provider
      value={{
        formProfile,
        formTalent,
        formPassword,
        loading,
        talentStatus,
        openTalentDialog,
        setOpenTalentDialog,
      }}
    >
      {children}
    </FormUserContext.Provider>
  );
};

const useFormUser = () => {
  const context = useContext(FormUserContext);
  if (!context) {
    throw new Error("useFormUser must be used within a FormUserProvider");
  }
  return context;
};

export { FormUserProvider, useFormUser };
