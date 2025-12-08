"use client";

import { Button } from "@/components/ui/button";
import { RefreshCcwIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">500</h1>
        <p className="text-lg">Terjadi Kesalahan</p>
        <p className="text-sm text-muted-foreground">
          Sayang sekali, sepertinya terjadi kesalahan tidak terduga :(
        </p>
      </div>
      <Button
        className="mt-8"
        onClick={() => {
          window?.location?.reload();
        }}
      >
        <RefreshCcwIcon />
        Muat Ulang
      </Button>
    </div>
  );
}
