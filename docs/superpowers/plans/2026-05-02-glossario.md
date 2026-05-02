# Glossário Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standalone Glossário page at `/glossario` containing 20 financial and sporting term definitions, and link to it from the four primary analysis modules.

**Architecture:** A new server-rendered Next.js App Router page (`app/glossario/page.tsx`) reads grouped term data from a new module (`lib/glossary.ts`). The data module imports the 6 existing definitions verbatim from `lib/concept-notes.ts` (single source of truth — those are not modified) and provides 14 new definitions plus group/order metadata. The 4 target module pages each get a small "Ver Glossário" link inserted below their existing title block.

**Tech Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS

**Source spec:** `docs/superpowers/specs/2026-05-02-glossario-design.md`

**No test framework is configured in this repo** (no jest/vitest/playwright in `package.json`). Verification is done via `npx tsc --noEmit`, `npm run lint`, and manual smoke-test in the dev server.

---

## File Structure

**Create:**
- `lib/glossary.ts` — group definitions, term order, definitions for 14 new terms, slug helper, merged accessor.
- `app/glossario/page.tsx` — server component rendering the Glossário page.

**Modify (link insertion only, ~5 lines per file):**
- `app/analise-individual/page.tsx` — insert link below title block (around line 73, after the subtitle `<p>`).
- `app/analise-comparativa-simples/page.tsx` — insert link below title block (around line 49, after the subtitle `<p>`).
- `app/analise-conjunta/page.tsx` — insert link below `<h1>` (around line 47).
- `app/evolucao-liga/page.tsx` — insert link below the subtitle `<p>` (around line 91).

**Untouched (verify via final `git diff` that none changed):**
- `lib/concept-notes.ts`
- `components/ConceptNotes.tsx`
- All other module pages.

---

## Task 1: Create the glossary data module

**Files:**
- Create: `lib/glossary.ts`

- [ ] **Step 1: Create `lib/glossary.ts` with the full data**

```ts
import { conceptDefinitions } from "@/lib/concept-notes";

/** Definitions for the 14 new glossary terms not already in concept-notes.ts. */
const newDefinitions: Record<string, string> = {
  "Receita c/ Transmissão + Premiações":
    "Soma das receitas com Direitos de Transmissão (TV) e Premiações esportivas (CBF, Conmebol e demais). Compõe a Receita da Atividade Esportiva.",
  "Receita c/ Match-Day + Sócio-Torcedor":
    "Soma das receitas de Match-Day (bilheteria, hospitalidade e demais receitas de jogo) e do programa Sócio-Torcedor. Compõe a Receita da Atividade Esportiva.",
  "Receita c/ Negociação de atletas":
    "Receita obtida com a venda definitiva ou cessão de direitos econômicos de atletas. Não compõe a Receita da Atividade Esportiva, mas integra a Receita Operacional.",
  "Custo da Atividade Esportiva":
    "Soma da Folha do Futebol (Salários, Encargos e Direitos de Imagem), das despesas com a operação do departamento de futebol, da Amortização do custo de aquisição de atletas e dos demais custos diretos da atividade esportiva.",
  "Resultado Operacional (Segmento Futebol)":
    "Resultado do segmento de futebol, equivalente a Receita da Atividade Esportiva − Custo da Atividade Esportiva. Não considera receitas e despesas não-operacionais nem o resultado da venda de atletas.",
  "Resultado":
    "Resultado do exercício — lucro ou prejuízo do clube/SAF após todas as receitas, custos, despesas (operacionais e financeiras), resultado da venda de atletas e impostos.",
  "Folha do Futebol + Amortização":
    "Folha do Futebol (Salários, Encargos e Direitos de Imagem) + Amortização do custo de aquisição de atletas (parcela do contrato de cada jogador reconhecida como despesa no período).",
  "Folha do Futebol + Compra de Jogadores":
    "Folha do Futebol (Salários, Encargos e Direitos de Imagem) + Aquisições de atletas no período. Aproxima o total comprometido com o elenco no exercício.",
  "Aquisições de atletas":
    "Valor comprometido com a compra de direitos federativos e/ou econômicos de atletas no exercício.",
  "Pontuação Série A":
    "Pontos conquistados pelo clube na temporada do Campeonato Brasileiro Série A.",
  "Dívida / Receita Total":
    "Razão entre Dívida Líquida e Receita Operacional. Indica quantos anos de Receita Operacional seriam necessários para quitar a Dívida Líquida.",
  "Folha do Futebol / Receita Total":
    "Razão entre Folha do Futebol e Receita Operacional. Mede o peso da folha de atletas sobre as receitas do clube.",
  "(Folha do Futebol + Amortização) / Receita Total":
    "Razão entre Folha do Futebol + Amortização do custo de aquisição de atletas e Receita Operacional.",
  "Custo da Atividade Esportiva / Receita Total":
    "Razão entre Custo da Atividade Esportiva e Receita Operacional. Mede o peso do custo total da operação esportiva sobre as receitas do clube.",
};

/** All 20 term definitions — existing 6 imported verbatim + 14 new. */
export const allDefinitions: Record<string, string> = {
  ...conceptDefinitions,
  ...newDefinitions,
};

export interface GlossaryGroup {
  id: string;
  label: string;
  terms: string[];
}

/** Five groups, in display order. Each `terms` array is in display order. */
export const glossaryGroups: GlossaryGroup[] = [
  {
    id: "receitas-resultados",
    label: "Receitas e Resultados",
    terms: [
      "Receita Operacional",
      "Receita Operacional Líquida",
      "Receita da Atividade Esportiva",
      "Receita Comercial",
      "Receita c/ Transmissão + Premiações",
      "Receita c/ Match-Day + Sócio-Torcedor",
      "Receita c/ Negociação de atletas",
      "Resultado Operacional (Segmento Futebol)",
      "Resultado",
    ],
  },
  {
    id: "custos-folha-investimento",
    label: "Custos, Folha e Investimento em Atletas",
    terms: [
      "Custo da Atividade Esportiva",
      "Folha do Futebol",
      "Folha do Futebol + Amortização",
      "Folha do Futebol + Compra de Jogadores",
      "Aquisições de atletas",
    ],
  },
  {
    id: "endividamento",
    label: "Endividamento",
    terms: ["Dívida Líquida"],
  },
  {
    id: "indicadores-gerenciais",
    label: "Indicadores Gerenciais (Razões)",
    terms: [
      "Dívida / Receita Total",
      "Folha do Futebol / Receita Total",
      "(Folha do Futebol + Amortização) / Receita Total",
      "Custo da Atividade Esportiva / Receita Total",
    ],
  },
  {
    id: "metricas-esportivas",
    label: "Métricas Esportivas",
    terms: ["Pontuação Série A"],
  },
];

/** Produce a stable URL anchor id for a term. Lowercase, accents stripped, non-alphanumerics → "-". */
export function slugifyTerm(term: string): string {
  return term
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

- [ ] **Step 2: Type-check the new file**

Run: `cd "D:/jose_americo/financials/football-clubs-financials" && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Visually inspect the term lists**

