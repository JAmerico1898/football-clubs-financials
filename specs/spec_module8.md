# Spec — Módulo 8: Evolução Financeira do Brasileirão
## Football Clubs Financials App (Next.js)

---

## Overview

Módulo 8 is named **"Evolução Financeira do Brasileirão"**. It presents the year-by-year evolution (2021–2025) of aggregated financial metrics for all clubs in the Brasileirão, displayed as a single line chart.

On page load, the chart shows **2 default lines** (`Receita da Atividade Esportiva` and `Custo da Atividade Esportiva`). A metric selector above the chart allows the user to replace those defaults and choose **up to 3 metrics simultaneously** from all 8 available financial metrics. The moment the selector is first used, the 2 default lines give way to whatever the user picks — there is no permanently pinned line.

No club selection is required — the chart loads immediately on page open.

---

## Data Source

- **File:** `/football-clubs-financials/public/data/evolução_liga.csv`

### CSV Structure

The CSV has a simple flat structure with no metric blocks, no separator rows, and no multi-row headers:

- **Row 1 (header):** `"Total da Liga"`, `2021`, `2022`, `2023`, `2024`, `2025`
- **Rows 2–10 (data):** one row per metric, values are the **league-wide aggregate totals** (sum across all clubs) in R$ millions for each year

### Full CSV layout

| Row | Metric label | Included in selector? |
|---|---|---|
| 2 | `Receita Operacional` | Yes |
| 3 | `Receita da Atividade Esportiva` | Yes — **default on load** |
| 4 | `Receita c/ Transmissão + Premiações` | Yes |
| 5 | `Receita Comercial` | Yes |
| 6 | `Receita c/ Match-Day + Sócio-Torcedor` | Yes |
| 7 | `Custo da Atividade Esportiva` | Yes — **default on load** |
| 8 | `Folha do Futebol` | Yes |
| 9 | `Folha do Futebol + Compra de Jogadores` | Yes |
| 10 | `Pontuação Série A` | **No — excluded from selector and chart** |

### Column mapping (0-indexed)

| Column index | Content |
|---|---|
| 0 | Metric label |
| 1 | 2021 value (R$ millions) |
| 2 | 2022 value (R$ millions) |
| 3 | 2023 value (R$ millions) |
| 4 | 2024 value (R$ millions) |
| 5 | 2025 value (R$ millions) |

### Parsing strategy

Parse with `papaparse` using `header: false`. Skip the header row (index 0). For each remaining row, use column 0 as the metric key and columns 1–5 as the year values (cast to `parseFloat`). Discard the `Pontuação Série A` row entirely — do not store it, do not render it.

After parsing, transform to wide format for Recharts: one object per year.

```js
// Target shape:
[
  { year: 2021, 'Receita da Atividade Esportiva': 5762.30, 'Custo da Atividade Esportiva': 3239.12, ... },
  { year: 2022, ... },
  ...
]
```

---

## Metric Selector

### Placement

The selector sits **above the chart**, inside a labelled control row. It is the only interactive element on this page.

```
┌──────────────────────────────────────────────────────────────┐
│  Métricas (máx. 3):  [ dropdown ▾ ]                          │
│  [chip: Receita da Atividade Esportiva ✕]                    │
│  [chip: Custo da Atividade Esportiva ✕]                      │
├──────────────────────────────────────────────────────────────┤
│  Line chart                                                   │
└──────────────────────────────────────────────────────────────┘
```

### Initial state (page load)

- `selectedMetrics` state is initialised to:
  ```js
  ['Receita da Atividade Esportiva', 'Custo da Atividade Esportiva']
  ```
- The chart renders those 2 lines.
- Both appear as chips below the dropdown trigger button.

### Selector behaviour — "unpin on first action" model

The 2 default metrics are **not pinned**. The selector is a standard multi-select: all 8 financial metrics appear in the dropdown list, including the 2 defaults which are pre-checked. The user can uncheck them freely.

