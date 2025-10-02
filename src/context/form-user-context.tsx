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
import {
  Award,
  Education,
  WorkExperience,
  Talent,
  TalentStatusEnum,
  User,
  SocialMedia,
} from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface DetailTalent extends Talent {
  socialMedias: SocialMedia[];
  workExperiences: WorkExperience[];
  educations: Education[];
  awards: Award[];
}

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(UserTalentSchema as any),
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
          talent: DetailTalent | null;
        };
        formProfile.reset({
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          subdistrict: user.subdistrict ?? "",
          village: user.village ?? "",
          street: user.street ?? "",
        });
        if (user.talent && user.role === "user") {
          formTalent.reset({
            profession: user.talent.profession,
            industry: user.talent.industry,
            bannerPicture: user.talent.bannerPicture,
            description: user.talent.description,
            socialMedias: user.talent.socialMedias.map((socialMedia) => ({
              platform: socialMedia.platform,
              url: socialMedia.url,
            })),
            skills: user.talent.skills,
            awards: user.talent.awards.map((award) => ({
              image: award.image,
              name: award.name,
              description: award.description,
              date: award.date,
            })),
            educations: user.talent.educations.map((education) => ({
              degree: education.degree,
              schoolName: education.schoolName,
              description: education.description,
              startDate: education.startDate,
              endDate: education.endDate,
            })),
            workExperiences: user.talent.workExperiences.map(
              (workExperience) => ({
                companyName: workExperience.companyName,
                position: workExperience.position,
                description: workExperience.description,
                startDate: workExperience.startDate,
                endDate: workExperience.endDate,
              })
            ),
          });
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