Open `lib/glossary.ts` in your editor and confirm by eye:
- 5 entries in `glossaryGroups` (Receitas e Resultados, Custos/Folha/Investimento, Endividamento, Indicadores Gerenciais, Métricas Esportivas).
- The total count of terms across all groups is 20 (9 + 5 + 1 + 4 + 1).
- Each term name in `glossaryGroups` matches a key in either `conceptDefinitions` (imported) or `newDefinitions` (defined above) — string-for-string. Pay particular attention to "Receita Operacional Líquida" (must match concept-notes.ts) and the slash spacing in "Dívida / Receita Total" etc.

Any mismatch causes that term to silently render `null` in the page (Task 2 returns `null` if `allDefinitions[term]` is missing). The smoke test in Task 7 will also catch it visually.

- [ ] **Step 4: Commit**

```bash
rtk git add lib/glossary.ts
rtk git commit -m "feat(glossary): add data module with 20 term definitions and 5 groups"
```

---

## Task 2: Create the Glossário page

**Files:**
- Create: `app/glossario/page.tsx`

- [ ] **Step 1: Create the page**

The page is a server component (no `"use client"`). It mirrors the layout of existing module pages: fixed grass background overlay, a `max-w-[1200px]` main, the `ModuleNavbar`, an `h1`, a subtitle, and `card-surface` blocks for each group. The term/definition rendering (`<strong>{term}:</strong> {definition}`) matches `components/ConceptNotes.tsx`.

