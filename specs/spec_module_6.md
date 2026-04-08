# Spec — Módulo 6: Análise de Desigualdade (v4 — pinned lines + dropdown selector)
## Football Clubs Financials App (Next.js)

---

## Overview

Módulo 6 is named **"Análise de Desigualdade"**. It presents four inequality metrics computed for Brazilian Brasileirão clubs across multiple revenue and cost categories, over five seasons (2021–2025). **No European league comparison is included.** No club selection is required — all charts load immediately on page open.

The module is structured as follows:
1. Brief explanation of the Gini Index → one multi-line chart (Plot 1)
2. Brief explanation of the Razão Max/Min → one multi-line chart (Plot 2)
3. Brief explanation of the Concentração C5 → one multi-line chart (Plot 3)
4. Brief explanation of the Concentração C3 → one multi-line chart (Plot 4)

Each plot always shows **2 pinned lines** (fixed, never removable) plus up to **3 optional lines** chosen by the user via a shared dropdown selector. The dropdown is shared — one selection controls all 4 charts simultaneously.

---

## Data Source

- **File:** `/football-clubs-financials/public/data/desigualdade.csv`

### CSV Structure

The CSV is organised into **four metric blocks**, each with:
1. **Label row** — metric name in column 0, years (2021–2025) in columns 1–5
2. **Data rows** — one row per revenue/cost category, with computed metric values per year
3. **Empty separator row** — blank row between blocks

### Full CSV layout (1-indexed, as in the file)

| Rows | Metric block |
|---|---|
| 1–10 | **Índice de Gini** (header row 1, data rows 2–10) |
| 11 | *(empty separator)* |
| 12–21 | **Razão Max/Min** (header row 12, data rows 13–21) |
| 22 | *(empty separator)* |
| 23–32 | **Concentração C5 (Top 5)** (header row 23, data rows 24–32) |
| 33 | *(empty separator)* |
| 34–43 | **Concentração C3 (Top 3)** (header row 34, data rows 35–43) |

### Column mapping (same for all four metric blocks)

| Column index (0-indexed) | Content |
|---|---|
| 0 | Category label (e.g., `"Receita Operacional"`) |
| 1 | 2021 value |
| 2 | 2022 value |
| 3 | 2023 value |
| 4 | 2024 value |
| 5 | 2025 value |

### Category rows (same for all four metric blocks, in order)

| Row # within block | Category label | Pinned? |
|---|---|---|
| 1 | `Receita Operacional` | No — optional |
| 2 | `Receita da Atividade Esportiva` | **Yes — always shown** |
| 3 | `Receita c/ Transmissão + Premiações` | No — optional |
| 4 | `Receita Comercial` | No — optional |
| 5 | `Receita c/ Match-Day + Sócio-Torcedor` | No — optional |
| 6 | `Custo da Atividade Esportiva` | **Yes — always shown** |
| 7 | `Folha do Futebol` | No — optional |
| 8 | `Folha do Futebol + Compra de Jogadores` | No — optional |
| 9 | `Pontuação Série A` | No — optional |

### Important data note — 2025 values for C3 and C5

For the **Concentração C3** and **Concentração C5** blocks, all revenue/cost category rows show `1.0` for 2025. **Pontuação Série A** has a real value for 2025 in both blocks. Treat the `1.0` values as data present in the CSV and render them as-is; do not suppress them. A footnote should be added below Plots 3 and 4 explaining that the 2025 season is in progress and the concentration figures will be updated as results are finalised.

### Parsing strategy

Parse with `papaparse` using `header: false`. Identify each metric block by scanning for a row where column 0 equals one of the four known label strings (`"Índice de Gini"`, `"Razão Max/Min"`, `"Concentração C5 (Top 5)"`, `"Concentração C3 (Top 3)"`). The 9 data rows follow immediately after the label row. Extract all 4 blocks in a **single CSV parse pass** — do not re-fetch the file multiple times.

---

## Category Selector — Shared Dropdown

### Placement

A single dropdown selector is placed **above Plot 1**, inside its own labelled section, before the first explanatory text. It controls all 4 charts simultaneously. It does **not** repeat per chart.

```
┌──────────────────────────────────────────────────────────────┐
│  🔽  Adicionar variáveis ao gráfico  (dropdown, max 3)       │
│  [Receita da Atividade Esportiva — fixo]                     │
│  [Custo da Atividade Esportiva — fixo]                       │
├──────────────────────────────────────────────────────────────┤
│  [Section: Índice de Gini]  — explanation text               │
│  Plot 1                                                      │
├──────────────────────────────────────────────────────────────┤
│  [Section: Razão Max/Min]  — explanation text                │
│  Plot 2                                                      │
│  ...                                                         │
└──────────────────────────────────────────────────────────────┘
```

### Behaviour

