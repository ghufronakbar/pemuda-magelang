import { cn } from "@/lib/utils";
import { HubStatusEnum } from "@prisma/client";
import { CheckCircle2, Clock, PowerOff } from "lucide-react";

const getLabel = (status: HubStatusEnum) => {
  switch (status) {
    case HubStatusEnum.active:
      return "Sedang Berlangsung";
    case HubStatusEnum.inactive:
      return "Telah Berakhir";
    case HubStatusEnum.soon:
      return "Segera Hadir";
    default:
      return "";
  }
};

const getIcon = (status: HubStatusEnum, className?: string) => {
  const globalClassName = "h-5 w-5 text-primary";
  switch (status) {
    case HubStatusEnum.active:
      return <CheckCircle2 className={cn(globalClassName, className)} />;
    case HubStatusEnum.inactive:
      return <PowerOff className={cn(globalClassName, className)} />;
    case HubStatusEnum.soon:
      return <Clock className={cn(globalClassName, className)} />;
    default:
      return <PowerOff className={cn(globalClassName, className)} />;
  }
};

const getBadgeClass = (status: HubStatusEnum) => {
  switch (status) {
    case HubStatusEnum.active:
      return "bg-emerald-500";
    case HubStatusEnum.inactive:
      return "bg-neutral-500";
    case HubStatusEnum.soon:
      return "bg-amber-500";
    default:
      return "bg-neutral-500";
  }
};

export const hubStatusEnum = {
  getLabel,
  getIcon,
  getBadgeClass,
};
