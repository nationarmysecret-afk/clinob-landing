import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
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

  // Validar tipo de archivo
  const allowedMimeTypes = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]);
  if (!allowedMimeTypes.has(file.type)) {
    return NextResponse.json({ error: "Formato de imagen no permitido" }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear directorio temporal si no existe
    const tempDir = join(process.cwd(), "public", "uploads", "temp");
    await mkdir(tempDir, { recursive: true });

    // Generar nombre único
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).slice(2, 8);
    const extension = file.type === "image/jpeg" ? "jpg" : 
                     file.type === "image/png" ? "png" : 
                     file.type === "image/webp" ? "webp" : 
                     file.type === "image/gif" ? "gif" : "jpg";
    const filename = `${timestamp}-${randomStr}.${extension}`;
    const filepath = join(tempDir, filename);

    // Guardar la imagen original sin modificar
    await writeFile(filepath, buffer);

    return NextResponse.json({ url: `/uploads/temp/${filename}` });
  } catch (error) {
    console.error("Error al guardar la imagen:", error);
    return NextResponse.json({ error: "Error al guardar la imagen" }, { status: 500 });
  }
}
