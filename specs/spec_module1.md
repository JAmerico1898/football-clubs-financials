# Spec — Module 1: Análise Individual
## Football Clubs Financials App (Next.js)

---

## Overview

Module 1 is named **"Análise Individual"** (rename from "Análise Individual - 2024"). It allows the user to select a Brazilian Série A football club and explore three financial visualizations for that club.

**Development rule:** Features must be implemented **one at a time**, in the order below. Each feature must pass its acceptance tests before the next one begins.

---

## Global Fixes (apply before Feature 1)

These are small corrections to be made first, as they affect the entire app:

1. **Rename button:** Change "Análise Individual - 2024" → **"Análise Individual"**
2. **Fix subtitle typo:** Change `"Explore as financas dos clubes do Brasileirao"` → `"Explore as finanças dos clubes do Brasileirão"`
3. **Club ordering:** In the club selector, **Vasco must appear first**, followed by all other clubs in **alphabetical order**.
4. **Club icon:** Once a club is selected, display its icon. Icons are available at `/football-clubs-financials/public/clubs`. The icon filename prefix must match the selected club identifier (same prefix used for JSON filenames).

### Tests — Global Fixes
- [ ] Button label reads "Análise Individual" (no year suffix)
- [ ] Subtitle displays "Explore as finanças dos clubes do Brasileirão" with correct diacritics
- [ ] Club dropdown/list shows Vasco as the first option, remaining clubs in A–Z order
- [ ] Selecting any club renders its icon from `/public/clubs`
- [ ] Selecting a different club updates the icon correctly

---

## Feature 1 — Sankey Chart (Income Statement)

### Description
Render a pre-built Sankey chart representing the Income Statement of the selected club.

### Data source
- **Location:** `/football-clubs-financials/public/sankey/`
- **Filename pattern:** `{club}_sankey_2024.json`
- The `{club}` prefix matches the selected club identifier.

### Library
**Plotly.js** (`react-plotly.js` wrapper). The JSON files are Plotly figure objects and must be passed directly to the `<Plot>` component via its `data` and `layout` props.

### Implementation notes
- Load the JSON file dynamically based on the selected club.
- If no club is selected, show a prompt: *"Selecione um clube para visualizar o gráfico."*
- If the JSON file for the selected club is not found, show a friendly error message.
- The chart must be responsive (use `useResizeHandler` and `style={{ width: "100%" }}`).

### Tests — Feature 1
- [ ] Selecting a club loads and renders its Sankey chart without console errors
- [ ] Chart is visible and Plotly nodes/links are displayed correctly
- [ ] Switching clubs re-renders the chart for the newly selected club
- [ ] If no club is selected, a prompt message is shown (no chart)
- [ ] If JSON file is missing for a club, a user-friendly error is displayed (no crash)
- [ ] Chart resizes correctly when browser window is resized

---

## Feature 2 — Radar Chart (Selected Metrics)

### Description
Render a pre-built Radar chart showing selected financial metrics of the selected club.

### Data source
- **Location:** `/football-clubs-financials/public/radar/`
- **Filename pattern:** `{club}_radar_2024.json`
- The `{club}` prefix matches the selected club identifier.

### Library
**Plotly.js** (`react-plotly.js`). Same rendering approach as Feature 1.

### Implementation notes
- Load JSON dynamically based on selected club.
- If no club is selected, show: *"Selecione um clube para visualizar o gráfico."*
- If the JSON file is not found, show a friendly error.
- Chart must be responsive.

### Tests — Feature 2
- [ ] Selecting a club loads and renders its Radar chart without console errors
- [ ] Radar chart axes and values are displayed correctly
- [ ] Switching clubs re-renders the Radar chart for the new club
- [ ] If no club is selected, prompt message is shown
- [ ] If JSON file is missing, friendly error is shown (no crash)
- [ ] Chart resizes correctly on window resize

---

## Feature 3 — Horizontal Bar Chart (Year-over-Year Comparison)

