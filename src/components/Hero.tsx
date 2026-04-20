import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroImg from "@/assets/hero-architecture.jpg";
import { BlueprintScene } from "./BlueprintScene";
import { RotatingHeadline } from "./RotatingHeadline";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const root = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const subRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Slow camera-like zoom on bg
      gsap.fromTo(
        imgRef.current,
        { scale: 1.15 },
        { scale: 1.0, duration: 2.4, ease: "power3.out" },
      );

      // Lines reveal
      const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line] > span");
      gsap.set(lines, { yPercent: 110 });
      gsap.to(lines, {
        yPercent: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.09,
        delay: 0.3,
      });

      gsap.fromTo(
        "[data-hero-fade]",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 1.2, stagger: 0.08 },
      );

      // ============ DEPTH PARALLAX LAYERS (scrub) ============
      // Layer 1 — bg image (slowest)
      gsap.to(imgRef.current, {
        yPercent: 10,
        scale: 1.18,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      // Layer 2 — overlay gradient
      gsap.to(overlayRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      // Layer 3 — headline
      gsap.to(headlineRef.current, {
        yPercent: -40,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      // Layer 4 — subtext + buttons
      gsap.to(subRef.current, {
        yPercent: -55,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      // Layer 5 — floating badge (fastest)
      gsap.to(badgeRef.current, {
        yPercent: -70,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      // 3D scene
      gsap.to(sceneRef.current, {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative isolate min-h-screen w-full overflow-hidden grain"
    >
      {/* Layer 1 — Background image */}
      <div
        ref={imgRef}
        className="absolute inset-0 -z-10 will-change-transform"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Layer 2 — Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 -z-10 will-change-transform"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="absolute inset-0 -z-10 blueprint-grid opacity-40" />

      {/* 3D scene right side */}
      <div
        ref={sceneRef}
        className="pointer-events-none absolute right-[-6%] top-[8%] hidden h-[85%] w-[55%] will-change-transform md:block"
      >
        <BlueprintScene className="h-full w-full" />
      </div>

      {/* Layer 5 — Top metadata bar (fastest) */}
      <div
        ref={badgeRef}
        className="relative z-10 mx-auto flex max-w-[1600px] items-center justify-between px-6 pt-32 will-change-transform md:px-10"
      >
        <span className="font-mono-mini" data-hero-fade>
          [01] — Engenharia consultiva
        </span>
        <span className="font-mono-mini hidden md:inline" data-hero-fade>
          Est. — Projetos · Perícias · Laudos
        </span>
      </div>

      {/* Headline + content */}
      <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-[1600px] flex-col justify-end px-6 pb-24 pt-16 md:px-10 md:pb-32">
        {/* Layer 3 — rotating headline */}
        <div ref={headlineRef} className="will-change-transform">
          <RotatingHeadline />
        </div>

        {/* Layer 4 — sub + buttons */}
        <div ref={subRef} className="will-change-transform">
          <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <p
              className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
              data-hero-fade
            >
              Projetos, perícias e análises de engenharia para decisões seguras.
              Mais de uma década entregando rigor técnico onde o erro não é uma
              opção.
            </p>

            <div className="flex flex-wrap gap-4" data-hero-fade>
              <a
                href="#contato"
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
                Falar no WhatsApp
                <span>→</span>
              </a>
            </div>
          </div>

          <div className="mt-16 flex items-center gap-3" data-hero-fade>
            <div className="h-px w-12 bg-foreground/40" />
            <span className="font-mono-mini">Role para descobrir</span>
          </div>
        </div>
      </div>
    </section>
  );
}
