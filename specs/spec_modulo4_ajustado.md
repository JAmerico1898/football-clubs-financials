# Spec — Módulo 4: Compare 2 Clubes (Ajustado — Temporadas 2024 e 2025)
## Football Clubs Financials App (Next.js)

---

## Overview

Módulo 4 is named **"Compare 2 Clubes"**. It allows the user to select a season, then two clubs, and compares their financial metrics side-by-side in a **horizontal grouped bar chart**, using each club's primary color as the bar color.

---

## Season Selector

- A **year toggle or dropdown** at the top of the module: **2025** (default) or **2024**
- Changing the season:
  - Resets both Club 1 and Club 2 selections to null
  - Repopulates both club dropdowns with the correct club list for that season
  - Clears the chart

---

## Club Lists per Season

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
- **Vasco always appears first** in both the "Selecione o Clube 1" and "Selecione o Clube 2" dropdowns, regardless of season
- All remaining clubs follow in **alphabetical order**
- Both dropdowns are populated from the same season list

---

## File Naming Convention

**Critical rule:** The file used is determined **exclusively by the selected season**. Never cross-load files.

| Selected season | File to load |
|---|---|
| **2025** | `/public/data/Índices_2025.csv` |
| **2024** | `/public/data/Índices_2024.csv` |

> The `_2025` file is used **only** when season 2025 is selected. The `_2024` file is used **only** when season 2024 is selected.

---

## Club Selection

- Two independent club selectors: **Clube 1** and **Clube 2**
- Both show only clubs from the selected season (see club lists above)
- Once a club is selected, its **icon** is displayed beside the selector (from `/public/clubs/`)
- **Do not render any chart until both clubs are selected**
- If only one club is selected, show: *"Selecione dois clubes para comparar."*
- Allow the same club to be selected in both selectors (edge case — chart will show identical bars)

---

## Metrics (same as Módulo 1)

| Category | Metrics |
|---|---|
| **Receita** | Receita Operacional, Receita Recorrente, Receita c/ Transmissão + Premiações, Receita Comercial, Receita c/ Match-Day + Sócio-Torcedor, Receita c/ Negociação de atletas |
| **Despesa** | Custo das Atividades Esportivas, Folha do Futebol, Folha do Futebol + Amortização, Aquisições de atletas |
| **Resultado** | Resultado Operacional (Segmento Futebol), Resultado |
| **Passivo** | Dívida Líquida |

---

## Color Scheme

Each club is represented by its **primary color**. The complete mapping covers all clubs across both seasons:

| Club | Primary Color | Secondary Color | Seasons |
|---|---|---|---|
| Athletico | Red | Black | 2024 only |
| Atlético GO | Red | Black | 2024 only |
| Atlético | Gray | Black | 2024, 2025 |
| Bahia | Blue | Red | 2024, 2025 |
| Botafogo | Gray | Black | 2024, 2025 |
| Ceará | Black | Gray | 2025 only |
| Corinthians | Gray | Black | 2024, 2025 |
| Criciúma | Yellow | Black | 2024 only |
| Cruzeiro | Blue | Blue | 2024, 2025 |
| Cuiabá | Golden | Green | 2024 only |
| Flamengo | Red | Black | 2024, 2025 |
| Fluminense | Green | Red | 2024, 2025 |
| Fortaleza | Blue | Red | 2024, 2025 |
| Grêmio | Blue | Black | 2024, 2025 |
| Internacional | Red | Red | 2024, 2025 |
| Juventude | Green | Green | 2024, 2025 |
| Mirassol | Yellow | Green | 2025 only |
| Palmeiras | Green | Green | 2024, 2025 |
| Santos | Black | Gray | 2025 only |
| São Paulo | Red | Black | 2024, 2025 |
| Sport | Red | Black | 2025 only |
| Vasco | Black | Black | 2024, 2025 |
| Vitória | Red | Black | 2024, 2025 |

### Color conflict resolution

When both selected clubs share the same primary color, use **different tones** to distinguish them. Apply the following logic:

1. **Check if Club 1 primary == Club 2 primary** (e.g., both Red)
2. If conflict: Club 1 uses the **darker tone**, Club 2 uses the **lighter tone**
3. If Club 1 primary == Club 2 primary AND Club 1 secondary == Club 2 secondary (full match): Club 1 uses the primary color, Club 2 uses the secondary color — with different tones if those also match

**Tone pairs per color:**

| Color | Dark tone | Light tone |
|---|---|---|
| Red | `#C0392B` | `#E74C3C` |
| Gray | `#616161` | `#BDBDBD` |
| Blue | `#1565C0` | `#42A5F5` |
| Green | `#2E7D32` | `#66BB6A` |
| Black | `#212121` | `#757575` |
| Yellow | `#F9A825` | `#FFF176` |
| Golden | `#F57F17` | `#FFD54F` |

> **Implementation note:** The `resolveClubColors(club1, club2)` utility must cover all 23 clubs in the combined mapping. Implement it in `lib/clubColors.js` and import it in the Módulo 4 page.

**Known conflict pairs to verify in tests** (same primary color, same or different seasons):

