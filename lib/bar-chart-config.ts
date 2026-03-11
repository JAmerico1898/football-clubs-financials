export interface MetricDef {
  label: string;
  row2024: number; // 0-based row index in CSV (excluding header)
  row2023: number;
  category: "receita" | "despesa" | "resultado" | "passivo";
}

export const metrics: MetricDef[] = [
  // Receita (green)
  { label: "Receita Total", row2024: 0, row2023: 37, category: "receita" },
  { label: "Receita Recorrente", row2024: 1, row2023: 38, category: "receita" },
  { label: "Transmissão + Premiações", row2024: 2, row2023: 39, category: "receita" },
  { label: "Receita Comercial", row2024: 3, row2023: 40, category: "receita" },
  { label: "Match-Day + Sócio-Torcedor", row2024: 4, row2023: 41, category: "receita" },
  { label: "Negociação de Atletas", row2024: 5, row2023: 42, category: "receita" },
  // Despesa (red)
  { label: "Custo das Atividades Esportivas", row2024: 9, row2023: 46, category: "despesa" },
  { label: "Folha do Futebol", row2024: 6, row2023: 43, category: "despesa" },
  { label: "Folha + Amortização", row2024: 7, row2023: 44, category: "despesa" },
  { label: "Aquisições de Atletas", row2024: 16, row2023: 53, category: "despesa" },
  // Resultado (blue)
  { label: "Resultado Operacional", row2024: 10, row2023: 47, category: "resultado" },
  { label: "Resultado", row2024: 11, row2023: 48, category: "resultado" },
  // Passivo (orange)
  { label: "Dívida Líquida", row2024: 12, row2023: 49, category: "passivo" },
];

export const categoryColors: Record<string, { dark: string; light: string }> = {
  receita: { dark: "#2E7D32", light: "#81C784" },
  despesa: { dark: "#C62828", light: "#EF9A9A" },
  resultado: { dark: "#1565C0", light: "#90CAF9" },
  passivo: { dark: "#E65100", light: "#FFCC80" },
};