- The dropdown lists the **7 optional categories** (all categories except the 2 pinned ones):
  - `Receita Operacional`
  - `Receita c/ Transmissão + Premiações`
  - `Receita Comercial`
  - `Receita c/ Match-Day + Sócio-Torcedor`
  - `Folha do Futebol`
  - `Folha do Futebol + Compra de Jogadores`
  - `Pontuação Série A`
- The user may select **0 to 3** optional categories. When 3 are already selected, remaining options in the dropdown are disabled (greyed out) with a tooltip: `"Máximo de 3 variáveis adicionais atingido"`.
- Selected items appear as **removable tags/chips** below the dropdown (e.g., `Receita Comercial ✕`). Clicking ✕ deselects that item.
- On initial page load: **0 optional categories selected** — only the 2 pinned lines are visible on all 4 charts.
- State is managed with `useState`. **No persistence** between page navigations (reset on remount is acceptable).
- The label above the dropdown reads: `"Variáveis adicionais (máx. 3):"`.
- Below the pinned-line indicators, show a small note: `"Receita da Atividade Esportiva e Custo da Atividade Esportiva são sempre exibidas."` in muted text.

### Implementation note

Use a **multi-select dropdown component**. If a third-party library is already used in the project, use it. Otherwise, implement a custom dropdown: a button that opens a `<ul>` list of checkboxes, each with the category name and color dot. Close the dropdown on outside click (`useEffect` + `document.addEventListener`).

---

## Page Layout

```
┌──────────────────────────────────────────────────────────────┐
│  [Shared selector: label + dropdown + chips + pinned note]   │
├──────────────────────────────────────────────────────────────┤
│  [Section: Índice de Gini]  — explanation text               │
│  Plot 1 — 2 pinned lines + 0–3 optional lines                │
├──────────────────────────────────────────────────────────────┤
│  [Section: Razão Max/Min]  — explanation text                │
│  Plot 2 — 2 pinned lines + 0–3 optional lines                │
├──────────────────────────────────────────────────────────────┤
│  [Section: Concentração C5]  — explanation text              │
│  Plot 3 — 2 pinned lines + 0–3 optional lines                │
│  [footnote: dados 2025 em andamento]                         │
├──────────────────────────────────────────────────────────────┤
│  [Section: Concentração C3]  — explanation text              │
│  Plot 4 — 2 pinned lines + 0–3 optional lines                │
│  [footnote: dados 2025 em andamento]                         │
└──────────────────────────────────────────────────────────────┘
```

On mobile, all sections stack vertically (single-column layout, dropdown full-width).

---

## Explanatory Texts

### Índice de Gini (before Plot 1)
> **O Índice de Gini** mede a desigualdade na distribuição de uma grandeza entre os clubes de uma liga. O valor varia de 0 (igualdade perfeita — todos os clubes com o mesmo valor) a 1 (desigualdade máxima — um único clube concentra todo o valor). Quanto maior o índice, mais concentrada é a riqueza ou o custo na liga.

### Razão Max/Min (before Plot 2)
> **A Razão Max/Min** compara o valor do clube líder com o do clube de menor expressão na mesma grandeza. Um valor de 10, por exemplo, significa que o clube com maior receita operacional arrecada 10 vezes mais do que o clube com menor receita operacional. É uma medida direta da amplitude da desigualdade.

### Concentração C5 (before Plot 3)
> **A Concentração C5** (ou Razão C5) divide a soma dos valores dos cinco clubes mais expressivos pelo total da competição. Revela o grau de concentração nos 5 maiores. Um valor de 0,55, por exemplo, indica que os 5 maiores clubes concentram 55% da grandeza analisada na liga.

### Concentração C3 (before Plot 4)
> **A Concentração C3** (ou Razão C3) divide a soma dos valores dos três clubes mais expressivos pelo total da competição. Revela o grau de concentração nos 3 maiores. Um valor de 0,40, por exemplo, indica que os 3 maiores clubes concentram 40% da grandeza analisada na liga.

---

## Library
**Recharts** — `LineChart` for all 4 plots.

---

## Category Colors (define once as constants, reuse across all plots)

```js
const CATEGORY_COLORS = {
  'Receita Operacional':                     '#1565C0',  // deep blue
  'Receita da Atividade Esportiva':          '#2E7D32',  // green   ← PINNED
  'Receita c/ Transmissão + Premiações':     '#6A1B9A',  // purple
  'Receita Comercial':                       '#E65100',  // orange
  'Receita c/ Match-Day + Sócio-Torcedor':  '#00838F',  // teal
  'Custo da Atividade Esportiva':            '#C62828',  // red     ← PINNED
  'Folha do Futebol':                        '#4E342E',  // brown
  'Folha do Futebol + Compra de Jogadores': '#37474F',  // blue-grey
  'Pontuação Série A':                       '#F9A825',  // amber
};

const PINNED_CATEGORIES = [
  'Receita da Atividade Esportiva',
  'Custo da Atividade Esportiva',
];

const OPTIONAL_CATEGORIES = [
  'Receita Operacional',
  'Receita c/ Transmissão + Premiações',
  'Receita Comercial',
  'Receita c/ Match-Day + Sócio-Torcedor',
  'Folha do Futebol',
  'Folha do Futebol + Compra de Jogadores',
  'Pontuação Série A',
];
```

