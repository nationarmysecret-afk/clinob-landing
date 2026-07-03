"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const hasError = searchParams.get("error") === "1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-clinob-bg px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
        <h1 className="text-center text-2xl font-bold text-clinob-text">
          CLINOB
        </h1>
        <p className="mt-1 text-center text-sm text-clinob-text-light">
          Acceso al panel de administración
        </p>

        <form
          action="/api/auth/login"
          method="POST"
          className="mt-8 space-y-5"
        >
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-clinob-text"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-clinob-text focus:border-clinob-green focus:outline-none focus:ring-2 focus:ring-clinob-green/20"
              placeholder="Ingresa la contraseña"
              autoFocus
            />
          </div>

          {hasError && (
            <p className="text-sm font-medium text-red-500">
              Contraseña incorrecta
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-clinob-green px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-clinob-green-dark"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}