# Spec — Módulo 2: Análise Comparativa Simples (Ajustado — Temporadas 2024 e 2025)
## Football Clubs Financials App (Next.js)

---

## Overview

Módulo 2 is named **"Análise Comparativa Simples"**. It allows the user to select a season, a club, and a metric, then explore two comparative visualizations of that metric across all clubs in the league.

**Development rule:** Features must be implemented **one at a time**, in the order below. Each feature must pass its acceptance tests before the next one begins.

---

## Season & Club Selection (shared across both features)

### Season selector
- A **year toggle or dropdown** allows the user to select the season: **2025** (default) or **2024**
- Changing the season **resets the selected club** and repopulates the club dropdown with the correct club list for that season
- The season selector must be visible at the top of the module, before the club and metric dropdowns

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
- Dropdown is populated dynamically based on the selected season

### Club icon
- Once a club is selected, display its **icon** from `/football-clubs-financials/public/clubs/`
- Switching season or club updates the icon accordingly

### Metric selector
- A grouped dropdown allows the user to choose from three categories:
  - **Financeiras** → `variáveis_simples_financeiras`
  - **Esportivas** → `variáveis_simples_esportivas`
  - **Gerenciais** → `variáveis_simples_gerenciais`
- The metric selector is **shared across both features** — build it once as a reusable component
- Metric selection does **not** reset when season changes

### Prompt behaviour
- If season is selected but club or metric is not yet chosen, show: *"Selecione um clube e uma métrica para visualizar."*
- Do not render any chart until season, club, and metric are all selected

### Metric lists

**Financeiras:**
- Receita Operacional
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
- Dívida/Receita Operacional
- Folha do futebol / Receita Operacional
- (Folha futebol + Compra de Jogadores) / Receita Operacional
- Folha do Futebol / Pontuação Série A
- Custo das Atividades Esportivas / Receita Operacional
- Ticket Médio

---

## File naming convention

**Critical rule:** The file used is determined **exclusively by the selected season**. Never cross-load files between seasons.

| Selected season | Feature 1 CSV | Feature 2 CSV |
|---|---|---|
| **2025** | `/public/data/Índices_2025.csv` | `/public/data/Painel_Consolidado_Moeda_Cte_2025.csv` |
| **2024** | `/public/data/Índices_2024.csv` | `/public/data/Painel_Consolidado_Moeda_Cte_2024.csv` |

> The `_2025` files are used **only** when season 2025 is selected. The `_2024` files are used **only** when season 2024 is selected. This applies to both Feature 1 and Feature 2 independently.

---

## Feature 1 — Bar Chart: Cross-Club Comparison (Selected Season)

### Description
Plot a **vertical bar chart** showing the selected metric for **all clubs in the selected season**, allowing the user to visually compare the selected club against the rest of the league.

### Data source

| Selected season | File to load | Content |
|---|---|---|
| **2025** | `/public/data/Índices_2025.csv` | 2025 cross-section data for all clubes_2025 |
| **2024** | `/public/data/Índices_2024.csv` | 2024 cross-section data for all clubes_2024 |

- Each row corresponds to a metric; each column corresponds to a club
- The row matching the selected metric name is used to extract values for all clubs in that season

### Library
**Recharts** — `BarChart` with `layout="horizontal"` (vertical bars). Each club is a bar on the X-axis.

### Visual requirements
- The **selected club's bar must be visually highlighted** (distinct color or stronger tone)
- Bars for non-selected clubs use a neutral color (e.g., light grey or muted blue)
- X-axis: club names, ordered **Vasco first, then A–Z** (angled labels if needed)
- Y-axis: metric values, formatted according to metric type:
  - Monetary (R$): abbreviated (e.g., `R$ 1,2 bi`, `R$ 850 mi`)
  - Ratios/percentages: `%` or decimal as appropriate
  - Integer counts (e.g., Sócios-Torcedores, Pontuação): plain integer
- **Chart title:** selected metric name + season year (e.g., *"Receita Operacional — 2025"*)
- **Tooltip:** club name and exact value on hover

### Tests — Feature 1
- [ ] Selecting season 2025 + club + metric loads `/public/data/Índices_2025.csv`
- [ ] Selecting season 2024 + club + metric loads `/public/data/Índices_2024.csv`
- [ ] All clubs for the selected season appear as bars on the X-axis
- [ ] Clubs from the other season do **not** appear
- [ ] Selected club's bar is visually distinct from the others
- [ ] Y-axis values are formatted correctly (monetary, ratio, or integer)
- [ ] Chart title includes the selected metric name and season year
- [ ] Tooltip shows club name and exact value on hover
- [ ] Switching clubs updates the highlight without re-fetching data
- [ ] Switching metrics updates the chart data and title
- [ ] Switching seasons reloads the correct file and updates the club list and chart
- [ ] If club or metric not selected, prompt message is shown (no chart)
- [ ] If metric is not found in the CSV, a friendly error is displayed (no crash)
- [ ] Chart is responsive

---

