# Visual Redesign: Polish Pass

**Date:** 2026-03-18
**Status:** Approved
**Scope:** Full visual polish of the Almanaque Financeiro da Serie A webapp

## Problem

The webapp is functional but visually generic — it lacks the depth, personality, and polish expected of a modern data visualization product. The goal is to elevate it to a clean & modern aesthetic (Stripe/Linear quality) without changing the app's structure or functionality.

## Design Decisions

### 1. Typography

- **Font:** Inter via `next/font/google` (optimized loading, zero layout shift)
- **Scale:**
  - Page titles: `text-3xl font-bold tracking-tight`
  - Section headings: `text-xl font-semibold`
  - Body: `text-base font-normal`
  - Captions/labels: `text-sm font-medium text-muted`

### 2. Color System (CSS Variables)

Move from hardcoded Tailwind colors to CSS custom properties for dark mode support.

**Light mode:**
| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `slate-50` (#f8fafc) | Page background |
| `--surface` | `white` (#ffffff) | Cards, containers |
| `--border` | `slate-200` (#e2e8f0) | Card borders, dividers |
| `--text-primary` | `slate-900` (#0f172a) | Headings, body |
| `--text-secondary` | `slate-500` (#64748b) | Labels, descriptions |
| `--brand-blue` | `#1565C0` | Primary actions, accents |
| `--brand-gold` | `#F9A825` | Secondary accent |
| `--brand-green` | `#2E7D32` | Success, revenue |
| `--brand-red` | `#C62828` | Error, expenses |

**Dark mode:**
| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `slate-950` (#020617) | Page background |
| `--surface` | `slate-900` (#0f172a) | Cards, containers |
| `--border` | `slate-700` (#334155) | Card borders, dividers |
| `--text-primary` | `slate-50` (#f8fafc) | Headings, body |
| `--text-secondary` | `slate-400` (#94a3b8) | Labels, descriptions |
| `--brand-blue` | `#42a5f5` | Primary actions, accents |
| `--brand-gold` | `#fdd835` | Secondary accent |
| `--brand-green` | `#66bb6a` | Success, revenue |
| `--brand-red` | `#ef5350` | Error, expenses |

### 3. Dark Mode

- **Strategy:** `darkMode: 'class'` in Tailwind config, `class="dark"` on `<html>`
- **Toggle:** Sun/moon icon button, fixed top-right (`top-4 right-4`), circular (`w-10 h-10 rounded-full`), `bg-white/80 backdrop-blur shadow-md` (light) / `bg-slate-800/80` (dark), `z-50`. On mobile (`sm:` breakpoint), shifts to `top-3 right-3` with `w-9 h-9` to reduce overlap with content.
- **Persistence:** Reads `prefers-color-scheme` on first visit, saves user choice to `localStorage`
- **FOUC prevention:** A blocking inline `<script>` in `layout.tsx` `<head>` reads `localStorage` (or falls back to `prefers-color-scheme`) and sets `class="dark"` on `<html>` before paint. This prevents flash-of-wrong-theme on SSR pages.
- **Implementation:** CSS variables defined in `globals.css` under `:root` and `.dark` selectors. Tailwind theme extension uses plain `var()` references (no opacity modifier support needed — we use explicit color values rather than `bg-surface/80` patterns).

### 4. Depth & Shadows

| Level | Shadow | Usage |
|-------|--------|-------|
| Rest | `shadow-sm` + 1px border | Cards, containers |
| Hover | `shadow-md` + `translateY(-2px)` | Card hover states |
| Elevated | `shadow-lg` | Modals, dropdowns, tooltips |
| Pressed | `shadow-none` + `scale(0.98)` | Active button states |

### 5. Background Texture

- Subtle dot grid pattern via CSS `radial-gradient` on the page background
- Light: faint `slate-200` dots on `slate-50`
- Dark: faint `slate-800` dots on `slate-950`
- Very low opacity — adds texture without distraction

### 6. Card Component (NavCard)

- Background: `var(--surface)` with `var(--border)` border
- `rounded-xl` (12px), `p-6`
- **Left-side accent bar** (4px, rounded) per module with unique brand color — replaces the current top gradient border
- Hover: shadow lift + accent bar brightens + title shifts to `brand-blue`
- Each card gets a **Lucide icon** (24px, `text-brand-blue`) at the top
- Icon-to-route mapping lives in `lib/routes.ts` — add an `icon` field to each route object. `NavCard` reads it from the route data.
- Icon mapping (by route `href`):
  - `/analise-individual`: `BarChart3`
  - `/analise-comparativa-simples`: `BarChartHorizontal`
  - `/analise-conjunta`: `ScatterChart`
  - `/compare-2-clubes`: `GitCompare`
  - `/indice-de-transparencia`: `Eye`
  - `/analise-de-desigualdade`: `Scale`
  - `/sustentabilidade-financeira`: `Leaf`
  - `/contato`: `Mail`

### 7. Homepage

- Logo: keep, add `drop-shadow-md`
- Title: `text-4xl font-bold tracking-tight text-slate-900` / `text-slate-50` (dark)
- Subtitle: `text-lg text-slate-500 mt-3`
- Remove gradient divider bar — replace with generous spacing (`mt-10 mb-8`)
- Grid: keep `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, increase to `gap-6`
- Max width: keep `max-w-[960px]`

### 8. Module Pages Layout

- **Controls zone:** Card surface at top with all selectors/toggles, `flex-wrap gap-4`
- **Chart zone:** Card surface(s) below for chart output
- Both zones: `rounded-xl shadow-sm p-6` with `var(--surface)` background
- Container: keep `max-w-[1200px] mx-auto px-4 py-8`

### 9. Interactive Elements

**Select dropdowns:**
- `rounded-lg`, `py-2.5 px-4`
- Border: `var(--border)`, background: `var(--surface)`
- Focus: `ring-2 ring-brand-blue/50 border-brand-blue`
- `transition-colors duration-150`

**Season/period toggles — pill segmented control:**
- Container: `rounded-full bg-slate-100 p-1` (light) / `bg-slate-800` (dark)
- Active: `bg-white shadow-sm text-brand-blue font-semibold rounded-full` (light) / `bg-slate-700 text-white` (dark)
- Inactive: transparent, `text-slate-500 hover:text-slate-700`

**Back button:**
- Ghost style: `hover:bg-slate-100` / `hover:bg-slate-800`, `rounded-lg px-3 py-2`
- `text-slate-500 hover:text-slate-900` / dark equivalents

**Contact form:**
- Inputs match select styling
- Submit: `rounded-lg bg-brand-blue shadow-sm`, active `shadow-none scale-[0.98]`
- Success/error: bordered alert box with left accent bar (green/red), `rounded-lg`

### 10. Loading & Empty States

- Loading: skeleton pulse animation (`animate-pulse`, `bg-slate-200` / `bg-slate-800` rounded blocks)
- Empty: larger text, `text-slate-400`, no italic

### 11. Chart Theming

**Recharts:**
- Axis labels: `fill` matches `--text-secondary`
- Grid lines: `stroke` matches `--border`
- Tooltips: card-style (`rounded-lg shadow-lg`, `var(--surface)` background, `var(--border)` border)

**Plotly (Sankey, Radar, Scatter):**
- `paper_bgcolor` and `plot_bgcolor`: transparent
- Font family: `'Inter, system-ui, sans-serif'`
- Gridline and axis colors match Recharts approach
- `colorway` array from brand palette

### 12. Page Transitions

- CSS-only fade-in on main content:
  ```css
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  ```
- Applied to main content container: `animation: fadeIn 0.3s ease-out`

## Files to Modify

### Core
- `tailwind.config.ts` — add `darkMode: 'class'`, extend theme with CSS variable references
- `app/globals.css` — CSS variables, dot background, fadeIn animation, card styles
- `app/layout.tsx` — Inter font via `next/font/google`, dark mode class logic

### New Components
- `components/ThemeToggle.tsx` — dark mode toggle button
- Update `components/NavCard.tsx` — new card design with icons and accent bar

### Pages
- `app/page.tsx` — homepage header and grid updates
- `app/analise-individual/page.tsx` — controls/chart zone layout
- `app/analise-comparativa-simples/page.tsx` — controls/chart zone layout
- `app/analise-conjunta/page.tsx` — controls/chart zone layout
- `app/compare-2-clubes/page.tsx` — controls/chart zone layout
- `app/indice-de-transparencia/page.tsx` — controls/chart zone layout
- `app/analise-de-desigualdade/page.tsx` — controls/chart zone layout
- `app/sustentabilidade-financeira/page.tsx` — controls/chart zone layout
- `app/analise-individual-historica/page.tsx` — controls/chart zone layout, dark mode
- `app/contato/page.tsx` — form restyling, alert boxes
- `lib/routes.ts` — add `icon` field to route objects

### Chart Components
- `components/ComparisonBarChart.tsx` — theme-aware colors
- `components/CompareBarChart.tsx` — theme-aware colors
- `components/EvolutionLineChart.tsx` — theme-aware colors
- `components/HorizontalBarChart.tsx` — theme-aware colors
- `components/InequalityLineChart.tsx` — theme-aware colors
- `components/ScatterPlotChart.tsx` — Plotly theme config
- `components/SankeyChart.tsx` — Plotly theme config
- `components/RadarChart.tsx` — Plotly theme config
- `components/TransparencyChart.tsx` — theme-aware colors
- `components/TransparencyTable.tsx` — dark mode table styles
- `components/BackButton.tsx` — ghost button style
- `components/ClubSummary.tsx` — dark mode colors (currently hardcoded grays)
- `components/MetricSelector.tsx` — theme-aware select styling
- `components/PlotlyChart.tsx` — theme-aware Plotly defaults (if used as shared wrapper)

### Dependencies
- `lucide-react` — icon library (lightweight, tree-shakeable)

## Out of Scope

- No structural/routing changes
- No new features or modules
- No data logic changes
- No component library migration (shadcn, etc.)
- No animation library (framer-motion, etc.)
