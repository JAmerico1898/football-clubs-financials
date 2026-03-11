# Spec — Módulo 6: Análise de Desigualdade
## Football Clubs Financials App (Next.js)

---

## Overview

Módulo 6 is named **"Análise de Desigualdade"**. It presents inequality metrics (Gini Index and Max-Min Ratio) comparing Brazil's Brasileirão against Europe's top 4 leagues. No club selection is required — all charts load immediately on page open.

The module is structured as follows:
1. Brief explanation of the Gini Index
2. Two side-by-side Gini Index line charts (Plot 1 + Plot 2)
3. Brief explanation of the Max-Min Ratio
4. Two side-by-side Max-Min Ratio line charts (Plot 3 + Plot 4)

---

## Data Source

- **File:** `/football-clubs-financials/public/data/Gini_Index.csv`
- The CSV has 29 columns and 26 rows (including headers and label rows)

### CSV structure — column mapping

| Columns (0-indexed) | League | Metric basis |
|---|---|---|
| 0 | Brasileirão | Turnover (Receita Total) |
| 1 | Brasileirão | Turnover |
| 2 | Brasileirão | Turnover |
| 3 | Brasileirão | Turnover |
| 4 | Premier League (England) | Turnover (£m) |
| 5 | Premier League (England) | Turnover |
| 6 | Premier League (England) | Turnover |
| 7 | Premier League (England) | Turnover |
| 8 | Premier League (England) | Turnover 2024/25 |
| 9–13 | La Liga (Spain) | Broadcast Revenue (€M) |
| 14–18 | Bundesliga (Germany) | Broadcast Revenue (€M) |
| 19–23 | Serie A (Italy) | Broadcast Revenue (€M) |
| 24–28 | Premier League (England) | Broadcast Revenue (£m) |

### CSV row mapping

| Row (0-indexed) | Content |
|---|---|
| 0 | Column headers (season/year labels) |
| 1–20 | Raw club-level revenue data (20 clubs per league) |
| 21 | Label row: "Gini Index" repeated across all columns |
| 22 | **Gini Index values** for each column |
| 23 | Label row: "Max/Min Ratio" repeated |
| 24 | **Max-Min Ratio values** for each column |

### Extracted values

#### Gini Index — from Turnover (row 22, cols 0–8):

| Column | League | Season | Value |
|---|---|---|---|
| 0 | Brasileirão | 2021 | row22[0] |
| 1 | Brasileirão | 2022 | row22[1] |
| 2 | Brasileirão | 2023 | row22[2] |
| 3 | Brasileirão | 2024 | row22[3] |
| 4 | Premier League | 2020/21 (≡ 2021) | row22[4] |
| 5 | Premier League | 2021/22 (≡ 2022) | row22[5] |
| 6 | Premier League | 2022/23 (≡ 2023) | row22[6] |
| 7 | Premier League | 2023/24 (≡ 2024) | row22[7] |
| 8 | Premier League | 2024/25 (≡ 2025) | row22[8] |

#### Gini Index — from Broadcast Revenue (row 22, cols 9–28):

| Columns | League | Seasons |
|---|---|---|
| 9–13 | La Liga (Spain) | 2020/21 → 2024/25 |
| 14–18 | Bundesliga (Germany) | 2020/21 → 2024/25 |
| 19–23 | Serie A (Italy) | 2020/21 → 2024/25 |
| 24–28 | Premier League (England) | 2020/21 → 2024/25 |

#### Max-Min Ratio — same column mapping, row 24 instead of row 22.

### Year alignment rule
European leagues use seasons (e.g., 2020/21). For side-by-side comparison with Brasileirão, treat:
- 2020/21 ≡ 2021
- 2021/22 ≡ 2022
- 2022/23 ≡ 2023
- 2023/24 ≡ 2024
- 2024/25 ≡ 2025

X-axis label on all charts: **2021, 2022, 2023, 2024, 2025**

Brasileirão has **no 2025 data** — the line simply ends at 2024. No placeholder, no zero.

---

## Page Layout

