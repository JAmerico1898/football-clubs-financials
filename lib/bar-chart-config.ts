export interface MetricDef {
  label: string;
  rowCurrent: number; // 0-based row index for current season data
  rowPrior: number;   // 0-based row index for prior season data
  category: "receita" | "despesa" | "resultado" | "passivo";
}

export const metrics: MetricDef[] = [
  // Receita (green)
  { label: "Receita Operacional", rowCurrent: 0, rowPrior: 37, category: "receita" },
  { label: "Receita Recorrente", rowCurrent: 1, rowPrior: 38, category: "receita" },
  { label: "Transmissão + Premiações", rowCurrent: 2, rowPrior: 39, category: "receita" },
  { label: "Receita Comercial", rowCurrent: 3, rowPrior: 40, category: "receita" },
  { label: "Match-Day + Sócio-Torcedor", rowCurrent: 4, rowPrior: 41, category: "receita" },
  { label: "Negociação de Atletas", rowCurrent: 5, rowPrior: 42, category: "receita" },
  // Despesa (red)
  { label: "Custo das Atividades Esportivas", rowCurrent: 9, rowPrior: 46, category: "despesa" },
  { label: "Folha do Futebol", rowCurrent: 6, rowPrior: 43, category: "despesa" },
  { label: "Folha + Amortização", rowCurrent: 7, rowPrior: 44, category: "despesa" },
  { label: "Aquisições de Atletas", rowCurrent: 16, rowPrior: 53, category: "despesa" },
  // Resultado (blue)
  { label: "Resultado Operacional", rowCurrent: 10, rowPrior: 47, category: "resultado" },
  { label: "Resultado", rowCurrent: 11, rowPrior: 48, category: "resultado" },
  // Passivo (orange)
  { label: "Dívida Líquida", rowCurrent: 12, rowPrior: 49, category: "passivo" },
];

export const categoryColors: Record<string, { dark: string; light: string }> = {
  receita: { dark: "#2E7D32", light: "#81C784" },
  despesa: { dark: "#C62828", light: "#EF9A9A" },
  resultado: { dark: "#1565C0", light: "#90CAF9" },
  passivo: { dark: "#E65100", light: "#FFCC80" },
};