- Athletico, Atlético GO, Flamengo, São Paulo, Sport, Vitória, Internacional → all **Red**-primary
- Atlético, Botafogo, Corinthians, Ceará, Santos → all **Gray** or **Black**-primary (check secondary)
- Bahia, Cruzeiro, Fortaleza, Grêmio → all **Blue**-primary
- Fluminense, Juventude, Palmeiras, Mirassol → all **Green** or **Yellow/Green**-primary
- Vasco → **Black/Black** — conflicts with Ceará (Black/Gray) and Santos (Black/Gray); use tones

---

## Chart: Horizontal Grouped Bar Chart

### Library
**Recharts** — `BarChart` with `layout="vertical"` (horizontal bars).

### Visual requirements
- **Two bars per metric:** Club 1 (its resolved color), Club 2 (its resolved color)
- Bars are **grouped side-by-side** per metric
- Metrics **grouped by category** with visual separators (same as Módulo 1)
- **Y-axis:** metric names (abbreviated if needed)
- **X-axis:** monetary values, formatted as abbreviated BRL (e.g., `R$ 1,2 bi`, `R$ 850 mi`)
- **Chart title:** `"{Club 1} vs. {Club 2} — {year}"` (e.g., *"Flamengo vs. Vasco — 2025"*)
- **Legend:** Club 1 name + color swatch, Club 2 name + color swatch (optional: small club icon)
- **Tooltip:** metric name, Club 1 value, Club 2 value (both formatted)
- Responsive

### Category separators
- **Receita** (6 metrics) — green family label
- **Despesa** (4 metrics) — red family label
- **Resultado** (2 metrics) — blue family label
- **Passivo** (1 metric) — orange family label

Category label colors are fixed and independent of club colors.

---

## Tests — Módulo 4

### Season selector
- [ ] Season selector shows 2025 (default) and 2024
- [ ] Selecting season 2025 loads `/public/data/Índices_2025.csv`
- [ ] Selecting season 2024 loads `/public/data/Índices_2024.csv`
- [ ] Changing season resets both club selectors and clears the chart
- [ ] No cross-loading between seasons

### Club selectors
- [ ] Both dropdowns show only clubs for the selected season
- [ ] Vasco appears first in both "Selecione o Clube 1" and "Selecione o Clube 2" dropdowns
- [ ] Remaining clubs follow in A–Z order
- [ ] Season 2025: clubes_2025 shown (including Ceará, Mirassol, Santos, Sport)
- [ ] Season 2024: clubes_2024 shown (including Athletico, Criciúma, Cuiabá — not in 2025)
- [ ] Selecting Club 1 displays its icon
- [ ] Selecting Club 2 displays its icon
- [ ] No chart renders until both clubs are selected
- [ ] Prompt shown when fewer than 2 clubs are selected
- [ ] Changing either club updates the chart

### Color logic
- [ ] Club 1 bar uses Club 1's primary color
- [ ] Club 2 bar uses Club 2's primary color
- [ ] Conflict resolution applies correct tones when both clubs share the same primary color
- [ ] `resolveClubColors()` covers all 23 clubs in the mapping
- [ ] New 2025-only clubs (Ceará, Mirassol, Santos, Sport) use their correct primary colors
- [ ] Known conflict pairs resolve without identical-looking bars (see conflict pairs list above)

### Bar chart
- [ ] Horizontal grouped bar chart renders without console errors when both clubs are selected
- [ ] All 13 metrics displayed as horizontal bar pairs
- [ ] Each metric shows exactly 2 bars: one per club
- [ ] Metrics grouped into 4 categories (Receita, Despesa, Resultado, Passivo)
- [ ] Category labels visible on or beside the Y-axis
- [ ] X-axis values formatted as abbreviated BRL
- [ ] Chart title reads "{Club 1} vs. {Club 2} — {year}"
- [ ] Legend identifies both clubs with their respective colors
- [ ] Tooltip shows metric name and both clubs' values on hover
- [ ] Chart is responsive

### Robustness
- [ ] Missing metric value for a club → display zero for that bar (no crash)
- [ ] Same club selected in both slots → identical bars render without crash
- [ ] CSV fails to load → friendly error message shown

---

## Dependencies

Already installed. Confirm:

```bash
npm install recharts papaparse
```

---

## File structure reference

```
/football-clubs-financials/
├── public/
│   ├── clubs/                    ← club icons (all 23 clubs across both seasons)
│   └── data/
│       ├── Índices_2024.csv      ← season 2024 data
│       └── Índices_2025.csv      ← season 2025 data
```

---

## Notes for claude-code

- Reuse the club selector component from previous modules.
- The `resolveClubColors(club1, club2)` utility in `lib/clubColors.js` must be updated to include all 23 clubs (original 19 from 2024 + Ceará, Mirassol, Santos, Sport from 2025). The function signature and conflict resolution logic remain unchanged.
- The horizontal bar chart structure should closely mirror Módulo 1's Feature 3 — reuse or adapt that component.
- Category label colors (Receita/Despesa/Resultado/Passivo) are fixed and independent of club colors.
- When season changes, reset both club selectors **before** repopulating dropdowns to avoid a stale club from the previous season remaining selected.
