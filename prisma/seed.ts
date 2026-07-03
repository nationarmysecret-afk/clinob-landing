import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding CLINOB database...");

  // Site content
  await prisma.siteContent.upsert({
    where: { section: "hero" },
    update: {},
    create: {
      section: "hero",
      title: "CLINOB",
      subtitle: "Clínica de Nutrición y Obesidad",
      description: "Salud Integral y Bienestar en cada paso",
    },
  });

  await prisma.siteContent.upsert({
    where: { section: "about" },
    update: {},
    create: {
      section: "about",
      title: "Sobre CLINOB",
      description:
        'En CLINOB — Clínica de Nutrición y Obesidad, reunimos a un equipo multidisciplinario de 10 especialistas comprometidos con tu salud. Creemos en un enfoque integral que combina nutrición, medicina, psicología y actividad física para ayudarte a alcanzar el bienestar en cada paso. Nuestro lema lo dice todo: "Salud Integral y Bienestar en cada paso". Cada miembro de nuestro equipo aporta su experiencia única para ofrecerte un tratamiento personalizado, humano y basado en la ciencia.',
    },
  });

  // Contact info
  const contacts = [
    { key: "address", value: "Av. Independencia 123, Santo Domingo, República Dominicana" },
    { key: "phone", value: "(809) 555-0123" },
    { key: "email", value: "contacto@clinob.com" },
  ];

  for (const c of contacts) {
    await prisma.contactInfo.upsert({
      where: { key: c.key },
      update: { value: c.value },
      create: c,
    });
  }

  // Doctors
  const doctors = [
    { sortOrder: 1, firstName: "Ana", lastName: "García López", specialty: "Nutrición Clínica", bio: "Especialista en planes nutricionales personalizados para pacientes con diabetes, hipertensión y trastornos metabólicos." },
    { sortOrder: 2, firstName: "Carlos", lastName: "Martínez Pérez", specialty: "Obesidad y Cirugía Bariátrica", bio: "Cirujano bariátrico con más de 15 años de experiencia en procedimientos mínimamente invasivos para el tratamiento de la obesidad." },
    { sortOrder: 3, firstName: "María", lastName: "Rodríguez Sánchez", specialty: "Psicología de la Alimentación", bio: "Psicóloga especializada en trastornos de la conducta alimentaria y acompañamiento emocional en procesos de pérdida de peso." },
    { sortOrder: 4, firstName: "Pedro", lastName: "Hernández Díaz", specialty: "Medicina Deportiva", bio: "Médico del deporte enfocado en la prescripción de ejercicio físico como parte integral del tratamiento contra la obesidad." },
    { sortOrder: 5, firstName: "Laura", lastName: "Torres Gómez", specialty: "Endocrinología", bio: "Endocrinóloga dedicada al diagnóstico y tratamiento de trastornos hormonales relacionados con el metabolismo y el peso corporal." },
    { sortOrder: 6, firstName: "Jorge", lastName: "Ramírez Ortiz", specialty: "Nutrición Deportiva", bio: "Nutriólogo deportivo que combina alimentación estratégica y entrenamiento para optimizar la composición corporal de sus pacientes." },
    { sortOrder: 7, firstName: "Sofía", lastName: "Castro Mendoza", specialty: "Gastroenterología", bio: "Gastroenteróloga especializada en el diagnóstico de enfermedades digestivas que afectan la absorción de nutrientes y el peso corporal." },
    { sortOrder: 8, firstName: "Diego", lastName: "Fernández Rivas", specialty: "Nutrición Pediátrica", bio: "Experto en alimentación infantil, abordando la obesidad desde la infancia con estrategias nutricionales adaptadas a cada etapa del desarrollo." },
    { sortOrder: 9, firstName: "Valentina", lastName: "Morales Vega", specialty: "Medicina Interna", bio: "Internista con enfoque integral en el manejo de comorbididades asociadas a la obesidad como resistencia a la insulina e hipertensión." },
    { sortOrder: 10, firstName: "Andrés", lastName: "Navarro Castillo", specialty: "Salud Mental y Alimentación", bio: "Psiquiatra especializado en la relación entre salud mental, estrés crónico y hábitos alimentarios, ofreciendo un enfoque multidisciplinario." },
  ];

  for (const d of doctors) {
    await prisma.doctor.upsert({
      where: { id: d.sortOrder.toString() },
      update: d,
      create: { id: d.sortOrder.toString(), ...d },
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());