"use client";
import { useSession } from "next-auth/react";
import { TalentSection } from "../../(components)/profile/talent-section";
import { Role } from "@prisma/client";

interface TalentCardProps {
  className?: string;
  title?: string;
  description?: string;
}
export const TalentCard = ({
  className,
  title,
  description,
}: TalentCardProps) => {
  const { data: session } = useSession();
  if (session?.user.role !== Role.user) return null;
  return (
    <TalentSection
      className={className}
      title={title ?? "Talenta"}
      description={description ?? "Status talenta kamu"}
    />
  );
};