---

## Common visual rules for all 4 plots

- X-axis labels: **2021, 2022, 2023, 2024, 2025** (integer years from CSV header)
- All years have values for all categories — no null/missing data except as noted above
- Data points marked with dots on all lines
- **Pinned lines** (`Receita da Atividade Esportiva`, `Custo da Atividade Esportiva`): always rendered, **stroke width 2.5**, solid
- **Optional lines** (user-selected): rendered only when selected, **stroke width 2**, dashed (`strokeDasharray="5 3"`) to visually distinguish them from the pinned lines
- Legend lists only the currently visible lines (2 pinned + selected optional)
- Tooltips show year + values for all **currently visible** lines only (formatted to 4 decimal places for Gini/C3/C5; 2 decimal places for Max/Min)
- Each chart has a descriptive title (see per-plot specs below)
- Responsive: `useResizeHandler={true}`, `style={{ width: "100%" }}`
- If CSV fails to load, show a friendly error message per plot (no crash)
- Y-axis tick formatter: 4 decimal places for Gini, C3, C5; 2 decimal places for Max/Min

---

## Plot 1 — Índice de Gini

**Data block:** rows 1–10 of CSV (label `"Índice de Gini"`)

- **Always-visible lines:** `Receita da Atividade Esportiva` (green), `Custo da Atividade Esportiva` (red)
- **Optional lines:** whichever categories the user selected in the shared dropdown
- **Y-axis label:** `"Índice de Gini"`
- **Y-axis domain:** `[0, 1]`
- **Chart title:** `"Índice de Gini — Brasileirão (2021–2025)"`
- All lines: 5 data points (2021–2025)

---

## Plot 2 — Razão Max/Min

**Data block:** rows 12–21 of CSV (label `"Razão Max/Min"`)

- **Always-visible lines:** `Receita da Atividade Esportiva` (green), `Custo da Atividade Esportiva` (red)
- **Optional lines:** whichever categories the user selected in the shared dropdown
- **Y-axis label:** `"Razão Max/Min"`
- **Y-axis domain:** auto (values range from ~2.6 to ~106)
- **Chart title:** `"Razão Max/Min — Brasileirão (2021–2025)"`
- All lines: 5 data points (2021–2025)

---

## Plot 3 — Concentração C5 (Top 5)

**Data block:** rows 23–32 of CSV (label `"Concentração C5 (Top 5)"`)

- **Always-visible lines:** `Receita da Atividade Esportiva` (green), `Custo da Atividade Esportiva` (red)
- **Optional lines:** whichever categories the user selected in the shared dropdown
- **Y-axis label:** `"Concentração C5"`
- **Y-axis domain:** `[0, 1]`
- **Chart title:** `"Concentração C5 — Brasileirão (2021–2025)"`
- All lines: 5 data points (2021–2025)
- **Footnote below chart:** `"* Os valores de C5 para 2025 das categorias de receita/custo refletem dados parciais da temporada em andamento."`

---

## Plot 4 — Concentração C3 (Top 3)

**Data block:** rows 34–43 of CSV (label `"Concentração C3 (Top 3)"`)

- **Always-visible lines:** `Receita da Atividade Esportiva` (green), `Custo da Atividade Esportiva` (red)
- **Optional lines:** whichever categories the user selected in the shared dropdown
- **Y-axis label:** `"Concentração C3"`
- **Y-axis domain:** `[0, 1]`
- **Chart title:** `"Concentração C3 — Brasileirão (2021–2025)"`
- All lines: 5 data points (2021–2025)
- **Footnote below chart:** `"* Os valores de C3 para 2025 das categorias de receita/custo refletem dados parciais da temporada em andamento."`

---

## Reusable component

Build a single reusable `<InequalityChart>` component parameterised by:

```ts
{
  title: string,
  yAxisLabel: string,
  yDomain: [number, number] | 'auto',
  yTickDecimals: number,              // 4 for Gini/C3/C5, 2 for Max/Min
  data: Array<{ year: number, [category: string]: number }>,  // wide format, one object per year
  visibleCategories: string[],        // PINNED_CATEGORIES + selectedOptional (passed from parent state)
  footnote?: string,
}
```

The parent page (`page.tsx` or equivalent) holds the `selectedOptional: string[]` state and passes `[...PINNED_CATEGORIES, ...selectedOptional]` as `visibleCategories` to every `<InequalityChart>` instance.

