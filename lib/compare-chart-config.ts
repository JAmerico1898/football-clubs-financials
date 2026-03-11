export interface CompareMetric {
  label: string;
  csvKey: string;
  category: "receita" | "despesa" | "resultado" | "passivo";
}

export const compareMetrics: CompareMetric[] = [
  // Receita
  { label: "Receita Total", csvKey: "Receita Total", category: "receita" },
  { label: "Receita Recorrente", csvKey: "Receita Recorrente", category: "receita" },
  { label: "Transmissão + Premiações", csvKey: "Receita c/ Transmissão + Premiações", category: "receita" },
  { label: "Receita Comercial", csvKey: "Receita Comercial", category: "receita" },
  { label: "Match-Day + Sócio-Torcedor", csvKey: "Receita c/ Match-Day + Sócio-Torcedor", category: "receita" },
  { label: "Negociação de Atletas", csvKey: "Receita c/ Negociação de atletas", category: "receita" },
  // Despesa
  { label: "Custo das Atividades Esportivas", csvKey: "Custo das Atividades Esportivas", category: "despesa" },
  { label: "Folha do Futebol", csvKey: "Folha do Futebol", category: "despesa" },
  { label: "Folha + Amortização", csvKey: "Folha do Futebol + Amortização", category: "despesa" },
  { label: "Aquisições de Atletas", csvKey: "Aquisições de atletas", category: "despesa" },
  // Resultado
  { label: "Resultado Operacional", csvKey: "Resultado Operacional (Segmento Futebol)", category: "resultado" },
  { label: "Resultado", csvKey: "Resultado", category: "resultado" },
  // Passivo
  { label: "Dívida Líquida", csvKey: "Dívida Líquida", category: "passivo" },
];