## Feature 2 — Line Chart: Historical Evolution (IPCA-adjusted)

### Description
Plot a **multi-line chart** showing the historical evolution of the selected metric for **all clubs in the selected season**. The selected club's line is **highlighted**; all other clubs appear as thinner, more transparent lines.

### Data source

| Selected season | File to load | X-axis range | Content |
|---|---|---|---|
| **2025** | `/public/data/Painel_Consolidado_Moeda_Cte_2025.csv` | 2021 → 2025 | IPCA-adjusted multi-year data including 2025 |
| **2024** | `/public/data/Painel_Consolidado_Moeda_Cte_2024.csv` | 2021 → 2024 | IPCA-adjusted multi-year data up to 2024 |

- Data is **adjusted for inflation (IPCA index)** — must be noted visually on the chart
- Each file contains data for the clubs of its respective season only

### Library
**Recharts** — `LineChart` with one `Line` per club. X-axis represents years.

### Visual requirements
- **X-axis years:**
  - Season 2025 selected → **2021, 2022, 2023, 2024, 2025**
  - Season 2024 selected → **2021, 2022, 2023, 2024**
- **Selected club line:**
  - Thick stroke (`strokeWidth={3}`)
  - Distinct accent color
  - Data points marked with dots
  - Club name identified in legend
- **Other clubs' lines:**
  - Thin stroke (`strokeWidth={1}`)
  - Muted/grey with reduced opacity (`opacity={0.4}`)
  - No dots on data points
- Y-axis: same formatting as Feature 1 (monetary, ratio, integer)
- **Chart title:** selected metric name + season range (e.g., *"Receita Operacional — 2021 a 2025"*)
- **Subtitle/annotation:** *"Valores em moeda constante (IPCA)"*
- **Tooltip:** year + hovered club value (minimum); all clubs' values preferred

### Missing data handling
- If a club has no data for a given year (e.g., newly promoted clubs), **display zero** for that year
- Do not omit the club from the chart

### Tests — Feature 2
- [ ] Selecting season 2025 + club + metric loads `/public/data/Painel_Consolidado_Moeda_Cte_2025.csv`
- [ ] Selecting season 2024 + club + metric loads `/public/data/Painel_Consolidado_Moeda_Cte_2024.csv`
- [ ] Season 2025: X-axis shows 2021, 2022, 2023, 2024, 2025 (5 points)
- [ ] Season 2024: X-axis shows 2021, 2022, 2023, 2024 (4 points)
- [ ] Lines for all clubs of the selected season are displayed (one line per club)
- [ ] Clubs from the other season do **not** appear
- [ ] Selected club's line is visually distinct: thicker, different color, with dots
- [ ] Other clubs' lines are thinner and more transparent
- [ ] Y-axis values are formatted correctly
- [ ] Chart title includes metric name and correct year range
- [ ] IPCA inflation adjustment note is visible on the chart
- [ ] Clubs with missing data for a year show zero (not a gap or crash)
- [ ] Tooltip shows year and relevant values on hover
- [ ] Switching clubs updates the highlight without re-fetching data
- [ ] Switching metrics reloads chart data and title
- [ ] Switching seasons loads the correct file, updates club list, X-axis range, and title
- [ ] If club or metric not selected, prompt message is shown
- [ ] If metric not found in CSV, friendly error is displayed (no crash)
- [ ] Chart is responsive

---

## Development Workflow Summary

```
Season + Club + Metric selectors (shared UI) → TEST ✓
                    ↓
Feature 1 (Bar Chart — cross-club, selected season) → TEST ✓
                    ↓
Feature 2 (Line Chart — historical evolution, selected season) → TEST ✓
```

Do **not** proceed to the next step until all tests for the current step pass.

---

## Dependencies

Already installed from Módulo 1. Confirm:

```bash
npm install recharts papaparse
```

---

## File structure reference

```
/football-clubs-financials/
├── public/
│   ├── clubs/                                        ← club icons
│   └── data/
│       ├── Índices_2024.csv                          ← Feature 1, season 2024
│       ├── Índices_2025.csv                          ← Feature 1, season 2025
│       ├── Painel_Consolidado_Moeda_Cte_2024.csv     ← Feature 2, season 2024 (2021–2024, IPCA)
│       └── Painel_Consolidado_Moeda_Cte_2025.csv     ← Feature 2, season 2025 (2021–2025, IPCA)
```

---

## Notes for claude-code

- The season selector, club selector, and metric selector are all **shared UI** — build them once before starting Feature 1.
- When the season changes: (1) reset selected club to null, (2) repopulate club dropdown with the new season's list, (3) reload chart data for both features using the new season's files. The metric selection is preserved.
- Reuse the club selector component from Módulo 1.
- Both charts render on the same Módulo 2 page, stacked vertically (Feature 1 on top, Feature 2 below), or as tabs — developer's choice.
- The X-axis range in Feature 2 must be derived from the selected season, not hardcoded: use `2021–2025` for season 2025 and `2021–2024` for season 2024.
