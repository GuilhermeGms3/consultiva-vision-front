import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import engineerImg from "@/assets/engineer.jpg";

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { value: 10, suffix: "+", label: "Anos de experiência" },
  { value: 4, suffix: "", label: "Linhas de serviço especializadas" },
  { value: 100, suffix: "%", label: "Foco na decisão do cliente" },
];

function splitChars(text: string) {
  return text.split("").map((c, i) => (
    <span
      key={i}
      data-char
      className="inline-block will-change-transform"
      style={{ display: "inline-block" }}
    >
      {c === " " ? "\u00A0" : c}
    </span>
  ));
}

export function Metrics() {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image parallax
      gsap.fromTo(
        "[data-img-parallax]",
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      // Each metric block
      const blocks = gsap.utils.toArray<HTMLElement>("[data-metric]");
      blocks.forEach((block, i) => {
        const target = metrics[i];
        const numEl = block.querySelector<HTMLElement>("[data-counter]");
        const labelEl = block.querySelector<HTMLElement>("[data-metric-label]");
        const chars = block.querySelectorAll<HTMLElement>("[data-char]");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: "top 75%",
          },
        });

        // Char drop
        tl.fromTo(
          chars,
          { y: -80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "expo.out", stagger: 0.04 },
        );

        // Count up (replaces the chars content)
        if (numEl && target) {
          const counter = { v: 0 };
          tl.to(
            counter,
            {
              v: target.value,
              duration: 2,
              ease: "power2.out",
              snap: { v: 1 },
              onUpdate: () => {
                numEl.textContent = Math.floor(counter.v).toString() + target.suffix;
              },
            },
            "<0.2",
          );
          // Glow pulse after
          tl.to(
            numEl,
            {
              textShadow: "0 0 28px oklch(0.78 0.06 220 / 0.7)",
              duration: 0.5,
              repeat: 2,
              yoyo: true,
              ease: "sine.inOut",
            },
            ">",
          );
        }

        if (labelEl) {
          tl.fromTo(
            labelEl,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            "<",
          );
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="sobre"
      ref={root}
      className="relative overflow-hidden border-t border-border bg-background py-24 md:py-40"
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-6 px-6 md:gap-10 md:px-10">
        <div className="col-span-12 md:col-span-5">
          <div className="relative aspect-[3/4] w-full overflow-hidden border-hairline">
            <div
              data-img-parallax
              className="absolute inset-[-10%] will-change-transform"
              style={{
                backgroundImage: `url(${engineerImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
          </div>
        </div>

        <div className="col-span-12 md:col-span-7 md:pl-10">
          <span className="font-mono-mini">[05] — A casa</span>
          <h2 className="mt-6 font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.04em]">
            Engenharia consultiva
            <span className="text-muted-foreground"> que se mede em números.</span>
          </h2>

          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            {metrics.map((m) => {
              const initial = `${m.value}${m.suffix}`;
              return (
                <div key={m.label} data-metric>
                  <div className="font-display text-[clamp(3.5rem,7vw,6rem)] leading-none tracking-[-0.05em]">
                    <span data-counter className="inline-block">
                      {splitChars(initial)}
                    </span>
                  </div>
                  <p data-metric-label className="mt-3 font-mono-mini">
                    {m.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
