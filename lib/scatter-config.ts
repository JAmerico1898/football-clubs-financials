import { metrics, Metric } from "./metric-config";

const xAxisKeys = [
  "Receita Total",
  "Custo das Atividades Esportivas",
  "Folha do Futebol",
  "Folha do Futebol + Compra de Jogadores",
  "Aquisições de atletas",
  "Capacidade do estádio",
  "Dívida Líquida",
  "Valor do Elenco (€ milhões)",
  "Resultado",
];

const yAxisKeys = [
  "Pontuação Série A",
  "Valor do Elenco (€ milhões)",
  "Bilheteria média Série A (R$ mil/jogo)",
  "Receita c/ Match-Day + Sócio-Torcedor",
];

export const xAxisMetrics: Metric[] = xAxisKeys
  .map((key) => metrics.find((m) => m.csvKey === key)!)
  .filter(Boolean);

export const yAxisMetrics: Metric[] = yAxisKeys
  .map((key) => metrics.find((m) => m.csvKey === key)!)
  .filter(Boolean);

/** Map csvKey → axis title with unit when relevant */
const axisUnitMap: Record<string, string> = {
  "Receita Total": "Receita Total (R$ milhões)",
  "Custo das Atividades Esportivas": "Custo das Atividades Esportivas (R$ milhões)",
  "Folha do Futebol": "Folha do Futebol (R$ milhões)",
  "Folha do Futebol + Compra de Jogadores": "Folha do Futebol + Compra de Jogadores (R$ milhões)",
  "Aquisições de atletas": "Aquisições de atletas (R$ milhões)",
  "Dívida Líquida": "Dívida Líquida (R$ milhões)",
  "Resultado": "Resultado (R$ milhões)",
  "Valor do Elenco (€ milhões)": "Valor do Elenco (€ milhões)",
  "Receita c/ Match-Day + Sócio-Torcedor": "Receita c/ Match-Day + Sócio-Torcedor (R$ milhões)",
  "Bilheteria média Série A (R$ mil/jogo)": "Bilheteria média Série A (R$ mil/jogo)",
  "Capacidade do estádio": "Capacidade do estádio",
  "Pontuação Série A": "Pontuação Série A",
};

export function getAxisTitle(metric: Metric): string {
  return axisUnitMap[metric.csvKey] ?? metric.label;
}
