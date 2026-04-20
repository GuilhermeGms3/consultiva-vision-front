import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function CtaFinal() {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>("[data-cta-line] > span");
      gsap.set(lines, { yPercent: 110 });
      gsap.to(lines, {
        yPercent: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.from("[data-cta-fade]", {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.4,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contato"
      ref={root}
      className="relative isolate overflow-hidden border-t border-border bg-background py-32 md:py-48"
    >
      <div className="absolute inset-0 -z-10 blueprint-grid opacity-30" />
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <span className="font-mono-mini" data-cta-fade>
          [06] — Próximo passo
        </span>
        <h2 className="mt-10 font-display text-[clamp(3rem,9.5vw,10rem)] leading-[0.92] tracking-[-0.05em]">
          <span data-cta-line className="reveal-line"><span className="block">Decida com</span></span>
          <span data-cta-line className="reveal-line">
            <span className="block">
              segurança <em className="not-italic text-blueprint font-light">técnica.</em>
            </span>
          </span>
        </h2>

        <div
          className="mt-16 flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between"
          data-cta-fade
        >
          <p className="max-w-md text-muted-foreground md:text-lg">
            Conte o que precisa ser projetado, periciado ou avaliado.
            Respondemos com método, transparência e prazo claro.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:contato@clpengenharia.com.br"
              className="group inline-flex items-center gap-3 bg-foreground px-7 py-4 font-mono-mini text-background transition-all hover:gap-5"
            >
              Solicitar proposta
              <span>→</span>
            </a>
            <a
              href="https://wa.me/?text=Ol%C3%A1%20CLP%2C%20gostaria%20de%20uma%20proposta."
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 border border-foreground/40 px-7 py-4 font-mono-mini text-foreground transition-all hover:border-foreground hover:gap-5"
            >
              WhatsApp
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
