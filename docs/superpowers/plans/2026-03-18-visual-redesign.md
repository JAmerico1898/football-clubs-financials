# Visual Redesign (Polish Pass) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the Almanaque Financeiro webapp from generic to Stripe/Linear-level polish with Inter font, CSS-variable color system, dark mode, layered shadows, and refined interactive elements.

**Architecture:** CSS variables define the color tokens in `:root` and `.dark` scopes. Tailwind config references these via `var()`. A `ThemeToggle` client component manages the `dark` class on `<html>`. All pages and components consume theme tokens instead of hardcoded grays/whites.

**Tech Stack:** Next.js 15, Tailwind CSS 3, `next/font/google` (Inter), `lucide-react` (icons), CSS custom properties, `localStorage` for theme persistence.

**Spec:** `docs/superpowers/specs/2026-03-18-visual-redesign-design.md`

---

## File Structure

### New Files
- `components/ThemeToggle.tsx` — Client component: sun/moon toggle, reads/writes `localStorage`, toggles `dark` class on `<html>`
- `lib/useTheme.ts` — Custom hook for theme state (used by ThemeToggle and chart components that need current theme)
- `lib/useThemeColors.ts` — Hook that resolves CSS variables to hex values at runtime for Plotly (which cannot consume CSS `var()` directly)

### Modified Files (by task)
- `tailwind.config.ts` — `darkMode: 'class'`, CSS variable color references
- `app/globals.css` — CSS variables (`:root` / `.dark`), dot background, fadeIn animation, nav-card rewrite
- `app/layout.tsx` — Inter font, FOUC-prevention inline script, ThemeToggle
- `lib/routes.ts` — Add `icon` field to Route interface and each route
- `components/NavCard.tsx` — Accent bar, icon, theme-aware colors
- `components/BackButton.tsx` — Ghost button style
- `components/MetricSelector.tsx` — Theme-aware select
- `components/ClubSummary.tsx` — Theme-aware background/text
- `components/PlotlyChart.tsx` — Theme-aware Plotly defaults
- `components/TransparencyTable.tsx` — Theme-aware table
- `components/ComparisonBarChart.tsx` — Theme-aware tooltip/grid
- `components/CompareBarChart.tsx` — Theme-aware tooltip/grid
- `components/EvolutionLineChart.tsx` — Theme-aware tooltip/grid
- `components/HorizontalBarChart.tsx` — Theme-aware tooltip/grid
- `components/InequalityLineChart.tsx` — Theme-aware tooltip/grid
- `components/ScatterPlotChart.tsx` — Theme-aware Plotly layout
- `components/SankeyChart.tsx` — Theme-aware Plotly layout
- `components/RadarChart.tsx` — Theme-aware Plotly layout
- `components/TransparencyChart.tsx` — Theme-aware Plotly layout
- `app/page.tsx` — Homepage redesign
- `app/analise-individual/page.tsx` — Controls/chart zones, dark mode classes
- `app/analise-comparativa-simples/page.tsx` — Controls/chart zones, dark mode classes
- `app/analise-conjunta/page.tsx` — Controls/chart zones, dark mode classes
- `app/compare-2-clubes/page.tsx` — Controls/chart zones, dark mode classes
- `app/indice-de-transparencia/page.tsx` — Controls/chart zones, dark mode classes
- `app/analise-de-desigualdade/page.tsx` — Controls/chart zones, dark mode classes
- `app/sustentabilidade-financeira/page.tsx` — Dark mode classes
- `app/analise-individual-historica/page.tsx` — Dark mode classes
- `app/contato/page.tsx` — Form restyling, alert boxes, dark mode

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install lucide-react**

```bash
npm install lucide-react
```

- [ ] **Step 2: Verify installation**

