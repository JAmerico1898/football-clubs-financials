# Spec — Módulo 6: Análise de Desigualdade (Ajustado — inclui Razão C3 e Razão C5)
## Football Clubs Financials App (Next.js)

---

## Overview

Módulo 6 is named **"Análise de Desigualdade"**. It presents four inequality metrics comparing Brazil's Brasileirão against Europe's top 4 leagues: Gini Index, Max-Min Ratio, Razão C3, and Razão C5. No club selection is required — all charts load immediately on page open.

The module is structured as follows:
1. Brief explanation of the Gini Index → two side-by-side Gini line charts (Plots 1 + 2)
2. Brief explanation of the Max-Min Ratio → two side-by-side Max-Min line charts (Plots 3 + 4)
3. Brief explanation of the Razão C3 → two side-by-side C3 line charts (Plots 5 + 6)
4. Brief explanation of the Razão C5 → two side-by-side C5 line charts (Plots 7 + 8)

---

## ⚠️ CSV Update Required Before Development

The current `Gini_Index.csv` ends after the Max-Min Ratio rows (row 25, 0-indexed). **Before starting development of Plots 5–8, the CSV must be updated** to include C3 and C5 values, following the exact same pattern as Gini and Max-Min:

The updated CSV must append these 4 new rows after the existing Max-Min rows:

| Row (0-indexed) | Content |
|---|---|
| 25 | Label row: `"C3 Ratio"` repeated across all 29 columns |
| 26 | **C3 Ratio values** for each column (same column mapping as Gini/Max-Min) |
| 27 | Label row: `"C5 Ratio"` repeated across all 29 columns |
| 28 | **C5 Ratio values** for each column (same column mapping as Gini/Max-Min) |

> **Development order:** Implement Plots 1–4 first (Gini + Max-Min, already working). Add C3/C5 rows to the CSV, then implement Plots 5–8.

---

## Data Source

- **File:** `/football-clubs-financials/public/data/Gini_Index.csv`
- Same file as before, extended with C3 and C5 rows

### Full CSV row mapping (updated)

| Row (0-indexed) | Content |
|---|---|
| 0 | Column headers |
| 1–20 | Raw club-level revenue data (20 clubs per league) |
| 21 | Label: "Gini Index" |
| 22 | **Gini Index values** |
| 23 | Label: "Max/Min Ratio" |
| 24 | **Max-Min Ratio values** |
| 25 | Label: "C3 Ratio" |
| 26 | **C3 Ratio values** |
| 27 | Label: "C5 Ratio" |
| 28 | **C5 Ratio values** |

### Column mapping (unchanged from original spec)

| Columns (0-indexed) | League | Metric basis |
|---|---|---|
| 0–3 | Brasileirão | Turnover (2021–2024) |
| 4–8 | Premier League (England) | Turnover (2020/21–2024/25) |
| 9–13 | La Liga (Spain) | Broadcast Revenue |
| 14–18 | Bundesliga (Germany) | Broadcast Revenue |
| 19–23 | Serie A (Italy) | Broadcast Revenue |
| 24–28 | Premier League (England) | Broadcast Revenue |

### Year alignment rule (unchanged)
- 2020/21 ≡ 2021, 2021/22 ≡ 2022, 2022/23 ≡ 2023, 2023/24 ≡ 2024, 2024/25 ≡ 2025
- X-axis on all charts: **2021, 2022, 2023, 2024, 2025**
- Brasileirão has **no 2025 data** — line ends at 2024, no placeholder or zero

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

### Gini Index (before Plots 1+2) — unchanged
> **O Índice de Gini** mede a desigualdade na distribuição de receitas entre os clubes de uma liga. O valor varia de 0 (igualdade perfeita — todos os clubes com a mesma receita) a 1 (desigualdade máxima — um único clube concentra toda a receita). Quanto maior o índice, mais concentrada é a riqueza na liga.

### Max-Min Ratio (before Plots 3+4) — unchanged
> **O Índice Max-Min** compara a receita do clube mais rico com a do clube mais pobre da liga. Um valor de 5, por exemplo, significa que o clube com maior receita arrecada 5 vezes mais do que o clube com menor receita. É uma medida direta da amplitude da desigualdade.

### Razão C3 (before Plots 5+6)
> **A Razão C3** divide a soma da receita dos três clubes de maior arrecadação pela receita total da competição. Revela a concentração da receita nos 3 clubes de maior arrecadação. Um valor de 0,50, por exemplo, indica que os 3 maiores clubes concentram 50% de toda a receita da liga.

### Razão C5 (before Plots 7+8)
> **A Razão C5** divide a soma da receita dos cinco clubes de maior arrecadação pela receita total da competição. Revela a concentração da receita nos 5 clubes de maior arrecadação. Um valor de 0,60, por exemplo, indica que os 5 maiores clubes concentram 60% de toda a receita da liga.

---

## Library
**Recharts** — `LineChart` for all 8 plots. Consistent with previous modules.

---

## Plots 1–4 (Gini + Max-Min) — Unchanged

Refer to the original `spec_module6.md` for full details on Plots 1–4. No changes to these plots.

**Data extraction:**
- Gini values: row 22, cols 0–28
- Max-Min values: row 24, cols 0–28

---

## Plot 5 — Razão C3: Brasileirão vs Premier League (Turnover)

### Data
- **C3 values:** row 26 of CSV
- **Brasileirão:** cols 0–3 → years 2021–2024 (4 points)
- **Premier League (Turnover):** cols 4–8 → years 2021–2025 (5 points)

### Visual
- X-axis: 2021, 2022, 2023, 2024, 2025
- Y-axis: C3 ratio (0 to 1), labeled `"Razão C3"`
- Two lines: Brasileirão + Premier League
- Colors: same as Plots 1 and 3
  - 🇧🇷 Brasileirão: `#2E7D32` (green)
  - 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League: `#6A0572` (purple)
