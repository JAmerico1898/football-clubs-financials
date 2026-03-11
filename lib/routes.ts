export interface Route {
  label: string;
  href: string;
  description: string;
  available: boolean;
}

export const routes: Route[] = [
  {
    label: "Análise Individual",
    href: "/analise-individual-2024",
    description: "Analise receitas, despesas e indicadores financeiros de clubes da Série A em 2024",
    available: true,
  },
  {
    label: "Análise Comparativa Simples",
    href: "/analise-comparativa-simples",
    description: "Compare indicadores financeiros entre clubes",
    available: true,
  },
  {
    label: "Análise Conjunta",
    href: "/analise-conjunta",
    description: "Visualize o panorama financeiro de todos os clubes",
    available: true,
  },
  {
    label: "Compare 2 Clubes",
    href: "/compare-2-clubes",
    description: "Compare lado a lado as finanças de dois clubes",
    available: true,
  },
  {
    label: "Índice de Transparência",
    href: "/indice-de-transparencia",
    description: "Avalie o nível de transparência financeira dos clubes",
    available: true,
  },
  {
    label: "Análise de Desigualdade",
    href: "/analise-de-desigualdade",
    description: "Acompanhe a evolução do Índice de Gini nas finanças do futebol brasileiro",
    available: true,
  },
];
