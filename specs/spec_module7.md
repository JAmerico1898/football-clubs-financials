# Spec — Módulo 7: Sistema de Sustentabilidade Financeira (SSF)
## Football Clubs Financials App (Next.js)

---

## Overview

Módulo 7 is named **"Sistema de Sustentabilidade Financeira"**. It simulates the compliance of 2025 Série A clubs with the three Financial Sustainability Requirements (Requisitos) defined by the CBF regulation. The module presents:

1. A **brief regulatory context** at the top
2. **Three vertical bar charts** — one per Requisito — showing all clubs ranked by compliance
3. A **club selector** below the charts
4. A **detailed metrics table** for the selected club

> **Important disclaimer:** This is a simulation based on 2025 data. It is not a definitive compliance result.

---

## Data Source

- **File:** `/public/data/SSF.csv`
- The CSV has columns: `Ano`, `Item`, `Dados`, followed by one column per club
- The relevant rows (0-indexed from the data rows, i.e. skipping the header) are identified by their `Dados` value

### Club list (2025 season — columns in CSV)
```js
const clubes_2025_SSF = [
  "Atlético GO", "Atlético", "Athletico", "Bahia", "Botafogo",
  "Corinthians", "Vitória", "Cruzeiro", "Cuiabá", "Flamengo",
  "Fluminense", "Fortaleza", "Grêmio", "Criciúma", "Internacional",
  "Palmeiras", "Juventude", "São Paulo", "Vasco", "Sport",
  "Santos", "Red Bull Bragantino", "Ceará"
];
```

> Note: Mirassol is absent from the SSF.csv — it will not appear in this module.

### Key row lookups (match by `Dados` column value)

| Variable | `Dados` value to match | Regulation ref |
|---|---|---|
| Receitas Relevantes | `"Receitas Relevantes"` | row 0 |
| Despesas Relevantes | `"Despesas Relevantes"` | row 22 |
| Exclusões do Resultado da Operação | `"Exclusões do Resultado da Operação"` | row 55 |
| Contribuições Patrimoniais | `"Contribuições Patrimoniais"` | row 60 |
| Custo com Elenco de um Clube | `"Custo com Elenco de um Clube"` | row 64 |
| Financiamento do Elenco de um clube | `"Financiamento do Elenco de um clube"` | row 68 |
| Obrigações Líquidas de Curto Prazo | `"Obrigações Líquidas de Curto Prazo (OLCP)"` | row 75 |
| **Requisito de Sustentabilidade** | `"Requisito de Sustentabilidade"` | row 88 (pre-calculated) |
| **Requisito de Controle de Custo com o Elenco** | `"Requisito de Controle de Custo com o Elenco"` | row 89 (pre-calculated) |
| **Requisito de Endividamento** | `"Requisito de Endividamento"` | row 90 (pre-calculated) |

> **Implementation note:** Match rows by the `Dados` column value — do not rely on hard-coded numeric indices, as row positions may shift if the CSV is updated.

---

## Section 1 — Regulatory Context

Display a brief explanatory text at the top of the module before any charts:

> **O Sistema de Sustentabilidade Financeira (SSF)** define requisitos que os clubes brasileiros deverão atender a partir de 2026. Este módulo apresenta uma **simulação com dados de 2025** — não se trata de um resultado definitivo, mas de um indicativo da conformidade dos clubes com a regulação.

---

## Section 2 — Three Compliance Bar Charts

### Library
**Recharts** — `BarChart` with `layout="horizontal"` (vertical bars), one chart per Requisito. Same visual pattern as Módulo 2 Feature 1 (as shown in the reference image).

### Common visual rules for all three charts
- **Club icons** displayed on the X-axis below each bar (from `/public/clubs/`)
- **Bar colors** encode compliance status:
  - ✅ **Compliant:** green (`#2E7D32`)
  - ❌ **Non-compliant:** red (`#C0392B`)
- **Selected club bar** is highlighted with a darker outline/border (updated when user selects a club in Section 3)
- **Clubs ordered** left to right from **most compliant to least compliant** (metric-specific ordering — see each chart below)
- **Clubs with missing data** show a note below the chart (same pattern as reference image: *"[Club] não reportou esse dado..."*)
- **Tooltip:** club name + exact metric value on hover
- **Responsive** width