- When the dropdown opens, all 8 metrics are listed with checkboxes.
- The 2 defaults are pre-checked; the remaining 6 are unchecked.
- The user may check or uncheck any item.
- **Maximum 3 items may be checked at once.** When 3 are already checked, unchecked items in the list are disabled and greyed out. Show a tooltip on hover: `"Máximo de 3 métricas atingido"`.
- **Minimum 1 item must be checked at all times.** If the user tries to uncheck the last remaining item, prevent it and show a tooltip: `"Selecione ao menos 1 métrica"`.
- Changes apply immediately (live update) — no confirm button needed.
- Chips below the dropdown button reflect the current selection. Clicking ✕ on a chip deselects that metric (subject to the minimum-1 rule above).
- Dropdown closes on outside click (`useEffect` + `document.addEventListener`).

### Selector label

```
Métricas (máx. 3):
```

### Ordered list of options in the dropdown (display order)

1. Receita Operacional
2. Receita da Atividade Esportiva  ← pre-checked on load
3. Receita c/ Transmissão + Premiações
4. Receita Comercial
5. Receita c/ Match-Day + Sócio-Torcedor
6. Custo da Atividade Esportiva  ← pre-checked on load
7. Folha do Futebol
8. Folha do Futebol + Compra de Jogadores

---

## Page Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Heading: "Evolução Financeira do Brasileirão"               │
│  Subtext: brief module description (see below)               │
├──────────────────────────────────────────────────────────────┤
│  Selector row (label + dropdown trigger + chips)             │
├──────────────────────────────────────────────────────────────┤
│  Line chart (full width)                                     │
│  Y-axis unit note: "(R$ milhões)"                            │
└──────────────────────────────────────────────────────────────┘
```

On mobile, selector and chart stack vertically; dropdown is full-width.

### Module description (below heading)

> Evolução dos principais agregados financeiros da liga entre 2021 e 2025. Os valores representam a soma das métricas de todos os clubes participantes do Brasileirão em cada temporada, expressos em R$ milhões.

---

## Line Chart

### Library
**Recharts** — `LineChart` with `ResponsiveContainer`.

### Axes

- **X-axis:** years `2021, 2022, 2023, 2024, 2025` (integer, from parsed data)
- **Y-axis:**
  - Label: `"R$ milhões"` (rotated, on the left)
  - Domain: `auto` (Recharts default — adapts to the currently visible lines)
  - Tick formatter: `(v) => v.toLocaleString('pt-BR', { maximumFractionDigits: 0 })`

### Lines

- One `<Line>` per selected metric (1–3 lines total).
- All lines: `strokeWidth={2}`, dots enabled (`dot={{ r: 4 }}`), `activeDot={{ r: 6 }}`.
- `connectNulls={false}`.
- Line color determined by `METRIC_COLORS` constant (see below).

### Tooltip

- Shows the year and the value of each **currently visible** metric.
- Value format: `R$ X.XXX,XX` (Brazilian locale, 2 decimal places).
- Example: `Receita da Atividade Esportiva: R$ 5.762,30`

### Legend

- Recharts `<Legend>` showing only the currently selected metrics with their colors.
- Position: bottom.

### Responsive

```jsx
<ResponsiveContainer width="100%" height={420}>
  <LineChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 60 }}>
    ...
  </LineChart>
</ResponsiveContainer>
```

---

## Metric Colors (define once, import everywhere)

```js
// constants.ts (or equivalent)
export const METRIC_COLORS: Record<string, string> = {
  'Receita Operacional':                    '#1565C0',  // deep blue
  'Receita da Atividade Esportiva':         '#2E7D32',  // green
  'Receita c/ Transmissão + Premiações':    '#6A1B9A',  // purple
  'Receita Comercial':                      '#E65100',  // orange
  'Receita c/ Match-Day + Sócio-Torcedor': '#00838F',  // teal
  'Custo da Atividade Esportiva':           '#C62828',  // red
  'Folha do Futebol':                       '#4E342E',  // brown
  'Folha do Futebol + Compra de Jogadores':'#37474F',  // blue-grey
};

export const ALL_METRICS = Object.keys(METRIC_COLORS);

export const DEFAULT_METRICS = [
  'Receita da Atividade Esportiva',
  'Custo da Atividade Esportiva',
];

