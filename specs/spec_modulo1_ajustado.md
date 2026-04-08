# Spec — Módulo 1: Análise Individual (Ajustado — Temporadas 2024 e 2025)
## Football Clubs Financials App (Next.js)

---

## Overview

Module 1 is named **"Análise Individual"**. It allows the user to select a season (2025 or 2024) and a Brazilian Série A football club, then explore four elements for that club and season:

1. **Resumo narrativo** (Markdown file rendered as HTML)
2. **Sankey Chart** (Income Statement)
3. **Radar Chart** (Selected Metrics)
4. **Bar Chart Comparativo** (2025 vs 2024, or 2024 vs 2023)

**Development rule:** Features must be implemented **one at a time**, in the order below. Each feature must pass its acceptance tests before the next one begins.

---

## Season & Club Selection

### Season selector
- A **year toggle or dropdown** allows the user to select the season: **2025** (default) or **2024**
- Changing the season resets the selected club and updates the club dropdown to show only clubs from that season
- The season selector must be visible at the top of the module, before the club dropdown

### Club lists per season

```js
const clubes_2024 = [
  "Athletico", "Atlético GO", "Atlético", "Bahia", "Botafogo",
  "Corinthians", "Criciúma", "Cruzeiro", "Cuiabá", "Flamengo",
  "Fluminense", "Fortaleza", "Grêmio", "Internacional", "Juventude",
  "Palmeiras", "São Paulo", "Vasco", "Vitória"
];

const clubes_2025 = [
  "Atlético", "Bahia", "Botafogo", "Ceará", "Corinthians",
  "Cruzeiro", "Flamengo", "Fluminense", "Fortaleza", "Grêmio",
  "Internacional", "Juventude", "Mirassol", "Palmeiras", "Santos",
  "São Paulo", "Sport", "Vasco", "Vitória"
];
```

### Club dropdown ordering
- **Vasco always appears first**, regardless of season
- All remaining clubs follow in **alphabetical order**
- The dropdown is populated dynamically based on the selected season

### Club icon
- Once a club is selected, display its **icon** from `/football-clubs-financials/public/clubs/`
- Icon filename must match the club identifier used in JSON/MD filenames
- Switching season or club updates the icon accordingly

### Prompt behaviour
- If no club is selected, show: *"Selecione um clube para visualizar a análise."*
- Do not render any content until both season and club are selected

---

## Global Fixes (unchanged from original spec — verify still applied)

1. Button label reads **"Análise Individual"** (no year suffix)
2. Subtitle: **"Explore as finanças dos clubes do Brasileirão"** (correct diacritics)
3. Vasco first in dropdown, remaining clubs A–Z

---

## File naming convention

All assets follow the pattern `{clube}_{type}_{ano}`, where `{clube}` is the club identifier (lowercase, no spaces/accents — matches the key used across all public asset folders).

| Asset | Season 2025 | Season 2024 |
|---|---|---|
| Resumo (Markdown) | `/public/summaries/resumo_{clube}_2025.md` | `/public/summaries/resumo_{clube}_2024.md` |
| Sankey JSON | `/public/sankey/{clube}_sankey_2025.json` | `/public/sankey/{clube}_sankey_2024.json` |
| Radar JSON | `/public/radar/{clube}_radar_2025.json` | `/public/radar/{clube}_radar_2024.json` |
| Bar chart CSV | `/public/data/Painel_Consolidado_Moeda_Cte_2025.csv` | `/public/data/Painel_Consolidado_Moeda_Cte_2024.csv` |

---

## Element 1 — Resumo Narrativo (Markdown)

### Description
Render a Markdown summary of the selected club's financial season, displayed **at the top of the page**, before all charts.

### Data source
- Season 2025: `/public/summaries/resumo_{clube}_2025.md`
- Season 2024: `/public/summaries/resumo_{clube}_2024.md`

### Library
**`react-markdown`** — renders the `.md` file as formatted HTML within the page.

### Implementation notes
- Fetch the `.md` file via `fetch()` on club/season selection
- Pass the text content to `<ReactMarkdown>`
- Style the rendered output consistently with the app's typography (headings, paragraphs, bold, lists)
- Display inside a styled card or panel with padding and a subtle border or background
- If the `.md` file is not found (404), show a friendly message: *"Resumo não disponível para este clube."* — do not crash
- If no club is selected, show the generic prompt (no resumo rendered)

