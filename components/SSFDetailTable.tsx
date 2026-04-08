"use client";

import { useMemo } from "react";
import type { SSFClubDetail } from "@/lib/ssf-clubs";
import type { CsvRow } from "@/hooks/useSSFData";

interface Props {
  detail: SSFClubDetail;
  rows: CsvRow[];
  csvColumn: string;
}

function fmtBRL(v: number): string {
  if (isNaN(v)) return "N/D";
  if (v < 0) return `(R$ ${Math.abs(Math.round(v))} mi)`;
  return `R$ ${Math.round(v)} mi`;
}

function fmtPct(v: number): string {
  if (isNaN(v)) return "N/D";
  if (v < 0) return `(${Math.abs(Math.round(v * 100))}%)`;
  return `${Math.round(v * 100)}%`;
}

function isNeg(v: number): boolean {
  return !isNaN(v) && v < 0;
}

function StatusCell({ ok }: { ok: boolean }) {
  return (
    <td
      className="px-4 py-2 text-center font-bold"
      style={{
        backgroundColor: ok ? "#E8F5E9" : "#FFEBEE",
        color: ok ? "#2E7D32" : "#C0392B",
      }}
    >
      {ok ? "✅ Conforme" : "❌ Não Conforme"}
    </td>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <tr>
      <td
        colSpan={3}
        className="px-4 py-2 font-bold text-white"
        style={{ backgroundColor: "#1565C0" }}
      >
        {label}
      </td>
    </tr>
  );
}

function MetricRow({
  label,
  value,
  negative,
  bold,
}: {
  label: string;
  value: string;
  negative?: boolean;
  bold?: boolean;
}) {
  const valueColor = negative ? "#C0392B" : "var(--text-primary)";
  return (
    <tr
      style={
        bold
          ? { backgroundColor: "rgba(21, 101, 192, 0.08)" }
          : undefined
      }
    >
      <td
        className="px-4 py-2"
        style={{ color: "var(--text-primary)" }}
      />
      <td
        className={`px-4 py-2 ${bold ? "font-bold" : ""}`}
        style={{ color: "var(--text-primary)" }}
      >
        {label}
      </td>
      <td
        className={`px-4 py-2 text-right ${bold ? "font-bold" : ""}`}
        style={{ color: valueColor }}
      >
        {value}
      </td>
    </tr>
  );
}

function SubMetricRow({
  label,
  value,
  negative,
}: {
  label: string;
  value: string;
  negative?: boolean;
}) {
  const valueColor = negative ? "#C0392B" : "var(--text-secondary)";
  return (
    <tr>
      <td className="px-4 py-1" />
      <td
        className="pl-8 pr-4 py-1 text-xs"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </td>
      <td
        className="px-4 py-1 text-right text-xs"
        style={{ color: valueColor }}
      >
        {value}
      </td>
    </tr>
  );
}

