import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyToken, getCookieName } from "@/lib/auth";
import { DashboardClient } from "./client";

function unauthorized() {
  redirect("/admin");
}

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  if (!verifyToken(cookieStore.get(getCookieName())?.value)) {
    unauthorized();
  }

  const [content, doctors, contactList] = await Promise.all([
    prisma.siteContent.findMany(),
    prisma.doctor.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.contactInfo.findMany(),
  ]);

  const contacts: Record<string, string> = {};
  contactList.forEach((c) => {
    contacts[c.key] = c.value;
  });

  return (
    <DashboardClient
      content={JSON.parse(JSON.stringify(content))}
      doctors={JSON.parse(JSON.stringify(doctors))}
      contacts={contacts}
    />
  );
}