```bash
npm ls lucide-react
```
Expected: Shows `lucide-react@<version>`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add lucide-react icon library"
```

---

## Task 2: Tailwind Config — Dark Mode & CSS Variable Colors

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Update tailwind.config.ts**

Replace the entire file with:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        border: "var(--border)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "brand-red": "var(--brand-red)",
        "brand-blue": "var(--brand-blue)",
        "brand-green": "var(--brand-green)",
        "brand-gold": "var(--brand-gold)",
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Verify Tailwind still builds**

```bash
npx tailwindcss --content ./app/page.tsx --output /dev/null 2>&1 || echo "Tailwind build check"
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: add dark mode support and CSS variable colors to Tailwind config"
```

---

## Task 3: Global CSS — Variables, Background, Animations, Nav Card

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace globals.css entirely**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Light theme (default) ── */
:root {
  --background: #f8fafc;
  --surface: #ffffff;
  --border: #e2e8f0;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --brand-blue: #1565C0;
  --brand-gold: #F9A825;
  --brand-green: #2E7D32;
  --brand-red: #C62828;
}

/* ── Dark theme ── */
.dark {
  --background: #020617;
  --surface: #0f172a;
  --border: #334155;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --brand-blue: #42a5f5;
  --brand-gold: #fdd835;
  --brand-green: #66bb6a;
  --brand-red: #ef5350;
}

/* ── Base styles ── */
body {
  background-color: var(--background);
  color: var(--text-primary);
}

/* ── Dot grid background ── */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.3;
  pointer-events: none;
}

.dark body::before {
  background-image: radial-gradient(circle, #1e293b 1px, transparent 1px);
}

/* ── Fade-in animation ── */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* ── Nav card ── */
@layer components {
  .nav-card {
    @apply relative block rounded-xl p-6 shadow-sm
           transition-all duration-200 ease-out overflow-hidden;
    background-color: var(--surface);
    border: 1px solid var(--border);
  }

  .nav-card::before {
    content: "";
    @apply absolute top-0 left-0 bottom-0 w-1 rounded-full opacity-60 transition-opacity duration-200;
    background-color: var(--card-accent, var(--brand-blue));
  }

  .nav-card:hover {
    @apply -translate-y-0.5 shadow-md;
  }

  .nav-card:hover::before {
    @apply opacity-100;
  }

  .nav-card:active {
    @apply scale-[0.98];
  }

  /* ── Card surface (reusable for controls/chart zones) ── */
  .card-surface {
    @apply rounded-xl shadow-sm p-6;
    background-color: var(--surface);
    border: 1px solid var(--border);
  }

  /* ── Theme-aware select ── */
  .select-themed {
    @apply rounded-lg py-2.5 px-4 text-base transition-colors duration-150
           focus:outline-none focus:ring-2;
    background-color: var(--surface);
    border: 1px solid var(--border);
    color: var(--text-primary);
    --tw-ring-color: rgba(21, 101, 192, 0.5);
  }

  .dark .select-themed {
    --tw-ring-color: rgba(66, 165, 245, 0.5);
  }

  /* ── Pill toggle group ── */
  .pill-group {
    @apply inline-flex rounded-full p-1;
    background-color: #f1f5f9;
  }

  .dark .pill-group {
    background-color: #1e293b;
  }

  .pill-btn {
    @apply px-4 py-2 rounded-full text-sm font-medium transition-colors;
    color: var(--text-secondary);
  }

  .pill-btn:hover {
    color: var(--text-primary);
  }

  .pill-btn-active {
    @apply px-4 py-2 rounded-full text-sm font-semibold shadow-sm;
    background-color: var(--surface);
    color: var(--brand-blue);
  }

  .dark .pill-btn-active {
    background-color: #334155;
    color: #ffffff;
  }

  /* ── Alert boxes ── */
  .alert-success {
    @apply rounded-lg p-3 text-sm border;
    background-color: var(--surface);
    border-color: var(--brand-green);
    color: var(--brand-green);
    border-left: 4px solid var(--brand-green);
  }

  .alert-error {
    @apply rounded-lg p-3 text-sm border;
    background-color: var(--surface);
    border-color: var(--brand-red);
    color: var(--brand-red);
    border-left: 4px solid var(--brand-red);
  }

  /* ── Skeleton loading ── */
  .skeleton {
    @apply animate-pulse rounded-md;
    background-color: #e2e8f0;
  }

  .dark .skeleton {
    background-color: #1e293b;
  }

  .skeleton-text {
    @apply skeleton h-4 w-3/4 mx-auto;
  }

  .skeleton-chart {
    @apply skeleton h-64 w-full;
  }
}
```

- [ ] **Step 2: Verify the app still renders**

```bash
npm run dev
```
Open browser, confirm homepage loads with new slate-50 background and dot grid.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add CSS variables, dark theme, dot grid background, and component classes"
```

---

## Task 4: Layout — Inter Font, FOUC Prevention, ThemeToggle

**Files:**
- Modify: `app/layout.tsx`
- Create: `components/ThemeToggle.tsx`
- Create: `lib/useTheme.ts`

- [ ] **Step 1: Create useTheme hook**

Create `lib/useTheme.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

export function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return { dark, toggle };
}
```

- [ ] **Step 2: Create useThemeColors hook**

Create `lib/useThemeColors.ts` — this resolves CSS variables to actual hex values for Plotly (Plotly renders via SVG/canvas and cannot consume CSS `var()` references):

```ts
"use client";

