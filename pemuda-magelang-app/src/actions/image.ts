"use server";

import { S3_BUCKET_NAME } from "@/constants/s3";
import { s3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// Batas ukuran file (misal 10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif",];

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("image") as File;

    if (!file) {
      return { success: false, error: "Tidak ada file yang diunggah." };
    }

    // 1. Validasi Ukuran
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "Ukuran file terlalu besar. Maksimal 5MB." };
    }

    // 2. Validasi Tipe File
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { success: false, error: "Format file tidak didukung. Gunakan JPG, PNG, atau WEBP." };
    }

    // 3. Generate Nama File Unik
    // Kita ambil ekstensi aslinya, tapi namanya kita ganti UUID agar aman
    const YYYY = new Date().getFullYear()
    const MM = new Date().getMonth() + 1
    const fileExtension = file.name.split(".").pop();
    const fileName = `${YYYY}/${MM}/${uuidv4()}.${fileExtension}`;

    // Konversi file ke Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 4. Upload ke MinIO
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileName,      // Nama file di bucket
      Body: buffer,       // Isi file
      ContentType: file.type,
    });

    await s3Client.send(command);

    // 5. Sukses! Kembalikan nama file saja (untuk disimpan di DB)
    return {
      success: true,
      result: fileName,
      message: "Berhasil diunggah!"
    };

  } catch (error) {
    console.error("Gagal upload ke MinIO:", error);
    return { success: false, error: "Terjadi kesalahan sistem saat mengunggah gambar." };
  }
}