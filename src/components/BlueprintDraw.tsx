import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Blueprint que se desenha sozinho conforme o scroll.
 * SVG técnico — perímetro → divisões → cotas → símbolos → labels.
 */
export function BlueprintDraw({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const paths = gsap.utils.toArray<SVGPathElement | SVGLineElement | SVGRectElement | SVGCircleElement>(
        "[data-bp-stroke]",
      );

      // Prepare each stroke
      paths.forEach((p) => {
        const len = (p as SVGPathElement).getTotalLength
          ? (p as SVGPathElement).getTotalLength()
          : 1000;
        gsap.set(p, {
          strokeDasharray: len,
          strokeDashoffset: len,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
          end: "bottom 30%",
          scrub: 1.5,
        },
      });

      // 1. Perimeter / walls
      tl.to("[data-bp-layer='walls'] [data-bp-stroke]", {
        strokeDashoffset: 0,
        duration: 1,
        ease: "power1.inOut",
        stagger: 0.05,
      });
      // 2. Interior divisions
      tl.to(
        "[data-bp-layer='rooms'] [data-bp-stroke]",
        { strokeDashoffset: 0, duration: 1, ease: "power1.out", stagger: 0.08 },
        ">-0.2",
      );
      // 3. Dimension lines
      tl.to(
        "[data-bp-layer='dims'] [data-bp-stroke]",
        { strokeDashoffset: 0, duration: 0.8, ease: "none", stagger: 0.05 },
        ">-0.1",
      );
      // 4. Symbols (doors / windows)
      tl.to(
        "[data-bp-layer='symbols'] [data-bp-stroke]",
        { strokeDashoffset: 0, duration: 0.7, ease: "power2.out", stagger: 0.04 },
        ">-0.1",
      );
      // 5. Text labels
      tl.fromTo(
        "[data-bp-label]",
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power2.out" },
        ">-0.05",
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={`relative ${className}`}>
      <div className="absolute inset-0 blueprint-paper" />
      <svg
        viewBox="0 0 800 600"
        className="relative h-full w-full"
        fill="none"
        stroke="oklch(0.78 0.06 220)"
        strokeWidth="1.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
        style={{ willChange: "transform" }}
      >
        {/* Outer walls */}
        <g data-bp-layer="walls" strokeWidth="2">
          <path data-bp-stroke d="M 80 80 L 720 80" />
          <path data-bp-stroke d="M 720 80 L 720 520" />
          <path data-bp-stroke d="M 720 520 L 80 520" />
          <path data-bp-stroke d="M 80 520 L 80 80" />
          {/* Inner wall offset for double-line architectural look */}
          <path data-bp-stroke d="M 92 92 L 708 92" opacity="0.5" />
          <path data-bp-stroke d="M 708 92 L 708 508" opacity="0.5" />
          <path data-bp-stroke d="M 708 508 L 92 508" opacity="0.5" />
          <path data-bp-stroke d="M 92 508 L 92 92" opacity="0.5" />
        </g>

        {/* Interior rooms */}
        <g data-bp-layer="rooms">
          <path data-bp-stroke d="M 80 280 L 420 280" />
          <path data-bp-stroke d="M 420 80 L 420 280" />
          <path data-bp-stroke d="M 420 360 L 720 360" />
          <path data-bp-stroke d="M 240 360 L 240 520" />
          <path data-bp-stroke d="M 540 360 L 540 520" />
          <path data-bp-stroke d="M 420 280 L 420 360" />
        </g>

        {/* Dimension lines */}
        <g data-bp-layer="dims" stroke="oklch(0.78 0.06 220 / 0.6)" strokeWidth="0.8" strokeDasharray="0">
          <path data-bp-stroke d="M 80 50 L 720 50" />
          <path data-bp-stroke d="M 80 45 L 80 55" />
          <path data-bp-stroke d="M 720 45 L 720 55" />
          <path data-bp-stroke d="M 420 45 L 420 55" />
          <path data-bp-stroke d="M 750 80 L 750 520" />
          <path data-bp-stroke d="M 745 80 L 755 80" />
          <path data-bp-stroke d="M 745 520 L 755 520" />
          <path data-bp-stroke d="M 745 280 L 755 280" />
        </g>

        {/* Symbols: door arcs + window breaks */}
        <g data-bp-layer="symbols" stroke="oklch(0.78 0.06 220 / 0.85)">
          {/* door arcs */}
          <path data-bp-stroke d="M 200 280 A 40 40 0 0 1 240 320" />
          <path data-bp-stroke d="M 200 280 L 200 320" />
          <path data-bp-stroke d="M 480 360 A 40 40 0 0 1 520 400" />
          <path data-bp-stroke d="M 480 360 L 480 400" />
          {/* window breaks (small gaps as lines) */}
          <path data-bp-stroke d="M 180 80 L 180 92" />
          <path data-bp-stroke d="M 320 80 L 320 92" />
          <path data-bp-stroke d="M 540 80 L 540 92" />
          <path data-bp-stroke d="M 620 80 L 620 92" />
          <path data-bp-stroke d="M 720 180 L 708 180" />
          <path data-bp-stroke d="M 720 240 L 708 240" />
          {/* stairs */}
          <path data-bp-stroke d="M 580 400 L 700 400" />
          <path data-bp-stroke d="M 580 420 L 700 420" />
          <path data-bp-stroke d="M 580 440 L 700 440" />
          <path data-bp-stroke d="M 580 460 L 700 460" />
          <path data-bp-stroke d="M 580 480 L 700 480" />
          <path data-bp-stroke d="M 580 500 L 700 500" />
        </g>

        {/* Text labels */}
        <g fontFamily="ui-monospace, SF Mono, Menlo, monospace" fontSize="10" fill="oklch(0.78 0.06 220 / 0.9)" letterSpacing="0.15em">
          <text data-bp-label x="400" y="38" textAnchor="middle">640.00</text>
          <text data-bp-label x="770" y="304" transform="rotate(90 770 304)" textAnchor="middle">440.00</text>
          <text data-bp-label x="220" y="190" textAnchor="middle" letterSpacing="0.2em">SALA</text>
          <text data-bp-label x="570" y="190" textAnchor="middle" letterSpacing="0.2em">COZINHA</text>
          <text data-bp-label x="160" y="440" textAnchor="middle" letterSpacing="0.2em">QUARTO 01</text>
          <text data-bp-label x="390" y="440" textAnchor="middle" letterSpacing="0.2em">QUARTO 02</text>
          <text data-bp-label x="630" y="440" textAnchor="middle" letterSpacing="0.2em">ESCADA</text>
        </g>

        {/* Title block */}
        <g data-bp-layer="symbols" stroke="oklch(0.78 0.06 220 / 0.5)" strokeWidth="0.8">
          <path data-bp-stroke d="M 540 540 L 720 540" />
          <path data-bp-stroke d="M 540 540 L 540 580" />
          <path data-bp-stroke d="M 720 540 L 720 580" />
          <path data-bp-stroke d="M 540 580 L 720 580" />
          <path data-bp-stroke d="M 540 560 L 720 560" />
        </g>
        <g fontFamily="ui-monospace, SF Mono, Menlo, monospace" fontSize="8" fill="oklch(0.78 0.06 220)" letterSpacing="0.2em">
          <text data-bp-label x="550" y="554">CLP — PRANCHA 01/04</text>
          <text data-bp-label x="550" y="574">ESC. 1:50 — PLANTA BAIXA</text>
        </g>
      </svg>
    </div>
  );
}