export const MAX_SELECTED = 3;
export const MIN_SELECTED = 1;
```

---

## Component Structure

```
page.tsx  (Módulo 8 page)
├── <MetricSelector>          — dropdown + chips, receives selectedMetrics + setSelectedMetrics
└── <EvolutionChart>          — Recharts line chart, receives chartData + selectedMetrics
```

### `<MetricSelector>` props

```ts
{
  selectedMetrics: string[],
  setSelectedMetrics: (metrics: string[]) => void,
  allMetrics: string[],       // ALL_METRICS constant
  maxSelected: number,        // 3
  minSelected: number,        // 1
}
```

### `<EvolutionChart>` props

```ts
{
  data: Array<{ year: number, [metric: string]: number }>,  // wide format, all 8 metrics present
  selectedMetrics: string[],   // only these are rendered as <Line> elements
}
```

State (`selectedMetrics`) lives in the **page-level component** and is passed to both children.

---

## Tests — Módulo 8

### Page load
- [ ] Chart renders immediately with exactly 2 lines: `Receita da Atividade Esportiva` (green) and `Custo da Atividade Esportiva` (red)
- [ ] Both appear as chips below the dropdown trigger
- [ ] Module heading and description visible
- [ ] Selector label reads `"Métricas (máx. 3):"`

### Data parsing
- [ ] CSV loaded from `/public/data/evolução_liga.csv`
- [ ] Header row (row 1) skipped correctly
- [ ] `Pontuação Série A` row discarded — never stored, never rendered
- [ ] Exactly 8 metrics parsed and available
- [ ] Year values parsed as floats, years as integers (2021–2025)
- [ ] No NaN or undefined values in chart data

### Metric Selector
- [ ] Dropdown lists exactly 8 metrics in specified order
- [ ] On initial open: `Receita da Atividade Esportiva` and `Custo da Atividade Esportiva` are pre-checked; others unchecked
- [ ] Selecting a 3rd metric adds its line to the chart
- [ ] After 3 are selected: remaining unchecked options are disabled and greyed out
- [ ] Disabled options show tooltip `"Máximo de 3 métricas atingido"` on hover
- [ ] Unchecking a metric removes its line from the chart immediately
- [ ] Attempting to uncheck the last remaining metric is prevented; tooltip `"Selecione ao menos 1 métrica"` shown
- [ ] Clicking ✕ on a chip deselects that metric (min-1 rule enforced)
- [ ] Dropdown closes on outside click

### Chart
- [ ] Only selected metrics rendered as lines
- [ ] Line colors match `METRIC_COLORS` constant
- [ ] X-axis shows 2021, 2022, 2023, 2024, 2025
- [ ] Y-axis labeled `"R$ milhões"`, ticks formatted as integers with pt-BR locale
- [ ] Tooltip shows R$ values in pt-BR format (2 decimal places) for visible lines only
- [ ] Legend shows only currently selected metrics
- [ ] Chart adapts Y-axis domain when selection changes
- [ ] Chart is responsive on window resize

### Robustness
- [ ] CSV fails to load → friendly error message (no crash)
- [ ] Rapid selection/deselection does not break the chart

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
        └── evolução_liga.csv    ← single flat table, 8 financial metrics + 1 excluded row
```

---

## Notes for claude-code

- Parse with `papaparse` using `header: false`. Skip row index 0 (header). For each remaining row, use `row[0]` as the metric key. Skip the row where `row[0] === 'Pontuação Série A'`.
- Build `chartData` as an array of 5 objects (one per year), each containing all 8 financial metric values as keys. Both `<MetricSelector>` and `<EvolutionChart>` receive `selectedMetrics` from the parent — `chartData` always contains all metrics; filtering to visible lines happens inside `<EvolutionChart>` by rendering only `<Line>` elements for metrics in `selectedMetrics`.
- For the multi-select dropdown: if the project already uses a component library with a multi-select (e.g., shadcn, Headless UI), use it. Otherwise implement a lightweight custom dropdown: a trigger button that shows the count of selected items, an absolutely-positioned `<ul>` with labelled checkboxes, close on outside click via `useEffect` + `document.addEventListener('mousedown', handler)`.
- Enforce max/min constraints inside `setSelectedMetrics` calls, not just in the UI — so that chip ✕ clicks are also guarded.
- Y-axis `domain={['auto', 'auto']}` ensures Recharts rescales when the selection changes.
- Tooltip formatter example:
  ```js
  formatter={(value: number) =>
    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  ```