# Módulo 1 — Dual Season Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add season selector (2025/2024) to Análise Individual, with dynamic club lists, season-aware data loading for all 4 elements, centralized `useModulo1Data` hook, and `react-markdown` for summaries.

**Architecture:** The page gains a season toggle (default 2025). Changing season resets club selection and swaps the club dropdown list. All data-fetching is centralized in a `useModulo1Data` hook that takes `{ season, club }` and returns resumo, sankey, radar, and bar chart data. Each component receives its data as props instead of fetching internally. The route is renamed from `/analise-individual-2024` to `/analise-individual`.

**Tech Stack:** Next.js 15, React 19, Plotly.js (react-plotly.js), Recharts, PapaParse, react-markdown + rehype-raw

**Spec:** `specs/spec_modulo1_ajustado.md`

---

## File Structure

### Files to Create
- `lib/clubs2025.ts` — 2025 club definitions array
- `hooks/useModulo1Data.ts` — centralized data-fetching hook for all 4 elements
- `app/analise-individual/page.tsx` — new page with season selector (replaces old route)

### Files to Modify
- `lib/clubs.ts` — add `radarFileKey` to interface, add season param to URL helpers, rename `clubs` export to `clubs2024` with backward-compat alias
- `lib/bar-chart-config.ts` — rename `row2024`/`row2023` to `rowCurrent`/`rowPrior` in `MetricDef`
- `components/ClubSummary.tsx` — switch to `react-markdown` + `rehype-raw`, accept `content` as prop
- `components/SankeyChart.tsx` — accept data as props instead of fetching internally
- `components/RadarChart.tsx` — accept data as props instead of fetching internally
- `components/HorizontalBarChart.tsx` — accept data as props, dynamic year labels
- `lib/routes.ts` — update href to `/analise-individual`

### Files to Delete
- `app/analise-individual-2024/page.tsx` — replaced by new route

---

## Important Context

### Summary files are HTML, not Markdown
The `.md` files in `public/summaries/` contain raw HTML (`<h4>`, `<p>`, `<b>`). We must install `rehype-raw` alongside `react-markdown` so that HTML tags are rendered correctly.

### File naming inconsistencies
Some radar files use accented names (`Grêmio_radar_2024.json`, `ceará_radar_2025.json`) while sankey uses unaccented (`Gremio_sankey_2024.json`, `ceara_sankey_2025.json`). We add an optional `radarFileKey` to the `Club` interface for these cases.

### CSV column availability
Ceará and Mirassol (2025-only clubs) have NO column in either CSV file. The bar chart must show a friendly error for these clubs. Santos and Sport DO have CSV columns.

### Backward compatibility
`clubs.ts` is imported by many other modules. The `clubs` export must remain unchanged. We rename it internally to `clubs2024` and re-export as `clubs` for backward compat.

### Bar chart row index
The spec says "Aquisições de atletas" is at row 18, but the actual CSV has it at row 16 (0-indexed from first data row). We keep the correct value: `rowCurrent: 16`, `rowPrior: 53`.

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install react-markdown and rehype-raw**

Run:
```bash
npm install react-markdown rehype-raw
```

- [ ] **Step 2: Verify installation**

Run:
```bash
node -e "require('react-markdown'); require('rehype-raw'); console.log('OK')"
```
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install react-markdown and rehype-raw for summary rendering"
```

---

## Task 2: Update `lib/clubs.ts` — season-aware interface and URL helpers

**Files:**
- Modify: `lib/clubs.ts`

- [ ] **Step 1: Add `radarFileKey` to Club interface and season param to URL helpers**

Update `lib/clubs.ts` to:

```ts
export type Season = "2024" | "2025";

export interface Club {
  name: string;
  fileKey: string;
  radarFileKey?: string; // if radar file uses different naming than fileKey
  iconFile: string;
  csvColumn: string;
}