---

### Chart 1 — Requisito de Sustentabilidade

#### Concept (display above chart)
> O Resultado Operacional corresponde à diferença entre Receitas Relevantes e Despesas Relevantes após as exclusões do Resultado da Operação.

#### Metric displayed
Pre-calculated value from row `"Requisito de Sustentabilidade"` in SSF.csv.

**Formula for reference** (already computed in CSV):
```
Resultado Operacional = Receitas Relevantes − Despesas Relevantes − Exclusões do Resultado da Operação + Contribuições Patrimoniais
```

#### Compliance rule (single-year simulation)
- **Compliant (green):** value ≥ 0 (Resultado Operacional Positivo)
- **Non-compliant (red):** value < 0

#### Chart ordering
Bars ordered **descending by Resultado Operacional** (most positive → most negative, left to right).

#### Y-axis
- Label: `"Resultado Operacional (R$ milhões)"`
- Values formatted as abbreviated BRL (e.g., `R$ 250 mi`, `R$ -98 mi`)
- A **reference line at y = 0** (dashed, dark grey) to visually separate positive from negative

#### Chart title
`"Requisito de Sustentabilidade — Resultado Operacional (2025)"`

#### Disclaimer below chart
> *Nota: A simulação considera apenas o exercício de 2025. Os critérios de resultado operacional agregado dos últimos 3 exercícios não puderam ser avaliados por ausência de dados históricos comparáveis.*

---

### Chart 2 — Requisito de Controle de Custo com o Elenco

#### Concept (display above chart)
> O Indicador de Custo com Elenco é a razão entre o Custo com Elenco do clube e o Financiamento do Elenco. Quanto menor o indicador, maior a eficiência financeira.

#### Metric displayed
Pre-calculated value from row `"Requisito de Controle de Custo com o Elenco"` in SSF.csv.

**Formula for reference:**
```
Indicador = Custo com Elenco / Financiamento do Elenco
```

#### Compliance thresholds (display as horizontal reference lines, each with distinct color and label)

| Year | Threshold | Line color | Label |
|---|---|---|---|
| 2026 | ≤ 90% (`0.90`) | 🟡 Yellow `#F9A825` | `"Limite 2026: 90%"` |
| 2027 | ≤ 80% (`0.80`) | 🟠 Orange `#E65100` | `"Limite 2027: 80%"` |
| 2028 | ≤ 70% (`0.70`) | 🔴 Red `#C0392B` | `"Limite 2028: 70%"` |

#### Compliance rule for bar color
- **Compliant (green):** Indicador ≤ 0.90 (meets even the strictest future threshold would be stricter — use 2026 threshold as base)
- **Non-compliant (red):** Indicador > 0.90

#### Chart ordering
Bars ordered **ascending by Indicador** (lowest ratio → highest ratio, left to right = most compliant first).

#### Y-axis
- Label: `"Indicador de Custo com Elenco"`
- Values formatted as percentage (e.g., `54%`, `103%`)
- Display all three threshold reference lines with their labels

#### Chart title
`"Requisito de Controle de Custo com o Elenco (2025)"`

---

### Chart 3 — Requisito de Endividamento

#### Concept (display above chart)
> O Indicador de Endividamento de Curto Prazo é a razão entre as Obrigações Líquidas de Curto Prazo e as Receitas Relevantes. Quanto menor o indicador, menor o endividamento relativo.

#### Metric displayed
Pre-calculated value from row `"Requisito de Endividamento"` in SSF.csv.

**Formula for reference:**
```
Indicador = Obrigações Líquidas de Curto Prazo / Receitas Relevantes
```

#### Compliance thresholds (display as horizontal reference lines)

| Year | Threshold | Line color | Label |
|---|---|---|---|
| 2026 | ≤ 70% (`0.70`) | 🟡 Yellow `#F9A825` | `"Limite 2026: 70%"` |
| 2027 | ≤ 60% (`0.60`) | 🟠 Orange `#E65100` | `"Limite 2027: 60%"` |
| 2028 | ≤ 50% (`0.50`) | 🔴 Red `#C0392B` | `"Limite 2028: 50%"` |
| 2029+ | ≤ 45% (`0.45`) | 🟣 Purple `#6A0572` | `"Limite 2029+: 45%"` |