import { useEffect, useState } from "react";

export interface ThemeColors {
  textPrimary: string;
  textSecondary: string;
  background: string;
  surface: string;
  border: string;
  brandBlue: string;
  brandGold: string;
  brandGreen: string;
  brandRed: string;
}

const LIGHT_DEFAULTS: ThemeColors = {
  textPrimary: "#0f172a",
  textSecondary: "#64748b",
  background: "#f8fafc",
  surface: "#ffffff",
  border: "#e2e8f0",
  brandBlue: "#1565C0",
  brandGold: "#F9A825",
  brandGreen: "#2E7D32",
  brandRed: "#C62828",
};

function resolve(): ThemeColors {
  if (typeof window === "undefined") return LIGHT_DEFAULTS;
  const s = getComputedStyle(document.documentElement);
  const g = (v: string, fallbackKey: keyof ThemeColors) => s.getPropertyValue(v).trim() || LIGHT_DEFAULTS[fallbackKey];
  return {
    textPrimary: g("--text-primary", "textPrimary"),
    textSecondary: g("--text-secondary", "textSecondary"),
    background: g("--background", "background"),
    surface: g("--surface", "surface"),
    border: g("--border", "border"),
    brandBlue: g("--brand-blue", "brandBlue"),
    brandGold: g("--brand-gold", "brandGold"),
    brandGreen: g("--brand-green", "brandGreen"),
    brandRed: g("--brand-red", "brandRed"),
  };
}

