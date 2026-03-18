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
