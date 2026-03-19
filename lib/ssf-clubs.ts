import { Club, getIconUrl } from "./clubs";

/**
 * The 23 clubs present in SSF.csv — Vasco first, then alphabetical.
 * csvColumn must match the exact header in the CSV.
 */
export const ssfClubs: Club[] = [
  { name: "Vasco", fileKey: "Vasco", iconFile: "Vasco.png", csvColumn: "Vasco" },
  { name: "Athletico", fileKey: "Athletico", iconFile: "Athletico.png", csvColumn: "Athletico" },
  { name: "Atlético", fileKey: "Atletico", iconFile: "Atletico.png", csvColumn: "Atlético" },
  { name: "Atlético GO", fileKey: "Atletico_GO", iconFile: "AtleticoGO.png", csvColumn: "Atlético GO" },
  { name: "Bahia", fileKey: "Bahia", iconFile: "Bahia.png", csvColumn: "Bahia" },
  { name: "Botafogo", fileKey: "Botafogo", iconFile: "Botafogo.png", csvColumn: "Botafogo" },
  { name: "Ceará", fileKey: "ceara", iconFile: "Ceará.png", csvColumn: "Ceará" },
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
  { name: "Red Bull Bragantino", fileKey: "RedBullBragantino", iconFile: "Red Bull Bragantino.png", csvColumn: "Red Bull Bragantino" },
  { name: "Santos", fileKey: "santos", iconFile: "Santos.png", csvColumn: "Santos" },
  { name: "São Paulo", fileKey: "Sao_Paulo", iconFile: "SaoPaulo.png", csvColumn: "São Paulo" },
  { name: "Sport", fileKey: "sport", iconFile: "Sport.png", csvColumn: "Sport" },
  { name: "Vitória", fileKey: "Vitoria", iconFile: "Vitoria.png", csvColumn: "Vitória" },
];

/** Dados keys used to look up rows in SSF.csv */
export const SSF_KEYS = {
  receitasRelevantes: "Receitas Relevantes",
  despesasRelevantes: "Despesas Relevantes",
  exclusoes: "Exclusões do Resultado da Operação",
  contribuicoes: "Contribuições Patrimoniais",
  custoElenco: "Custo com Elenco de um Clube",
  financiamentoElenco: "Financiamento do Elenco de um clube",
  olcp: "Obrigações Líquidas de Curto Prazo (OLCP)",
  reqSustentabilidade: "Requisito de Sustentabilidade",
  reqCustoElenco: "Requisito de Controle de Custo com o Elenco",
  reqEndividamento: "Requisito de Endividamento",
} as const;

export interface SSFClubDetail {
  clubName: string;
  receitasRelevantes: number;
  despesasRelevantes: number;
  exclusoes: number;
  contribuicoes: number;
  resultadoOperacional: number;
  custoElenco: number;
  financiamentoElenco: number;
  indicadorCusto: number;
  olcp: number;
  receitasRelevantesEndiv: number;
  indicadorEndividamento: number;
}

type CsvRow = Record<string, string>;

function getVal(row: CsvRow | undefined, csvColumn: string): number {
  if (!row) return NaN;
  const raw = row[csvColumn]?.trim();
  if (!raw || raw === "") return NaN;
  return parseFloat(raw);
}

export function resolveSSFData(
  rows: CsvRow[],
  club: Club
): SSFClubDetail {
  const byDados = new Map<string, CsvRow>();
  for (const r of rows) {
    const key = r["Dados"]?.trim();
    if (key) byDados.set(key, r);
  }

  const col = club.csvColumn;
  const receitasRelevantes = getVal(byDados.get(SSF_KEYS.receitasRelevantes), col);
  const despesasRelevantes = getVal(byDados.get(SSF_KEYS.despesasRelevantes), col);
  const exclusoes = getVal(byDados.get(SSF_KEYS.exclusoes), col);
  const contribuicoes = getVal(byDados.get(SSF_KEYS.contribuicoes), col);
  const resultadoOperacional = getVal(byDados.get(SSF_KEYS.reqSustentabilidade), col);
  const custoElenco = getVal(byDados.get(SSF_KEYS.custoElenco), col);
  const financiamentoElenco = getVal(byDados.get(SSF_KEYS.financiamentoElenco), col);
  const indicadorCusto = getVal(byDados.get(SSF_KEYS.reqCustoElenco), col);
  const olcp = getVal(byDados.get(SSF_KEYS.olcp), col);
  const indicadorEndividamento = getVal(byDados.get(SSF_KEYS.reqEndividamento), col);

  return {
    clubName: club.name,
    receitasRelevantes,
    despesasRelevantes,
    exclusoes,
    contribuicoes,
    resultadoOperacional,
    custoElenco,
    financiamentoElenco,
    indicadorCusto,
    olcp,
    receitasRelevantesEndiv: receitasRelevantes,
    indicadorEndividamento,
  };
}

export { getIconUrl };