### Tests — Element 1
- [ ] Selecting a club and season renders the Markdown resumo at the top of the page
- [ ] Markdown formatting is applied (headings, bold, lists render as HTML)
- [ ] Switching clubs updates the resumo content
- [ ] Switching seasons updates the resumo content
- [ ] If `.md` file is missing, friendly message is shown (no crash)
- [ ] Resumo appears **before** the Sankey chart in the page layout

---

## Element 2 — Sankey Chart (Income Statement)

### Description
Render a pre-built Plotly Sankey chart for the selected club and season.

### Data source
- Season 2025: `/public/sankey/{clube}_sankey_2025.json`
- Season 2024: `/public/sankey/{clube}_sankey_2024.json`

### Library
**Plotly.js** (`react-plotly.js`). Pass JSON `data` and `layout` props directly to `<Plot>`.

### Implementation notes
- Load JSON dynamically on club/season selection
- Responsive: `useResizeHandler={true}`, `style={{ width: "100%" }}`
- If no club selected: show prompt
- If JSON missing: show friendly error

### Tests — Element 2
- [ ] Selecting club + season renders the Sankey chart without console errors
- [ ] Plotly nodes and links are displayed correctly
- [ ] Switching clubs re-renders chart for new club
- [ ] Switching seasons re-renders chart for new season
- [ ] Missing JSON → friendly error (no crash)
- [ ] Chart resizes correctly on window resize

---

## Element 3 — Radar Chart (Selected Metrics)

### Description
Render a pre-built Plotly Radar chart for the selected club and season.

### Data source
- Season 2025: `/public/radar/{clube}_radar_2025.json`
- Season 2024: `/public/radar/{clube}_radar_2024.json`

### Library
**Plotly.js** (`react-plotly.js`). Same rendering approach as Element 2.

### Implementation notes
- Same dynamic loading pattern as Sankey
- Responsive
- If no club selected: show prompt
- If JSON missing: show friendly error

### Tests — Element 3
- [ ] Selecting club + season renders the Radar chart without console errors
- [ ] Radar axes and values display correctly
- [ ] Switching clubs re-renders chart
- [ ] Switching seasons re-renders chart
- [ ] Missing JSON → friendly error (no crash)
- [ ] Chart resizes correctly on window resize

---

## Element 4 — Bar Chart Comparativo (Year-over-Year)

### Description
A **horizontal grouped bar chart** comparing financial metrics across two consecutive seasons:
- **Season 2025 selected** → compares **2025 vs 2024**
- **Season 2024 selected** → compares **2024 vs 2023**

### Data source

The file used depends **exclusively on the selected season**. Each file contains both the current and prior year data internally (current year in rows 0–36, prior year in rows 37–53):

| Selected season | Comparison shown | CSV file to load | Current year rows | Prior year rows |
|---|---|---|---|---|
| **2025** | Comparativo 2025 vs 2024 | `/public/data/Painel_Consolidado_Moeda_Cte_2025.csv` | 0–18 (2025 data) | 37–53 (2024 data) |
| **2024** | Comparativo 2024 vs 2023 | `/public/data/Painel_Consolidado_Moeda_Cte_2024.csv` | 0–18 (2024 data) | 37–53 (2023 data) |

> **Critical rule:** The `_2025` file is used when the user selects season 2025 — it contains both 2025 and 2024 data. The `_2024` file is used when the user selects season 2024 — it contains both 2024 and 2023 data. **Never cross-load files** (do not load the `_2024` file to obtain prior year data when season 2025 is selected).

### Metrics and row mapping

| Category | Metric | Current year rows | Prior year rows |
|---|---|---|---|
| **Receita** | Receita Operacional | 0 | 37 |
| **Receita** | Receita Recorrente | 1 | 38 |
| **Receita** | Receita c/ Transmissão + Premiações | 2 | 39 |
| **Receita** | Receita Comercial | 3 | 40 |
| **Receita** | Receita c/ Match-Day + Sócio-Torcedor | 4 | 41 |
| **Receita** | Receita c/ Negociação de atletas | 5 | 42 |
| **Despesa** | Custo da Atividade Esportiva | 9 | 46 |
| **Despesa** | Folha do Futebol | 6 | 43 |
| **Despesa** | Folha do Futebol + Amortização | 7 | 44 |
| **Despesa** | Aquisições de atletas | 18 | 53 |
| **Resultado** | Resultado Operacional (Segmento Futebol) | 10 | 47 |
| **Resultado** | Resultado | 11 | 48 |
| **Passivo** | Dívida Líquida | 12 | 49 |

> Row indices are **identical** across both CSV files — only the file changes per season.

