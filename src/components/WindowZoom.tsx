import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * "Zoom Through the Building Window" — cena cinematográfica scroll-driven.
 */
export function WindowZoom() {
  const root = useRef<HTMLDivElement | null>(null);
  const scene = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
          pin: scene.current,
          pinSpacing: true,
        },
      });

      tl.fromTo(
        ".wz-building",
        { scale: 0.35, y: 120, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 1, ease: "power2.out" },
      )
        .to(".wz-building", { scale: 6.5, duration: 1.6, ease: "power2.in" }, ">")
        .fromTo(
          ".wz-flash",
          { opacity: 0 },
          { opacity: 0.7, duration: 0.15, yoyo: true, repeat: 1, ease: "none" },
          ">-0.1",
        )
        .fromTo(
          ".wz-interior",
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
          ">",
        )
        .fromTo(
          ".wz-engineer",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          ">-0.3",
        )
        .fromTo(
          ".wz-text",
          { opacity: 0, x: -80 },
          { opacity: 1, x: 0, duration: 0.9, stagger: 0.22, ease: "expo.out" },
          ">-0.2",
        );

      // idle breathe on engineer (independent)
      gsap.to(".wz-engineer", {
        y: -4,
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative bg-background"
      style={{ height: "600vh" }}
      aria-label="Zoom cinematográfico para dentro do escritório"
    >
      <div
        ref={scene}
        className="relative h-screen w-full overflow-hidden border-y border-border"
      >
        <div className="absolute inset-0 blueprint-grid opacity-30" />

        {/* Building */}
        <div className="wz-building absolute inset-0 flex items-center justify-center will-change-transform">
          <svg
            viewBox="0 0 400 700"
            className="h-[80%] w-auto"
            fill="none"
            stroke="oklch(0.78 0.06 220 / 0.85)"
            strokeWidth="1.2"
          >
            {/* facade */}
            <rect x="60" y="40" width="280" height="620" />
            <rect x="60" y="40" width="280" height="40" fill="oklch(0.78 0.06 220 / 0.08)" />
            {/* 10 floors x 4 windows */}
            {Array.from({ length: 10 }).map((_, row) =>
              Array.from({ length: 4 }).map((__, col) => {
                const x = 80 + col * 65;
                const y = 100 + row * 55;
                const isTarget = row === 4 && col === 2;
                return (
                  <g key={`${row}-${col}`}>
                    <rect
                      x={x}
                      y={y}
                      width={45}
                      height={38}
                      fill={isTarget ? "oklch(0.92 0.08 90 / 0.95)" : "oklch(0.18 0.008 240 / 0.6)"}
                      stroke="oklch(0.78 0.06 220 / 0.6)"
                    />
                    {isTarget && (
                      <rect
                        x={x - 4}
                        y={y - 4}
                        width={53}
                        height={46}
                        fill="none"
                        stroke="oklch(0.92 0.08 90 / 0.5)"
                        strokeWidth="0.8"
                      />
                    )}
                  </g>
                );
              }),
            )}
            {/* entrance */}
            <rect x="170" y="610" width="60" height="50" fill="oklch(0.18 0.008 240)" />
            {/* roof line */}
            <path d="M 50 40 L 350 40" strokeWidth="2" />
          </svg>
        </div>

        {/* Glass flash */}
        <div className="wz-flash pointer-events-none absolute inset-0 bg-foreground" />

        {/* Interior scene */}
        <div className="wz-interior absolute inset-0 flex items-center justify-center opacity-0 will-change-transform">
          {/* warm lamp glow */}
          <div
            className="absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.92 0.08 90 / 0.18) 0%, transparent 60%)",
            }}
          />
          <svg
            viewBox="0 0 1200 700"
            className="relative h-full w-full"
            fill="none"
            stroke="oklch(0.97 0.005 240 / 0.7)"
            strokeWidth="1.2"
          >
            {/* floor line */}
            <path d="M 0 540 L 1200 540" strokeWidth="1.5" />
            {/* desk */}
            <rect x="320" y="430" width="440" height="14" fill="oklch(0.22 0.01 240)" />
            <path d="M 360 444 L 360 540" />
            <path d="M 720 444 L 720 540" />
            {/* blueprints on desk */}
            <rect x="380" y="410" width="180" height="22" fill="oklch(0.78 0.06 220 / 0.18)" stroke="oklch(0.78 0.06 220 / 0.6)" />
            <path d="M 400 421 L 540 421" stroke="oklch(0.78 0.06 220 / 0.7)" />
            <path d="M 400 414 L 480 414" stroke="oklch(0.78 0.06 220 / 0.5)" />
            {/* paper tubes */}
            <rect x="600" y="412" width="120" height="18" fill="oklch(0.22 0.01 240)" rx="9" />
            <circle cx="610" cy="421" r="7" />
            <circle cx="710" cy="421" r="7" />
            {/* desk lamp */}
            <path d="M 760 280 L 760 430" />
            <path d="M 760 280 L 820 240" />
            <path d="M 820 240 L 850 260 L 800 280 L 770 270 Z" fill="oklch(0.22 0.01 240)" />
            {/* lamp light cone */}
            <path d="M 800 270 L 720 430 L 880 430 Z" fill="oklch(0.92 0.08 90 / 0.12)" stroke="none" />
            {/* window frame behind */}
            <rect x="80" y="120" width="220" height="280" stroke="oklch(0.78 0.06 220 / 0.5)" strokeWidth="2" />
            <path d="M 190 120 L 190 400" stroke="oklch(0.78 0.06 220 / 0.4)" />
            <path d="M 80 260 L 300 260" stroke="oklch(0.78 0.06 220 / 0.4)" />
          </svg>

          {/* Engineer figure */}
          <svg
            viewBox="0 0 200 400"
            className="wz-engineer absolute bottom-[10%] left-[14%] h-[55%] w-auto will-change-transform"
            fill="none"
            stroke="oklch(0.97 0.005 240 / 0.85)"
            strokeWidth="1.4"
          >
            {/* head */}
            <circle cx="100" cy="50" r="22" fill="oklch(0.18 0.008 240)" />
            {/* shoulders + torso */}
            <path d="M 70 80 L 60 200 L 140 200 L 130 80 Z" fill="oklch(0.16 0.007 240)" />
            <path d="M 100 75 L 100 200" strokeWidth="0.8" opacity="0.4" />
            {/* arm holding document */}
            <path d="M 60 110 L 40 200 L 30 240" />
            <rect x="14" y="232" width="36" height="48" fill="oklch(0.78 0.06 220 / 0.2)" stroke="oklch(0.78 0.06 220 / 0.7)" />
            <path d="M 22 248 L 42 248" stroke="oklch(0.78 0.06 220 / 0.7)" />
            <path d="M 22 258 L 38 258" stroke="oklch(0.78 0.06 220 / 0.5)" />
            {/* other arm */}
            <path d="M 140 110 L 160 220" />
            {/* legs */}
            <path d="M 80 200 L 78 380" />
            <path d="M 120 200 L 122 380" />
          </svg>

          {/* Text overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-center">
            <div className="ml-auto mr-[6vw] max-w-xl pr-6 text-right md:mr-[8vw]">
              <p className="wz-text font-mono-mini text-blueprint">
                [interior — escritório técnico]
              </p>
              <h2 className="wz-text mt-6 font-display text-[clamp(2rem,4.5vw,4rem)] leading-[0.95] tracking-[-0.04em]">
                Mais de 7 anos<br />
                <span className="text-muted-foreground">resolvendo o que outros</span><br />
                não conseguem.
              </h2>
              <p className="wz-text mt-8 max-w-md ml-auto text-base leading-relaxed text-muted-foreground md:text-lg">
                Engenharia consultiva de alto nível técnico e impacto real
                — onde cada projeto é uma decisão que precisa sustentar valor.
              </p>
            </div>
          </div>
        </div>

        {/* Section marker */}
        <div className="pointer-events-none absolute left-6 top-6 z-10 md:left-10 md:top-10">
          <span className="font-mono-mini">[02b] — Lá dentro</span>
        </div>
      </div>
    </section>
  );
}
