# Spec — Módulo 4: Compare 2 Clubes
## Football Clubs Financials App (Next.js)

---

## Overview

Módulo 4 is named **"Compare 2 Clubes"**. It allows the user to select two clubs and compares their financial metrics side-by-side in a **horizontal grouped bar chart**, using each club's primary color as the bar color. The structure and metrics mirror Módulo 1's bar chart — but instead of comparing years (2024 vs 2023), it compares **Club 1 vs Club 2** for 2024 data.

---

## Club Selection

- Two independent club selectors: **Clube 1** and **Clube 2**
- Both selectors follow the same ordering rule: **Vasco first, then remaining clubs A–Z**
- Once a club is selected, its **icon** is displayed beside the selector (from `/football-clubs-financials/public/clubs/`)
- **Do not render any chart until both clubs are selected**
- If only one club is selected, show: *"Selecione dois clubes para comparar."*
- Allow the same club to be selected in both selectors (edge case — chart will show identical bars)

---

## Data Source

- **File:** `/football-clubs-financials/data/Índices.csv`
- **Year:** 2024 only
- Same file used in Módulos 2 (Feature 1) and 3
- Each row = one metric; each column = one club
- Extract the column for Club 1 and the column for Club 2 for each metric row

---

## Metrics (same as Módulo 1)

Metrics are grouped into 4 categories. Use the same row indices from `Painel_Consolidado_Moeda_Cte.csv` as defined in Módulo 1 for reference — but here data comes from `Índices.csv`. Match metric names to the correct rows in `Índices.csv`.

| Category | Metrics |
|---|---|
| **Receita** | Receita Total, Receita Recorrente, Receita c/ Transmissão + Premiações, Receita Comercial, Receita c/ Match-Day + Sócio-Torcedor, Receita c/ Negociação de atletas |
| **Despesa** | Custo das Atividades Esportivas, Folha do Futebol, Folha do Futebol + Amortização, Aquisições de atletas |
| **Resultado** | Resultado Operacional (Segmento Futebol), Resultado |
| **Passivo** | Dívida Líquida |

---

## Color Scheme

Each club is represented by its **primary color**. The full mapping is:

| Club | Primary Color |
|---|---|
| Athletico | Red |
| Atlético GO | Red |
| Atlético | Gray |
| Bahia | Blue |
| Botafogo | Gray |
| Corinthians | Gray |
| Criciúma | Yellow |
| Cruzeiro | Blue |
| Cuiabá | Golden |
| Flamengo | Red |
| Fluminense | Green |
| Fortaleza | Blue |
| Grêmio | Blue |
| Internacional | Red |
| Juventude | Green |
| Palmeiras | Green |
| São Paulo | Red |
| Vasco | Black |
| Vitória | Red |

### Color conflict resolution

When both selected clubs share the same primary color, use **different tones** to distinguish them. Apply the following logic:

1. **Check if Club 1 primary == Club 2 primary** (e.g., both Red)
2. If conflict: Club 1 uses the **darker tone**, Club 2 uses the **lighter tone**
3. If Club 1 primary == Club 2 primary AND Club 1 secondary == Club 2 secondary (full match, e.g., both Gray+Black): Club 1 uses the primary color, Club 2 uses the secondary color — with different tones if those also match

**Suggested tone pairs per color:**

| Color | Dark tone | Light tone |
|---|---|---|
| Red | `#C0392B` | `#E74C3C` |
| Gray | `#616161` | `#BDBDBD` |
| Blue | `#1565C0` | `#42A5F5` |
| Green | `#2E7D32` | `#66BB6A` |
| Black | `#212121` | `#757575` |
| Yellow | `#F9A825` | `#FFF176` |
| Golden | `#F57F17` | `#FFD54F` |

> **Implementation note:** Store the color mapping as a JavaScript constant/object. Write a `resolveClubColors(club1, club2)` utility function that returns `{ color1, color2 }`, applying conflict resolution automatically.

