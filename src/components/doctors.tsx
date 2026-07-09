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
    <section className="bg-clinob-bg py-20 md:py-28" id="doctors">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className={`text-center text-3xl font-bold md:text-4xl transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <span className="bg-gradient-to-r from-clinob-primary via-clinob-accent to-clinob-primary bg-clip-text text-transparent animate-gradient" style={{ backgroundSize: "200% 200%" }}>
            Agenda con Nuestros Especialistas
          </span>
        </h2>
        <p className={`text-center mt-3 text-gray-400 text-sm md:text-base transition-all duration-700 delay-150 ${loaded ? "opacity-100" : "opacity-0"}`}>
          Selecciona un especialista para agendar tu cita
        </p>
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-clinob-primary to-clinob-accent" />

        <div
          className={`mt-12 grid gap-8 ${
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
      className={`group flex flex-col items-center rounded-2xl bg-white p-6 text-center border border-transparent shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-clinob-accent/30 active:scale-[0.98] ${
        loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${300 + index * 80}ms` }}
    >
      {doctor.photoUrl ? (
        <div className="relative h-24 w-24 overflow-hidden rounded-full ring-2 ring-transparent transition-all duration-300 group-hover:ring-clinob-accent/40">
          <Image
            src={doctor.photoUrl}
            alt={`${doctor.firstName} ${doctor.lastName}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-clinob-primary/20 to-clinob-accent/20 text-2xl font-bold text-clinob-primary-dark transition-all duration-300 group-hover:from-clinob-primary/30 group-hover:to-clinob-accent/30 group-hover:scale-110">
          {initials}
        </div>
      )}

      <h3 className="mt-4 text-lg font-semibold text-clinob-text transition-colors duration-300 group-hover:text-clinob-accent-dark">
        {doctor.firstName} {doctor.lastName}
      </h3>
      <p className="mt-1 text-sm font-medium text-clinob-primary-dark">
        {doctor.specialty}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-clinob-text-light">
        {doctor.bio}
      </p>
    </a>
  );
}
