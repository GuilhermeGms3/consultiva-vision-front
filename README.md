# consultiva-vision-main

Landing page moderna para consultoria/arquitetura, com narrativa visual, animacoes e componentes UI reutilizaveis.

## Stack

- React 19
- TanStack Router / TanStack Start
- Vite
- TypeScript
- Tailwind CSS
- Componentes Radix UI
- Integracao Cloudflare (wrangler)

## Como rodar

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Estrutura principal

- `src/components/`: secoes visuais e componentes de layout
- `src/components/ui/`: biblioteca de componentes reutilizaveis
- `src/routes/`: rotas da aplicacao
- `src/assets/`: imagens e recursos de midia

## Destaques tecnicos

- Storytelling visual em secoes progressivas
- Blocos de UI componiveis para acelerar iteracao
- Base preparada para deploy em edge/cloudflare

## Proximos passos

- Otimizacao de performance (LCP/CLS)
- Testes de interface (Playwright)
- Conteudo multilanguage (pt-BR/en)
