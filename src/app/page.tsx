import { SiteHeader } from "@/components/sections/site-header";
import { Hero } from "@/components/sections/hero";
import { Rechner } from "@/components/sections/rechner";
import { VerdienstFinder } from "@/components/sections/verdienst-finder";
import { Verdienstwege } from "@/components/sections/verdienstwege";
import { Bildungsgutschein } from "@/components/sections/bildungsgutschein";
import { Faq } from "@/components/sections/faq";
import { Trust } from "@/components/sections/trust";
import { Rechtshinweis } from "@/components/sections/rechtshinweis";
import { SiteFooter } from "@/components/sections/site-footer";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Rechner />
        <VerdienstFinder />
        <Verdienstwege />
        <Bildungsgutschein />
        <Faq />
        <Trust />
        <Rechtshinweis />
      </main>
      <SiteFooter />
    </>
  );
}
