import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    n: "01",
    title: "Projetos de engenharia",
    desc: "Concepção e detalhamento técnico para edificações residenciais, comerciais e industriais.",
  },
  {
    n: "02",
    title: "Orçamentos",
    desc: "Quantitativos, composições e cronogramas com transparência sobre cada centavo investido.",
  },
  {
    n: "03",
    title: "Perícias técnicas",
    desc: "Investigação e diagnóstico de patologias construtivas com laudos juridicamente sustentáveis.",
  },
  {
    n: "04",
    title: "Avaliações & laudos",
    desc: "Avaliações imobiliárias e laudos técnicos com metodologia ABNT, prontos para uso judicial.",
  },
];

export function Services() {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-srv]", {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: root.current,
          start: "top 70%",
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="servicos"
      ref={root}
      className="relative border-t border-border bg-background py-24 md:py-40"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="mb-20 grid grid-cols-12 gap-6">
          <span className="col-span-12 font-mono-mini md:col-span-3">
            [03] — Atuação
          </span>
          <h2 className="col-span-12 font-display text-[clamp(2.2rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.04em] md:col-span-9">
            Quatro frentes,<br />
            <span className="text-muted-foreground">um único compromisso técnico.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {services.map((s, i) => (
            <article
              key={s.n}
              data-srv
              className={`group relative flex flex-col justify-between gap-12 border-border p-8 transition-colors hover:bg-surface md:min-h-[360px] md:p-12
                ${i < 2 ? "border-t" : "border-t"}
                ${i % 2 === 0 ? "md:border-r" : ""}
                ${i >= 2 ? "md:border-t" : ""}
              `}
            >
              <div className="flex items-start justify-between">
                <span className="font-mono-mini">{s.n}</span>
                <span className="font-mono-mini opacity-60 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                  →
                </span>
              </div>
              <div>
                <h3 className="font-display text-[clamp(1.8rem,3.4vw,3rem)] leading-[1] tracking-[-0.03em]">
                  {s.title}
                </h3>
                <p className="mt-6 max-w-md text-muted-foreground">
                  {s.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
