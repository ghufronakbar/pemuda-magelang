"use client";

import { useState } from "react";
import { uploadImage } from "@/actions/image";
import { cn } from "@/lib/utils";
import { Loader2, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";

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
        } else {
          throw new Error(res.error);
        }
      }
    } catch (error) {
      toast.error("Gagal mengunggah gambar");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-3")}>
      <div
        className={cn(
          "relative w-full aspect-video border-2 border-dashed rounded-xl overflow-hidden transition-all duration-200 hover:border-primary/50 hover:bg-muted/30",
          className,
          errorMessage ? "border-destructive" : "border-muted-foreground/25",
          !image && "cursor-pointer"
        )}
        onClick={() => !image && document.getElementById(id)?.click()}
      >
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Mengunggah...</span>
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
            <Image
              src={image}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-200 group">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white text-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById(id)?.click();
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Ganti Gambar
                </Button>
              </div>
            </div>
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
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById(id)?.click();
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Pilih File
            </Button>
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  );
};
