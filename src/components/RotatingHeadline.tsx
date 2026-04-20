import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const MESSAGES = [
  "Precisão técnica para decisões que não podem falhar.",
  "Engenharia consultiva para quem não pode errar.",
  "Laudos, projetos e análises com rigor e respaldo.",
  "Agilidade técnica quando o prazo não perdoa.",
  "Segurança profissional em cada entrega.",
];

// Transition styles in order; index = transition FROM message i TO message i+1
// 0→1 slide-left, 1→2 chars, 2→3 slide-up, 3→4 blur, 4→0 chars
type Transition = "slideLeft" | "chars" | "slideUp" | "blur";
const TRANSITIONS: Transition[] = ["slideLeft", "chars", "slideUp", "blur", "chars"];

const HOLD_MS = 3500;
const START_DELAY_MS = 1500;

export function RotatingHeadline() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slotARef = useRef<HTMLDivElement | null>(null);
  const slotBRef = useRef<HTMLDivElement | null>(null);
  const indexRef = useRef(0);
  const activeSlotRef = useRef<"A" | "B">("A");
  const tweensRef = useRef<gsap.core.Tween[]>([]);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const a = slotARef.current!;
      const b = slotBRef.current!;

      // Initial state: slot A shows message 0, slot B hidden
      renderPlain(a, MESSAGES[0]);
      renderPlain(b, "");
      gsap.set(a, { xPercent: 0, yPercent: 0, opacity: 1, filter: "blur(0px)" });
      gsap.set(b, { xPercent: 0, yPercent: 0, opacity: 0, filter: "blur(0px)" });

      const scheduleNext = (delay: number) => {
        const id = window.setTimeout(runTransition, delay);
        timeoutsRef.current.push(id);
      };

      const runTransition = () => {
        const fromIndex = indexRef.current;
        const toIndex = (fromIndex + 1) % MESSAGES.length;
        const transition = TRANSITIONS[fromIndex];

        const fromSlot = activeSlotRef.current === "A" ? a : b;
        const toSlot = activeSlotRef.current === "A" ? b : a;

        // Prepare incoming slot
        gsap.set(toSlot, { xPercent: 0, yPercent: 0, opacity: 0, filter: "blur(0px)" });
        renderPlain(toSlot, MESSAGES[toIndex]);

        const tl = gsap.timeline({
          onComplete: () => {
            indexRef.current = toIndex;
            activeSlotRef.current = activeSlotRef.current === "A" ? "B" : "A";
            scheduleNext(HOLD_MS);
          },
        });

        if (transition === "slideLeft") {
          gsap.set(toSlot, { xPercent: 110, opacity: 1 });
          tl.to(fromSlot, {
            xPercent: -110,
            opacity: 0,
            duration: 0.9,
            ease: "power3.inOut",
          }, 0);
          tl.to(toSlot, {
            xPercent: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.inOut",
          }, 0);
        } else if (transition === "slideUp") {
          gsap.set(toSlot, { yPercent: 100, opacity: 1 });
          tl.to(fromSlot, {
            yPercent: -100,
            opacity: 0,
            duration: 1,
            ease: "expo.inOut",
          }, 0);
          tl.to(toSlot, {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "expo.inOut",
          }, 0);
        } else if (transition === "blur") {
          tl.to(fromSlot, {
            opacity: 0,
            filter: "blur(12px)",
            duration: 0.8,
            ease: "power2.inOut",
          }, 0);
          gsap.set(toSlot, { filter: "blur(12px)", opacity: 0 });
          tl.to(toSlot, {
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power2.inOut",
          }, 0);
        } else {
          // chars: fade out current, then build new char-by-char
          renderChars(toSlot, MESSAGES[toIndex]);
          gsap.set(toSlot, { opacity: 1 });
          const chars = toSlot.querySelectorAll("[data-char]");
          gsap.set(chars, { opacity: 0, y: 12 });
          tl.to(fromSlot, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
          }, 0);
          tl.to(chars, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.03,
          }, 0.35);
        }
      };

      scheduleNext(START_DELAY_MS);
    }, containerRef);

    return () => {
      timeoutsRef.current.forEach((id) => clearTimeout(id));
      timeoutsRef.current = [];
      tweensRef.current.forEach((t) => t.kill());
      tweensRef.current = [];
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: "clamp(11rem, 38vw, 38rem)" }}
    >
      <div
        ref={slotARef}
        className="absolute inset-0 will-change-transform"
        aria-hidden="false"
      />
      <div
        ref={slotBRef}
        className="absolute inset-0 will-change-transform"
        aria-hidden="true"
      />
    </div>
  );
}

function renderPlain(el: HTMLElement, text: string) {
  el.innerHTML = "";
  const h1 = document.createElement("h1");
  h1.className =
    "font-display text-foreground leading-[0.92] tracking-[-0.05em] text-[clamp(2.6rem,9vw,9rem)]";
  h1.textContent = text;
  el.appendChild(h1);
}

function renderChars(el: HTMLElement, text: string) {
  el.innerHTML = "";
  const h1 = document.createElement("h1");
  h1.className =
    "font-display text-foreground leading-[0.92] tracking-[-0.05em] text-[clamp(2.6rem,9vw,9rem)]";
  for (const ch of text) {
    const span = document.createElement("span");
    span.setAttribute("data-char", "");
    span.style.display = "inline-block";
    span.style.whiteSpace = "pre";
    span.textContent = ch;
    h1.appendChild(span);
  }
  el.appendChild(h1);
}
