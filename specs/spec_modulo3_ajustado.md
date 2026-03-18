# Spec — Módulo 3: Análise Conjunta (Ajustado — Temporadas 2024, 2025 e 2025 & 2024)
## Football Clubs Financials App (Next.js)

---

## Overview

Módulo 3 is named **"Análise Conjunta"**. It allows the user to select a period, a club, an X-axis metric, and a Y-axis metric, then renders a **scatter plot** where each point represents a club. The chart also shows the **linear regression line**, **R²**, and **Pearson correlation coefficient**.

The module supports three period options with distinct behaviour:

| Period option | Data source | Points per club | Markers |
|---|---|---|---|
| **2025** (default) | `Índices_2025.csv` only | 1 per club (19 clubs) | Club badge icon |
| **2024** | `Índices_2024.csv` only | 1 per club (19 clubs) | Club badge icon |
| **2025 & 2024** | Both files combined | ~2 per club (up to 38 points) | Colored dots (no badges) |

---

## Period & Club Selection

### Period selector
- A **toggle or dropdown** at the top of the module with three options: **2025** (default), **2024**, **2025 & 2024**
- Changing the period:
  - Resets the selected club to null
  - Repopulates the club dropdown with the correct club list (see below)
  - Reloads chart data

### Club lists per period

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

- Period **2025** → dropdown shows `clubes_2025`
- Period **2024** → dropdown shows `clubes_2024`
- Period **2025 & 2024** → dropdown shows the **union** of both lists, deduplicated, Vasco first then A–Z

### Club dropdown ordering
- **Vasco always appears first**, regardless of period
- All remaining clubs follow in **alphabetical order**

### Club icon display
- When period is **2025** or **2024**: selecting a club shows its **badge icon** from `/football-clubs-financials/public/clubs/`
- When period is **2025 & 2024**: show the club icon from `/public/clubs/` if available; otherwise omit (the club highlight on the chart uses color, not a badge)

### Prompt behaviour
- If period is selected but club, X metric, or Y metric is not yet chosen, show: *"Selecione um clube e as métricas dos eixos para visualizar."*

---

## File Naming Convention

**Critical rule:** The file used is determined **exclusively by the selected period**. Never cross-load files.

| Selected period | File(s) to load |
|---|---|
| **2025** | `/public/data/Índices_2025.csv` only |
| **2024** | `/public/data/Índices_2024.csv` only |
| **2025 & 2024** | Both `/public/data/Índices_2025.csv` **and** `/public/data/Índices_2024.csv` |

---

## Metric Selectors

Two independent dropdowns — one for X-axis, one for Y-axis. These are the same across all periods.

### X-axis metrics (`variáveis_conjuntas_x`)
- Receita Operacional
- Custo das Atividades Esportivas
- Folha do Futebol
- Folha do Futebol + Compra de Jogadores
- Aquisições de atletas
- Capacidade do estádio
- Dívida Líquida
- Valor do Elenco (€ milhões)
- Resultado

### Y-axis metrics (`variáveis_conjuntas_y`)
- Pontuação Série A
- Valor do Elenco (€ milhões)
- Bilheteria média Série A (R$ mil/jogo)
- Receita c/ Match-Day + Sócio-Torcedor

> The same metric can appear on both axes. The spec does not restrict this.

---

## Chart: Scatter Plot — Periods 2025 and 2024

This section applies when the selected period is **2025** or **2024** (single-season mode).

### Library
**Plotly.js** (`react-plotly.js`).

### Data
- Load the single CSV for the selected period (see File Naming Convention)
- One point `(x, y)` per club in the selected season's club list
- Clubs with `null`, `undefined`, or `NaN` for either metric are **excluded** from the chart and regression

### Club badge markers
- Each point is rendered using the club's **badge icon** from `/public/clubs/`
- Render each club as a **separate single-point trace** with the image URL as the marker (most reliable Plotly approach)
- Consistent icon size: 32–40px

### Selected club highlight
- The selected club's point is **larger** (1.5× standard size) with a visible **border/outline**
- All other clubs display at standard size with no border
- Switching the selected club updates the highlight without re-fetching data

### Regression line
- Simple OLS linear regression computed from all valid `(x, y)` points in the selected season
- Rendered as a separate `scatter` trace with `mode: 'lines'`, dashed or solid neutral color (dark grey)
- Spans the full range of X values

### Statistical annotations
- **R²** and **Pearson r** displayed in a fixed corner of the chart (Plotly `annotations` with `xref: 'paper'`, `yref: 'paper'`)
- Both rounded to 2 decimal places
- Update when metrics or period change

### Formulas (implement in JavaScript, no external library)
```
slope     = (n·Σxy − Σx·Σy) / (n·Σx² − (Σx)²)
intercept = (Σy − slope·Σx) / n
r         = (n·Σxy − Σx·Σy) / sqrt[(n·Σx² − (Σx)²) · (n·Σy² − (Σy)²)]
R²        = r²
```

### Axes and labels
- X-axis label: selected X metric name
- Y-axis label: selected Y metric name
- Chart title: `"{Y metric} vs. {X metric} — {year}"` (e.g., *"Pontuação Série A vs. Receita Operacional — 2025"*)
- Axis tick formatting:
  - Monetary (R$): abbreviated (e.g., `R$ 1,2 bi`)
  - Euro (€): abbreviated (e.g., `€ 85 mi`)
  - Ratios/percentages: `%` or decimal
  - Integer counts: plain integer

### Tooltip (on hover)
- Club name
- X value (formatted)
- Y value (formatted)

---

## Chart: Scatter Plot — Period 2025 & 2024

This section applies **only** when the selected period is **2025 & 2024** (combined mode).

