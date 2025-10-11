// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { writeFile, mkdir, stat } from "fs/promises";
import path from "path";
import mime from "mime";
import { UPLOAD_ROOT } from "@/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 10 * 1024 * 1024; // 10MB
const UPLOAD_ROOT_DIR = UPLOAD_ROOT
  ? path.resolve(process.cwd(), UPLOAD_ROOT)
  : path.resolve(process.cwd(), "public", "upload"); // fallback dev-friendly

function yyyymm() {
  const d = new Date();
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function POST(req: NextRequest) {
  try {
    // TODO: auth check (NextAuth) untuk batasi siapa yang boleh upload

    const form = await req.formData();
    const file = form.get("image") as File | null;
    if (!file)
      return NextResponse.json({ error: "image required" }, { status: 400 });
    if (file.size > MAX_BYTES)
      return NextResponse.json({ error: "image too large" }, { status: 413 });

    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/heic",
      "image/heif",
    ];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "unsupported image mime type" },
        { status: 400 }
      );
    }

    // Pastikan root ada (dev bisa belum dibuat)
    try {
      await stat(UPLOAD_ROOT_DIR);
    } catch {
      await mkdir(UPLOAD_ROOT_DIR, { recursive: true, mode: 0o755 });
    }

    const ext = mime.getExtension(file.type) || "bin";
    const folder = yyyymm();
    const key = `${folder}/${randomUUID()}.${ext}`; // SIMPAN INI di DB
    const absDir = path.join(UPLOAD_ROOT_DIR, folder);
    const absPath = path.join(UPLOAD_ROOT_DIR, key);

    await mkdir(absDir, { recursive: true, mode: 0o755 });

    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(absPath, buf, { mode: 0o644 });

    // URL publik uniform (dev & prod): /upload/<key>
    return NextResponse.json({ key, url: `/upload/${key}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
