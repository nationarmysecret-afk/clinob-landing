import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { verifyToken, getCookieName } from "@/lib/auth";
import { cookies } from "next/headers";
import sharp from "sharp";

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

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Optimizar imagen con sharp
  try {
    const optimizedImage = await sharp(buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toBuffer();

    // Crear directorio para doctores si no existe
    const doctorsDir = join(process.cwd(), "public", "uploads", "doctors");
    await mkdir(doctorsDir, { recursive: true });

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).slice(2, 8);
    const filename = `${timestamp}-${randomStr}.webp`;
    const filepath = join(doctorsDir, filename);
    
    // Guardar archivo optimizado
    await writeFile(filepath, optimizedImage);

    return NextResponse.json({ url: `/uploads/doctors/${filename}` });
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    return NextResponse.json({ error: "Error al procesar la imagen" }, { status: 500 });
  }
}