export function useThemeColors(): ThemeColors {
  const [colors, setColors] = useState<ThemeColors>(LIGHT_DEFAULTS);

  useEffect(() => {
    setColors(resolve());
    const observer = new MutationObserver(() => setColors(resolve()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return colors;
}
```

This hook watches for `class` attribute changes on `<html>` (which is how dark mode toggles), re-resolves all CSS variables to hex values, and triggers a re-render. Plotly components consume these resolved hex values instead of `var()` references.

- [ ] **Step 3: Create ThemeToggle component**

Create `components/ThemeToggle.tsx`:

```tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/useTheme";

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Ativar modo claro" : "Ativar modo escuro"}
      className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50
                 w-9 h-9 sm:w-10 sm:h-10 rounded-full
                 flex items-center justify-center
                 shadow-md backdrop-blur transition-colors
                 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
    >
      {dark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
    </button>
  );
}
```

- [ ] **Step 4: Update layout.tsx**

Replace `app/layout.tsx` entirely with:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Almanaque Financeiro da Série A 2025",
  description: "Explore as finanças dos clubes do Brasileirão",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark' || (!stored && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeToggle />
        <div className="animate-fade-in">{children}</div>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify font, dark mode toggle, and fade-in work**

```bash
npm run dev
```
Open browser: verify Inter font is applied, dark mode toggle appears top-right, clicking it toggles dark/light, refresh preserves choice, fade-in animation plays on page load.

- [ ] **Step 6: Commit**

```bash
git add lib/useTheme.ts lib/useThemeColors.ts components/ThemeToggle.tsx app/layout.tsx
git commit -m "feat: add Inter font, dark mode toggle with FOUC prevention, and page fade-in"
```

---

## Task 5: Routes — Add Icon Field

**Files:**
- Modify: `lib/routes.ts`

- [ ] **Step 1: Update routes.ts**

Replace entirely with:

```ts
import {
  BarChart3,
  BarChartHorizontal,
  ScatterChart,
  GitCompare,
  Eye,
  Scale,
  Leaf,
  Mail,
  type LucideIcon,
} from "lucide-react";

export interface Route {
  label: string;
  href: string;
  description: string;
  available: boolean;
  icon: LucideIcon;
  accent: string;
}

export const routes: Route[] = [
  {
    label: "Análise Individual",
    href: "/analise-individual",
    description: "Analise receitas, despesas e indicadores financeiros de clubes da Série A em 2025",
    available: true,
    icon: BarChart3,
    accent: "#1565C0",
  },
  {
    label: "Análise Comparativa Simples",
    href: "/analise-comparativa-simples",
    description: "Compare indicadores financeiros entre clubes",
    available: true,
    icon: BarChartHorizontal,
    accent: "#2E7D32",
  },
  {
    label: "Análise Conjunta",
    href: "/analise-conjunta",
    description: "Visualize o panorama financeiro de todos os clubes",
    available: true,
    icon: ScatterChart,
    accent: "#F9A825",
  },
  {
    label: "Compare 2 Clubes",
    href: "/compare-2-clubes",
    description: "Compare lado a lado as finanças de dois clubes",
    available: true,
    icon: GitCompare,
    accent: "#C62828",
  },
  {
    label: "Índice de Transparência",
    href: "/indice-de-transparencia",
    description: "Avalie o nível de transparência financeira dos clubes",
    available: true,
    icon: Eye,
    accent: "#1565C0",
  },
  {
    label: "Análise de Desigualdade",
    href: "/analise-de-desigualdade",
    description: "Acompanhe a evolução do Índice de Gini nas finanças do futebol brasileiro",
    available: true,
    icon: Scale,
    accent: "#2E7D32",
  },
  {
    label: "Sistema de Sustentabilidade Financeira",
    href: "/sustentabilidade-financeira",
    description: "Simulador do Fair Play Financeiro",
    available: true,
    icon: Leaf,
    accent: "#F9A825",
  },
  {
    label: "Dúvidas, Sugestões, Bugs",
    href: "/contato",
    description: "Entre em contato",
    available: true,
    icon: Mail,
    accent: "#C62828",
  },
];
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add lib/routes.ts
git commit -m "feat: add icon and accent color to route definitions"
```

---

## Task 6: NavCard — Icon, Accent Bar, Theme-Aware

**Files:**
- Modify: `components/NavCard.tsx`

- [ ] **Step 1: Replace NavCard.tsx**

```tsx
import Link from "next/link";
import type { Route } from "@/lib/routes";

export default function NavCard({ route }: { route: Route }) {
  const Icon = route.icon;

  return (
    <Link
      href={route.href}
      className="nav-card group"
      style={{ "--card-accent": route.accent } as React.CSSProperties}
    >
      {!route.available && (
        <span className="absolute top-3 right-3 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)]">
          Em breve
        </span>
      )}

      <Icon size={24} style={{ color: "var(--brand-blue)" }} className="mb-3" />

      <h2 className="text-lg font-semibold transition-colors group-hover:text-[var(--brand-blue)]" style={{ color: "var(--text-primary)" }}>
        {route.label}
      </h2>

      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {route.description}
      </p>
    </Link>
  );
}
```

- [ ] **Step 2: Verify homepage renders with icons and accent bars**

```bash
npm run dev
```
Open browser: verify cards show Lucide icons, left accent bar, hover effects.

- [ ] **Step 3: Commit**

```bash
git add components/NavCard.tsx
git commit -m "feat: redesign NavCard with icon, accent bar, and theme support"
```

---

## Task 7: Homepage Redesign

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace homepage**

```tsx
import Image from "next/image";
import NavCard from "@/components/NavCard";
import { routes } from "@/lib/routes";

export default function FrontPage() {
  return (
    <main className="max-w-[960px] mx-auto px-4 py-12">
      <div className="flex flex-col items-center mb-10">
        <Image
          src="/brasileirao-logo.jpg"
          alt="Brasileirao"
          width={120}
          height={120}
          className="rounded-full drop-shadow-md mb-6"
          priority
        />
        <h1 className="text-4xl font-bold tracking-tight text-center" style={{ color: "var(--text-primary)" }}>
          Almanaque Financeiro da Série A 2025
        </h1>
        <p className="mt-3 text-lg text-center max-w-md" style={{ color: "var(--text-secondary)" }}>
          Explore as finanças dos clubes do Brasileirão
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route) => (
          <NavCard key={route.href} route={route} />
        ))}
      </div>

      {/* Hidden visit counter */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Ffinancials-football-clubs.vercel.app&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=visits&edge_flat=false"
        alt=""
        style={{ display: "none" }}
      />
    </main>
  );
}
```

- [ ] **Step 2: Verify homepage in both light and dark mode**

```bash
npm run dev
```
Check: logo drop-shadow, no gradient bar, larger gap, proper colors in both modes.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: redesign homepage with polished typography and spacing"
```

---

## Task 8: BackButton & MetricSelector — Theme-Aware

**Files:**
- Modify: `components/BackButton.tsx`
- Modify: `components/MetricSelector.tsx`

- [ ] **Step 1: Replace BackButton.tsx**

```tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 text-sm rounded-lg px-3 py-2
                 transition-colors mb-6
                 text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                 hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      <ArrowLeft size={16} />
      Voltar ao inicio
    </Link>
  );
}
```

- [ ] **Step 2: Replace MetricSelector.tsx**

```tsx
"use client";

import { metrics } from "@/lib/metric-config";

interface MetricSelectorProps {
  value: string;
  onChange: (metricLabel: string) => void;
}

export default function MetricSelector({ value, onChange }: MetricSelectorProps) {
  const financeiras = metrics.filter((m) => m.group === "financeiras");
  const esportivas = metrics.filter((m) => m.group === "esportivas");
  const gerenciais = metrics.filter((m) => m.group === "gerenciais");

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="select-themed"
    >
      <option value="">Selecione uma métrica</option>
      <optgroup label="Financeiras">
        {financeiras.map((m) => (
          <option key={m.csvKey} value={m.csvKey}>
            {m.label}
          </option>
        ))}
      </optgroup>
      <optgroup label="Esportivas">
        {esportivas.map((m) => (
          <option key={m.csvKey} value={m.csvKey}>
            {m.label}
          </option>
        ))}
      </optgroup>
      <optgroup label="Gerenciais">
        {gerenciais.map((m) => (
          <option key={m.csvKey} value={m.csvKey}>
            {m.label}
          </option>
        ))}
      </optgroup>
    </select>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/BackButton.tsx components/MetricSelector.tsx
git commit -m "feat: theme-aware BackButton and MetricSelector"
```

---

## Task 9: ClubSummary & TransparencyTable — Theme-Aware

**Files:**
- Modify: `components/ClubSummary.tsx`
- Modify: `components/TransparencyTable.tsx`

- [ ] **Step 1: Replace ClubSummary.tsx**

```tsx
"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface ClubSummaryProps {
  content: string | null;
  loading?: boolean;
  clubSelected?: boolean;
}

export default function ClubSummary({ content, loading, clubSelected }: ClubSummaryProps) {
  if (loading)
    return <p className="text-center py-4" style={{ color: "var(--text-secondary)" }}>Carregando resumo...</p>;
  if (!content && clubSelected) {
    return <p className="text-center py-4" style={{ color: "var(--text-secondary)" }}>Resumo não disponível para este clube.</p>;
  }
  if (!content) return null;

  return (
    <div
      className="max-w-2xl mx-auto mb-6 px-5 py-4 rounded-lg text-sm leading-relaxed
        [&_h4]:font-semibold [&_h4]:text-base [&_h4]:mt-2 [&_h4]:mb-1
        [&_p]:my-1 [&_b]:font-semibold"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        color: "var(--text-primary)",
      }}
    >
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
    </div>
  );
}
```

- [ ] **Step 2: Replace TransparencyTable.tsx**

```tsx
"use client";

import Image from "next/image";
import { TransparencyDatum } from "./TransparencyChart";

interface Props {
  data: TransparencyDatum[];
  iconMap: Record<string, string>;
}

const HEADERS = [
  { label: "#", align: "text-center" },
  { label: "Clube", align: "text-left" },
  { label: "Nível 1", align: "text-center" },
  { label: "Nível 2", align: "text-center" },
  { label: "Nível 3", align: "text-center" },
  { label: "Índice de Transparência", align: "text-center" },
];

export default function TransparencyTable({ data, iconMap }: Props) {
  return (
    <div className="overflow-x-auto card-surface !p-0">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr style={{ backgroundColor: "var(--brand-blue)" }}>
            {HEADERS.map((h) => (
              <th
                key={h.label}
                className={`px-3 py-2 text-white font-bold whitespace-nowrap ${h.align}`}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr
              key={d.club}
              className="transition-colors hover:bg-blue-50 dark:hover:bg-slate-800"
              style={{
                backgroundColor: i % 2 === 0 ? "var(--surface)" : "var(--background)",
              }}
            >
              <td className="px-3 py-2 text-center" style={{ color: "var(--text-primary)" }}>{i + 1}</td>
              <td className="px-3 py-2 text-left" style={{ color: "var(--text-primary)" }}>
                <span className="flex items-center gap-2 whitespace-nowrap">
                  {iconMap[d.club] && (
                    <Image
                      src={iconMap[d.club]}
                      alt={d.club}
                      width={32}
                      height={32}
                      style={{ objectFit: "contain" }}
                    />
                  )}
                  {d.club}
                </span>
              </td>
              <td className="px-3 py-2 text-center" style={{ color: "var(--text-primary)" }}>{d.nivel1.toFixed(1)}</td>
              <td className="px-3 py-2 text-center" style={{ color: "var(--text-primary)" }}>{d.nivel2.toFixed(1)}</td>
              <td className="px-3 py-2 text-center" style={{ color: "var(--text-primary)" }}>{d.nivel3.toFixed(1)}</td>
              <td
                className="px-3 py-2 text-center font-bold"
                style={{
                  color: "var(--text-primary)",
                  backgroundColor: "rgba(21, 101, 192, 0.12)",
                }}
              >
                {d.total.toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/ClubSummary.tsx components/TransparencyTable.tsx
git commit -m "feat: theme-aware ClubSummary and TransparencyTable"
```

---

## Task 10: PlotlyChart — Theme-Aware Defaults

**Important:** Plotly renders via SVG/canvas and **cannot consume CSS `var()` references**. All Plotly color values must be resolved hex strings. Use the `useThemeColors` hook to get resolved values.

**Files:**
- Modify: `components/PlotlyChart.tsx`

- [ ] **Step 1: Replace PlotlyChart.tsx**

```tsx
"use client";

import dynamic from "next/dynamic";
import { useThemeColors } from "@/lib/useThemeColors";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface PlotlyChartProps {
  data: any[];
  layout?: Record<string, any>;
}

export default function PlotlyChart({ data, layout }: PlotlyChartProps) {
  const colors = useThemeColors();

  return (
    <Plot
      data={data}
      layout={{
        autosize: true,
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        font: {
          family: "Inter, system-ui, sans-serif",
          color: colors.textPrimary,
        },
        ...layout,
      }}
      config={{ responsive: true, displayModeBar: false }}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/PlotlyChart.tsx
git commit -m "feat: add theme-aware defaults to PlotlyChart wrapper"
```

---

## Task 11: Recharts Components — Theme-Aware Tooltips and Grid

This task updates all 5 Recharts chart components to use theme-aware colors for tooltips, grid lines, and axis labels.

**Files:**
- Modify: `components/ComparisonBarChart.tsx`
- Modify: `components/CompareBarChart.tsx`
- Modify: `components/EvolutionLineChart.tsx`
- Modify: `components/HorizontalBarChart.tsx`
- Modify: `components/InequalityLineChart.tsx`

For each of these files, the changes follow the same pattern. Apply these replacements in every file:

- [ ] **Step 1: In each file, update Tooltip components**

Find every `<Tooltip` component and update its `contentStyle` prop. Replace any existing `contentStyle` with:

```tsx
contentStyle={{
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  color: "var(--text-primary)",
}}
```

If the tooltip has a custom `content` prop with hardcoded `bg-white` or `border-gray-200` classes, replace with:
- `bg-white` → remove, use `style={{ backgroundColor: "var(--surface)" }}`
- `border-gray-200` → remove, use `style={{ borderColor: "var(--border)" }}`
- `text-gray-*` → use `style={{ color: "var(--text-primary)" }}` or `style={{ color: "var(--text-secondary)" }}`

- [ ] **Step 2: In each file, update CartesianGrid**

Find `<CartesianGrid` and update `stroke`:

```tsx
<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
```

- [ ] **Step 3: In each file, update XAxis and YAxis tick colors**

Find `<XAxis` and `<YAxis` and update tick color:

```tsx
<XAxis ... tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
<YAxis ... tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
```

- [ ] **Step 4: Update legend text colors**

In files with custom legend items using `text-gray-*` classes or hardcoded colors like `#555`, `#333`, update to `style={{ color: "var(--text-secondary)" }}`.

- [ ] **Step 5: Verify all charts render in both modes**

```bash
npm run dev
```
Navigate to each module page, toggle dark/light, confirm charts render correctly.

- [ ] **Step 6: Commit**

```bash
git add components/ComparisonBarChart.tsx components/CompareBarChart.tsx components/EvolutionLineChart.tsx components/HorizontalBarChart.tsx components/InequalityLineChart.tsx
git commit -m "feat: theme-aware tooltips, grid lines, and axes in Recharts charts"
```

---

## Task 12: Plotly Chart Components — Theme-Aware Layout

**Important:** Plotly cannot consume CSS `var()` references. Each component must import `useThemeColors` and use the resolved hex values from the hook.

**Files:**
- Modify: `components/ScatterPlotChart.tsx`
- Modify: `components/SankeyChart.tsx`
- Modify: `components/RadarChart.tsx`
- Modify: `components/TransparencyChart.tsx`

- [ ] **Step 1: In each file, import and use useThemeColors**

Add at the top of each component:
```ts
import { useThemeColors } from "@/lib/useThemeColors";
```

Inside the component function body:
```ts
const colors = useThemeColors();
```

- [ ] **Step 2: Update layout properties**

In every layout object passed to `<PlotlyChart>` or `<Plot>`, use resolved values:

```ts
paper_bgcolor: "transparent",
plot_bgcolor: "transparent",
font: {
  family: "Inter, system-ui, sans-serif",
  color: colors.textPrimary,
},
colorway: [colors.brandBlue, colors.brandRed, colors.brandGreen, colors.brandGold],
```

For scatter plots with gridlines, also update:
```ts
xaxis: {
  ...existingXaxis,
  gridcolor: colors.border,
  zerolinecolor: colors.border,
},
yaxis: {
  ...existingYaxis,
  gridcolor: colors.border,
  zerolinecolor: colors.border,
},
```

- [ ] **Step 3: Update annotation colors**

Find any hardcoded annotation colors like `#555`, `#333`, `#999` and replace with `colors.textSecondary`.

- [ ] **Step 4: Verify all Plotly charts render in both modes**

```bash
npm run dev
```
Navigate to each page and toggle dark/light. Verify:
- Sankey: node labels and link colors readable, transparent background
- Radar: axis labels and grid visible in dark mode
- Scatter: axis labels, grid lines, and annotations visible in both modes
- Transparency chart: bar labels readable in dark mode

- [ ] **Step 5: Commit**

```bash
git add components/ScatterPlotChart.tsx components/SankeyChart.tsx components/RadarChart.tsx components/TransparencyChart.tsx
git commit -m "feat: theme-aware Plotly chart layouts with resolved color values"
```

---

## Task 13a: Core Module Pages — Controls/Chart Zones & Dark Mode

Apply `card-surface` containers, `pill-group`/`pill-btn` toggles, `select-themed` selects, and theme-aware text colors to the 4 main analysis pages.

**Files:**
- Modify: `app/analise-individual/page.tsx`
- Modify: `app/analise-comparativa-simples/page.tsx`
- Modify: `app/analise-conjunta/page.tsx`
- Modify: `app/compare-2-clubes/page.tsx`

**Replacement patterns (apply to all 4 files):**

| Find | Replace |
|------|---------|
| `text-gray-900` | `text-[var(--text-primary)]` |
| `text-gray-800` | `text-[var(--text-primary)]` |
| `text-gray-700` | `text-[var(--text-primary)]` |
| `text-gray-600` | `text-[var(--text-secondary)]` |
| `text-gray-500` | `text-[var(--text-secondary)]` |
| `text-gray-400` | `text-[var(--text-secondary)]` |
| `bg-gray-100` (button inactive bg) | handled by `pill-btn` class |
| `bg-white` (on containers) | remove, use `card-surface` class |

- [ ] **Step 1: Wrap controls in card-surface**

In each page, wrap the selector/toggle area in a `<div className="card-surface mb-6">`. Example:

Before:
```tsx
<div className="flex justify-center gap-2 mb-4">
  {/* season buttons */}
</div>
<div className="flex flex-col items-center gap-4 mb-6">
  {/* club selector */}
</div>
```

After:
```tsx
<div className="card-surface mb-6">
  <div className="flex justify-center gap-2 mb-4">
    {/* season buttons */}
  </div>
  <div className="flex flex-col items-center gap-4">
    {/* club selector */}
  </div>
</div>
```

- [ ] **Step 2: Wrap chart outputs in card-surface**

Wrap each chart section in `<div className="card-surface mb-6">`.

- [ ] **Step 3: Convert season toggle buttons to pill style**

Before:
```tsx
<button className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
  season === "2025" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
}`}>
```

After:
```tsx
<div className="pill-group">
  <button className={season === "2025" ? "pill-btn-active" : "pill-btn"}>
  <button className={season === "2024" ? "pill-btn-active" : "pill-btn"}>
