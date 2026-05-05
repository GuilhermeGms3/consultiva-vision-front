import { useEffect, useState } from "react";

const links = [
  { label: "Serviços", href: "#servicos" },
  { label: "Processo", href: "#processo" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled
          ? "backdrop-blur-md bg-background/70 border-b border-border"
          : "bg-transparent"
        }`}
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10">
        <a href="#" className="flex items-baseline gap-2">
          <span className="font-display text-xl tracking-tight text-foreground">
            CLP
          </span>
          <span className="font-mono-mini hidden sm:inline">
            Engenharia Consultiva
          </span>
        </a>
        <ul className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-mono-mini transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contato"
          className="group relative inline-flex items-center gap-2 border border-foreground/40 px-4 py-2 font-mono-mini text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          Solicitar proposta
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </nav>
    </header>
  );
}
