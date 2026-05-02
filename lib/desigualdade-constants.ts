export const CATEGORY_COLORS: Record<string, string> = {
  'Receita Operacional':                    '#1565C0',
  'Receita da Atividade Esportiva':         '#2E7D32',
  'Receita c/ Transmissão + Premiações':    '#6A1B9A',
  'Receita Comercial':                      '#E65100',
  'Receita c/ Match-Day + Sócio-Torcedor': '#00838F',
  'Custo da Atividade Esportiva':           '#C62828',
  'Folha do Futebol':                       '#4E342E',
  'Folha do Futebol + Compra de Jogadores': '#37474F',
  'Pontuação Série A':                      '#F9A825',
};

export const DEFAULT_CATEGORIES = [
  'Receita Operacional',
];

export const ALL_CATEGORIES = [
  'Receita Operacional',
  'Receita da Atividade Esportiva',
  'Receita c/ Transmissão + Premiações',
  'Receita Comercial',
  'Receita c/ Match-Day + Sócio-Torcedor',
  'Custo da Atividade Esportiva',
  'Folha do Futebol',
  'Folha do Futebol + Compra de Jogadores',
  'Pontuação Série A',
];

export const MAX_SELECTED = 3;

export const METRIC_LABELS = [
  'Índice de Gini',
  'Razão Max/Min',
  'Concentração C5 (Top 5)',
  'Concentração C3 (Top 3)',
] as const;