// 2024 clubs — also exported as `clubs` for backward compatibility with other modules
export const clubs2024: Club[] = [
  { name: "Vasco", fileKey: "Vasco", iconFile: "Vasco.png", csvColumn: "Vasco" },
  { name: "Athletico", fileKey: "Athletico", iconFile: "Athletico.png", csvColumn: "Athletico" },
  { name: "Atlético", fileKey: "Atletico", iconFile: "Atletico.png", csvColumn: "Atlético" },
  { name: "Atlético GO", fileKey: "Atletico_GO", iconFile: "AtleticoGO.png", csvColumn: "Atlético GO" },
  { name: "Bahia", fileKey: "Bahia", iconFile: "Bahia.png", csvColumn: "Bahia" },
  { name: "Botafogo", fileKey: "Botafogo", iconFile: "Botafogo.png", csvColumn: "Botafogo" },
  { name: "Corinthians", fileKey: "Corinthians", iconFile: "Corinthians.png", csvColumn: "Corinthians" },
  { name: "Criciúma", fileKey: "Criciuma", iconFile: "Criciuma.png", csvColumn: "Criciúma" },
  { name: "Cruzeiro", fileKey: "Cruzeiro", iconFile: "Cruzeiro.png", csvColumn: "Cruzeiro" },
  { name: "Cuiabá", fileKey: "Cuiaba", iconFile: "Cuiaba.png", csvColumn: "Cuiabá" },
  { name: "Flamengo", fileKey: "Flamengo", iconFile: "Flamengo.png", csvColumn: "Flamengo" },
  { name: "Fluminense", fileKey: "Fluminense", iconFile: "Fluminense.png", csvColumn: "Fluminense" },
  { name: "Fortaleza", fileKey: "Fortaleza", iconFile: "Fortaleza.png", csvColumn: "Fortaleza" },
  { name: "Grêmio", fileKey: "Gremio", radarFileKey: "Grêmio", iconFile: "Gremio.png", csvColumn: "Grêmio" },
  { name: "Internacional", fileKey: "Internacional", iconFile: "Internacional.png", csvColumn: "Internacional" },
  { name: "Juventude", fileKey: "Juventude", iconFile: "Juventude.png", csvColumn: "Juventude" },
  { name: "Palmeiras", fileKey: "Palmeiras", iconFile: "Palmeiras.png", csvColumn: "Palmeiras" },
  { name: "São Paulo", fileKey: "Sao_Paulo", iconFile: "SaoPaulo.png", csvColumn: "São Paulo" },
  { name: "Vitória", fileKey: "Vitoria", iconFile: "Vitoria.png", csvColumn: "Vitória" },
];

// Backward-compat alias — other modules import `clubs` and expect the 2024 list
export const clubs = clubs2024;

export const extraChartClubs: Club[] = [
  { name: "Red Bull Bragantino", fileKey: "RedBullBragantino", iconFile: "Red Bull Bragantino.png", csvColumn: "Red Bull Bragantino" },
];

export const allChartClubs: Club[] = [...clubs, ...extraChartClubs];

export const DEFAULT_CLUB = "Vasco";

export function getSankeyUrl(club: Club, season: Season = "2024"): string {
  return `/sankey/${club.fileKey}_sankey_${season}.json`;
}

export function getRadarUrl(club: Club, season: Season = "2024"): string {
  const key = club.radarFileKey || club.fileKey;
  return `/radar/${key}_radar_${season}.json`;
}

export function getIconUrl(club: Club): string {
  return `/clubs/${club.iconFile}`;
}

export function getSummaryUrl(club: Club, season: Season = "2024"): string {
  return `/summaries/resumo_${club.fileKey.toLowerCase()}_${season}.md`;
}

export function getBarChartCsvUrl(season: Season): string {
  return `/data/Painel_Consolidado_Moeda_Cte_${season}.csv`;
}
```

- [ ] **Step 2: Verify build compiles**

Run:
```bash
npx next build 2>&1 | tail -5
```
Expected: Build succeeds (URL helpers default to "2024" so existing callers still work).

- [ ] **Step 3: Commit**

```bash
git add lib/clubs.ts
git commit -m "feat: add Season type, radarFileKey, and season params to URL helpers in clubs.ts"
```

---

## Task 3: Create `lib/clubs2025.ts`

**Files:**
- Create: `lib/clubs2025.ts`

- [ ] **Step 1: Create the 2025 clubs array**

Create `lib/clubs2025.ts`:

```ts
import { Club } from "./clubs";

