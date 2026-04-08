export interface MetricDef {
  label: string;   // Display label in chart (short, user-facing)
  csvKey: string;  // Exact match for "Dados" column in Índices CSV
  category: "receita" | "despesa" | "resultado" | "passivo";
}

export const metrics: MetricDef[] = [
  // Receita (green)
  { label: "Receita Operacional",             csvKey: "Receita Operacional",                      category: "receita" },
  { label: "Receita da Atividade Esportiva",  csvKey: "Receita da Atividade Esportiva",           category: "receita" },
  { label: "Transmissão + Premiações",        csvKey: "Receita c/ Transmissão + Premiações",      category: "receita" },
  { label: "Receita Comercial",               csvKey: "Receita Comercial",                        category: "receita" },
  { label: "Match-Day + Sócio-Torcedor",      csvKey: "Receita c/ Match-Day + Sócio-Torcedor",   category: "receita" },
  { label: "Negociação de Atletas",           csvKey: "Receita c/ Negociação de atletas",         category: "receita" },
  // Despesa (red)
  { label: "Custo da Atividade Esportiva", csvKey: "Custo da Atividade Esportiva",             category: "despesa" },
  { label: "Folha do Futebol",               csvKey: "Folha do Futebol",                          category: "despesa" },
  { label: "Folha + Amortização",            csvKey: "Folha do Futebol + Amortização",            category: "despesa" },
  { label: "Aquisições de Atletas",          csvKey: "Aquisições de atletas",                     category: "despesa" },
  // Resultado (blue)
  { label: "Resultado Operacional",          csvKey: "Resultado Operacional (Segmento Futebol)",  category: "resultado" },
  { label: "Resultado",                      csvKey: "Resultado",                                 category: "resultado" },
  // Passivo (orange)
  { label: "Dívida Líquida",                csvKey: "Dívida Líquida",                             category: "passivo" },
];

export const categoryColors: Record<string, { dark: string; light: string }> = {
  receita: { dark: "#2E7D32", light: "#81C784" },
  despesa: { dark: "#C62828", light: "#EF9A9A" },
  resultado: { dark: "#1565C0", light: "#90CAF9" },
  passivo: { dark: "#E65100", light: "#FFCC80" },
};
