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

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((all) => {
        const about = all.find((c: AboutData) => c.section === "about");
        if (about) setData(about);
      });
  }, []);

  return (
    <section className="bg-white py-20 md:py-28" id="about">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold text-clinob-text md:text-4xl">
          <span className="text-clinob-green">{data?.title || "Sobre CLINOB"}</span>
        </h2>
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-clinob-green to-clinob-blue" />
        <p className="mt-8 text-lg leading-relaxed text-clinob-text-light md:text-xl">
          {data?.description || "En CLINOB — Clínica de Nutrición y Obesidad, reunimos a un equipo multidisciplinario de 10 especialistas comprometidos con tu salud. Creemos en un enfoque integral que combina nutrición, medicina, psicología y actividad física para ayudarte a alcanzar el bienestar en cada paso."}
        </p>
      </div>
    </section>
  );
}