export const clubs2025: Club[] = [
  { name: "Vasco", fileKey: "Vasco", iconFile: "Vasco.png", csvColumn: "Vasco" },
  { name: "Atlético", fileKey: "Atletico", iconFile: "Atletico.png", csvColumn: "Atlético" },
  { name: "Bahia", fileKey: "Bahia", iconFile: "Bahia.png", csvColumn: "Bahia" },
  { name: "Botafogo", fileKey: "Botafogo", iconFile: "Botafogo.png", csvColumn: "Botafogo" },
  { name: "Ceará", fileKey: "ceara", radarFileKey: "ceará", iconFile: "Ceará.png", csvColumn: "Ceará" },
  { name: "Corinthians", fileKey: "Corinthians", iconFile: "Corinthians.png", csvColumn: "Corinthians" },
  { name: "Cruzeiro", fileKey: "Cruzeiro", iconFile: "Cruzeiro.png", csvColumn: "Cruzeiro" },
  { name: "Flamengo", fileKey: "Flamengo", iconFile: "Flamengo.png", csvColumn: "Flamengo" },
  { name: "Fluminense", fileKey: "Fluminense", iconFile: "Fluminense.png", csvColumn: "Fluminense" },
  { name: "Fortaleza", fileKey: "Fortaleza", iconFile: "Fortaleza.png", csvColumn: "Fortaleza" },
  { name: "Grêmio", fileKey: "Gremio", radarFileKey: "Grêmio", iconFile: "Gremio.png", csvColumn: "Grêmio" },
  { name: "Internacional", fileKey: "Internacional", iconFile: "Internacional.png", csvColumn: "Internacional" },
  { name: "Juventude", fileKey: "Juventude", iconFile: "Juventude.png", csvColumn: "Juventude" },
  { name: "Mirassol", fileKey: "mirassol", iconFile: "Mirassol.png", csvColumn: "Mirassol" },
  { name: "Palmeiras", fileKey: "Palmeiras", iconFile: "Palmeiras.png", csvColumn: "Palmeiras" },
  { name: "Santos", fileKey: "santos", iconFile: "Santos.png", csvColumn: "Santos" },
  { name: "São Paulo", fileKey: "Sao_Paulo", iconFile: "SaoPaulo.png", csvColumn: "São Paulo" },
  { name: "Sport", fileKey: "sport", iconFile: "Sport.png", csvColumn: "Sport" },
  { name: "Vitória", fileKey: "Vitoria", iconFile: "Vitoria.png", csvColumn: "Vitória" },
];
```

Note: Vasco is first, all others in alphabetical order. This matches the spec requirement.

- [ ] **Step 2: Commit**

```bash
git add lib/clubs2025.ts
git commit -m "feat: add 2025 clubs list"
```

---

## Task 4: Update `lib/bar-chart-config.ts` — generic row field names

**Files:**
- Modify: `lib/bar-chart-config.ts`

- [ ] **Step 1: Rename row fields from year-specific to generic**

Replace the entire file content with:

```ts
export interface MetricDef {
  label: string;
  rowCurrent: number; // 0-based row index for current season data
  rowPrior: number;   // 0-based row index for prior season data
  category: "receita" | "despesa" | "resultado" | "passivo";
}

export const metrics: MetricDef[] = [
  // Receita (green)
  { label: "Receita Operacional", rowCurrent: 0, rowPrior: 37, category: "receita" },
  { label: "Receita Recorrente", rowCurrent: 1, rowPrior: 38, category: "receita" },
  { label: "Transmissão + Premiações", rowCurrent: 2, rowPrior: 39, category: "receita" },
  { label: "Receita Comercial", rowCurrent: 3, rowPrior: 40, category: "receita" },
  { label: "Match-Day + Sócio-Torcedor", rowCurrent: 4, rowPrior: 41, category: "receita" },
  { label: "Negociação de Atletas", rowCurrent: 5, rowPrior: 42, category: "receita" },
  // Despesa (red)
  { label: "Custo das Atividades Esportivas", rowCurrent: 9, rowPrior: 46, category: "despesa" },
  { label: "Folha do Futebol", rowCurrent: 6, rowPrior: 43, category: "despesa" },
  { label: "Folha + Amortização", rowCurrent: 7, rowPrior: 44, category: "despesa" },
  { label: "Aquisições de Atletas", rowCurrent: 16, rowPrior: 53, category: "despesa" },
  // Resultado (blue)
  { label: "Resultado Operacional", rowCurrent: 10, rowPrior: 47, category: "resultado" },
  { label: "Resultado", rowCurrent: 11, rowPrior: 48, category: "resultado" },
  // Passivo (orange)
  { label: "Dívida Líquida", rowCurrent: 12, rowPrior: 49, category: "passivo" },
];

