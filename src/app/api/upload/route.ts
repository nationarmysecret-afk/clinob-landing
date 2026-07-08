import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { verifyToken, getCookieName } from "@/lib/auth";
import { cookies } from "next/headers";
import { Jimp } from "jimp";

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

    // Optimizar imagen con Jimp (pure JS, sin dependencias nativas)
    const image = await Jimp.read(buffer);
    image.cover({ w: 400, h: 400 });

    // Crear directorio para doctores si no existe
    const doctorsDir = join(process.cwd(), "public", "uploads", "doctors");
    await mkdir(doctorsDir, { recursive: true });

    // Generar nombre único
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).slice(2, 8);
    const filename = `${timestamp}-${randomStr}.jpg`;
    const filepath = join(doctorsDir, filename);

    // Guardar como JPEG con calidad 80
    const optimizedBuffer = await image.getBuffer("image/jpeg", { quality: 80 });
    await writeFile(filepath, optimizedBuffer);

    return NextResponse.json({ url: `/uploads/doctors/${filename}` });
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    return NextResponse.json({ error: "Error al procesar la imagen" }, { status: 500 });
  }
}
