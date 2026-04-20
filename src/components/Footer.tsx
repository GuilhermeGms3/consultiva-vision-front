export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-lg">CLP</span>
          <span className="font-mono-mini">Engenharia Consultiva</span>
        </div>
        <span className="font-mono-mini">
          © {new Date().getFullYear()} — Todos os direitos reservados
        </span>
      </div>
    </footer>
  );
}