export const categoryColors: Record<string, { dark: string; light: string }> = {
  receita: { dark: "#2E7D32", light: "#81C784" },
  despesa: { dark: "#C62828", light: "#EF9A9A" },
  resultado: { dark: "#1565C0", light: "#90CAF9" },
  passivo: { dark: "#E65100", light: "#FFCC80" },
};
```

- [ ] **Step 2: Verify no other file references the old field names**

Only `HorizontalBarChart.tsx` uses `row2024`/`row2023` (already confirmed via grep). It will be updated in Task 9.

- [ ] **Step 3: Commit**

```bash
git add lib/bar-chart-config.ts
git commit -m "refactor: rename row2024/row2023 to rowCurrent/rowPrior in bar-chart-config"
```

---

## Task 5: Create `hooks/useModulo1Data.ts`

**Files:**
- Create: `hooks/useModulo1Data.ts`

- [ ] **Step 1: Create the centralized data-fetching hook**

Create `hooks/useModulo1Data.ts`:

```ts
"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  Club,
  Season,
  getSankeyUrl,
  getRadarUrl,
  getSummaryUrl,
  getBarChartCsvUrl,
} from "@/lib/clubs";
import { metrics } from "@/lib/bar-chart-config";

export interface BarDatum {
  label: string;
  valCurrent: number;
  valPrior: number;
  category: string;
}

export interface Modulo1Data {
  resumoHtml: string | null;
  resumoLoading: boolean;

  sankeyData: { data: any[]; layout: Record<string, any> } | null;
  sankeyError: string | null;
  sankeyLoading: boolean;

  radarData: { data: any[]; layout: Record<string, any> } | null;
  radarError: string | null;
  radarLoading: boolean;

  barData: BarDatum[] | null;
  barError: string | null;
  barLoading: boolean;
  barNoPriorData: boolean;
}

