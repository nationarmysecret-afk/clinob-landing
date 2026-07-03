import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, getCookieName, getToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = formData.get("password") as string;

  if (!password || !verifyPassword(password)) {
    const host = request.headers.get("host") || "localhost:4000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    return NextResponse.redirect(
      `${protocol}://${host}/admin?error=1`,
      302
    );
  }

  const host = request.headers.get("host") || "localhost:4000";
  const protocol = request.headers.get("x-forwarded-proto") || "http";

  const response = NextResponse.redirect(
    `${protocol}://${host}/admin/dashboard`,
    302 // 302 = POST → GET, avoids POST to a GET route
  );

  response.cookies.set(getCookieName(), getToken(), {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}