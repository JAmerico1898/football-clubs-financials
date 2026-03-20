import { clubs2025 } from "./clubs2025";

export type Season = "2024" | "2025";
export type ScatterPeriod = "2025" | "2024" | "2025 & 2024";

export interface Club {
  name: string;
  fileKey: string;
  radarFileKey?: string; // if radar file uses different naming than fileKey
  iconFile: string;
  csvColumn: string;
}

// 2024 clubs — also exported as `clubs` for backward compatibility with other modules
export const clubs2024: Club[] = [
  { name: "Vasco", fileKey: "Vasco", iconFile: "Vasco.png", csvColumn: "Vasco" },
  { name: "Athletico", fileKey: "Athletico", iconFile: "Athletico.png", csvColumn: "Athletico" },
  { name: "Atlético", fileKey: "Atletico", iconFile: "Atletico.png", csvColumn: "Atlético" },
  { name: "Atlético GO", fileKey: "Atletico_GO", iconFile: "AtleticoGO.png", csvColumn: "Atlético GO" },
  { name: "Bahia", fileKey: "Bahia", iconFile: "Bahia.png", csvColumn: "Bahia" },
  { name: "Botafogo", fileKey: "Botafogo", iconFile: "Botafogo.png", csvColumn: "Botafogo" },
  { name: "Corinthians", fileKey: "Corinthians", iconFile: "Corinthians.png", csvColumn: "Corinthians" },
  { name: "Criciúma", fileKey: "Criciuma", iconFile: "Criciuma.png", csvColumn: "Criciúma" },
  { name: "Cruzeiro", fileKey: "Cruzeiro", iconFile: "Cruzeiro.png", csvColumn: "Cruzeiro" },
  { name: "Cuiabá", fileKey: "Cuiaba", iconFile: "Cuiaba.png", csvColumn: "Cuiabá" },
  { name: "Flamengo", fileKey: "Flamengo", iconFile: "Flamengo.png", csvColumn: "Flamengo" },
  { name: "Fluminense", fileKey: "Fluminense", iconFile: "Fluminense.png", csvColumn: "Fluminense" },
  { name: "Fortaleza", fileKey: "Fortaleza", iconFile: "Fortaleza.png", csvColumn: "Fortaleza" },
  { name: "Grêmio", fileKey: "Gremio", radarFileKey: "Grêmio", iconFile: "Gremio.png", csvColumn: "Grêmio" },
  { name: "Internacional", fileKey: "Internacional", iconFile: "Internacional.png", csvColumn: "Internacional" },
  { name: "Juventude", fileKey: "Juventude", iconFile: "Juventude.png", csvColumn: "Juventude" },
  { name: "Palmeiras", fileKey: "Palmeiras", iconFile: "Palmeiras.png", csvColumn: "Palmeiras" },
  { name: "São Paulo", fileKey: "Sao_Paulo", iconFile: "SaoPaulo.png", csvColumn: "São Paulo" },
  { name: "Vitória", fileKey: "Vitoria", iconFile: "Vitoria.png", csvColumn: "Vitória" },
];

// Backward-compat alias — other modules import `clubs` and expect the 2024 list
export const clubs = clubs2024;

export const extraChartClubs: Club[] = [
  { name: "Red Bull Bragantino", fileKey: "RedBullBragantino", iconFile: "Red Bull Bragantino.png", csvColumn: "Red Bull Bragantino" },
];

export const allChartClubs: Club[] = [...clubs, ...extraChartClubs];

export const DEFAULT_CLUB = "Vasco";

export function getSankeyUrl(club: Club, season: Season = "2024"): string {
  return `/sankey/${club.fileKey}_sankey_${season}.json`;
}

export function getRadarUrl(club: Club, season: Season = "2024"): string {
  const key = club.radarFileKey || club.fileKey;
  return `/radar/${key}_radar_${season}.json`;
}

export function getIconUrl(club: Club): string {
  return `/clubs/${club.iconFile}`;
}

export function getSummaryUrl(club: Club, season: Season = "2024"): string {
  return `/summaries/resumo_${club.fileKey.toLowerCase()}_${season}.md`;
}

export function getBackdropUrl(club: Club): string {
  return `/clubs_backdrop/${club.fileKey.toLowerCase()}_backdrop.jpg`;
}

export function getBarChartCsvUrl(season: Season): string {
  return `/data/Painel_Consolidado_Moeda_Cte_${season}.csv`;
}

export function getScatterCsvUrls(period: ScatterPeriod): string[] {
  if (period === "2025") return ["/data/Índices_2025.csv"];
  if (period === "2024") return ["/data/Índices_2024.csv"];
  return ["/data/Índices_2025.csv", "/data/Índices_2024.csv"];
}

export function getScatterClubs(period: ScatterPeriod): Club[] {
  if (period === "2025") return clubs2025;
  return [...clubs2024, ...extraChartClubs];
}
