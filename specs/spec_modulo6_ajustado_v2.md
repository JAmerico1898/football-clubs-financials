# Spec — Módulo 6: Análise de Desigualdade (Ajustado v2 — inclui Razão C3 e Razão C5)
## Football Clubs Financials App (Next.js)

---

## Overview

Módulo 6 is named **"Análise de Desigualdade"**. It presents four inequality metrics comparing Brazil's Brasileirão against Europe's top 4 leagues: Gini Index, Max-Min Ratio, Razão C3, and Razão C5. No club selection is required — all charts load immediately on page open.

The module is structured as follows:
1. Brief explanation of the Gini Index → two side-by-side Gini line charts (Plots 1 + 2)
2. Brief explanation of the Max-Min Ratio → two side-by-side Max-Min line charts (Plots 3 + 4)
3. Brief explanation of the Razão C3 → two side-by-side C3 line charts (Plots 5 + 6)
4. Brief explanation of the Razão C5 → two side-by-side C5 line charts (Plots 7 + 8)

> ✅ **No CSV update required.** The updated `Gini_Index.csv` already contains all four metrics (Gini, Max-Min, C3, C5). All 8 plots can be implemented immediately.

---

## Data Source

- **File:** `/football-clubs-financials/public/data/Gini_Index.csv`

### CSV Structure

The CSV is organised into **four metric blocks**, each with a 3-row structure:
1. **Label row** — metric name repeated across columns (e.g., `"Gini Index"`, `"C3 Ratio"`)
2. **Header row** — `"Season"`, `"Brasileirão"`, `"Premier League"`, `"Premier League"`, `"La Liga"`, `"Bundesliga"`, `"Serie A"`
3. **Data rows** — one row per season (2020/21 through 2024/25), with values per league

### Full CSV layout (1-indexed, as in the file)

| Rows | Metric block |
|---|---|
| 1–7 | **Gini Index** (label row 1, header row 2, data rows 3–7) |
| 8–14 | **Max/Min Ratio** (label row 8, header row 9, data rows 10–14) |
| 15–21 | **C3 Ratio** (label row 15, header row 16, data rows 17–21) |
| 22–28 | **C5 Ratio** (label row 22, header row 23, data rows 24–28) |

### Column mapping (same for all four metric blocks)

| Column index (0-indexed) | Content |
|---|---|
| 0 | Season label (e.g., `"2020/21"`) |
| 1 | Brasileirão — Turnover |
| 2 | Premier League — Turnover |
| 3 | Premier League — Broadcast Revenue |
| 4 | La Liga — Broadcast Revenue |
| 5 | Bundesliga — Broadcast Revenue |
| 6 | Serie A — Broadcast Revenue |

### Season / year mapping

| CSV Season value | X-axis label |
|---|---|
| `"2020/21"` | 2021 |
| `"2021/22"` | 2022 |
| `"2022/23"` | 2023 |
| `"2023/24"` | 2024 |
| `"2024/25"` | 2025 |

### Brasileirão 2025 data
- Brasileirão (column 1) has **no value for `"2024/25"`** — the cell is empty.
- The Brasileirão line ends at 2024 on all charts. No placeholder, no zero.

### Parsing strategy
Parse with `papaparse` using `header: false`. Identify each metric block by finding the label row that starts with the metric name (`"Gini Index"`, `"Max/Min Ratio"`, `"C3 Ratio"`, `"C5 Ratio"`). The data rows follow immediately after the header row within each block.

---

## Page Layout

```
┌──────────────────────────────────────────────────────────────┐
│  [Section: Gini Index]  — explanation text                    │
├───────────────────────────┬──────────────────────────────────┤
│  Plot 1                   │  Plot 2                          │
│  Brasileirão vs EPL       │  4 European Leagues              │
│  (Turnover Gini)          │  (Broadcast Revenue Gini)        │
├──────────────────────────────────────────────────────────────┤
│  [Section: Max-Min Ratio]  — explanation text                 │
├───────────────────────────┬──────────────────────────────────┤
│  Plot 3                   │  Plot 4                          │
│  Brasileirão vs EPL       │  4 European Leagues              │
│  (Turnover Max-Min)       │  (Broadcast Revenue Max-Min)     │
├──────────────────────────────────────────────────────────────┤
│  [Section: Razão C3]  — explanation text                      │
├───────────────────────────┬──────────────────────────────────┤
│  Plot 5                   │  Plot 6                          │
│  Brasileirão vs EPL       │  4 European Leagues              │
│  (Turnover C3)            │  (Broadcast Revenue C3)          │
├──────────────────────────────────────────────────────────────┤
│  [Section: Razão C5]  — explanation text                      │
├───────────────────────────┬──────────────────────────────────┤
│  Plot 7                   │  Plot 8                          │
│  Brasileirão vs EPL       │  4 European Leagues              │
│  (Turnover C5)            │  (Broadcast Revenue C5)          │
└──────────────────────────────────────────────────────────────┘
```

