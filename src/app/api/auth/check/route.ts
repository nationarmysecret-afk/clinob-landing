import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, getCookieName } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getCookieName())?.value;

  if (!verifyToken(token)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}