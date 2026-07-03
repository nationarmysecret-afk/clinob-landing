import { NextRequest, NextResponse } from "next/server";
import { getCookieName } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const host = request.headers.get("host") || "localhost:4000";
  const protocol = request.headers.get("x-forwarded-proto") || "http";

  const response = NextResponse.redirect(`${protocol}://${host}/admin`);
  response.cookies.delete(getCookieName());
  return response;
}