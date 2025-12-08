"use client";

import { useState } from "react";
import { uploadImage } from "@/actions/image";
import { cn } from "@/lib/utils";
import { Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { CdnImage } from "./cdn-image";

interface ImageUploaderProps {
  image: string | null;
  setImage: (image: string | null) => void;
  className?: string;
  /** Overrides default size/aspect classes for the container (e.g. "aspect-square h-28") */
  containerClassName?: string;
  errorMessage?: string;
  id?: string;
}

export const ImageUploader = ({
  image,
  setImage,
  className,
  containerClassName,
  errorMessage,
  id = "image-input",
}: ImageUploaderProps) => {
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const uploadFile = async (file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);
      const res = await uploadImage(formData);
      if (res.success && res.result) {
        setImage(res.result);
      } else {
        throw new Error(res.error);
      }
    } catch (error) {
      toast.error("Gagal mengunggah gambar");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files?.[0]) {
        if (loading) return;
        await uploadFile(e.target.files[0]);
      }
    } catch (error) {
      toast.error("Gagal mengunggah gambar");
      console.error(error);
    } finally {
      // handled in uploadFile
    }
  };

  return (
    <div className={cn("flex flex-col gap-3")}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl overflow-hidden transition-all duration-200 hover:border-primary/50 hover:bg-muted/30",
          containerClassName ?? "w-full aspect-video",
          className,
          errorMessage ? "border-destructive" : "border-muted-foreground/25",
          !image && "cursor-pointer",
          dragOver && "border-primary bg-primary/5"
        )}
        onClick={() => document.getElementById(id)?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={async (e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) {
            if (loading) return;
            await uploadFile(file);
          }
        }}
      >
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Mengunggah...
              </span>
            </div>
          </div>
        )}

        <input
          type="file"
          onChange={onChangeImage}
          className="hidden"
          id={id}
          accept="image/*"
        />

        {image ? (
          <>
            <CdnImage
              uniqueKey={image}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground mb-1">
                Unggah Gambar
              </p>
              <p className="text-xs text-muted-foreground">
                Klik untuk memilih file atau drag & drop
              </p>
            </div>
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  );
};
