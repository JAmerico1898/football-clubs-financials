/** Definitions for financial concepts that may not be obvious to users. */
export const conceptDefinitions: Record<string, string> = {
  "Receita Recorrente":
    "Receita Operacional − Receita c/ Negociação de Atletas.",
  "Receita Operacional":
    "Rec. Direitos de Transmissão + Rec. Premiações + Rec. Match-Day + Rec. Sócio-Torcedor + Rec. Publicidade e Patrocínio + Rec. Licenciamento da Marca + Rec. Negociação de Atletas + Outras Receitas.",
  "Receita Comercial":
    "Rec. Publicidade e Patrocínio + Rec. Licenciamento da Marca.",
  "Dívida Líquida":
    "PC + PNC − (Caixa + Equivalentes de caixa) − Depósitos judiciais − Receitas diferidas − Contas a receber por vendas de atletas.",
  "Folha do Futebol":
    "Despesas com Salários e Encargos de Atletas + Despesas com Direitos de Imagem.",
};

/**
 * Given a list of active metric labels/csvKeys, returns matching concept
 * entries (concept name → definition) that should be displayed as notes.
 */
export function getMatchingConcepts(metricKeys: string[]): [string, string][] {
  const matched: [string, string][] = [];
  const seen = new Set<string>();

  for (const key of metricKeys) {
    for (const [concept, definition] of Object.entries(conceptDefinitions)) {
      if (!seen.has(concept) && key.includes(concept)) {
        seen.add(concept);
        matched.push([concept, definition]);
      }
    }
  }

  return matched;
}
