import { cn } from "@/lib/utils";
import { ArticleStatusEnum } from "@prisma/client";
import { Check, Cross, Pencil } from "lucide-react";

const getLabel = (status: ArticleStatusEnum) => {
  switch (status) {
    case ArticleStatusEnum.draft:
      return "Draft";
    case ArticleStatusEnum.published:
      return "Diterbitkan";
    case ArticleStatusEnum.banned:
      return "Dilarang";
    default:
      return "Draft";
  }
};

const getColor = (status: ArticleStatusEnum) => {
  switch (status) {
    case ArticleStatusEnum.draft:
      return "bg-gray-500";
    case ArticleStatusEnum.published:
      return "bg-green-500";
    case ArticleStatusEnum.banned:
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getIcon = (status: ArticleStatusEnum, className?: string) => {
  const globalClassName = "h-5 w-5 text-primary";
  switch (status) {
    case ArticleStatusEnum.draft:
      return <Pencil className={cn(globalClassName, className)} />;
    case ArticleStatusEnum.banned:
      return <Cross className={cn(globalClassName, className)} />;
    case ArticleStatusEnum.published:
      return <Check className={cn(globalClassName, className)} />;
    default:
      return <Pencil className={cn(globalClassName, className)} />;
  }
};

export const articleStatusEnum = {
  getLabel,
  getColor,
  getIcon,
};
