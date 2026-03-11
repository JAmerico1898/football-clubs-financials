export interface Club {
  name: string;
  fileKey: string;
  iconFile: string;
  csvColumn: string;
}

export const clubs: Club[] = [
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
  { name: "Grêmio", fileKey: "Gremio", iconFile: "Gremio.png", csvColumn: "Grêmio" },
  { name: "Internacional", fileKey: "Internacional", iconFile: "Internacional.png", csvColumn: "Internacional" },
  { name: "Juventude", fileKey: "Juventude", iconFile: "Juventude.png", csvColumn: "Juventude" },
  { name: "Palmeiras", fileKey: "Palmeiras", iconFile: "Palmeiras.png", csvColumn: "Palmeiras" },
  { name: "São Paulo", fileKey: "Sao_Paulo", iconFile: "SaoPaulo.png", csvColumn: "São Paulo" },
  { name: "Vitória", fileKey: "Vitoria", iconFile: "Vitoria.png", csvColumn: "Vitória" },
];

export const extraChartClubs: Club[] = [
  { name: "Red Bull Bragantino", fileKey: "RedBullBragantino", iconFile: "Red Bull Bragantino.png", csvColumn: "Red Bull Bragantino" },
];

export const allChartClubs: Club[] = [...clubs, ...extraChartClubs];

export const DEFAULT_CLUB = "Vasco";

export function getSankeyUrl(club: Club): string {
  return `/sankey/${club.fileKey}_sankey_2024.json`;
}

export function getRadarUrl(club: Club): string {
  return `/radar/${club.fileKey}_radar_2024.json`;
}

export function getIconUrl(club: Club): string {
  return `/clubs/${club.iconFile}`;
}