### Description
Plot a **horizontal grouped bar chart** comparing financial metrics between **2024 and 2023** for the selected club. Metrics are organized into **4 categories**, each with a distinct color. The two years are distinguished by different tones (light/dark) of the category color.

### Data source
- **File:** `/football-clubs-financials/data/Painel_Consolidado_Moeda_Cte.csv`
- The CSV has one row per metric. Each column represents a club. The column header matching the selected club is used to extract values.

### Metrics and CSV row mapping

| Category | Metric | Row 2024 | Row 2023 |
|---|---|---|---|
| **Receita** | Receita Total | 0 | 37 |
| **Receita** | Receita Recorrente | 1 | 38 |
| **Receita** | Receita c/ Transmissão + Premiações | 2 | 39 |
| **Receita** | Receita Comercial | 3 | 40 |
| **Receita** | Receita c/ Match-Day + Sócio-Torcedor | 4 | 41 |
| **Receita** | Receita c/ Negociação de atletas | 5 | 42 |
| **Despesa** | Custo das Atividades Esportivas | 9 | 46 |
| **Despesa** | Folha do Futebol | 6 | 43 |
| **Despesa** | Folha do Futebol + Amortização | 7 | 44 |
| **Despesa** | Aquisições de atletas | 18 | 53 |
| **Resultado** | Resultado Operacional (Segmento Futebol) | 10 | 47 |
| **Resultado** | Resultado | 11 | 48 |
| **Passivo** | Dívida Líquida | 12 | 49 |

> **Note:** `variáveis_bar_estádio` is **excluded** from this chart because stadium data is only available for 2024 and cannot be used in a year-over-year comparison.

### Color scheme (suggested)

| Category | Base color | 2024 tone | 2023 tone |
|---|---|---|---|
| Receita | Green | Dark green | Light green |
| Despesa | Red | Dark red | Light red/salmon |
| Resultado | Blue | Dark blue | Light blue |
| Passivo | Orange | Dark orange | Light orange |

### Library
**Recharts** (`recharts` npm package). Use `BarChart` with `layout="vertical"` for horizontal bars. Use a `Legend` to identify categories and years.

### Implementation notes
- Parse CSV using `papaparse` or native fetch + manual parsing.
- Values are monetary (BRL); format axis labels as `R$ X.XXX` or abbreviated (e.g., `R$ 1,2 bi`).
- Bars for 2024 and 2023 must appear side-by-side (grouped) for each metric.
- Category groupings must be visually separated (e.g., a thin divider line or category label on the Y-axis).
- If no club is selected, show: *"Selecione um clube para visualizar o gráfico."*
- If data for the club is not found in the CSV, show a friendly error.

### Tests — Feature 3
- [ ] Selecting a club loads and renders the bar chart without console errors
- [ ] All 13 metrics are displayed as horizontal bars
- [ ] Each metric shows two bars: one for 2024, one for 2023
- [ ] Bars for each category use the correct color family (green/red/blue/orange)
- [ ] 2024 and 2023 bars are distinguishable by color tone
- [ ] A legend is present identifying categories and years
- [ ] Monetary values are formatted readably on the axis
- [ ] Switching clubs updates the chart data correctly
- [ ] If no club is selected, prompt message is shown
- [ ] If club data is missing from CSV, friendly error is shown (no crash)
- [ ] Chart is responsive on different screen sizes

---

## Development Workflow Summary

```
Global Fixes → TEST ✓
     ↓
Feature 1 (Sankey) → TEST ✓
     ↓
Feature 2 (Radar) → TEST ✓
     ↓
Feature 3 (Bar Chart) → TEST ✓
```

Do **not** proceed to the next step until all tests for the current step pass.

---

## Dependencies to install (if not already present)

```bash
npm install react-plotly.js plotly.js recharts papaparse
```

---

## File structure reference

```
/football-clubs-financials/
├── public/
│   ├── clubs/          ← club icons (e.g., vasco.png, flamengo.png)
│   ├── sankey/         ← {club}_sankey_2024.json
│   └── radar/          ← {club}_radar_2024.json
└── data/
    └── Painel_Consolidado_Moeda_Cte.csv
```
