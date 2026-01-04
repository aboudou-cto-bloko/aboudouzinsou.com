import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import Projects from "@/components/sections/projects";
import { FAQ } from "@/components/sections/faq";
import { FinalCTA } from "@/components/sections/final-cta";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <Process />
      <Projects />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
