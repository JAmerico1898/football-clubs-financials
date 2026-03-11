# Spec — Módulo 5: Índice de Transparência das Demonstrações Financeiras
## Football Clubs Financials App (Next.js)

---

## Overview

Módulo 5 is named **"Índice de Transparência das Demonstrações Financeiras"**. It presents two visualizations of the Financial Transparency Index for all Série A clubs:

1. A **vertical stacked bar chart** showing the contribution of each transparency level to the final index
2. A **styled HTML table** showing the exact values per level and the total index per club

**No club selection is required.** Both visualizations load immediately when the module is opened.

---

## Data Sources

- **Plot 1 (stacked bar):** `/football-clubs-financials/data/Transparência.csv`
- **Plot 2 (table):** `/football-clubs-financials/data/Transparência (2).csv`

---

## Transparency Levels

Both visualizations are based on 3 levels plus a total:

| Level | Label |
|---|---|
| Nível 1 | Nível 1 - Reportes Obrigatórios |
| Nível 2 | Nível 2 - Reportes Discricionários |
| Nível 3 | Nível 3 - Indicadores de Qualidade |
| Total | Índice de Transparência |

---

## Plot 1 — Vertical Stacked Bar Chart

### Library
**Recharts** — `BarChart` with `layout="horizontal"` (vertical bars, one per club), using `stacked` bars for the 3 transparency levels.

### Data & ordering
- Each club is one bar on the X-axis
- Clubs are ordered **left to right by descending Índice de Transparência** (highest index first)
- Each bar is divided into 3 stacked segments: Nível 1 (bottom), Nível 2 (middle), Nível 3 (top)

### Visual requirements
- **Colors for each level** (suggested — visually distinct and harmonious):
  - Nível 1 - Reportes Obrigatórios: `#1565C0` (dark blue)
  - Nível 2 - Reportes Discricionários: `#42A5F5` (medium blue)
  - Nível 3 - Indicadores de Qualidade: `#90CAF9` (light blue)
- **X-axis:** club names, angled if needed to avoid overlap
- **Y-axis:** index value (0 to max), labeled as "Pontuação"
- **Chart title:** `"Índice de Transparência das Demonstrações Financeiras — 2024"`
- **Legend:** identifies the 3 levels with their colors
- **Tooltip:** on hover over a bar segment, show:
  - Club name
  - Level name
  - Level value
  - Total Índice de Transparência for that club
- Responsive width

### Tests — Plot 1
- [ ] Chart renders immediately on module load (no club selection required)
- [ ] All clubs appear as vertical bars on the X-axis
- [ ] Bars are correctly ordered left-to-right by descending total index
- [ ] Each bar has exactly 3 stacked segments (Nível 1, 2, 3)
- [ ] Segment colors match the defined color scheme
- [ ] Legend identifies all 3 levels
- [ ] Chart title is correct
- [ ] Tooltip shows club name, level name, level value, and total index on hover
- [ ] Y-axis is labeled and scaled appropriately
- [ ] X-axis club names are readable (angled or abbreviated as needed)
- [ ] Chart is responsive

---

## Plot 2 — Styled HTML Table

### Description
A clean, styled HTML/CSS table showing each club's transparency scores per level and the total index. This is the same data as Plot 1, presented in tabular form for precise reading.

### Layout
| Column | Content |
|---|---|
| **Clube** | Club name (+ optional club icon, small) |
| **Nível 1** | Score for Reportes Obrigatórios |
| **Nível 2** | Score for Reportes Discricionários |
| **Nível 3** | Score for Indicadores de Qualidade |
| **Índice de Transparência** | Total score (sum of levels) |

### Ordering
- Same as Plot 1: **descending by Índice de Transparência** (highest first)

### Styling requirements
- **Header row:** dark background (e.g., `#1565C0`), white text, bold
- **Alternating row colors:** white and very light grey (`#F5F5F5`) for readability
- **Total column** ("Índice de Transparência") visually emphasized: bold text, slightly darker background or colored cell
- **Hover effect** on rows: subtle highlight on mouse-over
- **Numeric values:** right-aligned, consistent decimal places (1 or 2)
- **Club name column:** left-aligned
- Table must be **fully responsive** — horizontal scroll on small screens if needed
- Optional: small club icon (16–20px) beside each club name in the Clube column, sourced from `/football-clubs-financials/public/clubs/`

### Ranking column (optional but recommended)
Add a `#` column as the first column showing the club's rank (1 = highest transparency). This aids readability given the descending sort.

### Tests — Plot 2
- [ ] Table renders immediately on module load (no club selection required)
- [ ] All clubs appear as rows
- [ ] Rows are ordered by descending Índice de Transparência
- [ ] All 4 data columns are present (Nível 1, Nível 2, Nível 3, Índice de Transparência)
- [ ] Numeric values are right-aligned and consistently formatted
- [ ] Header row is visually distinct
- [ ] Alternating row colors are applied
- [ ] Total column is visually emphasized
- [ ] Row hover effect works
- [ ] Table is responsive (horizontal scroll on small screens)
- [ ] If optional ranking column is included, ranks are correct (1 = highest)
- [ ] If optional club icons are included, they display correctly beside club names

---

## Page Layout

Both visualizations appear on the same Módulo 5 page, stacked vertically:

```
┌─────────────────────────────────────┐
│  [Chart Title]                      │
│  Stacked Bar Chart (Plot 1)         │
│                                     │
├─────────────────────────────────────┤
│  Styled HTML Table (Plot 2)         │
│                                     │
└─────────────────────────────────────┘
```

A section heading or divider between the two may be added for clarity.

---

## Dependencies

Already installed from previous modules. Confirm:

```bash
npm install recharts papaparse
```

No additional libraries needed — the table is plain HTML/CSS.

---

## File structure reference

```
/football-clubs-financials/
├── public/
│   └── clubs/                    ← club icons (optional use in table)
└── data/
    ├── Transparência.csv         ← Plot 1 data (stacked bar)
    └── Transparência (2).csv     ← Plot 2 data (table)
```

---

## Notes for claude-code

- Since there is no club selector, data is fetched once on component mount (`useEffect` with empty dependency array).
- Both plots should share the same **descending sort** derived from the total Índice de Transparência — compute the sort order once and apply it to both visualizations.
- The CSV filenames contain special characters (`ê`, space, parentheses). Use `encodeURIComponent` or handle the path carefully when fetching: e.g., `/data/Transpar%C3%AAncia%20(2).csv`.
- If either CSV fails to load, display a friendly error message for that specific plot without breaking the other.
