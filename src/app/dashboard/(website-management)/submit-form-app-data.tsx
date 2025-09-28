"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormAppData } from "@/context/form-app-data-context";

export const SubmitFormAppData = () => {
  const { form } = useFormAppData();
  return (
    <div className="mt-2 flex items-center gap-2">
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Simpan
      </Button>
      <Button type="button" variant="outline" onClick={() => form.reset()}>
        Reset
      </Button>
    </div>
  );
};
