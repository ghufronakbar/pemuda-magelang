"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCcwIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

export const RefreshButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button variant="outline" type="submit">
      <RefreshCcwIcon className={cn(pending && "animate-spin")} />
    </Button>
  );
};