```tsx
import Image from "next/image";
import ModuleNavbar from "@/components/ModuleNavbar";
import { allDefinitions, glossaryGroups, slugifyTerm } from "@/lib/glossary";

export const metadata = {
  title: "Glossário · Almanaque Financeiro",
  description:
    "Definições dos termos financeiros e esportivos utilizados no Almanaque Financeiro da Série A.",
};

export default function GlossarioPage() {
  return (
    <>
      {/* Fixed grass background + light overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/grass-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 light-page-bg-overlay" />
      </div>

      <main className="relative z-10 max-w-[1200px] mx-auto px-4 py-8">
        <ModuleNavbar />

        <h1
          className="text-3xl font-bold tracking-tight text-center mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Glossário
        </h1>
        <p
          className="text-sm text-center mb-8 max-w-2xl mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Definições dos termos financeiros e esportivos utilizados no
          Almanaque Financeiro da Série A.
        </p>

        <div className="space-y-6">
          {glossaryGroups.map((group) => (
            <section
              key={group.id}
              id={group.id}
              className="card-surface"
              aria-labelledby={`${group.id}-heading`}
            >
              <h2
                id={`${group.id}-heading`}
                className="text-xl font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                {group.label}
              </h2>
              <dl className="space-y-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                {group.terms.map((term) => {
                  const definition = allDefinitions[term];
                  if (!definition) return null;
                  const anchor = slugifyTerm(term);
                  return (
                    <div key={term} id={anchor}>
                      <dt className="inline font-bold" style={{ color: "var(--text-primary)" }}>
                        {term}:
                      </dt>{" "}
                      <dd className="inline">{definition}</dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no new errors. (Existing warnings unrelated to the new files are acceptable.)

- [ ] **Step 4: Build to confirm the route compiles**

Run: `npm run build`
Expected: build succeeds and the output includes a route entry for `/glossario`.

- [ ] **Step 5: Commit**

```bash
rtk git add app/glossario/page.tsx
rtk git commit -m "feat(glossary): add /glossario page rendering 20 terms in 5 groups"
```

---

## Task 3: Add link on Análise Individual

**Files:**
- Modify: `app/analise-individual/page.tsx` (subtitle paragraph ends around line 73)

- [ ] **Step 1: Add `Link` import**

The file already imports React/Next basics. Verify the top of the file imports `Link` from `next/link`. If not present, add this near the other imports:

```tsx
import Link from "next/link";
```

- [ ] **Step 2: Insert the "Ver Glossário" link below the subtitle paragraph**

Find this block in `app/analise-individual/page.tsx`:

```tsx
      <h1 className="text-3xl font-bold tracking-tight text-center mb-1" style={{ color: "var(--text-primary)" }}>
        Análise Individual
      </h1>
      <p className="text-center mb-6" style={{ color: "var(--text-secondary)" }}>
        Explore as finanças dos clubes do Brasileirão
      </p>
```

Change the `<p>` element to use `mb-2` instead of `mb-6`, and add a Glossário link directly after it:

```tsx
      <h1 className="text-3xl font-bold tracking-tight text-center mb-1" style={{ color: "var(--text-primary)" }}>
        Análise Individual
      </h1>
      <p className="text-center mb-2" style={{ color: "var(--text-secondary)" }}>
        Explore as finanças dos clubes do Brasileirão
      </p>
      <p className="text-center mb-6 text-sm">
        <Link
          href="/glossario"
          className="font-semibold hover:underline"
          style={{ color: "var(--brand-blue)" }}
        >
          Ver Glossário
        </Link>
      </p>
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
rtk git add app/analise-individual/page.tsx
rtk git commit -m "feat(glossary): link to /glossario from Análise Individual"
```

---

## Task 4: Add link on Análise Comparativa

**Files:**
- Modify: `app/analise-comparativa-simples/page.tsx` (subtitle paragraph ends around line 49)

- [ ] **Step 1: Add `Link` import if missing**

Verify `import Link from "next/link";` is present at the top. Add if missing.

- [ ] **Step 2: Insert the link**

Find this block:

```tsx
      <h1 className="text-3xl font-bold tracking-tight text-center mb-1" style={{ color: "var(--text-primary)" }}>
        Análise Comparativa
      </h1>
      <p className="text-center mb-6" style={{ color: "var(--text-secondary)" }}>
        Explore as finanças dos clubes do Brasileirão
      </p>
```

Replace with:

```tsx
      <h1 className="text-3xl font-bold tracking-tight text-center mb-1" style={{ color: "var(--text-primary)" }}>
        Análise Comparativa
      </h1>
      <p className="text-center mb-2" style={{ color: "var(--text-secondary)" }}>
        Explore as finanças dos clubes do Brasileirão
      </p>
      <p className="text-center mb-6 text-sm">
        <Link
          href="/glossario"
          className="font-semibold hover:underline"
          style={{ color: "var(--brand-blue)" }}
        >
          Ver Glossário
        </Link>
      </p>
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
rtk git add app/analise-comparativa-simples/page.tsx
rtk git commit -m "feat(glossary): link to /glossario from Análise Comparativa"
```

---

## Task 5: Add link on Análise Conjunta

**Files:**
- Modify: `app/analise-conjunta/page.tsx` (heading ends around line 47)

- [ ] **Step 1: Add `Link` import if missing**

Verify `import Link from "next/link";` is present. Add if missing.

- [ ] **Step 2: Insert the link**

Find this block:

```tsx
      <h1 className="text-3xl font-bold tracking-tight text-center mb-6" style={{ color: "var(--text-primary)" }}>
        Análise Conjunta
      </h1>
