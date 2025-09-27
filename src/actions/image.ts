"use server";

import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import cloudinary from "@/config/cloudinary";

type UploadResponse =
  | { success: true; result?: UploadApiResponse }
  | { success: false; error: UploadApiErrorResponse };

const uploadToCloudinary = (
  fileUri: string,
  fileName: string
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(fileUri, {
        invalidate: true,
        resource_type: "auto",
        filename_override: fileName,
        folder: "sanzet",
        use_filename: true,
      })
      .then((result) => {
        resolve({ success: true, result });
      })
      .catch((error) => {
        reject({ success: false, error });
      });
  });
};

export async function uploadImage(formData: FormData) {
  try {
    const image = formData.get("image") as File;

    if (!image) {
      return { success: false, error: "Gambar tidak ditemukan" };
    }

    const fileBuffer = await image.arrayBuffer();

    const mimeType = image.type;
    const encoding = "base64";
    const base64Data = Buffer.from(fileBuffer).toString("base64");

    const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

    const res = await uploadToCloudinary(fileUri, image.name);
    if (res.success && res.result) {
      return { success: true, result: res.result.secure_url };
    }

    return { success: false, error: "Gagal upload gambar" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Gagal upload gambar" };
  }
}
