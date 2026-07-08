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

  useEffect(() => {
    fetch("/api/doctors")
      .then((r) => r.json())
      .then(setDoctors);
  }, []);

  const activeDoctors = doctors.filter((d) => d.isActive);

  if (activeDoctors.length === 0) return null;

  return (
    <section className="bg-clinob-bg py-20 md:py-28" id="doctors">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-clinob-text md:text-4xl">
          Agenda con Nuestros{" "}
          <span className="text-clinob-primary">Especialistas</span>
        </h2>
        <p className="text-center mt-2 text-gray-400 text-sm md:text-base">
          Selecciona un especialista para agendar tu cita
        </p>
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-clinob-primary to-clinob-accent" />

        {/* Grid layout: varies by count */}
        <div
          className={`mt-12 grid gap-8 ${
            activeDoctors.length <= 4
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }`}
        >
          {activeDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const initials = `${doctor.firstName[0]}${doctor.lastName[0]}`;

  return (
    <a
      href={doctor.linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
    >
      {doctor.photoUrl ? (
        <div className="relative h-24 w-24 overflow-hidden rounded-full">
          <Image
            src={doctor.photoUrl}
            alt={`${doctor.firstName} ${doctor.lastName}`}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-clinob-primary/20 to-clinob-accent/20 text-2xl font-bold text-clinob-primary-dark transition-all group-hover:from-clinob-primary/30 group-hover:to-clinob-accent/30">
          {initials}
        </div>
      )}

      <h3 className="mt-4 text-lg font-semibold text-clinob-text transition-colors group-hover:text-clinob-accent-dark">
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