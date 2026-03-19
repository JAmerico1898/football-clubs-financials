"use client";

import type { SSFClubDetail } from "@/lib/ssf-clubs";

interface Props {
  detail: SSFClubDetail;
}

function fmtBRL(v: number): string {
  if (isNaN(v)) return "N/D";
  return `R$ ${Math.round(v)} mi`;
}

function fmtPct(v: number): string {
  if (isNaN(v)) return "N/D";
  return `${Math.round(v * 100)}%`;
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
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
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
        style={{ color: "var(--text-primary)" }}
      >
        {value}
      </td>
    </tr>
  );
}

export default function SSFDetailTable({ detail }: Props) {
  const d = detail;

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
          <MetricRow label="Receitas Relevantes" value={fmtBRL(d.receitasRelevantes)} />
          <MetricRow label="Despesas Relevantes" value={fmtBRL(d.despesasRelevantes)} />
          <MetricRow
            label="Exclusões do Resultado da Operação"
            value={fmtBRL(d.exclusoes)}
          />
          <MetricRow
            label="Contribuições Patrimoniais"
            value={fmtBRL(d.contribuicoes)}
          />
          <MetricRow
            label="Resultado Operacional"
            value={fmtBRL(d.resultadoOperacional)}
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
          <MetricRow label="Custo com Elenco" value={fmtBRL(d.custoElenco)} />
          <MetricRow
            label="Financiamento do Elenco"
            value={fmtBRL(d.financiamentoElenco)}
          />
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
          />
          <MetricRow
            label="Receitas Relevantes"
            value={fmtBRL(d.receitasRelevantesEndiv)}
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