---

## Chart: Horizontal Grouped Bar Chart

### Library
**Recharts** — `BarChart` with `layout="vertical"` (horizontal bars), same approach as Módulo 1.

### Visual requirements
- **Two bars per metric:** one for Club 1 (its primary color), one for Club 2 (its primary color)
- Bars are **grouped side-by-side** for each metric
- Metrics are **grouped by category** with a visual separator or category label on the Y-axis (same as Módulo 1)
- **Y-axis:** metric names (abbreviated if needed)
- **X-axis:** monetary values, formatted as abbreviated BRL (e.g., `R$ 1,2 bi`, `R$ 850 mi`)
- **Chart title:** `"{Club 1} vs. {Club 2}"`
- **Legend:** shows Club 1 name + color swatch and Club 2 name + color swatch
- Club icons may optionally appear in the legend beside club names
- **Tooltip:** on hover, show metric name, Club 1 value, Club 2 value (both formatted)

### Category separators
Same visual grouping as Módulo 1:
- **Receita** (6 metrics) — e.g., green family label
- **Despesa** (4 metrics) — e.g., red family label
- **Resultado** (2 metrics) — e.g., blue family label
- **Passivo** (1 metric) — e.g., orange family label

Category label colors are independent of club colors.

### Responsiveness
Chart must be responsive on different screen sizes.

---

## Tests — Módulo 4

### Club selectors
- [ ] Both selectors show Vasco first, remaining clubs in A–Z order
- [ ] Selecting Club 1 displays its icon
- [ ] Selecting Club 2 displays its icon
- [ ] No chart renders until both clubs are selected
- [ ] Prompt message shown when fewer than 2 clubs are selected
- [ ] Changing either club updates the chart correctly

### Color logic
- [ ] Club 1 bar uses Club 1's primary color
- [ ] Club 2 bar uses Club 2's primary color
- [ ] When both clubs share the same primary color, bars use visually distinct tones
- [ ] `resolveClubColors()` utility correctly handles all conflict cases in the mapping table
- [ ] All 19 clubs in the mapping are covered

### Bar chart
- [ ] Horizontal grouped bar chart renders without console errors when both clubs are selected
- [ ] All 13 metrics are displayed as horizontal bar pairs
- [ ] Each metric shows exactly 2 bars: one per club
- [ ] Metrics are visually grouped into 4 categories (Receita, Despesa, Resultado, Passivo)
- [ ] Category labels are visible on or beside the Y-axis
- [ ] X-axis values are formatted as abbreviated BRL
- [ ] Chart title reads "{Club 1} vs. {Club 2}"
- [ ] Legend identifies both clubs with their respective colors
- [ ] Tooltip shows metric name and both clubs' values on hover
- [ ] Chart is responsive on different screen sizes

### Robustness
- [ ] If a club is missing a metric value in `Índices.csv`, display zero for that bar (no crash)
- [ ] If the same club is selected for both slots, chart renders with identical bars (no crash)
- [ ] If `Índices.csv` fails to load, a friendly error message is shown

---

## Dependencies

Already installed from previous modules. Confirm:

```bash
npm install recharts papaparse
```

---

## File structure reference

```
/football-clubs-financials/
├── public/
│   └── clubs/          ← club icons (same as all previous modules)
└── data/
    └── Índices.csv     ← 2024 data (same as Módulos 2 Feature 1 and 3)
```

---

## Notes for claude-code

- Reuse the club selector component from previous modules.
- The `resolveClubColors(club1, club2)` function should be implemented as a standalone utility (e.g., `lib/clubColors.js`) and imported by the Módulo 4 page.
- The horizontal bar chart structure (layout, category grouping, value formatting) should closely mirror Módulo 1's Feature 3 implementation — reuse or adapt that component where possible.
- Category label colors (Receita/Despesa/Resultado/Passivo) are fixed and independent of the selected clubs' colors.
