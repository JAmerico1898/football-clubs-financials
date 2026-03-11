# Spec — Módulo 2: Análise Comparativa Simples
## Football Clubs Financials App (Next.js)

---

## Overview

Módulo 2 is named **"Análise Comparativa Simples"**. It allows the user to select a club and a metric, then explore two comparative visualizations of that metric across all clubs in the league.

**Development rule:** Features must be implemented **one at a time**, in the order below. Each feature must pass its acceptance tests before the next one begins.

---

## Club Selection (shared across both features)

- Club selector must be identical to Módulo 1:
  - **Vasco appears first**, remaining clubs in **alphabetical order**
  - Selecting a club displays its **icon** from `/football-clubs-financials/public/clubs/`
- A **metric selector** must allow the user to choose from three grouped categories:
  - **Financeiras** → `variáveis_simples_financeiras`
  - **Esportivas** → `variáveis_simples_esportivas`
  - **Gerenciais** → `variáveis_simples_gerenciais`
- Both selectors (club + metric) must be visible and functional before either chart renders.
- If either club or metric is not yet selected, show: *"Selecione um clube e uma métrica para visualizar."*

### Metric lists

**Financeiras:**
- Receita Total
- Receita Recorrente
- Receita c/ Transmissão + Premiações
- Receita Comercial
- Receita c/ Match-Day + Sócio-Torcedor
- Receita c/ Negociação de atletas
- Custo das Atividades Esportivas
- Resultado Operacional (Segmento Futebol)
- Resultado
- Dívida Líquida

**Esportivas:**
- Folha do Futebol
- Folha do Futebol + Compra de Jogadores
- Aquisições de atletas
- Público médio (mandante)
- % Ocupação
- Capacidade do estádio
- Bilheteria Série A (R$ milhões)
- Bilheteria média (R$ mil/jogo)
- Pontuação Série A
- Sócios-Torcedores
- Valor do Elenco (€ milhões)

**Gerenciais:**
- Público Médio / Sócios-Torcedores
- Dívida/Receita Total
- Folha do futebol / Receita Total
- (Folha futebol + Compra de Jogadores) / Receita Total
- Folha do Futebol / Pontuação Série A
- Custo das Atividades Esportivas / Receita Total
- Ticket Médio

---

## Feature 1 — Bar Chart: Cross-Club Comparison (2024)

### Description
Plot a **vertical bar chart** showing the selected metric for **all clubs in 2024**, allowing the user to visually compare the selected club against the rest of the league.

### Data source
- **File:** `/football-clubs-financials/data/Índices.csv`
- Each row corresponds to a metric; each column corresponds to a club.
- The row matching the selected metric name is used to extract values for all clubs.

### Library
**Recharts** — use `BarChart` with `layout="horizontal"` (vertical bars). Each club is a bar on the X-axis.

### Visual requirements
- The **selected club's bar must be visually highlighted** (distinct color or stronger tone) compared to the other clubs.
- Bars for non-selected clubs use a neutral color (e.g., light grey or muted blue).
- X-axis: club names (abbreviated if needed to avoid overlap; consider angled labels).
- Y-axis: metric values, formatted according to metric type:
  - Monetary values (R$): abbreviated format (e.g., `R$ 1,2 bi`, `R$ 850 mi`)
  - Ratios/percentages: show as `%` or decimal as appropriate
  - Integer counts (e.g., Sócios-Torcedores, Pontuação): plain integer
- A **chart title** must display the selected metric name.
- A **tooltip** must show the club name and exact value on hover.
- Clubs on the X-axis must follow the same order as the club selector: **Vasco first, then A–Z**.

### Tests — Feature 1
- [ ] Selecting a club and metric renders the bar chart without console errors
- [ ] All clubs appear as bars on the X-axis
- [ ] The selected club's bar is visually distinct from the others
- [ ] Y-axis values are formatted correctly (monetary, ratio, or integer)
- [ ] Chart title matches the selected metric name
- [ ] Tooltip shows club name and exact value on hover
- [ ] Switching clubs updates the highlight without re-fetching data
- [ ] Switching metrics updates the chart data and title
- [ ] If club or metric not selected, prompt message is shown (no chart)
- [ ] If metric is not found in the CSV, a friendly error is displayed (no crash)
- [ ] Chart is responsive on different screen sizes