```
┌──────────────────────────────────────────────────────────────┐
│  [Section: Gini Index]                                        │
│  Brief explanation text                                       │
├───────────────────────────┬──────────────────────────────────┤
│  Plot 1                   │  Plot 2                          │
│  Brasileirão vs EPL       │  4 European Leagues              │
│  (Turnover Gini)          │  (Broadcast Revenue Gini)        │
├──────────────────────────────────────────────────────────────┤
│  [Section: Max-Min Ratio]                                     │
│  Brief explanation text                                       │
├───────────────────────────┬──────────────────────────────────┤
│  Plot 3                   │  Plot 4                          │
│  Brasileirão vs EPL       │  4 European Leagues              │
│  (Turnover Max-Min)       │  (Broadcast Revenue Max-Min)     │
└──────────────────────────────────────────────────────────────┘
```

On mobile, plots stack vertically (each pair becomes a column).

---

## Explanatory Text

### Gini Index section header
Place before Plots 1 and 2. Suggested text (claude-code may refine wording):

> **O Índice de Gini** mede a desigualdade na distribuição de receitas entre os clubes de uma liga. O valor varia de 0 (igualdade perfeita — todos os clubes com a mesma receita) a 1 (desigualdade máxima — um único clube concentra toda a receita). Quanto maior o índice, mais concentrada é a riqueza na liga.

### Max-Min Ratio section header
Place before Plots 3 and 4. Suggested text:

> **O Índice Max-Min** compara a receita do clube mais rico com a do clube mais pobre da liga. Um valor de 5, por exemplo, significa que o clube com maior receita arrecada 5 vezes mais do que o clube com menor receita. É uma medida direta da amplitude da desigualdade.

---

## Library
**Recharts** — `LineChart` for all 4 plots. Consistent with previous modules.

---

## Plot 1 — Gini Index: Brasileirão vs Premier League (Turnover)

### Data
- **Brasileirão:** years 2021–2024 (4 points), Gini from Turnover
- **Premier League:** years 2021–2025 (5 points), Gini from Turnover

### Visual
- X-axis: 2021, 2022, 2023, 2024, 2025
- Y-axis: Gini coefficient (0 to ~0.5), labeled "Índice de Gini"
- Two lines: one per league
- **Brasileirão line:** 🇧🇷 Brazilian flag color — green (`#2E7D32`) or yellow (`#F9A825`)
- **Premier League line:** 🏴󠁧󠁢󠁥󠁮󠁧󠁿 purple/violet (`#6A0572`) — EPL brand color
- Country flags in the legend beside league names (use emoji flags or small flag images)
- Brasileirão line ends at 2024 (no 2025 point) — line simply stops, no gap indicator needed
- Data points marked with dots
- Tooltip: year, both league values (if available for that year)
- Chart title: `"Índice de Gini — Receita Total"`
- Legend with flag + league name

---

## Plot 2 — Gini Index: 4 European Leagues (Broadcast Revenue)

### Data
- **Premier League (England):** years 2021–2025, Gini from Broadcast Revenue (cols 24–28)
- **La Liga (Spain):** years 2021–2025, Gini from Broadcast Revenue (cols 9–13)
- **Bundesliga (Germany):** years 2021–2025, Gini from Broadcast Revenue (cols 14–18)
- **Serie A (Italy):** years 2021–2025, Gini from Broadcast Revenue (cols 19–23)

### Visual
- X-axis: 2021, 2022, 2023, 2024, 2025
- Y-axis: Gini coefficient, labeled "Índice de Gini"
- Four lines, one per league, distinct colors:
  - 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League: `#6A0572` (purple)
  - 🇪🇸 La Liga: `#C0392B` (red)
  - 🇩🇪 Bundesliga: `#212121` (black/dark)
  - 🇮🇹 Serie A: `#1565C0` (blue)
- Country flags in legend beside league names
- Data points with dots
- Tooltip: year + all league values
- Chart title: `"Índice de Gini — Receita de TV"`

---

## Plot 3 — Max-Min Ratio: Brasileirão vs Premier League (Turnover)

Identical structure to Plot 1, but using **Max-Min Ratio values** (row 24 of CSV, cols 0–8).

- Y-axis label: `"Razão Máx/Mín"`
- Chart title: `"Razão Máx/Mín — Receita Total"`
- Same two lines (Brasileirão + Premier League), same colors as Plot 1
- Brasileirão ends at 2024

