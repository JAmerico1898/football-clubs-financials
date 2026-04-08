export const METRIC_COLORS: Record<string, string> = {
  'Receita Operacional':                    '#1565C0',
  'Receita da Atividade Esportiva':         '#2E7D32',
  'Receita c/ Transmissão + Premiações':    '#6A1B9A',
  'Receita Comercial':                      '#E65100',
  'Receita c/ Match-Day + Sócio-Torcedor': '#00838F',
  'Custo da Atividade Esportiva':           '#C62828',
  'Folha do Futebol':                       '#4E342E',
  'Folha do Futebol + Compra de Jogadores': '#37474F',
};

export const ALL_METRICS = Object.keys(METRIC_COLORS);

export const DEFAULT_METRICS = [
  'Receita da Atividade Esportiva',
  'Custo da Atividade Esportiva',
];

export const MAX_SELECTED = 3;
export const MIN_SELECTED = 1;
