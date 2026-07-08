import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, getCookieName } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getCookieName())?.value;

  if (!verifyToken(token)) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-clinob-bg">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a
            href="/admin/dashboard"
            className="text-lg font-bold text-clinob-primary"
          >
            CLINOB — Admin
          </a>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              className="text-sm text-clinob-accent-dark hover:underline"
            >
              Ver página
            </a>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="POST">
      <button
        type="submit"
        className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
      >
        Cerrar sesión
      </button>
    </form>
  );
}