</div>
```

- [ ] **Step 4: Convert select elements to select-themed**

Replace all inline select classes:
```
className="px-4 py-2 border border-gray-300 rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
```
with:
```
className="select-themed"
```

- [ ] **Step 5: Replace hardcoded text colors and update headings**

Apply the replacement table above. Update h1/h2 patterns:
```tsx
<h1 className="text-3xl font-bold tracking-tight text-center mb-1" style={{ color: "var(--text-primary)" }}>
```

- [ ] **Step 6: Update loading/error/empty states**

```tsx
// Loading: use theme color
<p className="text-center py-8" style={{ color: "var(--text-secondary)" }}>Carregando...</p>

// Error: use brand-red
<p className="text-center py-8" style={{ color: "var(--brand-red)" }}>{error}</p>

// For chart loading states, use skeleton blocks:
<div className="skeleton-chart" />
```

- [ ] **Step 7: Verify these 4 pages in both modes**

```bash
npm run dev
```
Navigate to each of the 4 pages, toggle dark/light, confirm card surfaces, pill toggles, selects, and text colors.

- [ ] **Step 8: Commit**

```bash
git add app/analise-individual/page.tsx app/analise-comparativa-simples/page.tsx app/analise-conjunta/page.tsx app/compare-2-clubes/page.tsx
git commit -m "feat: apply card-surface layout, pill toggles, and dark mode to core module pages"
```

---

## Task 13b: Secondary Module Pages — Dark Mode

Apply the same patterns to the remaining analysis pages.

**Files:**
- Modify: `app/indice-de-transparencia/page.tsx`
- Modify: `app/analise-de-desigualdade/page.tsx`
- Modify: `app/sustentabilidade-financeira/page.tsx`
- Modify: `app/analise-individual-historica/page.tsx`

- [ ] **Step 1: Apply same replacement patterns as Task 13a**

For each file: replace hardcoded `text-gray-*` colors, wrap controls in `card-surface`, wrap charts in `card-surface`, convert any season/period toggles to pill style, convert selects to `select-themed`.

- [ ] **Step 2: Remove gradient divider bars**

Remove any `<div className="h-1 w-full bg-gradient-to-r from-brand-blue via-brand-gold to-brand-green" />` from these pages. Also remove any gradient accent bars like `<div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r ...">`.

