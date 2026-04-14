import { SiteHeader } from "@/components/sections/site-header";
import { Hero } from "@/components/sections/hero";
import { Journey } from "@/components/sections/journey";
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
        <Journey />
        <Faq />
        <Trust />
        <Rechtshinweis />
      </main>
      <SiteFooter />
    </>
  );
}
