/** Definitions for financial concepts that may not be obvious to users. */
export const conceptDefinitions: Record<string, string> = {
  "Receita da Atividade Esportiva":
    "Receita Operacional Líquida, contemplando Direitos de Transmissão, Premiações, Match-Day, Sócio-Torcedor, Publicidade e Patrocínio, Licenciamento da Marca e afins.",
  "Receita Operacional":
    "Receita Operacional Líquida + Receita de Venda de Jogadores, onde Receita Operacional Líquida: Receita da Atividade Esportiva, contemplando Direitos de Transmissão, Premiações, Match-Day, Sócio-Torcedor, Publicidade e Patrocínio, Licenciamento da Marca e afins.",
  "Receita Operacional Líquida":
    "Receita da Atividade Esportiva, contemplando Direitos de Transmissão, Premiações, Match-Day, Sócio-Torcedor, Publicidade e Patrocínio, Licenciamento da Marca e afins.",
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
