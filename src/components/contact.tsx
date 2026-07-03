"use client";

import { useEffect, useState } from "react";

interface ContactMap {
  address: string;
  phone: string;
  email: string;
}

export function Contact() {
  const [contacts, setContacts] = useState<ContactMap>({
    address: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then(setContacts);
  }, []);

  return (
    <section className="bg-white py-20 md:py-28" id="contact">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center text-3xl font-bold text-clinob-text md:text-4xl">
          <span className="text-clinob-green">Contacto</span>
        </h2>
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-clinob-green to-clinob-blue" />

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-clinob-green-light">
                <svg className="h-6 w-6 text-clinob-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-clinob-text">Ubicación</h3>
                <p className="mt-1 text-clinob-text-light">
                  {contacts.address ||
                    "Av. Independencia 123, Santo Domingo, República Dominicana"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-clinob-blue-light">
                <svg className="h-6 w-6 text-clinob-blue-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-clinob-text">Teléfono</h3>
                <p className="mt-1 text-clinob-text-light">
                  {contacts.phone || "(809) 555-0123"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-clinob-green-light">
                <svg className="h-6 w-6 text-clinob-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-clinob-text">Correo</h3>
                <p className="mt-1 text-clinob-text-light">
                  {contacts.email || "contacto@clinob.com"}
                </p>
              </div>
            </div>
          </div>

          <form className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-clinob-text">
                Nombre completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-clinob-text placeholder:text-gray-400 focus:border-clinob-green focus:outline-none focus:ring-2 focus:ring-clinob-green/20"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-clinob-text">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-clinob-text placeholder:text-gray-400 focus:border-clinob-green focus:outline-none focus:ring-2 focus:ring-clinob-green/20"
                placeholder="tu@correo.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-clinob-text">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="mt-1 block w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-clinob-text placeholder:text-gray-400 focus:border-clinob-green focus:outline-none focus:ring-2 focus:ring-clinob-green/20"
                placeholder="¿Cómo podemos ayudarte?"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-clinob-green px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-clinob-green-dark hover:shadow-md"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}