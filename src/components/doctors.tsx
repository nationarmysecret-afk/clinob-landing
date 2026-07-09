"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Doctor {
  id: string;
  sortOrder: number;
  firstName: string;
  lastName: string;
  specialty: string;
  bio: string;
  photoUrl: string | null;
  linkUrl: string;
  isActive: boolean;
}

export function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/doctors")
      .then((r) => r.json())
      .then(setDoctors);
    setTimeout(() => setLoaded(true), 200);
  }, []);

  const activeDoctors = doctors.filter((d) => d.isActive);

  if (activeDoctors.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-white via-clinob-primary-light/30 to-white py-20 md:py-28 relative overflow-hidden" id="doctors">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 -left-32 h-64 w-64 rounded-full bg-clinob-accent/[0.04] blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 h-64 w-64 rounded-full bg-clinob-primary/[0.04] blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className={`text-center transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <h2 className="text-4xl font-bold md:text-5xl tracking-tight">
            <span className="bg-gradient-to-r from-clinob-primary via-clinob-accent to-clinob-primary bg-clip-text text-transparent animate-gradient" style={{ backgroundSize: "300% 300%" }}>
              Agenda con Nuestros Especialistas
            </span>
          </h2>
          <p className={`mt-4 text-gray-400 text-base md:text-lg font-light tracking-wide transition-all duration-1000 delay-200 ${loaded ? "opacity-100" : "opacity-0"}`}>
            Selecciona un especialista para agendar tu cita
          </p>
          <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-clinob-primary via-clinob-accent to-clinob-primary animate-gradient" style={{ backgroundSize: "300% 300%" }} />
        </div>

        <div
          className={`mt-14 grid gap-8 ${
            activeDoctors.length <= 4
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }`}
        >
          {activeDoctors.map((doctor, i) => (
            <DoctorCard key={doctor.id} doctor={doctor} index={i} loaded={loaded} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DoctorCard({ doctor, index, loaded }: { doctor: Doctor; index: number; loaded: boolean }) {
  const initials = `${doctor.firstName[0]}${doctor.lastName[0]}`;

  return (
    <a
      href={doctor.linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col items-center rounded-3xl bg-white/80 backdrop-blur-sm p-7 text-center border border-gray-100/50 shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-clinob-primary/10 hover:border-clinob-accent/40 active:scale-[0.96] ${
        loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
      }`}
      style={{ transitionDelay: `${200 + index * 100}ms` }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-clinob-accent/[0.02] to-clinob-primary/[0.02] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {doctor.photoUrl ? (
        <div className="relative h-28 w-28 overflow-hidden rounded-full ring-2 ring-gray-100 transition-all duration-500 group-hover:ring-clinob-accent/50 group-hover:shadow-xl group-hover:shadow-clinob-accent/20">
          <Image
            src={doctor.photoUrl}
            alt={`${doctor.firstName} ${doctor.lastName}`}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-125"
          />
        </div>
      ) : (
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-clinob-primary/10 to-clinob-accent/10 text-3xl font-bold text-clinob-primary-dark transition-all duration-500 group-hover:from-clinob-primary/20 group-hover:to-clinob-accent/20 group-hover:scale-125 group-hover:shadow-xl group-hover:shadow-clinob-accent/20">
          {initials}
        </div>
      )}

      <h3 className="relative z-10 mt-5 text-xl font-semibold text-clinob-text transition-all duration-500 group-hover:text-clinob-accent-dark group-hover:tracking-wide">
        {doctor.firstName} {doctor.lastName}
      </h3>
      <p className="relative z-10 mt-1 text-sm font-medium text-clinob-primary-dark/80">
        {doctor.specialty}
      </p>
      <p className="relative z-10 mt-3 text-sm leading-relaxed text-clinob-text-light/80 line-clamp-2">
        {doctor.bio}
      </p>

      {/* Subtle indicator */}
      <div className="relative z-10 mt-4 flex items-center gap-1.5 text-xs font-medium text-clinob-accent/0 transition-all duration-500 group-hover:text-clinob-accent">
        <span>Agendar cita</span>
        <svg className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
}
