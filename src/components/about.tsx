"use client";

import { useEffect, useState } from "react";

interface AboutData {
  id: string;
  section: string;
  title: string | null;
  description: string | null;
}

export function About() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((all) => {
        const about = all.find((c: AboutData) => c.section === "about");
        if (about) setData(about);
      });
    setTimeout(() => setLoaded(true), 300);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-clinob-accent-light/20 to-white py-20 md:py-28" id="about">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/3 h-px w-1/3 bg-gradient-to-r from-transparent via-clinob-accent/30 to-transparent" />
      <div className="absolute top-1/2 -left-24 h-48 w-48 rounded-full bg-clinob-primary/[0.03] blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-clinob-accent/[0.03] blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className={`text-4xl font-bold md:text-5xl tracking-tight transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <span className="bg-gradient-to-r from-clinob-primary via-clinob-accent to-clinob-primary bg-clip-text text-transparent animate-gradient" style={{ backgroundSize: "300% 300%" }}>
            {data?.title || "Sobre CLINOB"}
          </span>
        </h2>
        <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-clinob-primary via-clinob-accent to-clinob-primary animate-gradient" style={{ backgroundSize: "300% 300%" }} />
        <p className={`mt-8 text-lg leading-relaxed text-clinob-text-light md:text-xl font-light transition-all duration-1000 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {data?.description || "En CLINOB — Clínica de Nutrición y Obesidad, reunimos a un equipo multidisciplinario de 10 especialistas comprometidos con tu salud. Creemos en un enfoque integral que combina nutrición, medicina, psicología y actividad física para ayudarte a alcanzar el bienestar en cada paso."}
        </p>
      </div>
    </section>
  );
}
