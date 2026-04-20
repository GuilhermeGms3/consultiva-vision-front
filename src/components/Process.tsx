import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { n: "01", t: "Diagnóstico", d: "Briefing técnico, escuta ativa e leitura precisa do problema." },
  { n: "02", t: "Projeto", d: "Modelagem, cálculos e documentação executiva detalhada." },
  { n: "03", t: "Análise", d: "Verificação, compatibilização e validação técnica final." },
  { n: "04", t: "Entrega", d: "Documentação final, suporte e acompanhamento contínuo." },
];

export function Process() {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Desktop: horizontal line grows + nodes pop synced
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
            end: "bottom 50%",
            scrub: 1.4,
          },
        });

        tl.fromTo(
          "[data-line]",
          { width: "0%" },
          { width: "100%", ease: "none", duration: 4 },
          0,
        );

        // Nodes pop at line milestones
        steps.forEach((_, i) => {
          const at = i * 1; // 0,1,2,3 along the 4-unit line
          tl.fromTo(
            `[data-node='${i}']`,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.55)" },
            at,
          );
          tl.fromTo(
            `[data-step-text='${i}']`,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            at + 0.25,
          );
        });
      });

      mm.add("(max-width: 767px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
            end: "bottom 60%",
            scrub: 1.4,
          },
        });
        tl.fromTo(
          "[data-line-v]",
          { height: "0%" },
          { height: "100%", ease: "none", duration: 4 },
          0,
        );
        steps.forEach((_, i) => {
          const at = i * 1;
          tl.fromTo(
            `[data-node='${i}']`,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.55)" },
            at,
          );
          tl.fromTo(
            `[data-step-text='${i}']`,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
            at + 0.25,
          );
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="processo"
      ref={root}
      className="relative border-t border-border bg-background py-24 md:py-40"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="mb-20 grid grid-cols-12 gap-6">
          <span className="col-span-12 font-mono-mini md:col-span-3">
            [04] — Método
          </span>
          <h2 className="col-span-12 font-display text-[clamp(2.2rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.04em] md:col-span-9">
            Um processo linear,<br />
            <span className="text-muted-foreground">sem zonas cinzentas.</span>
          </h2>
        </div>

        {/* DESKTOP horizontal */}
        <div className="relative hidden md:block">
          <div className="absolute left-0 right-0 top-[3.25rem] h-px bg-border" />
          <div
            data-line
            className="absolute left-0 top-[3.25rem] h-px will-change-[width]"
            style={{
              width: "0%",
              background:
                "linear-gradient(to right, oklch(0.78 0.06 220 / 0.5), oklch(0.97 0.005 240))",
            }}
          />

          <div className="grid grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="mb-8 block">
                  <span className="font-mono-mini">{s.n}</span>
                  <div className="relative mt-2">
                    <div
                      data-node={i}
                      className="h-2.5 w-2.5 rounded-full bg-foreground shadow-[0_0_0_4px_oklch(0.13_0.005_240),0_0_20px_oklch(0.78_0.06_220_/_0.6)] will-change-transform"
                    />
                  </div>
                </div>
                <div data-step-text={i}>
                  <h3 className="font-display text-2xl tracking-[-0.03em] md:text-3xl">
                    {s.t}
                  </h3>
                  <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                    {s.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE vertical */}
        <div className="relative md:hidden">
          <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border" />
          <div
            data-line-v
            className="absolute left-[7px] top-0 w-px will-change-[height]"
            style={{
              height: "0%",
              background:
                "linear-gradient(to bottom, oklch(0.78 0.06 220 / 0.5), oklch(0.97 0.005 240))",
            }}
          />
          <div className="space-y-12 pl-10">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                <div
                  data-node={i}
                  className="absolute -left-[37px] top-2 h-3.5 w-3.5 rounded-full bg-foreground shadow-[0_0_0_4px_oklch(0.13_0.005_240),0_0_18px_oklch(0.78_0.06_220_/_0.6)] will-change-transform"
                />
                <span className="font-mono-mini">{s.n}</span>
                <div data-step-text={i}>
                  <h3 className="mt-2 font-display text-2xl tracking-[-0.03em]">
                    {s.t}
                  </h3>
                  <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                    {s.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
