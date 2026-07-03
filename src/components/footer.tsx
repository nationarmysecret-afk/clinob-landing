export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-clinob-green/90 to-clinob-blue/90 py-8 text-white">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="text-lg font-semibold">
          CLINOB — Clínica de Nutrición y Obesidad
        </p>
        <p className="mt-1 text-sm text-white/80">
          Salud Integral y Bienestar en cada paso
        </p>
        <div className="mx-auto mt-4 h-px w-24 bg-white/30" />
        <p className="mt-4 text-sm text-white/70">
          &copy; {currentYear} CLINOB. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}