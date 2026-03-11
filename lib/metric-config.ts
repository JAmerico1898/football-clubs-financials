export interface Metric {
  label: string;
  csvKey: string;
  group: "financeiras" | "esportivas" | "gerenciais";
  format: "currency" | "percent" | "ratio" | "integer" | "decimal" | "euro";
  inverse?: boolean; // true = lower is better (sort ascending)
}

export const metrics: Metric[] = [
  // Financeiras
  { label: "Receita Total", csvKey: "Receita Total", group: "financeiras", format: "currency" },
  { label: "Receita Recorrente", csvKey: "Receita Recorrente", group: "financeiras", format: "currency" },
  { label: "Receita c/ Transmissão + Premiações", csvKey: "Receita c/ Transmissão + Premiações", group: "financeiras", format: "currency" },
  { label: "Receita Comercial", csvKey: "Receita Comercial", group: "financeiras", format: "currency" },
  { label: "Receita c/ Match-Day + Sócio-Torcedor", csvKey: "Receita c/ Match-Day + Sócio-Torcedor", group: "financeiras", format: "currency" },
  { label: "Receita c/ Negociação de atletas", csvKey: "Receita c/ Negociação de atletas", group: "financeiras", format: "currency" },
  { label: "Custo das Atividades Esportivas", csvKey: "Custo das Atividades Esportivas", group: "financeiras", format: "currency" },
  { label: "Resultado Operacional (Segmento Futebol)", csvKey: "Resultado Operacional (Segmento Futebol)", group: "financeiras", format: "currency" },
  { label: "Resultado", csvKey: "Resultado", group: "financeiras", format: "currency" },
  { label: "Dívida Líquida", csvKey: "Dívida Líquida", group: "financeiras", format: "currency", inverse: true },

  // Esportivas
  { label: "Folha do Futebol", csvKey: "Folha do Futebol", group: "esportivas", format: "currency" },
  { label: "Folha do Futebol + Compra de Jogadores", csvKey: "Folha do Futebol + Compra de Jogadores", group: "esportivas", format: "currency" },
  { label: "Aquisições de atletas", csvKey: "Aquisições de atletas", group: "esportivas", format: "currency" },
  { label: "Público médio (mandante)", csvKey: "Público médio (mandante)", group: "esportivas", format: "integer" },
  { label: "% Ocupação", csvKey: "% Ocupação", group: "esportivas", format: "percent" },
  { label: "Capacidade do estádio", csvKey: "Capacidade do estádio", group: "esportivas", format: "integer" },
  { label: "Bilheteria Série A (R$ milhões)", csvKey: "Bilheteria Série A (R$ milhões)", group: "esportivas", format: "currency" },
  { label: "Bilheteria média Série A (R$ mil/jogo)", csvKey: "Bilheteria média Série A (R$ mil/jogo)", group: "esportivas", format: "decimal" },
  { label: "Pontuação Série A", csvKey: "Pontuação Série A", group: "esportivas", format: "integer" },
  { label: "Sócios-Torcedores", csvKey: "Sócios-Torcedores", group: "esportivas", format: "integer" },
  { label: "Valor do Elenco (€ milhões)", csvKey: "Valor do Elenco (€ milhões)", group: "esportivas", format: "euro" },

  // Gerenciais
  { label: "Público Médio / Sócios-Torcedores", csvKey: "Público Médio / Sócios-Torcedores", group: "gerenciais", format: "ratio" },
  { label: "Dívida/Receita Total", csvKey: "Dívida/Receita Total", group: "gerenciais", format: "ratio", inverse: true },
  { label: "Folha do futebol / Receita Total", csvKey: "Folha do futebol / Receita Total", group: "gerenciais", format: "ratio" },
  { label: "(Folha futebol + Amortização)/ Receita Total", csvKey: "(Folha futebol + Amortização)/ Receita Total", group: "gerenciais", format: "ratio" },
  { label: "Folha do Futebol / Pontuação Série A", csvKey: "Folha do Futebol / Pontuação Série A", group: "gerenciais", format: "ratio" },
  { label: "Custo das Atividades Esportivas / Receita Total", csvKey: "Custo das Atividades Esportivas / Receita Total", group: "gerenciais", format: "ratio" },
  { label: "Ticket Médio", csvKey: "Ticket Médio", group: "gerenciais", format: "decimal" },
];

const historicalMetricKeys = new Set([
  "Receita Total",
  "Receita Recorrente",
  "Receita c/ Transmissão + Premiações",
  "Receita Comercial",
  "Receita c/ Match-Day + Sócio-Torcedor",
  "Receita c/ Negociação de atletas",
  "Folha do Futebol",
  "Folha do Futebol + Amortização",
  "Folha do Futebol + Compra de Jogadores",
  "Custo das Atividades Esportivas",
  "Resultado Operacional (Segmento Futebol)",
  "Resultado",
  "Dívida Líquida",
  "Aquisições de atletas",
  "Pontuação Série A",
]);

export function hasHistoricalData(metric: Metric): boolean {
  return historicalMetricKeys.has(metric.csvKey);
}

export function formatValue(value: number, format: Metric["format"]): string {
  if (value == null || isNaN(value)) return "–";

  switch (format) {
    case "currency":
      return value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    case "percent":
      return (value * 100).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "%";
    case "ratio":
      return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    case "integer":
      return Math.round(value).toLocaleString("pt-BR");
    case "decimal":
      return value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    case "euro":
      return "€ " + value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    default:
      return String(value);
  }
}

/** Y-axis formatter: integers by default, 1 decimal for small percentages */
export function formatAxisValue(value: number, format: Metric["format"]): string {
  if (value == null || isNaN(value)) return "";

  switch (format) {
    case "currency":
      return Math.round(value).toLocaleString("pt-BR");
    case "percent": {
      const pct = value * 100;
      if (Math.abs(pct) < 10) {
        return pct.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "%";
      }
      return Math.round(pct).toLocaleString("pt-BR") + "%";
    }
    case "ratio":
      return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    case "integer":
      return Math.round(value).toLocaleString("pt-BR");
    case "decimal":
      return Math.round(value).toLocaleString("pt-BR");
    case "euro":
      return "€ " + Math.round(value).toLocaleString("pt-BR");
    default:
      return String(Math.round(value));
  }
}
