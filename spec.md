# Sankey Income Report - Specification

## Overview
A standalone Next.js webapp that renders a Plotly Sankey diagram of a Brazilian football club's income statement (Demonstracao de Resultado). It reads from `Balancos - clubes-2026.csv` and lets the user select any club via a dropdown.

## Architecture
- **Framework**: Next.js 15 (App Router) with TypeScript and Tailwind CSS
- **Chart**: Plotly.js via `react-plotly.js` (dynamic import, SSR disabled)
- **Data**: CSV parsed client-side with PapaParse from `/public/data/`

## Data Model

### CSV Structure
- Header row: `Clubes, Rubrica, Club1, Club2, ...`
- 21 data rows (financial line items per club)
- Row 9 (`RECEITA NAO-RECORRENTE`) is **not** a Sankey node and is skipped

### Row-to-Node Mapping (after filtering)

| Filtered Index | Category | Type |
|---|---|---|
| 0-5 | Revenue items | Revenue |
| 6 | RECEITA RECORRENTE | Revenue subtotal |
| 7-8 | Non-recurring revenue | Revenue |
| 9 | RECEITA OPERACIONAL | Revenue total |
| 10-15 | Expense items | Expense |
| 16 | DESPESAS | Expense total |
| 17 | RESULTADO OPERACIONAL | Result |
| 18 | Resultado financeiro | Result |
| 19 | RESULTADO (Superavit/Deficit) | Result |

### 19 Sankey Links
Revenue items flow into RECEITA RECORRENTE, which flows into RECEITA OPERACIONAL along with non-recurring items. RECEITA OPERACIONAL splits into RESULTADO OPERACIONAL and DESPESAS. DESPESAS splits into individual expenses. RESULTADO OPERACIONAL splits into Resultado Financeiro and RESULTADO.

## Component Hierarchy
```
app/page.tsx (client)
  -> ClubSelector (dropdown)
  -> SankeyChart (Plotly wrapper)
```

## Sankey Configuration (`lib/sankey-config.ts`)
- Fixed node X/Y positions replicating the original Streamlit layout
- Dynamic node colors: revenue=steelblue, expenses=indianred, results=limegreen or indianred based on sign
- 20 annotation pairs (label + value) positioned around nodes

## Club Selector
- Populated from CSV header columns (indices 2 to N-1, excluding "Media da Liga")
- Clubs with all-empty data (e.g., Botafogo) are filtered out
- Default: Palmeiras

## Deployment
- Deploys to Vercel from GitHub (zero config for Next.js)
- CSV is bundled in `public/data/`, served as static asset