On mobile, all plots stack vertically.

---

## Explanatory Texts

### Gini Index (before Plots 1+2)
> **O Índice de Gini** mede a desigualdade na distribuição de receitas entre os clubes de uma liga. O valor varia de 0 (igualdade perfeita — todos os clubes com a mesma receita) a 1 (desigualdade máxima — um único clube concentra toda a receita). Quanto maior o índice, mais concentrada é a riqueza na liga.

### Max-Min Ratio (before Plots 3+4)
> **O Índice Max-Min** compara a receita do clube mais rico com a do clube mais pobre da liga. Um valor de 5, por exemplo, significa que o clube com maior receita arrecada 5 vezes mais do que o clube com menor receita. É uma medida direta da amplitude da desigualdade.

### Razão C3 (before Plots 5+6)
> **A Razão C3** divide a soma da receita dos três clubes de maior arrecadação pela receita total da competição. Revela a concentração da receita nos 3 clubes de maior arrecadação. Um valor de 0,50, por exemplo, indica que os 3 maiores clubes concentram 50% de toda a receita da liga.

### Razão C5 (before Plots 7+8)
> **A Razão C5** divide a soma da receita dos cinco clubes de maior arrecadação pela receita total da competição. Revela a concentração da receita nos 5 clubes de maior arrecadação. Um valor de 0,60, por exemplo, indica que os 5 maiores clubes concentram 60% de toda a receita da liga.

---

## Library
**Recharts** — `LineChart` for all 8 plots.

---

## League colors (define once as constants, reuse across all plots)

```js
const LEAGUE_COLORS = {
  brasileirao:    '#2E7D32',  // 🇧🇷 green
  eplTurnover:    '#6A0572',  // 🏴󠁧󠁢󠁥󠁮󠁧󠁿 purple  (col 2 — Turnover)
  eplBroadcast:   '#6A0572',  // 🏴󠁧󠁢󠁥󠁮󠁧󠁿 purple  (col 3 — Broadcast)
  laLiga:         '#C0392B',  // 🇪🇸 red
  bundesliga:     '#212121',  // 🇩🇪 dark grey/black
  serieA:         '#1565C0',  // 🇮🇹 blue
};
```

---

## Common visual rules for all 8 plots

- X-axis labels: **2021, 2022, 2023, 2024, 2025** (mapped from CSV season strings)
- Data points marked with dots on all lines
- `connectNulls={false}` — Brasileirão line ends at 2024, no connection to 2025
- Legends include emoji country flags beside league names
- Tooltips show year + all available league values for that year
- Responsive: `useResizeHandler={true}`, `style={{ width: "100%" }}`
- If CSV fails to load, show friendly error per plot (no crash)

---

## Plots 1+2 — Gini Index

**Data block:** rows 1–7 of CSV (label `"Gini Index"`)

### Plot 1 — Gini: Brasileirão vs Premier League (Turnover)
- **Lines:** Brasileirão (col 1) + Premier League Turnover (col 2)
- Y-axis label: `"Índice de Gini"`
- Chart title: `"Índice de Gini — Receita Total"`
- Brasileirão: 4 points (2021–2024); EPL: 5 points (2021–2025)

### Plot 2 — Gini: 4 European Leagues (Broadcast Revenue)
- **Lines:** EPL Broadcast (col 3), La Liga (col 4), Bundesliga (col 5), Serie A (col 6)
- Y-axis label: `"Índice de Gini"`
- Chart title: `"Índice de Gini — Receita de TV"`
- All 4 lines: 5 points (2021–2025)

---

## Plots 3+4 — Max-Min Ratio

**Data block:** rows 8–14 of CSV (label `"Max/Min Ratio"`)

### Plot 3 — Max-Min: Brasileirão vs Premier League (Turnover)
- **Lines:** Brasileirão (col 1) + Premier League Turnover (col 2)
- Y-axis label: `"Razão Máx/Mín"`
- Chart title: `"Razão Máx/Mín — Receita Total"`
- Brasileirão: 4 points; EPL: 5 points

