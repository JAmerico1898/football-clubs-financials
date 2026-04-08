"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { landingCards } from "@/lib/landing-cards";

const SHORT_LABELS: Record<string, string> = {
  "/analise-individual": "Individual",
  "/analise-comparativa-simples": "Comparativa",
  "/analise-conjunta": "Conjunta",
  "/compare-2-clubes": "2 Clubes",
  "/indice-de-transparencia": "Transparência",
  "/analise-de-desigualdade": "Desigualdade",
  "/sustentabilidade-financeira": "Sustentabilidade",
  "/evolucao-liga": "Evolução Liga",
};

const navItems = [
  { label: "Início", href: "/" },
  ...landingCards.map((c) => ({ label: SHORT_LABELS[c.href] ?? c.title, href: c.href })),
];

export default function ModuleNavbar() {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1.5 py-3 px-2"
      role="navigation"
      aria-label="Navegação entre módulos"
    >
      {navItems.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const isHome = item.href === "/";

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              inline-flex items-center gap-1.5 text-xs font-medium rounded-full
              px-3 py-1.5 transition-all whitespace-nowrap
              ${
                isActive
                  ? "bg-[var(--brand-green)] text-white shadow-sm"
                  : "bg-white/70 text-[var(--text-secondary)] hover:bg-white hover:text-[var(--text-primary)] hover:shadow-sm"
              }
            `}
          >
            {isHome && <Home size={13} />}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
