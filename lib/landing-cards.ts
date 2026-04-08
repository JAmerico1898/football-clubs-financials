export interface LandingCard {
  title: string;
  description: string;
  materialIcon: string;
  href: string;
}

export interface SpiralBadge {
  alt: string;
  file: string;
  width: number;
  top: string;
  left: string;
}

export const landingCards: LandingCard[] = [
  {
    title: "Análise Individual",
    description:
      "Raio-x de cada clube. Visualize as principais métricas financeiras e compare com o desempenho de 2025 com 2024.",
    materialIcon: "query_stats",
    href: "/analise-individual",
  },
  {
    title: "Análise Comparativa",
    description:
      "Compare o desempenho dos clubes nas principais métricas financeiras e a evolução do seu clube entre 2021 e 2025.",
    materialIcon: "leaderboard",
    href: "/analise-comparativa-simples",
  },
  {
    title: "Análise Conjunta",
    description:
      "Analise a relação entre métricas financeiras e desempenho esportivo.",
    materialIcon: "hub",
    href: "/analise-conjunta",
  },
  {
    title: "Compare 2 Clubes",
    description:
      "Duelo financeiro entre dois clubes. Confronte receitas, despesas e saúde patrimonial.",
    materialIcon: "compare_arrows",
    href: "/compare-2-clubes",
  },
  {
    title: "Índice de Transparência",
    description:
      "Score de transparência baseado na qualidade das publicações financeiras.",
    materialIcon: "verified",
    href: "/indice-de-transparencia",
  },
  {
    title: "Análise de Desigualdade",
    description:
      "Evolução da desigualdade financeira e esportiva entre os clubes do Brasileirão (2021–2025).",
    materialIcon: "stacked_line_chart",
    href: "/analise-de-desigualdade",
  },
  {
    title: "Sistema de Sustentabilidade",
    description:
      "Simulação de conformidade às novas regras de Fair Play Financeiro da CBF.",
    materialIcon: "account_balance",
    href: "/sustentabilidade-financeira",
  },
  {
    title: "Evolução Financeira da Liga",
    description:
      "Evolução dos principais agregados financeiros da liga entre 2021 e 2025.",
    materialIcon: "show_chart",
    href: "/evolucao-liga",
  },
];

export const spiralBadges: SpiralBadge[] = [
  { alt: "Flamengo", file: "flamengo.png", width: 20, top: "50%", left: "30%" },
  { alt: "Bahia", file: "bahia.png", width: 24, top: "45%", left: "34%" },
  { alt: "Botafogo", file: "botafogo.png", width: 28, top: "38%", left: "31%" },
  { alt: "Ceará", file: "ceara.png", width: 32, top: "42%", left: "24%" },
  { alt: "Corinthians", file: "corinthians.png", width: 36, top: "52%", left: "22%" },
  { alt: "Atlético Mineiro", file: "atletico.png", width: 40, top: "60%", left: "28%" },
  { alt: "Cruzeiro", file: "cruzeiro.png", width: 44, top: "58%", left: "38%" },
  { alt: "Fluminense", file: "fluminense.png", width: 48, top: "48%", left: "45%" },
  { alt: "Fortaleza", file: "fortaleza.png", width: 52, top: "35%", left: "42%" },
  { alt: "Grêmio", file: "gremio.png", width: 56, top: "25%", left: "32%" },
  { alt: "Internacional", file: "internacional.png", width: 60, top: "15%", left: "22%" },
  { alt: "Juventude", file: "juventude.png", width: 64, top: "22%", left: "12%" },
  { alt: "Mirassol", file: "mirassol.png", width: 68, top: "38%", left: "8%" },
  { alt: "Palmeiras", file: "palmeiras.png", width: 72, top: "55%", left: "10%" },
  { alt: "Red Bull Bragantino", file: "red_bull_bragantino.png", width: 76, top: "70%", left: "20%" },
  { alt: "Santos", file: "santos.png", width: 80, top: "80%", left: "35%" },
  { alt: "São Paulo", file: "sao_paulo.png", width: 84, top: "75%", left: "50%" },
  { alt: "Sport", file: "sport.png", width: 88, top: "55%", left: "60%" },
  { alt: "Vitória", file: "vitoria.png", width: 92, top: "25%", left: "62%" },
  { alt: "Vasco", file: "vasco.png", width: 96, top: "10%", left: "50%" },
];