### Plot 4 — Max-Min: 4 European Leagues (Broadcast Revenue)
- **Lines:** EPL Broadcast (col 3), La Liga (col 4), Bundesliga (col 5), Serie A (col 6)
- Y-axis label: `"Razão Máx/Mín"`
- Chart title: `"Razão Máx/Mín — Receita de TV"`
- All 4 lines: 5 points

---

## Plots 5+6 — Razão C3

**Data block:** rows 15–21 of CSV (label `"C3 Ratio"`)

### Plot 5 — C3: Brasileirão vs Premier League (Turnover)
- **Lines:** Brasileirão (col 1) + Premier League Turnover (col 2)
- Colors: same as Plots 1 and 3 (Brasileirão green, EPL purple)
- Y-axis label: `"Razão C3"`
- Y-axis domain: `[0, 1]` (ratio 0–100%)
- Chart title: `"Razão C3 — Receita Total"`
- Brasileirão: 4 points (2021–2024); EPL: 5 points (2021–2025)
- Legend with 🇧🇷 and 🏴󠁧󠁢󠁥󠁮󠁧󠁿 flags

### Plot 6 — C3: 4 European Leagues (Broadcast Revenue)
- **Lines:** EPL Broadcast (col 3), La Liga (col 4), Bundesliga (col 5), Serie A (col 6)
- Colors: same as Plots 2 and 4 (EPL purple, La Liga red, Bundesliga dark, Serie A blue)
- Y-axis label: `"Razão C3"`
- Y-axis domain: `[0, 1]`
- Chart title: `"Razão C3 — Receita de TV"`
- All 4 lines: 5 points (2021–2025)
- Legend with 🏴󠁧󠁢󠁥󠁮󠁧󠁿 🇪🇸 🇩🇪 🇮🇹 flags

---

## Plots 7+8 — Razão C5

**Data block:** rows 22–28 of CSV (label `"C5 Ratio"`)

### Plot 7 — C5: Brasileirão vs Premier League (Turnover)
- **Lines:** Brasileirão (col 1) + Premier League Turnover (col 2)
- Colors: same as Plots 1, 3, and 5
- Y-axis label: `"Razão C5"`
- Y-axis domain: `[0, 1]`
- Chart title: `"Razão C5 — Receita Total"`
- Brasileirão: 4 points (2021–2024); EPL: 5 points (2021–2025)
- Legend with 🇧🇷 and 🏴󠁧󠁢󠁥󠁮󠁧󠁿 flags

### Plot 8 — C5: 4 European Leagues (Broadcast Revenue)
- **Lines:** EPL Broadcast (col 3), La Liga (col 4), Bundesliga (col 5), Serie A (col 6)
- Colors: same as Plots 2, 4, and 6
- Y-axis label: `"Razão C5"`
- Y-axis domain: `[0, 1]`
- Chart title: `"Razão C5 — Receita de TV"`
- All 4 lines: 5 points (2021–2025)
- Legend with 🏴󠁧󠁢󠁥󠁮󠁧󠁿 🇪🇸 🇩🇪 🇮🇹 flags

---

## Tests — Módulo 6 (complete)

### Page load
- [ ] All 8 charts render immediately on module open
- [ ] All 4 explanatory text sections visible above their respective chart pairs
- [ ] No dropdown menus or club selectors present

### Data parsing
- [ ] CSV loaded from `/public/data/Gini_Index.csv`
- [ ] Gini block identified by label row starting with `"Gini Index"` (rows 1–7)
- [ ] Max-Min block identified by label row starting with `"Max/Min Ratio"` (rows 8–14)
- [ ] C3 block identified by label row starting with `"C3 Ratio"` (rows 15–21)
- [ ] C5 block identified by label row starting with `"C5 Ratio"` (rows 22–28)
- [ ] Season strings mapped correctly to X-axis labels (2020/21 → 2021, etc.)
- [ ] Brasileirão col 1 has 4 data points (2021–2024); empty 2024/25 cell treated as null
- [ ] European league columns have 5 data points each (2021–2025)
- [ ] No NaN or undefined values in chart data