- [ ] **Step 3: Update heading styles**

Same pattern as Task 13a: `text-3xl font-bold tracking-tight` with `color: var(--text-primary)`.

- [ ] **Step 4: Update loading/error states**

Same pattern as Task 13a.

- [ ] **Step 5: Verify these 4 pages in both modes**

```bash
npm run dev
```

- [ ] **Step 6: Commit**

```bash
git add app/indice-de-transparencia/page.tsx app/analise-de-desigualdade/page.tsx app/sustentabilidade-financeira/page.tsx app/analise-individual-historica/page.tsx
git commit -m "feat: apply dark mode and card-surface layout to secondary module pages"
```

---

## Task 13c: Contact Page — Form Restyling

Apply theme-aware styling to the contact form.

**Files:**
- Modify: `app/contato/page.tsx`

- [ ] **Step 1: Remove gradient divider bar**

Remove `<div className="h-1 w-full bg-gradient-to-r from-brand-blue via-brand-gold to-brand-green" />`.

- [ ] **Step 2: Replace hardcoded text colors**

Same replacement table as Task 13a.

- [ ] **Step 3: Replace input/textarea classes with select-themed**

Replace all form field class strings with `className="select-themed w-full"`.

- [ ] **Step 4: Wrap form in card-surface**

Wrap the `<form>` element in `<div className="card-surface">`.