### Data
- Load **both** `/public/data/Índices_2025.csv` and `/public/data/Índices_2024.csv`
- Combine into a single dataset: each observation is a `(club, year, x, y)` tuple
- Up to ~38 points total (19 clubs × 2 years; fewer if a club only appears in one season)
- Clubs with missing values for either metric are excluded observation-by-observation (a club may appear for one year but not the other)

### Markers — colored dots, no badges
- **No badge icons** in this mode — use plain circular dots for all points
- **Color encodes the year:**
  - 2025 points: **blue** (suggested: `#1565C0`)
  - 2024 points: **orange** (suggested: `#E65100`)
- All points use the same dot size (standard, no size distinction by default)

### Selected club highlight
- The selected club's points (one or two, depending on availability) are highlighted:
  - **Larger dot size** (1.5× standard)
  - **Visible border/outline** around the dot
  - Both the 2025 and 2024 points for the selected club are highlighted simultaneously
- All other clubs' points display at standard size with no border

### Regression line
- Computed from **all valid observations across both years** (2025 + 2024 combined)
- Single regression line — does not split by year
- Same formula and rendering as single-season mode

### Statistical annotations
- R² and Pearson r computed from the **combined 2025 + 2024 dataset**
- Same display format as single-season mode
- Chart subtitle or annotation notes: *"Regressão calculada sobre 2025 e 2024 combinados"*

### Legend
- A **legend** must identify the two colors:
  - 🔵 2025
  - 🟠 2024

### Axes and labels
- Chart title: `"{Y metric} vs. {X metric} — 2025 & 2024"`
- Same axis formatting as single-season mode

### Tooltip (on hover)
- Club name
- Year (2025 or 2024)
- X value (formatted)
- Y value (formatted)

---

## Tests — Módulo 3

### Period and club selectors
- [ ] Period selector shows three options: 2025, 2024, 2025 & 2024
- [ ] Default period is 2025
- [ ] Period 2025 → club dropdown shows `clubes_2025` (Vasco first, then A–Z)
- [ ] Period 2024 → club dropdown shows `clubes_2024` (Vasco first, then A–Z)
- [ ] Period 2025 & 2024 → club dropdown shows union of both lists (Vasco first, then A–Z, deduplicated)
- [ ] Changing period resets selected club and updates dropdown
- [ ] Selecting a club in periods 2025 or 2024 shows its badge icon
- [ ] If any selector is unset, prompt message is shown and no chart renders

### File loading
- [ ] Period 2025 loads **only** `/public/data/Índices_2025.csv`
- [ ] Period 2024 loads **only** `/public/data/Índices_2024.csv`
- [ ] Period 2025 & 2024 loads **both** files
- [ ] No cross-loading between seasons (2024 file never loaded for period 2025, and vice versa)

### Scatter plot — single season (2025 or 2024)
- [ ] All clubs for the selected season appear as one point each
- [ ] Each point renders the club's badge icon as the marker
- [ ] Selected club's point is larger with a visible border
- [ ] Switching selected club updates highlight without re-fetching
- [ ] Switching metrics reloads chart data and updates axis labels and title
- [ ] Chart title includes the selected year

### Scatter plot — 2025 & 2024 combined
- [ ] Points from both seasons appear on the chart (up to ~38 points)
- [ ] **No badge icons** — plain dots only
- [ ] 2025 points are blue, 2024 points are orange
- [ ] A legend identifies the two colors (2025 / 2024)
- [ ] Selected club's points (both years if available) are larger with a visible border
- [ ] Tooltip shows club name, year, X value, Y value
- [ ] Chart title reads "{Y metric} vs. {X metric} — 2025 & 2024"

### Regression line (all modes)
- [ ] Regression line is drawn across the scatter plot
- [ ] Line spans the full range of X values
- [ ] In 2025 & 2024 mode, regression uses all combined observations

### Statistical annotations (all modes)
- [ ] R² displayed, rounded to 2 decimal places
- [ ] Pearson r displayed, rounded to 2 decimal places
- [ ] In 2025 & 2024 mode, annotation notes that regression covers both years combined
- [ ] Values update when period or metrics change

### Axes and labels
- [ ] X-axis label matches selected X metric
- [ ] Y-axis label matches selected Y metric
- [ ] Chart title format is correct for each period mode
- [ ] Axis tick values formatted correctly (monetary, euro, ratio, integer)

### Robustness
- [ ] Clubs with missing metric values are excluded per-observation (not per-club)
- [ ] Fewer than 3 valid points → warning: *"Dados insuficientes para calcular a regressão."*
- [ ] Missing metric in CSV → friendly error (no crash)
- [ ] Chart resizes correctly on window resize

---

## Dependencies

Already installed. Confirm:

```bash
npm install react-plotly.js plotly.js
```

---

## File structure reference

```
/football-clubs-financials/
├── public/
│   ├── clubs/                        ← club badge icons
│   └── data/
│       ├── Índices_2024.csv          ← period 2024 and one half of period 2025 & 2024
│       └── Índices_2025.csv          ← period 2025 and other half of period 2025 & 2024
```

---

## Notes for claude-code

- Reuse the club selector component from Módulos 1/2.
- For single-season mode, render each club as a **separate single-point Plotly trace** with the badge image URL — most reliable approach for per-point icons in Plotly.js.
- For 2025 & 2024 combined mode, switch to **two multi-point traces** (one per year), each using plain `marker: { color, size, line }` — no image markers. This is simpler and more performant for ~38 points.
- Compute regression and correlation **after** filtering out observations with `null`, `undefined`, or `NaN` for either metric, across both datasets in combined mode.
- The statistical annotation box must be positioned with `xref: 'paper'`, `yref: 'paper'` to avoid overlapping data points.
- In combined mode, fetching both CSV files can be done in parallel with `Promise.all([fetch(url2025), fetch(url2024)])`.
