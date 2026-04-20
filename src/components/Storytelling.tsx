import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import construction from "@/assets/construction.jpg";
import finished from "@/assets/finished.jpg";
import { BlueprintDraw } from "./BlueprintDraw";

gsap.registerPlugin(ScrollTrigger);

type Stage =
  | { code: string; title: string; desc: string; kind: "blueprint" }
  | { code: string; title: string; desc: string; kind: "image"; img: string };

const stages: Stage[] = [
  {
    code: "01",
    title: "Blueprint",
    desc: "Tudo começa no traço. Plantas, cálculos e memoriais que antecipam cada decisão construtiva.",
    kind: "blueprint",
  },
  {
    code: "02",
    title: "Estrutura",
    desc: "Modelagem 3D e análise estrutural validam a integridade antes que o primeiro pilar seja erguido.",
    kind: "image",
    img: construction,
  },
  {
    code: "03",
    title: "Execução",
    desc: "Acompanhamento técnico em obra: o projeto se materializa com precisão e segurança.",
    kind: "image",
    img: construction,
  },
  {
    code: "04",
    title: "Resultado",
    desc: "Uma entrega que sustenta valor por décadas — tecnicamente justificada, juridicamente segura.",
    kind: "image",
    img: finished,
  },
];

function splitWords(text: string) {
  return text.split(" ").map((w, i) => (
    <span
      key={i}
      data-word
      data-word-i={i}
      className="inline-block overflow-hidden align-baseline"
    >
      <span className="inline-block will-change-transform">
        {w}
        {i < text.split(" ").length - 1 ? "\u00A0" : ""}
      </span>
    </span>
  ));
}

export function Storytelling() {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-story-panel]");

      panels.forEach((panel) => {
        const img = panel.querySelector<HTMLElement>("[data-story-img]");
        const body = panel.querySelectorAll<HTMLElement>("[data-story-body]");
        const meta = panel.querySelector<HTMLElement>("[data-story-meta]");
        const rule = panel.querySelector<HTMLElement>("[data-story-rule]");
        const wordSpans = panel.querySelectorAll<HTMLElement>(
          "[data-word] > span",
        );
        const sweep = panel.querySelector<HTMLElement>("[data-sweep]");

        // Image parallax (slower than scroll)
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: 15 },
            {
              yPercent: -15,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
        }

        // Sweep separator
        if (sweep) {
          gsap.fromTo(
            sweep,
            { xPercent: -100 },
            {
              xPercent: 100,
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: panel,
                start: "top 90%",
                end: "top 40%",
                scrub: 1.4,
              },
            },
          );
        }

        const tl = gsap.timeline({
          scrollTrigger: { trigger: panel, start: "top 70%" },
        });

        if (rule) {
          tl.fromTo(
            rule,
            { width: "0%" },
            { width: "100%", duration: 0.6, ease: "power2.out" },
          );
        }
        if (meta) {
          tl.fromTo(
            meta,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            "<0.1",
          );
        }
        if (wordSpans.length) {
          // Alternating sides per word
          const setX = (el: HTMLElement, i: number) => (i % 2 === 0 ? -80 : 80);
          gsap.set(wordSpans, {
            x: (i, el) => setX(el as HTMLElement, i),
            opacity: 0,
          });
          tl.to(
            wordSpans,
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              ease: "expo.out",
              stagger: 0.08,
            },
            ">-0.1",
          );
        }
        if (body.length) {
          tl.fromTo(
            body,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              stagger: 0.1,
            },
            ">-0.3",
          );
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-background py-24 md:py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="mb-20 grid grid-cols-12 gap-6">
          <span className="col-span-12 font-mono-mini md:col-span-3">
            [02] — Narrativa técnica
          </span>
          <h2 className="col-span-12 font-display text-[clamp(2.2rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.04em] md:col-span-9">
            Do traço inicial à entrega final, cada etapa
            <span className="text-muted-foreground"> tem rigor de engenharia.</span>
          </h2>
        </div>

        <div className="space-y-32 md:space-y-48">
          {stages.map((s, i) => {
            const reverse = i % 2 === 1;
            return (
              <div key={s.code} className="relative">
                {/* Sweep separator above each panel except first */}
                {i > 0 && (
                  <div className="pointer-events-none absolute -top-16 left-0 right-0 overflow-hidden md:-top-24">
                    <div data-sweep className="sweep-rule w-full" />
                  </div>
                )}

                <div
                  data-story-panel
                  className={`grid grid-cols-12 items-center gap-6 md:gap-12 ${
                    reverse ? "md:[direction:rtl]" : ""
                  }`}
                >
                  <div
                    className={`col-span-12 md:col-span-7 ${
                      reverse ? "[direction:ltr]" : ""
                    }`}
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden border-hairline transition-transform duration-700 hover:scale-[1.02] md:aspect-[5/6]">
                      {s.kind === "blueprint" ? (
                        <div data-story-img className="absolute inset-0 will-change-transform">
                          <BlueprintDraw className="h-full w-full" />
                        </div>
                      ) : (
                        <>
                          <div
                            data-story-img
                            className="absolute inset-0 will-change-transform"
                            style={{
                              backgroundImage: `url(${s.img})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                        </>
                      )}
                      <span className="font-mono-mini absolute bottom-5 left-5 text-foreground/80">
                        Fig. {s.code} / {stages.length.toString().padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`col-span-12 md:col-span-5 ${
                      reverse ? "[direction:ltr]" : ""
                    }`}
                  >
                    <div
                      data-story-rule
                      className="mb-6 h-px bg-blueprint will-change-[width]"
                      style={{ width: "0%" }}
                    />
                    <span data-story-meta className="font-mono-mini block">
                      Etapa — {s.code}
                    </span>
                    <h3 className="mt-4 font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.04em]">
                      {splitWords(s.title)}
                    </h3>
                    <p
                      data-story-body
                      className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
                    >
                      {s.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
