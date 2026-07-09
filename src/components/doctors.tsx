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
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    fetch("/api/doctors")
      .then((r) => r.json())
      .then(setDoctors);
    setTimeout(() => setLoaded(true), 200);
  }, []);

  const activeDoctors = doctors.filter((d) => d.isActive);

  if (activeDoctors.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-20 md:py-28" id="doctors">
      {/* Innovative mesh gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-clinob-primary/[0.02] via-white to-clinob-accent/[0.02]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-clinob-accent/20 to-transparent" />

      {/* Floating geometric blobs */}
      <div className="absolute top-10 left-1/4 h-72 w-72 rounded-full bg-gradient-to-br from-clinob-primary/8 to-clinob-accent/5 blur-[100px] animate-float" />
      <div className="absolute bottom-20 right-1/4 h-56 w-56 rounded-full bg-gradient-to-tl from-clinob-accent/8 to-clinob-primary/5 blur-[100px] animate-float" style={{ animationDelay: "-3s" }} />
      <div className="absolute top-1/3 right-10 h-40 w-40 rounded-full bg-clinob-primary/[0.04] blur-[80px] animate-float" style={{ animationDelay: "-1.5s" }} />

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, ${'#2C4A7C'} 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

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
            <DoctorCard key={doctor.id} doctor={doctor} index={i} loaded={loaded} onInfoClick={() => setSelectedDoctor(doctor)} />
          ))}
        </div>
      </div>

      {/* Doctor Info Modal */}
      <DoctorModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
    </section>
  );
}

function DoctorCard({ doctor, index, loaded, onInfoClick }: { doctor: Doctor; index: number; loaded: boolean; onInfoClick: () => void }) {
  const initials = `${doctor.firstName[0]}${doctor.lastName[0]}`;

  return (
    <div
      className={`group relative flex flex-col items-center rounded-3xl bg-white/90 backdrop-blur-sm p-7 text-center border border-gray-100 shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-clinob-primary/15 hover:border-clinob-accent/30 active:scale-[0.96] ${
        loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
      }`}
      style={{ transitionDelay: `${200 + index * 100}ms` }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-clinob-accent/[0.03] to-clinob-primary/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

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
      <p className="relative z-10 mt-3 text-sm leading-relaxed text-clinob-text-light/80 line-clamp-2 flex-1">
        {doctor.bio}
      </p>

      {/* Button forced to bottom with mt-auto */}
      <div className="relative z-10 mt-auto w-full pt-5">
        <button
          onClick={onInfoClick}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-clinob-accent/30 bg-gradient-to-r from-clinob-accent/5 to-clinob-primary/5 px-4 py-2.5 text-xs font-semibold text-clinob-accent-dark transition-all duration-500 hover:from-clinob-accent hover:to-clinob-accent-dark hover:text-white hover:shadow-lg hover:shadow-clinob-accent/25 hover:scale-105 active:scale-95"
        >
          <span>Más Información</span>
          <svg className="h-4 w-4 transition-all duration-500 group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function DoctorModal({ doctor, onClose }: { doctor: Doctor | null; onClose: () => void }) {
  if (!doctor) return null;

  const initials = `${doctor.firstName[0]}${doctor.lastName[0]}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-clinob-primary to-clinob-accent" />

        <div className="p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-all hover:bg-gray-200 hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Doctor photo */}
          <div className="flex justify-center">
            {doctor.photoUrl ? (
              <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-clinob-accent/20 shadow-xl">
                <Image
                  src={doctor.photoUrl}
                  alt={`${doctor.firstName} ${doctor.lastName}`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-clinob-primary/10 to-clinob-accent/10 text-3xl font-bold text-clinob-primary-dark ring-4 ring-clinob-accent/20 shadow-xl">
                {initials}
              </div>
            )}
          </div>

          {/* Name and specialty */}
          <div className="mt-5 text-center">
            <h3 className="text-2xl font-bold text-clinob-text">
              {doctor.firstName} {doctor.lastName}
            </h3>
            <p className="mt-1 text-base font-medium text-clinob-accent-dark">
              {doctor.specialty}
            </p>
          </div>

          {/* Divider */}
          <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-clinob-primary to-clinob-accent" />

          {/* Full bio */}
          <div className="mt-5">
            <p className="text-sm leading-relaxed text-clinob-text-light">
              {doctor.bio}
            </p>
          </div>

          {/* Agendar Cita button */}
          <div className="mt-8">
            <a
              href={doctor.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-clinob-primary to-clinob-primary-dark px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-clinob-primary/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Agendar Cita</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
