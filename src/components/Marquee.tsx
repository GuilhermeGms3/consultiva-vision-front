const items = [
  "Projetos",
  "Perícias",
  "Avaliações",
  "Laudos técnicos",
  "Orçamentos",
  "Consultoria",
];

export function Marquee() {
  const loop = [...items, ...items, ...items];
  return (
    <div className="border-y border-border bg-background py-6 overflow-hidden marquee-mask">
      <div
        className="flex whitespace-nowrap"
        style={{ animation: "marquee 40s linear infinite" }}
      >
        {loop.map((it, i) => (
          <span
            key={i}
            className="mx-8 font-display text-[clamp(2rem,4vw,4rem)] tracking-[-0.04em] text-foreground"
          >
            {it}
            <span className="ml-16 text-muted-foreground">/</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-33.333%) } }`}</style>
    </div>
  );
}
