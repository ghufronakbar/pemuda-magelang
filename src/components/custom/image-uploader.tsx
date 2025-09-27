"use client";

import { useState } from "react";
import { uploadImage } from "@/actions/image";
import { cn } from "@/lib/utils";
import { Loader2, ImageOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageUploaderProps {
  image: string | null;
  setImage: (image: string | null) => void;
  className?: string;
  errorMessage?: string;
  id?: string;
}

export const ImageUploader = ({
  image,
  setImage,
  className,
  errorMessage,
  id = "image-input",
}: ImageUploaderProps) => {
  const [loading, setLoading] = useState(false);
  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files?.[0]) {
        setLoading(true);
        if (loading) return;
        const formData = new FormData();
        formData.append("image", e.target.files?.[0]);
        const res = await uploadImage(formData);
        if (res.success && res.result) {
          setImage(res.result);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={cn("flex flex-col gap-4")}>
      <div
        className={cn(
          "relative w-full p-2 border border-gray-200 rounded-md flex flex-col gap-4 !aspect-video items-center justify-center overflow-hidden",
          className,
          errorMessage && "border-destructive"
        )}
      >
        {loading && (
          <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-black/50 rounded-md w-full h-full">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        )}
        <input
          type="file"
          onChange={onChangeImage}
          className="hidden"
          id={id}
        />
        {image ? (
          <Image
            src={image}
            alt="image"
            width={400}
            height={400}
            className="object-cover w-full h-full rounded-md "
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center gap-2 flex-col"
            onClick={() => document.getElementById(id)?.click()}
          >
            <ImageOffIcon className="w-8 h-8" />
            Belum ada gambar
          </div>
        )}
      </div>
      <div className="flex flex-row items-center justify-between">
        <p className={cn("text-destructive text-sm")}>{errorMessage}</p>

        <Button
          variant="outline"
          onClick={() => document.getElementById(id)?.click()}
          type="button"
          disabled={loading}
        >
          {loading ? "Mengunggah..." : "Unggah Gambar"}
        </Button>
      </div>
    </div>
  );
};
