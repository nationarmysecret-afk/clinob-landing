import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir, unlink } from "fs/promises";
import { join, basename } from "path";
import { verifyToken, getCookieName } from "@/lib/auth";
import { cookies } from "next/headers";
import { Jimp } from "jimp";

function unauthorized() {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  if (!verifyToken(cookieStore.get(getCookieName())?.value)) return unauthorized();

  try {
    const body = await request.json();
    const { tempUrl, x, y, width, height } = body;

    if (!tempUrl || typeof x !== "number" || typeof y !== "number" || typeof width !== "number" || typeof height !== "number") {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    // Extraer el nombre del archivo de la URL temporal
    const filename = basename(tempUrl);
    const tempPath = join(process.cwd(), "public", "uploads", "temp", filename);
    
    // Verificar que el archivo temporal existe
    try {
      await readFile(tempPath);
    } catch {
      return NextResponse.json({ error: "Imagen temporal no encontrada" }, { status: 404 });
    }

    // Leer la imagen temporal con Jimp
    const image = await Jimp.read(tempPath);
    
    // Recortar la imagen según las coordenadas proporcionadas
    image.crop(x, y, width, height);
    
    // Redimensionar a 400x400 manteniendo la proporción (cover)
    image.cover({ w: 400, h: 400 });
    
    // Crear directorio para doctores si no existe
    const doctorsDir = join(process.cwd(), "public", "uploads", "doctors");
    await mkdir(doctorsDir, { recursive: true });
    
    // Generar nombre único para la imagen final
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).slice(2, 8);
    const finalFilename = `${timestamp}-${randomStr}.jpg`;
    const finalPath = join(doctorsDir, finalFilename);
    
    // Guardar como JPEG con calidad 80
    const buffer = await image.getBuffer("image/jpeg", { quality: 80 });
    await writeFile(finalPath, buffer);
    
    // Eliminar la imagen temporal
    try {
      await unlink(tempPath);
    } catch (error) {
      console.warn("No se pudo eliminar la imagen temporal:", error);
    }
    
    return NextResponse.json({ url: `/uploads/doctors/${finalFilename}` });
    
  } catch (error) {
    console.error("Error al procesar el recorte:", error);
    return NextResponse.json({ error: "Error al procesar el recorte" }, { status: 500 });
  }
}