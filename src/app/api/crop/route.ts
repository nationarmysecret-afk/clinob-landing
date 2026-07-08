import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, getCookieName } from "@/lib/auth";
import { Jimp } from "jimp";
import path from "path";
import { writeFile, unlink, mkdir } from "fs/promises";

function unauthorized() {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  if (!verifyToken(cookieStore.get(getCookieName())?.value)) return unauthorized();

  const { tempUrl, x, y, width, height } = await request.json();

  if (!tempUrl || x === undefined || y === undefined || !width || !height) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  // Build path to temp file
  const tempPath = path.join(process.cwd(), "public", tempUrl);
  // Security: ensure it's within public/uploads/temp
  const normalizedTempPath = path.normalize(tempPath);
  const allowedBase = path.join(process.cwd(), "public", "uploads", "temp");
  if (!normalizedTempPath.startsWith(allowedBase)) {
    return NextResponse.json({ error: "Ruta no permitida" }, { status: 400 });
  }

  try {
    const image = await Jimp.read(normalizedTempPath);

    // Crop
    image.crop({ x, y, w: width, h: height });

    // Resize to 400x400
    image.resize({ w: 400, h: 400 });

    // Ensure doctors directory exists
    const doctorsDir = path.join(process.cwd(), "public", "uploads", "doctors");
    await mkdir(doctorsDir, { recursive: true });

    // Generate unique filename
    const ext = path.extname(tempUrl) || ".jpg";
    const uniqueName = `doctor-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const outputPath = path.join(doctorsDir, uniqueName);

    // Save as JPEG
    const buffer = await image.getBuffer("image/jpeg");
    await writeFile(outputPath, buffer);

    // Delete temp file
    await unlink(normalizedTempPath);

    const url = `/uploads/doctors/${uniqueName}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error processing crop:", error);
    return NextResponse.json({ error: "Error al procesar el recorte" }, { status: 500 });
  }
}