---

## Feature 2 — Line Chart: Historical Evolution (2021–2024)

### Description
Plot a **multi-line chart** showing the evolution of the selected metric from **2021 to 2024** for **all clubs in the league**. The selected club's line is **highlighted**; all other clubs appear as thinner, more transparent lines.

### Data source
- **File:** `/football-clubs-financials/data/ÍndicesPainel_Consolidado_Moeda_Cte.csv`
- This file contains multi-year data (2021, 2022, 2023, 2024) for all clubs and metrics.
- Data in this file is **adjusted for inflation (IPCA index)** — this must be noted visually on the chart (e.g., subtitle or annotation: *"Valores em moeda constante (IPCA)"*).

### Library
**Recharts** — use `LineChart` with one `Line` per club. X-axis represents years (2021–2024).

### Visual requirements
- **Selected club line:**
  - Thick stroke (e.g., `strokeWidth={3}`)
  - Distinct accent color (e.g., club color or bright highlight)
  - Data points marked with dots
  - Club name label at end of line (or in legend, clearly identified)
- **Other clubs' lines:**
  - Thin stroke (e.g., `strokeWidth={1}`)
  - Muted/grey color with reduced opacity (e.g., `opacity={0.4}`)
  - No dots on data points
- X-axis: years 2021, 2022, 2023, 2024
- Y-axis: formatted same as Feature 1 (monetary, ratio, integer)
- Chart title: selected metric name
- Subtitle/annotation: *"Valores em moeda constante (IPCA)"*
- **Tooltip** on hover: show year, all clubs' values (or at minimum the hovered club's value)
- A **legend** must identify the selected club

### Missing data handling
- If a club has no data for a given year (e.g., newly promoted clubs), **display zero** for that year.
- Do not omit the club from the chart.

### Tests — Feature 2
- [ ] Selecting a club and metric renders the line chart without console errors
- [ ] Lines for all clubs are displayed (one line per club)
- [ ] Selected club's line is visually distinct: thicker, different color, with dots
- [ ] Other clubs' lines are thinner and more transparent
- [ ] X-axis shows years 2021, 2022, 2023, 2024
- [ ] Y-axis values are formatted correctly
- [ ] Chart title matches the selected metric name
- [ ] IPCA inflation adjustment note is visible on the chart
- [ ] Clubs with missing data for a year show zero (not a gap or error)
- [ ] Tooltip shows year and relevant values on hover
- [ ] Switching clubs updates the highlight correctly
- [ ] Switching metrics reloads chart data and title
- [ ] If club or metric not selected, prompt message is shown
- [ ] If metric not found in the CSV, friendly error is displayed (no crash)
- [ ] Chart is responsive on different screen sizes

---

## Development Workflow Summary

```
Club + Metric selectors (shared UI) → TEST ✓
          ↓
Feature 1 (Bar Chart — 2024 comparison) → TEST ✓
          ↓
Feature 2 (Line Chart — 2021–2024 evolution) → TEST ✓
```

Do **not** proceed to the next step until all tests for the current step pass.

---

## Dependencies

These should already be installed from Módulo 1. Confirm before starting:

```bash
npm install recharts papaparse
```

---

## File structure reference

```
/football-clubs-financials/
├── public/
│   └── clubs/                              ← club icons
└── data/
    ├── Índices.csv                          ← Feature 1 data (2024 cross-section)
    └── ÍndicesPainel_Consolidado_Moeda_Cte.csv  ← Feature 2 data (2021–2024, IPCA-adjusted)
```

---

## Notes for claude-code

- The metric selector UI (grouped dropdown with Financeiras / Esportivas / Gerenciais categories) is shared between both features. Build it once as a reusable component before starting Feature 1.
- The club selector component from Módulo 1 should be reused or extracted into a shared component.
- Both charts must render inside the same Módulo 2 page, stacked vertically (Feature 1 on top, Feature 2 below), or as tabs — developer's choice based on visual balance.
