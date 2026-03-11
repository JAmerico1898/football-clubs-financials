"use client";

import { metrics } from "@/lib/metric-config";

interface MetricSelectorProps {
  value: string;
  onChange: (metricLabel: string) => void;
}

export default function MetricSelector({ value, onChange }: MetricSelectorProps) {
  const financeiras = metrics.filter((m) => m.group === "financeiras");
  const esportivas = metrics.filter((m) => m.group === "esportivas");
  const gerenciais = metrics.filter((m) => m.group === "gerenciais");

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-md text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Selecione uma métrica</option>
      <optgroup label="Financeiras">
        {financeiras.map((m) => (
          <option key={m.csvKey} value={m.csvKey}>
            {m.label}
          </option>
        ))}
      </optgroup>
      <optgroup label="Esportivas">
        {esportivas.map((m) => (
          <option key={m.csvKey} value={m.csvKey}>
            {m.label}
          </option>
        ))}
      </optgroup>
      <optgroup label="Gerenciais">
        {gerenciais.map((m) => (
          <option key={m.csvKey} value={m.csvKey}>
            {m.label}
          </option>
        ))}
      </optgroup>
    </select>
  );
}
