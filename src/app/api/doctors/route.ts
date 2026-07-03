import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getCookieName } from "@/lib/auth";
import { cookies } from "next/headers";

function unauthorized() {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}

export async function GET() {
  const doctors = await prisma.doctor.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(doctors);
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  if (!verifyToken(cookieStore.get(getCookieName())?.value)) return unauthorized();

  const body = await request.json();
  const doctor = await prisma.doctor.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      specialty: body.specialty,
      bio: body.bio,
      linkUrl: body.linkUrl || "https://google.com",
      sortOrder: body.sortOrder || 0,
    },
  });
  return NextResponse.json(doctor);
}