### Plots 1+2 — Gini
- [ ] Plot 1: two lines (Brasileirão + EPL Turnover), EPL has 5 pts, Brasileirão has 4
- [ ] Plot 1: Y-axis labeled "Índice de Gini", title "Índice de Gini — Receita Total"
- [ ] Plot 2: four lines (EPL Broadcast, La Liga, Bundesliga, Serie A), each 5 pts
- [ ] Plot 2: Y-axis labeled "Índice de Gini", title "Índice de Gini — Receita de TV"

### Plots 3+4 — Max-Min
- [ ] Plot 3: two lines, correct Max-Min values, Brasileirão ends at 2024
- [ ] Plot 3: Y-axis labeled "Razão Máx/Mín", title "Razão Máx/Mín — Receita Total"
- [ ] Plot 4: four lines with correct Max-Min values
- [ ] Plot 4: Y-axis labeled "Razão Máx/Mín", title "Razão Máx/Mín — Receita de TV"

### Plots 5+6 — C3
- [ ] Plot 5: two lines rendered (Brasileirão + EPL Turnover)
- [ ] Plot 5: Brasileirão has 4 pts (2021–2024), EPL has 5 pts (2021–2025)
- [ ] Plot 5: Y-axis labeled "Razão C3", domain [0,1], title "Razão C3 — Receita Total"
- [ ] Plot 5: colors match Plots 1 and 3
- [ ] Plot 5: legend shows 🇧🇷 and 🏴󠁧󠁢󠁥󠁮󠁧󠁿 flags
- [ ] Plot 5: tooltip shows correct values on hover
- [ ] Plot 6: four lines (EPL Broadcast, La Liga, Bundesliga, Serie A)
- [ ] Plot 6: each line has 5 data points
- [ ] Plot 6: Y-axis labeled "Razão C3", domain [0,1], title "Razão C3 — Receita de TV"
- [ ] Plot 6: colors match Plots 2 and 4
- [ ] Plot 6: legend shows 🏴󠁧󠁢󠁥󠁮󠁧󠁿 🇪🇸 🇩🇪 🇮🇹 flags
- [ ] Plot 6: tooltip shows correct values on hover

### Plots 7+8 — C5
- [ ] Plot 7: two lines rendered (Brasileirão + EPL Turnover)
- [ ] Plot 7: Brasileirão has 4 pts, EPL has 5 pts
- [ ] Plot 7: Y-axis labeled "Razão C5", domain [0,1], title "Razão C5 — Receita Total"
- [ ] Plot 7: colors match Plots 1, 3, and 5
- [ ] Plot 7: tooltip shows correct values
- [ ] Plot 8: four lines (EPL Broadcast, La Liga, Bundesliga, Serie A)
- [ ] Plot 8: Y-axis labeled "Razão C5", domain [0,1], title "Razão C5 — Receita de TV"
- [ ] Plot 8: colors match Plots 2, 4, and 6
- [ ] Plot 8: tooltip shows correct values

### Layout
- [ ] Each section (Gini, Max-Min, C3, C5) has explanation text above its chart pair
- [ ] All chart pairs side-by-side on desktop
- [ ] All plots stack vertically on mobile

### Robustness
- [ ] CSV fails to load → friendly error per plot (no crash)
- [ ] Brasileirão 2025 null → line ends at 2024 cleanly (connectNulls=false)
- [ ] All 8 charts responsive on window resize

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
        └── Gini_Index.csv    ← all 4 metric blocks already present, ready to use
```

---

## Notes for claude-code

- Parse with `papaparse` using `header: false`. Identify each metric block by scanning for the label row (col 0 value = `"Gini Index"`, `"Max/Min Ratio"`, `"C3 Ratio"`, `"C5 Ratio"`). The header row follows immediately, then 5 data rows.
- Extract all 4 blocks in a single CSV parse pass — do not re-fetch the file 4 times.
- Build a reusable `<InequalityChartPair>` component parameterised by `{ metricLabel, yAxisLabel, titleSuffix, data, yDomain }` to avoid duplicating chart code across all 8 plots. The `data` prop receives the already-parsed block for that metric.
- Define `LEAGUE_COLORS` as a single constant object imported by all chart components.
- For the Brasileirão null in 2024/25: after parsing, replace empty strings from papaparse with `null`. Recharts with `connectNulls={false}` will then stop the line at 2024 automatically.
- Y-axis domain for C3 and C5: `[0, 1]`. For Gini: auto or `[0, 0.5]`. For Max-Min: auto.
- Emoji flags in Recharts `<Legend>`: use a custom `renderLegend` function that wraps each item in a `<span>` with the flag emoji prepended.
