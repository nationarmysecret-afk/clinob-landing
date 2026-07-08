"use client";

import { useEffect, useState } from "react";

interface HeroData {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
}

export function Hero() {
  const [data, setData] = useState<HeroData | null>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((all) => {
        const hero = all.find((c: HeroData) => c.section === "hero");
        if (hero) setData(hero);
      });
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-clinob-primary-light via-white to-clinob-accent-light">
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-clinob-primary/5 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-clinob-accent/5 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center md:py-32">
        <h1 className="text-5xl font-bold tracking-tight text-clinob-text md:text-7xl">
          <span className="text-clinob-primary">{data?.title || "CLINOB"}</span>
        </h1>
        <p className="mt-2 text-xl font-medium text-clinob-accent-dark md:text-2xl">
          {data?.subtitle || "Clínica de Nutrición y Obesidad"}
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-clinob-text-light md:text-xl">
          {data?.description || "Salud Integral y Bienestar en cada paso"}
        </p>
        <div className="mt-10 flex gap-4">
          <a
            href="#doctors"
            className="rounded-full bg-clinob-primary px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-clinob-primary-dark hover:shadow-lg"
          >
            Conoce a nuestros especialistas
          </a>
          <a
            href="#about"
            className="rounded-full border-2 border-clinob-accent px-8 py-3.5 text-sm font-semibold text-clinob-accent-dark transition-all hover:bg-clinob-accent hover:text-white"
          >
            Más sobre nosotros
          </a>
        </div>
      </div>
    </section>
  );
}