### Color scheme

| Category | Base color | Current year tone | Prior year tone |
|---|---|---|---|
| Receita | Green | Dark green | Light green |
| Despesa | Red | Dark red | Light red/salmon |
| Resultado | Blue | Dark blue | Light blue |
| Passivo | Orange | Dark orange | Light orange |

### Library
**Recharts** — `BarChart` with `layout="vertical"` (horizontal bars).

### Implementation notes
- Chart title must reflect the comparison: **"Comparativo 2025 vs 2024"** or **"Comparativo 2024 vs 2023"** depending on selected season
- Legend identifies both years and categories
- Bars for current and prior year appear side-by-side (grouped) per metric
- Category groupings visually separated
- Values formatted as abbreviated BRL (e.g., `R$ 1,2 bi`)
- Prior year data for a club that did not participate in that season (e.g., Ceará in 2024): show zero for all prior year bars, with a note: *"Dados do ano anterior não disponíveis para este clube."*
- If no club selected: show prompt
- If club column missing from CSV: show friendly error

### Tests — Element 4
- [ ] Selecting club + season 2025 renders chart titled "Comparativo 2025 vs 2024"
- [ ] Selecting club + season 2024 renders chart titled "Comparativo 2024 vs 2023"
- [ ] All 13 metrics displayed as horizontal bar pairs
- [ ] Current year and prior year bars are grouped side-by-side per metric
- [ ] Category colors are correct (green/red/blue/orange)
- [ ] Current and prior year bars are distinguishable by tone
- [ ] Legend identifies both years and categories
- [ ] Monetary values formatted correctly on axis
- [ ] Switching clubs updates chart data
- [ ] Switching seasons updates chart title, data, and year labels
- [ ] Club with no prior year data (e.g., Ceará selecting 2025): prior year bars show zero + note displayed
- [ ] Missing club column in CSV → friendly error (no crash)
- [ ] Chart is responsive

---

## Page Layout (per club + season selection)

```
┌──────────────────────────────────────┐
│  [Season selector: 2025 | 2024]      │
│  [Club dropdown]  [Club icon]        │
├──────────────────────────────────────┤
│  Element 1: Resumo (.md)             │
├──────────────────────────────────────┤
│  Element 2: Sankey Chart             │
├──────────────────────────────────────┤
│  Element 3: Radar Chart              │
├──────────────────────────────────────┤
│  Element 4: Bar Chart Comparativo    │
└──────────────────────────────────────┘
```

---

## Development Workflow

```
Season + Club selectors (shared UI) → TEST ✓
          ↓
Element 1 (Resumo Markdown) → TEST ✓
          ↓
Element 2 (Sankey Chart) → TEST ✓
          ↓
Element 3 (Radar Chart) → TEST ✓
          ↓
Element 4 (Bar Chart Comparativo) → TEST ✓
```

Do **not** proceed to the next element until all tests for the current one pass.

---

## Dependencies

```bash
npm install react-plotly.js plotly.js recharts papaparse react-markdown
```

---

## File structure reference

```
/football-clubs-financials/
└── public/
    ├── clubs/              ← club icons
    ├── summaries/          ← resumo_{clube}_2024.md, resumo_{clube}_2025.md
    ├── sankey/             ← {clube}_sankey_2024.json, {clube}_sankey_2025.json
    ├── radar/              ← {clube}_radar_2024.json, {clube}_radar_2025.json
    └── data/
        ├── Painel_Consolidado_Moeda_Cte_2024.csv   ← used when season 2024 selected (contains 2024 + 2023 data)
        └── Painel_Consolidado_Moeda_Cte_2025.csv   ← used when season 2025 selected (contains 2025 + 2024 data)
```

---

## Notes for claude-code

- Build a **`useModulo1Data` hook** (or equivalent) that takes `{ season, clube }` as inputs and returns all four assets (resumo text, sankey JSON, radar JSON, bar chart data). This centralises asset loading and error handling.
- When the season changes, **reset the selected club to null** before repopulating the dropdown — prevents a stale club from a different season remaining selected.
- Clubs that appear in `clubes_2025` but not in `clubes_2024` (e.g., Ceará, Mirassol, Santos, Sport) will have no prior year data in the 2024 CSV. Handle this gracefully in Element 4 as specified above.
- Clubs that appear in `clubes_2024` but not in `clubes_2025` (e.g., Athletico, Atlético GO, Criciúma, Cuiabá, Fluminense [check], Juventude [check]) will simply not appear in the 2025 dropdown — no special handling needed.
