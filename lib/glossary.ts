import { conceptDefinitions } from "@/lib/concept-notes";

/** Definitions for the 14 new glossary terms not already in concept-notes.ts. */
const newDefinitions: Record<string, string> = {
  "Receita c/ Transmissão + Premiações":
    "Soma das receitas com Direitos de Transmissão (TV) e Premiações esportivas (CBF, Conmebol e demais). Compõe a Receita da Atividade Esportiva.",
  "Receita c/ Match-Day + Sócio-Torcedor":
    "Soma das receitas de Match-Day (bilheteria, hospitalidade e demais receitas de jogo) e do programa Sócio-Torcedor. Compõe a Receita da Atividade Esportiva.",
  "Receita c/ Negociação de atletas":
    "Receita obtida com a venda definitiva ou cessão de direitos econômicos de atletas. Não compõe a Receita da Atividade Esportiva, mas integra a Receita Operacional.",
  "Custo da Atividade Esportiva":
    "Soma da Folha do Futebol (Salários, Encargos e Direitos de Imagem), das despesas com a operação do departamento de futebol, da Amortização do custo de aquisição de atletas e dos demais custos diretos da atividade esportiva.",
  "Resultado Operacional (Segmento Futebol)":
    "Resultado do segmento de futebol, equivalente a Receita da Atividade Esportiva − Custo da Atividade Esportiva. Não considera receitas e despesas não-operacionais nem o resultado da venda de atletas.",
  "Resultado":
    "Resultado do exercício — lucro ou prejuízo do clube/SAF após todas as receitas, custos, despesas (operacionais e financeiras), resultado da venda de atletas e impostos.",
  "Folha do Futebol + Amortização":
    "Folha do Futebol (Salários, Encargos e Direitos de Imagem) + Amortização do custo de aquisição de atletas (parcela do contrato de cada jogador reconhecida como despesa no período).",
  "Folha do Futebol + Compra de Jogadores":
    "Folha do Futebol (Salários, Encargos e Direitos de Imagem) + Aquisições de atletas no período. Aproxima o total comprometido com o elenco no exercício.",
  "Aquisições de atletas":
    "Valor comprometido com a compra de direitos federativos e/ou econômicos de atletas no exercício.",
  "Pontuação Série A":
    "Pontos conquistados pelo clube na temporada do Campeonato Brasileiro Série A.",
  "Dívida / Receita Total":
    "Razão entre Dívida Líquida e Receita Operacional. Indica quantos anos de Receita Operacional seriam necessários para quitar a Dívida Líquida.",
  "Folha do Futebol / Receita Total":
    "Razão entre Folha do Futebol e Receita Operacional. Mede o peso da folha de atletas sobre as receitas do clube.",
  "(Folha do Futebol + Amortização) / Receita Total":
    "Razão entre Folha do Futebol + Amortização do custo de aquisição de atletas e Receita Operacional.",
  "Custo da Atividade Esportiva / Receita Total":
    "Razão entre Custo da Atividade Esportiva e Receita Operacional. Mede o peso do custo total da operação esportiva sobre as receitas do clube.",
};

/** All 20 term definitions — existing 6 imported verbatim + 14 new. */
export const allDefinitions: Record<string, string> = {
  ...conceptDefinitions,
  ...newDefinitions,
};

export interface GlossaryGroup {
  id: string;
  label: string;
  terms: string[];
}

/** Five groups, in display order. Each `terms` array is in display order. */
export const glossaryGroups: GlossaryGroup[] = [
  {
    id: "receitas-resultados",
    label: "Receitas e Resultados",
    terms: [
      "Receita Operacional",
      "Receita Operacional Líquida",
      "Receita da Atividade Esportiva",
      "Receita Comercial",
      "Receita c/ Transmissão + Premiações",
      "Receita c/ Match-Day + Sócio-Torcedor",
      "Receita c/ Negociação de atletas",
      "Resultado Operacional (Segmento Futebol)",
      "Resultado",
    ],
  },
  {
    id: "custos-folha-investimento",
    label: "Custos, Folha e Investimento em Atletas",
    terms: [
      "Custo da Atividade Esportiva",
      "Folha do Futebol",
      "Folha do Futebol + Amortização",
      "Folha do Futebol + Compra de Jogadores",
      "Aquisições de atletas",
    ],
  },
  {
    id: "endividamento",
    label: "Endividamento",
    terms: ["Dívida Líquida"],
  },
  {
    id: "indicadores-gerenciais",
    label: "Indicadores Gerenciais (Razões)",
    terms: [
      "Dívida / Receita Total",
      "Folha do Futebol / Receita Total",
      "(Folha do Futebol + Amortização) / Receita Total",
      "Custo da Atividade Esportiva / Receita Total",
    ],
  },
  {
    id: "metricas-esportivas",
    label: "Métricas Esportivas",
    terms: ["Pontuação Série A"],
  },
];

/** Produce a stable URL anchor id for a term. Lowercase, accents stripped, non-alphanumerics → "-". */
export function slugifyTerm(term: string): string {
  return term
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
