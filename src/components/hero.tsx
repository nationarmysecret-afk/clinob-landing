"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface HeroData {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
}

export function Hero() {
  const [data, setData] = useState<HeroData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((all) => {
        const hero = all.find((c: HeroData) => c.section === "hero");
        if (hero) setData(hero);
      });
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-clinob-primary-light via-white to-clinob-accent-light">
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-clinob-primary/5 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-clinob-accent/5 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center md:py-32">
        <div className={`transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <Image
            src="/logo-clinob.jpg"
            alt="CLINOB"
            width={300}
            height={300}
            className="h-auto w-64 md:w-72"
            priority
          />
        </div>
        <p className={`mt-6 text-xl font-medium text-clinob-accent-dark md:text-2xl transition-all duration-700 delay-150 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {data?.subtitle || "Clínica de Nutrición y Obesidad"}
        </p>
        <p className={`mt-4 max-w-2xl text-lg leading-relaxed text-clinob-text-light md:text-xl transition-all duration-700 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {data?.description || "Salud Integral y Bienestar en cada paso"}
        </p>
        <div className={`mt-10 flex gap-4 transition-all duration-700 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <a
            href="#doctors"
            className="rounded-full bg-clinob-primary px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-clinob-primary-dark hover:shadow-xl hover:shadow-clinob-primary/30 hover:scale-105 active:scale-95"
          >
            Conoce a nuestros especialistas
          </a>
          <a
            href="#about"
            className="rounded-full border-2 border-clinob-accent px-8 py-3.5 text-sm font-semibold text-clinob-accent-dark transition-all duration-300 hover:bg-clinob-accent hover:text-white hover:shadow-lg hover:shadow-clinob-accent/20 hover:scale-105 active:scale-95"
          >
            Más sobre nosotros
          </a>
        </div>
      </div>
    </section>
  );
}
