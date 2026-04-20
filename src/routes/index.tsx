import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Storytelling } from "@/components/Storytelling";
import { WindowZoom } from "@/components/WindowZoom";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { Metrics } from "@/components/Metrics";
import { CtaFinal } from "@/components/CtaFinal";
import { ClosingCinematic } from "@/components/ClosingCinematic";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "CLP Engenharia Consultiva — Precisão técnica para decisões seguras" },
      {
        name: "description",
        content:
          "Projetos, perícias, avaliações e laudos de engenharia. Mais de uma década entregando rigor técnico para decisões que não podem falhar.",
      },
      { property: "og:title", content: "CLP Engenharia Consultiva" },
      {
        property: "og:description",
        content: "Precisão técnica para decisões que não podem falhar.",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="bg-background text-foreground">
      <Navbar />
      <Hero />
      <Marquee />
      <Storytelling />
      <WindowZoom />
      <Services />
      <Process />
      <Metrics />
      <CtaFinal />
      <ClosingCinematic />
      <Footer />
    </main>
  );
}