#### Compliance rule for bar color
- **Compliant (green):** Indicador ≤ 0.70 (meets 2026 threshold)
- **Non-compliant (red):** Indicador > 0.70
- **Special case — negative OLCP:** some clubs have negative OLCP values (net creditor position). These are clearly compliant — display their bars in green and format the negative value correctly.

#### Chart ordering
Bars ordered **ascending by Indicador** (lowest → highest, left to right = most compliant first).
> Clubs with negative Indicador are the most compliant and appear leftmost.

#### Y-axis
- Label: `"Indicador de Endividamento de Curto Prazo"`
- Values formatted as percentage (e.g., `12%`, `266%`, `-5%`)
- Display all four threshold reference lines with labels

#### Chart title
`"Requisito de Endividamento de Curto Prazo (2025)"`

---

## Section 3 — Club Selector

Below the three charts, a **club dropdown** allows the user to select a club for detailed metrics.

- Club list: `clubes_2025_SSF` (same 23 clubs)
- **Vasco appears first**, remaining clubs A–Z
- Selecting a club:
  - Displays the club icon from `/public/clubs/`
  - Highlights that club's bar across all three charts simultaneously
  - Renders the detailed metrics table below (Section 4)
- If no club selected: show *"Selecione um clube para ver os detalhes."*

---

## Section 4 — Detailed Metrics Table

A **styled HTML table** showing all the component metrics used to compute the three Requisitos for the selected club.

### Table structure

| Requisito | Métrica | Valor (R$ milhões) |
|---|---|---|
| **Req. Sustentabilidade** | Receitas Relevantes | R$ XXX mi |
| | Despesas Relevantes | R$ XXX mi |
| | Exclusões do Resultado da Operação | R$ XXX mi |
| | Contribuições Patrimoniais | R$ XXX mi |
| | **Resultado Operacional** | **R$ XXX mi** |
| | **Status** | ✅ Conforme / ❌ Não Conforme |
| **Req. Custo com Elenco** | Custo com Elenco | R$ XXX mi |
| | Financiamento do Elenco | R$ XXX mi |
| | **Indicador** | **XX%** |
| | **Status 2026 (≤90%)** | ✅ / ❌ |
| | **Status 2027 (≤80%)** | ✅ / ❌ |
| | **Status 2028 (≤70%)** | ✅ / ❌ |
| **Req. Endividamento** | Obrigações Líquidas de Curto Prazo | R$ XXX mi |
| | Receitas Relevantes | R$ XXX mi |
| | **Indicador** | **XX%** |
| | **Status 2026 (≤70%)** | ✅ / ❌ |
| | **Status 2027 (≤60%)** | ✅ / ❌ |
| | **Status 2028 (≤50%)** | ✅ / ❌ |
| | **Status 2029+ (≤45%)** | ✅ / ❌ |

### Styling
- **Section header rows** (Requisito rows) use dark background (`#1565C0`), white text, bold
- **Calculated indicator rows** (Resultado Operacional, Indicador) are bold with slightly different background
- **Status rows:** green background (`#E8F5E9`) for ✅, red background (`#FFEBEE`) for ❌
- Numeric values right-aligned
- Metric names left-aligned
- Responsive (horizontal scroll on small screens)

---

## Page Layout

```
┌───────────────────────────────────────────────────┐
│  Regulatory context text                          │
├───────────────────────────────────────────────────┤
│  [Concept] Requisito de Sustentabilidade          │
│  Chart 1 — bar chart (all clubs)                  │
│  [Disclaimer note]                                │
├───────────────────────────────────────────────────┤
│  [Concept] Requisito de Controle de Custo         │
│  Chart 2 — bar chart (all clubs) + 3 thresholds  │
├───────────────────────────────────────────────────┤
│  [Concept] Requisito de Endividamento             │
│  Chart 3 — bar chart (all clubs) + 4 thresholds  │
├───────────────────────────────────────────────────┤
│  Club selector + icon                             │
│  Detailed metrics table                           │
└───────────────────────────────────────────────────┘
```

---

## Tests — Módulo 7