- [ ] **Step 5: Update form labels**

Replace `text-gray-700` on labels with `style={{ color: "var(--text-primary)" }}`.

- [ ] **Step 6: Update submit button**

Replace the submit button classes with:
```tsx
className="rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-all active:shadow-none active:scale-[0.98] disabled:opacity-50"
style={{ backgroundColor: "var(--brand-blue)" }}
```

- [ ] **Step 7: Replace success/error messages with alert boxes**

Replace:
```tsx
<p className="text-green-600 text-sm">Mensagem enviada com sucesso!</p>
```
with:
```tsx
<div className="alert-success">Mensagem enviada com sucesso!</div>
```

Replace error `<p>` with `<div className="alert-error">...</div>`.

- [ ] **Step 8: Verify contact page in both modes**

```bash
npm run dev
```
Navigate to contact page, toggle dark/light, submit form, verify alert boxes display correctly.

- [ ] **Step 9: Commit**

```bash
git add app/contato/page.tsx
git commit -m "feat: theme-aware contact form with alert boxes"
```

---

## Task 14: Final Verification & Cleanup

- [ ] **Step 1: Run TypeScript check**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 2: Run linter**

```bash
npm run lint
```
Expected: No errors (or only pre-existing ones).

- [ ] **Step 3: Full visual QA**

```bash
npm run dev
```

Check every page in both light and dark mode:
1. Homepage — cards, icons, accent bars, spacing
2. Análise Individual — Sankey, Radar, Bar charts, ClubSummary
3. Análise Comparativa Simples — ComparisonBarChart, EvolutionLineChart
4. Análise Conjunta — ScatterPlot
5. Compare 2 Clubes — CompareBarChart
6. Índice de Transparência — TransparencyChart, TransparencyTable
7. Análise de Desigualdade — InequalityLineCharts
8. Sustentabilidade Financeira — placeholder page
9. Análise Individual Histórica — historical charts
10. Contato — form, alerts

Verify:
- No flash of white on dark mode page load
- Dark mode toggle persists across navigation
- Dot grid background visible (subtle)
- All charts readable in both modes
- No hardcoded white/gray backgrounds visible in dark mode

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: visual QA cleanup"
```