---

## Plot 4 — Max-Min Ratio: 4 European Leagues (Broadcast Revenue)

Identical structure to Plot 2, but using **Max-Min Ratio values** (row 24, cols 9–28).

- Y-axis label: `"Razão Máx/Mín"`
- Chart title: `"Razão Máx/Mín — Receita de TV"`
- Same four lines, same colors as Plot 2

---

## Tests — Módulo 6

### Page load
- [ ] All 4 charts render immediately on module open (no user interaction required)
- [ ] No dropdown menus or club selectors are present
- [ ] Both explanatory text sections are visible above their respective chart pairs

### Data parsing
- [ ] CSV is loaded from `/public/data/Gini_Index.csv`
- [ ] Gini Index values are correctly extracted from row 22 (0-indexed)
- [ ] Max-Min Ratio values are correctly extracted from row 24
- [ ] Brasileirão data covers years 2021–2024 (4 points only)
- [ ] European league data covers years 2021–2025 (5 points)
- [ ] No NaN or undefined values appear in chart data

### Plot 1 — Gini: Brasileirão vs EPL (Turnover)
- [ ] Two lines rendered: Brasileirão and Premier League
- [ ] Brasileirão line has 4 data points (2021–2024), Premier League has 5 (2021–2025)
- [ ] X-axis shows labels 2021, 2022, 2023, 2024, 2025
- [ ] Y-axis labeled "Índice de Gini"
- [ ] Chart title reads "Índice de Gini — Receita Total"
- [ ] Legend shows both league names with flags
- [ ] Tooltip shows correct values on hover

### Plot 2 — Gini: 4 European Leagues (Broadcast)
- [ ] Four lines rendered (EPL, La Liga, Bundesliga, Serie A)
- [ ] Each line has 5 data points (2021–2025)
- [ ] Distinct colors applied to each league
- [ ] Legend shows all 4 leagues with flags
- [ ] Chart title reads "Índice de Gini — Receita de TV"
- [ ] Tooltip shows correct values on hover

### Plot 3 — Max-Min: Brasileirão vs EPL (Turnover)
- [ ] Two lines rendered with correct Max-Min data
- [ ] Brasileirão ends at 2024
- [ ] Y-axis labeled "Razão Máx/Mín"
- [ ] Chart title reads "Razão Máx/Mín — Receita Total"

### Plot 4 — Max-Min: 4 European Leagues (Broadcast)
- [ ] Four lines rendered with correct Max-Min data
- [ ] Y-axis labeled "Razão Máx/Mín"
- [ ] Chart title reads "Razão Máx/Mín — Receita de TV"

### Layout
- [ ] Plots 1 and 2 appear side-by-side on desktop
- [ ] Plots 3 and 4 appear side-by-side on desktop
- [ ] On mobile, plots stack vertically
- [ ] Explanatory text for Gini appears above Plots 1+2
- [ ] Explanatory text for Max-Min appears above Plots 3+4

### Robustness
- [ ] If CSV fails to load, a friendly error message is shown for each plot (no crash)
- [ ] Missing data points (Brasileirão 2025) are handled gracefully — line ends, no error

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
        └── Gini_Index.csv    ← all data for this module
```

---

## Notes for claude-code

- Parse the CSV with `papaparse`. Because the CSV has multiple header-like rows, use `header: false` and access rows by index directly.
- The Gini and Max-Min values are in rows at 0-indexed positions **22** (Gini) and **24** (Max-Min) — confirm by checking that the preceding rows contain the string labels "Gini Index" and "Max/Min Ratio".
- For flag display in legends, use Unicode emoji flags: 🇧🇷 🏴󠁧󠁢󠁥󠁮󠁧󠁿 🇪🇸 🇩🇪 🇮🇹. If emoji flags render poorly in the Recharts `<Legend>`, implement a custom legend renderer with flag emojis in a `<span>`.
- Recharts `<LineChart>` with `connectNulls={false}` ensures Brasileirão's line stops at 2024 without connecting to a null 2025 point.
- Both chart pairs (Plots 1+2, Plots 3+4) should use a CSS `grid` or `flex` layout with `gap` for the side-by-side display, collapsing to a single column on small screens.
