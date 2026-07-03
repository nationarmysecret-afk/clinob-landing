import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getCookieName } from "@/lib/auth";
import { cookies } from "next/headers";

function unauthorized() {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}

export async function GET() {
  const contacts = await prisma.contactInfo.findMany();
  const map: Record<string, string> = {};
  contacts.forEach((c) => {
    map[c.key] = c.value;
  });
  return NextResponse.json(map);
}

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies();
  if (!verifyToken(cookieStore.get(getCookieName())?.value))
    return unauthorized();

  const body = await request.json();
  const { key, value } = body;
  const contact = await prisma.contactInfo.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  return NextResponse.json(contact);
}