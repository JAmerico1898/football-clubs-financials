# Glossário — Design Spec

**Date:** 2026-05-02
**Status:** Approved (pending implementation plan)

## Goal

Centralize the financial and sporting term definitions used across the Almanaque Financeiro into a single, browseable Glossário page, and link to it from the four most-trafficked analysis modules.

## Non-Goals

- Modify or replace any existing inline definitions on charts. Specifically, `lib/concept-notes.ts` and `components/ConceptNotes.tsx` are **not changed**.
- Provide a modal/drawer overlay. The Glossário is a standalone page only.
- Add a search box (Phase 1).
- Add the Glossário link to *every* module — only the four named below.
- Add a Glossário card to the front-page module grid.

## User Story

A user reading a chart on Análise Individual sees the metric "Custo da Atividade Esportiva", clicks "Ver Glossário" near the page heading, lands on `/glossario`, finds the term in the *Custos, Folha e Investimento em Atletas* group, reads the definition, hits Back, and continues their analysis.

## Architecture

### New files

- **`app/glossario/page.tsx`** — server component that renders the Glossário page. No client-side interactivity needed in Phase 1.
- **`lib/glossary.ts`** — data module that exports:
  - The five group definitions (id, label, ordered list of term names).
  - A `glossaryDefinitions` map for the 14 *new* terms.
  - A combined accessor that merges `conceptDefinitions` (from `lib/concept-notes.ts`, imported verbatim) with `glossaryDefinitions` so the page can render all 20 terms from a single source.
  - A helper `slugifyTerm(term: string): string` to produce stable anchor ids (e.g. `receita-operacional`).

### Modified files (link insertion only)

- `app/analise-individual/page.tsx`
- `app/analise-comparativa-simples/page.tsx`
- `app/analise-conjunta/page.tsx`
- `app/evolucao-liga/page.tsx`

Each gets a single small "Ver Glossário" link near the page heading. Styling matches the existing module header visual language (project's blue accent, same typography). The link is a Next.js `<Link href="/glossario">`.

### Untouched files

- `lib/concept-notes.ts` — definitions remain the canonical source for the original 6 terms.
- `components/ConceptNotes.tsx` — continues to render inline notes on charts unchanged.
- All other pages (`compare-2-clubes`, `indice-de-transparencia`, `analise-de-desigualdade`, `sustentabilidade-financeira`, `analise-individual-historica`) are untouched.

## Data Model

### Groups (in display order)

```ts
type GlossaryGroup = {
  id: string;        // e.g. "receitas-resultados"
  label: string;     // e.g. "Receitas e Resultados"
  terms: string[];   // ordered term names matching keys in the merged definitions map
};
```

Five groups, in this exact order:

1. **Receitas e Resultados**
   - Receita Operacional
   - Receita Operacional Líquida
   - Receita da Atividade Esportiva
   - Receita Comercial
   - Receita c/ Transmissão + Premiações
   - Receita c/ Match-Day + Sócio-Torcedor
   - Receita c/ Negociação de atletas
   - Resultado Operacional (Segmento Futebol)
   - Resultado

2. **Custos, Folha e Investimento em Atletas**
   - Custo da Atividade Esportiva
   - Folha do Futebol
   - Folha do Futebol + Amortização
   - Folha do Futebol + Compra de Jogadores
   - Aquisições de atletas

3. **Endividamento**
   - Dívida Líquida

4. **Indicadores Gerenciais (Razões)**
   - Dívida / Receita Total
   - Folha do Futebol / Receita Total
   - (Folha do Futebol + Amortização) / Receita Total
   - Custo da Atividade Esportiva / Receita Total

5. **Métricas Esportivas**
   - Pontuação Série A

### Definitions

Six terms reuse the strings already in `lib/concept-notes.ts` (Receita Operacional, Receita Operacional Líquida, Receita da Atividade Esportiva, Receita Comercial, Dívida Líquida, Folha do Futebol). The Glossário imports them — does not duplicate.

The 14 remaining terms get fresh definitions in `lib/glossary.ts`. These are drafted by the assistant from codebase context (CSV column names in `metric-config.ts`, formulas in `SSFDetailTable.tsx`, parent/child relationships among metrics) and reviewed by the user before merge.

The exact definition strings are not pinned in this spec; they are produced during implementation and reviewed by the user as part of the implementation review checkpoint.

## Page Layout

`/glossario` is a standalone page with:

- A `BackButton` at the top (matches existing module convention).
- An `h1` heading "Glossário" plus a one-sentence subtitle: *"Definições dos termos financeiros e esportivos utilizados no Almanaque."*
- Five group sections rendered as `card-surface` / `glass-card` blocks (matching the existing site).
- Within each section, an `h2` group label and a list of terms. Each term is a `<dl>` (definition list) entry — `<dt>` with the term name (bold) and an `id` anchor, `<dd>` with the definition.
- The definition rendering pattern matches `components/ConceptNotes.tsx`: `<strong>{term}:</strong> {definition}`.

The page is a server component (no client-side state, no `"use client"` needed).

## Link Placement on the 4 Modules

Insertion point: directly under the page's heading (the existing `h1` / title block) and before the first chart, controls, or filter row. Renders as a small inline element — visual style:

```tsx
<Link href="/glossario" className="...matching existing header link styling...">
  Ver Glossário
</Link>
```

Exact class names will follow whatever the surrounding heading area already uses on each page (so each page stays visually consistent with itself).

## Out of Scope / Future Phases

- Phase 2 may add: search box, the SSF terms (Receitas Relevantes, Despesas Relevantes, OLCP, RLMT, Custo com Elenco, etc.), the inequality indices (Gini, Razão Max/Min, C5, C3), the remaining sporting metrics (Público médio, % Ocupação, Sócios-Torcedores, Bilheteria, Valor do Elenco, Ticket Médio).
- Phase 3 may add: deep-link tooltips on chart legends that point to a specific `/glossario#term-id`.
- The Glossário may eventually be linked from the front-page footer or sidebar; not in this phase.

## Acceptance Criteria

- `/glossario` route exists and renders all 20 terms in the five groups in the order above.
- The 6 existing definitions on the Glossário page exactly match the strings currently in `lib/concept-notes.ts`.
- `lib/concept-notes.ts` and `components/ConceptNotes.tsx` have **zero modifications** in the resulting diff.
- "Ver Glossário" link is present on Análise Individual, Análise Comparativa (Simples), Análise Conjunta, and Evolução Financeira da Liga module pages, near the page heading.
- The link is **absent** from Compare 2 Clubes, Transparência, Desigualdade, Sustentabilidade, Análise Individual Histórica, and the front page.
- TypeScript build passes (`tsc --noEmit`) with no new errors.
- The 14 new definitions have been reviewed and accepted by the user.
