import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getCookieName } from "@/lib/auth";
import { cookies } from "next/headers";

function unauthorized() {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  if (!verifyToken(cookieStore.get(getCookieName())?.value)) return unauthorized();

  const { id } = await params;
  const body = await request.json();
  const doctor = await prisma.doctor.update({
    where: { id },
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      specialty: body.specialty,
      bio: body.bio,
      linkUrl: body.linkUrl,
      sortOrder: body.sortOrder,
      isActive: body.isActive,
      photoUrl: body.photoUrl, // Aceptar photoUrl del body
    },
  });
  return NextResponse.json(doctor);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  if (!verifyToken(cookieStore.get(getCookieName())?.value)) return unauthorized();

  const { id } = await params;
  await prisma.doctor.delete({ where: { id } });
  return NextResponse.json({ success: true });
}