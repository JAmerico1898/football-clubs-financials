# Spec — Módulo 3: Análise Conjunta
## Football Clubs Financials App (Next.js)

---

## Overview

Módulo 3 is named **"Análise Conjunta"**. It allows the user to select a club, an X-axis metric, and a Y-axis metric, then renders a **scatter plot** where each point represents a club (displayed as the club's icon). The chart also shows the **linear regression line**, **R²**, and **Pearson correlation coefficient**.

---

## Club Selection

- Club selector identical to Módulos 1 and 2:
  - **Vasco appears first**, remaining clubs in **alphabetical order**
  - Selecting a club **highlights** that club's point on the scatter plot (see Visual Requirements)
  - Selecting a club displays its **icon** from `/football-clubs-financials/public/clubs/`
- If club, X metric, or Y metric is not yet selected, show: *"Selecione um clube e as métricas dos eixos para visualizar."*

---

## Metric Selectors

Two independent dropdowns — one for the X-axis, one for the Y-axis.

### X-axis metrics (`variáveis_conjuntas_x`)
- Receita Total
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

> **Note:** The same metric can appear on both axes (user's choice). The spec does not restrict this.

---

## Data Source

- **File:** `/football-clubs-financials/data/Índices.csv`
- **Year:** 2024 only — each club appears as **one point** on the scatter plot.
- Each row corresponds to a metric; each column corresponds to a club.
- Extract the row matching the selected X metric → one value per club.
- Extract the row matching the selected Y metric → one value per club.
- Each club becomes a point `(x, y)` on the chart.

---

## Chart: Scatter Plot with Regression Line

### Library
**Plotly.js** (`react-plotly.js`). Use a `scatter` trace with `mode: 'markers'` for club points, and a separate `scatter` trace with `mode: 'lines'` for the regression line.

### Club icons as markers
- Each club's point must be rendered using the club's **icon image** as the marker.
- Icons are available at `/football-clubs-financials/public/clubs/`.
- In Plotly, use `marker.symbol` with image markers, or render each club as a separate trace with a custom image marker using the `images` layout property or `marker: { symbol: 'url(...)' }` approach.
- Icon size should be consistent and large enough to be recognizable (suggested: 32–40px).

### Selected club highlight
- The **selected club's icon** must be visually emphasized:
  - Larger marker size than other clubs (e.g., 1.5× the standard size)
  - A visible border/outline around the icon (e.g., colored ring or shadow)
- All other clubs display at standard size with no border.

### Regression line
- Compute a **simple linear regression** (OLS) from the `(x, y)` data points of all clubs.
- Plot the regression line across the full range of X values as a straight line trace.
- Line style: dashed or solid, neutral color (e.g., dark grey), thin stroke.
- The regression calculation must be done in JavaScript (no external stats library required — implement manually or use a simple utility):
  ```
  slope = (n·Σxy − Σx·Σy) / (n·Σx² − (Σx)²)
  intercept = (Σy − slope·Σx) / n
  ```

### Statistical annotations
Display the following on the chart (as a Plotly annotation or text box in a corner):
- **R²** (coefficient of determination): `R² = 0.XX`
- **Pearson r** (correlation coefficient): `r = 0.XX`
- Both values rounded to 2 decimal places.
- Formulas:
  ```
  r = (n·Σxy − Σx·Σy) / sqrt[(n·Σx² − (Σx)²) · (n·Σy² − (Σy)²)]
  R² = r²
  ```

### Axes and labels
- **X-axis label:** selected X metric name
- **Y-axis label:** selected Y metric name
- **Chart title:** `"{Y metric} vs. {X metric}"`
- Axis values formatted according to metric type:
  - Monetary (R$): abbreviated (e.g., `R$ 1,2 bi`)
  - Euro values (€): abbreviated (e.g., `€ 85 mi`)
  - Ratios/percentages: `%` or decimal as appropriate
  - Integer counts: plain integer

### Tooltip
On hover over a club's point, display:
- Club name
- X value (formatted)
- Y value (formatted)

### Responsiveness
- Chart must be responsive (`useResizeHandler={true}`, `style={{ width: "100%" }}`).

---

## Tests — Módulo 3

### Selectors
- [ ] Club selector shows Vasco first, remaining clubs in A–Z order
- [ ] Selecting a club shows its icon below/beside the selector
- [ ] X-axis dropdown contains all 9 `variáveis_conjuntas_x` metrics
- [ ] Y-axis dropdown contains all 4 `variáveis_conjuntas_y` metrics
- [ ] If any selector is unset, the prompt message is shown and no chart renders

### Scatter plot
- [ ] Selecting club + X metric + Y metric renders the scatter plot without console errors
- [ ] All clubs appear as points on the chart (one point per club)
- [ ] Each point renders the club's icon as the marker
- [ ] The selected club's point is larger and has a visible border/highlight
- [ ] Switching the selected club updates the highlight without re-fetching data
- [ ] Switching X or Y metric reloads chart data and updates axis labels and title

### Regression line
- [ ] A regression line is drawn across the scatter plot
- [ ] The line spans the full range of X values
- [ ] The line visually fits the distribution of points

### Statistical annotations
- [ ] R² value is displayed on the chart, rounded to 2 decimal places
- [ ] Pearson r value is displayed on the chart, rounded to 2 decimal places
- [ ] Both values update correctly when metrics are changed

### Axes and labels
- [ ] X-axis label matches the selected X metric name
- [ ] Y-axis label matches the selected Y metric name
- [ ] Chart title reads "{Y metric} vs. {X metric}"
- [ ] Axis tick values are formatted correctly (monetary, euro, ratio, integer)

### Tooltip
- [ ] Hovering over a club's point shows club name, X value, and Y value
- [ ] Values in tooltip are formatted correctly

### Robustness
- [ ] If a club has a missing value for a metric, it is **excluded** from the chart (not plotted, not included in regression)
- [ ] If fewer than 3 valid data points exist (unlikely but possible), display a warning: *"Dados insuficientes para calcular a regressão."*
- [ ] If a metric is not found in `Índices.csv`, a friendly error is displayed (no crash)
- [ ] Chart resizes correctly on window resize

---

## Dependencies

Should already be installed. Confirm:

```bash
npm install react-plotly.js plotly.js
```

No external statistics library is needed — R² and Pearson r are computed manually in JavaScript as described above.

---

## File structure reference

```
/football-clubs-financials/
├── public/
│   └── clubs/          ← club icons (same as Módulos 1 and 2)
└── data/
    └── Índices.csv     ← 2024 cross-section data (same as Módulo 2, Feature 1)
```

---

## Notes for claude-code

- The club selector component should be reused from Módulos 1/2.
- Plotly's native image marker support may require rendering each club as a **separate single-point trace** with a custom `marker.symbol` using the image URL. This is the most reliable approach for per-point icon images in Plotly.js.
- Compute regression and correlation **after** filtering out any clubs with `null`, `undefined`, or `NaN` values for either metric.
- The statistical annotation box should be positioned in a corner that does not overlap data points (use Plotly's `annotations` layout array with `xref: 'paper'`, `yref: 'paper'` for fixed positioning).
