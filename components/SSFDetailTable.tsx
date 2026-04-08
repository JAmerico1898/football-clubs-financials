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

  /**
   * Given a parent total and its sub-item raw values, find the sign assignment
   * (+1 or -1) for each sub-item so that the signed sum matches the parent.
   * Tries all 2^n combinations (n = non-zero items, capped at 15).
   */
  const inferSigns = (parentTotal: number, rawValues: number[]): number[] => {
    const defaults = rawValues.map(() => 1);
    if (isNaN(parentTotal)) return defaults;

    const active = rawValues
      .map((v, i) => ({ v, i }))
      .filter((x) => !isNaN(x.v) && x.v !== 0);
    const n = active.length;
    if (n === 0 || n > 15) return defaults;

    for (let mask = 0; mask < 1 << n; mask++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += mask & (1 << j) ? -active[j].v : active[j].v;
      }
      if (Math.abs(sum - parentTotal) < 0.5) {
        const signs = [...defaults];
        for (let j = 0; j < n; j++) {
          if (mask & (1 << j)) signs[active[j].i] = -1;
        }
        return signs;
      }
    }
    return defaults;
  };

  type SubKey = [string, string]; // [item, dados]

  /** Build a signed sub-metric group: infer signs from parent total, return display helpers. */
  const buildGroup = (parentTotal: number, keys: SubKey[]) => {
    const rawValues = keys.map(([item, dados]) => lookup(item, dados));
    const signs = inferSigns(parentTotal, rawValues);
    return keys.map((_key, i) => {
      const signed = isNaN(rawValues[i]) ? rawValues[i] : rawValues[i] * signs[i];
      return { value: fmtBRL(signed), negative: isNeg(signed) };
    });
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

          {(() => {
            const recRelKeys: SubKey[] = [
              ["Receitas Operacionais", "Receitas Operacionais"],
              ["Receitas Financeiras", "Receitas Financeiras"],
              ["Receitas com Transferências de Atletas.", "Receitas com Transferências de Atletas"],
              ["Ajustes e Deduções da Receita Relevante", "Ajustes e Deduções da Receita Relevante"],
            ];
            const recRelLabels = [
              "Receitas Operacionais",
              "Receitas Financeiras",
              "Receitas com Transferências de Atletas",
              "Ajustes e Deduções da Receita Relevante",
            ];
            const recRel = buildGroup(d.receitasRelevantes, recRelKeys);
            return (
              <>
                <MetricRow label="Receitas Relevantes" value={fmtBRL(d.receitasRelevantes)} negative={isNeg(d.receitasRelevantes)} />
                {recRel.map((props, i) => (
                  <SubMetricRow key={recRelLabels[i]} label={recRelLabels[i]} {...props} />
                ))}
              </>
            );
          })()}

          {(() => {
            const despRelKeys: SubKey[] = [
              ["Despesas Operacionais", "Despesas Operacionais"],
              ["Amortizações, imparidade e custos de registros de atletas", "Amortizações, imparidade e custos de registros de atletas"],
              ["Baixa de registro de atletas", "Baixa de registro de atletas"],
              ["Despesas Financeiras", "Despesas Financeiras"],
              ["Provisão para devedores duvidosos", "Provisão para devedores duvidosos"],
              ["Dividendos", "Dividendos"],
              ["Descontos das despesas", "Descontos das despesas"],
            ];
            const despRelLabels = [
              "Despesas Operacionais",
              "Amortizações, imparidade e custos de registros de atletas",
              "Baixa de registro de atletas",
              "Despesas Financeiras",
              "Provisão para devedores duvidosos",
              "Dividendos",
              "Descontos das despesas",
            ];
            const despRel = buildGroup(d.despesasRelevantes, despRelKeys);
            return (
              <>
                <MetricRow label="Despesas Relevantes" value={fmtBRL(d.despesasRelevantes)} negative={isNeg(d.despesasRelevantes)} />
                {despRel.map((props, i) => (
                  <SubMetricRow key={despRelLabels[i]} label={despRelLabels[i]} {...props} />
                ))}
              </>
            );
          })()}

          {(() => {
            const exclKeys: SubKey[] = [
              ["Exclusões do Resultado da Operação", "(+) Ganho ou (-) Perda com ativos imobilizados"],
              ["Exclusões do Resultado da Operação", "(+) Ganho ou (-) Perda com Ativos Intangíveis"],
              ["Exclusões do Resultado da Operação", "(+) Ganhos ou (-) Perdas Diversos"],
              ["Exclusões do Resultado da Operação", "Impostos sobre o lucro (IRPJ e CSLL)"],
            ];
            const exclLabels = [
              "(+) Ganho ou (-) Perda com ativos imobilizados",
              "(+) Ganho ou (-) Perda com Ativos Intangíveis",
              "(+) Ganhos ou (-) Perdas Diversos",
              "Impostos sobre o lucro (IRPJ e CSLL)",
            ];
            const excl = buildGroup(d.exclusoes, exclKeys);
            return (
              <>
                <MetricRow label="Exclusões do Resultado da Operação" value={fmtBRL(d.exclusoes)} negative={isNeg(d.exclusoes)} />
                {excl.map((props, i) => (
                  <SubMetricRow key={exclLabels[i]} label={exclLabels[i]} {...props} />
                ))}
              </>
            );
          })()}

          {(() => {
            const contribKeys: SubKey[] = [
              ["Contribuições Patrimoniais", "Aportes de capital feitos pelo acionista"],
              ["Contribuições Patrimoniais", "Doações incondicionais ou renúncia de obrigação"],
              ["Contribuições Patrimoniais", "Conversão de dívida em capital"],
            ];
            const contribLabels = [
              "Aportes de capital feitos pelo acionista",
              "Doações incondicionais ou renúncia de obrigação",
              "Conversão de dívida em capital",
            ];
            const contrib = buildGroup(d.contribuicoes, contribKeys);
            return (
              <>
                <MetricRow label="Contribuições Patrimoniais" value={fmtBRL(d.contribuicoes)} negative={isNeg(d.contribuicoes)} />
                {contrib.map((props, i) => (
                  <SubMetricRow key={contribLabels[i]} label={contribLabels[i]} {...props} />
                ))}
              </>
            );
          })()}

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

          {(() => {
            const custoKeys: SubKey[] = [
              ["Custo com Elenco de um Clube", "Salários, Encargos, Benefícios, Direitos de Imagem"],
              ["Custo com Elenco de um Clube", "Amortizações de direitos (compra de jogadores) e custo de registro"],
              ["Custo com Elenco de um Clube", "Custos com agentes e intermediários"],
            ];
            const custoLabels = [
              "Salários, Encargos, Benefícios, Direitos de Imagem",
              "Amortizações de direitos (compra de jogadores) e custo de registro",
              "Custos com agentes e intermediários",
            ];
            const custo = buildGroup(d.custoElenco, custoKeys);
            return (
              <>
                <MetricRow label="Custo com Elenco" value={fmtBRL(d.custoElenco)} negative={isNeg(d.custoElenco)} />
                {custo.map((props, i) => (
                  <SubMetricRow key={custoLabels[i]} label={custoLabels[i]} {...props} />
                ))}
              </>
            );
          })()}

          {(() => {
            const finKeys: SubKey[] = [
              ["Financiamento do Elenco de um clube", "Receita Operacional"],
              ["Financiamento do Elenco de um clube", "Resultado Líquido Médio de Transferências (RLMT)"],
              ["Financiamento do Elenco de um clube", "Contribuições Patrimoniais"],
            ];
            const finLabels = [
              "Receita Operacional",
              "Resultado Líquido Médio de Transferências (RLMT)",
              "Contribuições Patrimoniais",
            ];
            const fin = buildGroup(d.financiamentoElenco, finKeys);
            return (
              <>
                <MetricRow label="Financiamento do Elenco" value={fmtBRL(d.financiamentoElenco)} negative={isNeg(d.financiamentoElenco)} />
                {fin.map((props, i) => (
                  <SubMetricRow key={finLabels[i]} label={finLabels[i]} {...props} />
                ))}
              </>
            );
          })()}

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

          {(() => {
            const olcpKeys: SubKey[] = [
              ["Obrigações Líquidas de Curto Prazo (OLCP)", "OGCP - Obrigações gerais de curto prazo"],
              ["Obrigações Líquidas de Curto Prazo (OLCP)", "OT - Obrigações de Transferência"],
              ["Obrigações Líquidas de Curto Prazo (OLCP)", "ALCP - Ativos líquidos de curto prazo"],
            ];
            const olcpLabels = [
              "OGCP - Obrigações gerais de curto prazo",
              "OT - Obrigações de Transferência",
              "ALCP - Ativos líquidos de curto prazo",
            ];
            const olcp = buildGroup(d.olcp, olcpKeys);
            return (
              <>
                <MetricRow label="Obrigações Líquidas de Curto Prazo" value={fmtBRL(d.olcp)} negative={isNeg(d.olcp)} />
                {olcp.map((props, i) => (
                  <SubMetricRow key={olcpLabels[i]} label={olcpLabels[i]} {...props} />
                ))}
              </>
            );
          })()}

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