export function useModulo1Data(club: Club | null, season: Season): Modulo1Data {
  const [resumoHtml, setResumoHtml] = useState<string | null>(null);
  const [resumoLoading, setResumoLoading] = useState(false);

  const [sankeyData, setSankeyData] = useState<Modulo1Data["sankeyData"]>(null);
  const [sankeyError, setSankeyError] = useState<string | null>(null);
  const [sankeyLoading, setSankeyLoading] = useState(false);

  const [radarData, setRadarData] = useState<Modulo1Data["radarData"]>(null);
  const [radarError, setRadarError] = useState<string | null>(null);
  const [radarLoading, setRadarLoading] = useState(false);

  const [barData, setBarData] = useState<BarDatum[] | null>(null);
  const [barError, setBarError] = useState<string | null>(null);
  const [barLoading, setBarLoading] = useState(false);
  const [barNoPriorData, setBarNoPriorData] = useState(false);

  // Resumo
  useEffect(() => {
    if (!club) { setResumoHtml(null); return; }
    setResumoLoading(true);
    setResumoHtml(null);
    fetch(getSummaryUrl(club, season))
      .then((res) => (res.ok ? res.text() : null))
      .then((text) => setResumoHtml(text))
      .catch(() => setResumoHtml(null))
      .finally(() => setResumoLoading(false));
  }, [club, season]);

  // Sankey
  useEffect(() => {
    if (!club) { setSankeyData(null); setSankeyError(null); return; }
    setSankeyLoading(true);
    setSankeyError(null);
    setSankeyData(null);
    fetch(getSankeyUrl(club, season))
      .then((res) => {
        if (!res.ok) throw new Error(`Dados não encontrados para ${club.name}`);
        return res.json();
      })
      .then((json) => {
        const layout = json.layout || {};
        delete layout.title;
        layout.margin = { ...(layout.margin || {}), t: 120, l: 30, r: 30, b: 30 };
        setSankeyData({ data: json.data, layout });
      })
      .catch((err) => setSankeyError(err.message))
      .finally(() => setSankeyLoading(false));
  }, [club, season]);

  // Radar
  useEffect(() => {
    if (!club) { setRadarData(null); setRadarError(null); return; }
    setRadarLoading(true);
    setRadarError(null);
    setRadarData(null);
    fetch(getRadarUrl(club, season))
      .then((res) => {
        if (!res.ok) throw new Error(`Dados do radar não encontrados para ${club.name}`);
        return res.json();
      })
      .then((json) => setRadarData({ data: json.data, layout: json.layout || {} }))
      .catch((err) => setRadarError(err.message))
      .finally(() => setRadarLoading(false));
  }, [club, season]);

  // Bar chart
  useEffect(() => {
    if (!club) { setBarData(null); setBarError(null); setBarNoPriorData(false); return; }
    setBarLoading(true);
    setBarError(null);
    setBarData(null);
    setBarNoPriorData(false);

    fetch(getBarChartCsvUrl(season))
      .then((res) => {
        if (!res.ok) throw new Error("Não foi possível carregar os dados CSV");
        return res.text();
      })
      .then((csvText) => {
        const parsed = Papa.parse(csvText, { header: false, skipEmptyLines: true });
        const rows = parsed.data as string[][];
        const header = rows[0];
        const colIdx = header.indexOf(club.csvColumn);

        if (colIdx === -1) {
          throw new Error(`Coluna "${club.csvColumn}" não encontrada no CSV`);
        }

        const result: BarDatum[] = metrics.map((m) => ({
          label: m.label,
          valCurrent: parseFloat(rows[m.rowCurrent + 1]?.[colIdx] || "0") || 0,
          valPrior: parseFloat(rows[m.rowPrior + 1]?.[colIdx] || "0") || 0,
          category: m.category,
        }));

        // Check if all prior values are zero (club may not have existed in prior season)
        const allPriorZero = result.every((d) => d.valPrior === 0);
        setBarNoPriorData(allPriorZero);
        setBarData(result);
      })
      .catch((err) => setBarError(err.message))
      .finally(() => setBarLoading(false));
  }, [club, season]);

  return {
    resumoHtml,
    resumoLoading,
    sankeyData,
    sankeyError,
    sankeyLoading,
    radarData,
    radarError,
    radarLoading,
    barData,
    barError,
    barLoading,
    barNoPriorData,
  };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit hooks/useModulo1Data.ts 2>&1 | head -10
```

- [ ] **Step 3: Commit**

```bash
git add hooks/useModulo1Data.ts
git commit -m "feat: create useModulo1Data hook for centralized data fetching"
```

---

## Task 6: Update `components/ClubSummary.tsx` — react-markdown + props-based

**Files:**
- Modify: `components/ClubSummary.tsx`

- [ ] **Step 1: Rewrite ClubSummary to accept content as prop and use react-markdown**

Replace `components/ClubSummary.tsx` with:

```tsx
"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface ClubSummaryProps {
  content: string | null;
  loading?: boolean;
  clubSelected?: boolean;
}

