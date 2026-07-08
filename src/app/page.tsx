import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Doctors } from "@/components/doctors";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Doctors />
      <About />
      <Footer />
    </>
  );
}