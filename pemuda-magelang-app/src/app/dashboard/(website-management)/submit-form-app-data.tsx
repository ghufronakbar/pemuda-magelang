"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormAppData } from "@/context/form-app-data-context";

export const SubmitFormAppData = () => {
  const { form } = useFormAppData();
  return (
    <div className="hidden" />
  );
};