The `<CategorySelector>` component is a separate component that receives `selectedOptional`, `setSelectedOptional`, `OPTIONAL_CATEGORIES`, and `MAX_OPTIONAL = 3` as props.

---

## Tests — Módulo 6

### Page load
- [ ] All 4 charts render immediately on module open with exactly 2 lines each (pinned only)
- [ ] All 4 explanatory text sections visible above their respective charts
- [ ] Shared dropdown selector visible above Plot 1 section
- [ ] Dropdown shows 7 optional categories
- [ ] 0 optional categories selected on initial load (no chips shown)
- [ ] Pinned-line note visible in muted text below the dropdown

### Category Selector
- [ ] Selecting 1 optional category adds its line to all 4 charts simultaneously
- [ ] Selecting 2 optional categories adds 2 lines to all 4 charts
- [ ] Selecting 3 optional categories adds 3 lines to all 4 charts; remaining dropdown options become disabled
- [ ] Disabled options show tooltip `"Máximo de 3 variáveis adicionais atingido"`
- [ ] Clicking ✕ on a chip deselects that category and removes its line from all 4 charts
- [ ] Pinned categories (`Receita da Atividade Esportiva`, `Custo da Atividade Esportiva`) do NOT appear in the dropdown

### Data parsing
- [ ] CSV loaded from `/public/data/desigualdade.csv`
- [ ] Gini block identified by label row starting with `"Índice de Gini"` (rows 1–10)
- [ ] Max/Min block identified by label row starting with `"Razão Max/Min"` (rows 12–21)
- [ ] C5 block identified by label row starting with `"Concentração C5 (Top 5)"` (rows 23–32)
- [ ] C3 block identified by label row starting with `"Concentração C3 (Top 3)"` (rows 34–43)
- [ ] Each block yields exactly 9 category rows
- [ ] Year columns correctly parsed as integers: 2021, 2022, 2023, 2024, 2025
- [ ] All 4 blocks extracted in a single CSV parse pass
- [ ] No NaN or undefined values in chart data

### Plot rendering
- [ ] Pinned lines always visible (stroke width 2.5, solid)
- [ ] Optional lines dashed (`strokeDasharray="5 3"`, stroke width 2)
- [ ] Legend shows only currently visible lines
- [ ] Tooltip shows only currently visible line values
- [ ] Y-axis domain [0,1] for Gini, C5, C3; auto for Max/Min
- [ ] Footnote visible below Plots 3 and 4

### Layout
- [ ] Each section has explanation text above its chart
- [ ] All charts full-width on desktop and mobile
- [ ] Dropdown full-width on mobile

### Robustness
- [ ] CSV fails to load → friendly error per plot (no crash)
- [ ] All 4 charts responsive on window resize
- [ ] Rapid add/remove of optional categories does not break any chart

---

## Dependencies

Already installed:
```bash
npm install recharts papaparse
```

---

## File structure reference

```
/football-clubs-financials/
└── public/
    └── data/
        └── desigualdade.csv    ← all 4 metric blocks, ready to use
```

---

## Notes for claude-code

- Parse with `papaparse` using `header: false`. Identify each metric block by scanning for the label row (col 0 value matches one of the four known label strings). The 9 data rows follow immediately after the label row.
- After parsing, pivot each block to wide format: one object per year, with category names as keys. Example: `[{ year: 2021, 'Receita Operacional': 0.4731, ... }, ...]`.
- Extract all 4 blocks in a **single CSV parse pass** — do not re-fetch the file 4 times.
- `PINNED_CATEGORIES`, `OPTIONAL_CATEGORIES`, and `CATEGORY_COLORS` are module-level constants shared by `<InequalityChart>` and `<CategorySelector>`. Define them in a `constants.ts` file (or equivalent) and import where needed.
- `selectedOptional` state lives in the **page-level component**, not inside `<InequalityChart>`. Pass `visibleCategories = [...PINNED_CATEGORIES, ...selectedOptional]` down to each chart.
- Pinned lines: `strokeWidth={2.5}`, no `strokeDasharray`. Optional lines: `strokeWidth={2}`, `strokeDasharray="5 3"`.
- Tooltip and Legend filter by `visibleCategories` — do not render hidden category entries.
- For the multi-select dropdown: if the project already uses a component library with a multi-select (e.g., shadcn, Headless UI), use it. Otherwise build a lightweight custom dropdown: a trigger button, an absolutely-positioned `<ul>` with checkboxes, close on outside click via `useEffect`.
- Y-axis domain for Gini, C3, C5: `[0, 1]`. For Max/Min: auto (Recharts default).
- Tooltip value formatter: 4 decimal places for Gini/C3/C5; 2 decimal places for Max/Min.
- The CSV filename on disk is `desigualdade.csv` (not `Gini_Index.csv` as in previous spec versions).