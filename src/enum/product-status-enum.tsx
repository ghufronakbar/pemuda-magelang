import { cn } from "@/lib/utils";
import { ProductStatusEnum } from "@prisma/client";
import { Check, Cross, Pencil } from "lucide-react";

const getLabel = (status: ProductStatusEnum) => {
  switch (status) {
    case ProductStatusEnum.draft:
      return "Draft";
    case ProductStatusEnum.published:
      return "Diterbitkan";
    case ProductStatusEnum.banned:
      return "Dilarang";
    default:
      return "Draft";
  }
};

const getColor = (status: ProductStatusEnum) => {
  switch (status) {
    case ProductStatusEnum.draft:
      return "bg-gray-500";
    case ProductStatusEnum.published:
      return "bg-green-500";
    case ProductStatusEnum.banned:
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getIcon = (status: ProductStatusEnum, className?: string) => {
  const globalClassName = "h-5 w-5 text-primary";
  switch (status) {
    case ProductStatusEnum.draft:
      return <Pencil className={cn(globalClassName, className)} />;
    case ProductStatusEnum.banned:
      return <Cross className={cn(globalClassName, className)} />;
    case ProductStatusEnum.published:
      return <Check className={cn(globalClassName, className)} />;
    default:
      return <Pencil className={cn(globalClassName, className)} />;
  }
};

export const productStatusEnum = {
  getLabel,
  getColor,
  getIcon,
};