```

Replace with:

```tsx
      <h1 className="text-3xl font-bold tracking-tight text-center mb-2" style={{ color: "var(--text-primary)" }}>
        Análise Conjunta
      </h1>
      <p className="text-center mb-6 text-sm">
        <Link
          href="/glossario"
          className="font-semibold hover:underline"
          style={{ color: "var(--brand-blue)" }}
        >
          Ver Glossário
        </Link>
      </p>
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
rtk git add app/analise-conjunta/page.tsx
rtk git commit -m "feat(glossary): link to /glossario from Análise Conjunta"
```

---

## Task 6: Add link on Evolução Financeira da Liga

**Files:**
- Modify: `app/evolucao-liga/page.tsx` (subtitle paragraph ends around line 91)

- [ ] **Step 1: Add `Link` import if missing**

Verify `import Link from "next/link";` is present. Add if missing.

- [ ] **Step 2: Insert the link**

Find this block (the subtitle paragraph ends with "expressos em R$ milhões."):

```tsx
        <p
          className="text-sm text-center mb-8 max-w-2xl mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Evolução dos principais agregados financeiros da liga entre 2021 e
          2025. Os valores representam a soma das métricas de todos os clubes
          participantes do Brasileirão em cada temporada, expressos em R$
          milhões.
        </p>
```

Change `mb-8` to `mb-2` on the existing paragraph and add a new link paragraph immediately after:

```tsx
        <p
          className="text-sm text-center mb-2 max-w-2xl mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Evolução dos principais agregados financeiros da liga entre 2021 e
          2025. Os valores representam a soma das métricas de todos os clubes
          participantes do Brasileirão em cada temporada, expressos em R$
          milhões.
        </p>
        <p className="text-center mb-8 text-sm">
          <Link
            href="/glossario"
            className="font-semibold hover:underline"
            style={{ color: "var(--brand-blue)" }}
          >
            Ver Glossário
          </Link>
        </p>
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
rtk git add app/evolucao-liga/page.tsx
rtk git commit -m "feat(glossary): link to /glossario from Evolução Liga"
```

---

## Task 7: Final verification

**Files:** none modified

- [ ] **Step 1: Confirm zero modifications to protected files**

Run: `rtk git diff main -- lib/concept-notes.ts components/ConceptNotes.tsx`
Expected: empty output (no changes).

- [ ] **Step 2: Confirm no link was inadvertently added to other modules**

Run: `rtk git diff main -- app/compare-2-clubes app/indice-de-transparencia app/analise-de-desigualdade app/sustentabilidade-financeira app/analise-individual-historica app/page.tsx`
Expected: empty output.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build succeeds. Output should list `/glossario` among the routes.

- [ ] **Step 4: Manual smoke test in dev**

Run: `npm run dev` (then visit URLs in a browser)

Verify each:
- `http://localhost:3000/glossario` renders all 5 group cards in order, each term bold with its definition inline.
- All 20 terms appear (6 from `concept-notes.ts` plus the 14 new ones), with the 6 strings exactly matching the `concept-notes.ts` source.
- Each term has a stable anchor: e.g. visiting `http://localhost:3000/glossario#receita-operacional` scrolls to the right entry.
- `http://localhost:3000/analise-individual` shows "Ver Glossário" centered below the subtitle. Clicking it navigates to `/glossario`.
- `http://localhost:3000/analise-comparativa-simples` shows the link, navigates correctly.
- `http://localhost:3000/analise-conjunta` shows the link, navigates correctly.
- `http://localhost:3000/evolucao-liga` shows the link, navigates correctly.
- `http://localhost:3000/compare-2-clubes`, `/indice-de-transparencia`, `/analise-de-desigualdade`, `/sustentabilidade-financeira` do **not** show the link.
- `http://localhost:3000` (front page) does not show the link.

Stop the dev server when done (Ctrl+C).

- [ ] **Step 5: No final commit needed if all checks pass.**

If any check failed and required a fix, commit the fix with a focused message.