### Data loading
- [ ] SSF.csv loaded from `/public/data/SSF.csv`
- [ ] Rows matched by `Dados` column value (not by hard-coded index)
- [ ] All 23 clubs from SSF.csv columns are loaded
- [ ] Pre-calculated Requisito values extracted correctly for all 3 requisitos

### Chart 1 — Requisito de Sustentabilidade
- [ ] All 23 clubs appear as bars
- [ ] Bars ordered descending by Resultado Operacional (most positive leftmost)
- [ ] Positive values render as green bars, negative as red bars
- [ ] Reference line at y=0 is visible (dashed)
- [ ] Y-axis values formatted as abbreviated BRL
- [ ] Club icons appear on X-axis
- [ ] Tooltip shows club name and value on hover
- [ ] Disclaimer note is visible below chart

### Chart 2 — Requisito de Controle de Custo com o Elenco
- [ ] All 23 clubs appear as bars
- [ ] Bars ordered ascending by Indicador (lowest leftmost)
- [ ] Green bars for Indicador ≤ 0.90, red bars for Indicador > 0.90
- [ ] Three threshold reference lines displayed (yellow/orange/red) with labels
- [ ] Y-axis formatted as percentage
- [ ] Club icons on X-axis
- [ ] Tooltip shows club name and percentage value

### Chart 3 — Requisito de Endividamento
- [ ] All 23 clubs appear as bars
- [ ] Bars ordered ascending by Indicador (lowest/most-negative leftmost)
- [ ] Green bars for Indicador ≤ 0.70, red bars for Indicador > 0.70
- [ ] Negative OLCP clubs show negative bars in green
- [ ] Four threshold reference lines displayed (yellow/orange/red/purple) with labels
- [ ] Y-axis formatted as percentage (including negatives)
- [ ] Club icons on X-axis
- [ ] Tooltip shows club name and percentage value

### Club highlight (across all charts)
- [ ] Selecting a club highlights its bar in all three charts simultaneously
- [ ] Switching clubs updates highlights in all three charts

### Club selector (Section 3)
- [ ] Vasco appears first, remaining clubs A–Z
- [ ] Selecting club shows its icon
- [ ] No table renders until a club is selected

### Detailed metrics table (Section 4)
- [ ] Table renders for the selected club without console errors
- [ ] All component metrics for all 3 Requisitos are shown
- [ ] Calculated Resultado Operacional matches Chart 1 value
- [ ] Indicador de Custo matches Chart 2 value (formatted as %)
- [ ] Indicador de Endividamento matches Chart 3 value (formatted as %)
- [ ] Status rows show ✅ or ❌ correctly for each threshold
- [ ] Status row backgrounds are green/red accordingly
- [ ] Switching clubs updates the table
- [ ] Table is responsive (horizontal scroll on mobile)

### Robustness
- [ ] CSV fails to load → friendly error message (no crash)
- [ ] Club missing a metric value → show "N/D" in table, exclude from chart ordering gracefully
- [ ] All charts responsive on different screen sizes

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
    ├── clubs/              ← club icons
    └── data/
        └── SSF.csv         ← all Módulo 7 data
```

---

## Notes for claude-code

- Parse SSF.csv with `papaparse` using `header: true` — the first row contains column names (`Ano`, `Item`, `Dados`, + one per club). Match rows by the `Dados` field.
- The three Requisito values are **pre-calculated** in the CSV (rows with `Dados` = `"Requisito de Sustentabilidade"`, `"Requisito de Controle de Custo com o Elenco"`, `"Requisito de Endividamento"`). Do not recalculate them — read directly.
- For Recharts threshold reference lines, use `<ReferenceLine y={0.90} stroke="#F9A825" strokeDasharray="4 4" label="Limite 2026: 90%" />` inside the `<BarChart>`.
- Club icon display on the X-axis: use a custom `tick` renderer for the Recharts `<XAxis>` that renders a `<image>` SVG element with the club icon URL. This is the same approach used in Módulo 2.
- The detailed metrics table is plain HTML/CSS — no external table library needed.
- Build a single `resolveSSFData(csvRows, clubName)` utility that extracts all metrics for a given club, to avoid repeated CSV lookups across charts and the table.