export default function SSFDetailTable({ detail, rows, csvColumn }: Props) {
  const d = detail;

  const lookup = useMemo(() => {
    const map = new Map<string, CsvRow>();
    for (const r of rows) {
      const item = r["Item"]?.trim() ?? "";
      const dados = r["Dados"]?.trim() ?? "";
      if (dados) map.set(`${item}||${dados}`, r);
    }
    return (item: string, dados: string): number => {
      const row = map.get(`${item}||${dados}`);
      if (!row) return NaN;
      const raw = row[csvColumn]?.trim();
      if (!raw || raw === "") return NaN;
      return parseFloat(raw);
    };
  }, [rows, csvColumn]);

  const sub = (item: string, dados: string) => {
    const val = lookup(item, dados);
    return { value: fmtBRL(val), negative: isNeg(val) };
  };

  /** Like sub(), but negates the value (for deductions stored as positive in CSV). */
  const subNeg = (item: string, dados: string) => {
    const raw = lookup(item, dados);
    const val = isNaN(raw) ? raw : -Math.abs(raw);
    return { value: fmtBRL(val), negative: isNeg(val) };
  };

  return (
    <div className="overflow-x-auto card-surface !p-0">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr style={{ backgroundColor: "var(--brand-blue, #1565C0)" }}>
            <th
              className="px-4 py-2 text-white font-bold text-left"
              style={{ width: "30%" }}
            >
              Requisito
            </th>
            <th className="px-4 py-2 text-white font-bold text-left">
              Métrica
            </th>
            <th
              className="px-4 py-2 text-white font-bold text-right"
              style={{ width: "25%" }}
            >
              Valor
            </th>
          </tr>
        </thead>
        <tbody>
          {/* --- Req 1: Sustentabilidade --- */}
          <SectionHeader label="Req. Sustentabilidade" />

          <MetricRow label="Receitas Relevantes" value={fmtBRL(d.receitasRelevantes)} negative={isNeg(d.receitasRelevantes)} />
          <SubMetricRow label="Receitas Operacionais" {...sub("Receitas Operacionais", "Receitas Operacionais")} />
          <SubMetricRow label="Receitas Financeiras" {...sub("Receitas Financeiras", "Receitas Financeiras")} />
          <SubMetricRow label="Receitas com Transferências de Atletas" {...sub("Receitas com Transferências de Atletas.", "Receitas com Transferências de Atletas")} />
          <SubMetricRow label="Ajustes e Deduções da Receita Relevante" {...subNeg("Ajustes e Deduções da Receita Relevante", "Ajustes e Deduções da Receita Relevante")} />

          <MetricRow label="Despesas Relevantes" value={fmtBRL(d.despesasRelevantes)} negative={isNeg(d.despesasRelevantes)} />
          <SubMetricRow label="Despesas Operacionais" {...sub("Despesas Operacionais", "Despesas Operacionais")} />
          <SubMetricRow label="Amortizações, imparidade e custos de registros de atletas" {...sub("Amortizações, imparidade e custos de registros de atletas", "Amortizações, imparidade e custos de registros de atletas")} />
          <SubMetricRow label="Baixa de registro de atletas" {...sub("Baixa de registro de atletas", "Baixa de registro de atletas")} />
          <SubMetricRow label="Despesas Financeiras" {...sub("Despesas Financeiras", "Despesas Financeiras")} />
          <SubMetricRow label="Provisão para devedores duvidosos" {...sub("Provisão para devedores duvidosos", "Provisão para devedores duvidosos")} />
          <SubMetricRow label="Dividendos" {...sub("Dividendos", "Dividendos")} />
          <SubMetricRow label="Descontos das despesas" {...subNeg("Descontos das despesas", "Descontos das despesas")} />

          <MetricRow
            label="Exclusões do Resultado da Operação"
            value={fmtBRL(d.exclusoes)}
            negative={isNeg(d.exclusoes)}
          />
          <SubMetricRow label="(+) Ganho ou (-) Perda com ativos imobilizados" {...sub("Exclusões do Resultado da Operação", "(+) Ganho ou (-) Perda com ativos imobilizados")} />
          <SubMetricRow label="(+) Ganho ou (-) Perda com Ativos Intangíveis" {...sub("Exclusões do Resultado da Operação", "(+) Ganho ou (-) Perda com Ativos Intangíveis")} />
          <SubMetricRow label="(+) Ganhos ou (-) Perdas Diversos" {...sub("Exclusões do Resultado da Operação", "(+) Ganhos ou (-) Perdas Diversos")} />
          <SubMetricRow label="Impostos sobre o lucro (IRPJ e CSLL)" {...sub("Exclusões do Resultado da Operação", "Impostos sobre o lucro (IRPJ e CSLL)")} />

          <MetricRow
            label="Contribuições Patrimoniais"
            value={fmtBRL(d.contribuicoes)}
            negative={isNeg(d.contribuicoes)}
          />
          <SubMetricRow label="Aportes de capital feitos pelo acionista" {...sub("Contribuições Patrimoniais", "Aportes de capital feitos pelo acionista")} />
          <SubMetricRow label="Doações incondicionais ou renúncia de obrigação" {...sub("Contribuições Patrimoniais", "Doações incondicionais ou renúncia de obrigação")} />
          <SubMetricRow label="Conversão de dívida em capital" {...sub("Contribuições Patrimoniais", "Conversão de dívida em capital")} />

          <MetricRow
            label="Resultado Operacional"
            value={fmtBRL(d.resultadoOperacional)}
            negative={isNeg(d.resultadoOperacional)}
            bold
          />
          <tr>
            <td
              className="px-4 py-2"
              style={{ color: "var(--text-primary)" }}
            />
            <td
              className="px-4 py-2 font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Status
            </td>
            <StatusCell ok={!isNaN(d.resultadoOperacional) && d.resultadoOperacional >= 0} />
          </tr>

          {/* --- Req 2: Custo com Elenco --- */}
          <SectionHeader label="Req. Custo com Elenco" />

          <MetricRow label="Custo com Elenco" value={fmtBRL(d.custoElenco)} negative={isNeg(d.custoElenco)} />
          <SubMetricRow label="Salários, Encargos, Benefícios, Direitos de Imagem" {...sub("Custo com Elenco de um Clube", "Salários, Encargos, Benefícios, Direitos de Imagem")} />
          <SubMetricRow label="Amortizações de direitos (compra de jogadores) e custo de registro" {...sub("Custo com Elenco de um Clube", "Amortizações de direitos (compra de jogadores) e custo de registro")} />
          <SubMetricRow label="Custos com agentes e intermediários" {...sub("Custo com Elenco de um Clube", "Custos com agentes e intermediários")} />

          <MetricRow
            label="Financiamento do Elenco"
            value={fmtBRL(d.financiamentoElenco)}
            negative={isNeg(d.financiamentoElenco)}
          />
          <SubMetricRow label="Receita Operacional" {...sub("Financiamento do Elenco de um clube", "Receita Operacional")} />
          <SubMetricRow label="Resultado Líquido Médio de Transferências (RLMT)" {...sub("Financiamento do Elenco de um clube", "Resultado Líquido Médio de Transferências (RLMT)")} />
          <SubMetricRow label="Contribuições Patrimoniais" {...sub("Financiamento do Elenco de um clube", "Contribuições Patrimoniais")} />

          <MetricRow label="Indicador" value={fmtPct(d.indicadorCusto)} bold />
          <tr>
            <td className="px-4 py-2" style={{ color: "var(--text-primary)" }} />
            <td className="px-4 py-2 font-bold" style={{ color: "var(--text-primary)" }}>
              Status 2026 (≤90%)
            </td>
            <StatusCell ok={!isNaN(d.indicadorCusto) && d.indicadorCusto <= 0.9} />
          </tr>
          <tr>
            <td className="px-4 py-2" style={{ color: "var(--text-primary)" }} />
            <td className="px-4 py-2 font-bold" style={{ color: "var(--text-primary)" }}>
              Status 2027 (≤80%)
            </td>
            <StatusCell ok={!isNaN(d.indicadorCusto) && d.indicadorCusto <= 0.8} />
          </tr>
          <tr>
            <td className="px-4 py-2" style={{ color: "var(--text-primary)" }} />
            <td className="px-4 py-2 font-bold" style={{ color: "var(--text-primary)" }}>
              Status 2028 (≤70%)
            </td>
            <StatusCell ok={!isNaN(d.indicadorCusto) && d.indicadorCusto <= 0.7} />
          </tr>

          {/* --- Req 3: Endividamento --- */}
          <SectionHeader label="Req. Endividamento" />

          <MetricRow
            label="Obrigações Líquidas de Curto Prazo"
            value={fmtBRL(d.olcp)}
            negative={isNeg(d.olcp)}
          />
          <SubMetricRow label="OGCP - Obrigações gerais de curto prazo" {...sub("Obrigações Líquidas de Curto Prazo (OLCP)", "OGCP - Obrigações gerais de curto prazo")} />
          <SubMetricRow label="OT - Obrigações de Transferência" {...sub("Obrigações Líquidas de Curto Prazo (OLCP)", "OT - Obrigações de Transferência")} />
          <SubMetricRow label="ALCP - Ativos líquidos de curto prazo" {...subNeg("Obrigações Líquidas de Curto Prazo (OLCP)", "ALCP - Ativos líquidos de curto prazo")} />

          <MetricRow
            label="Receitas Relevantes"
            value={fmtBRL(d.receitasRelevantesEndiv)}
            negative={isNeg(d.receitasRelevantesEndiv)}
          />
          <MetricRow
            label="Indicador"
            value={fmtPct(d.indicadorEndividamento)}
            bold
          />
          <tr>
            <td className="px-4 py-2" style={{ color: "var(--text-primary)" }} />
            <td className="px-4 py-2 font-bold" style={{ color: "var(--text-primary)" }}>
              Status 2026 (≤70%)
            </td>
            <StatusCell ok={!isNaN(d.indicadorEndividamento) && d.indicadorEndividamento <= 0.7} />
          </tr>
          <tr>
            <td className="px-4 py-2" style={{ color: "var(--text-primary)" }} />
            <td className="px-4 py-2 font-bold" style={{ color: "var(--text-primary)" }}>
              Status 2027 (≤60%)
            </td>
            <StatusCell ok={!isNaN(d.indicadorEndividamento) && d.indicadorEndividamento <= 0.6} />
          </tr>
          <tr>
            <td className="px-4 py-2" style={{ color: "var(--text-primary)" }} />
            <td className="px-4 py-2 font-bold" style={{ color: "var(--text-primary)" }}>
              Status 2028 (≤50%)
            </td>
            <StatusCell ok={!isNaN(d.indicadorEndividamento) && d.indicadorEndividamento <= 0.5} />
          </tr>
          <tr>
            <td className="px-4 py-2" style={{ color: "var(--text-primary)" }} />
            <td className="px-4 py-2 font-bold" style={{ color: "var(--text-primary)" }}>
              Status 2029+ (≤45%)
            </td>
            <StatusCell ok={!isNaN(d.indicadorEndividamento) && d.indicadorEndividamento <= 0.45} />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