export default function ClubSummary({ content, loading, clubSelected }: ClubSummaryProps) {
  if (loading) return <p className="text-center text-gray-500 py-4">Carregando resumo...</p>;
  if (!content && clubSelected) {
    return <p className="text-center text-gray-500 italic py-4">Resumo não disponível para este clube.</p>;
  }
  if (!content) return null;

  return (
    <div
      className="max-w-2xl mx-auto mb-6 px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-sm leading-relaxed
        [&_h4]:font-semibold [&_h4]:text-base [&_h4]:mt-2 [&_h4]:mb-1
        [&_p]:my-1 [&_p]:text-gray-700
        [&_b]:font-semibold"
    >
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
    </div>
  );
}
```

Note: `rehypeRaw` is needed because the `.md` files contain raw HTML (`<h4>`, `<p>`, `<b>` tags).

- [ ] **Step 2: Commit**

```bash
git add components/ClubSummary.tsx
git commit -m "refactor: ClubSummary uses react-markdown with rehype-raw, accepts content as prop"
```

---

## Task 7: Update `components/SankeyChart.tsx` — props-based

**Files:**
- Modify: `components/SankeyChart.tsx`

- [ ] **Step 1: Rewrite SankeyChart to accept data as props**

Replace `components/SankeyChart.tsx` with:

```tsx
"use client";

import PlotlyChart from "./PlotlyChart";

interface SankeyChartProps {
  clubName: string;
  data: { data: any[]; layout: Record<string, any> } | null;
  error: string | null;
  loading: boolean;
}

