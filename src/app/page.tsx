import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Doctors } from "@/components/doctors";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Doctors />
      <Contact />
      <Footer />
    </>
  );
}