import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Services } from "@/components/sections/Services";

export default function HomePage() {
  return (
    <main id="top">
      <Hero />
      <About />
      <SelectedWork />
      <Services />
      <Contact />
    </main>
  );
}