export default function SankeyChart({ clubName, data, error, loading }: SankeyChartProps) {
  if (loading) return <p className="text-center text-gray-500 py-8">Carregando diagrama Sankey...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;
  if (!data) return null;

  return (
    <div>
      <div className="text-center mb-2">
        <p style={{ fontSize: 25, fontWeight: "bold" }}>{clubName}</p>
        <p style={{ fontSize: 20 }}>Demonstração de Resultado</p>
      </div>
      <div>
        <PlotlyChart
          data={data.data}
          layout={{
            ...data.layout,
            autosize: true,
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/SankeyChart.tsx
git commit -m "refactor: SankeyChart accepts data as props instead of fetching internally"
```

---

## Task 8: Update `components/RadarChart.tsx` — props-based

**Files:**
- Modify: `components/RadarChart.tsx`

- [ ] **Step 1: Rewrite RadarChart to accept data as props**

Replace `components/RadarChart.tsx` with:

```tsx
"use client";

import PlotlyChart from "./PlotlyChart";

interface RadarChartProps {
  data: { data: any[]; layout: Record<string, any> } | null;
  error: string | null;
  loading: boolean;
}

export default function RadarChart({ data, error, loading }: RadarChartProps) {
  if (loading) return <p className="text-center text-gray-500 py-8">Carregando gráfico radar...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;
  if (!data) return null;

  return (
    <div style={{ minHeight: 500, overflowX: "auto" }}>
      <div style={{ width: 870, margin: "0 auto" }}>
        <PlotlyChart
          data={data.data}
          layout={{
            ...data.layout,
            width: 870,
            height: 870,
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/RadarChart.tsx
git commit -m "refactor: RadarChart accepts data as props instead of fetching internally"
```

---

## Task 9: Update `components/HorizontalBarChart.tsx` — props-based + dynamic years

**Files:**
- Modify: `components/HorizontalBarChart.tsx`

- [ ] **Step 1: Rewrite HorizontalBarChart to accept data as props with dynamic year labels**

Replace `components/HorizontalBarChart.tsx` with:

```tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { categoryColors } from "@/lib/bar-chart-config";
import type { Season } from "@/lib/clubs";

export interface BarDatum {
  label: string;
  valCurrent: number;
  valPrior: number;
  category: string;
}

interface HorizontalBarChartProps {
  clubName: string;
  season: Season;
  data: BarDatum[] | null;
  error: string | null;
  loading: boolean;
  noPriorData: boolean;
}

function yearLabels(season: Season): { current: string; prior: string } {
  return season === "2025"
    ? { current: "2025", prior: "2024" }
    : { current: "2024", prior: "2023" };
}

function formatBRL(v: number): string {
  return `R$ ${v.toFixed(0)} mi`;
}

function CustomTooltip({ active, payload, label, years }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const sorted = [...payload].sort((a: any, b: any) => {
    if (a.dataKey === "valCurrent") return -1;
    if (b.dataKey === "valCurrent") return 1;
    return 0;
  });
  return (
    <div className="bg-white border border-gray-200 rounded shadow px-3 py-2 text-sm">
      <p className="font-semibold mb-1">{label}</p>
      {sorted.map((entry: any) => (
        <p key={entry.dataKey} style={{ color: entry.dataKey === "valPrior" ? "#999" : entry.color }}>
          {entry.name}: {formatBRL(Number(entry.value))}
        </p>
      ))}
    </div>
  );
}

export default function HorizontalBarChart({
  clubName,
  season,
  data,
  error,
  loading,
  noPriorData,
}: HorizontalBarChartProps) {
  const years = yearLabels(season);

  if (loading) return <p className="text-center text-gray-500 py-8">Carregando gráfico de barras...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;
  if (!data) return null;

  return (
    <div>
      <div className="text-center mb-4">
        <p style={{ fontSize: 25, fontWeight: "bold" }}>{clubName}</p>
        <p style={{ fontSize: 20 }}>Comparativo {years.current} vs {years.prior}</p>
      </div>
      {noPriorData && (
        <p className="text-center text-amber-600 text-sm mb-2">
          Dados do ano anterior não disponíveis para este clube.
        </p>
      )}
      <div className="flex justify-center gap-6 mt-2 mb-2 text-sm">
        <div className="flex items-center gap-2">
          <span style={{ display: "inline-block", width: 14, height: 14, backgroundColor: "#333", borderRadius: 2 }} />
          <span>{years.current} (cor forte)</span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ display: "inline-block", width: 14, height: 14, backgroundColor: "#aaa", borderRadius: 2 }} />
          <span>{years.prior} (cor leve)</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={data.length * 55 + 60}>
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 40, bottom: 10, left: 220 }}>
          <XAxis
            type="number"
            tickFormatter={(v: number) => formatBRL(v)}
            style={{ fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={210}
            tick={{ fontSize: 14, fontWeight: 500 }}
          />
          <Tooltip content={<CustomTooltip years={years} />} />
          <ReferenceLine x={0} stroke="#666" />
          <Bar dataKey="valCurrent" name={years.current} barSize={18}>
            {data.map((d, i) => (
              <Cell key={`cur-${i}`} fill={categoryColors[d.category].dark} />
            ))}
          </Bar>
          <Bar dataKey="valPrior" name={years.prior} barSize={18}>
            {data.map((d, i) => (
              <Cell key={`pri-${i}`} fill={categoryColors[d.category].light} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/HorizontalBarChart.tsx
git commit -m "refactor: HorizontalBarChart accepts data as props with dynamic year labels"
```

---

## Task 10: Update route and create new page with season selector

**Files:**
- Modify: `lib/routes.ts` — change href
- Create: `app/analise-individual/page.tsx` — new page with season selector
- Delete: `app/analise-individual-2024/page.tsx` — old page

- [ ] **Step 1: Update the route in `lib/routes.ts`**

Change the href from `"/analise-individual-2024"` to `"/analise-individual"`:

In `lib/routes.ts`, replace:
```ts
    href: "/analise-individual-2024",
```
with:
```ts
    href: "/analise-individual",
```

- [ ] **Step 2: Create the new page `app/analise-individual/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { clubs2024, DEFAULT_CLUB, getIconUrl, type Club, type Season } from "@/lib/clubs";
import { clubs2025 } from "@/lib/clubs2025";
import BackButton from "@/components/BackButton";
import SankeyChart from "@/components/SankeyChart";
import RadarChart from "@/components/RadarChart";
import HorizontalBarChart from "@/components/HorizontalBarChart";
import ClubSummary from "@/components/ClubSummary";
import { useModulo1Data } from "@/hooks/useModulo1Data";

function getClubsForSeason(season: Season): Club[] {
  return season === "2025" ? clubs2025 : clubs2024;
}

export default function AnaliseIndividual() {
  const [season, setSeason] = useState<Season>("2025");
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const clubList = getClubsForSeason(season);
  const club = selectedName ? clubList.find((c) => c.name === selectedName) ?? null : null;

  const {
    resumoHtml,
    resumoLoading,
    sankeyData,
    sankeyError,
    sankeyLoading,
    radarData,
    radarError,
    radarLoading,
    barData,
    barError,
    barLoading,
    barNoPriorData,
  } = useModulo1Data(club, season);

  function handleSeasonChange(newSeason: Season) {
    setSeason(newSeason);
    setSelectedName(null); // Reset club when season changes
  }

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8">
      <BackButton />

      <h1 className="text-2xl font-bold text-center mb-1">
        Análise Individual
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Explore as finanças dos clubes do Brasileirão
      </p>

      {/* Season selector */}
      <div className="flex justify-center gap-2 mb-4">
        {(["2025", "2024"] as Season[]).map((s) => (
          <button
            key={s}
            onClick={() => handleSeasonChange(s)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              season === s
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Club dropdown + icon */}
      <div className="flex flex-col items-center gap-4 mb-6">
        <select
          value={selectedName ?? ""}
          onChange={(e) => setSelectedName(e.target.value || null)}
          className="px-4 py-2 border border-gray-300 rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione um clube</option>
          {clubList.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        {club && (
          <img
            src={getIconUrl(club)}
            alt={club.name}
            width={96}
            height={96}
            className="object-contain"
          />
        )}
      </div>

      {/* Prompt when no club selected */}
      {!club && (
        <p className="text-center text-gray-500 italic py-8">
          Selecione um clube para visualizar a análise.
        </p>
      )}

      {/* Content — only rendered when a club is selected */}
      {club && (
        <>
          <ClubSummary content={resumoHtml} loading={resumoLoading} clubSelected={!!club} />

          <hr className="mb-8" />

          <div className="flex flex-col gap-16">
            <section>
              <SankeyChart
                clubName={club.name}
                data={sankeyData}
                error={sankeyError}
                loading={sankeyLoading}
              />
            </section>

            <section>
              <RadarChart
                data={radarData}
                error={radarError}
                loading={radarLoading}
              />
            </section>

            <section>
              <HorizontalBarChart
                clubName={club.name}
                season={season}
                data={barData}
                error={barError}
                loading={barLoading}
                noPriorData={barNoPriorData}
              />
            </section>
          </div>
        </>
      )}
    </main>
  );
}
```

- [ ] **Step 3: Delete the old page**

```bash
rm -rf app/analise-individual-2024/
```

- [ ] **Step 4: Verify the app compiles and runs**

Run:
```bash
npx next build 2>&1 | tail -10
```
Expected: Build succeeds with no errors.

- [ ] **Step 5: Manual smoke test**

Run `npm run dev` and verify:
1. Navigate to `/analise-individual`
2. Season toggle shows 2025 (default) and 2024
3. Club dropdown shows 2025 clubs with Vasco first
4. Select Vasco → all 4 elements render
5. Switch to 2024 → club resets, dropdown shows 2024 clubs
6. Select Vasco in 2024 → all 4 elements render
7. Select Ceará in 2025 → resumo/sankey/radar load; bar chart shows friendly error (no CSV column)

- [ ] **Step 6: Commit**

```bash
git add lib/routes.ts app/analise-individual/page.tsx
git rm -r app/analise-individual-2024/
git commit -m "feat: add season selector to Análise Individual, rename route to /analise-individual"
```

---

## Task 11: Fix other modules that may break from component API changes

**Files:**
- Check: All files that import `SankeyChart`, `RadarChart`, `ClubSummary`, `HorizontalBarChart`

- [ ] **Step 1: Check for other usages of the modified components**

The components `SankeyChart`, `RadarChart`, `ClubSummary`, and `HorizontalBarChart` changed their props API. Verify no other page imports them:

```bash
grep -r "SankeyChart\|RadarChart\|ClubSummary\|HorizontalBarChart" app/ --include="*.tsx" -l
```

If other pages use these components with the old API (passing `club` prop), they need to be updated to pass the new props. If only `analise-individual` uses them, no action needed.

- [ ] **Step 2: Fix any broken imports (if found)**

For each file found in step 1 (other than `app/analise-individual/page.tsx`), update the component usage to match the new props API, or create wrapper components that maintain the old API.

- [ ] **Step 3: Full build verification**

Run:
```bash
npx next build 2>&1 | tail -20
```
Expected: Build succeeds.

- [ ] **Step 4: Commit (if changes were made)**

```bash
git add -A
git commit -m "fix: update component usages after API refactor"
```
