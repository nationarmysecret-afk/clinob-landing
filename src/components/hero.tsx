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
    <section className="relative overflow-hidden bg-gradient-to-br from-clinob-primary/[0.02] via-white to-clinob-accent/[0.02]">
      {/* Mesh gradient blobs */}
      <div className="absolute top-0 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-clinob-primary/10 to-clinob-accent/5 blur-[120px]" />
      <div className="absolute bottom-0 -right-40 h-[400px] w-[400px] rounded-full bg-gradient-to-tl from-clinob-accent/10 to-clinob-primary/5 blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-gradient-to-r from-clinob-primary/[0.03] to-clinob-accent/[0.03] blur-[100px]" />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-clinob-accent/30 to-transparent" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center md:py-32">
        <div className={`transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"}`}>
          <Image
            src="/logo-clinob.png"
            alt="CLINOB"
            width={300}
            height={300}
            className="h-auto w-64 md:w-72 drop-shadow-2xl"
            priority
          />
        </div>
        <p className={`mt-6 text-xl font-medium text-clinob-accent-dark md:text-2xl tracking-wide transition-all duration-1000 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          {data?.subtitle || "Clínica de Nutrición y Obesidad"}
        </p>
        <p className={`mt-4 max-w-2xl text-lg leading-relaxed text-clinob-text-light md:text-xl transition-all duration-1000 delay-400 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          {data?.description || "Salud Integral y Bienestar en cada paso"}
        </p>
        <div className={`mt-12 flex gap-6 transition-all duration-1000 delay-600 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <a
            href="#doctors"
            className="group relative rounded-full bg-gradient-to-r from-clinob-primary to-clinob-primary-dark px-10 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-clinob-primary/40 hover:scale-110 active:scale-95"
          >
            <span className="relative z-10">Conoce a nuestros especialistas</span>
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </a>
          <a
            href="#about"
            className="group relative rounded-full border-2 border-clinob-accent/50 px-10 py-4 text-sm font-semibold text-clinob-accent-dark transition-all duration-500 hover:bg-gradient-to-r hover:from-clinob-accent hover:to-clinob-accent-dark hover:text-white hover:shadow-2xl hover:shadow-clinob-accent/30 hover:scale-110 active:scale-95"
          >
            <span className="relative z-10">Más sobre nosotros</span>
          </a>
        </div>
      </div>
    </section>
  );
}