- Brasileirão line ends at 2024
- Data points with dots
- Tooltip: year + both values
- Chart title: `"Razão C3 — Receita Total"`
- Legend with flag + league name

---

## Plot 6 — Razão C3: 4 European Leagues (Broadcast Revenue)

### Data
- **C3 values:** row 26 of CSV
- **Premier League (Broadcast):** cols 24–28
- **La Liga:** cols 9–13
- **Bundesliga:** cols 14–18
- **Serie A:** cols 19–23

### Visual
- X-axis: 2021, 2022, 2023, 2024, 2025
- Y-axis: C3 ratio (0 to 1), labeled `"Razão C3"`
- Four lines, same colors as Plot 2:
  - 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League: `#6A0572`
  - 🇪🇸 La Liga: `#C0392B`
  - 🇩🇪 Bundesliga: `#212121`
  - 🇮🇹 Serie A: `#1565C0`
- Data points with dots
- Tooltip: year + all league values
- Chart title: `"Razão C3 — Receita de TV"`
- Legend with flags + league names

---

## Plot 7 — Razão C5: Brasileirão vs Premier League (Turnover)

Identical structure to Plot 5, using **C5 values** (row 28, cols 0–8).

- Y-axis label: `"Razão C5"`
- Chart title: `"Razão C5 — Receita Total"`
- Same two lines and colors as Plots 1, 3, and 5
- Brasileirão ends at 2024

---

## Plot 8 — Razão C5: 4 European Leagues (Broadcast Revenue)

Identical structure to Plot 6, using **C5 values** (row 28, cols 9–28).

- Y-axis label: `"Razão C5"`
- Chart title: `"Razão C5 — Receita de TV"`
- Same four lines and colors as Plots 2, 4, and 6

---

## Tests — Módulo 6 (complete, including new plots)

### Page load
- [ ] All 8 charts render immediately on module open
- [ ] All 4 explanatory text sections are visible above their respective chart pairs
- [ ] No dropdown menus or club selectors present

### Data parsing
- [ ] CSV loaded from `/public/data/Gini_Index.csv`
- [ ] Gini values extracted from row 22
- [ ] Max-Min values extracted from row 24
- [ ] C3 values extracted from row 26 — label row 25 contains "C3 Ratio"
- [ ] C5 values extracted from row 28 — label row 27 contains "C5 Ratio"
- [ ] Brasileirão data: 4 points (2021–2024) for all metrics
- [ ] European data: 5 points (2021–2025) for all metrics
- [ ] No NaN or undefined values in chart data

### Plots 1–4 (existing — verify still passing)
- [ ] All tests from original spec_module6.md still pass

### Plot 5 — C3: Brasileirão vs EPL (Turnover)
- [ ] Two lines rendered: Brasileirão and Premier League
- [ ] Brasileirão has 4 points (2021–2024), EPL has 5 (2021–2025)
- [ ] Y-axis labeled "Razão C3"
- [ ] Chart title reads "Razão C3 — Receita Total"
- [ ] Colors match Plots 1 and 3
- [ ] Legend shows both leagues with flags
- [ ] Tooltip shows correct values on hover

### Plot 6 — C3: 4 European Leagues (Broadcast)
- [ ] Four lines rendered (EPL, La Liga, Bundesliga, Serie A)
- [ ] Each line has 5 data points
- [ ] Y-axis labeled "Razão C3"
- [ ] Chart title reads "Razão C3 — Receita de TV"
- [ ] Colors match Plot 2
- [ ] Legend shows all 4 leagues with flags
- [ ] Tooltip shows correct values on hover

### Plot 7 — C5: Brasileirão vs EPL (Turnover)
- [ ] Two lines rendered with correct C5 data
- [ ] Brasileirão ends at 2024
- [ ] Y-axis labeled "Razão C5"
- [ ] Chart title reads "Razão C5 — Receita Total"

### Plot 8 — C5: 4 European Leagues (Broadcast)
- [ ] Four lines rendered with correct C5 data
- [ ] Y-axis labeled "Razão C5"
- [ ] Chart title reads "Razão C5 — Receita de TV"

### Layout
- [ ] Each metric section (Gini, Max-Min, C3, C5) has its explanation text above its chart pair
- [ ] All chart pairs display side-by-side on desktop
- [ ] All plots stack vertically on mobile

### Robustness
- [ ] CSV fails to load → friendly error per plot (no crash)
- [ ] C3/C5 rows missing from CSV → friendly error for Plots 5–8 only, Plots 1–4 still render
- [ ] Brasileirão 2025 missing → line ends gracefully at 2024

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
        └── Gini_Index.csv    ← must contain rows 0–28 (add C3/C5 rows before development of Plots 5–8)
```

---

## Notes for claude-code

- **Implement Plots 1–4 first** and confirm they pass all tests before adding C3/C5 rows to the CSV and implementing Plots 5–8.
- Parse the CSV with `papaparse` using `header: false`. Verify each metric section by checking its label row before reading the value row (e.g., confirm row 25 contains "C3 Ratio" before reading row 26).
- The 4 new plots (5–8) are structurally identical to Plots 1–4 — extract a reusable `<InequalityChartPair>` component parameterised by `{ metric, rowIndex, titleSuffix, yAxisLabel }` to avoid code duplication across all 8 plots.
- Color scheme is consistent across all plots for the same league — define league colors once as constants and import them everywhere.
- `connectNulls={false}` on all Recharts `<Line>` components ensures Brasileirão lines stop at 2024 cleanly.
- Y-axis domain for C3 and C5 should be `[0, 1]` since these are ratios (0%–100% of total revenue).
