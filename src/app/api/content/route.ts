import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getCookieName } from "@/lib/auth";
import { cookies } from "next/headers";

function unauthorized() {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}

export async function GET() {
  const content = await prisma.siteContent.findMany();
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies();
  if (!verifyToken(cookieStore.get(getCookieName())?.value))
    return unauthorized();

  const { id, title, subtitle, description } = await request.json();
  const content = await prisma.siteContent.update({
    where: { id },
    data: { title, subtitle, description },
  });
  return NextResponse.json(content);
}