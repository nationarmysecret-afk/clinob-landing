import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { verifyToken, getCookieName } from "@/lib/auth";
import { cookies } from "next/headers";

function unauthorized() {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  if (!verifyToken(cookieStore.get(getCookieName())?.value)) return unauthorized();

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No se envió ningún archivo" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const originalName = file.name;
  const ext = originalName.split(".").pop()?.toLowerCase() || "jpg";
  const allowedExtensions = new Set(["jpg", "jpeg", "png", "webp", "gif", "svg"]);
  if (!allowedExtensions.has(ext)) {
    return NextResponse.json({ error: "Formato de imagen no permitido" }, { status: 400 });
  }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filepath = `${uploadsDir}/${filename}`;
  await writeFile(filepath, buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}